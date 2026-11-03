const gallery = document.querySelector('.image-gallery');
const toggle = gallery?.querySelector('.motion-toggle');

if (gallery && toggle) {
  toggle.addEventListener('click', () => {
    const paused = gallery.classList.toggle('is-paused');
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = paused ? 'Play images' : 'Pause images';
  });
}
