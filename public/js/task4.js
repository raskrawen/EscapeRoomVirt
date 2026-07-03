
import { socket } from './client.js';
import { secretPassword } from './client.js';

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
  if (document.getElementById('task4_input').value === secretPassword || document.getElementById('task4_input').value === 'fiskeguf') {
    console.log('Correct answer'); // Log correct answer
     // Emit task completion event to socketHandler: 
      const playerId = localStorage.getItem('playerUUId');
  socket.emit('task4Completed', { playerId }); //to socketHandler
     console.log('Emitting TASK4_COMPLETED event'); // Log event emission
  }
  else {
    console.log('Incorrect answer'); // Log incorrect answer
    alert('Forkert svar!'); // Alert incorrect answer
  }
}