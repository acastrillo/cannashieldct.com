"use strict";

const dns = require("dns").promises;
const fs = require("fs");

const NOTION_API_KEY = String(process.env.NOTION_API_KEY || "").trim();
const NOTION_DATABASE_ID = String(
  process.env.NOTION_SCORECARD_DATABASE_ID || "f87849ddc46f4a6ea5967bbc733b2cf9"
).trim();
const N8N_WEBHOOK_URL = String(process.env.N8N_SCORECARD_WEBHOOK_URL || "").trim();
const TURNSTILE_SECRET_KEY = String(process.env.TURNSTILE_SECRET_KEY || "").trim();
const REQUIRE_TURNSTILE = String(process.env.REQUIRE_TURNSTILE || "false").toLowerCase() === "true";
const REPORT_FROM_EMAIL = String(process.env.REPORT_FROM_EMAIL || "alejo@cannashieldct.com").trim();
const SCORECARD_REPORT_ENGINE = String(process.env.SCORECARD_REPORT_ENGINE || "lambda").trim().toLowerCase();
const SCORECARD_REPORT_TOKEN = String(process.env.SCORECARD_REPORT_TOKEN || "").trim();

const DKIM_SELECTORS = [
  "google",
  "selector1",
  "selector2",
  "default",
  "dkim",
  "mail",
  "s1",
  "s2",
  "k1",
  "mandrill",
  "smtpapi",
  "mta",
  "pm",
  "protonmail",
  "zoho",
  "zmail",
  "fm1",
  "fm2",
  "fm3",
];

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
      "access-control-allow-headers": "content-type,x-scorecard-report-token",
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
      "access-control-allow-headers": "content-type,x-scorecard-report-token",
      "cache-control": "no-store",
    },
    isBase64Encoded: true,
    body: Buffer.from(buffer).toString("base64"),
  };
}

function parseEventBody(event) {
  if (!event || !event.body) return {};
  const raw = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body;
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
  return String(value || "scorecard")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "scorecard";
}

function flattenTxt(records) {
  return (records || [])
    .map((chunks) => (Array.isArray(chunks) ? chunks.join("") : String(chunks)))
    .filter(Boolean);
}

async function resolveTxt(name) {
  try {
    return flattenTxt(await dns.resolveTxt(name));
  } catch (err) {
    if (["ENODATA", "ENOTFOUND", "ETIMEOUT", "ESERVFAIL"].includes(err.code)) return [];
    return [];
  }
}

async function resolveTxtFollowingCname(name) {
  const direct = await resolveTxt(name);
  if (direct.length) return { records: direct, cname: null };

  try {
    const cnames = await dns.resolveCname(name);
    for (const cname of cnames) {
      const records = await resolveTxt(cname);
      if (records.length) return { records, cname };
    }
  } catch {
    // CNAME fallback is best-effort; many selectors simply do not exist.
  }

  return { records: [], cname: null };
}

async function resolveMx(domain) {
  try {
    return (await dns.resolveMx(domain)).sort((a, b) => a.priority - b.priority);
  } catch (err) {
    if (["ENODATA", "ENOTFOUND", "ETIMEOUT", "ESERVFAIL"].includes(err.code)) return [];
    return [];
  }
}

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

