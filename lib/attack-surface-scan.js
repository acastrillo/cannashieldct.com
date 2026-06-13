"use strict";

/**
 * Attack Surface Snapshot — passive recon + scoring engine.
 *
 * This is the single source of truth for the scan logic. It uses only native
 * `dns` and `fetch` (no puppeteer / chromium), so it is safe to import from a
 * Next.js API route (app/api/attack-surface/submit) AND from the deployed
 * Lambda (attack-surface-api-lambda.js, which adds Turnstile, Notion lead
 * capture, n8n, and the branded PDF report on top of this engine).
 *
 * Recon sources (all keyless except optional HIBP):
 *   - Shodan InternetDB (open ports / vulns)        internetdb.shodan.io
 *   - crt.sh certificate transparency (subdomains)  crt.sh
 *   - Have I Been Pwned breach directory             haveibeenpwned.com
 *   - DNS: SPF / DMARC / DKIM / MX                   (native dns)
 *   - HTTP security headers                          (HEAD request)
 */

const dns = require("dns").promises;

const HIBP_API_KEY = String(process.env.HIBP_API_KEY || "").trim();

const DKIM_SELECTORS = [
  "google", "selector1", "selector2", "default", "dkim", "mail", "s1", "s2", "k1",
  "mandrill", "smtpapi", "mta", "pm", "protonmail", "zoho", "zmail", "fm1", "fm2", "fm3",
];

const HIGH_RISK_PORTS = {
  21: "FTP",
  23: "Telnet",
  25: "SMTP",
  445: "SMB",
  1433: "MSSQL",
  1521: "Oracle DB",
  3306: "MySQL",
  3389: "RDP",
  5432: "PostgreSQL",
  5900: "VNC",
  6379: "Redis",
  27017: "MongoDB",
};

// Only these three trigger the +30 pts penalty per the spec
const HIGH_PENALTY_PORTS = new Set([23, 445, 3389]);

const SECURITY_HEADERS = [
  { name: "strict-transport-security", label: "HSTS", risk: "high" },
  { name: "x-frame-options", label: "X-Frame-Options", risk: "medium" },
  { name: "x-content-type-options", label: "X-Content-Type-Options", risk: "medium" },
  { name: "content-security-policy", label: "Content-Security-Policy", risk: "high" },
  { name: "referrer-policy", label: "Referrer-Policy", risk: "low" },
  { name: "permissions-policy", label: "Permissions-Policy", risk: "low" },
];

// --- Validation / normalization helpers ---

function normalizeDomain(value) {
  let domain = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^mailto:/, "")
    .replace(/\/.*$/, "")
    .replace(/^www\./, "");
  if (domain.includes("@")) domain = domain.split("@").pop();
  domain = domain.replace(/[^a-z0-9.-]/g, "");
  domain = domain.replace(/^\.+|\.+$/g, "");
  return domain;
}

