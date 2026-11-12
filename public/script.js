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

    // English & Swahili keyword routing
    if (query.includes('bedsitter') || query.includes('sitter') || (query.includes('single') && !query.includes('family'))) {
      window.location.href = 'bedsitters.html';
    } else if (query.includes('house') || query.includes('nyumba') || query.includes('rent') || query.includes('panga') || query.includes('maisonette') || query.includes('bungalow') || query.includes('compound') || query.includes('standalone') || query.includes('rentals')) {
      window.location.href = 'rentals.html';
    } else if (query.includes('court') || query.includes('koti') || query.includes('courtyard') || query.includes('amani') || query.includes('buruburu') || query.includes('stella')) {
      window.location.href = 'courts.html';
    } else {
      window.location.href = 'apartments.html';
    }
  });
});

// Dynamically synchronize registered approved houses from SynchroService into homepage listing grid
(function syncHomepageListings() {
  if (!window.SynchroService) return;
  const grid = document.querySelector('.listing-grid');
  if (!grid) return;

  const approved = window.SynchroService.getApprovedProperties();
  if (!approved || !approved.length) return;

  grid.innerHTML = approved.map(p => {
    const isVacant = p.vacantCount > 0;
    const availText = isVacant ? (p.vacantCount + ' vacant') : 'Occupied';
    const catLabel = p.category ? (p.category.charAt(0).toUpperCase() + p.category.slice(1)) : 'Rental';
    
    return `
      <a href="listing.html?prop=${p.id}" class="listing-card">
        <div class="listing-media">
          <img src="${p.imageUrl}" alt="${p.name}">
          <span class="badge-avail">${availText}</span>
        </div>
        <div class="listing-body">
          <p class="listing-kind">${catLabel} · <span style="font-family:var(--font-mono); font-size:0.7rem;">${p.id}</span></p>
          <h3 class="listing-name">${p.name}</h3>
          <p class="listing-loc"><i class="icon-pin" aria-hidden="true"></i> ${p.location}</p>
          <p class="listing-price">from <span>KSh ${p.priceKES.toLocaleString()}</span><small>/month</small></p>
        </div>
      </a>
    `;
  }).join('');
})();

