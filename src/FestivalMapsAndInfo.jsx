import React, { useState, useMemo } from 'react';
import { Search, MapPin, Compass, Map, Info, Navigation, ExternalLink, X } from 'lucide-react';
import VenueMap from './VenueMap';

export default function FestivalMapsAndInfo({
  EVENT_LAT = 29.7707068,
  EVENT_LON = -81.4533597,
  EVENT_VENUE_NAME = 'St. Johns County Fairgrounds',
  EVENT_VENUE_ADDRESS = '5840 State Rd. 207, Elkton, FL 32145',
  EVENT_DATE_LABEL = 'January 9, 2027',
  openExternal = (url) => window.open(url, '_blank', 'noopener,noreferrer'),
  faqData = []
}) {
  const [activeTab, setActiveTab] = useState('gps'); // 'gps' | 'venue' | 'info'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openQuestionId, setOpenQuestionId] = useState('q-0'); // first item open by default like mockup

  // Flatten FAQ questions with 2-digit numbers for the mockup layout
  const allQuestions = useMemo(() => {
    const list = [];
    let counter = 1;

    faqData.forEach((section) => {
      section.qa.forEach((pair) => {
        list.push({
          id: `q-${counter - 1}`,
          num: String(counter).padStart(2, '0'),
          category: section.title.replace(/^[^\w\s]+/, '').trim(), // strip emoji for tag
          rawCategory: section.title,
          q: pair.q,
          a: pair.a,
          contact: section.contact
        });
        counter++;
      });
    });

    return list;
  }, [faqData]);

  // Extract categories
  const categories = useMemo(() => {
    const cats = ['all'];
    allQuestions.forEach((item) => {
      if (!cats.includes(item.category)) {
        cats.push(item.category);
      }
    });
    return cats;
  }, [allQuestions]);

  // Filter questions based on search query and category
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allQuestions, selectedCategory, searchQuery]);

  const toggleQuestion = (id) => {
    setOpenQuestionId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4 pb-28 -mx-4 px-4 bg-canvas min-h-screen text-slate-900">
      {/* HEADER */}
      <div className="pt-4 pb-1">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="font-display text-4xl tracking-wide uppercase text-slate-900">
              MAPS & INFO
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Fairgrounds navigation, interactive site layout & festival guide
            </p>
          </div>
          <span className="text-3xl">🗺️</span>
        </div>

        {/* TOP TABS NAVIGATION */}
        <div className="grid grid-cols-3 gap-2 mt-4 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('gps')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'gps'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass size={15} />
            <span>Wayfinding</span>
          </button>

          <button
            onClick={() => setActiveTab('venue')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'venue'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Map size={15} />
            <span>Site Layout</span>
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'info'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Info size={15} />
            <span>Venue Info</span>
          </button>
        </div>
      </div>

      {/* 🧭 TAB 1: WAYFINDING GPS MAP */}
      {activeTab === 'gps' && (
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md">
            <VenueMap venueLat={EVENT_LAT} venueLon={EVENT_LON} />
          </div>

          {/* VENUE CARD & DIRECTIONS */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-red-600 text-white flex items-center justify-center text-xl shadow-md">
                  <MapPin size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 leading-tight">
                    {EVENT_VENUE_NAME}
                  </h3>
                  <p className="text-xs text-slate-500">{EVENT_VENUE_ADDRESS}</p>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full">
                {EVENT_DATE_LABEL}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Explore key festival landmarks: VIP & General Parking, Judges Staging, Chili & BBQ cook arenas, Main Stage, Food Vendor Row, Car Show, and Kid Zone.
            </p>

            <button
              onClick={() =>
                openExternal(
                  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    EVENT_VENUE_NAME + ', ' + EVENT_VENUE_ADDRESS
                  )}`
                )
              }
              className="w-full py-3.5 rounded-xl font-black text-sm bg-red-600 hover:bg-red-700 text-white shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Navigation size={18} />
              GET DRIVING DIRECTIONS
            </button>
          </div>
        </div>
      )}

      {/* 🗺️ TAB 2: SITE LAYOUT MAP */}
      {activeTab === 'venue' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="font-bold text-base text-slate-900">Official Fairgrounds Map</h3>
                <p className="text-xs text-slate-500">Pinch or tap to inspect parking and arena zones</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-full text-slate-700">
                11th Annual
              </span>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative group">
              <img
                src="/map.png"
                alt="Official Jimmy Jam Site Layout Map"
                className="w-full h-auto object-contain cursor-zoom-in"
                onClick={() => openExternal('/map.png')}
              />
              <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[11px] font-medium flex items-center gap-1">
                <ExternalLink size={12} /> Open Full Size
              </div>
            </div>

            {/* Quick zone guide */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-900 block">🅿️ Parking Areas</span>
                <span className="text-slate-500 text-[11px]">Free General, VIP, Judges & Handicap</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-900 block">🌶️ Chili Arena</span>
                <span className="text-slate-500 text-[11px]">People's Choice tastings 11am–3pm</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-900 block">🍖 Pro & Backyard BBQ</span>
                <span className="text-slate-500 text-[11px]">Turn-ins & public tastings 2pm–4pm</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-900 block">🎸 Main Stage & Cars</span>
                <span className="text-slate-500 text-[11px]">Live music all day & 100+ car show</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ℹ️ TAB 3: VENUE INFO & FAQ (REDESIGNED TO MATCH MOCKUP IMAGE) */}
      {activeTab === 'info' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-6">
          {/* TOP HEADER MATCHING MOCKUP */}
          <div className="text-center pt-1 pb-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">FAQ's</h2>
            <p className="text-xs text-slate-500 mt-1">
              Everything you need to know about the Jimmy Jam BBQ Slam
            </p>
          </div>

          {/* SEARCH BAR MATCHING MOCKUP (Lavender/Violet Pill with Circle Search Icon) */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full pl-5 pr-14 py-3.5 rounded-full bg-[#ede9fe] text-slate-900 placeholder-[#7c3aed]/70 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] transition-all"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-[#7c3aed] flex items-center justify-center shadow-sm pointer-events-none">
              <Search size={18} strokeWidth={2.4} />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 p-1"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* CATEGORY FILTER CHIPS */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all capitalize ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Questions' : cat}
              </button>
            ))}
          </div>

          {/* NUMBERED ACCORDION LIST MATCHING MOCKUP */}
          <div className="space-y-6 pt-2">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p className="font-bold text-base">No questions found</p>
                <p className="text-xs mt-1">Try another search term or email jimmyjaminfo@gmail.com</p>
              </div>
            ) : (
              filteredQuestions.map((item) => {
                const isOpen = openQuestionId === item.id;

                return (
                  <div key={item.id} className="space-y-2 select-none">
                    {/* Number + Horizontal Line Row */}
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-2xl text-slate-900 tracking-tight min-w-[34px]">
                        {item.num}
                      </span>
                      <div className="flex-1 h-[2.5px] bg-slate-900 rounded-full" />
                    </div>

                    {/* Question Header & Toggle Button */}
                    <div className="pl-1">
                      <button
                        onClick={() => toggleQuestion(item.id)}
                        className="w-full flex items-start justify-between text-left group pt-1 pb-1"
                      >
                        <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-violet-700 transition-colors pr-4 leading-snug">
                          {item.q}
                        </h3>
                        <span className="text-2xl font-bold text-slate-900 leading-none pl-2 flex-shrink-0">
                          {isOpen ? '—' : '+'}
                        </span>
                      </button>

                      {/* Expanded Answer with Left Accent Line (Matching Mockup) */}
                      {isOpen && (
                        <div className="mt-2 ml-1 pl-4 border-l-[3px] border-slate-900 py-1 space-y-2 animate-fadeIn">
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {item.a}
                          </p>
                          {item.contact && (
                            <p className="text-xs text-slate-500 pt-1">
                              Need more help? Email{' '}
                              <a
                                href={`mailto:${item.contact}`}
                                className="text-violet-700 font-semibold underline"
                              >
                                {item.contact}
                              </a>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
