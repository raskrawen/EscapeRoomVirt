// 📁 /server/fsm/Task2State.js
// Repræsenterer anden opgave i spillet

const BaseState = require('./BaseState.js');

class Task2State extends BaseState {
  constructor(team) {
    super(team);
    this.meta = { html: 'task2' }; // HTML der skal vises til spillerne
  }

  enter() {
    console.log(`T1S: Team ${this.team.teamId} starter ${this.meta.html}`);
    this.team.broadcastRedirect(this.meta.html); // Fortæl klienterne at task1 skal vises 
    
  }

  onEvent(event, data) {
    // Her kan du senere udvide til fx 'task2Done' → næste state
  }

  exit() {
    console.log(`Team ${this.team.teamId} forlader Task 2`);
  }
}

module.exports = Task2State;