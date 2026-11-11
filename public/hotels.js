// Sample hotel locations (Nairobi + Kisii) — will come from the database later
const hotels = [
  { name: 'Baraza Hotel & Suites', lat: -1.2647, lng: 36.8027, open: true },
  { name: 'Savanna Grand Hotel', lat: -1.2989, lng: 36.8100, open: true },
  { name: "Kisii Lodge & Suites", lat: -0.6773, lng: 34.7796, open: true },
  { name: 'The Waterfront Hotel', lat: -1.3197, lng: 36.8510, open: false }
];

const map = L.map('map').setView([-1.2864, 36.8172], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 19
}).addTo(map);

const redIcon = L.divIcon({ className: 'user-marker', iconSize: [16, 16] });

hotels.forEach(h => {
  L.marker([h.lat, h.lng]).addTo(map)
    .bindPopup('<strong>' + h.name + '</strong><br>' + (h.open ? 'Rooms available' : 'Fully booked'));
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
  const openOnly = hotels.filter(h => h.open);
  let nearest = null, nearestDist = Infinity;

  openOnly.forEach(h => {
    const d = distanceKm(userLat, userLng, h.lat, h.lng);
    if (d < nearestDist) { nearestDist = d; nearest = h; }
  });

  if (nearest) {
    document.getElementById('nearestName').textContent = nearest.name;
    document.getElementById('nearestDist').textContent = nearestDist.toFixed(1) + ' km away';
  }
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const userLat = pos.coords.latitude, userLng = pos.coords.longitude;
      map.setView([userLat, userLng], 12);
      L.marker([userLat, userLng], { icon: redIcon }).addTo(map).bindPopup('You are here').openPopup();
      updateNearest(userLat, userLng);
    },
    () => {
      document.getElementById('nearestName').textContent = 'Location unavailable';
      document.getElementById('nearestDist').textContent = 'Enable location access to see distance';
      updateNearest(-1.2864, 36.8172);
    }
  );
} else {
  updateNearest(-1.2864, 36.8172);
}
