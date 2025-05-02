// --- models/Team.js ---
class Team {
    constructor(teamId) {
      this.teamId = teamId;
      this.players = [];
    }
  
    addPlayer(player) {
      if (!this.teamIsFull()) {
        this.players.push(player);
      }
    }
  
    getPlayerCount() {
      return this.players.length;
    }
  
    teamIsFull() {
      return this.players.length >= 2;
    }
  }
  
  module.exports = Team;