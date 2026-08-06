/* =========================================================
   data.js — Mock catalog data (categories, stores, products, services, cities)
   In production, replace arrays with fetch() calls to backend API.
   ========================================================= */

const CATEGORIES = [
  { id: "men-wear", slug: "men-wear", name: "Men Wear", emoji: "🤵", image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=400&q=80", description: "Sherwanis, formal wear and groom-ready ensembles." },
  { id: "women-wear", slug: "women-wear", name: "Women Wear", emoji: "👚", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80", description: "Ethnic wear, party dresses and designer outfits." },
  { id: "kids-wear", slug: "kids-wear", name: "Kids Wear", emoji: "🧒", image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=400&q=80", description: "Party sets, festive outfits and comfort styling." },
  { id: "boutiques", slug: "boutiques", name: "Boutiques", emoji: "👗", image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=400&q=80", description: "Contemporary wear, festive edits and premium styling." },
  { id: "designers", slug: "designers", name: "Designers", emoji: "✂️", image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=400&q=80", description: "Custom ensembles, couture ideas and bespoke silhouettes." },
  { id: "tailors", slug: "tailors", name: "Tailors", emoji: "🧵", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=400&q=80", description: "Alterations, fitting services and made-to-measure work." },
  { id: "jewellery", slug: "jewellery", name: "Jewellery", emoji: "💍", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=400&q=80", description: "Fine jewellery, heirloom pieces and gifting picks." },
  { id: "wedding", slug: "wedding", name: "Wedding Collection", emoji: "👰", image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=400&q=80", description: "Bridal sarees, sherwanis, reception dresses and couple collections." },
  { id: "rentals", slug: "rentals", name: "Rentals", emoji: "🎽", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80", description: "Outfits, accessories and occasion rentals near you." },
  { id: "photographers", slug: "photographers", name: "Photography & Video", emoji: "📷", image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=400&q=80", description: "Wedding coverage, pre-wedding shoots, baby shoots and corporate events." },
  { id: "decorators", slug: "decorators", name: "Event Management", emoji: "🎊", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80", description: "Mandap decor, stage decoration, DJs, makeup artists and mehendi." },
  { id: "caterers", slug: "caterers", name: "Caterers", emoji: "🍽️", image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=400&q=80", description: "Wedding menus, buffet service and gourmet catering." }
];

const STORES = [
  {
    id: "aaraya", name: "Aaraya Bridal Studio", categoryId: "wedding", category: "Bridal Boutique",
    emoji: "👰", image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80",
    rating: 4.9, reviewCount: 312, distance: 0.8, open: true, badge: "Premium",
    description: "Heirloom lehengas, custom blouses and bridal styling.",
    tags: ["bridal", "lehenga", "custom"],
    products: [
      { id: "aaraya-lehenga", name: "Royal Bridal Lehenga", price: 18500, originalPrice: 22000,
        description: "Embroidery-rich lehenga for your special day.",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
        images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80"],
        variantType: "size", variantLabel: "Choose size", variantOptions: ["XS","S","M","L","XL","XXL"], stock: 5 },
      { id: "aaraya-blouse", name: "Silk Bridal Blouse", price: 4800, description: "Hand-woven silk blouse for bridal ensembles.",
        image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=900&q=80",
        variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL"], stock: 12 }
    ],
    services: [
      { id: "aaraya-styling", name: "Bridal Styling Session", price: 3200, description: "Personal styling consultation and look planning.",
        image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80" }
    ]
  },
  {
    id: "maison-noir", name: "Maison Noir Tailors", categoryId: "tailors", category: "Custom Tailoring",
    emoji: "✂️", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80",
    rating: 4.7, reviewCount: 189, distance: 1.2, open: true, badge: "Verified",
    description: "Made-to-measure fits for men, women and luxury events.",
    tags: ["tailor","alteration","bespoke"],
    products: [
      { id: "maison-shirt", name: "Custom Formal Shirt", price: 3200, description: "Bespoke shirt cut to your measurements.",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
        images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=80"],
        variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL","XXL"], stock: 20 },
      { id: "maison-suit", name: "Three-Piece Suit", price: 14500, originalPrice: 16000, description: "Premium tailored three-piece suit.",
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80",
        variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL"], stock: 8 }
    ],
    services: [
      { id: "maison-alteration", name: "Alteration Package", price: 1500, description: "Fit adjustment and customization service.",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80" }
    ]
  },
  {
    id: "gold-thread", name: "The Gold Thread", categoryId: "jewellery", category: "Jewellery",
    emoji: "💍", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80",
    rating: 4.8, reviewCount: 425, distance: 1.5, open: false, badge: "Premium",
    description: "Fine jewellery, bridal sets and gift-worthy pieces.",
    tags: ["jewellery","bridal","gift"],
    products: [
      { id: "gold-thread-ring", name: "Bridal Ring Set", price: 9800, description: "Polished bridal set with premium finish.",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80",
        images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1617038220319-276d3cfab535?auto=format&fit=crop&w=900&q=80"],
        variantType: "variant", variantLabel: "Choose metal", variantOptions: ["Gold","Rose Gold","Silver"], stock: 6 },
      { id: "gold-thread-necklace", name: "Gold Necklace", price: 12500, description: "Heirloom 22K gold necklace.",
        image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80",
        variantType: "none", variantLabel: "", variantOptions: [], stock: 3 }
    ],
    services: []
  },
  {
    id: "lens-light", name: "Lens & Light Studio", categoryId: "photographers", category: "Photography",
    emoji: "📷", image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=600&q=80",
    rating: 4.6, reviewCount: 156, distance: 2.1, open: true, badge: "Verified",
    description: "Wedding films, editorials and portrait sessions.",
    tags: ["photography","wedding","film"],
    products: [],
    services: [
      { id: "lens-light-portrait", name: "Portrait Session", price: 6500, description: "Editorial shoot with premium retouching.",
        image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80" },
      { id: "lens-light-wedding", name: "Wedding Film Package", price: 45000, description: "Full-day cinematic wedding coverage.",
        image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=80" }
    ]
  },
  {
    id: "petal-affairs", name: "Petal Affairs", categoryId: "decorators", category: "Decorators",
    emoji: "🎊", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80",
    rating: 4.5, reviewCount: 98, distance: 2.4, open: true, badge: "Popular",
    description: "Mandap styling, venue decor and celebration design.",
    tags: ["decor","event","mandap"],
    products: [],
    services: [
      { id: "petal-affairs-decor", name: "Mandap Decor Planning", price: 4800, description: "Venue styling and decor concept setup.",
        image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=80" }
    ]
  },
  {
    id: "zaira-designer", name: "Zaira Designer Wear", categoryId: "designers", category: "Designer Boutique",
    emoji: "👗", image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80",
    rating: 4.9, reviewCount: 510, distance: 2.8, open: true, badge: "Premium",
    description: "Fashion-forward outfits for parties, weddings and reels.",
    tags: ["designer","luxury","couture"],
    products: [
      { id: "zaira-dress", name: "Designer Party Dress", price: 11250, originalPrice: 13000, description: "Luxury outfit crafted for evening glamour.",
        image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
        images: ["https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80"],
        variantType: "size", variantLabel: "Choose size", variantOptions: ["XS","S","M","L","XL"], stock: 4 },
      { id: "zaira-gown", name: "Couture Evening Gown", price: 18500, originalPrice: 21000, description: "Statement couture gown for red-carpet events.",
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80",
        variantType: "size", variantLabel: "Choose size", variantOptions: ["XS","S","M","L"], stock: 2 }
    ],
    services: []
  },
  {
    id: "royal-loom", name: "Royal Loom", categoryId: "boutiques", category: "Boutique",
    emoji: "🪡", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80",
    rating: 4.4, reviewCount: 76, distance: 3.0, open: true, badge: "New",
    description: "Trending silhouettes for festive wear and daily glam.",
    tags: ["boutique","festive","wear"],
    products: [
      { id: "royal-loom-set", name: "Festive Wear Set", price: 4200, description: "Fresh festive pick with premium detailing.",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
        variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL"], stock: 15 }
    ],
    services: []
  },
  {
    id: "shah-collection", name: "Shah Collection", categoryId: "men-wear", category: "Men Wear",
    emoji: "🤵", image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=600&q=80",
    rating: 4.7, reviewCount: 234, distance: 3.4, open: true, badge: "Popular",
    description: "Lifestyle wear, sherwanis and formal event looks.",
    tags: ["men","sherwani","formal"],
    products: [
      { id: "shah-sherwani", name: "Classic Sherwani", price: 5600, description: "Elegant sherwani for celebrations and events.",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"],
        variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL"], stock: 10 },
      { id: "shah-kurta", name: "Embroidered Kurta", price: 2800, description: "Festive kurta with intricate embroidery.",
        image: "https://images.unsplash.com/photo-1622445275576-721325763afe?auto=format&fit=crop&w=900&q=80",
        variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL","XXL"], stock: 25 }
    ],
    services: []
  },
  {
    id: "nivi-studio", name: "Nivi Studio", categoryId: "women-wear", category: "Women Wear",
    emoji: "👚", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
    rating: 4.6, reviewCount: 167, distance: 3.7, open: false, badge: "Trending",
    description: "Ethnic wear, fusion outfits and glam-ready dresses.",
    tags: ["women","ethnic","fusion"],
    products: [
      { id: "nivi-ethnic", name: "Fusion Ethnic Dress", price: 3900, originalPrice: 4500, description: "Comfort-forward outfit for parties and brunches.",
        image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
        images: ["https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80"],
        variantType: "size", variantLabel: "Choose size", variantOptions: ["XS","S","M","L","XL"], stock: 18 }
    ],
    services: []
  },
  {
    id: "tiny-twist", name: "Tiny Twist", categoryId: "kids-wear", category: "Kids Wear",
    emoji: "🧒", image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=80",
    rating: 4.3, reviewCount: 89, distance: 4.0, open: true, badge: "Fresh",
    description: "Comfort-first party wear and seasonal essentials.",
    tags: ["kids","party","comfort"],
    products: [
      { id: "tiny-set", name: "Party Wear Set", price: 2200, description: "Soft comfort wear for festive occasions.",
        image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=80",
        images: ["https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80"],
        variantType: "size", variantLabel: "Choose size", variantOptions: ["XS","S","M","L"], stock: 22 }
    ],
    services: []
  },
  {
    id: "veil-rentals", name: "Veil Rentals", categoryId: "rentals", category: "Rentals",
    emoji: "🎀", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
    rating: 4.5, reviewCount: 112, distance: 4.2, open: true, badge: "Popular",
    description: "Rent designer accessories, outfits and statement pieces.",
    tags: ["rental","accessories","occasion"],
    products: [
      { id: "veil-accessory", name: "Statement Accessory Rental", price: 1800, description: "Rent premium accessories for your event look.",
        image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
        variantType: "none", variantLabel: "", variantOptions: [], stock: 9 }
    ],
    services: []
  },
  {
    id: "saffron-bites", name: "Saffron Bites", categoryId: "caterers", category: "Catering",
    emoji: "🍽️", image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80",
    rating: 4.8, reviewCount: 201, distance: 4.6, open: true, badge: "Premium",
    description: "Wedding menus, buffet service and gourmet catering.",
    tags: ["caterer","food","wedding"],
    products: [],
    services: [
      { id: "saffron-menu", name: "Wedding Catering Menu", price: 6500, description: "Custom menu package with buffet service.",
        image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=900&q=80" }
    ]
  }
];

const POPULAR_CITIES = [
  "Mumbai","Delhi","Bengaluru","Pune","Hyderabad",
  "Chennai","Kolkata","Ahmedabad","Jaipur","Surat"
];

/* Helper: format distance */
function formatDistance(km) {
  return `${km} km`;
}

/* ---------- Seller / Service Provider Categories ---------- */
const SELLER_CATEGORIES = [
  { id: "fashion-seller", label: "Fashion Seller", emoji: "👕", description: "Sell clothing for men, women, or kids" },
  { id: "boutique-owner", label: "Boutique Owner", emoji: "👗", description: "Run a boutique with custom and ready-made wear" },
  { id: "fashion-designer", label: "Fashion Designer", emoji: "✂️", description: "Offer bespoke and couture design services" },
  { id: "jewellery-store", label: "Jewellery Store", emoji: "💍", description: "Sell gold, silver, diamond and platinum jewellery" },
  { id: "photographer", label: "Photographer / Videographer", emoji: "📷", description: "Offer photography and videography packages" },
  { id: "event-manager", label: "Event Manager", emoji: "🎪", description: "Plan and manage weddings and events" },
  { id: "decorator", label: "Decorator", emoji: "🎊", description: "Mandap, stage and venue decoration" },
  { id: "caterer", label: "Caterer", emoji: "🍽️", description: "Wedding and event catering services" },
  { id: "makeup-artist", label: "Makeup Artist", emoji: "💄", description: "Bridal and event makeup services" },
  { id: "mehendi-artist", label: "Mehendi Artist", emoji: "🌿", description: "Bridal and festive mehendi designs" },
  { id: "dj-music", label: "DJ / Orchestra", emoji: "🎵", description: "Music and entertainment for events" },
  { id: "mandapam-owner", label: "Mandapam Owner", emoji: "🏛️", description: "Rent out wedding halls and mandapams" },
];

/* ---------- Photography & Videography Packages ---------- */
const PHOTOGRAPHY_PACKAGES = {
  "lens-light": [
    { id: "pp-hourly", name: "Hourly Portrait Session", type: "hourly", price: 2500, duration: "2 hours", features: ["50+ edited photos", "Online gallery", "1 location"] },
    { id: "pp-halfday", name: "Half-Day Coverage", type: "daily", price: 8500, duration: "6 hours", features: ["150+ edited photos", "Highlight reel", "2 locations", "Same-day preview"] },
    { id: "pp-wedding", name: "Wedding Cinematic Package", type: "combo", price: 45000, duration: "Full day + 2 days", features: ["500+ edited photos", "Cinematic film (5-7 min)", "Drone coverage", "Pre-wedding shoot", "Album included", "2 cinematographers"] },
    { id: "pp-prewedding", name: "Pre-Wedding Shoot", type: "daily", price: 12000, duration: "4 hours", features: ["100+ edited photos", "Short reel", "2 locations", "Props included"] },
    { id: "pp-baby", name: "Baby Shoot", type: "hourly", price: 3500, duration: "2 hours", features: ["60+ edited photos", "Theme setup", "Props included", "Parents included"] },
    { id: "pp-corporate", name: "Corporate Event", type: "combo", price: 15000, duration: "Full day", features: ["200+ edited photos", "Event highlights video", "Group shots", "Same-day delivery"] },
  ]
};

/* ---------- Event Management Packages ---------- */
const EVENT_PACKAGES = {
  "petal-affairs": [
    { id: "ep-mandap", name: "Mandap Decoration", type: "premium", price: 28000, features: ["Flower mandap setup", "Stage backdrop", "Seating arrangement", "Floral arrangements"] },
    { id: "ep-stage", name: "Stage Decoration", type: "standard", price: 12000, features: ["Themed stage backdrop", "Lighting setup", "Floral accents"] },
    { id: "ep-reception", name: "Full Reception Decor", type: "combo", price: 55000, features: ["Complete venue decor", "Entrance decoration", "Stage + dining area", "Lighting & flowers", "Table centerpieces"] },
  ],
  "saffron-bites": [
    { id: "cat-veg", name: "Veg Buffet (per plate)", type: "standard", price: 250, features: ["2 starters", "5 main courses", "3 sides", "Dessert", "Live counter"] },
    { id: "cat-nonveg", name: "Non-Veg Buffet (per plate)", type: "premium", price: 400, features: ["3 starters", "6 main courses", "4 sides", "Dessert", "Live counter"] },
    { id: "cat-premium", name: "Premium Wedding Menu (per plate)", type: "combo", price: 650, features: ["5 starters", "8 main courses", "Live counters (3)", "Premium dessert spread", "Welcome drinks", "Service staff included"] },
  ]
};

/* ---------- Mock Designer Quotations ---------- */
const MOCK_DESIGNERS = [
  { id: "d1", name: "Studio Veera", rating: 4.9, reviewCount: 230, distance: 1.5, estDays: 12, basePrice: 3500, specialty: "Bridal & Ethnic" },
  { id: "d2", name: "Aanya Couture", rating: 4.8, reviewCount: 180, distance: 2.3, estDays: 15, basePrice: 4200, specialty: "Western & Fusion" },
  { id: "d3", name: "Kaarigar Atelier", rating: 4.7, reviewCount: 145, distance: 3.1, estDays: 10, basePrice: 2800, specialty: "Traditional Wear" },
];

/* ---------- AI Try-On: Products available for try-on ---------- */
const TRYON_PRODUCTS = [
  { id: "to1", name: "Designer Saree", category: "Women", price: 8500, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80", colors: ["Red", "Royal Blue", "Green", "Maroon"] },
  { id: "to2", name: "Sherwani", category: "Men", price: 12000, image: "https://images.unsplash.com/photo-1622445275576-721325763afe?auto=format&fit=crop&w=600&q=80", colors: ["Cream", "Maroon", "Navy", "Gold"] },
  { id: "to3", name: "Party Dress", category: "Women", price: 6500, image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80", colors: ["Black", "Red", "Emerald", "Wine"] },
  { id: "to4", name: "Formal Suit", category: "Men", price: 14500, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80", colors: ["Charcoal", "Navy", "Black", "Grey"] },
  { id: "to5", name: "Lehenga Choli", category: "Women", price: 18500, image: "https://images.unsplash.com/photo-1617059062941-7817e5e9689c?auto=format&fit=crop&w=600&q=80", colors: ["Pink", "Orange", "Teal", "Purple"] },
];

/* ---------- Cloth types for customization ---------- */
const CLOTH_TYPES = [
  "Silk", "Cotton Silk", "Chiffon", "Georgette", "Velvet",
  "Brocade", "Linen", "Crepe", "Net", "Satin"
];

/* ---------- Body measurement fields ---------- */
const MEASUREMENT_FIELDS = {
  men: ["Chest (in)", "Waist (in)", "Shoulder (in)", "Sleeve Length (in)", "Shirt Length (in)", "Neck (in)"],
  women: ["Bust (in)", "Waist (in)", "Hip (in)", "Shoulder (in)", "Blouse Length (in)", "Sleeve Length (in)"],
  kids: ["Chest (in)", "Waist (in)", "Height (in)", "Shoulder (in)"],
};
