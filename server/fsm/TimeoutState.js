const BaseState = require('./BaseState.js');

class TimeoutState extends BaseState {
  constructor(team) {
    super(team);
    this.meta = { html: 'timeout' };
  }

  enter() {
    console.log(`Team ${this.team.teamId} er gået i timeout-state`);
    this.team.broadcastRedirect(this.meta.html);
  }
}

module.exports = TimeoutState;