function analyzeSpf(txtRecords) {
  const records = txtRecords.filter((record) => /^v=spf1(?:\s|$)/i.test(record.trim()));
  const warnings = [];
  let status = "fail";
  let score = 0;

  if (!records.length) {
    return {
      status,
      records,
      score,
      allMechanism: null,
      lookupCount: 0,
      warnings: ["No SPF record found at the root domain."],
    };
  }

  if (records.length > 1) {
    return {
      status,
      records,
      score: 5,
      allMechanism: null,
      lookupCount: 0,
      warnings: ["Multiple SPF records found. Receivers treat this as a permanent SPF error."],
    };
  }

  const terms = records[0].trim().split(/\s+/).slice(1);
  const allMechanism = terms.find((term) => /^[+?~-]?all$/i.test(term)) || null;
  const lookupCount = terms.filter((term) => /^(?:[+?~-])?(include:|a(?::|\/|$)|mx(?::|\/|$)|exists:|ptr(?::|$)|redirect=)/i.test(term)).length;
  const hasPtr = terms.some((term) => /^(?:[+?~-])?ptr(?::|$)/i.test(term));
  const hasRedirect = terms.some((term) => /^redirect=/i.test(term));

  status = "warn";
  score = 18;

  if (allMechanism) {
    const qualifier = /^[+?~-]/.test(allMechanism[0]) ? allMechanism[0] : "+";
    if (qualifier === "-") {
      status = "pass";
      score += 10;
    } else if (qualifier === "~") {
      score += 6;
      warnings.push("SPF uses softfail (~all). That is useful during rollout but weaker for enforcement.");
    } else if (qualifier === "?") {
      score += 3;
      warnings.push("SPF ends with neutral (?all), which gives receivers little enforcement signal.");
    } else {
      status = "fail";
      score = 8;
      warnings.push("SPF uses +all or an unqualified all mechanism, allowing any sender.");
    }
  } else if (!hasRedirect) {
    warnings.push("SPF has no all mechanism, so enforcement behavior is ambiguous.");
  }

  if (lookupCount > 10) {
    status = "fail";
    score = Math.min(score, 10);
    warnings.push("SPF appears to exceed the 10 DNS-lookup limit.");
  } else if (lookupCount > 8) {
    score -= 4;
    warnings.push("SPF is close to the 10 DNS-lookup limit.");
  }

  if (hasPtr) {
    score -= 4;
    warnings.push("SPF uses ptr, which is slow and discouraged.");
  }

  return {
    status,
    records,
    score: Math.max(0, Math.min(30, score)),
    allMechanism,
    lookupCount,
    warnings,
  };
}

function analyzeDmarc(records) {
  const dmarcRecords = records.filter((record) => /^v=DMARC1(?:\s*;|$)/i.test(record.trim()));

  if (!dmarcRecords.length) {
    return {
      status: "missing",
      policy: "missing",
      records: [],
      tags: {},
      score: 0,
      warnings: ["No DMARC record found."],
    };
  }

  if (dmarcRecords.length > 1) {
    return {
      status: "invalid",
      policy: "unknown",
      records: dmarcRecords,
      tags: {},
      score: 5,
      warnings: ["Multiple DMARC records found. Receivers may treat DMARC as invalid."],
    };
  }

  const tags = parseTagRecord(dmarcRecords[0]);
  const policy = String(tags.p || "none").toLowerCase();
  const pct = Number(tags.pct || "100");
  const warnings = [];
  let score = 0;

  if (policy === "reject") {
    score = 34;
  } else if (policy === "quarantine") {
    score = 24;
    warnings.push("DMARC is enforcing quarantine, not reject. Good, but spoofed mail may still reach spam.");
  } else if (policy === "none") {
    score = 12;
    warnings.push("DMARC is monitoring only (p=none). Spoofed mail is not instructed to be blocked.");
  } else {
    score = 6;
    warnings.push(`DMARC policy "${policy}" is not recognized.`);
  }

  if (tags.rua) score += 4;
  else warnings.push("DMARC aggregate reporting (rua) is not configured.");

  if (tags.adkim === "s") score += 1;
  if (tags.aspf === "s") score += 1;

  if (Number.isFinite(pct) && pct < 100) {
    score -= 5;
    warnings.push(`DMARC pct is ${pct}, so enforcement is not applied to all mail.`);
  }

  return {
    status: policy === "reject" || policy === "quarantine" ? "pass" : "warn",
    policy,
    records: dmarcRecords,
    tags,
    score: Math.max(0, Math.min(40, score)),
    warnings,
  };
}

async function analyzeDkim(domain) {
  const checked = [];
  const detected = [];

  for (const selector of DKIM_SELECTORS) {
    const host = `${selector}._domainkey.${domain}`;
    const { records, cname } = await resolveTxtFollowingCname(host);
    const dkimRecords = records.filter((record) => /(?:^|;)\s*v=DKIM1\b/i.test(record) || /(?:^|;)\s*p=/i.test(record));

    checked.push({
      selector,
      host,
      cname,
      found: dkimRecords.length > 0,
    });

    for (const record of dkimRecords) {
      detected.push({ selector, host, cname, record });
    }
  }

  if (detected.length) {
    return {
      status: "detected",
      score: 20,
      detected,
      checked,
      warnings: [],
    };
  }

  return {
    status: "not detected",
    score: 8,
    detected,
    checked,
    warnings: [
      "No DKIM record found on common selectors. This is not conclusive without the sender's exact DKIM selector.",
    ],
  };
}

