const Player = require('../models/Player');
const Team = require('../models/Team');
const { teams, players } = require('./state');

function setupSocketHandler(io) {
  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`); // Log connection

    // Når klient sender joinTeam, opret spiller og tilføj til team
    socket.on('joinTeam', ({ playerName, teamId }) => {
      console.log(`joinTeam event received: playerName=${playerName}, teamId=${teamId}`); // Log joinTeam event
      const player = new Player(playerName, teamId, socket.id);
      socket.handshake.session.playerId = player.playerId;
      socket.handshake.session.save();

      players.set(player.playerId, player);

      if (!teams.has(teamId)) teams.set(teamId, new Team(teamId));
      const team = teams.get(teamId);
      team.addPlayer(player);

      console.log(`Player added: ${JSON.stringify(player)}`); // Log player data
      console.log(`Team state: ${JSON.stringify(team)}`); // Log team state

      // Hvis holdet nu er fyldt, send redirect til game
      if (team.teamIsFull()) {
        team.players.forEach(p => {
          io.to(p.socketId).emit('redirect', { url: '/game.html' });
        });
      }
    });

    // Når klient anmoder om spillerinfo
    socket.on('requestPlayerInfo', () => {
      console.log(`requestPlayerInfo event received from socket: ${socket.id}`); // Log requestPlayerInfo event
      const playerId = socket.handshake.session.playerId;
      const player = players.get(playerId);
      if (player) {
        socket.emit('playerInfo', {
          playerName: player.playerName,
          playerId: player.playerId,
          teamId: player.teamId
        });
        console.log(`Player info sent: ${JSON.stringify(player)}`); // Log player info
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
        team.players = team.players.filter(p => p.playerId !== playerId);
        if (team.players.length === 0) {
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