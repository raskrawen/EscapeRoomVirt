# Agent Instructions (Generalized for Multi-Client Projects)

Disse retningslinjer hjælper AI-agenter og udviklere med at strukturere og udvide multiplayer web-apps, hvor flere klienter (players) tilgår samme server. Instruktionerne er generelle og kan genbruges på tværs af projekter.

## Arkitektur
- **Node.js/Express** server med **Socket.IO** til realtidskommunikation.
- **Client-side**: Dynamisk HTML/JS, hvor views loades ind i et container-element (fx `#viewContainer`).
- **Per-player state**: Hver player har sin egen state-maskine (FSM), og identificeres unikt via både `uuidv4` og `socketID`.
- **Konfigurationsfil** på serveren til indstillinger (fx max spillere, API-nøgler).
- **.env** bruges til følsomme nøgler (API, secrets).


## Mappe-struktur (forslag)
```
project-root/
│  .env
│  .gitignore
│  package.json
│  Procfile
│  README.md

│
├─ config/
│    serverConfig.js
│
├─ server/
│    server.js
│    socketHandler.js
│    state.js
│    fsm/
│        BaseState.js
│        LobbyState.js
│        GameState.js
│        EndState.js
│
├─ models/
│    Player.js
│
├─ public/
│    index.html
│    styles.css
│    views/
│        lobby/
│            lobby.html
│            lobby.js
│        game/
│            game.html
│            game.js
│        end/
│            end.html
│            end.js
│    assets/
│        images/
│        audio/
│
├─ tests/
│    ...
│
├─ documentation/
│    agent_instructions.md
│    projekt_navn_instructions.md
│    ...
```

### Fordele ved denne struktur
- Hver view-mappe indeholder både .html og .js for det pågældende view, hvilket gør det nemt at finde og vedligeholde relaterede filer.
- Mindsker risiko for navnekonflikter og gør det lettere at udvide med flere views.
- `tests/`-mappen samler alle testfiler ét sted.
- `Procfile` gør det nemt at deploye til platforme som Heroku ved at definere startkommandoen for serveren.

## Principper
- **Unik identifikation**: Hver player får tildelt en `uuidv4` og identificeres også via sin `socketID`.
- **Per-player FSM**: States følger spilleren, ikke et team. Player har fx `currentStateIndex` og state-historik.
- **Dynamisk view-loading**: Views loades ind i et container-element, og tilhørende JS-modul importeres og initialiseres (kræver eksport af `init()` i hvert view-script).
- **Navigation**: Header med navigation, timer, point, info mm. Resten af siden loades dynamisk.
- **Konfiguration**: Server-indstillinger (fx max spillere, max point) styres via `config/serverConfig.js` og `.env`.
- **Socket events**: Navngiv events konsistent, fx `player event` (lowercase) og `STATE_COMPLETED` (uppercase for transitions).
- **.gitignore**: Skal altid inkludere `.env` og `node_modules/`.

## Eksempel på .gitignore
```
.env
node_modules/
```

## Eksempel på .env
```
API_KEY=din_api_nøgle_her
```

## FSM States (start)
- `BaseState`: Abstrakt base for alle states.
- `LobbyState`: Før spillet starter.
- `GameState`: Selve spillet.
- `EndState`: Afslutning/resultat.

## Server-side config eksempel (config/serverConfig.js)
```js
module.exports = {
  maxPlayers: 4,
  maxPoints: 100,
  // flere indstillinger...
};
```


## Klient-side view loading og init()

Hvert view har sin egen undermappe i `public/views/` med både .html og .js. For at understøtte dynamisk navigation og opdatering af UI:

- JS-moduler til hvert view skal eksportere en `init()`-funktion.
- `client.js` loader HTML og JS dynamisk fra den relevante undermappe og kalder `init()` hvis det findes.
- Alle event listeners og DOM-manipulationer for viewet skal bindes i `init()`, så de virker efter hver navigation.

