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
  accentSoft: "rgba(212, 162, 76, 0.15)",
  breach: "#C0392B",
  breachSoft: "rgba(192, 57, 43, 0.15)",
  success: "#5CDB95",
  successSoft: "rgba(92, 219, 149, 0.12)",
  warn: "#E06F3E",
  warnSoft: "rgba(224, 111, 62, 0.14)",
};

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function clamp(value, min, max) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : min;
}

function formatDate(value) {
  const d = value ? new Date(value) : new Date();
  if (Number.isNaN(d.getTime())) return "Today";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(d);
}

function tierColor(tier) {
  const t = String(tier || "").toLowerCase();
  if (t === "critical") return BRAND.breach;
  if (t === "high") return BRAND.warn;
  if (t === "medium") return BRAND.accent;
  return BRAND.success;
}

function tierBg(tier) {
  const t = String(tier || "").toLowerCase();
  if (t === "critical") return BRAND.breachSoft;
  if (t === "high") return BRAND.warnSoft;
  if (t === "medium") return BRAND.accentSoft;
  return BRAND.successSoft;
}

function statusDot(pass) {
  const color = pass ? BRAND.success : BRAND.breach;
  return `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};margin-right:6px;flex-shrink:0;"></span>`;
}

function warnDot() {
  return `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${BRAND.accent};margin-right:6px;flex-shrink:0;"></span>`;
}

function buildExecutiveSummary(scan) {
  const tc = tierColor(scan.tier);
  const tb = tierBg(scan.tier);
  const scoreWidth = clamp(scan.score, 0, 150);
  const barWidth = Math.min((scoreWidth / 150) * 100, 100);

  const summaryLines = [];
  const { recon, score, tier } = scan;

  if (recon.shodan.highRiskPorts && recon.shodan.highRiskPorts.length > 0) {
    const ports = recon.shodan.highRiskPorts.map((p) => `${p.service} (${p.port})`).join(", ");
    summaryLines.push(`High-risk network services exposed on IP ${esc(recon.shodan.ip || "unknown")}: ${esc(ports)}.`);
  } else if (recon.shodan.status === "ok") {
    summaryLines.push(`No high-risk management ports (RDP/SMB/Telnet) detected on ${esc(recon.shodan.ip || scan.domain)}.`);
  }

  if (!recon.dns.dmarc.present) {
    summaryLines.push("No DMARC record — spoofed email can reach external inboxes from this domain.");
  } else {
    summaryLines.push(`DMARC policy is ${esc(recon.dns.dmarc.policy)}${recon.dns.dmarc.policy === "none" ? " (monitor only — not enforced)" : ""}.`);
  }

  if (recon.hibp.status === "ok" && recon.hibp.count > 0) {
    summaryLines.push(`${recon.hibp.count} public breach record${recon.hibp.count > 1 ? "s" : ""} found for this domain — credential reuse is a real exposure.`);
  }

  if (recon.certs.count > 10) {
    summaryLines.push(`${recon.certs.count} subdomains exposed in certificate transparency logs — attack surface exceeds a single web property.`);
  }

  return `
    <div style="display:flex;gap:0.22in;align-items:flex-start;">
      <div style="flex:1;min-width:0;">
        <p style="font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND.accent};margin:0 0 6px;font-family:Inter,'Helvetica Neue',Arial,sans-serif;">Executive Summary</p>
        <div style="font-size:10px;line-height:1.55;color:${BRAND.secondary};font-family:Inter,'Helvetica Neue',Arial,sans-serif;">
          ${summaryLines.map((l) => `<p style="margin:0 0 5px;">${l}</p>`).join("")}
        </div>
        <div style="margin-top:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
            <span style="font-size:9px;color:${BRAND.muted};font-family:Inter,'Helvetica Neue',Arial,sans-serif;">Risk Score</span>
            <span style="font-size:9px;color:${tc};font-family:Inter,'Helvetica Neue',Arial,sans-serif;font-weight:600;">${score} pts</span>
          </div>
          <div style="height:4px;background:${BRAND.border};border-radius:2px;overflow:hidden;">
            <div style="height:100%;width:${barWidth}%;background:${tc};border-radius:2px;"></div>
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:3px;font-size:8px;color:${BRAND.muted};font-family:Inter,'Helvetica Neue',Arial,sans-serif;">
            <span>Low</span><span>Medium</span><span>High</span><span>Critical</span>
          </div>
        </div>
      </div>
      <div style="flex-shrink:0;background:${tb};border:1px solid ${tc}40;border-radius:8px;padding:14px 18px;text-align:center;min-width:1.1in;">
        <div style="font-size:28px;font-weight:700;color:${tc};font-family:'Playfair Display',Georgia,serif;line-height:1;">${score}</div>
        <div style="font-size:8px;color:${BRAND.muted};font-family:Inter,'Helvetica Neue',Arial,sans-serif;margin-top:2px;text-transform:uppercase;letter-spacing:0.08em;">Risk Score</div>
        <div style="margin-top:8px;font-size:11px;font-weight:700;color:${tc};font-family:Inter,'Helvetica Neue',Arial,sans-serif;letter-spacing:0.04em;">${esc(tier)}</div>
      </div>
    </div>
  `;
}

