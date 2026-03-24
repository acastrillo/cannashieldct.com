"use strict";

const crypto = require("crypto");
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const {
  CloudFrontClient,
  CreateInvalidationCommand,
} = require("@aws-sdk/client-cloudfront");

const ADMIN_EMAIL = String(process.env.BLOGADMIN_EMAIL || "");
const ADMIN_PASSWORD = String(process.env.BLOGADMIN_PASSWORD || "");
const SESSION_SECRET = String(process.env.BLOGADMIN_SESSION_SECRET || crypto.randomBytes(32).toString("hex"));

const BLOG_BUCKET = String(process.env.BLOGADMIN_BUCKET || "cannashieldct.com").trim();
const BLOG_INDEX_KEY = String(process.env.BLOGADMIN_BLOG_INDEX_KEY || "blog.html").replace(/^\/+/, "");
const BLOG_PREFIX = String(process.env.BLOGADMIN_BLOG_PREFIX || "blog/").replace(/^\/+/, "");
const CLOUDFRONT_DISTRIBUTION_ID = String(process.env.BLOGADMIN_CLOUDFRONT_DISTRIBUTION_ID || "").trim();

const COOKIE_SECURE = String(process.env.BLOGADMIN_COOKIE_SECURE || "true").toLowerCase() === "true";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

const s3 = new S3Client({});
const cloudfront = new CloudFrontClient({});

function jsonResponse(statusCode, payload, cookies = []) {
  const res = {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
    body: JSON.stringify(payload),
  };
  if (cookies.length) res.cookies = cookies;
  return res;
}

function parseCookies(raw) {
  const out = {};
  const cookieHeader = String(raw || "");
  for (const pair of cookieHeader.split(";")) {
    const idx = pair.indexOf("=");
    if (idx <= 0) continue;
    const key = pair.slice(0, idx).trim();
    const value = pair.slice(idx + 1).trim();
    out[key] = decodeURIComponent(value);
  }
  return out;
}

