import React, { useRef, useState, useEffect } from 'react';
import { Home, Mic2, Calendar, MapPin, Menu } from 'lucide-react';

export default function FestivalBottomNav({ activeNav, setActiveNav, showMoreMenu, setShowMoreMenu }) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(400);

  // Measure container width for responsive SVG notch calculation
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'artists', label: 'Artists', icon: Mic2 },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'maps', label: 'Maps', icon: MapPin },
    { id: 'more', label: 'More', icon: Menu }
  ];

  // Determine active index
  let activeIndex = 0;
  if (showMoreMenu) {
    activeIndex = 4;
  } else {
    const idx = navItems.findIndex(item => item.id === activeNav);
    activeIndex = idx !== -1 ? idx : 4; // default to More if on deep subpage like faq, weather, etc.
  }

  // Calculate SVG curve coordinates
  const h = 68;
  const cornerRadius = 24;
  const tabWidth = width / 5;
  const notchCenterX = (activeIndex + 0.5) * tabWidth;
  const notchRadius = 34;
  const notchDepth = 26;

  // Build smooth path
  // We constrain notch start/end to avoid clipping corner radii
  const nStart = Math.max(cornerRadius + 4, notchCenterX - notchRadius);
  const nEnd = Math.min(width - cornerRadius - 4, notchCenterX + notchRadius);

  const svgPath = `
    M 0 ${cornerRadius}
    Q 0 0 ${cornerRadius} 0
    L ${nStart} 0
    C ${nStart + 12} 0, ${notchCenterX - 18} ${notchDepth}, ${notchCenterX} ${notchDepth}
    C ${notchCenterX + 18} ${notchDepth}, ${nEnd - 12} 0, ${nEnd} 0
    L ${width - cornerRadius} 0
    Q ${width} 0 ${width} ${cornerRadius}
    L ${width} ${h - cornerRadius}
    Q ${width} ${h} ${width - cornerRadius} ${h}
    L ${cornerRadius} ${h}
    Q 0 ${h} 0 ${h - cornerRadius}
    Z
  `;

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-3 inset-x-3 max-w-md mx-auto z-40 select-none"
    >
      <div
        ref={containerRef}
        className="relative h-[68px] filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.22)]"
      >
        {/* SVG Curved Bar Background */}
        <svg
          className="absolute inset-0 w-full h-full"
          width={width}
          height={h}
          viewBox={`0 0 ${width} ${h}`}
        >
          <path
            d={svgPath}
            fill="#FFFFFF"
            className="transition-all duration-300 ease-out"
          />
        </svg>

        {/* Elevated Active Circular Bubble */}
        <div
          className="absolute -top-5 transition-all duration-300 ease-out pointer-events-none"
          style={{
            left: `${notchCenterX}px`,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="w-[54px] h-[54px] rounded-full bg-white shadow-[0_8px_20px_rgba(0,0,0,0.2)] p-1.5 flex items-center justify-center border-2 border-slate-100">
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#6366f1] via-[#8b5cf6] to-[#d946ef] flex items-center justify-center text-white shadow-inner">
              {React.createElement(navItems[activeIndex].icon, {
                size: 22,
                strokeWidth: 2.4,
                className: 'drop-shadow-sm'
              })}
            </div>
          </div>
        </div>

        {/* 5 Tab Navigation Items */}
        <div className="relative z-10 grid grid-cols-5 h-full">
          {navItems.map((item, idx) => {
            const isActive = idx === activeIndex;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'more') {
                    setShowMoreMenu(!showMoreMenu);
                  } else {
                    setActiveNav(item.id);
                    setShowMoreMenu(false);
                  }
                }}
                className="relative flex flex-col items-center justify-end pb-2 pt-1 transition-all outline-none"
              >
                {/* When inactive, render the outline icon in the upper portion */}
                {!isActive ? (
                  <div className="flex flex-col items-center gap-1 text-slate-700 hover:text-slate-900 transition-colors">
                    <Icon size={20} strokeWidth={1.9} />
                    <span className="text-[11px] font-medium tracking-tight text-slate-500">
                      {item.label}
                    </span>
                  </div>
                ) : (
                  /* When active, show bold label right under the curved notch dip */
                  <div className="flex flex-col items-center">
                    <span className="text-[12px] font-black tracking-tight text-slate-900">
                      {item.label}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
