// --- models/Player.js --- // Repræsenterer en spiller med socket og navn.
const { v4: uuidv4 } = require('uuid');

class Player {
  constructor(playerName, teamId, socketId, socket) {
    // Generer et unikt ID til spilleren (UUID sikrer global entydighed)
    this.playerId = uuidv4();
    this.playerName = playerName;
    this.teamId = teamId;
    this.socketId = socketId;
    this.socket = socket; // Socket.io objektet til at kommunikere med klienten
    this.playerNumberOnTeam = -1; // initialiseret spillerantal på holdet.
    this.currentStateIndex = 0; // Index for nuværende state i historikken
  }

getPlayerId() {
    return this.playerId;
  }

}

module.exports = Player;