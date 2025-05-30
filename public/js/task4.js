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

let canSend = true; // Track if this client is allowed to send

function setSendButtonState(enabled, text) {
  sendButton.disabled = !enabled;
  sendButton.textContent = text;
  canSend = enabled;
}

function handleSend() {
  if (!canSend) return; // Prevent sending if not allowed
  const text = chatInput.value.trim();
  if (!text) return;
  // check if text contains the string 'Fiskeguf'
  if (text.includes('Fiskeguf')) {
    const playerId = localStorage.getItem('playerUUId');
    socket.emit('task4Completed', { playerId }); //to socketHandler
    return;
  }
  setLoading(true);
  setSendButtonState(false, 'Vent');
  // Send user input to server, include playerName and teamId
  socket.emit('llm user input', { teamId, playerName, message: text });
  chatInput.value = '';
}

sendButton.addEventListener('click', handleSend);
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSend();
});

// Join team room for LLM chat
socket.emit('joinTeamRoom', teamId);

// Listen for LLM reply (AI message)
socket.on('llm reply', ({ text, error }) => {
  setLoading(false);
  if (error) {
    infoArea.textContent = 'Fejl fra AI: ' + error;
    return;
  }
  appendMessage('AI', text, true);
});

// Listen for user messages from other clients (broadcasted by server)
socket.on('llm user message', ({ playerName: sender, message }) => {
  appendMessage(sender, message, false);
  // If the message is from another user, re-enable the send button
  if (sender !== playerName) {
    setSendButtonState(true, 'Send');
  }
});

// Optional: focus input on load
window.onload = () => {
  chatInput.focus();
};

console.log('Setting up TASK4 LLM chat view');