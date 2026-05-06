import React, { useState, useEffect } from 'react';
import { Bell, Search, ChevronLeft, ChevronRight, Star, Upload } from 'lucide-react';

const JimmyJamApp = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeNav, setActiveNav] = useState('home');
  const [appSubmitted, setAppSubmitted] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [mapFilters, setMapFilters] = useState(['stage', 'food', 'bar', 'restroom', 'firstaid', 'parking']);
  const [showFilters, setShowFilters] = useState(false);

  // Set default tabs when navigating to specific pages
  useEffect(() => {
    if (activeNav === 'weather') {
      setActiveTab('forecast');
    } else if (activeNav === 'swag') {
      setActiveTab('festival');
    } else if (activeNav === 'maps') {
      setActiveTab('gps');
    }
  }, [activeNav]);
  // SPONSORS DATA
  const sponsorsData = [
    {
      id: 1,
      name: '95.9 The Ranch',
      tagline: 'The Sound of St Augustine, Florida',
      logo: '📻',
      website: 'theranch959.com',
      facebook: 'theranch959',
      instagram: 'theranch959',
      description: 'St Augustine\'s premier country music station bringing live entertainment and community events to North St Augustine, Florida.',
      location: 'St Augustine, FL',
      image: '🎤'
    },
    {
      id: 2,
      name: 'Adobe Interiors',
      tagline: 'Hand Made With American Pride',
      logo: '🏠',
      website: 'adobeinteriors.com',
      facebook: 'adobeinteriors',
      instagram: 'adobeinteriors',
      description: 'Locally crafted furniture and home decor created with quality materials and American craftsmanship.',
      location: 'St Augustine, FL',
      image: '🛋️'
    },
    {
      id: 3,
      name: 'Andrews Distributing',
      tagline: 'Five Decades of Brand Building',
      logo: '🏭',
      website: 'andrewsdist.com',
      facebook: 'andrewsdist',
      instagram: 'andrewsdist',
      description: 'A trusted distributor serving St Augustine, Florida businesses for over 50 years with quality products and service.',
      location: 'St Augustine, FL',
      image: '📦'
    },
    {
      id: 4,
      name: 'Ariat',
      tagline: 'Born to Perform',
      logo: '👢',
      website: 'ariat.com',
      facebook: 'ariat',
      instagram: 'ariat',
      description: 'Premium western boots and equestrian gear designed for performance and style.',
      location: 'St Augustine, FL',
      image: '🤠'
    },
    {
      id: 5,
      name: 'Blue Mint Thai & Asian Cuisine',
      tagline: 'Proud Asian Restaurant and Official Partner',
      logo: '🍜',
      website: 'bluemintthai.com',
      facebook: 'bluemintthai',
      instagram: 'bluemintthai',
      description: 'Authentic Thai and Asian cuisine serving St Augustine with fresh ingredients and traditional recipes.',
      location: 'St Augustine, FL',
      image: '🥢'
    },
    {
      id: 6,
      name: 'Breeding Beef Cattle Co.',
      tagline: 'Raising quality cattle the right way',
      logo: '🐄',
      website: 'breedingbeef.com',
      facebook: 'breedingbeef',
      instagram: 'breedingbeef',
      description: 'Premium beef cattle raised with care and quality standards for St Augustine, Florida ranches and competitions.',
      location: 'St Augustine, FL',
      image: '🐂'
    },
    {
      id: 7,
      name: 'Brims & Bolos',
      tagline: 'Customize, Connect, and Celebrate in Style',
      logo: '🎩',
      website: 'brimsbolos.com',
      facebook: 'brimsbolos',
      instagram: 'brimsbolos',
      description: 'Custom hats and accessories for your unique style. Celebrate St Augustine, Florida culture with authentic western wear.',
      location: 'St Augustine, FL',
      image: '🎪'
    },
    {
      id: 8,
      name: 'Buyers Barricades',
      tagline: 'The St Augustine, Florida Authority in Barricade Rental',
      logo: '🚧',
      website: 'buyersbarricades.com',
      facebook: 'buyersbarricades',
      instagram: 'buyersbarricades',
      description: 'Professional barricade and event equipment rentals serving St Augustine, Florida events and venues.',
      location: 'St Augustine, FL',
      image: '🛡️'
    }
  ];

  // ARTISTS DATA
  const artistsData = [
    {
      id: 1,
      name: 'Whiskey Myers',
      genre: 'Genre-bending band Whiskey Myers...',
      logo: '🎸',
      image: 'https://images.unsplash.com/photo-1501612722273-d492477c552b?auto=format&fit=crop&q=80&w=800',
      description: 'Genre-bending band Whiskey Myers have played nearly 3,000 live shows to ever-increasing crowd sizes since their emergence in 2007. In addition to headlining their own sold-out shows from coast to coast at iconic venues such as Red Rocks Amphitheatre and Ryman Auditorium, plus performing at marquee festivals Bonnaroo, Stagecoach, Download and more, the six-piece was also personally selected to open The Rolling Stones\' Chicago stadium show. Lauded by Rolling Stone as "their most supercharged album yet" that "sounds on the whole like an album by a band working at the height of its powers."',
      time: '10:00 PM',
      stage: 'Main Stage'
    },
    {
      id: 2,
      name: 'Randy Rogers Band',
      genre: 'Fronted by singer-songwriter Randy...',
      logo: '🎵',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
      description: 'Fronted by singer-songwriter Randy Rogers, Randy Rogers Band continues to pack venues across St Augustine, Florida and beyond. Known for their energetic live performances and dedicated fanbase, they deliver authentic St Augustine, Florida country music with heart and soul.',
      time: '8:30 PM',
      stage: 'Main Stage'
    },
    {
      id: 3,
      name: 'Amanda Shires',
      genre: 'A truly singular creative force, Gramm...',
      logo: '🎼',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
      description: 'A truly singular creative force, Grammy-nominated artist Amanda Shires brings her powerful vocals and honest songwriting to every performance. Her blend of country, folk, and rock creates an unforgettable musical experience.',
      time: '7:00 PM',
      stage: 'US Energy Stage'
    },
    {
      id: 4,
      name: 'Jason Scott & the High Heat',
      genre: 'Born and bred in Oklahoma City, Jas...',
      logo: '🔥',
      image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=800',
      description: 'Born and bred in Oklahoma City, Jason Scott & the High Heat bring high-energy performances and authentic country rock. Their passionate delivery and tight musicianship make them a festival favorite.',
      time: '6:00 PM',
      stage: 'US Energy Stage'
    },
    {
      id: 5,
      name: 'Ellis Bullard',
      genre: '"In the wake of 2024\'s Honky Tonk Ai...',
      logo: '⭐',
      image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80&w=800',
      description: 'Ellis Bullard is making waves in the country music scene with his fresh approach to honky-tonk traditions. His rising popularity and distinctive sound have earned him spots at major festivals nationwide.',
      time: '5:00 PM',
      stage: 'Ranch Stage'
    },
    {
      id: 6,
      name: 'The Broken Spokes',
      genre: 'The Broken Spokes are a beloved Tex...',
      logo: '🚲',
      image: 'https://images.unsplash.com/photo-1516280440502-628d098a58e6?auto=format&fit=crop&q=80&w=800',
      description: 'The Broken Spokes are a beloved St Augustine, Florida band bringing classic country rock to audiences across the state. Their timeless sound and connection with fans make every show memorable.',
      time: '4:00 PM',
      stage: 'Ranch Stage'
    },
    {
      id: 7,
      name: 'Weldon Henson',
      genre: 'Rising country artist with authentic...',
      logo: '🤠',
      image: 'https://images.unsplash.com/photo-1496664444929-8c75efb9546f?auto=format&fit=crop&q=80&w=800',
      description: 'Weldon Henson is a rising star in country music, bringing authentic storytelling and genuine emotion to his performances. His deep connection to St Augustine, Florida roots shine through in every song.',
      time: '3:00 PM',
      stage: 'St Augustine Stage'
    },
    {
      id: 8,
      name: 'The Horseshoe Collective',
      genre: 'Dynamic ensemble delivering country...',
      logo: '🎭',
      image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=800',
      description: 'The Horseshoe Collective brings a dynamic, energetic approach to traditional country music. Their ensemble performance style creates an exciting, engaging live experience.',
      time: '2:00 PM',
      stage: 'St Augustine Stage'
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
  const detailedSchedule = [
    { date: 'May 15', dateStr: 'Mon', events: [
      { time: '9:00 AM', title: 'Early Bird Registration Opens', location: 'Online', icon: '🎫', stage: 'registration' }
    ]},
    { date: 'June 1', dateStr: 'Sat', events: [
      { time: '8:00 AM', title: 'Team Registration Closes', location: 'Online Portal', icon: '🏆', stage: 'deadline' },
      { time: '12:00 PM', title: 'Last Early Bird Pricing', location: 'All Events', icon: '💰', stage: 'pricing' }
    ]},
    { date: 'June 15', dateStr: 'Sat', events: [
      { time: '5:00 PM', title: 'Vendor Registration Closes', location: 'Online', icon: '🍖', stage: 'vendor' }
    ]},
    { date: 'June 20', dateStr: 'Thu', events: [
      { time: '11:59 PM', title: 'Car Show Registration Deadline', location: 'Online', icon: '🚗', stage: 'carshow' }
    ]},
    { date: 'July 3', dateStr: 'Wed', events: [
      { time: '6:00 AM', title: 'Vendor Setup Begins', location: 'Event Grounds', icon: '🛠️', stage: 'setup' },
      { time: '12:00 PM', title: 'BBQ Team Check-in', location: 'Main Tent', icon: '📋', stage: 'checkin' },
      { time: '3:00 PM', title: 'Equipment Inspection', location: 'Competition Area', icon: '✅', stage: 'inspection' }
    ]},
    { date: 'July 4', dateStr: 'Thu', events: [
      { time: '8:00 AM', title: 'Gates Open', location: 'Main Entrance', icon: '🚪', stage: 'gates' },
      { time: '10:00 AM', title: 'Judging Begins', location: 'Competition Stage', icon: '👨‍⚖️', stage: 'judging' },
      { time: '12:00 PM', title: 'Bourbon Tasting Opens', location: 'Bourbon Pavilion', icon: '🥃', stage: 'bourbon' },
      { time: '3:00 PM', title: 'Live Music Starts', location: 'Main Stage', icon: '🎵', stage: 'music' },
      { time: '6:00 PM', title: 'Awards Announcement', location: 'Trophy Stage', icon: '🏅', stage: 'awards' },
      { time: '8:00 PM', title: 'Event Closes', location: 'All Areas', icon: '🌙', stage: 'closing' }
    ]},
    { date: 'July 5', dateStr: 'Fri', events: [
      { time: '10:00 AM', title: 'Awards Ceremony & Celebration', location: 'Main Tent', icon: '🥇', stage: 'ceremony' },
      { time: '2:00 PM', title: 'Cleanup & Takedown', location: 'Event Grounds', icon: '🧹', stage: 'cleanup' }
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

  const weatherData = {
    current: { temp: 78, condition: 'Partly Cloudy', icon: '⛅', humidity: 65, wind: 8 },
    forecast: [
      { day: 'Today', high: 84, low: 72, icon: '☀️', rain: 5 },
      { day: 'Tomorrow', high: 86, low: 74, icon: '☀️', rain: 10 },
      { day: 'Wed', high: 80, low: 70, icon: '⛅', rain: 20 },
      { day: 'Thu', high: 75, low: 65, icon: '🌧️', rain: 80 },
      { day: 'Fri', high: 72, low: 62, icon: '☁️', rain: 40 },
      { day: 'Sat', high: 78, low: 68, icon: '⛅', rain: 15 },
      { day: 'Sun', high: 82, low: 70, icon: '☀️', rain: 5 }
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

  const testimonials = [
    { 
      name: 'Sarah Jenkins',
      title: 'Community Member',
      quote: "The BBQ Slam isn't just about food; it's about community. They helped me get back on my feet after the flood when I had nowhere else to turn. Forever grateful for the Jimmy Jam family.",
      rating: 5,
      date: '10/12/23',
      initials: 'SJ',
      color: 'bg-rose-100'
    },
    { 
      name: 'Robert Miller',
      title: 'Grant Recipient',
      quote: "I've never seen a group of people work so hard for others. The medical grant they provided changed my daughter's life. This organization is a blessing to St Augustine.",
      rating: 5,
      date: '08/15/23',
      initials: 'RM',
      color: 'bg-blue-100'
    },
    { 
      name: 'David Chen',
      title: 'Silver Sponsor',
      quote: "Best ribs I've ever had, and even better people. Proud to be a sponsor every year and see the direct impact our contributions have on local families in need.",
      rating: 4,
      date: '09/20/23',
      initials: 'DC',
      color: 'bg-amber-100'
    },
    { 
      name: 'Maria Rodriguez',
      title: 'Assistance Recipient',
      quote: "When my truck broke down and I couldn't get to work, Jimmy Jam Outreach stepped in. They didn't just pay for the repair; they gave me hope during a dark time.",
      rating: 5,
      date: '11/05/23',
      initials: 'MR',
      color: 'bg-emerald-100'
    },
    { 
      name: 'Kevin Thompson',
      title: 'Volunteer',
      quote: "A truly world-class event with a heart of gold. The impact they have on St Augustine is immeasurable. It's an honor to wear the volunteer shirt every year.",
      rating: 5,
      date: '10/10/23',
      initials: 'KT',
      color: 'bg-indigo-100'
    }
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

  const submitAssistance = () => {
    if (!assistanceForm.firstName || !assistanceForm.lastName || !assistanceForm.email || assistanceForm.assistanceType.length === 0 || !assistanceForm.agree) {
      alert('Please fill all required fields');
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
      icon: '🎵', 
      title: 'Music Ticket',
      price: 75.79,
      features: [
        'Doors at 4:00pm',
        'Access to the US Energy Main Stage Music',
        'Food & beverage sales available'
      ]
    },
    { 
      icon: '🍖', 
      title: 'BBQ Competition',
      price: 49.99,
      features: [
        'Judging begins at 10:00am',
        'Access to competition grounds',
        'Sample all BBQ entries',
        'Award ceremony seating'
      ]
    },
    { 
      icon: '🥃', 
      title: 'Bourbon Tasting',
      price: 65.99,
      features: [
        'Premium bourbon selection',
        'Guided tasting experience',
        'Food pairings included',
        'Exclusive tasting glass'
      ]
    },
    { 
      icon: '🎆', 
      title: 'All Access Pass',
      price: 129.99,
      features: [
        'Everything included',
        'All stages and activities',
        'VIP seating area',
        'Premium parking'
      ]
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

        {/* SCHEDULE - CALENDAR VIEW */}
        {activeNav === 'schedule' && (
          <div className="space-y-4">
            {/* HEADER WITH MONTH */}
            <div className="flex items-center justify-between mb-4">
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-all">
                <ChevronLeft size={24} className="text-gray-800" />
              </button>
              <h2 className="text-2xl font-bold text-gray-800">JULY</h2>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-all">
                <Search size={24} className="text-gray-800" />
              </button>
            </div>

            {/* CALENDAR DAYS */}
            <div className="grid grid-cols-7 gap-2 text-center mb-4">
              {['WED', 'THU', 'FRI', 'SAT', 'SUN', 'MON', 'TUE'].map((day, i) => (
                <div key={day}>
                  <p className={`text-xs font-bold ${i === 1 ? 'text-black' : 'text-gray-500'}`}>{day}</p>
                  <p className={`text-lg font-bold py-2 rounded-full ${i === 1 ? 'bg-black text-white' : 'text-gray-700'}`}>{2 + i}</p>
                </div>
              ))}
            </div>

            {/* TABS */}
            <div className="flex gap-3 mb-4">
              <button onClick={() => setActiveTab('all')} className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'all' ? 'bg-yellow-400 text-black' : 'bg-gray-300 text-gray-700'}`}>
                All Events
              </button>
              <button onClick={() => setActiveTab('my')} className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'my' ? 'bg-yellow-400 text-black' : 'bg-gray-300 text-gray-700'}`}>
                My Schedule
              </button>
            </div>

            {/* FILTER TAGS */}
            <div className="flex gap-2 flex-wrap mb-4">
              <button className="px-4 py-2 border-2 border-gray-400 rounded-full text-sm font-semibold hover:bg-gray-100 transition-all">⚙️ Filters</button>
              <button className="px-4 py-2 border-2 border-gray-400 rounded-full text-sm font-semibold hover:bg-gray-100 transition-all">🍽️ Food</button>
              <button className="px-4 py-2 border-2 border-gray-400 rounded-full text-sm font-semibold hover:bg-gray-100 transition-all">🎵 Music</button>
              <button className="px-4 py-2 border-2 border-gray-400 rounded-full text-sm font-semibold hover:bg-gray-100 transition-all">🏆 BBQ</button>
            </div>

            {/* EVENTS LIST */}
            <div className="space-y-4">
              {detailedSchedule.map((dateGroup) => (
                <div key={dateGroup.date} className="space-y-2">
                  {/* DATE HEADER */}
                  <div className="bg-black text-white px-4 py-2 font-bold text-sm rounded">
                    {dateGroup.dateStr.toUpperCase()}, {dateGroup.date}
                  </div>

                  {/* EVENT CARDS */}
                  {dateGroup.events.map((event, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all border-b-2 border-gray-200">
                      <div className="flex gap-3">
                        {/* LEFT SIDE - INFO */}
                        <div className="flex-1">
                          <p className="text-xs font-bold text-gray-500 mb-1">{event.time} | {dateGroup.date}</p>
                          <h3 className="text-base font-bold text-gray-900">{event.title}</h3>
                          <p className="text-xs text-gray-600 mt-1">{event.location}</p>
                          
                          {/* CATEGORY TAGS */}
                          <div className="flex gap-2 mt-2">
                            <span className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">P</span>
                            <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">I</span>
                            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">F</span>
                            <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">M</span>
                          </div>
                        </div>

                        {/* RIGHT SIDE - ICON */}
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-red-200 to-red-100 flex items-center justify-center text-2xl flex-shrink-0">
                          {event.icon}
                        </div>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="flex gap-3 justify-end mt-3 pt-3 border-t border-gray-200">
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-all">
                          <Upload size={16} className="text-gray-600" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-all">
                          <Star size={16} className="text-gray-600" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-all">
                          <Bell size={16} className="text-gray-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
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
                
                <div className="space-y-3 text-2xl font-black drop-shadow-lg">
                  <p className="hover:scale-105 transition-transform">Weldon Henson</p>
                  <p className="hover:scale-105 transition-transform">The Broken Spokes</p>
                  <p className="text-red-400 hover:scale-105 transition-transform italic">Amanda Shires</p>
                  <p className="hover:scale-105 transition-transform">Jason Scott</p>
                  <div className="pt-6">
                    <p className="text-sm font-bold text-gray-100 mt-3 uppercase tracking-[0.2em]">St Augustine, FL</p>
                    <p className="text-sm font-bold text-gray-200">July 4-5, 2024</p>
                  </div>
                </div>
                
                <p className="text-[10px] text-gray-400 mt-6 font-bold uppercase tracking-widest">jimmyjamoutreach.com</p>
              </div>
            </div>

            {/* BUY BUTTON */}
            <button className="w-full bg-blue-900 hover:bg-blue-950 text-white py-4 rounded-full font-bold text-lg transition-all">
              🎫 Buy Jimmy Jam Tickets
            </button>

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
                      <p className="text-2xl font-bold text-red-700">${ticket.price}</p>
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

                  <button className="w-full mt-4 bg-red-700 hover:bg-red-800 text-white py-2 rounded-lg font-bold text-sm transition-all">
                    BUY NOW
                  </button>
                </div>
              ))}
            </div>

            {/* INFO SECTION */}
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-bold text-blue-900">Event Information</h3>
              
              <div>
                <p className="font-bold text-gray-800 mb-2">When</p>
                <p className="text-gray-700">July 4-5, 2024</p>
              </div>

              <div>
                <p className="font-bold text-gray-800 mb-2">Where</p>
                <p className="text-gray-700">Francis Field<br />25 W Castillo Dr, St. Augustine, FL 32084</p>
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
                      <p className="text-gray-900 font-bold text-lg leading-tight uppercase tracking-widest">Francis Field<br/>Official Festival Map</p>
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
                <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden border-2 border-blue-300 shadow-lg relative">
                  <iframe
                    title="GPS Map"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyA_...&q=Francis+Field+St+Augustine+FL"
                    allowFullScreen
                  ></iframe>
                  {/* OVERLAY IF KEY IS MISSING (Mock for demo) */}
                  <div className="absolute inset-0 bg-blue-900/10 pointer-events-none"></div>
                </div>

                {/* FILTER BUTTON */}
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`w-full py-3 rounded-lg font-bold transition-all border-2 ${showFilters ? 'bg-blue-600 text-white border-blue-700' : 'bg-blue-100 text-blue-700 border-blue-300'}`}
                >
                  {showFilters ? '✕ CLOSE FILTERS' : '🔽 FILTERS'}
                </button>

                {showFilters && (
                  <div className="bg-white rounded-lg p-4 border-2 border-blue-300 grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                    {[
                      { id: 'stage', label: 'Stages', icon: '🎤' },
                      { id: 'food', label: 'Food', icon: '🍔' },
                      { id: 'bar', label: 'Drinks', icon: '🥃' },
                      { id: 'parking', label: 'Parking', icon: '🚗' }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setMapFilters(prev => prev.includes(f.id) ? prev.filter(x => x !== f.id) : [...prev, f.id])}
                        className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${mapFilters.includes(f.id) ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                      >
                        <span>{f.icon}</span>
                        <span className="text-xs font-bold">{f.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* LOCATION INFO */}
                <div className="bg-white rounded-lg p-4 border-2 border-blue-300 space-y-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-700 rounded-lg flex items-center justify-center text-xl">📍</div>
                    <div>
                      <h3 className="font-bold text-gray-900 leading-tight">Francis Field</h3>
                      <p className="text-xs text-gray-500 italic">Official Jimmy Jam Venue</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">25 W Castillo Dr, St. Augustine, FL 32084</p>
                  <button 
                    onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=Francis+Field+St+Augustine+FL', '_blank')}
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
                    { title: '📋 General', icon: '›' },
                    { title: '❓ Frequently Asked Questions', icon: '›' },
                    { title: '🚌 Event Shuttle', icon: '›' },
                    { title: '🅿️ Parking & Policies', icon: '›' },
                    { title: '♿ Services for People with Disabilities', icon: '›' },
                    { title: '♻️ Sustainability & Recycling Initiatives', icon: '›' }
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      className="w-full bg-yellow-50 hover:bg-yellow-100 border-b-2 border-blue-600 p-4 text-left transition-all flex items-center justify-between group"
                    >
                      <p className="font-bold text-lg text-gray-900 group-hover:text-blue-600">{item.title}</p>
                      <span className="text-2xl text-gray-400 group-hover:text-blue-600">›</span>
                    </button>
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

        {/* SPONSORS */}
        {activeNav === 'sponsors' && (
          <div className="space-y-8 pb-20">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold text-gray-900">SPONSORS</h1>
              <p className="text-gray-600">Thank you to our generous sponsors who fund our community initiatives.</p>
            </div>

            <div className="space-y-6">
              {/* PLATINUM / TITLE */}
              <div className="bg-white border-4 border-red-600 rounded-xl p-8 flex flex-col items-center justify-center shadow-2xl">
                <span className="text-red-700 font-bold tracking-widest text-sm mb-4 uppercase">Title Sponsor</span>
                <div className="h-32 w-full bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                  <h2 className="text-4xl font-black text-gray-900 tracking-tighter">BULLSEYE<span className="text-red-600">BBQ</span></h2>
                </div>
              </div>

              {/* GOLD */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'ST AUGUSTINE DISTILLERY', color: 'text-amber-600' },
                  { name: 'FLORIDA HERITAGE BANK', color: 'text-blue-700' }
                ].map((sponsor, idx) => (
                  <div key={idx} className="bg-white border-2 border-amber-400 rounded-xl p-4 flex flex-col items-center justify-center shadow-lg">
                    <span className="text-amber-600 font-bold text-[10px] mb-2 uppercase">Gold Sponsor</span>
                    <div className="h-24 w-full bg-gray-50 rounded flex items-center justify-center p-2 text-center">
                      <h3 className={`text-sm md:text-xl font-bold ${sponsor.color}`}>{sponsor.name}</h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* SILVER */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  'Coastal Equipment',
                  'Sunny Farms Meat',
                  'Local 104 Radio',
                  'Historic City Tours',
                  'Oceanview Hotels',
                  'St Augie Brewing'
                ].map((name, idx) => (
                  <div key={idx} className="bg-white border-2 border-gray-200 rounded-lg p-3 flex flex-col items-center justify-center shadow">
                    <div className="h-16 w-full bg-gray-50 rounded flex items-center justify-center text-center p-1">
                      <h4 className="text-[10px] md:text-xs font-bold text-gray-600">{name}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-12 bg-red-50 p-6 rounded-xl text-center border-2 border-red-200">
              <h3 className="text-xl font-bold text-red-800 mb-2">Become a Partner</h3>
              <p className="text-sm text-red-600 mb-4">Join our community of sponsors and support local outreach.</p>
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
                    <button className="mt-4 w-full md:w-auto px-6 py-2 bg-red-700 text-white font-bold rounded-lg hover:bg-red-800 transition-all shadow-md">VIEW RECIPE</button>
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
                      <p>Weldon Henson</p>
                      <p>The Broken Spokes</p>
                      <p className="text-[#ff9871]">Amanda Shires</p>
                      <p>Jason Scott</p>
                    </div>
                    <div className="text-xs text-blue-100 space-y-2 font-bold tracking-wider">
                      <p>St Augustine, FL</p>
                      <p>July 4-5, 2024</p>
                      <p className="mt-6 opacity-75 lowercase font-normal tracking-normal text-[10px]">jimmyjamoutreach.com</p>
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
                  { title: 'BBQ Team Entry', icon: '🍖', color: 'red' },
                  { title: 'Vendor Entry Form', icon: '⛺', color: 'orange' },
                  { title: 'Car Show Entry', icon: '🚗', color: 'gray' }
                ].map((form, i) => (
                  <button key={i} className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between border-2 border-transparent hover:border-red-700 transition-all">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{form.icon}</span>
                      <span className="font-bold text-lg text-gray-800">{form.title}</span>
                    </div>
                    <span className="text-red-700 font-bold">REGISTER →</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CALENDAR SECTION */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-red-700 pl-4">Calendar of Events</h2>
              <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200">
                {detailedSchedule[5].events.slice(0, 4).map((event, i) => (
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
            <div className="w-full h-64 bg-black rounded-lg overflow-hidden shadow-lg relative">
              <img 
                src={selectedArtist.image} 
                alt={selectedArtist.name} 
                className="w-full h-full object-cover" 
              />
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
                      <p className="text-sm text-gray-600 truncate">{sponsor.tagline}</p>
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
              {selectedSponsor.image}
            </div>

            {/* TITLE & TAGLINE */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-red-700">{selectedSponsor.name}</h1>
              <p className="text-gray-600">{selectedSponsor.tagline}</p>
            </div>

            {/* SOCIAL & SHARE BUTTONS */}
            <div className="flex gap-2 flex-wrap">
              <button className="px-4 py-2 border-2 border-red-700 text-red-700 rounded-full font-semibold hover:bg-red-50 transition-all flex items-center gap-2">
                🌐 Website
              </button>
              <button className="w-10 h-10 border-2 border-red-700 text-red-700 rounded-full font-bold hover:bg-red-50 transition-all flex items-center justify-center">
                f
              </button>
              <button className="w-10 h-10 border-2 border-red-700 text-red-700 rounded-full font-bold hover:bg-red-50 transition-all flex items-center justify-center">
                📷
              </button>
              <button className="px-4 py-2 border-2 border-red-700 text-red-700 rounded-full font-semibold hover:bg-red-50 transition-all flex items-center gap-2">
                📤 Share
              </button>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white rounded-lg p-4 border-2 border-red-700">
              <h3 className="font-bold text-gray-900 mb-2">About</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{selectedSponsor.description}</p>
            </div>

            {/* LOCATION */}
            <div className="bg-white rounded-lg p-4 border-2 border-red-700">
              <div className="flex items-start gap-3">
                <span className="text-xl">📍</span>
                <div>
                  <p className="font-bold text-red-700">{selectedSponsor.name}</p>
                  <p className="text-gray-600 text-sm">{selectedSponsor.location}</p>
                </div>
              </div>
            </div>

            {/* MAP PLACEHOLDER */}
            <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-300">
              <p className="text-gray-600 font-semibold">📍 Map View</p>
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
              <p className="text-5xl font-bold mb-2">78°F</p>
              <p className="text-2xl">Partly Cloudy</p>
              <p className="text-sm mt-4">Humidity: 65% | Wind: 8 mph</p>
            </div>

            {/* LOCATION SELECTOR */}
            <div className="bg-white rounded-lg p-4 border-2 border-blue-300 flex items-center gap-2">
              <span className="text-2xl">☀️</span>
              <div className="flex-1">
                <p className="text-sm text-gray-600">St Augustine, FL</p>
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
              </div>
            )}

            {/* HOURLY FORECAST */}
            {activeTab === 'hourly' && (
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Hourly Forecast</h3>
                
                {/* Today */}
                <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
                  <p className="font-bold text-gray-900 mb-3">Today</p>
                  <div className="space-y-2">
                    {[
                      { time: '4:00 PM', icon: '☀️', temp: 78, humidity: 65, wind: '8 mph E' },
                      { time: '5:00 PM', icon: '⛅', temp: 76, humidity: 68, wind: '7 mph E' },
                      { time: '6:00 PM', icon: '⛅', temp: 74, humidity: 70, wind: '6 mph SE' },
                      { time: '7:00 PM', icon: '🌤️', temp: 72, humidity: 72, wind: '5 mph SE' }
                    ].map((hour, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                        <div className="flex items-center gap-3 flex-1">
                          <p className="font-bold text-gray-800 w-16">{hour.time}</p>
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

                {/* Tomorrow */}
                <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
                  <p className="font-bold text-gray-900 mb-3">Tomorrow</p>
                  <div className="space-y-2">
                    {[
                      { time: '12:00 AM', icon: '🌙', temp: 70, humidity: 75, wind: '4 mph S' },
                      { time: '1:00 AM', icon: '🌙', temp: 69, humidity: 77, wind: '3 mph S' },
                      { time: '2:00 AM', icon: '🌙', temp: 68, humidity: 78, wind: '2 mph S' }
                    ].map((hour, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                        <div className="flex items-center gap-3 flex-1">
                          <p className="font-bold text-gray-800 w-16">{hour.time}</p>
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
              </div>
            )}

            {/* MAP VIEW */}
            {activeTab === 'map' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-800">Weather Map</h3>
                <div className="w-full h-64 bg-gradient-to-br from-gray-300 to-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-300 shadow-lg">
                  <div className="text-center">
                    <p className="text-4xl mb-2">🗺️</p>
                    <p className="text-gray-600 font-semibold">St Augustine, FL</p>
                    <p className="text-sm text-gray-500 mt-2">Interactive weather map</p>
                  </div>
                </div>

                {/* LEGEND */}
                <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
                  <p className="font-bold text-gray-900 mb-3">Legend</p>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="text-center">
                      <div className="w-6 h-6 bg-green-500 rounded mx-auto mb-1"></div>
                      <p className="text-xs font-semibold text-gray-700">Rain</p>
                    </div>
                    <div className="text-center">
                      <div className="w-6 h-6 bg-purple-500 rounded mx-auto mb-1"></div>
                      <p className="text-xs font-semibold text-gray-700">Ice</p>
                    </div>
                    <div className="text-center">
                      <div className="w-6 h-6 bg-pink-500 rounded mx-auto mb-1"></div>
                      <p className="text-xs font-semibold text-gray-700">Mix</p>
                    </div>
                    <div className="text-center">
                      <div className="w-6 h-6 bg-cyan-400 rounded mx-auto mb-1"></div>
                      <p className="text-xs font-semibold text-gray-700">Snow</p>
                    </div>
                  </div>
                </div>

                {/* TIME SLIDER */}
                <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
                  <p className="text-sm font-bold text-gray-800 mb-3">Time: 4:00 PM | Duration: 6 hours</p>
                  <input type="range" min="0" max="100" className="w-full" />
                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                    <span>4p</span>
                    <span>8p</span>
                    <span>12a</span>
                    <span>4a</span>
                    <span>8a</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TESTIMONIALS */}
        {activeNav === 'testimonials' && (
          <div className="space-y-8 pb-20">
            {/* HEADER AREA LIKE IMAGE */}
            <div className="relative h-48 rounded-2xl overflow-hidden shadow-xl mb-12">
              <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex flex-col justify-end p-6 z-10">
                <h1 className="text-3xl font-bold text-white mb-1">Jimmy Jam Stories</h1>
                <p className="text-gray-300 text-sm flex items-center gap-1">📍 St Augustine, St Augustine, Florida</p>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="BBQ Event" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-4 py-2 rounded-lg shadow-lg z-20">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">opinions</p>
              </div>
            </div>

            {/* TESTIMONIAL CARDS */}
            <div className="space-y-12">
              {testimonials.map((t, i) => (
                <div key={i} className="relative pt-6">
                  {/* AVATAR BOX */}
                  <div className={`absolute -top-0 left-4 w-16 h-16 ${t.color} rounded-xl shadow-lg z-30 flex items-center justify-center text-xl font-bold text-gray-700 border-2 border-white overflow-hidden`}>
                    {t.initials}
                  </div>

                  {/* CONTENT CARD */}
                  <div className="bg-[#FAF9F6] rounded-2xl p-6 pl-24 shadow-sm border border-gray-100 relative group transition-all hover:shadow-md">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900">{t.name}</h3>
                        <div className="flex gap-0.5 mt-0.5">
                          {[...Array(5)].map((_, star) => (
                            <span key={star} className={`text-xs ${star < t.rating ? 'text-rose-400' : 'text-gray-300'}`}>★</span>
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400">{t.date}</span>
                    </div>

                    <div className="relative mt-4">
                      <span className="absolute -top-4 -left-2 text-4xl text-gray-200 opacity-50 font-serif">"</span>
                      <p className="text-gray-600 text-sm leading-relaxed italic">
                        {t.quote}
                      </p>
                      <span className="absolute -bottom-6 right-0 text-4xl text-gray-200 opacity-50 font-serif">"</span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">{t.title}</span>
                      <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              ))}
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

              <button onClick={submitAssistance} className="w-full bg-red-700 hover:bg-red-800 text-white py-4 rounded-lg font-bold text-lg">✓ SUBMIT APPLICATION</button>
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
              {/* INSTAGRAM */}
              <button className="w-full bg-gray-800 p-4 rounded-lg flex items-center justify-between border-b-2 border-yellow-500">
                <div className="flex items-center gap-3">
                  <div className="bg-white text-gray-800 rounded-full w-12 h-12 flex items-center justify-center text-lg">📷</div>
                  <span className="text-white font-bold">INSTAGRAM</span>
                </div>
                <span className="text-yellow-400 font-bold text-sm">@JIMMYJAM</span>
              </button>

              {/* FACEBOOK */}
              <button className="w-full bg-gray-800 p-4 rounded-lg flex items-center justify-between border-b-2 border-yellow-500">
                <div className="flex items-center gap-3">
                  <div className="bg-white text-gray-800 rounded-full w-12 h-12 flex items-center justify-center text-lg">f</div>
                  <span className="text-white font-bold">FACEBOOK</span>
                </div>
                <span className="text-yellow-400 font-bold text-sm">JIMMY JAM OUTREACH</span>
              </button>

              {/* TIKTOK */}
              <button className="w-full bg-gray-800 p-4 rounded-lg flex items-center justify-between border-b-2 border-yellow-500">
                <div className="flex items-center gap-3">
                  <div className="bg-white text-gray-800 rounded-full w-12 h-12 flex items-center justify-center text-lg">🎵</div>
                  <span className="text-white font-bold">TIKTOK</span>
                </div>
                <span className="text-yellow-400 font-bold text-sm">@JIMMYJAM</span>
              </button>

              {/* TWITTER/X */}
              <button className="w-full bg-gray-800 p-4 rounded-lg flex items-center justify-between border-b-2 border-yellow-500">
                <div className="flex items-center gap-3">
                  <div className="bg-white text-gray-800 rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">X</div>
                  <span className="text-white font-bold">X (TWITTER)</span>
                </div>
                <span className="text-yellow-400 font-bold text-sm">@JIMMYJAM</span>
              </button>

              {/* SPOTIFY */}
              <button className="w-full bg-gray-800 p-4 rounded-lg flex items-center justify-between border-b-2 border-yellow-500">
                <div className="flex items-center gap-3">
                  <div className="bg-white text-gray-800 rounded-full w-12 h-12 flex items-center justify-center text-lg">🎧</div>
                  <span className="text-white font-bold">SPOTIFY</span>
                </div>
                <span className="text-yellow-400 font-bold text-sm">PLAYLIST</span>
              </button>

              {/* YOUTUBE */}
              <button className="w-full bg-gray-800 p-4 rounded-lg flex items-center justify-between border-b-2 border-yellow-500">
                <div className="flex items-center gap-3">
                  <div className="bg-white text-gray-800 rounded-full w-12 h-12 flex items-center justify-center text-lg">▶️</div>
                  <span className="text-white font-bold">YOUTUBE</span>
                </div>
                <span className="text-yellow-400 font-bold text-sm">CHANNEL</span>
              </button>

              {/* WEBSITE */}
              <button className="w-full bg-gray-800 p-4 rounded-lg flex items-center justify-between border-b-2 border-yellow-500">
                <div className="flex items-center gap-3">
                  <div className="bg-white text-gray-800 rounded-full w-12 h-12 flex items-center justify-center text-lg">🌐</div>
                  <span className="text-white font-bold">WEBSITE</span>
                </div>
                <span className="text-yellow-400 font-bold text-sm">JIMMYJAM.COM</span>
              </button>
            </div>

            {/* CTA SECTION */}
            <div className="bg-gray-800 rounded-lg p-6 text-center border-2 border-yellow-500 mt-8">
              <p className="text-white text-sm mb-4">
                Follow us on social media for updates and community stories
              </p>
              <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 py-3 rounded-lg font-bold transition-all">
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
              <button className="text-2xl text-yellow-100">‹</button>
              <h1 className="text-3xl font-bold text-yellow-100 flex-1 text-center">SWAG STORE</h1>
              <button className="text-2xl">🛒</button>
            </div>

            {/* INFO BANNER */}
            <div className="bg-gray-900 text-white rounded-lg p-5 border-l-4 border-yellow-500">
              <h2 className="text-lg font-bold mb-3">Official Festival Merchandise</h2>
              <p className="text-sm leading-relaxed">
                More merchandise just dropped! Bandanas, hats, tees & more. Shop the exclusive Jimmy Jam collection for free standard shipping on all orders. While supplies last. Terms Apply.
              </p>
            </div>

            {/* TABS */}
            <div className="flex gap-6 border-b-2 border-gray-300 px-2">
              <button onClick={() => setActiveTab('festival')} className={`px-2 py-3 font-bold transition-all text-lg ${activeTab === 'festival' ? 'border-b-4 border-yellow-500 text-yellow-500' : 'text-gray-600'}`}>
                Festival
              </button>
              <button onClick={() => setActiveTab('exclusive')} className={`px-2 py-3 font-bold transition-all text-lg ${activeTab === 'exclusive' ? 'border-b-4 border-yellow-500 text-gray-300' : 'text-gray-600'}`}>
                Amex Shop
              </button>
              <button onClick={() => setActiveTab('wishlist')} className={`px-2 py-3 font-bold transition-all text-lg ${activeTab === 'wishlist' ? 'border-b-4 border-yellow-500 text-gray-300' : 'text-gray-600'}`}>
                Wishlist
              </button>
            </div>

            {/* SEARCH */}
            <div className="relative">
              <Search className="absolute left-4 top-4 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-full bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:bg-white"
              />
            </div>

            {/* PRODUCTS GRID */}
            {(activeTab === 'festival' || activeTab === 'exclusive') && (
              <div className="grid grid-cols-2 gap-4">
                {swagItems.map((item, i) => (
                  <div key={i} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all">
                    {/* PRODUCT IMAGE */}
                    <div className="bg-white h-56 flex items-center justify-center relative">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                      />
                      {/* HEART ICON */}
                      <button className="absolute top-3 right-3 bg-white hover:bg-red-50 text-red-600 rounded-full p-2.5 transition-all shadow-lg border border-red-100">
                        ♡
                      </button>
                    </div>

                    {/* PRODUCT INFO */}
                    <div className="p-4 text-center bg-gray-900">
                      <h3 className="text-white font-bold mb-2 text-sm leading-tight">{item.name}</h3>
                      <p className="text-yellow-400 font-bold text-lg">${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="text-center py-16">
                <p className="text-5xl mb-4">♡</p>
                <p className="text-gray-700 font-bold text-lg">Your wishlist is empty</p>
                <p className="text-gray-500 text-sm mt-2">Add items to save for later</p>
              </div>
            )}
          </div>
        )}
        {/* TIDE CHART */}
        {activeNav === 'tides' && (
          <div className="space-y-6 pb-20">
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white p-8 rounded-2xl shadow-lg text-center">
              <h2 className="text-3xl font-bold mb-2">🌊 TIDE CHART</h2>
              <p className="text-blue-100">Galveston Bay / Port Bolivar</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-blue-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-blue-900">Today's Forecast</h3>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Live</span>
              </div>
              
              <div className="space-y-4">
                {[
                  { time: '4:12 AM', level: '0.2 ft', type: 'Low' },
                  { time: '10:45 AM', level: '1.4 ft', type: 'High' },
                  { time: '4:58 PM', level: '0.1 ft', type: 'Low' },
                  { time: '11:22 PM', level: '1.6 ft', type: 'High' }
                ].map((tide, i) => (
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
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-blue-200">
              <h3 className="font-bold text-lg text-blue-900 mb-4">24-Hour Cycle</h3>
              <div className="h-40 bg-blue-50 rounded-lg flex items-end gap-1 p-2">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-blue-400 rounded-t opacity-60 hover:opacity-100 transition-all cursor-pointer"
                    style={{ height: `${Math.sin(i / 3) * 40 + 50}%` }}
                    title={`Hour ${i}: Tide Level`}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-blue-400 mt-2 font-bold">
                <span>12 AM</span>
                <span>6 AM</span>
                <span>12 PM</span>
                <span>6 PM</span>
                <span>11 PM</span>
              </div>
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
              <p className="text-green-100">St Augustine, Florida Hunting & Fishing Seasons</p>
            </div>

            <div className="space-y-4">
              {[
                { category: 'Hunting', items: [
                  { name: 'Deer (Archery)', dates: 'Sep 30 - Nov 3', status: 'Upcoming', icon: '🏹' },
                  { name: 'Deer (General)', dates: 'Nov 4 - Jan 21', status: 'Closed', icon: '🦌' },
                  { name: 'Dove (North Zone)', dates: 'Sep 1 - Nov 12', status: 'Active', icon: '🕊️' },
                  { name: 'Spring Turkey', dates: 'Mar 30 - May 12', status: 'Closed', icon: '🦃' }
                ]},
                { category: 'Fishing', items: [
                  { name: 'Largemouth Bass', dates: 'Year Round (Peak Mar-May)', status: 'Active', icon: '🐟' },
                  { name: 'White Bass / Crappie', dates: 'Peak Feb - Apr', status: 'Active', icon: '🎣' },
                  { name: 'Catfish', dates: 'Year Round (Peak May-Jul)', status: 'Active', icon: '🐱' }
                ]}
              ].map((group, i) => (
                <div key={i} className="space-y-3">
                  <h3 className="font-bold text-lg text-gray-800 ml-2">{group.category}</h3>
                  {group.items.map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <p className="font-bold text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500 font-semibold uppercase">{item.dates}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                        item.status === 'Active' ? 'bg-green-100 text-green-700' : 
                        item.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {item.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
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
                { name: 'Spotify', icon: '🎧', color: 'bg-[#1DB954]', link: 'https://open.spotify.com' },
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

                  <button onClick={() => { setActiveNav('tickets'); setShowMoreMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-all bg-red-700 text-white font-bold rounded-b-lg">
                    <span className="text-xl">🎫</span>
                    <span>BUY TICKETS</span>
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
