// --- public/js/indexClient.js ---
const socket = io();

function joinTeam() {
  const playerName = document.getElementById('playerName').value;
  const teamId = document.getElementById('teamId').value;
  socket.emit('joinTeam', { playerName, teamId });
}

socket.on('redirect', ({ url }) => {
  window.location.href = url;
});