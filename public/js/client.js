const socket = io();

// Funktion til at hente HTML-visning og tilknytte logik
function loadView(url, callback) {
  fetch(url)
    .then(res => res.text())
    .then(html => {
      document.getElementById('viewContainer').innerHTML = html;
      if (callback) callback(); // Kald setup-funktion når view er indlæst
    });
}

// Opsæt lobby-logik efter view er indlæst
function setupLobbyView() {
  document.getElementById('startButton').addEventListener('click', () => {
    const playerName = document.getElementById('playerName').value;
    const teamId = document.getElementById('teamId').value;
    socket.emit('joinTeam', { playerName, teamId });
  });
}

// Opsæt game-logik efter redirect
function setupGameView() {
  socket.emit('requestPlayerInfo');
  socket.on('playerInfo', ({ playerName, playerId, teamId }) => {
    document.getElementById('info').innerHTML = `
      <p><strong>Navn:</strong> ${playerName}</p>
      <p><strong>Player ID:</strong> ${playerId}</p>
      <p><strong>Team ID:</strong> ${teamId}</p>
    `;
  });
}

// Modtag redirect-signal fra serveren
socket.on('redirect', ({ url }) => {
  if (url === '/game.html') {
    loadView('/views/game.html', setupGameView);
  }
});

// Start med at vise lobbyen
loadView('/views/lobby.html', setupLobbyView);
