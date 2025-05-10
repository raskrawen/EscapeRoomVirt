// 📁 /server/fsm/Task1State.js
// Repræsenterer første opgave i spillet efter lobbyen

const BaseState = require('./BaseState.js');

class Task1State extends BaseState {
  constructor(team) {
    super(team);
    this.meta = { html: 'task1' }; // HTML der skal vises til spillerne
  }

  enter() {
    console.log(`Team ${this.team.id} starter Task 1`);
    this.team.broadcastRedirect(this.meta.html); // Fortæl klienterne at task1 skal vises
  }

  onEvent(event, data) {
    // Her kan du senere udvide til fx 'task1Done' → næste state
  }

  exit() {
    console.log(`Team ${this.team.id} forlader Task 1`);
  }
}

module.exports = Task1State;