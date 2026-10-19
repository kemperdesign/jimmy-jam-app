import React from 'react';

/**
 * Custom BBQ & Festival Badge Emblems
 * Inspired directly by circular pitmaster emblems:
 * - Concentric rings & border beads
 * - Flaming kettle grill & crossed cleavers/utensils
 * - Vibrant gradient fills & vintage festival badge styling
 */

// 1. BBQ Slam Pitmaster Grill Badge (like Family Fed / Aviv Barbecue)
export const BbqGrillBadge = ({ className = "w-12 h-12", glow = true }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bbqFlameGrad" x1="50" y1="5" x2="50" y2="45" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFF176" />
        <stop offset="35%" stopColor="#FF7043" />
        <stop offset="100%" stopColor="#D84315" />
      </linearGradient>
      <linearGradient id="goldRingGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFE082" />
        <stop offset="50%" stopColor="#FFB300" />
        <stop offset="100%" stopColor="#FF6F00" />
      </linearGradient>
      <linearGradient id="grillBowlGrad" x1="50" y1="42" x2="50" y2="70" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#424242" />
        <stop offset="100%" stopColor="#1A1817" />
      </linearGradient>
      {glow && (
        <filter id="bbqGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#FF5722" floodOpacity="0.4" />
        </filter>
      )}
    </defs>

    {/* Outer badge rings */}
    <circle cx="50" cy="50" r="47" stroke="url(#goldRingGrad)" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="43.5" stroke="#E53935" strokeWidth="1.5" strokeDasharray="3 2" />
    <circle cx="50" cy="50" r="40" fill="#1C1815" />

    {/* Rising BBQ Flames */}
    <path
      d="M50 10 C52 18, 59 22, 57 28 C56 31, 52 32, 53 35 C54 38, 58 40, 56 44 C53 47, 47 47, 44 44 C42 40, 46 38, 47 35 C48 32, 44 31, 43 28 C41 22, 48 18, 50 10 Z"
      fill="url(#bbqFlameGrad)"
      filter={glow ? "url(#bbqGlow)" : undefined}
    />
    <path
      d="M40 22 C42 26, 46 29, 44 34 C43 37, 39 39, 41 43 C37 44, 34 40, 36 36 C37 33, 35 30, 37 27 C39 24, 39 23, 40 22 Z"
      fill="#FFB300"
      opacity="0.85"
    />
    <path
      d="M60 22 C58 26, 54 29, 56 34 C57 37, 61 39, 59 43 C63 44, 66 40, 64 36 C63 33, 65 30, 63 27 C61 24, 61 23, 60 22 Z"
      fill="#FFB300"
      opacity="0.85"
    />

    {/* Crossed Fork & Spatula behind grill */}
    <g stroke="url(#goldRingGrad)" strokeWidth="2" strokeLinecap="round">
      {/* Spatula */}
      <line x1="20" y1="78" x2="74" y2="28" />
      <path d="M71 25 L80 33 L75 38 L66 30 Z" fill="url(#goldRingGrad)" stroke="none" />
      {/* Fork */}
      <line x1="80" y1="78" x2="26" y2="28" />
      <path d="M22 25 L29 32 M25 22 L32 29 M29 20 L35 26" strokeWidth="2" />
    </g>

    {/* Kettle Grill Bowl */}
    <path
      d="M28 47 Q50 43 72 47 Q70 65 50 67 Q30 65 28 47 Z"
      fill="url(#grillBowlGrad)"
      stroke="url(#goldRingGrad)"
      strokeWidth="2"
    />
    {/* Grill Rim & Grate line */}
    <ellipse cx="50" cy="47" rx="22" ry="3.5" fill="#2E2A27" stroke="url(#goldRingGrad)" strokeWidth="1.5" />
    <line x1="33" y1="47" x2="67" y2="47" stroke="#FFD54F" strokeWidth="1" strokeDasharray="2 2" />

    {/* Grill Stand / Legs */}
    <path d="M37 66 L33 78 M63 66 L67 78 M50 67 L50 78" stroke="url(#goldRingGrad)" strokeWidth="2" strokeLinecap="round" />
    <line x1="34" y1="74" x2="66" y2="74" stroke="url(#goldRingGrad)" strokeWidth="1.5" />

    {/* Stars & Accents */}
    <path d="M19 50 L20.5 53 L24 53.5 L21.5 56 L22 59.5 L19 58 L16 59.5 L16.5 56 L14 53.5 L17.5 53 Z" fill="#FFD54F" />
    <path d="M81 50 L82.5 53 L86 53.5 L83.5 56 L84 59.5 L81 58 L78 59.5 L78.5 56 L76 53.5 L79.5 53 Z" fill="#FFD54F" />

    {/* Smoke Ring Base Text Ribbon */}
    <path d="M26 83 Q50 90 74 83" stroke="#E53935" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 2. Crossed Meat Cleavers Pitmaster Badge (like J SMOKE emblem)
export const CrossedCleaversBadge = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cleaverBladeGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#CFD8DC" />
        <stop offset="100%" stopColor="#78909C" />
      </linearGradient>
      <linearGradient id="smokeRedRing" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FF5252" />
        <stop offset="100%" stopColor="#B71C1C" />
      </linearGradient>
      <linearGradient id="cleaverFlames" x1="50" y1="8" x2="50" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFEB3B" />
        <stop offset="40%" stopColor="#FF5722" />
        <stop offset="100%" stopColor="#D50000" />
      </linearGradient>
    </defs>

    {/* Badge Circles */}
    <circle cx="50" cy="50" r="47" stroke="url(#smokeRedRing)" strokeWidth="3" />
    <circle cx="50" cy="50" r="43" stroke="#FFE082" strokeWidth="1" strokeDasharray="3 3" />
    <circle cx="50" cy="50" r="39" fill="#181412" />

    {/* Top Crown Flame */}
    <path
      d="M50 11 C52 17, 58 20, 56 26 C55 29, 51 31, 53 34 C50 36, 46 34, 47 30 C45 28, 43 25, 45 21 C47 16, 49 14, 50 11 Z"
      fill="url(#cleaverFlames)"
    />

    {/* Crossed Meat Cleavers */}
    <g transform="translate(50,54) rotate(-35) translate(-50,-50)">
      {/* Blade 1 */}
      <rect x="36" y="24" width="28" height="18" rx="2" fill="url(#cleaverBladeGrad)" stroke="#37474F" strokeWidth="1" />
      <circle cx="41" cy="29" r="2" fill="#263238" />
      {/* Handle 1 */}
      <rect x="47" y="42" width="6" height="26" rx="3" fill="#8D6E63" stroke="#3E2723" strokeWidth="1" />
      <circle cx="50" cy="48" r="1" fill="#D7CCC8" />
      <circle cx="50" cy="58" r="1" fill="#D7CCC8" />
    </g>

    <g transform="translate(50,54) rotate(35) translate(-50,-50)">
      {/* Blade 2 */}
      <rect x="36" y="24" width="28" height="18" rx="2" fill="url(#cleaverBladeGrad)" stroke="#37474F" strokeWidth="1" />
      <circle cx="59" cy="29" r="2" fill="#263238" />
      {/* Handle 2 */}
      <rect x="47" y="42" width="6" height="26" rx="3" fill="#8D6E63" stroke="#3E2723" strokeWidth="1" />
      <circle cx="50" cy="48" r="1" fill="#D7CCC8" />
      <circle cx="50" cy="58" r="1" fill="#D7CCC8" />
    </g>

    {/* Mini crossed forks below */}
    <path d="M42 80 L58 80 M50 74 L50 86" stroke="#FFE082" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="50" cy="80" r="1.5" fill="#FF5252" />
  </svg>
);

