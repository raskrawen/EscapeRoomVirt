// 📁 /server/fsm/BaseState.js
// Abstrakt baseklasse for alle FSM-stater.
// Alle states bør arve fra denne klasse for at sikre konsistent interface.

class BaseState {
  constructor(team) {
    this.team = team;      // Reference til det team, som state'en hører til
    this.meta = {};        // Metadata (fx HTML-filnavn til redirect)
    //this.completedPlayers = []; // Liste over spillere der har klaret Tasken
  }

  // Kaldes når state aktiveres
  enter() {}

  // Kaldes når state forlades
  exit() {}

  // Kaldes når et event sendes til denne state
  onEvent(event, data) {
  console.log(`BaseState: modtaget event ${event}`);
    if (event === 'TIMEOUT') {
    const TimeoutState = require('./TimeoutState.js');
    this.team.setState(new TimeoutState(this.team));
  }
}

}

module.exports = BaseState;