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

## CI and GitHub Pages

The `.github/workflows/pages.yml` workflow runs `npm test` and `npm run build` for every push to `develop` and every pull request targeting `develop`. Pull requests run validation only. Successful pushes to `develop` upload `dist/` and deploy it to Pages.

The `github-pages` environment permits deployments from `develop`. The workflow checks that branch before configuring Pages, uploading its artifact, or deploying, so a manual run on another branch performs validation without attempting a rejected deployment. Tests or build failures prevent deployment.

The workflow uses the official GitHub Pages actions, as described in [GitHub's custom workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). **Settings → Pages** should use **GitHub Actions** as its publishing source.

## Publish an update

Commit your changes on `develop`, then push them:

```bash
git push origin develop
```

To redeploy the latest remote `develop` without another commit:

```bash
gh workflow run pages.yml --ref develop
```

To view recent runs, use `gh run list --workflow pages.yml --branch develop` or open **Actions → CI and GitHub Pages**. A successful deploy exposes the site URL through its `github-pages` environment. The old branch-based `/docs` publishing setup no longer applies.
