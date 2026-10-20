import React from 'react';
import {
  CloudRain,
  Wind,
  Droplets,
  Calendar,
  MapPin,
  ChevronLeft,
  Sparkles
} from 'lucide-react';

export default function FestivalWeather({ setActiveNav }) {

  // Hourly timeline for festival day
  const hourlyData = [
    { time: '9 AM', temp: '62°', icon: '☀️', condition: 'Clear', active: false },
    { time: '11 AM', temp: '68°', icon: '⛅', condition: 'Tastings Begin', active: false },
    { time: '1 PM', temp: '74°', icon: '🌤️', condition: 'Peak Sun', active: true },
    { time: '3 PM', temp: '73°', icon: '🍖', condition: 'BBQ Turn-In', active: false },
    { time: '5 PM', temp: '69°', icon: '🎸', condition: 'Live Music', active: false },
    { time: '7 PM', temp: '63°', icon: '🌙', condition: 'Cool Evening', active: false }
  ];

  // 7-day / Festival weekend forecast (Matching Right Phone in Mockup)
  const weekendForecast = [
    { day: 'Friday', date: 'Jan 8', condition: 'Cook Team Staging & Ancillary Contests', icon: '⛅', high: '69°', low: '52°', rain: '10%' },
    { day: 'Saturday', date: 'Jan 9', condition: 'Main BBQ Slam, Chili & Car Show', icon: '☀️', high: '74°', low: '55°', rain: '5%', featured: true },
    { day: 'Sunday', date: 'Jan 10', condition: 'Awards & Pitmaster Departure', icon: '🌤️', high: '71°', low: '50°', rain: '10%' },
    { day: 'Monday', date: 'Jan 11', condition: 'Mild & Sunny', icon: '☀️', high: '68°', low: '48°', rain: '0%' },
    { day: 'Tuesday', date: 'Jan 12', condition: 'Partly Cloudy', icon: '⛅', high: '67°', low: '49°', rain: '15%' },
    { day: 'Wednesday', date: 'Jan 13', condition: 'Scattered Breezes', icon: '🌤️', high: '70°', low: '51°', rain: '10%' },
    { day: 'Thursday', date: 'Jan 14', condition: 'Warm Coastal Sunshine', icon: '☀️', high: '72°', low: '53°', rain: '5%' }
  ];

  return (
    <div className="relative min-h-screen bg-[#070D1F] text-white -mx-4 px-4 sm:px-6 py-6 pb-28 font-sans overflow-hidden">
      
      {/* ATMOSPHERIC BACKGROUND RADIAL GLOWS (Matching Mockup 3D UI) */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-blue-600/30 via-cyan-500/10 to-transparent blur-3xl opacity-90" />
      <div className="pointer-events-none absolute top-36 right-1/4 w-[300px] h-[300px] bg-blue-500/15 blur-[100px] rounded-full" />

      <div className="relative max-w-md mx-auto space-y-6 z-10">

        {/* TOP BAR WITH LOCATION (Matching Mockup Screen 1 Header) */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setActiveNav && setActiveNav('home')}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Back to home"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-bold text-white shadow-sm">
            <MapPin size={14} className="text-cyan-400" />
            <span>St. Johns County Fairgrounds</span>
          </div>

          <div className="w-10 h-10" /> {/* Spacer */}
        </div>

        {/* 1. 3D GLOWING HERO WEATHER CARD (Matching Mockup Left Phone) */}
        <div
          className="relative rounded-3xl p-6 sm:p-7 overflow-hidden shadow-2xl text-white border border-white/20"
          style={{
            background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 50%, #06B6D4 100%)',
            boxShadow: '0 20px 40px -15px rgba(37, 99, 235, 0.45)'
          }}
        >
          {/* Subtle 3D glossy gradient overlay */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-5 text-center">
            
            {/* 3D Cloud & Sun Soft Illustration */}
            <div className="relative w-32 h-28 mx-auto flex items-center justify-center">
              <div className="text-7xl drop-shadow-2xl animate-bounce duration-1000">
                🌤️
              </div>
            </div>

            {/* Huge Temperature Readout */}
            <div className="space-y-0.5">
              <div className="flex items-start justify-center">
                <span className="text-6xl sm:text-7xl font-extrabold tracking-tight drop-shadow-md">
                  74°
                </span>
                <span className="text-2xl font-bold mt-2 text-cyan-200">F</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-wide text-white drop-shadow-sm">
                Sunny & Perfect BBQ Weather
              </h2>
              <p className="text-xs text-blue-100 font-medium">
                Saturday, January 9, 2027 • Main Festival Day
              </p>
            </div>

            {/* Metrics Row (Wind, Humidity, Rain - Matching Mockup Bottom Card) */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-black/20 backdrop-blur-md border border-white/15 text-center text-xs">
              <div className="space-y-0.5">
                <Wind size={16} className="mx-auto text-cyan-200" />
                <span className="font-bold text-white block">8 mph</span>
                <span className="text-[10px] text-blue-200 uppercase tracking-wider block">Wind</span>
              </div>

              <div className="space-y-0.5 border-x border-white/15">
                <Droplets size={16} className="mx-auto text-cyan-200" />
                <span className="font-bold text-white block">42%</span>
                <span className="text-[10px] text-blue-200 uppercase tracking-wider block">Humidity</span>
              </div>

              <div className="space-y-0.5">
                <CloudRain size={16} className="mx-auto text-cyan-200" />
                <span className="font-bold text-white block">5%</span>
                <span className="text-[10px] text-blue-200 uppercase tracking-wider block">Rain</span>
              </div>
            </div>

          </div>
        </div>

        {/* 2. HOURLY TIMELINE ("TODAY" CAROUSEL - Matching Mockup Screen 1 Bottom) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Event Day Timeline
            </span>
            <span className="text-[11px] text-cyan-400 font-semibold">Tasting Hours 11am – 4pm</span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {hourlyData.map((hr, idx) => (
              <div
                key={idx}
                className={`flex-shrink-0 w-20 p-3 rounded-2xl text-center transition-all ${
                  hr.active
                    ? 'bg-gradient-to-b from-blue-600 to-cyan-600 text-white shadow-lg border border-cyan-400'
                    : 'bg-[#111A33] border border-white/10 text-neutral-300'
                }`}
              >
                <span className="text-[11px] font-bold block mb-1">{hr.time}</span>
                <span className="text-2xl block mb-1">{hr.icon}</span>
                <span className="text-sm font-extrabold block">{hr.temp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 7-DAY FESTIVAL OUTLOOK (Matching Mockup Right Phone) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                7-Day Festival Forecast
              </span>
            </div>
            <span className="text-[11px] text-neutral-400">Elkton, FL</span>
          </div>

          <div className="p-4 rounded-3xl bg-[#111A33]/90 border border-white/10 shadow-xl divide-y divide-white/5 space-y-2">
            {weekendForecast.map((fc, i) => (
              <div
                key={i}
                className={`flex items-center justify-between py-2.5 px-2 rounded-xl transition-colors ${
                  fc.featured ? 'bg-blue-600/20 border border-blue-500/30' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl flex-shrink-0">{fc.icon}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white">{fc.day}</span>
                      <span className="text-[10px] text-neutral-400">{fc.date}</span>
                      {fc.featured && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-400 text-amber-950 font-black text-[9px] uppercase">
                          Main Event
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                      {fc.condition}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-right flex-shrink-0 pl-2">
                  <span className="text-xs font-bold text-white">{fc.high}</span>
                  <span className="text-xs text-neutral-400">{fc.low}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VENUE WEATHER ADVISORY */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-neutral-300 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <Sparkles size={14} className="text-amber-400" />
            <span>Outdoor Fairgrounds Tips</span>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Florida January days are typically sunny with crisp morning and evening air. Dressing in light layers and wearing comfortable walking shoes is recommended for browsing the smoker rows and car show field!
          </p>
        </div>

      </div>

    </div>
  );
}
