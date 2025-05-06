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

  getPlayerNumber(playerId) {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].playerId === playerId) {
        return i + 1; // Returner spillerens nummer (1-baseret)
      }
    }
    return -1; // Returner -1 hvis spilleren ikke findes på holdet  
  }

  // Et team er fuldt ved 2 spillere
  teamIsFull() {
    return this.players.length >= 2;
  }
}

module.exports = Team;