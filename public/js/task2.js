import { socket } from './client.js'; // Import socket from client.js

export function init() { // running when task2.js is loaded
  document.getElementById('task_content').innerHTML = 'Hello from task2.js'; // Log task1.js setup
  console.log('Setting up TASK1 view'); // Log game view setup
  
}