import React, { useState, useMemo } from 'react';
import { ChevronLeft, Search, ExternalLink, X, ShieldCheck } from 'lucide-react';

export default function FestivalSponsors({
  sponsorsData = [],
  sponsorTiers = [],
  setActiveNav,
  openExternal = (url) => window.open(url, '_blank', 'noopener,noreferrer')
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [showTiersModal, setShowTiersModal] = useState(false);

  // Extract tiers for filter
  const tiers = useMemo(() => {
    const list = ['all'];
    sponsorsData.forEach((s) => {
      if (s.tier && !list.includes(s.tier)) {
        list.push(s.tier);
      }
    });
    return list;
  }, [sponsorsData]);

  // Filter sponsors
  const filteredSponsors = useMemo(() => {
    return sponsorsData.filter((s) => {
      const matchesTier = selectedTier === 'all' || s.tier === selectedTier;
      const matchesSearch =
        searchQuery.trim() === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.tier && s.tier.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTier && matchesSearch;
    });
  }, [sponsorsData, selectedTier, searchQuery]);

  return (
    <div className="min-h-screen bg-white pb-28 -mx-4 font-sans select-none">
      {/* 1. TOP HEADER (Matching User Mockup: Red Bar with Left Arrow & Centered Title) */}
      <header className="sticky top-0 z-30 bg-[#c5221f] text-white shadow-md">
        <div className="relative flex items-center justify-between px-4 py-3.5 max-w-2xl mx-auto">
          <button
            onClick={() => {
              if (selectedSponsor) {
                setSelectedSponsor(null);
              } else if (setActiveNav) {
                setActiveNav('home');
              }
            }}
            className="flex items-center justify-center p-1 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Back"
          >
            <ChevronLeft size={26} strokeWidth={2.4} />
          </button>

          <h1 className="absolute left-1/2 -translate-x-1/2 font-black text-lg tracking-wider uppercase text-white">
            SPONSORS
          </h1>

          <button
            onClick={() => setShowTiersModal(true)}
            className="text-xs font-bold bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-full text-white transition-colors"
          >
            Join
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto">
        {/* 2. SEARCH & FILTER BAR */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2">
          <div className="relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sponsors & partners..."
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-white border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Tier Pills */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-1">
            {tiers.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTier(t)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all capitalize ${
                  selectedTier === t
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t === 'all' ? 'All Sponsors' : t}
              </button>
            ))}
          </div>
        </div>

        {/* 3. 2-COLUMN SPONSORS GRID (Exact Layout from Mockup: media_1792522122310_3051810e.png) */}
        <div className="grid grid-cols-2 bg-white">
          {filteredSponsors.length === 0 ? (
            <div className="col-span-2 py-16 text-center text-slate-500">
              <p className="font-bold text-base">No sponsors found</p>
              <p className="text-xs mt-1">Try another search keyword</p>
            </div>
          ) : (
            filteredSponsors.map((sponsor, idx) => {
              // Determine border classes for crisp 2-column table grid
              const isEvenCol = idx % 2 === 0;
              return (
                <button
                  key={sponsor.id ?? idx}
                  onClick={() => setSelectedSponsor(sponsor)}
                  className={`flex flex-col text-left p-4 hover:bg-slate-50 transition-colors border-b border-slate-200 ${
                    isEvenCol ? 'border-r border-slate-200' : ''
                  } group`}
                >
                  {/* Sponsor Logo Container (Clean white space, perfectly centered) */}
                  <div className="h-24 w-full flex items-center justify-center p-2 mb-2 rounded-lg bg-white overflow-hidden">
                    {sponsor.logoImage ? (
                      <img
                        src={sponsor.logoImage}
                        alt={sponsor.name}
                        className="max-h-20 max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-3xl">
                        {sponsor.logo || '🤝'}
                      </div>
                    )}
                  </div>

                  {/* Sponsor Name (Bold text like mockup) */}
                  <h3 className="font-bold text-sm text-slate-900 leading-tight line-clamp-2 min-h-[2.5rem]">
                    {sponsor.name}
                  </h3>

                  {/* Sponsor Tier / Subtitle (Smaller muted text like mockup) */}
                  <p className="text-[11px] text-slate-500 font-medium mt-1 truncate">
                    {sponsor.tier || 'Community Partner'}
                  </p>
                </button>
              );
            })
          )}
        </div>

        {/* BECOME A SPONSOR CALLOUT BANNER */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <div className="rounded-2xl p-5 bg-gradient-to-br from-red-600 to-amber-600 text-white shadow-md text-center space-y-2">
            <h3 className="font-display text-2xl tracking-wide uppercase">
              Become a Festival Sponsor
            </h3>
            <p className="text-xs text-white/90 max-w-md mx-auto leading-relaxed">
              Partner with the 11th Annual Jimmy Jam BBQ Slam & Car Show to gain prime exposure and support families facing hardship in St. Johns County.
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <button
                onClick={() => setShowTiersModal(true)}
                className="px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider bg-white text-red-700 shadow hover:bg-slate-100 active:scale-95 transition-all"
              >
                View Packages & Perks
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SPONSOR DETAIL MODAL */}
      {selectedSponsor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200 animate-fadeIn space-y-4 p-6">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold px-3 py-1 bg-red-100 text-red-700 rounded-full">
                {selectedSponsor.tier}
              </span>
              <button
                onClick={() => setSelectedSponsor(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="h-28 w-full flex items-center justify-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
              {selectedSponsor.logoImage ? (
                <img
                  src={selectedSponsor.logoImage}
                  alt={selectedSponsor.name}
                  className="max-h-24 max-w-full object-contain"
                />
              ) : (
                <span className="text-5xl">{selectedSponsor.logo || '🤝'}</span>
              )}
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900">{selectedSponsor.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5">Official Festival Partner</p>
            </div>

            {selectedSponsor.description && (
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {selectedSponsor.description}
              </p>
            )}

            <div className="pt-2 flex gap-2">
              {selectedSponsor.website && (
                <button
                  onClick={() => openExternal(selectedSponsor.website)}
                  className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-red-600 text-white shadow-md hover:bg-red-700 flex items-center justify-center gap-1.5 transition-all"
                >
                  <ExternalLink size={14} /> Visit Website
                </button>
              )}
              <button
                onClick={() => setSelectedSponsor(null)}
                className="py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BECOME A SPONSOR TIERS MODAL */}
      {showTiersModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-black text-lg text-slate-900">Sponsorship Packages</h3>
                <p className="text-xs text-slate-500">11th Annual Jimmy Jam BBQ Slam & Car Show</p>
              </div>
              <button
                onClick={() => setShowTiersModal(false)}
                className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-300"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              {sponsorTiers && sponsorTiers.length > 0 ? (
                sponsorTiers.map((tier, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-base text-slate-900 flex items-center gap-2">
                        <span>{tier.icon}</span> {tier.name}
                      </span>
                    </div>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                      {tier.perks.map((p, pIdx) => (
                        <li key={pIdx}>{p}</li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                  <p>Title, Platinum, Gold, and Banner sponsorships are available.</p>
                  <p>All packages include prominent brand placement, stage recognition, VIP wristbands, and social media coverage.</p>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <span className="font-bold flex items-center gap-1"><ShieldCheck size={16} /> 501(c)(3) Charitable Tax Deduction</span>
                <p>All sponsorships benefit Jimmy Jam Community Outreach, Inc. and are tax-deductible as allowed by law.</p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2">
              <button
                onClick={() => {
                  setShowTiersModal(false);
                  if (setActiveNav) setActiveNav('connect');
                }}
                className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow-md transition-all text-center"
              >
                Contact Sponsorship Team →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
