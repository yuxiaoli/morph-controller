# Morph Controller

Responsive Morph Studio controls and iframe preview for the Vector Index Morph demo.

## Development

Use Node.js 22 or later. No package installation is required.

```bash
npm run dev
```

Open http://127.0.0.1:5173. Edit files in `src/` and refresh the browser after changes. Serve the page over HTTP because its JavaScript uses native ES modules.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Serve source files from `src/` on port 5173 |
| `npm test` | Run URL and controller regression tests |
| `npm run build` | Recreate `dist/` from `src/` and add the static publishing marker |
| `npm run preview` | Serve the generated `dist/` on port 4173; build first |

Both servers bind to the local machine only. Set `PORT` to override their default port. The build copies static files without bundling, transpiling, or installing dependencies.

## Project layout

```text
src/
  index.html          HTML entrypoint
  css/styles.css      Theme and responsive layout
  js/app.js           JavaScript entrypoint
  js/                 Configuration, controller, and UI modules
docs/                 Architecture and deployment documentation
tests/                Regression tests
scripts/              Local server and static build scripts
dist/                 Generated site; ignored by Git
.github/workflows/    GitHub Pages publishing workflow
refs/                 Reference server code
```

`src/` is the source of truth. `docs/` contains explanatory Markdown documents. `dist/` is generated output: do not edit or commit it.

See [Architecture](docs/architecture.md) for module responsibilities and validation, and [Deployment](docs/deployment.md) for local production preview and GitHub Pages setup.
