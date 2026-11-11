// Liquid ripple effect on category tabs, then navigate
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
    }
  });
});

// Duplicate marquee content so the right-to-left scroll loops seamlessly
const track = document.getElementById('marqueeTrack');
if (track) {
  track.innerHTML += track.innerHTML;
}

// Global header search functionality focused on residential rentals
document.querySelectorAll('form.search-bar').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    if (!input) return;
    const query = input.value.trim().toLowerCase();
    if (!query) return;

    if (query.includes('bedsitter') || query.includes('sitter')) {
      window.location.href = 'bedsitters.html';
    } else if (query.includes('house') || query.includes('maisonette') || query.includes('bungalow') || query.includes('compound') || query.includes('standalone') || query.includes('rentals')) {
      window.location.href = 'rentals.html';
    } else if (query.includes('court') || query.includes('amani') || query.includes('buruburu') || query.includes('stella')) {
      window.location.href = 'courts.html';
    } else {
      window.location.href = 'apartments.html';
    }
  });
});
