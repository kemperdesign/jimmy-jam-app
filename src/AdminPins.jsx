import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from './supabaseClient';
import { PIN_CATEGORIES, categoryMeta } from './geo';

function ClickToPlace({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });
  return null;
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

  useEffect(() => {
    if (session) fetchPins();
  }, [session]);

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

      <p className="text-sm text-gray-600">Tap the map where you want a pin, then name it below.</p>

      <div className="w-full h-72 rounded-lg overflow-hidden border-2 border-blue-300 shadow-lg">
        <MapContainer center={[venueLat, venueLon]} zoom={17} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickToPlace onPick={setPendingLocation} />
          {pins.map(pin => (
            <Marker key={pin.id} position={[pin.lat, pin.lng]} />
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
          <div key={pin.id} className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-3">
            <div>
              <p className="font-bold text-sm text-gray-900">{categoryMeta(pin.category).icon} {pin.name}</p>
              <p className="text-xs text-gray-500">{categoryMeta(pin.category).label} — {pin.lat.toFixed(5)}, {pin.lng.toFixed(5)}</p>
            </div>
            <button onClick={() => handleDelete(pin.id)} className="text-red-600 font-bold text-sm">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
