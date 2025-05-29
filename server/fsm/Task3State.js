// 📁 /server/fsm/Task23tate.js
// Repræsenterer tredje opgave i spillet

const BaseState = require('./BaseState.js');
const Task4State = require('./Task4State.js'); //next state import

class Task3State extends BaseState {
  constructor(team) {
    super(team);
    this.meta = { html: ['task3a' , 'task3b'] }; // HTML der skal vises til spillerne
    this.task3aDone = false;
    this.task3bDone = false;
  }

  enter() {
    console.log(`T3S: Team ${this.team.teamId} starter ${this.meta.html}`);
    this.team.broadcastRedirect(this.meta.html); // Fortæl klienterne at task3a og b skal vises 
    
  }

  onEvent(event, data) { // from socketHandler
    super.onEvent(event, data); // This will handle TIMEOUT in BaseState
    if (event === 'TASK3A_COMPLETED') {
      console.log(`Team ${this.team.teamId} completed Task 3A`);
      this.task3aDone = true;
    }
    if (event === 'TASK3B_COMPLETED') {
      console.log(`Team ${this.team.teamId} completed Task 3B`);
      this.task3bDone = true;
    }
    if (this.task3aDone && this.task3bDone) {
    console.log(`Team ${this.team.teamId} completed Task 3A og Task 3B`);
    this.team.setState(new Task4State(this.team));
  }
  }

  exit() {
    console.log(`Team ${this.team.teamId} forlader Task 3`);
  }
}

module.exports = Task3State;