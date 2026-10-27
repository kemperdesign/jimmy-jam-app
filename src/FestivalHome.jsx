import React, { useState } from 'react';
import {
  Calendar,
  Camera,
  Users,
  Shirt,
  CloudSun,
  Music,
  Heart,
  HelpCircle,
  MapPin,
  BookOpen,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn
} from 'lucide-react';
import {
  BbqGrillBadge,
  CrossedCleaversBadge,
  BuyTicketsStampBadge,
  PerformersBadge,
  TastingBallotBadge,
  FestivalMapBadge
} from './BbqBadgeIcons';

const DEFENDING_CHAMPIONS = [
  {
    name: 'Maya Jane BBQ',
    subtitle: 'Defending Champ',
    division: 'PRO GRAND CHAMPION',
    badge: 'PRO GRAND',
    badgeBg: 'bg-amber-500 text-slate-950',
    src: '/winners/maya-jane-bbq-co-pro-grand-champion-2026.jpg',
    desc: '2026 Pro Grand Champions taking the top stage award at the 10th Annual Jimmy Jam BBQ Slam.'
  },
  {
    name: "Mike's Backyard",
    subtitle: 'Reserve Champ',
    division: 'BACKYARD RESERVE GRAND CHAMPION',
    badge: 'BACKYARD',
    badgeBg: 'bg-blue-600 text-white',
    src: '/winners/mikes-backyard-bbq-backyard-reserve-grand-champion-2026.jpg',
    desc: '2026 Backyard Reserve Grand Champions celebrated with their custom engraved trophy slab.'
  },
  {
    name: 'So So BBQ',
    subtitle: 'Public Favorite',
    division: "PEOPLE'S CHOICE WINNER",
    badge: "PEOPLE'S",
    badgeBg: 'bg-red-600 text-white',
    src: '/winners/so-so-bbq-peoples-choice-2026.jpg',
    desc: "2026 People's Choice Champion voted by festival-goers and public tasting token holders."
  }
];

