# Favicon for OE

## Minimal implementation approach
1. Copy and move these files into the _root_ folder

```
favicon.svg
favicon.ico
apple-touch-icon.png
android-chrome-192x192.png
android-chrome-256x256.png
```

2. Add the following HTML into the `<head>`

```
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest" />
```
