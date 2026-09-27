(() => {
  const audio = document.getElementById('bg-music');
  const toggle = document.getElementById('music-toggle');
  if (!audio || !toggle) return;

  const iconPlay = toggle.querySelector('.icon-play');
  const iconPause = toggle.querySelector('.icon-pause');
  let userPaused = false;

  audio.volume = 0.5;

  function setHidden(el, isHidden) {
    if (isHidden) {
      el.setAttribute('hidden', '');
    } else {
      el.removeAttribute('hidden');
    }
  }

  function setPlayingUI(isPlaying) {
    setHidden(iconPlay, isPlaying);
    setHidden(iconPause, !isPlaying);
    toggle.setAttribute('aria-pressed', String(isPlaying));
    toggle.setAttribute('aria-label', isPlaying ? 'Pausar música' : 'Reproducir música');
  }

  audio.addEventListener('play', () => setPlayingUI(true));
  audio.addEventListener('pause', () => setPlayingUI(false));

  function resumeOnInteraction(event) {
    if (userPaused || !audio.paused) return;
    if (event.target.closest('#music-toggle')) return;
    audio.play().catch(() => {});
  }

  audio.play().catch(() => {
    document.addEventListener('pointerdown', resumeOnInteraction, { once: true });
    document.addEventListener('keydown', resumeOnInteraction, { once: true });
  });

  toggle.addEventListener('click', () => {
    if (audio.paused) {
      userPaused = false;
      audio.play().catch(() => {});
    } else {
      userPaused = true;
      audio.pause();
    }
  });
})();