function buildEmailSecurity(recon) {
  const { spf, dmarc, dkim, mx } = recon.dns;
  const spfPass = spf.present && spf.status === "pass";
  const spfWarn = spf.present && spf.status !== "pass" && spf.status !== "missing";
  const dmarcPass = dmarc.present && (dmarc.policy === "reject" || dmarc.policy === "quarantine");
  const dmarcWarn = dmarc.present && dmarc.policy === "none";

  const rows = [
    {
      label: "DMARC",
      value: dmarc.present ? `p=${dmarc.policy}` : "Not found",
      detail: dmarc.present
        ? (dmarc.policy === "reject" ? "Enforcement active — spoofed mail rejected." : dmarc.policy === "quarantine" ? "Quarantine enforcement — check spam for false positives." : "Monitor only — spoofed mail is not blocked.")
        : "No DMARC record. Attackers can impersonate this domain with no receiver-side blocking.",
      pass: dmarcPass,
      warn: dmarcWarn,
    },
    {
      label: "SPF",
      value: spf.present ? spf.status : "Not found",
      detail: spf.present
        ? (spfPass ? `Strict enforcement (${esc(spf.allMechanism || "-all")}).` : `Mechanism: ${esc(spf.allMechanism || "none")}. Tighten to -all for full rejection.`)
        : "No SPF record. Any server can claim to send mail from this domain.",
      pass: spfPass,
      warn: spfWarn,
    },
    {
      label: "DKIM",
      value: dkim.detected ? `Detected (${esc(dkim.selector)})` : "Not detected",
      detail: dkim.detected
        ? "Signing key visible on a common selector. Confirm this matches production mail platform."
        : "No DKIM key found on common selectors. This is inconclusive without the exact production selector.",
      pass: dkim.detected,
      warn: false,
    },
    {
      label: "MX Records",
      value: mx.present ? `${mx.records.length} exchange${mx.records.length > 1 ? "s" : ""}` : "Not found",
      detail: mx.present
        ? `Mail exchangers: ${mx.records.slice(0, 2).map(esc).join(", ")}${mx.records.length > 2 ? "…" : ""}`
        : "No MX records detected. Mail delivery and trust checks may be disrupted.",
      pass: mx.present,
      warn: false,
    },
  ];

  return rows.map((row) => {
    const dotFn = row.warn ? warnDot : () => statusDot(row.pass);
    return `
      <div style="display:flex;gap:10px;padding:7px 0;border-bottom:1px solid ${BRAND.border};">
        <div style="flex-shrink:0;width:0.65in;padding-top:2px;">
          <div style="display:flex;align-items:center;">${dotFn()}<span style="font-size:9px;font-weight:600;color:${BRAND.primary};font-family:Inter,'Helvetica Neue',Arial,sans-serif;">${esc(row.label)}</span></div>
        </div>
        <div style="flex-shrink:0;width:1.1in;">
          <span style="font-size:9px;font-weight:600;color:${row.warn ? BRAND.accent : row.pass ? BRAND.success : BRAND.breach};font-family:'Playfair Display',Georgia,serif;">${esc(row.value)}</span>
        </div>
        <div style="flex:1;min-width:0;">
          <p style="font-size:8.5px;color:${BRAND.muted};margin:0;line-height:1.45;font-family:Inter,'Helvetica Neue',Arial,sans-serif;">${esc(row.detail)}</p>
        </div>
      </div>
    `;
  }).join("");
}

