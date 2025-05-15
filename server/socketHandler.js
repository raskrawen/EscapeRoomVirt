// Håndterer socket-events og opretter spillere og teams.

const Player = require('../models/Player');
const Team = require('../models/Team');
const { teams, players } = require('./state');
const TimerManager = require('./TimerManager');

function setupSocketHandler(io) {
  io.on('connection', (socket) => {
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

      player.playerNumberOnTeam = team.getPlayerCount(teamId);
      team.addPlayer(player);
      
      console.log(`Player added to teamId: ${team.teamId}`);
      const playerCount = team.getPlayerCount(teamId);
      console.log(`Total players on team: ${playerCount}`);

      socket.emit('displayTeamId', teamId); // Send teamId to client
      
      if (team.teamIsFull()) {
        team.handleEvent('teamIsFull');
        console.log(`SH34: Team ${teamId} is full. Redirecting players to game.`);
      }

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