// Audio manager that can play, pause, and fade out any audio file by name
let currentAudio = null;

export function playAudio(name) {
  // Pause and reset previous audio if playing
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  currentAudio = new Audio(`../audio/${name}.mp3`);
  currentAudio.loop = true;
  currentAudio.play();
}

export function pauseAudio() {
  if (currentAudio) {
    currentAudio.pause();
  }
}

export function fadeOutAudio(duration = 1000) {
  if (!currentAudio) return;
  const step = 0.05;
  let vol = currentAudio.volume;
  const interval = setInterval(() => {
    vol = Math.max(0, vol - step);
    currentAudio.volume = vol;
    if (vol === 0) {
      currentAudio.pause();
      clearInterval(interval);
      currentAudio.volume = 1; // reset for next play
    }
  }, duration * step);
}

export function fadeOutAudioAndPlay(name, duration = 1000) {
  if (!currentAudio) {
    // If no audio is playing, just play the new audio after a silent wait
    setTimeout(() => {
      playAudio(name);
    }, duration);
    return;
  }
  const step = 0.05;
  let vol = currentAudio.volume;
  const fadeInterval = setInterval(() => {
    vol = Math.max(0, vol - step);
    currentAudio.volume = vol;
    if (vol === 0) {
      currentAudio.pause();
      clearInterval(fadeInterval);
      currentAudio.volume = 1; // reset for next play
      // Wait for the silent duration, then play the new audio
      setTimeout(() => {
        playAudio(name);
      }, duration);
    }
  }, duration * step);
}