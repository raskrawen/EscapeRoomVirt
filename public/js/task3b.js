import { socket } from './client.js'; // Import socket from client.js

export function init() { // running when task2.js is loaded
  //document.getElementById('info').innerHTML = 'BBB Hello from task3b.js'; // Log task1.js setup
  console.log('Setting up TASK3 view'); // Log game view setup
  document.getElementById('submit_button').addEventListener('click', handleSubmit);
}

function handleSubmit() {
  // Placeholder for submit logic
  const answer = document.getElementById('task3b_input').value;
  if (answer === 'KØLLESVÆRMER' || answer === 'ras') {
    socket.emit('TASK3B_COMPLETED', answer); // Send event to server
    document.getElementById('info').innerHTML = `Korrekt! Vent mens resten af dit hold løser deres opgave.`;
  }
  else {
    document.getElementById('info').innerHTML = `Forkert! Prøv igen.`;
  }}