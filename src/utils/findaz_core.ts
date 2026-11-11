/**
 * Core pure logic for NyumbaLink Rentals marketplace
 */

export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatKES(amount: number): string {
  return 'KSh ' + amount.toLocaleString();
}

export function getRentalCategoryTarget(query: string): string {
  const q = query.trim().toLowerCase();
  if (q.includes('bedsitter') || q.includes('sitter')) {
    return 'bedsitters.html';
  } else if (q.includes('house') || q.includes('maisonette') || q.includes('bungalow') || q.includes('compound') || q.includes('standalone') || q.includes('rentals')) {
    return 'rentals.html';
  } else if (q.includes('court') || q.includes('courtyard')) {
    return 'courts.html';
  }
  return 'apartments.html';
}
