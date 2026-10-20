import React, { useState, useMemo, useEffect } from 'react';
import {
  Star,
  Trophy,
  Award,
  Sparkles,
  ChevronDown,
  Trash2,
  Plus,
  Info,
  CheckCircle2,
  X,
  Edit3,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { supabase } from './supabaseClient';

// Contender teams list with booth numbers and divisions
const COMPETING_TEAMS = [
  {
    id: 'team-1',
    name: 'Maya Jane BBQ Co',
    pitmaster: 'Dave "Smokey" Spencer',
    booth: 'Booth 102',
    category: 'BBQ',
    division: 'Pro Division',
    image: '/winners/maya-jane-bbq-co-pro-grand-champion-2026.jpg',
    specialty: 'Texas Style Brisket & Glazed Ribs'
  },
  {
    id: 'team-2',
    name: "Mike's Backyard BBQ",
    pitmaster: 'Mike Henderson',
    booth: 'Booth 105',
    category: 'BBQ',
    division: 'Backyard Division',
    image: '/winners/mikes-backyard-bbq-backyard-reserve-grand-champion-2026.jpg',
    specialty: 'Applewood Smoked Pork Butt & Hot Links'
  },
  {
    id: 'team-3',
    name: 'So So BBQ',
    pitmaster: 'Marcus Vance',
    booth: 'Booth 108',
    category: 'BBQ',
    division: 'Defending People’s Choice',
    image: '/winners/so-so-bbq-peoples-choice-2026.jpg',
    specialty: 'Sweet & Spicy St. Louis Ribs'
  },
  {
    id: 'team-4',
    name: "Smokin' Spencer's Q",
    pitmaster: 'Brian Spencer',
    booth: 'Booth 112',
    category: 'BBQ',
    division: 'Pro Division',
    image: '/images/event-photos/dsc08414.jpg',
    specialty: 'Cherrywood Pulled Pork & Brisket Bark'
  },
  {
    id: 'team-5',
    name: 'Kings BBQ Pit Crew',
    pitmaster: 'Chris King',
    booth: 'Booth 115',
    category: 'BBQ',
    division: 'Backyard Division',
    image: '/images/event-photos/dsc08416.jpg',
    specialty: 'Brown Sugar Bourbon Ribs'
  },
  {
    id: 'team-6',
    name: 'Old City Smokehouse',
    pitmaster: 'Travis Miller',
    booth: 'Booth 118',
    category: 'BBQ',
    division: 'Pro Division',
    image: '/images/event-photos/dsc08418.jpg',
    specialty: 'Hickory Smoked Pork Belly Burnt Ends'
  },
  {
    id: 'chili-1',
    name: 'Blazin’ Datil Pepper Chili',
    pitmaster: 'Captain Jim Ryan',
    booth: 'Chili Tent #1',
    category: 'Chili & Chowder',
    division: 'Chili Cook-Off',
    image: '/images/event-photos/dsc08401.jpg',
    specialty: 'Local Minorcan Datil Pepper Beef Chili'
  },
  {
    id: 'chili-2',
    name: 'Smoked Brisket Campfire Chili',
    pitmaster: 'Sarah Jenkins',
    booth: 'Chili Tent #4',
    category: 'Chili & Chowder',
    division: 'Chili Cook-Off',
    image: '/images/event-photos/dsc08404.jpg',
    specialty: 'Chunky Smoked Brisket & Dark Stout'
  },
  {
    id: 'chili-3',
    name: 'Minorcan Clam & Pork Chowder',
    pitmaster: 'Capt. Pete Hernandez',
    booth: 'Chili Tent #7',
    category: 'Chili & Chowder',
    division: 'Chili Cook-Off',
    image: '/images/event-photos/dsc08406.jpg',
    specialty: 'Traditional Tomato Broth & Fresh Clams'
  },
  {
    id: 'car-1',
    name: '1969 Chevy Camaro SS (Marina Blue)',
    pitmaster: 'Dan Miller',
    booth: 'Car Show Spot #12',
    category: 'Car Show',
    division: 'Muscle Car Division',
    image: '/images/event-photos/dsc08387.jpg',
    specialty: 'Big Block 396 • 4-Speed'
  },
  {
    id: 'car-2',
    name: '1956 Ford F-100 Custom Pickup',
    pitmaster: 'Robert Kelly',
    booth: 'Car Show Spot #24',
    category: 'Car Show',
    division: 'Classic Truck Division',
    image: '/images/event-photos/dsc08388.jpg',
    specialty: 'Chop Top • Custom Patina V8'
  }
];

export default function FestivalBallot({ setActiveNav }) {
  const [activeCategory, setActiveCategory] = useState('BBQ'); // 'BBQ' | 'Chili & Chowder' | 'Car Show'
  const [ballotEntries, setBallotEntries] = useState(() => {
    try {
      const stored = localStorage.getItem('jj_tasting_ballot_v2');
      if (stored) return JSON.parse(stored);
      // Migration from older ballot
      const legacy = localStorage.getItem('jj_tasting_ballot');
      if (legacy) {
        const parsed = JSON.parse(legacy);
        return parsed.map(e => ({
          id: e.id,
          team: e.team,
          category: e.category || 'BBQ',
          appearance: e.rating || 4,
          aroma: e.rating || 4,
          flavor: e.rating || 4,
          texture: e.rating || 4,
          overall: e.rating || 4,
          notes: e.notes || ''
        }));
      }
      return [];
    } catch {
      return [];
    }
  });

  // Scorecard modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [scoreTeamName, setScoreTeamName] = useState('');
  const [scoreCategory, setScoreCategory] = useState('BBQ');
  const [scoreAppearance, setScoreAppearance] = useState(4);
  const [scoreAroma, setScoreAroma] = useState(4);
  const [scoreFlavor, setScoreFlavor] = useState(5);
  const [scoreTexture, setScoreTexture] = useState(4);
  const [scoreOverall, setScoreOverall] = useState(5);
  const [scoreNotes, setScoreNotes] = useState('');
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // Persist scorecards
  useEffect(() => {
    try {
      localStorage.setItem('jj_tasting_ballot_v2', JSON.stringify(ballotEntries));
    } catch {}
  }, [ballotEntries]);

  // Open Scorecard Modal for a preset team or custom entry
  const openScorecard = (teamObj = null) => {
    if (teamObj) {
      // Check if team already scored
      const existing = ballotEntries.find(
        e => e.team.toLowerCase() === teamObj.name.toLowerCase()
      );
      if (existing) {
        setEditingEntryId(existing.id);
        setScoreTeamName(existing.team);
        setScoreCategory(existing.category);
        setScoreAppearance(existing.appearance || 4);
        setScoreAroma(existing.aroma || 4);
        setScoreFlavor(existing.flavor || 4);
        setScoreTexture(existing.texture || 4);
        setScoreOverall(existing.overall || 4);
        setScoreNotes(existing.notes || '');
      } else {
        setEditingEntryId(null);
        setScoreTeamName(teamObj.name);
        setScoreCategory(teamObj.category);
        setScoreAppearance(4);
        setScoreAroma(4);
        setScoreFlavor(5);
        setScoreTexture(4);
        setScoreOverall(5);
        setScoreNotes('');
      }
    } else {
      setEditingEntryId(null);
      setScoreTeamName('');
      setScoreCategory(activeCategory);
      setScoreAppearance(4);
      setScoreAroma(4);
      setScoreFlavor(5);
      setScoreTexture(4);
      setScoreOverall(5);
      setScoreNotes('');
    }
    setModalOpen(true);
  };

  // Save Scorecard entry
  const handleSaveScorecard = () => {
    if (!scoreTeamName.trim()) return;

    const newEntry = {
      id: editingEntryId || Date.now(),
      team: scoreTeamName.trim(),
      category: scoreCategory,
      appearance: scoreAppearance,
      aroma: scoreAroma,
      flavor: scoreFlavor,
      texture: scoreTexture,
      overall: scoreOverall,
      compositeScore: Number(
        (
          (scoreAppearance * 0.15 +
            scoreAroma * 0.15 +
            scoreFlavor * 0.45 +
            scoreTexture * 0.25)
        ).toFixed(1)
      ),
      notes: scoreNotes.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setBallotEntries(prev => {
      const filtered = prev.filter(e => e.id !== newEntry.id);
      return [newEntry, ...filtered];
    });

    // Cloud sync to Supabase for live standings leaderboard
    if (supabase) {
      supabase
        .from('ballot_votes')
        .insert([
          {
            team_name: newEntry.team,
            category: newEntry.category,
            score_appearance: newEntry.appearance,
            score_aroma: newEntry.aroma,
            score_flavor: newEntry.flavor,
            score_texture: newEntry.texture,
            score_overall: newEntry.overall,
            total_score: newEntry.compositeScore,
            notes: newEntry.notes
          }
        ])
        .then(({ error }) => {
          if (error) {
            console.warn('Supabase vote sync notice:', error.message);
          }
        })
        .catch(err => {
          console.warn('Supabase offline or table pending:', err);
        });
    }

    setModalOpen(false);
  };

  const removeEntry = (id) => {
    setBallotEntries(prev => prev.filter(e => e.id !== id));
  };

  // Filter contenders for current category
  const activeContenders = useMemo(() => {
    return COMPETING_TEAMS.filter(t => t.category === activeCategory);
  }, [activeCategory]);

  // Filter user's saved scorecards for current category, ranked by overall score
  const categoryBallotEntries = useMemo(() => {
    return ballotEntries
      .filter(e => e.category === activeCategory)
      .sort((a, b) => (b.overall || 0) - (a.overall || 0));
  }, [ballotEntries, activeCategory]);

  // Star Rating Bar Component for Criteria
  const CriteriaStarRating = ({ label, value, onChange, description }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 py-2 border-b border-white/10 last:border-b-0">
      <div>
        <p className="font-bold text-xs uppercase tracking-wider text-neutral-200">{label}</p>
        {description && <p className="text-[10px] text-neutral-400">{description}</p>}
      </div>
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 hover:scale-125 transition-transform"
            aria-label={`${label} ${star} stars`}
          >
            <Star
              size={22}
              className={star <= value ? 'text-amber-400 fill-amber-400 drop-shadow' : 'text-neutral-600'}
            />
          </button>
        ))}
        <span className="text-xs font-bold text-amber-400 ml-1.5 w-6 text-right">{value}.0</span>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-[#070B14] text-white -mx-4 px-4 sm:px-6 py-6 pb-28 font-sans overflow-hidden">
      
      {/* ATMOSPHERIC BACKGROUND RADIAL GLOWS (Matching ZeenoPay UI) */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-blue-900/25 via-indigo-900/15 to-transparent blur-3xl opacity-80" />
      <div className="pointer-events-none absolute top-40 right-1/4 w-[350px] h-[350px] bg-amber-500/10 blur-[120px] rounded-full" />
      <div className="pointer-events-none absolute bottom-48 left-1/4 w-[400px] h-[400px] bg-blue-600/10 blur-[130px] rounded-full" />

      <div className="relative max-w-xl mx-auto space-y-6 z-10">

        {/* 1. HERO HEADER (Taste Test Scorecard + ZeenoPay Style) */}
        <div className="text-center pt-2 sm:pt-4 space-y-3">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-sm">
            <Trophy size={14} className="text-amber-400" />
            <span>11th Annual People's Choice Ballot</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Vote & Share Your Taste Test –
            <span className="block font-serif italic font-normal tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-200 to-amber-400 mt-1">
              Crown the 2026 Champions!
            </span>
          </h1>

          <p className="text-neutral-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Rate every team on Appearance, Aroma, Flavor, and Texture as you sample. Pick your favorites and drop your official voting tokens in their booth jar!
          </p>

          {/* Quick Action Buttons */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              onClick={() => openScorecard()}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-95 text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all"
            >
              <Plus size={16} className="stroke-[3]" />
              <span>Score a Team</span>
            </button>

            <button
              onClick={() => setShowHowItWorks(prev => !prev)}
              className="px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Info size={14} className="text-blue-400" />
              <span>How Token Voting Works</span>
              <ChevronDown size={14} className={`transition-transform ${showHowItWorks ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* 2. HOW TOKEN VOTING WORKS ACCORDION */}
        {showHowItWorks && (
          <div className="rounded-2xl p-4 bg-[#0F172A]/90 border border-blue-500/30 shadow-xl space-y-3 animate-in fade-in duration-200 text-xs text-neutral-300 leading-relaxed">
            <div className="flex items-center gap-2 text-blue-300 font-bold text-sm">
              <Award size={16} />
              <span>Official People's Choice Token Rules</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-center">
              <button
                type="button"
                onClick={() => setActiveNav && setActiveNav('tickets')}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-center transition-colors"
              >
                <span className="text-xl block mb-1">🎟️</span>
                <p className="font-bold text-white text-[11px]">1. Buy Tasting Tokens</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">$1 tasting tokens sold at ticket booths →</p>
              </button>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-xl block mb-1">⭐</span>
                <p className="font-bold text-white text-[11px]">2. Log Scorecard</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">Use this app to track your top picks</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-xl block mb-1">🪙</span>
                <p className="font-bold text-white text-[11px]">3. Drop Real Tokens</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">Drop voting tokens in team's jar at booth</p>
              </div>
            </div>
            <p className="text-[11px] text-neutral-400 text-center italic pt-1">
              • Chili & Chowder: 1 voting token per $10 spent (11am – 3pm)<br />
              • BBQ Championship: 1 voting token per $20 spent (2pm – 4pm)
            </p>
          </div>
        )}

        {/* LIVE STANDINGS & LEADERBOARD DASHBOARD LINK */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-amber-950/40 border border-blue-500/30 backdrop-blur-md flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
              <BarChart3 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Live Results & Standings</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-[10px] text-neutral-400">View real-time public leaderboard & judges tally</p>
            </div>
          </div>
          <a
            href="/results.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-[11px] flex items-center gap-1 shrink-0 transition-all shadow-md shadow-blue-600/30"
          >
            <span>Leaderboard</span>
            <ExternalLink size={12} />
          </a>
        </div>

        {/* 3. CATEGORY PILL SELECTOR (BBQ / Chili / Car Show) */}
        <div className="flex items-center justify-between gap-1.5 p-1 rounded-2xl bg-[#0F172A]/80 border border-white/10 backdrop-blur-md">
          {[
            { id: 'BBQ', label: 'BBQ Slam', icon: '🍖', time: '2pm–4pm' },
            { id: 'Chili & Chowder', label: 'Chili & Chowder', icon: '🍲', time: '11am–3pm' },
            { id: 'Car Show', label: 'Car Show', icon: '🚗', time: '9am–3pm' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition-all ${
                activeCategory === tab.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-neutral-950 shadow-md font-extrabold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
              <span className={`text-[9px] ${activeCategory === tab.id ? 'text-neutral-900 font-semibold' : 'text-neutral-500'}`}>
                {tab.time}
              </span>
            </button>
          ))}
        </div>

        {/* 4. CONTENDERS CAROUSEL / CARDS (Matching ZeenoPay Hexagonal / Card Layout) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-amber-400 rounded-full inline-block" />
              <h2 className="font-serif tracking-wider text-xs sm:text-sm font-bold uppercase text-white">
                Featured Contenders ({activeContenders.length})
              </h2>
            </div>
            <span className="text-[11px] text-amber-400 font-medium">Tap to rate team</span>
          </div>

          {/* Horizontal / Grid Contender Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeContenders.map(team => {
              const userScore = ballotEntries.find(
                e => e.team.toLowerCase() === team.name.toLowerCase()
              );
              return (
                <div
                  key={team.id}
                  onClick={() => openScorecard(team)}
                  className="rounded-2xl bg-[#0F172A]/90 hover:bg-[#152038] border border-white/10 hover:border-amber-400/50 p-3.5 shadow-xl cursor-pointer transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Subtle golden corner badge if user already scored */}
                  {userScore && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      <CheckCircle2 size={11} />
                      <span>{userScore.overall}.0 ★</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    {/* Team Thumbnail Photo */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 relative border border-white/10 shadow-sm group-hover:scale-105 transition-transform">
                      <img
                        src={team.image}
                        alt={team.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1 pr-6">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md">
                          {team.booth}
                        </span>
                        <span className="text-[10px] text-neutral-400 truncate">
                          {team.division}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-white truncate leading-snug mt-1 group-hover:text-amber-200 transition-colors">
                        {team.name}
                      </h3>
                      <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                        {team.specialty}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action Pill */}
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-neutral-400">Pitmaster: {team.pitmaster}</span>
                    <span className="text-amber-400 font-bold text-[11px] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      {userScore ? 'Edit Score' : 'Score Team'} →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. MY TASTE TEST SCORECARD SUMMARY (Matching Image 1 Table & Ranking) */}
        <div className="space-y-3 pt-2">
          
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-orange-500 rounded-full inline-block" />
              <h2 className="font-serif tracking-wider text-xs sm:text-sm font-bold uppercase text-white">
                My Taste Test Scorecard ({categoryBallotEntries.length})
              </h2>
            </div>
            {categoryBallotEntries.length > 0 && (
              <span className="text-[11px] text-amber-400 font-semibold">
                Ranked by Score
              </span>
            )}
          </div>

          {categoryBallotEntries.length === 0 ? (
            <div className="text-center py-10 px-4 rounded-2xl bg-[#0F172A]/60 border border-white/10 space-y-2.5">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto text-xl">
                🍴
              </div>
              <h3 className="font-bold text-sm text-white">No {activeCategory} Tastings Logged Yet</h3>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
                As you sample, tap any contender above or tap "Score a Team" to rate Appearance, Aroma, Flavor, and Texture!
              </p>
              <button
                onClick={() => openScorecard()}
                className="mt-1 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-colors"
              >
                + Score Your First Team
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {categoryBallotEntries.map((entry, idx) => {
                const rankBadge = idx === 0 ? '🥇 1st' : idx === 1 ? '🥈 2nd' : idx === 2 ? '🥉 3rd' : `#${idx + 1}`;
                return (
                  <div
                    key={entry.id}
                    className="p-4 rounded-2xl bg-[#0F172A]/90 border border-white/10 shadow-lg space-y-3 relative overflow-hidden"
                  >
                    {/* Top Row: Rank & Name */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black tracking-wider ${
                          idx === 0
                            ? 'bg-amber-400 text-amber-950 shadow-md'
                            : idx === 1
                            ? 'bg-slate-300 text-slate-900 shadow-md'
                            : idx === 2
                            ? 'bg-amber-700 text-amber-100 shadow-md'
                            : 'bg-white/10 text-neutral-300'
                        }`}>
                          {rankBadge}
                        </span>
                        <h3 className="font-bold text-sm sm:text-base text-white truncate">
                          {entry.team}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => {
                            setEditingEntryId(entry.id);
                            setScoreTeamName(entry.team);
                            setScoreCategory(entry.category);
                            setScoreAppearance(entry.appearance || 4);
                            setScoreAroma(entry.aroma || 4);
                            setScoreFlavor(entry.flavor || 4);
                            setScoreTexture(entry.texture || 4);
                            setScoreOverall(entry.overall || 4);
                            setScoreNotes(entry.notes || '');
                            setModalOpen(true);
                          }}
                          className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                          title="Edit Score"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => removeEntry(entry.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors"
                          title="Delete Score"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Criteria Score Breakdown Grid (Matching Image 1 Scorecard) */}
                    <div className="grid grid-cols-4 gap-1.5 p-2.5 rounded-xl bg-black/40 border border-white/5 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Appearance</span>
                        <span className="font-bold text-amber-300 text-xs">{'★'.repeat(entry.appearance || 4)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Aroma</span>
                        <span className="font-bold text-amber-300 text-xs">{'★'.repeat(entry.aroma || 4)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Flavor</span>
                        <span className="font-bold text-amber-300 text-xs">{'★'.repeat(entry.flavor || 5)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Texture</span>
                        <span className="font-bold text-amber-300 text-xs">{'★'.repeat(entry.texture || 4)}</span>
                      </div>
                    </div>

                    {/* Notes & Overall Score */}
                    <div className="flex items-center justify-between text-xs pt-0.5">
                      <p className="text-neutral-300 italic text-[11px] truncate pr-2">
                        {entry.notes ? `"${entry.notes}"` : 'No notes recorded'}
                      </p>
                      <div className="flex items-center gap-1 text-amber-400 font-extrabold flex-shrink-0">
                        <span className="text-sm">{entry.overall || 5}.0</span>
                        <Star size={13} fill="#FBBF24" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* View Full Standings Dashboard Link */}
          <div className="text-center pt-2">
            <a
              href="/results.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-amber-300 hover:text-amber-200 transition-all"
            >
              <BarChart3 size={15} className="text-amber-400" />
              <span>Open Full Official Standings Dashboard (/results.html)</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* 6. CHARITY OUTREACH CALLOUT */}
        <div className="pt-2 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-xs font-semibold">
            <Sparkles size={14} className="text-amber-400" />
            <span>100% of tasting and voting token sales benefit local families in need!</span>
          </div>
        </div>

      </div>

      {/* =======================================================================
          7. OFFICIAL TASTE TEST SCORECARD MODAL (Matching Image 1 Scorecard)
         ======================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-[#0D1322] border border-amber-400/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-900 via-amber-900 to-orange-950 p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍴</span>
                <div>
                  <h3 className="font-serif tracking-wide text-lg font-bold text-white uppercase">
                    Taste Test Scorecard
                  </h3>
                  <p className="text-[10px] text-amber-200 uppercase tracking-widest font-semibold">
                    Jimmy Jam Official Judge Sheet
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-black/40 text-neutral-300 hover:text-white flex items-center justify-center"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              
              {/* Team Name Input */}
              <div className="space-y-1">
                <label className="font-bold text-neutral-300 uppercase tracking-wider text-[10px] block">
                  Cook Team Name or Booth #
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maya Jane BBQ Co or Booth 102"
                  value={scoreTeamName}
                  onChange={(e) => setScoreTeamName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-neutral-500 font-semibold text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              {/* Category Pills */}
              <div className="flex gap-2">
                {['BBQ', 'Chili & Chowder', 'Car Show'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setScoreCategory(cat)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      scoreCategory === cat
                        ? 'bg-amber-400 text-amber-950 font-extrabold shadow-sm'
                        : 'bg-white/5 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* 5 Scoring Criteria (From Image 1) */}
              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-1">
                <CriteriaStarRating
                  label="1. Appearance"
                  description="Smoke ring, mahogany color, caramelization & bark presentation"
                  value={scoreAppearance}
                  onChange={setScoreAppearance}
                />
                <CriteriaStarRating
                  label="2. Aroma"
                  description="Smoky bouquet, savory spices, appetizing smell"
                  value={scoreAroma}
                  onChange={setScoreAroma}
                />
                <CriteriaStarRating
                  label="3. Flavor"
                  description="Depth of seasoning, meat flavor, balanced smoke & rub"
                  value={scoreFlavor}
                  onChange={setScoreFlavor}
                />
                <CriteriaStarRating
                  label="4. Texture / Bite"
                  description="Tenderness, moisture, clean bite through (not mushy or dry)"
                  value={scoreTexture}
                  onChange={setScoreTexture}
                />
                <CriteriaStarRating
                  label="5. Overall Score"
                  description="Would you award this team your voting token?"
                  value={scoreOverall}
                  onChange={setScoreOverall}
                />
              </div>

              {/* Tasting Notes */}
              <div className="space-y-1">
                <label className="font-bold text-neutral-300 uppercase tracking-wider text-[10px] block">
                  Tasting Notes (Bark, sauce kick, smoke profile...)
                </label>
                <textarea
                  placeholder="e.g. Incredible post oak bark, meat melted like butter, sweet bourbon glaze finish."
                  rows={2}
                  value={scoreNotes}
                  onChange={(e) => setScoreNotes(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-amber-400 transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSaveScorecard}
                disabled={!scoreTeamName.trim()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-98 text-neutral-950 font-extrabold text-xs uppercase tracking-wider shadow-xl disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} />
                <span>{editingEntryId ? 'Update Scorecard' : 'Save to My Scorecard'}</span>
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
