# Email Security Scorecard PDF Template

One-page CannaShield PDF report template for the Email Security Scorecard funnel.
It is designed for HTML-to-PDF rendering in Chrome, n8n, or any renderer that preserves print CSS.

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