function buildExternalExposure(recon) {
  const { shodan, certs } = recon;

  const portsHtml = () => {
    if (shodan.status === "error") {
      return `<p style="font-size:9px;color:${BRAND.muted};margin:0;font-family:Inter,'Helvetica Neue',Arial,sans-serif;">Port data unavailable: ${esc(shodan.error || "scan failed")}.</p>`;
    }
    if (!shodan.openPorts.length) {
      return `<p style="font-size:9px;color:${BRAND.success};margin:0;font-family:Inter,'Helvetica Neue',Arial,sans-serif;">${statusDot(true)}No open ports detected on ${esc(shodan.ip || "resolved IP")}.</p>`;
    }

    const portItems = shodan.openPorts.slice(0, 16).map((port) => {
      const service = shodan.highRiskPorts.find((p) => p.port === port);
      const label = service ? service.service : "Service";
      const isHighRisk = service && service.highPenalty;
      const color = isHighRisk ? BRAND.breach : service ? BRAND.warn : BRAND.secondary;
      return `<div style="display:inline-flex;align-items:center;gap:4px;background:${BRAND.surfaceAlt};border:1px solid ${isHighRisk ? BRAND.breach + "60" : BRAND.border};border-radius:4px;padding:3px 7px;margin:2px;font-family:Inter,'Helvetica Neue',Arial,sans-serif;">
        <span style="font-size:8px;font-weight:700;color:${color};">${port}</span>
        <span style="font-size:7.5px;color:${BRAND.muted};">${esc(label)}</span>
        ${isHighRisk ? `<span style="font-size:7px;color:${BRAND.breach};font-weight:700;"> !</span>` : ""}
      </div>`;
    }).join("");

    return `
      <p style="font-size:8.5px;color:${BRAND.muted};margin:0 0 6px;font-family:Inter,'Helvetica Neue',Arial,sans-serif;">
        IP: <strong style="color:${BRAND.secondary};">${esc(shodan.ip || "unknown")}</strong> — ${shodan.openPorts.length} open port${shodan.openPorts.length > 1 ? "s" : ""} detected${shodan.highRiskPorts.length ? ` (${shodan.highRiskPorts.length} high-risk)` : ""}
      </p>
      <div style="display:flex;flex-wrap:wrap;">${portItems}</div>
      ${shodan.vulns.length ? `<p style="font-size:8px;color:${BRAND.breach};margin:6px 0 0;font-family:Inter,'Helvetica Neue',Arial,sans-serif;">Known CVEs on this IP: ${shodan.vulns.slice(0, 6).map(esc).join(", ")}</p>` : ""}
    `;
  };

  const certsHtml = () => {
    if (certs.status === "error") {
      return `<p style="font-size:9px;color:${BRAND.muted};margin:0;font-family:Inter,'Helvetica Neue',Arial,sans-serif;">Certificate data unavailable: ${esc(certs.error || "query failed")}.</p>`;
    }
    if (!certs.count) {
      return `<p style="font-size:9px;color:${BRAND.secondary};margin:0;font-family:Inter,'Helvetica Neue',Arial,sans-serif;">No subdomains found in certificate transparency logs.</p>`;
    }

    const isLarge = certs.count > 10;
    const displaySubs = certs.subdomains.slice(0, 12);
    return `
      <p style="font-size:8.5px;color:${BRAND.muted};margin:0 0 6px;font-family:Inter,'Helvetica Neue',Arial,sans-serif;">
        ${certs.count} unique subdomain${certs.count > 1 ? "s" : ""} found in cert logs${isLarge ? " — large attack surface" : ""}.${certs.count > 12 ? ` Showing first 12 of ${certs.count}.` : ""}
      </p>
      <div style="display:flex;flex-wrap:wrap;gap:3px;">
        ${displaySubs.map((sub) => `<div style="font-size:8px;color:${BRAND.secondary};background:${BRAND.surfaceAlt};border:1px solid ${BRAND.border};border-radius:3px;padding:2px 6px;font-family:'Courier New',monospace;">${esc(sub)}</div>`).join("")}
        ${certs.count > 12 ? `<div style="font-size:8px;color:${BRAND.muted};padding:2px 6px;font-family:Inter,'Helvetica Neue',Arial,sans-serif;">+${certs.count - 12} more</div>` : ""}
      </div>
    `;
  };

  return `
    <div style="margin-bottom:10px;">
      <p style="font-size:8px;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.muted};margin:0 0 6px;font-family:Inter,'Helvetica Neue',Arial,sans-serif;">Open Ports / Services</p>
      ${portsHtml()}
    </div>
    <div>
      <p style="font-size:8px;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.muted};margin:0 0 6px;font-family:Inter,'Helvetica Neue',Arial,sans-serif;">Subdomains (Certificate Transparency)</p>
      ${certsHtml()}
    </div>
  `;
}

