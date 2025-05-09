const Player = require('../models/Player');
const Team = require('../models/Team');
const { teams, players } = require('./state');

function setupSocketHandler(io) {
  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`); // Log connection

    
    // Når lobby sender joinTeam, opret spiller og tilføj til team
    socket.on('joinTeam', ({ playerName, teamId }, callback) => {
  console.log(`joinTeam event received: playerName=${playerName}, teamId=${teamId}`);

  if (!playerName || !teamId) {
    return callback({ status: 'error', message: 'Navn og team ID er påkrævet' });
  }

  // Hent eksisterende team, eller opret et nyt
  let team = teams.get(teamId);
  if (!team) {
    console.log(`Creating new team with teamId=${teamId}`);
    team = new Team(teamId); // Team opretter selv sin fsm
    teams.set(teamId, team);
  } else {
    console.log(`Team with teamId=${teamId} already exists`);
  }

  // Opret spiller og tildel nummer
  const player = new Player(playerName, teamId, socket.id);
  player.playerNumberOnTeam = team.getPlayerCount(teamId);
  players.set(player.playerId, player);

  // Gem spiller-id i session
  socket.handshake.session.playerId = player.playerId;
  socket.handshake.session.save();

  // Tilføj spiller til holdet
  team.addPlayer(player);
  console.log(`Player added to team: ${JSON.stringify(player)}`);

  // Tjek om holdet nu er fyldt → redirect
  if (team.teamIsFull()) {
    console.log(`Team is full. Redirecting players.`);

    // FSM transition
    const fsm = team.fsm;
    if (!fsm || typeof fsm.send !== 'function') {
      console.error(`FSM mangler eller er forkert på team ${teamId}`);
      return;
    }

    fsm.send('NEXT');
    const targetHtml = team.getCurrentView(); // fx 'task1'

    // Send redirect til alle spillere på holdet
    team.players.forEach(p => {
      io.to(p.socketId).emit('redirect', targetHtml);
    });
  } else {
    console.log(`Team is not full yet.`);
  }
});


    // Check if a team is full
    socket.on('checkTeamStatus', ({ teamId }, callback) => {
      console.log(`checkTeamStatus event received: teamId=${teamId}`); // Log checkTeamStatus event
      const team = teams.get(teamId);
      if (!team) {
      console.warn(`teamId ${teamId} not found in teams Map`);
      return callback(false);
    }
      const a = team.teamIsFull();
      console.log('SH56: is team full?', a);
      console.log('SH57: does team exist?', team);
      if (team && team.teamIsFull()) {
        console.log(`Team ${teamId} is full.`); // Log team full status
        callback(true); // Team is full. "true" send to client
      } else {
        console.log(`Team ${teamId} is not full.`); // Log team not full status
        callback(false); // Team is not full. "false" send to client
      }
    });

    // Når klient anmoder om spillerinfo
    socket.on('requestPlayerInfo', () => {
      console.log(`requestPlayerInfo event received from socket: ${socket.id}`); // Log requestPlayerInfo event
      const playerId = socket.handshake.session.playerId;
      const player = players.get(playerId);
      if (player) {
        console.log(`Sending player info: ${JSON.stringify(player)}`); // Log player info
        socket.emit('playerInfo', {
          playerName: player.playerName,
          playerId: player.playerId,
          teamId: player.teamId,
          playerNumberOnTeam: player.playerNumberOnTeam
        });
      }
    });

    // Når klient disconnecter: ryd op i spiller og hold
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`); // Log disconnection
      const playerId = socket.handshake.session?.playerId;
      if (!playerId) return;

      const player = players.get(playerId);
      if (!player) return;

      const team = teams.get(player.teamId);
      if (team) {
        console.log(`Removing player from team: ${playerId}`); // Log player removal
        team.players = team.players.filter(p => p.playerId !== playerId);
        if (team.players.length === 0) {
          console.log(`Team is empty. Deleting team: ${player.teamId}`); // Log team deletion
          teams.delete(player.teamId);
        }
      }

      players.delete(playerId);
      console.log(`Player removed: ${playerId}`); // Log player removal
      console.log(`Player ${playerId} slettet`);
    });
  });
}

module.exports = { setupSocketHandler };