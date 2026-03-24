#!/usr/bin/env node
"use strict";

const http = require("http");
const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");

const ROOT_DIR = __dirname;
const BLOG_INDEX_PATH = path.join(ROOT_DIR, "blog.html");
const BLOG_DIR = path.join(ROOT_DIR, "blog");
const DEFAULT_REMOTE_BLOG_URL = "https://cannashieldct.com/blog.html";
const BLOG_HTML_SOURCE_URL = String(
  process.env.BLOGADMIN_BLOG_HTML_SOURCE_URL || DEFAULT_REMOTE_BLOG_URL
).trim();
const REMOTE_DELETE_WEBHOOK_URL = String(
  process.env.BLOGADMIN_REMOTE_DELETE_WEBHOOK_URL || ""
).trim();
const REMOTE_DELETE_WEBHOOK_SECRET = String(
  process.env.BLOGADMIN_REMOTE_DELETE_WEBHOOK_SECRET || ""
).trim();

const ADMIN_EMAIL = process.env.BLOGADMIN_EMAIL || "";
const ADMIN_PASSWORD = process.env.BLOGADMIN_PASSWORD || "";
const SESSION_SECRET = process.env.BLOGADMIN_SESSION_SECRET || crypto.randomBytes(32).toString("hex");

const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || "0.0.0.0";
const COOKIE_SECURE = String(process.env.BLOGADMIN_COOKIE_SECURE || "").toLowerCase() === "true";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function sendJson(res, status, payload, extraHeaders = {}) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    ...extraHeaders,
  });
  res.end(body);
}

function sendText(res, status, text) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(text);
}

async function readJsonBody(req) {
  const chunks = [];
  let size = 0;
  const maxBytes = 1024 * 1024;

  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBytes) {
      throw new Error("Payload too large");
    }
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {};
  return JSON.parse(raw);
}

