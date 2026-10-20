import React, { useState } from 'react';
import {
  Sparkles,
  Bell,
  CheckCircle2,
  ChevronLeft,
  ShoppingBag,
  MapPin,
  Heart
} from 'lucide-react';

export default function FestivalSwag({ setActiveNav }) {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNotifyMe = (e) => {
    e.preventDefault();
    if (emailInput.trim() && emailInput.includes('@')) {
      try {
        const list = JSON.parse(localStorage.getItem('jj_swag_notify_list') || '[]');
        list.push({ email: emailInput.trim(), date: new Date().toISOString() });
        localStorage.setItem('jj_swag_notify_list', JSON.stringify(list));
      } catch {}
      setSubscribed(true);
    }
  };

  const upcomingGear = [
    {
      title: '11th Annual Commemorative Lineup Tee',
      desc: 'Heavyweight vintage washed cotton with official 2027 pitmaster & artist lineup back print.',
      badge: 'Limited Run',
      image: '/logo shirt-no BG.png'
    },
    {
      title: 'Pitmaster Leather-Patch Trucker Hat',
      desc: 'Structured mesh-back snapback with custom debossed leather BBQ Slam emblem.',
      badge: 'Event Exclusive',
      image: '/logo-transparent.png'
    },
    {
      title: 'Reserve Bourbon & BBQ Tasting Glass',
      desc: 'Etched commemorative Glencairn bourbon glass celebrating the 3rd Annual Bourbon Dinner.',
      badge: 'VIP Collectible',
      image: '/images/event-photos/dsc08443.jpg'
    },
    {
      title: 'Heavyweight Canvas Pitmaster Apron',
      desc: 'Waxed canvas with reinforced utility pockets and brass hardware for grilling and smoking.',
      badge: 'Pit Crew Favorite',
      image: '/images/event-photos/dsc08414.jpg'
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#0E131F] text-white -mx-4 px-4 sm:px-6 py-6 pb-28 font-sans overflow-hidden">
      
      {/* ATMOSPHERIC BACKGROUND RADIAL GLOWS */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-amber-500/20 via-orange-600/10 to-transparent blur-3xl opacity-80" />

      <div className="relative max-w-xl mx-auto space-y-6 z-10">

        {/* TOP BAR */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setActiveNav && setActiveNav('home')}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Back to home"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-amber-400" />
            <h1 className="font-serif tracking-wide text-lg font-bold text-white uppercase">
              SWAG STORE
            </h1>
          </div>

          <div className="w-10 h-10" /> {/* Spacer */}
        </div>

        {/* 1. COMING SOON HERO BANNER */}
        <div
          className="relative rounded-3xl p-6 sm:p-8 text-center text-white overflow-hidden shadow-2xl border border-amber-400/30"
          style={{
            background: 'linear-gradient(135deg, #1C1917 0%, #292524 50%, #451A03 100%)'
          }}
        >
          <div className="relative z-10 space-y-4 max-w-md mx-auto">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} className="text-amber-400" />
              <span>Official Festival Store</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Official Merch
              <span className="block font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-amber-100 mt-1">
                Coming Soon!
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              We're putting the finishing touches on the official 11th Annual Jimmy Jam BBQ Slam apparel and collectible festival gear. 100% of merchandise proceeds directly benefit local families facing medical hardships!
            </p>

            {/* Notification Signup Pill */}
            {!subscribed ? (
              <form onSubmit={handleNotifyMe} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email for early access..."
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-full bg-black/50 border border-white/20 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-amber-400 transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Bell size={14} />
                  <span>Notify Me</span>
                </button>
              </form>
            ) : (
              <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in">
                <CheckCircle2 size={16} />
                <span>You're on the list! We'll notify you as soon as the store drops.</span>
              </div>
            )}

            {/* Fairgrounds On-Site Location Notice */}
            <div className="pt-2 text-[11px] text-neutral-400 flex items-center justify-center gap-1.5">
              <MapPin size={13} className="text-amber-400" />
              <span>Available live at the Main Merch Tent • Tringali Barn</span>
            </div>

          </div>
        </div>

        {/* 2. SNEAK PEEK PRODUCT CARDS */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Preview Collection
            </span>
            <span className="text-[11px] text-amber-400 font-semibold">Dropping Soon</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {upcomingGear.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#141A29] border border-white/10 shadow-lg space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="h-36 rounded-xl overflow-hidden bg-black/40 border border-white/5 relative flex items-center justify-center p-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="max-h-full max-w-full object-contain filter drop-shadow-md"
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 border border-white/10 text-amber-300 text-[10px] font-bold">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-amber-400">Available at Event</span>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Coming Soon</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. CHARITABLE MISSION NOTE */}
        <div className="text-center pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-xs font-semibold">
            <Heart size={14} className="text-red-400" />
            <span>Every shirt and hat helps fund medical grants for local families</span>
          </div>
        </div>

      </div>

    </div>
  );
}
