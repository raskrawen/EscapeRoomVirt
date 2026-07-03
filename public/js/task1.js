import { socket } from './client.js'; // Import socket from client.js
import { fadeOutAudio } from './AV/audioManager.js';

export function init() { // running when task1.js is loaded
  //document.getElementById('task_content').innerHTML = 'Hello from task1.js'; // Log task1.js setup
  console.log('Setting up TASK1 view'); // Log game view setup
  fadeOutAudio(); // Fade out audio when task1 is loaded

  // Sæt event listener på submit_button når viewet er loaded
  const submitBtn = document.querySelector('button#submit_button');
  if (submitBtn) {
    submitBtn.addEventListener('click', handleSubmit);
  }

  /*socket.emit('requestPlayerInfo', localStorage.getItem('playerUUId')); // to SH
  console.log('Emitting requestPlayerInfo event'); // Log event emission
  
  socket.on('playerInfo', ({ playerName, playerId, teamId, playerNumberOnTeam }) => {
    console.log(`Received playerInfo event with data: playerName=${playerName}, playerId=${playerId}, teamId=${teamId}`); // Log received data
    document.getElementById('info').innerHTML = `
      <p><strong>Navn:</strong> ${playerName}</p>
      <p><strong>Player ID:</strong> ${playerId}</p>
      <p><strong>Team ID:</strong> ${teamId}</p>
      <p><strong>Player Number on Team:</strong> ${playerNumberOnTeam}</p>
    `;
  });*/
}
  


function handleSubmit() {
  //const team = teams.get(teamId); // Get the team object
  console.log('Submit button clicked'); // Log submit button click
  const playerId = localStorage.getItem('playerUUId');
  const answer = document.getElementById('task1_input').value;

  socket.emit('submitTaskAnswer', { playerId, taskKey: 'task1', answer }, ({ valid, message } = {}) => {
    if (valid) {
      console.log('Correct answer');
      return;
    }
    console.log('Incorrect answer');
    alert(message || 'Forkert svar!');
  });
}
