// Håndterer socket-events og opretter spillere og teams.

const Player = require('../models/Player');
const Team = require('../models/Team');
const { teams, players } = require('./state');
const TimerManager = require('./TimerManager');
const LLM = require('./llm.js');

function setupSocketHandler(io) {
  const llm = new LLM(io);

  io.on('connection', (socket) => { // Håndterer socket-forbindelse
    console.log(`New client connected: ${socket.id}`); // Log connection

    // Når klient sender joinTeam, opret spiller og tilføj til team
    socket.on('joinTeam', ({ playerName, teamId }) => {
      console.log(`Creating new player.`);
      const player = new Player(playerName, teamId, socket.id, socket);
      players.set(player.playerId, player); // Save new player in state
      socket.emit('playerUUId', player.playerId); // Send new UUID to client
      console.log(`Player created with UUID: ${player.playerId}`);

      if (!teams.has(teamId)) {
        console.log(`Creating new team with teamId=${teamId}`);
        teams.set(teamId, new Team(teamId));
      }

      const team = teams.get(teamId);
      if (!team) {
        console.log(`SH1: Team ${teamId} not found.`);
        return;
      }

      // Ensure this socket is in the team room (for future broadcasts)
      try { socket.join(teamId); } catch (e) { console.warn('join room failed', e); }

      player.playerNumberOnTeam = team.getPlayerCount(teamId);
      team.addPlayer(player);
      
      console.log(`Player added to teamId: ${team.teamId}`);
      const playerCount = team.getPlayerCount(teamId);
      console.log(`Total players on team: ${playerCount}`);

      socket.emit('displayTeamId', teamId); // Send teamId to client
      
      // If the team is already beyond Lobby, sync this single socket to current state's view
      const currentStateName = team.state && team.state.constructor && team.state.constructor.name;
      if (currentStateName && currentStateName !== 'LobbyState') {
        const view = (team.state.meta && team.state.meta.html) ? team.state.meta.html : 'lobby';
        console.log(`SH: Sync single socket ${socket.id} to current state ${currentStateName} -> view ${view}`);
        socket.emit('redirect', view);
        return; // Do not process Lobby-specific logic below
      }
      
      // Only from Lobby: start when team is full
      if (team.teamIsFull() && currentStateName === 'LobbyState') {
        team.handleEvent('teamIsFull'); //to Team.js
        console.log(`SH34: Team ${teamId} is full. Redirecting players to game.`);
      }
    });

    // Join room for teamId (should be set by client after join)
    socket.on('joinTeamRoom', (teamId) => {
      socket.join(teamId);
    });

    // LLM chat event
    socket.on('llm user input', async ({ teamId, playerName, message }) => {
      await llm.handleUserInput({ teamId, playerName, message, socket });
    });

    // Check if a team is full
    socket.on('checkTeamStatus', ({ teamId }, callback) => {
      console.log(`SH: checkTeamStatus event received: teamId=${teamId}`); // Log checkTeamStatus event
      const team = teams.get(teamId);
      //let noOfPlayers = team.getPlayerCount(); // Get number of players on the team
      //console.log(`SH: Number of players in team ${teamId}: ${noOfPlayers}`); // Log number of players
      if (team && team.teamIsFull()) {
        console.log(`Team ${teamId} is full.`); // Log team full status
        callback(true); // Team is full. "true" send to client
      } else {
        console.log(`Team ${teamId} is not full.`); // Log team not full status
        callback(false); // Team is not full. "false" send to client
      }
    });

    // Når klient anmoder om spillerinfo
    socket.on('requestPlayerInfo', (playerId) => {
      console.log(`requestPlayerInfo event received from socket: ${socket.id}`); // Log requestPlayerInfo event
      console.log('SH: Player ID:', playerId); // Log player Id
      if (!playerId) {
        console.log('Player ID is undefined or null.'); // Log player ID status
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
        console.log('Player not found in players map.'); // Log player not found status
      }
    });

    // Når task1 er afsluttet
  socket.on('task1Completed', ({ playerId }) => {
  const player = players.get(playerId);
  if (!player) {
    console.log('task1Completed: Player not found for playerId', playerId);
    return;
  }
  const team = teams.get(player.teamId);
  if (!team) {
    console.log('task1Completed: Team not found for teamId', player.teamId);
    return;
  }
  team.handleEvent('TASK1_COMPLETED'); // Handle the event in Team.js
  console.log(`task1Completed: Team ${team.teamId} transitioned to task 2.`);
});


  // Når task2 er afsluttet
  socket.on('task2Completed', ({ playerId }) => {
  const player = players.get(playerId);
  if (!player) {
    console.log('task2Completed: Player not found for playerId', playerId);
    return;
  }
  const team = teams.get(player.teamId);
  if (!team) {
    console.log('task2Completed: Team not found for teamId', player.teamId);
    return;
  }
  team.handleEvent('TASK2_COMPLETED'); // Handle the event in Team.js
  console.log(`task2Completed: Team ${team.teamId} transitioned to task 3.`);
});


    // Når task3A er afsluttet
  socket.on('TASK3A_COMPLETED', ({ playerId }) => {
  const player = players.get(playerId);
  if (!player) {
    console.log('task3ACompleted: Player not found for playerId', playerId);
    return;
  }
  const team = teams.get(player.teamId);
  if (!team) {
    console.log('task3ACompleted: Team not found for teamId', player.teamId);
    return;
  }
  team.handleEvent('TASK3A_COMPLETED'); // Handle the event in Team.js
  console.log(`task3ACompleted`);
});

    // Når task3B er afsluttet
  socket.on('TASK3B_COMPLETED', ({ playerId }) => {
  const player = players.get(playerId);
  if (!player) {
    console.log('task3BCompleted: Player not found for playerId', playerId);
    return;
  }
  const team = teams.get(player.teamId);
  if (!team) {
    console.log('task3BCompleted: Team not found for teamId', player.teamId);
    return;
  }
  team.handleEvent('TASK3B_COMPLETED'); // Handle the event in Team.js
  console.log(`task3BCompleted`);
});


socket.on('task4Completed', ({ playerId }) => {
  const player = players.get(playerId);
  if (!player) {
    console.log('task4Completed: Player not found for playerId', playerId);
    return;
  }
  const team = teams.get(player.teamId);
  if (!team) {
    console.log('task4Completed: Team not found for teamId', player.teamId);
    return;
  }
  team.handleEvent('TASK4_COMPLETED'); // Handle the event in Team.js
  console.log(`SH: task4Completed: Team ${team.teamId} transitioned to task 5.`);
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
      console.log(`Removing player ${player.playerId} from team, with ${team.getPlayerCount(player.teamId)} players`); // Log player removal
      for (let i = 0; i < team.players.length; i++) {
        if (team.players[i].playerId === player.playerId) {
          team.players.splice(i, 1);
          break;
        }
      }
      console.log('Players left on team:', team.getPlayerCount(player.teamId)); // Log players on team
      

      if (team.players.length === 0) {
        console.log(`Team is empty. Keeping team: ${player.teamId}`); // Log team retention
      }
      }

      // Keep player in memory but mark as disconnected
      player.socket = null;
      console.log(`Player marked as disconnected: ${player.playerId}`); // Log player disconnection
    });
  });
}

module.exports = { setupSocketHandler };