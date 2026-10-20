import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ArrowRight
} from 'lucide-react';

const VOLUNTEER_SHIFTS = [
  {
    id: 'shift-chili',
    title: 'Chili Cook-Off Tasting & Token Sales',
    sponsor: 'Sponsored by Evans Automotive',
    date: 'Saturday, Jan 9, 2027',
    time: '10:30 AM – 3:30 PM',
    spotsTotal: 12,
    spotsLeft: 4,
    location: 'Chili Arena • North Fairgrounds',
    desc: 'Assist competing chili teams, distribute 2-oz tasting cups, sell tasting tokens, and guide guests to the voting token drop boxes.',
    perks: ['Official Volunteer T-Shirt', 'Free BBQ Tasting Pass', 'Community Service Hours Certificate']
  },
  {
    id: 'shift-bbq-runner',
    title: 'BBQ Pitmaster Hospitality & Judging Runner',
    sponsor: 'Jimmy Jam Outreach Crew',
    date: 'Saturday, Jan 9, 2027',
    time: '1:30 PM – 5:00 PM',
    spotsTotal: 8,
    spotsLeft: 2,
    location: 'Competition Barn & Pitmaster Alley',
    desc: 'Escort turn-in trays from champion pitmasters to certified KCBS judges table. Handle water, ice, and staging logistics for cook teams.',
    perks: ['Official Volunteer T-Shirt', 'Behind-the-Scenes Smoker Access', 'Meal Pass']
  },
  {
    id: 'shift-gate',
    title: 'Gate Welcome & Will-Call Wristbands',
    sponsor: 'Jimmy Jam Community Outreach',
    date: 'Saturday, Jan 9, 2027',
    time: '8:30 AM – 1:30 PM',
    spotsTotal: 10,
    spotsLeft: 5,
    location: 'Gate A Main Entrance',
    desc: 'Greet incoming festival attendees, scan digital tickets, verify registrations, and distribute attendee wristbands and event maps.',
    perks: ['Official Volunteer T-Shirt', 'Festival Meal Pass', 'Community Service Credit']
  },
  {
    id: 'shift-kids-zone',
    title: 'Kids Zone & Family Fun Area Monitor',
    sponsor: 'Family Support Committee',
    date: 'Saturday, Jan 9, 2027',
    time: '11:00 AM – 3:30 PM',
    spotsTotal: 6,
    spotsLeft: 3,
    location: 'West Lawn Family Pavilion',
    desc: 'Supervise bounce house queues, assist with face painting stations, and coordinate crowd safety for the BMX stunt & K9 demonstrations.',
    perks: ['Official Volunteer T-Shirt', 'Snack & Beverage Pass', 'Volunteer Certificate']
  },
  {
    id: 'shift-friday-setup',
    title: 'Friday Staging & Ancillary Contest Crew',
    sponsor: 'Pit Crew Logistics',
    date: 'Friday, Jan 8, 2027',
    time: '2:30 PM – 7:30 PM',
    spotsTotal: 10,
    spotsLeft: 6,
    location: 'Main Event Barn & Staging Lots',
    desc: 'Help erect banners, stage tables, direct team trailers into designated parking spots, and assist with Friday evening wing & slider contests.',
    perks: ['Official Volunteer T-Shirt', 'Cookout Dinner with Pitmasters', 'Service Hours']
  }
];

