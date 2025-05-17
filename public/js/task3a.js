import { socket } from './client.js'; // Import socket from client.js

export function init() { // running when task2.js is loaded
  //document.getElementById('info').innerHTML = 'AAAAA Hello from task3a.js'; // Log task1.js setup
  console.log('Setting up TASK3 view'); // Log game view setup
  document.getElementById('submit_button').addEventListener('click', handleSubmit);
}

function handleSubmit() {
  // Placeholder for submit logic
  const answer = document.getElementById('task3a_input').value;
  document.getElementById('info').innerHTML = `You entered: ${answer}`;
}