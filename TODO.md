# Focus Timer — Ideas & Backlog (TODO)

This file tracks planned features, enhancements, and ideas to implement in future releases.

---

## High Priority / Next Up

- [ ] **Overall / Global Repeat Interval Setting (Preferred Approach)**
  - **Single unified interval setting**: Instead of managing repeat intervals per task, have an overall session-wide interval setting (e.g., in the timer controls or setup bar).
  - **Simpler UI & workflow**: Removes the need to configure intervals repeatedly when adding tasks and eliminates per-track metadata clutter in the queue.
  - **Live session pacing**: Changing the overall interval instantly updates playback timing for the currently active task as well as all upcoming tasks without having to edit individual items.
  - **Flexible interval options**: Support standard presets (e.g., 5s, 10s, 15s, 30s, 1m, 2m) or custom intervals globally.

- [ ] **Audio Re-Synthesis / Dynamic Playback for Global Interval**
  - Adjust the live cue trigger loop / audio scheduling so changing the global interval works smoothly on the fly without interrupting running timers.

---

## Future Enhancements & Ideas

- [ ] **Task editing modal / inline editor**: Allow editing cue descriptor text and target duration in place for existing queue items.
- [ ] **Custom chime / audio alerts**: Option to play a soft chime or tick sound between spoken voice cues.
- [ ] **Keyboard shortcuts**: Quick pause/resume (Space), skip forward/back (Arrow keys), and add task (Enter).
