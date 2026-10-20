import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ChevronLeft,
  Heart,
  Star,
  Flame,
  Clock,
  Users,
  Check,
  BookOpen,
  X,
  Sparkles
} from 'lucide-react';

// Enhanced Master Pitmaster Recipe Dataset
const DEFAULT_FESTIVAL_RECIPES = [
  {
    id: 'brisket-championship',
    title: 'CHAMPIONSHIP SMOKED BRISKET',
    shortTitle: 'Smoked Brisket with Bark',
    category: 'SMOKED MEATS',
    course: 'LUNCH',
    time: '12 hrs low & slow',
    prepTime: '25 min',
    smokerTemp: '225°F - 250°F',
    internalTemp: '203°F probe tender',
    wood: 'Post Oak & Hickory',
    servings: '10 - 12 people',
    calories: '480 kcal',
    rating: 4.9,
    reviewsCount: 348,
    savesCount: 520,
    featured: true,
    desc: 'The holy grail of Texas & Florida pitmasters. Seasoned with a heavy coarse black pepper and kosher salt bark, smoked over hickory and post oak until buttery and probe-tender.',
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=1000',
    tags: ['Low & Slow', 'Competition Style', 'Post Oak'],
    ingredients: [
      { name: 'Prime Whole Packer Brisket', amount: '12-14 lbs', icon: '🥩' },
      { name: 'Coarse 16-mesh Black Pepper', amount: '1/3 cup', icon: '🧂' },
      { name: 'Coarse Kosher Salt', amount: '1/3 cup', icon: '🧂' },
      { name: 'Granulated Garlic Powder', amount: '2 tbsp', icon: '🧄' },
      { name: 'Smoked Paprika', amount: '1 tbsp', icon: '🌶️' },
      { name: 'Yellow Mustard (binder)', amount: '3 tbsp', icon: '🟡' },
      { name: 'Beef Tallow (for wrapping)', amount: '1/4 cup', icon: '🧈' }
    ],
    steps: [
      {
        step: 1,
        title: 'Trim & Shape',
        instruction: 'Trim the top fat cap evenly to 1/4 inch. Remove the hard deckle fat and round off any sharp corners to prevent burning in the smoke stream.'
      },
      {
        step: 2,
        title: 'Apply Binder & Dalmatian Rub',
        instruction: 'Apply a very thin coat of yellow mustard as a binder. Generously dust all sides with the 50/50 kosher salt and coarse black pepper mix with a dash of garlic and paprika.'
      },
      {
        step: 3,
        title: 'Smoke Low & Slow at 225°F',
        instruction: 'Place brisket fat side up in the smoker with the point facing the firebox. Smoke steady at 225°F with clean blue smoke for 6 to 7 hours until a dark mahogany bark forms.'
      },
      {
        step: 4,
        title: 'Butcher Paper Wrap with Tallow',
        instruction: 'Once internal temperature reaches ~165°F and the bark is firm, spritz with apple cider vinegar, brush with melted smoked beef tallow, and tightly wrap in pink peach butcher paper.'
      },
      {
        step: 5,
        title: 'The Stall & The Finish',
        instruction: 'Return to smoker at 250°F until an instant-read probe slides into the flat like warm butter (usually 200°F–203°F).'
      },
      {
        step: 6,
        title: 'The Critical Cooler Rest',
        instruction: 'Rest the wrapped brisket inside an insulated cooler lined with towels for a minimum of 2 hours (up to 4 hours) before carving against the grain.'
      }
    ]
  },
  {
    id: 'bourbon-ribs',
    title: 'BOURBON GLAZED ST. LOUIS RIBS',
    shortTitle: 'Bourbon Glazed Ribs',
    category: 'SMOKED MEATS',
    course: 'DINNER',
    time: '6 hrs 3-2-1 method',
    prepTime: '20 min',
    smokerTemp: '225°F',
    internalTemp: 'Bend test / 198°F',
    wood: 'Apple & Pecan',
    servings: '4 - 6 people',
    calories: '420 kcal',
    rating: 5.0,
    reviewsCount: 412,
    savesCount: 680,
    featured: true,
    desc: 'Competition-style ribs with a clean bite mark. Infused with our signature brown sugar bourbon reduction glaze, apple cider spritz, and sweet pecan smoke.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1000',
    tags: ['Pork Ribs', 'Bourbon Glaze', '3-2-1 Method'],
    ingredients: [
      { name: 'St. Louis Cut Pork Spare Ribs', amount: '2 racks (3 lbs ea)', icon: '🍖' },
      { name: 'Jimmy Jam Rib Rub', amount: '1/2 cup', icon: '🧂' },
      { name: 'Kentucky Bourbon', amount: '1/2 cup', icon: '🥃' },
      { name: 'Dark Brown Sugar', amount: '1/3 cup', icon: '🟤' },
      { name: 'Unsalted Butter', amount: '4 tbsp sliced', icon: '🧈' },
      { name: 'Pure Honey or Agave', amount: '3 tbsp', icon: '🍯' },
      { name: 'Apple Cider Vinegar (spritz)', amount: '1/2 cup', icon: '🍎' }
    ],
    steps: [
      {
        step: 1,
        title: 'Prep & Membrane Removal',
        instruction: 'Use a paper towel to grip and peel away the papery membrane from the bone side of each rack. Pat dry.'
      },
      {
        step: 2,
        title: 'Seasoning Layer',
        instruction: 'Coat the bone side first, then the meat side generously with rib rub. Let sit at room temperature for 30 minutes until rub turns glossy.'
      },
      {
        step: 3,
        title: '3 Hours Smoke (Phase 1)',
        instruction: 'Smoke unwrapped bone-side down at 225°F with apple and pecan wood chunks. Spritz with 50/50 apple juice and cider vinegar every 45 minutes.'
      },
      {
        step: 4,
        title: '2 Hours Foil Wrap (Phase 2)',
        instruction: 'Lay out double-thick foil sheets. Lay down brown sugar, butter slices, honey, and a splash of bourbon. Place ribs meat-side down, seal tightly, and return to smoker for 2 hours.'
      },
      {
        step: 5,
        title: '1 Hour Glaze (Phase 3)',
        instruction: 'Unwrap ribs and carefully place back on smoker grates. Brush both sides generously with Bourbon BBQ Glaze and let set for 45 minutes until tacky.'
      }
    ]
  },
  {
    id: 'bourbon-sauce',
    title: 'RESERVE BOURBON BBQ SAUCE',
    shortTitle: 'Bourbon BBQ Sauce',
    category: 'SAUCES & RUBS',
    course: 'LUNCH',
    time: '25 min simmer',
    prepTime: '10 min',
    smokerTemp: 'Stovetop simmer',
    internalTemp: 'Coats spoon',
    wood: 'N/A',
    servings: '2.5 cups',
    calories: '65 kcal / tbsp',
    rating: 4.9,
    reviewsCount: 520,
    savesCount: 890,
    featured: false,
    desc: 'Sweet, tangy, and deeply aromatic sauce made with slow-simmered Kentucky bourbon, dark molasses, apple cider vinegar, and roasted garlic.',
    image: 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?auto=format&fit=crop&q=80&w=1000',
    tags: ['Small Batch', 'Bourbon', 'Secret Sauce'],
    ingredients: [
      { name: 'Bourbon Whiskey', amount: '1/2 cup', icon: '🥃' },
      { name: 'Classic Tomato Ketchup', amount: '1 cup', icon: '🍅' },
      { name: 'Dark Molasses', amount: '2 tbsp', icon: '🍯' },
      { name: 'Dark Brown Sugar', amount: '1/3 cup', icon: '🟤' },
      { name: 'Apple Cider Vinegar', amount: '1/4 cup', icon: '🍎' },
      { name: 'Worcestershire Sauce', amount: '2 tbsp', icon: '🍶' },
      { name: 'Minced Garlic', amount: '2 cloves', icon: '🧄' }
    ],
    steps: [
      {
        step: 1,
        title: 'Flambé & Reduce',
        instruction: 'Simmer bourbon with minced garlic in a small heavy saucepan for 3 minutes to mellow the alcohol burn.'
      },
      {
        step: 2,
        title: 'Whisk in Aromatics',
        instruction: 'Whisk in ketchup, apple cider vinegar, brown sugar, molasses, Worcestershire, and smoked paprika.'
      },
      {
        step: 3,
        title: 'Simmer until Thick',
        instruction: 'Cook on low heat for 18-20 minutes, stirring occasionally, until velvety and coats the back of a spoon.'
      }
    ]
  },
  {
    id: 'smoked-beans',
    title: 'PITMASTER SMOKED BAKED BEANS',
    shortTitle: 'Bacon Smoked Beans',
    category: 'SIDES & FIXINS',
    course: 'DINNER',
    time: '2.5 hrs smoke',
    prepTime: '15 min',
    smokerTemp: '225°F - 250°F',
    internalTemp: 'Bubbling & caramelized',
    wood: 'Hickory',
    servings: '8 - 10 people',
    calories: '280 kcal',
    rating: 4.8,
    reviewsCount: 185,
    savesCount: 310,
    featured: false,
    desc: 'Slow-smoked under the dripping brisket grates so every ounce of rich smoked meat drippings infuses the pinto beans, crisp bacon, molasses, and bell peppers.',
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=1000',
    tags: ['Cast Iron', 'Bacon Drippings', 'Side Dish'],
    ingredients: [
      { name: 'Thick Cut Applewood Bacon', amount: '8 slices chopped', icon: '🥓' },
      { name: 'Smoked Brisket Burnt Ends', amount: '1 cup chopped', icon: '🥩' },
      { name: 'Pinto & Navy Beans', amount: '3 cans (15 oz)', icon: '🫘' },
      { name: 'Diced Sweet Onion', amount: '1 medium', icon: '🧅' },
      { name: 'Green Bell Pepper', amount: '1 diced', icon: '🫑' },
      { name: 'Molasses & Brown Sugar', amount: '1/3 cup ea', icon: '🍯' },
      { name: 'Bourbon BBQ Sauce', amount: '1/2 cup', icon: '🥫' }
    ],
    steps: [
      {
        step: 1,
        title: 'Crisp the Bacon',
        instruction: 'In a 12-inch cast-iron skillet, fry the chopped bacon over medium fire until crisp. Sauté diced onions and bell pepper in the drippings.'
      },
      {
        step: 2,
        title: 'Combine & Season',
        instruction: 'Fold in drained beans, chopped brisket burnt ends, brown sugar, molasses, mustard, and BBQ sauce.'
      },
      {
        step: 3,
        title: 'Smoker Drippings Bath',
        instruction: 'Place the open skillet on the lower grate directly underneath smoking brisket or ribs for 2.5 hours to catch drippings and absorb deep smoke flavor.'
      }
    ]
  },
  {
    id: 'championship-chili',
    title: "PEOPLE'S CHOICE CHAMPIONSHIP CHILI",
    shortTitle: 'Smoked Chuck Chili',
    category: 'SMOKED MEATS',
    course: 'LUNCH',
    time: '4 hrs simmer',
    prepTime: '30 min',
    smokerTemp: '250°F',
    internalTemp: 'Rich & thick',
    wood: 'Oak & Mesquite',
    servings: '10 - 12 people',
    calories: '410 kcal',
    rating: 5.0,
    reviewsCount: 610,
    savesCount: 940,
    featured: true,
    desc: 'The recipe that has won multiple People\'s Choice trophies at the Jimmy Jam BBQ Slam! Smoked whole chuck roast cubes simmered in dark stout, ancho chili paste, and roasted cumin.',
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=1000',
    tags: ['Award Winner', "People's Choice", 'Chili Cook-Off'],
    ingredients: [
      { name: 'Smoked Chuck Roast (cubed)', amount: '3 lbs', icon: '🥩' },
      { name: 'Ground Chorizo Sausage', amount: '1 lb', icon: '🥓' },
      { name: 'Fire-Roasted Diced Tomatoes', amount: '2 cans (28 oz)', icon: '🍅' },
      { name: 'Dark Stout Beer', amount: '1 bottle (12 oz)', icon: '🍺' },
      { name: 'Ancho & Chipotle Chili Powder', amount: '3 tbsp', icon: '🌶️' },
      { name: 'Black & Kidney Beans', amount: '2 cans rinsed', icon: '🫘' },
      { name: 'Dark Unsweetened Cocoa', amount: '1 tbsp', icon: '🍫' }
    ],
    steps: [
      {
        step: 1,
        title: 'Smoke the Chuck Roast',
        instruction: 'Season the chuck roast heavily with chili rub and smoke at 225°F for 3 hours until deeply crusted, then cube into bite-sized nuggets.'
      },
      {
        step: 2,
        title: 'Brown Sausage & Aromatics',
        instruction: 'Brown chorizo in a Dutch oven with diced onions, garlic, and jalapeños. Deglaze with stout beer.'
      },
      {
        step: 3,
        title: 'Simmer on the Smoker',
        instruction: 'Add cubed smoked chuck, tomatoes, spices, and a dash of dark cocoa. Simmer uncovered on the smoker for 2 hours until ultra rich.'
      }
    ]
  },
  {
    id: 'pulled-pork-butt',
    title: 'CAROLINA GOLD PULLED PORK',
    shortTitle: 'Pulled Pork Shoulder',
    category: 'SMOKED MEATS',
    course: 'DINNER',
    time: '9 hrs low & slow',
    prepTime: '20 min',
    smokerTemp: '250°F',
    internalTemp: '205°F pull-apart',
    wood: 'Hickory & Cherry',
    servings: '8 - 10 people',
    calories: '390 kcal',
    rating: 4.8,
    reviewsCount: 290,
    savesCount: 470,
    featured: false,
    desc: 'Bone-in Boston butt rubbed with brown sugar and smoked paprika. Smoked until the bone pulls cleanly free with zero effort, paired with tangy Carolina mustard sauce.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1000',
    tags: ['Boston Butt', 'Carolina Gold', 'Party Favorite'],
    ingredients: [
      { name: 'Bone-in Boston Butt Pork Roast', amount: '8-9 lbs', icon: '🍖' },
      { name: 'Sweet Brown Sugar Pork Rub', amount: '1/2 cup', icon: '🧂' },
      { name: 'Yellow Mustard Binder', amount: '3 tbsp', icon: '🟡' },
      { name: 'Carolina Gold Mustard Sauce', amount: '1 cup', icon: '🥫' },
      { name: 'Apple Cider Spritz', amount: '1 cup', icon: '🍎' }
    ],
    steps: [
      {
        step: 1,
        title: 'Prep & Coat',
        instruction: 'Score the fat cap in a diamond crosshatch pattern. Slather with mustard binder and heavily coat with the sweet pork rub.'
      },
      {
        step: 2,
        title: 'Smoke at 250°F',
        instruction: 'Smoke at 250°F for 6 hours until bark turns dark mahogany. Spritz every hour with apple cider vinegar.'
      },
      {
        step: 3,
        title: 'Wrap & Shred',
        instruction: 'Wrap in heavy foil with a dash of apple cider until internal hits 205°F. Rest 1 hour, pull the bone clean, and shred by hand.'
      }
    ]
  }
];

