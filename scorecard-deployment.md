# Email Security Scorecard Deployment Notes

## Notion

Lead database:

- Database URL: https://www.notion.so/f87849ddc46f4a6ea5967bbc733b2cf9
- Data source URL: `collection://e3c2ff2c-4dc1-4614-b124-ae12ddc1532a`
- Lambda default database ID: `f87849ddc46f4a6ea5967bbc733b2cf9`

For direct Lambda-to-Notion saves, create a Notion internal integration, share the database with that integration, and set:

```sh
NOTION_API_KEY=secret_xxx
NOTION_SCORECARD_DATABASE_ID=f87849ddc46f4a6ea5967bbc733b2cf9
```

If n8n owns Notion writes instead, set `N8N_SCORECARD_WEBHOOK_URL` and leave `NOTION_API_KEY` unset.

## Lambda Environment

Function name:

```text
cannashield-scorecard-api
```

Function URL:

```text
https://whv5jnt2svbzkpx6l2psbmfnxe0pqdha.lambda-url.us-east-1.on.aws/
```

```sh
REPORT_FROM_EMAIL=alejo@cannashieldct.com
REQUIRE_TURNSTILE=true
TURNSTILE_SECRET_KEY=0x...
N8N_SCORECARD_WEBHOOK_URL=https://automations.cannashieldct.com/webhook/...
NOTION_API_KEY=secret_xxx
NOTION_SCORECARD_DATABASE_ID=f87849ddc46f4a6ea5967bbc733b2cf9
SCORECARD_REPORT_ENGINE=lambda
# Optional: require this token on /api/scorecard/report exports.
SCORECARD_REPORT_TOKEN=...
```

Current PDF generation is Lambda-based through `/api/scorecard/report`. Future state should move orchestration to n8n: `N8N_SCORECARD_WEBHOOK_URL` is where PDF generation, email delivery, and nurture can happen once that workflow owns the handoff.

## Frontend Config

Replace `TURNSTILE_SITE_KEY_HERE` in `cyber-check/index.html` with the Cloudflare Turnstile site key.

The frontend posts to `/api/scorecard/submit` in production and `http://localhost:8787/api/scorecard/submit` on localhost.

## Local Testing

```sh
npm run check
npm run scorecard:scan -- cannashieldct.com
npm run scorecard:local-api
node scorecard-pdf/render-scorecard-report.js scorecard-pdf/sample-data.json
python3 -m http.server 8080
```

Open:

```text
http://localhost:8080/cyber-check/
```

## Static S3 Upload

Use targeted uploads for the MVP files:

```sh
aws s3 cp cyber-check/index.html s3://cannashieldct.com/cyber-check/index.html --content-type "text/html; charset=utf-8" --cache-control "no-cache"
aws s3 cp cyber-check/scorecard.js s3://cannashieldct.com/cyber-check/scorecard.js --content-type "application/javascript; charset=utf-8" --cache-control "no-cache"
aws s3 cp styles.css s3://cannashieldct.com/styles.css --content-type "text/css; charset=utf-8" --cache-control "no-cache"
aws s3 cp index.html s3://cannashieldct.com/index.html --content-type "text/html; charset=utf-8" --cache-control "no-cache"
aws s3 cp navbar.html s3://cannashieldct.com/navbar.html --content-type "text/html; charset=utf-8" --cache-control "no-cache"
aws cloudfront create-invalidation --distribution-id E17JB9R3BQU7VD --paths "/cyber-check/*" "/styles.css" "/index.html" "/navbar.html"
```

## API Deployment Shape

Create a Lambda deployment package that includes `scorecard-api-lambda.js`, `scorecard-pdf/`, `package.json`, `package-lock.json`, and production `node_modules` so `puppeteer-core` and `@sparticuz/chromium` are available for PDF export. Use handler `scorecard-api-lambda.handler`, runtime `nodejs22.x`, and a Function URL.

Add a CloudFront cache behavior for `/api/scorecard/*` that mirrors the existing `/api/blogadmin/*` behavior: all methods, caching disabled, origin request policy that forwards headers/body, HTTPS only to the Lambda URL origin.

Report export routes:

```text
GET /api/scorecard/report?domain=example.com&format=pdf
GET /api/scorecard/report?domain=example.com&format=html
POST /api/scorecard/report
```
