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
    console.log('Start button clicked'); // Log start button click
    const playerName = document.getElementById('playerName').value;
    const teamId = document.getElementById('teamId').value;
    console.log(`Emitting joinTeam event with playerName=${playerName}, teamId=${teamId}`); // Log event data
    socket.emit('joinTeam', { playerName, teamId });
  });
}

// Opsæt game-logik efter redirect
function setupGameView() {
  console.log('Setting up game view'); // Log game view setup
  socket.emit('requestPlayerInfo');
  console.log('Emitting requestPlayerInfo event'); // Log event emission
  socket.on('playerInfo', ({ playerName, playerId, teamId }) => {
    console.log(`Received playerInfo event with data: playerName=${playerName}, playerId=${playerId}, teamId=${teamId}`); // Log received data
    document.getElementById('info').innerHTML = `
      <p><strong>Navn:</strong> ${playerName}</p>
      <p><strong>Player ID:</strong> ${playerId}</p>
      <p><strong>Team ID:</strong> ${teamId}</p>
    `;
  });
}

// Modtag redirect-signal fra serveren
socket.on('redirect', ({ url }) => {
  console.log(`Redirect event received: url=${url}`); // Log redirect event
  if (url === '/game.html') {
    console.log('Redirecting to game view'); // Log redirection
    loadView('/views/game.html', setupGameView);
  }
});

// Start med at vise lobbyen
loadView('/views/lobby.html', () => {
  console.log('Lobby view loaded'); // Log view load
  setupLobbyView();
});
