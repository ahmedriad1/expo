---
"expo-web-browser": patch
---

[Android] Fix `openAuthSessionAsync` rejecting every later call after the browser closes in a split-screen or freeform window. A new call now settles the previous session with `{ type: 'dismiss' }` and opens the browser.
