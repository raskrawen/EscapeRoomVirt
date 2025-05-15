

// Lytter efter server-events og opdaterer klientens view.
const socket = io();
// Make sure listener is added ONCE and early
socket.on('connect', () => {
  console.log('Socket connected:', socket.id);
});

socket.on('playerUUId', (playerUUId) => {
  localStorage.setItem('playerUUId', playerUUId); // Gem UUID i localStorage
  });

socket.on('redirect', ( view ) => { //event fra socketHandler
  console.log('Redirect event in client.js to:', view);
  loadTask(view);
});

export { socket };

export async function loadTask(taskName) { //asynk funktion fordi vi venter på at html og js er loaded
  const html = await fetch(`/views/${taskName}.html`).then(r => r.text()); //venter på at html er loaded
  document.getElementById("viewContainer").innerHTML = html;

  const module = await import(`/js/${taskName}.js`);
  module.init();
}

// Load initial view
loadTask('lobby');

// Listen for timer updates from the server
socket.on('timerUpdate', ({ remainingTime }) => {
  //console.log('Timer update received:', remainingTime);
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  const formattedTime = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  document.getElementById('timer').textContent = 'Tid: ' + formattedTime;
});

socket.on('timerFinished', () => {
  console.log('Timer has finished.');
  // Handle timer completion (e.g., redirect to another view)
});

