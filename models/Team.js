// --- models/Team.js ---// Repræsenterer et hold og styrer state (FSM) og spillere.
// first state:
const LobbyState = require('../server/fsm/LobbyState.js');


class Team {
  constructor(teamId) {
    this.teamId = teamId;
    this.players = [];
    this.maxPlayers = global.maxPlayers; // Brug global værdi
    this.teamVisitedStates = new Set(); // Sæt til at holde styr på besøgte states. Kun en kopi af hvert navn
    this.completedStates = new Set(); // Sæt til at holde styr på klaret states/opgaver
    this.setState(new LobbyState(this)); // Start i lobby
  }
  // Tilføj et state til completedStates
  addCompletedState(stateName) {
    this.completedStates.add(stateName);
    console.log('T19: Team completed states: ', this.completedStates);
  }

// Sæt teamets nuværende state
  setState(state) {
    if (this.state?.exit) this.state.exit();  // Kør exit på tidligere state
    this.state = state;                       // Opdater state
    this.teamVisitedStates.add(state.constructor.name);       // ← Registrér besøgt state
    console.log('T18: Team visited: ', this.teamVisitedStates); // Log besøgte states
    this.state.enter();                       // Kør enter på ny state
  }

    // Send event til state-maskinen i det aktuelle state.
  handleEvent(event, data) {
    if (this.state?.onEvent) {
      this.state.onEvent(event, data);
    }
  }

  // Tilføj spiller hvis der stadig er plads på holdet
  addPlayer(player) {
      this.players.push(player);
      this.handleEvent('PLAYER_ADDED'); // Send event til state-maskinen (LobbyState)
      console.log(`T30: Spiller ${player.playerName} tilføjet til hold ${this.teamId}`);
    }

  // Fjern spiller fra holdet
  removePlayer(playerId) {
    this.players = this.players.filter(player => player.playerId !== playerId);
  }

  //Giver ikke mening at have denne metode, da det ikke er for et konkret hold
  /*getPlayerCount() {
    return this.players.length;
  }*/ 

  getPlayerCount(teamId) {
    let count = 0;
    for (const player of this.players) {
      if (player.teamId === teamId) {
        count++;
      }
    }
    return count;
  }

  // Et team er fuldt ved 2 spillere
  teamIsFull() {
    return this.players.length >= this.maxPlayers;
  }

  // Send redirect-kommando til alle spillere
  broadcastRedirect(html) {
    console.log(`T54: Team ${this.teamId} sender redirect spillere`);
    if (Array.isArray(html)) {
    this.players.forEach((player, idx) => {
      const view = html[idx] || html[0]; // fallback to first if not enough views
      console.log(`T56: Sender ${player.playerName} ${view}`);
      player.socket.emit('redirect', view); //emit to client
    });
  } else {
    this.players.forEach(player => {
      console.log(`T56: Sender ${player.playerName} ${html}`);
      player.socket.emit('redirect', html); //emit to client
    });
  }
  }



}

module.exports = Team;