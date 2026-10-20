import React, { useState } from 'react';
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Flame
} from 'lucide-react';

export default function FestivalGuide({
  setActiveNav = () => {},
  openExternal = (url) => window.open(url, '_blank', 'noopener,noreferrer')
}) {
  const [activeSection, setActiveSection] = useState('all');

  const guideSections = [
    {
      id: 'gates',
      icon: '⏰',
      title: 'Gate Hours & Schedule Highlights',
      content: (
        <div className="space-y-3 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Saturday, January 9, 2027 • St. Johns County Fairgrounds</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-black text-red-600 block text-sm">10:00 AM</span>
              <span className="font-bold text-slate-900">Gates & Vendor Village Open</span>
              <p className="text-slate-500 mt-0.5">Free admission. Live music and food trucks commence.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-black text-red-600 block text-sm">11:00 AM – 3:00 PM</span>
              <span className="font-bold text-slate-900">Chili & Chowder Cook-Off</span>
              <p className="text-slate-500 mt-0.5">Sample award-winning recipes with $1 tasting tokens.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-black text-red-600 block text-sm">2:00 PM – 4:00 PM</span>
              <span className="font-bold text-slate-900">Public BBQ Tastings</span>
              <p className="text-slate-500 mt-0.5">Pro & Backyard pitmasters serve competition pork & ribs.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-black text-red-600 block text-sm">3:30 PM – 5:00 PM</span>
              <span className="font-bold text-slate-900">Car Show & BBQ Awards</span>
              <p className="text-slate-500 mt-0.5">Main stage ceremony announcing champions & cash prizes.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tokens',
      icon: '🎟️',
      title: 'Tasting Tokens & People\'s Choice Voting',
      content: (
        <div className="space-y-3 text-sm text-slate-700">
          <p>
            Jimmy Jam uses a physical token system for tasting and People's Choice voting. Here is how it works:
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-xl">🪙</span>
              <div>
                <span className="font-bold text-amber-900 block text-sm">$1 Tasting Tokens</span>
                <p className="text-amber-800">
                  Buy tasting tokens at designated ticket booths throughout the fairgrounds. Competitors only accept tokens for tasting cups (no cash at cook stations).
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200">
              <span className="text-xl">🗳️</span>
              <div>
                <span className="font-bold text-red-900 block text-sm">Earning People's Choice Voting Tokens</span>
                <p className="text-red-800">
                  For every $10 spent on Chili tokens, you receive 1 Chili voting token. For every $20 spent on BBQ tokens, you receive 1 BBQ voting token. Drop your voting token into your favorite team's jar!
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveNav('ballot')}
            className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5"
          >
            Open Digital Tasting Ballot Scorecard →
          </button>
        </div>
      )
    },
    {
      id: 'competitions',
      icon: '🏆',
      title: 'Contests: Chili, BBQ & Car Show',
      content: (
        <div className="space-y-3 text-sm text-slate-700">
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 text-sm block">🌶️ Chili Cook-Off (Sponsored by Evans Automotive)</span>
              <p className="text-slate-600 mt-1">
                Free entry! $500 1st Place, $250 2nd Place, $125 3rd Place cash prizes. 11:00 AM – 3:00 PM. Open to backyard cooks and pros alike.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 text-sm block">🍖 BBQ Slam Championship</span>
              <p className="text-slate-600 mt-1">
                Over $17,000 in payouts across Pro and Backyard divisions (Chicken, Ribs, Pork, Brisket) plus ancillary wings, sauces, and desserts.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 text-sm block">🚗 Open Car, Truck & Bike Show</span>
              <p className="text-slate-600 mt-1">
                Over 100 hot rods, classic pickups, muscle cars, and custom motorcycles. People's Choice voting and top-in-class trophies.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'parking',
      icon: '🚗',
      title: 'Parking, Arrival & Directions',
      content: (
        <div className="space-y-3 text-sm text-slate-700">
          <p>
            The festival takes place at the spacious <strong>St. Johns County Fairgrounds</strong> (5840 State Rd. 207, Elkton, FL 32145).
          </p>
          <ul className="text-xs space-y-1.5 list-disc list-inside text-slate-600">
            <li><strong>General Parking:</strong> Free of charge in the main grass lots. Enter via Gate 2 or Gate 3.</li>
            <li><strong>VIP Parking:</strong> Reserved hardpack parking directly next to the Main Pavilion for VIP passholders.</li>
            <li><strong>Handicap Accessible:</strong> Dedicated paved ADA spaces with ramp access to the main promenade.</li>
            <li><strong>Judges & Cook Teams:</strong> Designated staging access through Gate 1.</li>
          </ul>
          <button
            onClick={() => setActiveNav('maps')}
            className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-red-600 text-white hover:bg-red-700 transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <MapPin size={15} /> Open Interactive Map & GPS Directions
          </button>
        </div>
      )
    },
    {
      id: 'rules',
      icon: '⛺',
      title: 'What to Bring & Festival Rules',
      content: (
        <div className="space-y-2 text-xs text-slate-700">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
            <span className="font-bold block text-sm">✅ Allowed & Encouraged:</span>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Lawn chairs and picnic blankets for main stage seating</li>
              <li>Leashed, friendly dogs (must clean up after your pet)</li>
              <li>Sunscreen, hats, and sunglasses</li>
              <li>Cash and cards (ATMs are also on-site)</li>
            </ul>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
            <span className="font-bold block text-sm">🚫 Prohibited Items:</span>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Outside alcohol (ice-cold craft beer and bourbon available inside)</li>
              <li>Weapons or fireworks</li>
              <li>Glass containers</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'mission',
      icon: '💖',
      title: 'Our Charitable Mission: Jimmy Jam Outreach',
      content: (
        <div className="space-y-2 text-sm text-slate-700">
          <p>
            Named in honor of the late James "Jimmy Jam" Wray, Jimmy Jam Community Outreach Inc. is a local 501(c)(3) nonprofit providing <strong>"A hand up, not a handout"</strong> to St. Johns County residents facing unexpected medical emergencies, disaster damage, or acute financial hardship.
          </p>
          <p className="text-xs text-slate-600">
            Every dollar raised through tasting tokens, vendor fees, sponsor partnerships, and silent auctions stays right here in our community.
          </p>
          <button
            onClick={() => setActiveNav('assistance')}
            className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-amber-500 hover:bg-amber-600 text-white transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Heart size={15} /> Apply for Assistance or Support Our Mission
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-28 -mx-4 font-sans select-none">
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-30 bg-[#c5221f] text-white shadow-md">
        <div className="relative flex items-center justify-between px-4 py-3.5 max-w-2xl mx-auto">
          <button
            onClick={() => setActiveNav('home')}
            className="flex items-center justify-center p-1 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Back"
          >
            <ChevronLeft size={26} strokeWidth={2.4} />
          </button>

          <h1 className="font-black text-base sm:text-lg tracking-wider uppercase text-white">
            FESTIVAL GUIDE
          </h1>

          <span className="text-xs font-bold px-2 py-0.5 bg-white/20 rounded-full text-white">
            2027
          </span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* HERO BADGE */}
        <div className="rounded-3xl p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 text-white shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Flame size={16} />
            <span>11th Annual Official Event Guide</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Jimmy Jam BBQ Slam & Car Show
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Welcome to Northeast Florida’s premier community BBQ celebration! Use this guide for hours, tokens, competition rules, parking, and amenities.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-bold">
            <span className="px-2.5 py-1 rounded-full bg-white/10 text-white flex items-center gap-1">
              <Calendar size={12} /> Saturday, Jan 9, 2027
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/10 text-white flex items-center gap-1">
              <Clock size={12} /> 10 AM – 5 PM
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/10 text-white flex items-center gap-1">
              <MapPin size={12} /> Elkton, FL
            </span>
          </div>
        </div>

        {/* QUICK JUMP FILTER PILLS */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setActiveSection('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeSection === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            All Sections
          </button>
          {guideSections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                activeSection === sec.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              <span>{sec.icon}</span>
              <span>{sec.title.split(':')[0].split('&')[0]}</span>
            </button>
          ))}
        </div>

        {/* GUIDE CARDS LIST */}
        <div className="space-y-3">
          {guideSections
            .filter((sec) => activeSection === 'all' || activeSection === sec.id)
            .map((section) => (
              <div
                key={section.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">
                    {section.icon}
                  </div>
                  <h3 className="font-black text-base text-slate-900 leading-snug">
                    {section.title}
                  </h3>
                </div>

                <div className="pt-1">{section.content}</div>
              </div>
            ))}
        </div>

        {/* BOTTOM HELP BANNER */}
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-center space-y-1">
          <p className="text-xs font-bold text-slate-700">Need On-Site Assistance During the Event?</p>
          <p className="text-[11px] text-slate-500">
            Visit the Information & Token Booth near the Main Entrance or email{' '}
            <a href="mailto:jimmyjaminfo@gmail.com" className="text-red-600 underline font-semibold">
              jimmyjaminfo@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
