import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import AdminPins from './AdminPins';
import {
  BUNDLED_ARTISTS,
  BUNDLED_SCHEDULE,
  BUNDLED_TEAMS,
  BUNDLED_SPONSORS,
  BUNDLED_FAQ_ROWS,
  BUNDLED_WINNERS,
  BUNDLED_VOLUNTEER_SHIFTS
} from './festivalData';

// Staff-only page at /admin. Not linked from the app. Requires a Supabase
// account listed in the admins table (see supabase/admin-content.sql).
const EVENT_LAT = 29.7707068;
const EVENT_LON = -81.4533597;
const PHOTO_BUCKET = 'content-photos';

const SECTIONS = [
  {
    id: 'artists',
    label: 'Artists',
    builtIn: BUNDLED_ARTISTS,
    title: item => item.displayName || item.name,
    help: 'Performers on the Artists screen. Photos and links appear on each card.'
  },
  {
    id: 'schedule',
    label: 'Schedule',
    builtIn: BUNDLED_SCHEDULE,
    title: item => item.title,
    help: 'Events on the Schedule screen. Lower sort order shows first.'
  },
  {
    id: 'teams',
    label: 'Teams',
    builtIn: BUNDLED_TEAMS,
    title: item => item.name,
    help: 'Competitors in BBQ, Chili & Chowder, and Car Show. Votes are stored by team name, so renaming a team separates it from its existing votes.'
  },
  {
    id: 'sponsors',
    label: 'Sponsors',
    builtIn: BUNDLED_SPONSORS,
    template: { id: '', name: '', tier: '', logo: '', logoImage: '', website: '', description: '' },
    title: item => item.name,
    help: 'Sponsor cards on the Sponsors screen. Tier controls the filter. Use an emoji or leave the logo as a placeholder when there is no logo image.'
  },
  {
    id: 'faq',
    label: 'FAQ',
    builtIn: BUNDLED_FAQ_ROWS,
    template: { section: '', contact: '', q: '', a: '' },
    title: item => item.q,
    help: 'One row per question. Questions with the same Section name are grouped together on the FAQ screen, in the order they appear here. Section names must match exactly.'
  },
  {
    id: 'winners',
    label: 'Winners',
    builtIn: BUNDLED_WINNERS,
    template: { year: '', category: '', team: '', photo: '', logo: null },
    title: item => item.team,
    help: 'Past winners shown in the Winners gallery. Newest year first is easiest to read.'
  },
  {
    id: 'volunteer',
    label: 'Volunteer',
    builtIn: BUNDLED_VOLUNTEER_SHIFTS,
    template: { sponsor: '', title: '', desc: '', spotsLeft: 0, date: '', time: '', location: '' },
    title: item => item.title,
    help: 'Volunteer shifts on the Volunteer screen. Spots left is shown to visitors.'
  },
  { id: 'pins', label: 'Map Pins', help: 'Click the map to add a pin. Drag a pin to move it.' }
];

const slugify = text =>
  String(text || 'item')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);

const newId = kind => `${kind}-${Date.now().toString(36)}`;

// Blank copy of a record, keeping the same fields as the template.
const blankFrom = template => {
  const out = {};
  Object.keys(template).forEach(key => {
    const v = template[key];
    if (key === 'id') out[key] = '';
    else if (typeof v === 'boolean') out[key] = false;
    else if (typeof v === 'number') out[key] = 0;
    else if (Array.isArray(v) || (v && typeof v === 'object')) out[key] = Array.isArray(v) ? [] : {};
    else out[key] = '';
  });
  return out;
};

const fieldType = (key, value) => {
  if (key === 'id') return 'readonly';
  // "logo" holds an emoji for sponsors and a photo path for winners.
  const isPhotoPath = typeof value === 'string' && /^(\/|https?:)/.test(value);
  if (/image|photo/i.test(key) || (key === 'logo' && (value === null || isPhotoPath))) return 'image';
  if (typeof value === 'boolean') return 'bool';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'string') {
    return value.length > 90 || /desc|note|summary|details|bio/i.test(key) ? 'textarea' : 'text';
  }
  return 'json';
};

const toFormState = record => {
  const out = {};
  Object.keys(record).forEach(key => {
    const v = record[key];
    out[key] = fieldType(key, v) === 'json' ? JSON.stringify(v, null, 2) : v;
  });
  return out;
};

const fromFormState = (form, template) => {
  const out = {};
  Object.keys(form).forEach(key => {
    const type = fieldType(key, template[key]);
    if (type === 'json') {
      out[key] = form[key].trim() === '' ? null : JSON.parse(form[key]);
    } else if (type === 'number') {
      out[key] = Number(form[key]) || 0;
    } else {
      out[key] = form[key];
    }
  });
  return out;
};

