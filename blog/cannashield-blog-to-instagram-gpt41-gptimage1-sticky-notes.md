# Sticky Notes: cannashield-blog-to-instagram-gpt41-gptimage1

## Required Variables (set in n8n)
- IG_USER_ID
- IG_ACCESS_TOKEN
- OPENAI_API_KEY
- APPROVAL_FROM_EMAIL
- APPROVAL_TO_EMAIL
- OPENAI_IMAGE_QUALITY (optional, default behavior still works)
- IG_ASSET_BUCKET (needed for gpt-image-1 b64 upload path)
- IG_ASSET_PUBLIC_BASE_URL (public base URL Instagram can fetch)
- IG_ASSET_PREFIX (optional, defaults to `ig-assets/`)

## Section Sticky Notes (high-level)
- Trigger + Config: Start from webhook or manual trigger, then load all runtime config from variables.
- Event Parsing + Guardrails: Normalize incoming event shape and only continue for real blog article pages.
- Blog Content Extraction: Download article HTML, convert to clean text, and extract title/excerpt/image metadata.
- Duplicate Protection: Check recent IG posts and skip if this blog URL was already posted.
- Creative Generation + Human Approval: Use LLM to produce caption/hashtags/image prompt, then wait for email approval.
- Image Generation + URL Handling: Generate image with OpenAI; if URL exists use it, if b64 exists upload to S3 to get public URL.
- Instagram Publish + Polling: Create media container, poll until ready, then publish and return status.
- Outcome Paths: Return clear results for skipped, already-posted, rejected, or published outcomes.

## Node Sticky Notes (paste per node)
- New Blog Post Created: Receives blog-created events (webhook). Keep disabled if you only run manually.
- Workflow Config: Central config hub. Pulls IDs/tokens/options from n8n variables and passes them forward.
- Parse Blog Event: Handles different payload formats, builds `postUrl`, and marks whether this event should be processed.
- Process Blog Event?: Safety gate. True means continue; false means skip non-blog events.
- Skip Non-Blog Result: Clean skip output when event is not a blog article.

- Download Article HTML: Fetches the blog page HTML using `postUrl`.
- Create articleText: Strips scripts/styles/tags and creates a trimmed plain-text body for LLM prompts.
- Merge Event + Article HTML: Re-joins event metadata and downloaded article content.
- Extract Post Assets + Caption: Pulls title/excerpt/image URL from HTML and builds a baseline caption fallback.

- Check Recent Instagram Posts: Gets recent IG captions/permalinks for duplicate detection.
- Skip If Already Posted: Checks if the current `postUrl` is already present in recent IG captions.
- Already Posted?: Branch for duplicate handling.
- Already Posted Result: Returns `already_posted` status and stops this run.

- LLM creates IG Package: Creates structured social package (caption, hashtags, image prompt, overlay text).
- Structured Output Parser: Enforces strict JSON schema so downstream nodes get predictable fields.
- OpenAI Chat Model: LLM model settings for the package generation step.
- Send message and wait for response: Sends email preview and pauses execution until approve/reject.
- Approved?: Branches approved vs rejected.
- Rejected Result: Records rejection metadata and stops publish path.

- Generate AI Image (OpenAI): Calls OpenAI Images API and builds payload based on selected image model.
- Extract AI Image URL: Accepts direct image URL if present, or converts `b64_json` into binary + fallback base64 data.
- Image URL Ready?: If URL exists go straight to publish prep; otherwise upload binary image to S3 first.
- Build AI Asset Key: Creates unique S3 object key and ensures image bytes are still available.
- Upload AI Image to S3 (Public): Uploads binary image to S3 so Instagram can fetch it by HTTPS URL.
- Set Final Public Image URL: Builds final public URL from base URL + uploaded object key.
- Apply AI Image URL: Finalizes caption, hashtags, and selected image URL for Instagram.

- Create IG Media Container: Creates Instagram media container (`/media`) with image URL + caption.
- Init Poll Context: Stores creation ID and polling settings for status checks.
- Wait Before Status Check: Waits configured seconds before each status poll.
- Get Container Status: Reads current container status from Graph API.
- Merge Poll Context + Status: Combines latest status with poll context.
- Container Ready?: True when container is ready to publish.
- Increment Poll Attempt: Increments retries; throws if status is failed/expired or max retries reached.
- Publish To Instagram: Calls `media_publish` when container is ready.
- Publish Result: Final published output payload with IDs and timestamps.

- Manual Trigger - One-Off Blog Post: Manual run entry point for testing.
- Manual Post Payload (One-Off): Hardcoded sample post input used by manual trigger.
