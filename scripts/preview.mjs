import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const port = Number(process.env.PORT || 4175);
const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
};
createServer(async (request, response) => {
  try {
    let route = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    if (route.endsWith("/")) route += "index.html";
    const allowed =
      [
        "/index.html",
        "/styles.css",
        "/site.js",
        "/privacy/index.html",
        "/support/index.html",
        "/confirmed/index.html",
      ].includes(route) || /^\/assets\/[a-zA-Z0-9_.-]+$/.test(route);
    if (!allowed) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    const data = await readFile(path.join(root, route));
    response.writeHead(200, {
      "Content-Type": types[path.extname(route)] || "text/plain",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(data);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}).listen(port, "127.0.0.1", () =>
  console.log(`Solyx preview: http://127.0.0.1:${port}`),
);