function timingSafeEqualString(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

function createSessionToken(email) {
  const payload = {
    email,
    exp: Date.now() + SESSION_TTL_SECONDS * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = crypto.createHmac("sha256", SESSION_SECRET).update(encoded).digest("base64url");
  return `${encoded}.${sig}`;
}

function verifySessionToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encoded, sig] = parts;
  const expectedSig = crypto.createHmac("sha256", SESSION_SECRET).update(encoded).digest("base64url");
  if (!timingSafeEqualString(sig, expectedSig)) return null;

  let payload;
  try {
    payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  if (!payload || payload.exp < Date.now()) return null;
  if (!timingSafeEqualString(payload.email || "", ADMIN_EMAIL)) return null;
  return payload;
}

function sessionCookieHeader(token) {
  const parts = [
    `blogadmin_session=${encodeURIComponent(token)}`,
    `Max-Age=${SESSION_TTL_SECONDS}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (COOKIE_SECURE) parts.push("Secure");
  return parts.join("; ");
}

function clearSessionCookieHeader() {
  const parts = [
    "blogadmin_session=",
    "Max-Age=0",
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (COOKIE_SECURE) parts.push("Secure");
  return parts.join("; ");
}

function decodeHtml(value = "") {
  return String(value)
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(value = "") {
  return decodeHtml(String(value).replace(/<[^>]*>/g, " "));
}

function escapeRegex(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function streamToString(body) {
  if (!body) return "";
  if (typeof body.transformToString === "function") {
    return body.transformToString("utf8");
  }

  const chunks = [];
  for await (const chunk of body) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function getObjectText(bucket, key) {
  const out = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  return streamToString(out.Body);
}

async function putObjectText(bucket, key, body) {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: "text/html; charset=utf-8",
      CacheControl: "no-cache, no-store, must-revalidate",
    })
  );
}

function extractPosts(html) {
  const posts = [];
  const cardRegex = /<article\b[^>]*class=["'][^"']*\bcard\b[^"']*["'][^>]*>[\s\S]*?<\/article>/gi;
  let match;

  while ((match = cardRegex.exec(html)) !== null) {
    const cardHtml = match[0];
    const hrefMatch = cardHtml.match(/href=["'](?:\.\/|\/)?blog\/([a-z0-9-]+)\.html["']/i);
    if (!hrefMatch) continue;

    const slug = String(hrefMatch[1] || "").trim();
    if (!slug) continue;

    const title = stripTags((cardHtml.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i) || [])[1] || slug);
    const excerpt = stripTags((cardHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/i) || [])[1] || "");

    const spanMatches = [...cardHtml.matchAll(/<span[^>]*>([\s\S]*?)<\/span>/gi)];
    const published = stripTags((spanMatches[1] && spanMatches[1][1]) || (spanMatches[0] && spanMatches[0][1]) || "");

    const image = (cardHtml.match(/<img[^>]*src=["']([^"']+)["']/i) || [])[1] || "";

    posts.push({
      slug,
      title,
      excerpt,
      published,
      image,
      href: `blog/${slug}.html`,
    });
  }

  return posts;
}

function parseJsonBody(event) {
  if (!event || !event.body) return {};
  const raw = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : String(event.body);
  if (!raw.trim()) return {};
  return JSON.parse(raw);
}

async function invalidateCloudFront(paths, slug) {
  if (!CLOUDFRONT_DISTRIBUTION_ID) return null;

  const unique = [...new Set(paths.filter(Boolean))];
  if (!unique.length) return null;

  const out = await cloudfront.send(
    new CreateInvalidationCommand({
      DistributionId: CLOUDFRONT_DISTRIBUTION_ID,
      InvalidationBatch: {
        CallerReference: `blogadmin-${Date.now()}-${slug || "manual"}`,
        Paths: {
          Quantity: unique.length,
          Items: unique,
        },
      },
    })
  );

  return out && out.Invalidation ? out.Invalidation.Id : null;
}

async function listPosts() {
  const html = await getObjectText(BLOG_BUCKET, BLOG_INDEX_KEY);
  const posts = extractPosts(html);
  return {
    posts,
    source: "s3",
    sourceLabel: "live S3 blog.html",
    sourceUrl: `s3://${BLOG_BUCKET}/${BLOG_INDEX_KEY}`,
    counts: {
      local: null,
      remote: posts.length,
    },
    warning: "",
    remoteError: "",
  };
}

async function deletePost(slug) {
  if (!/^[a-z0-9-]+$/i.test(slug)) {
    throw new Error("Invalid slug");
  }

  const html = await getObjectText(BLOG_BUCKET, BLOG_INDEX_KEY);
  const cardRegex = new RegExp(
    `<article\\b[^>]*class=["'][^"']*\\bcard\\b[^"']*["'][^>]*>[\\s\\S]*?<a\\b[^>]*href=["'](?:\\./|/)?blog/${escapeRegex(slug)}\\.html["'][\\s\\S]*?<\\/article>\\s*`,
    "i"
  );
  const cardMatch = html.match(cardRegex);
  if (!cardMatch) {
    throw new Error(`No card found in blog.html for slug "${slug}"`);
  }

  const cardHtml = cardMatch[0];
  const image = (cardHtml.match(/<img[^>]*src=["']([^"']+)["']/i) || [])[1] || "";
  const updatedHtml = html.replace(cardRegex, "");

  await putObjectText(BLOG_BUCKET, BLOG_INDEX_KEY, updatedHtml);

  const articleKey = `${BLOG_PREFIX}${slug}.html`.replace(/\/{2,}/g, "/");
  await s3.send(new DeleteObjectCommand({ Bucket: BLOG_BUCKET, Key: articleKey }));

  let deletedImage = false;
  let imageKey = "";
  if (image && !image.includes("\\") && !/^https?:\/\//i.test(image)) {
    imageKey = image.replace(/^\/+/, "");
    const imageStillReferenced =
      updatedHtml.includes(`src="${image}"`) ||
      updatedHtml.includes(`src='${image}'`) ||
      updatedHtml.includes(`src="/${imageKey}"`) ||
      updatedHtml.includes(`src='/${imageKey}'`) ||
      updatedHtml.includes(`url("${image}")`) ||
      updatedHtml.includes(`url('${image}')`) ||
      updatedHtml.includes(`url("/${imageKey}")`) ||
      updatedHtml.includes(`url('/${imageKey}')`);

    if (!imageStillReferenced && imageKey && !imageKey.includes("/")) {
      await s3.send(new DeleteObjectCommand({ Bucket: BLOG_BUCKET, Key: imageKey }));
      deletedImage = true;
    }
  }

  const invalidationPaths = [
    `/${BLOG_INDEX_KEY}`,
    `/${articleKey}`,
    imageKey ? `/${imageKey}` : "",
  ];
  const invalidationId = await invalidateCloudFront(invalidationPaths, slug);

  return {
    slug,
    deletedArticle: true,
    deletedImage,
    image,
    invalidationId,
  };
}

function pathFromEvent(event) {
  return String(
    (event && (event.rawPath || (event.requestContext && event.requestContext.http && event.requestContext.http.path))) || "/"
  );
}

function methodFromEvent(event) {
  return String((event && event.requestContext && event.requestContext.http && event.requestContext.http.method) || "").toUpperCase();
}

exports.handler = async (event) => {
  const method = methodFromEvent(event);
  const path = pathFromEvent(event);
  const headers = event && event.headers ? event.headers : {};
  const cookieHeader = headers.cookie || headers.Cookie || "";
  const cookies = parseCookies(cookieHeader);

  try {
    if (method === "OPTIONS") {
      return {
        statusCode: 204,
        headers: {
          "cache-control": "no-store",
        },
      };
    }

    if (method === "POST" && path === "/api/blogadmin/login") {
      let body = {};
      try {
        body = parseJsonBody(event);
      } catch {
        return jsonResponse(400, { error: "Invalid JSON body" });
      }

      const email = String(body.email || "");
      const password = String(body.password || "");
      const emailOk = timingSafeEqualString(email, ADMIN_EMAIL);
      const passOk = timingSafeEqualString(password, ADMIN_PASSWORD);
      if (!emailOk || !passOk) {
        return jsonResponse(401, { error: "Invalid credentials" });
      }

      const token = createSessionToken(ADMIN_EMAIL);
      return jsonResponse(200, { ok: true }, [sessionCookieHeader(token)]);
    }

    if (method === "POST" && path === "/api/blogadmin/logout") {
      return jsonResponse(200, { ok: true }, [clearSessionCookieHeader()]);
    }

    const session = verifySessionToken(cookies.blogadmin_session);
    if (!session) {
      return jsonResponse(401, { error: "Not authenticated" });
    }

    if (method === "GET" && path === "/api/blogadmin/posts") {
      const data = await listPosts();
      return jsonResponse(200, data);
    }

    if (method === "DELETE" && path === "/api/blogadmin/posts") {
      let body = {};
      try {
        body = parseJsonBody(event);
      } catch {
        return jsonResponse(400, { error: "Invalid JSON body" });
      }
      const slug = String(body.slug || "").trim();
      if (!slug) {
        return jsonResponse(400, { error: "slug is required" });
      }

      try {
        const result = await deletePost(slug);
        return jsonResponse(200, {
          ok: true,
          message: `Deleted blog post "${slug}"`,
          result,
        });
      } catch (error) {
        return jsonResponse(400, { error: error.message || "Delete failed" });
      }
    }

    return jsonResponse(404, { error: "Not found" });
  } catch (error) {
    return jsonResponse(500, { error: error.message || "Unexpected error" });
  }
};
