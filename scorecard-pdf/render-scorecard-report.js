#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = __dirname;
const DEFAULT_INPUT = path.join(ROOT, "sample-data.json");
const OUTPUT_DIR = path.join(ROOT, "dist");

const BRAND = {
  background: "#0A0A0B",
  surface: "#111114",
  surfaceAlt: "#17171D",
  border: "#2A261D",
  primary: "#F0EDE8",
  secondary: "#A9A29A",
  muted: "#77717A",
  accent: "#D4A24C",
  accentSoft: "rgba(212, 162, 76, 0.16)",
  breach: "#C0392B",
  success: "#5CDB95",
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function readPayload(inputPath) {
  const raw = fs.readFileSync(inputPath, "utf8");
  const payload = JSON.parse(raw);
  if (!payload.analysis && !payload.domain) {
    throw new Error("Input JSON must contain an analysis object or a top-level scorecard analysis payload.");
  }
  return {
    lead: payload.lead || {},
    analysis: payload.analysis || payload,
  };
}

function formatDate(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "Generated today";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function slugify(value) {
  return String(value || "scorecard")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "scorecard";
}

function statusTone(status) {
  const normalized = String(status || "").toLowerCase();
  if (["pass", "detected", "low"].includes(normalized)) return "pass";
  if (["warn", "not detected", "moderate"].includes(normalized)) return "warn";
  return "fail";
}

function toneColor(tone) {
  if (tone === "pass") return BRAND.success;
  if (tone === "warn") return BRAND.accent;
  return BRAND.breach;
}

function firstWarning(warnings) {
  return Array.isArray(warnings) && warnings.length ? warnings[0] : "";
}

function joinList(values, fallback) {
  return Array.isArray(values) && values.length ? values.join(", ") : fallback;
}

function normalizeChecks(analysis) {
  const checks = analysis.checks || {};
  const dmarc = checks.dmarc || analysis.dmarc || {};
  const spf = checks.spf || analysis.spf || {};
  const dkim = checks.dkim || analysis.dkim || {};
  const mx = checks.mx || analysis.mx || {};

  return [
    {
      label: "DMARC",
      status: dmarc.policy ? `p=${dmarc.policy}` : dmarc.status || "unknown",
      eyebrow: dmarc.hasReporting || dmarc.tags?.rua ? "Reporting enabled" : "No aggregate reporting",
      detail:
        firstWarning(dmarc.warnings) ||
        `Policy ${dmarc.policy || "unknown"} tells receivers how to handle unauthenticated mail.`,
      tone: statusTone(dmarc.status || dmarc.policy),
    },
    {
      label: "SPF",
      status: spf.status || "unknown",
      eyebrow: `Mechanism ${spf.allMechanism || "not detected"}`,
      detail:
        firstWarning(spf.warnings) ||
        `DNS lookup count: ${spf.lookupCount ?? "unknown"}. Keep the sender list tight and below receiver limits.`,
      tone: statusTone(spf.status),
    },
    {
      label: "DKIM",
      status: dkim.status || "unknown",
      eyebrow: joinList(dkim.detectedSelectors, "No common selector found"),
      detail:
        firstWarning(dkim.warnings) ||
        "Signing is visible on common selectors. Confirm this matches the production mail platform.",
      tone: statusTone(dkim.status),
    },
    {
      label: "MX",
      status: mx.status || "unknown",
      eyebrow: joinList(mx.records, "No mail exchangers detected"),
      detail:
        mx.status === "missing"
          ? "No MX records were detected, which can disrupt mail flow and receiver trust checks."
          : "Mail exchangers are visible. Review admin access and vendor ownership during remediation.",
      tone: statusTone(mx.status),
    },
  ];
}

function riskProfile(score, tier) {
  const normalizedTier = String(tier || "").toLowerCase();
  if (normalizedTier === "critical" || score < 45) {
    return {
      color: BRAND.breach,
      label: "Immediate spoofing exposure",
      summary:
        "Attackers have a realistic path to impersonate this domain and abuse vendor trust unless authentication controls are enforced.",
    };
  }
  if (normalizedTier === "high" || score < 70) {
    return {
      color: "#E06F3E",
      label: "Material spoofing exposure",
      summary:
        "Core controls exist, but enforcement gaps still leave finance, payroll, and vendor workflows exposed to inconsistent receiver handling.",
    };
  }
  if (normalizedTier === "moderate" || score < 85) {
    return {
      color: BRAND.accent,
      label: "Partially controlled exposure",
      summary:
        "The domain is moving in the right direction. Tightening enforcement and sender inventory will reduce abuse paths.",
    };
  }
  return {
    color: BRAND.success,
    label: "Low direct spoofing exposure",
    summary:
      "The main controls are aligned. Keep monitoring reports, vendor changes, and finance verification workflows current.",
  };
}

function recommendationRows(recommendations) {
  const safe = Array.isArray(recommendations) ? recommendations.slice(0, 4) : [];
  const fallback = [
    "Validate all legitimate email senders before changing enforcement.",
    "Move DMARC toward quarantine, then reject, once sender alignment is clean.",
    "Document DKIM selectors and ownership for every production mail platform.",
    "Review vendor payment and payroll-change verification with finance.",
  ];
  return (safe.length ? safe : fallback)
    .slice(0, 4)
    .map((item, index) => {
      return `
        <li class="recommendation-row">
          <span>${index + 1}</span>
          <p>${escapeHtml(item)}</p>
        </li>
      `;
    })
    .join("");
}

function checkCards(checks) {
  return checks
    .map((check) => {
      const tone = check.tone || "warn";
      return `
        <article class="check-card check-${tone}">
          <div class="check-card-top">
            <h3>${escapeHtml(check.label)}</h3>
            <span>${escapeHtml(check.status)}</span>
          </div>
          <strong>${escapeHtml(check.eyebrow)}</strong>
          <p>${escapeHtml(check.detail)}</p>
        </article>
      `;
    })
    .join("");
}

function buildHtml(payload) {
  const { lead, analysis } = payload;
  const score = clamp(analysis.score, 0, 100);
  const tier = analysis.riskTier || "Unknown";
  const risk = riskProfile(score, tier);
  const checks = normalizeChecks(analysis);
  const generatedAt = formatDate(analysis.generatedAt);
  const domain = analysis.domain || lead.domain || "Unknown domain";
  const company = lead.company || domain;
  const scoreDegrees = Math.round((score / 100) * 360);
  const spoof = analysis.spoofScenario || {};

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CannaShield Email Security Scorecard - ${escapeHtml(domain)}</title>
  <style>
    @page {
      size: Letter;
      margin: 0;
    }

    * {
      box-sizing: border-box;
    }

    html,
    body {
      margin: 0;
      min-height: 100%;
      background: ${BRAND.background};
      color: ${BRAND.primary};
      font-family: Inter, "Helvetica Neue", Arial, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      display: grid;
      place-items: start center;
    }

    .report-page {
      position: relative;
      width: 8.5in;
      height: 11in;
      overflow: hidden;
      padding: 0.38in 0.42in 0.34in;
      background:
        radial-gradient(circle at 85% 8%, rgba(212, 162, 76, 0.14), transparent 2.1in),
        linear-gradient(125deg, rgba(255, 255, 255, 0.032) 0 1px, transparent 1px 22px),
        ${BRAND.background};
    }

    .report-page::before {
      content: "";
      position: absolute;
      inset: 0 auto 0 0;
      width: 0.08in;
      background: linear-gradient(180deg, ${BRAND.accent}, rgba(212, 162, 76, 0.18));
    }

    .report-page::after {
      content: "";
      position: absolute;
      right: -1.1in;
      bottom: -1.4in;
      width: 3.4in;
      height: 3.4in;
      border: 1px solid rgba(212, 162, 76, 0.2);
      border-radius: 999px;
    }

    .report-content {
      position: relative;
      z-index: 1;
      height: 100%;
      display: grid;
      grid-template-rows: auto auto auto auto auto 1fr auto;
      gap: 0.17in;
    }

    .topbar {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.24in;
      padding-bottom: 0.14in;
      border-bottom: 1px solid rgba(212, 162, 76, 0.28);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.13in;
    }

    .brand-mark {
      width: 0.46in;
      height: 0.46in;
      display: grid;
      place-items: center;
      border: 1px solid rgba(212, 162, 76, 0.72);
      background: linear-gradient(135deg, rgba(212, 162, 76, 0.2), rgba(255, 255, 255, 0.03));
      color: ${BRAND.accent};
      font-family: Georgia, "Times New Roman", serif;
      font-size: 12pt;
      font-weight: 700;
      letter-spacing: 0;
    }

    .brand-name {
      margin: 0;
      color: ${BRAND.primary};
      font-size: 13pt;
      font-weight: 800;
      letter-spacing: 0.02em;
    }

    .brand-subtitle,
    .meta p,
    .eyebrow,
    .fine-print,
    .score-label,
    .protocol-weight {
      margin: 0;
      color: ${BRAND.secondary};
      font-size: 7.6pt;
      line-height: 1.35;
    }

    .meta {
      text-align: right;
    }

    .meta strong {
      display: block;
      color: ${BRAND.primary};
      font-size: 8.7pt;
      margin-bottom: 0.02in;
    }

    .hero {
      display: grid;
      grid-template-columns: 1fr 1.9in;
      gap: 0.22in;
      align-items: stretch;
    }

    .eyebrow {
      color: ${BRAND.accent};
      font-weight: 800;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0.06in 0 0;
      max-width: 5.3in;
      color: ${BRAND.primary};
      font-family: Georgia, "Times New Roman", serif;
      font-size: 27pt;
      line-height: 1.04;
      font-weight: 700;
      letter-spacing: 0;
    }

    .domain-line {
      margin: 0.09in 0 0;
      color: ${BRAND.secondary};
      font-size: 9.4pt;
      line-height: 1.45;
    }

    .domain-line strong {
      color: ${BRAND.primary};
    }

    .score-panel {
      min-height: 1.55in;
      padding: 0.15in;
      border: 1px solid rgba(212, 162, 76, 0.32);
      background: linear-gradient(180deg, rgba(212, 162, 76, 0.1), rgba(17, 17, 20, 0.94));
    }

    .score-ring {
      width: 1.08in;
      height: 1.08in;
      margin: 0 auto 0.09in;
      display: grid;
      place-items: center;
      border-radius: 999px;
      background:
        radial-gradient(circle, ${BRAND.surface} 0 53%, transparent 54%),
        conic-gradient(${risk.color} 0 ${scoreDegrees}deg, rgba(255, 255, 255, 0.08) ${scoreDegrees}deg 360deg);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
    }

    .score-ring strong {
      color: ${BRAND.primary};
      font-family: Georgia, "Times New Roman", serif;
      font-size: 24pt;
      line-height: 1;
    }

    .score-panel h2 {
      margin: 0;
      color: ${risk.color};
      font-size: 10pt;
      line-height: 1.2;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .score-panel p {
      margin: 0.06in 0 0;
      color: ${BRAND.secondary};
      font-size: 7.8pt;
      line-height: 1.42;
      text-align: center;
    }

    .risk-summary {
      padding: 0.13in 0.16in;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(17, 17, 20, 0.86);
    }

    .risk-summary h2,
    .spoof h2,
    .section-title {
      margin: 0;
      color: ${BRAND.primary};
      font-size: 10.6pt;
      line-height: 1.2;
      font-weight: 800;
    }

    .risk-summary p {
      margin: 0.05in 0 0;
      color: ${BRAND.secondary};
      font-size: 8.3pt;
      line-height: 1.48;
    }

    .protocol-weights {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.07in;
      margin-top: 0.1in;
    }

    .protocol-weight {
      padding: 0.07in 0.08in;
      border: 1px solid rgba(212, 162, 76, 0.2);
      background: rgba(212, 162, 76, 0.06);
    }

    .protocol-weight strong {
      display: block;
      color: ${BRAND.primary};
      font-size: 8.3pt;
      margin-bottom: 0.02in;
    }

    .check-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.09in;
    }

    .check-card {
      min-height: 1.42in;
      padding: 0.12in;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: ${BRAND.surface};
    }

    .check-card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.07in;
      margin-bottom: 0.09in;
    }

    .check-card h3 {
      margin: 0;
      color: ${BRAND.primary};
      font-size: 9.6pt;
    }

    .check-card span {
      padding: 0.03in 0.055in;
      border: 1px solid currentColor;
      color: ${BRAND.accent};
      font-size: 6.6pt;
      font-weight: 800;
      line-height: 1;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .check-pass span {
      color: ${BRAND.success};
    }

    .check-fail span {
      color: ${BRAND.breach};
    }

    .check-card strong {
      display: block;
      min-height: 0.26in;
      color: ${BRAND.primary};
      font-size: 7.9pt;
      line-height: 1.32;
    }

    .check-card p {
      margin: 0.07in 0 0;
      color: ${BRAND.secondary};
      font-size: 7.3pt;
      line-height: 1.38;
    }

    .spoof {
      display: grid;
      grid-template-columns: 1.7in 1fr;
      gap: 0.16in;
      padding: 0.13in 0.16in;
      border-left: 0.045in solid ${BRAND.accent};
      background: linear-gradient(90deg, rgba(212, 162, 76, 0.12), rgba(17, 17, 20, 0.9));
    }

    .spoof-outcome {
      margin: 0.06in 0 0;
      color: ${risk.color};
      font-family: Georgia, "Times New Roman", serif;
      font-size: 15pt;
      line-height: 1.1;
    }

    .spoof p {
      margin: 0;
      color: ${BRAND.secondary};
      font-size: 8.1pt;
      line-height: 1.45;
    }

    .spoof strong {
      color: ${BRAND.primary};
    }

    .recommendations {
      display: grid;
      grid-template-columns: 1fr 2.55in;
      gap: 0.18in;
      align-items: stretch;
    }

    .recommendation-list {
      display: grid;
      gap: 0.055in;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .recommendation-row {
      display: grid;
      grid-template-columns: 0.24in 1fr;
      gap: 0.08in;
      align-items: start;
      padding: 0.075in 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .recommendation-row span {
      display: grid;
      width: 0.22in;
      height: 0.22in;
      place-items: center;
      border: 1px solid rgba(212, 162, 76, 0.5);
      color: ${BRAND.accent};
      font-size: 7pt;
      font-weight: 900;
    }

    .recommendation-row p {
      margin: 0;
      color: ${BRAND.primary};
      font-size: 8pt;
      line-height: 1.35;
    }

    .service-path {
      padding: 0.13in;
      border: 1px solid rgba(212, 162, 76, 0.28);
      background: ${BRAND.surfaceAlt};
    }

    .service-path p {
      margin: 0.08in 0 0;
      color: ${BRAND.secondary};
      font-size: 7.8pt;
      line-height: 1.42;
    }

    .service-tags {
      display: grid;
      gap: 0.055in;
      margin-top: 0.11in;
    }

    .service-tags span {
      display: block;
      padding: 0.055in 0.07in;
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: ${BRAND.primary};
      background: rgba(10, 10, 11, 0.58);
      font-size: 7.45pt;
      line-height: 1.25;
    }

    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.2in;
      padding-top: 0.1in;
      border-top: 1px solid rgba(212, 162, 76, 0.22);
    }

    .footer strong {
      color: ${BRAND.primary};
    }

    .fine-print {
      max-width: 5.65in;
    }

    .fine-print a {
      color: ${BRAND.accent};
      text-decoration: none;
    }

    .cta {
      color: ${BRAND.background};
      background: ${BRAND.accent};
      padding: 0.075in 0.1in;
      font-size: 8pt;
      font-weight: 900;
      text-decoration: none;
      white-space: nowrap;
    }
  </style>
</head>
<body>
  <main class="report-page" aria-label="CannaShield Email Security Scorecard report">
    <div class="report-content">
      <header class="topbar">
        <div class="brand">
          <div class="brand-mark">CS</div>
          <div>
            <p class="brand-name">CannaShield</p>
            <p class="brand-subtitle">Cannabis cybersecurity. Built for operators.</p>
          </div>
        </div>
        <div class="meta">
          <strong>Email Security Scorecard</strong>
          <p>${escapeHtml(generatedAt)} / ${escapeHtml(company)}</p>
          <p>Prepared for prospect review</p>
        </div>
      </header>

      <section class="hero">
        <div>
          <p class="eyebrow">DMARC / SPF / DKIM analysis</p>
          <h1>Can attackers spoof ${escapeHtml(domain)}?</h1>
          <p class="domain-line">
            CannaShield reviewed public email-authentication signals for <strong>${escapeHtml(domain)}</strong>
            to estimate direct domain impersonation risk, receiver handling, and the next controls to tighten.
          </p>
        </div>
        <aside class="score-panel" aria-label="Risk score">
          <div class="score-ring"><strong>${score}</strong></div>
          <h2>${escapeHtml(tier)} risk</h2>
          <p>${escapeHtml(risk.label)}</p>
        </aside>
      </section>

      <section class="risk-summary">
        <h2>Risk scoring</h2>
        <p>${escapeHtml(risk.summary)}</p>
        <div class="protocol-weights" aria-label="Score model">
          <div class="protocol-weight"><strong>DMARC 40</strong>Policy and reporting</div>
          <div class="protocol-weight"><strong>SPF 30</strong>Sender authorization</div>
          <div class="protocol-weight"><strong>DKIM 20</strong>Cryptographic signing</div>
          <div class="protocol-weight"><strong>MX + alignment 10</strong>Mail flow signals</div>
        </div>
      </section>

      <section class="check-grid" aria-label="Protocol analysis">
        ${checkCards(checks)}
      </section>

      <section class="spoof" aria-label="Spoof scenario assessment">
        <div>
          <p class="eyebrow">Spoof scenario</p>
          <h2 class="spoof-outcome">${escapeHtml(spoof.outcome || "Scenario requires review")}</h2>
        </div>
        <p>
          <strong>Scenario tested:</strong> an attacker sends a vendor invoice or payroll-change request from a lookalike
          or direct spoof of this domain to a cannabis finance workflow. ${escapeHtml(spoof.detail || "Receiver behavior depends on DMARC enforcement, sender alignment, and mailbox filtering.")}
        </p>
      </section>

      <section class="recommendations" aria-label="CannaShield recommendations">
        <div>
          <p class="eyebrow">CannaShield recommendations</p>
          <h2 class="section-title">Controls to prioritize before the next invoice, renewal, or audit.</h2>
          <ul class="recommendation-list">
            ${recommendationRows(analysis.recommendations)}
          </ul>
        </div>
        <aside class="service-path">
          <h2 class="section-title">Recommended path</h2>
          <p>
            Treat email authentication as the front door to downtime prevention, insurance readiness,
            and license-protection evidence.
          </p>
          <div class="service-tags">
            <span><strong>DP-2:</strong> BEC/Phishing Defense Sprint for finance and vendor workflows.</span>
            <span><strong>IQ-1:</strong> Insurance readiness evidence for MFA, IR, EDR, and email controls.</span>
            <span><strong>LP-1:</strong> Ongoing GRC foundations and audit-ready control evidence.</span>
          </div>
        </aside>
      </section>

      <footer class="footer">
        <p class="fine-print">
          <strong>Scope:</strong> Public DNS and email-authentication signals only. This scorecard is not a full penetration test,
          legal opinion, or guarantee of mailbox filtering outcomes.
          Questions: <a href="mailto:alejo@cannashieldct.com">alejo@cannashieldct.com</a>.
        </p>
        <a class="cta" href="https://calendly.com/cannashieldct">Book remediation review</a>
      </footer>
    </div>
  </main>
</body>
</html>`;
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "google-chrome",
    "chromium",
    "chromium-browser",
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (candidate.includes(path.sep) && fs.existsSync(candidate)) return candidate;
    if (!candidate.includes(path.sep)) {
      const result = spawnSync("which", [candidate], { encoding: "utf8" });
      if (result.status === 0 && result.stdout.trim()) return result.stdout.trim();
    }
  }
  return "";
}

function renderPdf(htmlPath, pdfPath) {
  const chrome = findChrome();
  if (!chrome) {
    return { ok: false, skipped: true, message: "Chrome/Chromium was not found. HTML output is ready." };
  }

  const result = spawnSync(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--run-all-compositor-stages-before-draw",
      `--print-to-pdf=${pdfPath}`,
      `file://${htmlPath}`,
    ],
    { encoding: "utf8" },
  );

  if (result.status !== 0) {
    return {
      ok: false,
      skipped: false,
      message: result.stderr || result.stdout || "Chrome PDF rendering failed.",
    };
  }

  return { ok: true, skipped: false, message: `PDF written to ${pdfPath}` };
}

function main() {
  const inputPath = path.resolve(process.argv[2] || DEFAULT_INPUT);
  const htmlOnly = process.argv.includes("--html-only");
  const payload = readPayload(inputPath);
  const domainSlug = slugify(payload.analysis.domain || payload.lead.company);
  const html = buildHtml(payload);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const htmlPath = path.join(OUTPUT_DIR, `${domainSlug}-email-security-scorecard.html`);
  const pdfPath = path.join(OUTPUT_DIR, `${domainSlug}-email-security-scorecard.pdf`);
  fs.writeFileSync(htmlPath, html, "utf8");

  console.log(`HTML written to ${htmlPath}`);
  if (!htmlOnly) {
    const result = renderPdf(htmlPath, pdfPath);
    console.log(result.message);
    if (!result.ok && !result.skipped) process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  buildHtml,
  normalizeChecks,
  riskProfile,
};
