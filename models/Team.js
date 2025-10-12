// --- models/Team.js ---// Repræsenterer et hold og styrer state (FSM) og spillere.
// first state:
const LobbyState = require('../server/fsm/LobbyState.js');


class Team {
  constructor(teamId) {
    this.teamId = teamId;
    this.players = [];
    this.maxPlayers = global.maxPlayers; // Brug global værdi
  this.teamVisitedStates = []; // Array til at holde rækkefølge af besøgte states
  this.completedStates = []; // Array til at holde rækkefølge af klaret states/opgaver
  this.stateObjects = []; // Array til at holde Task-state-objekter i rækkefølge
  this.setState(new LobbyState(this)); // Start i lobby
  }
  // Tilføj et state til completedStates
  addCompletedState(stateName) {
    if (!this.completedStates.includes(stateName)) {
      this.completedStates.push(stateName);
    }
    console.log('T: Team completed states: ', this.completedStates);
  }

// Sæt teamets nuværende state
  setState(state) {
    if (this.state?.exit) this.state.exit();  // Kør exit på tidligere state
    this.state = state;                       // Opdater state
    // Gem state-objektet hvis det ikke allerede er gemt
    if (!this.teamVisitedStates.includes(state.constructor.name)) {
      this.teamVisitedStates.push(state.constructor.name);
      if (state.constructor.name !== 'LobbyState') { // Undgå at gemme LobbyState i stateObjects
      this.stateObjects.push(state);
    }
  }
    console.log('T: Team visited: ', this.teamVisitedStates); // Log besøgte states
    this.state.enter();      // Kør enter på ny state
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
      console.log(`T: Spiller ${player.playerName} tilføjet til hold ${this.teamId}`);
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

  // Hvis alle spillere skal sendes til et State
  broadcastRedirect(html) {
    console.log(`T: Team ${this.teamId} sender redirect til alle spillere: ${html}`);
    this.players.forEach(player => {
      player.socket.emit('redirect', html);
    });
  }



}

module.exports = Team;