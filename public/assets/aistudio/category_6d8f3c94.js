// Sample apartment locations (Nairobi) — will come from the database later
const apartments = [
  { name: 'Marigold Court', lat: -1.2921, lng: 36.7820, vacant: true },
  { name: 'Baraza Apartments', lat: -1.2673, lng: 36.8065, vacant: true },
  { name: 'Neema Heights', lat: -1.3121, lng: 36.8280, vacant: true },
  { name: 'Cedar Court', lat: -1.2833, lng: 36.7667, vacant: false }
];

// Default map center (Nairobi CBD) until we know the user's real location
const map = L.map('map').setView([-1.2864, 36.8172], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 19
}).addTo(map);

const redIcon = L.divIcon({
  className: 'user-marker',
  iconSize: [16, 16]
});

apartments.forEach(apt => {
  const marker = L.marker([apt.lat, apt.lng]).addTo(map);
  marker.bindPopup('<strong>' + apt.name + '</strong><br>' + (apt.vacant ? 'Vacant rooms available' : 'Fully booked'));
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

  if (nearest) {
    document.getElementById('nearestName').textContent = nearest.name;
    document.getElementById('nearestDist').textContent = nearestDist.toFixed(1) + ' km away';
  }
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const userLat = pos.coords.latitude;
      const userLng = pos.coords.longitude;

      map.setView([userLat, userLng], 13);

      L.marker([userLat, userLng], { icon: redIcon })
        .addTo(map)
        .bindPopup('You are here')
        .openPopup();

      updateNearest(userLat, userLng);
    },
    () => {
      document.getElementById('nearestName').textContent = 'Location unavailable';
      document.getElementById('nearestDist').textContent = 'Enable location access to see distance';
      updateNearest(-1.2864, 36.8172);
    }
  );
} else {
  document.getElementById('nearestName').textContent = 'Location not supported';
  updateNearest(-1.2864, 36.8172);
}
