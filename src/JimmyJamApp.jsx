import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Star, Calendar, Ticket, Camera, Trophy, Users, Shirt, HeartHandshake, CloudSun, MessageCircle, X, Menu } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import AdminPins from './AdminPins';
import FestivalHome from './FestivalHome';
import FestivalSchedule from './FestivalSchedule';
import FestivalArtists from './FestivalArtists';
import FestivalFaq from './FestivalFaq';
import FestivalRecipes from './FestivalRecipes';
import FestivalBottomNav from './FestivalBottomNav';
import FestivalBallot from './FestivalBallot';
import FestivalAssistance from './FestivalAssistance';
import FestivalVolunteer from './FestivalVolunteer';
import FestivalWeather from './FestivalWeather';
import FestivalSwag from './FestivalSwag';
import FestivalMapsAndInfo from './FestivalMapsAndInfo';
import FestivalSponsors from './FestivalSponsors';
import FestivalGuide from './FestivalGuide';

// Capacitor's WKWebView doesn't reliably handle <a target="_blank"> or
// window.open() for external links — this opens them in the system's
// in-app Safari view on native iOS/Android, and falls back to a normal
// new tab on the web.
const openExternal = async (url) => {
  if (Capacitor.isNativePlatform()) {
    await Browser.open({ url });
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

const JimmyJamApp = () => {
  // St. Johns County Fairgrounds, 5840 State Rd. 207, Elkton, FL 32145 (real event venue)
  const EVENT_LAT = 29.7707068;
  const EVENT_LON = -81.4533597;
  const EVENT_VENUE_NAME = 'St. Johns County Fairgrounds';
  const EVENT_VENUE_ADDRESS = '5840 State Rd. 207, Elkton, FL 32145';
  const EVENT_DATE_LABEL = 'January 9, 2027';

  const [showSplash, setShowSplash] = useState(true);
  const [activeNav, setActiveNav] = useState('home');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [openRegistration, setOpenRegistration] = useState(null);
  const [seasonView, setSeasonView] = useState('list');
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const [mySchedule, setMySchedule] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('jj_my_schedule') || '[]');
    } catch {
      return [];
    }
  });
  const [tideData, setTideData] = useState(null);
  const [tideError, setTideError] = useState('');

  useEffect(() => {
    try { localStorage.setItem('jj_my_schedule', JSON.stringify(mySchedule)); } catch {}
  }, [mySchedule]);

  const toggleMySchedule = (eventTitle) => {
    setMySchedule(prev => prev.includes(eventTitle) ? prev.filter(t => t !== eventTitle) : [...prev, eventTitle]);
  };

  const [favoriteArtists, setFavoriteArtists] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('jj_favorite_artists') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try { localStorage.setItem('jj_favorite_artists', JSON.stringify(favoriteArtists)); } catch {}
  }, [favoriteArtists]);

  const toggleFavoriteArtist = (artistId) => {
    setFavoriteArtists(prev => prev.includes(artistId) ? prev.filter(id => id !== artistId) : [...prev, artistId]);
  };

  const addArtistToCalendar = (artist) => {
    const toIcsDate = (dateStr, timeStr) => {
      const d = new Date(`${dateStr}T${timeStr || '00:00'}:00`);
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    };
    const start = toIcsDate(artist.eventDate, artist.eventStartTime);
    const endDate = new Date(`${artist.eventDate}T${artist.eventStartTime || '00:00'}:00`);
    endDate.setHours(endDate.getHours() + 1);
    const pad = (n) => String(n).padStart(2, '0');
    const end = `${endDate.getFullYear()}${pad(endDate.getMonth() + 1)}${pad(endDate.getDate())}T${pad(endDate.getHours())}${pad(endDate.getMinutes())}00`;
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Jimmy Jam BBQ Slam//Artist Schedule//EN',
      'BEGIN:VEVENT',
      `UID:artist-${artist.id}@jimmyjambbqslam`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${artist.name} — Jimmy Jam BBQ Slam`,
      `DESCRIPTION:${(artist.description || '').replace(/\n/g, ' ')}`,
      `LOCATION:${artist.stage || ''}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${artist.name.replace(/[^a-z0-9]+/gi, '-')}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  // Set default tabs when navigating to specific pages
  useEffect(() => {
    if (activeNav === 'weather') {
      setActiveTab('forecast');
    } else if (activeNav === 'swag') {
      setActiveTab('festival');
    } else if (activeNav === 'maps') {
      setActiveTab('gps');
    } else if (activeNav === 'events') {
      setActiveTab('overview');
    } else if (activeNav === 'bourbon') {
      setActiveTab('bbq');
    }
  }, [activeNav]);
  // SPONSORS DATA — real 2027 sponsors pulled from jimmyjambbqslam.com/sponsors.
  // Logo images use GoDaddy CSS backgrounds we couldn't extract programmatically,
  // so these use a generic badge icon until real logo files are supplied.
  const sponsorsData = [
    { id: 0, name: 'The Shee Family', tier: 'Title Sponsor', logo: '🏆', logoImage: '/sponsor-logos/shee-family-title-sponsor.svg', website: null, description: 'Title Sponsor of the 10th Annual Jimmy Jam BBQ Slam. The Shee Family also performed live at the 2026 event.' },
    { id: 3, name: 'My DUI Guy Law', tier: 'Community Sponsor', logo: '🤝', logoImage: '/sponsor-logos/my-dui-guy-law.png', website: 'https://www.myduiguy.law/', description: 'My DUI Guy, a division of Douglas Law Firm, is a Florida criminal defense practice led by Scott C. DuPont, a former Circuit Court Judge and prosecutor, focused primarily on DUI defense with in-person meetings in St. Augustine.' },
    { id: 4, name: 'Glacier HVAC', tier: 'Community Sponsor', logo: '🤝', logoImage: '/sponsor-logos/glacier-hvac.jpg', website: 'https://glacier-hvac.com/', description: 'Glacier Heating & Air Conditioning is a family-owned HVAC company based on Dobbs Road in St. Augustine, offering 24/7 residential and commercial repair, replacement, and maintenance throughout St. Johns County.' },
    { id: 5, name: 'Saint Augustine Slabs & Sawmill', tier: 'Community Sponsor', logo: '🤝', logoImage: '/sponsor-logos/saint-augustine-slabs.svg', website: 'https://saintaugustineslabsandsawmill.com/', description: 'Saint Augustine Slabs and Sawmill, located on Dobbs Road in St. Augustine, provides custom-cut wood slabs and offers free estimates for specific slab requests.' },
    { id: 6, name: 'St. Johns Cultural Council', tier: 'Community Sponsor', logo: '🤝', logoImage: '/sponsor-logos/st-johns-culture.png', website: 'https://stjohnsculture.com/', description: 'The St. Johns Cultural Council is a 501(c)(3) nonprofit and the designated Local Arts Agency for St. Johns County, supporting local artists and promoting the county as a cultural destination for residents and visitors.' },
    { id: 6.5, name: 'St. Johns County Tourist Development Council', tier: 'Community Sponsor', logo: '🤝', logoImage: '/sponsor-logos/st-johns-tdc.jpg', website: 'https://www.floridashistoriccoast.com/', description: 'Florida\'s Historic Coast (the St. Augustine, Ponte Vedra & The Beaches Visitors and Convention Bureau) promotes the area to leisure travelers and meeting planners, offering trip-planning, lodging, dining, and event resources.' },
    { id: 7, name: 'Mastercraft Builder Group', tier: 'Community Sponsor', logo: '🤝', logoImage: '/sponsor-logos/mastercraft-builder-group.webp', website: 'https://mastercraftbuildergroup.com/clays-for-a-cause-celebrates-10-years/', description: 'Mastercraft Builder Group, a Perry Homes company, builds new homes across Florida — including the Madeira, SilverLeaf, EverRange, and Istoria communities — and is also behind the long-running charity shoot Clays for a Cause.' },
    { id: 8, name: 'BNS Signs', tier: 'Community Sponsor', logo: '🤝', logoImage: '/sponsor-logos/bns-signs.png', website: 'https://bnssigns.com/', description: 'B&S Signs is a family-owned sign company in St. Augustine with over fifty years of experience, producing everything from vinyl lettering to large pylon signs along with repair, maintenance, and installation services.' },
    { id: 9, name: 'Dynamic Reel', tier: 'Community Sponsor', logo: '🤝', logoImage: '/sponsor-logos/dynamic-reel.png', website: 'https://www.dynamicreel.com/', description: 'Dynamic Reel Productions is a St. Augustine videography company producing corporate, event, promotional, and cause-driven video content for small businesses, corporations, and nonprofits across Northeast Florida.' },
    { id: 10, name: 'Sonny’s BBQ', tier: 'Community Sponsor', logo: '🤝', logoImage: '/sponsor-logos/sonnys-bbq.png', website: 'https://www.sonnysbbq.com/', description: 'Sonny\'s BBQ is a Southern barbecue restaurant chain founded in 1968, known for slow-smoked meats and its Random Acts of BBQ program that surprises local heroes and community members with free food.' },
    { id: 11, name: 'United Rentals', tier: 'Community Sponsor', logo: '🤝', logoImage: '/sponsor-logos/united-rentals.png', website: 'https://www.unitedrentals.com/locations/fl/jacksonville/power-hvac-rentals/g80', description: 'United Rentals\' Jacksonville branch supplies power generation and HVAC rental equipment for construction sites and events, part of the world\'s largest equipment rental company.' },
    { id: 12, name: 'Bozard Ford', tier: 'Community Sponsor', logo: '🤝', logoImage: '/sponsor-logos/bozard-ford.svg', website: 'https://bozardford.com/', description: 'Bozard Ford is a Ford dealership at 540 Outlet Mall Blvd in St. Augustine offering new trucks, used cars, service, parts, and financing to the greater Jacksonville area.' },
    { id: 1, name: 'Evans Automotive', tier: "People's Choice — Chili & Chowder", logo: '🌶️', logoImage: '/sponsor-logos/evans-automotive.jpg', website: 'https://www.evans-automotive.com/', description: 'Evans Automotive & Tire Center is a family-owned auto repair shop on Pinecrest St. in St. Augustine with over 25 years of experience in brakes, A/C, transmission, alignment, and tire service — and sponsor of the Chili & Chowder People\'s Choice competition.' },
    { id: 2, name: 'Steelhead Plumbing', tier: "People's Choice — BBQ", logo: '🍖', logoImage: '/sponsor-logos/steelhead-plumbing.png', website: 'https://steelheadplumbing.com/', description: 'Steelhead Plumbing LLC is a licensed and insured St. Augustine plumbing contractor serving residential and commercial clients, and a supporter of the St. Johns Police Athletic League — now sponsoring the BBQ People\'s Choice competition.' },
    { id: 13, name: 'Hometech Pest Control', tier: 'Banner Sponsor', logo: '🏳️', logoImage: '/sponsor-logos/hometech.jpg', website: 'https://hometechpest.com/', description: 'HomeTech Pest Solutions is a family-run pest control company operating locally since 2005, offering residential and commercial pest, termite, and rodent control along with wood-destroying organism inspections.' },
    { id: 14, name: 'Perfect Promo Solutions', tier: 'Banner Sponsor', logo: '🏳️', logoImage: '/sponsor-logos/pps.png', website: 'https://www.perfectpromosolutions.com/', description: 'Perfect Promo Solutions supplies custom-branded promotional merchandise — apparel, drinkware, bags, awards, and tech accessories — along with printing, wraps, and wooden gifts to help local businesses promote their brands.' },
    { id: 15, name: 'MySALL.org', tier: 'Banner Sponsor', logo: '🏳️', logoImage: '/sponsor-logos/mysall.png', website: 'https://mysall.org/', description: 'St. Augustine Little League ("SALL") is a youth baseball organization handling player registration, divisions, game scheduling, and volunteer and sponsorship programs for local kids.' },
    { id: 16, name: 'Edwards Law Firm', tier: 'Banner Sponsor', logo: '🏳️', logoImage: '/sponsor-logos/edwards.png', website: 'https://edwardslawfirm.com/', description: 'The Edwards Law Firm serves clients in Jacksonville, St. Augustine, Fernandina Beach, and Mandarin, focusing on estate planning and elder law — including asset protection, probate, long-term care planning, and veterans\' benefits.' },
    { id: 17, name: 'Melvin’s Auto & Truck Repair', tier: 'Banner Sponsor', logo: '🏳️', logoImage: '/sponsor-logos/melvins.png', website: 'https://www.melvinsautoandtruckrepair.com/', description: 'Melvin\'s Auto & Truck Repair is an auto repair shop in St. Augustine working on both cars and trucks.' },
    { id: 18, name: 'MRT St. Augustine', tier: 'Banner Sponsor', logo: '🏳️', logoImage: '/sponsor-logos/mrT.jpg', website: 'https://mrtstaug.com/', description: 'Mr. T\'s Mechanical Refrigerated Technologies is a state-licensed HVAC and refrigeration contractor in St. Augustine, operating since 2002 and serving homes, businesses, and commercial refrigeration like walk-in coolers and ice machines.' },
    { id: 19, name: 'SSS BBQ Inc.', tier: 'Banner Sponsor', logo: '🏳️', logoImage: '/sponsor-logos/sssbbqinc-logo-web.webp', website: 'https://www.sssbbqinc.com/', description: 'Schrader\'s Smoker Service (SSS BBQ Inc.) is a family-run north central Florida business selling commercial-grade smokers and BBQ grills, with parts, repairs, rentals, and relocation services across the Southeast — in business since 1999 as an authorized Southern Pride distributor.' },
    { id: 20, name: 'PV Golf Carts', tier: 'Banner Sponsor', logo: '🏳️', logoImage: '/sponsor-logos/pv-logo-oval.png', website: 'https://www.pvgolfcarts.com/', description: 'Ponte Vedra Golf Carts is a locally owned Club Car and Sierra LSV dealer serving Jacksonville, Ponte Vedra Beach, and Nocatee, with new and refurbished carts plus service, parts, and rentals.' },
    { id: 21, name: 'Best Sub Sandwich', tier: 'Banner Sponsor', logo: '🏳️', logoImage: '/sponsor-logos/logo_top.png', website: 'https://bestsubsandwich.com/', description: 'Old City Subs is a St. Augustine sub sandwich shop founded in 2009, offering subs, salads, catering, and free local delivery from its US-1 South location.' },
    { id: 22, name: 'Tillman’s BBQ', tier: 'Banner Sponsor', logo: '🏳️', logoImage: '/sponsor-logos/tillmans-bbq.png', website: 'https://tillmansbbq.com/', description: 'Tillman\'s Barbecue sells BBQ sauces and dry rubs, including Grandma\'s Red Sauce based on a family recipe from the 1940s, along with wholesale and retail distribution across the region.' },
    { id: 23, name: 'Honorable Discharge', tier: 'Banner Sponsor', logo: '🏳️', logoImage: '/sponsor-logos/hdlogo.png', website: 'https://honorable-discharge.com/', description: 'Honorable Discharge Portable Latrines is a veteran-owned, family-owned company in Elkton, FL, renting portable toilets, wash stations, and RV/boat pump-out services for construction sites, events, and rural properties across Saint Johns, Flagler, and Putnam counties.' },
    { id: 24, name: 'Outdoor Site Solutions', tier: 'Banner Sponsor', logo: '🏳️', logoImage: '/sponsor-logos/odss.jpg', website: 'https://www.facebook.com/p/Outdoor-Site-Solutions-LLC-100054171442698/', description: 'Proud 2027 Banner Sponsor of the Jimmy Jam BBQ Slam.' }
  ];

  // ARTISTS DATA — only confirmed real acts. No named lineup has been announced for the
  // main BBQ Slam (the real site only says "local and regional artists"), so we do not
  // invent names, set times, or stages for it. The Futch Brothers Band is the one
  // confirmed act, for the separate ticketed Bourbon & BBQ Event.
  const artistsData = [
    {
      id: 1,
      name: 'The Futch Brothers Band',
      genre: 'Performing at the 3rd Annual Bourbon & BBQ Event',
      logo: '🎸',
      image: 'https://images.zoogletools.com/s:bzglfiles/u/188709/0fadb2caa1a76a2c326d930c9511749d8c4dbf86/original/photo-output-4.jpeg/!!/b%3AW1sicmVzaXplIiwxODAwXSxbIm1heCJdLFsid2UiXV0%3D/meta%3AeyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ%3D%3D.jpg',
      website: 'https://brianfutch.com/',
      description: 'Led by singer-songwriter Brian Futch, Brothers Futch plays a genre-spanning mix described on their own site as "rock to country to blues to folk to Americana," with original songs about life and love. The band played more than 50 shows in 2025 and is working on an EP of original material. They perform on the patio immediately following the evening program at the 3rd Annual Bourbon & BBQ Event at The Tringali Barn.',
      time: 'After dinner',
      stage: 'Bourbon & BBQ Event (Tringali Barn)',
      eventDate: '2026-10-17',
      eventStartTime: '20:00'
    },
    {
      id: 2,
      name: 'Local & Regional Artists',
      genre: 'BBQ Slam main stage lineup — to be announced',
      logo: '🎵',
      image: null,
      description: 'The Jimmy Jam BBQ Slam’s live music lineup features local and regional artists playing a mix of country, rock, blues, and classic favorites all day. Live music is included with event admission. The full lineup will be announced closer to the event date.',
      time: 'All day',
      stage: `${EVENT_VENUE_NAME}`,
      eventDate: '2027-01-09',
      eventStartTime: '10:00'
    }
  ];

  const [selectedArtist, setSelectedArtist] = useState(null);
  const [activeEmbeddedUrl, setActiveEmbeddedUrl] = useState(null);
  const [embeddedTitle, setEmbeddedTitle] = useState('Register & Tickets');

  const openInAppModal = (url, title = 'Register & Tickets') => {
    if (!url) return;
    setActiveEmbeddedUrl(url);
    setEmbeddedTitle(title);
  };

  // NOAA station 8720576 — St. Augustine, City Dock, FL (nearest tide station to the venue)
  const TIDE_STATION_ID = '8720576';
  const TIDE_STATION_NAME = 'St. Augustine, City Dock, FL';

  useEffect(() => {
    const fetchTides = async () => {
      try {
        // This station only publishes hi/lo predictions (no hourly curve), so we
        // interpolate the 24-hour curve from the real hi/lo points using the
        // standard tidal cosine approximation between consecutive extremes.
        const base = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?station=${TIDE_STATION_ID}&datum=MLLW&time_zone=lst_ldt&units=english&format=json&date=today&interval=hilo&product=predictions`;

        const res = await fetch(base);
        if (!res.ok) throw new Error('Tide request failed');

        const json = await res.json();
        if (json.error || !json.predictions || json.predictions.length < 2) throw new Error('Tide data unavailable');

        const points = json.predictions.map(p => ({
          t: new Date(p.t.replace(' ', 'T')),
          v: parseFloat(p.v),
          type: p.type === 'H' ? 'High' : 'Low'
        }));

        const hiLo = points.map(p => ({
          time: p.t.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          level: `${p.v.toFixed(1)} ft`,
          type: p.type
        }));

        const dayStart = new Date(points[0].t);
        dayStart.setHours(0, 0, 0, 0);

        const hourly = Array.from({ length: 24 }, (_, hour) => {
          const t = new Date(dayStart.getTime() + hour * 60 * 60 * 1000);
          let before = points[0];
          let after = points[points.length - 1];
          for (let i = 0; i < points.length - 1; i++) {
            if (points[i].t <= t && points[i + 1].t >= t) {
              before = points[i];
              after = points[i + 1];
              break;
            }
          }
          if (before === after) return before.v;
          const span = after.t - before.t;
          const frac = span === 0 ? 0 : (t - before.t) / span;
          // Cosine interpolation matches the natural tide curve shape.
          const cosFrac = (1 - Math.cos(frac * Math.PI)) / 2;
          return before.v + (after.v - before.v) * cosFrac;
        });

        setTideData({ hiLo, hourly });
        setTideError('');
      } catch (err) {
        setTideError('Unable to load live tide data right now.');
      }
    };

    fetchTides();
    const interval = setInterval(fetchTides, 30 * 60 * 1000); // refresh every 30 min
    return () => clearInterval(interval);
  }, []);

  // Splash screen fallback timeout
  useEffect(() => {
    if (!showSplash) return;
    const fallback = setTimeout(() => setShowSplash(false), 11000);
    return () => clearTimeout(fallback);
  }, [showSplash]);

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 overflow-hidden">
        <video
          src="/jimmy-jam-new-intro.mp4"
          autoPlay
          muted
          playsInline
          onEnded={() => setShowSplash(false)}
          className="w-full h-full object-cover max-w-md mx-auto"
        />
        {/* Skip button */}
        <button
          onClick={() => setShowSplash(false)}
          className="absolute bottom-6 right-6 z-20 px-4 py-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/30 transition-all flex items-center gap-1.5 shadow-xl active:scale-95 cursor-pointer"
        >
          <span>Skip Intro</span>
          <span>→</span>
        </button>
      </div>
    );
  }

  // DETAILED SCHEDULE WITH TIMES
  // The real site (jimmyjambbqslam.com) confirms the main event date (Jan 9, 2027) but the
  // full hour-by-hour itinerary is still "Coming Soon" — these are only the specific day-of
  // windows actually confirmed there. We don't invent a fake schedule beyond that.
  const detailedSchedule = [
    { date: EVENT_DATE_LABEL, dateStr: 'Main Event', events: [
      { time: '10:00 AM', title: 'Cornhole Sign-Ups Open ($25/person, blind draw)', location: EVENT_VENUE_NAME, icon: '🌽' },
      { time: '11:00 AM', title: 'Cornhole Tournament Starts', location: EVENT_VENUE_NAME, icon: '🌽' },
      { time: '11:00 AM – 3:00 PM', title: 'Chili & Chowder People’s Choice Tasting (15+ Teams)', location: EVENT_VENUE_NAME, icon: '🌶️' },
      { time: '2:00 PM – 4:00 PM', title: 'BBQ People’s Choice Tasting (60+ Teams)', location: EVENT_VENUE_NAME, icon: '🍖' }
    ]},
    { date: 'October 17', dateStr: 'Sat', events: [
      { time: '6:00 PM – 7:00 PM', title: 'Welcome Cocktail & Hors d’oeuvres', location: 'The Tringali Barn', icon: '🥂' },
      { time: '7:00 PM', title: 'Dinner — 3rd Annual Bourbon & BBQ Event ($100/person)', location: 'The Tringali Barn', icon: '🥃' },
      { time: 'After Dinner', title: 'Live Music: The Futch Brothers Band', location: 'The Tringali Barn Patio', icon: '🎸' }
    ]}
  ];



  const sponsorTiers = [
    {
      name: 'Whole Hog Sponsor',
      icon: '🐷',
      perks: [
        'Large color vinyl banner at the event',
        'Logo on the event t-shirt',
        'Placement on the event website for 1 year',
        'Several mentions (with link) on social media',
        '12′×12′ vendor booth space',
        '5 free admission passes',
        '30 tasting tickets + 5 free beers',
        'Appreciation plaque',
        'VIP parking'
      ],
      addOns: ['Additional signage at designated attractions', '60-second company promo video filmed at the event', 'Mention in print advertising', 'Digital billboard at the event']
    },
    {
      name: 'BBQ People’s Choice Sponsor',
      icon: '🍖',
      perks: [
        'Large color vinyl banner at the BBQ People’s Choice ticket counter',
        'Company logo on all voting containers for every participating team',
        'Placement on the event website for 1 year',
        'Several mentions (with link) on social media',
        '5 free admission passes',
        '30 tasting tickets + 5 free beers',
        'Appreciation plaque',
        'VIP parking'
      ],
      addOns: ['60-second company promo video filmed at the event', 'Mention in print advertising', 'Digital billboard at the event']
    },
    {
      name: 'Chili People’s Choice Sponsor',
      icon: '🌶️',
      perks: [
        'Large color vinyl banner at the Chili People’s Choice ticket counter',
        'Company logo on all voting containers for every participating team',
        'Placement on the event website for 1 year',
        'Several mentions (with link) on social media',
        '5 free admission passes',
        '30 tasting tickets + 5 free beers',
        'Appreciation plaque',
        'VIP parking'
      ],
      addOns: ['60-second company promo video filmed at the event', 'Mention in print advertising', 'Digital billboard at the event']
    },
    {
      name: 'Little Piggy Sponsor',
      icon: '🐽',
      perks: [
        'Color banner at the entrance to the event',
        'Placement on the event website for 1 year',
        'One mention (with link) on social media',
        '12′×12′ vendor booth space',
        '5 free admission passes',
        '10 tasting tickets',
        'VIP parking'
      ]
    }
  ];

  const faqData = [
    {
      title: '📋 General',
      qa: [
        { q: 'What is the Jimmy Jam BBQ Slam?', a: 'A nonprofit event dedicated to celebrating BBQ, classic cars, live music, and community giving. All proceeds go toward helping individuals and families in need.' },
        { q: 'When and where is the event?', a: `${EVENT_VENUE_NAME}, ${EVENT_VENUE_ADDRESS}. The 11th Annual Jimmy Jam BBQ Slam is ${EVENT_DATE_LABEL}.` },
        { q: 'Is there an entry fee?', a: 'General admission is free. There are fees for tastings, competition entries, and vendor participation (see Registrations).' },
        { q: 'What can I expect at the event?', a: 'BBQ & Chili Cook-Offs, Live Music, Cornhole Tournament, Car Show, Food Vendors & Shopping, and Family-Friendly Activities.' },
        { q: 'Is there a cost for the live music?', a: 'No, live music is included with your event admission!' },
        { q: 'Is the event family-friendly?', a: 'Absolutely! We offer activities for all ages, including games, food, and entertainment.' },
        { q: 'Is parking available?', a: 'VIP parking available for VIP passholders and free parking to general admission patrons.' },
        { q: 'Are pets allowed?', a: 'Pets are welcome and must be leashed at all times.' }
      ],
      contact: 'jimmyjaminfo@gmail.com'
    },
    {
      title: '🍖 BBQ & Chili Competition',
      qa: [
        { q: 'How do I sign up for the Chili Cook-Off or BBQ Competition?', a: 'Registration is open to all interested competitors — see the Registrations section of this app.' },
        { q: 'How does the People’s Choice voting work?', a: 'Guests purchase $1 tasting tokens and receive voting tokens based on amount spent: Chili & Chowder (11am–3pm) is 1 voting token per $10 spent, BBQ (2pm–4pm) is 1 voting token per $20 spent.' },
        { q: 'Are there prizes for competition winners?', a: 'Yes! Trophies and bragging rights go to the top competitors in both judge-selected and People’s Choice categories.' }
      ],
      contact: 'jimmyjammarketing1@gmail.com'
    },
    {
      title: '🚗 Car Show',
      qa: [
        { q: 'How do I register my car for the show?', a: 'Car registration is $20 per vehicle if registered in advance, $25 on the day of the show (non-refundable). See the Registrations section.' },
        { q: 'What types of vehicles can enter?', a: 'Categories include Classic Cars, Trucks, and Motorcycles.' },
        { q: 'Will trophies be awarded?', a: 'Yes, trophies will be given out in multiple categories.' },
        { q: 'Can I register my car on the day of the event?', a: 'Yes, but the entry fee increases to $25 and spots are limited.' }
      ],
      contact: 'jimmyjammarketing1@gmail.com'
    },
    {
      title: '🅿️ Parking & Accommodations',
      qa: [
        { q: 'Where can I park?', a: 'VIP parking for VIP passholders; free general admission parking. Judges, team, vendor/volunteer/band, and handicap parking are all separately zoned on-site.' },
        { q: 'Where can I stay nearby?', a: 'Hampton Inn and Best Western Historical Inn both have a block of rooms reserved for Jimmy Jam BBQ Slam. Sun Outdoor Campground/RV Park is also nearby.' },
        { q: 'What amenities are available on-site?', a: 'Firewood, hot showers, and ice are available at the fairgrounds.' }
      ],
      contact: 'jimmyjaminfo@gmail.com'
    },
    {
      title: '♿ Services for People with Disabilities',
      qa: [
        { q: 'Is the event accessible?', a: 'Yes — handicap parking is available on-site. Email us to let us know what accommodations you need and we’ll do our best to help.' }
      ],
      contact: 'jimmyjaminfo@gmail.com'
    }
  ];

  const registrationDetails = [
    {
      title: 'BBQ Slam Events',
      icon: '🏆',
      url: 'https://jimmyjambbqslam.com/bbq-slam-events',
      description: 'The main event day: People’s Choice chili/chowder and BBQ tastings, the Cornhole Tournament, and live music all day long. See the Schedule tab for exact times.'
    },
    {
      title: 'BBQ Competition',
      icon: '🍖',
      url: 'https://jimmyjambbqslam.com/bbq-competition',
      fee: 'Ancillary contests: $25/entry • Over $17,000 in total payouts',
      description: 'An open BBQ competition with Backyard and Pro divisions (chicken, ribs, pork, brisket) plus a required People’s Choice category — every team gets free 30-amp power for it. Friday night also features ancillary contests: wings, Bloody Mary, best slider, best dessert, and best sauce.',
      details: [
        'Backyard division: Grand $1,000, Reserve Grand $500, plus per-category payouts',
        'Pro division: Grand $2,000, Reserve Grand $1,500, plus per-category payouts',
        'Friday ancillary contests pay $500 each, winner-takes-all'
      ]
    },
    {
      title: 'Chili Cook Off',
      icon: '🌶️',
      url: 'https://jimmyjambbqslam.com/chili-cook-off',
      description: 'Over 15 teams compete head-to-head for the Chili & Chowder People’s Choice title. Guests sample with $1 tasting tokens and earn a voting token for every $10 spent.'
    },
    {
      title: 'Car Show',
      icon: '🚗',
      url: 'https://jimmyjambbqslam.com/car-show',
      fee: '$20/vehicle pre-registered • $25 day-of (no refunds)',
      description: 'Classic cars, trucks, hot rods, and motorcycles on display all day, with trophies awarded across multiple categories and a People’s Choice vote.'
    },
    {
      title: 'Retail Vendors',
      icon: '⛺',
      url: 'https://jimmyjambbqslam.com/retail-vendors',
      fee: '$100 per 12′×12′ space • Payment due Dec 20',
      description: 'Outdoor booth space — bring your own tent, tables, and chairs (no electricity on site). Setup opens at 7 AM; vendors should be ready to go by 10 AM. Chain vendors/independent consultants (e.g. Paparazzi, Color Street, Scentsy) should confirm availability by email first, since only one per brand is allowed.'
    },
    {
      title: 'Food Vendors',
      icon: '🍔',
      url: 'https://jimmyjambbqslam.com/food-vendors',
      fee: '$200 + 10% of sales • Payment due Dec 20',
      description: 'Food truck vendor area, outdoors with no electricity or water on site. No beverage sales permitted. Setup opens at 7 AM; vendors should be ready to go by 10 AM.',
      details: [
        'Confirmed 2027 food vendors: Sapp Sucker BBQ Co., Ohana Italian Ice, Shores Nutrition, Pebble’s Pies, Kyle’s Camp Cookies, and King’s BBQ'
      ]
    },
    {
      title: 'Amenities',
      icon: '🏕️',
      url: 'https://jimmyjambbqslam.com/amenities',
      description: 'Nearby lodging includes Hampton Inn, Best Western Historical Inn, and Sun Outdoor Campground/RV Park. On-site amenities include firewood, hot showers, and ice.'
    },
    {
      title: 'Pizza Ancillary',
      icon: '🍕',
      url: 'https://jimmyjambbqslam.com/pizza-ancillary',
      description: 'An open pizza cook-off hosted by the Pizza Cook-Off Association, welcoming home cooks and local shops alike. Full rules are posted at pizzacook-off.com.'
    }
  ];

  const pastWinnersData = [
    { year: '2026', category: 'Pro Grand Champion', team: 'Maya Jane BBQ Co.', photo: '/winners/maya-jane-bbq-co-pro-grand-champion-2026.jpg', logo: '/winners/maya-jane-bbq-co-logo.jpg' },
    { year: '2026', category: 'Backyard Reserve Grand Champion', team: "Mike's Backyard BBQ", photo: '/winners/mikes-backyard-bbq-backyard-reserve-grand-champion-2026.jpg', logo: '/winners/mikes-backyard-bbq-logo.jpg' },
    { year: '2026', category: "People's Choice", team: 'So So BBQ', photo: '/winners/so-so-bbq-peoples-choice-2026.jpg', logo: null }
  ];

  // Real photos from the 10th Annual Jimmy Jam BBQ Slam, January 2026.
  const galleryPhotos = [
    { id: 'dji1', src: '/images/event-photos/dji_20260110112149_0919_d.jpg', title: 'Car Show', desc: 'Aerial view of the car show grounds' },
    { id: 'dji2', src: '/images/event-photos/dji_20260110141907_0933_d.jpg', title: 'Event Grounds', desc: 'Aerial view of the fairgrounds' },
    { id: 'dji3', src: '/images/event-photos/dji_20260110141945_0934_d.jpg', title: 'Event Grounds', desc: 'Aerial view of the fairgrounds' },
    { id: 'dji4', src: '/images/event-photos/dji_20260110142150_0939_d.jpg', title: 'Event Grounds', desc: 'Aerial view of the fairgrounds' },
    { id: 'p387', src: '/images/event-photos/dsc08387.jpg', title: 'Car Show', desc: 'Classic cars and hot rods on display' },
    { id: 'p388', src: '/images/event-photos/dsc08388.jpg', title: 'Car Show', desc: 'Classic cars and hot rods on display' },
    { id: 'p394', src: '/images/event-photos/dsc08394.jpg', title: 'Car Show', desc: 'Classic cars and hot rods on display' },
    { id: 'p399', src: '/images/event-photos/dsc08399.jpg', title: 'Vendors & Community', desc: 'Guests browsing vendor booths' },
    { id: 'p401', src: '/images/event-photos/dsc08401.jpg', title: 'Vendors & Community', desc: 'Guests browsing vendor booths' },
    { id: 'p402', src: '/images/event-photos/dsc08402.jpg', title: 'Vendors & Community', desc: 'Guests browsing vendor booths' },
    { id: 'p404', src: '/images/event-photos/dsc08404.jpg', title: 'Vendors & Community', desc: 'Guests browsing vendor booths' },
    { id: 'p406', src: '/images/event-photos/dsc08406.jpg', title: 'Vendors & Community', desc: 'Guests browsing vendor booths' },
    { id: 'p408', src: '/images/event-photos/dsc08408.jpg', title: 'Vendors & Community', desc: 'Guests browsing vendor booths' },
    { id: 'p414', src: '/images/event-photos/dsc08414.jpg', title: 'BBQ Pitmasters', desc: 'Competition BBQ teams at work' },
    { id: 'p416', src: '/images/event-photos/dsc08416.jpg', title: 'BBQ Pitmasters', desc: 'Competition BBQ teams at work' },
    { id: 'p417', src: '/images/event-photos/dsc08417.jpg', title: 'BBQ Pitmasters', desc: 'Competition BBQ teams at work' },
    { id: 'p418', src: '/images/event-photos/dsc08418.jpg', title: 'BBQ Pitmasters', desc: 'Competition BBQ teams at work' },
    { id: 'p427', src: '/images/event-photos/dsc08427.jpg', title: 'BBQ Pitmasters', desc: 'Competition BBQ teams at work' },
    { id: 'p429', src: '/images/event-photos/dsc08429.jpg', title: 'BBQ Pitmasters', desc: 'Competition BBQ teams at work' },
    { id: 'p432', src: '/images/event-photos/dsc08432.jpg', title: 'BBQ Pitmasters', desc: 'Smokin’ Spencer’s Q & Kings BBQ' },
    { id: 'p435', src: '/images/event-photos/dsc08435.jpg', title: 'BBQ Pitmasters', desc: 'Competition BBQ teams at work' },
    { id: 'p438', src: '/images/event-photos/dsc08438.jpg', title: 'BBQ Pitmasters', desc: 'Competition BBQ teams at work' },
    { id: 'p443', src: '/images/event-photos/dsc08443.jpg', title: 'Competition BBQ', desc: 'Championship-worthy ribs' },
    { id: 'p450', src: '/images/event-photos/dsc08450.jpg', title: 'BBQ Pitmasters', desc: 'Competition BBQ teams at work' },
    { id: 'p454', src: '/images/event-photos/dsc08454.jpg', title: 'BBQ Pitmasters', desc: 'Competition BBQ teams at work' },
    { id: 'p463', src: '/images/event-photos/dsc08463.jpg', title: 'Live Music', desc: 'Entertainment on the main stage' },
    { id: 'p465', src: '/images/event-photos/dsc08465.jpg', title: 'Live Music', desc: 'The Shee Family performing for the crowd' },
    { id: 'p471', src: '/images/event-photos/dsc08471.jpg', title: 'Live Music', desc: 'Entertainment on the main stage' },
    { id: 'p478', src: '/images/event-photos/dsc08478.jpg', title: 'Live Music', desc: 'Entertainment on the main stage' },
    { id: 'p479', src: '/images/event-photos/dsc08479.jpg', title: 'Pro Reserve Grand Champion', desc: '10th Annual Jimmy Jam BBQ Slam 2026 award, sponsored by The Shee Family' }
  ];

  const bourbonMenu = {
    bbq: [
      { name: 'Smoked Brisket', desc: '14-hour St Augustine, Florida style', price: '$18' },
      { name: 'St. Louis Ribs', desc: 'Fall-off-bone tender', price: '$16' },
      { name: 'Pulled Pork', desc: 'Carolina mustard sauce', price: '$12' },
      { name: 'Smoked Chicken', desc: 'Apple-smoked', price: '$12' }
    ],
    bourbon: [
      { name: "Maker's Mark Flight", desc: 'Neat, water, rocks', price: '$12' },
      { name: 'Woodford Flight', desc: 'Premium tasting', price: '$15' },
      { name: 'Bourbon Cocktails', desc: 'Old Fashioned, Mint Julep', price: '$10' },
      { name: 'Bourbon & BBQ Pairing', desc: 'Curated selection', price: '$28' }
    ]
  };

  // Real content from jimmyjambbqslam.com/about. These are the actual impact stories
  // published there (anonymized by the organization itself, no names given) — we do not
  // invent names or quotes attributed to fictional people.
  const legacyStory = {
    title: 'Honoring a Legacy: James "Jimmy Jam" Wray',
    body: "The Jimmy Jam BBQ Slam & Car Show is named in honor of James Wray, known by friends as Jimmy Jam — one of the most selfless people to ever walk this earth. Jimmy ran the Betty Griffin House thrift store, often giving to those in need even when it meant putting kindness before profit. Even after being diagnosed with cancer, Jimmy never shifted the focus to himself — he sought out ways to lighten the burdens of those around him. He loved cars, was an avid NASCAR fan, and loved barbecue even more: during cancer treatments, he'd still request doggy bags from church BBQ fundraisers, joking “Cancer's not taking BBQ from me.” The Jimmy Jam BBQ Slam & Car Show exists to celebrate everything he loved — helping others, barbecue, and cars — and to give back to the community just as he would have."
  };

  // Real FWC 2026-2027 season dates for Hunting Zone C / DMU C6, which covers St. Johns
  // County (myfwc.com/hunting/season-dates/). Freshwater fishing has no closed season
  // under general FL regulations. Status is computed live against today's date, not
  // hardcoded, so it won't silently go stale.
  const seasonTrackerData = [
    { category: 'Hunting (Zone C / DMU C6)', items: [
      { name: 'Archery Deer', icon: '🏹', windows: [['2026-09-19', '2026-10-18']] },
      { name: 'Crossbow Deer', icon: '🏹', windows: [['2026-09-19', '2026-10-23']] },
      { name: 'Muzzleloading Deer', icon: '🦌', windows: [['2026-10-24', '2026-11-06']] },
      { name: 'General Gun Deer', icon: '🦌', windows: [['2026-11-07', '2027-01-24']] },
      { name: 'Fall Turkey', icon: '🦃', windows: [['2026-11-07', '2027-01-03']] },
      { name: 'Spring Turkey (North Zone)', icon: '🦃', windows: [['2027-03-20', '2027-04-25']] }
    ]},
    { category: 'Freshwater Fishing', items: [
      { name: 'Largemouth Bass', icon: '🐟', yearRound: true },
      { name: 'Black Crappie (Speckled Perch)', icon: '🎣', yearRound: true },
      { name: 'Catfish', icon: '🐱', yearRound: true }
    ]}
  ];

  const impactStories = [
    { title: 'Covering Insurance During Treatment', body: 'A single mother of two battling stage 4 breast cancer had her insurance premiums covered so she could focus on healing.' },
    { title: 'Keeping a Family Housed', body: 'A hardworking mom juggling two jobs was struggling with rent. We stepped in to cover her balance for two months so she could get back on track.' },
    { title: 'Rebuilding After Losing a Home', body: 'A family of four who lost their home received financial assistance to help rebuild their lives.' },
    { title: 'A New Walker for Dad', body: '"Because of Jimmy Jam, they have given that gift of accessibility to him in order to enjoy life with his grandson, and that means the world to us." — Sarah Felker, whose father Stanley Reigger (who has Parkinson’s disease) received a brand-new walker after his broke. She shared the story publicly on Facebook (as reported by St. Johns Citizen, Jan. 23, 2026).' }
  ];

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % galleryPhotos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);
  };

  const mainFeatures = [
    { Icon: Calendar, customIcon: '/icons/schedule.webp', title: 'SCHEDULE', desc: 'Event dates & times', action: 'schedule' },
    { Icon: Ticket, customIcon: '/icons/tickets.svg', title: 'TICKETS', desc: 'Buy event tickets', action: 'tickets' },
    { Icon: Camera, customIcon: '/icons/camera.svg', title: 'PHOTOS', desc: 'Event gallery', action: 'photos' },
    { Icon: Trophy, title: 'EVENTS', desc: 'Browse our festivals', action: 'events' },
    { Icon: Users, title: 'SPONSORS', desc: 'Meet our partners', action: 'sponsors' },
    { Icon: Shirt, title: 'MERCH', desc: 'Shop swag store', action: 'swag' },
    { Icon: Star, title: 'TASTING BALLOT', desc: 'Rate teams as you go', action: 'ballot' },
    { Icon: HeartHandshake, title: 'VOLUNTEER', desc: 'Help make it happen', action: 'volunteer' },
    { Icon: CloudSun, title: 'WEATHER', desc: 'Event forecast', action: 'weather' },
    { Icon: MessageCircle, title: 'STORIES', desc: 'Real testimonials', action: 'testimonials' }
  ];

  // TICKET TYPES
  const ticketTypes = [
    {
      icon: '🎟️',
      title: 'BBQ Slam General Admission',
      price: null,
      priceLabel: 'Free entry',
      features: [
        'Live music, car show & family activities included',
        'Chili & Chowder People’s Choice tasting tokens $1 each (11am–3pm)',
        'BBQ People’s Choice tasting tokens $1 each (2pm–4pm)'
      ],
      url: 'https://pci.jotform.com/form/260406377587163'
    },
    {
      icon: '🌽',
      title: 'Cornhole Tournament',
      price: 25,
      priceLabel: '$25 per person',
      features: [
        'Blind draw format',
        'Sign-ups open at 10:00am',
        'Tournament starts at 11:00am'
      ],
      url: 'https://pci.jotform.com/form/260406377587163'
    },
    {
      icon: '🚗',
      title: 'Car Show Entry',
      price: 20,
      priceLabel: '$20 pre-registered / $25 day-of',
      features: [
        'Classic Cars, Trucks & Motorcycles categories',
        'Trophies awarded in multiple categories',
        'Day-of entry available, limited spots'
      ],
      url: 'https://form.jotform.com/jimmyjammarketing1/car-show-entry-form'
    },
    {
      icon: '🥃',
      title: '3rd Annual Bourbon & BBQ Event',
      price: 100,
      priceLabel: '$100 per person',
      features: [
        'Saturday, October 17th at The Tringali Barn',
        'Welcome cocktail, dinner by 2-Time World Champion Kings BBQ',
        'Live music from The Futch Brothers Band + bourbon raffle'
      ],
      url: 'https://pci.jotform.com/form/262125277149156'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-red-700 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {activeNav !== 'home' ? (
              <button
                onClick={() => { setActiveNav('home'); }}
                className="text-white p-1 hover:bg-red-800 rounded-lg transition-colors"
                aria-label="Back to Home"
              >
                <ChevronLeft size={28} />
              </button>
            ) : (
              <button
                onClick={() => setShowMoreMenu(true)}
                className="text-white p-1.5 hover:bg-red-800 rounded-lg transition-colors"
                aria-label="Open Festival Menu"
              >
                <Menu size={24} />
              </button>
            )}

            <div className="text-center flex-1">
              <h1 className="font-bold text-lg md:text-xl text-white tracking-wide">
                {activeNav === 'home' ? 'JIMMY JAM FESTIVAL' : activeNav.toUpperCase()}
              </h1>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveNav('faq')}
                className="p-2 hover:bg-red-600 rounded-lg text-white transition-colors"
                aria-label="Search and FAQs"
              >
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* HOME */}
        {activeNav === 'home' && (
          <FestivalHome
            setActiveNav={setActiveNav}
            openExternal={openExternal}
            EVENT_DATE_LABEL={EVENT_DATE_LABEL}
            EVENT_VENUE_NAME={EVENT_VENUE_NAME}
            setShowMoreMenu={setShowMoreMenu}
            mainFeatures={mainFeatures}
          />
        )}

        {/* SCHEDULE */}
        {activeNav === 'schedule' && (
          <FestivalSchedule
            openInAppModal={openInAppModal}
            mySchedule={mySchedule}
            toggleMySchedule={toggleMySchedule}
            openExternal={openExternal}
            setActiveNav={setActiveNav}
            EVENT_DATE_LABEL={EVENT_DATE_LABEL}
            EVENT_VENUE_NAME={EVENT_VENUE_NAME}
          />
        )}

        {/* TICKETS */}
        {activeNav === 'tickets' && (
          <div className="space-y-6 -mx-4 px-4 pb-4 bg-canvas min-h-screen" style={{ backgroundColor: 'var(--bg-canvas)' }}>
            {/* POSTER */}
            <div className="relative rounded-xl overflow-hidden shadow-2xl mb-8 -mx-4 md:mx-0">
              {/* POSTER BACKGROUND */}
              <div className="absolute inset-0 z-0">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200"
                  alt="BBQ Poster Background"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to bottom, rgba(14,13,12,0.85), rgba(14,13,12,0.5), rgba(14,13,12,0.95))' }}></div>
              </div>

              <div className="relative z-20 p-8 text-center space-y-4" style={{ color: 'var(--text-primary)' }}>
                <p className="text-xs font-black tracking-[0.3em]" style={{ color: 'var(--text-secondary)' }}>JIMMY JAM COMMUNITY OUTREACH</p>
                <h2 className="font-display text-5xl tracking-wide drop-shadow-2xl">BBQ SLAM & BOURBON</h2>
                <p className="text-lg font-bold uppercase tracking-widest" style={{ color: 'var(--color-primary)' }}>& Music Festival</p>

                <div className="my-8 text-6xl drop-shadow-2xl animate-pulse">🔥</div>

                <div className="space-y-3 text-xl font-bold drop-shadow-lg">
                  <p>Live Music featuring Local & Regional Artists</p>
                  <div className="pt-6">
                    <p className="text-sm font-bold mt-3 uppercase tracking-[0.2em]" style={{ color: 'var(--text-primary)' }}>{EVENT_VENUE_NAME}</p>
                    <p className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>{EVENT_DATE_LABEL}</p>
                  </div>
                </div>

                <p className="text-[10px] mt-6 font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>jimmyjambbqslam.com</p>
              </div>
            </div>

            {/* BUY BUTTON */}
            <button
              onClick={() => openInAppModal('https://pci.jotform.com/form/260406377587163', 'Jimmy Jam Tickets')}
              className="w-full block text-center py-4 rounded-pill font-bold text-lg transition-all"
              style={{ backgroundColor: 'var(--color-primary)', color: '#FFFFFF', height: '48px' }}
            >
              🎫 Buy Jimmy Jam Tickets
            </button>

            {/* TICKET OPTIONS */}
            <div className="space-y-4">
              {ticketTypes.map((ticket, idx) => (
                <div key={idx} className="rounded-lg p-6 border shadow-card transition-all" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{ticket.icon}</span>
                      <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{ticket.title}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold" style={{ color: 'var(--color-secondary)' }}>{ticket.priceLabel}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {ticket.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <span className="font-bold" style={{ color: 'var(--color-primary)' }}>•</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => openInAppModal(ticket.url, ticket.title)}
                    className="w-full mt-4 block text-center py-2 rounded-md font-bold text-sm transition-all"
                    style={{ backgroundColor: 'var(--color-primary)', color: '#FFFFFF' }}
                  >
                    BUY / REGISTER
                  </button>
                </div>
              ))}
            </div>

            {/* INFO SECTION */}
            <div className="rounded-lg p-6 space-y-4 border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-active)' }}>
              <h3 className="font-display text-2xl tracking-wide" style={{ color: 'var(--text-primary)' }}>EVENT INFORMATION</h3>

              <div>
                <p className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>When</p>
                <p style={{ color: 'var(--text-secondary)' }}>11th Annual Jimmy Jam BBQ Slam: {EVENT_DATE_LABEL}. (3rd Annual Bourbon & BBQ Event: October 2027, exact date TBA)</p>
              </div>

              <div>
                <p className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Where</p>
                <p style={{ color: 'var(--text-secondary)' }}>{EVENT_VENUE_NAME}<br />{EVENT_VENUE_ADDRESS}</p>
              </div>

              <div>
                <p className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>What's Included</p>
                <ul className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <li>✓ World-class BBQ competition</li>
                  <li>✓ Premium bourbon tasting</li>
                  <li>✓ Live music performances</li>
                  <li>✓ Food & beverage vendors</li>
                  <li>✓ Family-friendly activities</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* MAPS & INFO PAGE */}
        {/* MAPS & INFO TAB */}
        {activeNav === 'maps' && (
          <FestivalMapsAndInfo
            EVENT_LAT={EVENT_LAT}
            EVENT_LON={EVENT_LON}
            EVENT_VENUE_NAME={EVENT_VENUE_NAME}
            EVENT_VENUE_ADDRESS={EVENT_VENUE_ADDRESS}
            EVENT_DATE_LABEL={EVENT_DATE_LABEL}
            openExternal={openExternal}
            faqData={faqData}
            setActiveNav={setActiveNav}
          />
        )}

        {/* OFFICIAL PARTNERS */}
        {activeNav === 'official-partners' && (
          <div className="space-y-8 pb-20">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold text-gray-900">OFFICIAL PARTNERS</h1>
              <p className="text-gray-600">The organizations and community leaders that make Jimmy Jam possible.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'City of St. Augustine', desc: 'Host City & Local Government Partner', icon: '🏛️' },
                { name: 'Florida BBQ Society', desc: 'Sanctioning Body & Event Coordinators', icon: '🔥' },
                { name: 'St. Johns County Sheriff', desc: 'Event Security & Logistics Partner', icon: '🚔' },
                { name: 'Local Outreach Charities', desc: 'Beneficiaries of Jimmy Jam BBQ Slam', icon: '❤️' }
              ].map((partner, idx) => (
                <div key={idx} className="bg-white border-2 border-red-200 rounded-xl p-6 flex items-center gap-6 shadow-md hover:shadow-lg transition-all">
                  <div className="text-5xl bg-red-50 p-4 rounded-full border border-red-100">{partner.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{partner.name}</h3>
                    <p className="text-sm text-gray-600">{partner.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 bg-red-50 p-6 rounded-xl text-center border-2 border-red-200">
              <h3 className="text-xl font-bold text-red-800 mb-2">Partner With Us</h3>
              <p className="text-sm text-red-600 mb-4">Interested in becoming an official partner? Let's connect.</p>
              <button onClick={() => setActiveNav('connect')} className="px-6 py-2 bg-red-700 text-white font-bold rounded-lg hover:bg-red-800 transition-all shadow-md">CONTACT US</button>
            </div>
          </div>
        )}

        {/* TASTING BALLOT */}
        {activeNav === 'ballot' && (
          <FestivalBallot setActiveNav={setActiveNav} />
        )}

        {/* VOLUNTEER */}
        {activeNav === 'volunteer' && (
          <FestivalVolunteer setActiveNav={setActiveNav} />
        )}

        {/* FAQ */}
        {activeNav === 'faq' && (
          <FestivalFaq
            faqData={faqData}
            setActiveNav={setActiveNav}
            openInAppModal={openInAppModal}
            openExternal={openExternal}
          />
        )}

        {/* RECIPE BOOK */}
        {activeNav === 'recipes' && (
          <FestivalRecipes setActiveNav={setActiveNav} />
        )}

        {/* PHOTOS */}
        {activeNav === 'photos' && (
          <div className="space-y-8">
            {/* MAIN PHOTO */}
            <div className="bg-white rounded-lg overflow-hidden shadow-xl">
              {galleryPhotos[currentPhotoIndex].isPoster ? (
                <div className="relative bg-[#365ca8] h-[500px] flex items-center justify-center border-b-8 border-red-600">
                  <div className="flex flex-col items-center justify-center text-white text-center p-4">
                    <p className="text-[12px] font-bold tracking-widest uppercase mb-4 text-blue-100">Jimmy Jam Community Outreach</p>
                    <h2 className="text-3xl font-bold mb-2 tracking-wide">BBQ SLAM & BOURBON</h2>
                    <p className="text-sm mb-6 text-blue-100">& Music Festival</p>
                    <span className="text-5xl mb-6">🔥</span>
                    <div className="space-y-2 text-lg font-bold mb-8">
                      <p>Live Music featuring Local & Regional Artists</p>
                    </div>
                    <div className="text-xs text-blue-100 space-y-2 font-bold tracking-wider">
                      <p>{EVENT_VENUE_NAME}</p>
                      <p>{EVENT_DATE_LABEL}</p>
                      <p className="mt-6 opacity-75 lowercase font-normal tracking-normal text-[10px]">jimmyjambbqslam.com</p>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="relative bg-gradient-to-br from-red-600 to-orange-600 h-[500px] w-full flex items-center justify-center overflow-hidden cursor-zoom-in"
                >
                  <div className="relative w-full h-full flex items-center justify-center bg-black">
                    <img src={galleryPhotos[currentPhotoIndex].src} alt={galleryPhotos[currentPhotoIndex].title} className="w-full h-full object-cover px-3 py-6 sm:px-6 sm:py-8" />
                    <img src="/filmstrip-frame.png" alt="35mm Filmstrip Frame" className="absolute inset-0 w-full h-full object-fill pointer-events-none z-10 opacity-95" />
                  </div>
                </button>
              )}
              <div className="p-8">
                <h3 className="text-3xl font-bold text-red-700 mb-2">{galleryPhotos[currentPhotoIndex].title}</h3>
                <p className="text-gray-600 text-lg mb-6">{galleryPhotos[currentPhotoIndex].desc}</p>
                <div className="flex items-center justify-between">
                  <button onClick={prevPhoto} className="bg-red-700 hover:bg-red-800 text-white p-3 rounded-lg transition-all">
                    <ChevronLeft size={24} />
                  </button>
                  <div className="text-center">
                    <p className="text-gray-600">{currentPhotoIndex + 1} of {galleryPhotos.length}</p>
                  </div>
                  <button onClick={nextPhoto} className="bg-red-700 hover:bg-red-800 text-white p-3 rounded-lg transition-all">
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            </div>

            {/* THUMBNAIL GRID */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Browse Photos</h3>
              <div className="grid grid-cols-4 gap-4">
                {galleryPhotos.map((photo, idx) => (
                  <button
                    key={photo.id}
                    onClick={() => { setCurrentPhotoIndex(idx); if (!photo.isPoster) setLightboxOpen(true); }}
                    className={`aspect-square rounded-lg flex items-center justify-center transition-all transform hover:scale-110 border-4 ${
                      idx === currentPhotoIndex ? 'border-red-700 shadow-lg' : 'border-gray-300 hover:border-red-400'
                    } bg-gradient-to-br from-red-100 to-orange-100 overflow-hidden`}
                  >
                    {photo.isPoster ? (
                      <div className="w-full h-full bg-[#365ca8] flex flex-col items-center justify-center p-1 border-b-4 border-red-600">
                         <span className="text-2xl">🔥</span>
                         <span className="text-[8px] text-white font-bold mt-1 text-center leading-tight">BBQ SLAM</span>
                      </div>
                    ) : (
                      <img src={photo.src} alt={photo.title} className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* LIGHTBOX */}
            {lightboxOpen && !galleryPhotos[currentPhotoIndex].isPoster && (
              <div
                className="fixed inset-0 z-50 bg-black/95 flex flex-col"
                onClick={() => setLightboxOpen(false)}
              >
                <button
                  onClick={() => setLightboxOpen(false)}
                  className="absolute top-4 right-4 z-10 text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
                >
                  <X size={28} />
                </button>
                <div className="flex-1 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-2 md:left-6 text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <img
                    src={galleryPhotos[currentPhotoIndex].src}
                    alt={galleryPhotos[currentPhotoIndex].title}
                    className="max-w-full max-h-full object-contain"
                  />
                  <button
                    onClick={nextPhoto}
                    className="absolute right-2 md:right-6 text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
                  >
                    <ChevronRight size={28} />
                  </button>
                </div>
                <div className="text-center text-white pb-6 px-4" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-xl font-bold">{galleryPhotos[currentPhotoIndex].title}</h3>
                  <p className="text-gray-300 text-sm">{galleryPhotos[currentPhotoIndex].desc}</p>
                  <p className="text-gray-400 text-xs mt-1">{currentPhotoIndex + 1} of {galleryPhotos.length}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* EVENTS SELECTION PAGE */}
        {activeNav === 'events' && activeTab === 'overview' && (
          <div className="space-y-8 pb-20 -mx-4 px-4 pt-2 bg-canvas min-h-screen" style={{ backgroundColor: 'var(--bg-canvas)' }}>
            <div className="text-center space-y-2">
              <h1 className="font-display text-5xl tracking-wide" style={{ color: 'var(--text-primary)' }}>OUR EVENTS</h1>
              <p style={{ color: 'var(--text-secondary)' }}>Select an event to explore details and register</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* BOURBON & BBQ CARD */}
              <button
                onClick={() => setActiveTab('bourbon-event')}
                className="group relative h-64 rounded-2xl overflow-hidden shadow-2xl transition-all transform hover:scale-[1.02]"
              >
                <img src="/images/event-photos/dsc08443.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(14,13,12,0.95), rgba(14,13,12,0.4))' }}></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6" style={{ color: 'var(--text-primary)' }}>
                  <span className="text-6xl mb-4">🥃</span>
                  <h2 className="font-display text-4xl tracking-wide">BOURBON & BARBEQUE</h2>
                  <p className="mt-1 text-xs text-amber-200">Saturday, October 17, 2026 • Tringali Barn • $100/ticket</p>
                  <p className="text-[11px] text-white/80 mt-1">Whole Hog, Wagyu Gold Brisket by 2X Champion Ryan King & Broudy's Bourbon</p>
                  <div className="mt-4 px-6 py-2 rounded-pill font-bold text-sm uppercase tracking-wide" style={{ backgroundColor: 'var(--color-primary)', color: '#FFFFFF' }}>Explore Event</div>
                </div>
              </button>

              {/* BBQ SLAM CARD */}
              <button
                onClick={() => setActiveTab('bbq-slam-event')}
                className="group relative h-64 rounded-2xl overflow-hidden shadow-2xl transition-all transform hover:scale-[1.02]"
              >
                <img src="/images/event-photos/dsc08414.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(14,13,12,0.95), rgba(14,13,12,0.4))' }}></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6" style={{ color: 'var(--text-primary)' }}>
                  <span className="text-6xl mb-4">🍖</span>
                  <h2 className="font-display text-4xl tracking-wide">BBQ SLAM EVENT</h2>
                  <p className="mt-1 text-xs text-amber-300">Saturday, January 9, 2027 • St. Johns County Fairgrounds</p>
                  <p className="text-[11px] text-white/80 mt-1">Chili Cook-Off ($875 Cash Prizes - Free Entry) & $17,000 BBQ Slam</p>
                  <div className="mt-4 px-6 py-2 rounded-pill font-bold text-sm uppercase tracking-wide" style={{ backgroundColor: 'var(--color-secondary)', color: '#1E1C1A' }}>Explore Event</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* BOURBON & BBQ EVENT DETAIL */}
        {activeNav === 'events' && activeTab === 'bourbon-event' && (
          <div className="space-y-8 pb-20 -mx-4 px-4 pt-2 bg-canvas min-h-screen" style={{ backgroundColor: 'var(--bg-canvas)' }}>
            <button onClick={() => setActiveTab('overview')} className="flex items-center gap-2 font-bold mb-4" style={{ color: 'var(--color-primary)' }}>
              <ChevronLeft size={24} /> Back to Events
            </button>

            <div className="relative h-56 rounded-2xl overflow-hidden shadow-lg">
              <img src="/images/event-photos/dsc08443.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(14,13,12,0.9), rgba(14,13,12,0.3))' }}></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6" style={{ color: 'var(--text-primary)' }}>
                <h1 className="font-display text-5xl tracking-wide">BOURBON & BARBEQUE</h1>
                <p className="text-lg mt-1" style={{ color: 'var(--text-secondary)' }}>The Ultimate Pairing Experience</p>
              </div>
            </div>

            {/* MENU SECTION */}
            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-wide pl-4 border-l-4" style={{ color: 'var(--text-primary)', borderColor: 'var(--color-primary)' }}>THE MENU</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {bourbonMenu.bbq.map((item, i) => (
                  <div key={i} className="p-5 rounded-xl shadow-card border flex justify-between items-center" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
                    <div>
                      <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                    </div>
                    <span className="font-bold" style={{ color: 'var(--color-secondary)' }}>{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SPONSORS SECTION */}
            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-wide pl-4 border-l-4" style={{ color: 'var(--text-primary)', borderColor: 'var(--color-primary)' }}>EVENT SPONSORS</h2>
              <div className="grid grid-cols-3 gap-4">
                {sponsorsData.slice(0, 3).map((sponsor) => (
                  <div key={sponsor.id} className="p-4 rounded-xl shadow-card text-center border transition-all" style={{ backgroundColor: 'var(--bg-paper)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
                    {sponsor.logoImage ? (
                      <img src={sponsor.logoImage} alt={sponsor.name} className="h-12 w-full object-contain mb-2" />
                    ) : (
                      <span className="text-4xl block mb-2">{sponsor.logo}</span>
                    )}
                    <p className="font-bold text-xs" style={{ color: 'var(--text-on-light)' }}>{sponsor.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* VIDEOS SECTION */}
            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-wide pl-4 border-l-4" style={{ color: 'var(--text-primary)', borderColor: 'var(--color-primary)' }}>VIDEO HIGHLIGHTS</h2>
              <button
                onClick={() => setActiveNav('videos')}
                className="w-full aspect-video rounded-2xl flex items-center justify-center text-6xl shadow-2xl relative overflow-hidden group"
                style={{ backgroundColor: 'var(--bg-surface)' }}
              >
                🎬
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl pl-2 shadow-xl" style={{ backgroundColor: 'var(--color-primary)', color: '#FFFFFF' }}>▶</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* BBQ SLAM EVENT DETAIL */}
        {activeNav === 'events' && activeTab === 'bbq-slam-event' && (
          <div className="space-y-8 pb-20">
            <button onClick={() => setActiveTab('overview')} className="flex items-center gap-2 text-red-700 font-bold mb-4">
              <ChevronLeft size={24} /> Back to Events
            </button>

            <div className="relative h-56 rounded-2xl overflow-hidden shadow-lg">
              <img src="/images/event-photos/dsc08414.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(14,13,12,0.9), rgba(14,13,12,0.3))' }}></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6" style={{ color: 'var(--text-primary)' }}>
                <h1 className="font-display text-5xl tracking-wide">BBQ SLAM EVENT</h1>
                <p className="text-lg mt-1" style={{ color: 'var(--text-secondary)' }}>Championship Competition</p>
              </div>
            </div>

            {/* REGISTRATION FORMS */}
            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-wide pl-4 border-l-4" style={{ color: 'var(--text-primary)', borderColor: 'var(--color-primary)' }}>REGISTRATIONS</h2>
              <div className="grid grid-cols-1 gap-3">
                {registrationDetails.map((form, i) => (
                  <div key={i} className="rounded-xl shadow-card border transition-all overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
                    <button
                      onClick={() => setOpenRegistration(openRegistration === i ? null : i)}
                      className="w-full p-6 flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{form.icon}</span>
                        <div>
                          <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{form.title}</p>
                          {form.fee && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{form.fee}</p>}
                        </div>
                      </div>
                      <span className="font-bold text-xl" style={{ color: 'var(--color-primary)' }}>{openRegistration === i ? '−' : '+'}</span>
                    </button>
                    {openRegistration === i && (
                      <div className="px-6 pb-6 space-y-3 border-t pt-4" style={{ borderColor: 'var(--border-subtle)' }}>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{form.description}</p>
                        {form.details && (
                          <ul className="text-sm space-y-1 list-disc list-inside" style={{ color: 'var(--text-secondary)' }}>
                            {form.details.map((d, di) => <li key={di}>{d}</li>)}
                          </ul>
                        )}
                        <button
                          onClick={() => openExternal(form.url)}
                          className="w-full py-2.5 rounded-lg font-bold text-sm transition-all"
                          style={{ backgroundColor: 'var(--color-primary)', color: '#FFFFFF' }}
                        >
                          View Current Status & Register →
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>Tap a category for details. The register button always opens the matching live page on jimmyjambbqslam.com for current status and forms.</p>
            </div>

            {/* CALENDAR SECTION */}
            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-wide pl-4 border-l-4" style={{ color: 'var(--text-primary)', borderColor: 'var(--color-primary)' }}>CALENDAR OF EVENTS</h2>
              <div className="rounded-xl overflow-hidden shadow-card border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
                {detailedSchedule[0].events.slice(0, 4).map((event, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border-b last:border-b-0" style={{ borderColor: 'var(--border-subtle)' }}>
                    <span className="text-xs font-bold w-20" style={{ color: 'var(--color-primary)' }}>{event.time}</span>
                    <div className="flex-1">
                      <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{event.title}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PAST WINNERS */}
            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-wide pl-4 border-l-4" style={{ color: 'var(--text-primary)', borderColor: 'var(--color-primary)' }}>PAST WINNERS</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pastWinnersData.map((winner, i) => (
                  <div key={i} className="rounded-xl overflow-hidden shadow-card border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
                    <img src={winner.photo} alt={`${winner.team} — ${winner.year} ${winner.category}`} className="w-full h-48 object-cover" />
                    <div className="p-4 flex items-center gap-3">
                      {winner.logo && (
                        <img src={winner.logo} alt={`${winner.team} logo`} className="w-12 h-12 object-contain rounded-lg border flex-shrink-0" style={{ backgroundColor: 'var(--bg-paper)', borderColor: 'var(--border-subtle)' }} />
                      )}
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm" style={{ color: 'var(--color-secondary)', backgroundColor: 'var(--bg-surface-elevated)' }}>{winner.year} {winner.category}</span>
                        <h3 className="font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{winner.team}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SPONSOR LOGOS */}
            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-wide pl-4 border-l-4" style={{ color: 'var(--text-primary)', borderColor: 'var(--color-primary)' }}>OFFICIAL PARTNERS</h2>
              <div className="p-6 rounded-xl shadow-card border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
                <div className="grid grid-cols-4 gap-6">
                  {sponsorsData.map((sponsor) => (
                    <button
                      key={sponsor.id}
                      onClick={() => {
                        setActiveNav('sponsors');
                      }}
                      className="flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition-all group"
                    >
                      {sponsor.logoImage ? (
                        <img src={sponsor.logoImage} alt={sponsor.name} className="h-8 object-contain group-hover:scale-110 transition-transform bg-white rounded p-0.5" />
                      ) : (
                        <span className="text-3xl group-hover:scale-110 transition-transform">{sponsor.logo}</span>
                      )}
                      <p className="text-[10px] font-bold uppercase text-center" style={{ color: 'var(--text-muted)' }}>{sponsor.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ARTISTS */}
        {activeNav === 'artists' && (
          <FestivalArtists
            openInAppModal={openInAppModal}
            artistsData={artistsData}
            selectedArtist={selectedArtist}
            setSelectedArtist={setSelectedArtist}
            favoriteArtists={favoriteArtists}
            toggleFavoriteArtist={toggleFavoriteArtist}
            mySchedule={mySchedule}
            toggleMySchedule={toggleMySchedule}
            addArtistToCalendar={addArtistToCalendar}
            openExternal={openExternal}
            setActiveNav={setActiveNav}
            EVENT_VENUE_NAME={EVENT_VENUE_NAME}
          />
        )}

        {/* SPONSORS - LIST VIEW */}
        {activeNav === 'sponsors' && (
          <FestivalSponsors
            sponsorsData={sponsorsData}
            sponsorTiers={sponsorTiers}
            setActiveNav={setActiveNav}
            openExternal={openExternal}
          />
        )}

        {activeNav === 'bourbon' && (
          <div className="space-y-8">
            <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-red-600 to-orange-600 text-white p-8 rounded-lg">🥃 BOURBON & BBQ</h1>

            <div className="flex gap-4 border-b-2 border-gray-300">
              <button onClick={() => setActiveTab('bbq')} className={`px-4 py-3 font-bold ${activeTab === 'bbq' ? 'border-b-4 border-red-700 text-red-700' : 'text-gray-600'}`}>BBQ Menu</button>
              <button onClick={() => setActiveTab('bourbon')} className={`px-4 py-3 font-bold ${activeTab === 'bourbon' ? 'border-b-4 border-red-700 text-red-700' : 'text-gray-600'}`}>Bourbon</button>
            </div>

            {activeTab === 'bbq' && (
              <div className="grid md:grid-cols-2 gap-6">
                {bourbonMenu.bbq.map((item, i) => (
                  <div key={i} className="bg-white rounded-lg p-6 border-l-4 border-red-700 shadow-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-red-700 text-lg">{item.name}</h3>
                      <span className="text-red-600 font-bold">{item.price}</span>
                    </div>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'bourbon' && (
              <div className="grid md:grid-cols-2 gap-6">
                {bourbonMenu.bourbon.map((item, i) => (
                  <div key={i} className="bg-white rounded-lg p-6 border-l-4 border-yellow-700 shadow-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-yellow-900 text-lg">{item.name}</h3>
                      <span className="text-yellow-700 font-bold">{item.price}</span>
                    </div>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* WEATHER */}
        {activeNav === 'weather' && (
          <FestivalWeather setActiveNav={setActiveNav} />
        )}

        {/* TESTIMONIALS */}
        {activeNav === 'testimonials' && (
          <div className="space-y-8 pb-20">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-red-700 to-orange-600 text-white p-8 rounded-2xl shadow-xl text-center">
              <h1 className="text-3xl font-bold mb-1">Our Story & Impact</h1>
              <p className="text-red-100 text-sm">{EVENT_VENUE_NAME}</p>
            </div>

            {/* LEGACY STORY */}
            <div className="bg-[#FAF9F6] rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-xl text-red-700 mb-3">{legacyStory.title}</h2>
              <p className="text-gray-700 text-sm leading-relaxed">{legacyStory.body}</p>
            </div>

            {/* IMPACT STORIES */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Real Impact Stories</h2>
              <p className="text-sm text-gray-500 mb-4">Every dollar raised goes directly to helping families in our community. Most stories are shared anonymously to protect privacy; some families choose to share their story publicly.</p>
              <div className="space-y-4">
                {impactStories.map((story, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-2">{story.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{story.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ASSISTANCE */}
        {activeNav === 'assistance' && (
          <FestivalAssistance setActiveNav={setActiveNav} />
        )}

        {activeNav === 'connect' && (
          <div className="space-y-4 pb-20">
            {/* CONTACT US */}
            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-200 text-center space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
              <p className="text-gray-700 font-semibold">{EVENT_VENUE_NAME}</p>
              <p className="text-gray-600 text-sm">{EVENT_VENUE_ADDRESS}</p>
              <button
                onClick={() => openExternal(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(EVENT_VENUE_NAME + ', ' + EVENT_VENUE_ADDRESS)}`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold shadow-md transition-all"
              >
                🧭 Get Directions
              </button>
              <div className="flex gap-2 pt-1">
                <a href="mailto:jimmyjaminfo@gmail.com" className="flex-1 bg-red-700 hover:bg-red-800 text-white py-2.5 rounded-lg font-bold text-sm transition-all">
                  ✉️ General Info
                </a>
                <a href="mailto:jimmyjammarketing1@gmail.com" className="flex-1 border-2 border-red-700 text-red-700 hover:bg-red-50 py-2.5 rounded-lg font-bold text-sm transition-all">
                  ✉️ Competitions & Vendors
                </a>
              </div>
            </div>

            {/* DIVIDER */}
            <div className="border-t-4 border-yellow-500 mb-6"></div>

            {/* SOCIAL LINKS */}
            <div className="space-y-3">
              {[
                { key: 'instagram', label: 'INSTAGRAM', icon: '📷', handle: '@jimmyjamoutreach', url: 'https://www.instagram.com/jimmyjamoutreach/' },
                { key: 'facebook', label: 'FACEBOOK', icon: 'f', handle: 'JIMMY JAM OUTREACH', url: 'https://www.facebook.com/jimmy.jam.843909' },
                { key: 'spotify', label: 'SPOTIFY', icon: '🎧', handle: 'PLAYLIST', url: 'https://open.spotify.com/playlist/2RGhCcMgYDuUnJo7hXNFd2?si=HrjflBeqQaCJzF7jHwibAw' },
                { key: 'website', label: 'WEBSITE', icon: '🌐', handle: 'JIMMYJAMOUTREACH.COM', url: 'https://jimmyjamoutreach.com/' }
              ].map(social => (
                <button
                  key={social.key}
                  onClick={() => openExternal(social.url)}
                  className="w-full bg-gray-800 p-4 rounded-lg flex items-center justify-between border-b-2 border-yellow-500"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white text-gray-800 rounded-full w-12 h-12 flex items-center justify-center text-lg">{social.icon}</div>
                    <span className="text-white font-bold">{social.label}</span>
                  </div>
                  <span className="text-yellow-400 font-bold text-sm">{social.handle}</span>
                </button>
              ))}
            </div>

            {/* CTA SECTION */}
            <div className="bg-gray-800 rounded-lg p-6 text-center border-2 border-yellow-500 mt-8">
              <p className="text-white text-sm mb-4">
                Follow us on social media for updates and community stories
              </p>
              <button
                onClick={() => {
                  openExternal('https://www.instagram.com/jimmyjamoutreach/');
                  openExternal('https://www.facebook.com/jimmy.jam.843909');
                }}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 py-3 rounded-lg font-bold transition-all"
              >
                FOLLOW ALL
              </button>
            </div>
          </div>
        )}

        {/* SWAG */}
        {activeNav === 'swag' && (
          <FestivalSwag setActiveNav={setActiveNav} />
        )}

        {activeNav === 'tides' && (
          <div className="space-y-6 pb-20">
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white p-8 rounded-2xl shadow-lg text-center">
              <h2 className="text-3xl font-bold mb-2">🌊 TIDE CHART</h2>
              <p className="text-blue-100">{TIDE_STATION_NAME}</p>
            </div>

            {tideError && (
              <p className="text-red-700 font-semibold text-center bg-red-50 border-2 border-red-200 rounded-lg p-3">{tideError}</p>
            )}

            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-blue-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-blue-900">Today's Forecast</h3>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Live</span>
              </div>

              {tideData ? (
                <div className="space-y-4">
                  {tideData.hiLo.map((tide, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${tide.type === 'High' ? 'bg-blue-600' : 'bg-blue-300'}`}></div>
                        <span className="font-bold text-blue-900">{tide.time}</span>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${tide.type === 'High' ? 'text-blue-700' : 'text-blue-500'}`}>{tide.type}</p>
                        <p className="text-xs text-blue-400">{tide.level}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Loading tide predictions...</p>
              )}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-blue-200">
              <h3 className="font-bold text-lg text-blue-900 mb-4">24-Hour Cycle</h3>
              {tideData ? (
                <>
                  <div className="h-40 bg-blue-50 rounded-lg flex items-end gap-1 p-2">
                    {tideData.hourly.map((level, i) => {
                      const min = Math.min(...tideData.hourly);
                      const max = Math.max(...tideData.hourly);
                      const pct = max === min ? 50 : ((level - min) / (max - min)) * 80 + 10;
                      return (
                        <div
                          key={i}
                          className="flex-1 bg-blue-400 rounded-t opacity-60 hover:opacity-100 transition-all cursor-pointer"
                          style={{ height: `${pct}%` }}
                          title={`Hour ${i}: ${level.toFixed(1)} ft`}
                        ></div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-blue-400 mt-2 font-bold">
                    <span>12 AM</span>
                    <span>6 AM</span>
                    <span>12 PM</span>
                    <span>6 PM</span>
                    <span>11 PM</span>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">Loading tide cycle...</p>
              )}
            </div>
          </div>
        )}

        {/* SPONSOR & VENDOR VIDEOS */}
        {activeNav === 'videos' && (
          <div className="space-y-6 pb-20">
            <div className="bg-gradient-to-br from-orange-600 to-red-700 text-white p-8 rounded-2xl shadow-lg text-center">
              <h2 className="text-3xl font-bold mb-2">📽️ SPONSOR SPOTLIGHT</h2>
              <p className="text-orange-100">Messages from our Sponsors & Vendors</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Steelhead Plumbing', category: 'Sponsor Message', src: '/sponsor-videos/steelhead-plumbing-sponsor-message.mp4' },
                { title: "Melvin's Auto & Truck Repair", category: 'Sponsor Testimonial', src: '/sponsor-videos/melvins-auto-sponsor-testimonial.mp4' },
                { title: 'Shores Nutrition', category: 'Vendor Testimonial', src: '/sponsor-videos/shores-nutrition-vendor-testimonial.mp4' },
                { title: 'Edwards Law Firm', category: 'Sponsor Testimonial', src: '/sponsor-videos/edwards-law-sponsor-testimonial.mp4' },
                { title: 'Hager Inflatables', category: 'Sponsor Message', src: '/sponsor-videos/hager-inflatables-sponsor-message.mp4' }
              ].map((video, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md border-2 border-gray-200 hover:border-red-600 transition-all group">
                  <div className="aspect-video bg-black relative">
                    <video
                      className="w-full h-full object-contain"
                      src={video.src}
                      controls
                      preload="metadata"
                      playsInline
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded">{video.category}</span>
                    <h3 className="font-bold text-gray-800 leading-tight group-hover:text-red-700 transition-colors mt-2">{video.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* OUTDOOR CALENDAR */}
        {activeNav === 'seasons' && (
          <div className="space-y-6 pb-20">
            <div className="bg-gradient-to-br from-green-700 to-emerald-900 text-white p-8 rounded-2xl shadow-lg text-center">
              <h2 className="text-3xl font-bold mb-2">🦌 SEASON TRACKER</h2>
              <p className="text-green-100">St. Johns County, FL — Hunting (Zone C) & Freshwater Fishing</p>
            </div>

            {/* VIEW TOGGLE */}
            <div className="flex gap-3">
              <button onClick={() => setSeasonView('list')} className={`px-6 py-2 rounded-full font-bold transition-all ${seasonView === 'list' ? 'bg-yellow-400 text-black' : 'bg-gray-300 text-gray-700'}`}>
                List
              </button>
              <button onClick={() => setSeasonView('calendar')} className={`px-6 py-2 rounded-full font-bold transition-all ${seasonView === 'calendar' ? 'bg-yellow-400 text-black' : 'bg-gray-300 text-gray-700'}`}>
                Calendar
              </button>
            </div>

            {seasonView === 'calendar' && (() => {
              const seasonColors = ['bg-amber-500', 'bg-orange-500', 'bg-red-500', 'bg-rose-500', 'bg-purple-500', 'bg-emerald-600'];
              const huntingItems = seasonTrackerData.find(g => !g.items.some(it => it.yearRound))?.items || [];
              const coloredItems = huntingItems.map((item, idx) => ({
                ...item,
                color: seasonColors[idx % seasonColors.length],
                windows: item.windows.map(([s, e]) => ({ start: new Date(s + 'T00:00:00'), end: new Date(e + 'T23:59:59') }))
              }));

              const year = calendarMonth.getFullYear();
              const month = calendarMonth.getMonth();
              const firstDay = new Date(year, month, 1);
              const daysInMonth = new Date(year, month + 1, 0).getDate();
              const leadingBlanks = firstDay.getDay();
              const today = new Date();
              const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

              const activeItemsForDay = (d) => {
                const date = new Date(year, month, d, 12);
                return coloredItems.filter(item => item.windows.some(w => date >= w.start && date <= w.end));
              };

              return (
                <div className="bg-white rounded-xl border-2 border-gray-200 p-4 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <button onClick={() => setCalendarMonth(new Date(year, month - 1, 1))} className="p-2 rounded-lg hover:bg-gray-100">
                      <ChevronLeft size={20} />
                    </button>
                    <h3 className="font-bold text-lg text-gray-900">{firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                    <button onClick={() => setCalendarMonth(new Date(year, month + 1, 1))} className="p-2 rounded-lg hover:bg-gray-100">
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400 uppercase">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: leadingBlanks }).map((_, i) => <div key={`b${i}`} />)}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const d = i + 1;
                      const active = activeItemsForDay(d);
                      return (
                        <div
                          key={d}
                          title={active.length ? active.map(a => a.name).join(', ') : ''}
                          className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 text-xs ${
                            isToday(d) ? 'bg-green-100 border-2 border-green-600 font-bold' : 'bg-gray-50 border border-gray-100'
                          }`}
                        >
                          <span className="text-gray-700">{d}</span>
                          <div className="flex gap-0.5 flex-wrap justify-center max-w-full px-0.5">
                            {active.slice(0, 4).map((a, ai) => (
                              <span key={ai} className={`w-1.5 h-1.5 rounded-full ${a.color}`} />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
                    {coloredItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                        <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                        {item.icon} {item.name}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400">Freshwater species (bass, crappie, catfish) are open year-round and not shown as dots above.</p>
                </div>
              );
            })()}

            {seasonView === 'list' && (
            <div className="space-y-4">
              {seasonTrackerData.map((group, i) => (
                <div key={i} className="space-y-3">
                  <h3 className="font-bold text-lg text-gray-800 ml-2">{group.category}</h3>
                  {group.items.map((item, idx) => {
                    const today = new Date();
                    let status = 'Closed';
                    let dateLabel = '';

                    if (item.yearRound) {
                      status = 'Open';
                      dateLabel = 'Year-round (license required)';
                    } else {
                      const windows = item.windows.map(([s, e]) => ({ start: new Date(s + 'T12:00:00'), end: new Date(e + 'T12:00:00') }));
                      const active = windows.find(w => today >= w.start && today <= w.end);
                      if (active) {
                        status = 'Active';
                        dateLabel = `${active.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${active.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
                      } else {
                        const upcoming = windows.filter(w => w.start > today).sort((a, b) => a.start - b.start)[0];
                        if (upcoming) {
                          status = 'Upcoming';
                          dateLabel = `Opens ${upcoming.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
                        } else {
                          status = 'Closed';
                          dateLabel = 'Closed for this cycle';
                        }
                      }
                    }

                    return (
                      <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <p className="font-bold text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500 font-semibold uppercase">{dateLabel}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                          status === 'Active' || status === 'Open' ? 'bg-green-100 text-green-700' :
                          status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {status.toUpperCase()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            )}

            <p className="text-xs text-gray-500 text-center">
              Source: Florida Fish and Wildlife Conservation Commission (FWC), Zone C / DMU C6.
              {' '}<button onClick={() => openExternal('https://myfwc.com/hunting/season-dates/')} className="text-blue-600 underline">Full regulations & licenses at myfwc.com</button>.
              Always verify current rules before hunting or fishing — seasons and regulations can change.
            </p>
          </div>
        )}

        {/* FESTIVAL PLAYLISTS */}
        {activeNav === 'playlists' && (
          <div className="space-y-6 pb-20">
            <div className="bg-gradient-to-br from-purple-700 to-indigo-900 text-white p-8 rounded-2xl shadow-lg text-center">
              <h2 className="text-3xl font-bold mb-2">🎶 FESTIVAL SOUNDS</h2>
              <p className="text-purple-100">Curated BBQ & Country Vibes</p>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Spotify', icon: '🎧', color: 'bg-[#1DB954]', link: 'https://open.spotify.com/playlist/2RGhCcMgYDuUnJo7hXNFd2?si=HrjflBeqQaCJzF7jHwibAw' },
                { name: 'YouTube Music', icon: '📽️', color: 'bg-[#FF0000]', link: 'https://music.youtube.com' },
                { name: 'Pandora', icon: '🦋', color: 'bg-[#00A0EE]', link: 'https://www.pandora.com' }
              ].map((platform, i) => (
                <button
                  key={i}
                  onClick={() => openExternal(platform.link)}
                  className={`${platform.color} p-6 rounded-2xl flex items-center justify-between shadow-lg text-white transition-all transform hover:scale-[1.02] w-full`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{platform.icon}</span>
                    <div>
                      <p className="font-bold text-xl">{platform.name}</p>
                      <p className="text-white text-opacity-80 text-sm">Listen to Jimmy Jam Official</p>
                    </div>
                  </div>
                  <ChevronRight size={28} />
                </button>
              ))}
            </div>

            <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-gray-300 text-center">
              <p className="text-gray-500 font-semibold italic">"The perfect soundtrack for your next backyard cookout."</p>
            </div>
          </div>
        )}

        {/* FESTIVAL GUIDE */}
        {activeNav === 'guide' && (
          <FestivalGuide
            setActiveNav={setActiveNav}
            openExternal={openExternal}
          />
        )}

        {/* ADMIN - MANAGE GPS PINS */}
        {activeNav === 'admin' && (
          <AdminPins venueLat={EVENT_LAT} venueLon={EVENT_LON} />
        )}
      </main>

      {/* FOOTER - CURVED FLOATING NOTCH BOTTOM NAVIGATION */}
      <FestivalBottomNav
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        showMoreMenu={showMoreMenu}
        setShowMoreMenu={setShowMoreMenu}
      />

      {/* FESTIVAL SLIDE-OVER MENU DRAWER */}
      {showMoreMenu && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowMoreMenu(false)}
          />

          {/* Drawer content */}
          <div className="relative w-80 max-w-[85vw] bg-white text-gray-800 shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="bg-red-700 text-white p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <div>
                  <h3 className="font-display text-xl tracking-wider uppercase leading-none">JIMMY JAM</h3>
                  <p className="text-[10px] text-amber-200 font-semibold tracking-wider uppercase">BBQ Slam & Bourbon</p>
                </div>
              </div>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="p-1 hover:bg-red-800 rounded-lg text-white"
                aria-label="Close Menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Drawer Links */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 py-2">
              <div className="px-3 py-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-1">Festival Highlights</p>
                <button onClick={() => { setActiveNav('tickets'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-red-50 text-red-700 font-bold text-sm mb-1 hover:bg-red-100 transition-colors">
                  <span className="text-lg">🎟️</span>
                  <span className="font-display tracking-wider text-base">BUY EVENT TICKETS</span>
                </button>
                <button onClick={() => { setActiveNav('ballot'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 rounded-lg transition-colors">
                  <span className="text-lg">⭐</span>
                  <span className="font-medium">BBQ People's Choice Ballot</span>
                </button>
                <button onClick={() => { setActiveNav('artists'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 rounded-lg transition-colors">
                  <span className="text-lg">🎤</span>
                  <span className="font-medium">Performers Lineup</span>
                </button>
                <button onClick={() => { setActiveNav('schedule'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 rounded-lg transition-colors">
                  <span className="text-lg">📅</span>
                  <span className="font-medium">Full Event Schedule</span>
                </button>
                <button onClick={() => { setActiveNav('maps'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 rounded-lg transition-colors">
                  <span className="text-lg">📍</span>
                  <span className="font-medium">Interactive Venue Map</span>
                </button>
                <button onClick={() => { setActiveNav('photos'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 rounded-lg transition-colors">
                  <span className="text-lg">📸</span>
                  <span className="font-medium">Photo Gallery</span>
                </button>
              </div>

              <div className="px-3 py-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-1">Community & Support</p>
                <button onClick={() => { setActiveNav('assistance'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-orange-700 font-semibold hover:bg-orange-50 rounded-lg transition-colors">
                  <span className="text-lg">❤️</span>
                  <span>Apply for Assistance</span>
                </button>
                <button onClick={() => { setActiveNav('volunteer'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 rounded-lg transition-colors">
                  <span className="text-lg">🤝</span>
                  <span>Volunteer at Festival</span>
                </button>
                <button onClick={() => { setActiveNav('sponsors'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 rounded-lg transition-colors">
                  <span className="text-lg">🏆</span>
                  <span>Official Sponsors</span>
                </button>
              </div>

              <div className="px-3 py-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-1">Info & Merch</p>
                <button onClick={() => { setActiveNav('swag'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 rounded-lg transition-colors">
                  <span className="text-lg">👕</span>
                  <span>Swag Store</span>
                </button>
                <button onClick={() => { setActiveNav('weather'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 rounded-lg transition-colors">
                  <span className="text-lg">☀️</span>
                  <span>Weather Forecast</span>
                </button>
                <button onClick={() => { setActiveNav('recipes'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 rounded-lg transition-colors">
                  <span className="text-lg">📖</span>
                  <span>Pitmaster Recipes</span>
                </button>
                <button onClick={() => { setActiveNav('faq'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 rounded-lg transition-colors">
                  <span className="text-lg">❓</span>
                  <span>FAQs</span>
                </button>
                <button onClick={() => { openExternal('https://open.spotify.com/playlist/2RGhCcMgYDuUnJo7hXNFd2?si=HrjflBeqQaCJzF7jHwibAw'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 rounded-lg transition-colors">
                  <span className="text-lg">🎵</span>
                  <span>Spotify Festival Playlist</span>
                </button>
                <button onClick={() => { openExternal('https://jimmy-jam-app.vercel.app/privacy.html'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 rounded-lg transition-colors">
                  <span className="text-lg">🔒</span>
                  <span>Privacy Policy</span>
                </button>
                <button onClick={() => { setActiveNav('admin'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-xs text-gray-400 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-base">⚙️</span>
                  <span>Staff: Map Pins</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      
      {/* IN-APP EMBEDDED MODAL VIEWER (No external browser tabs!) */}
      {activeEmbeddedUrl && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#181716] text-white px-4 py-3 flex items-center justify-between border-b border-neutral-800 shadow-md">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
                🔒 Secure Form
              </span>
              <span className="font-bold text-sm text-neutral-200 truncate">{embeddedTitle}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => openExternal(activeEmbeddedUrl)}
                className="text-xs text-neutral-400 hover:text-white px-2.5 py-1 rounded-lg border border-neutral-700 hover:border-neutral-500 transition-colors"
                title="Open in new window"
              >
                ↗ Browser
              </button>
              <button
                onClick={() => setActiveEmbeddedUrl(null)}
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition-colors"
                aria-label="Close form"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 w-full h-full bg-white relative">
            <iframe
              src={activeEmbeddedUrl}
              title={embeddedTitle}
              className="w-full h-full border-0"
              allow="payment; camera; geolocation"
            />
          </div>
        </div>
      )}

      {/* PADDING FOR FOOTER */}
      <div className="h-20"></div>
    </div>
  );
};

export default JimmyJamApp;