// Resize large phone photos before upload. PNG stays PNG so logos keep transparency.
async function shrinkImage(file, maxSide = 1600) {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    if (scale === 1) return file;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
    const blob = await new Promise(resolve => canvas.toBlob(resolve, type, 0.85));
    return blob || file;
  } catch {
    return file;
  }
}

async function uploadPhoto(file, folder) {
  const shrunk = await shrinkImage(file);
  const ext = shrunk.type === 'image/png' ? 'png' : shrunk.type === 'image/jpeg' ? 'jpg' : file.name.split('.').pop();
  const base = slugify(file.name.replace(/\.[^.]+$/, ''));
  const path = `${folder}/${Date.now()}-${base}.${ext}`;
  const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(path, shrunk, {
    contentType: shrunk.type || file.type,
    upsert: false
  });
  if (error) throw error;
  return supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl;
}

function SignIn({ onSignedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (signInError) setError(signInError.message);
    else onSignedIn();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-2xl shadow p-6 space-y-4">
        <h1 className="text-xl font-bold text-slate-900">Jimmy Jam admin</h1>
        <input className="w-full border rounded-lg px-3 py-2" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="username" />
        <input className="w-full border rounded-lg px-3 py-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={busy} className="w-full py-2.5 rounded-lg bg-slate-900 text-white font-bold disabled:opacity-50">
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

function RecordEditor({ section, record, template, isNew, onSave, onCancel, onDelete, setNotice }) {
  const [form, setForm] = useState(() => toFormState(record));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(null);
  const [formError, setFormError] = useState('');

  const keys = Array.from(new Set([...Object.keys(record), ...Object.keys(template || {})]));
  // Field types come from the record, falling back to the template for fields it lacks.
  const shape = { ...(template || {}), ...record };
  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleUpload = async (key, file) => {
    if (!file) return;
    setUploading(key);
    try {
      const url = await uploadPhoto(file, section.id);
      setField(key, url);
      setNotice({ type: 'ok', text: 'Photo uploaded. Save to publish it.' });
    } catch (err) {
      setNotice({ type: 'error', text: `Photo upload failed: ${err.message}` });
    } finally {
      setUploading(null);
    }
  };

  const save = async e => {
    e.preventDefault();
    setFormError('');
    let data;
    try {
      data = fromFormState(form, shape);
    } catch (err) {
      setFormError(`Check the JSON fields: ${err.message}`);
      return;
    }
    setSaving(true);
    await onSave(data);
    setSaving(false);
  };

  return (
    <form onSubmit={save} className="space-y-4">
      {keys.map(key => {
        const value = form[key];
        const type = fieldType(key, shape[key]);
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());
        if (type === 'readonly') {
          return (
            <div key={key} className="text-xs text-slate-500">
              {label}: <span className="font-mono">{record.id || '(assigned on save)'}</span>
            </div>
          );
        }
        return (
          <label key={key} className="block space-y-1">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
            {type === 'bool' && (
              <input type="checkbox" checked={!!value} onChange={e => setField(key, e.target.checked)} className="h-5 w-5" />
            )}
            {type === 'number' && (
              <input type="number" className="w-full border rounded-lg px-3 py-2" value={value ?? 0} onChange={e => setField(key, e.target.value)} />
            )}
            {type === 'text' && (
              <input type="text" className="w-full border rounded-lg px-3 py-2" value={value ?? ''} onChange={e => setField(key, e.target.value)} />
            )}
            {type === 'textarea' && (
              <textarea rows={4} className="w-full border rounded-lg px-3 py-2" value={value ?? ''} onChange={e => setField(key, e.target.value)} />
            )}
            {type === 'json' && (
              <textarea rows={4} spellCheck={false} className="w-full border rounded-lg px-3 py-2 font-mono text-xs" value={value ?? ''} onChange={e => setField(key, e.target.value)} />
            )}
            {type === 'image' && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input type="text" className="flex-1 border rounded-lg px-3 py-2 text-sm" value={value ?? ''} onChange={e => setField(key, e.target.value)} placeholder="Paste a web address or upload a photo" />
                  <label className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-bold cursor-pointer whitespace-nowrap">
                    {uploading === key ? 'Uploading…' : 'Upload'}
                    <input type="file" accept="image/*" className="hidden" disabled={uploading === key} onChange={e => handleUpload(key, e.target.files[0])} />
                  </label>
                </div>
                {value && typeof value === 'string' && (
                  <img src={value} alt="" className="h-24 rounded-lg border object-contain bg-slate-50" />
                )}
              </div>
            )}
          </label>
        );
      })}

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <div className="flex flex-wrap gap-2 pt-2">
        <button disabled={saving} className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-bold disabled:opacity-50">
          {saving ? 'Saving…' : isNew ? 'Add to app' : 'Save changes'}
        </button>
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-lg border font-bold text-slate-700">Cancel</button>
        {!isNew && (
          <button type="button" onClick={onDelete} className="px-5 py-2.5 rounded-lg text-red-600 font-bold ml-auto">Delete</button>
        )}
      </div>
    </form>
  );
}

