"use strict";

const http = require("http");
const { handler } = require("./attack-surface-api-lambda");

const port = Number(process.env.PORT || 8788);

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const body = await readBody(req);
    const event = {
      rawPath: new URL(req.url, `http://${req.headers.host}`).pathname,
      rawQueryString: new URL(req.url, `http://${req.headers.host}`).search.slice(1),
      headers: req.headers,
      body,
      isBase64Encoded: false,
      requestContext: {
        http: {
          method: req.method,
          sourceIp: req.socket.remoteAddress,
        },
      },
    };

    const out = await handler(event);

    if (out.isBase64Encoded) {
      const buf = Buffer.from(out.body, "base64");
      res.writeHead(out.statusCode, {
        ...(out.headers || {}),
        "content-length": buf.length,
      });
      res.end(buf);
    } else {
      res.writeHead(out.statusCode, out.headers || {});
      res.end(out.body || "");
    }
  } catch (err) {
    res.writeHead(500, { "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ ok: false, error: err.message }));
  }
});

server.listen(port, () => {
  console.log(`Attack Surface API listening on http://localhost:${port}`);
  console.log(`  Health:  GET  http://localhost:${port}/health`);
  console.log(`  Submit:  POST http://localhost:${port}/api/attack-surface/submit`);
  console.log(`  Report:  GET  http://localhost:${port}/api/attack-surface/report?domain=example.com`);
});
