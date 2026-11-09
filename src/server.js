import http from "node:http";
import { pathToFileURL } from "node:url";
import { createTodoStore } from "./todos.js";

export function createServer(store = createTodoStore()) {
  return http.createServer(async (req, res) => {
    const send = (status, body) => {
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(body));
    };

    if (req.method === "GET" && req.url === "/health") return send(200, { ok: true });
    if (req.method === "GET" && req.url === "/todos") return send(200, store.list());
    if (req.method === "POST" && req.url === "/todos") {
      let raw = "";
      for await (const chunk of req) raw += chunk;
      try {
        const { title } = JSON.parse(raw || "{}");
        return send(201, store.add(title));
      } catch (err) {
        return send(400, { error: err.message });
      }
    }
    return send(404, { error: "not found" });
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT ?? 3000);
  createServer().listen(port, () => console.log(`listening on ${port}`));
}
