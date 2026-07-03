// Håndterer socket-events og opretter spillere og teams.

const Player = require('./models/Player');
const Team = require('./models/Team');
const { teams, players } = require('./state');
const TimerManager = require('./TimerManager');
const AnswerValidator = require('./AnswerValidator');

const COMPLETION_EVENTS_BY_TASK = {
  task1: 'TASK1_COMPLETED',
  task2: 'TASK2_COMPLETED',
  task3: 'TASK3_COMPLETED',
  task4: 'TASK4_COMPLETED',
  task5: 'TASK5_COMPLETED',
  task6: 'TASK6_COMPLETED'
};

function emitJoinRejected(socket) {
  socket.emit('joinTeamRejected', {
    reason: 'TEAM_FULL',
    message: 'Dette team er optaget. Vælg et andet team id.'
  });
}

function setupSocketHandler(io) {
  const answerValidator = new AnswerValidator();

  const resolvePlayerAndTeam = (playerId, logPrefix) => {
    const player = players.get(playerId);
    if (!player) {
      console.log(`${logPrefix}: Player not found for playerId`, playerId);
      return {};
    }

    const team = teams.get(player.teamId);
    if (!team) {
      console.log(`${logPrefix}: Team not found for teamId`, player.teamId);
      return { player };
    }

    return { player, team };
  };

  const completeTaskForPlayer = (playerId, completionEvent, logPrefix) => {
    const { team } = resolvePlayerAndTeam(playerId, logPrefix);
    if (!team) {
      return false;
    }

    team.handleEvent(completionEvent);
    return true;
  };

  io.on('connection', (socket) => { // Håndterer socket-forbindelse
    console.log(`New client connected: ${socket.id}`); // Log connection

    // Når klient sender joinTeam, opret spiller og tilføj til team
    socket.on('joinTeam', ({ playerName, teamId }) => {
      console.log(`Creating new player.`);
      if (!teams.has(teamId)) {
        console.log(`Creating new team with teamId=${teamId}`);
        teams.set(teamId, new Team(teamId));
      }

      const team = teams.get(teamId);
      if (!team) {
        console.log(`SH1: Team ${teamId} not found.`);
        return;
      }

      // Server-side guard: avoid race conditions where team became full after client check.
      if (team.teamIsFull()) {
        console.log(`SH: joinTeam rejected for teamId=${teamId}; team is full.`);
        emitJoinRejected(socket);
        return;
      }

      const player = new Player(playerName, teamId, socket.id, socket);
      players.set(player.playerId, player); // Save new player in state
      socket.emit('playerUUId', player.playerId); // Send new UUID to client
      console.log(`Player created with UUID: ${player.playerId}`);

      // Ensure this socket is in the team room (for future broadcasts)
      try { socket.join(teamId); } catch (e) { console.warn('join room failed', e); }

      player.playerNumberOnTeam = team.getPlayerCount(teamId);
      const added = team.addPlayer(player);
      if (!added) {
        players.delete(player.playerId);
        emitJoinRejected(socket);
        return;
      }
      
      console.log(`Player added to teamId: ${team.teamId}`);
      const playerCount = team.getPlayerCount(teamId);
      console.log(`Total players on team: ${playerCount}`);

      socket.emit('displayTeamId', teamId); // Send teamId to client
      
      //RECONNECT LOGIC:
      // If the team is already beyond Lobby, sync this single socket to current state's view
      const currentStateName = team.state && team.state.constructor && team.state.constructor.name;
      // Reconnect/late join: If team is beyond Lobby, sync this socket to current state
      if (currentStateName && currentStateName !== 'LobbyState') {
        // Keep late joiners in sync with the team's highest reached index for back/forward.
        player.currentStateIndex = Math.max(0, team.stateObjects.length - 1);
        // If per-player view logic exists, use it
        if (typeof team.state.enter === 'function') {
          team.state.enter(player); // This should emit the correct view for this player
        } else {
          const view = (team.state.meta && team.state.meta.html) ? team.state.meta.html : 'lobby';
          console.log(`SH: Sync single socket ${socket.id} to current state ${currentStateName} -> view ${view}`);
          socket.emit('redirect', view);
        }
        return; // Do not process Lobby-specific logic below
      }
      console.log(`Current state for team ${teamId} is ${currentStateName}`);
      // Only from Lobby: start when team is full
      if (team.teamIsFull() && currentStateName === 'LobbyState') {
        team.handleEvent('teamIsFull'); //to Team.js
        console.log(`SH34: Team ${teamId} is full. Redirecting players to game.`);
      }
    });

    // Når spilleren klikker "Tilbage"-knappen
    socket.on('playerGoBack', ({ playerId }) => {
      console.log(`SH: playerGoBack event received from socket: ${socket.id} for playerId: ${playerId}`); // Log go back event
      const { player, team } = resolvePlayerAndTeam(playerId, 'SH:playerGoBack');
      if (!team) {
        return;
      }

      // Kun tillad tilbage hvis currentStateIndex > 0 (Task2 og op)
      if (player.currentStateIndex > 0) {
        player.currentStateIndex -= 1;
        // Brug eksisterende state-objekt for den nye index
        const stateObj = team.stateObjects[player.currentStateIndex];
        if (stateObj && typeof stateObj.enter === 'function') {
          console.log(`SH:playerGoBack: Sending player ${player.playerId} back to state index ${player.currentStateIndex} og state ${stateObj.constructor.name}`);
          stateObj.enter(player);
        } else {
          console.log('SH:playerGoBack: No state object found for index', player.currentStateIndex);
        }
      }
    });

    // Når spilleren klikker "Frem"-knappen
    socket.on('playerGoForward', ({ playerId }) => {
      console.log(`SH: playerGoForward event received from socket: ${socket.id} for playerId: ${playerId}`); // Log go forward event
      const { player, team } = resolvePlayerAndTeam(playerId, 'SH:playerGoForward');
      if (!team) {
        return;
      }

      // Kun tillad frem hvis der findes en completed state efter currentStateIndex
      if (player.currentStateIndex < team.completedStates.length) {
        player.currentStateIndex += 1;
        // Brug eksisterende state-objekt for den nye index
        const stateObj = team.stateObjects[player.currentStateIndex];
        if (stateObj && typeof stateObj.enter === 'function') {
          console.log(`SH:playerGoForward: Sending player ${player.playerId} forward to state index ${player.currentStateIndex} og state ${stateObj.constructor.name}`);
          stateObj.enter(player);
        } else {
          console.log('SH:playerGoForward: No state object found for index', player.currentStateIndex);
        }
      }
    });

    // Check if a team is full
    socket.on('checkTeamStatus', ({ teamId }, callback) => {
      console.log(`SH: checkTeamStatus event received: teamId=${teamId}`); // Log checkTeamStatus event
      const team = teams.get(teamId);
      const isFull = !!(team && team.teamIsFull());
      console.log(`SH: Team ${teamId} is ${isFull ? 'full' : 'not full'}.`);
      callback(isFull);
    });

    // Når klient anmoder om spillerinfo
    socket.on('requestPlayerInfo', (playerId) => {
      console.log(`SH: requestPlayerInfo event received from socket: ${socket.id}`); // Log requestPlayerInfo event
      console.log('SH: Player ID:', playerId); // Log player Id
      if (!playerId) {
        console.log('SH: Player ID is undefined or null.'); // Log player ID status
        return;
      }
      //const playerId = playerId;
      const player = players.get(playerId);
      if (player) {
        console.log(`SH: Sending player info for: ${player.playerName}`); // Log player info
        socket.emit('playerInfo', {
          playerName: player.playerName,
          playerId: player.playerId,
          teamId: player.teamId,
          playerNumberOnTeam: player.playerNumberOnTeam
        });
      } else {
        console.log('SH: Player not found in players map.'); // Log player not found status
      }
    });

    socket.on('submitTaskAnswer', ({ playerId, taskKey, answer }, callback) => {
      const done = (payload) => callback?.(payload);

      const { team } = resolvePlayerAndTeam(playerId, 'SH:submitTaskAnswer');
      if (!team) {
        done({ valid: false, message: 'Spiller eller hold blev ikke fundet.' });
        return;
      }

      const normalizedTaskKey = String(taskKey || '').trim().toLowerCase();
      const completionEvent = COMPLETION_EVENTS_BY_TASK[normalizedTaskKey];
      if (!completionEvent) {
        done({ valid: false, message: 'Ugyldig opgave.' });
        return;
      }

      const isValid = answerValidator.validate(normalizedTaskKey, answer);
      if (!isValid) {
        done({ valid: false, message: 'Forkert svar! Prøv igen.' });
        return;
      }

      team.handleEvent(completionEvent);
      done({ valid: true, message: 'Korrekt svar!' });
    });

    const legacyCompletionHandlers = [
      { clientEvent: 'task1Completed', completionEvent: 'TASK1_COMPLETED', logPrefix: 'SH: task1Completed' },
      { clientEvent: 'task2Completed', completionEvent: 'TASK2_COMPLETED', logPrefix: 'SH: task2Completed' },
      { clientEvent: 'TASK3_COMPLETED', completionEvent: 'TASK3_COMPLETED', logPrefix: 'SH: task3Completed' },
      { clientEvent: 'task4Completed', completionEvent: 'TASK4_COMPLETED', logPrefix: 'SH: task4Completed' },
      { clientEvent: 'task5Completed', completionEvent: 'TASK5_COMPLETED', logPrefix: 'SH: task5Completed' },
      { clientEvent: 'task6Completed', completionEvent: 'TASK6_COMPLETED', logPrefix: 'SH: task6Completed' }
    ];

    legacyCompletionHandlers.forEach(({ clientEvent, completionEvent, logPrefix }) => {
      socket.on(clientEvent, ({ playerId }) => {
        const completed = completeTaskForPlayer(playerId, completionEvent, logPrefix);
        if (completed) {
          console.log(`${logPrefix}: completion handled for event ${completionEvent}.`);
        }
      });
    });


    // Når klient disconnecter: ryd op i spiller og hold
    socket.on('disconnect', () => {
      console.log(`SH: Client disconnected: ${socket.id}`); // Log disconnection
      // Find the player associated with this socket ID
      // maybe a player is never created?
      let player;
      for (const p of players.values()) {
      if (p.socket && p.socket.id === socket.id) {
        player = p;
        break;
      }
      }
      if (!player || !player.playerId) return;
      const team = teams.get(player.teamId);

      if (team) {
        console.log(`SH: Removing player ${player.playerId} from team, with ${team.getPlayerCount(player.teamId)} players`); // Log player removal
        team.removePlayer(player.playerId);
        console.log('SH: Players left on team:', team.getPlayerCount(player.teamId)); // Log players on team

        if (team.players.length === 0) {
          console.log(`SH: Team is empty. Keeping team: ${player.teamId}`); // Log team retention
        }
      }

      // Keep player in memory but mark as disconnected
      players.delete(player.playerId);
      console.log(`SH: Player removed from players map: ${player.playerId}`);
    });
  });
}

module.exports = { setupSocketHandler };