import { socket } from './client.js'; // Import socket from client.js
import { fadeOutAudio } from './AV/audioManager.js';


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
  const answer = document.getElementById('task6_input').value;

  socket.emit('submitTaskAnswer', { playerId, taskKey: 'task6', answer }, ({ valid, message } = {}) => {
    if (valid) {
      console.log('Correct answer');
      return;
    }
    console.log('Incorrect answer');
    alert(message || 'Forkert svar!');
  });
}