function buildBreachHistory(hibp) {
  if (hibp.status === "skipped") {
    return `<p style="font-size:9px;color:${BRAND.muted};margin:0;font-family:Inter,'Helvetica Neue',Arial,sans-serif;">Breach lookup not available. Configure HIBP_API_KEY to enable full breach history.</p>`;
  }
  if (hibp.status === "error") {
    return `<p style="font-size:9px;color:${BRAND.muted};margin:0;font-family:Inter,'Helvetica Neue',Arial,sans-serif;">Breach lookup encountered an error: ${esc(hibp.error || "check failed")}.</p>`;
  }
  if (!hibp.count) {
    return `<div style="display:flex;align-items:center;gap:6px;">${statusDot(true)}<p style="font-size:9px;color:${BRAND.success};margin:0;font-family:Inter,'Helvetica Neue',Arial,sans-serif;">Domain not found in known public breach records.</p></div>`;
  }

  const rows = hibp.breaches.map((b) => `
    <div style="padding:7px 10px;background:${BRAND.breachSoft};border:1px solid ${BRAND.breach}40;border-radius:5px;margin-bottom:5px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:3px;">
        <span style="font-size:9.5px;font-weight:700;color:${BRAND.breach};font-family:'Playfair Display',Georgia,serif;">${esc(b.title || b.name)}</span>
        <span style="font-size:8px;color:${BRAND.muted};font-family:Inter,'Helvetica Neue',Arial,sans-serif;">${esc(b.breachDate || "Date unknown")}</span>
      </div>
      <p style="font-size:8.5px;color:${BRAND.secondary};margin:0;font-family:Inter,'Helvetica Neue',Arial,sans-serif;">
        ${b.pwnCount ? `${Number(b.pwnCount).toLocaleString()} accounts compromised. ` : ""}
        Data: ${esc(Array.isArray(b.dataClasses) ? b.dataClasses.slice(0, 5).join(", ") : "Unknown")}${b.dataClasses && b.dataClasses.length > 5 ? "…" : ""}
      </p>
    </div>
  `).join("");

  return `
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
      ${statusDot(false)}<span style="font-size:9px;font-weight:600;color:${BRAND.breach};font-family:Inter,'Helvetica Neue',Arial,sans-serif;">${hibp.count} public breach record${hibp.count > 1 ? "s" : ""} matched to this domain</span>
    </div>
    ${rows}
  `;
}

