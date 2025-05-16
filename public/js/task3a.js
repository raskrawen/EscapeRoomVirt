import { socket } from './client.js'; // Import socket from client.js

export function init() { // running when task2.js is loaded
  document.getElementById('info').innerHTML = 'Hello from task3.js'; // Log task1.js setup
  console.log('Setting up TASK3 view'); // Log game view setup
}