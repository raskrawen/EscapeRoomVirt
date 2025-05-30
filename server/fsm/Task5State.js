// 📁 /server/fsm/Task2State.js
// Repræsenterer anden opgave i spillet

const BaseState = require('./BaseState.js');
const EndState = require('./EndState.js'); //next state import

class Task5State extends BaseState {
  constructor(team) {
    super(team);
    this.meta = { html: 'task5' }; // HTML der skal vises til spillerne
  }

  enter() {
    console.log(`T2S: Team ${this.team.teamId} starter ${this.meta.html}`);
    this.team.broadcastRedirect(this.meta.html); // Fortæl klienterne at task1 skal vises 
    
  }

  onEvent(event, data) { // from socketHandler
    super.onEvent(event, data); // This will handle TIMEOUT in BaseState
    if (event === 'TASK5_COMPLETED') {
      console.log(`Team ${this.team.teamId} completed Task 5`);
      this.team.setState(new Task3State(this.team)); // Skift til næste state
    }
  }

  exit() {
    console.log(`Team ${this.team.teamId} forlader Task 5`);
  }
}

module.exports = Task5State;