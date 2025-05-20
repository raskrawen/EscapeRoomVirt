import { loadTask } from './client.js';
import { playAudio, pauseAudio, fadeOutAudio } from './AV/audioManager.js';
//import { animateBug } from './AV/bugAnimation.js';


export function init() {
  const audio = new Audio('../audio/title.mp3'); // Place your story audio here
  const playBtn = document.getElementById('playStoryButton');
  const continueBtn = document.getElementById('continueButton');
  const info = document.getElementById('storyInfo');

  playBtn.addEventListener('click', () => {
    audio.loop = true; // Loop the audio
    playAudio('intro_music'); // Play the audio
    info.innerHTML = "Historien afspilles. Du kan nu fortsætte.";
    continueBtn.disabled = false;
    playBtn.disabled = true;
    //indlæs en .txt fil med historien og vis i id=storyInfo
    fetch('../js/story.txt')
      .then(response => response.text())
      .then(data => {
        info.innerHTML = data; // Display the story text
      })
      .catch(error => {
        console.error('Error loading story:', error);
        info.innerHTML = "Fejl ved indlæsning af historien.";
      });
  });

  continueBtn.addEventListener('click', () => {
      loadTask('lobby'); // Just transition to the lobby view on the client
    
});
}