export default function FestivalRecipes({ setActiveNav }) {
  const [recipes] = useState(DEFAULT_FESTIVAL_RECIPES);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, BREAKFAST, LUNCH, DINNER
  const [selectedCategory, setSelectedCategory] = useState('ALL'); // ALL, SMOKED MEATS, SAUCES & RUBS, SIDES & FIXINS
  const [searchQuery, setSearchQuery] = useState('');
  const [savedRecipeIds, setSavedRecipeIds] = useState(() => {
    try {
      const stored = localStorage.getItem('jj_saved_recipes');
      return stored ? JSON.parse(stored) : ['brisket-championship', 'bourbon-ribs'];
    } catch (e) {
      return ['brisket-championship', 'bourbon-ribs'];
    }
  });

  // Active view in detail screen: 'story' | 'ingredients' | 'steps'
  const [detailTab, setDetailTab] = useState('story');

  // Toggle save recipe to personal cookbook
  const toggleSaveRecipe = (recipeId, e) => {
    if (e) e.stopPropagation();
    setSavedRecipeIds(prev => {
      const next = prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId];
      try {
        localStorage.setItem('jj_saved_recipes', JSON.stringify(next));
      } catch (err) {}
      return next;
    });
  };

  // Filter recipes based on course tab, category, and search query
  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => {
      const matchesCourse = activeTab === 'ALL' || r.course === activeTab;
      const matchesCategory = selectedCategory === 'ALL' || r.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCourse && matchesCategory && matchesSearch;
    });
  }, [recipes, activeTab, selectedCategory, searchQuery]);

  // Popular dish carousel items
  const popularDishes = useMemo(() => {
    return recipes.filter(r => r.featured);
  }, [recipes]);

  // Categories with count and representative image
  const categoriesList = useMemo(() => {
    return [
      {
        id: 'SMOKED MEATS',
        title: 'CHAMPIONSHIP MEATS',
        subtitle: 'Brisket, Ribs, Pork & Chili',
        image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=400'
      },
      {
        id: 'SAUCES & RUBS',
        title: 'SECRET SAUCES & RUBS',
        subtitle: 'Bourbon Glazes, Rubs & Mops',
        image: 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?auto=format&fit=crop&q=80&w=400'
      },
      {
        id: 'SIDES & FIXINS',
        title: 'SOUTHERN SIDES & FIXINS',
        subtitle: 'Smoked Beans, Slaw & Mac',
        image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=400'
      }
    ];
  }, []);

  // Scroll to top when opening recipe
  useEffect(() => {
    if (selectedRecipe) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedRecipe]);

  // =========================================================================
  // VIEW 2: RECIPE DETAIL SCREEN (Matching Screen 2 & Screen 3 in Mockup)
  // =========================================================================
  if (selectedRecipe) {
    const isSaved = savedRecipeIds.includes(selectedRecipe.id);

    return (
      <div className="relative min-h-screen bg-[#0F172A] text-white -mx-4 pb-28 font-sans animate-in fade-in duration-200">
        
        {/* Full Bleed Overhead Hero Image */}
        <div className="relative w-full h-[380px] sm:h-[440px] overflow-hidden">
          <img
            src={selectedRecipe.image}
            alt={selectedRecipe.title}
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-black/60" />

          {/* Top Bar Floating Buttons */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
            <button
              onClick={() => setSelectedRecipe(null)}
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 active:scale-95 transition-all shadow-lg border border-white/10"
              aria-label="Back to recipes"
            >
              <ChevronLeft size={22} />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => toggleSaveRecipe(selectedRecipe.id, e)}
                className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center active:scale-95 transition-all shadow-lg border ${
                  isSaved
                    ? 'bg-red-600 text-white border-red-500'
                    : 'bg-black/50 text-white hover:text-red-400 border-white/10'
                }`}
                aria-label="Favorite recipe"
              >
                <Heart size={18} fill={isSaved ? '#FFFFFF' : 'none'} />
              </button>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="relative -mt-24 px-4 sm:px-6 max-w-xl mx-auto space-y-5 z-20">
          
          {/* FLOATING FROSTED GLASSMORPHISM CARD (Matching Center Phone) */}
          <div className="relative rounded-3xl p-6 sm:p-7 bg-[#1E293B]/80 backdrop-blur-xl border border-white/15 shadow-2xl space-y-4">
            
            {/* Title & Heart Row */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-amber-400 block mb-1">
                  {selectedRecipe.category}
                </span>
                <h1 className="font-serif tracking-wide text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {selectedRecipe.title}
                </h1>
              </div>
            </div>

            {/* Rating & Reviewer Score */}
            <div className="flex items-center gap-3 text-xs text-neutral-300">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < Math.floor(selectedRecipe.rating) ? '#FBBF24' : 'none'}
                    className={i < Math.floor(selectedRecipe.rating) ? 'text-amber-400' : 'text-neutral-500'}
                  />
                ))}
              </div>
              <span className="font-semibold text-neutral-200">
                {selectedRecipe.reviewsCount} pitmasters rated
              </span>
            </div>

            {/* Tag Pills */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              {selectedRecipe.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/10 border border-white/10 text-neutral-200"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Recipe Story / Brief Desc */}
            <p className="text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed pt-1">
              {selectedRecipe.desc}
            </p>

            {/* ADD TO RECIPE BOOK BUTTON (Matching Reference Pill) */}
            <button
              onClick={() => toggleSaveRecipe(selectedRecipe.id)}
              className={`w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transform active:scale-98 transition-all ${
                isSaved
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/40'
                  : 'bg-black hover:bg-neutral-900 text-white border border-white/20 shadow-black/50'
              }`}
            >
              {isSaved ? (
                <>
                  <Check size={16} />
                  <span>SAVED TO MY RECIPE BOOK</span>
                </>
              ) : (
                <>
                  <BookOpen size={16} />
                  <span>ADD TO RECIPE BOOK</span>
                </>
              )}
            </button>

            {/* Social / Metric Counters Row (Matching Reference Icons) */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white flex items-center justify-center gap-1">
                  <Clock size={13} className="text-amber-400" />
                  {selectedRecipe.prepTime}
                </span>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Prep Time</span>
              </div>

              <div className="space-y-0.5 border-x border-white/10">
                <span className="text-xs font-bold text-white flex items-center justify-center gap-1">
                  <Flame size={13} className="text-red-400" />
                  {selectedRecipe.smokerTemp.split('-')[0].trim()}
                </span>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Smoker Temp</span>
              </div>

              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white flex items-center justify-center gap-1">
                  <Users size={13} className="text-blue-400" />
                  {selectedRecipe.servings.split(' ')[0]}
                </span>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Servings</span>
              </div>
            </div>

            {/* Calories / Wood Spec Pill */}
            <div className="text-center pt-1">
              <span className="text-[11px] font-semibold text-neutral-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                {selectedRecipe.calories} • Wood: {selectedRecipe.wood}
              </span>
            </div>
          </div>

          {/* DETAIL VIEW MODE SWITCHER (Ingredients vs Steps) */}
          <div className="flex items-center justify-center gap-2 p-1 rounded-2xl bg-white/5 border border-white/10">
            <button
              onClick={() => setDetailTab('ingredients')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                detailTab === 'ingredients'
                  ? 'bg-amber-500 text-amber-950 shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Ingredients ({selectedRecipe.ingredients.length})
            </button>
            <button
              onClick={() => setDetailTab('steps')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                detailTab === 'steps'
                  ? 'bg-amber-500 text-amber-950 shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Pitmaster Steps ({selectedRecipe.steps.length})
            </button>
          </div>

          {/* INGREDIENTS SECTION (Matching Screen 3 Cards) */}
          {detailTab === 'ingredients' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Required Ingredients
                </span>
                <span className="text-[11px] text-amber-400 font-semibold">
                  For {selectedRecipe.servings}
                </span>
              </div>

              {/* Horizontal Scroll / Grid of Ingredient Cards (Like Right Phone) */}
              <div className="grid grid-cols-2 gap-2.5">
                {selectedRecipe.ingredients.map((ing, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-[#1E293B]/70 border border-white/10 flex items-center gap-3 shadow-md"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl flex-shrink-0">
                      {ing.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-white leading-tight truncate">
                        {ing.name}
                      </p>
                      <p className="text-[11px] text-amber-400 font-medium mt-0.5">
                        {ing.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP-BY-STEP PITMASTER GUIDE */}
          {detailTab === 'steps' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 px-1 block">
                Smoker Instructions
              </span>

              <div className="space-y-3">
                {selectedRecipe.steps.map((st) => (
                  <div
                    key={st.step}
                    className="p-4 rounded-2xl bg-[#1E293B]/70 border border-white/10 shadow-md flex items-start gap-3.5"
                  >
                    <div className="w-7 h-7 rounded-full bg-amber-500 text-amber-950 font-extrabold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      {st.step}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm text-white">{st.title}</h3>
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                        {st.instruction}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Return Button */}
          <div className="pt-4 text-center">
            <button
              onClick={() => setSelectedRecipe(null)}
              className="text-xs text-neutral-400 hover:text-white flex items-center justify-center gap-1 mx-auto py-2"
            >
              <ChevronLeft size={16} /> Return to all recipes
            </button>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: RECIPE DISCOVERY HOME (Matching Screen 1 in Mockup)
  // =========================================================================
  return (
    <div className="relative min-h-screen bg-[#131B2A] text-white -mx-4 px-4 sm:px-6 py-5 pb-28 overflow-hidden font-sans">
      
      {/* Dark Slate Atmospheric Backdrop with Food Ambiance */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-[#1E293B]/60 via-[#131B2A]/80 to-[#131B2A]" />
      
      <div className="relative max-w-xl mx-auto space-y-6 z-10">

        {/* 1. TOP OVAL PILL SEARCH BAR (Matching Screen 1 Mockup) */}
        <div className="relative pt-1">
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-4 text-neutral-300 pointer-events-none" />
            <input
              type="text"
              placeholder="Search for recipes & channels"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs sm:text-sm text-white placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white/20 transition-all shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 text-neutral-300 hover:text-white p-1"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* 2. MEAL / TIME FILTER PILLS (BREAKFAST / LUNCH / DINNER Style) */}
        <div className="flex items-center justify-between gap-2 px-2">
          {['ALL', 'BREAKFAST', 'LUNCH', 'DINNER'].map(course => (
            <button
              key={course}
              onClick={() => setActiveTab(course)}
              className={`flex-1 py-1.5 px-3 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all ${
                activeTab === course
                  ? 'bg-white text-neutral-900 shadow-md font-extrabold'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              {course}
            </button>
          ))}
        </div>

        {/* 3. POPULAR DISH OF THE WEEK (Horizontal Carousel Matching Mockup) */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-2">
            <span className="w-1 h-4 bg-amber-400 rounded-full inline-block" />
            <h2 className="font-serif tracking-wider text-xs sm:text-sm font-bold uppercase text-white">
              POPULAR DISH OF THE WEEK
            </h2>
          </div>

          {/* Horizontal Scroll Card Slider */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 pt-1">
            {popularDishes.map(dish => {
              const isSaved = savedRecipeIds.includes(dish.id);
              return (
                <div
                  key={dish.id}
                  onClick={() => setSelectedRecipe(dish)}
                  className="flex-shrink-0 w-64 sm:w-72 rounded-2xl bg-white text-neutral-900 p-3 shadow-xl cursor-pointer hover:shadow-2xl hover:scale-[1.02] active:scale-98 transition-all relative overflow-hidden group"
                >
                  <div className="flex items-center gap-3">
                    {/* Popping Round Dish Photo */}
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 relative border-2 border-amber-300 shadow-md group-hover:rotate-6 transition-transform">
                      <img
                        src={dish.image}
                        alt={dish.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 pr-1">
                      <h3 className="font-bold text-xs sm:text-sm text-neutral-900 truncate leading-snug">
                        {dish.shortTitle}
                      </h3>
                      <p className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mt-0.5">
                        Recipe
                      </p>
                      
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
                          ⏱ {dish.time.split(' ')[0]} {dish.time.split(' ')[1]}
                        </span>
                        <div className="flex items-center text-amber-500 text-[10px]">
                          <Star size={11} fill="#F59E0B" />
                          <span className="font-bold ml-0.5">{dish.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bookmark Heart */}
                    <button
                      onClick={(e) => toggleSaveRecipe(dish.id, e)}
                      className="text-neutral-400 hover:text-red-500 p-1"
                      aria-label="Save dish"
                    >
                      <Heart size={16} fill={isSaved ? '#EF4444' : 'none'} className={isSaved ? 'text-red-500' : ''} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            <span className="w-5 h-1.5 rounded-full bg-white" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
          </div>
        </div>

        {/* 4. CATEGORIES SECTION (White Banner Cards with Overlapping Dish Image) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 bg-amber-400 rounded-full inline-block" />
              <h2 className="font-serif tracking-wider text-xs sm:text-sm font-bold uppercase text-white">
                CATEGORIES
              </h2>
            </div>
            {selectedCategory !== 'ALL' && (
              <button
                onClick={() => setSelectedCategory('ALL')}
                className="text-[11px] text-amber-400 hover:underline font-semibold"
              >
                Show All
              </button>
            )}
          </div>

          {/* Horizontal Banner Cards with Circular Dish Image */}
          <div className="space-y-3">
            {categoriesList.map(cat => (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id === selectedCategory ? 'ALL' : cat.id)}
                className={`relative rounded-2xl bg-white text-neutral-900 p-4 shadow-xl cursor-pointer hover:shadow-2xl transition-all flex items-center justify-between overflow-visible group ${
                  selectedCategory === cat.id ? 'ring-4 ring-amber-400' : ''
                }`}
              >
                <div className="space-y-0.5 pr-2">
                  <h3 className="font-serif tracking-wide text-base sm:text-lg font-extrabold text-neutral-900 uppercase">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-neutral-500 font-medium">
                    {cat.subtitle}
                  </p>
                </div>

                {/* Overlapping Circular Dish Image (Matching Mockup) */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-lg -mr-2 group-hover:scale-105 group-hover:rotate-6 transition-all duration-300">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. ALL RECIPES LIST (When filtering or browsing) */}
        <div className="space-y-3 pt-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Pitmaster Collection ({filteredRecipes.length})
            </span>
            <span className="text-[11px] text-amber-400 font-semibold">
              {savedRecipeIds.length} Saved in Cookbook
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredRecipes.map(recipe => {
              const isSaved = savedRecipeIds.includes(recipe.id);
              return (
                <div
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="rounded-2xl bg-[#1E293B]/80 hover:bg-[#1E293B] border border-white/10 p-3.5 shadow-lg cursor-pointer transition-all flex items-center gap-3.5 group"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative border border-white/10">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-sm text-white truncate leading-snug group-hover:text-amber-300 transition-colors">
                        {recipe.shortTitle || recipe.title}
                      </h4>
                      <button
                        onClick={(e) => toggleSaveRecipe(recipe.id, e)}
                        className="text-neutral-400 hover:text-red-400 p-1"
                        aria-label="Save recipe"
                      >
                        <Heart
                          size={16}
                          fill={isSaved ? '#EF4444' : 'none'}
                          className={isSaved ? 'text-red-500' : ''}
                        />
                      </button>
                    </div>

                    <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                      {recipe.desc}
                    </p>

                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-neutral-300">
                      <span className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Clock size={12} /> {recipe.time.split(' ')[0]} {recipe.time.split(' ')[1]}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-red-400 font-semibold">
                        <Flame size={12} /> {recipe.smokerTemp.split('-')[0].trim()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredRecipes.length === 0 && (
              <div className="text-center py-12 space-y-2">
                <p className="text-sm text-neutral-400">No recipes found matching "{searchQuery}".</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); setActiveTab('ALL'); }}
                  className="text-xs text-amber-400 hover:underline font-semibold"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 6. CHARITY OUTREACH CALLOUT */}
        <div className="pt-4 text-center">
          <button
            onClick={() => setActiveNav && setActiveNav('schedule')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 text-xs font-semibold transition-colors"
          >
            <Sparkles size={14} className="text-amber-400" />
            <span>Taste these championship recipes live at Tringali Barn! View Schedule →</span>
          </button>
        </div>

      </div>
    </div>
  );
}
