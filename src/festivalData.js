// Built-in fallback lists. The app shows these until content is saved in Supabase
// (see the admin page at /admin). Keep the shapes in sync with the admin editor.

export const DEFAULT_VENUE_NAME = 'St. Johns County Fairgrounds';

export const BUNDLED_ARTISTS = [
    {
      id: 2,
      name: 'WALT KULWICKI',
      displayName: 'Walt Kulwicki',
      genre: 'Live Music',
      subtitle: 'Main Stage Performance',
      badge: 'Main Stage',
      category: 'mainstage',
      dateDay: '09',
      dateMonth: 'JAN',
      dateFull: 'Saturday, January 9, 2027',
      eventDate: '2027-01-09',
      eventStartTime: '10:30',
      time: '10:30 AM',
      stage: 'Main Amphitheater Stage',
      stageShort: 'Main Stage',
      location: 'St. Johns County Fairgrounds',
      price: 'Free Entry',
      priceSubtitle: 'Included with Admission',
      goingCount: '',
      image: '/artists/walt-kulwicki.jpg',
      website: 'https://www.facebook.com/Waltsmusicpage',
      spotifyUrl: 'https://open.spotify.com/playlist/2RGhCcMgYDuUnJo7hXNFd2?si=HrjflBeqQaCJzF7jHwibAw',
      ticketUrl: 'https://pci.jotform.com/form/260406377587163',
      description: 'Walt Kulwicki performs on the Main Stage at the 11th Annual Jimmy Jam BBQ Slam.',
      highlights: [
        'Main Stage performance',
        'Included with event admission'
      ],
      avatars: []
    },
    {
      id: 3,
      name: 'COTTONMOUTH BAND',
      displayName: 'Cottonmouth Band',
      genre: 'Live Music',
      subtitle: 'Main Stage Performance',
      badge: 'Main Stage',
      category: 'mainstage',
      dateDay: '09',
      dateMonth: 'JAN',
      dateFull: 'Saturday, January 9, 2027',
      eventDate: '2027-01-09',
      eventStartTime: '11:15',
      time: '11:15 AM',
      stage: 'Main Amphitheater Stage',
      stageShort: 'Main Stage',
      location: 'St. Johns County Fairgrounds',
      price: 'Free Entry',
      priceSubtitle: 'Included with Admission',
      goingCount: '',
      image: '/artists/cottonmouth-band.jpg',
      website: 'https://www.facebook.com/cottonmouthbandSTA',
      spotifyUrl: 'https://open.spotify.com/playlist/2RGhCcMgYDuUnJo7hXNFd2?si=HrjflBeqQaCJzF7jHwibAw',
      ticketUrl: 'https://pci.jotform.com/form/260406377587163',
      description: 'Cottonmouth Band performs on the Main Stage at the 11th Annual Jimmy Jam BBQ Slam.',
      highlights: [
        'Main Stage performance',
        'Included with event admission'
      ],
      avatars: []
    },
    {
      id: 4,
      name: 'PAPER CITY HUSTLERS',
      displayName: 'Paper City Hustlers',
      genre: 'Live Music',
      subtitle: 'Main Stage Performance',
      badge: 'Main Stage',
      category: 'mainstage',
      dateDay: '09',
      dateMonth: 'JAN',
      dateFull: 'Saturday, January 9, 2027',
      eventDate: '2027-01-09',
      eventStartTime: '13:00',
      time: '1:00 PM',
      stage: 'Main Amphitheater Stage',
      stageShort: 'Main Stage',
      location: 'St. Johns County Fairgrounds',
      price: 'Free Entry',
      priceSubtitle: 'Included with Admission',
      goingCount: '',
      image: '/artists/paper-city-hustlers.jpg',
      website: 'https://www.facebook.com/papercityhustlersmusic',
      spotifyUrl: 'https://open.spotify.com/playlist/2RGhCcMgYDuUnJo7hXNFd2?si=HrjflBeqQaCJzF7jHwibAw',
      ticketUrl: 'https://pci.jotform.com/form/260406377587163',
      description: 'Paper City Hustlers perform on the Main Stage at the 11th Annual Jimmy Jam BBQ Slam.',
      highlights: [
        'Main Stage performance',
        'Included with event admission'
      ],
      avatars: []
    },
    {
      id: 5,
      name: 'BROTHERS FUTCH',
      displayName: 'Brothers Futch',
      genre: 'Rock • Country • Blues • Folk • Americana',
      subtitle: 'Main Stage Performance',
      badge: 'Main Stage',
      category: 'mainstage',
      dateDay: '09',
      dateMonth: 'JAN',
      dateFull: 'Saturday, January 9, 2027',
      eventDate: '2027-01-09',
      eventStartTime: '15:00',
      time: '3:00 PM',
      stage: 'Main Amphitheater Stage',
      stageShort: 'Main Stage',
      location: 'St. Johns County Fairgrounds',
      price: 'Free Entry',
      priceSubtitle: 'Included with Admission',
      goingCount: '',
      image: 'https://images.zoogletools.com/s:bzglfiles/u/188709/0fadb2caa1a76a2c326d930c9511749d8c4dbf86/original/photo-output-4.jpeg/!!/b%3AW1sicmVzaXplIiwxODAwXSxbIm1heCJdLFsid2UiXV0%3D/meta%3AeyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ%3D%3D.jpg',
      website: 'https://brianfutch.com/',
      spotifyUrl: 'https://open.spotify.com/playlist/2RGhCcMgYDuUnJo7hXNFd2?si=HrjflBeqQaCJzF7jHwibAw',
      ticketUrl: 'https://pci.jotform.com/form/260406377587163',
      description: 'Brian Futch leads Brothers Futch, playing a mix of rock, country, blues, folk, and Americana, with original songs about life and love. The band has played more than 50 shows in a year and is working on an EP of original material.',
      highlights: [
        'Main Stage performance',
        'Original songs and crowd-favorite covers',
        'Included with event admission'
      ],
      avatars: []
    }
];

