import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock, Lock, Trophy } from 'lucide-react';
import { supabase } from './supabaseClient';
import { BUNDLED_TEAMS } from './festivalData';
import { useContentItems } from './useContentItems';

// Voting closes at the BBQ Awards Ceremony. Must match the SQL in supabase/people-choice.sql.
export const VOTING_CLOSES_AT = new Date('2027-01-09T17:00:00-05:00');

const DEVICE_KEY = 'jj_device_id';
const VOTES_KEY = 'jj_people_choice_votes';
const CATEGORIES = [
  { id: 'BBQ', label: 'BBQ Slam', icon: '🍖' },
  { id: 'Chili & Chowder', label: 'Chili & Chowder', icon: '🍲' },
  { id: 'Car Show', label: 'Car Show', icon: '🚗' }
];

let fallbackDeviceId = null;

const getDeviceId = () => {
  try {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      id = window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  } catch {
    // Storage blocked (private window, cleared site data): keep one ID for this page load.
    fallbackDeviceId = fallbackDeviceId || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    return fallbackDeviceId;
  }
};

const readSavedVotes = () => {
  try {
    return JSON.parse(localStorage.getItem(VOTES_KEY)) || {};
  } catch {
    return {};
  }
};

const saveVote = (category, team) => {
  try {
    localStorage.setItem(VOTES_KEY, JSON.stringify({ ...readSavedVotes(), [category]: team }));
  } catch {
    // Vote is already stored on the server; the local lock is just a convenience.
  }
};

const formatClosing = () =>
  VOTING_CLOSES_AT.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

