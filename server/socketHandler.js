// Import necessary modules and state
const Player = require('../models/Player');
const Team = require('../models/Team');
const { teams, players } = require('./state');

// Function to setup Socket.io event handlers
function setupSocketHandler(io) {
  console.log('Socket handler started.');

  // Handle new client connections
  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Handle joinTeam event from client
    socket.on('joinTeam', ({ playerName, teamId }) => {
      console.log(`joinTeam event received:`, { playerName, teamId });

      // Create a new player and associate with the session
      const player = new Player(playerName, teamId, socket.id);
      socket.handshake.session.playerId = player.playerId;
      socket.handshake.session.save();

      // Add player to the global state
      players.set(player.playerId, player);

      // Add player to the team, creating the team if necessary
      if (!teams.has(teamId)) teams.set(teamId, new Team(teamId));
      const team = teams.get(teamId);
      team.addPlayer(player);

      // Redirect team members to the game page if the team is full
      if (team.teamIsFull()) {
        team.players.forEach(p => {
          io.to(p.socketId).emit('redirect', { url: '/game.html' });
        });
      }
    });

    // Handle requestPlayerInfo event from client
    socket.on('requestPlayerInfo', () => {
      const playerId = socket.handshake.session.playerId;
      const player = players.get(playerId);
      if (player) {
        socket.emit('playerInfo', {
          playerName: player.playerName,
          playerId: player.playerId,
          teamId: player.teamId
        });
      }
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      // Cleanup logic for players/teams can be added here
    });
  });
}

module.exports = { setupSocketHandler };
