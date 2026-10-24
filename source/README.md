# Isle of Ru: source

The game is built from the files in `src/` by `build.py` (test page) and `build_release.py` (the `index.html` used by GitHub Pages in the repo root).
`tests/` holds the headless-browser tests (Playwright). The helper `th.js` opens `test.html`, which `build.py` creates.
Paths inside the scripts point at the original workspace (`/home/claude/emberisle`); adjust them if you build elsewhere.
