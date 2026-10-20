import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Share2,
  Search,
  Filter,
  Flame,
  Trophy,
  ChevronRight,
  ChevronLeft,
  CalendarPlus,
  Check,
  Ticket
} from 'lucide-react';
import { BbqGrillBadge, BourbonBadge, PerformersBadge } from './BbqBadgeIcons';

export default function FestivalSchedule({
  mySchedule = [],
  toggleMySchedule,
  openExternal,
  setActiveNav,
  EVENT_DATE_LABEL = 'January 9, 2027',
  EVENT_VENUE_NAME = 'St. Johns County Fairgrounds'
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [copiedEvent, setCopiedEvent] = useState(null);

  // All confirmed Jimmy Jam events with rich metadata & real photos
  const allEvents = useMemo(() => [
    {
      id: 'cornhole-signup',
      date: 'Jan 9, 2027',
      dateGroup: 'Main Event — Jan 9, 2027',
      time: '10:00 AM',
      title: 'Cornhole Tournament Sign-Ups Open',
      desc: 'Blind draw format. Limited brackets available on-site — sign up early at the tournament tent.',
      category: 'tournaments',
      categoryLabel: 'Tournament',
      location: EVENT_VENUE_NAME,
      priceLabel: '$25 / person',
      image: '/images/event-photos/dji_20260110141907_0933_d.jpg',
      icon: '🌽',
      featured: false,
      ticketUrl: 'https://pci.jotform.com/form/260406377587163'
    },
    {
      id: 'cornhole-start',
      date: 'Jan 9, 2027',
      dateGroup: 'Main Event — Jan 9, 2027',
      time: '11:00 AM',
      title: 'Cornhole Tournament Starts',
      desc: 'Tournament throws off! Spectators welcome. Trophies & cash prizes awarded to top teams.',
      category: 'tournaments',
      categoryLabel: 'Tournament',
      location: EVENT_VENUE_NAME,
      priceLabel: 'Free to Watch',
      image: '/images/event-photos/dsc08399.jpg',
      icon: '🌽',
      featured: false
    },
    {
      id: 'chili-chowder',
      date: 'Jan 9, 2027',
      dateGroup: 'Main Event — Jan 9, 2027',
      time: '11:00 AM – 3:00 PM',
      title: 'Chili & Chowder People’s Choice Tasting',
      desc: 'Sample mouthwatering creations from 15+ competing teams. Cast your token vote for the crowd favorite!',
      category: 'tastings',
      categoryLabel: 'BBQ & Tastings',
      location: 'Tasting Pavilion • Fairgrounds',
      priceLabel: '$1 Tokens',
      image: '/images/event-photos/dsc08414.jpg',
      icon: '🌶️',
      featured: true,
      ticketUrl: 'https://pci.jotform.com/form/260406377587163'
    },
    {
      id: 'car-show',
      date: 'Jan 9, 2027',
      dateGroup: 'Main Event — Jan 9, 2027',
      time: '11:00 AM – 3:30 PM',
      title: 'Classic Car, Truck & Motorcycle Show',
      desc: 'Dozens of vintage hot rods, custom trucks, and classic motorcycles on display with awards in multiple categories.',
      category: 'tournaments',
      categoryLabel: 'Car Show',
      location: 'Midway Grounds • Fairgrounds',
      priceLabel: '$20 Pre-reg / $25 Day-of',
      image: '/images/event-photos/dsc08387.jpg',
      icon: '🚗',
      featured: false,
      ticketUrl: 'https://form.jotform.com/jimmyjammarketing1/car-show-entry-form'
    },
    {
      id: 'live-music-main',
      date: 'Jan 9, 2027',
      dateGroup: 'Main Event — Jan 9, 2027',
      time: '11:30 AM – 5:00 PM',
      title: 'Live Music: Regional Country & Blues Showcase',
      desc: 'Non-stop live music all afternoon on the covered main stage featuring favorite local and regional artists.',
      category: 'music',
      categoryLabel: 'Live Music',
      location: 'Main Amphitheater Stage',
      priceLabel: 'Included with Admission',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
      icon: '🎸',
      featured: true
    },
    {
      id: 'bbq-tasting',
      date: 'Jan 9, 2027',
      dateGroup: 'Main Event — Jan 9, 2027',
      time: '2:00 PM – 4:00 PM',
      title: 'BBQ People’s Choice Tasting (60+ Teams)',
      desc: 'The main event! Sample ribs, pulled pork, and brisket from over 60 championship BBQ teams and crown the 2027 champion.',
      category: 'tastings',
      categoryLabel: 'BBQ & Tastings',
      location: 'Pitmaster Row • Fairgrounds',
      priceLabel: '$1 Tokens',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800',
      icon: '🍖',
      featured: true,
      ticketUrl: 'https://pci.jotform.com/form/260406377587163'
    },
    {
      id: 'awards-ceremony',
      date: 'Jan 9, 2027',
      dateGroup: 'Main Event — Jan 9, 2027',
      time: '4:30 PM',
      title: 'Awards Ceremony & Trophy Presentation',
      desc: 'Presentation of Grand Champion, Reserve Champion, and People\'s Choice trophies across all BBQ, Chili, and Car Show categories.',
      category: 'tastings',
      categoryLabel: 'Awards',
      location: 'Main Stage',
      priceLabel: 'Free to Attend',
      image: '/images/event-photos/dsc08471.jpg',
      icon: '🏆',
      featured: false
    },
    {
      id: 'bourbon-cocktail',
      date: 'Oct 17, 2026',
      dateGroup: 'Bourbon & BBQ Dinner — Oct 17, 2026',
      time: '6:00 PM – 7:00 PM',
      title: 'Welcome Cocktail & Hors d’oeuvres',
      desc: 'Signature welcome bourbon cocktail, appetizers, and silent auction viewing on the outdoor patio.',
      category: 'bourbon',
      categoryLabel: 'Bourbon Dinner',
      location: 'The Tringali Barn Patio',
      priceLabel: 'Dinner Ticket Required',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
      icon: '🥂',
      featured: false
    },
    {
      id: 'bourbon-dinner',
      date: 'Oct 17, 2026',
      dateGroup: 'Bourbon & BBQ Dinner — Oct 17, 2026',
      time: '7:00 PM',
      title: '3rd Annual Bourbon & BBQ Charity Dinner',
      desc: 'A premier culinary evening featuring a multi-course dinner prepared by 2-Time World Champion Kings BBQ and curated bourbon pairings.',
      category: 'bourbon',
      categoryLabel: 'Bourbon Dinner',
      location: 'The Tringali Barn',
      priceLabel: '$100 / person',
      image: 'https://images.unsplash.com/photo-1527030280862-64139fba04ca?auto=format&fit=crop&q=80&w=800',
      icon: '🥃',
      featured: true,
      ticketUrl: 'https://pci.jotform.com/form/262125277149156'
    },
    {
      id: 'futch-brothers',
      date: 'Oct 17, 2026',
      dateGroup: 'Bourbon & BBQ Dinner — Oct 17, 2026',
      time: '8:15 PM – 10:00 PM',
      title: 'Live Music: The Futch Brothers Band',
      desc: 'Live patio concert by singer-songwriter Brian Futch and band playing country, rock, blues, and Americana originals + bourbon raffle drawing.',
      category: 'music',
      categoryLabel: 'Live Music',
      location: 'The Tringali Barn Patio',
      priceLabel: 'Included with Dinner',
      image: 'https://images.zoogletools.com/s:bzglfiles/u/188709/0fadb2caa1a76a2c326d930c9511749d8c4dbf86/original/photo-output-4.jpeg/!!/b%3AW1sicmVzaXplIiwxODAwXSxbIm1heCJdLFsid2UiXV0%3D/meta%3AeyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ%3D%3D.jpg',
      icon: '🎸',
      featured: true
    }
  ], [EVENT_VENUE_NAME]);

  // Featured Hero Carousel items
  const featuredCards = useMemo(() => [
    {
      badge: 'Main Festival',
      title: '11th Annual BBQ Slam & Music Fest',
      subtitle: '60+ BBQ Teams, Chili Tasting, Car Show & All-Day Music',
      date: EVENT_DATE_LABEL,
      venue: EVENT_VENUE_NAME,
      cta: 'Get Tasting Tickets',
      action: () => setActiveNav('tickets'),
      gradient: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #1D4ED8 100%)',
      photo: '/images/event-photos/dsc08414.jpg'
    },
    {
      badge: 'Charity Evening',
      title: '3rd Annual Bourbon & BBQ Dinner',
      subtitle: 'Kings BBQ Dinner, Curated Bourbon & The Futch Brothers Band',
      date: 'Saturday, October 17, 2026',
      venue: 'The Tringali Barn • Elkton, FL',
      cta: 'Reserve Dinner ($100)',
      action: () => openExternal('https://pci.jotform.com/form/262125277149156'),
      gradient: 'linear-gradient(135deg, #7C2D12 0%, #EA580C 50%, #C2410C 100%)',
      photo: 'https://images.zoogletools.com/s:bzglfiles/u/188709/0fadb2caa1a76a2c326d930c9511749d8c4dbf86/original/photo-output-4.jpeg/!!/b%3AW1sicmVzaXplIiwxODAwXSxbIm1heCJdLFsid2UiXV0%3D/meta%3AeyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ%3D%3D.jpg'
    },
    {
      badge: 'Tournaments',
      title: 'Cornhole & Classic Car Show',
      subtitle: '$25 Blind Draw Cornhole + Vintage Cars & Motorcycles',
      date: 'Saturday, January 9, 2027',
      venue: EVENT_VENUE_NAME,
      cta: 'Register to Compete',
      action: () => setActiveNav('tickets'),
      gradient: 'linear-gradient(135deg, #065F46 0%, #059669 50%, #047857 100%)',
      photo: '/images/event-photos/dsc08387.jpg'
    }
  ], [EVENT_DATE_LABEL, EVENT_VENUE_NAME, setActiveNav, openExternal]);

  // Categories for horizontal pill filters
  const categories = [
    { id: 'all', label: 'All Events', icon: Flame },
    { id: 'tastings', label: 'BBQ & Tastings', icon: BbqGrillBadge, isCustomIcon: true },
    { id: 'music', label: 'Live Music', icon: PerformersBadge, isCustomIcon: true },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'bourbon', label: 'Bourbon Dinner', icon: BourbonBadge, isCustomIcon: true },
    { id: 'my', label: `My Schedule (${mySchedule.length})`, icon: Heart }
  ];

  // Filtering logic
  const filteredEvents = useMemo(() => {
    return allEvents.filter(ev => {
      // Category filter
      if (selectedCategory === 'my') {
        if (!mySchedule.includes(ev.title)) return false;
      } else if (selectedCategory !== 'all') {
        if (ev.category !== selectedCategory) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = ev.title.toLowerCase().includes(q);
        const matchDesc = ev.desc.toLowerCase().includes(q);
        const matchLoc = ev.location.toLowerCase().includes(q);
        const matchCat = ev.categoryLabel.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchLoc && !matchCat) return false;
      }

      return true;
    });
  }, [allEvents, selectedCategory, searchQuery, mySchedule]);

  // Group events by date
  const groupedEvents = useMemo(() => {
    const groups = {};
    filteredEvents.forEach(ev => {
      if (!groups[ev.dateGroup]) groups[ev.dateGroup] = [];
      groups[ev.dateGroup].push(ev);
    });
    return groups;
  }, [filteredEvents]);

  // Share event
  const shareEvent = async (event) => {
    const text = `${event.title} at Jimmy Jam — ${event.time} (${event.location})`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text,
          url: 'https://jimmyjambbqslam.com'
        });
      } catch {}
    } else {
      navigator.clipboard?.writeText(`${text} https://jimmyjambbqslam.com`);
      setCopiedEvent(event.id);
      setTimeout(() => setCopiedEvent(null), 2000);
    }
  };

  // Add event to calendar (.ics download)
  const addToCalendar = (event) => {
    const isOct = event.dateGroup.includes('Oct');
    const dateStr = isOct ? '20261017' : '20270109';
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Jimmy Jam Community Outreach//Event App//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.desc.replace(/,/g, '\\,')}`,
      `LOCATION:${event.location}`,
      `DTSTART:${dateStr}T120000Z`,
      `DTEND:${dateStr}T160000Z`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.id}-jimmy-jam.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeFeatured = featuredCards[featuredIndex];

  return (
    <div className="relative -mx-4 -mt-8 px-4 pt-4 pb-16 bg-slate-50 min-h-screen">
      <div className="max-w-md mx-auto space-y-5">

        {/* 1. TOP LOCATION & HEADER (matches @kayla_uiux_design style) */}
        <div className="flex items-center justify-between pt-2 px-1">
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 block">
              Event Venue
            </span>
            <div className="flex items-center gap-1.5 text-slate-800 font-bold text-sm">
              <MapPin size={16} className="text-red-600 flex-shrink-0" />
              <span className="truncate max-w-[240px]">Elkton, FL • St. Johns Fairgrounds</span>
            </div>
          </div>

          {/* Quick Schedule Count Pill */}
          <button
            onClick={() => setSelectedCategory('my')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border transition-all ${
              selectedCategory === 'my'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-slate-700 border-slate-200 hover:border-red-300'
            }`}
          >
            <Heart size={14} className={mySchedule.length > 0 ? 'fill-current text-red-500' : ''} />
            <span>Saved ({mySchedule.length})</span>
          </button>
        </div>

        {/* 2. SEARCH & FILTER BAR */}
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schedule, tastings, music..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full"
              >
                Clear
              </button>
            )}
          </div>
          <button
            onClick={() => setSelectedCategory(selectedCategory === 'all' ? 'tastings' : 'all')}
            className={`p-3 rounded-2xl border transition-all shadow-sm ${
              selectedCategory !== 'all'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            aria-label="Filter"
          >
            <Filter size={18} />
          </button>
        </div>

        {/* 3. FEATURED EVENTS CAROUSEL (Hero Banner Card) */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="font-bold text-base text-slate-900">Featured Events</h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFeaturedIndex(prev => (prev - 1 + featuredCards.length) % featuredCards.length)}
                className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors shadow-sm"
                aria-label="Previous Featured Event"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setFeaturedIndex(prev => (prev + 1) % featuredCards.length)}
                className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors shadow-sm"
                aria-label="Next Featured Event"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Featured Card */}
          <div
            className="relative rounded-3xl p-5 text-white shadow-xl overflow-hidden min-h-[190px] flex flex-col justify-between transition-all duration-300"
            style={{ background: activeFeatured.gradient }}
          >
            {/* Background image overlay with soft gradient blend */}
            {activeFeatured.photo && (
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 pointer-events-none overflow-hidden">
                <img
                  src={activeFeatured.photo}
                  alt=""
                  className="w-full h-full object-cover mask-radial"
                  style={{ maskImage: 'linear-gradient(to right, transparent, black)' }}
                />
              </div>
            )}

            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-semibold text-white tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {activeFeatured.badge}
              </div>

              <h3 className="font-display text-2xl tracking-wide leading-tight max-w-[280px]">
                {activeFeatured.title}
              </h3>

              <div className="space-y-1 text-xs text-white/90">
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="opacity-80 flex-shrink-0" />
                  <span>{activeFeatured.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} className="opacity-80 flex-shrink-0" />
                  <span className="truncate max-w-[220px]">{activeFeatured.venue}</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 flex items-center justify-between">
              <button
                onClick={activeFeatured.action}
                className="px-5 py-2 rounded-full bg-white text-slate-900 font-bold text-xs tracking-wide shadow-md hover:bg-slate-100 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Ticket size={14} className="text-blue-600" />
                {activeFeatured.cta}
              </button>

              {/* Dot Indicators */}
              <div className="flex items-center gap-1.5">
                {featuredCards.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setFeaturedIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === featuredIndex ? 'w-5 bg-white' : 'w-2 bg-white/40'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. EXPLORE CATEGORIES (HORIZONTAL PILL CHIPS) */}
        <div>
          <div className="flex items-center justify-between mb-2.5 px-1">
            <h2 className="font-bold text-base text-slate-900">Explore Categories</h2>
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              See All
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-blue-200 shadow-md scale-105'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat.isCustomIcon ? (
                    <BbqGrillBadge className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <Icon size={15} className={isSelected ? 'text-white' : 'text-slate-500'} />
                  )}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. UPCOMING EVENTS (EVENT CARD LIST) */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="font-bold text-base text-slate-900">
              {selectedCategory === 'my' ? 'My Saved Schedule' : 'Upcoming Schedule'}
            </h2>
            <span className="text-xs font-semibold text-slate-400">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
            </span>
          </div>

          {/* Empty state for search or saved schedule */}
          {filteredEvents.length === 0 && (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center shadow-sm space-y-3">
              <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center">
                <Heart size={26} />
              </div>
              <h3 className="font-bold text-base text-slate-800">
                {selectedCategory === 'my' ? 'No Saved Events Yet' : 'No Events Found'}
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {selectedCategory === 'my'
                  ? 'Tap the heart icon on any event to build your personal festival itinerary!'
                  : 'Try searching for something else or switch categories to see all events.'}
              </p>
              {selectedCategory === 'my' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="px-5 py-2 rounded-full bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-700 transition-colors"
                >
                  Browse All Events
                </button>
              )}
            </div>
          )}

          {/* Grouped Events Timeline */}
          <div className="space-y-6">
            {Object.entries(groupedEvents).map(([groupTitle, events]) => (
              <div key={groupTitle} className="space-y-3">
                {/* Date Group Header */}
                <div className="flex items-center gap-2 px-1">
                  <div className="w-2 h-2 rounded-full bg-red-600" />
                  <h3 className="font-display text-lg tracking-wider text-slate-700 uppercase">
                    {groupTitle}
                  </h3>
                </div>

                {/* Event Cards */}
                <div className="space-y-3">
                  {events.map((event) => {
                    const isSaved = mySchedule.includes(event.title);

                    return (
                      <div
                        key={event.id}
                        className="group bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                      >
                        <div className="flex items-start gap-3.5">
                          {/* Left Event Thumbnail Photo */}
                          <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 shadow-inner">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400';
                              }}
                            />
                            {/* Category Icon Badge */}
                            <span className="absolute bottom-1 right-1 w-6 h-6 rounded-lg bg-white/90 backdrop-blur-sm shadow flex items-center justify-center text-xs">
                              {event.icon}
                            </span>
                          </div>

                          {/* Event Details */}
                          <div className="flex-1 min-w-0 pr-8">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                                {event.categoryLabel}
                              </span>
                              <span className="text-xs font-semibold text-amber-700">
                                {event.priceLabel}
                              </span>
                            </div>

                            <h4 className="font-bold text-sm text-slate-900 leading-snug truncate">
                              {event.title}
                            </h4>

                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                              {event.desc}
                            </p>

                            {/* Meta: Time & Location */}
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] font-medium text-slate-500">
                              <span className="inline-flex items-center gap-1 font-bold text-red-600">
                                <Clock size={12} />
                                {event.time}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <MapPin size={12} />
                                <span className="truncate max-w-[130px]">{event.location}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Favorite Heart Button (Top Right) */}
                        <button
                          onClick={() => toggleMySchedule(event.title)}
                          className={`absolute top-3.5 right-3.5 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                            isSaved
                              ? 'bg-red-50 text-red-600 shadow-sm scale-110'
                              : 'bg-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50'
                          }`}
                          aria-label={isSaved ? 'Remove from schedule' : 'Save to schedule'}
                        >
                          <Heart size={18} className={isSaved ? 'fill-current text-red-600' : ''} />
                        </button>

                        {/* Bottom Action Footer */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                          {event.ticketUrl ? (
                            <button
                              onClick={() => openExternal(event.ticketUrl)}
                              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                              <Ticket size={13} />
                              <span>Register / Buy Tokens</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium">Free Admission</span>
                          )}

                          <div className="flex items-center gap-1.5">
                            {/* Add to Calendar button */}
                            <button
                              onClick={() => addToCalendar(event)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Add to Calendar (.ics)"
                            >
                              <CalendarPlus size={16} />
                            </button>

                            {/* Share button */}
                            <button
                              onClick={() => shareEvent(event)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Share Event"
                            >
                              {copiedEvent === event.id ? (
                                <Check size={16} className="text-emerald-600" />
                              ) : (
                                <Share2 size={16} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. ITINERARY NOTICE / PROMISE */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-center space-y-1">
          <p className="text-xs font-bold text-amber-950">
            More Hour-by-Hour Band Times Coming Soon!
          </p>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            The full main stage music lineup and hourly set times are updated as artists confirm. Check back often!
          </p>
        </div>

      </div>
    </div>
  );
}