// 3. Vintage Carnival / Festival "BUY TICKETS" Stamp Badge (like Tanglefoot screenshot)
export const BuyTicketsStampBadge = ({ className = "w-20 h-20" }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ticketBlueRing" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0288D1" />
        <stop offset="100%" stopColor="#01579B" />
      </linearGradient>
    </defs>

    {/* Concentric rings */}
    <circle cx="60" cy="60" r="56" stroke="url(#ticketBlueRing)" strokeWidth="4" />
    <circle cx="60" cy="60" r="50" stroke="#0288D1" strokeWidth="1.5" strokeDasharray="4 3" />
    <circle cx="60" cy="60" r="45" fill="#E1F5FE" />

    {/* Stars around perimeter */}
    <g fill="#0277BD">
      <path d="M60 22 L61.5 25 L65 25.5 L62.5 28 L63 31.5 L60 30 L57 31.5 L57.5 28 L55 25.5 L58.5 25 Z" />
      <path d="M60 90 L61.5 93 L65 93.5 L62.5 96 L63 99.5 L60 98 L57 99.5 L57.5 96 L55 93.5 L58.5 93 Z" />
      <circle cx="34" cy="60" r="2" />
      <circle cx="86" cy="60" r="2" />
    </g>

    {/* Center Typography */}
    <text
      x="60"
      y="54"
      textAnchor="middle"
      fontFamily="Bebas Neue, Impact, sans-serif"
      fontSize="22"
      fontWeight="bold"
      letterSpacing="2"
      fill="#01579B"
    >
      BUY
    </text>
    <text
      x="60"
      y="76"
      textAnchor="middle"
      fontFamily="Bebas Neue, Impact, sans-serif"
      fontSize="20"
      fontWeight="bold"
      letterSpacing="1.5"
      fill="#01579B"
    >
      TICKETS
    </text>

    {/* Accent Stars under text */}
    <g fill="#0288D1" transform="translate(60, 83) scale(0.7) translate(-60, -83)">
      <polygon points="60,80 61,82 63,82.5 61.5,84 62,86 60,85 58,86 58.5,84 57,82.5 59,82" />
      <polygon points="50,80 51,82 53,82.5 51.5,84 52,86 50,85 48,86 48.5,84 47,82.5 49,82" />
      <polygon points="70,80 71,82 73,82.5 71.5,84 72,86 70,85 68,86 68.5,84 67,82.5 69,82" />
    </g>
  </svg>
);

