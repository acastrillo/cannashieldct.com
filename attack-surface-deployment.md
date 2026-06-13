# Attack Surface Snapshot — Deployment Notes

## Overview

Lead magnet #2. A passive, non-intrusive recon tool that checks five data sources for a submitted domain and returns a risk-scored JSON response. The frontend lives at `/cyber-check/attack-surface/`, the backend is a Lambda Function URL behind CloudFront.

## Data Sources

| Source | Endpoint | Notes |
|---|---|---|
| Shodan InternetDB | `https://internetdb.shodan.io/{ip}` | Free, no key. Resolves domain to IPv4 first. |
| crt.sh | `https://crt.sh/?q=%.{domain}&output=json` | Free, no key. |
| HIBP | `https://haveibeenpwned.com/api/v3/breaches` | Free for listing all breaches; set `HIBP_API_KEY` for enterprise. |
| DNS | Node `dns.promises` | SPF, DMARC, DKIM, MX. |
| HTTP headers | Native `fetch` | HEAD request with HTTPS fallback to HTTP. |

## Risk Scoring

| Finding | Points |
|---|---|
| Exposed RDP (3389) | +30 |
| Exposed SMB (445) | +30 |
| Exposed Telnet (23) | +30 |
| No DMARC record | +20 |
| HIBP breach match | +25 |
| No SPF record | +15 |
| Missing HSTS | +10 |
| >10 subdomains | +10 |
| >3 missing security headers | +10 |

Tiers: 0–30 = Low · 31–60 = Medium · 61–90 = High · 91+ = Critical

## Lambda Setup

Function name:

```text
cannashield-attack-surface-api
```

Runtime: `nodejs22.x`  
Handler: `attack-surface-api-lambda.handler`  
Timeout: 60s (recon runs in parallel but DNS + crt.sh can be slow)

### Environment Variables

```sh
REPORT_FROM_EMAIL=alejo@cannashieldct.com
REQUIRE_TURNSTILE=true
TURNSTILE_SECRET_KEY=0x...
N8N_ATTACK_SURFACE_WEBHOOK_URL=https://automations.cannashieldct.com/webhook/...
NOTION_API_KEY=secret_xxx
NOTION_ATTACK_SURFACE_DATABASE_ID=<create new Notion DB, share with integration>
ATTACK_SURFACE_REPORT_ENGINE=lambda
ATTACK_SURFACE_REPORT_TOKEN=<optional — gates /report endpoint>
HIBP_API_KEY=<optional — enables HIBP lookup; skipped gracefully if missing>
```

### Deploy Package

```sh
# Build the zip
zip -r attack-surface-lambda.zip \
  attack-surface-api-lambda.js \
  attack-surface-local-server.js \
  attack-surface-pdf/ \
  package.json \
  package-lock.json \
  node_modules/

# Create the function
aws lambda create-function \
  --function-name cannashield-attack-surface-api \
  --runtime nodejs22.x \
  --handler attack-surface-api-lambda.handler \
  --zip-file fileb://attack-surface-lambda.zip \
  --role <your-lambda-execution-role-arn> \
  --timeout 60 \
  --memory-size 512

# Or update existing
aws lambda update-function-code \
  --function-name cannashield-attack-surface-api \
  --zip-file fileb://attack-surface-lambda.zip
```

### Function URL

```sh
aws lambda create-function-url-config \
  --function-name cannashield-attack-surface-api \
  --auth-type NONE \
  --cors '{"AllowOrigins":["*"],"AllowMethods":["GET","POST","OPTIONS"],"AllowHeaders":["content-type"]}'
```

Copy the resulting URL (e.g. `https://xxxxxxxx.lambda-url.us-east-1.on.aws/`) and add as a CloudFront origin.

## CloudFront Cache Behavior

Add a behavior for `/api/attack-surface/*` matching the existing `/api/scorecard/*` pattern:

- Origin: the Lambda Function URL
- Allowed HTTP methods: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
- Cache policy: CachingDisabled
- Origin request policy: AllViewerExceptHostHeader
- Viewer protocol: HTTPS only