export const BUNDLED_SCHEDULE = [
    {
      id: 'cornhole-signup',
      date: 'Jan 9, 2027',
      dateGroup: 'Main Event — Jan 9, 2027',
      time: '10:00 AM',
      title: 'Cornhole Tournament Sign-Ups Open',
      desc: 'Blind draw format. Limited brackets available on-site — sign up early at the tournament tent.',
      category: 'tournaments',
      categoryLabel: 'Tournament',
      location: DEFAULT_VENUE_NAME,
      priceLabel: '$25 / person',
      image: '/images/event-photos/dji_20260110141907_0933_d.jpg',
      icon: '🌽',
      featured: false,
      ticketUrl: 'https://pci.jotform.com/form/260406377587163'
    },
    {
      id: 'cornhole-start',
      date: 'Jan 9, 2027',
      dateGroup: 'Main Event — Jan 9, 2027',
      time: '11:00 AM',
      title: 'Cornhole Tournament Starts',
      desc: 'Tournament throws off! Spectators welcome. Trophies & cash prizes awarded to top teams.',
      category: 'tournaments',
      categoryLabel: 'Tournament',
      location: DEFAULT_VENUE_NAME,
      priceLabel: 'Free to Watch',
      image: '/images/event-photos/dsc08399.jpg',
      icon: '🌽',
      featured: false
    },
    {
      id: 'chili-chowder',
      date: 'Jan 9, 2027',
      dateGroup: 'Main Event — Jan 9, 2027',
      time: '11:00 AM – 3:00 PM',
      title: 'Chili & Chowder People’s Choice Tasting',
      desc: 'Sample mouthwatering creations from 15+ competing teams. Cast your token vote for the crowd favorite!',
      category: 'tastings',
      categoryLabel: 'BBQ & Tastings',
      location: 'Tasting Pavilion • Fairgrounds',
      priceLabel: '$1 Tokens',
      image: '/images/event-photos/dsc08414.jpg',
      icon: '🌶️',
      featured: true,
      ticketUrl: 'https://pci.jotform.com/form/260406377587163'
    },
    {
      id: 'car-show',
      date: 'Jan 9, 2027',
      dateGroup: 'Main Event — Jan 9, 2027',
      time: '10:00 AM',
      title: 'Classic Car, Truck & Motorcycle Show',
      desc: 'Dozens of vintage hot rods, custom trucks, and classic motorcycles on display with awards in multiple categories.',
      category: 'tournaments',
      categoryLabel: 'Car Show',
      location: 'Midway Grounds • Fairgrounds',
      priceLabel: '$20 Pre-reg / $25 Day-of',
      image: '/images/event-photos/dsc08387.jpg',
      icon: '🚗',
      featured: false,
      ticketUrl: 'https://form.jotform.com/jimmyjammarketing1/car-show-entry-form'
    },
    {
      id: 'live-music-main',
      date: 'Jan 9, 2027',
      dateGroup: 'Main Event — Jan 9, 2027',
      time: '10:30 AM',
      title: 'Live Music on the Main Stage',
      desc: 'Walt Kulwicki (10:30 AM), Cottonmouth Band (11:15 AM), Paper City Hustlers (1:00 PM), and Brothers Futch (3:00 PM).',
      category: 'music',
      categoryLabel: 'Live Music',
      location: 'Main Amphitheater Stage',
      priceLabel: 'Included with Admission',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
      icon: '🎸',
      featured: true
    },
    {
      id: 'bbq-tasting',
      date: 'Jan 9, 2027',
      dateGroup: 'Main Event — Jan 9, 2027',
      time: '2:00 PM – 4:00 PM',
      title: 'BBQ People’s Choice Tasting (60+ Teams)',
      desc: 'The main event! Sample ribs, pulled pork, and brisket from over 60 championship BBQ teams and crown the 2027 champion.',
      category: 'tastings',
      categoryLabel: 'BBQ & Tastings',
      location: 'Pitmaster Row • Fairgrounds',
      priceLabel: '$1 Tokens',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800',
      icon: '🍖',
      featured: true,
      ticketUrl: 'https://pci.jotform.com/form/260406377587163'
    },
    {
      id: 'car-show-awards',
      date: 'Jan 9, 2027',
      dateGroup: 'Main Event — Jan 9, 2027',
      time: '12:30 PM',
      title: 'Car Show Awards',
      desc: 'Trophies presented to the winners of the Classic Car, Truck & Motorcycle Show.',
      category: 'tournaments',
      categoryLabel: 'Car Show',
      location: 'Midway Grounds • Fairgrounds',
      priceLabel: 'Free to Attend',
      image: '/images/event-photos/dsc08387.jpg',
      icon: '🚗',
      featured: false
    },
    {
      id: 'awards-ceremony',
      date: 'Jan 9, 2027',
      dateGroup: 'Main Event — Jan 9, 2027',
      time: '5:00 PM',
      title: 'BBQ Awards Ceremony',
      desc: 'Presentation of the BBQ Grand Champion, Backyard Grand Champion, and People\'s Choice trophies on the Main Stage.',
      category: 'tastings',
      categoryLabel: 'Awards',
      location: 'Main Stage',
      priceLabel: 'Free to Attend',
      image: '/images/event-photos/dsc08471.jpg',
      icon: '🏆',
      featured: false
    },
];

