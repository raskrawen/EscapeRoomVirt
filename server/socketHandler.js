const Player = require('../models/Player');
const Team = require('../models/Team');
const { teams, players } = require('./state');

function setupSocketHandler(io) {
  console.log('Socket handler started.');

  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Client joins a team
    socket.on('joinTeam', ({ playerName, teamId }) => {
      console.log(`joinTeam event received:`, { playerName, teamId });

      const player = new Player(playerName, teamId, socket.id);
      socket.handshake.session.playerId = player.playerId;
      socket.handshake.session.save();

      players.set(player.playerId, player);

      if (!teams.has(teamId)) teams.set(teamId, new Team(teamId));
      const team = teams.get(teamId);
      team.addPlayer(player);

      if (team.teamIsFull()) {
        team.players.forEach(p => {
          io.to(p.socketId).emit('redirect', { url: '/game.html' });
        });
      }
    });

    // Client requests their player info
    socket.on('requestPlayerInfo', () => {
      const playerId = socket.handshake.session.playerId; //ny
      const player = players.get(playerId);
      if (player) {
        socket.emit('playerInfo', {
          playerName: player.playerName,
          playerId: player.playerId,
          teamId: player.teamId
        });
      }
    });

   

    // Client disconnects
    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id} `);

    });
  });
}

module.exports = { setupSocketHandler };
