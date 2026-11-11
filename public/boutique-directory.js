// Boutique-directory extras: search filter, a routed green line to the
// nearest open boutique, and a proximity notification when you're close
// to any registered boutique.
//
// Notes on real-world limits:
// - Routing uses OSRM's public demo server (router.project-osrm.org).
//   It's free and fine for testing, but it's rate-limited and not meant
//   for production traffic — a real launch should run its own OSRM/
//   Mapbox/Google Directions instance.
// - Proximity alerts only fire while this browser tab is open. Real
//   background "you're near a boutique" push notifications need a
//   mobile app, not a website — browsers can't reliably wake a website
//   in the background.

// ---------- Search filter ----------
const searchInput = document.getElementById('boutiqueSearch');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    document.querySelectorAll('.cat-card').forEach(card => {
      const name = card.dataset.name.toLowerCase();
      card.style.display = name.includes(query) ? '' : 'none';
    });
  });
}

// ---------- Routed green line + proximity alerts ----------
// map-listing.js calls this once it has the map and the user's real
// location, so routing/proximity share the same map instead of
// duplicating geolocation logic.
const notifiedShops = new Set();

window.FINDAZ_ON_LOCATED = function (map, userLat, userLng, listings) {

  // Green route line to the nearest open boutique
  const open = listings.filter(l => l.available);
  if (open.length && window.L && L.Routing) {
    let nearest = open[0];
    let nearestDist = Infinity;
    open.forEach(shop => {
      const d = Math.hypot(shop.lat - userLat, shop.lng - userLng);
      if (d < nearestDist) { nearestDist = d; nearest = shop; }
    });

    L.Routing.control({
      waypoints: [
        L.latLng(userLat, userLng),
        L.latLng(nearest.lat, nearest.lng)
      ],
      lineOptions: {
        styles: [{ color: '#1F9E7C', weight: 5, opacity: 0.85 }]
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
      createMarker: function (i, wp) {
        if (i === 1) {
          return L.marker(wp.latLng).bindPopup('<strong>' + nearest.name + '</strong><br>Route from your location');
        }
        return null;
      }
    }).addTo(map);
  }

  // Proximity notification — checks distance every time the browser
  // reports a position update, not just once on load.
  if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission !== 'granted') return;

      navigator.geolocation.watchPosition((pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        listings.forEach(shop => {
          const distKm = haversine(lat, lng, shop.lat, shop.lng);
          if (distKm < 0.3 && !notifiedShops.has(shop.name)) {
            notifiedShops.add(shop.name);
            new Notification('NyumbaLink', {
              body: 'You are near ' + shop.name + ' — ' + Math.round(distKm * 1000) + 'm away.'
            });
          }
        });
      });
    });
  }
};

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
