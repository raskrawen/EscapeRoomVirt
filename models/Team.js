// --- models/Team.js ---
const maxPlayersOnTeam = 2; // Maksimalt antal spillere på et hold

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

  // Et team er fuldt ved 2 spillere
  teamIsFull() {
    return this.players.length >= maxPlayersOnTeam;
  }
}

module.exports = Team;