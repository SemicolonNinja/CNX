#!/usr/bin/env node
/**
 * Preview origin for the Enum Events HTML prototype.
 *
 * Speaks HTTP/1.0 + Content-Length + Connection: close only.
 * HTTP/1.1 from this process made the Cursor preview proxy re-chunk the
 * body; a close in the middle of that stream is Chromium -354
 * (ERR_INVALID_CHUNKED_ENCODING).
 */
const fs = require("fs");
const path = require("path");
const net = require("net");

const ROOT = path.resolve(__dirname);
const PORT = 4174;
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
};

function safeFile(urlPath) {
  let raw = "/";
  try {
    raw = decodeURIComponent((urlPath || "/").split("?")[0].split("#")[0]);
  } catch (_) {}
  const rel = raw === "/" ? "/index.html" : raw;
  const file = path.normalize(path.join(ROOT, rel));
  if (!file.startsWith(ROOT + path.sep) && file !== ROOT) return null;
  return file;
}

function writeHttp10(socket, status, reason, type, body) {
  if (!socket || socket.destroyed || !socket.writable) return;
  const buf = Buffer.isBuffer(body) ? body : Buffer.from(body);
  const head =
    `HTTP/1.0 ${status} ${reason}\r\n` +
    `Content-Type: ${type}\r\n` +
    `Content-Length: ${buf.length}\r\n` +
    `Connection: close\r\n` +
    `Cache-Control: no-store\r\n` +
    `\r\n`;
  try {
    socket.write(head);
    if (socket.writable) socket.write(buf);
    socket.end();
  } catch (_) {
    try { socket.end(); } catch (__) {}
  }
}

function serve(socket, reqPath) {
  if (reqPath === "/health") {
    writeHttp10(socket, 200, "OK", "text/plain; charset=utf-8", "ok\n");
    return;
  }
  const file = safeFile(reqPath);
  if (!file) {
    writeHttp10(socket, 403, "Forbidden", "text/plain; charset=utf-8", "forbidden\n");
    return;
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      writeHttp10(socket, 404, "Not Found", "text/plain; charset=utf-8", "not found\n");
      return;
    }
    const type = MIME[path.extname(file).toLowerCase()] || "application/octet-stream";
    writeHttp10(socket, 200, "OK", type, data);
  });
}

function onConn(socket) {
  socket.setNoDelay(true);
  socket.setTimeout(120000);
  let buf = Buffer.alloc(0);
  let done = false;
  const finish = (status, reason, type, body) => {
    if (done) return;
    done = true;
    writeHttp10(socket, status, reason, type, body);
  };
  socket.on("data", (chunk) => {
    if (done) return;
    buf = Buffer.concat([buf, chunk]);
    const idx = buf.indexOf("\r\n\r\n");
    if (idx < 0) {
      if (buf.length > 1024 * 1024) {
        finish(431, "Request Header Fields Too Large", "text/plain; charset=utf-8", "headers too large\n");
      }
      return;
    }
    const head = buf.slice(0, idx).toString("latin1");
    const line = head.split("\r\n")[0] || "";
    const parts = line.split(" ");
    const method = parts[0] || "GET";
    const url = parts[1] || "/";
    done = true;
    socket.removeAllListeners("data");
    if (method !== "GET" && method !== "HEAD") {
      writeHttp10(socket, 405, "Method Not Allowed", "text/plain; charset=utf-8", "method\n");
      return;
    }
    serve(socket, url);
  });
  socket.on("timeout", () => {
    finish(408, "Request Timeout", "text/plain; charset=utf-8", "timeout\n");
  });
  socket.on("error", () => {});
}

function listen(host, ipv6Only) {
  return new Promise((resolve, reject) => {
    const server = net.createServer(onConn);
    server.on("error", reject);
    const opts = { port: PORT, host };
    if (ipv6Only) opts.ipv6Only = true;
    server.listen(opts, () => {
      console.log(`HTTP/1.0 preview on ${host === "::" ? "[::1]" : host}:${PORT}`);
      resolve(server);
    });
  });
}

(async () => {
  await listen("0.0.0.0");
  try {
    await listen("::", true);
  } catch (err) {
    console.error("IPv6 listen skipped:", err && err.message);
  }
  console.log("ready");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
