const Player = require('../models/Player');
const Team = require('../models/Team');
const { teams, players } = require('./state');

function setupSocketHandler(io) {
  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Når klient sender joinTeam, opret spiller og tilføj til team
    socket.on('joinTeam', ({ playerName, teamId }) => {
      const player = new Player(playerName, teamId, socket.id);
      socket.handshake.session.playerId = player.playerId;
      socket.handshake.session.save();

      players.set(player.playerId, player);

      if (!teams.has(teamId)) teams.set(teamId, new Team(teamId));
      const team = teams.get(teamId);
      team.addPlayer(player);

      // Hvis holdet nu er fyldt, send redirect til game
      if (team.teamIsFull()) {
        team.players.forEach(p => {
          io.to(p.socketId).emit('redirect', { url: '/game.html' });
        });
      }
    });

    // Når klient anmoder om spillerinfo
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

    // Når klient disconnecter: ryd op i spiller og hold
    socket.on('disconnect', () => {
      const playerId = socket.handshake.session?.playerId;
      if (!playerId) return;

      const player = players.get(playerId);
      if (!player) return;

      const team = teams.get(player.teamId);
      if (team) {
        team.players = team.players.filter(p => p.playerId !== playerId);
        if (team.players.length === 0) {
          teams.delete(player.teamId);
        }
      }

      players.delete(playerId);
      console.log(`Player ${playerId} slettet`);
    });
  });
}

module.exports = { setupSocketHandler };