import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from './supabaseClient';
import { distanceMeters, bearingDegrees, formatDistance, categoryMeta, PIN_CATEGORIES } from './geo';

// Leaflet's default marker icons reference image files that don't survive
// webpack bundling unless re-pointed at the CDN copies.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

function pinDivIcon(categoryId, highlighted) {
  const meta = categoryMeta(categoryId);
  return L.divIcon({
    className: 'venue-pin-icon',
    html: `<div style="
      width:${highlighted ? 40 : 32}px;height:${highlighted ? 40 : 32}px;
      background:${meta.color};border:2px solid white;border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 6px rgba(0,0,0,0.4);
    "><span style="transform:rotate(45deg);font-size:${highlighted ? 18 : 14}px;">${meta.icon}</span></div>`,
    iconSize: [highlighted ? 40 : 32, highlighted ? 40 : 32],
    iconAnchor: [highlighted ? 20 : 16, highlighted ? 40 : 32]
  });
}

function userDivIcon(headingDeg) {
  const rotation = headingDeg == null ? 0 : headingDeg;
  return L.divIcon({
    className: 'user-pin-icon',
    html: `<div style="
      width:28px;height:28px;border-radius:50%;background:#2563eb;border:3px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.5);position:relative;
    ">
      <div style="
        position:absolute;top:-14px;left:50%;transform:translateX(-50%) rotate(${rotation}deg);
        transform-origin:50% 28px;width:0;height:0;
        border-left:7px solid transparent;border-right:7px solid transparent;
        border-bottom:14px solid #2563eb;
      "></div>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
}

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView([center.lat, center.lng], map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
}

export default function VenueMap({ venueLat, venueLon }) {
  const [pins, setPins] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [activeCategories, setActiveCategories] = useState(PIN_CATEGORIES.map(c => c.id));
  const [selectedPin, setSelectedPin] = useState(null);
  const [navigating, setNavigating] = useState(false);
  const [userPos, setUserPos] = useState(null);
  const [heading, setHeading] = useState(null);
  const [headingSource, setHeadingSource] = useState(null); // 'compass' | 'movement' | null
  const [geoError, setGeoError] = useState('');

  const watchIdRef = useRef(null);
  const lastPosRef = useRef(null);
  const headingSourceRef = useRef(null);

  useEffect(() => {
    const fetchPins = async () => {
      const { data, error } = await supabase.from('venue_pins').select('*').order('name');
      if (error) {
        setLoadError('Unable to load map pins right now.');
        return;
      }
      setPins(data || []);
    };
    fetchPins();
  }, []);

  const filteredPins = useMemo(
    () => pins.filter(p => activeCategories.includes(p.category)),
    [pins, activeCategories]
  );

  const toggleCategory = (id) => {
    setActiveCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const stopNavigating = () => {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
    window.removeEventListener('deviceorientation', handleOrientation, true);
    setNavigating(false);
    setUserPos(null);
    setHeading(null);
    setHeadingSource(null);
    headingSourceRef.current = null;
    lastPosRef.current = null;
    setGeoError('');
  };

  const handleOrientation = (event) => {
    let compassHeading = null;
    if (typeof event.webkitCompassHeading === 'number') {
      compassHeading = event.webkitCompassHeading; // iOS Safari: already 0=north
    } else if (event.absolute && typeof event.alpha === 'number') {
      compassHeading = 360 - event.alpha; // Android: alpha counts counter-clockwise from device start
    }
    if (compassHeading != null && !Number.isNaN(compassHeading)) {
      setHeading(compassHeading);
      setHeadingSource('compass');
      headingSourceRef.current = 'compass';
    }
  };

  const startNavigating = async (pin) => {
    setSelectedPin(pin);
    setGeoError('');

    if (!navigator.geolocation) {
      setGeoError('Live location isn’t available on this device/browser.');
      return;
    }

    // iOS 13+ requires an explicit user-gesture permission prompt for sensors.
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const result = await DeviceOrientationEvent.requestPermission();
        if (result === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation, true);
        }
      } catch (err) {
        // Permission denied or unsupported — we still navigate by distance/bearing-to-target only.
      }
    } else {
      window.addEventListener('deviceorientationabsolute', handleOrientation, true);
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const next = { lat: position.coords.latitude, lng: position.coords.longitude };

        // Fall back to movement-derived heading when no compass sensor reading is available.
        if (headingSourceRef.current !== 'compass' && lastPosRef.current && distanceMeters(lastPosRef.current, next) > 2) {
          headingSourceRef.current = 'movement';
          setHeadingSource('movement');
          setHeading(bearingDegrees(lastPosRef.current, next));
        }
        lastPosRef.current = next;
        setUserPos(next);
      },
      (err) => {
        setGeoError(
          err.code === err.PERMISSION_DENIED
            ? 'Location permission was denied. Enable it in your device settings to navigate.'
            : 'Unable to get your live location right now.'
        );
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 }
    );

    setNavigating(true);
  };

  useEffect(() => {
    return () => stopNavigating();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const distanceToTarget = userPos && selectedPin ? distanceMeters(userPos, { lat: selectedPin.lat, lng: selectedPin.lng }) : null;
  const bearingToTarget = userPos && selectedPin ? bearingDegrees(userPos, { lat: selectedPin.lat, lng: selectedPin.lng }) : null;
  // Arrow rotation relative to the phone's facing direction, so it always visually points the right way to walk.
  const arrowRotation = bearingToTarget != null ? (bearingToTarget - (heading || 0) + 360) % 360 : 0;

  return (
    <div className="space-y-4">
      {/* CATEGORY FILTERS */}
      <div className="flex gap-2 flex-wrap">
        {PIN_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => toggleCategory(cat.id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full border-2 text-xs font-bold transition-all ${
              activeCategories.includes(cat.id)
                ? 'text-white border-transparent'
                : 'bg-gray-50 border-gray-200 text-gray-400'
            }`}
            style={activeCategories.includes(cat.id) ? { backgroundColor: cat.color } : {}}
          >
            <span>{cat.icon}</span> {cat.label}
          </button>
        ))}
      </div>

      {loadError && <p className="text-red-700 font-semibold text-sm">{loadError}</p>}

      {/* MAP */}
      <div className="w-full h-80 rounded-lg overflow-hidden border-2 border-blue-300 shadow-lg">
        <MapContainer center={[venueLat, venueLon]} zoom={17} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredPins.map(pin => (
            <Marker
              key={pin.id}
              position={[pin.lat, pin.lng]}
              icon={pinDivIcon(pin.category, selectedPin?.id === pin.id)}
              eventHandlers={{ click: () => setSelectedPin(pin) }}
            >
              <Popup>
                <strong>{pin.name}</strong>
                <br />
                {categoryMeta(pin.category).label}
              </Popup>
            </Marker>
          ))}
          {userPos && (
            <>
              <Marker position={[userPos.lat, userPos.lng]} icon={userDivIcon(heading)} />
              <MapRecenter center={userPos} />
            </>
          )}
        </MapContainer>
      </div>

      {/* PIN LIST */}
      {!navigating && (
        <div className="grid grid-cols-2 gap-2">
          {filteredPins.map(pin => (
            <button
              key={pin.id}
              onClick={() => setSelectedPin(pin)}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                selectedPin?.id === pin.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <p className="font-bold text-sm text-gray-900">{categoryMeta(pin.category).icon} {pin.name}</p>
              <p className="text-xs text-gray-500">{categoryMeta(pin.category).label}</p>
            </button>
          ))}
          {filteredPins.length === 0 && !loadError && (
            <p className="text-gray-500 text-sm col-span-2">No pins in the selected categories yet.</p>
          )}
        </div>
      )}

      {/* SELECTED PIN / NAVIGATE CONTROL */}
      {selectedPin && !navigating && (
        <button
          onClick={() => startNavigating(selectedPin)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold shadow-lg"
        >
          🧭 Navigate to {selectedPin.name}
        </button>
      )}

      {/* LIVE NAVIGATION PANEL */}
      {navigating && selectedPin && (
        <div className="bg-white rounded-lg border-2 border-blue-600 p-4 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <p className="font-bold text-blue-900">Navigating to {selectedPin.name}</p>
            <button onClick={stopNavigating} className="text-sm font-bold text-red-600">STOP</button>
          </div>

          {geoError && <p className="text-red-700 text-sm">{geoError}</p>}

          {!geoError && !userPos && (
            <p className="text-gray-500 text-sm">Getting your live location...</p>
          )}

          {userPos && (
            <div className="flex items-center gap-6">
              <div
                className="w-20 h-20 flex items-center justify-center text-5xl transition-transform"
                style={{ transform: `rotate(${arrowRotation}deg)` }}
              >
                ⬆️
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-900">{formatDistance(distanceToTarget)}</p>
                <p className="text-xs text-gray-500">
                  {headingSource === 'compass'
                    ? 'Arrow points the way — using device compass'
                    : headingSource === 'movement'
                    ? 'Arrow points the way — estimated from your movement'
                    : 'Walk a few steps to calibrate direction'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
