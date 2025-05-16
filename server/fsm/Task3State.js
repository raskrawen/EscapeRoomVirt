// 📁 /server/fsm/Task23tate.js
// Repræsenterer tredje opgave i spillet

const BaseState = require('./BaseState.js');

class Task3State extends BaseState {
  constructor(team) {
    super(team);
    this.meta = { html: 'task3a' }; // HTML der skal vises til spillerne
  }

  enter() {
    console.log(`T3S: Team ${this.team.teamId} starter ${this.meta.html}`);
    this.team.broadcastRedirect(this.meta.html); // Fortæl klienterne at task3a og b skal vises 
    
  }

  onEvent(event, data) { // from socketHandler
    if (event === 'TASK3_COMPLETED') {
      console.log(`Team ${this.team.teamId} completed Task 3`);
      this.team.setState(new Task4State(this.team)); // Skift til næste state
    }
  }

  exit() {
    console.log(`Team ${this.team.teamId} forlader Task 3`);
  }
}

module.exports = Task3State;