export const BUNDLED_TEAMS = [
  {
    id: 'team-1',
    name: 'Maya Jane BBQ Co',
    pitmaster: 'Dave "Smokey" Spencer',
    booth: 'Booth 102',
    category: 'BBQ',
    division: 'Pro Division',
    image: '/winners/maya-jane-bbq-co-pro-grand-champion-2026.jpg',
    specialty: 'Texas Style Brisket & Glazed Ribs'
  },
  {
    id: 'team-2',
    name: "Mike's Backyard BBQ",
    pitmaster: 'Mike Henderson',
    booth: 'Booth 105',
    category: 'BBQ',
    division: 'Backyard Division',
    image: '/winners/mikes-backyard-bbq-backyard-reserve-grand-champion-2026.jpg',
    specialty: 'Applewood Smoked Pork Butt & Hot Links'
  },
  {
    id: 'team-3',
    name: 'So So BBQ',
    pitmaster: 'Marcus Vance',
    booth: 'Booth 108',
    category: 'BBQ',
    division: 'Defending People’s Choice',
    image: '/winners/so-so-bbq-peoples-choice-2026.jpg',
    specialty: 'Sweet & Spicy St. Louis Ribs'
  },
  {
    id: 'team-4',
    name: "Smokin' Spencer's Q",
    pitmaster: 'Brian Spencer',
    booth: 'Booth 112',
    category: 'BBQ',
    division: 'Pro Division',
    image: '/images/event-photos/dsc08414.jpg',
    specialty: 'Cherrywood Pulled Pork & Brisket Bark'
  },
  {
    id: 'team-5',
    name: 'Kings BBQ Pit Crew',
    pitmaster: 'Chris King',
    booth: 'Booth 115',
    category: 'BBQ',
    division: 'Backyard Division',
    image: '/images/event-photos/dsc08416.jpg',
    specialty: 'Brown Sugar Bourbon Ribs'
  },
  {
    id: 'team-6',
    name: 'Old City Smokehouse',
    pitmaster: 'Travis Miller',
    booth: 'Booth 118',
    category: 'BBQ',
    division: 'Pro Division',
    image: '/images/event-photos/dsc08418.jpg',
    specialty: 'Hickory Smoked Pork Belly Burnt Ends'
  },
  {
    id: 'chili-1',
    name: 'Blazin’ Datil Pepper Chili',
    pitmaster: 'Captain Jim Ryan',
    booth: 'Chili Tent #1',
    category: 'Chili & Chowder',
    division: 'Chili Cook-Off',
    image: '/images/event-photos/dsc08401.jpg',
    specialty: 'Local Minorcan Datil Pepper Beef Chili'
  },
  {
    id: 'chili-2',
    name: 'Smoked Brisket Campfire Chili',
    pitmaster: 'Sarah Jenkins',
    booth: 'Chili Tent #4',
    category: 'Chili & Chowder',
    division: 'Chili Cook-Off',
    image: '/images/event-photos/dsc08404.jpg',
    specialty: 'Chunky Smoked Brisket & Dark Stout'
  },
  {
    id: 'chili-3',
    name: 'Minorcan Clam & Pork Chowder',
    pitmaster: 'Capt. Pete Hernandez',
    booth: 'Chili Tent #7',
    category: 'Chili & Chowder',
    division: 'Chili Cook-Off',
    image: '/images/event-photos/dsc08406.jpg',
    specialty: 'Traditional Tomato Broth & Fresh Clams'
  },
  {
    id: 'car-1',
    name: '1969 Chevy Camaro SS (Marina Blue)',
    pitmaster: 'Dan Miller',
    booth: 'Car Show Spot #12',
    category: 'Car Show',
    division: 'Muscle Car Division',
    image: '/images/event-photos/dsc08387.jpg',
    specialty: 'Big Block 396 • 4-Speed'
  },
  {
    id: 'car-2',
    name: '1956 Ford F-100 Custom Pickup',
    pitmaster: 'Robert Kelly',
    booth: 'Car Show Spot #24',
    category: 'Car Show',
    division: 'Classic Truck Division',
    image: '/images/event-photos/dsc08388.jpg',
    specialty: 'Chop Top • Custom Patina V8'
  }
];

