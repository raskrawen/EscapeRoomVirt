import { socket } from './client.js';

export function init() {
  document.getElementById('task_content').innerHTML = 'Hello from task1.js'; // Log task1.js setup
  console.log('Setting up TASK1 view'); // Log game view setup
  socket.emit('requestPlayerInfo', localStorage.getItem('playerUUId')); // to SH
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