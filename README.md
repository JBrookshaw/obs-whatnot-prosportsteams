# obs-whatnot-prosportsteams

A local web controller + overlay system for OBS that lets you pick pro sports teams (NFL, NBA, MLB, MLS, NHL, WNBA), show them in a grid, and maintain a synchronized spot list with player names.

## Pages

When the local server is running, these pages are available:

- `http://127.0.0.1:8080/controller.html`
  - Full control surface.
  - Includes team selection controls, spot list editing, and OBS source visibility controls.
- `http://127.0.0.1:8080/overlay.html`
  - Team grid output page for OBS Browser Source.
  - Shows selected teams for the active league.
- `http://127.0.0.1:8080/spot-list.html`
  - Spot list output page for OBS Browser Source.
  - Shows selected teams with player names entered in the controller.

## Quick Start

No build step is required.

1. Start the local server:

   ```bash
   cd /Users/jeff/Documents/obs/obs-whatnot-prosportsteams
   node server.js
   ```

2. Open the controller:

   - `http://127.0.0.1:8080/controller.html`

## Control Panel Functionality

The controller page combines OBS controls and content controls.

### Team Selector Controls

- **League buttons**: switch active league (NFL/NBA/MLB/MLS/NHL/WNBA).
- **Size buttons**: change tile size (`Small`, `Medium`, `Large`) for the team grid output.
- **Team tiles**: click to select/deselect teams.
- **Reset button**: clears all selected teams for the active league and clears spot list player names for that league.
- **Selected count**: shows how many teams are currently selected.

### Spot List Controls

- Spot list updates from selected teams in the active league.
- Each selected team gets a text input for player name.
- Player name edits are saved and synced to the output pages.
- **Hide/Show Spot List** button toggles visibility in the controller.

### OBS Source Control Panel

- **Host / Port / Password** fields for OBS WebSocket connection settings.
- **Save OBS Settings** stores connection + source mapping settings.
- **Test Connection** verifies controller-to-OBS WebSocket connectivity.
- Separate source mapping cards for:
  - **Team Grid Source** (overlay page)
  - **Spot List Source** (spot list page)
- **Show / Hide** buttons send OBS WebSocket commands to toggle each configured source in its scene.

## OBS WebSocket Setup (OBS 28+ / obs-websocket 5.x)

1. In OBS, open **Tools -> WebSocket Server Settings**.
2. Enable **WebSocket server**.
3. Confirm port (default is usually `4455`).
4. If password authentication is enabled in OBS, set/confirm the password.
5. In this project controller (`controller.html`), enter:
   - **Host**: usually `127.0.0.1`
   - **Port**: your OBS WebSocket port (for example `4455`)
   - **Password**: exactly the OBS WebSocket password (or leave blank if OBS auth is disabled)
6. Click **Save OBS Settings**.
7. Click **Test Connection** and confirm success status.
8. In OBS, note your exact scene and source names for both browser sources.
9. In the controller, enter scene/source mappings under:
   - **Team Grid Source**
   - **Spot List Source**
10. Use **Show** / **Hide** to verify controller-driven visibility works.

## OBS Browser Source URLs

Use these in OBS Browser Source properties:

- Team grid source URL: `http://127.0.0.1:8080/overlay.html`
- Spot list source URL: `http://127.0.0.1:8080/spot-list.html`

## Runtime Files

The local server writes runtime state/config files in the project root:

- `overlay-state.json`
- `obs-config.json`

These are local runtime artifacts used to persist selections and OBS settings.
