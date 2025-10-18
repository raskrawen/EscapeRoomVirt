const { teams } = require('./state');

class TimerManager {
  constructor() {
    this.teamTimers = new Map(); // Store timers for each team
  }

  startTimer(teamId, duration, io) { //called in Tas1State.js
    if (this.teamTimers.has(teamId)) {
      console.log(`Timer for team ${teamId} is already running.`);
      return;
    }

    console.log(`Starting timer for team ${teamId} with duration ${duration} seconds.`);
    let remainingTime = duration;

    const interval = setInterval(() => {
      remainingTime--;

      // Broadcast remaining time to all clients on the team
      const team = teams.get(teamId);
      if (team) {
        team.players.forEach(player => {
          player.socket.emit('timerUpdate', { remainingTime });
        });
      }

      // Stop the timer when it reaches 0
      if (remainingTime <= 0) {
        clearInterval(interval);
        this.teamTimers.delete(teamId);
        console.log(`Timer for team ${teamId} has finished.`);

        // Notify all clients on the team that the timer has finished
        if (team) {
          console.log('calling team.handleEvent');
          team.handleEvent('TIMEOUT');
          /*team.players.forEach(player => {
            player.socket.emit('timerFinished');
          });*/

        }
      }
    }, 1000);

    // Store the timer interval and remaining time
    this.teamTimers.set(teamId, { interval, remainingTime });
  }

  stopTimer(teamId) {
    if (this.teamTimers.has(teamId)) {
      const { interval } = this.teamTimers.get(teamId);
      clearInterval(interval);
      this.teamTimers.delete(teamId);
      console.log(`Timer for team ${teamId} has been stopped.`);
    }
  }
}

module.exports = new TimerManager();