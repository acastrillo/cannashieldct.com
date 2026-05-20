"use strict";

const http = require("http");
const { handler } = require("./scorecard-api-lambda");

const port = Number(process.env.PORT || 8787);

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
    res.writeHead(out.statusCode, out.headers || {});
    res.end(out.body || "");
  } catch (err) {
    res.writeHead(500, { "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ ok: false, error: err.message }));
  }
});

server.listen(port, () => {
  console.log(`Scorecard local API listening on http://localhost:${port}`);
});
