import http from "node:http";
import { pathToFileURL } from "node:url";
import { createTodoStore } from "./todos.js";

export function createServer(store = createTodoStore()) {
  return http.createServer(async (req, res) => {
    const send = (status, body) => {
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(body));
    };

    // GET /health
    // Liveness check. Always answers 200 with { "ok": true }.
    if (req.method === "GET" && req.url === "/health") return send(200, { ok: true });

    // GET /todos
    // Returns every to-do as a JSON array (200).
    if (req.method === "GET" && req.url === "/todos") return send(200, store.list());

    // POST /todos
    // Creates a to-do. Send a JSON body like { "title": "Buy milk" }.
    //   201 -> the newly created to-do: { "id": 1, "title": "Buy milk", "done": false }
    //   400 -> { "error": "..." } if the body is not valid JSON or the title
    //          is rejected by the store (e.g. missing or empty)
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
    // Anything else: 404 with { "error": "not found" }.
    return send(404, { error: "not found" });
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT ?? 3000);
  createServer().listen(port, () => console.log(`listening on ${port}`));
}
