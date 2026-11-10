// An in-memory to-do list. Small on purpose: Feedramp workers practise
// building features here before they touch real code.

export function createTodoStore() {
  const todos = new Map();
  let nextId = 1;

  return {
    list() {
      return [...todos.values()];
    },
    add(title) {
      if (typeof title !== "string" || title.trim() === "") {
        throw new Error("title is required");
      }
      const todo = { id: nextId++, title: title.trim(), done: false };
      todos.set(todo.id, todo);
      return todo;
    },
    remove(id) {
      return todos.delete(id);
    },
    get(id) {
      return todos.get(id) ?? null;
    },
  };
}
