const socket = io();

// Make sure listener is added ONCE and early
socket.on('connect', () => {
  console.log('Socket connected:', socket.id);
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
