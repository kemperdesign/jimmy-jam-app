import React, { useState, useEffect } from 'react';
import { Bell, Search, ChevronLeft, ChevronRight, Star, Upload } from 'lucide-react';
import { supabase } from './supabaseClient';
import VenueMap from './VenueMap';
import AdminPins from './AdminPins';

const JimmyJamApp = () => {
  // St. Johns County Fairgrounds, 5840 State Rd. 207, Elkton, FL 32145 (real event venue)
  const EVENT_LAT = 29.7707068;
  const EVENT_LON = -81.4533597;
  const EVENT_VENUE_NAME = 'St. Johns County Fairgrounds';
  const EVENT_VENUE_ADDRESS = '5840 State Rd. 207, Elkton, FL 32145';

  const [showSplash, setShowSplash] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeNav, setActiveNav] = useState('home');
  const [appSubmitted, setAppSubmitted] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [mapFilters, setMapFilters] = useState(['stage', 'food', 'bar', 'restroom', 'firstaid', 'parking']);
  const [showFilters, setShowFilters] = useState(false);
  const [openInfoSection, setOpenInfoSection] = useState(null);
  const [openRecipe, setOpenRecipe] = useState(null);
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('jj_cart') || '[]');
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('jj_wishlist') || '[]');
    } catch {
      return [];
    }
  });
  const [showCart, setShowCart] = useState(false);
  const [swagSearch, setSwagSearch] = useState('');
  const [mySchedule, setMySchedule] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('jj_my_schedule') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try { localStorage.setItem('jj_my_schedule', JSON.stringify(mySchedule)); } catch {}
  }, [mySchedule]);

  const toggleMySchedule = (eventTitle) => {
    setMySchedule(prev => prev.includes(eventTitle) ? prev.filter(t => t !== eventTitle) : [...prev, eventTitle]);
  };

  const shareEvent = (event) => {
    if (navigator.share) {
      navigator.share({ title: event.title, text: `${event.title} — ${event.time} at ${event.location}` });
    } else {
      navigator.clipboard.writeText(`${event.title} — ${event.time} at ${event.location}`);
      alert('Event details copied to clipboard!');
    }
  };

  useEffect(() => {
    try { localStorage.setItem('jj_cart', JSON.stringify(cart)); } catch {}
  }, [cart]);

  useEffect(() => {
    try { localStorage.setItem('jj_wishlist', JSON.stringify(wishlist)); } catch {}
  }, [wishlist]);

  const addToCart = (itemName) => {
    setCart(prev => {
      const existing = prev.find(c => c.name === itemName);
      if (existing) return prev.map(c => c.name === itemName ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { name: itemName, qty: 1 }];
    });
  };

  const removeFromCart = (itemName) => {
    setCart(prev => prev.filter(c => c.name !== itemName));
  };

  const toggleWishlist = (itemName) => {
    setWishlist(prev => prev.includes(itemName) ? prev.filter(n => n !== itemName) : [...prev, itemName]);
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
    { id: 1, name: 'Evans Automotive', tier: "People's Choice — Chili & Chowder", logo: '🌶️', website: 'https://www.evans-automotive.com/', description: 'Sponsor of the Chili & Chowder People’s Choice competition at the Jimmy Jam BBQ Slam.' },
    { id: 2, name: 'Steelhead Plumbing', tier: "People's Choice — BBQ", logo: '🍖', website: 'https://steelheadplumbing.com/', description: 'Sponsor of the BBQ People’s Choice competition at the Jimmy Jam BBQ Slam.' },
    { id: 3, name: 'My DUI Guy Law', tier: 'Community Sponsor', logo: '🤝', website: 'https://www.myduiguy.law/', description: 'Proud 2027 Community Sponsor of the Jimmy Jam BBQ Slam.' },
    { id: 4, name: 'Glacier HVAC', tier: 'Community Sponsor', logo: '🤝', website: 'https://glacier-hvac.com/', description: 'Proud 2027 Community Sponsor of the Jimmy Jam BBQ Slam.' },
    { id: 5, name: 'Saint Augustine Slabs & Sawmill', tier: 'Community Sponsor', logo: '🤝', website: 'https://saintaugustineslabsandsawmill.com/', description: 'Proud 2027 Community Sponsor of the Jimmy Jam BBQ Slam.' },
    { id: 6, name: 'St. Johns Culture', tier: 'Community Sponsor', logo: '🤝', website: 'https://stjohnsculture.com/', description: 'Proud 2027 Community Sponsor of the Jimmy Jam BBQ Slam.' },
    { id: 7, name: 'Mastercraft Builder Group', tier: 'Community Sponsor', logo: '🤝', website: 'https://mastercraftbuildergroup.com/clays-for-a-cause-celebrates-10-years/', description: 'Proud 2027 Community Sponsor of the Jimmy Jam BBQ Slam, also behind Clays for a Cause.' },
    { id: 8, name: 'BNS Signs', tier: 'Community Sponsor', logo: '🤝', website: 'https://bnssigns.com/', description: 'Proud 2027 Community Sponsor of the Jimmy Jam BBQ Slam.' },
    { id: 9, name: 'Dynamic Reel', tier: 'Community Sponsor', logo: '🤝', website: 'https://www.dynamicreel.com/', description: 'Proud 2027 Community Sponsor of the Jimmy Jam BBQ Slam.' },
    { id: 10, name: 'Sonny’s BBQ', tier: 'Community Sponsor', logo: '🤝', website: 'https://www.sonnysbbq.com/', description: 'Proud 2027 Community Sponsor of the Jimmy Jam BBQ Slam.' },
    { id: 11, name: 'United Rentals', tier: 'Community Sponsor', logo: '🤝', website: 'https://www.unitedrentals.com/locations/fl/jacksonville/power-hvac-rentals/g80', description: 'Proud 2027 Community Sponsor of the Jimmy Jam BBQ Slam.' },
    { id: 12, name: 'Bozard Ford', tier: 'Community Sponsor', logo: '🤝', website: 'https://bozardford.com/', description: 'Proud 2027 Community Sponsor of the Jimmy Jam BBQ Slam.' },
    { id: 13, name: 'Hometech Pest Control', tier: 'Banner Sponsor', logo: '🏳️', website: 'https://hometechpest.com/', description: 'Proud 2027 Banner Sponsor of the Jimmy Jam BBQ Slam.' },
    { id: 14, name: 'Perfect Promo Solutions', tier: 'Banner Sponsor', logo: '🏳️', website: 'https://www.perfectpromosolutions.com/', description: 'Proud 2027 Banner Sponsor of the Jimmy Jam BBQ Slam.' },
    { id: 15, name: 'MySALL.org', tier: 'Banner Sponsor', logo: '🏳️', website: 'https://mysall.org/', description: 'Proud 2027 Banner Sponsor of the Jimmy Jam BBQ Slam.' },
    { id: 16, name: 'Edwards Law Firm', tier: 'Banner Sponsor', logo: '🏳️', website: 'https://edwardslawfirm.com/', description: 'Proud 2027 Banner Sponsor of the Jimmy Jam BBQ Slam.' },
    { id: 17, name: 'Melvin’s Auto & Truck Repair', tier: 'Banner Sponsor', logo: '🏳️', website: 'https://www.melvinsautoandtruckrepair.com/', description: 'Proud 2027 Banner Sponsor of the Jimmy Jam BBQ Slam.' },
    { id: 18, name: 'MRT St. Augustine', tier: 'Banner Sponsor', logo: '🏳️', website: 'https://mrtstaug.com/', description: 'Proud 2027 Banner Sponsor of the Jimmy Jam BBQ Slam.' },
    { id: 19, name: 'SSS BBQ Inc.', tier: 'Banner Sponsor', logo: '🏳️', website: 'https://www.sssbbqinc.com/', description: 'Proud 2027 Banner Sponsor of the Jimmy Jam BBQ Slam.' },
    { id: 20, name: 'PV Golf Carts', tier: 'Banner Sponsor', logo: '🏳️', website: 'https://www.pvgolfcarts.com/', description: 'Proud 2027 Banner Sponsor of the Jimmy Jam BBQ Slam.' },
    { id: 21, name: 'Best Sub Sandwich', tier: 'Banner Sponsor', logo: '🏳️', website: 'https://bestsubsandwich.com/', description: 'Proud 2027 Banner Sponsor of the Jimmy Jam BBQ Slam.' },
    { id: 22, name: 'Tillman’s BBQ', tier: 'Banner Sponsor', logo: '🏳️', website: 'https://tillmansbbq.com/', description: 'Proud 2027 Banner Sponsor of the Jimmy Jam BBQ Slam.' },
    { id: 23, name: 'Honorable Discharge', tier: 'Banner Sponsor', logo: '🏳️', website: 'https://honorable-discharge.com/', description: 'Proud 2027 Banner Sponsor of the Jimmy Jam BBQ Slam.' },
    { id: 24, name: 'Outdoor Site Solutions', tier: 'Banner Sponsor', logo: '🏳️', website: 'https://www.facebook.com/p/Outdoor-Site-Solutions-LLC-100054171442698/', description: 'Proud 2027 Banner Sponsor of the Jimmy Jam BBQ Slam.' }
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
      image: null,
      description: 'The Futch Brothers Band performs on the patio immediately following the evening program at the 3rd Annual Bourbon & BBQ Event, Saturday October 17th at The Tringali Barn.',
      time: 'After dinner',
      stage: 'Bourbon & BBQ Event (Tringali Barn)'
    },
    {
      id: 2,
      name: 'Local & Regional Artists',
      genre: 'BBQ Slam main stage lineup — to be announced',
      logo: '🎵',
      image: null,
      description: 'The Jimmy Jam BBQ Slam’s live music lineup features local and regional artists playing a mix of country, rock, blues, and classic favorites all day. Live music is included with event admission. The full lineup will be announced closer to the event date.',
      time: 'All day',
      stage: `${EVENT_VENUE_NAME}`
    }
  ];

  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedSponsor, setSelectedSponsor] = useState(null);

  const [assistanceForm, setAssistanceForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    assistanceType: [],
    description: '',
    agree: false
  });

  const WEATHER_CODE_ICON = {
    0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
    45: '🌫️', 48: '🌫️',
    51: '🌦️', 53: '🌦️', 55: '🌧️',
    61: '🌧️', 63: '🌧️', 65: '🌧️',
    71: '🌨️', 73: '🌨️', 75: '🌨️',
    80: '🌧️', 81: '🌧️', 82: '⛈️',
    95: '⛈️', 96: '⛈️', 99: '⛈️'
  };
  const WEATHER_CODE_LABEL = {
    0: 'Clear', 1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Cloudy',
    45: 'Fog', 48: 'Fog',
    51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
    61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
    71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow',
    80: 'Rain Showers', 81: 'Rain Showers', 82: 'Violent Showers',
    95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm'
  };

  const [weatherData, setWeatherData] = useState(null);
  const [weatherError, setWeatherError] = useState('');
  const [tideData, setTideData] = useState(null);
  const [tideError, setTideError] = useState('');
  const [assistanceSubmitting, setAssistanceSubmitting] = useState(false);
  const [assistanceError, setAssistanceError] = useState('');

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${EVENT_LAT}&longitude=${EVENT_LON}` +
          `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
          `&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,precipitation_probability` +
          `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
          `&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FNew_York`
        );
        if (!res.ok) throw new Error('Weather request failed');
        const data = await res.json();

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const forecast = data.daily.time.slice(0, 7).map((dateStr, i) => {
          const d = new Date(dateStr + 'T12:00:00');
          return {
            day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[d.getDay()],
            high: Math.round(data.daily.temperature_2m_max[i]),
            low: Math.round(data.daily.temperature_2m_min[i]),
            icon: WEATHER_CODE_ICON[data.daily.weather_code[i]] || '⛅',
            rain: data.daily.precipitation_probability_max[i]
          };
        });

        const nowIndex = data.hourly.time.findIndex(t => t === data.current.time.slice(0, 13) + ':00');
        const startIdx = nowIndex >= 0 ? nowIndex : 0;
        const hourly = data.hourly.time.slice(startIdx, startIdx + 12).map((t, i) => {
          const idx = startIdx + i;
          const d = new Date(t);
          return {
            time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            icon: WEATHER_CODE_ICON[data.hourly.weather_code[idx]] || '⛅',
            temp: Math.round(data.hourly.temperature_2m[idx]),
            humidity: data.hourly.relative_humidity_2m[idx],
            wind: `${Math.round(data.hourly.wind_speed_10m[idx])} mph`
          };
        });

        setWeatherData({
          current: {
            temp: Math.round(data.current.temperature_2m),
            condition: WEATHER_CODE_LABEL[data.current.weather_code] || 'Unknown',
            icon: WEATHER_CODE_ICON[data.current.weather_code] || '⛅',
            humidity: data.current.relative_humidity_2m,
            wind: Math.round(data.current.wind_speed_10m)
          },
          forecast,
          hourly
        });
      } catch (err) {
        setWeatherError('Unable to load live weather right now.');
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 15 * 60 * 1000); // refresh every 15 min
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Splash screen effect
  useEffect(() => {
    if (!showSplash) return;
    
    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setShowSplash(false), 300);
          return 100;
        }
        return prev + Math.random() * 25;
      });
    }, 250);

    return () => clearInterval(timer);
  }, [showSplash]);

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-red-700 to-red-600 flex flex-col items-center justify-center z-50">
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-64 h-64 mx-auto flex items-center justify-center relative">
                <img 
                  src="/logo-blend.png" 
                  alt="Jimmy Jam BBQ Slam Logo" 
                  className="w-full h-full object-contain mix-blend-screen drop-shadow-2xl animate-pulse" 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full px-8 pb-20">
          <p className="text-white text-xl font-bold text-center mb-6">Loading Community</p>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-300 to-yellow-100 transition-all duration-200"
              style={{ width: `${Math.min(loadingProgress, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // DETAILED SCHEDULE WITH TIMES
  // The real site (jimmyjambbqslam.com) says the full 2027 itinerary is "Coming Soon" —
  // these are only the specific day-of windows actually confirmed there. We don't invent
  // a fake hour-by-hour schedule or deadline dates that haven't been announced.
  const detailedSchedule = [
    { date: 'BBQ Slam (date TBA)', dateStr: 'Main Event', events: [
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



  const galleryPhotos = [
    { id: 9, isPoster: true, title: 'BBQ SLAM & BOURBON', desc: 'Official Festival Poster' },
    { id: 1, src: '/images/event 1.webp', title: 'BBQ Competition 2023', desc: 'Teams competing for prizes' },
    { id: 2, src: '/images/event 2.webp', title: 'Smoking Brisket', desc: '14-hour St Augustine, Florida style' },
    { id: 3, src: '/images/event 3.webp', title: 'Prize Winners', desc: 'Championship teams' },
    { id: 4, src: '/images/event 4.webp', title: 'Bourbon Tasting', desc: 'Premium selection' },
    { id: 5, src: '/images/event 5.webp', title: 'Community Gathering', desc: 'Families together' },
    { id: 6, src: '/images/event 6.webp', title: 'Awards Ceremony', desc: 'Celebration moment' },
    { id: 7, src: '/images/481974352_947902437529671_1263519369693082133_n.jpg', title: 'Food Vendors', desc: 'Local businesses' },
    { id: 8, src: '/images/482024108_947900074196574_2207116397592462971_n.jpg', title: 'Live Music', desc: 'Entertainment stage' }
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

  const assistanceTypes = [
    { id: 'housing', label: '🏠 Housing', desc: 'Rent, mortgage, utilities' },
    { id: 'medical', label: '🏥 Medical', desc: 'Medical bills, prescriptions' },
    { id: 'transportation', label: '🚗 Transportation', desc: 'Car repairs, gas' },
    { id: 'food', label: '🍖 Food', desc: 'Groceries, food' },
    { id: 'childcare', label: '👶 Childcare', desc: 'Daycare, school' },
    { id: 'utilities', label: '💡 Utilities', desc: 'Electric, water, gas' },
    { id: 'emergency', label: '🆘 Emergency', desc: 'Crisis situations' }
  ];

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
    { title: 'Rebuilding After Losing a Home', body: 'A family of four who lost their home received financial assistance to help rebuild their lives.' }
  ];

  const swagItems = [
    { name: 'Buckle Up 2026 Lineup Tee', price: 45.00, image: '/jimmy_jam_merch_tees_1778038020125.png' },
    { name: 'Desert Rider 2026 Lineup Tee', price: 45.00, image: '/jimmy_jam_merch_tees_1778038020125.png' },
    { name: 'Jimmy Jam Logo Baseball Hat', price: 35.00, image: 'https://images.unsplash.com/photo-1588850567047-dc4b75d3d24c?auto=format&fit=crop&q=80&w=400' },
    { name: 'Indigo Sunset Festival Hoodie', price: 65.00, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400' },
    { name: 'BBQ Championship Apron', price: 39.99, image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400' },
    { name: 'Premium Bandana Set (3-pack)', price: 24.99, image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=400' },
    { name: 'Bourbon & BBQ Trucker Hat', price: 42.00, image: 'https://images.unsplash.com/photo-1596455607563-ad6193f76b17?auto=format&fit=crop&q=80&w=400' },
    { name: 'Festival Lineup Zip Hoodie', price: 75.00, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=400' },
    { name: 'Jimmy Jam Coffee Mug', price: 16.99, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fbed20?auto=format&fit=crop&q=80&w=400' },
    { name: 'Premium BBQ Rub Collection', price: 54.99, image: 'https://images.unsplash.com/photo-1532336411638-af7294273e8d?auto=format&fit=crop&q=80&w=400' },
    { name: 'Stainless Steel Tumbler', price: 28.00, image: 'https://images.unsplash.com/photo-1517254456976-ee8682099819?auto=format&fit=crop&q=80&w=400' },
    { name: 'Festival Bourbon Glass Set', price: 34.99, image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400' }
  ];

  const handleAssistanceTypeToggle = (type) => {
    const newTypes = assistanceForm.assistanceType.includes(type)
      ? assistanceForm.assistanceType.filter(t => t !== type)
      : [...assistanceForm.assistanceType, type];
    setAssistanceForm({ ...assistanceForm, assistanceType: newTypes });
  };

  const submitAssistance = async () => {
    if (!assistanceForm.firstName || !assistanceForm.lastName || !assistanceForm.email || assistanceForm.assistanceType.length === 0 || !assistanceForm.agree) {
      alert('Please fill all required fields');
      return;
    }

    setAssistanceSubmitting(true);
    setAssistanceError('');

    const { error } = await supabase.from('assistance_applications').insert({
      first_name: assistanceForm.firstName,
      last_name: assistanceForm.lastName,
      email: assistanceForm.email,
      phone: assistanceForm.phone,
      assistance_type: assistanceForm.assistanceType,
      description: assistanceForm.description
    });

    setAssistanceSubmitting(false);

    if (error) {
      setAssistanceError('Something went wrong submitting your application. Please try again or call us directly.');
      return;
    }

    setAppSubmitted(true);
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % galleryPhotos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);
  };

  const mainFeatures = [
    { icon: '📅', title: 'SCHEDULE', desc: 'Event dates & times', action: 'schedule' },
    { icon: '🎫', title: 'TICKETS', desc: 'Buy event tickets', action: 'tickets' },
    { icon: '📸', title: 'PHOTOS', desc: 'Event gallery', action: 'photos' },
    { icon: '🏆', title: 'EVENTS', desc: 'Browse our festivals', action: 'events' },
    { icon: '🤝', title: 'SPONSORS', desc: 'Meet our partners', action: 'sponsors' },
    { icon: '👕', title: 'MERCH', desc: 'Shop swag store', action: 'swag' },
    { icon: '🥃', title: 'BOURBON', desc: 'Premium tasting', action: 'bourbon' },
    { icon: '🌤️', title: 'WEATHER', desc: 'Event forecast', action: 'weather' },
    { icon: '💬', title: 'STORIES', desc: 'Real testimonials', action: 'testimonials' }
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
      url: 'https://pci.jotform.com/form/253157513794160'
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
      url: 'https://pci.jotform.com/form/253157513794160'
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
            {activeNav !== 'home' && (
              <button onClick={() => { setActiveNav('home'); }} className="lg:hidden text-white text-2xl">
                <ChevronLeft size={28} />
              </button>
            )}

            <div className="text-center flex-1 lg:text-center">
              <h1 className="font-bold text-xl text-white">{activeNav.toUpperCase()}</h1>
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <button className="p-2 hover:bg-red-600 rounded-lg">
                <Search size={20} />
              </button>
              <Bell size={20} />
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* HOME */}
        {activeNav === 'home' && (
          <div className="space-y-8">
            {/* HERO */}
            <div className="relative rounded-lg overflow-hidden h-96 bg-black flex items-center justify-center shadow-xl">
              {/* VIDEO BACKGROUND */}
              <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src="/hero-video.mp4" type="video/mp4" />
              </video>
            </div>

            {/* MAIN FEATURE GRID */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-800 text-center">EXPLORE</h2>
              
              <div className="grid grid-cols-3 gap-4">
                {mainFeatures.map((feature, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveNav(feature.action)}
                    className="group bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-gray-200 hover:border-red-700"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-20 h-20 rounded-full border-4 border-red-700 flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 group-hover:bg-red-700 transition-all">
                        <span className="text-4xl group-hover:hidden">{feature.icon}</span>
                        <span className="text-white text-3xl hidden group-hover:block">→</span>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-gray-800 text-sm">{feature.title}</p>
                        <p className="text-gray-600 text-xs">{feature.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <button
                onClick={() => setActiveNav('assistance')}
                className="bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-800 hover:to-orange-700 text-white px-12 py-4 rounded-lg font-bold text-lg shadow-lg transform hover:scale-105 transition-all"
              >
                ❤️ APPLY FOR HELP
              </button>
            </div>
          </div>
        )}

        {/* SCHEDULE */}
        {activeNav === 'schedule' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
              <p className="font-bold text-blue-900">Stay Tuned for 2027!</p>
              <p className="text-sm text-blue-700">The full 2027 BBQ Slam itinerary will be posted here once announced. What's confirmed so far is below.</p>
            </div>

            {/* TABS */}
            <div className="flex gap-3 mb-4">
              <button onClick={() => setActiveTab('all')} className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'all' ? 'bg-yellow-400 text-black' : 'bg-gray-300 text-gray-700'}`}>
                All Events
              </button>
              <button onClick={() => setActiveTab('my')} className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'my' ? 'bg-yellow-400 text-black' : 'bg-gray-300 text-gray-700'}`}>
                My Schedule ({mySchedule.length})
              </button>
            </div>

            {/* EVENTS LIST */}
            <div className="space-y-4">
              {detailedSchedule.map((dateGroup) => {
                const events = activeTab === 'my'
                  ? dateGroup.events.filter(e => mySchedule.includes(e.title))
                  : dateGroup.events;
                if (events.length === 0) return null;
                return (
                  <div key={dateGroup.date} className="space-y-2">
                    {/* DATE HEADER */}
                    <div className="bg-black text-white px-4 py-2 font-bold text-sm rounded">
                      {dateGroup.dateStr.toUpperCase()}, {dateGroup.date}
                    </div>

                    {/* EVENT CARDS */}
                    {events.map((event, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all border-b-2 border-gray-200">
                        <div className="flex gap-3">
                          {/* LEFT SIDE - INFO */}
                          <div className="flex-1">
                            <p className="text-xs font-bold text-gray-500 mb-1">{event.time}</p>
                            <h3 className="text-base font-bold text-gray-900">{event.title}</h3>
                            <p className="text-xs text-gray-600 mt-1">{event.location}</p>
                          </div>

                          {/* RIGHT SIDE - ICON */}
                          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-red-200 to-red-100 flex items-center justify-center text-2xl flex-shrink-0">
                            {event.icon}
                          </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex gap-3 justify-end mt-3 pt-3 border-t border-gray-200">
                          <button onClick={() => shareEvent(event)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-all">
                            <Upload size={16} className="text-gray-600" />
                          </button>
                          <button onClick={() => toggleMySchedule(event.title)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-all">
                            <Star size={16} className={mySchedule.includes(event.title) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
              {activeTab === 'my' && mySchedule.length === 0 && (
                <p className="text-center text-gray-500 py-8">Tap the star on any event to add it to your schedule.</p>
              )}
            </div>
          </div>
        )}

        {/* TICKETS */}
        {activeNav === 'tickets' && (
          <div className="space-y-6">
            {/* POSTER */}
            <div className="relative rounded-xl overflow-hidden shadow-2xl mb-8">
              {/* POSTER BACKGROUND */}
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200" 
                  alt="BBQ Poster Background" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-black/40 to-blue-950/90 z-10"></div>
              </div>
              
              <div className="relative z-20 p-8 text-center text-white space-y-4">
                <p className="text-xs font-black tracking-[0.3em] text-blue-200">JIMMY JAM COMMUNITY OUTREACH</p>
                <h2 className="text-4xl font-black italic tracking-tight drop-shadow-2xl">BBQ SLAM & BOURBON</h2>
                <p className="text-lg text-red-400 font-bold uppercase tracking-widest">& Music Festival</p>

                <div className="my-8 text-6xl drop-shadow-2xl animate-pulse">🔥</div>

                <div className="space-y-3 text-xl font-bold drop-shadow-lg">
                  <p>Live Music featuring Local & Regional Artists</p>
                  <div className="pt-6">
                    <p className="text-sm font-bold text-gray-100 mt-3 uppercase tracking-[0.2em]">{EVENT_VENUE_NAME}</p>
                    <p className="text-sm font-bold text-gray-200">Stay Tuned for 2027 Dates!</p>
                  </div>
                </div>

                <p className="text-[10px] text-gray-400 mt-6 font-bold uppercase tracking-widest">jimmyjambbqslam.com</p>
              </div>
            </div>

            {/* BUY BUTTON */}
            <a
              href="https://pci.jotform.com/form/253157513794160"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block text-center bg-blue-900 hover:bg-blue-950 text-white py-4 rounded-full font-bold text-lg transition-all"
            >
              🎫 Buy Jimmy Jam Tickets
            </a>

            {/* TICKET OPTIONS */}
            <div className="space-y-4">
              {ticketTypes.map((ticket, idx) => (
                <div key={idx} className="bg-white rounded-lg p-6 border-2 border-gray-300 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{ticket.icon}</span>
                      <h3 className="font-bold text-gray-800">{ticket.title}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-red-700">{ticket.priceLabel}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {ticket.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-red-700 font-bold">•</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <a
                    href={ticket.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-4 block text-center bg-red-700 hover:bg-red-800 text-white py-2 rounded-lg font-bold text-sm transition-all"
                  >
                    BUY / REGISTER
                  </a>
                </div>
              ))}
            </div>

            {/* INFO SECTION */}
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-bold text-blue-900">Event Information</h3>
              
              <div>
                <p className="font-bold text-gray-800 mb-2">When</p>
                <p className="text-gray-700">Stay tuned for 2027 dates! (3rd Annual Bourbon & BBQ Event: Saturday, October 17th)</p>
              </div>

              <div>
                <p className="font-bold text-gray-800 mb-2">Where</p>
                <p className="text-gray-700">{EVENT_VENUE_NAME}<br />{EVENT_VENUE_ADDRESS}</p>
              </div>

              <div>
                <p className="font-bold text-gray-800 mb-2">What's Included</p>
                <ul className="space-y-1 text-sm text-gray-700">
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
        {activeNav === 'maps' && (
          <div className="space-y-4 pb-20">
            {/* HEADER */}
            <div className="bg-blue-600 text-white p-4 rounded-lg mb-4">
              <h1 className="text-3xl font-bold">Maps & Info</h1>
            </div>

            {/* TABS */}
            <div className="flex gap-3 border-b-2 border-gray-300">
              <button onClick={() => setActiveTab('venue')} className={`px-4 py-3 font-bold transition-all flex items-center gap-2 ${activeTab === 'venue' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-600'}`}>
                📍 Map
              </button>
              <button onClick={() => setActiveTab('gps')} className={`px-4 py-3 font-bold transition-all flex items-center gap-2 ${activeTab === 'gps' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-600'}`}>
                🧭 GPS Map
              </button>
              <button onClick={() => setActiveTab('info')} className={`px-4 py-3 font-bold transition-all flex items-center gap-2 ${activeTab === 'info' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-600'}`}>
                ℹ️ Info
              </button>
            </div>

            {/* VENUE MAP TAB */}
            {activeTab === 'venue' && (
              <div className="space-y-4">
                <div className="w-full h-96 bg-white rounded-lg overflow-hidden border-2 border-gray-300 shadow-lg relative">
                  <img 
                    src="https://images.unsplash.com/photo-1569336415962-a4bd9f6dfc0f?auto=format&fit=crop&q=80&w=1200" 
                    alt="Festival Map" 
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white/90 p-4 rounded-xl shadow-xl text-center border-2 border-red-700">
                      <p className="text-4xl mb-2">🎪</p>
                      <p className="text-gray-900 font-bold text-lg leading-tight uppercase tracking-widest">{EVENT_VENUE_NAME}<br/>Official Festival Map</p>
                    </div>
                  </div>
                </div>

                {/* LEGEND */}
                <div className="bg-white rounded-lg p-4 border-2 border-gray-300 space-y-3">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-gray-900">Map Legend</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Click to toggle</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'stage', label: 'BBQ Stage', color: 'bg-red-500' },
                      { id: 'food', label: 'Food Vendors', color: 'bg-green-500' },
                      { id: 'bar', label: 'Bourbon Bar', color: 'bg-blue-500' },
                      { id: 'restroom', label: 'Restrooms', color: 'bg-yellow-500' },
                      { id: 'firstaid', label: 'First Aid', color: 'bg-purple-500' },
                      { id: 'parking', label: 'Parking', color: 'bg-orange-500' }
                    ].map(item => (
                      <button 
                        key={item.id}
                        onClick={() => setMapFilters(prev => prev.includes(item.id) ? prev.filter(f => f !== item.id) : [...prev, item.id])}
                        className={`flex items-center gap-2 p-1 rounded transition-all ${mapFilters.includes(item.id) ? 'opacity-100' : 'opacity-40 scale-95'}`}
                      >
                        <div className={`w-6 h-6 ${item.color} rounded shadow-sm`}></div>
                        <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* GPS MAP TAB */}
            {activeTab === 'gps' && (
              <div className="space-y-4">
                <VenueMap venueLat={EVENT_LAT} venueLon={EVENT_LON} />

                {/* LOCATION INFO */}
                <div className="bg-white rounded-lg p-4 border-2 border-blue-300 space-y-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-700 rounded-lg flex items-center justify-center text-xl">📍</div>
                    <div>
                      <h3 className="font-bold text-gray-900 leading-tight">{EVENT_VENUE_NAME}</h3>
                      <p className="text-xs text-gray-500 italic">Official Jimmy Jam Venue</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{EVENT_VENUE_ADDRESS}</p>
                  <button
                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(EVENT_VENUE_NAME + ', ' + EVENT_VENUE_ADDRESS)}`, '_blank')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    🧭 GET DIRECTIONS
                  </button>
                </div>
              </div>
            )}

            {/* INFO TAB */}
            {activeTab === 'info' && (
              <div className="space-y-3">
                {/* SEARCH */}
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-600"
                  />
                </div>

                {/* INFO SECTIONS */}
                <div className="space-y-2">
                  {[
                    {
                      title: '📋 General',
                      qa: [
                        { q: 'What is the Jimmy Jam BBQ Slam?', a: 'A nonprofit event dedicated to celebrating BBQ, classic cars, live music, and community giving. All proceeds go toward helping individuals and families in need.' },
                        { q: 'When and where is the event?', a: `${EVENT_VENUE_NAME}, ${EVENT_VENUE_ADDRESS}. Stay tuned for 2027 dates!` },
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
                  ].map((item, idx) => (
                    <div key={idx} className="bg-yellow-50 border-b-2 border-blue-600">
                      <button
                        onClick={() => setOpenInfoSection(openInfoSection === idx ? null : idx)}
                        className="w-full hover:bg-yellow-100 p-4 text-left transition-all flex items-center justify-between group"
                      >
                        <p className="font-bold text-lg text-gray-900 group-hover:text-blue-600">{item.title}</p>
                        <span className={`text-2xl text-gray-400 group-hover:text-blue-600 transition-transform ${openInfoSection === idx ? 'rotate-90' : ''}`}>›</span>
                      </button>
                      {openInfoSection === idx && (
                        <div className="px-4 pb-4 space-y-3">
                          {item.qa.map((pair, qi) => (
                            <div key={qi}>
                              <p className="font-bold text-gray-900 text-sm">{pair.q}</p>
                              <p className="text-gray-700 text-sm">{pair.a}</p>
                            </div>
                          ))}
                          <p className="text-xs text-gray-500 pt-2 border-t border-yellow-200">
                            Question not answered here? Email <a href={`mailto:${item.contact}`} className="text-blue-600 underline">{item.contact}</a>.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
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

        {/* RECIPE BOOK */}
        {activeNav === 'recipes' && (
          <div className="space-y-6 pb-20">
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Jimmy Jam Recipe Book</h1>
            <div className="grid gap-6">
              {[
                { title: 'Smoked Brisket Rub', time: '10 min prep', desc: 'A classic Florida-style rub with salt, pepper, garlic, and paprika.', icon: '🥩' },
                { title: 'Bourbon BBQ Sauce', time: '20 min prep', desc: 'Sweet and tangy sauce infused with premium bourbon.', icon: '🍯' },
                { title: 'Pitmaster Baked Beans', time: '2 hours slow-cook', desc: 'Slow-cooked beans with bacon, brown sugar, and molasses.', icon: '🥘' }
              ].map((recipe, idx) => (
                <div key={idx} className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left hover:border-red-300 transition-all">
                  <div className="text-6xl bg-red-50 p-6 rounded-full border border-red-100">{recipe.icon}</div>
                  <div className="flex-1 space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">{recipe.title}</h2>
                    <p className="text-sm font-bold text-red-600 uppercase tracking-widest">{recipe.time}</p>
                    <p className="text-gray-600 leading-relaxed">{recipe.desc}</p>
                    <button
                      onClick={() => setOpenRecipe(openRecipe === idx ? null : idx)}
                      className="mt-4 w-full md:w-auto px-6 py-2 bg-red-700 text-white font-bold rounded-lg hover:bg-red-800 transition-all shadow-md"
                    >
                      {openRecipe === idx ? 'HIDE RECIPE' : 'VIEW RECIPE'}
                    </button>
                    {openRecipe === idx && (
                      <p className="text-sm text-gray-500 pt-2 border-t border-gray-100">
                        Full ingredients and step-by-step instructions for this recipe are coming soon.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
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
                      <p>Stay Tuned for 2027 Dates!</p>
                      <p className="mt-6 opacity-75 lowercase font-normal tracking-normal text-[10px]">jimmyjambbqslam.com</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative bg-gradient-to-br from-red-600 to-orange-600 h-[500px] flex items-center justify-center overflow-hidden">
                  <img src={galleryPhotos[currentPhotoIndex].src} alt={galleryPhotos[currentPhotoIndex].title} className="w-full h-full object-cover" />
                </div>
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
                    onClick={() => setCurrentPhotoIndex(idx)}
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
          </div>
        )}

        {/* EVENTS SELECTION PAGE */}
        {activeNav === 'events' && activeTab === 'overview' && (
          <div className="space-y-8 pb-20">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold text-gray-900">OUR EVENTS</h1>
              <p className="text-gray-600">Select an event to explore details and register</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* BOURBON & BBQ CARD */}
              <button 
                onClick={() => setActiveTab('bourbon-event')}
                className="group relative h-64 rounded-2xl overflow-hidden shadow-xl transition-all transform hover:scale-[1.02] border-4 border-white"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-800 opacity-90 group-hover:opacity-100 transition-all"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                  <span className="text-6xl mb-4">🥃</span>
                  <h2 className="text-3xl font-bold">Bourbon & Barbeque</h2>
                  <p className="text-orange-100 mt-2">Premium Tasting & Feast</p>
                  <div className="mt-4 bg-white text-orange-700 px-6 py-2 rounded-full font-bold text-sm">EXPLORE EVENT</div>
                </div>
              </button>

              {/* BBQ SLAM CARD */}
              <button 
                onClick={() => setActiveTab('bbq-slam-event')}
                className="group relative h-64 rounded-2xl overflow-hidden shadow-xl transition-all transform hover:scale-[1.02] border-4 border-white"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-orange-600 opacity-90 group-hover:opacity-100 transition-all"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                  <span className="text-6xl mb-4">🍖</span>
                  <h2 className="text-3xl font-bold">BBQ Slam Event</h2>
                  <p className="text-red-100 mt-2">World-Class Competition</p>
                  <div className="mt-4 bg-white text-red-700 px-6 py-2 rounded-full font-bold text-sm">EXPLORE EVENT</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* BOURBON & BBQ EVENT DETAIL */}
        {activeNav === 'events' && activeTab === 'bourbon-event' && (
          <div className="space-y-8 pb-20">
            <button onClick={() => setActiveTab('overview')} className="flex items-center gap-2 text-orange-700 font-bold mb-4">
              <ChevronLeft size={24} /> Back to Events
            </button>

            <div className="bg-gradient-to-r from-orange-600 to-red-800 text-white p-10 rounded-2xl shadow-lg text-center">
              <h1 className="text-4xl font-bold mb-2">Bourbon & Barbeque</h1>
              <p className="text-orange-100 text-lg">The Ultimate Pairing Experience</p>
            </div>

            {/* MENU SECTION */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-orange-600 pl-4">The Menu</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {bourbonMenu.bbq.map((item, i) => (
                  <div key={i} className="bg-white p-5 rounded-xl shadow-md border border-orange-100 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <span className="text-orange-600 font-bold">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SPONSORS SECTION */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-orange-600 pl-4">Event Sponsors</h2>
              <div className="grid grid-cols-3 gap-4">
                {sponsorsData.slice(0, 3).map((sponsor) => (
                  <div key={sponsor.id} className="bg-white p-4 rounded-xl shadow-md text-center border-2 border-transparent hover:border-orange-500 transition-all">
                    <span className="text-4xl block mb-2">{sponsor.logo}</span>
                    <p className="font-bold text-xs">{sponsor.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* VIDEOS SECTION */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-orange-600 pl-4">Video Highlights</h2>
              <div className="aspect-video bg-gray-900 rounded-2xl flex items-center justify-center text-6xl shadow-2xl relative overflow-hidden group">
                🎬
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                  <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center text-white text-3xl pl-2 shadow-xl">▶</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BBQ SLAM EVENT DETAIL */}
        {activeNav === 'events' && activeTab === 'bbq-slam-event' && (
          <div className="space-y-8 pb-20">
            <button onClick={() => setActiveTab('overview')} className="flex items-center gap-2 text-red-700 font-bold mb-4">
              <ChevronLeft size={24} /> Back to Events
            </button>

            <div className="bg-gradient-to-r from-red-700 to-orange-600 text-white p-10 rounded-2xl shadow-lg text-center">
              <h1 className="text-4xl font-bold mb-2">BBQ Slam Event</h1>
              <p className="text-red-100 text-lg">Championship Competition</p>
            </div>

            {/* REGISTRATION FORMS */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-red-700 pl-4">Registrations</h2>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { title: 'BBQ Team Entry', icon: '🍖', url: 'https://pci.jotform.com/form/260406069565157' },
                  { title: 'Chili Cook-Off Entry', icon: '🌶️', url: 'https://form.jotform.com/253364854082158' },
                  { title: 'Food Vendor Entry', icon: '🍔', url: 'https://form.jotform.com/251346106526149' },
                  { title: 'Retail Vendor Entry', icon: '⛺', url: 'https://form.jotform.com/JJ2026/vendor-application-form' },
                  { title: 'Car Show Entry', icon: '🚗', url: 'https://form.jotform.com/jimmyjammarketing1/car-show-entry-form' },
                  { title: 'Pizza Cook-Off Entry', icon: '🍕', url: 'https://www.pizzacook-off.com' }
                ].map((form, i) => (
                  <a
                    key={i}
                    href={form.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between border-2 border-transparent hover:border-red-700 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{form.icon}</span>
                      <span className="font-bold text-lg text-gray-800">{form.title}</span>
                    </div>
                    <span className="text-red-700 font-bold">REGISTER →</span>
                  </a>
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center">Registration status (open/closed) changes by season — the link always takes you to the current form.</p>
            </div>

            {/* CALENDAR SECTION */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-red-700 pl-4">Calendar of Events</h2>
              <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200">
                {detailedSchedule[0].events.slice(0, 4).map((event, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border-b last:border-b-0">
                    <span className="text-xs font-bold text-red-700 w-20">{event.time}</span>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{event.title}</p>
                      <p className="text-[10px] text-gray-500">{event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SPONSOR LOGOS */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-red-700 pl-4">Official Partners</h2>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="grid grid-cols-4 gap-6">
                  {sponsorsData.map((sponsor) => (
                    <button 
                      key={sponsor.id} 
                      onClick={() => {
                        setSelectedSponsor(sponsor);
                        setActiveNav('sponsors');
                      }}
                      className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-all group"
                    >
                      <span className="text-3xl group-hover:scale-110 transition-transform">{sponsor.logo}</span>
                      <p className="text-[10px] font-bold text-gray-400 uppercase text-center group-hover:text-red-700">{sponsor.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ARTISTS - LIST VIEW */}
        {activeNav === 'artists' && !selectedArtist && (
          <div className="space-y-4">
            {/* SEARCH BAR */}
            <div className="relative">
              <Search className="absolute left-4 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:border-red-700"
              />
            </div>

            {/* ARTISTS LIST */}
            <div className="space-y-3">
              {artistsData.map((artist) => (
                <button
                  key={artist.id}
                  onClick={() => setSelectedArtist(artist)}
                  className="w-full bg-white rounded-2xl p-4 border-2 border-red-700 shadow-md hover:shadow-lg transition-all text-left hover:bg-red-50"
                >
                  <div className="flex items-start gap-4">
                    {/* LOGO */}
                    <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-orange-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                      {artist.logo}
                    </div>

                    {/* TEXT */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-gray-900">{artist.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{artist.genre}</p>
                    </div>

                    {/* ARROW */}
                    <ChevronRight size={20} className="text-red-700 flex-shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ARTISTS - DETAIL VIEW */}
        {activeNav === 'artists' && selectedArtist && (
          <div className="space-y-4 pb-20">
            {/* BACK BUTTON */}
            <button
              onClick={() => setSelectedArtist(null)}
              className="flex items-center gap-2 text-red-700 font-bold mb-2"
            >
              <ChevronLeft size={24} />
              Back
            </button>

            {/* HERO IMAGE */}
            <div className="w-full h-64 bg-gradient-to-br from-red-700 to-orange-600 rounded-lg overflow-hidden shadow-lg relative flex items-center justify-center">
              {selectedArtist.image ? (
                <img
                  src={selectedArtist.image}
                  alt={selectedArtist.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-8xl">{selectedArtist.logo}</span>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            {/* ARTIST NAME */}
            <h1 className="text-3xl font-bold text-red-700">{selectedArtist.name}</h1>

            {/* SHARE BUTTON */}
            <button className="px-4 py-2 border-2 border-red-700 text-red-700 rounded-full font-semibold hover:bg-red-50 transition-all flex items-center gap-2 w-fit">
              📤 Share
            </button>

            {/* DESCRIPTION */}
            <div className="bg-white rounded-lg p-4 border-2 border-gray-300">
              <p className="text-gray-700 text-sm leading-relaxed">{selectedArtist.description}</p>
            </div>

            {/* PERFORMANCE INFO */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-red-50 rounded-lg p-4 border-2 border-red-700">
                <p className="text-xs text-gray-600 font-semibold">Performance Time</p>
                <p className="text-lg font-bold text-red-700 mt-1">⏰ {selectedArtist.time}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border-2 border-red-700">
                <p className="text-xs text-gray-600 font-semibold">Stage</p>
                <p className="text-lg font-bold text-red-700 mt-1">🎪 {selectedArtist.stage}</p>
              </div>
            </div>

            {/* SOCIAL/ACTION BUTTONS */}
            <div className="flex gap-2 flex-wrap">
              <button className="px-4 py-2 border-2 border-red-700 text-red-700 rounded-full font-semibold hover:bg-red-50 transition-all">
                ♥️ Favorite
              </button>
              <button className="px-4 py-2 border-2 border-red-700 text-red-700 rounded-full font-semibold hover:bg-red-50 transition-all">
                🔔 Remind Me
              </button>
            </div>

            {/* ADD TO CALENDAR */}
            <button className="w-full bg-red-700 hover:bg-red-800 text-white py-3 rounded-lg font-bold transition-all">
              📅 Add to Calendar
            </button>
          </div>
        )}

        {/* SPONSORS - LIST VIEW */}
        {activeNav === 'sponsors' && !selectedSponsor && (
          <div className="space-y-4">
            {/* SEARCH BAR */}
            <div className="relative">
              <Search className="absolute left-4 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:border-red-700"
              />
            </div>

            {/* SPONSORS LIST */}
            <div className="space-y-3">
              {sponsorsData.map((sponsor) => (
                <button
                  key={sponsor.id}
                  onClick={() => setSelectedSponsor(sponsor)}
                  className="w-full bg-white rounded-2xl p-4 border-2 border-red-700 shadow-md hover:shadow-lg transition-all text-left hover:bg-red-50"
                >
                  <div className="flex items-start gap-4">
                    {/* LOGO */}
                    <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-orange-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                      {sponsor.logo}
                    </div>

                    {/* TEXT */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-gray-900">{sponsor.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{sponsor.tier}</p>
                    </div>

                    {/* ARROW */}
                    <ChevronRight size={20} className="text-red-700 flex-shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SPONSORS - DETAIL VIEW */}
        {activeNav === 'sponsors' && selectedSponsor && (
          <div className="space-y-4 pb-20">
            {/* BACK BUTTON */}
            <button
              onClick={() => setSelectedSponsor(null)}
              className="flex items-center gap-2 text-red-700 font-bold mb-4"
            >
              <ChevronLeft size={24} />
              Back
            </button>

            {/* LOGO SECTION */}
            <div className="w-full h-40 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg flex items-center justify-center text-6xl shadow-lg">
              {selectedSponsor.logo}
            </div>

            {/* TITLE & TIER */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-red-700">{selectedSponsor.name}</h1>
              <p className="text-gray-600">{selectedSponsor.tier}</p>
            </div>

            {/* WEBSITE & SHARE BUTTONS */}
            <div className="flex gap-2 flex-wrap">
              <a
                href={selectedSponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border-2 border-red-700 text-red-700 rounded-full font-semibold hover:bg-red-50 transition-all flex items-center gap-2"
              >
                🌐 Website
              </a>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: selectedSponsor.name, url: selectedSponsor.website });
                  } else {
                    navigator.clipboard.writeText(selectedSponsor.website);
                    alert('Website link copied to clipboard!');
                  }
                }}
                className="px-4 py-2 border-2 border-red-700 text-red-700 rounded-full font-semibold hover:bg-red-50 transition-all flex items-center gap-2"
              >
                📤 Share
              </button>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white rounded-lg p-4 border-2 border-red-700">
              <h3 className="font-bold text-gray-900 mb-2">About</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{selectedSponsor.description}</p>
            </div>
          </div>
        )}

        {/* BOURBON */}
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
          <div className="space-y-4 pb-20">
            {/* CURRENT WEATHER CARD */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white p-8 rounded-2xl text-center shadow-lg">
              {weatherError && <p className="text-sm mb-2 bg-red-500/30 rounded px-3 py-1 inline-block">{weatherError}</p>}
              {weatherData ? (
                <>
                  <p className="text-5xl font-bold mb-2">{weatherData.current.icon} {weatherData.current.temp}°F</p>
                  <p className="text-2xl">{weatherData.current.condition}</p>
                  <p className="text-sm mt-4">Humidity: {weatherData.current.humidity}% | Wind: {weatherData.current.wind} mph</p>
                </>
              ) : (
                <p className="text-xl">Loading live weather...</p>
              )}
            </div>

            {/* LOCATION SELECTOR */}
            <div className="bg-white rounded-lg p-4 border-2 border-blue-300 flex items-center gap-2">
              <span className="text-2xl">☀️</span>
              <div className="flex-1">
                <p className="text-sm text-gray-600">{EVENT_VENUE_NAME}</p>
              </div>
              <span className="text-gray-400">▼</span>
            </div>

            {/* TABS */}
            <div className="flex gap-2 border-b-2 border-gray-300">
              <button onClick={() => setActiveTab('forecast')} className={`px-4 py-3 font-bold transition-all ${activeTab === 'forecast' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-600'}`}>
                📅 7-Day
              </button>
              <button onClick={() => setActiveTab('hourly')} className={`px-4 py-3 font-bold transition-all ${activeTab === 'hourly' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-600'}`}>
                ⏰ Hourly
              </button>
              <button onClick={() => setActiveTab('map')} className={`px-4 py-3 font-bold transition-all ${activeTab === 'map' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-600'}`}>
                🗺️ Map
              </button>
            </div>

            {/* 7-DAY FORECAST */}
            {activeTab === 'forecast' && (
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">7-Day Forecast</h3>
                {weatherData ? (
                  <div className="grid grid-cols-7 gap-2">
                    {weatherData.forecast.map((day, i) => (
                      <div key={i} className="bg-white rounded-lg border-2 border-blue-300 p-3 text-center shadow-md hover:shadow-lg transition-all">
                        <p className="text-xs font-bold text-blue-700 mb-2">{day.day}</p>
                        <p className="text-3xl mb-2">{day.icon}</p>
                        <p className="text-lg font-bold text-blue-700">{day.high}°</p>
                        <p className="text-xs text-blue-600">{day.low}°</p>
                        <p className="text-xs text-blue-600 mt-1">🌧️{day.rain}%</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Loading forecast...</p>
                )}
              </div>
            )}

            {/* HOURLY FORECAST */}
            {activeTab === 'hourly' && (
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Hourly Forecast</h3>

                {weatherData ? (
                  <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
                    <div className="space-y-2">
                      {weatherData.hourly.map((hour, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                          <div className="flex items-center gap-3 flex-1">
                            <p className="font-bold text-gray-800 w-20">{hour.time}</p>
                            <p className="text-2xl">{hour.icon}</p>
                            <p className="font-bold text-gray-800 w-12">{hour.temp}°</p>
                          </div>
                          <div className="text-right text-xs text-gray-600">
                            <p>💧 {hour.humidity}%</p>
                            <p>💨 {hour.wind}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Loading hourly forecast...</p>
                )}
              </div>
            )}

            {/* MAP VIEW */}
            {activeTab === 'map' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-800">Event Location</h3>
                <div className="w-full h-64 rounded-lg overflow-hidden border-2 border-blue-300 shadow-lg">
                  <iframe
                    title="Event Weather Location Map"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${EVENT_LON - 0.02}%2C${EVENT_LAT - 0.015}%2C${EVENT_LON + 0.02}%2C${EVENT_LAT + 0.015}&layer=mapnik&marker=${EVENT_LAT}%2C${EVENT_LON}`}
                  />
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Live radar overlays aren't available yet — check the 7-Day and Hourly tabs above for current conditions.
                </p>
              </div>
            )}
          </div>
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
              <p className="text-sm text-gray-500 mb-4">Every dollar raised goes directly to helping families in our community. These stories are shared anonymously to protect privacy.</p>
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
        {activeNav === 'assistance' && !appSubmitted && (
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-red-700 text-center">❤️ APPLICATION FOR ASSISTANCE</h2>
            
            <div className="bg-white rounded-lg border-2 border-red-700 p-8 space-y-6 max-w-2xl mx-auto shadow-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <input type="text" placeholder="First Name *" className="p-3 border-2 border-red-300 rounded-lg" value={assistanceForm.firstName} onChange={(e) => setAssistanceForm({...assistanceForm, firstName: e.target.value})} />
                <input type="text" placeholder="Last Name *" className="p-3 border-2 border-red-300 rounded-lg" value={assistanceForm.lastName} onChange={(e) => setAssistanceForm({...assistanceForm, lastName: e.target.value})} />
                <input type="email" placeholder="Email *" className="p-3 border-2 border-red-300 rounded-lg" value={assistanceForm.email} onChange={(e) => setAssistanceForm({...assistanceForm, email: e.target.value})} />
                <input type="tel" placeholder="Phone *" className="p-3 border-2 border-red-300 rounded-lg" value={assistanceForm.phone} onChange={(e) => setAssistanceForm({...assistanceForm, phone: e.target.value})} />
              </div>

              <div>
                <h3 className="text-xl font-bold text-red-700 mb-4">What assistance do you need?</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {assistanceTypes.map(type => (
                    <label key={type.id} className="flex items-start p-4 border-2 border-red-300 rounded-lg hover:bg-red-50 cursor-pointer">
                      <input type="checkbox" className="mt-1 mr-3 w-5 h-5" checked={assistanceForm.assistanceType.includes(type.id)} onChange={() => handleAssistanceTypeToggle(type.id)} />
                      <div>
                        <p className="font-bold text-red-700">{type.label}</p>
                        <p className="text-red-600 text-sm">{type.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <textarea className="w-full p-3 border-2 border-red-300 rounded-lg" rows="5" placeholder="Tell us about your situation..." value={assistanceForm.description} onChange={(e) => setAssistanceForm({...assistanceForm, description: e.target.value})} />

              <label className="flex items-start gap-3">
                <input type="checkbox" className="mt-1 w-5 h-5" checked={assistanceForm.agree} onChange={(e) => setAssistanceForm({...assistanceForm, agree: e.target.checked})} />
                <span className="text-red-700">I confirm this information is accurate.</span>
              </label>

              {assistanceError && (
                <p className="text-red-700 font-semibold text-center">{assistanceError}</p>
              )}

              <button
                onClick={submitAssistance}
                disabled={assistanceSubmitting}
                className="w-full bg-red-700 hover:bg-red-800 disabled:opacity-60 text-white py-4 rounded-lg font-bold text-lg"
              >
                {assistanceSubmitting ? 'SUBMITTING...' : '✓ SUBMIT APPLICATION'}
              </button>
            </div>
          </div>
        )}

        {activeNav === 'assistance' && appSubmitted && (
          <div className="bg-green-50 border-2 border-green-500 p-8 rounded-lg text-center max-w-md mx-auto shadow-lg">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-3xl font-bold text-green-700 mb-2">SUBMITTED!</h3>
            <p className="text-green-700">We'll review within 5-7 business days.</p>
          </div>
        )}

        {/* SWAG */}
        {/* CONNECT - SOCIALS PAGE */}
        {activeNav === 'connect' && (
          <div className="space-y-4 pb-20">
            {/* DIVIDER */}
            <div className="border-t-4 border-yellow-500 mb-6"></div>

            {/* SOCIAL LINKS */}
            <div className="space-y-3">
              {[
                { key: 'instagram', label: 'INSTAGRAM', icon: '📷', handle: '@jimmyjamoutreach', url: 'https://www.instagram.com/jimmyjamoutreach/' },
                { key: 'facebook', label: 'FACEBOOK', icon: 'f', handle: 'JIMMY JAM OUTREACH', url: 'https://www.facebook.com/jimmy.jam.843909' },
                { key: 'spotify', label: 'SPOTIFY', icon: '🎧', handle: 'PLAYLIST', url: 'https://open.spotify.com/playlist/37i9dQZF1DX1lVhptIYRda' },
                { key: 'website', label: 'WEBSITE', icon: '🌐', handle: 'JIMMYJAMOUTREACH.COM', url: 'https://jimmyjamoutreach.com/' }
              ].map(social => (
                <a
                  key={social.key}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gray-800 p-4 rounded-lg flex items-center justify-between border-b-2 border-yellow-500"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white text-gray-800 rounded-full w-12 h-12 flex items-center justify-center text-lg">{social.icon}</div>
                    <span className="text-white font-bold">{social.label}</span>
                  </div>
                  <span className="text-yellow-400 font-bold text-sm">{social.handle}</span>
                </a>
              ))}
            </div>

            {/* CTA SECTION */}
            <div className="bg-gray-800 rounded-lg p-6 text-center border-2 border-yellow-500 mt-8">
              <p className="text-white text-sm mb-4">
                Follow us on social media for updates and community stories
              </p>
              <button
                onClick={() => {
                  window.open('https://www.instagram.com/jimmyjamoutreach/', '_blank');
                  window.open('https://www.facebook.com/jimmy.jam.843909', '_blank');
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
          <div className="space-y-4 pb-20">
            {/* DARK HEADER */}
            <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white p-6 rounded-lg -mx-4 px-4 flex items-center justify-between sticky top-0 z-20">
              <button onClick={() => setActiveNav('home')} className="text-2xl text-yellow-100">‹</button>
              <h1 className="text-3xl font-bold text-yellow-100 flex-1 text-center">SWAG STORE</h1>
              <button onClick={() => setShowCart(true)} className="text-2xl relative">
                🛒
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.reduce((sum, c) => sum + c.qty, 0)}
                  </span>
                )}
              </button>
            </div>

            {/* INFO BANNER */}
            <div className="bg-gray-900 text-white rounded-lg p-5 border-l-4 border-yellow-500">
              <h2 className="text-lg font-bold mb-3">Official Festival Merchandise</h2>
              <p className="text-sm leading-relaxed">
                Bandanas, hats, tees & more. Shop the Jimmy Jam collection. While supplies last.
              </p>
            </div>

            {/* TABS */}
            <div className="flex gap-6 border-b-2 border-gray-300 px-2">
              <button onClick={() => setActiveTab('festival')} className={`px-2 py-3 font-bold transition-all text-lg ${activeTab === 'festival' ? 'border-b-4 border-yellow-500 text-yellow-500' : 'text-gray-600'}`}>
                Shop
              </button>
              <button onClick={() => setActiveTab('wishlist')} className={`px-2 py-3 font-bold transition-all text-lg ${activeTab === 'wishlist' ? 'border-b-4 border-yellow-500 text-gray-300' : 'text-gray-600'}`}>
                Wishlist
              </button>
            </div>

            {/* SEARCH */}
            {activeTab === 'festival' && (
              <div className="relative">
                <Search className="absolute left-4 top-4 text-gray-400" size={20} />
                <input
                  type="text"
                  value={swagSearch}
                  onChange={(e) => setSwagSearch(e.target.value)}
                  placeholder="Search"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-full bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:bg-white"
                />
              </div>
            )}

            {/* PRODUCTS GRID */}
            {activeTab === 'festival' && (
              <div className="grid grid-cols-2 gap-4">
                {swagItems.filter(item => item.name.toLowerCase().includes(swagSearch.toLowerCase())).map((item, i) => (
                  <div key={i} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all">
                    {/* PRODUCT IMAGE */}
                    <div className="bg-white h-56 flex items-center justify-center relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      {/* HEART ICON */}
                      <button
                        onClick={() => toggleWishlist(item.name)}
                        className={`absolute top-3 right-3 bg-white hover:bg-red-50 rounded-full p-2.5 transition-all shadow-lg border border-red-100 ${wishlist.includes(item.name) ? 'text-red-600' : 'text-gray-400'}`}
                      >
                        {wishlist.includes(item.name) ? '♥' : '♡'}
                      </button>
                    </div>

                    {/* PRODUCT INFO */}
                    <div className="p-4 text-center bg-gray-900">
                      <h3 className="text-white font-bold mb-2 text-sm leading-tight">{item.name}</h3>
                      <p className="text-yellow-400 font-bold text-lg mb-3">${item.price}</p>
                      <button
                        onClick={() => addToCart(item.name)}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 rounded-lg text-sm"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              wishlist.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-5xl mb-4">♡</p>
                  <p className="text-gray-700 font-bold text-lg">Your wishlist is empty</p>
                  <p className="text-gray-500 text-sm mt-2">Tap the heart on any item to save it for later</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {swagItems.filter(item => wishlist.includes(item.name)).map((item, i) => (
                    <div key={i} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                      <div className="bg-white h-56 flex items-center justify-center relative">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <button onClick={() => toggleWishlist(item.name)} className="absolute top-3 right-3 bg-white text-red-600 rounded-full p-2.5 shadow-lg border border-red-100">♥</button>
                      </div>
                      <div className="p-4 text-center bg-gray-900">
                        <h3 className="text-white font-bold mb-2 text-sm leading-tight">{item.name}</h3>
                        <p className="text-yellow-400 font-bold text-lg mb-3">${item.price}</p>
                        <button onClick={() => addToCart(item.name)} className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 rounded-lg text-sm">Add to Cart</button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* CART DRAWER */}
            {showCart && (
              <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
                <div className="absolute inset-0 bg-black/50" onClick={() => setShowCart(false)}></div>
                <div className="relative bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-md max-h-[80vh] overflow-y-auto p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
                    <button onClick={() => setShowCart(false)} className="text-gray-500 font-bold text-xl">✕</button>
                  </div>

                  {cart.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Your cart is empty.</p>
                  ) : (
                    <>
                      <div className="space-y-3">
                        {cart.map((c, i) => {
                          const item = swagItems.find(s => s.name === c.name);
                          return (
                            <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-3">
                              <div>
                                <p className="font-bold text-sm text-gray-900">{c.name}</p>
                                <p className="text-xs text-gray-500">Qty {c.qty} &times; ${item?.price.toFixed(2)}</p>
                              </div>
                              <button onClick={() => removeFromCart(c.name)} className="text-red-600 text-sm font-bold">Remove</button>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between font-bold text-lg text-gray-900 pt-2">
                        <span>Subtotal</span>
                        <span>${cart.reduce((sum, c) => {
                          const item = swagItems.find(s => s.name === c.name);
                          return sum + (item?.price || 0) * c.qty;
                        }, 0).toFixed(2)}</span>
                      </div>
                      <button
                        onClick={() => alert('Online checkout is being finalized. Please check back soon, or purchase swag in person at the event!')}
                        className="w-full bg-red-700 hover:bg-red-800 text-white py-3 rounded-lg font-bold"
                      >
                        Checkout
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {/* TIDE CHART */}
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

        {/* BBQ VIDEO LIBRARY */}
        {activeNav === 'videos' && (
          <div className="space-y-6 pb-20">
            <div className="bg-gradient-to-br from-orange-600 to-red-700 text-white p-8 rounded-2xl shadow-lg text-center">
              <h2 className="text-3xl font-bold mb-2">📽️ BBQ ACADEMY</h2>
              <p className="text-orange-100">Instructional Library</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'The Perfect Brisket Masterclass', url: 'https://www.youtube.com/embed/VmH-vT7Z2fI', category: 'Aaron Franklin', views: '12M' },
                { title: 'Competition Ribs Tutorial', url: 'https://www.youtube.com/embed/kXp-o-OayJ4', category: 'Myron Mixon', views: '5M' },
                { title: 'Ultimate Pulled Pork Guide', url: 'https://www.youtube.com/embed/0H3M0E9z_3E', category: 'Meat Church', views: '3M' },
                { title: 'Brisket Trimming Secrets', url: 'https://www.youtube.com/embed/m-0Uv8T2pYI', category: 'Mad Scientist BBQ', views: '2M' },
                { title: 'St Augustine, Florida Style BBQ Chicken', url: 'https://www.youtube.com/embed/n3f-k7Jj-Hk', category: 'Chuds BBQ', views: '1.5M' },
                { title: 'Pork Belly Burnt Ends', url: 'https://www.youtube.com/embed/f6UvV8M_n6k', category: 'HowToBBQRight', views: '8M' }
              ].map((video, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md border-2 border-gray-200 hover:border-red-600 transition-all group">
                  <div className="aspect-video bg-black relative">
                    <iframe 
                      className="w-full h-full"
                      src={video.url}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded">{video.category}</span>
                      <span className="text-[10px] text-gray-400">👁️ {video.views}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 leading-tight group-hover:text-red-700 transition-colors">{video.title}</h3>
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

            <p className="text-xs text-gray-500 text-center">
              Source: Florida Fish and Wildlife Conservation Commission (FWC), Zone C / DMU C6.
              {' '}<a href="https://myfwc.com/hunting/season-dates/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Full regulations & licenses at myfwc.com</a>.
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
                { name: 'Spotify', icon: '🎧', color: 'bg-[#1DB954]', link: 'https://open.spotify.com/playlist/37i9dQZF1DX1lVhptIYRda' },
                { name: 'YouTube Music', icon: '📽️', color: 'bg-[#FF0000]', link: 'https://music.youtube.com' },
                { name: 'Pandora', icon: '🦋', color: 'bg-[#00A0EE]', link: 'https://www.pandora.com' }
              ].map((platform, i) => (
                <a 
                  key={i} 
                  href={platform.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`${platform.color} p-6 rounded-2xl flex items-center justify-between shadow-lg text-white transition-all transform hover:scale-[1.02]`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{platform.icon}</span>
                    <div>
                      <p className="font-bold text-xl">{platform.name}</p>
                      <p className="text-white text-opacity-80 text-sm">Listen to Jimmy Jam Official</p>
                    </div>
                  </div>
                  <ChevronRight size={28} />
                </a>
              ))}
            </div>

            <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-gray-300 text-center">
              <p className="text-gray-500 font-semibold italic">"The perfect soundtrack for your next backyard cookout."</p>
            </div>
          </div>
        )}

        {/* ADMIN - MANAGE GPS PINS */}
        {activeNav === 'admin' && (
          <AdminPins venueLat={EVENT_LAT} venueLon={EVENT_LON} />
        )}
      </main>

      {/* FOOTER - BOTTOM NAVIGATION */}
      <footer className="fixed bottom-0 left-0 right-0 bg-red-700 text-white shadow-lg z-30">
        <div className="max-w-6xl mx-auto px-4 py-2 relative">
          <div className="flex items-center justify-between">
            {/* HOME */}
            <button onClick={() => { setActiveNav('home'); setShowMoreMenu(false); }} className="flex flex-col items-center gap-1 py-3 px-4 hover:bg-red-800 rounded-lg transition-all flex-1">
              <span className="text-2xl">🏠</span>
              <span className="text-xs font-semibold">Home</span>
            </button>

            {/* ARTISTS */}
            <button onClick={() => { setActiveNav('artists'); setShowMoreMenu(false); }} className="flex flex-col items-center gap-1 py-3 px-4 hover:bg-red-800 rounded-lg transition-all flex-1">
              <span className="text-2xl">🎤</span>
              <span className="text-xs font-semibold">Artists</span>
            </button>

            {/* SCHEDULE */}
            <button onClick={() => { setActiveNav('schedule'); setShowMoreMenu(false); }} className="flex flex-col items-center gap-1 py-3 px-4 hover:bg-red-800 rounded-lg transition-all flex-1">
              <span className="text-2xl">📅</span>
              <span className="text-xs font-semibold">Schedule</span>
            </button>

            {/* MAPS */}
            <button onClick={() => { setActiveNav('maps'); setShowMoreMenu(false); }} className="flex flex-col items-center gap-1 py-3 px-4 hover:bg-red-800 rounded-lg transition-all flex-1">
              <span className="text-2xl">📍</span>
              <span className="text-xs font-semibold">Maps</span>
            </button>

            {/* MORE MENU */}
            <div className="relative flex-1">
              <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="flex flex-col items-center gap-1 py-3 px-4 hover:bg-red-800 rounded-lg transition-all w-full">
                <span className="text-2xl">☰</span>
                <span className="text-xs font-semibold">More</span>
              </button>

              {/* MORE MENU DROPDOWN */}
              {showMoreMenu && (
                <>
                  <div className="fixed inset-0 bg-black/5 z-40" onClick={() => setShowMoreMenu(false)}></div>
                  <div className="absolute bottom-full right-0 mb-2 bg-white text-gray-800 rounded-lg shadow-2xl w-56 py-2 z-50">
                  <button onClick={() => { setActiveNav('artists'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-all border-b border-gray-200">
                    <span className="text-xl">🎤</span>
                    <span className="font-semibold">View the Full Lineup</span>
                  </button>

                  <button onClick={() => { setActiveNav('recipes'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-all border-b border-gray-200">
                    <span className="text-xl">📖</span>
                    <span className="font-semibold">Recipe Book</span>
                  </button>

                  <button onClick={() => { setActiveNav('official-partners'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-all border-b border-gray-200">
                    <span className="text-xl">🏆</span>
                    <span className="font-semibold">Official Partners</span>
                  </button>

                  <button onClick={() => { setActiveNav('connect'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-all border-b border-gray-200">
                    <span className="text-xl">🔗</span>
                    <span className="font-semibold">Connect</span>
                  </button>


                  <button onClick={() => { setActiveNav('tides'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-all border-b border-gray-200">
                    <span className="text-xl">🌊</span>
                    <span className="font-semibold">Tide Chart</span>
                  </button>

                  <button onClick={() => { setActiveNav('seasons'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-all border-b border-gray-200">
                    <span className="text-xl">🦌</span>
                    <span className="font-semibold">Season Tracker</span>
                  </button>

                  <button onClick={() => { window.open('https://open.spotify.com/playlist/37i9dQZF1DX1lVhptIYRda', '_blank'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-all border-b border-gray-200">
                    <span className="text-xl">🎵</span>
                    <span className="font-semibold">Festival Playlists</span>
                  </button>

                  <button onClick={() => { setActiveNav('videos'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-all border-b border-gray-200">
                    <span className="text-xl">📽️</span>
                    <span className="font-semibold">BBQ Video Library</span>
                  </button>

                  <button onClick={() => { setActiveNav('tickets'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-all bg-red-700 text-white font-bold">
                    <span className="text-xl">🎫</span>
                    <span>BUY TICKETS</span>
                  </button>

                  <button onClick={() => { setActiveNav('admin'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-all rounded-b-lg text-gray-500 text-xs">
                    <span className="text-base">⚙️</span>
                    <span className="font-semibold">Staff: Manage Map Pins</span>
                  </button>
                </div>
                </>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* PADDING FOR FOOTER */}
      <div className="h-20"></div>
    </div>
  );
};

export default JimmyJamApp;
