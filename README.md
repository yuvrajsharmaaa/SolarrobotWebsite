# Website Construction ani temlate #001

This project runs locally with a full config-driven customization system.

## Run

PowerShell (no install):

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```

Open:

- http://localhost:5173

Node.js option:

```bash
npm start
```

## Customize from one file

Edit:

- `assets/customization/site-config.js`

Config sections include:

- `branding`, `seo`, `theme`
- `media` (hero video/poster, lottie, mobile frames)
- `hero`, `mission`, `sectionIntro`, `pinnedSlides`
- `cta`, `safety`, `solar`
- `navigation` (header/footer links by label)
- `social` (footer social URLs)
- `legal` (policy links + copyright text)

## Visual editor in browser

The floating **Customize** button opens a JSON editor panel.

Files:

- `assets/customization/customizer.js` (applies config)
- `assets/customization/admin-panel.js` (visual editor)
- `assets/customization/customization.css` (panel + theme styles)

Panel actions:

- `Apply`: live update only
- `Save`: live update + persist in browser local storage
- `Reset`: revert to `site-config.js`
- `Download JSON`: export current config

## Crane/model files

Replace these to use your own sequence animations:

- `export/video/pile-sequence-018_step_jpeg_opt.json`
- `export/video/sequence-mobile.json`

Then hard refresh with Ctrl+F5.
# Sola Local Project

This project runs locally and now includes a full customization layer.

## Run

PowerShell (no install):

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```

Open:

- http://localhost:5173

Node.js option:

```bash
npm start
```

## Full Customization

Main control file:

- `assets/customization/site-config.js`

You can edit from one place:

- Branding (title, logo text)
- Theme colors
- Hero text and media
- Mission lines
- Section intro text
- Pinned slide text (both mobile and desktop overlays)
- CTA labels and links
- Safety and Solar section text/buttons/media

Runtime applier:

- `assets/customization/customizer.js`

Customization styles:

- `assets/customization/customization.css`

## Media Files

Local image assets:

- `assets/images/`

Local video/lottie assets:

- `export/video/`

Replace these for crane sequence customization:

- `export/video/pile-sequence-018_step_jpeg_opt.json`
- `export/video/sequence-mobile.json`

Then hard refresh with Ctrl+F5.
# Local Website Project

This project runs locally from captured assets and is prepared so key homepage media can be edited directly from local files.

## Run (PowerShell, no install)

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```

Then open:

- http://localhost:5173

## Run (Node.js optional)

If Node.js is installed:

```bash
npm start
```

## Main editable files

- Page markup: `index.html`
- Main runtime script: `homepage.0be0c0b6224c7b3312e9.js`
- Lottie URL map: `index.js`
- Local videos: `export/video/`
- Local images: `assets/images/`

## Notes about blocked source assets

Some source endpoints on builtrobotics.com are protected by Cloudflare and cannot be mirrored directly from this environment. If you have the original JSON/video files, drop them into:

- `export/video/pile-sequence-018_step_jpeg_opt.json`
- `export/video/sequence-mobile.json`
- `export/video/safety_1080p.mp4` (optional replacement for current fallback)

Hard refresh with Ctrl+F5 after replacing assets.
# Local Website Project

This project runs a local website from your captured assets and keeps animations/scripts working in a normal browser environment.

## Requirements

- Option A: PowerShell (already available on Windows)
- Option B: Node.js 18+ (optional)

## Run (PowerShell, no install)

1. Open terminal in this folder.
2. Run:

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```

3. Open:

http://localhost:5173

## Run (Node.js optional)

If Node.js is installed, you can also run:

```bash
npm start
```

## Notes

- Main page: index.html
- Local font override: local-fonts.css
- Original captured source copy: index
- Local server entry: server.js
- PowerShell server entry: serve.ps1
- Service worker file: sw.js

If a browser caches old assets, do a hard refresh (Ctrl+F5).
# Built Robotics Homepage Clone

This project runs a local clone of the Built Robotics homepage using captured HTML, CSS, JS, and font assets.

## What is included

- Full homepage markup in index.html
- Captured animation bundles
- GSAP and ScrollTrigger from CDN
- Lottie JSON loaded from Built Robotics endpoints
- Local Calibre font override

## Run locally

### Option 1 (recommended, Node.js)

1. Open terminal in this folder.
2. Install dependencies:

   npm install

3. Start server:

   npm start

4. Open:

   http://localhost:5500/index.html

### Option 2 (Python)

1. Open terminal in this folder.
2. Run:

   python -m http.server 5500

3. Open:

   http://localhost:5500/index.html

## Notes

- Run through an HTTP server. Do not use direct file opening for best module and service-worker behavior.
- Some media and animation data is loaded from Built Robotics CDN and website endpoints.