export const EVENT_DATE_LABEL = 'January 9, 2027';
export const EVENT_VENUE_ADDRESS = '5840 State Rd. 207, Elkton, FL 32145';

// Converts the nested FAQ sections into one row per question (what the admin edits)
// and back again (what the app shows).
export const flattenFaq = sections => {
  const rows = [];
  sections.forEach((section, sIdx) => {
    section.qa.forEach((item, qIdx) => {
      rows.push({ id: `faq-${sIdx}-${qIdx}`, section: section.title, contact: section.contact || '', q: item.q, a: item.a });
    });
  });
  return rows;
};

export const groupFaq = rows => {
  const sections = [];
  rows.forEach(row => {
    let section = sections.find(s => s.title === row.section);
    if (!section) {
      section = { title: row.section, contact: row.contact || undefined, qa: [] };
      sections.push(section);
    }
    section.qa.push({ q: row.q, a: row.a });
  });
  return sections;
};

export const BUNDLED_SPONSORS = [
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
    { id: 19, name: 'SSS BBQ Inc.', tier: 'Banner Sponsor', logo: '🏳️', logoImage: '/sponsor-logos/sssbbqinc.png', website: 'https://www.sssbbqinc.com/', description: 'Schrader\'s Smoker Service (SSS BBQ Inc.) is a family-run north central Florida business selling commercial-grade smokers and BBQ grills, with parts, repairs, rentals, and relocation services across the Southeast — in business since 1999 as an authorized Southern Pride distributor.' },
    { id: 20, name: 'PV Golf Carts', tier: 'Banner Sponsor', logo: '🏳️', logoImage: '/sponsor-logos/pv-logo-oval.png', website: 'https://www.pvgolfcarts.com/', description: 'Ponte Vedra Golf Carts is a locally owned Club Car and Sierra LSV dealer serving Jacksonville, Ponte Vedra Beach, and Nocatee, with new and refurbished carts plus service, parts, and rentals.' },
    { id: 21, name: 'Best Sub Sandwich', tier: 'Banner Sponsor', logo: '🏳️', logoImage: '/sponsor-logos/logo_top.png', website: 'https://bestsubsandwich.com/', description: 'Old City Subs is a St. Augustine sub sandwich shop founded in 2009, offering subs, salads, catering, and free local delivery from its US-1 South location.' },
    { id: 22, name: 'Tillman’s BBQ', tier: 'Banner Sponsor', logo: '🏳️', logoImage: '/sponsor-logos/tillmans-bbq.png', website: 'https://tillmansbbq.com/', description: 'Tillman\'s Barbecue sells BBQ sauces and dry rubs, including Grandma\'s Red Sauce based on a family recipe from the 1940s, along with wholesale and retail distribution across the region.' },
    { id: 23, name: 'Honorable Discharge', tier: 'Banner Sponsor', logo: '🏳️', logoImage: '/sponsor-logos/hdlogo.png', website: 'https://honorable-discharge.com/', description: 'Honorable Discharge Portable Latrines is a veteran-owned, family-owned company in Elkton, FL, renting portable toilets, wash stations, and RV/boat pump-out services for construction sites, events, and rural properties across Saint Johns, Flagler, and Putnam counties.' },
    { id: 24, name: 'Outdoor Site Solutions', tier: 'Banner Sponsor', logo: '🏳️', logoImage: '/sponsor-logos/odss.jpg', website: 'https://www.facebook.com/p/Outdoor-Site-Solutions-LLC-100054171442698/', description: 'Proud 2027 Banner Sponsor of the Jimmy Jam BBQ Slam.' }
];