function isValidDomain(domain) {
  if (!domain || domain.length > 253 || !domain.includes(".")) return false;
  return domain.split(".").every((label) => {
    return label.length > 0 && label.length <= 63 && /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function fetchWithTimeout(url, options, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

// --- DNS helpers ---

async function resolveIpv4(domain) {
  try {
    const addresses = await dns.resolve4(domain);
    return addresses[0] || null;
  } catch {
    return null;
  }
}

async function resolveTxtRaw(name) {
  try {
    const records = await dns.resolveTxt(name);
    return records
      .map((chunks) => (Array.isArray(chunks) ? chunks.join("") : String(chunks)))
      .filter(Boolean);
  } catch (err) {
    if (["ENODATA", "ENOTFOUND", "ETIMEOUT", "ESERVFAIL"].includes(err.code)) return [];
    return [];
  }
}

async function resolveTxtFollowingCname(name) {
  const direct = await resolveTxtRaw(name);
  if (direct.length) return { records: direct, cname: null };
  try {
    const cnames = await dns.resolveCname(name);
    for (const cname of cnames) {
      const records = await resolveTxtRaw(cname);
      if (records.length) return { records, cname };
    }
  } catch {
    // best-effort
  }
  return { records: [], cname: null };
}

async function resolveMx(domain) {
  try {
    return (await dns.resolveMx(domain)).sort((a, b) => a.priority - b.priority);
  } catch {
    return [];
  }
}

// --- Recon: Shodan InternetDB ---

async function checkShodan(domain) {
  const ip = await resolveIpv4(domain);
  if (!ip) {
    return {
      status: "error",
      ip: null,
      openPorts: [],
      highRiskPorts: [],
      notableServices: [],
      vulns: [],
      error: "Domain did not resolve to an IPv4 address.",
    };
  }

  try {
    const response = await fetchWithTimeout(
      `https://internetdb.shodan.io/${ip}`,
      { headers: { "user-agent": "CannaShield-AttackSurface/1.0 (security research)" } },
      7000
    );

    let data;
    if (response.status === 404) {
      data = { ports: [], vulns: [], cpes: [], tags: [], hostnames: [] };
    } else if (response.ok) {
      data = await response.json();
    } else {
      return {
        status: "error",
        ip,
        openPorts: [],
        highRiskPorts: [],
        notableServices: [],
        vulns: [],
        error: `InternetDB returned HTTP ${response.status}`,
      };
    }

    const openPorts = Array.isArray(data.ports || data.open_ports)
      ? data.ports || data.open_ports
      : [];
    const highRiskPorts = openPorts
      .filter((p) => HIGH_RISK_PORTS[p])
      .map((p) => ({ port: p, service: HIGH_RISK_PORTS[p], highPenalty: HIGH_PENALTY_PORTS.has(p) }));
    const notableServices = highRiskPorts.map((p) => `${p.service} (${p.port})`);
    const vulns = Array.isArray(data.vulns) ? data.vulns.slice(0, 15) : [];
    const hostnames = Array.isArray(data.hostnames) ? data.hostnames : [];

    return {
      status: "ok",
      ip,
      openPorts,
      highRiskPorts,
      notableServices,
      vulns,
      hostnames,
    };
  } catch (err) {
    return {
      status: "error",
      ip,
      openPorts: [],
      highRiskPorts: [],
      notableServices: [],
      vulns: [],
      error: err.name === "AbortError" ? "InternetDB request timed out." : String(err.message || err),
    };
  }
}

// --- Recon: crt.sh cert transparency ---

async function checkCertTransparency(domain) {
  try {
    const response = await fetchWithTimeout(
      `https://crt.sh/?q=%.${encodeURIComponent(domain)}&output=json`,
      { headers: { "user-agent": "CannaShield-AttackSurface/1.0" } },
      12000
    );

    if (!response.ok) {
      return {
        status: "error",
        subdomains: [],
        count: 0,
        error: `crt.sh returned HTTP ${response.status}`,
      };
    }

    let entries;
    try {
      entries = await response.json();
    } catch {
      return { status: "error", subdomains: [], count: 0, error: "crt.sh response was not valid JSON." };
    }

    if (!Array.isArray(entries)) {
      return { status: "ok", subdomains: [], count: 0 };
    }

    const seen = new Set();
    for (const entry of entries) {
      const raw = String(entry.name_value || entry.common_name || "");
      for (const name of raw.split("\n")) {
        const clean = name.trim().toLowerCase().replace(/^\*\./, "");
        if (clean && clean !== domain && clean.endsWith(`.${domain}`) && !seen.has(clean)) {
          seen.add(clean);
        }
      }
    }

    const subdomains = Array.from(seen).sort();
    return {
      status: "ok",
      subdomains: subdomains.slice(0, 60),
      count: subdomains.length,
    };
  } catch (err) {
    return {
      status: "error",
      subdomains: [],
      count: 0,
      error: err.name === "AbortError" ? "crt.sh request timed out." : String(err.message || err),
    };
  }
}

// --- Recon: HIBP ---

async function checkHibp(domain) {
  try {
    const headers = { "user-agent": "CannaShield-AttackSurface/1.0" };
    if (HIBP_API_KEY) headers["hibp-api-key"] = HIBP_API_KEY;

    const response = await fetchWithTimeout(
      "https://haveibeenpwned.com/api/v3/breaches",
      { headers },
      12000
    );

    if (response.status === 401 || response.status === 403) {
      return { status: "skipped", breaches: [], count: 0, note: "HIBP API key required for this query." };
    }
    if (response.status === 429) {
      return { status: "skipped", breaches: [], count: 0, note: "HIBP rate limit reached." };
    }
    if (!response.ok) {
      return { status: "error", breaches: [], count: 0, error: `HIBP returned HTTP ${response.status}` };
    }

    const allBreaches = await response.json();
    if (!Array.isArray(allBreaches)) {
      return { status: "error", breaches: [], count: 0, error: "Unexpected HIBP response shape." };
    }

    const matches = allBreaches.filter(
      (b) => b.Domain && b.Domain.toLowerCase() === domain.toLowerCase()
    );

    return {
      status: "ok",
      breaches: matches.map((b) => ({
        name: b.Name,
        title: b.Title,
        domain: b.Domain,
        breachDate: b.BreachDate,
        pwnCount: b.PwnCount,
        dataClasses: Array.isArray(b.DataClasses) ? b.DataClasses.slice(0, 10) : [],
        isVerified: b.IsVerified,
      })),
      count: matches.length,
    };
  } catch (err) {
    return {
      status: "error",
      breaches: [],
      count: 0,
      error: err.name === "AbortError" ? "HIBP request timed out." : String(err.message || err),
    };
  }
}

// --- Recon: DNS (SPF, DMARC, DKIM, MX) ---

function parseTagRecord(record) {
  const tags = {};
  for (const part of String(record || "").split(";")) {
    const [rawKey, ...rawValue] = part.trim().split("=");
    const key = String(rawKey || "").trim().toLowerCase();
    const value = rawValue.join("=").trim();
    if (key) tags[key] = value;
  }
  return tags;
}

function analyzeSpfPresence(txtRecords) {
  const records = txtRecords.filter((r) => /^v=spf1(?:\s|$)/i.test(r.trim()));
  if (!records.length) return { present: false, status: "missing" };
  if (records.length > 1) return { present: true, status: "multiple", records };

  const terms = records[0].trim().split(/\s+/).slice(1);
  const allMech = terms.find((t) => /^[+?~-]?all$/i.test(t)) || null;
  const qualifier = allMech ? (/^[+?~-]/.test(allMech[0]) ? allMech[0] : "+") : null;
  let status = "warn";
  if (qualifier === "-") status = "pass";
  else if (qualifier === "+" || qualifier === null) status = "fail";

  return { present: true, status, allMechanism: allMech, record: records[0] };
}

function analyzeDmarcPresence(dmarcRecords) {
  const records = dmarcRecords.filter((r) => /^v=DMARC1(?:\s*;|$)/i.test(r.trim()));
  if (!records.length) return { present: false, policy: "missing" };
  const tags = parseTagRecord(records[0]);
  const policy = String(tags.p || "none").toLowerCase();
  return {
    present: true,
    policy,
    hasReporting: Boolean(tags.rua),
    record: records[0],
  };
}

async function checkDns(domain) {
  const [txtRecords, dmarcTxtRecords, mxRecords] = await Promise.all([
    resolveTxtRaw(domain),
    resolveTxtRaw(`_dmarc.${domain}`),
    resolveMx(domain),
  ]);

  let dkimDetected = false;
  let dkimSelector = null;
  for (const selector of DKIM_SELECTORS.slice(0, 12)) {
    const { records } = await resolveTxtFollowingCname(`${selector}._domainkey.${domain}`);
    const found = records.filter((r) => /(?:^|;)\s*v=DKIM1\b/i.test(r) || /(?:^|;)\s*p=/i.test(r));
    if (found.length) {
      dkimDetected = true;
      dkimSelector = selector;
      break;
    }
  }

  return {
    status: "ok",
    spf: analyzeSpfPresence(txtRecords),
    dmarc: analyzeDmarcPresence(dmarcTxtRecords),
    dkim: { detected: dkimDetected, selector: dkimSelector },
    mx: {
      present: mxRecords.length > 0,
      records: mxRecords.map((r) => r.exchange),
    },
  };
}

// --- Recon: HTTP security headers ---

async function checkHttpHeaders(domain) {
  let responseHeaders = {};
  let statusCode = null;
  let fetchError = null;

  try {
    const response = await fetchWithTimeout(
      `https://${domain}`,
      {
        method: "HEAD",
        redirect: "follow",
        headers: { "user-agent": "CannaShield-AttackSurface/1.0" },
      },
      8000
    );
    statusCode = response.status;
    for (const [key, value] of response.headers.entries()) {
      responseHeaders[key.toLowerCase()] = value;
    }
  } catch (httpsErr) {
    // Fallback to HTTP
    try {
      const response2 = await fetchWithTimeout(
        `http://${domain}`,
        {
          method: "HEAD",
          redirect: "follow",
          headers: { "user-agent": "CannaShield-AttackSurface/1.0" },
        },
        6000
      );
      statusCode = response2.status;
      for (const [key, value] of response2.headers.entries()) {
        responseHeaders[key.toLowerCase()] = value;
      }
    } catch (httpErr) {
      fetchError = httpsErr.name === "AbortError"
        ? "HTTP header check timed out."
        : String(httpsErr.message || httpsErr);
    }
  }

  const checks = SECURITY_HEADERS.map((h) => ({
    name: h.label,
    header: h.name,
    present: Boolean(responseHeaders[h.name]),
    value: responseHeaders[h.name] || null,
    risk: h.risk,
  }));

  const missing = checks.filter((c) => !c.present);
  const hasHsts = Boolean(responseHeaders["strict-transport-security"]);

  return {
    status: fetchError && !statusCode ? "error" : "ok",
    statusCode,
    checks,
    missing: missing.map((c) => c.name),
    missingCount: missing.length,
    hasHsts,
    error: fetchError,
  };
}

// --- Scoring ---

function scoreFindings(recon) {
  let score = 0;
  const breakdown = [];

  // High-penalty ports: RDP, SMB, Telnet (+30 each)
  for (const portInfo of recon.shodan.highRiskPorts || []) {
    if (portInfo.highPenalty) {
      score += 30;
      breakdown.push({ reason: `Exposed ${portInfo.service} port (${portInfo.port})`, points: 30 });
    }
  }

  // No DMARC: +20
  if (!recon.dns.dmarc.present) {
    score += 20;
    breakdown.push({ reason: "No DMARC record found", points: 20 });
  }

  // No SPF: +15
  if (!recon.dns.spf.present) {
    score += 15;
    breakdown.push({ reason: "No SPF record found", points: 15 });
  }

  // HIBP breach found: +25
  if (recon.hibp.status === "ok" && recon.hibp.count > 0) {
    score += 25;
    const label = recon.hibp.count === 1 ? "breach" : "breaches";
    breakdown.push({ reason: `Domain found in ${recon.hibp.count} known data ${label}`, points: 25 });
  }

  // Missing HSTS: +10
  if (recon.headers.status === "ok" && !recon.headers.hasHsts) {
    score += 10;
    breakdown.push({ reason: "HSTS header missing", points: 10 });
  }

  // More than 10 exposed subdomains: +10
  if (recon.certs.status === "ok" && recon.certs.count > 10) {
    score += 10;
    breakdown.push({ reason: `${recon.certs.count} subdomains exposed in certificate logs`, points: 10 });
  }

  // More than 3 missing security headers: +10
  if (recon.headers.status === "ok" && recon.headers.missingCount > 3) {
    score += 10;
    breakdown.push({ reason: `${recon.headers.missingCount} of ${SECURITY_HEADERS.length} security headers missing`, points: 10 });
  }

  breakdown.sort((a, b) => b.points - a.points);
  return { score, breakdown };
}

function riskTier(score) {
  if (score <= 30) return "Low";
  if (score <= 60) return "Medium";
  if (score <= 90) return "High";
  return "Critical";
}

function buildRecommendations(recon, scoring) {
  const recs = [];

  for (const finding of scoring.breakdown) {
    if (recs.length >= 5) break;
    const r = finding.reason;

    if (r.includes("RDP")) {
      recs.push(
        "Close RDP (port 3389) from the public internet. Require VPN or Azure Bastion for all remote administration — exposed RDP is the leading ransomware delivery vector."
      );
    } else if (r.includes("SMB")) {
      recs.push(
        "Block SMB (port 445) at your perimeter firewall immediately. Exposed SMB enables lateral movement, credential relay, and is exploited by ransomware including WannaCry and NotPetya variants."
      );
    } else if (r.includes("Telnet")) {
      recs.push(
        "Disable Telnet (port 23). Telnet transmits credentials in plaintext. Replace with SSH and enforce key-based authentication."
      );
    } else if (r.includes("DMARC")) {
      recs.push(
        "Publish a DMARC record at _dmarc.yourdomain.com. Start with p=none and aggregate reporting (rua=), then move to p=quarantine then p=reject over 30–60 days. Without DMARC, attackers can send convincing fake invoices and payroll change requests from your domain."
      );
    } else if (r.includes("SPF")) {
      recs.push(
        "Publish an SPF record (v=spf1) that lists every authorized mail sender. End with -all to instruct receivers to reject unauthenticated mail. No SPF means any server can claim to be your domain."
      );
    } else if (r.includes("breach") || r.includes("data")) {
      recs.push(
        "Rotate passwords for all accounts associated with this domain immediately. Check your cannabis POS (Dutchie, Treez, METRC) admin credentials, banking portals, and payroll systems for unauthorized access patterns in the past 90 days."
      );
    } else if (r.includes("HSTS")) {
      recs.push(
        "Enable HSTS (Strict-Transport-Security: max-age=31536000; includeSubDomains) on your web server or CDN. HSTS prevents protocol downgrade attacks that can intercept employee and customer sessions."
      );
    } else if (r.includes("subdomains")) {
      recs.push(
        `Audit ${recon.certs.count} exposed subdomains for forgotten staging environments, admin panels, and unpatched legacy applications. Each subdomain is a potential entry point into your network.`
      );
    } else if (r.includes("security headers")) {
      recs.push(
        "Configure missing security headers on your web server or CDN. Content-Security-Policy prevents XSS attacks on your dispensary booking or e-commerce flows. X-Frame-Options blocks clickjacking."
      );
    }
  }

  if (recs.length === 0) {
    recs.push(
      "Schedule a CannaShield vCISO assessment to review your full technology stack, vendor access, and cannabis-specific compliance posture beyond what passive recon can see."
    );
  }

  if (recs.length < 5) {
    recs.push(
      "Audit employee device security and cannabis-specific touchpoints: POS system segmentation, METRC API credential rotation, dispensary Wi-Fi isolation, and delivery device management."
    );
  }

  return recs.slice(0, 5);
}

// --- Full scan ---

async function runScan(domain) {
  const [shodan, certs, hibp, dnsRecon, headers] = await Promise.all([
    checkShodan(domain),
    checkCertTransparency(domain),
    checkHibp(domain),
    checkDns(domain),
    checkHttpHeaders(domain),
  ]);

  const recon = { shodan, certs, hibp, dns: dnsRecon, headers };
  const scoring = scoreFindings(recon);
  const tier = riskTier(scoring.score);
  const recommendations = buildRecommendations(recon, scoring);

  return {
    domain,
    scannedAt: new Date().toISOString(),
    score: scoring.score,
    tier,
    scoring,
    recommendations,
    recon,
  };
}

module.exports = {
  runScan,
  normalizeDomain,
  isValidDomain,
  isValidEmail,
  riskTier,
  SECURITY_HEADERS,
};
