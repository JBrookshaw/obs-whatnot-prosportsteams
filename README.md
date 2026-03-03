# OBS Whatnot NFL Team Overlay

A lightweight OBS Browser Source overlay for showing all 32 NFL team logos in a single square grid.

- Click any team tile to toggle it as selected.
- Selected teams are grayed out.
- Team selection persists across reloads using `localStorage`.

## Project Structure
- `overlay.html`: Main overlay page loaded by OBS/browser.
- `styles.css`: Grid and tile styling.
- `overlay.js`: Team data, render logic, click handling, persistence.
- `assets/logos/*.png`: Team logo image assets.

## Local Run
No build step is required.

### Option 1: Open directly
1. Open `/Users/jeff/Documents/obs/obs-whatnot-nflteamoverlay/overlay.html` in a browser.

### Option 2: Run a local web server (recommended)
1. In Terminal:
   ```bash
   cd /Users/jeff/Documents/obs/obs-whatnot-nflteamoverlay
   python3 -m http.server 8080
   ```
2. Open `http://localhost:8080/overlay.html`.

## OBS Setup
1. In OBS, add a **Browser Source**.
2. Use one of these:
   - **Local File**: `/Users/jeff/Documents/obs/obs-whatnot-nflteamoverlay/overlay.html`
   - **URL**: `http://localhost:8080/overlay.html` (if running local server)
3. Set Browser Source width/height to your scene resolution.
4. Position and scale as needed in your scene.

## Controls
- Mouse: Click a team tile to toggle selected/unselected.
- Keyboard: Press `R` to reset all selections.

## Notes
- The overlay currently has no header/UI controls by design (grid-only).
- If OBS caches old styles, use **Refresh cache of current page** in Browser Source properties.
