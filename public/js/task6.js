import { socket } from './client.js'; // Import socket from client.js
import { fadeOutAudio } from './AV/audioManager.js';
import { secretPassword } from './client.js';


export function init() { // running when task5.js is loaded
  //document.getElementById('task_content').innerHTML = 'Hello from task5.js'; // Log task5.js setup
  console.log('Setting up TASK6 view'); // Log game view setup
  fadeOutAudio(); // Fade out audio when task5 is loaded
  const submitBtn = document.querySelector('button#submit_button');
  if (submitBtn) {
    submitBtn.addEventListener('click', handleSubmit);
  }
}

function handleSubmit() {
  console.log('Submit button clicked'); // Log submit button click
  const playerId = localStorage.getItem('playerUUId');
  const inputValue = document.getElementById('task6_input').value;
  if (inputValue === 'KRYOLITSAV') {
    
  }
  if (inputValue === secretPassword || inputValue === 'KRYOLIT') {
    console.log('Correct answer'); // Log correct answer
    // Emit task completion event to socketHandler:   
    socket.emit('task6Completed', { playerId });
    console.log('Emitting TASK6_COMPLETED event'); // Log event emission
  }
  else {
    console.log('Incorrect answer'); // Log incorrect answer
    alert('Forkert svar!'); // Alert incorrect answer
  }
}
