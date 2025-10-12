// 📁 /server/fsm/LobbyState.js
// Repræsenterer den indledende lobby-state, hvor spillere samles

const BaseState = require('./BaseState.js');
const Task1State = require('./Task1State.js'); //next state import

class LobbyState extends BaseState {
  constructor(team) {
    super(team);
    this.meta = { html: 'lobby' }; //this page
  }

  enter() {
    console.log(`LS: Team ${this.team.teamId} går ind i lobby-state`);
    this.team.broadcastRedirect('lobby'); // Vis lobby for alle spillere? 
    // TODO: check if this is correct
  }

  onEvent(event, data) {
    // Når teamet er fuldt, skiftes der til næste opgave
    console.log(`LobbyState: modtaget event ${event}`);
    if (event === 'PLAYER_ADDED') { //from Team.js
      console.log('LobbyState: Spiller tilføjet');
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