function buildWebHeaders(headers) {
  if (headers.status === "error" && !headers.statusCode) {
    return `<p style="font-size:9px;color:${BRAND.muted};margin:0;font-family:Inter,'Helvetica Neue',Arial,sans-serif;">Web headers unavailable: ${esc(headers.error || "site unreachable")}.</p>`;
  }

  const allChecks = Array.isArray(headers.checks) ? headers.checks : [];
  if (!allChecks.length) {
    return `<p style="font-size:9px;color:${BRAND.muted};margin:0;font-family:Inter,'Helvetica Neue',Arial,sans-serif;">No header data returned.</p>`;
  }

  const rows = allChecks.map((check) => {
    const dotFn = check.present ? statusDot(true) : check.risk === "high" ? statusDot(false) : warnDot();
    const valColor = check.present ? BRAND.success : check.risk === "high" ? BRAND.breach : BRAND.accent;
    const statusText = check.present ? "Present" : "Missing";
    return `
      <div style="display:flex;align-items:flex-start;gap:8px;padding:5px 0;border-bottom:1px solid ${BRAND.border}20;">
        <div style="flex-shrink:0;display:flex;align-items:center;gap:4px;width:1.6in;">${dotFn}<span style="font-size:8.5px;font-weight:600;color:${BRAND.primary};font-family:Inter,'Helvetica Neue',Arial,sans-serif;">${esc(check.name)}</span></div>
        <div style="flex-shrink:0;width:0.55in;"><span style="font-size:8.5px;font-weight:700;color:${valColor};font-family:Inter,'Helvetica Neue',Arial,sans-serif;">${statusText}</span></div>
        <div style="flex:1;font-size:8px;color:${BRAND.muted};font-family:Inter,'Helvetica Neue',Arial,sans-serif;">${check.risk === "high" ? "High-risk" : check.risk === "medium" ? "Medium-risk" : "Low-risk"}</div>
      </div>
    `;
  }).join("");

  const statusStr = headers.statusCode ? ` (HTTP ${headers.statusCode})` : "";
  return `
    <p style="font-size:8px;color:${BRAND.muted};margin:0 0 6px;font-family:Inter,'Helvetica Neue',Arial,sans-serif;">
      Checked ${allChecks.length} security headers${statusStr}. ${headers.missingCount} missing.
    </p>
    ${rows}
  `;
}

function buildRecommendations(recommendations) {
  const recs = Array.isArray(recommendations) ? recommendations.slice(0, 5) : [];
  if (!recs.length) return `<p style="font-size:9px;color:${BRAND.muted};font-family:Inter,'Helvetica Neue',Arial,sans-serif;">No specific findings to recommend action on.</p>`;

  return recs.map((rec, i) => `
    <div style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid ${BRAND.border};">
      <div style="flex-shrink:0;width:20px;height:20px;background:${BRAND.accentSoft};border:1px solid ${BRAND.accent}40;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:8.5px;font-weight:700;color:${BRAND.accent};font-family:Inter,'Helvetica Neue',Arial,sans-serif;text-align:center;line-height:20px;">${i + 1}</div>
      <p style="flex:1;font-size:9px;line-height:1.5;color:${BRAND.secondary};margin:2px 0 0;font-family:Inter,'Helvetica Neue',Arial,sans-serif;">${esc(rec)}</p>
    </div>
  `).join("");
}

function buildSectionHeader(title, color) {
  return `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
      <div style="width:3px;height:14px;background:${color || BRAND.accent};border-radius:2px;flex-shrink:0;"></div>
      <p style="font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.primary};margin:0;font-weight:600;font-family:Inter,'Helvetica Neue',Arial,sans-serif;">${title}</p>
    </div>
  `;
}

