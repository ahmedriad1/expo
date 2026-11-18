---
"expo-web-browser": patch
---

[Android] Fix `openBrowserAsync` and `openAuthSessionAsync` crashing the app when no activity that handles the URL declares the `DEFAULT` category. They now reject with "No matching browser activity found".
