class Player {
  constructor(playerId, socketId, playerName) {
    this.playerId = playerId;
    this.socketId = socketId;
    this.playerName = playerName; // Store player name
    this.currentStep = 1;
    this.inventory = [];
    this.finished = false;
  }
}

module.exports = Player;
