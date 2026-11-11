// Simple, dependency-free line icons for each business category tile.
const ICONS = {
  hardware: '<path d="M6 21l6-6m0 0l7-7a2.5 2.5 0 00-3.5-3.5l-7 7m3.5 3.5L8.5 21H5v-3.5L12 11" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  furniture: '<path d="M4 12h16M5 12v6M19 12v6M4 12V8a2 2 0 012-2h12a2 2 0 012 2v4M6 18h12" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  groceries: '<path d="M4 6h2l2 11h10l2-8H7M9 21a1 1 0 100-2 1 1 0 000 2zM16 21a1 1 0 100-2 1 1 0 000 2z" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  jewellery: '<path d="M6 8l6-5 6 5-6 13-6-13zM6 8h12M9 8l3 13M15 8l-3 13" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  wine: '<path d="M8 3h8l-1 7a3 3 0 01-6 0L8 3zM12 13v6M9 21h6" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  perfume: '<path d="M10 2h4v3h-4zM9 5h6l1 3H8zM8 8h8v12a1 1 0 01-1 1H9a1 1 0 01-1-1V8z" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  carparts: '<circle cx="12" cy="12" r="3" fill="none" stroke-width="1.6"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2 2M16.4 16.4l2 2M5.6 18.4l2-2M16.4 7.6l2-2" fill="none" stroke-width="1.6" stroke-linecap="round"/>',
  mutumba: '<path d="M8 4l4-1 4 1 2 4-3 2v11H9V10L6 8z" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  phonerepair: '<rect x="7" y="2" width="10" height="20" rx="2" fill="none" stroke-width="1.6"/><path d="M12 17h.01M9 9l2 2-2 2h6" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  electronics: '<rect x="3" y="5" width="18" height="12" rx="1.5" fill="none" stroke-width="1.6"/><path d="M8 21h8M12 17v4" fill="none" stroke-width="1.6" stroke-linecap="round"/>',
  cross: '<path d="M12 3v18M3 12h18" fill="none" stroke-width="2.4" stroke-linecap="round"/>',
  paw: '<circle cx="12" cy="15" r="4.2" fill="none" stroke-width="1.7"/><circle cx="6" cy="9" r="2" fill="none" stroke-width="1.6"/><circle cx="11" cy="6" r="2" fill="none" stroke-width="1.6"/><circle cx="16.5" cy="6.5" r="2" fill="none" stroke-width="1.6"/><circle cx="19.5" cy="10.5" r="2" fill="none" stroke-width="1.6"/>'
};

document.querySelectorAll('[data-icon]').forEach(el => {
  const key = el.dataset.icon;
  const path = ICONS[key] || '';
  el.outerHTML = `<svg viewBox="0 0 24 24" fill="none">${path}</svg>`;
});
