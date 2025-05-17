import { socket } from './client.js';

export function init() {
  const startButton = document.getElementById('startButton');
  startButton.addEventListener('click', () => {
    console.log('Start button clicked'); // Log start button click
    startButton.disabled = true; // Disable the button to prevent multiple clicks
    const playerName = document.getElementById('playerName').value;
    const teamId = document.getElementById('teamId').value;

    // Check if the team is full before joining
    socket.emit('checkTeamStatus', { teamId }, (isFull) => {
      if (isFull) { // isFull true/false from socketHandler callback
        alert('Dette team er optaget. Vælg et andet team id.');
        startButton.disabled = false; // Re-enable the button
      } else { // Team is not full, proceed to join
        console.log(`Emitting joinTeam event with playerName=${playerName}, teamId=${teamId}`); // Log event data
        socket.emit('joinTeam', { playerName, teamId }); //to socketHadler

        // Add user feedback
        const feedbackElement = document.createElement('p');
        feedbackElement.id = 'feedbackMessage';
        feedbackElement.textContent = 'Venter på flere deltagere...';
        document.getElementById('viewContainer').appendChild(feedbackElement);
      }
    });
  });
}