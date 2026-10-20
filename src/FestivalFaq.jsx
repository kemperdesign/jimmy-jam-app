import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  Search,
  X,
  Mail,
  HelpCircle,
  ArrowRight,
  Heart,
  Ticket
} from 'lucide-react';

export default function FestivalFaq({
  faqData = [],
  setActiveNav,
  openInAppModal,
  openExternal
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState({ 'gen-0': true }); // First question open by default

  // Flatten and normalize FAQ items
  const allFaqItems = useMemo(() => {
    const list = [];
    faqData.forEach((section, sIdx) => {
      const categoryName = section.title.replace(/[^\w\s&]/g, '').trim();
      section.qa.forEach((item, qIdx) => {
        list.push({
          id: `faq-${sIdx}-${qIdx}`,
          sectionIndex: sIdx,
          sectionTitle: section.title,
          categoryName,
          question: item.q,
          answer: item.a,
          contact: section.contact || 'jimmyjaminfo@gmail.com'
        });
      });
    });
    return list;
  }, [faqData]);

  // Categories list
  const categories = useMemo(() => {
    const cats = [{ id: 'all', label: 'All Questions' }];
    faqData.forEach((section, sIdx) => {
      cats.push({
        id: `sec-${sIdx}`,
        sectionIndex: sIdx,
        label: section.title
      });
    });
    return cats;
  }, [faqData]);

  // Filter items
  const filteredItems = useMemo(() => {
    return allFaqItems.filter(item => {
      const matchesCategory =
        selectedCategory === 'all' ||
        `sec-${item.sectionIndex}` === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allFaqItems, selectedCategory, searchQuery]);

  const toggleItem = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const allOpen = {};
    filteredItems.forEach(item => {
      allOpen[item.id] = true;
    });
    setExpandedItems(allOpen);
  };

  const collapseAll = () => {
    setExpandedItems({});
  };

  return (
    <div className="relative min-h-screen bg-[#07090E] text-white -mx-4 px-4 sm:px-6 py-6 pb-28 overflow-hidden font-sans">
      
      {/* ATMOSPHERIC BACKGROUND RADIAL GLOWS (Matching Reference) */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[450px] bg-gradient-to-b from-indigo-900/30 via-blue-900/15 to-transparent blur-3xl opacity-80" />
      <div className="pointer-events-none absolute top-48 left-1/4 w-[350px] h-[350px] bg-blue-600/10 blur-[100px] rounded-full" />
      <div className="pointer-events-none absolute bottom-40 right-1/4 w-[400px] h-[400px] bg-teal-600/10 blur-[120px] rounded-full" />

      <div className="relative max-w-2xl mx-auto space-y-8 z-10">

        {/* 1. HERO HEADER (Matching Reference Typography) */}
        <div className="text-center pt-4 sm:pt-8 space-y-3">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-blue-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-sm">
            <HelpCircle size={14} className="text-blue-400" />
            <span>Jimmy Jam Knowledge Base</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Frequently Asked
            <span className="block font-serif italic font-normal tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-indigo-100 to-teal-200 mt-1">
              Questions
            </span>
          </h1>

          <p className="text-neutral-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Everything you need to know about the 11th Annual Jimmy Jam BBQ Slam, tickets, competition rules, parking, and our 501(c)(3) community outreach.
          </p>
        </div>

        {/* 2. SEARCH & CATEGORY FILTERS */}
        <div className="space-y-3">
          
          {/* Search Input Bar */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by topic, keyword, or question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-[#0D121F]/90 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 shadow-inner backdrop-blur-md transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Filter Pills (Horizontal Scroll) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 pt-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/30'
                    : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick toggle bar */}
          <div className="flex items-center justify-between text-xs text-neutral-500 px-1 pt-1">
            <span>Showing {filteredItems.length} question{filteredItems.length === 1 ? '' : 's'}</span>
            <div className="flex items-center gap-3">
              <button onClick={expandAll} className="hover:text-blue-400 transition-colors">Expand All</button>
              <span>•</span>
              <button onClick={collapseAll} className="hover:text-blue-400 transition-colors">Collapse All</button>
            </div>
          </div>
        </div>

        {/* 3. ACCORDION FAQ LIST (Proximi / Reference Minimal Dark Styling) */}
        <div className="divide-y divide-neutral-800/80 border-t border-b border-neutral-800/80">
          {filteredItems.map((item) => {
            const isOpen = !!expandedItems[item.id];
            return (
              <div
                key={item.id}
                className="group py-4 sm:py-5 transition-colors"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full text-left flex items-start justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-blue-400/80 block">
                      {item.sectionTitle}
                    </span>
                    <h3 className="text-base sm:text-lg font-medium text-white group-hover:text-blue-200 transition-colors leading-snug">
                      {item.question}
                    </h3>
                  </div>

                  {/* Circular Chevron Toggle (Matching Reference) */}
                  <div
                    className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border transition-all duration-300 ${
                      isOpen
                        ? 'bg-blue-600/20 border-blue-500/50 text-blue-300 rotate-180 shadow-sm'
                        : 'bg-white/5 border-white/10 text-neutral-400 group-hover:border-white/20 group-hover:text-white'
                    }`}
                  >
                    <ChevronDown size={16} />
                  </div>
                </button>

                {/* Expanded Answer */}
                {isOpen && (
                  <div className="pt-3 pr-8 space-y-3 animate-in fade-in duration-200">
                    <p className="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed">
                      {item.answer}
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs text-neutral-500">Need specific details?</span>
                      <a
                        href={`mailto:${item.contact}?subject=${encodeURIComponent('Jimmy Jam FAQ Inquiry: ' + item.question)}`}
                        className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 hover:underline font-medium"
                      >
                        <Mail size={12} /> Contact Coordinator
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="py-12 text-center space-y-2">
              <p className="text-neutral-400 text-sm">No matching questions found for "{searchQuery}".</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="text-xs text-blue-400 hover:underline font-semibold"
              >
                Reset search & filters
              </button>
            </div>
          )}
        </div>

        {/* 4. "HAVE ANY QUESTION?" PILL BUTTON (Matching Reference) */}
        <div className="flex justify-center pt-2">
          <a
            href="mailto:jimmyjaminfo@gmail.com?subject=Question%20about%20Jimmy%20Jam%20BBQ%20Slam"
            className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#111625] hover:bg-[#182035] border border-blue-500/30 text-blue-200 hover:text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-950/40 backdrop-blur-md transition-all active:scale-95"
          >
            <span>HAVE ANY QUESTION?</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* 5. CALL TO ACTION BANNER CARD (Matching Bottom Reference Card) */}
        <div
          className="relative rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl text-white border border-white/10"
          style={{
            background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 40%, #0D9488 100%)'
          }}
        >
          {/* Subtle background glow effect */}
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 text-center space-y-4 max-w-lg mx-auto">
            
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-teal-200 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
              Community Outreach & Tickets
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Start <span className="font-serif italic font-normal text-teal-100">Supporting</span> Today
            </h2>

            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-md mx-auto">
              Join us for world-class BBQ, reserve bourbons, and live music. 100% of event proceeds directly help local families facing medical crises.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  if (openInAppModal) {
                    openInAppModal('https://pci.jotform.com/form/260406377587163', 'Jimmy Jam Tickets');
                  } else if (setActiveNav) {
                    setActiveNav('tickets');
                  }
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-neutral-100 text-blue-950 font-bold text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 transform active:scale-95 transition-all"
              >
                <Ticket size={16} className="text-blue-600" />
                <span>GET TICKETS NOW</span>
                <ArrowRight size={14} className="text-blue-600" />
              </button>

              <button
                onClick={() => setActiveNav && setActiveNav('assistance')}
                className="w-full sm:w-auto px-5 py-3 rounded-full bg-black/25 hover:bg-black/35 text-white border border-white/20 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 backdrop-blur-sm transition-all"
              >
                <Heart size={15} fill="#FFFFFF" />
                <span>APPLY FOR ASSISTANCE</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
