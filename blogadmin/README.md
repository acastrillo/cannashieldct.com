# Blog Admin

This admin tool provides:

- `GET /blogadmin` login page
- list blog cards from local `blog.html` and/or live `https://cannashieldct.com/blog.html`
- delete a selected blog card and its matching `blog/<slug>.html` file

## Run

From `Cannashieldct.com/`:

```bash
node blogadmin-server.js
```

Default URL:

- `http://localhost:8080/blogadmin`

## Credentials

Set credentials via environment variables (required):

```bash
BLOGADMIN_EMAIL="your-email@example.com" \
BLOGADMIN_PASSWORD="your-secure-password" \
BLOGADMIN_SESSION_SECRET="set-a-long-random-secret" \
BLOGADMIN_BLOG_HTML_SOURCE_URL="https://cannashieldct.com/blog.html" \
BLOGADMIN_COOKIE_SECURE=true \
PORT=8080 \
node blogadmin-server.js
```

## Notes

- This server edits `blog.html` and deletes `blog/<slug>.html` directly on disk.
- By default, post listing compares local `blog.html` with live `https://cannashieldct.com/blog.html` and shows whichever has more cards.
- If listing is coming from live but your local files are stale, delete can fail with `No card found in blog.html`.
- It will also delete the card image file from the project root only if that image is no longer referenced in `blog.html`.
- If your production site is S3 static hosting only, you need this server (or equivalent backend) behind your domain for `/blogadmin` delete actions to persist.

## Deploying Admin Live

If `cannashieldct.com` is a static S3/CloudFront site, deploy `blogadmin-server.js` as a separate backend (EC2, ECS/Fargate, Render, Railway, etc.) and route only admin paths to it.

Recommended routing:

- Keep default CloudFront behavior pointing to your S3 static origin.
- Add an origin for your admin backend.
- Add path behaviors to that backend origin:
  - `/blogadmin`
  - `/blogadmin/*`
  - `/api/blogadmin/*`

Set these backend env vars at deployment time:

- `BLOGADMIN_EMAIL`
- `BLOGADMIN_PASSWORD`
- `BLOGADMIN_SESSION_SECRET`
- `BLOGADMIN_BLOG_HTML_SOURCE_URL=https://cannashieldct.com/blog.html`
- `BLOGADMIN_COOKIE_SECURE=true`
