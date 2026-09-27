(() => {
  const button = document.getElementById('clabe-copy');
  const value = document.getElementById('clabe-value');
  if (!button || !value) return;

  button.addEventListener('click', async () => {
    const text = value.textContent.trim();
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      const temp = document.createElement('textarea');
      temp.value = text;
      temp.style.position = 'fixed';
      temp.style.opacity = '0';
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
    }

    const original = button.textContent;
    button.textContent = 'Copiado';
    button.classList.add('copied');
    setTimeout(() => {
      button.textContent = original;
      button.classList.remove('copied');
    }, 1800);
  });
})();
