// 📁 /server/fsm/Task23tate.js
// Repræsenterer tredje opgave i spillet

const BaseState = require('./BaseState.js');
const Task4State = require('./Task4State.js'); //next state import

class Task3State extends BaseState {
  constructor(team) {
    super(team);
    // Mapping fra playerId til html
    this.playerHtmlMap = {};
    // Tildel html til hver spiller på teamet
    team.players.forEach((player, idx) => {
      // Skift logik her hvis du har flere html eller vil randomisere
      const htmlName = idx === 0 ? 'task3a' : 'task3b';
      this.playerHtmlMap[player.playerId] = htmlName;
    });
    this.task3aDone = false;
    this.task3bDone = false;
  }

  enter() {
    console.log(`T3S: Team ${this.team.teamId} starter Task3State med playerHtmlMap`, this.playerHtmlMap);
    // Send korrekt html til hver spiller
    this.team.players.forEach(player => {
      const html = this.playerHtmlMap[player.playerId];
      player.socket.emit('redirect', html);
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