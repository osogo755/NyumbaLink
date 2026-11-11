// Liquid ripple effect on category tabs, then navigate (or notify if not built yet)
document.querySelectorAll('.tab.fx-liquid').forEach(tab => {
  tab.addEventListener('click', (e) => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const rect = tab.getBoundingClientRect();
    const ring = document.createElement('span');
    ring.className = 'ring';

    const size = Math.max(rect.width, rect.height) * 1.8;
    ring.style.width = size + 'px';
    ring.style.height = size + 'px';
    ring.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ring.style.top = (e.clientY - rect.top - size / 2) + 'px';

    tab.appendChild(ring);
    ring.addEventListener('animationend', () => ring.remove());

    const href = tab.dataset.href;
    if (href) {
      setTimeout(() => { window.location.href = href; }, 250);
    } else {
      setTimeout(() => { comingSoon(); }, 250);
    }
  });
});

// Shown when a category page hasn't been built yet
function comingSoon(e) {
  if (e) e.preventDefault();
  let toast = document.getElementById('comingSoonToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'comingSoonToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = 'This category page is being built next.';
  toast.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  return false;
}

// Duplicate marquee content so the right-to-left scroll loops seamlessly
const track = document.getElementById('marqueeTrack');
if (track) {
  track.innerHTML += track.innerHTML;
}
