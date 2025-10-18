# Copilot Instructions for EscapeRoomVirt

These rules help AI coding agents work productively in this repo. Keep responses concise and concrete, reference real files, and follow the patterns described here.

## Architecture overview
- Node.js/Express + Socket.IO multiplayer web app.
- Public client:
  - HTML views are loaded dynamically into the element with id "viewContainer" in `public/index.html` via `public/js/client.js::loadTask(view)` which fetches `/views/<view>.html` then dynamically imports `/js/<view>.js` and calls `init()` if present.
  - Per-view scripts export a named `init()` and wire DOM events. Examples: `public/js/task1.js`, `public/js/task2.js`, `public/js/task3a.js`.
  - Global UI: top bar in `public/index.html` with back/forward navigation buttons and timer display. Visibility for buttons is managed in `client.js` inside `loadTask`.
- Server:
  - Express static server in `server/server.js` + session wiring.
  - Socket routing in `server/socketHandler.js`. All client events are handled here; team/player registries are in `server/state.js` (Map of teams/players).
  - Game logic uses a simple FSM pattern per team under `server/fsm/` with states like `LobbyState`, `Task1State`, `Task2State`, etc. Each state extends `BaseState` and implements `enter(player)` (per-player navigation) and `onEvent(event, data)`.
  - Team and Player models under `models/` manage membership and per-player progress (`Player.currentStateIndex`) and team history (`Team.teamVisitedStates`, `Team.completedStates`, `Team.stateObjects`).
  - LLM integration for Task 4 via `server/llm.js` using OpenAI; events: `'llm user input'` -> `'llm reply'`.

## Navigation & state pattern (critical)
- Team-level state transitions happen in state `onEvent(...)` methods via `team.setState(new NextState(team))`. Do NOT call `state.enter()` from `Team.setState`.
- Per-player navigation uses `state.enter(player)` which emits `'redirect'` with the correct view for that player.
- Back/Forward:
  - Client emits `'playerGoBack'` / `'playerGoForward'` with `{ playerId }`.
  - Server in `socketHandler.js` adjusts `player.currentStateIndex` and calls `team.stateObjects[index].enter(player)`.
- View loading contract:
  - Every `/views/<name>.html` should have a matching `/js/<name>.js` that exports `init()`; `client.js` calls it conditionally (`if (module.init) module.init();`).
  - Add DOM listeners inside `init()` so they re-bind after navigation.

## Run & debug
- Start server (Windows PowerShell):
  - dev: `nodemon server/server.js`
  - prod: `node server/server.js`
- App URL: http://localhost:3000/
- Configure players: `GET /setMaxPlayers?value=3`.
- LLM requires `OPENAI_API_KEY` in `.env` (see `server/llm.js`). When absent, LLM replies should be guarded.

## Project conventions
- Events: Socket event names are lower-case with spaces for LLM (e.g., `'llm user input'`) and caps for task transitions (e.g., `'TASK3A_COMPLETED'`). Mirror client/server names exactly.
- States:
  - Implement `enter(player)` to emit per-player redirects (e.g., `player.socket.emit('redirect', 'task2')`).
  - Use `onEvent` to: log, mark completion via `team.addCompletedState('TaskXState')`, and call `team.setState(new NextState(team))`. Then loop players and advance those whose `currentStateIndex === stateNumber`.
  - `stateNumber`: 0=Task1, 1=Task2, 2=Task3, 3=Task4, 4=Task5.
  - Avoid team-wide `enter()` side effects during per-player navigation.
- Team model:
  - `Team.setState` appends new state instance to `stateObjects` except `LobbyState`.
  - `Team.broadcastRedirect(html)` for team-wide UI changes when appropriate.
- Client UI:
  - `client.js::loadTask` hides back/forward buttons on [start, lobby, timeout] and shows on tasks.
  - Add click handlers in `DOMContentLoaded` for backButton and forwardButton to emit navigation events.
  - Timer updates via `'timerUpdate'` socket event update the timer element.

## Editing tips for agents
- When adding a new task (Task6):
  1) Create `server/fsm/Task6State.js` extending `BaseState` with `stateNumber`, `enter(player)`, `onEvent('TASK6_COMPLETED')`, and transition.
  2) Create `public/views/task6.html` and `public/js/task6.js` exporting `init()` and wiring DOM.
  3) Ensure transitions in previous state set `team.setState(new Task6State(team))` and update players matching `stateNumber`.
- DOM listeners must be bound inside each `init()`; avoid binding at module top-level to survive view reloads.
- For any new socket event, update both client emit and server handler in `socketHandler.js` with identical names.
- Prefer per-player redirects via `player.socket.emit('redirect', '<view>')`; avoid broadcasting unless explicitly intended.

## Key files
- `server/server.js`, `server/socketHandler.js`, `server/llm.js`.
- `server/fsm/*State.js`, `server/fsm/BaseState.js`.
- `models/Team.js`, `models/Player.js`.
- `public/index.html`, `public/js/client.js`, `public/views/*.html`, `public/js/*.js`.
- Docs: `documentation/readme.md` (features and version notes).

## Known pitfalls
- Missing `init()` in view modules causes `TypeError: module.init is not a function`. Guard with `if (module.init) module.init();`.
- Event listeners attached outside `init()` may stop working after navigation; always bind inside `init()`.
- Ensure server has matching handlers for all emitted events (e.g., add `'TASK3C_COMPLETED'`).

Feedback welcome: If parts of this guide feel incomplete (e.g., tests, exact TimerManager behavior), point to files and I’ll refine this document.