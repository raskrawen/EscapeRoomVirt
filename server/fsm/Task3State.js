// 📁 /server/fsm/Task23tate.js
// Repræsenterer tredje opgave i spillet

const BaseState = require('./BaseState.js');
const Task4State = require('./Task4State.js'); //next state import

class Task3State extends BaseState {
  constructor(team) {
    super(team);
    // Mapping fra playerId til html
    this.playerHtmlMap = {};
    team.players.forEach((player, idx) => {
      let htmlName;
      switch (idx) {
        case 0:
          htmlName = 'task3a';
          break;
        case 1:
          htmlName = 'task3b';
          break;
        case 2:
          htmlName = 'task3c';
          break;
        case 3:
          htmlName = 'task3d';
          break;
        default:
          htmlName = 'default.html';
      }
      this.playerHtmlMap[player.playerId] = htmlName;
    });
    this.task3aDone = false;
    this.task3bDone = false;
  }

  enter() {
    console.log(`T3S: Team ${this.team.teamId} starter Task3State med playerHtmlMap`, this.playerHtmlMap);
    // Send korrekt html til hver spiller
    this.team.players.forEach(player => {
      const html = this.playerHtmlMap[player.playerId]; // Hent html baseret på playerId
      player.socket.emit('redirect', html); // Fortæl klienterne at den specifikke task3 html skal vises
    });
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
    this.team.addCompletedState('Task3State');
    this.team.setState(new Task4State(this.team));
  }
  }

  exit() {
    console.log(`Team ${this.team.teamId} forlader Task 3`);
  }
}

module.exports = Task3State;