## Static File Upload

```sh
aws s3 cp cyber-check/attack-surface/index.html \
  s3://cannashieldct.com/cyber-check/attack-surface/index.html \
  --content-type "text/html; charset=utf-8" \
  --cache-control "no-cache"

aws s3 cp cyber-check/attack-surface/attack-surface.js \
  s3://cannashieldct.com/cyber-check/attack-surface/attack-surface.js \
  --content-type "application/javascript; charset=utf-8" \
  --cache-control "no-cache"

aws s3 cp styles.css s3://cannashieldct.com/styles.css \
  --content-type "text/css; charset=utf-8" \
  --cache-control "no-cache"

aws cloudfront create-invalidation \
  --distribution-id E17JB9R3BQU7VD \
  --paths "/cyber-check/attack-surface/*" "/styles.css"
```

## Notion Lead Database

Create a new Notion database (or reuse the scorecard one) with these properties:

| Property | Type |
|---|---|
| Name | Title |
| Email | Email |
| Domain | Text |
| Company | Text |
| Status | Select (New / Contacted / Qualified / Closed) |
| Score | Number |
| Risk Tier | Select (Low / Medium / High / Critical) |
| Source | Select |
| Submitted At | Date |
| Consent | Checkbox |
| Raw JSON | Text |

Share the database with the Notion internal integration and set `NOTION_ATTACK_SURFACE_DATABASE_ID`.

## n8n Webhook Payload

The Lambda POSTs this payload to `N8N_ATTACK_SURFACE_WEBHOOK_URL`:

```json
{
  "event": "attack_surface_snapshot.submitted",
  "reportFromEmail": "alejo@cannashieldct.com",
  "lead": {
    "name": "...",
    "email": "...",
    "company": "...",
    "domain": "...",
    "consent": true,
    "source": "attack-surface-snapshot",
    "submittedAt": "2026-06-13T..."
  },
  "scan": {
    "domain": "...",
    "scannedAt": "...",
    "score": 75,
    "tier": "High",
    "scoring": { "score": 75, "breakdown": [...] },
    "recommendations": ["...", "..."],
    "recon": {
      "shodan": { "ip": "...", "openPorts": [...], "highRiskPorts": [...] },
      "certs": { "subdomains": [...], "count": 7 },
      "hibp": { "breaches": [...], "count": 1 },
      "dns": { "spf": {...}, "dmarc": {...}, "dkim": {...}, "mx": {...} },
      "headers": { "checks": [...], "missingCount": 3, "hasHsts": false }
    }
  },
  "notion": { "saved": true, "pageId": "..." }
}
```

Build n8n workflows for:
1. **PDF generation + email delivery**: render the PDF via `/api/attack-surface/report` and send via Postmark/SES
2. **Nurture sequence**: tag lead in CRM, enqueue follow-up email sequence based on tier

## API Routes

```text
GET  /api/attack-surface/health
POST /api/attack-surface/submit          → runs full scan, captures lead, returns JSON
GET  /api/attack-surface/report?domain=example.com&format=pdf
POST /api/attack-surface/report          → body: { scan: {...}, lead: {...}, format: "pdf" }
```

## Local Testing

```sh
npm run snapshot:scan -- cannashieldct.com     # CLI scan, JSON to stdout
npm run snapshot:local-api                     # API on http://localhost:8788
npm run snapshot:pdf                           # render sample PDF to attack-surface-pdf/dist/
python3 -m http.server 8080                    # serve static files

# Test the API
curl -s -X POST http://localhost:8788/api/attack-surface/submit \
  -H "content-type: application/json" \
  -d '{"domain":"cannashieldct.com","email":"test@example.com","name":"Test","consent":true}' \
  | jq '.scan | {domain, score, tier}'
```

## Turnstile

Uses the same Turnstile site key as the scorecard (`0x4AAAAAADOwGi7QBbrMsNCJ`). `REQUIRE_TURNSTILE=true` in production enforces the challenge.
