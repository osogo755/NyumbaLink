// Sample facility locations — would come from the database later
const PEOPLE_FACILITIES = [
  { name: 'Kisii General Clinic', lat: -0.6820, lng: 34.7680, available: true },
  { name: 'Smile Dental Clinic', lat: -1.2921, lng: 36.7820, available: true },
  { name: 'ClearView Eye Clinic', lat: -1.2673, lng: 36.8065, available: true }
];

const ANIMAL_FACILITIES = [
  { name: 'Kisii Veterinary Clinic', lat: -0.6900, lng: 34.7720, available: true },
  { name: 'Nairobi Pet Care Vet', lat: -1.2750, lng: 36.7900, available: true },
  { name: 'Westlands Animal Hospital', lat: -1.2650, lng: 36.8030, available: true }
];

let currentSide = 'people';
let userLat = null;
let userLng = null;
let markers = [];
let routeControl = null;

const map = L.map('map').setView([-1.2864, 36.8172], 11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 19
}).addTo(map);

const redIcon = L.divIcon({ className: 'user-marker', iconSize: [16, 16] });

function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function drawSide(side) {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
  if (routeControl) { map.removeControl(routeControl); routeControl = null; }

  const list = side === 'people' ? PEOPLE_FACILITIES : ANIMAL_FACILITIES;
  const label = side === 'people' ? 'Nearest clinic' : 'Nearest vet clinic';
  document.getElementById('nearestLabel').textContent = label;

  list.forEach(f => {
    const marker = L.marker([f.lat, f.lng]).addTo(map)
      .bindPopup('<strong>' + f.name + '</strong>');
    markers.push(marker);
  });

  if (userLat !== null) {
    updateNearestAndRoute(list);
  }
}

function updateNearestAndRoute(list) {
  let nearest = null, nearestDist = Infinity;
  list.forEach(f => {
    const d = distanceKm(userLat, userLng, f.lat, f.lng);
    if (d < nearestDist) { nearestDist = d; nearest = f; }
  });

  if (!nearest) return;

  document.getElementById('nearestName').textContent = nearest.name;
  document.getElementById('nearestDist').textContent = nearestDist.toFixed(1) + ' km away';

  if (routeControl) map.removeControl(routeControl);

  routeControl = L.Routing.control({
    waypoints: [L.latLng(userLat, userLng), L.latLng(nearest.lat, nearest.lng)],
    lineOptions: { styles: [{ color: '#1F9E7C', weight: 5, opacity: 0.85 }] },
    addWaypoints: false,
    draggableWaypoints: false,
    fitSelectedRoutes: true,
    show: false,
    createMarker: () => null
  }).addTo(map);
}

document.querySelectorAll('.side-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.side-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentSide = btn.dataset.side;

    document.getElementById('peopleGrid').classList.toggle('hidden', currentSide !== 'people');
    document.getElementById('animalGrid').classList.toggle('hidden', currentSide !== 'animals');

    drawSide(currentSide);
  });
});

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userLat = pos.coords.latitude;
      userLng = pos.coords.longitude;
      map.setView([userLat, userLng], 12);
      L.marker([userLat, userLng], { icon: redIcon }).addTo(map).bindPopup('You are here').openPopup();
      drawSide(currentSide);
    },
    () => {
      document.getElementById('nearestName').textContent = 'Location unavailable';
      document.getElementById('nearestDist').textContent = 'Enable location access to see distance';
      drawSide(currentSide);
    }
  );
} else {
  drawSide(currentSide);
}
