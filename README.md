# Focus Timer

A spoken cue timer PWA, an ADHD focus aid. You type a single word for the task, and the app speaks it on a repeating interval while a countdown runs, even with the phone screen off.

## How it works

- One Start button: downloads the Kitten TTS Nano voice model on first run, generates the cue word, builds a full-session audio track with the word on repeat, and plays it like music so it keeps going with the screen locked.
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