function buildHtml(payload) {
  const { lead, scan } = payload;
  const domain = scan.domain || lead.domain || "Unknown";
  const scannedAt = formatDate(scan.scannedAt);
  const tc = tierColor(scan.tier);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CannaShield Attack Surface Snapshot — ${esc(domain)}</title>
  <style>
    @page { size: Letter; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      background: ${BRAND.background};
      color: ${BRAND.primary};
      font-family: Inter, "Helvetica Neue", Arial, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      position: relative;
      width: 8.5in;
      height: 11in;
      padding: 0.36in 0.42in 0.32in;
      overflow: hidden;
      background:
        radial-gradient(circle at 88% 6%, rgba(212,162,76,0.12), transparent 2in),
        ${BRAND.background};
      page-break-after: always;
    }
    .page:last-child { page-break-after: auto; }

    .page::before {
      content: "";
      position: absolute;
      inset: 0 auto 0 0;
      width: 0.07in;
      background: linear-gradient(180deg, ${BRAND.accent}, rgba(212,162,76,0.15));
    }

    .page-content {
      position: relative;
      z-index: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.15in;
      padding-bottom: 0.1in;
      border-bottom: 1px solid ${BRAND.border};
    }

    .logo-area h1 {
      font-size: 13px;
      font-weight: 700;
      font-family: "Playfair Display", Georgia, serif;
      color: ${BRAND.accent};
      letter-spacing: 0.02em;
    }

    .logo-area p {
      font-size: 8px;
      color: ${BRAND.muted};
      margin-top: 2px;
      font-family: Inter, "Helvetica Neue", Arial, sans-serif;
    }

    .meta-area {
      text-align: right;
      font-family: Inter, "Helvetica Neue", Arial, sans-serif;
    }

    .meta-area .domain {
      font-size: 12px;
      font-weight: 700;
      font-family: "Playfair Display", Georgia, serif;
      color: ${BRAND.primary};
    }

    .meta-area .scan-date {
      font-size: 8px;
      color: ${BRAND.muted};
      margin-top: 2px;
    }

    .section {
      background: ${BRAND.surface};
      border: 1px solid ${BRAND.border};
      border-radius: 6px;
      padding: 10px 12px;
      margin-bottom: 8px;
    }

    .section-sm {
      background: ${BRAND.surface};
      border: 1px solid ${BRAND.border};
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 8px;
    }

    .two-col {
      display: flex;
      gap: 8px;
    }

    .two-col .col {
      flex: 1;
      min-width: 0;
      background: ${BRAND.surface};
      border: 1px solid ${BRAND.border};
      border-radius: 6px;
      padding: 10px 12px;
    }

    .footer {
      margin-top: auto;
      padding-top: 8px;
      border-top: 1px solid ${BRAND.border};
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer p {
      font-size: 8px;
      color: ${BRAND.muted};
      font-family: Inter, "Helvetica Neue", Arial, sans-serif;
    }

    .cta-pill {
      display: inline-block;
      background: ${BRAND.accent};
      color: #0A0A0B;
      font-size: 8.5px;
      font-weight: 700;
      font-family: Inter, "Helvetica Neue", Arial, sans-serif;
      padding: 5px 12px;
      border-radius: 100px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .tier-badge {
      display: inline-block;
      background: ${tierBg(scan.tier)};
      border: 1px solid ${tc}60;
      color: ${tc};
      font-size: 9px;
      font-weight: 700;
      font-family: Inter, "Helvetica Neue", Arial, sans-serif;
      padding: 4px 10px;
      border-radius: 100px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    @media print {
      .page { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>

  <!-- PAGE 1: Header, Executive Summary, Email Security, External Exposure -->
  <div class="page">
    <div class="page-content">

      <div class="topbar">
        <div class="logo-area">
          <h1>CannaShield</h1>
          <p>Attack Surface Snapshot — Confidential</p>
        </div>
        <div class="meta-area">
          <div class="domain">${esc(domain)}</div>
          <div class="scan-date">Scanned ${esc(scannedAt)}</div>
          <div style="margin-top:5px;"><span class="tier-badge">${esc(scan.tier)} Risk</span></div>
        </div>
      </div>

      <!-- Executive Summary -->
      <div class="section">
        ${buildExecutiveSummary(scan)}
      </div>

      <!-- Two-col: Email Security + External Exposure -->
      <div class="two-col" style="flex:1;min-height:0;">
        <div class="col" style="flex:0.85;">
          ${buildSectionHeader("Email Security", BRAND.accent)}
          ${buildEmailSecurity(scan.recon)}
        </div>
        <div class="col" style="flex:1.15;">
          ${buildSectionHeader("External Exposure", BRAND.warn)}
          ${buildExternalExposure(scan.recon)}
        </div>
      </div>

      <div class="footer">
        <p>cannashieldct.com &nbsp;|&nbsp; Cannabis Cybersecurity &amp; vCISO Services &nbsp;|&nbsp; alejo@cannashieldct.com</p>
        <p>Page 1 of 2</p>
      </div>

    </div>
  </div>

  <!-- PAGE 2: Breach History, Web Headers, Recommendations, CTA -->
  <div class="page">
    <div class="page-content">

      <div class="topbar">
        <div class="logo-area">
          <h1>CannaShield</h1>
          <p>${esc(domain)} — Attack Surface Snapshot</p>
        </div>
        <div class="meta-area">
          <div style="font-size:9px;color:${BRAND.muted};font-family:Inter,'Helvetica Neue',Arial,sans-serif;">Risk Score</div>
          <div style="font-size:20px;font-weight:700;font-family:'Playfair Display',Georgia,serif;color:${tc};">${scan.score}</div>
        </div>
      </div>

      <!-- Breach History -->
      <div class="section-sm">
        ${buildSectionHeader("Breach History", BRAND.breach)}
        ${buildBreachHistory(scan.recon.hibp)}
      </div>

      <!-- Web Security Headers -->
      <div class="section-sm">
        ${buildSectionHeader("Web Security Headers", BRAND.accent)}
        ${buildWebHeaders(scan.recon.headers)}
      </div>

      <!-- Recommendations -->
      <div class="section" style="flex:1;">
        ${buildSectionHeader("Prioritized Recommendations", tc)}
        ${buildRecommendations(scan.recommendations)}
      </div>

      <!-- About CannaShield + CTA -->
      <div style="background:${BRAND.accentSoft};border:1px solid ${BRAND.accent}40;border-radius:6px;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <div>
          <p style="font-size:9.5px;font-weight:700;color:${BRAND.primary};font-family:'Playfair Display',Georgia,serif;margin-bottom:3px;">CannaShield CT — vCISO for Cannabis Operators</p>
          <p style="font-size:8.5px;color:${BRAND.secondary};font-family:Inter,'Helvetica Neue',Arial,sans-serif;max-width:4.8in;line-height:1.5;">
            This snapshot surfaces passive recon signals. A full CannaShield assessment covers your internal network, POS segmentation, METRC integration, vendor access, and license protection posture — the risks that attackers exploit before you know they're inside.
          </p>
        </div>
        <div style="flex-shrink:0;text-align:center;padding-left:14px;">
          <span class="cta-pill">Book a Call</span>
          <p style="font-size:7.5px;color:${BRAND.muted};font-family:Inter,'Helvetica Neue',Arial,sans-serif;margin-top:4px;">cannashieldct.com</p>
        </div>
      </div>

      <div class="footer">
        <p>This report is for the named recipient only. CannaShield findings are based on passive, non-intrusive recon. No systems were accessed or tested.</p>
        <p>Page 2 of 2</p>
      </div>

    </div>
  </div>

</body>
</html>`;
}

// --- CLI for local generation ---

function readPayload(inputPath) {
  const raw = fs.readFileSync(inputPath, "utf8");
  const payload = JSON.parse(raw);
  if (!payload.scan && !payload.domain) {
    throw new Error("Input JSON must contain a scan object or a top-level scan payload.");
  }
  return { lead: payload.lead || {}, scan: payload.scan || payload };
}

function renderPdf(htmlPath, outputPdf) {
  const result = spawnSync("google-chrome", [
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--print-to-pdf=" + outputPdf,
    "--print-to-pdf-no-header",
    "file://" + htmlPath,
  ]);
  if (result.error) {
    console.warn("Chrome not available for direct PDF render:", result.error.message);
  }
}

if (require.main === module) {
  const inputPath = process.argv[2] || DEFAULT_INPUT;
  const payload = readPayload(inputPath);
  const html = buildHtml(payload);

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const domain = payload.scan.domain || "scan";
  const slug = domain.replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");

  const htmlPath = path.join(OUTPUT_DIR, `${slug}-attack-surface-snapshot.html`);
  fs.writeFileSync(htmlPath, html, "utf8");
  console.log(`HTML written: ${htmlPath}`);

  const pdfPath = path.join(OUTPUT_DIR, `${slug}-attack-surface-snapshot.pdf`);
  renderPdf(htmlPath, pdfPath);
}

module.exports = { buildHtml };
