import { socket } from './client.js';
import { playAudio, pauseAudio, fadeOutAudio, fadeOutAudioAndPlay } from './AV/audioManager.js';


export function init() {
  /*const audio = new Audio('../audio/title.mp3');
  audio.loop = true;
  audio.play();*/

  const startButton = document.getElementById('startButton');
  //fadeOutAudio(1000); // Fade out any currently playing audio
  //fadeOutAudioAndPlay('critter', 5000);
  //playAudio('critter'); // Play the critter audio

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