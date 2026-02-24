# AGENTS.md

## Cursor Cloud specific instructions

This is a static HTML/CSS/JS gallery site with no build step, no linter, and no test suite.

### Running the app

Serve the repository root with any static HTTP server. The app uses `fetch('gallery-data.json')` so it cannot be opened via `file://`.

```bash
npx serve . -l 8080
```

Then open `http://localhost:8080` in a browser.

### Key scripts

- `node generate-gallery.js` — scans `images/` and regenerates `gallery-data.json`. Run this after adding/removing images.
- `node generate-new-icons.js` / `node fix-icon-padding.js` — icon utility scripts (require `sharp`).

### Notes

- Firebase Realtime Database is used for persisting notes and want-status. The app degrades gracefully without Firebase connectivity — all gallery features still work, only persistence of notes/want-status is lost.
- There is no lint configuration, no automated test suite, and no build/compile step. The `npm test` script is a placeholder that exits with an error.
- The only npm dependency is `sharp` (used by icon utility scripts, not by the gallery itself).
- See `README.md` for image naming conventions and category URL patterns.
