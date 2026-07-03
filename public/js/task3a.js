import { socket } from './client.js'; // Import socket from client.js
import { playAudio, pauseAudio, fadeOutAudio, fadeOutAudioAndPlay } from './AV/audioManager.js';

export function init() { // running when task3a.js is loaded
  //document.getElementById('info').innerHTML = 'AAAAA Hello from task3a.js'; // Log task1.js setup
  console.log('Setting up TASK3 view'); // Log game view setup
  const submitBtn = document.getElementById('submit_button');
  if (submitBtn) {
    submitBtn.addEventListener('click', handleSubmit);
  }
  playAudio('critter'); // Play the critter audio
}

function setFeedback(msg, type = 'info') {
  const el = document.getElementById('feedback');
  if (!el) return;
  el.textContent = msg;
  el.className = `task-feedback ${type}`; // allows styling by type
}

function handleSubmit() {
  const answer = document.getElementById('task3a_input').value;
  const playerId = localStorage.getItem('playerUUId');

  socket.emit('submitTaskAnswer', { playerId, taskKey: 'task3', answer }, ({ valid, message } = {}) => {
    if (valid) {
      setFeedback('Korrekt!', 'success');
      return;
    }
    setFeedback(message || 'Forkert! Prøv igen.', 'error');
  });
}