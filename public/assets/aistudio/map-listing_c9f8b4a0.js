// Generic map + nearest-distance logic for any NyumbaLink category page.
// Each page sets window.FINDAZ_LISTINGS = [{name, lat, lng, available}, ...]
// and window.FINDAZ_NEAREST_LABEL = "Nearest vacant court" (etc) before
// including this script.

(function () {
  const listings = window.FINDAZ_LISTINGS || [];
  const nearestLabel = window.FINDAZ_NEAREST_LABEL || 'Nearest available';
  const defaultCenter = window.FINDAZ_MAP_CENTER || [-1.2864, 36.8172];

  const labelEl = document.querySelector('.map-overlay-label');
  if (labelEl) labelEl.textContent = nearestLabel;

  const map = L.map('map').setView(defaultCenter, 11);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);

  const redIcon = L.divIcon({ className: 'user-marker', iconSize: [16, 16] });

  listings.forEach(item => {
    L.marker([item.lat, item.lng]).addTo(map)
      .bindPopup('<strong>' + item.name + '</strong><br>' + (item.available ? 'Available now' : 'Fully booked'));
  });

  function distanceKm(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function updateNearest(userLat, userLng) {
    const availableOnly = listings.filter(l => l.available);
    let nearest = null, nearestDist = Infinity;

    availableOnly.forEach(item => {
      const d = distanceKm(userLat, userLng, item.lat, item.lng);
      if (d < nearestDist) { nearestDist = d; nearest = item; }
    });

    const nameEl = document.getElementById('nearestName');
    const distEl = document.getElementById('nearestDist');
    if (nearest && nameEl && distEl) {
      nameEl.textContent = nearest.name;
      distEl.textContent = nearestDist.toFixed(1) + ' km away';
    }
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude, userLng = pos.coords.longitude;
        map.setView([userLat, userLng], 12);
        L.marker([userLat, userLng], { icon: redIcon }).addTo(map).bindPopup('You are here').openPopup();
        updateNearest(userLat, userLng);
        if (typeof window.FINDAZ_ON_LOCATED === 'function') {
          window.FINDAZ_ON_LOCATED(map, userLat, userLng, listings);
        }
      },
      () => {
        const nameEl = document.getElementById('nearestName');
        const distEl = document.getElementById('nearestDist');
        if (nameEl) nameEl.textContent = 'Location unavailable';
        if (distEl) distEl.textContent = 'Enable location access to see distance';
        updateNearest(defaultCenter[0], defaultCenter[1]);
      }
    );
  } else {
    updateNearest(defaultCenter[0], defaultCenter[1]);
  }
})();
