# Focus Timer

A spoken cue timer PWA, an ADHD focus aid. You type a concise descriptor for the task, and the app speaks it on a repeating interval while a countdown runs, even with the phone screen off.

## How it works

- One Start button: downloads the Kitten TTS Nano voice model on first run, generates the spoken cue, builds a full-session audio track with the cue on repeat, and plays it like music so it keeps going with the screen locked.
- Playlist: queue multiple task timers, one track per task, auto-advancing, with headphone next/previous controls.
- Export/import timer lists as line-delimited text (`task name minutes`) via clipboard.

## Local development

The app is a single self-contained `focus-timer.html`. Serve it locally:

```
make serve
```

Then open http://localhost:8000/focus-timer.html. Use a local server rather than opening the file directly: service workers and persistent model caching need an http origin.

The TTS voice model (~24MB) downloads at runtime from HuggingFace and is not committed. To fetch it locally:

```
make assets
```

## Note

This repo is a snapshot for local development. The installable PWA is built and hosted separately.

## Self-hosting

The Muse share link wraps the app in a Muse page (banner, Muse shortcut name,
shortcut opens the share URL). To host it yourself:

1. Download the latest exported `focus-timer.html` and save it over the one in
   this repo.
2. Run `make assets` to download the voice model, voices, and WASM runtime
   (not committed).
3. Run `make package` to build `focus-timer-pwa.zip`.
4. Unzip the zip on any static host (your NAS, GitHub Pages, Cloudflare
   Pages). Serve over HTTPS (or localhost): the app needs a secure context.
5. Install from your own URL: the shortcut will be named "Focus Timer" from
   `manifest.webmanifest`, with no Muse banner.

Notes:
- The zip has no service worker (the single-file export doesn't include one),
  so install via "Add to Home screen". Offline use is not supported.
- If the app can't find an asset when self-hosted, its debug log names the
  exact path it tried; adjust the `assets/` layout in the Makefile to match.
- To use your own icon, add 192px and 512px PNGs and list them in the
  `icons` array in `manifest.webmanifest`.
