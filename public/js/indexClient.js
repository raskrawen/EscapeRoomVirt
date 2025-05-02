// --- public/js/indexClient.js ---
const socket = io();

socket.on('connect', () => {
    console.log('Client connected:', socket.id); // <-- skal vises i browserens console
  });
  
// Log user input and events
function joinTeam() {
    const playerName = document.getElementById('playerName').value;
    const teamId = document.getElementById('teamId').value;
    console.log(`User input - Player Name: ${playerName}, Team ID: ${teamId}`);

    socket.emit('joinTeam', { playerName, teamId });
    console.log('joinTeam event emitted to server');
}

socket.on('redirect', ({ url }) => {
  window.location.href = url;
});