function parseCookies(req) {
  const cookieHeader = req.headers.cookie || "";
  const out = {};
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

function authFromRequest(req) {
  const cookies = parseCookies(req);
  return verifySessionToken(cookies.blogadmin_session);
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

function isHttpUrl(value = "") {
  return /^https?:\/\//i.test(String(value || "").trim());
}

async function fetchHtml(url) {
  if (!isHttpUrl(url)) {
    throw new Error(`Invalid URL: ${url}`);
  }

  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url} (${response.status})`);
  }

  return response.text();
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

async function loadLocalBlogSnapshot() {
  const html = await fsp.readFile(BLOG_INDEX_PATH, "utf8");
  return {
    source: "local",
    sourceLabel: "local blog.html",
    sourceUrl: BLOG_INDEX_PATH,
    html,
    posts: extractPosts(html),
  };
}

async function loadRemoteBlogSnapshot() {
  if (!BLOG_HTML_SOURCE_URL) {
    return null;
  }

  const html = await fetchHtml(BLOG_HTML_SOURCE_URL);
  return {
    source: "remote",
    sourceLabel: "live blog.html",
    sourceUrl: BLOG_HTML_SOURCE_URL,
    html,
    posts: extractPosts(html),
  };
}

async function listPosts() {
  let localSnapshot = null;
  let localError = null;
  try {
    localSnapshot = await loadLocalBlogSnapshot();
  } catch (error) {
    localError = error;
  }

  let remoteSnapshot = null;
  let remoteError = null;
  try {
    remoteSnapshot = await loadRemoteBlogSnapshot();
  } catch (error) {
    remoteError = error;
  }

  if (!localSnapshot && !remoteSnapshot) {
    throw new Error(
      `Could not read local blog index or remote source. Local error: ${localError ? localError.message : "none"}. Remote error: ${remoteError ? remoteError.message : "none"}.`
    );
  }

  const localCount = localSnapshot ? localSnapshot.posts.length : 0;
  const remoteCount = remoteSnapshot ? remoteSnapshot.posts.length : null;

  let selected = localSnapshot || remoteSnapshot;
  if (remoteSnapshot && (!localSnapshot || remoteSnapshot.posts.length >= localSnapshot.posts.length)) {
    selected = remoteSnapshot;
  }

  let warning = "";
  if (selected && selected.source === "remote") {
    if (localSnapshot && remoteSnapshot && localSnapshot.posts.length !== remoteSnapshot.posts.length) {
      warning =
        `Showing live posts (${remoteSnapshot.posts.length}) from ${BLOG_HTML_SOURCE_URL}. ` +
        `Local blog.html has ${localSnapshot.posts.length}. Delete still runs on local files unless a remote delete webhook is configured.`;
    } else if (!localSnapshot) {
      warning =
        `Showing live posts from ${BLOG_HTML_SOURCE_URL}. Local blog.html is unavailable on this server.`;
    }
  }

  return {
    posts: selected.posts,
    source: selected.source,
    sourceLabel: selected.sourceLabel,
    sourceUrl: selected.sourceUrl,
    counts: {
      local: localCount,
      remote: remoteCount,
    },
    warning,
    remoteError: remoteError ? remoteError.message : "",
  };
}

async function deletePost(slug) {
  if (!/^[a-z0-9-]+$/i.test(slug)) {
    throw new Error("Invalid slug");
  }

  let html = await fsp.readFile(BLOG_INDEX_PATH, "utf8");

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

  html = html.replace(cardRegex, "");
  await fsp.writeFile(BLOG_INDEX_PATH, html, "utf8");

  let deletedArticle = false;
  const articlePath = path.join(BLOG_DIR, `${slug}.html`);
  try {
    await fsp.unlink(articlePath);
    deletedArticle = true;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  let deletedImage = false;
  if (image && !image.includes("/") && !image.includes("\\")) {
    const imageStillReferenced =
      html.includes(`src="${image}"`) ||
      html.includes(`src='${image}'`) ||
      html.includes(`url("${image}")`) ||
      html.includes(`url('${image}')`);

    if (!imageStillReferenced) {
      try {
        await fsp.unlink(path.join(ROOT_DIR, image));
        deletedImage = true;
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }
    }
  }

  return { slug, deletedArticle, deletedImage, image };
}

async function deletePostViaWebhook(slug) {
  if (!isHttpUrl(REMOTE_DELETE_WEBHOOK_URL)) {
    throw new Error("BLOGADMIN_REMOTE_DELETE_WEBHOOK_URL is not configured.");
  }

  const headers = {
    "Content-Type": "application/json",
  };
  if (REMOTE_DELETE_WEBHOOK_SECRET) {
    headers["x-blogadmin-secret"] = REMOTE_DELETE_WEBHOOK_SECRET;
  }

  const response = await fetch(REMOTE_DELETE_WEBHOOK_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ slug }),
  });

  let payload = {};
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (!response.ok) {
    throw new Error(payload.error || `Remote delete failed (${response.status})`);
  }

  return {
    slug,
    mode: "remote-webhook",
    remote: payload,
  };
}

async function handleApi(req, res, url) {
  const pathname = url.pathname;

  if (req.method === "POST" && pathname === "/api/blogadmin/login") {
    let body;
    try {
      body = await readJsonBody(req);
    } catch {
      return sendJson(res, 400, { error: "Invalid JSON body" });
    }

    const email = String(body.email || "");
    const password = String(body.password || "");
    const emailOk = timingSafeEqualString(email, ADMIN_EMAIL);
    const passOk = timingSafeEqualString(password, ADMIN_PASSWORD);
    if (!emailOk || !passOk) {
      return sendJson(res, 401, { error: "Invalid credentials" });
    }

    const token = createSessionToken(ADMIN_EMAIL);
    return sendJson(
      res,
      200,
      { ok: true },
      { "Set-Cookie": sessionCookieHeader(token) }
    );
  }

  if (req.method === "POST" && pathname === "/api/blogadmin/logout") {
    return sendJson(
      res,
      200,
      { ok: true },
      { "Set-Cookie": clearSessionCookieHeader() }
    );
  }

  const session = authFromRequest(req);
  if (!session) {
    return sendJson(res, 401, { error: "Not authenticated" });
  }

  if (req.method === "GET" && pathname === "/api/blogadmin/posts") {
    try {
      const data = await listPosts();
      return sendJson(res, 200, data);
    } catch (error) {
      return sendJson(res, 500, { error: error.message });
    }
  }

  if (req.method === "DELETE" && pathname === "/api/blogadmin/posts") {
    let body;
    try {
      body = await readJsonBody(req);
    } catch {
      return sendJson(res, 400, { error: "Invalid JSON body" });
    }
    const slug = String(body.slug || "").trim();
    if (!slug) {
      return sendJson(res, 400, { error: "slug is required" });
    }

    try {
      const result = await deletePost(slug);
      return sendJson(res, 200, {
        ok: true,
        message: `Deleted blog post "${slug}"`,
        result,
      });
    } catch (error) {
      if (
        /No card found in blog\.html/i.test(error.message || "") &&
        isHttpUrl(REMOTE_DELETE_WEBHOOK_URL)
      ) {
        try {
          const result = await deletePostViaWebhook(slug);
          return sendJson(res, 200, {
            ok: true,
            message: `Deleted blog post "${slug}" via remote webhook`,
            result,
          });
        } catch (remoteError) {
          return sendJson(res, 400, { error: remoteError.message });
        }
      }

      if (/No card found in blog\.html/i.test(error.message || "")) {
        return sendJson(res, 400, {
          error:
            `${error.message} Local files are out of sync with live blog posts. ` +
            `Sync blog.html/blog/*.html on this server or set BLOGADMIN_REMOTE_DELETE_WEBHOOK_URL.`,
        });
      }

      return sendJson(res, 400, { error: error.message });
    }
  }

  return sendJson(res, 404, { error: "Not found" });
}

function safeResolveStaticPath(urlPath) {
  let requestPath = decodeURIComponent(urlPath || "/");
  if (requestPath === "/blogadmin") requestPath = "/blogadmin/index.html";
  if (requestPath.endsWith("/")) requestPath += "index.html";
  if (requestPath === "/") requestPath = "/index.html";

  const normalized = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
  const absPath = path.join(ROOT_DIR, normalized);
  if (!absPath.startsWith(ROOT_DIR)) return null;
  return absPath;
}

async function serveStatic(req, res, url) {
  const absPath = safeResolveStaticPath(url.pathname);
  if (!absPath) return sendText(res, 403, "Forbidden");

  let stat;
  try {
    stat = await fsp.stat(absPath);
  } catch {
    return sendText(res, 404, "Not found");
  }
  if (!stat.isFile()) return sendText(res, 404, "Not found");

  const ext = path.extname(absPath).toLowerCase();
  const contentType = MIME[ext] || "application/octet-stream";
  res.writeHead(200, {
    "Content-Type": contentType,
    "Content-Length": stat.size,
    "Cache-Control": "no-store",
  });
  fs.createReadStream(absPath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    if (url.pathname.startsWith("/api/blogadmin/")) {
      return handleApi(req, res, url);
    }
    if (req.method !== "GET" && req.method !== "HEAD") {
      return sendText(res, 405, "Method Not Allowed");
    }
    return serveStatic(req, res, url);
  } catch (error) {
    return sendJson(res, 500, { error: error.message || "Unexpected error" });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`CannaShield admin server running on http://${HOST}:${PORT}`);
  console.log(`Admin route: http://localhost:${PORT}/blogadmin`);
});
