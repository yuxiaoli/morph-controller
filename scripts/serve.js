import { createServer } from "node:http";
import { access, readFile, realpath, stat } from "node:fs/promises";
import { extname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const folder = process.argv[2] ?? "src";
if (!["src", "dist"].includes(folder)) throw new Error("Choose src or dist to serve.");
const root = await realpath(fileURLToPath(new URL(`../${folder}/`, import.meta.url)));
await access(resolve(root, "index.html"));
const port = Number(process.env.PORT ?? (folder === "src" ? 5173 : 4173));
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid PORT.");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
};

function withinRoot(path) {
  const local = relative(root, path);
  return local !== ".." && !local.startsWith(`..${sep}`) && !isAbsolute(local);
}

const server = createServer(async (request, response) => {
  if (!["GET", "HEAD"].includes(request.method)) {
    response.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }
  try {
    const url = new URL(request.url, "http://localhost");
    let path = resolve(root, `.${decodeURIComponent(url.pathname)}`);
    if (!withinRoot(path)) {
      response.writeHead(403).end("Forbidden");
      return;
    }
    path = await realpath(path);
    if (!withinRoot(path)) {
      response.writeHead(403).end("Forbidden");
      return;
    }
    if ((await stat(path)).isDirectory()) {
      if (!url.pathname.endsWith("/")) {
        response.writeHead(301, { Location: `${url.pathname}/${url.search}` }).end();
        return;
      }
      path = await realpath(resolve(path, "index.html"));
      if (!withinRoot(path)) {
        response.writeHead(403).end("Forbidden");
        return;
      }
    }
    const body = await readFile(path);
    response.writeHead(200, {
      "Content-Type": contentTypes[extname(path)] ?? "application/octet-stream",
      "Cache-Control": "no-store",
    });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch (error) {
    const status = error instanceof URIError ? 400 : ["ENOENT", "ENOTDIR"].includes(error.code) ? 404 : 500;
    response.writeHead(status).end(status === 404 ? "Not found" : "Unable to serve this request");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Serving ${folder}/ at http://127.0.0.1:${port}`);
});
