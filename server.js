"use strict";

const fs = require("fs");
const path = require("path");
const http = require("http");

const projectRoot = __dirname;
const submitLeadHandler = require("./api/submit-lead");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".txt": "text/plain; charset=utf-8",
};

function loadEnvFile() {
  const envPath = path.join(projectRoot, ".env");
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separator = line.indexOf("=");
    if (separator <= 0) continue;

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();

    if (!(key in process.env)) process.env[key] = value;
  }
}

function isPathInsideRoot(candidatePath) {
  const normalizedRoot = path.resolve(projectRoot);
  const normalizedCandidate = path.resolve(candidatePath);
  return (
    normalizedCandidate === normalizedRoot ||
    normalizedCandidate.startsWith(`${normalizedRoot}${path.sep}`)
  );
}

function sendStatus(res, statusCode, message) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end(message);
}

function patchExpressLikeRes(res) {
  res.status = function status(code) {
    res.statusCode = code;
    return res;
  };

  res.json = function json(payload) {
    if (!res.getHeader("Content-Type")) {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
    }
    res.end(JSON.stringify(payload));
    return res;
  };

  return res;
}

function serveStatic(req, res, pathname) {
  const safePath = pathname === "/" ? "/index.html" : pathname;
  const decodedPath = decodeURIComponent(safePath);
  const absolutePath = path.join(projectRoot, decodedPath);

  if (!isPathInsideRoot(absolutePath)) {
    return sendStatus(res, 403, "Forbidden");
  }

  const baseName = path.basename(absolutePath);
  if (baseName.startsWith(".")) {
    return sendStatus(res, 404, "Not Found");
  }

  if (!fs.existsSync(absolutePath)) {
    return sendStatus(res, 404, "Not Found");
  }

  const stats = fs.statSync(absolutePath);
  if (!stats.isFile()) {
    return sendStatus(res, 404, "Not Found");
  }

  const extension = path.extname(absolutePath).toLowerCase();
  const contentType = MIME_TYPES[extension] || "application/octet-stream";
  res.statusCode = 200;
  res.setHeader("Content-Type", contentType);

  if (req.method === "HEAD") {
    res.end();
    return;
  }

  const stream = fs.createReadStream(absolutePath);
  stream.on("error", () => sendStatus(res, 500, "Server Error"));
  stream.pipe(res);
}

loadEnvFile();

const server = http.createServer(async (req, res) => {
  const host = req.headers.host || "localhost";
  const url = new URL(req.url || "/", `http://${host}`);

  if (url.pathname === "/api/submit-lead") {
    if (req.method !== "POST") {
      return patchExpressLikeRes(res)
        .status(405)
        .json({ ok: false, code: "METHOD_NOT_ALLOWED", message: "Метод не поддерживается." });
    }

    req.body = undefined;
    return submitLeadHandler(req, patchExpressLikeRes(res));
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    return sendStatus(res, 405, "Method Not Allowed");
  }

  return serveStatic(req, res, url.pathname);
});

const port = Number(process.env.PORT || 3000);
server.listen(port, () => {
  console.log(`[local-server] started: http://localhost:${port}`);
  console.log(`[local-server] api endpoint: http://localhost:${port}/api/submit-lead`);
});