### Eksempel på dynamisk loading i client.js
```js
async function loadView(viewName) {
  // Indlæs HTML
  const html = await fetch(`/views/${viewName}/${viewName}.html`).then(r => r.text());
  document.getElementById('viewContainer').innerHTML = html;
  // Dynamisk import af JS-modul
  const module = await import(`/views/${viewName}/${viewName}.js`);
  if (module.init) module.init();
}
```

### Eksempel på et view-modul (game.js)
```js
export function init() {
  document.getElementById('myButton').addEventListener('click', () => {
    // ...
  });
  // Flere event listeners og DOM-setup her
}
```

**Bemærk:**
- Hvis `init()` mangler, vil der opstå fejl ved navigation.
- Event listeners SKAL bindes i `init()` for at fungere efter hver navigation.

## Udvidelse
- Tilføj flere states ved at oprette nye klasser i `server/fsm/` og opdatere navigation.
- Tilføj flere felter i headeren (fx point, info) i `public/index.html` og opdater DOM i relevante JS-moduler.


## Tilføjelse af nye socket events

For at tilføje nye socket events i et per-player FSM-system med de nævnte states (`BaseState`, `LobbyState`, `GameState`, `EndState`):

1. **Client-side:**
   - I det relevante view-script (fx `public/views/game/game.js`), brug `socket.emit('EVENT_NAVN', data)` for at sende eventet til serveren.
   - Lyt efter events fra serveren med `socket.on('EVENT_NAVN', handler)`.

2. **Server-side:**
   - I `server/socketHandler.js`, tilføj en handler for det nye event:
     ```js
     socket.on('EVENT_NAVN', (data) => {
       // Hent player via socketID eller uuidv4
       // Kald evt. player.currentState.onEvent('EVENT_NAVN', data)
     });
     ```
   - Implementér den ønskede logik, fx opdater player-state, send svar tilbage til klienten, eller broadcast til andre spillere.

3. **FSM-integration:**
   - Hvis eventet skal udløse en state transition, håndter det i `onEvent`-metoden i den relevante state-klasse (`LobbyState`, `GameState`, `EndState`).
   - Eksempel:
     ```js
     // I fx GameState.js
     onEvent(event, data) {
       if (event === 'GAME_ACTION') {
         // Opdater state, evt. this.player.currentStateIndex++
         // this.player.setState(new EndState(this.player));
       }
     }
     ```

4. **Navngivning:**
   - Brug små bogstaver og mellemrum til almindelige events (fx 'player action').
   - Brug store bogstaver og underscore til transitions (fx 'GAME_COMPLETED').

5. **Test:**
   - Sørg for at både client og server har matchende event-navne og datakontrakt.

**Eksempel:**

Client:
```js
socket.emit('GAME_ACTION', { playerId, move: 'jump' });
```

Server:
```js
socket.on('GAME_ACTION', data => {
  // Find player og kald onEvent på den aktuelle state
  player.currentState.onEvent('GAME_ACTION', data);
});
```

---

## Kendte faldgruber
- Manglende `init()` i view-moduler giver fejl.
- Event listeners SKAL bindes i `init()` for at overleve navigation.
- Husk at opdatere både client og server for nye socket events.

---

**Denne fil kan kopieres og tilpasses til nye projekter med lignende arkitektur.**

---

## Projekt-specifik dokumentation

For hvert konkret projekt bør du oprette en separat .md-fil (fx `projekt_navn_instructions.md`) i documentation/-mappen. Denne fil skal indeholde:

```
Dato: 
* Start server by: "nodemon server/server.js" og "node server/server.js".

1. Make a new branch from project.
2. git push origin new_branch:main --force (This will overwrite the remote main branch with the contents/history of your local new_branch.)
3. Switch to main branch. Run pull (gets the remote main to local VS code)
(4. Hvis noget fejl kan main resettes i branch main: 
git fetch origin
git reset --hard origin/main
)

Sæt .env værdien op som en config var i Heroku, ellers crasher serveren.

features:
1.0.0, dato:
```

Tilpas og udvid denne skabelon efter behov for det konkrete projekt.