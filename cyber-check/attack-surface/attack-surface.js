(function () {
  "use strict";

  const config = window.CANNASHIELD_SNAPSHOT || {};
  const form = document.getElementById("snapshot-form");
  const submitButton = document.getElementById("snapshot-submit");
  const statusEl = document.getElementById("snapshot-status");
  const resultEl = document.getElementById("snapshot-result");
  const turnstileEl = document.getElementById("turnstile-widget");
  const turnstileNote = document.getElementById("turnstile-note");
  let turnstileWidgetId = null;

  function loadSharedPartials() {
    const navbar = document.getElementById("navbar-placeholder");
    const footer = document.getElementById("footer-placeholder");
    if (navbar) {
      fetch("../../navbar.html")
        .then((r) => r.text())
        .then((html) => { navbar.innerHTML = html; })
        .catch(() => {});
    }
    if (footer) {
      fetch("../../footer.html")
        .then((r) => r.text())
        .then((html) => { footer.innerHTML = html; })
        .catch(() => {});
    }
  }

  function setStatus(message, type) {
    statusEl.textContent = message || "";
    statusEl.className = ("snapshot-status " + (type || "")).trim();
  }

  function getTurnstileToken() {
    if (!window.turnstile || turnstileWidgetId === null) return "";
    return window.turnstile.getResponse(turnstileWidgetId);
  }

  function resetTurnstile() {
    if (window.turnstile && turnstileWidgetId !== null) {
      window.turnstile.reset(turnstileWidgetId);
    }
  }

  function initTurnstile() {
    const siteKey = String(config.turnstileSiteKey || "");
    if (!turnstileEl) return;
    if (!siteKey || siteKey === "TURNSTILE_SITE_KEY_HERE") {
      turnstileEl.hidden = true;
      if (turnstileNote) turnstileNote.hidden = false;
      return;
    }
    const render = function () {
      if (!window.turnstile || turnstileWidgetId !== null) return;
      turnstileWidgetId = window.turnstile.render(turnstileEl, {
        sitekey: siteKey,
        theme: "dark",
      });
    };
    const interval = window.setInterval(function () {
      if (window.turnstile) { window.clearInterval(interval); render(); }
    }, 100);
  }

  function tierClass(tier) {
    const t = String(tier || "").toLowerCase();
    if (t === "critical") return "tier-critical";
    if (t === "high") return "tier-high";
    if (t === "medium") return "tier-medium";
    return "tier-low";
  }

  function portsBadge(shodan) {
    if (shodan.status === "error") return { text: "Unavailable", cls: "badge-muted" };
    const highRisk = (shodan.highRiskPorts || []).filter((p) => p.highPenalty);
    if (highRisk.length) return { text: highRisk.map((p) => p.service + " (" + p.port + ")").join(", "), cls: "badge-fail" };
    const total = (shodan.openPorts || []).length;
    if (total === 0) return { text: "None detected", cls: "badge-pass" };
    return { text: total + " open port" + (total > 1 ? "s" : ""), cls: "badge-warn" };
  }

  function subdomainsBadge(certs) {
    if (certs.status === "error") return { text: "Unavailable", cls: "badge-muted" };
    const n = certs.count || 0;
    if (n === 0) return { text: "None found", cls: "badge-pass" };
    if (n > 10) return { text: n + " exposed", cls: "badge-warn" };
    return { text: n + " found", cls: "badge-neutral" };
  }

  function breachBadge(hibp) {
    if (hibp.status === "skipped") return { text: "Skipped", cls: "badge-muted" };
    if (hibp.status === "error") return { text: "Unavailable", cls: "badge-muted" };
    const n = hibp.count || 0;
    if (n === 0) return { text: "None found", cls: "badge-pass" };
    return { text: n + " breach" + (n > 1 ? "es" : "") + " found", cls: "badge-fail" };
  }

  function emailBadge(dns) {
    const d = dns.dmarc;
    if (!d.present) return { text: "No DMARC", cls: "badge-fail" };
    if (d.policy === "reject") return { text: "DMARC reject", cls: "badge-pass" };
    if (d.policy === "quarantine") return { text: "DMARC quarantine", cls: "badge-warn" };
    return { text: "DMARC monitor", cls: "badge-warn" };
  }

  function headersBadge(headers) {
    if (headers.status === "error") return { text: "Unavailable", cls: "badge-muted" };
    const missing = headers.missingCount || 0;
    if (missing === 0) return { text: "All present", cls: "badge-pass" };
    if (missing > 3) return { text: missing + " missing", cls: "badge-fail" };
    return { text: missing + " missing", cls: "badge-warn" };
  }

  function setSummaryCard(id, badgeId, noteId, badge, note) {
    const el = document.getElementById(badgeId);
    const noteEl = document.getElementById(noteId);
    if (el) {
      el.textContent = badge.text;
      el.className = "summary-card-val " + badge.cls;
    }
    if (noteEl) noteEl.textContent = note;
  }

  function renderBreakdown(breakdown) {
    const container = document.getElementById("breakdown-pills");
    const wrapper = document.getElementById("snapshot-breakdown");
    if (!container || !wrapper || !Array.isArray(breakdown) || !breakdown.length) return;

    container.innerHTML = "";
    breakdown.forEach(function (item) {
      const pill = document.createElement("div");
      pill.className = "breakdown-pill";
      pill.innerHTML =
        '<span class="pill-reason">' + escapeHtml(item.reason) + '</span>' +
        '<span class="pill-pts">+' + item.points + ' pts</span>';
      container.appendChild(pill);
    });
    wrapper.hidden = false;
  }

  function renderRecommendations(recs) {
    const list = document.getElementById("result-recommendations");
    if (!list) return;
    list.innerHTML = "";
    (recs || []).forEach(function (item) {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderResult(scan) {
    const { recon, scoring, recommendations } = scan;

    document.getElementById("result-domain").textContent = scan.domain;
    document.getElementById("result-score").textContent = scan.score + " pts";
    const tierEl = document.getElementById("result-tier");
    tierEl.textContent = scan.tier;
    tierEl.className = tierClass(scan.tier);

    setSummaryCard(
      "summary-ports", "result-ports-badge", "result-ports-note",
      portsBadge(recon.shodan),
      recon.shodan.status === "ok"
        ? (recon.shodan.highRiskPorts.length ? "High-risk services exposed" : recon.shodan.openPorts.length + " ports on " + recon.shodan.ip)
        : "Port data unavailable"
    );

    setSummaryCard(
      "summary-subdomains", "result-subdomains-badge", "result-subdomains-note",
      subdomainsBadge(recon.certs),
      recon.certs.count > 0
        ? "From certificate transparency logs"
        : recon.certs.status === "error" ? "crt.sh query failed" : "No subdomains in cert logs"
    );

    setSummaryCard(
      "summary-breach", "result-breach-badge", "result-breach-note",
      breachBadge(recon.hibp),
      recon.hibp.count > 0
        ? "Credential reuse is a real risk"
        : recon.hibp.status === "skipped" ? "HIBP key not configured" : "Domain not in public breach records"
    );

    setSummaryCard(
      "summary-email", "result-email-badge", "result-email-note",
      emailBadge(recon.dns),
      recon.dns.spf.present
        ? "SPF: " + recon.dns.spf.status + (recon.dns.dkim.detected ? " · DKIM detected" : "")
        : "No SPF or DMARC — domain spoofing risk"
    );

    setSummaryCard(
      "summary-headers", "result-headers-badge", "result-headers-note",
      headersBadge(recon.headers),
      recon.headers.missingCount > 0
        ? recon.headers.missing.join(", ")
        : recon.headers.status === "error" ? "Site unreachable" : "All security headers present"
    );

    renderBreakdown(scoring && scoring.breakdown);
    renderRecommendations(recommendations);

    resultEl.hidden = false;
    resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function payloadFromForm() {
    const data = new FormData(form);
    return {
      domain: data.get("domain"),
      email: data.get("email"),
      name: data.get("name"),
      company: data.get("company"),
      consent: data.get("consent") === "on",
      turnstileToken: getTurnstileToken(),
    };
  }

  async function submitSnapshot(event) {
    event.preventDefault();
    setStatus("Running recon — checking ports, certs, breaches, DNS, and headers...", "loading");
    submitButton.disabled = true;
    submitButton.textContent = "Scanning...";

    try {
      const response = await fetch(config.apiEndpoint || "/api/attack-surface/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payloadFromForm()),
      });
      const body = await response.json();

      if (!response.ok || !body.ok) {
        throw new Error(body.error || "The snapshot could not be completed.");
      }

      renderResult(body.scan);
      setStatus(
        body.delivery && body.delivery.pdf === "queued"
          ? "Snapshot complete. The full PDF report is on its way to your inbox."
          : "Snapshot complete. PDF report will be sent to your inbox.",
        "success"
      );
      form.reset();
      resetTurnstile();
    } catch (err) {
      setStatus(err.message || "Something went wrong. Please try again.", "error");
      resetTurnstile();
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Run snapshot";
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    loadSharedPartials();
    initTurnstile();
    form.addEventListener("submit", submitSnapshot);
  });
})();
