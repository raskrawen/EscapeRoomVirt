// sockerHandler.js står for at håndtere socket.io events og kommunikationen mellem server og klient.
// Den håndterer tilslutning af spillere, tilføjelse af spillere til hold, tjek af holdstatus og håndtering af frakobling af spillere.
const Player = require('../models/Player');
const Team = require('../models/Team');
const { teams, players } = require('./state');

function setupSocketHandler(io) {
  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`); // Log connection
    // Vis lobby med det samme. redirect defineret i client.js
    socket.emit('redirect', { view: 'lobby' });

    // Når klient sender joinTeam, opret spiller og tilføj til team
    socket.on('joinTeam', ({ playerName, teamId }) => {
      console.log(`joinTeam event received: playerName=${playerName}, teamId=${teamId}`); // Log joinTeam event
      const player = new Player(playerName, teamId, socket.id);
      console.log(`Creating new player: ${JSON.stringify(player)}`); // Log player creation
      socket.handshake.session.playerId = player.playerId;
      socket.handshake.session.save();
      if (!teams.has(teamId)) { // Hvis holdet ikke findes, opret det
        console.log(`Creating new team with teamId=${teamId}`); // Log team creation
        teams.set(teamId, new Team(teamId));
      }
      const team = teams.get(teamId); // Find hold og gem i lokalt team objekt
      const playerNumberOnTeam = team.getPlayerCount(teamId); // Spillernummer på holdet
      player.playerNumberOnTeam = playerNumberOnTeam; // Opdater spillernummer på holdet
      //player data done.
      
      players.set(player.playerId, player); // Gem spiller i state
      
      team.addPlayer(player); // Tilføj spiller til holdet

      console.log(`Player added to team: ${JSON.stringify(team)}`); // Log team state

      // Send READY uanset hvad – FSM vurderer via guard
      team.stateService.send({ type: 'READY' });

      // Vis view baseret på FSM’s aktuelle state. Defineret nedenfor.
      redirectTeamView(io, team);

     /* // Hvis holdet nu er fyldt, send redirect til game
      if (team.teamIsFull()) {
        console.log(`Team is full. Redirecting players.`); // Log redirection
        //team.players.forEach(p => {
        //  io.to(p.socketId).emit('redirect', { view: 'game' });
        //});

        //SKAL NOK UD:
        const views = ['game', 'task1', 'view3', 'view4'];
        team.players.forEach((p, index) => {
          const view = views[index];
          console.log(`Redirecting player ${p.socketId} to view: ${view}`); // Log redirection
          io.to(p.socketId).emit('redirect', { view }); // to client.js
        });
      } */
    });

    

    // Check if a team is full. Emit from lobby.js
    socket.on('checkTeamStatus', ({ teamId }, callback) => {
      console.log(`checkTeamStatus event received: teamId=${teamId}`); // Log checkTeamStatus event
      const team = teams.get(teamId);
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

    // Funktion til at sende redirect til alle spillere.
    // Redirect defineret i client.js
    // Kaldes når FSM skifter state og der er en ny view at vise.
    function redirectTeamView(io, team) {
      const state = team.stateService.getSnapshot();
      const view = state.machine.states[state.value].meta?.html; // Hent meta.html fra FSM state

      if (!view) return;

      team.players.forEach(p => {
        console.log(`Redirecting player ${p.socketId} to view: ${view}`);
        io.to(p.socketId).emit('redirect', { view });
      });
    }


module.exports = { setupSocketHandler };