// 📁 /server/fsm/Task1State.js
// Repræsenterer første opgave i spillet efter lobbyen

const BaseState = require('./BaseState.js');
const Task2State = require('./Task2State.js'); //next state import
const TimerManager = require('../TimerManager.js'); // Importer TimerManager

class Task1State extends BaseState {
  constructor(team) {
    super(team);
    this.meta = { html: 'task1' }; // HTML der skal vises til spillerne
  }

  enter() {
    console.log(`T1S: Team ${this.team.teamId} starter ${this.meta.html}`);
    this.team.broadcastRedirect(this.meta.html); // Fortæl klienterne at task1 skal vises 
    // Start the timer for the team
    const duration = 600; // 10 minutes in seconds
    TimerManager.startTimer(this.team.teamId, duration);
  }

  onEvent(event, data) { // from socketHandler
    if (event === 'TASK1_COMPLETED') {
      console.log(`Team ${this.team.teamId} completed Task 1`);
      this.team.setState(new Task2State(this.team)); // Skift til næste state
    }
  }

  exit() {
    console.log(`Team ${this.team.teamId} forlader Task 1`);
  }
}

module.exports = Task1State;