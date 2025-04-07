const sfxCache = {};

export const playSFX = (soundUrl) => {
  // Reuse existing audio if it exists
  if (!sfxCache[soundUrl]) {
    sfxCache[soundUrl] = new Audio(soundUrl);
    sfxCache[soundUrl].volume = parseFloat(localStorage.getItem('uiVolume')) || 0.5;
  }

  const audio = sfxCache[soundUrl];
  const volume = parseFloat(localStorage.getItem('uiVolume')) || 0.5;
  audio.volume = volume;
  audio.currentTime = 0; // rewind to start
  setTimeout(() => {
    audio.play().catch((e) => {
      console.warn("SFX failed to play:", e.message);
    });
  }, 0);
};
