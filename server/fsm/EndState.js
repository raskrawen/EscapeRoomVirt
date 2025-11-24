const BaseState = require('./BaseState.js');
//const Task2State = require('./Task2State.js'); //next state import

class EndState extends BaseState {
  
  constructor(team) {
    super(team);
    this.stateNumber = 7;
    this.meta = { html: 'end' }; // HTML der skal vises til spillerne
  }

enter(player) {
    // Ved navigation: vis korrekt html for Task1
    player.socket.emit('redirect', 'end');
  }
}

module.exports = EndState;