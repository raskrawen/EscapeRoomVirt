// 📁 /server/fsm/LobbyState.js
// Repræsenterer den indledende lobby-state, hvor spillere samles

const BaseState = require('./BaseState.js');
const Task1State = require('./Task1State.js'); //next state import
const TimerManager = require('../TimerManager.js'); // Importer TimerManager

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
    // Når teamet er fuldt, skiftes der til Task1State
    console.log(`LS: modtaget event ${event}`);
    if (event === 'PLAYER_ADDED') { //from Team.js
      console.log('LS: Spiller tilføjet');
      if (this.team.teamIsFull()) {
        console.log(`LS: LobbyState: Team ${this.team.teamId} er fuldt, skifter til Task1State`);
        this.team.setState(new Task1State(this.team));
        this.team.players.forEach(player => {
            player.socket.emit('redirect', 'task1'); // Fortæl klienterne at task1 skal vises
        });
      }
    }
  }

  
  exit() {
    console.log(`Team ${this.team.teamId} forlader lobby-state`);
    const duration = 300; // 600 = 10 minutes in seconds
    TimerManager.startTimer(this.team.teamId, duration);
  }
}

module.exports = LobbyState;