export const BUNDLED_FAQ_SECTIONS = [
    {
      title: '📋 General',
      qa: [
        { q: 'What is the Jimmy Jam BBQ Slam?', a: 'A nonprofit event dedicated to celebrating BBQ, classic cars, live music, and community giving. All proceeds go toward helping individuals and families in need.' },
        { q: 'When and where is the event?', a: `${DEFAULT_VENUE_NAME}, ${EVENT_VENUE_ADDRESS}. The 11th Annual Jimmy Jam BBQ Slam is ${EVENT_DATE_LABEL}.` },
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

export const BUNDLED_FAQ_ROWS = flattenFaq(BUNDLED_FAQ_SECTIONS);

export const BUNDLED_WINNERS = [
    { year: '2026', category: 'Pro Grand Champion', team: 'Maya Jane BBQ Co.', photo: '/winners/maya-jane-bbq-co-pro-grand-champion-2026.jpg', logo: '/winners/maya-jane-bbq-co-logo.jpg' },
    { year: '2026', category: 'Backyard Reserve Grand Champion', team: "Mike's Backyard BBQ", photo: '/winners/mikes-backyard-bbq-backyard-reserve-grand-champion-2026.jpg', logo: '/winners/mikes-backyard-bbq-logo.jpg' },
    { year: '2026', category: "People's Choice", team: 'So So BBQ', photo: '/winners/so-so-bbq-peoples-choice-2026.jpg', logo: null }
];

// No volunteer shifts are published yet.
export const BUNDLED_VOLUNTEER_SHIFTS = [];
