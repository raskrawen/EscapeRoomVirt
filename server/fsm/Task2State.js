// 📁 /server/fsm/Task2State.js
// Repræsenterer anden opgave i spillet

const BaseState = require('./BaseState.js');
const Task3State = require('./Task3State.js'); //next state import

class Task2State extends BaseState {
  
  constructor(team) {
    super(team);
    //this.meta = { html: 'task2' }; // HTML der skal vises til spillerne
    this.stateNumber = 1;
    this.playerHtmlMap = {};
    team.players.forEach((player, idx) => {
      let htmlName;
      switch (idx) {
        case 0: htmlName = 'task3a'; break;
        case 1: htmlName = 'task3b'; break;
        case 2: htmlName = 'task3c'; break;
        default: htmlName = 'task3a.html';
      }
      this.playerHtmlMap[player.playerId] = htmlName;
    });
  }

  enter(player) {
    // Ved navigation: vis korrekt html for Task2
    player.socket.emit('redirect', 'task2');
  }

  

  onEvent(event, data) { // from socketHandler
    super.onEvent(event, data); // This will handle TIMEOUT in BaseState
    if (event === 'TASK2_COMPLETED') {
      console.log(`Team ${this.team.teamId} completed Task 2`);
      this.team.addCompletedState('Task2State');
      this.team.setState(new Task3State(this.team)); // Skift til næste state
      
      this.team.players.forEach(player => {
        if (player.currentStateIndex === this.stateNumber) {
          player.currentStateIndex += 1;
          const html = this.playerHtmlMap[player.playerId]; // Hent html baseret på playerId
          player.socket.emit('redirect', html); // Fortæl klienterne at den specifikke task3 html skal vises
        console.log(player.playerId + ' skiftet index til: ' + player.currentStateIndex);
        }
      });
    }
  }

  exit() {
    console.log(`Team ${this.team.teamId} forlader Task 2`);
  }
}

module.exports = Task2State;