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
    this.playerNumberOnTeam = -1; // initialiseret spillernummer på holdet.
    //this.playerCurrentState = null; // Den nuværende state spilleren er i
    //this.playerVisitedStates = new Set(); // Sæt til at holde styr på besøgte states. Kun en kopi af hvert navn
  }

getPlayerId() {
    return this.playerId;
  }

}

module.exports = Player;