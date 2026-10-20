import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, ImageOverlay, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Compass,
  Navigation,
  Crosshair,
  Search,
  X,
  Layers,
  MapPin,
  Info
} from 'lucide-react';
import { supabase } from './supabaseClient';
import {
  distanceMeters,
  bearingDegrees,
  formatDistance,
  formatDistanceAndWalk,
  categoryMeta,
  PIN_CATEGORIES,
  SITE_MAP_BOUNDS,
  VENUE_ENTRANCE,
  DEFAULT_VENUE_PINS,
  getWayfindingRoute
} from './geo';

// Leaflet default icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

// Proximi.io styled circular deep-violet pin icon with icon badge
function createProximiPinIcon(category, isSelected, label) {
  const meta = categoryMeta(category);
  const size = isSelected ? 42 : 34;
  const pinBg = isSelected ? '#5B21B6' : '#6D28D9'; // Deep rich violet
  const ringShadow = isSelected
    ? '0 0 0 6px rgba(167, 139, 250, 0.45), 0 8px 20px rgba(0,0,0,0.45)'
    : '0 3px 8px rgba(0,0,0,0.35)';

  return L.divIcon({
    className: 'proximi-pin-marker',
    html: `
      <div style="position:relative;display:flex;flex-direction:column;align-items:center;">
        <div style="
          width:${size}px;
          height:${size}px;
          background:${pinBg};
          border:2.5px solid #FFFFFF;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          box-shadow:${ringShadow};
          transform:${isSelected ? 'scale(1.15)' : 'scale(1)'};
          transition:transform 0.2s ease, box-shadow 0.2s ease;
          cursor:pointer;
        ">
          <span style="font-size:${isSelected ? 18 : 15}px;line-height:1;display:block;">${meta.icon}</span>
        </div>
        ${
          isSelected
            ? `<div style="
                width:0;height:0;
                border-left:5px solid transparent;
                border-right:5px solid transparent;
                border-top:6px solid ${pinBg};
                margin-top:-1px;
              "></div>`
            : ''
        }
      </div>
    `,
    iconSize: [size, size + (isSelected ? 6 : 0)],
    iconAnchor: [size / 2, isSelected ? size + 6 : size / 2]
  });
}

// User location marker with pulsing ripple halo
function createUserLocationIcon(headingDeg) {
  const rotation = headingDeg == null ? 0 : headingDeg;
  return L.divIcon({
    className: 'user-location-pulse-marker',
    html: `
      <div style="position:relative;width:32px;height:32px;display:flex;align-items:center;justify-content:center;">
        <div style="
          position:absolute;
          width:32px;
          height:32px;
          border-radius:50%;
          background:rgba(124, 58, 237, 0.3);
          animation:proximiPulse 2s infinite ease-out;
        "></div>
        <div style="
          width:20px;
          height:20px;
          border-radius:50%;
          background:#7C3AED;
          border:3px solid #FFFFFF;
          box-shadow:0 2px 8px rgba(0,0,0,0.4);
          position:relative;
          display:flex;
          align-items:center;
          justify-content:center;
        ">
          <div style="
            position:absolute;
            top:-10px;
            left:50%;
            transform:translateX(-50%) rotate(${rotation}deg);
            transform-origin:50% 20px;
            width:0;height:0;
            border-left:5px solid transparent;
            border-right:5px solid transparent;
            border-bottom:10px solid #7C3AED;
          "></div>
        </div>
      </div>
      <style>
        @keyframes proximiPulse {
          0% { transform: scale(0.8); opacity: 0.9; }
          70% { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      </style>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
}

// Entrance start marker
function createEntranceMarkerIcon() {
  return L.divIcon({
    className: 'entrance-origin-marker',
    html: `
      <div style="
        width:24px;height:24px;
        border-radius:50%;
        background:#059669;
        border:3px solid #FFFFFF;
        box-shadow:0 2px 6px rgba(0,0,0,0.4);
        display:flex;align-items:center;justify-content:center;
        color:white;font-size:11px;font-weight:bold;
      ">
        A
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
}

// Map Controller for smooth fly-to and bounds fitting
function MapController({ targetCenter, targetZoom, routeBounds, resetTrigger }) {
  const map = useMap();

  useEffect(() => {
    if (routeBounds && routeBounds.length >= 2) {
      try {
        const bounds = L.latLngBounds(routeBounds);
        map.flyToBounds(bounds, {
          padding: [70, 70],
          maxZoom: 18,
          duration: 0.8
        });
      } catch (e) {
        // Fallback
      }
    } else if (targetCenter) {
      map.flyTo([targetCenter.lat, targetCenter.lng], targetZoom || map.getZoom(), {
        duration: 0.6
      });
    }
  }, [targetCenter, targetZoom, routeBounds, resetTrigger, map]);

  return null;
}

export default function VenueMap({ venueLat = 29.7711, venueLon = -81.4526 }) {
  const [pins, setPins] = useState(DEFAULT_VENUE_PINS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPin, setSelectedPin] = useState(DEFAULT_VENUE_PINS[0]); // Default to Main Stage
  const [showSiteMap, setShowSiteMap] = useState(false);
  const siteMapOpacity = 0.85;
  const [userPos, setUserPos] = useState(null);
  const [heading, setHeading] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [mapCenterTarget, setMapCenterTarget] = useState({ lat: venueLat, lng: venueLon });
  const [mapZoomTarget, setMapZoomTarget] = useState(17);
  const [resetCount, setResetCount] = useState(0);

  const watchIdRef = useRef(null);

  // Fetch pins from Supabase and merge with default pins
  useEffect(() => {
    let isMounted = true;
    const fetchPins = async () => {
      try {
        const { data, error } = await supabase.from('venue_pins').select('*').order('name');
        if (!error && data && data.length > 0 && isMounted) {
          // Merge database pins with default rich pins
          const existingIds = new Set(data.map(p => p.name.toLowerCase()));
          const enriched = [
            ...data.map(dbPin => {
              const matchedDefault = DEFAULT_VENUE_PINS.find(
                def => def.name.toLowerCase() === dbPin.name.toLowerCase()
              );
              return {
                id: dbPin.id,
                name: dbPin.name,
                subtitle: matchedDefault?.subtitle || 'Festival Attraction',
                category: dbPin.category || matchedDefault?.category || 'attraction',
                lat: Number(dbPin.lat),
                lng: Number(dbPin.lng),
                image: matchedDefault?.image || null,
                description: matchedDefault?.description || ''
              };
            }),
            ...DEFAULT_VENUE_PINS.filter(def => !existingIds.has(def.name.toLowerCase()))
          ];
          setPins(enriched);
        }
      } catch (err) {
        // Fall back gracefully to DEFAULT_VENUE_PINS without showing error to user
      }
    };

    fetchPins();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter pins based on category & search query
  const filteredPins = useMemo(() => {
    return pins.filter(pin => {
      const matchesCategory =
        activeCategory === 'all' ||
        pin.category === activeCategory ||
        (activeCategory === 'attraction' && (pin.category === 'attractions' || pin.category === 'attraction'));
      const matchesSearch =
        !searchQuery.trim() ||
        pin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pin.subtitle && pin.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (pin.description && pin.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [pins, activeCategory, searchQuery]);

  // Handle Compass Sensor orientation
  const handleOrientation = useCallback((event) => {
    let compassHeading = null;
    if (typeof event.webkitCompassHeading === 'number') {
      compassHeading = event.webkitCompassHeading; // iOS Safari: 0 = north
    } else if (event.absolute && typeof event.alpha === 'number') {
      compassHeading = (360 - event.alpha) % 360; // Android
    }
    if (compassHeading != null && !Number.isNaN(compassHeading)) {
      setHeading(compassHeading);
    }
  }, []);

  // Start live GPS tracking & navigation
  const startNavigation = useCallback(async () => {
    setGeoError('');
    setIsNavigating(true);

    if (!navigator.geolocation) {
      setGeoError('GPS is not supported on this device/browser.');
      return;
    }

    // iOS 13+ sensor permission
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation, true);
        }
      } catch (e) {
        // Sensor denied - fall back to GPS heading
      }
    } else {
      window.addEventListener('deviceorientationabsolute', handleOrientation, true);
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserPos(next);
        if (pos.coords.heading != null && !isNaN(pos.coords.heading)) {
          setHeading(pos.coords.heading);
        }
      },
      (err) => {
        setGeoError('Unable to get GPS location. Using Gate A Entrance as start point.');
      },
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 12000 }
    );
  }, [handleOrientation]);

  // Stop navigation
  const stopNavigation = useCallback(() => {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
    window.removeEventListener('deviceorientation', handleOrientation, true);
    setIsNavigating(false);
  }, [handleOrientation]);

  useEffect(() => {
    return () => {
      stopNavigation();
    };
  }, [stopNavigation]);

  // Calculate wayfinding route path from user position (or Entrance Gate A) to selected destination
  const routeOrigin = userPos || VENUE_ENTRANCE;
  const wayfindingPath = useMemo(() => {
    if (!selectedPin) return [];
    return getWayfindingRoute(routeOrigin, { lat: selectedPin.lat, lng: selectedPin.lng });
  }, [selectedPin, routeOrigin]);

  // Distance and estimated walk time
  const currentDistanceMeters = useMemo(() => {
    if (!selectedPin) return null;
    return distanceMeters(routeOrigin, { lat: selectedPin.lat, lng: selectedPin.lng });
  }, [selectedPin, routeOrigin]);

  // Compass bearing to target
  const targetBearing = useMemo(() => {
    if (!selectedPin) return 0;
    return bearingDegrees(routeOrigin, { lat: selectedPin.lat, lng: selectedPin.lng });
  }, [selectedPin, routeOrigin]);

  const compassArrowRotation = (targetBearing - (heading || 0) + 360) % 360;

  // Recenter / Fit bounds
  const handleRecenter = () => {
    if (selectedPin) {
      // Zoom into selected pin and route origin
      setMapCenterTarget({ lat: selectedPin.lat, lng: selectedPin.lng });
      setMapZoomTarget(18);
      setResetCount(c => c + 1);
    } else {
      setMapCenterTarget({ lat: venueLat, lng: venueLon });
      setMapZoomTarget(17);
      setResetCount(c => c + 1);
    }
  };

  return (
    <div className="relative w-full flex flex-col bg-[#F3F4F6] text-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-300">
      
      {/* 1. TOP HEADER (Proximi.io Clean Style) */}
      <div className="bg-white/95 backdrop-blur-md border-b border-neutral-200 px-4 pt-3.5 pb-2.5 z-20 space-y-2.5">
        
        {/* Title Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-700 text-white flex items-center justify-center font-bold shadow-sm">
              <Navigation size={18} />
            </div>
            <div>
              <h1 className="font-display text-xl tracking-wider uppercase text-neutral-900 leading-tight">
                VENUE MAP
              </h1>
              <p className="text-[11px] text-neutral-500 font-medium">Tringali Barn • Interactive Wayfinding</p>
            </div>
          </div>

          {/* Site Map & Layers Toggle */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowSiteMap(prev => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                showSiteMap
                  ? 'bg-purple-700 text-white shadow-purple-200'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              <Layers size={14} />
              {showSiteMap ? 'Site Map On' : 'Site Map'}
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search booths, stages, BBQ pitmasters, parking..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Pills (Horizontal Scroll) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 pt-0.5">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === 'all'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            All Locations
          </button>
          {PIN_CATEGORIES.filter(c => c.id !== 'other' && c.id !== 'table').map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. INTERACTIVE MAP VIEWPORT */}
      <div className="relative w-full h-[520px] sm:h-[600px] z-10 bg-[#E5E7EB]">
        
        {/* Floating Recenter / Target Button */}
        <button
          onClick={handleRecenter}
          className="absolute right-4 bottom-36 sm:bottom-40 z-[400] w-12 h-12 rounded-full bg-white text-purple-700 shadow-xl border border-neutral-200 flex items-center justify-center hover:bg-purple-50 active:scale-95 transition-all"
          title="Recenter & Fit Map"
          aria-label="Recenter map"
        >
          <Crosshair size={22} className="stroke-[2.5]" />
        </button>

        {/* Live Navigation Active Pill Indicator */}
        {isNavigating && (
          <div className="absolute top-4 left-4 z-[400] bg-purple-700/95 text-white px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-2 backdrop-blur-md animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-bold tracking-wide uppercase">Live Wayfinding Active</span>
          </div>
        )}

        <MapContainer
          center={[venueLat, venueLon]}
          zoom={17}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          {/* Pristine Light Gray Architectural Tile Layer (No API Key Required, No Watermarks) */}
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />

          {/* Optional Official Aerial Festival Site Map Overlay */}
          {showSiteMap && (
            <ImageOverlay url="/map.png" bounds={SITE_MAP_BOUNDS} opacity={siteMapOpacity} />
          )}

          {/* Dynamic Controller for Smooth Fly-To Animations */}
          <MapController
            targetCenter={mapCenterTarget}
            targetZoom={mapZoomTarget}
            resetTrigger={resetCount}
          />

          {/* Wayfinding Route Glow Line (Proximi.io Neon Path) */}
          {wayfindingPath.length >= 2 && (
            <>
              {/* Soft purple glow halo underlay */}
              <Polyline
                positions={wayfindingPath}
                pathOptions={{
                  color: '#C084FC',
                  weight: 8,
                  opacity: 0.5,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              />
              {/* Crisp vivid violet route line with dashed walker segments */}
              <Polyline
                positions={wayfindingPath}
                pathOptions={{
                  color: '#7C3AED',
                  weight: 4,
                  opacity: 0.95,
                  dashArray: '6, 8',
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              />
            </>
          )}

          {/* Origin Marker (Entrance Gate A if no live GPS yet) */}
          {!userPos && (
            <Marker position={[VENUE_ENTRANCE.lat, VENUE_ENTRANCE.lng]} icon={createEntranceMarkerIcon()} />
          )}

          {/* Live User GPS Location Marker */}
          {userPos && (
            <Marker position={[userPos.lat, userPos.lng]} icon={createUserLocationIcon(heading)} />
          )}

          {/* Festival Pins */}
          {filteredPins.map(pin => (
            <Marker
              key={pin.id}
              position={[pin.lat, pin.lng]}
              icon={createProximiPinIcon(pin.category, selectedPin?.id === pin.id, pin.name)}
              eventHandlers={{
                click: () => {
                  setSelectedPin(pin);
                  setMapCenterTarget({ lat: pin.lat, lng: pin.lng });
                  setMapZoomTarget(18);
                }
              }}
            />
          ))}
        </MapContainer>

        {/* 3. PROXIMI.IO FLOATING BOTTOM DESTINATION CARD */}
        {selectedPin && (
          <div className="absolute left-3 right-3 bottom-3 z-[400] transition-all animate-in slide-in-from-bottom duration-300">
            <div className="bg-white rounded-2xl p-3.5 shadow-2xl border border-neutral-200/90 flex flex-col gap-3">
              
              <div className="flex items-center gap-3">
                {/* Thumbnail Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 relative border border-neutral-200 shadow-sm">
                  {selectedPin.image ? (
                    <img
                      src={selectedPin.image}
                      alt={selectedPin.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-purple-50 text-purple-700">
                      <span className="text-2xl">{categoryMeta(selectedPin.category).icon}</span>
                      <span className="text-[10px] font-bold mt-1 uppercase text-neutral-400">Jimmy Jam</span>
                    </div>
                  )}
                  {/* Category Pill Badge */}
                  <span className="absolute bottom-1 right-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/70 text-white backdrop-blur-sm">
                    {categoryMeta(selectedPin.category).label}
                  </span>
                </div>

                {/* Details Column */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-start justify-between gap-1">
                    <h2 className="font-bold text-base sm:text-lg text-neutral-900 leading-snug truncate">
                      {selectedPin.name}
                    </h2>
                    <button
                      onClick={() => setSelectedPin(null)}
                      className="text-neutral-400 hover:text-neutral-600 p-1 -mr-1"
                      aria-label="Dismiss details"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <p className="text-xs font-semibold text-neutral-500 truncate mt-0.5">
                    {selectedPin.subtitle || 'Tringali Barn Festival Grounds'}
                  </p>

                  {/* Proximi.io Walking Distance & Time Badge */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold">
                      <Navigation size={12} className="rotate-45" />
                      <span>{formatDistanceAndWalk(currentDistanceMeters)}</span>
                    </div>

                    <span className="text-[11px] text-neutral-400">
                      from {userPos ? 'your location' : 'Gate A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-2 pt-1 border-t border-neutral-100">
                {!isNavigating ? (
                  <button
                    onClick={startNavigation}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 active:scale-98 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <Compass size={16} />
                    Start Live Wayfinding
                  </button>
                ) : (
                  <div className="flex-1 flex items-center justify-between bg-purple-50 border border-purple-200 rounded-xl px-3 py-1.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full bg-purple-700 text-white flex items-center justify-center transition-transform duration-200"
                        style={{ transform: `rotate(${compassArrowRotation}deg)` }}
                      >
                        <Navigation size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-purple-900">
                          {formatDistance(currentDistanceMeters)} remaining
                        </p>
                        <p className="text-[10px] text-purple-600">Follow the neon route</p>
                      </div>
                    </div>
                    <button
                      onClick={stopNavigation}
                      className="px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      End
                    </button>
                  </div>
                )}

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPin.lat},${selectedPin.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-bold flex items-center gap-1 transition-colors"
                  title="Open in Google Maps"
                >
                  <MapPin size={14} />
                  <span>Maps</span>
                </a>
              </div>

              {geoError && (
                <p className="text-[11px] text-amber-700 font-medium bg-amber-50 rounded-lg p-2 flex items-center gap-1.5">
                  <Info size={14} className="flex-shrink-0" /> {geoError}
                </p>
              )}
            </div>
          </div>
        )}

      </div>

      {/* 4. QUICK POPULAR DESTINATIONS DRAWER (Proximi.io Quick List) */}
      <div className="bg-white p-4 border-t border-neutral-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Featured Destinations ({filteredPins.length})
          </span>
          <span className="text-[11px] text-purple-700 font-semibold">Tap to trace route</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
          {filteredPins.slice(0, 6).map(pin => {
            const d = distanceMeters(routeOrigin, { lat: pin.lat, lng: pin.lng });
            const isCur = selectedPin?.id === pin.id;
            return (
              <button
                key={pin.id}
                onClick={() => {
                  setSelectedPin(pin);
                  setMapCenterTarget({ lat: pin.lat, lng: pin.lng });
                  setMapZoomTarget(18);
                }}
                className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isCur
                    ? 'border-purple-600 bg-purple-50/70 shadow-sm'
                    : 'border-neutral-200 bg-white hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-sm flex-shrink-0">
                    {categoryMeta(pin.category).icon}
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-xs text-neutral-900 truncate">{pin.name}</p>
                    <p className="text-[10px] text-neutral-500 truncate">{pin.subtitle}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 pl-2">
                  <span className="text-[11px] font-bold text-purple-700 block">
                    {Math.round(d)} m
                  </span>
                  <span className="text-[9px] text-neutral-400">
                    {Math.max(1, Math.round(d / 80))} min
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
