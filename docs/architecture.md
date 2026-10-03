# Architecture

Morph Controller is a static HTML, CSS, and JavaScript application. Native ES modules separate domain logic from browser interactions. It has no runtime framework, external icon library, or backend API.

## Source and output

- `src/index.html` is the HTML entrypoint and loads `src/js/app.js`.
- `src/css/styles.css` defines the theme, controls, desktop layout, and mobile drawer.
- `docs/` contains explanatory documents.
- `npm run build` copies `src/` into a clean `dist/` and creates `dist/.nojekyll`.
- `dist/` is disposable build output and is ignored by Git.

All browser assets and module imports use relative paths, so the same build works at a domain root or under a GitHub repository path.

## JavaScript modules

| Module in `src/js/` | Responsibility |
| --- | --- |
| `app.js` | Connects the modules; copy/open actions and notifications |
| `configuration.js` | Server URL, defaults, shape names, limits, validation, and URL generation |
| `controller.js` | Draft/applied configuration and the 800ms auto-apply timer |
| `builder.js` | Form values, color synchronization, field errors, and action visibility |
| `panel.js` | Responsive panel state, background isolation, and keyboard focus |
| `preview.js` | Iframe navigation, reload, document loading status, and fullscreen |

Change defaults, limits, or shape names in `configuration.js`; the form and preview share that configuration. Shape positions are the server's numeric IDs, so do not reorder the list.

Shape names describe formulas in `refs/morph.md`. Twisted Ring (Continuous) uses the same curve as Twisted Ring with different sampling. Butterfly Shell (Alternate) preserves the server's duplicate butterfly formula. The supported shape IDs remain 0 through 17.

## State and navigation

Form edits update a draft independently of the applied configuration. Invalid edits cancel pending auto apply and disable actions that require a valid URL. Auto apply waits 800ms after the last edit; its Apply/Reset section is hidden and its application leaves the mobile drawer open.

Manual Apply and reload navigate the existing iframe. Copy and Open use the generated draft URL; reload uses the applied URL. Panel visibility and viewport changes only update layout and focus, preserving both the iframe and the draft. A valid manual Apply closes the mobile drawer.

## Validation

Run `npm test` with Node.js 22 or later. Tests import the source modules directly and cover defaults, numeric limits, all 18 shape IDs, invalid inputs, color normalization, manual drafts, reset, and auto-apply timing/cancellation with a simulated clock.

For browser changes, check 320px, 390px, 768px, desktop, and mobile landscape layouts. Verify drawer focus and dismissal, retained drafts, stable iframe height when toggling controls, dark dropdowns, copy/open/reload/fullscreen, and hidden actions in auto mode. The iframe load indicator reports document loading only; inspect the remote animation separately.
