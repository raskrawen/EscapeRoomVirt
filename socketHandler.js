//connect clients, set up teams

const Team = require('./public/server/models/team');
const Player = require('./public/server/models/player');

// Shared teams object
const teams = {};

function setupSocketHandlers(io) { // Setup socket handlers
  io.on('connection', (socket) => {
    const playerId = socket.handshake.session.id;

    // Updated joinTeam logic to handle session and room assignment
    socket.on('joinTeam', ({ teamId }) => {
      console.log('Player trying to join team: Player ID:', playerId, 'Team ID:', teamId);
      try {
        const newPlayer = new Player(playerId, socket.id);

        if (!teams[teamId]) {
          teams[teamId] = new Team(teamId);
        }
        const team = teams[teamId];

        if (team.isTeamFull()) {
          socket.emit('teamReady', { message: 'Team is already full!' });
          return;
        }

        team.addPlayer(newPlayer);

        // Save teamId in the session
        socket.handshake.session.teamId = teamId;
        socket.handshake.session.save();

        // Join the team room
        socket.join(teamId);

        // Emit team update
        io.to(teamId).emit('teamUpdate', {
          teamId,
          players: Object.keys(team.players),
        });

        if (team.isTeamFull()) {
          io.to(teamId).emit('teamReady', { message: 'Team is ready!' });
        }

      } catch (error) {
        console.error('Join error:', error.message);
        socket.emit('errorJoiningTeam', { message: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log('from socketHandler.js: Player disconnected:', playerId);
      console.log('Client disconnected:', socket.id);
      // Optional: remove player from teams
    });
  });
}

module.exports = { setupSocketHandlers, teams }; // Export the teams object for use in other modules