export default function FestivalVolunteer({ setActiveNav }) {
  // 'opportunities' | 'my-schedule' | 'checkin'
  const [activeTab, setActiveTab] = useState('opportunities');
  const [claimedShiftIds, setClaimedShiftIds] = useState(() => {
    try {
      const stored = localStorage.getItem('jj_claimed_shifts');
      return stored ? JSON.parse(stored) : ['shift-chili'];
    } catch {
      return ['shift-chili'];
    }
  });

  // Check-In verification state
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [checkInStatus, setCheckInStatus] = useState(null); // 'success' | 'error' | null

  useEffect(() => {
    try {
      localStorage.setItem('jj_claimed_shifts', JSON.stringify(claimedShiftIds));
    } catch {}
  }, [claimedShiftIds]);

  const toggleClaimShift = (shiftId) => {
    setClaimedShiftIds(prev =>
      prev.includes(shiftId) ? prev.filter(id => id !== shiftId) : [...prev, shiftId]
    );
  };

  const handleDigitChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const nextCode = [...verificationCode];
    nextCode[index] = value;
    setVerificationCode(nextCode);

    // Auto-advance to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`digit-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyCheckIn = (e) => {
    e.preventDefault();
    const fullCode = verificationCode.join('').toUpperCase();
    if (fullCode.length >= 4) {
      setCheckInStatus('success');
    } else {
      setCheckInStatus('error');
    }
  };

  const myShifts = VOLUNTEER_SHIFTS.filter(s => claimedShiftIds.includes(s.id));

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] -mx-4 px-4 sm:px-6 py-6 pb-28 font-sans">
      
      <div className="max-w-xl mx-auto space-y-6">

        {/* 1. TOP HEADER & BRANDING (Matching VolunteerHub Screen 1) */}
        <div className="text-center pt-2 space-y-2">
          <button
            onClick={() => setActiveNav && setActiveNav('home')}
            className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 flex items-center gap-1 mx-auto transition-colors"
          >
            ← Back to Home
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Users size={14} />
            <span>Jimmy Jam Volunteer Program</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            Your Volunteer Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
            Support local families in need while experiencing Florida's premier BBQ Slam & Car Show up close!
          </p>
        </div>

        {/* 2. THREE-TAB SELECTOR (Opportunities / My Schedule / Check In) */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-white border border-neutral-200 shadow-sm">
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center ${
              activeTab === 'opportunities'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            All Shifts ({VOLUNTEER_SHIFTS.length})
          </button>

          <button
            onClick={() => setActiveTab('my-schedule')}
            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1 ${
              activeTab === 'my-schedule'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>My Shifts</span>
            {claimedShiftIds.length > 0 && (
              <span className={`w-4 h-4 rounded-full text-[10px] font-extrabold flex items-center justify-center ${
                activeTab === 'my-schedule' ? 'bg-white text-blue-700' : 'bg-blue-600 text-white'
              }`}>
                {claimedShiftIds.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('checkin')}
            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1 ${
              activeTab === 'checkin'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <KeyRound size={13} />
            <span>Check In</span>
          </button>
        </div>

        {/* ===================================================================
            TAB 1: ALL OPPORTUNITIES (Matching Screen 2 in VolunteerHub)
           =================================================================== */}
        {activeTab === 'opportunities' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* Team Hands-Together Banner Card (From VolunteerHub Mockup) */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white p-6 shadow-xl">
              <div className="relative z-10 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200 bg-white/10 px-2.5 py-0.5 rounded-full inline-block">
                  Community Action
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  Make a Real Difference in St. Johns County
                </h2>
                <p className="text-xs text-blue-100 leading-relaxed max-w-sm">
                  Every volunteer receives an official event t-shirt, meal ticket, and community service verification hours.
                </p>
              </div>
            </div>

            {/* Shifts List */}
            <div className="space-y-3">
              {VOLUNTEER_SHIFTS.map(shift => {
                const isClaimed = claimedShiftIds.includes(shift.id);
                return (
                  <div
                    key={shift.id}
                    className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-md space-y-3 transition-all hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block">
                          {shift.sponsor}
                        </span>
                        <h3 className="font-bold text-base text-neutral-900 leading-snug">
                          {shift.title}
                        </h3>
                      </div>

                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex-shrink-0">
                        {shift.spotsLeft} spots open
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {shift.desc}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs text-neutral-700 pt-1 border-t border-neutral-100">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar size={14} className="text-blue-600 flex-shrink-0" />
                        <span className="truncate">{shift.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock size={14} className="text-blue-600 flex-shrink-0" />
                        <span className="truncate">{shift.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-1 text-[11px] text-neutral-500 truncate">
                        <MapPin size={13} className="text-neutral-400 flex-shrink-0" />
                        <span className="truncate">{shift.location}</span>
                      </div>

                      <button
                        onClick={() => toggleClaimShift(shift.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all active:scale-95 shadow-sm ${
                          isClaimed
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {isClaimed ? (
                          <>
                            <CheckCircle2 size={14} />
                            <span>Claimed</span>
                          </>
                        ) : (
                          <>
                            <span>Sign Up</span>
                            <ArrowRight size={13} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ===================================================================
            TAB 2: MY SCHEDULE (Screen 2 in VolunteerHub)
           =================================================================== */}
        {activeTab === 'my-schedule' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            <div className="flex items-center justify-between px-1">
              <h2 className="font-bold text-sm uppercase tracking-wider text-neutral-700">
                Your Confirmed Shifts ({myShifts.length})
              </h2>
              <span className="text-xs text-blue-600 font-bold">Volunteer Hub</span>
            </div>

            {myShifts.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-3">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-2xl">
                  📋
                </div>
                <h3 className="font-bold text-base text-neutral-900">No Volunteer Shifts Selected</h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
                  Browse available festival opportunities and claim shifts that fit your schedule.
                </p>
                <button
                  onClick={() => setActiveTab('opportunities')}
                  className="px-5 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-blue-700 transition-all"
                >
                  Explore All Shifts
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {myShifts.map(shift => (
                  <div
                    key={shift.id}
                    className="p-5 rounded-2xl bg-white border border-blue-200 shadow-md space-y-3 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                          ✓ Confirmed Volunteer
                        </span>
                        <h3 className="font-bold text-base text-neutral-900 leading-snug mt-1">
                          {shift.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => toggleClaimShift(shift.id)}
                        className="text-xs text-red-600 hover:underline font-semibold"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-blue-50/70 space-y-1 text-xs text-neutral-800">
                      <p className="flex items-center gap-1.5 font-bold">
                        <Calendar size={14} className="text-blue-600" />
                        <span>{shift.date} • {shift.time}</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-neutral-600">
                        <MapPin size={14} className="text-neutral-400" />
                        <span>{shift.location}</span>
                      </p>
                    </div>

                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-xs text-neutral-500 font-medium">Thank you for attending!</span>
                      <button
                        onClick={() => setActiveTab('checkin')}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1"
                      >
                        <KeyRound size={13} />
                        <span>Check In</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ===================================================================
            TAB 3: CHECK IN SCREEN (Matching Screen 3 in VolunteerHub)
           =================================================================== */}
        {activeTab === 'checkin' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            
            <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-neutral-200 text-center space-y-5">
              
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto shadow-sm">
                <KeyRound size={28} />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-neutral-900">
                  Volunteer Check In
                </h2>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                  Enter the 6-digit verification code provided by the coordinator at the fairgrounds to complete check in and log your volunteer hours.
                </p>
              </div>

              {/* 6-Digit PIN Boxes (Matching Screen 3 in VolunteerHub Mockup) */}
              <form onSubmit={handleVerifyCheckIn} className="space-y-5">
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-700 block">
                    Verification Code
                  </label>
                  <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <input
                        key={index}
                        id={`digit-${index}`}
                        type="text"
                        inputMode="text"
                        maxLength={1}
                        value={verificationCode[index]}
                        onChange={(e) => handleDigitChange(index, e.target.value)}
                        className="w-11 h-14 sm:w-12 sm:h-16 text-center text-xl font-extrabold text-blue-900 bg-neutral-50 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white shadow-inner uppercase transition-all"
                      />
                    ))}
                  </div>
                </div>

                {checkInStatus === 'success' && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 text-left">
                    <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold">Verified! You are officially checked in.</p>
                      <p className="text-[11px] text-emerald-700 mt-0.5">Your volunteer shift hours are now actively being recorded.</p>
                    </div>
                  </div>
                )}

                {checkInStatus === 'error' && (
                  <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 text-left">
                    <AlertCircle size={18} className="flex-shrink-0" />
                    <span>Please enter all 6 digits of your event verification code.</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/20 transition-all"
                >
                  Verify Check In
                </button>

                <p className="text-[11px] text-neutral-400">
                  Don't have your code? Visit the Volunteer Information Kiosk at Gate A.
                </p>
              </form>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
