//connect clients, set up teams

const Team = require('./public/server/models/team');
const Player = require('./public/server/models/player');

// Shared teams object
const teams = {};

function setupSocketHandlers(io) { // Setup socket handlers. In function because we need to pass io from server.js
  io.on('connection', (socket) => {
    
    // Updated joinTeam logic to handle session and room assignment
    socket.on('joinTeam', ({ playerId, teamId, playerName }) => {
      console.log('Player trying to join team: Player ID:', playerId, 'Team ID:', teamId, 'Player Name:', playerName);
      try {
        const newPlayer = new Player(playerId, socket.id, playerName);

        if (!teams[teamId]) {
          console.log('Creating new team:', teamId);
          teams[teamId] = new Team(teamId);
        }
        const team = teams[teamId];

        team.addPlayer(newPlayer);

        socket.handshake.session.teamId = teamId;
        socket.handshake.session.save();

        socket.join(teamId);

        if (team.isTeamFull()) {
          console.log('Team is full: ', teamId);
          //emit to all clients in the room:
          io.to(teamId).emit('teamReady', team.getPlayerCount());
          return;
        }

      } catch (error) {
        console.error('Join error:', error.message);
        socket.emit('errorJoiningTeam', { message: error.message });
      }

      socket.on('testConnection', (msg) => {
        console.log('Test connection message:', msg);
      });

      socket.on('getPlayerData', ({ playerId }) => {
        // Search for the player in all teams
        for (const teamId in teams) {
          const team = teams[teamId];
          if (team.players[playerId]) {
            const player = team.players[playerId];
            socket.emit('playerData', {
              playerId: player.playerId,
              playerName: player.playerName,
              teamId: teamId,
            });
            return;
          }
        }
      
        // If the player is not found, send an error response
        socket.emit('playerData', { error: 'Player not found' });
      });

    socket.on('disconnect', () => {
      //console.log('A client disconnected');
      //console.log('Client disconnected:', socket.id);
      // Optional: remove player from teams
    });
  });
});
}

module.exports = { setupSocketHandlers, teams }; // Export the teams object for use in other modules
