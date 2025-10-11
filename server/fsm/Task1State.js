// 📁 /server/fsm/Task1State.js
// Repræsenterer første opgave i spillet efter lobbyen

const BaseState = require('./BaseState.js');
const Task2State = require('./Task2State.js'); //next state import
const TimerManager = require('../TimerManager.js'); // Importer TimerManager

class Task1State extends BaseState {
  constructor(team) {
    super(team);
    this.stateNumber = 0;
    this.meta = { html: 'task2' }; // HTML der skal vises til spillerne
  }

  enter() {
    console.log(`T1S: Team ${this.team.teamId} starter task1`);
    this.team.players.forEach(player => {
    player.socket.emit('redirect', 'task1');
    });
    // Start the timer for the team
    const duration = 300; // 600 = 10 minutes in seconds
    TimerManager.startTimer(this.team.teamId, duration);
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