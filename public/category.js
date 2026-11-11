// Apartments Map & Geolocation Engine with Real-time Distance Ranking
const defaultApartments = [
  { name: 'Marigold Court', lat: -1.2921, lng: 36.7820, vacant: true, price: 12000, id: 'PROP-NAI-001' },
  { name: 'Baraza Apartments', lat: -1.2673, lng: 36.8065, vacant: true, price: 15500, id: 'PROP-NAI-002' },
  { name: 'Neema Heights', lat: -1.3121, lng: 36.8280, vacant: true, price: 10800, id: 'PROP-NAI-003' },
  { name: 'Cedar Court', lat: -1.2833, lng: 36.7667, vacant: false, price: 18000, id: 'PROP-NAI-004' }
];

let apartments = [...defaultApartments];

// Incorporate any live approved apartments from SynchroService
if (window.SynchroService) {
  const approved = window.SynchroService.getApprovedProperties('apartments');
  if (approved && approved.length) {
    approved.forEach((ap, idx) => {
      if (!apartments.find(a => a.name === ap.name)) {
        apartments.push({
          name: ap.name,
          lat: -1.2900 + (idx * 0.015),
          lng: 36.7900 + (idx * 0.012),
          vacant: ap.vacantCount > 0,
          price: ap.priceKES,
          id: ap.id
        });
      }
    });
  }
}

const map = L.map('map').setView([-1.2864, 36.8172], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 19
}).addTo(map);

const redIcon = L.divIcon({
  className: 'user-marker',
  iconSize: [18, 18]
});

let userMarker = null;
let accuracyCircle = null;

// Plot apartments on map with distinct vacancy badges
apartments.forEach(apt => {
  const marker = L.marker([apt.lat, apt.lng]).addTo(map);
  const statusHtml = apt.vacant
    ? '<span style="color:#0F5A46; font-weight:700;">✓ Vacant units available</span>'
    : '<span style="color:#c53030;">Fully occupied</span>';
  marker.bindPopup(
    `<strong>${apt.name}</strong><br>` +
    `<span style="font-size:0.8rem; color:#666;">${apt.id}</span><br>` +
    `${statusHtml}<br>` +
    `<strong>from KSh ${apt.price.toLocaleString()}/mo</strong><br>` +
    `<a href="listing.html" style="color:#4A3F8C; font-weight:600; text-decoration:underline;">View Details &amp; Apply &rarr;</a>`
  );
});

// Haversine distance in km
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
  const vacantOnly = apartments.filter(a => a.vacant);
  let nearest = null;
  let nearestDist = Infinity;

  vacantOnly.forEach(apt => {
    const d = distanceKm(userLat, userLng, apt.lat, apt.lng);
    if (d < nearestDist) {
      nearestDist = d;
      nearest = apt;
    }
  });

  const nameEl = document.getElementById('nearestName');
  const distEl = document.getElementById('nearestDist');

  if (nearest && nameEl && distEl) {
    nameEl.textContent = nearest.name;
    distEl.textContent = nearestDist.toFixed(1) + ' km away';
  }
}

// Function to locate user and center map around vacant houses
window.triggerLocateUser = function () {
  const btn = document.getElementById('locateMeBtn');
  if (btn) btn.innerHTML = '<span>Locating your GPS...</span>';

  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser. Centered at Nairobi default.');
    if (btn) btn.innerHTML = '<span>Find Vacant Houses Near Me</span>';
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const userLat = pos.coords.latitude;
      const userLng = pos.coords.longitude;

      map.setView([userLat, userLng], 13);

      if (userMarker) map.removeLayer(userMarker);
      if (accuracyCircle) map.removeLayer(accuracyCircle);

      userMarker = L.marker([userLat, userLng], { icon: redIcon })
        .addTo(map)
        .bindPopup('<strong>You are here</strong><br>Locating vacant houses around you...')
        .openPopup();

      accuracyCircle = L.circle([userLat, userLng], {
        radius: pos.coords.accuracy || 250,
        color: '#E24B4A',
        fillColor: '#E24B4A',
        fillOpacity: 0.1,
        weight: 1
      }).addTo(map);

      updateNearest(userLat, userLng);
      if (btn) {
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/></svg><span>Position Located (Vacant Ranked)</span>';
      }
    },
    (err) => {
      const fallbackLat = -1.2921;
      const fallbackLng = 36.7820;
      map.setView([fallbackLat, fallbackLng], 13);
      
      if (!userMarker) {
        userMarker = L.marker([fallbackLat, fallbackLng], { icon: redIcon })
          .addTo(map)
          .bindPopup('<strong>Estimated Position (Nairobi)</strong><br>Showing nearest vacant houses')
          .openPopup();
      }
      updateNearest(fallbackLat, fallbackLng);

      if (btn) {
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/></svg><span>Location Set (Nearest Ranked)</span>';
      }
    },
    { enableHighAccuracy: true, timeout: 8000 }
  );
};

// Initial run
window.triggerLocateUser();

// Render only approved properties from SynchroService
(function syncApprovedProperties() {
  if (!window.SynchroService) return;
  const container = document.getElementById('apartmentsListContainer');
  if (!container) return;

  const approved = window.SynchroService.getApprovedProperties('apartments');
  if (approved && approved.length) {
    container.innerHTML = approved.map(function(p) {
      const vacantText = p.vacantCount > 0 ? (p.vacantCount + ' vacant') : 'Occupied';
      return '<a href="listing.html" class="cat-card">' +
        '<div class="cat-media">' +
          '<img src="' + p.imageUrl + '" alt="' + p.name + '">' +
          '<span class="badge-avail">' + vacantText + '</span>' +
        '</div>' +
        '<div class="cat-body">' +
          '<p class="cat-kind">Apartment · <span style="font-family:var(--font-mono); font-size:0.7rem;">' + p.id + '</span></p>' +
          '<h3 class="cat-name">' + p.name + '</h3>' +
          '<p class="cat-loc"><i class="icon-pin" aria-hidden="true"></i> ' + p.location + '</p>' +
          '<p class="cat-price">from <span>KSh ' + p.priceKES.toLocaleString() + '</span><small>/month</small></p>' +
        '</div>' +
      '</a>';
    }).join('');
  }
})();
