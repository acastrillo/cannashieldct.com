"use strict";

const dns = require("dns").promises;
const fs = require("fs");

const NOTION_API_KEY = String(process.env.NOTION_API_KEY || "").trim();
const NOTION_DATABASE_ID = String(process.env.NOTION_ATTACK_SURFACE_DATABASE_ID || "").trim();
const N8N_WEBHOOK_URL = String(process.env.N8N_ATTACK_SURFACE_WEBHOOK_URL || "").trim();
const TURNSTILE_SECRET_KEY = String(process.env.TURNSTILE_SECRET_KEY || "").trim();
const REQUIRE_TURNSTILE = String(process.env.REQUIRE_TURNSTILE || "false").toLowerCase() === "true";
const REPORT_FROM_EMAIL = String(process.env.REPORT_FROM_EMAIL || "alejo@cannashieldct.com").trim();
const ATTACK_SURFACE_REPORT_ENGINE = String(process.env.ATTACK_SURFACE_REPORT_ENGINE || "lambda").trim().toLowerCase();
const ATTACK_SURFACE_REPORT_TOKEN = String(process.env.ATTACK_SURFACE_REPORT_TOKEN || "").trim();
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

// --- Response helpers ---

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "OPTIONS,POST,GET",
      "access-control-allow-headers": "content-type",
      "cache-control": "no-store",
    },
    body: JSON.stringify(payload),
  };
}

function htmlResponse(statusCode, html) {
  return {
    statusCode,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "OPTIONS,POST,GET",
      "access-control-allow-headers": "content-type,x-attack-surface-report-token",
      "cache-control": "no-store",
    },
    body: html,
  };
}

function binaryResponse(statusCode, buffer, contentType, filename) {
  return {
    statusCode,
    headers: {
      "content-type": contentType,
      "content-disposition": `inline; filename="${filename}"`,
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "OPTIONS,POST,GET",
      "access-control-allow-headers": "content-type,x-attack-surface-report-token",
      "cache-control": "no-store",
    },
    isBase64Encoded: true,
    body: Buffer.from(buffer).toString("base64"),
  };
}

function parseEventBody(event) {
  if (!event || !event.body) return {};
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf8")
    : event.body;
  if (!String(raw).trim()) return {};
  return JSON.parse(raw);
}

function getQueryParams(event) {
  const params = new URLSearchParams(event && event.rawQueryString ? event.rawQueryString : "");
  if (!params.size && event && event.queryStringParameters) {
    for (const [key, value] of Object.entries(event.queryStringParameters)) {
      if (value !== undefined && value !== null) params.set(key, String(value));
    }
  }
  return params;
}

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

function slugify(value) {
  return (
    String(value || "scan")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "scan"
  );
}

function plainText(value, maxLength = 1900) {
  const text = String(value || "").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
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

// --- Turnstile ---

async function verifyTurnstile(token, remoteIp) {
  if (!TURNSTILE_SECRET_KEY) {
    return { ok: !REQUIRE_TURNSTILE, skipped: !REQUIRE_TURNSTILE };
  }
  if (!token) return { ok: false, error: "Missing Turnstile token." };

  const params = new URLSearchParams({ secret: TURNSTILE_SECRET_KEY, response: token });
  if (remoteIp) params.set("remoteip", remoteIp);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: params,
  });
  const body = await response.json();
  return {
    ok: Boolean(body.success),
    skipped: false,
    error: body.success ? null : "Turnstile verification failed.",
  };
}

// --- Notion ---

function notionText(value) {
  const content = plainText(value);
  return content ? [{ text: { content } }] : [];
}

