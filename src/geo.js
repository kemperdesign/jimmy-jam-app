// Small geo helpers shared by the venue map and admin pin editor.

const R = 6371000; // Earth radius in meters

export function toRad(deg) {
  return (deg * Math.PI) / 180;
}

export function toDeg(rad) {
  return (rad * 180) / Math.PI;
}

// Great-circle distance in meters.
export function distanceMeters(a, b) {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(h));
}

// Initial compass bearing (0-360, 0 = north) from a to b.
export function bearingDegrees(a, b) {
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const dLng = toRad(b.lng - a.lng);

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export function formatDistance(meters) {
  const feet = meters * 3.28084;
  if (feet < 1000) return `${Math.round(feet)} ft`;
  const miles = meters / 1609.34;
  return `${miles.toFixed(2)} mi`;
}

export const PIN_CATEGORIES = [
  { id: 'parking', label: 'Parking', icon: '🅿️', color: '#2563eb' },
  { id: 'restroom', label: 'Restroom', icon: '🚻', color: '#7c3aed' },
  { id: 'table', label: 'Event Table', icon: '🍖', color: '#dc2626' },
  { id: 'vendor', label: 'Vendor', icon: '🛍️', color: '#ea580c' },
  { id: 'attraction', label: 'Attraction', icon: '🎪', color: '#16a34a' },
  { id: 'other', label: 'Other', icon: '📍', color: '#64748b' }
];

export function categoryMeta(categoryId) {
  return PIN_CATEGORIES.find(c => c.id === categoryId) || PIN_CATEGORIES[PIN_CATEGORIES.length - 1];
}
