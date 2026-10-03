# Project Structure

- `src/`: Application source. Edit this directory.
  - `index.html`: HTML entrypoint.
  - `css/styles.css`: Theme and responsive layout.
  - `js/app.js`: JavaScript entrypoint and module wiring.
  - `js/`: Configuration, controller, form, panel, and preview modules.
- `docs/`: Explanatory documentation.
  - `architecture.md`: Module responsibilities, behavior, and validation.
  - `deployment.md`: Build, preview, and GitHub Pages instructions.
- `dist/`: Generated static site. Created by `npm run build` and ignored by Git.
- `scripts/`: Dependency-free Node.js build and local server scripts.
- `tests/`: Regression tests that import directly from `src/js/`.
- `.github/workflows/pages.yml`: Manually triggered GitHub Pages deployment of `dist/`.
- `refs/morph.md`: Reference server code; not included in the published site.
- `README.md`: Development commands and documentation entrypoint.
- `context/`: Workspace guidance, including PowerShell conventions.
- `temp/`: Ignored development artifacts and screenshots.

The remaining empty scaffold directories are unused. `docs/` is not a publishing directory, and generated files must never be edited as source.
