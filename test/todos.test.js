import { test } from "node:test";
import assert from "node:assert/strict";
import { createTodoStore } from "../src/todos.js";

test("adds and lists to-dos", () => {
  const store = createTodoStore();
  const todo = store.add("  write tests ");
  assert.deepEqual(todo, { id: 1, title: "write tests", done: false });
  assert.deepEqual(store.list(), [todo]);
});

test("rejects an empty title", () => {
  const store = createTodoStore();
  assert.throws(() => store.add(" "), /title is required/);
});
