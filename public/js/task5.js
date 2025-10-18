import { socket } from './client.js'; // Import socket from client.js
import { fadeOutAudio } from './AV/audioManager.js';
import { secretPassword } from './client.js';

export function init() { // running when task1.js is loaded
  //document.getElementById('task_content').innerHTML = 'Hello from task1.js'; // Log task1.js setup
  console.log('Setting up TASK1 view'); // Log game view setup
  fadeOutAudio(); // Fade out audio when task1 is loaded
  
}
  
document.querySelector('button#submit_button').addEventListener('click', handleSubmit);

function handleSubmit() {
  //const team = teams.get(teamId); // Get the team object
  console.log('Submit button clicked'); // Log submit button click
  if (document.getElementById('task1_input').value === secretPassword) {
    console.log('Correct answer'); // Log correct answer
     
    // Emit task completion event to socketHandler:   
  socket.emit('task1Completed', { playerId });
     console.log('Emitting TASK5_COMPLETED event'); // Log event emission
  }
  else {
    console.log('Incorrect answer'); // Log incorrect answer
    alert('Forkert svar!'); // Alert incorrect answer
  }
}
