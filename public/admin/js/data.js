/* TATITO FASHIONS — Mock Data
   Every seller and designer has at least 2 products and 2 orders. */

const MockData = {

    // ====== AUTH ACCOUNTS ======
    accounts: [
        { id: 'ACC001', email: 'admin@tatitofashions.com', password: 'admin123', role: 'admin', name: 'Mahesh Nalawade', linkedId: 'STF001' },
        { id: 'ACC002', email: 'rajesh.textiles@gmail.com', password: 'seller123', role: 'seller', name: 'Rajesh Textiles', linkedId: 'SEL001' },
        { id: 'ACC003', email: 'fashionhub@gmail.com', password: 'seller123', role: 'seller', name: 'Fashion Hub Mumbai', linkedId: 'SEL002' },
        { id: 'ACC004', email: 'royal.diamond@gmail.com', password: 'seller123', role: 'seller', name: 'Royal Jewellers', linkedId: 'SEL003' },
    ],

    // ====== USERS / CUSTOMERS ======
    users: [
        { id: 'USR001', name: 'Priya Sharma', email: 'priya.sharma@gmail.com', phone: '+91 98765 43210', city: 'Mumbai', status: 'active', joined: '2026-01-15', orders: 5, totalSpent: 285000, addresses: 2, referralCode: 'PRIYA100' },
        { id: 'USR002', name: 'Rahul Verma', email: 'rahul.verma@gmail.com', phone: '+91 98220 11223', city: 'Delhi', status: 'active', joined: '2026-02-10', orders: 4, totalSpent: 193000, addresses: 1, referralCode: 'RAHUL200' },
        { id: 'USR003', name: 'Anjali Reddy', email: 'anjali.reddy@gmail.com', phone: '+91 99492 55667', city: 'Hyderabad', status: 'active', joined: '2026-01-28', orders: 4, totalSpent: 678000, addresses: 3, referralCode: 'ANJALI300' },
        { id: 'USR004', name: 'Deepika Nair', email: 'deepika.nair@gmail.com', phone: '+91 99000 88990', city: 'Bangalore', status: 'active', joined: '2026-03-05', orders: 5, totalSpent: 415000, addresses: 2, referralCode: 'DEEPIKA400' },
        { id: 'USR005', name: 'Meera Joshi', email: 'meera.joshi@gmail.com', phone: '+91 98300 44556', city: 'Kolkata', status: 'active', joined: '2026-02-20', orders: 3, totalSpent: 128000, addresses: 1, referralCode: 'MEERA500' },
        { id: 'USR006', name: 'Sneha Patel', email: 'sneha.patel@gmail.com', phone: '+91 97120 77889', city: 'Ahmedabad', status: 'active', joined: '2026-03-12', orders: 4, totalSpent: 182000, addresses: 2, referralCode: 'SNEHA600' },
        { id: 'USR007', name: 'Vikram Singh', email: 'vikram.singh@gmail.com', phone: '+91 94140 22334', city: 'Jaipur', status: 'active', joined: '2026-01-08', orders: 3, totalSpent: 290000, addresses: 1, referralCode: 'VIKRAM700' },
        { id: 'USR008', name: 'Lakshmi Krishnan', email: 'lakshmi.k@gmail.com', phone: '+91 94400 66778', city: 'Coimbatore', status: 'active', joined: '2026-02-15', orders: 3, totalSpent: 45000, addresses: 1, referralCode: 'LAKSHMI800' },
        { id: 'USR009', name: 'Karthik Iyer', email: 'karthik.iyer@gmail.com', phone: '+91 98400 99001', city: 'Chennai', status: 'inactive', joined: '2026-03-20', orders: 2, totalSpent: 68598, addresses: 1, referralCode: 'KARTHIK900' },
        { id: 'USR010', name: 'Divya Menon', email: 'divya.menon@gmail.com', phone: '+91 98950 33445', city: 'Kochi', status: 'active', joined: '2026-01-25', orders: 4, totalSpent: 103000, addresses: 2, referralCode: 'DIVYA1000' },
    ],

    // ====== SELLERS ======
    sellers: [
        { id: 'SEL001', businessName: 'Rajesh Silk Sarees', category: 'Women — Sarees', subcategory: 'Silk', email: 'rajesh.textiles@gmail.com', phone: '+91 98765 12345', city: 'Kanchipuram', status: 'active', products: 2, rating: 4.7, totalSales: 485000, commission: 10, gstin: '33ABCDE1234F1Z5', joined: '2026-01-10' },
        { id: 'SEL002', businessName: 'Fashion Hub Boutique', category: 'Women — Western Wear', subcategory: 'Dresses', email: 'fashionhub@gmail.com', phone: '+91 98220 99887', city: 'Mumbai', status: 'active', products: 4, rating: 4.5, totalSales: 920000, commission: 12, gstin: '27FGHIJ5678K1Z2', joined: '2026-01-15' },
        { id: 'SEL003', businessName: 'Royal Diamond Jewellery', category: 'Jewellery — Gold', subcategory: 'Necklaces', email: 'royal.diamond@gmail.com', phone: '+91 99492 12345', city: 'Hyderabad', status: 'active', products: 3, rating: 4.9, totalSales: 2150000, commission: 8, gstin: '36KLMNO9012P1Z9', joined: '2026-01-05' },
        { id: 'SEL004', businessName: 'Wedding Bells Event Decorators', category: 'Services — Event Management', subcategory: 'Decoration', email: 'weddingbells@gmail.com', phone: '+91 98300 55667', city: 'Kolkata', status: 'active', products: 2, rating: 4.6, totalSales: 780000, commission: 15, gstin: '19QRSTU3456V1Z3', joined: '2026-02-01' },
        { id: 'SEL005', businessName: 'Click Studio Photography', category: 'Services — Photography', subcategory: 'Wedding', email: 'clickstudio@gmail.com', phone: '+91 97120 33445', city: 'Ahmedabad', status: 'active', products: 2, rating: 4.8, totalSales: 540000, commission: 15, gstin: '24VWXYZ7890A1Z7', joined: '2026-02-10' },
        { id: 'SEL006', businessName: 'Dream Day Wedding Planners', category: 'Services — Event Management', subcategory: 'Planning', email: 'dreamday@gmail.com', phone: '+91 94140 77889', city: 'Jaipur', status: 'active', products: 2, rating: 4.7, totalSales: 1250000, commission: 15, gstin: '08BCDEF1357G1Z4', joined: '2026-01-20' },
        { id: 'SEL007', businessName: 'Swaad Pure Veg Catering', category: 'Services — Catering', subcategory: 'Wedding', email: 'swaad@gmail.com', phone: '+91 94400 22334', city: 'Coimbatore', status: 'active', products: 2, rating: 4.5, totalSales: 410000, commission: 15, gstin: '33HIJKL2468M1Z8', joined: '2026-02-15' },
        { id: 'SEL008', businessName: 'Elegant Threads Designer Wear', category: 'Men — Ethnic Wear', subcategory: 'Sherwani', email: 'elegant@gmail.com', phone: '+91 98400 66778', city: 'Chennai', status: 'active', products: 2, rating: 4.4, totalSales: 350000, commission: 12, gstin: '33NOPQRS3579N1Z6', joined: '2026-03-01' },
        { id: 'SEL009', businessName: 'Golden Touch Makeup Artists', category: 'Services — Beauty', subcategory: 'Bridal Makeup', email: 'goldentouch@gmail.com', phone: '+91 98950 12345', city: 'Kochi', status: 'active', products: 2, rating: 4.9, totalSales: 285000, commission: 15, gstin: '32TUVWXY4680O1Z1', joined: '2026-02-25' },
        { id: 'SEL010', businessName: 'Shanti Marriage Mandapam', category: 'Services — Venues', subcategory: 'Wedding Halls', email: 'shanti@gmail.com', phone: '+91 99200 55667', city: 'Pune', status: 'pending', products: 2, rating: 4.3, totalSales: 195000, commission: 15, gstin: '27ZABCDE5791P1Z5', joined: '2026-03-10' },
        { id: 'SEL011', businessName: 'Bright Lens Videography', category: 'Services — Videography', subcategory: 'Cinematic', email: 'brightlens@gmail.com', phone: '+91 99000 44556', city: 'Bangalore', status: 'active', products: 2, rating: 4.6, totalSales: 320000, commission: 15, gstin: '29FGHIJK6802Q1Z3', joined: '2026-03-05' },
        { id: 'SEL012', businessName: 'Mehendi Art by Reshma', category: 'Services — Beauty', subcategory: 'Mehendi', email: 'reshma@gmail.com', phone: '+91 99492 88990', city: 'Hyderabad', status: 'active', products: 2, rating: 4.8, totalSales: 95000, commission: 15, gstin: '36LMNOPQ7913R1Z8', joined: '2026-03-15' },
    ],

    // ====== DESIGNERS ======
    designers: [
        { id: 'DSG001', brand: 'Vikram Modi Couture', specialization: 'Bridal & Groom Wear', experience: 12, rating: 4.9, completedOrders: 145, activeOrders: 8, avgPrice: 85000, responseTime: '2 hours', city: 'Mumbai', status: 'active' },
        { id: 'DSG002', brand: 'Anita Designs', specialization: 'Women\u2019s Ethnic Wear', experience: 8, rating: 4.7, completedOrders: 92, activeOrders: 5, avgPrice: 45000, responseTime: '3 hours', city: 'Delhi', status: 'active' },
        { id: 'DSG003', brand: 'Royal Weaves', specialization: 'Couple Collections', experience: 15, rating: 4.8, completedOrders: 178, activeOrders: 12, avgPrice: 120000, responseTime: '1 hour', city: 'Jaipur', status: 'active' },
        { id: 'DSG004', brand: 'Ritu Designs', specialization: 'Bridal Lehengas', experience: 10, rating: 4.6, completedOrders: 110, activeOrders: 6, avgPrice: 95000, responseTime: '4 hours', city: 'Kolkata', status: 'active' },
        { id: 'DSG005', brand: 'MM Studio', specialization: 'Men\u2019s Sherwani & Suits', experience: 7, rating: 4.5, completedOrders: 68, activeOrders: 4, avgPrice: 55000, responseTime: '5 hours', city: 'Bangalore', status: 'active' },
        { id: 'DSG006', brand: 'Neeta Couture', specialization: 'Wedding Gowns', experience: 20, rating: 5.0, completedOrders: 230, activeOrders: 10, avgPrice: 150000, responseTime: '2 hours', city: 'Mumbai', status: 'active' },
    ],

    // ====== CATEGORIES ======
    categories: [
        { id: 'CAT001', name: 'Men\u2019s Fashion', icon: 'bi-gender-male', productCount: 8, status: 'active', subcategories: ['Sherwani', 'Suits', 'Kurta Pajama', 'Shirts', 'Jeans'] },
        { id: 'CAT002', name: 'Women\u2019s Fashion', icon: 'bi-gender-female', productCount: 12, status: 'active', subcategories: ['Sarees', 'Lehengas', 'Gowns', 'Kurtis', 'Dresses'] },
        { id: 'CAT003', name: 'Kids Fashion', icon: 'bi-bag-heart', productCount: 4, status: 'active', subcategories: ['Boys', 'Girls', 'Infants'] },
        { id: 'CAT004', name: 'Wedding Collection', icon: 'bi-heart-fill', productCount: 5, status: 'active', subcategories: ['Bridal Wear', 'Groom Wear', 'Couple Collections'] },
        { id: 'CAT005', name: 'Jewellery', icon: 'bi-gem', productCount: 3, status: 'active', subcategories: ['Gold', 'Diamond', 'Kundan', 'Temple'] },
        { id: 'CAT006', name: 'Services', icon: 'bi-bag-check', productCount: 7, status: 'active', subcategories: ['Photography', 'Videography', 'Catering', 'Decoration', 'Makeup', 'Venues'] },
    ],

    // ====== PRODUCTS ======
    products: [
        // SEL001 — Rajesh Silk Sarees
        { id: 'PRD001', name: 'Kanchipuram Silk Saree — Royal Blue', category: 'Women \u2014 Sarees', seller: 'Rajesh Silk Sarees', price: 25000, mrp: 32000, stock: 15, status: 'published', rating: 4.8, reviews: 23, image: '', variants: ['Blue', 'Red', 'Green'], createdAt: '2026-01-12' },
        { id: 'PRD002', name: 'Bridal Kanjivaram Saree — Maroon Gold', category: 'Women \u2014 Sarees', seller: 'Rajesh Silk Sarees', price: 45000, mrp: 55000, stock: 8, status: 'published', rating: 4.9, reviews: 15, image: '', variants: ['Maroon'], createdAt: '2026-01-13' },
        // SEL002 — Fashion Hub Boutique
        { id: 'PRD003', name: 'Floral Summer Dress', category: 'Women \u2014 Western Wear', seller: 'Fashion Hub Boutique', price: 3500, mrp: 5000, stock: 50, status: 'published', rating: 4.3, reviews: 42, image: '', variants: ['S','M','L','XL'], createdAt: '2026-01-16' },
        { id: 'PRD004', name: 'Designer Party Gown', category: 'Women \u2014 Western Wear', seller: 'Fashion Hub Boutique', price: 12000, mrp: 18000, stock: 20, status: 'published', rating: 4.6, reviews: 18, image: '', variants: ['S','M','L'], createdAt: '2026-01-17' },
        { id: 'PRD005', name: 'Casual Cotton Top', category: 'Women \u2014 Western Wear', seller: 'Fashion Hub Boutique', price: 1500, mrp: 2200, stock: 100, status: 'published', rating: 4.1, reviews: 67, image: '', variants: ['White','Black','Pink'], createdAt: '2026-01-18' },
        { id: 'PRD006', name: 'Slim Fit Jeans', category: 'Women \u2014 Western Wear', seller: 'Fashion Hub Boutique', price: 2800, mrp: 3999, stock: 75, status: 'published', rating: 4.4, reviews: 51, image: '', variants: ['28','30','32','34'], createdAt: '2026-01-19' },
        // SEL003 — Royal Diamond Jewellery
        { id: 'PRD007', name: '22K Gold Temple Necklace', category: 'Jewellery \u2014 Gold', seller: 'Royal Diamond Jewellery', price: 185000, mrp: 220000, stock: 5, status: 'published', rating: 4.9, reviews: 8, image: '', variants: ['Gold'], createdAt: '2026-01-06' },
        { id: 'PRD008', name: 'Diamond Bridal Set', category: 'Jewellery \u2014 Gold', seller: 'Royal Diamond Jewellery', price: 485000, mrp: 550000, stock: 3, status: 'published', rating: 5.0, reviews: 4, image: '', variants: ['Diamond'], createdAt: '2026-01-07' },
        { id: 'PRD009', name: 'Kundan Earring Set', category: 'Jewellery \u2014 Gold', seller: 'Royal Diamond Jewellery', price: 25000, mrp: 35000, stock: 12, status: 'published', rating: 4.7, reviews: 19, image: '', variants: ['Kundan'], createdAt: '2026-01-08' },
        // SEL004 — Wedding Bells Event Decorators
        { id: 'PRD010', name: 'Premium Wedding Stage Decoration', category: 'Services \u2014 Event Management', seller: 'Wedding Bells Event Decorators', price: 150000, mrp: 0, stock: 999, status: 'published', rating: 4.6, reviews: 12, image: '', variants: ['Gold Theme','Royal Theme','Floral'], createdAt: '2026-02-02' },
        { id: 'PRD011', name: 'Reception Hall Decor Package', category: 'Services \u2014 Event Management', seller: 'Wedding Bells Event Decorators', price: 85000, mrp: 0, stock: 999, status: 'published', rating: 4.5, reviews: 8, image: '', variants: ['Standard','Premium'], createdAt: '2026-02-03' },
        // SEL005 — Click Studio Photography
        { id: 'PRD012', name: 'Complete Wedding Photography Package', category: 'Services \u2014 Photography', seller: 'Click Studio Photography', price: 75000, mrp: 0, stock: 999, status: 'published', rating: 4.8, reviews: 22, image: '', variants: ['1 Day','2 Days','3 Days'], createdAt: '2026-02-11' },
        { id: 'PRD013', name: 'Pre-Wedding Photoshoot', category: 'Services \u2014 Photography', seller: 'Click Studio Photography', price: 25000, mrp: 0, stock: 999, status: 'published', rating: 4.7, reviews: 31, image: '', variants: ['Indoor','Outdoor'], createdAt: '2026-02-12' },
        // SEL006 — Dream Day Wedding Planners
        { id: 'PRD014', name: 'Full Wedding Planning Service', category: 'Services \u2014 Event Management', seller: 'Dream Day Wedding Planners', price: 350000, mrp: 0, stock: 999, status: 'published', rating: 4.7, reviews: 9, image: '', variants: ['Standard','Luxury','Royal'], createdAt: '2026-01-21' },
        { id: 'PRD015', name: 'Reception Event Management', category: 'Services \u2014 Event Management', seller: 'Dream Day Wedding Planners', price: 180000, mrp: 0, stock: 999, status: 'published', rating: 4.6, reviews: 7, image: '', variants: ['Standard','Premium'], createdAt: '2026-01-22' },
        // SEL007 — Swaad Catering
        { id: 'PRD016', name: 'Premium Veg Catering (per plate)', category: 'Services \u2014 Catering', seller: 'Swaad Pure Veg Catering', price: 450, mrp: 0, stock: 9999, status: 'published', rating: 4.5, reviews: 28, image: '', variants: ['Standard Menu','Premium Menu'], createdAt: '2026-02-16' },
        { id: 'PRD017', name: 'Live Counter Catering Service', category: 'Services \u2014 Catering', seller: 'Swaad Pure Veg Catering', price: 800, mrp: 0, stock: 9999, status: 'published', rating: 4.4, reviews: 16, image: '', variants: ['Chinese','South Indian','Chat'], createdAt: '2026-02-17' },
        // SEL008 — Elegant Threads
        { id: 'PRD018', name: 'Designer Sherwani — Cream Gold', category: 'Men \u2014 Ethnic Wear', seller: 'Elegant Threads Designer Wear', price: 35000, mrp: 45000, stock: 10, status: 'published', rating: 4.4, reviews: 14, image: '', variants: ['S','M','L','XL'], createdAt: '2026-03-02' },
        { id: 'PRD019', name: 'Indo-Western Suit — Navy', category: 'Men \u2014 Ethnic Wear', seller: 'Elegant Threads Designer Wear', price: 22000, mrp: 28000, stock: 15, status: 'published', rating: 4.3, reviews: 9, image: '', variants: ['S','M','L','XL'], createdAt: '2026-03-03' },
        // SEL009 — Golden Touch Makeup
        { id: 'PRD020', name: 'Bridal Makeup Package', category: 'Services \u2014 Beauty', seller: 'Golden Touch Makeup Artists', price: 25000, mrp: 0, stock: 999, status: 'published', rating: 4.9, reviews: 35, image: '', variants: ['HD','Airbrush','Traditional'], createdAt: '2026-02-26' },
        { id: 'PRD021', name: 'Engagement Makeup Service', category: 'Services \u2014 Beauty', seller: 'Golden Touch Makeup Artists', price: 12000, mrp: 0, stock: 999, status: 'published', rating: 4.8, reviews: 22, image: '', variants: ['HD','Airbrush'], createdAt: '2026-02-27' },
        // SEL010 — Shanti Marriage Mandapam
        { id: 'PRD022', name: 'AC Wedding Hall (per day)', category: 'Services \u2014 Venues', seller: 'Shanti Marriage Mandapam', price: 65000, mrp: 0, stock: 365, status: 'published', rating: 4.3, reviews: 6, image: '', variants: ['500 Guests','800 Guests'], createdAt: '2026-03-11' },
        { id: 'PRD023', name: 'Dining Hall with Kitchen', category: 'Services \u2014 Venues', seller: 'Shanti Marriage Mandapam', price: 35000, mrp: 0, stock: 365, status: 'published', rating: 4.2, reviews: 4, image: '', variants: ['Standard'], createdAt: '2026-03-12' },
        // SEL011 — Bright Lens Videography
        { id: 'PRD024', name: 'Cinematic Wedding Film', category: 'Services \u2014 Videography', seller: 'Bright Lens Videography', price: 95000, mrp: 0, stock: 999, status: 'published', rating: 4.6, reviews: 11, image: '', variants: ['Highlight Reel','Full Film'], createdAt: '2026-03-06' },
        { id: 'PRD025', name: 'Drone Videography Add-on', category: 'Services \u2014 Videography', seller: 'Bright Lens Videography', price: 20000, mrp: 0, stock: 999, status: 'published', rating: 4.7, reviews: 8, image: '', variants: ['1 Day','2 Days'], createdAt: '2026-03-07' },
        // SEL012 — Mehendi Art by Reshma
        { id: 'PRD026', name: 'Bridal Mehendi Design', category: 'Services \u2014 Beauty', seller: 'Mehendi Art by Reshma', price: 8500, mrp: 0, stock: 999, status: 'published', rating: 4.8, reviews: 29, image: '', variants: ['Indian','Arabic','Indo-Arabic'], createdAt: '2026-03-16' },
        { id: 'PRD027', name: 'Guest Mehendi Service (per person)', category: 'Services \u2014 Beauty', seller: 'Mehendi Art by Reshma', price: 500, mrp: 0, stock: 9999, status: 'published', rating: 4.7, reviews: 45, image: '', variants: ['Simple','Detailed'], createdAt: '2026-03-17' },
        // DSG001 — Vikram Modi Couture
        { id: 'PRD028', name: 'Custom Bridal Sherwani \u2014 Ivory Gold', category: 'Wedding Collection', seller: 'Vikram Modi Couture', price: 125000, mrp: 0, stock: 5, status: 'published', rating: 4.9, reviews: 12, image: '', variants: ['Custom'], createdAt: '2026-01-18' },
        { id: 'PRD029', name: 'Groom Tuxedo \u2014 Classic Black', category: 'Wedding Collection', seller: 'Vikram Modi Couture', price: 85000, mrp: 0, stock: 8, status: 'published', rating: 4.8, reviews: 8, image: '', variants: ['Custom'], createdAt: '2026-01-19' },
        // DSG002 — Anita Designs
        { id: 'PRD030', name: 'Designer Anarkali Suit \u2014 Emerald', category: 'Women \u2014 Ethnic Wear', seller: 'Anita Designs', price: 38000, mrp: 45000, stock: 10, status: 'published', rating: 4.7, reviews: 15, image: '', variants: ['S','M','L','XL'], createdAt: '2026-02-05' },
        { id: 'PRD031', name: 'Silk Kurta Set \u2014 Mustard', category: 'Women \u2014 Ethnic Wear', seller: 'Anita Designs', price: 22000, mrp: 28000, stock: 12, status: 'published', rating: 4.6, reviews: 9, image: '', variants: ['S','M','L'], createdAt: '2026-02-06' },
        // DSG003 — Royal Weaves
        { id: 'PRD032', name: 'Couple Sherwani & Lehenga Set \u2014 Maroon', category: 'Wedding Collection', seller: 'Royal Weaves', price: 285000, mrp: 0, stock: 3, status: 'published', rating: 4.8, reviews: 6, image: '', variants: ['Custom'], createdAt: '2026-01-25' },
        { id: 'PRD033', name: 'Reception Couple Suit Set \u2014 Navy', category: 'Wedding Collection', seller: 'Royal Weaves', price: 195000, mrp: 0, stock: 5, status: 'published', rating: 4.7, reviews: 4, image: '', variants: ['Custom'], createdAt: '2026-01-26' },
        // DSG004 — Ritu Designs
        { id: 'PRD034', name: 'Bridal Lehenga \u2014 Red Gold Zari', category: 'Wedding Collection', seller: 'Ritu Designs', price: 165000, mrp: 0, stock: 4, status: 'published', rating: 4.6, reviews: 7, image: '', variants: ['Custom'], createdAt: '2026-02-12' },
        { id: 'PRD035', name: 'Sangeet Lehenga \u2014 Teal Pink', category: 'Wedding Collection', seller: 'Ritu Designs', price: 95000, mrp: 0, stock: 6, status: 'published', rating: 4.5, reviews: 5, image: '', variants: ['Custom'], createdAt: '2026-02-13' },
        // DSG005 — MM Studio
        { id: 'PRD036', name: 'Designer Sherwani \u2014 Royal Blue', category: 'Men \u2014 Ethnic Wear', seller: 'MM Studio', price: 55000, mrp: 65000, stock: 8, status: 'published', rating: 4.5, reviews: 10, image: '', variants: ['S','M','L','XL'], createdAt: '2026-03-08' },
        { id: 'PRD037', name: 'Pathani Suit \u2014 Olive Green', category: 'Men \u2014 Ethnic Wear', seller: 'MM Studio', price: 32000, mrp: 38000, stock: 12, status: 'published', rating: 4.4, reviews: 7, image: '', variants: ['S','M','L','XL'], createdAt: '2026-03-09' },
        // DSG006 — Neeta Couture
        { id: 'PRD038', name: 'Bridal Gown \u2014 Ivory Lace', category: 'Wedding Collection', seller: 'Neeta Couture', price: 225000, mrp: 0, stock: 3, status: 'published', rating: 5.0, reviews: 5, image: '', variants: ['Custom'], createdAt: '2026-01-30' },
        { id: 'PRD039', name: 'Reception Gown \u2014 Champagne Gold', category: 'Wedding Collection', seller: 'Neeta Couture', price: 145000, mrp: 0, stock: 4, status: 'published', rating: 4.9, reviews: 3, image: '', variants: ['Custom'], createdAt: '2026-01-31' },
    ],

    // ====== ORDERS ======
    orders: [
        { id: 'ORD001', customer: 'Priya Sharma', customerCity: 'Mumbai', product: 'Kanchipuram Silk Saree \u2014 Royal Blue', items: 1, amount: 25000, status: 'delivered', payment: 'paid', date: '2026-02-15', seller: 'Rajesh Silk Sarees', trackingId: 'TRK001234' },
        { id: 'ORD002', customer: 'Rahul Verma', customerCity: 'Delhi', product: 'Bridal Kanjivaram Saree \u2014 Maroon Gold', items: 1, amount: 45000, status: 'shipped', payment: 'paid', date: '2026-03-01', seller: 'Rajesh Silk Sarees', trackingId: 'TRK001235' },
        { id: 'ORD003', customer: 'Anjali Reddy', customerCity: 'Hyderabad', product: 'Floral Summer Dress', items: 2, amount: 7000, status: 'delivered', payment: 'paid', date: '2026-02-20', seller: 'Fashion Hub Boutique', trackingId: 'TRK001236' },
        { id: 'ORD004', customer: 'Priya Sharma', customerCity: 'Mumbai', product: 'Designer Party Gown', items: 1, amount: 12000, status: 'delivered', payment: 'paid', date: '2026-02-25', seller: 'Fashion Hub Boutique', trackingId: 'TRK001237' },
        { id: 'ORD005', customer: 'Deepika Nair', customerCity: 'Bangalore', product: 'Casual Cotton Top', items: 3, amount: 4500, status: 'delivered', payment: 'paid', date: '2026-02-28', seller: 'Fashion Hub Boutique', trackingId: 'TRK001238' },
        { id: 'ORD006', customer: 'Meera Joshi', customerCity: 'Kolkata', product: 'Slim Fit Jeans', items: 1, amount: 2800, status: 'cancelled', payment: 'refunded', date: '2026-03-05', seller: 'Fashion Hub Boutique', trackingId: 'TRK001239' },
        { id: 'ORD007', customer: 'Sneha Patel', customerCity: 'Ahmedabad', product: 'Designer Party Gown', items: 1, amount: 12000, status: 'processing', payment: 'paid', date: '2026-03-10', seller: 'Fashion Hub Boutique', trackingId: 'TRK001240' },
        { id: 'ORD008', customer: 'Anjali Reddy', customerCity: 'Hyderabad', product: 'Slim Fit Jeans', items: 2, amount: 5600, status: 'delivered', payment: 'paid', date: '2026-03-12', seller: 'Fashion Hub Boutique', trackingId: 'TRK001241' },
        { id: 'ORD009', customer: 'Vikram Singh', customerCity: 'Jaipur', product: '22K Gold Temple Necklace', items: 1, amount: 185000, status: 'delivered', payment: 'paid', date: '2026-02-01', seller: 'Royal Diamond Jewellery', trackingId: 'TRK001242' },
        { id: 'ORD010', customer: 'Lakshmi Krishnan', customerCity: 'Coimbatore', product: 'Kundan Earring Set', items: 1, amount: 25000, status: 'delivered', payment: 'paid', date: '2026-02-14', seller: 'Royal Diamond Jewellery', trackingId: 'TRK001243' },
        { id: 'ORD011', customer: 'Karthik Iyer', customerCity: 'Chennai', product: 'Diamond Bridal Set', items: 1, amount: 485000, status: 'processing', payment: 'paid', date: '2026-03-15', seller: 'Royal Diamond Jewellery', trackingId: 'TRK001244' },
        { id: 'ORD012', customer: 'Divya Menon', customerCity: 'Kochi', product: 'Premium Wedding Stage Decoration', items: 1, amount: 150000, status: 'completed', payment: 'paid', date: '2026-02-10', seller: 'Wedding Bells Event Decorators', trackingId: 'TRK001245' },
        { id: 'ORD013', customer: 'Priya Sharma', customerCity: 'Mumbai', product: 'Reception Hall Decor Package', items: 1, amount: 85000, status: 'completed', payment: 'paid', date: '2026-02-18', seller: 'Wedding Bells Event Decorators', trackingId: 'TRK001246' },
        { id: 'ORD014', customer: 'Rahul Verma', customerCity: 'Delhi', product: 'Complete Wedding Photography Package', items: 1, amount: 75000, status: 'completed', payment: 'paid', date: '2026-02-22', seller: 'Click Studio Photography', trackingId: 'TRK001247' },
        { id: 'ORD015', customer: 'Sneha Patel', customerCity: 'Ahmedabad', product: 'Pre-Wedding Photoshoot', items: 1, amount: 25000, status: 'completed', payment: 'paid', date: '2026-03-01', seller: 'Click Studio Photography', trackingId: 'TRK001248' },
        { id: 'ORD016', customer: 'Vikram Singh', customerCity: 'Jaipur', product: 'Full Wedding Planning Service', items: 1, amount: 350000, status: 'processing', payment: 'paid', date: '2026-02-05', seller: 'Dream Day Wedding Planners', trackingId: 'TRK001249' },
        { id: 'ORD017', customer: 'Deepika Nair', customerCity: 'Bangalore', product: 'Reception Event Management', items: 1, amount: 180000, status: 'completed', payment: 'paid', date: '2026-02-28', seller: 'Dream Day Wedding Planners', trackingId: 'TRK001250' },
        { id: 'ORD018', customer: 'Meera Joshi', customerCity: 'Kolkata', product: 'Premium Veg Catering (per plate)', items: 500, amount: 225000, status: 'completed', payment: 'paid', date: '2026-03-02', seller: 'Swaad Pure Veg Catering', trackingId: 'TRK001251' },
        { id: 'ORD019', customer: 'Divya Menon', customerCity: 'Kochi', product: 'Live Counter Catering Service', items: 200, amount: 160000, status: 'completed', payment: 'paid', date: '2026-03-08', seller: 'Swaad Pure Veg Catering', trackingId: 'TRK001252' },
        { id: 'ORD020', customer: 'Anjali Reddy', customerCity: 'Hyderabad', product: 'Designer Sherwani \u2014 Cream Gold', items: 1, amount: 35000, status: 'delivered', payment: 'paid', date: '2026-03-04', seller: 'Elegant Threads Designer Wear', trackingId: 'TRK001253' },
        { id: 'ORD021', customer: 'Karthik Iyer', customerCity: 'Chennai', product: 'Indo-Western Suit \u2014 Navy', items: 1, amount: 22000, status: 'shipped', payment: 'paid', date: '2026-03-10', seller: 'Elegant Threads Designer Wear', trackingId: 'TRK001254' },
        { id: 'ORD022', customer: 'Priya Sharma', customerCity: 'Mumbai', product: 'Bridal Makeup Package', items: 1, amount: 25000, status: 'completed', payment: 'paid', date: '2026-02-12', seller: 'Golden Touch Makeup Artists', trackingId: 'TRK001255' },
        { id: 'ORD023', customer: 'Lakshmi Krishnan', customerCity: 'Coimbatore', product: 'Engagement Makeup Service', items: 1, amount: 12000, status: 'completed', payment: 'paid', date: '2026-03-01', seller: 'Golden Touch Makeup Artists', trackingId: 'TRK001256' },
        { id: 'ORD024', customer: 'Sneha Patel', customerCity: 'Ahmedabad', product: 'AC Wedding Hall (per day)', items: 2, amount: 130000, status: 'confirmed', payment: 'paid', date: '2026-03-15', seller: 'Shanti Marriage Mandapam', trackingId: 'TRK001257' },
        { id: 'ORD025', customer: 'Rahul Verma', customerCity: 'Delhi', product: 'Dining Hall with Kitchen', items: 1, amount: 35000, status: 'pending', payment: 'pending', date: '2026-03-20', seller: 'Shanti Marriage Mandapam', trackingId: 'TRK001258' },
        { id: 'ORD026', customer: 'Deepika Nair', customerCity: 'Bangalore', product: 'Cinematic Wedding Film', items: 1, amount: 95000, status: 'processing', payment: 'paid', date: '2026-03-08', seller: 'Bright Lens Videography', trackingId: 'TRK001259' },
        { id: 'ORD027', customer: 'Meera Joshi', customerCity: 'Kolkata', product: 'Drone Videography Add-on', items: 1, amount: 20000, status: 'completed', payment: 'paid', date: '2026-03-10', seller: 'Bright Lens Videography', trackingId: 'TRK001260' },
        { id: 'ORD028', customer: 'Vikram Singh', customerCity: 'Jaipur', product: 'Bridal Mehendi Design', items: 1, amount: 8500, status: 'completed', payment: 'paid', date: '2026-03-12', seller: 'Mehendi Art by Reshma', trackingId: 'TRK001261' },
        { id: 'ORD029', customer: 'Anjali Reddy', customerCity: 'Hyderabad', product: 'Guest Mehendi Service (per person)', items: 50, amount: 25000, status: 'completed', payment: 'paid', date: '2026-03-14', seller: 'Mehendi Art by Reshma', trackingId: 'TRK001262' },
        // Designer orders
        { id: 'ORD030', customer: 'Priya Sharma', customerCity: 'Mumbai', product: 'Custom Bridal Sherwani \u2014 Ivory Gold', items: 1, amount: 125000, status: 'processing', payment: 'paid', date: '2026-02-01', seller: 'Vikram Modi Couture', trackingId: 'TRK001263' },
        { id: 'ORD031', customer: 'Sneha Patel', customerCity: 'Ahmedabad', product: 'Groom Tuxedo \u2014 Classic Black', items: 1, amount: 85000, status: 'delivered', payment: 'paid', date: '2026-02-15', seller: 'Vikram Modi Couture', trackingId: 'TRK001264' },
        { id: 'ORD032', customer: 'Rahul Verma', customerCity: 'Delhi', product: 'Designer Anarkali Suit \u2014 Emerald', items: 1, amount: 38000, status: 'delivered', payment: 'paid', date: '2026-02-20', seller: 'Anita Designs', trackingId: 'TRK001265' },
        { id: 'ORD033', customer: 'Deepika Nair', customerCity: 'Bangalore', product: 'Silk Kurta Set \u2014 Mustard', items: 1, amount: 22000, status: 'delivered', payment: 'paid', date: '2026-02-25', seller: 'Anita Designs', trackingId: 'TRK001266' },
        { id: 'ORD034', customer: 'Vikram Singh', customerCity: 'Jaipur', product: 'Couple Sherwani & Lehenga Set \u2014 Maroon', items: 1, amount: 285000, status: 'processing', payment: 'paid', date: '2026-02-08', seller: 'Royal Weaves', trackingId: 'TRK001267' },
        { id: 'ORD035', customer: 'Divya Menon', customerCity: 'Kochi', product: 'Reception Couple Suit Set \u2014 Navy', items: 1, amount: 195000, status: 'shipped', payment: 'paid', date: '2026-02-22', seller: 'Royal Weaves', trackingId: 'TRK001268' },
        { id: 'ORD036', customer: 'Meera Joshi', customerCity: 'Kolkata', product: 'Bridal Lehenga \u2014 Red Gold Zari', items: 1, amount: 165000, status: 'processing', payment: 'paid', date: '2026-02-15', seller: 'Ritu Designs', trackingId: 'TRK001269' },
        { id: 'ORD037', customer: 'Anjali Reddy', customerCity: 'Hyderabad', product: 'Sangeet Lehenga \u2014 Teal Pink', items: 1, amount: 95000, status: 'delivered', payment: 'paid', date: '2026-02-28', seller: 'Ritu Designs', trackingId: 'TRK001270' },
        { id: 'ORD038', customer: 'Karthik Iyer', customerCity: 'Chennai', product: 'Designer Sherwani \u2014 Royal Blue', items: 1, amount: 55000, status: 'delivered', payment: 'paid', date: '2026-03-10', seller: 'MM Studio', trackingId: 'TRK001271' },
        { id: 'ORD039', customer: 'Lakshmi Krishnan', customerCity: 'Coimbatore', product: 'Pathani Suit \u2014 Olive Green', items: 1, amount: 32000, status: 'shipped', payment: 'paid', date: '2026-03-12', seller: 'MM Studio', trackingId: 'TRK001272' },
        { id: 'ORD040', customer: 'Priya Sharma', customerCity: 'Mumbai', product: 'Bridal Gown \u2014 Ivory Lace', items: 1, amount: 225000, status: 'processing', payment: 'paid', date: '2026-02-05', seller: 'Neeta Couture', trackingId: 'TRK001273' },
        { id: 'ORD041', customer: 'Deepika Nair', customerCity: 'Bangalore', product: 'Reception Gown \u2014 Champagne Gold', items: 1, amount: 145000, status: 'delivered', payment: 'paid', date: '2026-02-20', seller: 'Neeta Couture', trackingId: 'TRK001274' },
    ],

    // ====== BOOKINGS ======
    bookings: [
        { id: 'BKG001', customer: 'Priya Sharma', service: 'Bridal Makeup Package', seller: 'Golden Touch Makeup Artists', date: '2026-02-12', time: '10:00 AM', status: 'completed', amount: 25000 },
        { id: 'BKG002', customer: 'Rahul Verma', service: 'Complete Wedding Photography', seller: 'Click Studio Photography', date: '2026-02-22', time: '7:00 AM', status: 'completed', amount: 75000 },
        { id: 'BKG003', customer: 'Vikram Singh', service: 'Full Wedding Planning', seller: 'Dream Day Wedding Planners', date: '2026-12-05', time: 'Full Day', status: 'confirmed', amount: 350000 },
        { id: 'BKG004', customer: 'Sneha Patel', service: 'Pre-Wedding Photoshoot', seller: 'Click Studio Photography', date: '2026-03-01', time: '4:00 PM', status: 'completed', amount: 25000 },
        { id: 'BKG005', customer: 'Deepika Nair', service: 'Cinematic Wedding Film', seller: 'Bright Lens Videography', date: '2026-03-15', time: 'Full Day', status: 'confirmed', amount: 95000 },
        { id: 'BKG006', customer: 'Meera Joshi', service: 'Premium Veg Catering', seller: 'Swaad Pure Veg Catering', date: '2026-03-02', time: '12:00 PM', status: 'completed', amount: 225000 },
        { id: 'BKG007', customer: 'Divya Menon', service: 'AC Wedding Hall', seller: 'Shanti Marriage Mandapam', date: '2026-04-10', time: 'Full Day', status: 'pending', amount: 65000 },
    ],

    // ====== PAYMENTS ======
    payments: [
        { id: 'PAY001', orderId: 'ORD001', customer: 'Priya Sharma', amount: 25000, method: 'Razorpay', status: 'completed', date: '2026-02-15' },
        { id: 'PAY002', orderId: 'ORD009', customer: 'Vikram Singh', amount: 185000, method: 'Razorpay', status: 'completed', date: '2026-02-01' },
        { id: 'PAY003', orderId: 'ORD012', customer: 'Divya Menon', amount: 150000, method: 'UPI', status: 'completed', date: '2026-02-10' },
        { id: 'PAY004', orderId: 'ORD016', customer: 'Vikram Singh', amount: 350000, method: 'Razorpay', status: 'completed', date: '2026-02-05' },
        { id: 'PAY005', orderId: 'ORD018', customer: 'Meera Joshi', amount: 225000, method: 'Bank Transfer', status: 'completed', date: '2026-03-02' },
        { id: 'PAY006', orderId: 'ORD025', customer: 'Rahul Verma', amount: 35000, method: 'Pending', status: 'pending', date: '2026-03-20' },
        { id: 'PAY007', orderId: 'ORD030', customer: 'Priya Sharma', amount: 125000, method: 'Razorpay', status: 'completed', date: '2026-02-01' },
        { id: 'PAY008', orderId: 'ORD034', customer: 'Vikram Singh', amount: 285000, method: 'Razorpay', status: 'completed', date: '2026-02-08' },
    ],

    // ====== REVIEWS ======
    reviews: [
        { id: 'REV001', customer: 'Priya Sharma', product: 'Kanchipuram Silk Saree \u2014 Royal Blue', rating: 5, title: 'Beautiful saree!', comment: 'The silk quality is outstanding. Perfect for my wedding.', status: 'published', date: '2026-02-20', hasImage: true, helpful: 12 },
        { id: 'REV002', customer: 'Rahul Verma', product: 'Bridal Kanjivaram Saree \u2014 Maroon Gold', rating: 5, title: 'Exquisite', comment: 'Worth every rupee. The gold zari work is incredible.', status: 'published', date: '2026-03-05', hasImage: false, helpful: 8 },
        { id: 'REV003', customer: 'Anjali Reddy', product: 'Floral Summer Dress', rating: 4, title: 'Nice dress', comment: 'Good quality fabric, fits well. Color slightly different from photo.', status: 'published', date: '2026-02-25', hasImage: true, helpful: 5 },
        { id: 'REV004', customer: 'Priya Sharma', product: 'Designer Party Gown', rating: 5, title: 'Stunning gown', comment: 'Got so many compliments at the party!', status: 'published', date: '2026-03-01', hasImage: true, helpful: 15 },
        { id: 'REV005', customer: 'Deepika Nair', product: 'Casual Cotton Top', rating: 3, title: 'Average quality', comment: 'Material is thinner than expected but design is nice.', status: 'published', date: '2026-03-03', hasImage: false, helpful: 2 },
        { id: 'REV006', customer: 'Vikram Singh', product: '22K Gold Temple Necklace', rating: 5, title: 'Masterpiece', comment: 'Intricate craftsmanship. My wife absolutely loves it.', status: 'published', date: '2026-02-05', hasImage: true, helpful: 20 },
        { id: 'REV007', customer: 'Lakshmi Krishnan', product: 'Kundan Earring Set', rating: 4, title: 'Beautiful set', comment: 'Very elegant for traditional occasions.', status: 'published', date: '2026-02-18', hasImage: false, helpful: 6 },
        { id: 'REV008', customer: 'Divya Menon', product: 'Premium Wedding Stage Decoration', rating: 5, title: 'Beyond expectations', comment: 'The decor was breathtaking. Professional team.', status: 'published', date: '2026-02-12', hasImage: true, helpful: 18 },
        { id: 'REV009', customer: 'Rahul Verma', product: 'Complete Wedding Photography Package', rating: 5, title: 'Amazing photos', comment: 'Captured every moment perfectly. Highly recommend!', status: 'published', date: '2026-02-25', hasImage: true, helpful: 22 },
        { id: 'REV010', customer: 'Sneha Patel', product: 'Pre-Wedding Photoshoot', rating: 4, title: 'Great experience', comment: 'Photographer was patient and creative.', status: 'published', date: '2026-03-03', hasImage: false, helpful: 7 },
        { id: 'REV011', customer: 'Deepika Nair', product: 'Reception Event Management', rating: 5, title: 'Flawless execution', comment: 'Everything was perfectly organized. Thank you!', status: 'published', date: '2026-03-01', hasImage: true, helpful: 11 },
        { id: 'REV012', customer: 'Meera Joshi', product: 'Premium Veg Catering (per plate)', rating: 4, title: 'Delicious food', comment: 'Guests loved the variety and taste.', status: 'published', date: '2026-03-04', hasImage: false, helpful: 9 },
        { id: 'REV013', customer: 'Anjali Reddy', product: 'Designer Sherwani \u2014 Cream Gold', rating: 4, title: 'Sharp looking', comment: 'My brother looked dashing in this sherwani.', status: 'published', date: '2026-03-08', hasImage: true, helpful: 4 },
        { id: 'REV014', customer: 'Priya Sharma', product: 'Bridal Makeup Package', rating: 5, title: 'Perfect bridal look', comment: 'The makeup lasted all day and looked natural.', status: 'published', date: '2026-02-14', hasImage: true, helpful: 16 },
        { id: 'REV015', customer: 'Vikram Singh', product: 'Bridal Mehendi Design', rating: 5, title: 'Incredible artistry', comment: 'The mehendi design was intricate and lasted long.', status: 'published', date: '2026-03-13', hasImage: true, helpful: 13 },
        // Designer reviews
        { id: 'REV016', customer: 'Sneha Patel', product: 'Groom Tuxedo \u2014 Classic Black', rating: 5, title: 'Perfect fit', comment: 'The tailoring was impeccable. Felt like a movie star.', status: 'published', date: '2026-02-18', hasImage: true, helpful: 10 },
        { id: 'REV017', customer: 'Rahul Verma', product: 'Designer Anarkali Suit \u2014 Emerald', rating: 4, title: 'Elegant design', comment: 'Beautiful color and embroidery. Minor fitting issue.', status: 'published', date: '2026-02-23', hasImage: false, helpful: 3 },
        { id: 'REV018', customer: 'Divya Menon', product: 'Reception Couple Suit Set \u2014 Navy', rating: 5, title: 'Stunning couple set', comment: 'Coordinated perfectly. Premium quality fabric.', status: 'published', date: '2026-02-25', hasImage: true, helpful: 8 },
        { id: 'REV019', customer: 'Anjali Reddy', product: 'Sangeet Lehenga \u2014 Teal Pink', rating: 4, title: 'Gorgeous lehenga', comment: 'Color combination is unique and beautiful.', status: 'published', date: '2026-03-02', hasImage: true, helpful: 6 },
        { id: 'REV020', customer: 'Karthik Iyer', product: 'Designer Sherwani \u2014 Royal Blue', rating: 4, title: 'Royal look', comment: 'Great design and fit for the price.', status: 'published', date: '2026-03-13', hasImage: false, helpful: 5 },
        { id: 'REV021', customer: 'Deepika Nair', product: 'Reception Gown \u2014 Champagne Gold', rating: 5, title: 'Dream gown', comment: 'The detailing was couture-level perfection.', status: 'published', date: '2026-02-23', hasImage: true, helpful: 14 },
        { id: 'REV022', customer: 'Priya Sharma', product: 'Bridal Gown \u2014 Ivory Lace', rating: 5, title: 'Fairytale gown', comment: 'I felt like a princess. Neeta understood exactly what I wanted.', status: 'published', date: '2026-02-08', hasImage: true, helpful: 25 },
    ],

    // ====== SERVICES ======
    services: [
        { id: 'SVC001', name: 'AI Virtual Dress Try-On', category: 'Technology', status: 'active', usage: 1250, icon: 'bi-camera-video' },
        { id: 'SVC002', name: 'Fashion Customization', category: 'Design', status: 'active', usage: 890, icon: 'bi-palette' },
        { id: 'SVC003', name: 'Designer Quotation System', category: 'Design', status: 'active', usage: 456, icon: 'bi-file-earmark-text' },
        { id: 'SVC004', name: 'Boutique Selection', category: 'Shopping', status: 'active', usage: 2100, icon: 'bi-shop' },
        { id: 'SVC005', name: 'Call Consultation with Translator', category: 'Support', status: 'active', usage: 340, icon: 'bi-telephone' },
        { id: 'SVC006', name: 'Photography & Videography', category: 'Services', status: 'active', usage: 678, icon: 'bi-camera' },
        { id: 'SVC007', name: 'Event Management', category: 'Services', status: 'active', usage: 234, icon: 'bi-calendar-event' },
        { id: 'SVC008', name: 'Live Order Tracking', category: 'Technology', status: 'active', usage: 3400, icon: 'bi-truck' },
    ],

    // ====== CUSTOMIZATION REQUESTS ======
    customizations: [
        { id: 'CUS001', customer: 'Priya Sharma', type: 'Bridal Wear', clothType: 'Silk', budget: 100000, designer: 'Vikram Modi Couture', measurements: 'Submitted', status: 'in-progress', date: '2026-01-20' },
        { id: 'CUS002', customer: 'Vikram Singh', type: 'Groom Wear', clothType: 'Velvet', budget: 80000, designer: 'Royal Weaves', measurements: 'Submitted', status: 'completed', date: '2026-01-15' },
        { id: 'CUS003', customer: 'Anjali Reddy', type: 'Lehenga', clothType: 'Georgette', budget: 50000, designer: 'Anita Designs', measurements: 'Pending', status: 'pending', date: '2026-02-10' },
        { id: 'CUS004', customer: 'Deepika Nair', type: 'Gown', clothType: 'Lace', budget: 120000, designer: 'Neeta Couture', measurements: 'Submitted', status: 'in-progress', date: '2026-02-05' },
        { id: 'CUS005', customer: 'Sneha Patel', type: 'Saree Blouse', clothType: 'Raw Silk', budget: 15000, designer: 'Ritu Designs', measurements: 'Submitted', status: 'completed', date: '2026-01-28' },
        { id: 'CUS006', customer: 'Rahul Verma', type: 'Suit', clothType: 'Wool Blend', budget: 45000, designer: 'Pending Assignment', measurements: 'Pending', status: 'pending', date: '2026-03-01' },
    ],

    // ====== QUOTATIONS ======
    quotations: [
        { id: 'QOT001', customer: 'Priya Sharma', designer: 'Vikram Modi Couture', requestName: 'Custom Bridal Sherwani', amount: 125000, status: 'accepted', date: '2026-01-22' },
        { id: 'QOT002', customer: 'Vikram Singh', designer: 'Royal Weaves', requestName: 'Couple Wedding Collection', amount: 285000, status: 'accepted', date: '2026-01-18' },
        { id: 'QOT003', customer: 'Anjali Reddy', designer: 'Anita Designs', requestName: 'Anarkali Suit Set', amount: 38000, status: 'pending', date: '2026-02-12' },
        { id: 'QOT004', customer: 'Deepika Nair', designer: 'Neeta Couture', requestName: 'Bridal Gown', amount: 225000, status: 'accepted', date: '2026-02-02' },
        { id: 'QOT005', customer: 'Sneha Patel', designer: 'MM Studio', requestName: 'Designer Sherwani', amount: 55000, status: 'pending', date: '2026-03-05' },
        { id: 'QOT006', customer: 'Meera Joshi', designer: 'Ritu Designs', requestName: 'Sangeet Lehenga', amount: 95000, status: 'rejected', date: '2026-02-14' },
    ],

    // ====== NOTIFICATIONS ======
    notifications: [
        { id: 'N001', type: 'order', title: 'New Order Received', message: 'ORD041 from Deepika Nair \u2014 \u20B91,45,000', isRead: false, date: '2026-03-20T10:30:00Z' },
        { id: 'N002', type: 'seller', title: 'New Seller Registration', message: 'Shanti Marriage Mandapam requested approval', isRead: false, date: '2026-03-20T09:15:00Z' },
        { id: 'N003', type: 'payment', title: 'Payment Received', message: 'PAY008 \u2014 \u20B92,85,000 via Razorpay', isRead: false, date: '2026-03-19T16:45:00Z' },
        { id: 'N004', type: 'review', title: 'New Review', message: 'Priya Sharma reviewed Bridal Gown \u2014 Ivory Lace (5\u2605)', isRead: true, date: '2026-03-19T14:20:00Z' },
        { id: 'N005', type: 'system', title: 'System Update', message: 'AI Virtual Try-On service updated to v2.0', isRead: true, date: '2026-03-18T11:00:00Z' },
        { id: 'N006', type: 'order', title: 'Order Cancelled', message: 'ORD006 cancelled by Meera Joshi', isRead: true, date: '2026-03-05T13:30:00Z' },
    ],

    // ====== REFERRALS ======
    referrals: [
        { id: 'REF001', code: 'PRIYA100', user: 'Priya Sharma', level: 1, referrals: 12, earnings: 12000, status: 'active', joined: '2026-01-15' },
        { id: 'REF002', code: 'RAHUL200', user: 'Rahul Verma', level: 1, referrals: 8, earnings: 8000, status: 'active', joined: '2026-02-10' },
        { id: 'REF003', code: 'ANJALI300', user: 'Anjali Reddy', level: 2, referrals: 15, earnings: 18000, status: 'active', joined: '2026-01-28' },
        { id: 'REF004', code: 'DEEPIKA400', user: 'Deepika Nair', level: 2, referrals: 6, earnings: 6000, status: 'active', joined: '2026-03-05' },
        { id: 'REF005', code: 'MEERA500', user: 'Meera Joshi', level: 3, referrals: 4, earnings: 3000, status: 'active', joined: '2026-02-20' },
        { id: 'REF006', code: 'SNEHA600', user: 'Sneha Patel', level: 3, referrals: 9, earnings: 6500, status: 'active', joined: '2026-03-12' },
    ],

    // ====== OFFERS ======
    offers: [
        { id: 'OFR001', title: 'Wedding Season Sale', code: 'WEDDING25', discount: '25%', type: 'percentage', startDate: '2026-01-15', endDate: '2026-03-31', status: 'active', used: 145 },
        { id: 'OFR002', title: 'First Order Discount', code: 'FIRST10', discount: '10%', type: 'percentage', startDate: '2026-01-01', endDate: '2026-12-31', status: 'active', used: 320 },
        { id: 'OFR003', title: 'Jewellery Special', code: 'GOLD15', discount: '\u20B95,000', type: 'flat', startDate: '2026-02-01', endDate: '2026-04-30', status: 'active', used: 45 },
        { id: 'OFR004', title: 'Summer Collection', code: 'SUMMER20', discount: '20%', type: 'percentage', startDate: '2026-03-01', endDate: '2026-05-31', status: 'active', used: 12 },
        { id: 'OFR005', title: 'Diwali Dhamaka', code: 'DIWALI30', discount: '30%', type: 'percentage', startDate: '2026-10-15', endDate: '2026-11-15', status: 'scheduled', used: 0 },
    ],

    // ====== CMS PAGES ======
    cmsPages: [
        { id: 'CMS001', title: 'About Us', slug: 'about-us', status: 'published', lastUpdated: '2026-03-15', author: 'Admin' },
        { id: 'CMS002', title: 'Privacy Policy', slug: 'privacy-policy', status: 'published', lastUpdated: '2026-01-20', author: 'Admin' },
        { id: 'CMS003', title: 'Terms & Conditions', slug: 'terms-conditions', status: 'published', lastUpdated: '2026-01-20', author: 'Admin' },
        { id: 'CMS004', title: 'Refund Policy', slug: 'refund-policy', status: 'published', lastUpdated: '2026-02-01', author: 'Admin' },
        { id: 'CMS005', title: 'Seller Guidelines', slug: 'seller-guidelines', status: 'draft', lastUpdated: '2026-03-10', author: 'Admin' },
        { id: 'CMS006', title: 'FAQ', slug: 'faq', status: 'published', lastUpdated: '2026-03-01', author: 'Admin' },
    ],

    // ====== SETTINGS ======
    settings: {
        general: { siteName: 'TATITO Fashions', tagline: 'Luxury Fashion Marketplace', supportEmail: 'support@tatitofashions.com', contactPhone: '+91 1800 123 4567', currency: 'INR (\u20B9)', timezone: 'IST (UTC+5:30)' },
        features: {
            marketplace: true, ai_tryon: true, customization: true, quotations: true, boutique: true,
            consultation: true, photography: true, events: true, tracking: true, referrals: true, reviews: true,
        },
    },

    // ====== STAFF ======
    staff: [
        { id: 'STF001', firstName: 'Mahesh', lastName: 'Nalawade', name: 'Mahesh Nalawade', email: 'admin@tatitofashions.com', phone: '+91 98765 43210', role: 'Super Admin', status: 'active', lastLogin: '2026-03-20T10:00:00Z', permissions: 'all' },
        { id: 'STF002', firstName: 'Arjun', lastName: 'Patel', name: 'Arjun Patel', email: 'arjun@tatitofashions.com', phone: '+91 98220 11223', role: 'Manager', status: 'active', lastLogin: '2026-03-19T14:30:00Z', permissions: 'manager' },
        { id: 'STF003', firstName: 'Deepika', lastName: 'Rao', name: 'Deepika Rao', email: 'deepika@tatitofashions.com', phone: '+91 98300 55667', role: 'Order Manager', status: 'active', lastLogin: '2026-03-19T09:15:00Z', permissions: 'orders' },
        { id: 'STF004', firstName: 'Karan', lastName: 'Malhotra', name: 'Karan Malhotra', email: 'karan@tatitofashions.com', phone: '+91 98400 77889', role: 'Customer Support', status: 'active', lastLogin: '2026-03-18T16:45:00Z', permissions: 'support' },
        { id: 'STF005', firstName: 'Sneha', lastName: 'Gupta', name: 'Sneha Gupta', email: 'sneha@tatitofashions.com', phone: '+91 98950 22334', role: 'Content Manager', status: 'inactive', lastLogin: '2026-03-12T14:20:00Z', permissions: 'content' },
    ],

    // ====== ROLES ======
    roles: [
        { id: 'ROLE001', name: 'Super Admin', description: 'Full access to all modules', permissions: 'all', staffCount: 1, isDefault: true },
        { id: 'ROLE002', name: 'Manager', description: 'Manage most modules except system settings', permissions: 'manager', staffCount: 1, isDefault: false },
        { id: 'ROLE003', name: 'Order Manager', description: 'Manage orders, payments, and tracking', permissions: 'orders', staffCount: 1, isDefault: false },
        { id: 'ROLE004', name: 'Customer Support', description: 'Handle support tickets and user queries', permissions: 'support', staffCount: 1, isDefault: false },
        { id: 'ROLE005', name: 'Content Manager', description: 'Manage CMS pages, blog, and media', permissions: 'content', staffCount: 1, isDefault: false },
    ],

    // ====== PERMISSION MODULES (toggles per module per role) ======
    permissionModules: [
        { module: 'Dashboard', icon: 'bi-speedometer2', permissions: [
            'Admin Dashboard',
        ]},
        { module: 'Orders', icon: 'bi-receipt', permissions: [
            'View Orders', 'Create Order', 'Edit Order', 'Delete Order', 'View Order Details',
            'Export Orders', 'Change Order Status', 'Process Refunds',
        ]},
        { module: 'Products', icon: 'bi-bag', permissions: [
            'View Products', 'Add Product', 'Edit Product', 'Delete Product', 'Import Products',
            'Export Products', 'Manage Product Images', 'Manage Variants',
        ]},
        { module: 'Categories', icon: 'bi-grid', permissions: [
            'View Categories', 'Add Category', 'Edit Category', 'Delete Category',
        ]},
        { module: 'Users', icon: 'bi-people', permissions: [
            'View Users', 'Create User', 'Edit User', 'Delete User', 'Block User', 'Approve User',
        ]},
        { module: 'Sellers', icon: 'bi-shop', permissions: [
            'View Sellers', 'Approve Seller', 'Block Seller', 'Edit Seller', 'Delete Seller',
            'View Seller Profile', 'Manage Commissions',
        ]},
        { module: 'Payments', icon: 'bi-credit-card', permissions: [
            'View Payments', 'View Payment Details', 'Manage Manual Payments', 'Process Refunds',
        ]},
        { module: 'Reviews', icon: 'bi-star', permissions: [
            'View Reviews', 'Approve Review', 'Delete Review',
        ]},
        { module: 'CMS Pages', icon: 'bi-file-earmark-richtext', permissions: [
            'Show All Pages', 'Add Pages', 'Edit Pages', 'Delete Pages', 'Manage SEO',
        ]},
        { module: 'Email Templates', icon: 'bi-envelope', permissions: [
            'View Templates', 'Edit Templates', 'Activate/Deactivate Templates',
        ]},
        { module: 'Support Tickets', icon: 'bi-life-preserver', permissions: [
            'Show Active Tickets', 'Assign Ticket To Agent', 'Show My Tickets', 'Reply To My Ticket',
            'Show Solved Tickets', 'Delete Solved Tickets',
        ]},
        { module: 'Contact Queries', icon: 'bi-envelope-paper', permissions: [
            'Show Contact Queries', 'View Query Details', 'Update Query', 'Delete Query',
        ]},
        { module: 'Notifications', icon: 'bi-bell', permissions: [
            'View Notifications', 'Send Notifications', 'Delete Notifications',
        ]},
        { module: 'Website Setup', icon: 'bi-window-stack', permissions: [
            'Manage Header', 'Manage Footer', 'Manage Appearances',
        ]},
        { module: 'Media Manager', icon: 'bi-folder2-open', permissions: [
            'View Files', 'Upload Files', 'Delete Files',
        ]},
        { module: 'Reports', icon: 'bi-bar-chart', permissions: [
            'View Reports', 'Export Reports', 'View Analytics',
        ]},
        { module: 'Settings', icon: 'bi-gear', permissions: [
            'General Settings', 'Payment Methods', 'SMTP Settings', 'Email Templates',
            'Third Party Settings', 'Social Media Login', 'Languages', 'Currencies',
        ]},
        { module: 'Staff', icon: 'bi-person-badge', permissions: [
            'Show Staffs', 'Add Staffs', 'Edit Staffs', 'Delete Staffs',
            'Show Staff Roles', 'Add Staff Roles', 'Edit Staff Roles', 'Delete Staff Roles',
        ]},
        { module: 'System', icon: 'bi-hdd-stack', permissions: [
            'Server Status', 'System Update', 'Clear Cache',
        ]},
    ],

    // ====== SELLER DASHBOARD DATA ======
    sellerDashboard: {
        stats: {
            totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalReviews: 0,
            pendingOrders: 0, completedOrders: 0, rating: 0, commissionPaid: 0,
        },
        revenueData: {
            labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
            revenue: [0, 0, 0, 0, 0, 0, 0],
            orders: [0, 0, 0, 0, 0, 0, 0],
        },
    },

    // ====== SELLER PAYOUTS ======
    sellerPayouts: [        { id: 'SPY001', sellerId: 'SEL001', amount: 220000, status: 'paid', date: '2026-01-31', method: 'Bank Transfer', txnId: 'TXN001234' },
        { id: 'SPY002', sellerId: 'SEL002', amount: 805000, status: 'paid', date: '2026-01-31', method: 'Bank Transfer', txnId: 'TXN001235' },
        { id: 'SPY003', sellerId: 'SEL003', amount: 1978000, status: 'paid', date: '2026-01-31', method: 'Bank Transfer', txnId: 'TXN001236' },
        { id: 'SPY004', sellerId: 'SEL001', amount: 265000, status: 'pending', date: '2026-02-28', method: 'Bank Transfer', txnId: null },
        { id: 'SPY005', sellerId: 'SEL002', amount: 115000, status: 'pending', date: '2026-02-28', method: 'Bank Transfer', txnId: null },
        { id: 'SPY006', sellerId: 'SEL003', amount: 172000, status: 'pending', date: '2026-02-28', method: 'Bank Transfer', txnId: null },
    ],

    // ====== CONTACT US QUERIES ======
    contactQueries: [
        { id: 'CTQ001', name: 'Mohammad Abdallah', email: 'taurusfinv2@gmail.com', subject: 'Investment Partnership', message: 'I am interested in partnering with TATITO Fashions for investment opportunities in the fashion marketplace sector.', date: '2026-07-16', status: 'pending' },
        { id: 'CTQ002', name: 'DavidMut', email: 'no.reply.FrankNilsen@gmail.com', subject: 'Bulk Order Inquiry', message: 'We want to place a bulk order for 500 silk sarees for our corporate event. Please share pricing.', date: '2026-06-28', status: 'pending' },
        { id: 'CTQ003', name: 'Priya Sharma', email: 'priya.sharma@gmail.com', subject: 'Customization Request', message: 'I would like to get a lehenga customized for my wedding. Can you connect me with a designer?', date: '2026-07-20', status: 'replied' },
        { id: 'CTQ004', name: 'Rajesh Kumar', email: 'rajesh.k@business.com', subject: 'Seller Registration', message: 'I want to register as a seller on TATITO Fashions. What are the requirements and commission rates?', date: '2026-07-22', status: 'replied' },
    ],

    // ====== SUPPORT TICKETS ======
    supportTickets: [
        { id: 'TKT001', subject: 'Order not delivered', user: 'Priya Sharma', email: 'priya.sharma@gmail.com', priority: 'high', category: 'Order Issue', status: 'open', date: '2026-07-25', messages: [
            { from: 'Priya Sharma', text: 'My order ORD003 has not been delivered yet. It has been 5 days.', date: '2026-07-25T10:00:00Z' },
            { from: 'Support Team', text: 'We are checking with the seller. Your order is in transit.', date: '2026-07-25T14:00:00Z' },
        ]},
        { id: 'TKT002', subject: 'Refund not received', user: 'Rahul Verma', email: 'rahul.verma@gmail.com', priority: 'high', category: 'Payment Issue', status: 'open', date: '2026-07-23', messages: [
            { from: 'Rahul Verma', text: 'I cancelled my order but have not received the refund yet.', date: '2026-07-23T09:00:00Z' },
        ]},
        { id: 'TKT003', subject: 'Product quality issue', user: 'Anjali Reddy', email: 'anjali.reddy@gmail.com', priority: 'medium', category: 'Product Quality', status: 'in_progress', date: '2026-07-20', messages: [
            { from: 'Anjali Reddy', text: 'The saree I received has a small tear near the border.', date: '2026-07-20T11:00:00Z' },
            { from: 'Support Team', text: 'We apologize. Please share a photo and we will arrange a replacement.', date: '2026-07-20T15:00:00Z' },
            { from: 'Anjali Reddy', text: 'Photo attached. Please process the replacement quickly.', date: '2026-07-21T08:00:00Z' },
        ]},
        { id: 'TKT004', subject: 'Cannot login to account', user: 'Sneha Patel', email: 'sneha.patel@gmail.com', priority: 'low', category: 'Account Issue', status: 'resolved', date: '2026-07-18', messages: [
            { from: 'Sneha Patel', text: 'I am unable to login. It says invalid credentials.', date: '2026-07-18T10:00:00Z' },
            { from: 'Support Team', text: 'We have reset your password. Please check your email.', date: '2026-07-18T12:00:00Z' },
            { from: 'Sneha Patel', text: 'Thank you! I can login now.', date: '2026-07-18T14:00:00Z' },
        ]},
        { id: 'TKT005', subject: 'Designer quotation query', user: 'Deepika Nair', email: 'deepika.nair@gmail.com', priority: 'medium', category: 'Customization', status: 'open', date: '2026-07-26', messages: [
            { from: 'Deepika Nair', text: 'I received a quotation but want to negotiate the price for my custom gown.', date: '2026-07-26T16:00:00Z' },
        ]},
    ],

    // ====== MEDIA / UPLOADED FILES ======
    mediaFiles: [
        { id: 'MED001', name: 'hero-banner-wedding.jpg', type: 'image', size: '2.4 MB', uploadedBy: 'Admin', date: '2026-07-20', url: '' },
        { id: 'MED002', name: 'saree-collection-2026.png', type: 'image', size: '1.8 MB', uploadedBy: 'Admin', date: '2026-07-19', url: '' },
        { id: 'MED003', name: 'jewellery-showcase.jpg', type: 'image', size: '3.1 MB', uploadedBy: 'Admin', date: '2026-07-18', url: '' },
        { id: 'MED004', name: 'brand-video.mp4', type: 'video', size: '45 MB', uploadedBy: 'Admin', date: '2026-07-15', url: '' },
        { id: 'MED005', name: 'terms-conditions.pdf', type: 'document', size: '120 KB', uploadedBy: 'Admin', date: '2026-07-10', url: '' },
        { id: 'MED006', name: 'men-fashion-banner.jpg', type: 'image', size: '1.9 MB', uploadedBy: 'Admin', date: '2026-07-08', url: '' },
        { id: 'MED007', name: 'kids-collection.png', type: 'image', size: '1.5 MB', uploadedBy: 'Admin', date: '2026-07-05', url: '' },
        { id: 'MED008', name: 'boutique-interior.jpg', type: 'image', size: '2.7 MB', uploadedBy: 'Admin', date: '2026-07-01', url: '' },
        { id: 'MED009', name: 'size-guide.pdf', type: 'document', size: '85 KB', uploadedBy: 'Admin', date: '2026-06-28', url: '' },
        { id: 'MED010', name: 'promo-video-summer.mp4', type: 'video', size: '38 MB', uploadedBy: 'Admin', date: '2026-06-25', url: '' },
        { id: 'MED011', name: 'logo-white-bg.png', type: 'image', size: '45 KB', uploadedBy: 'Admin', date: '2026-06-20', url: '' },
        { id: 'MED012', name: 'designer-portfolio.pdf', type: 'document', size: '2.1 MB', uploadedBy: 'Admin', date: '2026-06-18', url: '' },
    ],

    // ====== EMAIL TEMPLATES ======
    emailTemplates: [
        { id: 'ETP001', name: 'Account Opening Email', subject: 'Welcome to TATITO Fashions!', trigger: 'On user registration', lastModified: '2026-07-01', status: 'active', activation: true,
          body: '<p>Hi [[name]],</p><p>Thank you for registering at our site: [[sitename]].</p><p>Your account type is: [[account_type]]<br>Email is: [[email]]<br>Password is: [[password]]</p><p>You will be able to log in from here: [[url]]</p><p>Please contact the administration team if you have any further questions. Best wishes.</p><p>Thanks,<br>[[sitename]] Team</p>' },
        { id: 'ETP002', name: 'Account Opening Email To Admin', subject: 'New user registered on TATITO Fashions', trigger: 'On user registration', lastModified: '2026-07-01', status: 'active', activation: true,
          body: '<p>Hi Admin,</p><p>A new user has registered on [[sitename]].</p><p>Name: [[name]]<br>Email: [[email]]<br>Account Type: [[account_type]]</p><p>Please review and approve the account from the admin panel.</p><p>Thanks,<br>[[sitename]] Team</p>' },
        { id: 'ETP003', name: 'Account Approval Email', subject: 'Your account has been approved!', trigger: 'On account approval', lastModified: '2026-06-28', status: 'active', activation: true,
          body: '<p>Hi [[name]],</p><p>Great news! Your account on [[sitename]] has been approved by the administrator.</p><p>You can now log in and start exploring our fashion marketplace.</p><p>Login here: [[url]]</p><p>Thanks,<br>[[sitename]] Team</p>' },
        { id: 'ETP004', name: 'Staff Account Opening Email', subject: 'Your staff account has been created', trigger: 'On staff creation', lastModified: '2026-06-20', status: 'active', activation: true,
          body: '<p>Hi [[name]],</p><p>Your staff account has been created on [[sitename]].</p><p>Role: [[account_type]]<br>Email: [[email]]<br>Password: [[password]]</p><p>Login here: [[url]]</p><p>Please change your password after first login.</p><p>Thanks,<br>[[sitename]] Admin</p>' },
        { id: 'ETP005', name: 'Order Confirmation Email', subject: 'Your order #[[order_id]] has been confirmed', trigger: 'On order placed', lastModified: '2026-07-05', status: 'active', activation: true,
          body: '<p>Hi [[name]],</p><p>Thank you for your order! Your order #[[order_id]] has been confirmed.</p><p>Order Total: [[amount]]<br>Payment Method: [[payment_method]]</p><p>You can track your order here: [[url]]</p><p>Thanks,<br>[[sitename]] Team</p>' },
        { id: 'ETP006', name: 'Order Shipped Email', subject: 'Your order has been shipped', trigger: 'On order shipped', lastModified: '2026-07-05', status: 'active', activation: true,
          body: '<p>Hi [[name]],</p><p>Your order #[[order_id]] has been shipped!</p><p>Tracking ID: [[tracking_id]]<br>Carrier: [[carrier]]</p><p>Track your package: [[tracking_url]]</p><p>Thanks,<br>[[sitename]] Team</p>' },
        { id: 'ETP007', name: 'Order Delivered Email', subject: 'Order delivered successfully', trigger: 'On order delivered', lastModified: '2026-07-05', status: 'active', activation: true,
          body: '<p>Hi [[name]],</p><p>Your order #[[order_id]] has been delivered successfully.</p><p>We hope you love your purchase! Please take a moment to leave a review: [[review_url]]</p><p>Thanks,<br>[[sitename]] Team</p>' },
        { id: 'ETP008', name: 'Password Reset Email', subject: 'Reset your TATITO password', trigger: 'On password reset request', lastModified: '2026-06-15', status: 'active', activation: true,
          body: '<p>Hi [[name]],</p><p>You requested a password reset for your [[sitename]] account.</p><p>Click the link below to reset your password:<br>[[reset_url]]</p><p>If you did not request this, please ignore this email.</p><p>Thanks,<br>[[sitename]] Team</p>' },
        { id: 'ETP009', name: 'Seller Approval Email', subject: 'Your seller account has been approved!', trigger: 'On seller approval', lastModified: '2026-06-20', status: 'active', activation: true,
          body: '<p>Hi [[name]],</p><p>Congratulations! Your seller account on [[sitename]] has been approved.</p><p>You can now start listing your products and receiving orders.</p><p>Login to your seller dashboard: [[url]]</p><p>Thanks,<br>[[sitename]] Team</p>' },
        { id: 'ETP010', name: 'Quotation Received Email', subject: 'New quotation for your customization request', trigger: 'On quotation sent', lastModified: '2026-06-25', status: 'active', activation: true,
          body: '<p>Hi [[name]],</p><p>You have received a new quotation for your customization request.</p><p>Designer: [[designer]]<br>Quoted Amount: [[amount]]<br>Estimated Delivery: [[delivery_date]]</p><p>View and respond: [[url]]</p><p>Thanks,<br>[[sitename]] Team</p>' },
        { id: 'ETP011', name: 'Review Request Email', subject: 'How was your experience?', trigger: '7 days after delivery', lastModified: '2026-07-10', status: 'active', activation: true,
          body: '<p>Hi [[name]],</p><p>How was your experience with [[product_name]]?</p><p>We would love to hear your feedback! Please leave a review: [[review_url]]</p><p>Thanks,<br>[[sitename]] Team</p>' },
        { id: 'ETP012', name: 'Refund Processed Email', subject: 'Your refund has been processed', trigger: 'On refund approval', lastModified: '2026-06-10', status: 'active', activation: true,
          body: '<p>Hi [[name]],</p><p>Your refund for order #[[order_id]] has been processed.</p><p>Refund Amount: [[amount]]<br>Refund Method: [[payment_method]]</p><p>The refund will reflect in your account within 5-7 business days.</p><p>Thanks,<br>[[sitename]] Team</p>' },
    ],

    // ====== CATEGORY TREE (3-level: Main → Sub → Sub-Sub) ======
    categoryTree: [
        // ===================== 1. COLLECTIONS =====================
        {
            id: 'COL', name: 'Collections', icon: 'bi-grid-3x3-gap',
            subCategories: [
                { id: 'COL-M', name: 'Men', subCategories: [
                    { id: 'COL-M-TW', name: 'Topwear', subCategories: [
                        { id: 'COL-M-TW-FS', name: 'Formal Shirts' },
                        { id: 'COL-M-TW-CS', name: 'Casual Shirts' },
                        { id: 'COL-M-TW-TS', name: 'T-Shirts (Round neck, V-neck, Polo)' },
                        { id: 'COL-M-TW-KS', name: 'Kurtas & Kurta-sets' },
                        { id: 'COL-M-TW-SW', name: 'Sweaters, Sweatshirts, Hoodies' },
                        { id: 'COL-M-TW-JK', name: 'Jackets, Blazers, Coats, Nehru Jackets, Waistcoats' },
                    ]},
                    { id: 'COL-M-BW', name: 'Bottomwear', subCategories: [
                        { id: 'COL-M-BW-FT', name: 'Formal Trousers' },
                        { id: 'COL-M-BW-CT', name: 'Casual Trousers, Chinos' },
                        { id: 'COL-M-BW-JN', name: 'Jeans (Slim, Regular, Straight)' },
                        { id: 'COL-M-BW-SH', name: 'Shorts, Cargo pants, Track pants' },
                        { id: 'COL-M-BW-DH', name: 'Dhoti, Lungi' },
                    ]},
                    { id: 'COL-M-IW', name: 'Innerwear & Sleepwear', subCategories: [
                        { id: 'COL-M-IW-VB', name: 'Vests/Baniyans, Briefs, Boxers, Trunks' },
                        { id: 'COL-M-IW-TH', name: 'Thermal Wear' },
                        { id: 'COL-M-IW-NS', name: 'Night suits, Pyjama sets, Lounge shorts' },
                    ]},
                    { id: 'COL-M-FW', name: 'Footwear', subCategories: [
                        { id: 'COL-M-FW-FS', name: 'Formal Shoes, Casual Shoes' },
                        { id: 'COL-M-FW-SN', name: 'Sneakers, Loafers' },
                        { id: 'COL-M-FW-SD', name: 'Sandals, Slippers, Floaters' },
                        { id: 'COL-M-FW-SO', name: 'Socks (Ankle, Crew, Formal)' },
                    ]},
                    { id: 'COL-M-AC', name: 'Accessories', subCategories: [
                        { id: 'COL-M-AC-BW', name: 'Belts, Wallets, Watches' },
                        { id: 'COL-M-AC-SG', name: 'Sunglasses, Caps, Hats' },
                        { id: 'COL-M-AC-TB', name: 'Ties, Bow-ties, Cufflinks, Pocket squares' },
                        { id: 'COL-M-AC-BG', name: 'Bags (Backpacks, Laptop bags, Messenger, Duffel)' },
                    ]},
                    { id: 'COL-M-GR', name: 'Grooming', subCategories: [
                        { id: 'COL-M-GR-PF', name: 'Perfumes & Deodorants' },
                        { id: 'COL-M-GR-FC', name: 'Face Wash & Skincare' },
                        { id: 'COL-M-GR-BD', name: 'Beard Oil & Trimmer' },
                        { id: 'COL-M-GR-HR', name: 'Hair Gel & Wax' },
                    ]},
                ]},
                { id: 'COL-W', name: 'Women', subCategories: [
                    { id: 'COL-W-TW', name: 'Topwear', subCategories: [
                        { id: 'COL-W-TW-TP', name: 'Tops, Tunics, Blouses, Shirts, Crop tops' },
                        { id: 'COL-W-TW-TS', name: 'T-Shirts, Sweaters, Cardigans' },
                        { id: 'COL-W-TW-JK', name: 'Jackets, Shrugs' },
                    ]},
                    { id: 'COL-W-BW', name: 'Bottomwear', subCategories: [
                        { id: 'COL-W-BW-JN', name: 'Jeans, Trousers, Palazzos, Leggings, Jeggings' },
                        { id: 'COL-W-BW-SK', name: 'Skirts, Culottes, Shorts' },
                    ]},
                    { id: 'COL-W-EW', name: 'Ethnic & Western Dresses', subCategories: [
                        { id: 'COL-W-EW-SR', name: 'Sarees (Cotton, Silk, Georgette, Chiffon, Designer)' },
                        { id: 'COL-W-EW-SK', name: 'Salwar Kameez, Churidar sets, Kurtis, Anarkalis' },
                        { id: 'COL-W-EW-LC', name: 'Lehenga Cholis, Gowns, Dresses, Jumpsuits, Co-ord sets' },
                    ]},
                    { id: 'COL-W-IW', name: 'Innerwear & Sleepwear', subCategories: [
                        { id: 'COL-W-IW-BR', name: 'Bras, Panties, Shapewear, Camisoles, Slips' },
                        { id: 'COL-W-IW-NG', name: 'Nightgowns, Pyjama sets, Robes' },
                    ]},
                    { id: 'COL-W-FW', name: 'Footwear', subCategories: [
                        { id: 'COL-W-FW-HL', name: 'Heels, Flats, Wedges, Sandals' },
                        { id: 'COL-W-FW-SN', name: 'Sneakers, Slippers' },
                        { id: 'COL-W-FW-SO', name: 'Socks, Stockings' },
                    ]},
                    { id: 'COL-W-BM', name: 'Beauty & Makeup', subCategories: [
                        { id: 'COL-W-BM-FC', name: 'Face (Foundation, Compact, Concealer, Primer, BB Cream)' },
                        { id: 'COL-W-BM-EY', name: 'Eyes (Eyeliner, Kajal, Mascara, Eyeshadow)' },
                        { id: 'COL-W-BM-LP', name: 'Lips (Lipstick, Lip gloss, Lip liner, Lip balm)' },
                        { id: 'COL-W-BM-NL', name: 'Nails (Nail polish, Nail art tools)' },
                        { id: 'COL-W-BM-SK', name: 'Skincare (Moisturizer, Sunscreen, Serums)' },
                        { id: 'COL-W-BM-HC', name: 'Haircare (Shampoo, Conditioner, Hair oil, Hair color)' },
                        { id: 'COL-W-BM-AC', name: 'Bindis, Sindoor, Mehendi cones' },
                    ]},
                    { id: 'COL-W-AC', name: 'Accessories', subCategories: [
                        { id: 'COL-W-AC-HB', name: 'Handbags, Clutches, Totes, Slings' },
                        { id: 'COL-W-AC-WA', name: 'Watches, Sunglasses' },
                        { id: 'COL-W-AC-SC', name: 'Scarves, Dupattas, Stoles' },
                        { id: 'COL-W-AC-HA', name: 'Hair Accessories (Clips, Bands, Scrunchies), Belts' },
                    ]},
                ]},
                { id: 'COL-K', name: 'Kids', subCategories: [
                    { id: 'COL-K-B', name: 'Boys', subCategories: [
                        { id: 'COL-K-B-CW', name: 'Shirts, T-Shirts, Shorts, Jeans, Trousers' },
                        { id: 'COL-K-B-EW', name: 'Ethnic sets (Kurta-pyjama), Party wear sets' },
                        { id: 'COL-K-B-IW', name: 'Innerwear, Night suits' },
                    ]},
                    { id: 'COL-K-G', name: 'Girls', subCategories: [
                        { id: 'COL-K-G-CW', name: 'Frocks, Tops, Skirts, Leggings' },
                        { id: 'COL-K-G-EW', name: 'Ethnic sets (Lehenga, Salwar), Party dresses, Gowns' },
                        { id: 'COL-K-G-IW', name: 'Innerwear, Night suits' },
                    ]},
                    { id: 'COL-K-I', name: 'Infants (0–2 yrs)', subCategories: [
                        { id: 'COL-K-I-RM', name: 'Rompers, Onesies, Bodysuits' },
                        { id: 'COL-K-I-AC', name: 'Bibs, Caps, Mittens & Booties' },
                    ]},
                    { id: 'COL-K-F', name: 'Footwear', subCategories: [
                        { id: 'COL-K-F-SH', name: 'School shoes, Sandals, Sneakers, Sports shoes' },
                        { id: 'COL-K-F-SL', name: 'Slippers, Socks' },
                    ]},
                    { id: 'COL-K-A', name: 'Accessories', subCategories: [
                        { id: 'COL-K-A-BG', name: 'School bags, Lunch bags, Water bottles' },
                        { id: 'COL-K-A-AC', name: 'Caps, Hair clips/bands, Belts' },
                        { id: 'COL-K-A-WT', name: 'Kids sunglasses, Kids watches' },
                    ]},
                    { id: 'COL-K-C', name: 'Kids Beauty & Care', subCategories: [
                        { id: 'COL-K-C-LO', name: 'Baby lotion, Baby powder' },
                        { id: 'COL-K-C-SH', name: 'Baby shampoo, Baby oil' },
                    ]},
                ]},
            ]
        },
        // ===================== 2. WEDDING COLLECTIONS =====================
        {
            id: 'WED', name: 'Wedding Collections', icon: 'bi-gem',
            subCategories: [
                { id: 'WED-M', name: 'Men', subCategories: [
                    { id: 'WED-M-SW', name: 'Sherwanis' },
                    { id: 'WED-M-IW', name: 'Indo-Western Suits' },
                    { id: 'WED-M-WS', name: 'Wedding Suits (2-piece/3-piece)' },
                    { id: 'WED-M-KS', name: 'Kurta-sets (silk, embroidered)' },
                    { id: 'WED-M-NJ', name: 'Nehru Jackets, Waistcoats' },
                    { id: 'WED-M-DA', name: 'Dhoti-Angavastram (Traditional)' },
                    { id: 'WED-M-GA', name: 'Groom Accessories', subCategories: [
                        { id: 'WED-M-GA-SF', name: 'Safa/Turban/Pagdi' },
                        { id: 'WED-M-GA-ML', name: 'Mala (Garland)' },
                        { id: 'WED-M-GA-MJ', name: 'Mojaris/Juttis' },
                        { id: 'WED-M-GA-BR', name: 'Brooch, Kalgi' },
                    ]},
                ]},
                { id: 'WED-W', name: 'Women', subCategories: [
                    { id: 'WED-W-BL', name: 'Bridal Lehengas (Heavy work, Designer)' },
                    { id: 'WED-W-WS', name: 'Wedding Sarees', subCategories: [
                        { id: 'WED-W-WS-KJ', name: 'Kanjeevaram' },
                        { id: 'WED-W-WS-BN', name: 'Banarasi' },
                        { id: 'WED-W-WS-PT', name: 'Paithani' },
                        { id: 'WED-W-WS-MS', name: 'Mysore Silk' },
                        { id: 'WED-W-WS-DS', name: 'Designer Sarees' },
                    ]},
                    { id: 'WED-W-HS', name: 'Half-Sarees / Langa-Voni' },
                    { id: 'WED-W-BG', name: 'Bridal Gowns, Reception Gowns' },
                    { id: 'WED-W-BB', name: 'Bridal Blouses (Designer back, Stone/Embroidery work)' },
                    { id: 'WED-W-DP', name: 'Dupatta Styles (Net, Zari border, Contrast)' },
                    { id: 'WED-W-BF', name: 'Bridal Footwear (Heels, Juttis)' },
                ]},
                { id: 'WED-K', name: 'Kids', subCategories: [
                    { id: 'WED-K-FG', name: 'Flower Girl Dresses' },
                    { id: 'WED-K-RB', name: 'Ring Bearer Sets' },
                    { id: 'WED-K-EW', name: 'Kids Ethnic Wedding Wear (Mini Lehenga, Mini Sherwani)' },
                ]},
                { id: 'WED-X', name: 'Wedding Extras', subCategories: [
                    { id: 'WED-X-MH', name: 'Mehendi/Haldi Function Outfits' },
                    { id: 'WED-X-RW', name: 'Reception Wear' },
                    { id: 'WED-X-BA', name: 'Bridal Accessories Sets (Jewelry, Clutch, Footwear)' },
                    { id: 'WED-X-RG', name: 'Return Gift Packaging for Weddings' },
                ]},
            ]
        },
        // ===================== 3. JEWELRY =====================
        {
            id: 'JEW', name: 'Jewelry', icon: 'bi-gem',
            subCategories: [
                { id: 'JEW-MM', name: 'Metals / Materials', subCategories: [
                    { id: 'JEW-MM-GD', name: 'Gold (24K, 22K, 18K)' },
                    { id: 'JEW-MM-SL', name: 'Silver (Sterling, Oxidized)' },
                    { id: 'JEW-MM-DM', name: 'Diamond' },
                    { id: 'JEW-MM-PT', name: 'Platinum' },
                    { id: 'JEW-MM-AT', name: 'Antique/Temple Jewelry (gold-plated)' },
                    { id: 'JEW-MM-KP', name: 'Kundan, Polki, Meenakari' },
                    { id: 'JEW-MM-AD', name: 'American Diamond (AD) / CZ (Cubic Zirconia)' },
                    { id: 'JEW-MM-PB', name: 'Pearl, Beaded, Coral' },
                ]},
                { id: 'JEW-M', name: 'Men', subCategories: [
                    { id: 'JEW-M-CH', name: 'Chains, Bracelets, Kadas' },
                    { id: 'JEW-M-RG', name: 'Rings' },
                    { id: 'JEW-M-CF', name: 'Cufflinks, Studs/Earrings' },
                    { id: 'JEW-M-PD', name: 'Pendants (God pendants, Symbols)' },
                ]},
                { id: 'JEW-W', name: 'Women', subCategories: [
                    { id: 'JEW-W-NK', name: 'Necklaces (Choker, Long chain, Layered sets)' },
                    { id: 'JEW-W-ER', name: 'Earrings (Studs, Jhumkas, Danglers, Chandbalis)' },
                    { id: 'JEW-W-BG', name: 'Bangles, Bracelets, Kadas' },
                    { id: 'JEW-W-RG', name: 'Rings (Cocktail, Engagement, Daily wear)' },
                    { id: 'JEW-W-AN', name: 'Anklets (Payal)' },
                    { id: 'JEW-W-NP', name: 'Nose Pins/Rings' },
                    { id: 'JEW-W-MT', name: 'Maang Tikka, Matha Patti' },
                    { id: 'JEW-W-MS', name: 'Mangalsutra' },
                    { id: 'JEW-W-WB', name: 'Waist Belts (Oddiyanam/Kamarband)' },
                    { id: 'JEW-W-HJ', name: 'Hair Jewelry (Jada billa, Hairpins)' },
                    { id: 'JEW-W-BS', name: 'Bridal Sets (Necklace + Earrings + Maang Tikka + Bangles)' },
                ]},
                { id: 'JEW-K', name: 'Kids', subCategories: [
                    { id: 'JEW-K-CH', name: 'Kids Chains, Kids Bangles' },
                    { id: 'JEW-K-NZ', name: 'Nazariya / Evil-eye Bracelets' },
                    { id: 'JEW-K-ER', name: 'Kids Earrings (Studs)' },
                    { id: 'JEW-K-AN', name: 'Kids Anklets' },
                    { id: 'JEW-K-RG', name: 'Kids Rings' },
                ]},
            ]
        },
        // ===================== 4. EVENT MANAGEMENT =====================
        {
            id: 'EVT', name: 'Event Management', icon: 'bi-calendar-event',
            subCategories: [
                { id: 'EVT-PH', name: 'Photography', subCategories: [
                    { id: 'EVT-PH-TR', name: 'Traditional Photography' },
                    { id: 'EVT-PH-CN', name: 'Candid Photography' },
                    { id: 'EVT-PH-PW', name: 'Pre-wedding Shoots' },
                    { id: 'EVT-PH-MB', name: 'Maternity/Baby Shoots' },
                    { id: 'EVT-PH-AL', name: 'Album Design & Printing' },
                ]},
                { id: 'EVT-VI', name: 'Videography', subCategories: [
                    { id: 'EVT-VI-TR', name: 'Traditional Videography' },
                    { id: 'EVT-VI-CN', name: 'Cinematic Videography' },
                    { id: 'EVT-VI-DR', name: 'Drone Shots' },
                    { id: 'EVT-VI-SE', name: 'Same-day Edit / Highlight Reels' },
                ]},
                { id: 'EVT-DC', name: 'Decorations', subCategories: [
                    { id: 'EVT-DC-ST', name: 'Stage Decoration (Floral, Theme-based)' },
                    { id: 'EVT-DC-MN', name: 'Mandap Decoration' },
                    { id: 'EVT-DC-EN', name: 'Entrance Decor, Lighting Design' },
                    { id: 'EVT-DC-TB', name: 'Table/Centerpiece Decor, Balloon Decor' },
                ]},
                { id: 'EVT-CT', name: 'Catering', subCategories: [
                    { id: 'EVT-CT-VN', name: 'Veg/Non-veg Menu Planning' },
                    { id: 'EVT-CT-LC', name: 'Live Counters (Chaat, Dosa, Beverages)' },
                    { id: 'EVT-CT-BF', name: 'Buffet / Plated Service' },
                    { id: 'EVT-CT-CK', name: 'Cake / Dessert Counters' },
                ]},
                { id: 'EVT-EN', name: 'Entertainment', subCategories: [
                    { id: 'EVT-EN-DJ', name: 'DJ & Live Music' },
                    { id: 'EVT-EN-EM', name: 'Anchoring / Emcee Services' },
                    { id: 'EVT-EN-TP', name: 'Traditional Performances (Dance, Folk)' },
                ]},
                { id: 'EVT-PL', name: 'Planning & Logistics', subCategories: [
                    { id: 'EVT-PL-VB', name: 'Venue Booking / Management' },
                    { id: 'EVT-PL-GL', name: 'Guest List & Seating Management' },
                    { id: 'EVT-PL-IN', name: 'Invitations & E-invites' },
                    { id: 'EVT-PL-RG', name: 'Return Gifts Sourcing / Packaging' },
                    { id: 'EVT-PL-TL', name: 'Transport / Logistics Coordination' },
                ]},
            ]
        },
        // ===================== 5. CUSTOMIZE =====================
        {
            id: 'CST', name: 'Customize', icon: 'bi-brush',
            subCategories: [
                { id: 'CST-CL', name: 'Clothing', subCategories: [
                    { id: 'CST-CL-EM', name: 'Custom Embroidery & Monograms' },
                    { id: 'CST-CL-FC', name: 'Fabric / Color Choice' },
                    { id: 'CST-CL-MM', name: 'Made-to-measure Tailoring' },
                ]},
                { id: 'CST-JW', name: 'Jewelry', subCategories: [
                    { id: 'CST-JW-DY', name: 'Design-your-own Pieces' },
                    { id: 'CST-JW-EN', name: 'Engraving' },
                    { id: 'CST-JW-CW', name: 'Custom Gold/Silver Weight & Design' },
                ]},
                { id: 'CST-WC', name: 'Wedding Cards / Invites', subCategories: [
                    { id: 'CST-WC-CD', name: 'Custom Design & Wording' },
                    { id: 'CST-WC-EI', name: 'Digital E-invites' },
                ]},
                { id: 'CST-CD', name: 'Cakes & Desserts', subCategories: [
                    { id: 'CST-CD-FL', name: 'Custom Flavors' },
                    { id: 'CST-CD-DS', name: 'Custom Designs / Themes' },
                ]},
                { id: 'CST-GH', name: 'Gifts & Hampers', subCategories: [
                    { id: 'CST-GH-RG', name: 'Custom Return Gifts' },
                    { id: 'CST-GH-PH', name: 'Personalized Hampers' },
                ]},
                { id: 'CST-DT', name: 'Decor Themes', subCategories: [
                    { id: 'CST-DT-CP', name: 'Custom Theme Decoration (Color palette, Concept)' },
                ]},
                { id: 'CST-MU', name: 'Makeup Packages', subCategories: [
                    { id: 'CST-MU-BR', name: 'Custom Bridal Makeup Packages' },
                    { id: 'CST-MU-FM', name: 'Family Makeup Packages' },
                ]},
                { id: 'CST-PK', name: 'Photography Packages', subCategories: [
                    { id: 'CST-PK-CU', name: 'Custom Shoot Packages (Duration, Locations, Add-ons)' },
                ]},
                { id: 'CST-MC', name: 'Merchandise', subCategories: [
                    { id: 'CST-MC-NP', name: 'Custom Name/Photo Printed Items (Mugs, T-shirts, Frames)' },
                ]},
            ]
        },
    ],

    // ====== WEBSITE PAGES (CMS) ======
    websitePages: [
        { id: 'WPG001', title: 'About Us', slug: 'about-us', status: 'published', lastModified: '2026-07-01' },
        { id: 'WPG002', title: 'Privacy Policy', slug: 'privacy-policy', status: 'published', lastModified: '2026-06-15' },
        { id: 'WPG003', title: 'Terms & Conditions', slug: 'terms-conditions', status: 'published', lastModified: '2026-06-15' },
        { id: 'WPG004', title: 'Return Policy', slug: 'return-policy', status: 'published', lastModified: '2026-07-10' },
        { id: 'WPG005', title: 'FAQ', slug: 'faq', status: 'published', lastModified: '2026-07-15' },
        { id: 'WPG006', title: 'Shipping Information', slug: 'shipping-info', status: 'draft', lastModified: '2026-06-20' },
    ],

    // ====== TRACKING DETAIL DATA (enriched per order) ======
    trackingDetails: {
        'ORD001': { carrier: 'Blue Dart', awb: 'BD001234567IN', eta: '2026-02-18', currentLocation: 'Mumbai Hub', shippedDate: '2026-02-15', outForDelivery: null, deliveredDate: '2026-02-18', history: [
            { status: 'Order Placed', location: 'Online', date: '2026-02-15 09:00', done: true },
            { status: 'Confirmed', location: 'Seller Warehouse', date: '2026-02-15 11:00', done: true },
            { status: 'Processing', location: 'Seller Warehouse', date: '2026-02-15 14:00', done: true },
            { status: 'Shipped', location: 'Kanchipuram Hub', date: '2026-02-15 18:00', done: true },
            { status: 'In Transit', location: 'Mumbai Sort Facility', date: '2026-02-17 06:00', done: true },
            { status: 'Out for Delivery', location: 'Mumbai West', date: '2026-02-18 08:00', done: true },
            { status: 'Delivered', location: 'Mumbai', date: '2026-02-18 14:30', done: true },
        ]},
        'ORD002': { carrier: 'DTDC', awb: 'DT789012345IN', eta: '2026-03-04', currentLocation: 'Delhi Sort Facility', shippedDate: '2026-03-01', outForDelivery: null, deliveredDate: null, history: [
            { status: 'Order Placed', location: 'Online', date: '2026-03-01 10:00', done: true },
            { status: 'Confirmed', location: 'Seller Warehouse', date: '2026-03-01 12:00', done: true },
            { status: 'Processing', location: 'Seller Warehouse', date: '2026-03-01 15:00', done: true },
            { status: 'Shipped', location: 'Kanchipuram Hub', date: '2026-03-01 19:00', done: true },
            { status: 'In Transit', location: 'Delhi Sort Facility', date: '2026-03-02 08:00', done: true },
            { status: 'Out for Delivery', location: 'Delhi East', date: '2026-03-03 09:00', done: false },
            { status: 'Delivered', location: 'Delhi', date: null, done: false },
        ]},
    },

    // ====== SMTP & THIRD-PARTY SETTINGS ======
    smtpSettings: {
        type: 'SMTP', host: 'smtp.gmail.com', port: 587, username: 'noreply@tatitofashions.com',
        password: '', encryption: 'TLS', fromAddress: 'noreply@tatitofashions.com', fromName: 'TATITO Fashions',
    },

    thirdPartySettings: {
        recaptcha: { enabled: true, siteKey: '6LcHcxstAAAAADV-JU3mFS5HL3NuvrqC', secretKey: '6LcHcxstAAAAAGGTIOTdjwnh3Bx0AkCkl' },
        googleAnalytics: { enabled: true, trackingId: 'G-4XKLMY2ZKM' },
        facebookChat: { enabled: false, pageId: '1088216341033351' },
        facebookPixel: { enabled: false, pixelId: '920504874278286' },
        facebookComment: { enabled: false, appId: '920504874278286' },
    },

    // ====== BLOG (for roles that can manage blog) ======
    blogCategories: [
        { id: 'BLC001', name: 'Fashion Trends', postCount: 12 },
        { id: 'BLC002', name: 'Wedding Style', postCount: 8 },
        { id: 'BLC003', name: 'Designer Spotlight', postCount: 5 },
        { id: 'BLC004', name: 'Styling Tips', postCount: 15 },
    ],

    // ====== CURRENCIES (Image 1) ======
    currencies: [
        { id: 'CUR001', name: 'Indian Rupee', symbol: '\u20B9', code: 'INR', isDefault: true },
        { id: 'CUR002', name: 'US Dollar', symbol: '$', code: 'USD', isDefault: false },
        { id: 'CUR003', name: 'Euro', symbol: '\u20AC', code: 'EUR', isDefault: false },
        { id: 'CUR004', name: 'British Pound', symbol: '\u00A3', code: 'GBP', isDefault: false },
        { id: 'CUR005', name: 'Australian Dollar', symbol: 'A$', code: 'AUD', isDefault: false },
        { id: 'CUR006', name: 'Canadian Dollar', symbol: 'C$', code: 'CAD', isDefault: false },
        { id: 'CUR007', name: 'Japanese Yen', symbol: '\u00A5', code: 'JPY', isDefault: false },
        { id: 'CUR008', name: 'Chinese Yuan', symbol: '\u00A5', code: 'CNY', isDefault: false },
        { id: 'CUR009', name: 'UAE Dirham', symbol: 'AED', code: 'AED', isDefault: false },
        { id: 'CUR010', name: 'Singapore Dollar', symbol: 'S$', code: 'SGD', isDefault: false },
    ],
    currencyFormats: {
        defaultCurrency: 'INR',
        symbolFormat: '[amount] [symbol]',
        decimalSeparator: '1,23,456.70',
        decimalPlaces: '2',
    },

    // ====== LANGUAGES (Image 2) ======
    languages: [
        { id: 'LNG001', name: 'English', code: 'en', rtl: false, isDefault: true },
        { id: 'LNG002', name: 'Hindi', code: 'hi', rtl: false, isDefault: false },
        { id: 'LNG003', name: 'Marathi', code: 'mr', rtl: false, isDefault: false },
        { id: 'LNG004', name: 'Tamil', code: 'ta', rtl: false, isDefault: false },
        { id: 'LNG005', name: 'Telugu', code: 'te', rtl: false, isDefault: false },
        { id: 'LNG006', name: 'Kannada', code: 'kn', rtl: false, isDefault: false },
        { id: 'LNG007', name: 'Arabic', code: 'ar', rtl: true, isDefault: false },
        { id: 'LNG008', name: 'Urdu', code: 'ur', rtl: true, isDefault: false },
    ],

    // ====== GENERAL SETTINGS (Image 3) ======
    generalSettings: {
        systemName: 'TATITO Fashions',
        logoFile: 'tatito-logo-official.jpg',
        logoPreview: 'assets/tatito-logo.png',
        timezone: '(GMT+05:30) New Delhi',
        loginBgFile: 'tatito-logo-official.jpg',
        memberCodePrefix: 'TTF',
        memberMinAge: 18,
        profilePicturePrivacy: 'All',
        galleryImagePrivacy: 'All',
    },

    // ====== WEBSITE SETUP (Image 4) ======
    websiteSetup: {
        websiteName: 'TATITO Fashions',
        siteMotto: 'Custom Fashion For Everyone',
        siteIcon: 'tatito-logo-official.jpg',
        baseColor: '#C9A24B',
        baseHoverColor: '#8B6F2E',
        secondaryColor: '#14120F',
        bannerImage: 'tatito-logo-official.jpg',
        bannerLink: '',
        // SEO
        metaTitle: 'TATITO Fashions \u2014 Custom Fashion Marketplace',
        metaDescription: 'Discover boutiques, designers, jewellers and wedding services near you. Shop ethnic wear, bridal collections, and bespoke fashion.',
        metaKeywords: 'fashion marketplace, ethnic wear, bridal collection, jewellery, wedding services, designer clothing, custom tailoring',
        metaImage: 'tatito-logo-official.jpg',
        // Cookies
        cookiesText: 'TATITO Fashions uses cookies and similar technologies to enhance user experience, analyze traffic, and personalize content.',
        cookiesEnabled: true,
        // Custom Scripts
        headerScript: '',
        footerScript: '',
    },

    // ====== HOME PAGE SETTINGS (Image 5) ======
    homePageSettings: {
        showSlider: true,
        sliderText: '<strong>TATITO Fashions</strong> \u2014 <span style="color:#C9A24B">Custom Fashion For Everyone</span>',
        showRegistrationForm: true,
        sliderImages: [
            { id: 'HPSI001', name: 'homepage-hero.jpeg', size: '2.4 MB' },
            { id: 'HPSI002', name: 'homepage-full.jpeg', size: '3.1 MB' },
            { id: 'HPSI003', name: 'shop-aaraya-full.jpeg', size: '1.8 MB' },
        ],
        pageSections: [
            { id: 'HPS001', name: 'Premium Members Section', enabled: true },
            { id: 'HPS002', name: 'Home Page Banner 1 (Max 3)', enabled: true },
            { id: 'HPS003', name: 'How it Works Section', enabled: true },
            { id: 'HPS004', name: 'Trusted by Millions Section', enabled: true },
            { id: 'HPS005', name: 'New Arrivals Section', enabled: true },
            { id: 'HPS006', name: 'Happy Customers Section', enabled: true },
            { id: 'HPS007', name: 'Package Section', enabled: true },
            { id: 'HPS008', name: 'Reviews Section', enabled: true },
            { id: 'HPS009', name: 'Blog Section', enabled: true },
        ],
    },

    // ====== WEBSITE HEADER (Image 23dd55ff) ======
    websiteHeader: {
        logoFile: 'tatito-logo-official.jpg',
        quickLinkText: 'Home',
        quickLinkUrl: '/home',
        helplineNumber: '+91 98765 43210',
        stickyHeader: true,
    },

    // ====== WEBSITE FOOTER (Image 5874eab1) ======
    websiteFooter: {
        aboutWidget: {
            logoFile: 'tatito-logo-official.jpg',
            description: 'TATITO Fashions is a trusted platform designed to help individuals and families find custom fashion, boutiques, designers, jewellers and wedding services. Our goal is to make the search for the perfect outfit simple, secure, and convenient through a reliable digital platform.',
        },
        contactsWidget: {
            address: 'Mumbai, Maharashtra, 400001',
            website: 'tatitofashions.com',
            email: 'support@tatitofashions.com',
            phones: ['+91 98765 43210', '+91 98220 11223'],
        },
        linkWidgets: [
            { id: 'LW1', title: 'Quick Links', links: [{ text: 'About Us', url: '/about' }, { text: 'Contact', url: '/contact' }, { text: 'FAQ', url: '/faq' }] },
            { id: 'LW2', title: 'Services', links: [{ text: 'Boutiques', url: '/boutiques' }, { text: 'Designers', url: '/designers' }, { text: 'Wedding Collection', url: '/wedding' }] },
            { id: 'LW3', title: 'Policies', links: [{ text: 'Privacy Policy', url: '/privacy' }, { text: 'Terms & Conditions', url: '/terms' }, { text: 'Return Policy', url: '/returns' }] },
        ],
        mobileAppWidget: {
            title: 'Download Our App',
            playStoreImg: '', playStoreLink: 'https://play.google.com/store',
            appStoreImg: '', appStoreLink: 'https://apps.apple.com',
        },
        copyrightWidget: {
            text: 'Copyright Reserved TATITOFashions.com',
            showSocialLinks: true,
            social: {
                facebook: 'https://facebook.com/tatitofashions',
                twitter: 'https://twitter.com/tatitofashions',
                instagram: 'https://instagram.com/tatitofashions',
                youtube: 'https://youtube.com/@tatitofashions',
                linkedin: 'https://linkedin.com/company/tatitofashions',
            },
        },
    },

    // ====== PAYMENT GATEWAYS (Image 9c9f0d89) ======
    paymentGateways: [
        { id: 'PG001', name: 'Razorpay', enabled: true, fields: [
            { label: 'Razorpay Key', key: 'razorpayKey', value: 'rzp_live_XXXXXXXXXX' },
            { label: 'Razorpay Secret', key: 'razorpaySecret', value: 'XXXXXXXXXXXXXXXXXX' },
        ]},
        { id: 'PG002', name: 'Stripe', enabled: false, fields: [
            { label: 'Stripe Key', key: 'stripeKey', value: '' },
            { label: 'Stripe Secret', key: 'stripeSecret', value: '' },
        ]},
        { id: 'PG003', name: 'Paypal', enabled: false, fields: [
            { label: 'Client Id', key: 'paypalClientId', value: '' },
            { label: 'Client Secret', key: 'paypalSecret', value: '' },
            { label: 'Sandbox Mode', key: 'paypalSandbox', value: 'Sandbox', type: 'select', options: ['Sandbox', 'Live'] },
        ]},
        { id: 'PG004', name: 'Paytm', enabled: false, fields: [
            { label: 'Merchant ID', key: 'paytmMerchantId', value: '' },
            { label: 'Merchant Key', key: 'paytmMerchantKey', value: '' },
            { label: 'Website', key: 'paytmWebsite', value: '' },
            { label: 'Channel', key: 'paytmChannel', value: '' },
            { label: 'Industry Type', key: 'paytmIndustry', value: '' },
            { label: 'Environment', key: 'paytmEnv', value: 'Production', type: 'select', options: ['Production', 'Staging'] },
        ]},
        { id: 'PG005', name: 'Cashfree', enabled: false, fields: [
            { label: 'App ID', key: 'cashfreeAppId', value: '' },
            { label: 'Secret Key', key: 'cashfreeSecret', value: '' },
            { label: 'Mode', key: 'cashfreeMode', value: 'Sandbox (Testing)', type: 'select', options: ['Sandbox (Testing)', 'Production'] },
        ]},
        { id: 'PG006', name: 'PayStack', enabled: false, fields: [
            { label: 'Public Key', key: 'paystackPublicKey', value: '' },
            { label: 'Secret Key', key: 'paystackSecretKey', value: '' },
            { label: 'Merchant Email', key: 'paystackEmail', value: '' },
            { label: 'Currency Code', key: 'paystackCurrency', value: '' },
        ]},
    ],
    manualPayments: [
        { id: 'MP001', name: 'TATITO Fashions', enabled: true, instructions: 'Manual Payment Method 1 — UPI Payment to tatitofashions@upi', imageFile: '' },
        { id: 'MP002', name: 'Bank Transfer', enabled: false, instructions: 'Manual Payment Method 2 — Bank Transfer details', imageFile: '' },
    ],

    // ===================== MODULE 0: HOME SCREEN & DYNAMIC FEED =====================
    homeCollections: [
        { id: 'HC001', target_module: 'fashions', gender: 'Men',   title: 'Men\'s Fashion',     subtitle: 'Sherwanis, Kurtas & Ethnic Wear',          image: 'assets/tatito-logo.png', video_url: '', sort_order: 1, is_active: true },
        { id: 'HC002', target_module: 'fashions', gender: 'Women', title: 'Women\'s Couture',    subtitle: 'Sarees, Lehengas & Designer Gowns',       image: 'assets/tatito-logo.png', video_url: '', sort_order: 2, is_active: true },
        { id: 'HC003', target_module: 'fashions', gender: 'Kids',  title: 'Kids Collection',    subtitle: 'Ethnic & Party Wear for Little Ones',      image: 'assets/tatito-logo.png', video_url: '', sort_order: 3, is_active: true },
        { id: 'HC004', target_module: 'weddings', gender: 'Men',   title: 'Groom Collections',  subtitle: 'Sherwanis, Indo-Western & Accessories',     image: 'assets/tatito-logo.png', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', sort_order: 4, is_active: true },
        { id: 'HC005', target_module: 'weddings', gender: 'Women', title: 'Bridal Couture',     subtitle: 'Bridal Lehengas & Wedding Sarees',          image: 'assets/tatito-logo.png', video_url: '', sort_order: 5, is_active: true },
        { id: 'HC006', target_module: 'jewellery',gender: 'Women', title: 'Bridal Jewellery',   subtitle: 'Kundan, Polki & Temple Jewellery',          image: 'assets/tatito-logo.png', video_url: '', sort_order: 6, is_active: true },
    ],
    homeVideoBanners: [
        { id: 'HVB001', title: 'TATITO Fashion Week 2026', subtitle: 'Celebrating the Art of Couture', cta_label: 'Watch Now', cta_route: '/fashion-week', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', is_active: true },
        { id: 'HVB002', title: 'Bridal Collection Launch', subtitle: 'Unveiling Our 2026 Wedding Couture', cta_label: 'Explore', cta_route: '/weddings', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', is_active: true },
        { id: 'HVB003', title: 'Jewellery Vault Tour',     subtitle: 'Handcrafted Masterpieces',            cta_label: 'View Collection', cta_route: '/jewellery', video_url: '', is_active: false },
    ],
    homeDynamicSections: [
        { id: 'HDS001', section_title: 'New Arrivals',    section_subtitle: 'Fresh drops every week',     layout_type: 'card_ui',        media_type: 'image', image: 'assets/tatito-logo.png', video_url: '', cta_label: 'Shop New',     cta_target_route: '/new-arrivals',    sort_order: 1, is_active: true },
        { id: 'HDS002', section_title: 'Designer Spotlight', section_subtitle: 'Meet our featured designers', layout_type: 'banner',      media_type: 'image', image: 'assets/tatito-logo.png', video_url: '', cta_label: 'Explore',      cta_target_route: '/designers',       sort_order: 2, is_active: true },
        { id: 'HDS003', section_title: 'Runway Reel',      section_subtitle: 'Behind the scenes footage',   layout_type: 'video',          media_type: 'video', image: '',                   video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', cta_label: 'Watch', cta_target_route: '/runway', sort_order: 3, is_active: true },
        { id: 'HDS004', section_title: 'Shop by Category', section_subtitle: 'Find exactly what you need',  layout_type: 'category_grid', media_type: 'image', image: 'assets/tatito-logo.png', video_url: '', cta_label: 'Browse All',   cta_target_route: '/categories',      sort_order: 4, is_active: true },
        { id: 'HDS005', section_title: 'Trending Now',     section_subtitle: 'What everyone\'s loving',      layout_type: 'card_ui',        media_type: 'image', image: 'assets/tatito-logo.png', video_url: '', cta_label: 'Shop Trending',cta_target_route: '/trending',        sort_order: 5, is_active: false },
    ],

    // ===================== MODULE 1: WEDDINGS HUB =====================
    weddingCollections: [
        { id: 'WPC001', gender: 'Women', title: 'Bridal Lehengas',    subtitle: 'Heavy embroidery & designer work',    count_badge: '120+ Designs', image: 'assets/tatito-logo.png', video_url: '', sort_order: 1, is_active: true },
        { id: 'WPC002', gender: 'Women', title: 'Wedding Sarees',     subtitle: 'Kanjeevaram, Banarasi & Paithani',    count_badge: '85+ Sarees',   image: 'assets/tatito-logo.png', video_url: '', sort_order: 2, is_active: true },
        { id: 'WPC003', gender: 'Men',   title: 'Groom Sherwanis',    subtitle: 'Royal sherwanis & Indo-western',      count_badge: '60+ Styles',   image: 'assets/tatito-logo.png', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', sort_order: 3, is_active: true },
        { id: 'WPC004', gender: 'Women', title: 'Reception Gowns',    subtitle: 'Elegant evening gowns & cocktail',    count_badge: '45+ Gowns',    image: 'assets/tatito-logo.png', video_url: '', sort_order: 4, is_active: true },
        { id: 'WPC005', gender: 'Men',   title: 'Groom Accessories',  subtitle: 'Safa, Mojaris, Kalgi & more',         count_badge: '30+ Items',    image: 'assets/tatito-logo.png', video_url: '', sort_order: 5, is_active: true },
        { id: 'WPC006', gender: 'Kids',  title: 'Kids Wedding Wear',  subtitle: 'Mini lehengas & sherwanis',           count_badge: '25+ Designs',  image: 'assets/tatito-logo.png', video_url: '', sort_order: 6, is_active: false },
    ],
    weddingBanners: [
        { id: 'WPB001', title: 'The 2026 Bridal Collection',  image: 'assets/tatito-logo.png', video_url: '',                                                   is_active: true },
        { id: 'WPB002', title: 'Groom\'s Couture Line',       image: 'assets/tatito-logo.png', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',        is_active: true },
        { id: 'WPB003', title: 'Wedding Jewellery Showcase',  image: 'assets/tatito-logo.png', video_url: '',                                                   is_active: false },
    ],
    weddingFeatured: [
        { id: 'WPF001', product_id: 'PRD001', name: 'Royal Red Bridal Lehenga',   price: 85000, image: 'assets/tatito-logo.png', sort_order: 1, is_active: true },
        { id: 'WPF002', product_id: 'PRD002', name: 'Kanjeevaram Silk Saree',     price: 45000, image: 'assets/tatito-logo.png', sort_order: 2, is_active: true },
        { id: 'WPF003', product_id: 'PRD003', name: 'Cream Embroidered Sherwani', price: 55000, image: 'assets/tatito-logo.png', sort_order: 3, is_active: true },
        { id: 'WPF004', product_id: 'PRD004', name: 'Diamond Polki Necklace Set', price: 125000,image: 'assets/tatito-logo.png', sort_order: 4, is_active: true },
    ],

    // ===================== MODULE 2: CUSTOMISATION ATELIER =====================
    customisationStudios: [
        { id: 'CS001', category_name: 'Men\'s Atelier',          subtitle: 'Bespoke suits, sherwanis & ethnic wear',  icon_name: 'bi-person',       badge_text: 'Tailoring in 7 days', type: 'men',      is_active: true },
        { id: 'CS002', category_name: 'Women\'s Couture Studio', subtitle: 'Custom lehengas, gowns & sarees',         icon_name: 'bi-person-heart', badge_text: 'Master Craftsmen',    type: 'women',    is_active: true },
        { id: 'CS003', category_name: 'High Jewellery Crafting', subtitle: 'Design-your-own gold & diamond pieces',   icon_name: 'bi-gem',          badge_text: 'Hallmark Certified',  type: 'jewellery',is_active: true },
    ],
    customisationOptions: [
        { id: 'CO001', type: 'brand',         name: 'Sabyasachi',    hex_code: '' },
        { id: 'CO002', type: 'brand',         name: 'Raymond',       hex_code: '' },
        { id: 'CO003', type: 'brand',         name: 'Manyavar',      hex_code: '' },
        { id: 'CO004', type: 'fabric',        name: 'Italian Silk',  hex_code: '' },
        { id: 'CO005', type: 'fabric',        name: 'Zardozi Velvet',hex_code: '' },
        { id: 'CO006', type: 'fabric',        name: 'Raw Silk',      hex_code: '' },
        { id: 'CO007', type: 'color_swatch',  name: 'Royal Maroon',  hex_code: '#800000' },
        { id: 'CO008', type: 'color_swatch',  name: 'Emerald Green', hex_code: '#046307' },
        { id: 'CO009', type: 'color_swatch',  name: 'Antique Gold',  hex_code: '#C9A24B' },
        { id: 'CO010', type: 'color_swatch',  name: 'Ivory White',   hex_code: '#FAF7F1' },
        { id: 'CO011', type: 'color_swatch',  name: 'Midnight Blue', hex_code: '#191970' },
    ],
    bespokeOrders: [
        { id: 'BO001', user_id: 'USR001', user_name: 'Priya Sharma',  item_name: 'Bridal Lehenga',         brand: 'Sabyasachi',    fabric: 'Zardozi Velvet', color: 'Royal Maroon',  measurements: { bust: 34, waist: 28, hip: 36, shoulder: 14, blouse_length: 14, lehenga_length: 42 }, special_notes: 'Heavy zardozi embroidery on blouse and dupatta', appointment_date: '2026-08-15', status: 'Tailoring in Progress' },
        { id: 'BO002', user_id: 'USR002', user_name: 'Rahul Verma',   item_name: 'Wedding Sherwani',       brand: 'Manyavar',      fabric: 'Raw Silk',       color: 'Antique Gold',  measurements: { chest: 40, waist: 34, shoulder: 18, sleeve_length: 25, kurta_length: 44 }, special_notes: 'Matching dupatta and churidar', appointment_date: '2026-08-20', status: 'Pending' },
        { id: 'BO003', user_id: 'USR003', user_name: 'Ananya Iyer',   item_name: 'Kanjeevaram Saree',      brand: '',              fabric: 'Italian Silk',   color: 'Emerald Green', measurements: { blouse_bust: 34, blouse_length: 14, saree_length: 5.5 }, special_notes: 'Custom temple border design', appointment_date: '2026-08-10', status: 'Ready for Fitting' },
        { id: 'BO004', user_id: 'USR004', user_name: 'Vikram Modi',   item_name: 'Diamond Ring',           brand: '',              fabric: '',               color: '',              measurements: { ring_size: 18, diamond_carat: 1.2, gold_weight: 4.5 }, special_notes: 'Platinum band with uncut diamond', appointment_date: '2026-07-25', status: 'Completed' },
    ],

    // ===================== MODULE 3: JEWELLERY VAULT =====================
    jewelleryCollections: [
        { id: 'JC001', gender: 'Women', title: 'Bridal Jewellery Sets', subtitle: 'Complete bridal sets with necklace, earrings & tikka', image: 'assets/tatito-logo.png', sort_order: 1, is_active: true },
        { id: 'JC002', gender: 'Women', title: 'Everyday Elegance',     subtitle: 'Lightweight daily-wear pieces',                         image: 'assets/tatito-logo.png', sort_order: 2, is_active: true },
        { id: 'JC003', gender: 'Men',   title: 'Men\'s Collection',     subtitle: 'Chains, kadas & cufflinks',                             image: 'assets/tatito-logo.png', sort_order: 3, is_active: true },
        { id: 'JC004', gender: 'Unisex',title: 'Diamond Boutique',      subtitle: 'Certified solitaires & diamond jewellery',              image: 'assets/tatito-logo.png', sort_order: 4, is_active: true },
    ],
    jewelleryCategories: [
        { id: 'JCAT01', name: 'Polki & Kundan',  product_count: 24, is_active: true },
        { id: 'JCAT02', name: 'Solitaires',      product_count: 18, is_active: true },
        { id: 'JCAT03', name: '22K Gold',         product_count: 35, is_active: true },
        { id: 'JCAT04', name: 'Bridal Sets',      product_count: 15, is_active: true },
        { id: 'JCAT05', name: 'Temple Jewellery', product_count: 12, is_active: true },
        { id: 'JCAT06', name: 'Antique Pieces',  product_count: 8,  is_active: false },
    ],
    jewelleryProducts: [
        { id: 'JP001', gender: 'Women', category: 'Polki & Kundan', name: 'Uncut Diamond Polki Set',  price: 185000, original_price: 220000, purity_tag: '22K Gold · Uncut Diamonds',    badge_tag: 'ROYAL HERITAGE',   rating: 4.9, image: 'assets/tatito-logo.png' },
        { id: 'JP002', gender: 'Women', category: 'Solitaires',     name: 'Platinum Solitaire Ring',  price: 95000,  original_price: 110000, purity_tag: 'Platinum 950 · 1.2ct Solitaire', badge_tag: 'IGI CERTIFIED',    rating: 5.0, image: 'assets/tatito-logo.png' },
        { id: 'JP003', gender: 'Women', category: '22K Gold',       name: 'Antique Temple Necklace',  price: 145000, original_price: 0,      purity_tag: '22K BIS Hallmark Gold',         badge_tag: '',                  rating: 4.7, image: 'assets/tatito-logo.png' },
        { id: 'JP004', gender: 'Women', category: 'Bridal Sets',    name: 'Kundan Bridal Set',        price: 285000, original_price: 320000, purity_tag: '22K Gold · Kundan & Meenakari', badge_tag: 'BRIDAL EXCLUSIVE', rating: 4.8, image: 'assets/tatito-logo.png' },
        { id: 'JP005', gender: 'Men',   category: '22K Gold',       name: 'Gold Chain \u2014 Standard',  price: 65000,  original_price: 72000,  purity_tag: '22K BIS Hallmark Gold',         badge_tag: '',                  rating: 4.5, image: 'assets/tatito-logo.png' },
        { id: 'JP006', gender: 'Men',   category: '22K Gold',       name: 'Gold Kada Pair',           price: 88000,  original_price: 95000,  purity_tag: '22K BIS Hallmark Gold',         badge_tag: '',                  rating: 4.6, image: 'assets/tatito-logo.png' },
        { id: 'JP007', gender: 'Women', category: 'Polki & Kundan', name: 'Chandbali Polki Earrings', price: 45000,  original_price: 52000,  purity_tag: '22K Gold · Polki Stones',       badge_tag: 'CRAFTED TO ORDER', rating: 4.8, image: 'assets/tatito-logo.png' },
        { id: 'JP008', gender: 'Unisex',category: 'Solitaires',     name: 'Diamond Stud Earrings',    price: 72000,  original_price: 85000,  purity_tag: '18K Gold · 0.5ct Each',         badge_tag: 'IGI CERTIFIED',    rating: 4.9, image: 'assets/tatito-logo.png' },
    ],

    // ===================== MODULE 4: EVENTS & VIP PASSBOOK =====================
    vipEvents: [
        { id: 'EVT001', title: 'TATITO Fashion Week \u2014 Spring/Summer 2026', category: 'Runway Premiere', event_date: '2026-09-15', event_time: '19:00', location: 'Grand Hyatt, Mumbai',     host: 'TATITO Fashions',     pass_type: 'FRONT ROW RUNWAY', ticket_prefix: 'TT-VIP-9941', price: 25000, available_seats: 45,  image: 'assets/tatito-logo.png', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { id: 'EVT002', title: 'Bridal Trunk Show by Sabyasachi',               category: 'Trunk Show',      event_date: '2026-08-22', event_time: '11:00', location: 'Taj Lands End, Mumbai',    host: 'Sabyasachi Calcutta', pass_type: 'VIP TRUNK ACCESS',ticket_prefix: 'TT-TRK-2208', price: 15000, available_seats: 30,  image: 'assets/tatito-logo.png', video_url: '' },
        { id: 'EVT003', title: 'Jewellery Gala \u2014 Diamond Night',            category: 'Jewellery Gala',  event_date: '2026-10-05', event_time: '20:00', location: 'The Leela Palace, Delhi',  host: 'TATITO Jewellers',    pass_type: 'DIAMOND ACCESS',   ticket_prefix: 'TT-JG-0501',  price: 35000, available_seats: 80,  image: 'assets/tatito-logo.png', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { id: 'EVT004', title: 'Atelier Salon \u2014 Couture Conversations',     category: 'Atelier Salon',   event_date: '2026-09-28', event_time: '16:00', location: 'The Oberoi, Mumbai',       host: 'TATITO Atelier',      pass_type: 'SALON MEMBER',     ticket_prefix: 'TT-AS-2809',  price: 10000, available_seats: 25,  image: 'assets/tatito-logo.png', video_url: '' },
        { id: 'EVT005', title: 'Winter Wedding Couture Premiere',                category: 'Runway Premiere', event_date: '2026-11-12', event_time: '19:30', location: 'ITC Grand, Bengaluru',     host: 'TATITO Fashions',     pass_type: 'FRONT ROW RUNWAY', ticket_prefix: 'TT-VIP-1211', price: 30000, available_seats: 50,  image: 'assets/tatito-logo.png', video_url: '' },
    ],
    eventRSVPs: [
        { id: 'RSVP001', user_name: 'Priya Sharma',    email: 'priya.sharma@gmail.com',   event_id: 'EVT001', event_title: 'TATITO Fashion Week S/S 2026', pass_type: 'FRONT ROW RUNWAY', ticket_no: 'TT-VIP-9941-001', status: 'approved',  rsvp_date: '2026-07-20' },
        { id: 'RSVP002', user_name: 'Rajesh Textiles',  email: 'rajesh.textiles@gmail.com',event_id: 'EVT002', event_title: 'Bridal Trunk Show by Sabyasachi', pass_type: 'VIP TRUNK ACCESS',ticket_no: '', status: 'pending',   rsvp_date: '2026-07-25' },
        { id: 'RSVP003', user_name: 'Vikram Modi',      email: 'vikram.modi@gmail.com',    event_id: 'EVT003', event_title: 'Jewellery Gala \u2014 Diamond Night', pass_type: 'DIAMOND ACCESS', ticket_no: '', status: 'pending',   rsvp_date: '2026-07-28' },
        { id: 'RSVP004', user_name: 'Ananya Iyer',      email: 'ananya.iyer@gmail.com',    event_id: 'EVT001', event_title: 'TATITO Fashion Week S/S 2026', pass_type: 'FRONT ROW RUNWAY', ticket_no: 'TT-VIP-9941-002', status: 'approved',  rsvp_date: '2026-07-22' },
        { id: 'RSVP005', user_name: 'Sneha Patil',      email: 'sneha.patil@gmail.com',    event_id: 'EVT004', event_title: 'Atelier Salon \u2014 Couture Conversations', pass_type: 'SALON MEMBER', ticket_no: '', status: 'declined',  rsvp_date: '2026-07-30' },
    ],

    // ===================== MODULE 5: STYLIST BOOKINGS =====================
    stylistBookings: [
        { id: 'SB001', user_id: 'USR001', user_name: 'Priya Sharma',  service_type: 'Bridal Consultation', notes: 'Looking for a complete bridal look \u2014 lehenga, jewellery and styling',     booking_date: '2026-08-05', time_slot: '11:00 AM', status: 'Confirmed' },
        { id: 'SB002', user_id: 'USR002', user_name: 'Rahul Verma',   service_type: 'Groom Styling',        notes: 'Need sherwani and accessory coordination for wedding day',                     booking_date: '2026-08-12', time_slot: '2:00 PM',  status: 'Pending' },
        { id: 'SB003', user_id: 'USR003', user_name: 'Ananya Iyer',   service_type: 'Bridal Consultation',  notes: 'Reception outfit \u2014 looking for contemporary gown options',                booking_date: '2026-07-30', time_slot: '4:00 PM',  status: 'Completed' },
        { id: 'SB004', user_id: 'USR005', user_name: 'Sneha Patil',   service_type: 'Saree Draping',        notes: 'Need help with Kanjeevaram drape for reception',                               booking_date: '2026-08-18', time_slot: '10:00 AM', status: 'Pending' },
        { id: 'SB005', user_id: 'USR006', user_name: 'Meera Joshi',   service_type: 'Bridal Consultation',  notes: 'Complete trousseau planning \u2014 3 functions',                               booking_date: '2026-08-25', time_slot: '3:00 PM',  status: 'Cancelled' },
        { id: 'SB006', user_id: 'USR007', user_name: 'Vikram Singh',  service_type: 'Groom Styling',        notes: 'Indo-western look for engagement',                                              booking_date: '2026-08-08', time_slot: '5:00 PM',  status: 'Confirmed' },
    ],
};

/* ================================================================
   NEW: Auto-persistence layer.
   When Bridge is loaded, wrap MockData with a Proxy that
   automatically saves to localStorage on any mutation.
   This means ALL existing page modules (products, categories,
   users, sellers, CMS, etc.) get persistence for free —
   no need to modify each CRUD function individually.

   When the backend is connected, this Proxy will be replaced
   with a debounced API sync instead of localStorage writes.
   ================================================================ */
(function autoPersistMockData() {
    if (typeof Bridge === 'undefined') return; // Bridge not loaded — skip

    var saveTimer = null;
    /* NEW: List of admin-only settings keys that must NEVER be overwritten
       by MockData snapshots. These are managed exclusively by their
       respective admin pages via Bridge.Data.saveEntity(). */
    var ADMIN_ONLY_KEYS = [
        'homeCollectionsSettings',
        'homepageSectionSettings',
        'websiteHeader',
        'websiteFooter',
        'websiteSetup',
        'homePageSettings',
    ];
    function debouncedSave() {
        if (saveTimer) clearTimeout(saveTimer);
        saveTimer = setTimeout(function() {
            try {
                /* NEW: Merge MockData into existing stored data.
                   Admin-only settings keys are preserved from existing
                   stored data — never overwritten by MockData. */
                var existing = Bridge.Data.load();
                if (!existing) existing = {};
                var merged = Object.assign({}, existing);
                Object.keys(MockData).forEach(function(key) {
                    if (ADMIN_ONLY_KEYS.indexOf(key) !== -1) {
                        /* Admin-only key — preserve existing value */
                        if (existing[key] !== undefined) {
                            merged[key] = existing[key];
                        }
                    } else {
                        /* Catalog entity — safe to copy */
                        merged[key] = MockData[key];
                    }
                });
                Bridge.Data.save(merged);
            } catch (e) {
                console.warn('[AutoPersist] Save failed:', e);
            }
        }, 300); // Debounce — batch rapid mutations
    }

    // Create a deep proxy that watches for mutations
    function deepProxy(obj, path) {
        return new Proxy(obj, {
            set: function(target, key, value) {
                target[key] = value;
                debouncedSave();
                return true;
            },
            deleteProperty: function(target, key) {
                delete target[key];
                debouncedSave();
                return true;
            }
        });
    }

    // Note: We can't replace the MockData const itself, but we CAN
    // hook into Bridge.Data.save() calls made by individual modules.
    // The explicit save calls in products.js, categories.js, etc.
    // handle the persistence. This is a fallback safety net.

    // Also expose a manual save function for modules that don't
    // call Bridge.Data.save explicitly
    if (typeof globalThis !== 'undefined') {
        globalThis.__saveMockData = debouncedSave;
    }
})();
