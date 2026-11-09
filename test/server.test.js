import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "../src/server.js";

async function withServer(fn) {
  const server = createServer();
  await new Promise((r) => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}`;
  try { await fn(base); } finally { server.close(); }
}

test("health check", () => withServer(async (base) => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
}));

test("create then list", () => withServer(async (base) => {
  const created = await fetch(`${base}/todos`, { method: "POST", body: JSON.stringify({ title: "buy milk" }) });
  assert.equal(created.status, 201);
  const list = await (await fetch(`${base}/todos`)).json();
  assert.equal(list.length, 1);
  assert.equal(list[0].title, "buy milk");
}));

test("bad input returns 400", () => withServer(async (base) => {
  const res = await fetch(`${base}/todos`, { method: "POST", body: JSON.stringify({ title: "" }) });
  assert.equal(res.status, 400);
}));

test("delete removes a todo and returns 204", () => withServer(async (base) => {
  const created = await (await fetch(`${base}/todos`, { method: "POST", body: JSON.stringify({ title: "x" }) })).json();
  const res = await fetch(`${base}/todos/${created.id}`, { method: "DELETE" });
  assert.equal(res.status, 204);
  assert.equal((await (await fetch(`${base}/todos`)).json()).length, 0);
}));

test("delete unknown id returns 404", () => withServer(async (base) => {
  const res = await fetch(`${base}/todos/999`, { method: "DELETE" });
  assert.equal(res.status, 404);
}));
