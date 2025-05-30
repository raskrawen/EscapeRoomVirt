import { socket } from './client.js';

// DOM elements
const chatWindow = document.getElementById('chat_window');
const chatInput = document.getElementById('chat_input');
const sendButton = document.getElementById('send_button');
const infoArea = document.getElementById('info');

// Get teamId and playerName from localStorage
const teamId = localStorage.getItem('teamId');
const playerName = localStorage.getItem('playerName') || 'Spiller';

function appendMessage(sender, text, isLLM = false) {
  const msgDiv = document.createElement('div');
  msgDiv.className = isLLM ? 'llm-message' : 'user-message';
  msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function speakText(text) {
  if ('speechSynthesis' in window) {
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = 'da-DK'; // Danish, change if needed
    window.speechSynthesis.speak(utter);
  }
}

function setLoading(isLoading) {
  if (isLoading) {
    infoArea.textContent = 'Vent venligst... AI svarer.';
    sendButton.disabled = true;
    chatInput.disabled = true;
  } else {
    infoArea.textContent = '';
    sendButton.disabled = false;
    chatInput.disabled = false;
  }
}

function handleSend() {
  const text = chatInput.value.trim();
  if (!text) return;
  appendMessage(playerName, text);
  setLoading(true);
  socket.emit('llm user input', { teamId, playerName, text });
  chatInput.value = '';
}

sendButton.addEventListener('click', handleSend);
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSend();
});

// Join team room for LLM chat
socket.emit('joinTeamRoom', { teamId });

// Listen for LLM reply
socket.on('llm reply', ({ text, error }) => {
  setLoading(false);
  if (error) {
    infoArea.textContent = 'Fejl fra AI: ' + error;
    return;
  }
  appendMessage('AI', text, true);
  speakText(text);
});

// Optional: focus input on load
window.onload = () => {
  chatInput.focus();
};

// Show initial info
infoArea.innerHTML = 'Chat with the LLM to solve the task!';
console.log('Setting up TASK4 LLM chat view');