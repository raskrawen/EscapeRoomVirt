export const socket = io();

export async function loadTask(taskName) {
  const html = await fetch(`/views/${taskName}.html`).then(r => r.text());
  document.getElementById("viewContainer").innerHTML = html;

  const module = await import(`/js/${taskName}.js`);
  module.init(); // fx init funktion i hver modul
}

// Emit appropiate events and call loadTask when redirect is received
socket.on('redirect', ({ view }) => {
  console.log('Redirect event to game.'); // Log redirect event
    loadTask(view); // Load the new view
});

// Start with the lobby view
loadTask('lobby');


