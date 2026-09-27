(() => {
  const audio = document.getElementById('bg-music');
  const toggle = document.getElementById('music-toggle');
  if (!audio || !toggle) return;

  const iconPlay = toggle.querySelector('.icon-play');
  const iconPause = toggle.querySelector('.icon-pause');
  let userPaused = false;

  function setPlayingUI(isPlaying) {
    iconPlay.hidden = isPlaying;
    iconPause.hidden = !isPlaying;
    toggle.setAttribute('aria-pressed', String(isPlaying));
    toggle.setAttribute('aria-label', isPlaying ? 'Pausar música' : 'Reproducir música');
  }

  function tryAutoplay() {
    audio.volume = 0.5;
    audio.play()
      .then(() => setPlayingUI(true))
      .catch(() => {
        setPlayingUI(false);
        document.addEventListener('pointerdown', resumeOnInteraction, { once: true });
        document.addEventListener('keydown', resumeOnInteraction, { once: true });
      });
  }

  function resumeOnInteraction() {
    if (userPaused) return;
    audio.play().then(() => setPlayingUI(true)).catch(() => {});
  }

  toggle.addEventListener('click', () => {
    if (audio.paused) {
      userPaused = false;
      audio.play().then(() => setPlayingUI(true)).catch(() => {});
    } else {
      userPaused = true;
      audio.pause();
      setPlayingUI(false);
    }
  });

  tryAutoplay();
})();
