import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, ImageOverlay, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from './supabaseClient';
import { PIN_CATEGORIES, categoryMeta, SITE_MAP_BOUNDS } from './geo';

function ClickToPlace({ onPick, disabled }) {
  useMapEvents({
    click(e) {
      if (!disabled) onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });
  return null;
}

const moveHandleIcon = L.divIcon({
  className: 'calibration-handle',
  html: `<div style="
    width:36px;height:36px;border-radius:50%;background:#16a34a;border:3px solid white;
    box-shadow:0 2px 8px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;
    font-size:18px;cursor:move;
  ">✥</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18]
});

function boundsToObj(bounds) {
  const [[south, west], [north, east]] = bounds;
  return { south, west, north, east };
}

function objToBounds(obj) {
  return [[obj.south, obj.west], [obj.north, obj.east]];
}

function LoginForm({ onSignedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (signInError) {
      setError('Login failed — check your email and password.');
      return;
    }
    onSignedIn(data.session);
  };

  return (
    <div className="max-w-sm mx-auto bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg mt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-1">Admin Login</h2>
      <p className="text-sm text-gray-500 mb-4">Sign in to manage GPS map pins. Ask Supabase project owner to create your login under Authentication &gt; Users.</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border-2 border-gray-300 rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 border-2 border-gray-300 rounded-lg"
        />
        {error && <p className="text-red-700 text-sm font-semibold">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-lg font-bold"
        >
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

export default function AdminPins({ venueLat, venueLon }) {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [pins, setPins] = useState([]);
  const [pendingLocation, setPendingLocation] = useState(null);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('parking');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('parking');
  const [moveNotice, setMoveNotice] = useState('');
  const [showSiteMap, setShowSiteMap] = useState(true);
  const [siteMapOpacity, setSiteMapOpacity] = useState(0.85);
  const [calibrating, setCalibrating] = useState(false);
  const [mapBounds, setMapBounds] = useState(boundsToObj(SITE_MAP_BOUNDS));
  const [calibrationNotice, setCalibrationNotice] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const fetchPins = async () => {
    const { data, error } = await supabase.from('venue_pins').select('*').order('name');
    if (!error) setPins(data || []);
  };

  const fetchCalibration = async () => {
    const { data, error } = await supabase.from('site_map_calibration').select('*').eq('id', 1).maybeSingle();
    if (!error && data) {
      setMapBounds({ south: data.south, west: data.west, north: data.north, east: data.east });
    }
  };

  useEffect(() => {
    if (session) {
      fetchPins();
      fetchCalibration();
    }
  }, [session]);

  const centerOf = (b) => ({ lat: (b.south + b.north) / 2, lng: (b.west + b.east) / 2 });

  const handleMoveOverlay = (newCenter) => {
    const oldCenter = centerOf(mapBounds);
    const dLat = newCenter.lat - oldCenter.lat;
    const dLng = newCenter.lng - oldCenter.lng;
    setMapBounds(prev => ({
      south: prev.south + dLat,
      north: prev.north + dLat,
      west: prev.west + dLng,
      east: prev.east + dLng
    }));
  };

  const handleScaleOverlay = (factor) => {
    setMapBounds(prev => {
      const c = centerOf(prev);
      const halfLat = ((prev.north - prev.south) / 2) * factor;
      const halfLng = ((prev.east - prev.west) / 2) * factor;
      return {
        south: c.lat - halfLat,
        north: c.lat + halfLat,
        west: c.lng - halfLng,
        east: c.lng + halfLng
      };
    });
  };

  const handleSaveCalibration = async () => {
    const { error } = await supabase.from('site_map_calibration').upsert({ id: 1, ...mapBounds });
    setCalibrationNotice(error ? 'Could not save — make sure you’re still logged in.' : 'Site map alignment saved.');
    setTimeout(() => setCalibrationNotice(''), 3000);
  };

  const handleResetCalibration = () => {
    setMapBounds(boundsToObj(SITE_MAP_BOUNDS));
  };

  const handleAddPin = async (e) => {
    e.preventDefault();
    if (!pendingLocation || !newName.trim()) return;

    setSaving(true);
    setSaveError('');
    const { error } = await supabase.from('venue_pins').insert({
      name: newName.trim(),
      category: newCategory,
      lat: pendingLocation.lat,
      lng: pendingLocation.lng
    });
    setSaving(false);

    if (error) {
      setSaveError('Could not save pin — make sure you’re still logged in.');
      return;
    }

    setNewName('');
    setPendingLocation(null);
    fetchPins();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this pin?')) return;
    await supabase.from('venue_pins').delete().eq('id', id);
    fetchPins();
  };

  const handleDragEnd = async (pin, newLatLng) => {
    const { lat, lng } = newLatLng;
    setPins(prev => prev.map(p => p.id === pin.id ? { ...p, lat, lng } : p));
    const { error } = await supabase.from('venue_pins').update({ lat, lng }).eq('id', pin.id);
    if (error) {
      setMoveNotice(`Could not save new position for "${pin.name}" — reverting.`);
      fetchPins();
    } else {
      setMoveNotice(`Moved "${pin.name}".`);
    }
    setTimeout(() => setMoveNotice(''), 3000);
  };

  const startEditing = (pin) => {
    setEditingId(pin.id);
    setEditName(pin.name);
    setEditCategory(pin.category);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditCategory('parking');
  };

  const handleSaveEdit = async (id) => {
    if (!editName.trim()) return;
    const { error } = await supabase
      .from('venue_pins')
      .update({ name: editName.trim(), category: editCategory })
      .eq('id', id);
    if (!error) {
      cancelEditing();
      fetchPins();
    }
  };

  if (checkingSession) {
    return <p className="text-center text-gray-500 py-8">Checking login...</p>;
  }

  if (!session) {
    return <LoginForm onSignedIn={setSession} />;
  }

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Manage GPS Pins</h2>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-sm font-bold text-red-600"
        >
          Sign Out
        </button>
      </div>

      <p className="text-sm text-gray-600">Tap the map where you want a pin, then name it below. Drag an existing pin to reposition it — it saves automatically.</p>

      {moveNotice && <p className="text-sm font-semibold text-blue-700">{moveNotice}</p>}

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setShowSiteMap(prev => !prev)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 text-xs font-bold transition-all ${
            showSiteMap ? 'bg-gray-800 text-white border-gray-800' : 'bg-gray-50 border-gray-200 text-gray-500'
          }`}
        >
          🗺️ {showSiteMap ? 'Hide Site Map' : 'Show Site Map'}
        </button>
        {showSiteMap && (
          <>
            <label className="flex items-center gap-2 text-xs text-gray-600">
              Opacity
              <input
                type="range"
                min="0.2"
                max="1"
                step="0.05"
                value={siteMapOpacity}
                onChange={(e) => setSiteMapOpacity(Number(e.target.value))}
              />
            </label>
            <button
              onClick={() => setCalibrating(prev => !prev)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 text-xs font-bold transition-all ${
                calibrating ? 'bg-green-600 text-white border-green-600' : 'bg-gray-50 border-gray-200 text-gray-500'
              }`}
            >
              📐 {calibrating ? 'Done Aligning' : 'Align Site Map'}
            </button>
          </>
        )}
      </div>

      {calibrating && (
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-3 space-y-2">
          <p className="text-sm text-green-900 font-semibold">Drag the green handle to move the image. Use the buttons to resize it.</p>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => handleScaleOverlay(1.05)} className="px-3 py-1.5 bg-white border-2 border-green-400 rounded-lg font-bold text-sm">➕ Bigger</button>
            <button onClick={() => handleScaleOverlay(0.95)} className="px-3 py-1.5 bg-white border-2 border-green-400 rounded-lg font-bold text-sm">➖ Smaller</button>
            <button onClick={handleResetCalibration} className="px-3 py-1.5 bg-white border-2 border-gray-300 rounded-lg font-bold text-sm text-gray-600">Reset</button>
            <button onClick={handleSaveCalibration} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm">💾 Save Alignment</button>
          </div>
          {calibrationNotice && <p className="text-sm font-semibold text-green-800">{calibrationNotice}</p>}
        </div>
      )}

      <div className="w-full h-72 rounded-lg overflow-hidden border-2 border-blue-300 shadow-lg">
        <MapContainer center={[venueLat, venueLon]} zoom={17} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {showSiteMap && (
            <ImageOverlay url="/map.png" bounds={objToBounds(mapBounds)} opacity={siteMapOpacity} />
          )}
          {calibrating && (
            <Marker
              position={[centerOf(mapBounds).lat, centerOf(mapBounds).lng]}
              icon={moveHandleIcon}
              draggable
              eventHandlers={{
                dragend: (e) => handleMoveOverlay(e.target.getLatLng())
              }}
            />
          )}
          <ClickToPlace onPick={setPendingLocation} disabled={calibrating} />
          {pins.map(pin => (
            <Marker
              key={pin.id}
              position={[pin.lat, pin.lng]}
              draggable={!calibrating}
              eventHandlers={{
                dragend: (e) => handleDragEnd(pin, e.target.getLatLng())
              }}
            />
          ))}
          {pendingLocation && (
            <Marker position={[pendingLocation.lat, pendingLocation.lng]} />
          )}
        </MapContainer>
      </div>

      {pendingLocation && (
        <form onSubmit={handleAddPin} className="bg-white rounded-lg border-2 border-blue-300 p-4 space-y-3">
          <p className="text-sm text-gray-600">
            New pin at {pendingLocation.lat.toFixed(6)}, {pendingLocation.lng.toFixed(6)}
          </p>
          <input
            type="text"
            placeholder="Pin name (e.g. Restroom near Kid Zone)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            className="w-full p-3 border-2 border-gray-300 rounded-lg"
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg"
          >
            {PIN_CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
            ))}
          </select>
          {saveError && <p className="text-red-700 text-sm font-semibold">{saveError}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-2 rounded-lg font-bold"
            >
              {saving ? 'Saving...' : 'Save Pin'}
            </button>
            <button
              type="button"
              onClick={() => setPendingLocation(null)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg font-bold text-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        <h3 className="font-bold text-gray-800">Existing Pins ({pins.length})</h3>
        {pins.map(pin => (
          <div key={pin.id} className="bg-white rounded-lg border border-gray-200 p-3">
            {editingId === pin.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2 border-2 border-blue-300 rounded-lg text-sm"
                />
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full p-2 border-2 border-blue-300 rounded-lg text-sm"
                >
                  {PIN_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button onClick={() => handleSaveEdit(pin.id)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg font-bold text-sm">Save</button>
                  <button onClick={cancelEditing} className="px-3 py-1.5 border-2 border-gray-300 rounded-lg font-bold text-gray-600 text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-gray-900">{categoryMeta(pin.category).icon} {pin.name}</p>
                  <p className="text-xs text-gray-500">{categoryMeta(pin.category).label} — {pin.lat.toFixed(5)}, {pin.lng.toFixed(5)}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => startEditing(pin)} className="text-blue-600 font-bold text-sm">Edit</button>
                  <button onClick={() => handleDelete(pin.id)} className="text-red-600 font-bold text-sm">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
