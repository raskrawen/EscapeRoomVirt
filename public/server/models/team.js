class Team {
    constructor(teamId) {
      this.teamId = teamId;
      this.players = {};
      this.createdAt = Date.now();
    }
  
    addPlayer(player) {
      if (this.getPlayerCount() >= 2) {
        throw new Error('Team is already full');
      }
      this.players[player.playerId] = player;
    }
  
    getPlayerCount() {
      return Object.keys(this.players).length;
    }
  
    isTeamFull() {
      return this.getPlayerCount() === 2;
    }
  }
  
  module.exports = Team;
  