function buildSpoofScenario(dmarc, spf, dkim) {
  if (dmarc.policy === "reject" && (spf.status === "pass" || dkim.status === "detected")) {
    return {
      outcome: "Likely rejected",
      detail: "A direct spoof of this domain should usually fail DMARC and be rejected by aligned receivers.",
    };
  }

  if (dmarc.policy === "quarantine") {
    return {
      outcome: "Likely quarantined",
      detail: "Receivers are instructed to send failing spoofed mail to spam or quarantine, but not reject it outright.",
    };
  }

  if (dmarc.policy === "none") {
    return {
      outcome: "Likely delivered or filtered inconsistently",
      detail: "DMARC is in monitor mode, so spoofed mail is not explicitly blocked by policy.",
    };
  }

  return {
    outcome: "High spoofing exposure",
    detail: "Without a valid enforcing DMARC policy, receivers have weak instructions for blocking lookalike or direct spoof attempts.",
  };
}

function riskTier(score) {
  if (score < 45) return "Critical";
  if (score < 70) return "High";
  if (score < 85) return "Moderate";
  return "Low";
}

function buildRecommendations(analysis) {
  const recommendations = [];

  if (analysis.dmarc.policy === "missing") {
    recommendations.push("Publish a DMARC record at _dmarc with aggregate reporting enabled.");
  } else if (analysis.dmarc.policy === "none") {
    recommendations.push("Move DMARC from p=none to a phased quarantine/reject enforcement plan.");
  } else if (analysis.dmarc.policy === "quarantine") {
    recommendations.push("Move DMARC from quarantine to reject after validating legitimate senders.");
  }

  if (analysis.spf.status === "fail") {
    recommendations.push("Fix SPF so the root domain has exactly one valid record for approved senders.");
  } else if (analysis.spf.status === "warn") {
    recommendations.push("Tighten SPF with a stronger all mechanism and reduce risky lookups.");
  }

  if (analysis.dkim.status !== "detected") {
    recommendations.push("Confirm DKIM is enabled for the actual mail platform and document the selector.");
  }

  if (!analysis.dmarc.tags.rua && analysis.dmarc.policy !== "missing") {
    recommendations.push("Add DMARC aggregate reporting so spoof attempts become measurable.");
  }

  recommendations.push("Review cannabis-specific BEC exposure: vendor payments, payroll changes, and wholesale invoices.");

  return recommendations.slice(0, 4);
}

async function analyzeDomain(domain) {
  const [txtRecords, dmarcTxtRecords, mxRecords, dkim] = await Promise.all([
    resolveTxt(domain),
    resolveTxt(`_dmarc.${domain}`),
    resolveMx(domain),
    analyzeDkim(domain),
  ]);

  const spf = analyzeSpf(txtRecords);
  const dmarc = analyzeDmarc(dmarcTxtRecords);
  const mxScore = mxRecords.length ? 6 : 0;
  const score = Math.max(0, Math.min(100, Math.round(spf.score + dmarc.score + dkim.score + mxScore)));

  const analysis = {
    domain,
    generatedAt: new Date().toISOString(),
    score,
    riskTier: riskTier(score),
    mx: {
      status: mxRecords.length ? "detected" : "missing",
      records: mxRecords,
      score: mxScore,
    },
    spf,
    dmarc,
    dkim,
  };

  analysis.spoofScenario = buildSpoofScenario(dmarc, spf, dkim);
  analysis.recommendations = buildRecommendations(analysis);
  return analysis;
}

async function verifyTurnstile(token, remoteIp) {
  if (!TURNSTILE_SECRET_KEY) {
    return {
      ok: !REQUIRE_TURNSTILE,
      skipped: !REQUIRE_TURNSTILE,
      error: REQUIRE_TURNSTILE ? "Turnstile is required but TURNSTILE_SECRET_KEY is not configured." : null,
    };
  }

  if (!token) {
    return { ok: false, skipped: false, error: "Missing Turnstile token." };
  }

  const params = new URLSearchParams({
    secret: TURNSTILE_SECRET_KEY,
    response: token,
  });
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
    hostname: body.hostname,
    error: body.success ? null : "Turnstile verification failed.",
    raw: body,
  };
}

