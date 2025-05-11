// --- models/Team.js ---
const LobbyState = require('../server/fsm/LobbyState.js');

class Team {
  constructor(teamId) {
    this.teamId = teamId;
    this.players = [];
    this.maxPlayers = 2;        // Antal spillere som udløser næste state (kan justeres)
    this.setState(new LobbyState(this)); // Start i lobby
  }

// Sæt teamets nuværende state
  setState(state) {
    if (this.state?.exit) this.state.exit();  // Kør exit på tidligere state
    this.state = state;                       // Opdater state
    this.state.enter();                       // Kør enter på ny state
  }

    // Send event til state-maskinen
  handleEvent(event, data) {
    if (this.state?.onEvent) {
      this.state.onEvent(event, data);
    }
  }

  // Tilføj spiller hvis der stadig er plads på holdet
  addPlayer(player) {
    if (!this.teamIsFull()) {
      this.players.push(player);
    }
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
    return this.players.filter(player => player.teamId === teamId).length;
  }

  // Et team er fuldt ved 2 spillere
  teamIsFull() {
    return this.players.length >= 2;
  }

  // Send redirect-kommando til alle spillere
  broadcastRedirect(html) {
    console.log(`T54: Team ${this.teamId} sender redirect spillere`);
    this.players.forEach(player => {
      console.log(`T56: Sender ${player.playerName} ${html}`);
      player.socket.emit('redirect', html);
    });
  }

}

module.exports = Team;