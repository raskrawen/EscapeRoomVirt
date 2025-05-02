// --- public/js/gameClient.js ---
const socket = io();

socket.on('connect', () => {
  console.log('Forbundet til server i game.html');
  socket.emit('requestPlayerInfo');
});

socket.on('playerInfo', ({ playerName, playerId, teamId }) => {
  document.getElementById('info').innerHTML = `
    <p><strong>Navn:</strong> ${playerName}</p>
    <p><strong>Player ID:</strong> ${playerId}</p>
    <p><strong>Team ID:</strong> ${teamId}</p>
  `;
});