function plainText(value, maxLength = 1900) {
  const text = String(value || "").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

function notionText(value) {
  const content = plainText(value);
  return content ? [{ text: { content } }] : [];
}

async function saveLeadToNotion(lead, analysis) {
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    return { saved: false, skipped: true, reason: "Notion API token or database ID is not configured." };
  }

  const payload = {
    parent: { database_id: NOTION_DATABASE_ID },
    properties: {
      Name: { title: notionText(`${analysis.domain} - ${lead.email}`) },
      Email: { email: lead.email },
      Domain: { rich_text: notionText(analysis.domain) },
      Company: { rich_text: notionText(lead.company) },
      Role: { rich_text: notionText(lead.role) },
      Status: { select: { name: "New" } },
      Score: { number: analysis.score },
      "Risk Tier": { select: { name: analysis.riskTier } },
      "DMARC Policy": { select: { name: analysis.dmarc.policy || "unknown" } },
      "SPF Status": { select: { name: analysis.spf.status || "unknown" } },
      "DKIM Status": { select: { name: analysis.dkim.status || "unknown" } },
      Source: { select: { name: lead.source || "cyber-check" } },
      "Submitted At": { date: { start: analysis.generatedAt } },
      Consent: { checkbox: Boolean(lead.consent) },
      "Raw JSON": { rich_text: notionText(JSON.stringify({ lead, analysis })) },
    },
    children: [
      {
        object: "block",
        type: "heading_2",
        heading_2: { rich_text: [{ type: "text", text: { content: "Scorecard Summary" } }] },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content: `Score ${analysis.score}/100 (${analysis.riskTier}). Spoof scenario: ${analysis.spoofScenario.outcome}.`,
              },
            },
          ],
        },
      },
      {
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: { rich_text: [{ type: "text", text: { content: `DMARC: ${analysis.dmarc.policy}` } }] },
      },
      {
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: { rich_text: [{ type: "text", text: { content: `SPF: ${analysis.spf.status}` } }] },
      },
      {
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: { rich_text: [{ type: "text", text: { content: `DKIM: ${analysis.dkim.status}` } }] },
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
  if (!response.ok) {
    return { saved: false, skipped: false, status: response.status, error: body };
  }

  return { saved: true, skipped: false, pageId: body.id, url: body.url };
}

async function notifyN8n(lead, analysis, notionResult) {
  if (!N8N_WEBHOOK_URL) return { sent: false, skipped: true };

  const response = await fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      event: "email_security_scorecard.submitted",
      reportFromEmail: REPORT_FROM_EMAIL,
      lead,
      analysis,
      notion: notionResult,
    }),
  });

  return { sent: response.ok, skipped: false, status: response.status };
}

function publicAnalysis(analysis) {
  return {
    domain: analysis.domain,
    generatedAt: analysis.generatedAt,
    score: analysis.score,
    riskTier: analysis.riskTier,
    spoofScenario: analysis.spoofScenario,
    recommendations: analysis.recommendations,
    checks: {
      dmarc: {
        policy: analysis.dmarc.policy,
        status: analysis.dmarc.status,
        warnings: analysis.dmarc.warnings,
        hasReporting: Boolean(analysis.dmarc.tags.rua),
      },
      spf: {
        status: analysis.spf.status,
        allMechanism: analysis.spf.allMechanism,
        lookupCount: analysis.spf.lookupCount,
        warnings: analysis.spf.warnings,
      },
      dkim: {
        status: analysis.dkim.status,
        detectedSelectors: analysis.dkim.detected.map((record) => record.selector),
        warnings: analysis.dkim.warnings,
      },
      mx: {
        status: analysis.mx.status,
        records: analysis.mx.records.map((record) => record.exchange),
      },
    },
  };
}

function getReportTemplate() {
  return require("./scorecard-pdf/render-scorecard-report");
}

function buildReportPayload(lead, analysis) {
  return {
    lead: lead || {},
    analysis: analysis && analysis.checks ? analysis : publicAnalysis(analysis),
  };
}

function buildReportHtml(lead, analysis) {
  const { buildHtml } = getReportTemplate();
  return buildHtml(buildReportPayload(lead, analysis));
}

function findLocalChrome() {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  ].filter(Boolean);

  return candidates.find((candidate) => fs.existsSync(candidate)) || "";
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

async function renderReportPdf(lead, analysis) {
  const html = buildReportHtml(lead, analysis);
  const { puppeteer, options } = await getPuppeteerLaunchOptions();
  let browser;

  try {
    browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 10000 });
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
  if (!SCORECARD_REPORT_TOKEN) return true;
  const headerToken =
    event && event.headers
      ? event.headers["x-scorecard-report-token"] || event.headers["X-Scorecard-Report-Token"]
      : "";
  return [headerToken, body && body.reportToken, query && query.get("token")]
    .filter(Boolean)
    .some((value) => String(value) === SCORECARD_REPORT_TOKEN);
}

