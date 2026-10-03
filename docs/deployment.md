# Deployment

The application source is in `src/`. Build output goes to `dist/`; `docs/` is reserved for documentation.

## Build and preview locally

Use Node.js 22 or later. No dependency installation is required.

```bash
npm test
npm run build
npm run preview
```

Open http://127.0.0.1:4173. The build recreates `dist/`, copies the source files unchanged, and adds `.nojekyll`. Local preview serves exactly that output. Use `npm run dev` to work directly against `src/` on port 5173.

Only the contents of `dist/` should be published. Its entrypoint is `index.html`, with relative `css/` and `js/` assets; no base-path rewrite is needed for a repository subpath. Rebuild after source changes. Do not edit or commit generated files.

## GitHub Pages

The repository includes `.github/workflows/pages.yml`, a manually triggered publishing workflow. It runs tests, builds the site, uploads `dist/`, then deploys that artifact to Pages. It uses the official GitHub Pages actions, as described in [GitHub's custom workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

When you are ready to choose or create a GitHub repository:

1. Push the source, documentation, tests, scripts, package manifest, and workflow to the repository's default branch.
2. Open **Settings → Pages** and select **GitHub Actions** as the publishing source.
3. Open **Actions → Deploy GitHub Pages → Run workflow** and choose the branch to publish.
4. Wait for the build and deploy jobs to finish. The deploy job exposes the published site URL through its `github-pages` environment.

The workflow is manual so publishing can be enabled deliberately once the repository and publishing branch are chosen. The old branch-based `/docs` publishing setup no longer applies.
