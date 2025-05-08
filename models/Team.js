// --- models/Team.js ---
const { createActor } = require('xstate');
const teamMachine = require('./teamMachine');
const maxPlayersOnTeam = 2; // Maksimalt antal spillere på et hold

class Team {
  constructor(teamId) {
    this.teamId = teamId;
    this.players = [];
    this.stateService = createActor(teamMachine, {
      //test:
      context: { team: this }
      /*input: () => {
        console.log('FSM context injected:', this); // Skal udskrives
        return { team: this };
    }
//        ({ team: this // Giver FSM adgang til team-objektet via self.getSnapshot().context.team})
    */
   });
    this.stateService.start();
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
    return this.players.length >= maxPlayersOnTeam;
  }

  getState() {
    return this.stateService.getSnapshot().value;
  }
}

module.exports = Team;