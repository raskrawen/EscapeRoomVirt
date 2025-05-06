const socket = io();

// Make sure listener is added ONCE and early
socket.on('connect', () => {
  console.log('Socket connected:', socket.id);
});

socket.on('redirect', ({ view }) => {
  console.log('Redirect event in client.js to:', view);
  loadTask(view);
});

export { socket };

export async function loadTask(taskName) {
  const html = await fetch(`/views/${taskName}.html`).then(r => r.text());
  document.getElementById("viewContainer").innerHTML = html;

  const module = await import(`/js/${taskName}.js`);
  module.init();
}

// Load initial view
loadTask('lobby');
