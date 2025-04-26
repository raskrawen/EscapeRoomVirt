

class Player {
    constructor(playerId, socketId) {
      this.playerId = playerId;
      this.socketId = socketId;
      this.currentStep = 1;
      this.inventory = [];
      this.finished = false;
    }
  }
  
  module.exports = Player;
  