// Lytter efter server-events og opdaterer klientens view.

export const secretPassword = "123qwe";

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

export async function loadTask(taskName) {
  const html = await fetch(`/views/${taskName}.html`).then(r => r.text());
  document.getElementById("viewContainer").innerHTML = html;

  // Wait for all images in the new content to load
  const images = Array.from(document.getElementById("viewContainer").getElementsByTagName("img"));
  if (images.length > 0) {
    let loaded = 0;
    images.forEach(img => {
      if (img.complete) {
        loaded++;
      } else {
        img.onload = img.onerror = () => {
          loaded++;
          if (loaded === images.length) {
            //loadingOverlay in index-html
            document.getElementById("loadingOverlay").style.display = "none";
          }
        };
      }
    });
    if (loaded === images.length) {
      document.getElementById("loadingOverlay").style.display = "none";
    }
  } else {
    document.getElementById("loadingOverlay").style.display = "none";
  }

  const module = await import(`/js/${taskName}.js`);
  module.init();
  
  // Show/hide backButton based on view
  const backButton = document.getElementById("backButton");
  const hideViews = ["lobby", "task1", "timeout"];
  if (backButton) {
    if (hideViews.includes(taskName)) {
      backButton.style.display = "none";
    } else {
      backButton.style.display = "inline-block";
    }
  }
}

// Load initial view
loadTask('start');

// Add event listener for backButton
document.addEventListener('DOMContentLoaded', () => {
  const backButton = document.getElementById('backButton');
  if (backButton) {
    backButton.onclick = () => {
      const playerUUId = localStorage.getItem('playerUUId');
      socket.emit('playerGoBack', { playerId: playerUUId });
    };
  }
});

socket.on('displayTeamId', (teamId) => {
  if (teamId) {
    document.getElementById('teamIdBox').textContent = 'Holdnavn: ' + teamId;
  } else {
    console.error('Received empty teamId from server.');
  }
});


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

export async function showInfoModal() {
  const html = await fetch('/views/info.html').then(r => r.text());
  const modal = document.createElement('div');
  modal.id = 'infoModal';
  modal.innerHTML = html + '<button id="closeInfo">Luk</button>';
  modal.style = 'position:fixed; top:10%; left:10%; width:80vw; background:#222; color:#fff; z-index:2000; padding:2em; border-radius: 12px; box-shadow: 0 0 20px #000;';
  document.body.appendChild(modal);
  document.getElementById('closeInfo').onclick = () => modal.remove();
}