export default function FestivalHome({
  setActiveNav,
  openExternal,
  EVENT_DATE_LABEL = 'January 9, 2027',
  EVENT_VENUE_NAME = 'St. Johns County Fairgrounds',
  setShowMoreMenu
}) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [enlargedIndex, setEnlargedIndex] = useState(null);

  return (
    <div className="relative -mx-4 -mt-8 px-4 pt-4 pb-12 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #98D2EB 0%, #CDE8F6 18%, #FBF8F1 42%, #FFFDF9 75%, #EAF3F9 100%)',
        minHeight: '100vh'
      }}
    >
      {/* BACKGROUND FESTIVAL SUNBURST / LIGHT GLOW ACCENT */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-25"
        style={{
          background: 'radial-gradient(circle, #FFE57F 0%, rgba(255,255,255,0) 70%)'
        }}
      />

      <div className="max-w-md mx-auto space-y-6 relative z-10">

        {/* 1. HERO VIDEO SECTION (Replacing old static badge with official video player) */}
        <div className="pt-1 space-y-2">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/90 bg-slate-950">
            {isVideoPlaying ? (
              <div className="relative w-full aspect-square bg-black">
                <iframe
                  src="https://player.vimeo.com/video/1149262629?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="absolute inset-0 w-full h-full border-0"
                  title="Jimmy Jam BBQ Slam 2026 Promo"
                />
                <button
                  onClick={() => setIsVideoPlaying(false)}
                  className="absolute top-2 right-2 bg-black/80 hover:bg-black text-white text-xs px-2.5 py-1 rounded-full font-bold z-20 backdrop-blur-sm flex items-center gap-1 cursor-pointer shadow-md"
                >
                  <X size={13} /> Close
                </button>
              </div>
            ) : (
              <div
                onClick={() => setIsVideoPlaying(true)}
                className="relative w-full aspect-square bg-black cursor-pointer group overflow-hidden"
              >
                {/* BBQ Video Preview Poster */}
                <img
                  src="/hero-bbq-video.png"
                  alt="Jimmy Jam BBQ Slam Video Preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                {/* Central Play Button matching video screenshot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center pl-1 shadow-[0_0_25px_rgba(220,38,38,0.7)] border-2 border-white group-hover:scale-110 active:scale-95 transition-all">
                    <Play size={26} fill="#FFFFFF" />
                  </div>
                </div>

                {/* Watch Promo pill in top corner */}
                <div className="absolute top-2.5 right-2.5">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 font-black text-[10px] tracking-wider uppercase border border-amber-400/40">
                    ▶ Watch Promo
                  </span>
                </div>

                {/* Title overlay at bottom of video card */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="font-display text-xl tracking-wider text-white drop-shadow leading-none">
                    JIMMY JAM BBQ SLAM
                  </p>
                  <p className="text-xs text-amber-300 font-semibold drop-shadow mt-1">
                    11th Annual Festival • {EVENT_DATE_LABEL}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Festival Date & Venue Pill */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-sm shadow-sm border border-amber-200/80 text-xs font-semibold tracking-wide text-amber-950">
              <MapPin size={13} className="text-red-600 flex-shrink-0" />
              <span>{EVENT_DATE_LABEL}</span>
              <span className="text-amber-400">•</span>
              <span>{EVENT_VENUE_NAME}</span>
            </div>
          </div>
        </div>

        {/* 2. FESTIVAL MARQUEE SHOWCASE (BBQ SLAM / BOURBON / BUY TICKETS) */}
        {/* Directly inspired by the Tanglefoot Festival curved marquee banners */}
        <div className="relative pt-3 pb-2">
          {/* Top Row: BBQ Banner on left + Circular BUY TICKETS badge on right */}
          <div className="relative flex items-center justify-between gap-2">
            
            {/* Left: BBQ SLAM Curved Marquee Banner */}
            <button
              onClick={() => setActiveNav('events')}
              className="group relative flex-1 text-left transform -rotate-2 hover:rotate-0 transition-transform duration-200"
            >
              <div
                className="relative overflow-hidden px-4 py-3 rounded-2xl shadow-lg border-2 border-white"
                style={{
                  background: 'linear-gradient(135deg, #1976D2 0%, #0D47A1 100%)',
                  boxShadow: '0 8px 20px -4px rgba(13, 71, 161, 0.45)'
                }}
              >
                {/* Marquee bulb dots along top and bottom edges */}
                <div className="flex justify-between items-center mb-1 px-1 opacity-90">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-200 animate-pulse shadow-sm" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-200" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-200" />
                </div>

                <div className="flex items-center gap-2.5">
                  <BbqGrillBadge className="w-10 h-10 flex-shrink-0 drop-shadow" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-sky-200 block">11th Annual</span>
                    <h3 className="font-display text-2xl tracking-wider text-white leading-none group-hover:text-amber-300 transition-colors">
                      BBQ SLAM
                    </h3>
                  </div>
                </div>

                {/* Bottom marquee bulb dots */}
                <div className="flex justify-between items-center mt-1 px-1 opacity-90">
                  <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-200" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-200 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                </div>
              </div>
            </button>

            {/* Right: Circular BUY TICKETS Stamp Badge (Tanglefoot layout signature) */}
            <button
              onClick={() => setActiveNav('tickets')}
              className="flex-shrink-0 transform rotate-3 hover:rotate-0 hover:scale-110 active:scale-95 transition-all duration-200 drop-shadow-xl"
              aria-label="Buy Event Tickets"
            >
              <BuyTicketsStampBadge className="w-24 h-24" />
            </button>
          </div>

        </div>

        {/* 3. FESTIVAL NOTCHED SWALLOWTAIL RIBBON STACK */}
        {/* Core navigation inspired by the stacked festival ribbons in Tanglefoot */}
        <div className="space-y-2.5 pt-2">
          
          {/* Ribbon 1: PERFORMERS & LINE UP (Navy Ribbon) */}
          <button
            onClick={() => setActiveNav('artists')}
            className="group w-full relative py-3 px-6 text-center transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 drop-shadow-md"
            style={{
              background: 'linear-gradient(90deg, #102038 0%, #1E3A5F 50%, #102038 100%)',
              clipPath: 'polygon(14px 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 14px 100%, 0% 50%)',
              borderTop: '1.5px solid rgba(255,255,255,0.4)',
              borderBottom: '1.5px solid rgba(0,0,0,0.3)'
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-amber-300 text-xs">★</span>
              <PerformersBadge className="w-6 h-6 inline-block drop-shadow" />
              <span className="font-display text-xl sm:text-2xl tracking-widest text-white uppercase drop-shadow-sm group-hover:text-amber-300 transition-colors">
                PERFORMERS LINE UP
              </span>
              <span className="text-amber-300 text-xs">★</span>
            </div>
          </button>

          {/* Ribbon 2: EVENT SCHEDULE (Sky Blue Ribbon) */}
          <button
            onClick={() => setActiveNav('schedule')}
            className="group w-full relative py-3 px-6 text-center transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 drop-shadow-md"
            style={{
              background: 'linear-gradient(90deg, #1E88E5 0%, #42A5F5 50%, #1E88E5 100%)',
              clipPath: 'polygon(14px 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 14px 100%, 0% 50%)',
              borderTop: '1.5px solid rgba(255,255,255,0.5)',
              borderBottom: '1.5px solid rgba(0,0,0,0.2)'
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-white text-xs">★</span>
              <Calendar className="w-5 h-5 text-white drop-shadow inline-block" />
              <span className="font-display text-xl sm:text-2xl tracking-widest text-white uppercase drop-shadow-sm group-hover:text-yellow-200 transition-colors">
                EVENT SCHEDULE
              </span>
              <span className="text-white text-xs">★</span>
            </div>
          </button>

          {/* Ribbon 3: BBQ TASTING BALLOT (Festival Red Ribbon) */}
          <button
            onClick={() => setActiveNav('ballot')}
            className="group w-full relative py-3 px-6 text-center transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 drop-shadow-md"
            style={{
              background: 'linear-gradient(90deg, #C62828 0%, #E53935 50%, #C62828 100%)',
              clipPath: 'polygon(14px 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 14px 100%, 0% 50%)',
              borderTop: '1.5px solid rgba(255,255,255,0.4)',
              borderBottom: '1.5px solid rgba(0,0,0,0.3)'
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-amber-300 text-xs">★</span>
              <TastingBallotBadge className="w-6 h-6 inline-block drop-shadow" />
              <span className="font-display text-xl sm:text-2xl tracking-widest text-white uppercase drop-shadow-sm group-hover:text-yellow-200 transition-colors">
                BBQ TASTING BALLOT (VOTE)
              </span>
              <span className="text-amber-300 text-xs">★</span>
            </div>
          </button>

          {/* Ribbon 4: FESTIVAL MAP (Navy / Deep Blue Ribbon) */}
          <button
            onClick={() => setActiveNav('maps')}
            className="group w-full relative py-3 px-6 text-center transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 drop-shadow-md"
            style={{
              background: 'linear-gradient(90deg, #0D47A1 0%, #1976D2 50%, #0D47A1 100%)',
              clipPath: 'polygon(14px 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 14px 100%, 0% 50%)',
              borderTop: '1.5px solid rgba(255,255,255,0.4)',
              borderBottom: '1.5px solid rgba(0,0,0,0.3)'
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-cyan-200 text-xs">★</span>
              <FestivalMapBadge className="w-6 h-6 inline-block drop-shadow" />
              <span className="font-display text-xl sm:text-2xl tracking-widest text-white uppercase drop-shadow-sm group-hover:text-cyan-200 transition-colors">
                FESTIVAL VENUE MAP
              </span>
              <span className="text-cyan-200 text-xs">★</span>
            </div>
          </button>

          {/* Ribbon 5: PHOTO GALLERY (Warm Amber / BBQ Gold Ribbon) */}
          <button
            onClick={() => setActiveNav('photos')}
            className="group w-full relative py-3 px-6 text-center transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 drop-shadow-md"
            style={{
              background: 'linear-gradient(90deg, #E65100 0%, #F57C00 50%, #E65100 100%)',
              clipPath: 'polygon(14px 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 14px 100%, 0% 50%)',
              borderTop: '1.5px solid rgba(255,255,255,0.4)',
              borderBottom: '1.5px solid rgba(0,0,0,0.3)'
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-yellow-100 text-xs">★</span>
              <Camera className="w-5 h-5 text-white drop-shadow inline-block" />
              <span className="font-display text-xl sm:text-2xl tracking-widest text-white uppercase drop-shadow-sm group-hover:text-yellow-200 transition-colors">
                PHOTO GALLERY
              </span>
              <span className="text-yellow-100 text-xs">★</span>
            </div>
          </button>
        </div>

        {/* 2026 DEFENDING CHAMPIONS SHOWCASE */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2 px-1">
            <h4 className="font-display text-lg tracking-wider text-slate-800 uppercase flex items-center gap-1.5">
              <span>🏆</span> 2026 DEFENDING CHAMPIONS
            </h4>
            <span className="text-[11px] font-bold text-amber-700 uppercase">
              10th Annual Winners
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {DEFENDING_CHAMPIONS.map((champ, idx) => (
              <button
                key={champ.name}
                type="button"
                onClick={() => setEnlargedIndex(idx)}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col group text-left cursor-pointer hover:border-amber-400 hover:shadow-md transition-all active:scale-95 focus:outline-none"
                aria-label={`Enlarge photo: ${champ.name} - ${champ.division}`}
              >
                <div className="relative aspect-square overflow-hidden bg-slate-900">
                  <img
                    src={champ.src}
                    alt={`${champ.name} - ${champ.division}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className={`absolute top-1 left-1 ${champ.badgeBg} font-black text-[9px] px-1.5 py-0.5 rounded shadow`}>
                    {champ.badge}
                  </span>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="p-1.5 rounded-full bg-black/70 text-white shadow-lg backdrop-blur-sm">
                      <ZoomIn size={14} />
                    </span>
                  </div>
                </div>
                <div className="p-2 text-center flex-1 flex flex-col justify-between">
                  <p className="font-bold text-xs text-slate-900 leading-tight">{champ.name}</p>
                  <p className={`text-[10px] font-semibold mt-0.5 ${
                    idx === 0 ? 'text-amber-700' : idx === 1 ? 'text-blue-700' : 'text-red-600'
                  }`}>
                    {champ.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 4. FESTIVAL TICKET BLOCKS (2-COLUMN GRID) */}
        {/* Matches the 2-column ticket block grid at the bottom of the Tanglefoot layout */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2 px-1">
            <h4 className="font-display text-lg tracking-wider text-slate-700 uppercase">
              EXPLORE MORE
            </h4>
            <button
              onClick={() => setActiveNav('guide')}
              className="text-[11px] font-bold text-amber-700 hover:text-amber-900 underline uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              FESTIVAL GUIDE →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* OFFICIAL FESTIVAL GUIDE */}
            <button
              onClick={() => setActiveNav('guide')}
              className="group flex flex-col items-center justify-center p-3.5 rounded-xl bg-white/95 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-red-400 active:scale-95 transition-all text-center col-span-2 bg-gradient-to-r from-red-50 to-amber-50"
            >
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5 text-red-700" />
              </div>
              <span className="font-display text-base tracking-wider text-slate-900 uppercase block leading-none">
                OFFICIAL FESTIVAL GUIDE
              </span>
              <span className="text-[10px] text-slate-600 font-medium mt-1">Hours, tokens, parking, rules & A–Z info</span>
            </button>

            {/* SPONSORS / PARTNERS */}
            <button
              onClick={() => setActiveNav('sponsors')}
              className="group flex flex-col items-center justify-center p-3.5 rounded-xl bg-white/95 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-amber-400 active:scale-95 transition-all text-center"
            >
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mb-1.5 group-hover:bg-amber-100 transition-colors">
                <Users className="w-5 h-5 text-amber-700" />
              </div>
              <span className="font-display text-base tracking-wider text-slate-800 uppercase block leading-none">
                SPONSORS
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-1">Meet our partners</span>
            </button>

            {/* FAQs */}
            <button
              onClick={() => setActiveNav('faq')}
              className="group flex flex-col items-center justify-center p-3.5 rounded-xl bg-white/95 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-sky-400 active:scale-95 transition-all text-center"
            >
              <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center mb-1.5 group-hover:bg-sky-100 transition-colors">
                <HelpCircle className="w-5 h-5 text-sky-700" />
              </div>
              <span className="font-display text-base tracking-wider text-slate-800 uppercase block leading-none">
                FAQS
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-1">Got questions?</span>
            </button>

            {/* WEATHER */}
            <button
              onClick={() => setActiveNav('weather')}
              className="group flex flex-col items-center justify-center p-3.5 rounded-xl bg-white/95 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-amber-400 active:scale-95 transition-all text-center"
            >
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-1.5 group-hover:bg-orange-100 transition-colors">
                <CloudSun className="w-5 h-5 text-orange-600" />
              </div>
              <span className="font-display text-base tracking-wider text-slate-800 uppercase block leading-none">
                WEATHER
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-1">Event forecast</span>
            </button>

            {/* SWAG & MERCH */}
            <button
              onClick={() => setActiveNav('swag')}
              className="group flex flex-col items-center justify-center p-3.5 rounded-xl bg-white/95 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-red-400 active:scale-95 transition-all text-center"
            >
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-1.5 group-hover:bg-red-100 transition-colors">
                <Shirt className="w-5 h-5 text-red-600" />
              </div>
              <span className="font-display text-base tracking-wider text-slate-800 uppercase block leading-none">
                SWAG STORE
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-1">Shirts, caps & gear</span>
            </button>

            {/* RECIPES */}
            <button
              onClick={() => setActiveNav('recipes')}
              className="group flex flex-col items-center justify-center p-3.5 rounded-xl bg-white/95 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-amber-400 active:scale-95 transition-all text-center"
            >
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mb-1.5 group-hover:bg-amber-100 transition-colors">
                <CrossedCleaversBadge className="w-7 h-7 flex-shrink-0 drop-shadow-sm" />
              </div>
              <span className="font-display text-base tracking-wider text-slate-800 uppercase block leading-none">
                RECIPES
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-1">Pitmaster secrets</span>
            </button>

            {/* FESTIVAL SOUNDS / SPOTIFY PLAYLIST */}
            <button
              onClick={() => openExternal('https://open.spotify.com/playlist/2RGhCcMgYDuUnJo7hXNFd2?si=HrjflBeqQaCJzF7jHwibAw')}
              className="group flex flex-col items-center justify-center p-3.5 rounded-xl bg-white/95 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-purple-400 active:scale-95 transition-all text-center"
            >
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mb-1.5 group-hover:bg-purple-100 transition-colors">
                <Music className="w-5 h-5 text-purple-700" />
              </div>
              <span className="font-display text-base tracking-wider text-slate-800 uppercase block leading-none">
                PLAYLISTS
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-1">BBQ vibes & tunes</span>
            </button>
          </div>
        </div>

        {/* 5. JIMMY JAM COMMUNITY OUTREACH - CHARITABLE MISSION */}
        {/* Warm, welcoming card highlighting Jimmy Jam's 501(c)(3) mission */}
        <div
          className="relative rounded-2xl p-5 shadow-md border-2 border-amber-300/80 overflow-hidden text-center"
          style={{
            background: 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)'
          }}
        >
          {/* Subtle watermark heart */}
          <Heart className="absolute -right-4 -bottom-4 w-28 h-28 text-amber-500/10 pointer-events-none" />

          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-sm">
              <Heart size={14} fill="#FFFFFF" /> 501(c)(3) Community Outreach
            </div>

            <h3 className="font-display text-2xl tracking-wide text-amber-950">
              HELPING LOCAL FAMILIES IN NEED
            </h3>

            <p className="text-xs text-amber-900 leading-relaxed max-w-sm mx-auto">
              100% of event proceeds directly help local families facing medical expenses and life challenges.
            </p>

            <div className="pt-2">
              <button
                onClick={() => setActiveNav('assistance')}
                className="w-full py-3 px-6 rounded-xl font-display text-lg tracking-wider uppercase text-white shadow-md transform hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(90deg, #E65100 0%, #D84315 100%)'
                }}
              >
                <Heart size={18} fill="#FFFFFF" /> APPLY FOR ASSISTANCE
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* FULLSCREEN ENLARGED WINNER LIGHTBOX */}
      {enlargedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 animate-in fade-in duration-200"
          onClick={() => setEnlargedIndex(null)}
        >
          {/* Top Bar with Title and Close Button */}
          <div className="flex items-center justify-between z-10 pt-2 px-2 max-w-2xl mx-auto w-full" onClick={(e) => e.stopPropagation()}>
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${DEFENDING_CHAMPIONS[enlargedIndex].badgeBg} shadow-lg`}>
              {DEFENDING_CHAMPIONS[enlargedIndex].division}
            </span>
            <button
              onClick={() => setEnlargedIndex(null)}
              className="text-white bg-white/10 hover:bg-white/20 active:scale-95 rounded-full p-2.5 transition-all border border-white/20 shadow-lg cursor-pointer"
              aria-label="Close enlarged photo"
            >
              <X size={24} />
            </button>
          </div>

          {/* Centered Enlarged Image with Next/Prev Nav */}
          <div
            className="flex-1 flex items-center justify-center p-2 relative my-auto max-h-[75vh] max-w-2xl mx-auto w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setEnlargedIndex((prev) => (prev > 0 ? prev - 1 : DEFENDING_CHAMPIONS.length - 1))}
              className="absolute left-1 sm:left-4 z-20 text-white bg-black/70 hover:bg-black/90 active:scale-95 rounded-full p-3 transition-all border border-white/20 shadow-xl cursor-pointer"
              aria-label="Previous photo"
            >
              <ChevronLeft size={28} />
            </button>

            <img
              src={DEFENDING_CHAMPIONS[enlargedIndex].src}
              alt={DEFENDING_CHAMPIONS[enlargedIndex].name}
              className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />

            <button
              onClick={() => setEnlargedIndex((prev) => (prev < DEFENDING_CHAMPIONS.length - 1 ? prev + 1 : 0))}
              className="absolute right-1 sm:right-4 z-20 text-white bg-black/70 hover:bg-black/90 active:scale-95 rounded-full p-3 transition-all border border-white/20 shadow-xl cursor-pointer"
              aria-label="Next photo"
            >
              <ChevronRight size={28} />
            </button>
          </div>

          {/* Bottom Caption & Counter */}
          <div
            className="text-center text-white pb-4 px-4 z-10 max-w-md mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl sm:text-2xl font-bold font-display tracking-wider text-amber-300">
              {DEFENDING_CHAMPIONS[enlargedIndex].name}
            </h3>
            <p className="text-neutral-300 text-xs sm:text-sm mt-1 leading-relaxed">
              {DEFENDING_CHAMPIONS[enlargedIndex].desc}
            </p>
            <p className="text-neutral-400 text-[11px] font-semibold tracking-wider uppercase mt-2">
              Photo {enlargedIndex + 1} of {DEFENDING_CHAMPIONS.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