async function saveLeadToNotion(lead, scan) {
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    return { saved: false, skipped: true, reason: "Notion API token or database ID not configured." };
  }

  const payload = {
    parent: { database_id: NOTION_DATABASE_ID },
    properties: {
      Name: { title: notionText(`${scan.domain} — ${lead.email}`) },
      Email: { email: lead.email },
      Domain: { rich_text: notionText(scan.domain) },
      Company: { rich_text: notionText(lead.company) },
      Status: { select: { name: "New" } },
      Score: { number: scan.score },
      "Risk Tier": { select: { name: scan.tier } },
      Source: { select: { name: "attack-surface-snapshot" } },
      "Submitted At": { date: { start: scan.scannedAt } },
      Consent: { checkbox: Boolean(lead.consent) },
      "Raw JSON": { rich_text: notionText(JSON.stringify({ lead, scan })) },
    },
    children: [
      {
        object: "block",
        type: "heading_2",
        heading_2: { rich_text: [{ type: "text", text: { content: "Attack Surface Snapshot" } }] },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{
            type: "text",
            text: { content: `Risk score ${scan.score} (${scan.tier}). Scanned ${scan.scannedAt}.` },
          }],
        },
      },
      {
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: `Shodan: ${scan.recon.shodan.highRiskPorts.length} high-risk ports, ${scan.recon.shodan.openPorts.length} total open ports` } }],
        },
      },
      {
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: `Subdomains: ${scan.recon.certs.count} found in cert logs` } }],
        },
      },
      {
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: `HIBP: ${scan.recon.hibp.count} breach match(es)` } }],
        },
      },
      {
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: `Email: DMARC ${scan.recon.dns.dmarc.policy}, SPF ${scan.recon.dns.spf.status}` } }],
        },
      },
      {
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: `Headers: ${scan.recon.headers.missingCount} missing of ${SECURITY_HEADERS.length}, HSTS: ${scan.recon.headers.hasHsts ? "present" : "missing"}` } }],
        },
      },
    ],
  };

  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      authorization: `Bearer ${NOTION_API_KEY}`,
      "content-type": "application/json",
      "notion-version": "2022-06-28",
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json();
  if (!response.ok) return { saved: false, status: response.status, error: body };
  return { saved: true, pageId: body.id, url: body.url };
}

async function notifyN8n(lead, scan, notion) {
  if (!N8N_WEBHOOK_URL) return { sent: false, skipped: true };

  const response = await fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      event: "attack_surface_snapshot.submitted",
      reportFromEmail: REPORT_FROM_EMAIL,
      lead,
      scan,
      notion,
    }),
  });

  return { sent: response.ok, skipped: false, status: response.status };
}

// --- PDF rendering ---

function getReportTemplate() {
  return require("./attack-surface-pdf/render-attack-surface-report");
}

function buildReportHtml(lead, scan) {
  const { buildHtml } = getReportTemplate();
  return buildHtml({ lead: lead || {}, scan });
}

function findLocalChrome() {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  ].filter(Boolean);
  return candidates.find((c) => fs.existsSync(c)) || "";
}

async function getPuppeteerLaunchOptions() {
  const puppeteer = require("puppeteer-core");
  const localChrome = findLocalChrome();

  if (localChrome) {
    return {
      puppeteer,
      options: {
        executablePath: localChrome,
        headless: true,
        args: ["--disable-gpu", "--no-sandbox", "--disable-setuid-sandbox"],
      },
    };
  }

  const chromium = require("@sparticuz/chromium");
  return {
    puppeteer,
    options: {
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    },
  };
}

async function renderReportPdf(lead, scan) {
  const html = buildReportHtml(lead, scan);
  const { puppeteer, options } = await getPuppeteerLaunchOptions();
  let browser;

  try {
    browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 12000 });
    return Buffer.from(
      await page.pdf({
        format: "Letter",
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: "0", right: "0", bottom: "0", left: "0" },
      })
    );
  } finally {
    if (browser) await browser.close();
  }
}

function reportAccessAllowed(event, body, query) {
  if (!ATTACK_SURFACE_REPORT_TOKEN) return true;
  const headerToken =
    event && event.headers
      ? event.headers["x-attack-surface-report-token"] || event.headers["X-Attack-Surface-Report-Token"] || ""
      : "";
  return [headerToken, body && body.reportToken, query && query.get("token")]
    .filter(Boolean)
    .some((v) => String(v) === ATTACK_SURFACE_REPORT_TOKEN);
}

// --- Route handlers ---

async function handleSubmit(event) {
  const body = parseEventBody(event);
  const domain = normalizeDomain(body.domain || body.email);
  const email = String(body.email || "").trim().toLowerCase();

  if (!isValidDomain(domain)) {
    return jsonResponse(400, { ok: false, error: "Enter a valid business domain." });
  }
  if (!isValidEmail(email)) {
    return jsonResponse(400, { ok: false, error: "Enter a valid email address." });
  }

  const remoteIp =
    event && event.requestContext && event.requestContext.http
      ? event.requestContext.http.sourceIp
      : "";
  const turnstile = await verifyTurnstile(body.turnstileToken, remoteIp);
  if (!turnstile.ok) {
    return jsonResponse(403, { ok: false, error: turnstile.error || "Verification failed." });
  }

  const lead = {
    name: plainText(body.name, 200),
    email,
    company: plainText(body.company, 200),
    domain,
    consent: Boolean(body.consent),
    source: "attack-surface-snapshot",
    submittedAt: new Date().toISOString(),
  };

  const scan = await runScan(domain);
  const notion = await saveLeadToNotion(lead, scan);
  const n8n = await notifyN8n(lead, scan, notion);

  return jsonResponse(200, {
    ok: true,
    message: "Attack surface snapshot complete.",
    scan,
    delivery: {
      notion,
      n8n,
      reportFromEmail: REPORT_FROM_EMAIL,
      pdf:
        ATTACK_SURFACE_REPORT_ENGINE === "n8n" && n8n.sent ? "queued" : "lambda-ready",
      report: {
        engine: ATTACK_SURFACE_REPORT_ENGINE,
        htmlPath: `/api/attack-surface/report?domain=${encodeURIComponent(domain)}&format=html`,
        pdfPath: `/api/attack-surface/report?domain=${encodeURIComponent(domain)}&format=pdf`,
      },
    },
  });
}

