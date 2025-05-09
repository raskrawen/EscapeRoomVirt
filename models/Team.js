// --- models/Team.js ---
const { createTeamFSM } = require('./fsm');


class Team {
  constructor(teamId) {
    this.teamId = teamId;
    this.players = [];
    this.fsm = createTeamFSM(); // Ny FSM pr. team
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

  getPlayerCount() {
    return this.players.length;
  }

  getPlayerCount(teamId) {
    return this.players.filter(player => player.teamId === teamId).length;
  }

  // Et team er fuldt ved 2 spillere
  teamIsFull() {
    console.log(`Team.js: teamIsFull tested.`);
    return this.players.length >= 2;
  }

getCurrentView() {
    const stateName = this.fsm.current;
    return this.fsm.machine.meta[stateName].html; // returnerer fx 'task1'
  }

}



module.exports = Team;