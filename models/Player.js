// --- models/Player.js ---
const { v4: uuidv4 } = require('uuid');

class Player {
  constructor(playerName, teamId, socketId) {
    // Generer et unikt ID til spilleren (UUID sikrer global entydighed)
    this.playerId = uuidv4();
    this.playerName = playerName;
    this.teamId = teamId;
    this.socketId = socketId;
    this.playerNumberOnTeam = -1; // initialiseret spillernummer på holdet.
  }
}

module.exports = Player;