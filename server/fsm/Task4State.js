// 📁 /server/fsm/Task4State.js
// Repræsenterer fjerde opgave i spillet

const BaseState = require('./BaseState.js');
const Task5State = require('./Task5State.js'); //next state import

class Task4State extends BaseState {
  constructor(team) {
    super(team);
    this.meta = { html: 'task4' }; // HTML der skal vises til spillerne
  }

  enter() {
    console.log(`T4S: Team ${this.team.teamId} starter ${this.meta.html}`);
    this.team.broadcastRedirect(this.meta.html); // Fortæl klienterne at task1 skal vises 
    
  }

  onEvent(event, data) { // from socketHandler
    super.onEvent(event, data); // This will handle TIMEOUT in BaseState
    if (event === 'TASK4_COMPLETED') {
      console.log(`Team ${this.team.teamId} completed Task 4`);
      this.team.setState(new Task5State(this.team)); // Skift til næste state
    }
  }

  exit() {
    console.log(`Team ${this.team.teamId} forlader Task 4`);
  }
}

module.exports = Task4State;