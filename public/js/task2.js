import { socket } from './client.js'; // Import socket from client.js


export function init() { // running when task2.js is loaded
  //document.getElementById('info').innerHTML = 'Hello from task2.js'; // Log task1.js setup
  console.log('Setting up TASK2 view'); // Log game view setup
  const submitBtn = document.querySelector('button#submit_button');
  if (submitBtn) {
    submitBtn.onclick = handleSubmit;
  }
}

function handleSubmit() {
  //const team = teams.get(teamId); // Get the team object
  console.log('Submit button clicked'); // Log submit button click
  const playerId = localStorage.getItem('playerUUId');
  const answer = document.getElementById('task2_input').value;

  socket.emit('submitTaskAnswer', { playerId, taskKey: 'task2', answer }, ({ valid, message } = {}) => {
    if (valid) {
      console.log('Correct answer');
      return;
    }
    console.log('Incorrect answer');
    alert(message || 'Forkert svar!');
  });
}