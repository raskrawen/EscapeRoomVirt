// 📁 /server/fsm/Task4State.js
// Repræsenterer fjerde opgave i spillet

const BaseState = require('./BaseState.js');
const Task5State = require('./Task5State.js'); //next state import

class Task4State extends BaseState {
  
  constructor(team) {
    super(team);
    this.stateNumber = 3;
    this.meta = { html: 'task5' }; // HTML der skal vises til spillerne
  }


  enter(player) {
    // Ved navigation: vis korrekt html for Task4
    player.socket.emit('redirect', 'task4');
  }

  

  onEvent(event, data) { // from socketHandler
    super.onEvent(event, data); // This will handle TIMEOUT in BaseState
    if (event === 'TASK4_COMPLETED') {
      console.log(`Team ${this.team.teamId} completed Task 4`);
      this.team.addCompletedState('Task4State');
      this.team.setState(new Task5State(this.team)); // Skift til næste state
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
    console.log(`Team ${this.team.teamId} forlader Task 4`);
  }
}

module.exports = Task4State;