function ContentSection({ section, setNotice }) {
  const [rows, setRows] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [editing, setEditing] = useState(null); // { record, isNew }
  const [busy, setBusy] = useState(false);

  const template = section.template || section.builtIn[0];
  const canImport = section.builtIn.length > 0;

  const load = async () => {
    const { data, error } = await supabase
      .from('content_items')
      .select('id, kind, sort_order, active, data')
      .eq('kind', section.id)
      .order('sort_order', { ascending: true });
    if (error) {
      setLoadError(error.message);
      return;
    }
    setLoadError('');
    setRows(data || []);
  };

  useEffect(() => {
    setRows(null);
    setEditing(null);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section.id]);

  const importBuiltIn = async () => {
    setBusy(true);
    const payload = section.builtIn.map((item, i) => {
      const data = { ...item, id: item.id ?? slugify(item.name || item.title) };
      return { kind: section.id, id: String(data.id), sort_order: (i + 1) * 10, active: true, data };
    });
    const { error } = await supabase.from('content_items').upsert(payload, { onConflict: 'kind,id' });
    setBusy(false);
    if (error) setNotice({ type: 'error', text: error.message });
    else {
      setNotice({ type: 'ok', text: `Imported ${payload.length} items. The app now uses this list.` });
      load();
    }
  };

  const saveRecord = async data => {
    const id = editing.isNew ? (section.id === 'teams' ? slugify(data.name) || newId(section.id) : newId(section.id)) : String(editing.record.id);
    const existing = rows.find(r => String(r.data.id) === id && r.kind === section.id);
    if (editing.isNew && existing) {
      setNotice({ type: 'error', text: 'An item with that name already exists.' });
      return;
    }
    const record = { ...data, id: editing.isNew ? id : editing.record.id };
    const row = {
      kind: section.id,
      id: String(record.id),
      sort_order: editing.isNew ? (rows.length + 1) * 10 : editing.sort_order,
      active: editing.isNew ? true : editing.active,
      data: record
    };
    const { error } = await supabase.from('content_items').upsert([row], { onConflict: 'kind,id' });
    if (error) {
      setNotice({ type: 'error', text: `Save failed: ${error.message}` });
      return;
    }
    setNotice({ type: 'ok', text: editing.isNew ? 'Added. It is live in the app now.' : 'Saved. Changes are live in the app now.' });
    setEditing(null);
    load();
  };

  const remove = async row => {
    if (!window.confirm(`Delete "${section.title(row.data)}" from the app? This cannot be undone.`)) return;
    const { error } = await supabase.from('content_items').delete().eq('kind', section.id).eq('id', row.id);
    if (error) setNotice({ type: 'error', text: `Delete failed: ${error.message}` });
    else {
      setNotice({ type: 'ok', text: 'Deleted.' });
      setEditing(null);
      load();
    }
  };

  const toggleActive = async row => {
    const { error } = await supabase.from('content_items').update({ active: !row.active }).eq('kind', section.id).eq('id', row.id);
    if (error) setNotice({ type: 'error', text: error.message });
    else load();
  };

  const move = async (index, dir) => {
    const other = rows[index + dir];
    if (!other) return;
    const current = rows[index];
    setBusy(true);
    await supabase.from('content_items').update({ sort_order: other.sort_order }).eq('kind', section.id).eq('id', current.id);
    await supabase.from('content_items').update({ sort_order: current.sort_order }).eq('kind', section.id).eq('id', other.id);
    setBusy(false);
    load();
  };

  if (loadError) return <p className="text-sm text-red-600">Could not load: {loadError}</p>;
  if (!rows) return <p className="text-sm text-slate-500">Loading…</p>;

  if (editing) {
    const base = editing.isNew ? blankFrom(template) : editing.record;
    return (
      <div className="bg-white rounded-2xl shadow p-5 max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">{editing.isNew ? `New ${section.label.replace(/s$/, '').toLowerCase()}` : section.title(editing.record)}</h2>
        </div>
        <RecordEditor
          section={section}
          record={base}
          template={template}
          isNew={editing.isNew}
          onSave={saveRecord}
          onCancel={() => setEditing(null)}
          onDelete={() => remove(editing.row)}
          setNotice={setNotice}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">{section.help}</p>

      {rows.length === 0 && canImport && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
          <p className="text-sm text-amber-900">
            Nothing is saved for {section.label.toLowerCase()} yet, so the app shows its built-in list ({section.builtIn.length} items).
            Import it to start editing here.
          </p>
          <button onClick={importBuiltIn} disabled={busy} className="px-4 py-2 rounded-lg bg-amber-600 text-white font-bold disabled:opacity-50">
            Import built-in list
          </button>
        </div>
      )}

      {(rows.length > 0 || !canImport) && (
        <button
          onClick={() => setEditing({ isNew: true, record: blankFrom(template), row: null })}
          className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold"
        >
          + Add {section.label.replace(/s$/, '').toLowerCase()}
        </button>
      )}

      <ul className="space-y-2">
        {rows.map((row, index) => (
          <li key={row.id} className={`bg-white rounded-xl shadow-sm p-3 flex items-center gap-3 ${row.active ? '' : 'opacity-50'}`}>
            {row.data.image && typeof row.data.image === 'string' ? (
              <img src={row.data.image} alt="" className="h-12 w-12 rounded-lg object-cover bg-slate-100 shrink-0" />
            ) : (
              <div className="h-12 w-12 rounded-lg bg-slate-100 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">{section.title(row.data) || '(untitled)'}</p>
              <p className="text-xs text-slate-500">{row.active ? 'Showing in app' : 'Hidden from app'} · order {row.sort_order}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => move(index, -1)} disabled={busy || index === 0} className="px-2 py-1 rounded border text-xs disabled:opacity-30">↑</button>
              <button onClick={() => move(index, 1)} disabled={busy || index === rows.length - 1} className="px-2 py-1 rounded border text-xs disabled:opacity-30">↓</button>
              <button onClick={() => toggleActive(row)} className="px-2 py-1 rounded border text-xs">{row.active ? 'Hide' : 'Show'}</button>
              <button onClick={() => setEditing({ isNew: false, record: row.data, row, sort_order: row.sort_order, active: row.active })} className="px-3 py-1 rounded bg-slate-900 text-white text-xs font-bold">Edit</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AdminPage() {
  const [session, setSession] = useState(undefined); // undefined = still checking
  const [isAdmin, setIsAdmin] = useState(null);
  const [tab, setTab] = useState('artists');
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setIsAdmin(null);
      return;
    }
    supabase.rpc('is_admin').then(({ data, error }) => setIsAdmin(!error && data === true));
  }, [session]);

  if (session === undefined) return <div className="min-h-screen bg-slate-100" />;
  if (!session) return <SignIn onSignedIn={() => {}} />;
  if (isAdmin === null) return <div className="min-h-screen bg-slate-100" />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow p-6 max-w-sm space-y-3 text-center">
          <p className="font-bold">This account does not have admin access.</p>
          <button onClick={() => supabase.auth.signOut()} className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold">Sign out</button>
        </div>
      </div>
    );
  }

  const section = SECTIONS.find(s => s.id === tab);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
        <div>
          <p className="font-bold">Jimmy Jam admin</p>
          <p className="text-xs text-slate-400">{session.user.email}</p>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="text-sm underline text-slate-300">Sign out</button>
      </header>

      <nav className="bg-white border-b px-2 flex gap-1 overflow-x-auto">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => { setTab(s.id); setNotice(null); }}
            className={`px-4 py-3 text-sm font-bold border-b-2 whitespace-nowrap ${tab === s.id ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500'}`}
          >
            {s.label}
          </button>
        ))}
      </nav>

      <main className="p-4 max-w-4xl mx-auto space-y-4">
        {notice && (
          <div className={`rounded-lg px-4 py-3 text-sm flex justify-between gap-3 ${notice.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-emerald-50 text-emerald-800'}`}>
            <span>{notice.text}</span>
            <button onClick={() => setNotice(null)} className="font-bold">×</button>
          </div>
        )}

        {section.id === 'pins' ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">{section.help}</p>
            <AdminPins venueLat={EVENT_LAT} venueLon={EVENT_LON} />
          </div>
        ) : (
          <ContentSection key={section.id} section={section} setNotice={setNotice} />
        )}
      </main>
    </div>
  );
}
