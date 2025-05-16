// 📁 /server/fsm/Task2State.js
// Repræsenterer anden opgave i spillet

const BaseState = require('./BaseState.js');
const Task3State = require('./Task3State.js');

class Task2State extends BaseState {
  constructor(team) {
    super(team);
    this.meta = { html: 'task2' }; // HTML der skal vises til spillerne
  }

  enter() {
    console.log(`T2S: Team ${this.team.teamId} starter ${this.meta.html}`);
    this.team.broadcastRedirect(this.meta.html); // Fortæl klienterne at task1 skal vises 
    
  }

  onEvent(event, data) { // from socketHandler
    if (event === 'TASK2_COMPLETED') {
      console.log(`Team ${this.team.teamId} completed Task 2`);
      this.team.setState(new Task3State(this.team)); // Skift til næste state
    }
  }

  exit() {
    console.log(`Team ${this.team.teamId} forlader Task 2`);
  }
}

module.exports = Task2State;