# Sola Website - Run Anywhere Guide

This project is a static website (HTML/CSS/JS + local assets). You do not need a build step.

If you can run a simple local server, you can run this project.

## 1. What You Need

- A web browser (Chrome, Edge, Firefox, Safari)
- One of these server options:
  - Node.js 18+ (Windows/macOS/Linux)
  - PowerShell (Windows only)
  - Python 3 (optional fallback, any OS)

## 2. Open the Project Folder

Open a terminal in the project folder where this README is located.

Example (Windows PowerShell):

```powershell
cd C:\Users\Asus\Desktop\website\sola
```

## 3. Start a Local Server

Use any one option below.

### Option A: PowerShell script (Windows easiest)

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```

### Option B: Node.js server (cross-platform)

```bash
node server.js
```

### Option C: Python fallback (cross-platform)

```bash
python -m http.server 5173
```

## 4. Open the Website

Open this URL in your browser:

http://localhost:5173

## 5. Stop the Server

Press Ctrl+C in the terminal.

## 6. Customize the Site

Main config file:

- assets/customization/site-config.js

You can update text, links, theme colors, and media paths from this file.

## 7. Crane Sequence (Desktop + Mobile)

Crane image sequence is configured in:

- assets/customization/site-config.js

Use these keys inside `media`:

- `craneSequenceDesktop`
- `craneSequenceMobile`
- `craneSequence` (shared fallback)

Runtime loader:

- assets/customization/crane-sequence.js

Behavior:

- Desktop (`> 1024px`) uses `craneSequenceDesktop` first
- Mobile (`<= 1024px`) uses `craneSequenceMobile` first
- Falls back to `craneSequence`, then `mobileSequence`

## 8. In-Browser Visual Editor

There is a floating Customize button in the UI.

Editor actions:

- Apply: live preview
- Save: persists in browser local storage
- Reset: returns to defaults from site-config.js
- Download JSON: exports current config

## 9. Important Project Files

- index.html (main page)
- homepage.0be0c0b6224c7b3312e9.js (homepage interactions)
- server.js (Node local server)
- serve.ps1 (PowerShell local server)
- assets/customization/site-config.js (central config)
- assets/customization/customizer.js (config applier)
- assets/customization/admin-panel.js (visual editor)
- assets/customization/customization.css (customization styles)
- assets/customization/crane-sequence.js (crane canvas sequence)
- assets/images/ (images)
- export/video/ (video/lottie/json assets)

## 10. Troubleshooting

### Port already in use

If `5173` is busy, start on another port.

PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1 -Port 8080
```

Node:

```bash
set PORT=8080 && node server.js
```

Then open http://localhost:8080

### PowerShell script blocked

Use the exact command shown above with `-ExecutionPolicy Bypass`.

### "node is not recognized"

Install Node.js, or use Option A (PowerShell) or Option C (Python).

### Website looks outdated after edits

Do a hard refresh:

- Windows/Linux: Ctrl+F5
- macOS: Cmd+Shift+R

### Do not open index.html directly

Always use `http://localhost:...` from a local server.
Direct file open can break scripts and asset loading.
# Sola Local Website

Local static site with captured assets, GSAP interactions, and a config-driven customization layer.

## Quick Start

### Option A: PowerShell server (recommended on Windows)

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```

Open http://localhost:5173

### Option B: Node server

```bash
node server.js
```

Open http://localhost:5173

## Project Structure

- Main page: `index.html`
- Main homepage runtime bundle: `homepage.0be0c0b6224c7b3312e9.js`
- Local static server (Node): `server.js`
- Local static server (PowerShell): `serve.ps1`
- Customization config: `assets/customization/site-config.js`
- Customization runtime: `assets/customization/customizer.js`
- In-browser editor: `assets/customization/admin-panel.js`
- Theme/customization styles: `assets/customization/customization.css`
- Crane sequence runtime: `assets/customization/crane-sequence.js`

## Customization

Edit this file:

- `assets/customization/site-config.js`

Main sections:

- `branding`, `seo`, `theme`
- `media`
- `hero`, `mission`, `sectionIntro`
- `pinnedSlides`
- `safety`, `solar`, `cta`
- `navigation`, `social`, `legal`

## Crane Sequence Configuration

Crane image sequence source order is selected by viewport:

1. Desktop (`> 1024px`):
   - `media.craneSequenceDesktop`
   - fallback `media.craneSequence`
   - fallback `media.mobileSequence`
2. Mobile (`<= 1024px`):
   - `media.craneSequenceMobile`
   - fallback `media.craneSequence`
   - fallback `media.mobileSequence`

Current sequence runner:

- `assets/customization/crane-sequence.js`

The runtime auto-reinitializes when crossing the desktop/mobile breakpoint.

## In-Browser Editor

Use the floating **Customize** button to open the JSON editor.

Actions:

- `Apply`: temporary live update
- `Save`: live update + persist in local storage
- `Reset`: restore config defaults from `site-config.js`
- `Download JSON`: export current config

## Media Replacement

Local media folders:

- Images: `assets/images/`
- Video/JSON: `export/video/`

After media/config changes, hard refresh with Ctrl+F5.
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
