// Generic map + nearest-distance logic for any NyumbaLink category page (Courts, Rentals, Bedsitters).
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

  const redIcon = L.divIcon({ className: 'user-marker', iconSize: [18, 18] });
  let userMarker = null;
  let accuracyCircle = null;

  listings.forEach(item => {
    const statusHtml = item.available
      ? '<span style="color:#0F5A46; font-weight:700;">✓ Vacant unit available</span>'
      : '<span style="color:#c53030;">Fully booked</span>';
    L.marker([item.lat, item.lng]).addTo(map)
      .bindPopup(`<strong>${item.name}</strong><br>${statusHtml}<br><a href="listing.html" style="color:#4A3F8C; font-weight:600; text-decoration:underline;">View Details &rarr;</a>`);
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

  window.triggerLocateUser = function () {
    const btn = document.getElementById('locateMeBtn');
    if (btn) btn.innerHTML = '<span>Locating your GPS...</span>';

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLat = pos.coords.latitude, userLng = pos.coords.longitude;
          map.setView([userLat, userLng], 12);
          
          if (userMarker) map.removeLayer(userMarker);
          if (accuracyCircle) map.removeLayer(accuracyCircle);

          userMarker = L.marker([userLat, userLng], { icon: redIcon }).addTo(map).bindPopup('<strong>You are here</strong><br>Showing vacant houses around you').openPopup();
          accuracyCircle = L.circle([userLat, userLng], { radius: pos.coords.accuracy || 300, color: '#E24B4A', fillOpacity: 0.1 }).addTo(map);

          updateNearest(userLat, userLng);
          if (btn) {
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/></svg><span>Position Located (Vacant Ranked)</span>';
          }
        },
        () => {
          const nameEl = document.getElementById('nearestName');
          const distEl = document.getElementById('nearestDist');
          if (nameEl) nameEl.textContent = 'Location estimated';
          if (distEl) distEl.textContent = 'Showing vacant houses in Nairobi area';
          updateNearest(defaultCenter[0], defaultCenter[1]);
          if (btn) {
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/></svg><span>Location Set (Nearest Ranked)</span>';
          }
        }
      );
    } else {
      updateNearest(defaultCenter[0], defaultCenter[1]);
    }
  };

  // Run on start
  window.triggerLocateUser();
})();
