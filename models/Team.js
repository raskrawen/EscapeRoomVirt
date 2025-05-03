// --- models/Team.js ---
class Team {
  constructor(teamId) {
    this.teamId = teamId;
    this.players = [];
  }

  // Tilføj spiller hvis der stadig er plads på holdet
  addPlayer(player) {
    if (!this.teamIsFull()) {
      this.players.push(player);
    }
  }

  getPlayerCount() {
    return this.players.length;
  }

  // Et team er fuldt ved 2 spillere
  teamIsFull() {
    return this.players.length >= 2;
  }
}

module.exports = Team;