(function () {
  "use strict";

  const config = window.CANNASHIELD_SCORECARD || {};
  const form = document.getElementById("scorecard-form");
  const submitButton = document.getElementById("scorecard-submit");
  const statusEl = document.getElementById("scorecard-status");
  const resultEl = document.getElementById("scorecard-result");
  const turnstileEl = document.getElementById("turnstile-widget");
  const turnstileNote = document.getElementById("turnstile-note");
  let turnstileWidgetId = null;

  function loadSharedPartials() {
    const navbar = document.getElementById("navbar-placeholder");
    const footer = document.getElementById("footer-placeholder");

    if (navbar) {
      fetch("../navbar.html")
        .then((response) => response.text())
        .then((html) => {
          navbar.innerHTML = html;
        })
        .catch(() => {});
    }

    if (footer) {
      fetch("../footer.html")
        .then((response) => response.text())
        .then((html) => {
          footer.innerHTML = html;
        })
        .catch(() => {});
    }
  }

  function setStatus(message, type) {
    statusEl.textContent = message || "";
    statusEl.className = `scorecard-status ${type || ""}`.trim();
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

    const interval = window.setInterval(() => {
      if (window.turnstile) {
        window.clearInterval(interval);
        render();
      }
    }, 100);
  }

  function firstWarning(warnings, fallback) {
    return warnings && warnings.length ? warnings[0] : fallback;
  }

  function renderResult(analysis) {
    resultEl.hidden = false;
    resultEl.scrollIntoView({ behavior: "smooth", block: "start" });

    document.getElementById("result-domain").textContent = analysis.domain;
    document.getElementById("result-score").textContent = `${analysis.score}/100`;
    document.getElementById("result-tier").textContent = analysis.riskTier;
    document.getElementById("result-tier").className = `tier-${analysis.riskTier.toLowerCase()}`;

    document.getElementById("result-dmarc").textContent = analysis.checks.dmarc.policy;
    document.getElementById("result-dmarc-note").textContent = firstWarning(
      analysis.checks.dmarc.warnings,
      analysis.checks.dmarc.hasReporting ? "DMARC reporting is present." : "DMARC policy found."
    );

    document.getElementById("result-spf").textContent = analysis.checks.spf.status;
    document.getElementById("result-spf-note").textContent = firstWarning(
      analysis.checks.spf.warnings,
      analysis.checks.spf.allMechanism ? `SPF ends with ${analysis.checks.spf.allMechanism}.` : "SPF record found."
    );

    document.getElementById("result-dkim").textContent = analysis.checks.dkim.status;
    document.getElementById("result-dkim-note").textContent = firstWarning(
      analysis.checks.dkim.warnings,
      analysis.checks.dkim.detectedSelectors.length
        ? `Detected selector: ${analysis.checks.dkim.detectedSelectors.join(", ")}.`
        : "Common selectors checked."
    );

    document.getElementById("result-spoof").textContent = analysis.spoofScenario.outcome;
    document.getElementById("result-spoof-detail").textContent = analysis.spoofScenario.detail;

    const list = document.getElementById("result-recommendations");
    list.innerHTML = "";
    analysis.recommendations.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });
  }

  function payloadFromForm() {
    const data = new FormData(form);
    return {
      domain: data.get("domain"),
      email: data.get("email"),
      name: data.get("name"),
      company: data.get("company"),
      role: data.get("role"),
      consent: data.get("consent") === "on",
      turnstileToken: getTurnstileToken(),
    };
  }

  async function submitScorecard(event) {
    event.preventDefault();
    setStatus("Running DNS checks now...", "loading");
    submitButton.disabled = true;
    submitButton.textContent = "Scanning...";

    try {
      const response = await fetch(config.apiEndpoint || "/api/scorecard/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payloadFromForm()),
      });
      const body = await response.json();

      if (!response.ok || !body.ok) {
        throw new Error(body.error || "The scorecard could not be generated.");
      }

      renderResult(body.analysis);
      setStatus(
        body.delivery && body.delivery.pdf === "queued"
          ? "Scorecard generated. The full report is on its way to your inbox."
          : "Scorecard generated. This preview is ready while email delivery is being connected.",
        "success"
      );
      form.reset();
      resetTurnstile();
    } catch (err) {
      setStatus(err.message || "Something went wrong. Please try again.", "error");
      resetTurnstile();
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Run scorecard";
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadSharedPartials();
    initTurnstile();
    form.addEventListener("submit", submitScorecard);
  });
})();
