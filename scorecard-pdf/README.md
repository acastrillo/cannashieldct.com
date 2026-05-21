# Email Security Scorecard PDF Template

One-page CannaShield PDF report template for the Email Security Scorecard funnel.
It is designed for HTML-to-PDF rendering in Chrome, Lambda Chromium, n8n, or any renderer that preserves print CSS.

## Render locally

```bash
node scorecard-pdf/render-scorecard-report.js scorecard-pdf/sample-data.json
```

The renderer writes HTML and PDF files to `scorecard-pdf/dist/`.

Use `--html-only` when the PDF renderer will run elsewhere:

```bash
node scorecard-pdf/render-scorecard-report.js scorecard-pdf/sample-data.json --html-only
```

## Data shape

The input JSON mirrors the Lambda public scorecard response:

```json
{
  "lead": {
    "email": "ops@example.com",
    "company": "Example Cannabis Co."
  },
  "analysis": {
    "domain": "example.com",
    "generatedAt": "2026-05-18T14:35:00.000Z",
    "score": 62,
    "riskTier": "High",
    "spoofScenario": {
      "outcome": "Likely delivered or filtered inconsistently",
      "detail": "DMARC is in monitor mode..."
    },
    "recommendations": ["Move DMARC toward enforcement."],
    "checks": {
      "dmarc": {
        "policy": "none",
        "status": "warn",
        "warnings": ["DMARC is monitoring only..."],
        "hasReporting": true
      },
      "spf": {
        "status": "warn",
        "allMechanism": "~all",
        "lookupCount": 7,
        "warnings": []
      },
      "dkim": {
        "status": "detected",
        "detectedSelectors": ["selector1"],
        "warnings": []
      },
      "mx": {
        "status": "detected",
        "records": ["aspmx.l.google.com"]
      }
    }
  }
}
```

The template also tolerates the fuller internal Lambda analysis object if the renderer receives that instead.

## Lambda export

The scorecard Lambda exposes a report route for the current production path:

```text
GET /api/scorecard/report?domain=example.com&format=pdf
GET /api/scorecard/report?domain=example.com&format=html
POST /api/scorecard/report
```

`POST /api/scorecard/report` accepts either `{ "domain": "example.com" }` or the full `{ "lead", "analysis" }` payload. `format` can be `pdf` or `html`.

Set `SCORECARD_REPORT_TOKEN` in Lambda if the export route should require `x-scorecard-report-token` or `?token=...`.

Current engine: Lambda. Future engine: n8n can call the same HTML template or consume the Lambda `html` report route before sending the prospect email sequence. Prospect follow-up identity should use `alejo@cannashieldct.com`.
