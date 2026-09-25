# Cookie offline policy — codeflow

Fleet fork of braedonsaunders/codeflow for Chronillogical-Potato / Cookie Monster.

## Local-first (hard)

- **Default UX:** local folder / Open ZIP / CLI only (`cli/codeflow.mjs` on `127.0.0.1`).
- **GitHub URL paste / `api.github.com` disabled** (`window.COOKIE_CODEFLOW_LOCAL_ONLY = true`).
- Shem downloads forks locally; do not paste remote GitHub URLs as the primary workflow.
- **No Vercel.** Do not point fleet at `codeflow-five.vercel.app`.
- **UI:** the old GitHub URL slot shows the local folder being mapped (read-only; full path in CLI mode, folder/ZIP name for browser Open Folder / Open ZIP). Analyze, auth selector, token/App inputs and GitHub-ZIP buttons are not rendered; `.cookie-hide-github` on `<html>` also hides them via CSS. Deep links `?repo=…&run=1` show the local-only refusal toast.
- Obscure opt-in only: `window.COOKIE_CODEFLOW_ALLOW_GITHUB = true` in the browser console (not exposed in UI). Prefer leaving it off.

## Assets

- `vendor/` — already vendored upstream; keep local; no CDN at runtime.
- `assets/fonts/` — Cookie fonts (+ `assets/MANIFEST.json`, `assets/fonts.sha256`).
- `assets/cookie-fonts.css` — `@font-face` for Propo / Mono / Geist Pixel Line.

### Fonts

| File | Family | Use |
|------|--------|-----|
| `FiraCodeNerdFontPropo-Retina.ttf` | `Fira Code Nerd Font Propo` | GUI / body |
| `FiraCodeNerdFontMono-Retina.ttf` | `Fira Code Nerd Font Mono` | mono / grid |
| `GeistPixel-Line.otf` | `Geist Pixel Line` | titles only (own container) |

Shared pointer: `/workspace/cookie-viz-assets/MANIFEST.json`.


## Note on `vendor/jetbrains-mono`

Upstream vendored JetBrains Mono remains on disk for provenance but **is not referenced** by Cookie `index.html`. Do not reintroduce it. Runtime fonts are only under `assets/fonts/`.