// 4. Bourbon & Barrel Emblem Badge
export const BourbonBadge = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="amberBarrelGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFA000" />
        <stop offset="100%" stopColor="#E65100" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="47" stroke="url(#amberBarrelGrad)" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="43" stroke="#FFD54F" strokeWidth="1" strokeDasharray="3 2" />
    <circle cx="50" cy="50" r="39" fill="#20150F" />

    {/* Oak Barrel */}
    <ellipse cx="50" cy="36" rx="14" ry="4" fill="#8D6E63" stroke="#D7CCC8" strokeWidth="1" />
    <path
      d="M36 36 C34 44, 34 56, 37 64 C42 66, 58 66, 63 64 C66 56, 66 44, 64 36 Z"
      fill="#5D4037"
      stroke="#BCAAA4"
      strokeWidth="1.5"
    />
    <line x1="35" y1="45" x2="65" y2="45" stroke="#FFA000" strokeWidth="1.5" />
    <line x1="35" y1="55" x2="65" y2="55" stroke="#FFA000" strokeWidth="1.5" />

    {/* Bourbon Glass with Amber Whiskey */}
    <path d="M44 68 L42 82 Q50 84 58 82 L56 68 Z" fill="#FFA000" stroke="#FFD54F" strokeWidth="1.5" />
    <path d="M43 73 Q50 75 57 73 L56 80 Q50 82 44 80 Z" fill="#E65100" />

    {/* Top Flame / Vapor */}
    <path d="M50 16 C53 22, 57 24, 55 28 C53 30, 48 30, 47 26 C46 23, 49 20, 50 16 Z" fill="#FFB300" />
  </svg>
);

