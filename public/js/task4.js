
import { socket } from './client.js';

export function init() {
  const submitBtn = document.querySelector('button#submit_button');
  if (submitBtn) {
    submitBtn.onclick = handleSubmit;
  }

  const task4Input = document.getElementById('task4_input');
  if (task4Input) {
    task4Input.focus();
  }

  console.log('Setting up TASK4 simple input view');
}


function handleSubmit() {
  //const team = teams.get(teamId); // Get the team object
  console.log('Submit button clicked'); // Log submit button click
  const playerId = localStorage.getItem('playerUUId');
  const answer = document.getElementById('task4_input').value;

  socket.emit('submitTaskAnswer', { playerId, taskKey: 'task4', answer }, ({ valid, message } = {}) => {
    if (valid) {
      console.log('Correct answer');
      return;
    }
    console.log('Incorrect answer');
    alert(message || 'Forkert svar!');
  });
}