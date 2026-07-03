// 📁 /server/fsm/Task1State.js
// Repræsenterer første opgave i spillet efter lobbyen

const BaseState = require('./BaseState.js');
const Task2State = require('./Task2State.js'); //next state import

class Task1State extends BaseState {
  
  constructor(team) {
    super(team); // Kald super constructor for at initialisere team og meta
    this.stateNumber = 0;
    this.meta = { html: 'task2' }; // HTML der skal vises til spillerne
  }

enter(player) {
    // Ved navigation: vis korrekt html for Task1
    player.socket.emit('redirect', 'task1');
  }

 

  onEvent(event, data) { // from socketHandler
    super.onEvent(event, data); // This will handle TIMEOUT in BaseState
    
    /*if (event === 'TIMEOUT') {
    console.log(`T1S: Team er gået i timeout-state`);
      const TimeoutState = require('./TimeoutState.js');
    this.team.setState(new TimeoutState(this.team));
    }*/

    if (event === 'TASK1_COMPLETED') {
      console.log(`Team ${this.team.teamId} completed Task 1`);
      this.team.addCompletedState('Task1State'); 
      const nextState = new Task2State(this.team);
      this.team.setState(nextState); // opret næste state
      this.team.players.forEach(player => {
        if (player.currentStateIndex === this.stateNumber) {
          player.currentStateIndex += 1;
          player.socket.emit('redirect', 'task2'); // Fortæl klienterne at task2 skal vises // Redirect each player to their specific HTML
          console.log(player.playerId + 'skiftet index til: ' + player.currentStateIndex);
        }
      });
    }
  }

  exit() {
    console.log(`Team ${this.team.teamId} forlader Task 1`);
  }
}

module.exports = Task1State;