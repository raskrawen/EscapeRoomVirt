// --- models/Player.js ---
const { v4: uuidv4 } = require('uuid');

class Player {
  constructor(playerName, teamId, socketId) {
    this.playerId = uuidv4();
    this.playerName = playerName;
    this.teamId = teamId;
    this.socketId = socketId;
  }
}

module.exports = Player;