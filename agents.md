# Agent Guidelines for Focus Timer

## 1. Version Bumping (CRITICAL)
Whenever you make changes to this codebase:
- **Bump the version in `version.txt`** (e.g., `v2026.10.11.4` -> `v2026.10.11.5`).
- The app reads `version.txt` at runtime and displays it directly in the UI header (`#appVersion`).
- Also keep `package.json` version and `sw.js` cache version in sync when making breaking asset or schema updates.

## 2. Project Architecture & Modularization
The codebase is intentionally modular:
- **`index.html`**: Clean semantic HTML structure (shell, inputs, dial display, queue list, audio element).
- **`styles.css`**: All CSS rules, CSS variables (`--bg`, `--surface`, `--text`, `--accent`), responsive layout, and dark/light modes.
- **`app.js`**: Core state management, playlist queueing, countdown timer, Web Audio API synthesis, and Kitten TTS ONNX pipeline integration.
- **`version.txt`**: Dedicated file holding the current version string. Read dynamically by `app.js`.
- **`sw.js`**: Service worker caching app shell and large model assets for offline PWA operation.
- **`server.js`**: Express server providing transparent local caching for development and static hosting.
- **`Makefile`**: Standard CLI commands (`make serve`, `make assets`, `make package`).

## 3. Cue Constraints & Descriptors
- Spoken cues are **concise descriptors** (not limited to single words).
- The maximum character limit is **128 characters**.
- All user-facing copy should refer to "cue descriptor" or "spoken cue" rather than restricting users to a single "word".
- Text display inside `.cue-word` uses responsive font scaling (`clamp(...)`) and word breaking (`overflow-wrap: anywhere`) so longer descriptors fit cleanly within the timer dial.

## 4. Audio Pipeline & Upstream Fallbacks
- The app uses Kitten TTS Nano v0.1 via `tts-pipelines` and ONNX Runtime Web.
- When running on static hosts without pre-downloaded local assets (such as GitHub Pages), `app.js` automatically falls back to upstream Hugging Face and jsDelivr URLs.
- Do not remove or alter `fetchAssetWithFallback` or remote asset fallbacks.

## 5. Local Storage & Task List Persistence
- The timer queue is automatically saved to browser `localStorage` (`focus_timer_queue_v1`) whenever tasks are added, removed, reordered, imported, or cleared.
- Saved tasks persist across page reloads and PWA app restarts.
- Cues, durations, voice selections, and repeat intervals are restored on startup.

## 6. Ideas & Backlog (`TODO.md`)
- `TODO.md` is reserved for documenting planned features, enhancements, and backlog items not yet ready for immediate implementation.

## 7. Testing & Verification
- Verify that changes compile cleanly (`compile_applet`).
- Verify that `version.txt` is served correctly and rendered in the DOM.
- Verify that adding cues up to 128 characters works as expected.
