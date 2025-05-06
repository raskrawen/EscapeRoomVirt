import { socket } from './client.js';

export function init() {
  console.log('Setting up game view'); // Log game view setup
  socket.emit('requestPlayerInfo');
  console.log('Emitting requestPlayerInfo event'); // Log event emission
  
  socket.on('playerInfo', ({ playerName, playerId, teamId, playerNumberOnTeam }) => {
    console.log(`Received playerInfo event with data: playerName=${playerName}, playerId=${playerId}, teamId=${teamId}`); // Log received data
    document.getElementById('info').innerHTML = `
      <p><strong>Navn:</strong> ${playerName}</p>
      <p><strong>Player ID:</strong> ${playerId}</p>
      <p><strong>Team ID:</strong> ${teamId}</p>
      <p><strong>Player Number on Team:</strong> ${playerNumberOnTeam}</p>
    `;
  });
}