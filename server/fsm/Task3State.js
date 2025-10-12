// 📁 /server/fsm/Task23tate.js
// Repræsenterer tredje opgave i spillet

const BaseState = require('./BaseState.js');
const Task4State = require('./Task4State.js'); //next state import

class Task3State extends BaseState {
  
  constructor(team) {
    super(team);
    this.stateNumber = 2;
    // Mapping fra playerId til html
    this.meta = { html: 'task4' }; // HTML der skal vises til spillerne
    this.task3aDone = false;
    this.task3bDone = false;
    this.playerHtmlMap = {};
team.players.forEach((player, idx) => {
  let htmlName;
  switch (idx) {
    case 0: htmlName = 'task3a'; break;
    case 1: htmlName = 'task3b'; break;
    case 2: htmlName = 'task3c'; break;
    default: htmlName = 'default.html';
  }
  this.playerHtmlMap[player.playerId] = htmlName;
});
  }

enter(player) {
    // Ved navigation: vis korrekt html for Task3
    const html = this.playerHtmlMap[player.playerId] || 'default.html';
player.socket.emit('redirect', html);
  }

  enter() {
    console.log(`T2S: Team ${this.team.teamId} starter task3`);   // Send korrekt html til hver spiller
    
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
    this.team.players.forEach(player => {
        if (player.currentStateIndex === this.stateNumber) {
          player.currentStateIndex += 1;
          player.socket.emit('redirect', this.meta.html); // Fortæl klienterne at task2 skal vises
        console.log(player.playerId + 'skiftet index til: ' + player.currentStateIndex);
        }
      });
  }
  }

  exit() {
    console.log(`Team ${this.team.teamId} forlader Task 3`);
  }
}

module.exports = Task3State;