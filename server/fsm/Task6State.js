// 📁 /server/fsm/Task6State.js
// Repræsenterer sjette opgave i spillet

const BaseState = require('./BaseState.js');
const EndState = require('./EndState.js'); //next state import

class Task6State extends BaseState {
  
  constructor(team) {
    super(team);
    this.stateNumber = 5;
    this.meta = { html: 'end' }; // HTML der skal vises til spillerne
  }

enter(player) {
    // Ved navigation: vis korrekt html for Task6
    player.socket.emit('redirect', 'task6');
  }

  

  onEvent(event, data) { // from socketHandler
    super.onEvent(event, data); // This will handle TIMEOUT in BaseState
    if (event === 'TASK6_COMPLETED') {
      console.log(`Team ${this.team.teamId} completed Task 6`);
      this.team.addCompletedState('Task6State');
      this.team.setState(new EndState(this.team)); // Skift til næste state
    this.team.players.forEach(player => {
        if (player.currentStateIndex === this.stateNumber) {
          player.currentStateIndex += 1;
          player.socket.emit('redirect', this.meta.html); // Fortæl klienterne at task2 skal vises
        console.log(player.playerId + 'skiftet index til: ' + player.currentStateIndex);
        }
      });
    }
  }

  exit() {
    console.log(`Team ${this.team.teamId} forlader Task 6`);
  }
}

module.exports = Task6State;