async function handleReport(event) {
  const query = getQueryParams(event);
  const method = event && event.requestContext && event.requestContext.http
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
    role: plainText(body.lead?.role || body.role || query.get("role"), 200),
  };

  const domain = normalizeDomain(
    body.analysis?.domain || body.domain || body.lead?.domain || query.get("domain") || lead.email
  );
  if (!body.analysis && !isValidDomain(domain)) {
    return jsonResponse(400, { ok: false, error: "Enter a valid business domain for report export." });
  }

  const analysis = body.analysis || (await analyzeDomain(domain));
  const reportDomain = normalizeDomain(analysis.domain || domain);
  const filename = `${slugify(reportDomain)}-email-security-scorecard.${format}`;

  if (format === "html") {
    return htmlResponse(200, buildReportHtml(lead, analysis));
  }

  try {
    const pdf = await renderReportPdf(lead, analysis);
    return binaryResponse(200, pdf, "application/pdf", filename);
  } catch (err) {
    console.error("PDF report render failed", err);
    return jsonResponse(500, {
      ok: false,
      error: "The scorecard PDF could not be rendered.",
      detail: err instanceof Error ? err.message : String(err),
    });
  }
}

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

  const remoteIp = event && event.requestContext && event.requestContext.http
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
    role: plainText(body.role, 200),
    domain,
    consent: Boolean(body.consent),
    source: "cyber-check",
    submittedAt: new Date().toISOString(),
  };

  const analysis = await analyzeDomain(domain);
  const notion = await saveLeadToNotion(lead, analysis);
  const n8n = await notifyN8n(lead, analysis, notion);

  return jsonResponse(200, {
    ok: true,
    message: "Scorecard generated.",
    analysis: publicAnalysis(analysis),
    delivery: {
      notion,
      n8n,
      reportFromEmail: REPORT_FROM_EMAIL,
      pdf: SCORECARD_REPORT_ENGINE === "n8n" && n8n.sent ? "queued" : "lambda-ready",
      report: {
        engine: SCORECARD_REPORT_ENGINE,
        htmlPath: `/api/scorecard/report?domain=${encodeURIComponent(domain)}&format=html`,
        pdfPath: `/api/scorecard/report?domain=${encodeURIComponent(domain)}&format=pdf`,
        futureEngine: "n8n",
      },
    },
  });
}

async function handler(event) {
  const method = event && event.requestContext && event.requestContext.http
    ? event.requestContext.http.method
    : event.httpMethod;
  const path = event && event.rawPath ? event.rawPath : event.path || "/";

  if (method === "OPTIONS") return jsonResponse(204, {});
  if (method === "GET" && /\/health$/.test(path)) {
    return jsonResponse(200, {
      ok: true,
      service: "cannashield-email-security-scorecard",
      notionConfigured: Boolean(NOTION_API_KEY && NOTION_DATABASE_ID),
      n8nConfigured: Boolean(N8N_WEBHOOK_URL),
      reportEngine: SCORECARD_REPORT_ENGINE,
      reportTokenRequired: Boolean(SCORECARD_REPORT_TOKEN),
      turnstileRequired: REQUIRE_TURNSTILE,
      turnstileConfigured: Boolean(TURNSTILE_SECRET_KEY),
    });
  }
  if ((method === "GET" || method === "POST") && /\/api\/scorecard\/report$|\/report$/.test(path)) {
    return handleReport(event);
  }
  if (method === "POST" && /\/api\/scorecard\/submit$|\/submit$|\/$/.test(path)) {
    return handleSubmit(event);
  }

  return jsonResponse(404, { ok: false, error: "Not found." });
}

if (require.main === module) {
  const domain = normalizeDomain(process.argv[2]);
  if (!isValidDomain(domain)) {
    console.error("Usage: node scorecard-api-lambda.js example.com");
    process.exit(1);
  }

  analyzeDomain(domain)
    .then((analysis) => {
      console.log(JSON.stringify(publicAnalysis(analysis), null, 2));
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = {
  handler,
  analyzeDomain,
  normalizeDomain,
  publicAnalysis,
  buildReportHtml,
  renderReportPdf,
};