export default function FestivalPeoplesChoice({ setActiveNav }) {
  const COMPETING_TEAMS = useContentItems('teams', BUNDLED_TEAMS);
  const [tab, setTab] = useState('vote');
  const [now, setNow] = useState(() => new Date());
  const [savedVotes, setSavedVotes] = useState(readSavedVotes);
  const [picks, setPicks] = useState({});
  const [submitting, setSubmitting] = useState(null);
  const [errors, setErrors] = useState({});
  const [tallies, setTallies] = useState([]);
  const [tallyError, setTallyError] = useState(null);

  const isClosed = now >= VOTING_CLOSES_AT;

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  // Results are only returned by the database after voting closes, so polling is cheap.
  useEffect(() => {
    if (tab !== 'results' || !isClosed) return undefined;
    let active = true;
    const load = async () => {
      const { data, error } = await supabase.rpc('people_choice_results');
      if (!active) return;
      if (error) {
        setTallyError('Results are unavailable right now. Please try again in a moment.');
      } else {
        setTallyError(null);
        setTallies(data || []);
      }
    };
    load();
    const timer = setInterval(load, 30000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [tab, isClosed]);

  const castVote = async (category) => {
    const team = picks[category];
    if (!team || savedVotes[category] || isClosed) return;
    setSubmitting(category);
    setErrors(prev => ({ ...prev, [category]: null }));

    const { error } = await supabase.from('people_choice_votes').insert([
      { device_id: getDeviceId(), category, team_name: team }
    ]);

    setSubmitting(null);
    if (error && error.code !== '23505') {
      // 23505 = this device already voted in this category; treat it as locked.
      const closed = error.code === '42501' || new Date() >= VOTING_CLOSES_AT;
      setErrors(prev => ({
        ...prev,
        [category]: closed
          ? 'Voting has closed.'
          : 'Could not save your vote. Check your connection and try again.'
      }));
      return;
    }

    saveVote(category, team);
    setSavedVotes(readSavedVotes());
  };

  // Teams per category, with live tallies merged in (teams with no votes still appear).
  const resultsByCategory = useMemo(() => {
    return CATEGORIES.map(cat => {
      const teams = COMPETING_TEAMS.filter(t => t.category === cat.id).map(t => {
        const row = tallies.find(r => r.category === cat.id && r.team_name === t.name);
        return { name: t.name, votes: row ? Number(row.votes) : 0 };
      });
      teams.sort((a, b) => b.votes - a.votes || a.name.localeCompare(b.name));
      const total = teams.reduce((sum, t) => sum + t.votes, 0);
      return { ...cat, teams, total };
    });
  }, [tallies, COMPETING_TEAMS]);

  const votedCount = CATEGORIES.filter(c => savedVotes[c.id]).length;

  return (
    <div className="relative min-h-screen bg-[#070B14] text-white -mx-4 px-4 sm:px-6 py-6 pb-28 font-sans overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-amber-900/20 via-indigo-900/10 to-transparent blur-3xl opacity-80" />

      <div className="relative z-10 space-y-5">
        <div className="text-center space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400">BBQ Slam &amp; Bourbon</p>
          <h1 className="font-display text-3xl tracking-wide text-white">People's Choice</h1>
          <p className="text-xs text-neutral-400">One vote per category. Results unveil at {formatClosing()}.</p>
        </div>

        <div className="flex gap-1.5 p-1 rounded-2xl bg-[#0F172A]/80 border border-white/10">
          {[
            { id: 'vote', label: 'Vote' },
            { id: 'results', label: 'Live Results' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                tab === t.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-neutral-950 shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'vote' && (
          <div className="space-y-5">
            {isClosed ? (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0F172A]/80 border border-white/10">
                <Lock size={18} className="text-amber-400 shrink-0" />
                <p className="text-sm text-neutral-300">Voting has closed. <button onClick={() => setTab('results')} className="text-amber-400 font-bold underline">See the results</button></p>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0F172A]/80 border border-white/10">
                <Clock size={18} className="text-amber-400 shrink-0" />
                <p className="text-sm text-neutral-300">Voting closes {formatClosing()}. You have voted in {votedCount} of {CATEGORIES.length} categories.</p>
              </div>
            )}

            {CATEGORIES.map(cat => {
              const teams = COMPETING_TEAMS.filter(t => t.category === cat.id);
              const saved = savedVotes[cat.id];
              const picked = picks[cat.id];
              return (
                <section key={cat.id} className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    <span className="w-1.5 h-4 bg-amber-400 rounded-full inline-block" />
                    <h2 className="font-display text-xl tracking-wide">{cat.icon} {cat.label}</h2>
                  </div>

                  {teams.map(team => {
                    const selected = saved ? saved === team.name : picked === team.name;
                    return (
                      <button
                        key={team.name}
                        disabled={!!saved || isClosed}
                        onClick={() => setPicks(prev => ({ ...prev, [cat.id]: team.name }))}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          selected
                            ? 'border-amber-400 bg-amber-400/10'
                            : 'border-white/10 bg-[#0F172A]/80 hover:border-white/25'
                        } disabled:opacity-70`}
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-sm truncate">{team.name}</p>
                          <p className="text-[11px] text-neutral-400">{team.booth}</p>
                        </div>
                        {selected && <CheckCircle2 size={20} className="text-amber-400 shrink-0" />}
                      </button>
                    );
                  })}

                  {saved ? (
                    <p className="text-xs text-emerald-400 font-semibold px-1">Your vote is in. Thank you!</p>
                  ) : (
                    !isClosed && (
                      <button
                        onClick={() => castVote(cat.id)}
                        disabled={!picked || submitting === cat.id}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-neutral-950 font-extrabold text-sm shadow-md disabled:opacity-40 active:scale-[0.98] transition-all"
                      >
                        {submitting === cat.id ? 'Saving…' : `Cast my ${cat.label} vote`}
                      </button>
                    )
                  )}
                  {errors[cat.id] && <p className="text-xs text-red-400 px-1">{errors[cat.id]}</p>}
                </section>
              );
            })}
          </div>
        )}

        {tab === 'results' && (
          <div className="space-y-5">
            {!isClosed ? (
              <div className="p-5 rounded-2xl bg-[#0F172A]/80 border border-white/10 text-center space-y-2">
                <Lock size={24} className="text-amber-400 mx-auto" />
                <p className="font-bold">Results are sealed until voting closes</p>
                <p className="text-xs text-neutral-400">They unveil {formatClosing()}, so every vote counts to the end.</p>
              </div>
            ) : (
              <>
                {tallyError && <p className="text-sm text-red-400 text-center">{tallyError}</p>}
                {resultsByCategory.map(cat => (
                  <section key={cat.id} className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <h2 className="font-display text-xl tracking-wide">{cat.icon} {cat.label}</h2>
                      <span className="text-[11px] text-neutral-400">{cat.total} votes</span>
                    </div>
                    {cat.teams.map((team, idx) => {
                      const pct = cat.total ? Math.round((team.votes / cat.total) * 100) : 0;
                      return (
                        <div key={team.name} className="p-3.5 rounded-2xl bg-[#0F172A]/80 border border-white/10 space-y-2">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 min-w-0">
                              {idx === 0 && cat.total > 0 && <Trophy size={16} className="text-amber-400 shrink-0" />}
                              <p className="font-bold text-sm truncate">{team.name}</p>
                            </div>
                            <p className="text-xs text-neutral-300 shrink-0">{team.votes} · {pct}%</p>
                          </div>
                          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </section>
                ))}
              </>
            )}
          </div>
        )}

        <button onClick={() => setActiveNav('home')} className="w-full py-2.5 text-xs text-neutral-400 hover:text-white">
          Back to home
        </button>
      </div>
    </div>
  );
}
