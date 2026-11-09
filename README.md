# feedramp-practice

A deliberately tiny to-do app that Feedramp's autonomous workers practise on
before they work on real code (AO-4 first run).

- `npm start` runs the server on port 3000.
- `npm test` runs the tests (Node 20+, no dependencies).

Endpoints: `GET /health`, `GET /todos`, `POST /todos {"title": "..."}`.

Workers push only to `feedramp/*` branches and open pull requests. `main` is
protected: changes land through reviewed pull requests only.
