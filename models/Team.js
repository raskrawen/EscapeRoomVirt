// --- models/Team.js ---
const playersOnTeam = 2; // Number of players required to form a team

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
      return this.players.length >= playersOnTeam;
    }
  }
  
  module.exports = Team;