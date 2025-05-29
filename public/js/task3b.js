import { socket } from './client.js'; // Import socket from client.js

export function init() { // running when task2.js is loaded
  //document.getElementById('info').innerHTML = 'BBB Hello from task3b.js'; // Log task1.js setup
  console.log('Setting up TASK3 view'); // Log game view setup
  document.getElementById('submit_button').addEventListener('click', handleSubmit);
}

function handleSubmit() {
  // Placeholder for submit logic
  const answer = document.getElementById('task3b_input').value;
  const playerId = localStorage.getItem('playerUUId');
  if (answer === 'KØLLESVÆRMER' || answer === '123') {
    socket.emit('TASK3B_COMPLETED', { playerId }); // Send event to server
    document.getElementById('info').innerHTML = `Korrekt! Hjælp resten af dit hold med at løse opgaver.`;
  }
  else {
    document.getElementById('info').innerHTML = `Forkert! Prøv igen.`;
  }}