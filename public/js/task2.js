import { socket } from './client.js'; // Import socket from client.js
import { secretPassword } from './client.js';

export function init() { // running when task2.js is loaded
  //document.getElementById('info').innerHTML = 'Hello from task2.js'; // Log task1.js setup
  console.log('Setting up TASK2 view'); // Log game view setup
  
}

document.querySelector('button#submit_button').addEventListener('click', handleSubmit);

function handleSubmit() {
  //const team = teams.get(teamId); // Get the team object
  console.log('Submit button clicked'); // Log submit button click
  if (document.getElementById('task2_input').value === secretPassword || document.getElementById('task2_input').value === 'HEV') {
    console.log('Correct answer'); // Log correct answer
     // Emit task completion event to socketHandler: 
      const playerId = localStorage.getItem('playerUUId');
  socket.emit('task2Completed', { playerId }); //to socketHandler
     console.log('Emitting TASK2_COMPLETED event'); // Log event emission
  }
  else {
    console.log('Incorrect answer'); // Log incorrect answer
    alert('Forkert svar!'); // Alert incorrect answer
  }
}