async function handleReport(event) {
  const query = getQueryParams(event);
  const method =
    event && event.requestContext && event.requestContext.http
      ? event.requestContext.http.method
      : event.httpMethod;
  const body = method === "POST" ? parseEventBody(event) : {};

  if (!reportAccessAllowed(event, body, query)) {
    return jsonResponse(403, { ok: false, error: "Report export is not authorized." });
  }

  const requestedFormat = String(body.format || query.get("format") || "pdf").toLowerCase();
  const format = requestedFormat === "html" ? "html" : "pdf";

  const lead = {
    name: plainText(body.lead?.name || body.name || query.get("name"), 200),
    email: plainText(body.lead?.email || body.email || query.get("email"), 200),
    company: plainText(body.lead?.company || body.company || query.get("company"), 200),
  };

  const domain = normalizeDomain(
    body.scan?.domain || body.domain || query.get("domain") || lead.email
  );
  if (!body.scan && !isValidDomain(domain)) {
    return jsonResponse(400, { ok: false, error: "Enter a valid business domain." });
  }

  const scan = body.scan || (await runScan(domain));
  const reportDomain = normalizeDomain(scan.domain || domain);
  const filename = `${slugify(reportDomain)}-attack-surface-snapshot.${format}`;

  if (format === "html") return htmlResponse(200, buildReportHtml(lead, scan));

  try {
    const pdf = await renderReportPdf(lead, scan);
    return binaryResponse(200, pdf, "application/pdf", filename);
  } catch (err) {
    console.error("PDF render failed", err);
    return jsonResponse(500, {
      ok: false,
      error: "PDF render failed.",
      detail: err instanceof Error ? err.message : String(err),
    });
  }
}

// --- Main handler ---

async function handler(event) {
  const method =
    event && event.requestContext && event.requestContext.http
      ? event.requestContext.http.method
      : event.httpMethod;
  const path = event && event.rawPath ? event.rawPath : event.path || "/";

  if (method === "OPTIONS") return jsonResponse(204, {});

  if (method === "GET" && /\/health$/.test(path)) {
    return jsonResponse(200, {
      ok: true,
      service: "cannashield-attack-surface-snapshot",
      notionConfigured: Boolean(NOTION_API_KEY && NOTION_DATABASE_ID),
      n8nConfigured: Boolean(N8N_WEBHOOK_URL),
      hibpConfigured: Boolean(HIBP_API_KEY),
      reportEngine: ATTACK_SURFACE_REPORT_ENGINE,
      reportTokenRequired: Boolean(ATTACK_SURFACE_REPORT_TOKEN),
      turnstileRequired: REQUIRE_TURNSTILE,
      turnstileConfigured: Boolean(TURNSTILE_SECRET_KEY),
    });
  }

  if (
    (method === "GET" || method === "POST") &&
    /\/api\/attack-surface\/report$|\/report$/.test(path)
  ) {
    return handleReport(event);
  }

  if (
    method === "POST" &&
    /\/api\/attack-surface\/submit$|\/submit$|\/$/.test(path)
  ) {
    return handleSubmit(event);
  }

  return jsonResponse(404, { ok: false, error: "Not found." });
}

// --- CLI ---

if (require.main === module) {
  const domain = normalizeDomain(process.argv[2]);
  if (!isValidDomain(domain)) {
    console.error("Usage: node attack-surface-api-lambda.js example.com");
    process.exit(1);
  }

  runScan(domain)
    .then((scan) => console.log(JSON.stringify(scan, null, 2)))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = {
  handler,
  runScan,
  normalizeDomain,
  buildReportHtml,
  renderReportPdf,
};
