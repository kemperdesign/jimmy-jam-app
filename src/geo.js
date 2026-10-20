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
  if (!a || !b) return 0;
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
  if (!a || !b) return 0;
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
  if (meters == null || isNaN(meters)) return '--';
  const feet = meters * 3.28084;
  if (feet < 1000) return `${Math.round(feet)} ft`;
  const miles = meters / 1609.34;
  return `${miles.toFixed(2)} mi`;
}

// Format meters and minutes walk time in Proximi.io style (e.g. "196 m / 2 minutes")
export function formatDistanceAndWalk(meters) {
  if (meters == null || isNaN(meters)) return 'Nearby';
  const walkMins = Math.max(1, Math.round(meters / 80)); // ~80m/min walking pace
  const metersRounded = Math.round(meters);
  return `${metersRounded} m / ${walkMins} minute${walkMins > 1 ? 's' : ''}`;
}

export const PIN_CATEGORIES = [
  { id: 'stage', label: 'Main Stage', icon: '🎸', color: '#7C3AED', badgeBg: 'bg-purple-100 text-purple-700' },
  { id: 'food', label: 'BBQ & Food', icon: '🍖', color: '#DC2626', badgeBg: 'bg-red-100 text-red-700' },
  { id: 'bourbon', label: 'Bourbon VIP', icon: '🥃', color: '#D97706', badgeBg: 'bg-amber-100 text-amber-700' },
  { id: 'attraction', label: 'Attractions', icon: '🎪', color: '#10B981', badgeBg: 'bg-emerald-100 text-emerald-700' },
  { id: 'parking', label: 'Parking', icon: '🅿️', color: '#2563EB', badgeBg: 'bg-blue-100 text-blue-700' },
  { id: 'restroom', label: 'Restrooms', icon: '🚻', color: '#8B5CF6', badgeBg: 'bg-indigo-100 text-indigo-700' },
  { id: 'vendor', label: 'Vendors & Swag', icon: '🛍️', color: '#EA580C', badgeBg: 'bg-orange-100 text-orange-700' },
  { id: 'entrance', label: 'Gate / Will-Call', icon: '🎟️', color: '#059669', badgeBg: 'bg-teal-100 text-teal-700' },
  { id: 'table', label: 'Event Table', icon: '🍖', color: '#DC2626', badgeBg: 'bg-rose-100 text-rose-700' },
  { id: 'other', label: 'Other', icon: '📍', color: '#64748B', badgeBg: 'bg-slate-100 text-slate-700' }
];

export function categoryMeta(categoryId) {
  const found = PIN_CATEGORIES.find(c => c.id === categoryId);
  if (found) return found;
  // Fallbacks for older categories
  if (categoryId === 'attractions') return PIN_CATEGORIES.find(c => c.id === 'attraction');
  return PIN_CATEGORIES[PIN_CATEGORIES.length - 1];
}

// GPS bounds for /map.png (the venue's aerial site-map graphic)
export const SITE_MAP_BOUNDS = [
  [29.77000561922684, -81.45395537354639], // south-west
  [29.7719895440666, -81.45288660024333]   // north-east
];

// Venue entrance coordinates (Tringali Barn Gate A)
export const VENUE_ENTRANCE = {
  lat: 29.77280,
  lng: -81.45270
};

// Key pedestrian spine points along Tringali Barn property to build realistic orthogonal wayfinding routes
export const VENUE_WALKWAY_SPINE = [
  { lat: 29.77280, lng: -81.45270 }, // North Gate / Entrance
  { lat: 29.77220, lng: -81.45250 }, // Registration Pavilion
  { lat: 29.77150, lng: -81.45245 }, // Barn Courtyard
  { lat: 29.77090, lng: -81.45240 }, // Central Festival Lawn
  { lat: 29.77020, lng: -81.45235 }, // South Lawn Crossing
  { lat: 29.76980, lng: -81.45230 }  // Extreme Arena / Car Show Access
];

// Generate a realistic Proximi.io style wayfinding path between start and end
export function getWayfindingRoute(start, end) {
  if (!start || !end) return [];
  const startPt = { lat: start.lat, lng: start.lng };
  const endPt = { lat: end.lat, lng: end.lng };

  // Find closest spine point to start and end
  let closestToStartIdx = 0;
  let minDistStart = Infinity;
  let closestToEndIdx = 0;
  let minDistEnd = Infinity;

  VENUE_WALKWAY_SPINE.forEach((pt, idx) => {
    const dStart = distanceMeters(startPt, pt);
    if (dStart < minDistStart) {
      minDistStart = dStart;
      closestToStartIdx = idx;
    }
    const dEnd = distanceMeters(endPt, pt);
    if (dEnd < minDistEnd) {
      minDistEnd = dEnd;
      closestToEndIdx = idx;
    }
  });

  const path = [[startPt.lat, startPt.lng]];

  // If start is far from spine, step through the spine
  const step = closestToStartIdx <= closestToEndIdx ? 1 : -1;
  let currentIdx = closestToStartIdx;
  
  while (true) {
    const spinePt = VENUE_WALKWAY_SPINE[currentIdx];
    // Add orthogonal corner turn point if it's the first step from start
    if (path.length === 1 && minDistStart > 10) {
      path.push([startPt.lat, spinePt.lng]); // horizontal then vertical aisle turn
    }
    path.push([spinePt.lat, spinePt.lng]);
    if (currentIdx === closestToEndIdx) break;
    currentIdx += step;
  }

  // Orthogonal corner turn into the destination booth/stage
  const lastSpine = VENUE_WALKWAY_SPINE[closestToEndIdx];
  if (minDistEnd > 10) {
    path.push([endPt.lat, lastSpine.lng]); // turn into aisle
  }
  path.push([endPt.lat, endPt.lng]);

  return path;
}

