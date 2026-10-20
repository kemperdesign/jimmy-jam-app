import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  Heart,
  Share2,
  ChevronLeft,
  SlidersHorizontal,
  ExternalLink,
  Music,
  CalendarPlus,
  Ticket,
  Check,
  Flame,
  Radio,
} from 'lucide-react';

export default function FestivalArtists({
  selectedArtist,
  setSelectedArtist,
  favoriteArtists = [],
  toggleFavoriteArtist,
  mySchedule = [],
  toggleMySchedule,
  addArtistToCalendar,
  openExternal,
  setActiveNav,
  EVENT_VENUE_NAME = 'St. Johns County Fairgrounds'
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [copiedId, setCopiedId] = useState(null);

  // Full artist roster with high-resolution imagery and metadata
  const artists = useMemo(() => [
    {
      id: 1,
      name: 'THE FUTCH BROTHERS BAND',
      displayName: 'The Futch Brothers Band',
      genre: 'Country • Rock • Blues • Americana',
      subtitle: 'Headlining the 3rd Annual Bourbon & BBQ Charity Event',
      badge: 'Bourbon & BBQ',
      category: 'bourbon',
      dateDay: '17',
      dateMonth: 'OCT',
      dateFull: 'Saturday, October 17, 2026',
      eventDate: '2026-10-17',
      eventStartTime: '20:15',
      time: '8:15 PM – 10:00 PM',
      stage: 'The Tringali Barn Patio',
      location: 'Elkton, FL • The Tringali Barn',
      price: '$100 / person',
      priceSubtitle: 'Dinner & Concert Ticket',
      goingCount: '250+ going',
      image: 'https://images.zoogletools.com/s:bzglfiles/u/188709/0fadb2caa1a76a2c326d930c9511749d8c4dbf86/original/photo-output-4.jpeg/!!/b%3AW1sicmVzaXplIiwxODAwXSxbIm1heCJdLFsid2UiXV0%3D/meta%3AeyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ%3D%3D.jpg',
      website: 'https://brianfutch.com/',
      spotifyUrl: 'https://open.spotify.com/playlist/2RGhCcMgYDuUnJo7hXNFd2?si=HrjflBeqQaCJzF7jHwibAw',
      ticketUrl: 'https://pci.jotform.com/form/262125277149156',
      description: 'Led by renowned singer-songwriter Brian Futch, The Futch Brothers Band delivers an electrifying mix described on their site as "rock to country to blues to folk to Americana," with original songs about life, grit, and love. Playing more than 50 shows a year and currently producing an EP of original material, the band headlines the patio immediately following the Kings BBQ dinner program at The Tringali Barn.',
      highlights: [
        'Multi-instrumental live performance with acoustic & electric sets',
        'Special guest appearances during the evening bourbon raffle',
        'Intimate open-air patio setting under the Florida stars'
      ],
      avatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'
      ]
    },
    {
      id: 2,
      name: 'REGIONAL COUNTRY & SOUTHERN ROCK SHOWCASE',
      displayName: 'Regional Country & Southern Rock Showcase',
      genre: 'Outlaw Country • Southern Rock • Classic Hits',
      subtitle: 'Main Stage All-Day Festival Showcase',
      badge: 'Main Stage',
      category: 'mainstage',
      dateDay: '09',
      dateMonth: 'JAN',
      dateFull: 'Saturday, January 9, 2027',
      eventDate: '2027-01-09',
      eventStartTime: '11:30',
      time: '11:30 AM – 3:30 PM',
      stage: 'Main Amphitheater Stage',
      location: 'St. Johns County Fairgrounds',
      price: 'Free Entry',
      priceSubtitle: 'Included with Admission',
      goingCount: '1.2k going',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200',
      website: 'https://jimmyjambbqslam.com',
      spotifyUrl: 'https://open.spotify.com/playlist/2RGhCcMgYDuUnJo7hXNFd2?si=HrjflBeqQaCJzF7jHwibAw',
      ticketUrl: 'https://pci.jotform.com/form/260406377587163',
      description: 'The heartbeat of the Jimmy Jam BBQ Slam! Featuring an all-star lineup of northern Florida and regional country and Southern rock talents playing country anthems, classic rock favorites, and high-energy festival grooves throughout the cook-off day right beside Pitmaster Row.',
      highlights: [
        'Covered amphitheater seating with excellent sightlines',
        'Full sound production with non-stop sets throughout the day',
        'Directly adjacent to the Chili Tasting Pavilion and Beer Garden'
      ],
      avatars: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120'
      ]
    },
    {
      id: 3,
      name: 'ACOUSTIC ROOTS & BLUES JAM',
      displayName: 'Acoustic Roots & Blues Jam',
      genre: 'Delta Blues • Bluegrass • Acoustic Folk',
      subtitle: 'Daytime Acoustic Session at the Tasting Pavilion',
      badge: 'Acoustic Patio',
      category: 'acoustic',
      dateDay: '09',
      dateMonth: 'JAN',
      dateFull: 'Saturday, January 9, 2027',
      eventDate: '2027-01-09',
      eventStartTime: '13:00',
      time: '1:00 PM – 4:00 PM',
      stage: 'Acoustic Pavilion',
      location: 'St. Johns County Fairgrounds',
      price: 'Free Entry',
      priceSubtitle: 'Included with Admission',
      goingCount: '480+ going',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200',
      website: 'https://jimmyjambbqslam.com',
      spotifyUrl: 'https://open.spotify.com/playlist/2RGhCcMgYDuUnJo7hXNFd2?si=HrjflBeqQaCJzF7jHwibAw',
      ticketUrl: 'https://pci.jotform.com/form/260406377587163',
      description: 'An intimate, stripped-down showcase honoring American roots music, delta slide guitar, and rich folk harmonies. Relax in the shade with BBQ tasting tokens while seasoned acoustic musicians trade licks and stories.',
      highlights: [
        'Fingerstyle picking, harmonica, and acoustic delta blues',
        'Casual shaded patio seating',
        'Family-friendly listening atmosphere'
      ],
      avatars: [
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120'
      ]
    },
    {
      id: 4,
      name: 'FESTIVAL HEADLINER EVENING SHOWCASE',
      displayName: 'Festival Headliner Evening Showcase',
      genre: 'Country Anthems • Rock & Roll • Finale Show',
      subtitle: 'Main Stage Pre-Awards Grand Finale Concert',
      badge: 'Grand Finale',
      category: 'mainstage',
      dateDay: '09',
      dateMonth: 'JAN',
      dateFull: 'Saturday, January 9, 2027',
      eventDate: '2027-01-09',
      eventStartTime: '15:30',
      time: '3:30 PM – 4:45 PM',
      stage: 'Main Amphitheater Stage',
      location: 'St. Johns County Fairgrounds',
      price: 'Free Entry',
      priceSubtitle: 'Included with Admission',
      goingCount: '950+ going',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200',
      website: 'https://jimmyjambbqslam.com',
      spotifyUrl: 'https://open.spotify.com/playlist/2RGhCcMgYDuUnJo7hXNFd2?si=HrjflBeqQaCJzF7jHwibAw',
      ticketUrl: 'https://pci.jotform.com/form/260406377587163',
      description: 'The musical peak of the 11th Annual Jimmy Jam BBQ Slam! This headlining set builds energy right into the Grand Champion and People\'s Choice trophy presentations, filling the fairgrounds with soaring guitar hooks and crowd singalongs.',
      highlights: [
        'Massive festival sound and lighting rig',
        'Crowd favorites from classic Southern rock to modern country hits',
        'Leads directly into the BBQ Champion trophy announcements'
      ],
      avatars: [
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=120',
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120'
      ]
    }
  ], []);

  // Category filter buttons
  const categories = [
    { id: 'all', label: 'View all' },
    { id: 'bourbon', label: 'Bourbon & BBQ' },
    { id: 'mainstage', label: 'Main Stage' },
    { id: 'acoustic', label: 'Acoustic / Blues' },
    { id: 'favorites', label: `Favorites (${favoriteArtists.length})` }
  ];

  // Filtering
  const filteredArtists = useMemo(() => {
    return artists.filter(artist => {
      // Category filter
      if (selectedCategory === 'favorites') {
        if (!favoriteArtists.includes(artist.id)) return false;
      } else if (selectedCategory !== 'all') {
        if (artist.category !== selectedCategory) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mName = artist.name.toLowerCase().includes(q);
        const mGenre = artist.genre.toLowerCase().includes(q);
        const mDesc = artist.description.toLowerCase().includes(q);
        const mLoc = artist.location.toLowerCase().includes(q);
        if (!mName && !mGenre && !mDesc && !mLoc) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.displayName.localeCompare(b.displayName);
      if (sortBy === 'popular') return b.goingCount.localeCompare(a.goingCount);
      return a.eventDate.localeCompare(b.eventDate);
    });
  }, [artists, selectedCategory, searchQuery, sortBy, favoriteArtists]);

  // Share action
  const handleShare = async (artist) => {
    const text = `Check out ${artist.displayName} live at Jimmy Jam BBQ Slam!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: artist.displayName,
          text,
          url: artist.website || 'https://jimmyjambbqslam.com'
        });
      } catch {}
    } else {
      navigator.clipboard?.writeText(`${text} ${artist.website || 'https://jimmyjambbqslam.com'}`);
      setCopiedId(artist.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // ==========================================
  // DETAIL VIEW (Matches Right Screen in Reference)
  // ==========================================
  if (selectedArtist) {
    const isFav = favoriteArtists.includes(selectedArtist.id);
    const isOnSchedule = mySchedule.includes(selectedArtist.displayName) || mySchedule.includes(selectedArtist.name);

    return (
      <div className="relative -mx-4 -mt-8 pb-24 bg-[#0B0F19] text-white min-h-screen">
        {/* HERO IMAGE HEADER WITH OVERLAY */}
        <div className="relative w-full h-80 sm:h-96 overflow-hidden">
          <img
            src={selectedArtist.image}
            alt={selectedArtist.displayName}
            className="w-full h-full object-cover object-center"
          />
          {/* Multi-layer atmospheric gradient blend */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0B0F19]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/40 to-transparent" />

          {/* TOP NAV BAR OVER HERO */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
            <button
              onClick={() => setSelectedArtist(null)}
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              aria-label="Back to lineup"
            >
              <ChevronLeft size={22} />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleShare(selectedArtist)}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                aria-label="Share Artist"
              >
                {copiedId === selectedArtist.id ? <Check size={18} className="text-emerald-400" /> : <Share2 size={18} />}
              </button>

              <button
                onClick={() => toggleFavoriteArtist(selectedArtist.id)}
                className={`w-10 h-10 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center transition-all ${
                  isFav ? 'bg-red-500 text-white' : 'bg-black/50 text-white hover:text-red-400'
                }`}
                aria-label="Favorite Artist"
              >
                <Heart size={20} className={isFav ? 'fill-current text-white' : ''} />
              </button>
            </div>
          </div>

          {/* BADGE ON IMAGE */}
          <div className="absolute bottom-6 left-5 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg">
              <Radio size={12} className="animate-pulse" /> {selectedArtist.badge}
            </span>
          </div>
        </div>

        {/* CONTENT SHEET */}
        <div className="max-w-md mx-auto px-5 space-y-6 -mt-2 relative z-10">
          {/* TITLE & SUBTITLE */}
          <div className="space-y-1">
            <h1 className="font-display text-3xl sm:text-4xl tracking-wide uppercase text-white leading-tight">
              {selectedArtist.displayName}
            </h1>
            <p className="text-sm text-violet-300 font-medium">
              {selectedArtist.genre}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
              <MapPin size={13} className="text-violet-400 flex-shrink-0" />
              <span>{selectedArtist.location}</span>
            </div>
          </div>

          {/* 3 STATS PILLS ROW (Matches right screen in reference) */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Date
              </span>
              <p className="font-bold text-xs text-white">
                {selectedArtist.dateMonth} {selectedArtist.dateDay}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Location
              </span>
              <p className="font-bold text-xs text-white truncate">
                {selectedArtist.stage.split(' ')[0]}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Time
              </span>
              <p className="font-bold text-xs text-white">
                {selectedArtist.time.split('–')[0].trim()}
              </p>
            </div>
          </div>

          {/* ABOUT EVENT / BIO */}
          <div className="space-y-2">
            <h3 className="font-bold text-base text-white">About Event</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {selectedArtist.description}
            </p>
          </div>

          {/* HIGHLIGHTS */}
          {selectedArtist.highlights && (
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-violet-300">
                Performance Highlights
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedArtist.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-violet-400 text-sm leading-none">•</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AUDIO & LINKS */}
          <div className="flex gap-2.5">
            {selectedArtist.website && (
              <button
                onClick={() => openExternal(selectedArtist.website)}
                className="flex-1 py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <ExternalLink size={14} className="text-violet-400" />
                <span>Official Site</span>
              </button>
            )}

            {selectedArtist.spotifyUrl && (
              <button
                onClick={() => openExternal(selectedArtist.spotifyUrl)}
                className="flex-1 py-3 px-4 rounded-2xl bg-[#1DB954]/20 hover:bg-[#1DB954]/30 border border-[#1DB954]/40 text-xs font-bold text-[#1DB954] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Music size={14} />
                <span>Spotify Playlist</span>
              </button>
            )}
          </div>

          {/* ACTION BUTTONS: REMIND / CALENDAR */}
          <div className="flex gap-2">
            <button
              onClick={() => toggleMySchedule(selectedArtist.displayName)}
              className={`flex-1 py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                isOnSchedule
                  ? 'bg-violet-600/30 border-violet-500 text-violet-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Heart size={15} className={isOnSchedule ? 'fill-current text-violet-400' : ''} />
              <span>{isOnSchedule ? 'On My Schedule' : 'Save to Schedule'}</span>
            </button>

            <button
              onClick={() => addArtistToCalendar(selectedArtist)}
              className="py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-colors"
              title="Export to Calendar (.ics)"
            >
              <CalendarPlus size={16} />
              <span>Add to iCal</span>
            </button>
          </div>

          {/* STICKY BOTTOM ACTION CTA (Matches reference right screen) */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0B0F19]/90 backdrop-blur-md border-t border-slate-800 z-40">
            <div className="max-w-md mx-auto flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Admission</span>
                <p className="font-bold text-sm text-white">{selectedArtist.price}</p>
              </div>

              {selectedArtist.ticketUrl ? (
                <button
                  onClick={() => openExternal(selectedArtist.ticketUrl)}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Ticket size={16} />
                  <span>Get Tickets — {selectedArtist.price}</span>
                </button>
              ) : (
                <button
                  onClick={() => toggleMySchedule(selectedArtist.displayName)}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Check size={16} />
                  <span>{isOnSchedule ? 'Saved to Schedule' : 'Save to Schedule'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // LIST VIEW (Matches Left Screen in Reference)
  // ==========================================
  return (
    <div className="relative -mx-4 -mt-8 pb-20 bg-[#0B0F19] text-white min-h-screen">
      <div className="max-w-md mx-auto px-4 pt-4 space-y-5">

        {/* 1. TOP LOCATION & HEADER (Exact match with reference left screen) */}
        <div className="flex items-center justify-between pt-2 px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-900/40">
              <Flame size={20} className="text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block">
                Location
              </span>
              <div className="flex items-center gap-1 text-white font-bold text-sm">
                <span>Elkton, FL</span>
                <span className="text-violet-400 text-xs">▼</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveNav('schedule')}
              className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              aria-label="View Schedule"
            >
              <Calendar size={18} />
            </button>
          </div>
        </div>

        {/* 2. SEARCH & FILTER CONTROLS */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event"
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#141B2D] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={() => setSortBy(sortBy === 'date' ? 'popular' : 'date')}
            className={`p-3 rounded-2xl border transition-all ${
              sortBy === 'popular'
                ? 'bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-600/30'
                : 'bg-[#141B2D] text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
            aria-label="Filter"
            title={sortBy === 'popular' ? 'Sorted by popularity' : 'Sorted by date'}
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {/* 3. CATEGORY PILLS (Exact match with reference) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
                    : 'bg-[#141B2D] text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* SPOTIFY FESTIVAL PLAYLIST EMBED & CARD */}
        <div className="relative rounded-3xl p-4 bg-gradient-to-r from-[#121212] via-[#162719] to-[#0c2413] border border-[#1DB954]/50 shadow-2xl overflow-hidden group space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-[#1DB954] flex items-center justify-center text-black font-black text-2xl shadow-lg shadow-[#1DB954]/30 flex-shrink-0 group-hover:scale-105 transition-transform">
                <Music size={22} className="text-black" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1DB954]">
                    Official Festival Playlist
                  </span>
                </div>
                <h3 className="font-display text-lg tracking-wide uppercase text-white truncate">
                  Jimmy Jam Official
                </h3>
              </div>
            </div>

            <button
              onClick={() => openExternal('https://open.spotify.com/playlist/2RGhCcMgYDuUnJo7hXNFd2?si=HrjflBeqQaCJzF7jHwibAw')}
              className="px-4 py-2 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-extrabold text-xs tracking-wider uppercase shadow-md flex items-center gap-1.5 flex-shrink-0 active:scale-95 transition-all"
            >
              <span>Open App</span>
              <ExternalLink size={12} />
            </button>
          </div>

          {/* SPOTIFY EMBEDDED PLAYER IFRAME */}
          <div className="rounded-2xl overflow-hidden bg-black/40 border border-white/5 shadow-inner">
            <iframe
              style={{ borderRadius: '16px' }}
              src="https://open.spotify.com/embed/playlist/2RGhCcMgYDuUnJo7hXNFd2?utm_source=generator&theme=0"
              width="100%"
              height="152"
              frameBorder="0"
              allowFullScreen=""
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Jimmy Jam Official Spotify Playlist"
            />
          </div>
        </div>

        {/* 4. SECTION TITLE: "Upcoming events 245" + "Sort by" */}
        <div className="flex items-center justify-between px-1 pt-1">
          <div className="flex items-baseline gap-1.5">
            <h2 className="font-bold text-base text-white">Upcoming events</h2>
            <span className="text-[11px] font-bold text-violet-400">
              {filteredArtists.length}
            </span>
          </div>

          <button
            onClick={() => setSortBy(prev => prev === 'date' ? 'name' : prev === 'name' ? 'popular' : 'date')}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Sort by {sortBy}</span>
            <span className="text-[10px]">▼</span>
          </button>
        </div>

        {/* 5. ARTIST CARDS (Matches reference card design) */}
        <div className="space-y-4">
          {filteredArtists.length === 0 && (
            <div className="p-8 rounded-3xl bg-[#141B2D] border border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-violet-600/20 text-violet-400 mx-auto flex items-center justify-center">
                <Music size={22} />
              </div>
              <h3 className="font-bold text-base text-white">No Artists Found</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                {selectedCategory === 'favorites'
                  ? 'Tap the heart on any artist to add them to your favorites list!'
                  : 'Try searching for something else or switch category pills.'}
              </p>
              {selectedCategory === 'favorites' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="px-4 py-2 rounded-full bg-violet-600 text-white text-xs font-bold"
                >
                  View All Artists
                </button>
              )}
            </div>
          )}

          {filteredArtists.map((artist) => {
            const isFav = favoriteArtists.includes(artist.id);

            return (
              <div
                key={artist.id}
                className="group bg-[#141B2D] rounded-3xl p-4 border border-slate-800/80 shadow-xl hover:border-slate-700 transition-all overflow-hidden"
              >
                {/* PHOTO CONTAINER WITH FLOATING DATE BADGE */}
                <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden bg-slate-900 mb-3.5">
                  <img
                    src={artist.image}
                    alt={artist.displayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800';
                    }}
                  />

                  {/* Gradient shadow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141B2D] via-transparent to-transparent opacity-80" />

                  {/* FLOATING CALENDAR DATE BADGE (Matches reference card top-right badge) */}
                  <div className="absolute top-3 right-3 w-12 h-12 rounded-xl bg-white text-slate-950 flex flex-col items-center justify-center shadow-lg border border-white/80">
                    <span className="font-extrabold text-base leading-none">
                      {artist.dateDay}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-600 leading-none mt-0.5">
                      {artist.dateMonth}
                    </span>
                  </div>

                  {/* CATEGORY BADGE (Top Left) */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">
                      {artist.badge}
                    </span>
                  </div>
                </div>

                {/* ARTIST INFO ROW WITH HEART */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-display text-xl sm:text-2xl tracking-wide uppercase text-white leading-tight">
                    {artist.displayName}
                  </h3>

                  <button
                    onClick={() => toggleFavoriteArtist(artist.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
                    aria-label={isFav ? 'Unfavorite' : 'Favorite'}
                  >
                    <Heart size={20} className={isFav ? 'fill-current text-pink-500' : 'text-slate-400 hover:text-pink-400'} />
                  </button>
                </div>

                {/* LOCATION ROW */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                  <MapPin size={13} className="text-violet-400 flex-shrink-0" />
                  <span className="truncate">{artist.location}</span>
                </div>

                {/* ATTENDEE AVATARS & PRICE ROW (Exact match with reference) */}
                <div className="flex items-center justify-between pt-1 mb-3">
                  {/* Left: Overlapping avatars + count */}
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {artist.avatars.map((avatar, idx) => (
                        <img
                          key={idx}
                          src={avatar}
                          alt="Attendee"
                          className="w-7 h-7 rounded-full border-2 border-[#141B2D] object-cover"
                        />
                      ))}
                      <div className="w-7 h-7 rounded-full border-2 border-[#141B2D] bg-slate-800 flex items-center justify-center text-[9px] font-bold text-violet-300">
                        +95
                      </div>
                    </div>
                  </div>

                  {/* Right: Price label */}
                  <div className="text-right">
                    <span className="text-sm font-bold text-white">
                      {artist.price}
                    </span>
                  </div>
                </div>

                {/* FULL-WIDTH "READ MORE" PILL BUTTON (Matches reference) */}
                <button
                  onClick={() => setSelectedArtist(artist)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-900/30 transition-all active:scale-[0.98]"
                >
                  Read more
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