// 5. Lineup & Music Performers Badge
export const PerformersBadge = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="musicFlameGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#42A5F5" />
        <stop offset="100%" stopColor="#1565C0" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="47" stroke="url(#musicFlameGrad)" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="43" stroke="#90CAF9" strokeWidth="1" strokeDasharray="3 2" />
    <circle cx="50" cy="50" r="39" fill="#0D1B2A" />

    {/* Vintage Festival Microphone */}
    <rect x="44" y="28" width="12" height="20" rx="6" fill="#B0BEC5" stroke="#ECEFF1" strokeWidth="1.5" />
    <line x1="44" y1="34" x2="56" y2="34" stroke="#37474F" strokeWidth="1" />
    <line x1="44" y1="40" x2="56" y2="40" stroke="#37474F" strokeWidth="1" />
    <line x1="50" y1="28" x2="50" y2="48" stroke="#37474F" strokeWidth="1" />

    {/* Mic Stand / U-clamp */}
    <path d="M40 38 C40 52, 60 52, 60 38" stroke="#90CAF9" strokeWidth="2" fill="none" />
    <line x1="50" y1="52" x2="50" y2="68" stroke="#90CAF9" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="40" y1="68" x2="60" y2="68" stroke="#90CAF9" strokeWidth="3" strokeLinecap="round" />

    {/* Musical Notes & Wings */}
    <path d="M26 42 Q20 34 24 26 Q30 32 30 40" fill="#64B5F6" />
    <path d="M74 42 Q80 34 76 26 Q70 32 70 40" fill="#64B5F6" />

    {/* Bottom Stars */}
    <path d="M50 76 L51.5 79 L55 79.5 L52.5 82 L53 85.5 L50 84 L47 85.5 L47.5 82 L45 79.5 L48.5 79 Z" fill="#FFE082" />
  </svg>
);

// 6. People's Choice Tasting Ballot Ribbon Badge
export const TastingBallotBadge = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ballotGold" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFE082" />
        <stop offset="50%" stopColor="#FFB300" />
        <stop offset="100%" stopColor="#FF6F00" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="46" r="38" stroke="url(#ballotGold)" strokeWidth="3" fill="#1C1815" />
    <circle cx="50" cy="46" r="33" stroke="#E53935" strokeWidth="1.5" strokeDasharray="3 2" />

    {/* Tasting Rosette / Star Medal */}
    <g fill="url(#ballotGold)">
      <polygon points="50,22 53,30 62,31 55,37 57,45 50,40 43,45 45,37 38,31 47,30" />
    </g>

    {/* "RATE / VOTE" text arc */}
    <text
      x="50"
      y="62"
      textAnchor="middle"
      fontFamily="Bebas Neue, Impact, sans-serif"
      fontSize="12"
      fontWeight="bold"
      letterSpacing="1"
      fill="#FFE082"
    >
      PEOPLE'S CHOICE
    </text>

    {/* Ribbon Tails */}
    <path d="M42 78 L34 94 L44 91 L50 94 L46 78 Z" fill="#D32F2F" stroke="#B71C1C" strokeWidth="1" />
    <path d="M58 78 L66 94 L56 91 L50 94 L54 78 Z" fill="#D32F2F" stroke="#B71C1C" strokeWidth="1" />
  </svg>
);

// 7. Festival Map Compass Badge
export const FestivalMapBadge = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="47" stroke="#0288D1" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="43" stroke="#81D4FA" strokeWidth="1" strokeDasharray="3 2" />
    <circle cx="50" cy="50" r="39" fill="#0A1E2B" />

    {/* Compass Star */}
    <polygon points="50,18 54,46 50,44 46,46" fill="#E53935" />
    <polygon points="50,82 54,54 50,56 46,54" fill="#CFD8DC" />
    <polygon points="18,50 46,46 44,50 46,54" fill="#CFD8DC" />
    <polygon points="82,50 54,46 56,50 54,54" fill="#E53935" />

    {/* Center Pin */}
    <circle cx="50" cy="50" r="6" fill="#FFE082" stroke="#FF6F00" strokeWidth="2" />
    <circle cx="50" cy="50" r="2.5" fill="#E65100" />

    {/* Compass Cardinal Points */}
    <text x="50" y="27" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#FF5252">N</text>
  </svg>
);
