"use strict";

const fs = require("fs");
const {
  runScan,
  normalizeDomain,
  isValidDomain,
  isValidEmail,
  SECURITY_HEADERS,
} = require("./lib/attack-surface-scan");

const NOTION_API_KEY = String(process.env.NOTION_API_KEY || "").trim();
const NOTION_DATABASE_ID = String(process.env.NOTION_ATTACK_SURFACE_DATABASE_ID || "").trim();
const N8N_WEBHOOK_URL = String(process.env.N8N_ATTACK_SURFACE_WEBHOOK_URL || "").trim();
const TURNSTILE_SECRET_KEY = String(process.env.TURNSTILE_SECRET_KEY || "").trim();
const REQUIRE_TURNSTILE = String(process.env.REQUIRE_TURNSTILE || "false").toLowerCase() === "true";
const REPORT_FROM_EMAIL = String(process.env.REPORT_FROM_EMAIL || "alejo@cannashieldct.com").trim();
const ATTACK_SURFACE_REPORT_ENGINE = String(process.env.ATTACK_SURFACE_REPORT_ENGINE || "lambda").trim().toLowerCase();
const ATTACK_SURFACE_REPORT_TOKEN = String(process.env.ATTACK_SURFACE_REPORT_TOKEN || "").trim();
const HIBP_API_KEY = String(process.env.HIBP_API_KEY || "").trim();

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
