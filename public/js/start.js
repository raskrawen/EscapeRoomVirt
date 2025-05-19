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
    // Call this when you want the bug to crawl (e.g., after audio starts)
  //  animateBug();

  });

  continueBtn.addEventListener('click', () => {
      loadTask('lobby'); // Just transition to the lobby view on the client
    
});
}