import { socket } from './client.js'; // Import socket from client.js

export function init() { // running when task1.js is loaded
  //document.getElementById('task_content').innerHTML = 'Hello from task1.js'; // Log task1.js setup
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
  document.querySelector('button#submit_button').addEventListener('click', handleSubmit);

  function handleSubmit() {
  //const team = teams.get(teamId); // Get the team object
  console.log('Submit button clicked'); // Log submit button click
  if (document.getElementById('task1_input').value === '123') {
    console.log('Correct answer'); // Log correct answer
     // Emit task completion event to socketHandler: 
      const playerId = localStorage.getItem('playerUUId');
  socket.emit('task1Completed', { playerId });
     console.log('Emitting TASK1_COMPLETED event'); // Log event emission
  }
}
