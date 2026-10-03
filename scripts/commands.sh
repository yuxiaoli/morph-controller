# Run serve.js
bun run scripts/serve.js

# Update GitHub Pages
gh workflow run pages.yml --ref develop
