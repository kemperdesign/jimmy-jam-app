import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Bell, Search, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import L from 'leaflet';
import { submitBBQTeamEntry, submitVendorEntry, submitCarShowEntry, submitAssistanceApplication, submitNewsletterSignup, uploadPhoto, getPhotos, deletePhoto, sendEmail, submitTicketOrder, submitMerchOrder, submitDonation } from './supabaseClient';

const JimmyJamApp = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeNav, setActiveNav] = useState('home');
  const [activeTab, setActiveTab] = useState('forecast');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [appSubmitted, setAppSubmitted] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [searchArtists, setSearchArtists] = useState('');
  const [searchSchedule, setSearchSchedule] = useState('');
  const [searchSponsors, setSearchSponsors] = useState('');
  const [selectedDate, setSelectedDate] = useState('Oct 10');
  const [activeVideoTab, setActiveVideoTab] = useState('featured');
  const [activeSlamTab, setActiveSlamTab] = useState('overview');

  // Form states for BBQ Slam entries
  const [slamTeamForm, setSlamTeamForm] = useState({
    teamName: '',
    contactName: '',
    email: '',
    phone: '',
    members: '',
    bbqStyle: '',
    experience: ''
  });

  const [vendorForm, setVendorForm] = useState({
    businessName: '',
    category: '',
    contactName: '',
    email: '',
    phone: '',
    description: '',
    booth: ''
  });

  const [carShowForm, setCarShowForm] = useState({
    ownerName: '',
    carMake: '',
    carModel: '',
    carYear: '',
    email: '',
    phone: '',
    category: ''
  });

  const [assistanceForm, setAssistanceForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    assistanceType: '',
    description: ''
  });

  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Photo gallery state
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState('');

  const [slamTeamSubmitted, setSlamTeamSubmitted] = useState({});
  const [vendorSubmitted, setVendorSubmitted] = useState({});
  const [carSubmitted, setCarSubmitted] = useState({});

  // Loading states for form submissions
  const [submitting, setSubmitting] = useState({});
  const [submitError, setSubmitError] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState({});

  // Weather state
  const [weatherData, setWeatherData] = useState({
    current: { temp: 78, condition: 'Partly Cloudy', humidity: 55, windSpeed: 8 },
    forecast: [],
    hourly: [],
    loading: false,
    error: null
  });

  // Payment state
  const [paymentForm, setPaymentForm] = useState({
    name: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvc: ''
  });
  const [selectedTicketType, setSelectedTicketType] = useState('all-access');
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cart, setCart] = useState([]);
  const [donationAmount, setDonationAmount] = useState('50');

  // Map refs
  const gpsMapRef = useRef(null);
  const [mapInstances, setMapInstances] = useState({});

  // Fetch weather data for Fort Worth, TX
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setWeatherData(prev => ({ ...prev, loading: true }));
        // Using Open-Meteo (free, no API key required)
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=32.7555&longitude=-97.3308&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability&hourly=temperature_2m,weather_code&timezone=America/Chicago'
        );
        const data = await response.json();

        // Parse weather code to condition
        const getCondition = (code) => {
          if (code === 0) return 'Clear';
          if (code === 1 || code === 2) return 'Partly Cloudy';
          if (code === 3) return 'Overcast';
          if (code === 45 || code === 48) return 'Foggy';
          if (code >= 51 && code <= 67) return 'Drizzle';
          if (code >= 80 && code <= 82) return 'Rain';
          if (code >= 85 && code <= 86) return 'Showers';
          if (code >= 71 && code <= 77) return 'Snow';
          return 'Cloudy';
        };

        const getWeatherEmoji = (code) => {
          if (code === 0) return '☀️';
          if (code === 1 || code === 2) return '🌤️';
          if (code === 3) return '☁️';
          if (code >= 51 && code <= 82) return '🌧️';
          if (code >= 71 && code <= 86) return '❄️';
          return '🌤️';
        };

        const currentTemp = Math.round(data.current.temperature_2m);
        const currentCondition = getCondition(data.current.weather_code);
        const currentHumidity = data.current.relative_humidity_2m;
        const currentWind = Math.round(data.current.wind_speed_10m);

        // Process 7-day forecast
        const days = ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'];
        const forecast = data.daily.time.slice(0, 7).map((date, idx) => ({
          day: days[idx],
          high: Math.round(data.daily.temperature_2m_max[idx]),
          low: Math.round(data.daily.temperature_2m_min[idx]),
          chance: data.daily.precipitation_probability[idx] || 0,
          emoji: getWeatherEmoji(data.daily.weather_code[idx])
        }));

        // Process hourly forecast (next 12 hours)
        const hourly = data.hourly.time.slice(0, 12).map((time, idx) => {
          const date = new Date(time);
          const hour = date.getHours();
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
          return {
            time: `${displayHour}${ampm}`,
            temp: Math.round(data.hourly.temperature_2m[idx]),
            emoji: getWeatherEmoji(data.hourly.weather_code[idx]),
            humidity: data.current.relative_humidity_2m
          };
        });

        setWeatherData({
          current: {
            temp: currentTemp,
            condition: currentCondition,
            humidity: currentHumidity,
            windSpeed: currentWind
          },
          forecast,
          hourly,
          loading: false,
          error: null
        });
      } catch (err) {
        console.error('Weather fetch error:', err);
        setWeatherData(prev => ({ ...prev, loading: false, error: 'Could not load weather' }));
      }
    };

    fetchWeather();
  }, []);

  useEffect(() => {
    if (showSplash) {
      const timer = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => setShowSplash(false), 500);
            return 100;
          }
          return prev + Math.random() * 30;
        });
      }, 300);
      return () => clearInterval(timer);
    }
  }, [showSplash]);

  // Initialize maps when maps nav is active
  useEffect(() => {
    if (activeNav === 'maps' && activeTab === 'gps' && gpsMapRef.current && !mapInstances.gpsMap) {
      // Fort Worth event coordinates
      const map = L.map(gpsMapRef.current).setView([32.7555, -97.3308], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      // Add venue marker
      L.marker([32.7555, -97.3308], {
        icon: L.icon({
          iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDQwIj48cGF0aCBmaWxsPSIjZGMyNjI2IiBkPSJNMTIgMEM2LjQ4IDAgMiA0LjQ4IDIgMTBjMCA0LjM5IDMuNTggOCA4IDhzOC0zLjYxIDgtOGMwLTUuNTItNC40OC0xMC0xMC0xMHptMCAxNWMtMi43NiAwLTUtMi4yNC01LTVzMi4yNC01IDUtNSA1IDIuMjQgNSA1LTIuMjQgNS01IDV6Ii8+PC9zdmc+',
          iconSize: [24, 40],
          iconAnchor: [12, 40]
        })
      }).addTo(map).bindPopup('<strong>Jimmy Jam Event</strong><br>Fort Worth, TX');

      setMapInstances(prev => ({ ...prev, gpsMap: map }));
    }
  }, [activeNav, activeTab, mapInstances]);

  // Set default tabs on mount
  useEffect(() => {
    if (activeNav === 'weather') setActiveTab('forecast');
    if (activeNav === 'maps') setActiveTab('gps');
  }, [activeNav]);

  // Load photos when photos page is accessed
  useEffect(() => {
    if (activeNav === 'photos') {
      loadPhotos();
    }
  }, [activeNav]);

  const loadPhotos = async () => {
    setPhotoLoading(true);
    setPhotoError('');
    const { data, error } = await getPhotos('event-photos');
    if (error) {
      setPhotoError('Failed to load photos');
    } else {
      setUploadedPhotos(data);
    }
    setPhotoLoading(false);
  };

  // Form submission handlers
  const handleBBQTeamSubmit = async () => {
    // Validate required fields
    if (!slamTeamForm.teamName || !slamTeamForm.contactName || !slamTeamForm.email || !slamTeamForm.phone) {
      setSubmitError(prev => ({ ...prev, team: 'Please fill in all required fields' }));
      return;
    }

    setSubmitting(prev => ({ ...prev, team: true }));
    setSubmitError(prev => ({ ...prev, team: '' }));

    const { data, error } = await submitBBQTeamEntry(slamTeamForm);

    if (error) {
      setSubmitError(prev => ({ ...prev, team: error.message || 'Failed to submit. Please try again.' }));
      setSubmitting(prev => ({ ...prev, team: false }));
    } else {
      // Send confirmation email
      await sendEmail(slamTeamForm.email, 'bbqTeam', slamTeamForm);

      setSubmitSuccess(prev => ({ ...prev, team: true }));
      setSlamTeamForm({ teamName: '', contactName: '', email: '', phone: '', members: '', bbqStyle: '', experience: '' });
      setSlamTeamSubmitted({ ...slamTeamSubmitted, team: true });
      setSubmitting(prev => ({ ...prev, team: false }));
      setTimeout(() => setSubmitSuccess(prev => ({ ...prev, team: false })), 3000);
    }
  };

  const handleVendorSubmit = async () => {
    if (!vendorForm.businessName || !vendorForm.category || !vendorForm.contactName || !vendorForm.email || !vendorForm.phone) {
      setSubmitError(prev => ({ ...prev, vendor: 'Please fill in all required fields' }));
      return;
    }

    setSubmitting(prev => ({ ...prev, vendor: true }));
    setSubmitError(prev => ({ ...prev, vendor: '' }));

    const { data, error } = await submitVendorEntry(vendorForm);

    if (error) {
      setSubmitError(prev => ({ ...prev, vendor: error.message || 'Failed to submit. Please try again.' }));
      setSubmitting(prev => ({ ...prev, vendor: false }));
    } else {
      // Send confirmation email
      await sendEmail(vendorForm.email, 'vendor', vendorForm);

      setSubmitSuccess(prev => ({ ...prev, vendor: true }));
      setVendorForm({ businessName: '', category: '', contactName: '', email: '', phone: '', description: '', booth: '' });
      setVendorSubmitted({ ...vendorSubmitted, submitted: true });
      setSubmitting(prev => ({ ...prev, vendor: false }));
      setTimeout(() => setSubmitSuccess(prev => ({ ...prev, vendor: false })), 3000);
    }
  };

  const handleCarShowSubmit = async () => {
    if (!carShowForm.ownerName || !carShowForm.carMake || !carShowForm.carModel || !carShowForm.email || !carShowForm.phone) {
      setSubmitError(prev => ({ ...prev, car: 'Please fill in all required fields' }));
      return;
    }

    setSubmitting(prev => ({ ...prev, car: true }));
    setSubmitError(prev => ({ ...prev, car: '' }));

    const { data, error } = await submitCarShowEntry(carShowForm);

    if (error) {
      setSubmitError(prev => ({ ...prev, car: error.message || 'Failed to submit. Please try again.' }));
      setSubmitting(prev => ({ ...prev, car: false }));
    } else {
      // Send confirmation email
      await sendEmail(carShowForm.email, 'carShow', carShowForm);

      setSubmitSuccess(prev => ({ ...prev, car: true }));
      setCarShowForm({ ownerName: '', carMake: '', carModel: '', carYear: '', email: '', phone: '', category: '' });
      setCarSubmitted({ ...carSubmitted, submitted: true });
      setSubmitting(prev => ({ ...prev, car: false }));
      setTimeout(() => setSubmitSuccess(prev => ({ ...prev, car: false })), 3000);
    }
  };

  const handleAssistanceSubmit = async () => {
    if (!assistanceForm.fullName || !assistanceForm.email || !assistanceForm.phone || !assistanceForm.assistanceType) {
      setSubmitError(prev => ({ ...prev, assistance: 'Please fill in all required fields' }));
      return;
    }

    setSubmitting(prev => ({ ...prev, assistance: true }));
    setSubmitError(prev => ({ ...prev, assistance: '' }));

    const { data, error } = await submitAssistanceApplication(assistanceForm);

    if (error) {
      setSubmitError(prev => ({ ...prev, assistance: error.message || 'Failed to submit. Please try again.' }));
      setSubmitting(prev => ({ ...prev, assistance: false }));
    } else {
      // Send confirmation email
      await sendEmail(assistanceForm.email, 'assistance', assistanceForm);

      setSubmitSuccess(prev => ({ ...prev, assistance: true }));
      setAssistanceForm({ fullName: '', email: '', phone: '', assistanceType: '', description: '' });
      setAppSubmitted(true);
      setSubmitting(prev => ({ ...prev, assistance: false }));
      setTimeout(() => setSubmitSuccess(prev => ({ ...prev, assistance: false })), 3000);
    }
  };

  const handleNewsletterSubmit = async () => {
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setSubmitError(prev => ({ ...prev, newsletter: 'Please enter a valid email' }));
      return;
    }

    setSubmitting(prev => ({ ...prev, newsletter: true }));
    setSubmitError(prev => ({ ...prev, newsletter: '' }));

    const { data, error } = await submitNewsletterSignup(newsletterEmail);

    if (error) {
      setSubmitError(prev => ({ ...prev, newsletter: error.message || 'Failed to subscribe. Please try again.' }));
      setSubmitting(prev => ({ ...prev, newsletter: false }));
    } else {
      // Send welcome email
      await sendEmail(newsletterEmail, 'newsletter', newsletterEmail);

      setSubmitSuccess(prev => ({ ...prev, newsletter: true }));
      setNewsletterEmail('');
      setSubmitting(prev => ({ ...prev, newsletter: false }));
      setTimeout(() => setSubmitSuccess(prev => ({ ...prev, newsletter: false })), 3000);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoLoading(true);
    setPhotoError('');

    const { data, error } = await uploadPhoto(file, 'event-photos');

    if (error) {
      setPhotoError(error.message || 'Failed to upload photo');
      setPhotoLoading(false);
    } else {
      setSubmitSuccess(prev => ({ ...prev, photo: true }));
      setTimeout(() => setSubmitSuccess(prev => ({ ...prev, photo: false })), 3000);
      // Reload photos to show the new upload
      await loadPhotos();
    }
  };

  const handlePhotoDelete = async (filepath) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;

    setPhotoLoading(true);
    setPhotoError('');

    const { error } = await deletePhoto(filepath);

    if (error) {
      setPhotoError(error.message || 'Failed to delete photo');
      setPhotoLoading(false);
    } else {
      setSubmitSuccess(prev => ({ ...prev, photo: true }));
      setTimeout(() => setSubmitSuccess(prev => ({ ...prev, photo: false })), 3000);
      // Reload photos to update the gallery
      await loadPhotos();
    }
  };

  // Payment handlers
  const ticketPrices = {
    'music': 75.79,
    'bbq': 49.99,
    'bourbon': 65.99,
    'all-access': 129.99
  };

  const handleTicketPayment = async (e) => {
    e.preventDefault();

    if (!paymentForm.name || !paymentForm.email || !paymentForm.phone) {
      setPaymentError('Please fill in all fields');
      return;
    }

    setPaymentProcessing(true);
    setPaymentError('');

    try {
      const amount = ticketPrices[selectedTicketType] * ticketQuantity;

      // In production, this would call your backend API to create a Stripe payment intent securely
      // For now, we'll simulate the payment and store the order
      const { data, error } = await submitTicketOrder({
        name: paymentForm.name,
        email: paymentForm.email,
        phone: paymentForm.phone,
        ticketType: selectedTicketType,
        quantity: ticketQuantity,
        amount: amount
      });

      if (error) {
        setPaymentError('Failed to process payment. Please try again.');
        setPaymentProcessing(false);
      } else {
        // Send confirmation email
        await sendEmail(paymentForm.email, 'ticketConfirmation', {
          name: paymentForm.name,
          ticketType: selectedTicketType,
          quantity: ticketQuantity,
          amount: amount
        });

        setPaymentSuccess(true);
        setPaymentForm({ name: '', email: '', phone: '', cardNumber: '', expiryDate: '', cvc: '' });
        setTimeout(() => setPaymentSuccess(false), 5000);
        setPaymentProcessing(false);
      }
    } catch (err) {
      setPaymentError('An error occurred. Please try again.');
      setPaymentProcessing(false);
    }
  };

  const handleMerchCheckout = async (e) => {
    e.preventDefault();

    if (!paymentForm.name || !paymentForm.email || !paymentForm.phone || cart.length === 0) {
      setPaymentError('Please fill in all fields and add items to cart');
      return;
    }

    setPaymentProcessing(true);
    setPaymentError('');

    try {
      const totalAmount = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

      const { data, error } = await submitMerchOrder({
        name: paymentForm.name,
        email: paymentForm.email,
        phone: paymentForm.phone,
        items: cart,
        amount: totalAmount
      });

      if (error) {
        setPaymentError('Failed to process payment. Please try again.');
        setPaymentProcessing(false);
      } else {
        // Send confirmation email
        await sendEmail(paymentForm.email, 'merchConfirmation', {
          name: paymentForm.name,
          itemCount: cart.length,
          amount: totalAmount
        });

        setPaymentSuccess(true);
        setCart([]);
        setPaymentForm({ name: '', email: '', phone: '', cardNumber: '', expiryDate: '', cvc: '' });
        setTimeout(() => setPaymentSuccess(false), 5000);
        setPaymentProcessing(false);
      }
    } catch (err) {
      setPaymentError('An error occurred. Please try again.');
      setPaymentProcessing(false);
    }
  };

  const handleDonation = async (e) => {
    e.preventDefault();

    if (!paymentForm.name || !paymentForm.email) {
      setPaymentError('Please fill in your name and email');
      return;
    }

    setPaymentProcessing(true);
    setPaymentError('');

    try {
      const amount = parseFloat(donationAmount);

      const { data, error } = await submitDonation({
        name: paymentForm.name,
        email: paymentForm.email,
        phone: paymentForm.phone,
        amount: amount,
        message: 'Donation to Jimmy Jam Community Outreach'
      });

      if (error) {
        setPaymentError('Failed to process donation. Please try again.');
        setPaymentProcessing(false);
      } else {
        // Send thank you email
        await sendEmail(paymentForm.email, 'donationThank', {
          name: paymentForm.name,
          amount: amount
        });

        setPaymentSuccess(true);
        setPaymentForm({ name: '', email: '', phone: '', cardNumber: '', expiryDate: '', cvc: '' });
        setDonationAmount('50');
        setTimeout(() => setPaymentSuccess(false), 5000);
        setPaymentProcessing(false);
      }
    } catch (err) {
      setPaymentError('An error occurred. Please try again.');
      setPaymentProcessing(false);
    }
  };

  if (showSplash) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-700 to-red-900 flex items-center justify-center">
        <div className="text-center">
          <img
            src="/jimmy-jam-logo.png"
            alt="Jimmy Jam Logo"
            className="w-32 h-32 mx-auto mb-6 animate-bounce drop-shadow-lg"
          />
          <h1 className="text-4xl font-bold text-white mb-2">Jimmy Jam</h1>
          <p className="text-yellow-300 mb-8">BBQ & Bourbon Event</p>
          <div className="w-64 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
            <div
              className="h-full bg-yellow-400 transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  const photos = [
    { id: 1, src: '🎤', label: 'Main Stage' },
    { id: 2, src: '🍖', label: 'BBQ Station' },
    { id: 3, src: '🥃', label: 'Bourbon Bar' },
    { id: 4, src: '👥', label: 'Crowd' },
    { id: 5, src: '🎸', label: 'Live Band' },
    { id: 6, src: '🌅', label: 'Sunset' },
    { id: 7, src: '🍽️', label: 'Food Court' },
    { id: 8, src: '🎉', label: 'Celebration' }
  ];

  const bbqSlamTeams = [
    { name: 'Smoke House Legends', score: 98, place: '🥇' },
    { name: 'Texas Heat', score: 96, place: '🥈' },
    { name: 'Bourbon & Brisket', score: 94, place: '🥉' }
  ];

  const sponsorsData = [
    { name: '95.9 The Ranch', tagline: 'Radio Partner', logo: '📻', description: 'Your home for country music and entertainment', website: 'theranch.com', instagram: 'theranch', facebook: 'theranch', image: '📻' },
    { name: 'Adobe Interiors', tagline: 'Furniture & Design', logo: '🛋️', description: 'Premium furniture and interior design solutions', website: 'adobeinteriors.com', instagram: 'adobe_interiors', facebook: 'adobeint', image: '🛋️' },
    { name: 'Andrews Distributing', tagline: 'Beverage Partner', logo: '🍺', description: 'Quality beverage distribution', website: 'andrewsdist.com', instagram: 'andrews_dist', facebook: 'andrews', image: '🍺' },
    { name: 'Ariat', tagline: 'Western Wear', logo: '👢', description: 'Premium Western apparel and boots', website: 'ariat.com', instagram: 'ariat', facebook: 'ariat', image: '👢' },
    { name: 'Blue Mint Thai', tagline: 'Restaurant & Bar', logo: '🥢', description: 'Authentic Thai cuisine in the heart of Fort Worth', website: 'bluemintthai.com', instagram: 'bluemintthai', facebook: 'bluemintthai', image: '🥢' },
    { name: 'Breeding Beef Cattle Co.', tagline: 'Premium Beef', logo: '🐄', description: 'Quality beef cattle breeding', website: 'breedingbeef.com', instagram: 'breeding_beef', facebook: 'breedingbeef', image: '🐄' },
    { name: 'Brims & Bolos', tagline: 'Western Fashion', logo: '🤠', description: 'Authentic Western hats and accessories', website: 'brimsbolos.com', instagram: 'brimsbolos', facebook: 'brimsbolos', image: '🤠' },
    { name: 'Buyers Barricades', tagline: 'Event Services', logo: '🚧', description: 'Professional event barriers and safety equipment', website: 'buyersbarr.com', instagram: 'buyers_barr', facebook: 'buyers', image: '🚧' }
  ];

  const artistsData = [
    { name: 'Whiskey Myers', genre: 'Outlaw Country', logo: '🎸', image: '🎸', bio: 'High-energy country rock band known for "Ballad of Whiskey Myers"', time: '8:00 PM', stage: 'Main Stage' },
    { name: 'Randy Rogers Band', genre: 'Country', logo: '🎤', image: '🎤', bio: 'Grammy-nominated Texas country legends', time: '7:00 PM', stage: 'Main Stage' },
    { name: 'Amanda Shires', genre: 'Country/Americana', logo: '🎻', image: '🎻', bio: 'Award-winning fiddle player and vocalist', time: '6:00 PM', stage: 'Main Stage' },
    { name: 'Jason Scott & the High Heat', genre: 'Country Rock', logo: '🔥', image: '🔥', bio: 'Local favorite with infectious energy', time: '5:00 PM', stage: 'Main Stage' },
    { name: 'Ellis Bullard', genre: 'Country', logo: '🌟', image: '🌟', bio: 'Rising country star with breakthrough hits', time: '4:00 PM', stage: 'Main Stage' },
    { name: 'The Broken Spokes', genre: 'Folk/Americana', logo: '🎵', image: '🎵', bio: 'Austin-based folk collective with rich harmonies', time: '3:00 PM', stage: 'Secondary Stage' },
    { name: 'Weldon Henson', genre: 'Country', logo: '🎹', image: '🎹', bio: 'Veteran country musician', time: '2:00 PM', stage: 'Secondary Stage' },
    { name: 'The Horseshoe Collective', genre: 'Country/Rock', logo: '🎶', image: '🎶', bio: 'Dynamic ensemble bringing fresh country sounds', time: '1:00 PM', stage: 'Secondary Stage' }
  ];

  const scheduleData = [
    { date: 'Oct 10', events: [
      { time: '11:00 AM', name: 'Gates Open', category: 'Info', location: 'Main Entrance' },
      { time: '12:00 PM', name: 'Food Service Begins', category: 'Food', location: 'Food Court' },
      { time: '1:00 PM', name: 'The Horseshoe Collective', category: 'Music', location: 'Secondary Stage' },
      { time: '2:00 PM', name: 'Weldon Henson', category: 'Music', location: 'Secondary Stage' }
    ]},
    { date: 'Oct 11', events: [
      { time: '10:00 AM', name: 'Bourbon Tasting', category: 'Experience', location: 'Bourbon Bar' },
      { time: '12:00 PM', name: 'BBQ Judging Begins', category: 'Competition', location: 'BBQ Arena' },
      { time: '3:00 PM', name: 'The Broken Spokes', category: 'Music', location: 'Main Stage' },
      { time: '5:00 PM', name: 'Jason Scott & High Heat', category: 'Music', location: 'Main Stage' }
    ]},
    { date: 'Oct 12', events: [
      { time: '11:00 AM', name: 'BBQ Team Finale', category: 'Competition', location: 'Main Arena' },
      { time: '2:00 PM', name: 'Amanda Shires', category: 'Music', location: 'Main Stage' },
      { time: '7:00 PM', name: 'Randy Rogers Band', category: 'Music', location: 'Main Stage' },
      { time: '9:00 PM', name: 'Whiskey Myers Headliner', category: 'Music', location: 'Main Stage' }
    ]}
  ];

  const bbqInstructionalVideos = [
    { id: 1, title: 'Mastering the Brisket', instructor: 'Pitmaster Joe', duration: '12:45', category: 'Smoking', thumbnail: '🔥' },
    { id: 2, title: 'Ribs 101: Perfect Bark & Tenderness', instructor: 'BBQ Chef Mike', duration: '8:30', category: 'Ribs', thumbnail: '🍖' },
    { id: 3, title: 'Competition BBQ Secrets', instructor: 'Champion Smoker', duration: '15:20', category: 'Competition', thumbnail: '🏆' },
    { id: 4, title: 'Sauce Making Fundamentals', instructor: 'Taste Master Lee', duration: '6:15', category: 'Sauces', thumbnail: '🍯' },
    { id: 5, title: 'Offset Smoker Maintenance', instructor: 'Hardware Pro', duration: '10:00', category: 'Equipment', thumbnail: '🔧' },
    { id: 6, title: 'Quick & Dirty BBQ', instructor: 'Fast Smoke', duration: '7:45', category: 'Quick Tips', thumbnail: '⏱️' }
  ];

  const tideChart = [
    { time: '6:00 AM', height: '2.1 ft', type: 'Low', emoji: '🌊' },
    { time: '12:00 PM', height: '5.3 ft', type: 'High', emoji: '🌊' },
    { time: '6:00 PM', height: '2.0 ft', type: 'Low', emoji: '🌊' },
    { time: '12:00 AM', height: '5.5 ft', type: 'High', emoji: '🌊' }
  ];

  const swagItems = [
    { name: 'Buckle Up 2026 Lineup Tee', price: '$45', icon: '👕' },
    { name: 'Desert Rider 2026 Lineup Tee', price: '$45', icon: '👕' },
    { name: 'Jimmy Jam Logo Baseball Hat', price: '$35', icon: '🧢' },
    { name: 'Indigo Sunset Festival Hoodie', price: '$65', icon: '🧥' },
    { name: 'BBQ Championship Apron', price: '$39.99', icon: '👕' },
    { name: 'Premium Bandana Set (3-pack)', price: '$24.99', icon: '🎀' },
    { name: 'Bourbon & BBQ Trucker Hat', price: '$42', icon: '🧢' },
    { name: 'Festival Lineup Zip Hoodie', price: '$75', icon: '🧥' },
    { name: 'Jimmy Jam Coffee Mug', price: '$16.99', icon: '☕' },
    { name: 'Premium BBQ Rub Collection', price: '$54.99', icon: '🧂' },
    { name: 'Stainless Steel Tumbler', price: '$28', icon: '🥤' },
    { name: 'Festival Bourbon Glass Set', price: '$34.99', icon: '🥃' }
  ];

  // Render different pages based on activeNav
  const renderPage = () => {
    switch(activeNav) {
      case 'home':
        return (
          <div className="pb-24">
            <div className="bg-gradient-to-b from-red-600 to-red-700 text-white p-6 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔥</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">Jimmy Jam</h2>
              <p className="text-red-100">BBQ & Bourbon</p>
            </div>

            <div className="p-4 grid grid-cols-3 gap-3">
              <button onClick={() => setActiveNav('schedule')} className="bg-white border-2 border-red-700 rounded-lg p-4 text-center hover:bg-red-50">
                <span className="text-3xl block mb-2">📅</span>
                <span className="text-xs font-bold text-red-700">SCHEDULE</span>
              </button>
              <button onClick={() => setActiveNav('tickets')} className="bg-white border-2 border-red-700 rounded-lg p-4 text-center hover:bg-red-50">
                <span className="text-3xl block mb-2">🎫</span>
                <span className="text-xs font-bold text-red-700">TICKETS</span>
              </button>
              <button onClick={() => setActiveNav('photos')} className="bg-white border-2 border-red-700 rounded-lg p-4 text-center hover:bg-red-50">
                <span className="text-3xl block mb-2">📸</span>
                <span className="text-xs font-bold text-red-700">PHOTOS</span>
              </button>
              <button onClick={() => setActiveNav('bbq')} className="bg-white border-2 border-red-700 rounded-lg p-4 text-center hover:bg-red-50">
                <span className="text-3xl block mb-2">🍖</span>
                <span className="text-xs font-bold text-red-700">BBQ SLAM</span>
              </button>
              <button onClick={() => setActiveNav('sponsors')} className="bg-white border-2 border-red-700 rounded-lg p-4 text-center hover:bg-red-50">
                <span className="text-3xl block mb-2">🤝</span>
                <span className="text-xs font-bold text-red-700">SPONSORS</span>
              </button>
              <button onClick={() => setActiveNav('merch')} className="bg-white border-2 border-red-700 rounded-lg p-4 text-center hover:bg-red-50">
                <span className="text-3xl block mb-2">👕</span>
                <span className="text-xs font-bold text-red-700">MERCH</span>
              </button>
              <button onClick={() => setActiveNav('bourbon')} className="bg-white border-2 border-red-700 rounded-lg p-4 text-center hover:bg-red-50">
                <span className="text-3xl block mb-2">🥃</span>
                <span className="text-xs font-bold text-red-700">BOURBON</span>
              </button>
              <button onClick={() => setActiveNav('weather')} className="bg-white border-2 border-red-700 rounded-lg p-4 text-center hover:bg-red-50">
                <span className="text-3xl block mb-2">🌤️</span>
                <span className="text-xs font-bold text-red-700">WEATHER</span>
              </button>
              <button onClick={() => setActiveNav('testimonials')} className="bg-white border-2 border-red-700 rounded-lg p-4 text-center hover:bg-red-50">
                <span className="text-3xl block mb-2">💬</span>
                <span className="text-xs font-bold text-red-700">STORIES</span>
              </button>
            </div>

            {/* Social Media Promotion */}
            <div className="px-4 mb-4">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-4">
                <h3 className="font-bold text-red-700 text-center mb-3">Follow Us On Social Media</h3>
                <div className="flex justify-center gap-3 flex-wrap">
                  <a href="https://facebook.com/jimmyjamoutreach" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition duration-200" title="Facebook">
                    <span className="text-lg">f</span>
                  </a>
                  <a href="https://instagram.com/jimmyjamoutreach" target="_blank" rel="noopener noreferrer" className="bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-full transition duration-200" title="Instagram">
                    <span className="text-lg">📷</span>
                  </a>
                  <a href="https://twitter.com/jimmyjamoutreach" target="_blank" rel="noopener noreferrer" className="bg-sky-400 hover:bg-sky-500 text-white p-3 rounded-full transition duration-200" title="Twitter/X">
                    <span className="text-lg">𝕏</span>
                  </a>
                  <a href="https://youtube.com/jimmyjamoutreach" target="_blank" rel="noopener noreferrer" className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition duration-200" title="YouTube">
                    <span className="text-lg">▶️</span>
                  </a>
                  <a href="https://tiktok.com/@jimmyjamoutreach" target="_blank" rel="noopener noreferrer" className="bg-black hover:bg-gray-800 text-white p-3 rounded-full transition duration-200" title="TikTok">
                    <span className="text-lg">♫</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="p-4">
              <button
                onClick={() => setActiveNav('assistance')}
                className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
              >
                ❤️ APPLY FOR HELP
              </button>
            </div>
          </div>
        );

      case 'bbq':
        return (
          <div className="pb-24">
            <div className="bg-red-700 text-white p-4 flex items-center gap-3">
              <button onClick={() => setActiveNav('home')} className="p-1"><ChevronLeft size={24} /></button>
              <h2 className="flex-1 text-lg font-bold">BBQ SLAM 🍖</h2>
            </div>

            <div className="border-b border-gray-300 flex">
              <button
                onClick={() => setActiveSlamTab('overview')}
                className={`flex-1 py-3 font-bold text-sm ${activeSlamTab === 'overview' ? 'border-b-4 border-red-700 text-red-700' : 'text-gray-600'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveSlamTab('leaderboard')}
                className={`flex-1 py-3 font-bold text-sm ${activeSlamTab === 'leaderboard' ? 'border-b-4 border-red-700 text-red-700' : 'text-gray-600'}`}
              >
                Leaderboard
              </button>
              <button
                onClick={() => setActiveSlamTab('register')}
                className={`flex-1 py-3 font-bold text-sm ${activeSlamTab === 'register' ? 'border-b-4 border-red-700 text-red-700' : 'text-gray-600'}`}
              >
                Register
              </button>
            </div>

            {activeSlamTab === 'overview' && (
              <div className="p-4 space-y-4">
                <div className="bg-white border-2 border-red-700 rounded-lg p-4">
                  <h3 className="font-bold text-red-700 mb-2">🏆 Competition Details</h3>
                  <p className="text-sm text-gray-600 mb-3">Join the greatest BBQ competition in Texas! Teams compete across multiple categories for cash prizes and bragging rights.</p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Dates:</strong> October 10-12, 2026</p>
                    <p><strong>Categories:</strong> Brisket, Ribs, Pulled Pork, Chicken</p>
                    <p><strong>Prize Pool:</strong> $25,000+</p>
                  </div>
                </div>
              </div>
            )}

            {activeSlamTab === 'leaderboard' && (
              <div className="p-4 space-y-3">
                {bbqSlamTeams.map((team, idx) => (
                  <div key={idx} className="bg-white border-2 border-gray-300 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-lg">{team.place} {team.name}</div>
                      <div className="text-sm text-gray-600">Score: {team.score}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSlamTab === 'register' && (
              <div className="p-4 space-y-4">
                <div className="space-y-4">
                  <div className="border-2 border-red-700 rounded-lg p-4">
                    <h3 className="font-bold text-red-700 mb-3">🏅 Register Your BBQ Team</h3>
                    <input
                      type="text"
                      placeholder="Team Name"
                      value={slamTeamForm.teamName}
                      onChange={(e) => setSlamTeamForm({...slamTeamForm, teamName: e.target.value})}
                      className="w-full border border-gray-300 rounded p-2 mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Contact Name"
                      value={slamTeamForm.contactName}
                      onChange={(e) => setSlamTeamForm({...slamTeamForm, contactName: e.target.value})}
                      className="w-full border border-gray-300 rounded p-2 mb-2"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={slamTeamForm.email}
                      onChange={(e) => setSlamTeamForm({...slamTeamForm, email: e.target.value})}
                      className="w-full border border-gray-300 rounded p-2 mb-2"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={slamTeamForm.phone}
                      onChange={(e) => setSlamTeamForm({...slamTeamForm, phone: e.target.value})}
                      className="w-full border border-gray-300 rounded p-2 mb-2"
                    />
                    <input
                      type="number"
                      placeholder="Number of Team Members"
                      value={slamTeamForm.members}
                      onChange={(e) => setSlamTeamForm({...slamTeamForm, members: e.target.value})}
                      className="w-full border border-gray-300 rounded p-2 mb-2"
                    />
                    <select
                      value={slamTeamForm.bbqStyle}
                      onChange={(e) => setSlamTeamForm({...slamTeamForm, bbqStyle: e.target.value})}
                      className="w-full border border-gray-300 rounded p-2 mb-2"
                    >
                      <option value="">Select BBQ Style</option>
                      <option value="texas">Texas Style</option>
                      <option value="carolina">Carolina Style</option>
                      <option value="kansas">Kansas Style</option>
                      <option value="memphis">Memphis Style</option>
                    </select>
                    <select
                      value={slamTeamForm.experience}
                      onChange={(e) => setSlamTeamForm({...slamTeamForm, experience: e.target.value})}
                      className="w-full border border-gray-300 rounded p-2 mb-3"
                    >
                      <option value="">Experience Level</option>
                      <option value="amateur">Amateur</option>
                      <option value="semi-pro">Semi-Pro</option>
                      <option value="pro">Professional</option>
                    </select>
                    {submitError.team && <p className="text-red-600 text-sm mb-2">{submitError.team}</p>}
                    {submitSuccess.team && <p className="text-green-600 text-sm mb-2">✓ Team registered successfully!</p>}
                    <button
                      onClick={handleBBQTeamSubmit}
                      disabled={submitting.team}
                      className="w-full bg-red-700 hover:bg-red-800 disabled:bg-gray-400 text-white font-bold py-2 rounded"
                    >
                      {submitting.team ? '⏳ Submitting...' : (tideSubmitted.team ? '✓ Team Registered!' : 'Register Team')}
                    </button>
                  </div>

                  <div className="border-2 border-orange-600 rounded-lg p-4">
                    <h3 className="font-bold text-orange-600 mb-3">🎪 Register Your Vendor</h3>
                    <input
                      type="text"
                      placeholder="Business Name"
                      value={vendorForm.businessName}
                      onChange={(e) => setVendorForm({...vendorForm, businessName: e.target.value})}
                      className="w-full border border-gray-300 rounded p-2 mb-2"
                    />
                    <select
                      value={vendorForm.category}
                      onChange={(e) => setVendorForm({...vendorForm, category: e.target.value})}
                      className="w-full border border-gray-300 rounded p-2 mb-2"
                    >
                      <option value="">Select Category</option>
                      <option value="food">Food</option>
                      <option value="beverage">Beverage</option>
                      <option value="merchandise">Merchandise</option>
                      <option value="services">Services</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Contact Name"
                      value={vendorForm.contactName}
                      onChange={(e) => setVendorForm({...vendorForm, contactName: e.target.value})}
                      className="w-full border border-gray-300 rounded p-2 mb-2"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={vendorForm.email}
                      onChange={(e) => setVendorForm({...vendorForm, email: e.target.value})}
                      className="w-full border border-gray-300 rounded p-2 mb-2"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={vendorForm.phone}
                      onChange={(e) => setVendorForm({...vendorForm, phone: e.target.value})}
                      className="w-full border border-gray-300 rounded p-2 mb-2"
                    />
                    <textarea
                      placeholder="Business Description"
                      value={vendorForm.description}
                      onChange={(e) => setVendorForm({...vendorForm, description: e.target.value})}
                      className="w-full border border-gray-300 rounded p-2 mb-2"
                      rows="3"
                    />
                    {submitError.vendor && <p className="text-red-600 text-sm mb-2">{submitError.vendor}</p>}
                    {submitSuccess.vendor && <p className="text-green-600 text-sm mb-2">✓ Vendor registered successfully!</p>}
                    <button
                      onClick={handleVendorSubmit}
                      disabled={submitting.vendor}
                      className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-bold py-2 rounded"
                    >
                      {submitting.vendor ? '⏳ Submitting...' : (vendorSubmitted.submitted ? '✓ Vendor Registered!' : 'Register as Vendor')}
                    </button>
                  </div>

                  <div className="border-2 border-blue-600 rounded-lg p-4">
                    <h3 className="font-bold text-blue-600 mb-3">🚗 Car Show Entry</h3>
                    <input
                      type="text"
                      placeholder="Owner Name"
                      value={carShowForm.ownerName}
                      onChange={(e) => setCarShowForm({...carShowForm, ownerName: e.target.value})}
                      className="w-full border border-gray-300 rounded p-2 mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Car Make"
                      value={carShowForm.carMake}
                      onChange={(e) => setCarShowForm({...carShowForm, carMake: e.target.value})}
                      className="w-full border border-gray-300 rounded p-2 mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Car Model"
                      value={carShowForm.carModel}
                      onChange={(e) => setCarShowForm({...carShowForm, carModel: e.target.value})}
                      className="w-full border border-gray-300 rounded p-2 mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Car Year"
                      value={carShowForm.carYear}
                      onChange={(e) => setCarShowForm({...carShowForm, carYear: e.target.value})}
                      className="w-full border border-gray-300 rounded p-2 mb-2"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={carShowForm.email}
                      onChange={(e) => setCarShowForm({...carShowForm, email: e.target.value})}
                      className="w-full border border-gray-300 rounded p-2 mb-2"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={carShowForm.phone}
                      onChange={(e) => setCarShowForm({...carShowForm, phone: e.target.value})}
                      className="w-full border border-gray-300 rounded p-2 mb-2"
                    />
                    <select
                      value={carShowForm.category}
                      onChange={(e) => setCarShowForm({...carShowForm, category: e.target.value})}
                      className="w-full border border-gray-300 rounded p-2 mb-3"
                    >
                      <option value="">Select Category</option>
                      <option value="classic">Classic Cars</option>
                      <option value="custom">Custom/Hot Rods</option>
                      <option value="trucks">Trucks</option>
                      <option value="exotic">Exotic/Sports</option>
                      <option value="motorcycle">Motorcycles</option>
                    </select>
                    {submitError.car && <p className="text-red-600 text-sm mb-2">{submitError.car}</p>}
                    {submitSuccess.car && <p className="text-green-600 text-sm mb-2">✓ Car registered successfully!</p>}
                    <button
                      onClick={handleCarShowSubmit}
                      disabled={submitting.car}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 rounded"
                    >
                      {submitting.car ? '⏳ Submitting...' : (carSubmitted.submitted ? '✓ Car Registered!' : 'Register Car')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'videos':
        return (
          <div className="pb-24">
            <div className="bg-red-700 text-white p-4 flex items-center gap-3">
              <button onClick={() => setActiveNav('home')} className="p-1"><ChevronLeft size={24} /></button>
              <h2 className="flex-1 text-lg font-bold">Video Library 🎥</h2>
            </div>

            <div className="border-b border-gray-300 flex overflow-x-auto">
              <button
                onClick={() => setActiveVideoTab('live')}
                className={`flex-1 py-3 font-bold text-sm whitespace-nowrap ${activeVideoTab === 'live' ? 'border-b-4 border-red-700 text-red-700' : 'text-gray-600'}`}
              >
                🔴 Live
              </button>
              <button
                onClick={() => setActiveVideoTab('featured')}
                className={`flex-1 py-3 font-bold text-sm whitespace-nowrap ${activeVideoTab === 'featured' ? 'border-b-4 border-red-700 text-red-700' : 'text-gray-600'}`}
              >
                Featured
              </button>
              <button
                onClick={() => setActiveVideoTab('instructional')}
                className={`flex-1 py-3 font-bold text-sm whitespace-nowrap ${activeVideoTab === 'instructional' ? 'border-b-4 border-red-700 text-red-700' : 'text-gray-600'}`}
              >
                Tutorials
              </button>
              <button
                onClick={() => setActiveVideoTab('highlights')}
                className={`flex-1 py-3 font-bold text-sm whitespace-nowrap ${activeVideoTab === 'highlights' ? 'border-b-4 border-red-700 text-red-700' : 'text-gray-600'}`}
              >
                Highlights
              </button>
            </div>

            <div className="p-4 space-y-4">
              {activeVideoTab === 'live' && (
                <>
                  <div className="bg-white border-2 border-red-700 rounded-lg overflow-hidden mb-4">
                    <div className="bg-gradient-to-r from-red-700 to-red-900 text-white p-3 flex items-center gap-2">
                      <span className="text-lg">🔴 LIVE</span>
                      <span className="text-sm font-bold">Watch Jimmy Jam Now</span>
                    </div>
                  </div>

                  {/* YouTube Live Embed */}
                  <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
                    <div className="bg-gray-900 aspect-video flex flex-col items-center justify-center">
                      <div className="text-6xl mb-3">▶️</div>
                      <p className="text-white text-sm mb-3 px-4 text-center">YouTube Live Stream</p>
                      <a
                        href="https://youtube.com/jimmyjamoutreach"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded text-sm"
                      >
                        Watch on YouTube
                      </a>
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-sm mb-1">🎬 YouTube Live</h3>
                      <p className="text-xs text-gray-600">Subscribe for live event coverage and behind-the-scenes content</p>
                    </div>
                  </div>

                  {/* Twitch Live Embed */}
                  <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
                    <div className="bg-gray-900 aspect-video flex flex-col items-center justify-center">
                      <div className="text-6xl mb-3">💜</div>
                      <p className="text-white text-sm mb-3 px-4 text-center">Twitch Live Stream</p>
                      <a
                        href="https://twitch.tv/jimmyjamoutreach"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-sm"
                      >
                        Watch on Twitch
                      </a>
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-sm mb-1">🎮 Twitch Live</h3>
                      <p className="text-xs text-gray-600">Join the community chat and interactive coverage</p>
                    </div>
                  </div>

                  {/* Offline Notice */}
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <span className="font-bold">📡 Live streams are available during events</span><br/>
                      <span className="text-xs text-yellow-700 mt-1 block">Check back during Jimmy Jam events for live coverage. Subscribe to stay updated on when we go live!</span>
                    </p>
                  </div>
                </>
              )}

              {activeVideoTab === 'featured' && (
                <>
                  <div className="bg-white border-2 border-red-700 rounded-lg overflow-hidden">
                    <div className="bg-gray-800 text-white h-40 flex items-center justify-center text-4xl">▶️</div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">Live from 2026 Event</h3>
                      <p className="text-sm text-gray-600">Experience the full event livestream</p>
                      <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-red-700 font-bold mt-2 block">Watch Now →</a>
                    </div>
                  </div>
                </>
              )}

              {activeVideoTab === 'instructional' && (
                bbqInstructionalVideos.map((video) => (
                  <div key={video.id} className="bg-white border-2 border-gray-300 rounded-lg p-4">
                    <div className="flex gap-3">
                      <div className="text-4xl">{video.thumbnail}</div>
                      <div className="flex-1">
                        <h4 className="font-bold">{video.title}</h4>
                        <p className="text-sm text-gray-600">{video.instructor}</p>
                        <p className="text-sm text-gray-500">{video.duration} • {video.category}</p>
                        <button className="text-red-700 font-bold text-sm mt-2">▶ Watch Video</button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {activeVideoTab === 'highlights' && (
                <div className="text-center py-8">
                  <p className="text-gray-600">Check back soon for 2026 event highlights!</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'tide':
        return (
          <div className="pb-24">
            <div className="bg-blue-600 text-white p-4 flex items-center gap-3">
              <button onClick={() => setActiveNav('home')} className="p-1"><ChevronLeft size={24} /></button>
              <h2 className="flex-1 text-lg font-bold">Tide Chart 🌊</h2>
            </div>

            <div className="p-4">
              <div className="bg-white border-2 border-blue-600 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-4">Fort Worth Area - October 12, 2026</p>
                <div className="space-y-3">
                  {tideChart.map((tide, idx) => (
                    <div key={idx} className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-b-0">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{tide.emoji}</span>
                        <div>
                          <div className="font-bold">{tide.time}</div>
                          <div className="text-sm text-gray-600">{tide.type}</div>
                        </div>
                      </div>
                      <div className="font-bold text-blue-600">{tide.height}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <h3 className="font-bold mb-2">📍 Best Fishing Times</h3>
                <p className="text-sm text-gray-600 mb-3">Peak fishing occurs 1-2 hours before high tide and during slack water transitions.</p>
                <p className="text-sm font-bold text-blue-700">🎣 Morning Peak: 10:30 AM - 1:30 PM</p>
                <p className="text-sm font-bold text-blue-700">🎣 Evening Peak: 4:30 PM - 7:30 PM</p>
              </div>
            </div>
          </div>
        );

      case 'weather':
        return (
          <div className="pb-24">
            <div className="bg-blue-600 text-white p-4 flex items-center gap-3">
              <button onClick={() => setActiveNav('home')} className="p-1"><ChevronLeft size={24} /></button>
              <h2 className="flex-1 text-lg font-bold">Weather</h2>
            </div>

            <div className="border-b border-gray-300 flex">
              <button
                onClick={() => setActiveTab('forecast')}
                className={`flex-1 py-3 font-bold text-sm ${activeTab === 'forecast' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                7-Day
              </button>
              <button
                onClick={() => setActiveTab('hourly')}
                className={`flex-1 py-3 font-bold text-sm ${activeTab === 'hourly' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                Hourly
              </button>
            </div>

            {activeTab === 'forecast' && (
              <div className="p-4">
                {weatherData.loading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Loading weather...</p>
                  </div>
                ) : weatherData.error ? (
                  <div className="text-center py-8">
                    <p className="text-red-600">{weatherData.error}</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-lg p-6 mb-4">
                      <div className="text-5xl font-bold mb-2">{weatherData.current.temp}°F</div>
                      <p className="text-blue-100 mb-4">{weatherData.current.condition}</p>
                      <p className="text-sm text-blue-100">Fort Worth, TX</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-white border border-gray-300 rounded p-2 text-center">
                        <div className="text-sm text-gray-600">Humidity</div>
                        <div className="font-bold">{weatherData.current.humidity}%</div>
                      </div>
                      <div className="bg-white border border-gray-300 rounded p-2 text-center">
                        <div className="text-sm text-gray-600">Wind</div>
                        <div className="font-bold">{weatherData.current.windSpeed} mph</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {weatherData.forecast.map((day, idx) => (
                        <div key={idx} className="bg-white border border-gray-300 rounded p-3 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="w-8 text-center">{day.emoji}</span>
                            <span className="font-bold">{day.day}</span>
                          </div>
                          <div className="text-sm text-gray-600">{day.high}°/{day.low}° • {day.chance}%</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'hourly' && (
              <div className="p-4">
                {weatherData.loading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Loading hourly forecast...</p>
                  </div>
                ) : weatherData.error ? (
                  <div className="text-center py-8">
                    <p className="text-red-600">{weatherData.error}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg mb-3">Next 12 Hours</h3>
                    {weatherData.hourly.map((hour, idx) => (
                      <div key={idx} className="bg-white border border-gray-300 rounded p-3 flex justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{hour.emoji}</span>
                          <span className="font-bold">{hour.time}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{hour.temp}°</div>
                          <div className="text-sm text-gray-600">{hour.humidity}% humidity</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        );

      case 'maps':
        return (
          <div className="pb-24">
            <div className="bg-blue-600 text-white p-4 flex items-center gap-3">
              <button onClick={() => setActiveNav('home')} className="p-1"><ChevronLeft size={24} /></button>
              <h2 className="flex-1 text-lg font-bold">Maps & Info</h2>
            </div>

            <div className="border-b border-gray-300 flex">
              <button
                onClick={() => setActiveTab('gps')}
                className={`flex-1 py-3 font-bold text-sm ${activeTab === 'gps' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                📍 GPS Map
              </button>
              <button
                onClick={() => setActiveTab('venue')}
                className={`flex-1 py-3 font-bold text-sm ${activeTab === 'venue' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                🗺️ Venue
              </button>
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 py-3 font-bold text-sm ${activeTab === 'info' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                ℹ️ Info
              </button>
            </div>

            {activeTab === 'gps' && (
              <div>
                <div
                  ref={gpsMapRef}
                  className="w-full h-96 rounded-lg mb-4"
                  style={{ position: 'relative' }}
                />
                <div className="p-4">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded mb-4">
                    🧭 Get Directions
                  </button>
                  <div className="bg-white border-2 border-blue-600 rounded-lg p-4">
                    <h3 className="font-bold mb-2">📍 Jimmy Jam Event</h3>
                    <p className="text-sm text-gray-600 mb-3">Fort Worth, TX 76102</p>
                    <p className="text-xs text-gray-600 mb-3">Coordinates: 32.7555°N, 97.3308°W</p>
                    <button className="text-blue-600 font-bold text-sm">📞 (817) 555-HELP</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'venue' && (
              <div className="p-4">
                <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center mb-4">
                  <span className="text-6xl">🏛️</span>
                </div>
                <div className="space-y-3">
                  <div className="bg-white border-2 border-gray-300 rounded-lg p-3">
                    <h4 className="font-bold text-red-700 mb-2">🎤 Main Stage</h4>
                    <p className="text-xs text-gray-600">North end of venue</p>
                  </div>
                  <div className="bg-white border-2 border-gray-300 rounded-lg p-3">
                    <h4 className="font-bold text-orange-600 mb-2">🍖 BBQ Area</h4>
                    <p className="text-xs text-gray-600">Central pavilion</p>
                  </div>
                  <div className="bg-white border-2 border-gray-300 rounded-lg p-3">
                    <h4 className="font-bold text-purple-600 mb-2">🥃 Bourbon Bar</h4>
                    <p className="text-xs text-gray-600">South pavilion</p>
                  </div>
                  <div className="bg-white border-2 border-gray-300 rounded-lg p-3">
                    <h4 className="font-bold text-green-600 mb-2">🚻 Restrooms</h4>
                    <p className="text-xs text-gray-600">Multiple locations</p>
                  </div>
                  <div className="bg-white border-2 border-gray-300 rounded-lg p-3">
                    <h4 className="font-bold text-blue-600 mb-2">🚑 First Aid</h4>
                    <p className="text-xs text-gray-600">Near main entrance</p>
                  </div>
                  <div className="bg-white border-2 border-gray-300 rounded-lg p-3">
                    <h4 className="font-bold text-gray-700 mb-2">🅿️ Parking</h4>
                    <p className="text-xs text-gray-600">Lots A, B, C</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'info' && (
              <div className="p-4 space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full border-2 border-gray-300 rounded p-3 pl-10"
                  />
                  <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-3">
                  <h3 className="font-bold mb-2">📢 General</h3>
                  <p className="text-sm text-gray-700 mb-2">Welcome to the 2026 Jimmy Jam BBQ & Bourbon Festival!</p>
                  <p className="text-xs text-gray-600">Hours: 11 AM - 11 PM daily</p>
                </div>

                <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
                  <h3 className="font-bold mb-2">❓ FAQs</h3>
                  <p className="text-sm text-gray-700">Can I bring my own food? No, all food must be purchased from vendors.</p>
                </div>

                <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
                  <h3 className="font-bold mb-2">🚗 Parking & Policies</h3>
                  <p className="text-sm text-gray-700">Parking is FREE. Shuttle service available.</p>
                </div>

                <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
                  <h3 className="font-bold mb-2">♿ Services for People with Disabilities</h3>
                  <p className="text-sm text-gray-700">Accessible parking • Accessible restrooms • ADA seating areas</p>
                </div>

                <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
                  <h3 className="font-bold mb-2">♻️ Sustainability</h3>
                  <p className="text-sm text-gray-700">Please recycle! Bins located throughout the venue.</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'artists':
        if (selectedArtist) {
          return (
            <div className="pb-24">
              <div className="bg-red-700 text-white p-4 flex items-center gap-3">
                <button onClick={() => setSelectedArtist(null)} className="p-1"><ChevronLeft size={24} /></button>
                <h2 className="flex-1 text-lg font-bold">{selectedArtist.name}</h2>
              </div>
              <div className="p-4 space-y-4">
                <div className="text-8xl text-center mb-4">{selectedArtist.image}</div>
                <div className="bg-white border-2 border-red-700 rounded-lg p-4">
                  <p className="text-gray-700 mb-4">{selectedArtist.bio}</p>
                  <div className="space-y-2 text-sm">
                    <p><strong>🎵 Genre:</strong> {selectedArtist.genre}</p>
                    <p><strong>⏰ Performance:</strong> {selectedArtist.time}</p>
                    <p><strong>🎪 Stage:</strong> {selectedArtist.stage}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        return (
          <div className="pb-24">
            <div className="bg-red-700 text-white p-4 flex items-center gap-3">
              <button onClick={() => setActiveNav('home')} className="p-1"><ChevronLeft size={24} /></button>
              <h2 className="flex-1 text-lg font-bold">ARTISTS 🎤</h2>
            </div>

            <div className="p-4">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search artists..."
                  value={searchArtists}
                  onChange={(e) => setSearchArtists(e.target.value)}
                  className="w-full border-2 border-red-700 rounded p-3 pl-10"
                />
                <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
              </div>

              <div className="space-y-3">
                {artistsData.filter(artist =>
                  artist.name.toLowerCase().includes(searchArtists.toLowerCase()) ||
                  artist.genre.toLowerCase().includes(searchArtists.toLowerCase())
                ).map((artist, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedArtist(artist)}
                    className="w-full text-left bg-white border-2 border-gray-300 rounded-lg p-4 hover:border-red-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{artist.image}</span>
                      <div>
                        <h3 className="font-bold">{artist.name}</h3>
                        <p className="text-sm text-gray-600">{artist.genre}</p>
                      </div>
                      <ChevronRight className="ml-auto text-gray-400" size={20} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'sponsors':
        if (selectedSponsor) {
          return (
            <div className="pb-24">
              <div className="bg-red-700 text-white p-4 flex items-center gap-3">
                <button onClick={() => setSelectedSponsor(null)} className="p-1"><ChevronLeft size={24} /></button>
                <h2 className="flex-1 text-lg font-bold">{selectedSponsor.name}</h2>
              </div>
              <div className="p-4 space-y-4">
                <div className="text-8xl text-center mb-4">{selectedSponsor.image}</div>
                <div className="bg-white border-2 border-red-700 rounded-lg p-4">
                  <p className="text-red-700 font-bold mb-2">{selectedSponsor.tagline}</p>
                  <p className="text-gray-700 mb-4">{selectedSponsor.description}</p>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm"><strong>🌐 Website:</strong> {selectedSponsor.website}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => window.open(selectedSponsor.facebookUrl, '_blank', 'rel=noopener noreferrer')} className="flex-1 bg-blue-600 text-white p-2 rounded text-sm font-bold">📘 Facebook</button>
                    <button onClick={() => window.open(selectedSponsor.instagramUrl, '_blank', 'rel=noopener noreferrer')} className="flex-1 bg-pink-600 text-white p-2 rounded text-sm font-bold">📷 Instagram</button>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        return (
          <div className="pb-24">
            <div className="bg-red-700 text-white p-4 flex items-center gap-3">
              <button onClick={() => setActiveNav('home')} className="p-1"><ChevronLeft size={24} /></button>
              <h2 className="flex-1 text-lg font-bold">SPONSORS 🤝</h2>
            </div>

            <div className="p-4">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search sponsors..."
                  value={searchSponsors}
                  onChange={(e) => setSearchSponsors(e.target.value)}
                  className="w-full border-2 border-red-700 rounded p-3 pl-10"
                />
                <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
              </div>

              <div className="space-y-3">
                {sponsorsData.filter(sponsor =>
                  sponsor.name.toLowerCase().includes(searchSponsors.toLowerCase()) ||
                  sponsor.tagline.toLowerCase().includes(searchSponsors.toLowerCase()) ||
                  sponsor.description.toLowerCase().includes(searchSponsors.toLowerCase())
                ).map((sponsor, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSponsor(sponsor)}
                    className="w-full text-left bg-white border-2 border-gray-300 rounded-lg p-4 hover:border-red-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{sponsor.image}</span>
                      <div>
                        <h3 className="font-bold">{sponsor.name}</h3>
                        <p className="text-sm text-gray-600">{sponsor.tagline}</p>
                      </div>
                      <ChevronRight className="ml-auto text-gray-400" size={20} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'schedule':
        return (
          <div className="pb-24">
            <div className="bg-red-700 text-white p-4 flex items-center gap-3">
              <button onClick={() => setActiveNav('home')} className="p-1"><ChevronLeft size={24} /></button>
              <h2 className="flex-1 text-lg font-bold">SCHEDULE 📅</h2>
            </div>

            <div className="p-4 space-y-3">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchSchedule}
                  onChange={(e) => setSearchSchedule(e.target.value)}
                  className="w-full border-2 border-red-700 rounded p-3 pl-10"
                />
                <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2">
                {['Oct 10', 'Oct 11', 'Oct 12'].map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`px-4 py-2 rounded font-bold whitespace-nowrap ${selectedDate === date ? 'bg-red-700 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    {date}
                  </button>
                ))}
              </div>

              {scheduleData.find(d => d.date === selectedDate)?.events.filter(event =>
                event.name.toLowerCase().includes(searchSchedule.toLowerCase()) ||
                event.category.toLowerCase().includes(searchSchedule.toLowerCase()) ||
                event.location.toLowerCase().includes(searchSchedule.toLowerCase())
              ).map((event, idx) => (
                <div key={idx} className="bg-white border-2 border-gray-300 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{event.name}</h3>
                      <p className="text-sm text-gray-600">📍 {event.location}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-red-700">⏰ {event.time}</span>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">{event.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'photos':
        return (
          <div className="pb-24">
            <div className="bg-red-700 text-white p-4 flex items-center gap-3">
              <button onClick={() => setActiveNav('home')} className="p-1"><ChevronLeft size={24} /></button>
              <h2 className="flex-1 text-lg font-bold">PHOTOS 📸</h2>
            </div>

            <div className="p-4">
              {/* Photo Upload Section */}
              <div className="bg-white border-2 border-red-700 rounded-lg p-4 mb-4">
                <label className="block mb-2">
                  <div className="flex items-center gap-2 mb-2 font-bold text-red-700">
                    <Upload size={20} />
                    Upload Photo
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={photoLoading}
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-red-700 file:text-white file:font-bold hover:file:bg-red-800 disabled:opacity-50"
                  />
                </label>
                {photoLoading && <p className="text-sm text-blue-600 font-bold">⏳ Uploading...</p>}
                {photoError && <p className="text-sm text-red-600 font-bold">❌ {photoError}</p>}
                {submitSuccess.photo && <p className="text-sm text-green-600 font-bold">✅ Photo uploaded successfully!</p>}
              </div>

              {/* Photo Gallery */}
              {photoLoading && uploadedPhotos.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">⏳ Loading photos...</p>
                </div>
              ) : uploadedPhotos.length === 0 ? (
                <div className="text-center py-8 bg-gray-100 rounded-lg">
                  <p className="text-gray-600">📸 No photos uploaded yet. Be the first to share!</p>
                </div>
              ) : (
                <>
                  {(() => {
                    // Bounds check: reset index if it exceeds array length
                    if (currentPhotoIndex >= uploadedPhotos.length) {
                      setCurrentPhotoIndex(0);
                    }
                    return null;
                  })()}
                  {/* Main Photo Display */}
                  <div className="bg-white border-2 border-red-700 rounded-lg overflow-hidden mb-4">
                    <img
                      src={uploadedPhotos[currentPhotoIndex]?.url}
                      alt={uploadedPhotos[currentPhotoIndex]?.name}
                      className="w-full aspect-square object-cover bg-gray-200"
                    />
                    <div className="p-4">
                      <p className="font-bold mb-2 truncate">{uploadedPhotos[currentPhotoIndex]?.name}</p>
                      <p className="text-xs text-gray-600 mb-3">{new Date(uploadedPhotos[currentPhotoIndex]?.created_at).toLocaleDateString()}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrentPhotoIndex(prev => prev === 0 ? uploadedPhotos.length - 1 : prev - 1)}
                          className="flex-1 bg-gray-200 hover:bg-gray-300 p-2 rounded font-bold"
                        >
                          ← Prev
                        </button>
                        <button
                          onClick={() => handlePhotoDelete(uploadedPhotos[currentPhotoIndex]?.path)}
                          disabled={photoLoading}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white p-2 rounded font-bold disabled:opacity-50"
                        >
                          🗑️ Delete
                        </button>
                        <button
                          onClick={() => setCurrentPhotoIndex(prev => prev === uploadedPhotos.length - 1 ? 0 : prev + 1)}
                          className="flex-1 bg-red-700 hover:bg-red-800 text-white p-2 rounded font-bold"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Photo Thumbnails */}
                  <div className="grid grid-cols-4 gap-2">
                    {uploadedPhotos.map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPhotoIndex(idx)}
                        className={`aspect-square rounded overflow-hidden border-4 ${currentPhotoIndex === idx ? 'border-red-700' : 'border-gray-300'}`}
                      >
                        <img
                          src={photo.url}
                          alt={photo.name}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case 'tickets':
        return (
          <div className="pb-24">
            <div className="bg-red-700 text-white p-4 flex items-center gap-3">
              <button onClick={() => setActiveNav('home')} className="p-1"><ChevronLeft size={24} /></button>
              <h2 className="flex-1 text-lg font-bold">TICKETS 🎫</h2>
            </div>

            <div className="p-4">
              <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-lg p-6 mb-4">
                <h2 className="text-2xl font-bold mb-2">2026 Festival</h2>
                <p className="text-blue-100 mb-4">October 10-12 • Fort Worth, TX</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-800 rounded p-3">
                    <p className="text-sm text-blue-200">Music Pass</p>
                    <p className="font-bold text-lg">$75.79</p>
                  </div>
                  <div className="bg-blue-800 rounded p-3">
                    <p className="text-sm text-blue-200">BBQ Pass</p>
                    <p className="font-bold text-lg">$49.99</p>
                  </div>
                  <div className="bg-blue-800 rounded p-3">
                    <p className="text-sm text-blue-200">Bourbon Pass</p>
                    <p className="font-bold text-lg">$65.99</p>
                  </div>
                  <div className="bg-blue-800 rounded p-3">
                    <p className="text-sm text-blue-200">All Access</p>
                    <p className="font-bold text-lg">$129.99</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-red-700 rounded-lg p-4">
                <h3 className="font-bold mb-3">💳 Secure Checkout</h3>

                {paymentSuccess && (
                  <div className="bg-green-50 border-2 border-green-500 rounded-lg p-3 mb-4 text-green-700 text-sm">
                    ✅ Payment successful! Check your email for confirmation.
                  </div>
                )}

                {paymentError && (
                  <div className="bg-red-50 border-2 border-red-500 rounded-lg p-3 mb-4 text-red-700 text-sm">
                    ❌ {paymentError}
                  </div>
                )}

                <form onSubmit={handleTicketPayment} className="space-y-3">
                  <div>
                    <label className="block text-sm font-bold mb-1">Full Name</label>
                    <input
                      type="text"
                      value={paymentForm.name}
                      onChange={(e) => setPaymentForm({...paymentForm, name: e.target.value})}
                      className="w-full border-2 border-gray-300 rounded p-2 text-sm"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1">Email</label>
                    <input
                      type="email"
                      value={paymentForm.email}
                      onChange={(e) => setPaymentForm({...paymentForm, email: e.target.value})}
                      className="w-full border-2 border-gray-300 rounded p-2 text-sm"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1">Phone</label>
                    <input
                      type="tel"
                      value={paymentForm.phone}
                      onChange={(e) => setPaymentForm({...paymentForm, phone: e.target.value})}
                      className="w-full border-2 border-gray-300 rounded p-2 text-sm"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div>
                      <label className="block text-sm font-bold mb-1">Ticket Type</label>
                      <select
                        value={selectedTicketType}
                        onChange={(e) => setSelectedTicketType(e.target.value)}
                        className="w-full border-2 border-gray-300 rounded p-2 text-sm"
                      >
                        <option value="music">Music - $75.79</option>
                        <option value="bbq">BBQ - $49.99</option>
                        <option value="bourbon">Bourbon - $65.99</option>
                        <option value="all-access">All Access - $129.99</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={ticketQuantity}
                        onChange={(e) => setTicketQuantity(parseInt(e.target.value))}
                        className="w-full border-2 border-gray-300 rounded p-2 text-sm"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-100 rounded p-3 text-sm font-bold text-right">
                    Total: ${(ticketPrices[selectedTicketType] * ticketQuantity).toFixed(2)}
                  </div>

                  <button
                    type="submit"
                    disabled={paymentProcessing}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-2 rounded"
                  >
                    {paymentProcessing ? '⏳ Processing...' : '🔒 Complete Purchase'}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    🔒 Secure payment powered by Stripe. Your data is encrypted and secure.
                  </p>
                </form>
              </div>
            </div>
          </div>
        );

      case 'bourbon':
        return (
          <div className="pb-24">
            <div className="bg-orange-700 text-white p-4 flex items-center gap-3">
              <button onClick={() => setActiveNav('home')} className="p-1"><ChevronLeft size={24} /></button>
              <h2 className="flex-1 text-lg font-bold">BOURBON & BBQ 🥃</h2>
            </div>

            <div className="border-b border-gray-300 flex">
              <button
                onClick={() => setActiveTab('bbq')}
                className={`flex-1 py-3 font-bold text-sm ${activeTab === 'bbq' ? 'border-b-4 border-orange-700 text-orange-700' : 'text-gray-600'}`}
              >
                BBQ Menu
              </button>
              <button
                onClick={() => setActiveTab('bourbon')}
                className={`flex-1 py-3 font-bold text-sm ${activeTab === 'bourbon' ? 'border-b-4 border-orange-700 text-orange-700' : 'text-gray-600'}`}
              >
                Bourbon
              </button>
            </div>

            <div className="p-4 space-y-3">
              {activeTab === 'bbq' && (
                <>
                  {[
                    { name: 'Texas Brisket Platter', price: '$18' },
                    { name: 'Smoked Ribs', price: '$16' },
                    { name: 'Pulled Pork Sandwich', price: '$12' },
                    { name: 'Smoked Chicken', price: '$12' }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white border-2 border-orange-700 rounded-lg p-4 flex justify-between items-center">
                      <span className="font-bold">{item.name}</span>
                      <span className="text-orange-700 font-bold">{item.price}</span>
                    </div>
                  ))}
                </>
              )}

              {activeTab === 'bourbon' && (
                <>
                  {[
                    { name: 'Maker\'s Mark', price: '$12' },
                    { name: 'Woodford Reserve', price: '$15' },
                    { name: 'Bourbon Cocktails', price: '$10' },
                    { name: 'Bourbon Pairing Flight', price: '$28' }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white border-2 border-orange-700 rounded-lg p-4 flex justify-between items-center">
                      <span className="font-bold">{item.name}</span>
                      <span className="text-orange-700 font-bold">{item.price}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        );

      case 'merch':
        return (
          <div className="pb-24">
            <div className="bg-gray-800 text-white p-4 flex items-center gap-3">
              <button onClick={() => setActiveNav('home')} className="p-1"><ChevronLeft size={24} /></button>
              <h2 className="flex-1 text-lg font-bold">MERCH STORE 👕</h2>
              <button className="p-1">🛒</button>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search merch..."
                  className="w-full border-2 border-gray-400 rounded-full p-3 bg-gray-100"
                />
              </div>

              <div className="bg-blue-100 border-l-4 border-blue-500 rounded p-3 mb-4">
                <p className="text-sm text-gray-700">🎁 Exclusive festival merchandise available. Limited quantities!</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {swagItems.map((item, idx) => (
                  <div key={idx} className="bg-gray-900 rounded-lg p-3 text-center hover:bg-gray-800 cursor-pointer">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <p className="text-white font-bold text-sm mb-1">{item.name}</p>
                    <p className="text-yellow-400 font-bold">{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'testimonials':
        return (
          <div className="pb-24">
            <div className="bg-red-700 text-white p-4 flex items-center gap-3">
              <button onClick={() => setActiveNav('home')} className="p-1"><ChevronLeft size={24} /></button>
              <h2 className="flex-1 text-lg font-bold">IMPACT STORIES 💬</h2>
            </div>

            <div className="p-4 space-y-4">
              <div className="bg-white border-2 border-red-700 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-3">"Jimmy Jam helped my family when we needed it most. They gave us hope when we had nowhere else to turn."</p>
                <p className="text-red-700 font-bold text-sm">Maria R. • Lung Transplant Recovery</p>
                <p className="text-gray-600 text-xs">$45,000 distributed</p>
              </div>

              <div className="bg-white border-2 border-red-700 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-3">"The support came through when our AC broke in the middle of summer. Incredible organization."</p>
                <p className="text-red-700 font-bold text-sm">James T. • Emergency Repairs</p>
                <p className="text-gray-600 text-xs">$3,200 distributed</p>
              </div>

              <div className="bg-white border-2 border-red-700 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-3">"They fixed my car so I could keep my job. That made all the difference for my family."</p>
                <p className="text-red-700 font-bold text-sm">Sarah M. • Vehicle Repair</p>
                <p className="text-gray-600 text-xs">$1,800 distributed</p>
              </div>

              <div className="bg-white border-2 border-red-700 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-3">"A hand up, not a hand out. That's exactly what they do. Restored my dignity and my hope."</p>
                <p className="text-red-700 font-bold text-sm">Robert D. • Emergency Fund</p>
                <p className="text-gray-600 text-xs">Supporting our mission</p>
              </div>

              <div className="bg-gradient-to-r from-red-700 to-red-800 text-white rounded-lg p-4 mt-6">
                <p className="font-bold mb-2">💙 500+ Families Helped</p>
                <p className="text-red-100 text-sm mb-3">$1,000,000+ Distributed</p>
                <p className="text-sm">Your support makes stories like these possible.</p>
              </div>
            </div>
          </div>
        );

      case 'assistance':
        return (
          <div className="pb-24">
            <div className="bg-red-700 text-white p-4 flex items-center gap-3">
              <button onClick={() => setActiveNav('home')} className="p-1"><ChevronLeft size={24} /></button>
              <h2 className="flex-1 text-lg font-bold">APPLY FOR HELP ❤️</h2>
            </div>

            {!appSubmitted ? (
              <div className="p-4">
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
                  <h3 className="font-bold text-red-700 mb-2">Offering a Hand Up, Not a Hand Out</h3>
                  <p className="text-sm text-gray-700">Jimmy Jam Community Outreach helps families in need with emergency assistance, repairs, and support to get back on their feet.</p>
                </div>

                <form className="space-y-4">
                  <div>
                    <label className="block font-bold mb-2 text-gray-700">Full Name</label>
                    <input
                      type="text"
                      value={assistanceForm.fullName}
                      onChange={(e) => setAssistanceForm({...assistanceForm, fullName: e.target.value})}
                      className="w-full border-2 border-gray-300 rounded p-3"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-2 text-gray-700">Email</label>
                    <input
                      type="email"
                      value={assistanceForm.email}
                      onChange={(e) => setAssistanceForm({...assistanceForm, email: e.target.value})}
                      className="w-full border-2 border-gray-300 rounded p-3"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-2 text-gray-700">Phone</label>
                    <input
                      type="tel"
                      value={assistanceForm.phone}
                      onChange={(e) => setAssistanceForm({...assistanceForm, phone: e.target.value})}
                      className="w-full border-2 border-gray-300 rounded p-3"
                      placeholder="(XXX) XXX-XXXX"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-2 text-gray-700">Type of Assistance Needed</label>
                    <select
                      value={assistanceForm.assistanceType}
                      onChange={(e) => setAssistanceForm({...assistanceForm, assistanceType: e.target.value})}
                      className="w-full border-2 border-gray-300 rounded p-3"
                    >
                      <option value="">Select assistance type...</option>
                      <option value="emergency_repair">Emergency Repair</option>
                      <option value="medical_emergency">Medical Emergency</option>
                      <option value="unexpected_loss">Unexpected Loss</option>
                      <option value="financial_crisis">Temporary Financial Crisis</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-2 text-gray-700">Please Describe Your Situation</label>
                    <textarea
                      value={assistanceForm.description}
                      onChange={(e) => setAssistanceForm({...assistanceForm, description: e.target.value})}
                      className="w-full border-2 border-gray-300 rounded p-3"
                      placeholder="Tell us more..."
                      rows="5"
                    />
                  </div>

                  {submitError.assistance && <p className="text-red-600 text-sm">{submitError.assistance}</p>}
                  <button
                    onClick={handleAssistanceSubmit}
                    disabled={submitting.assistance}
                    className="w-full bg-red-700 hover:bg-red-800 disabled:bg-gray-400 text-white font-bold py-3 rounded"
                  >
                    {submitting.assistance ? '⏳ Submitting...' : 'Submit Application'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-4 flex flex-col items-center justify-center min-h-96">
                <div className="text-6xl mb-4">❤️</div>
                <h2 className="text-2xl font-bold text-red-700 mb-2">Application Received</h2>
                <p className="text-gray-600 text-center mb-6">Thank you for reaching out. Our team will review your application and contact you within 48 hours.</p>
                <div className="bg-white border-2 border-red-700 rounded-lg p-6 w-full max-w-sm">
                  <p className="text-sm text-gray-700 mb-2"><strong>Next Steps:</strong></p>
                  <p className="text-sm text-gray-600">1. Check your email for confirmation</p>
                  <p className="text-sm text-gray-600">2. Be available for a phone call</p>
                  <p className="text-sm text-gray-600">3. Bring any documentation needed</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'connect':
        return (
          <div className="pb-24">
            <div className="bg-red-700 text-white p-4 flex items-center gap-3">
              <button onClick={() => setActiveNav('home')} className="p-1"><ChevronLeft size={24} /></button>
              <h2 className="flex-1 text-lg font-bold">CONNECT 🔗</h2>
            </div>

            <div className="p-4 space-y-4">
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg p-6 text-center">
                <h2 className="text-2xl font-bold mb-2">Jimmy Jam Community Outreach</h2>
                <p className="text-red-100">"Offering a Hand Up, not a Hand Out"</p>
              </div>

              <div className="space-y-3">
                <a href="https://facebook.com/jimmyjamoutreach" target="_blank" rel="noopener noreferrer" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded flex items-center justify-center gap-2 transition duration-200">
                  <span>📘</span> Facebook
                </a>
                <a href="https://instagram.com/jimmyjamoutreach" target="_blank" rel="noopener noreferrer" className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded flex items-center justify-center gap-2 transition duration-200">
                  <span>📷</span> Instagram
                </a>
                <a href="https://twitter.com/jimmyjamoutreach" target="_blank" rel="noopener noreferrer" className="w-full bg-sky-400 hover:bg-sky-500 text-white font-bold py-3 rounded flex items-center justify-center gap-2 transition duration-200">
                  <span>𝕏</span> Twitter/X
                </a>
                <a href="https://youtube.com/jimmyjamoutreach" target="_blank" rel="noopener noreferrer" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded flex items-center justify-center gap-2 transition duration-200">
                  <span>▶️</span> YouTube
                </a>
                <a href="https://tiktok.com/@jimmyjamoutreach" target="_blank" rel="noopener noreferrer" className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded flex items-center justify-center gap-2 transition duration-200">
                  <span>♫</span> TikTok
                </a>
              </div>

              <div className="bg-white border-2 border-red-700 rounded-lg p-4">
                <h3 className="font-bold mb-3">📞 Get In Touch</h3>
                <div className="space-y-2">
                  <p className="text-sm"><strong>Phone:</strong> (817) 555-HELP</p>
                  <p className="text-sm"><strong>Email:</strong> help@jimmyjamoutreach.com</p>
                  <p className="text-sm"><strong>Address:</strong> Fort Worth, TX</p>
                </div>
              </div>

              <div className="bg-white border-2 border-red-700 rounded-lg p-4">
                <h3 className="font-bold mb-3">⏰ Hours</h3>
                <div className="space-y-1 text-sm">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                  <p className="mt-3 text-red-700 font-bold">24/7 Emergency Support</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-4">
                <h3 className="font-bold text-orange-700 mb-2">📰 Newsletter</h3>
                <input
                  type="email"
                  placeholder="Your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full border-2 border-yellow-200 rounded p-2 mb-2"
                />
                {submitError.newsletter && <p className="text-red-600 text-xs mb-2">{submitError.newsletter}</p>}
                {submitSuccess.newsletter && <p className="text-green-600 text-xs mb-2">✓ Subscribed successfully!</p>}
                <button
                  onClick={handleNewsletterSubmit}
                  disabled={submitting.newsletter}
                  className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-bold py-2 rounded"
                >
                  {submitting.newsletter ? '⏳ Subscribing...' : 'Subscribe'}
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen max-w-md mx-auto relative">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-red-700 text-white p-4 flex items-center justify-between">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="font-bold text-lg text-center flex-1">Jimmy Jam</h1>
        <button className="p-1"><Bell size={24} /></button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-red-600 text-white z-30 p-4 space-y-2">
          <button onClick={() => {setActiveNav('assistance'); setMobileMenuOpen(false);}} className="w-full text-left p-2 hover:bg-red-700 rounded">❤️ Apply for Help</button>
          <button onClick={() => {setActiveNav('home'); setMobileMenuOpen(false);}} className="w-full text-left p-2 hover:bg-red-700 rounded">🏠 Home</button>
          <button onClick={() => {setActiveNav('videos'); setMobileMenuOpen(false);}} className="w-full text-left p-2 hover:bg-red-700 rounded">🎥 Video Library</button>
          <button onClick={() => {setActiveNav('tide'); setMobileMenuOpen(false);}} className="w-full text-left p-2 hover:bg-red-700 rounded">🌊 Tide Chart</button>
          <button onClick={() => {setActiveNav('connect'); setMobileMenuOpen(false);}} className="w-full text-left p-2 hover:bg-red-700 rounded">🔗 Connect</button>
        </div>
      )}

      {/* Page Content */}
      {renderPage()}

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-300 p-3 max-w-md mx-auto">
        <div className="flex justify-around">
          <button onClick={() => setActiveNav('home')} className={`p-2 text-center ${activeNav === 'home' ? 'text-red-700' : 'text-gray-600'}`}>
            <div className="text-xl">🏠</div>
            <div className="text-xs font-bold">Home</div>
          </button>
          <button onClick={() => setActiveNav('artists')} className={`p-2 text-center ${activeNav === 'artists' ? 'text-red-700' : 'text-gray-600'}`}>
            <div className="text-xl">🎤</div>
            <div className="text-xs font-bold">Artists</div>
          </button>
          <button onClick={() => setActiveNav('schedule')} className={`p-2 text-center ${activeNav === 'schedule' ? 'text-red-700' : 'text-gray-600'}`}>
            <div className="text-xl">📅</div>
            <div className="text-xs font-bold">Schedule</div>
          </button>
          <button onClick={() => setActiveNav('maps')} className={`p-2 text-center ${activeNav === 'maps' ? 'text-red-700' : 'text-gray-600'}`}>
            <div className="text-xl">📍</div>
            <div className="text-xs font-bold">Maps</div>
          </button>
          <button onClick={() => setShowMoreMenu(!showMoreMenu)} className={`p-2 text-center ${showMoreMenu ? 'text-red-700' : 'text-gray-600'}`}>
            <div className="text-xl">☰</div>
            <div className="text-xs font-bold">More</div>
          </button>
        </div>

        {/* More Menu Dropdown */}
        {showMoreMenu && (
          <div className="absolute bottom-16 right-0 bg-white border-2 border-gray-300 rounded shadow-lg w-48">
            <button onClick={() => {setActiveNav('artists'); setShowMoreMenu(false);}} className="w-full text-left p-3 hover:bg-gray-100 border-b">🎤 Full Lineup</button>
            <button onClick={() => {setActiveNav('videos'); setShowMoreMenu(false);}} className="w-full text-left p-3 hover:bg-gray-100 border-b">🎥 Video Library</button>
            <button onClick={() => {setActiveNav('sponsors'); setShowMoreMenu(false);}} className="w-full text-left p-3 hover:bg-gray-100 border-b">🏆 Partners</button>
            <button onClick={() => {setActiveNav('connect'); setShowMoreMenu(false);}} className="w-full text-left p-3 hover:bg-gray-100 border-b">🔗 Connect</button>
            <button onClick={() => {setActiveNav('home'); setShowMoreMenu(false);}} className="w-full text-left p-3 hover:bg-gray-100">🔔 Reminders</button>
            <button onClick={() => {setActiveNav('tickets'); setShowMoreMenu(false);}} className="w-full text-left p-3 hover:bg-gray-100">🎫 Buy Tickets</button>
          </div>
        )}
      </footer>
    </div>
  );
};

export default JimmyJamApp;