// Built-in festival points of interest - loaded immediately, guaranteeing
// that pins and wayfinding NEVER fail even with offline/flaky festival cell service.
export const DEFAULT_VENUE_PINS = [
  {
    id: 'stage-main',
    name: 'Main Stage & Music Arena',
    subtitle: 'Booth 101 • North Lawn',
    category: 'stage',
    lat: 29.77085,
    lng: -81.45230,
    image: '/images/event-photos/dsc08417.jpg',
    description: 'Live performances all day featuring The Futch Brothers Band, Shee Family, and guest artists.'
  },
  {
    id: 'bbq-pitmasters',
    name: "Championship BBQ Pit Row & People's Choice",
    subtitle: 'Smoker Alley • Booth 204',
    category: 'food',
    lat: 29.77060,
    lng: -81.45195,
    image: '/images/event-photos/dsc08414.jpg',
    description: 'Over 40 championship BBQ teams. Sample world-class brisket, ribs, chicken, and pork!'
  },
  {
    id: 'bourbon-barn',
    name: 'Bourbon Experience & VIP Tasting',
    subtitle: 'Historic Tringali Barn',
    category: 'bourbon',
    lat: 29.77120,
    lng: -81.45255,
    image: '/images/event-photos/dsc08443.jpg',
    description: 'Rare bourbon pairings, master distiller tastings, and VIP hospitality lounge.'
  },
  {
    id: 'car-show',
    name: 'Annual Charity Car Show',
    subtitle: 'East Meadow • Booth 310',
    category: 'attraction',
    lat: 29.7696495215106,
    lng: -81.4518968994985,
    image: '/images/event-photos/dsc08427.jpg',
    description: 'Spectacular classic muscle cars, vintage cruisers, and customized trucks on display.'
  },
  {
    id: 'k9-show',
    name: 'St. Johns Sheriff K9 Exhibition',
    subtitle: 'Demonstration Ring • Booth 402',
    category: 'attraction',
    lat: 29.7697982735303,
    lng: -81.4527877913225,
    image: '/images/event-photos/dsc08432.jpg',
    description: 'Thrilling police K9 obedience, bite-work, and agility demonstrations.'
  },
  {
    id: 'bmx-show',
    name: 'Pro BMX Aerial Halfpipe Stunt Show',
    subtitle: 'Extreme Arena • Booth 501',
    category: 'attraction',
    lat: 29.7698447584912,
    lng: -81.4532815385985,
    image: '/images/event-photos/dsc08435.jpg',
    description: 'High-flying aerial backflips and spine-tingling ramp tricks by pro BMX stunt riders.'
  },
  {
    id: 'kid-zone',
    name: 'Family Fun & Kid Zone',
    subtitle: 'West Play Field • Booth 601',
    category: 'attraction',
    lat: 29.7703556615769,
    lng: -81.4528419155403,
    image: '/images/event-photos/dsc08401.jpg',
    description: 'Giant bounce houses, obstacle courses, face painting, and family games.'
  },
  {
    id: 'main-entrance',
    name: 'Main Festival Entrance & Will-Call',
    subtitle: 'Gate A • Welcome Center',
    category: 'entrance',
    lat: 29.77280,
    lng: -81.45270,
    image: '/images/event-photos/dsc08408.jpg',
    description: 'Ticket scanning, will-call wristbands, information kiosk, and event guides.'
  },
  {
    id: 'merch-swag',
    name: 'Official Festival Merch & Swag Store',
    subtitle: 'Vendor Row • Booth 143',
    category: 'vendor',
    lat: 29.77040,
    lng: -81.45235,
    image: '/jimmy_jam_merch_tees_1778038020125.png',
    description: 'Official 10th Annual tees, caps, aprons, BBQ sauces, and commemorative collectibles.'
  },
  {
    id: 'restrooms-central',
    name: 'Restrooms & Handwashing Stations',
    subtitle: 'Pavilion Station 1',
    category: 'restroom',
    lat: 29.77095,
    lng: -81.45295,
    image: null,
    description: 'Clean ADA-accessible restrooms and sanitation stations.'
  },
  {
    id: '029fdba4-fc17-46ad-8f1b-71e59cd0d643',
    name: 'VIP Parking & Platinum Pass Lot',
    subtitle: 'North Paved Lot • Gate P-1',
    category: 'parking',
    lat: 29.7732748590115,
    lng: -81.4522153395134,
    image: null,
    description: 'VIP ticket holders & sponsor reserved parking.'
  },
  {
    id: '421fe12c-5829-497a-9069-ed485993f4ac',
    name: 'Judges & KCBS Officials Parking',
    subtitle: 'West Barn Lot • Gate P-2',
    category: 'parking',
    lat: 29.7722057360673,
    lng: -81.4524300122421,
    image: null,
    description: 'Reserved parking for certified BBQ competition judges.'
  },
  {
    id: '4bcde5a6-9d3d-4032-80f1-8e6cd9138b71',
    name: 'BBQ Pitmaster Team Rig Parking',
    subtitle: 'East Meadow • Gate P-3',
    category: 'parking',
    lat: 29.7723265940158,
    lng: -81.4513284728031,
    image: null,
    description: 'Cook team trailer and smoker rig staging area with power hookups.'
  },
  {
    id: '98d57dc0-2f79-476e-8368-622d84472749',
    name: 'Vendor - Volunteer - Band Parking',
    subtitle: 'West Access Road • Gate P-4',
    category: 'parking',
    lat: 29.7710626281087,
    lng: -81.4534316198938,
    image: null,
    description: 'Access pass required staging and parking for staff and performers.'
  }
];
