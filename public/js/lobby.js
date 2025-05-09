import { socket } from './client.js';

export function init() { // Initialize the lobby view from client.js
  const startButton = document.getElementById('startButton');
  startButton.addEventListener('click', () => {
    console.log('Start button clicked'); // Log start button click
    startButton.disabled = true; // Disable the button to prevent multiple clicks
    const playerName = document.getElementById('playerName').value;
    const teamId = document.getElementById('teamId').value;

    // Check if the team is full before joining
    // Emit checkTeamStatus (socketHandler) event to server
    /*socket.emit('checkTeamStatus', { teamId }, (isFull) => {
      if (isFull) { // isFull true/false from socketHandler callback
        alert('Dette team er optaget. Vælg et andet team id.');
        startButton.disabled = false; // Re-enable the button
      } else {
        console.log(`Emitting joinTeam event with playerName=${playerName}, teamId=${teamId}`); // Log event data
        // Emit joinTeam (socketHandler) event to server
        */
        socket.emit('joinTeam', { playerName, teamId }, (response) => {
          if (response.status === 'ok') {
            console.log('Du er tilmeldt holdet!');
          } else {
            alert('Fejl: ' + response.message);
          }
        });

        // Add user feedback
        const feedbackElement = document.createElement('p');
        feedbackElement.id = 'feedbackMessage';
        feedbackElement.textContent = 'Venter på flere deltagere...';
        document.getElementById('viewContainer').appendChild(feedbackElement);
      }
    );
  }