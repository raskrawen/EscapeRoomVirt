export const socket = io();

export async function loadTask(taskName) {
  const html = await fetch(`/views/${taskName}.html`).then(r => r.text());
  document.getElementById("viewContainer").innerHTML = html;

  const module = await import(`/js/${taskName}.js`);
  module.init(); // fx init funktion i hver modul
}

// Emit appropiate events and call loadTask when redirect is received
//SHOULD NOT TAKE A URL AS PARAMETER, BUT A VIEW NAME INSTEAD
socket.on('redirect', ({ url }) => {
  console.log(`Redirect event received: url=${url}`); // Log redirect event
  if (url === '/game.html') {
    console.log('Redirecting to game view'); // Log redirection
    loadTask('game');
  }
});

// Start with the lobby view
loadTask('lobby');


