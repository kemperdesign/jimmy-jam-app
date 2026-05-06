# Jimmy Jam Community Outreach - BBQ & Bourbon Event App

A comprehensive React-based mobile event application for the Jimmy Jam Community Outreach BBQ & Bourbon festival, built with modern web technologies.

## 🎯 Overview

**Mission:** "Offering a Hand Up, not a Hand Out"

This application serves as a complete event management platform featuring:
- Event scheduling and timeline management
- Ticket purchasing system
- Artist/performer lineup
- Weather forecasting
- Interactive venue maps
- Merchandise store (Swag Shop)
- Sponsor partnerships
- Community assistance program
- Testimonials and impact stories

## 🚀 Features

### Core Pages
- **Home** - Landing page with event overview and feature grid
- **Schedule** - 7-day event calendar with search and filtering
- **Tickets** - Event ticket purchasing with multiple tiers
- **Artists** - Music lineup with performer details
- **Weather** - 7-day forecast, hourly views, and interactive maps
- **Maps & Info** - Venue floor plans, GPS navigation, and FAQs
- **Sponsors** - Partner showcase with company details
- **Bourbon & BBQ** - Menu and beverage offerings
- **BBQ Slam** - Competition leaderboard and standings
- **Testimonials** - Community impact stories
- **Assistance** - Application form for community help
- **Swag Store** - Official merchandise with wishlist feature

### Design Features
✅ Mobile-first responsive design  
✅ Fixed bottom navigation bar  
✅ Sticky header with back button  
✅ Tab-based navigation within pages  
✅ Search functionality across multiple pages  
✅ Photo gallery with carousel  
✅ Location maps and GPS features  
✅ Weather data visualization  
✅ Dark mode aesthetic (merchandise page)  

## 🛠️ Tech Stack

- **Frontend Framework:** React 18+
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React Hooks (useState, useEffect)
- **Responsive Design:** Mobile-first approach

## 📋 Installation & Setup

### Prerequisites
- Node.js 14+ 
- npm or yarn
- React development environment

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/jimmy-jam-bbq-app.git
cd jimmy-jam-bbq-app
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Create necessary files**
```bash
# Copy the main app file
cp jimmy-jam-final-complete.jsx src/App.jsx
```

4. **Start development server**
```bash
npm start
# or
yarn start
```

5. **Build for production**
```bash
npm run build
# or
yarn build
```

## 📁 Project Structure

```
jimmy-jam-bbq-app/
├── src/
│   ├── App.jsx                 # Main application component
│   ├── index.css              # Global styles
│   └── index.js               # React entry point
├── public/
│   └── index.html             # HTML template
├── package.json               # Dependencies
├── tailwind.config.js         # Tailwind configuration
└── README.md                  # This file
```

## 🎨 Color Scheme

- **Primary Red:** #dc2626
- **Secondary Orange:** #ea580c
- **Blue (Weather/Maps):** #1e40af
- **Yellow (Accents):** #eab308
- **Dark Gray (Merchandise):** #1f2937
- **White:** #ffffff

## 📱 Navigation Structure

### Footer Navigation
- 🏠 **Home** - Landing page
- 🎤 **Artists** - Music lineup
- 📅 **Schedule** - Event calendar
- 📍 **Maps** - Venue and info
- ☰ **More** - Additional options

### More Menu Options
- 🎤 View Full Lineup (Artists)
- ▶️ Playlist
- 🏆 Official Partners (Sponsors)
- 🔗 Connect
- 🔔 Schedule Reminders
- ⏰ Notification History
- 💬 Concert Concierge
- 🎫 Buy Tickets

## 🔧 Customization

### Adding New Merchandise
Edit the `swagItems` array in `src/App.jsx`:
```javascript
const swagItems = [
  { name: 'Product Name', price: 49.99, icon: '👕' },
  // Add more items...
];
```

### Adding Sponsors
Edit the `sponsorsData` array with:
```javascript
{
  id: 1,
  name: 'Company Name',
  tagline: 'Tagline',
  logo: '🏢',
  website: 'example.com',
  facebook: 'username',
  instagram: 'username',
  description: 'Company description',
  location: 'City, State',
  image: '🎯'
}
```

### Adding Artists
Edit the `artistsData` array with performer information:
```javascript
{
  id: 1,
  name: 'Artist Name',
  genre: 'Genre description',
  logo: '🎸',
  image: '🎤',
  description: 'Full bio...',
  time: '2:00 PM',
  stage: 'Main Stage'
}
```

## 📊 Data Structure

### Weather Data
- Current conditions (temp, humidity, wind)
- 7-day forecast with icons and precipitation
- Hourly breakdown by date
- Interactive map view

### Schedule Data
- 20+ events across multiple dates
- Category filtering (Food, Music, Performance, Info)
- Search functionality
- Star/favorite system

### Sponsor Data
- 8 partner companies
- Detailed company information
- Social media links
- Location data

## 🚀 Deployment

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload the 'build' folder to Netlify
```

### Deploy to GitHub Pages
1. Add to `package.json`:
```json
"homepage": "https://yourusername.github.io/jimmy-jam-bbq-app"
```

2. Run:
```bash
npm run build
npm run deploy
```

## 📸 Screenshots

- Home page with feature grid
- Event schedule with 7-day view
- Weather page with tabs (7-Day, Hourly, Map)
- Maps page with venue and GPS views
- Artist lineup with detailed bios
- Merchandise store with dark theme
- Sponsor showcase

## 🔐 Security Notes

- Form submissions should be validated server-side
- API endpoints should use authentication
- Sensitive data should not be hardcoded
- Implement HTTPS for production

## 🐛 Known Issues

- Map views are placeholder/mock implementations
- Live streaming not integrated
- Payment processing not connected
- Real-time notifications not implemented

## 📝 Future Enhancements

- [ ] Real-time event updates via WebSocket
- [ ] Push notifications
- [ ] User authentication system
- [ ] Stripe payment integration
- [ ] Real GPS/map integration
- [ ] Live streaming embeds
- [ ] User accounts and profiles
- [ ] Social sharing features
- [ ] Multi-language support
- [ ] Accessibility improvements (WCAG 2.1)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contact & Support

- **Organization:** Jimmy Jam Community Outreach
- **Mission:** "Offering a Hand Up, not a Hand Out"
- **Website:** jimmyjamoutreach.com

## 🙏 Acknowledgments

- React.js community
- Tailwind CSS
- Lucide React icons
- All sponsors and partners supporting Jimmy Jam's mission

---

**Last Updated:** May 2026  
**Version:** 1.0.0  
**Status:** Active Development
