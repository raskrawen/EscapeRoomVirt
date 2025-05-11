// 📁 /server/fsm/LobbyState.js
// Repræsenterer den indledende lobby-state, hvor spillere samles

const BaseState = require('./BaseState.js');
const Task1State = require('./Task1State.js');

class LobbyState extends BaseState {
  constructor(team) {
    super(team);
    this.meta = { html: 'task1' }; 
  }

  enter() {
    console.log(`Team ${this.team.teamId} går ind i lobby-state`);
    this.team.broadcastRedirect('lobby'); // Vis lobby for alle spillere
  }

  onEvent(event, data) {
    // Når teamet er fuldt, skiftes der til næste opgave
    if (event === 'teamIsFull') {
      if (this.team.teamIsFull()) {
        this.team.setState(new Task1State(this.team));
      }
    }
  }

  exit() {
    console.log(`Team ${this.team.teamId} forlader lobby-state`);
  }
}

module.exports = LobbyState;
