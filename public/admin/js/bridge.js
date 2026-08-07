/* ================================================================
   TATITO FASHIONS — Bridge Layer (Shared Data Abstraction)
   NEW: This is the single data-access layer for both the admin
   panel and the frontend. Right now it uses localStorage so the
   two apps share data without a backend. When the backend is
   connected later, only this file needs to change — every page
   module already calls Bridge.* methods, so switching to API
   calls is a matter of flipping BACKEND_MODE to true and
   implementing the fetch() calls inside each method.

   ## Design goals
   1. Admin writes → localStorage (keyed with `tatito_admin_*`)
   2. Frontend reads admin data via Bridge.read()
   3. Admin reads frontend data via Bridge.readFrontend()
   4. Backend-ready: every method has a BACKEND_MODE branch
   5. Never changes existing MockData or TatitoStore — wraps them

   ## localStorage key map (shared between apps)
   tatito_admin_data       — full admin dataset (products, orders, etc.)
   tatito_admin_settings   — website settings (colors, name, logo)
   tatito_admin_registry   — list of admin accounts + their passwords
   (Frontend keys are managed by TatitoStore: tatito_cart, tatito_orders, etc.)
   ================================================================ */

(function (global) {
    'use strict';

    /* ---- Configuration ---- */
    // NEW: BACKEND_MODE flag. Set to true when the Laravel API is ready.
    // When false, all data flows through localStorage.
    // When true, data flows through fetch() calls to API_BASE_URL.
    var BACKEND_MODE = false;
    var API_BASE_URL = '/api/v1';

    /* ---- localStorage key constants ---- */
    var KEYS = {
        ADMIN_DATA: 'tatito_admin_data',
        ADMIN_SETTINGS: 'tatito_admin_settings',
        ADMIN_REGISTRY: 'tatito_admin_registry',
        // Frontend keys (managed by TatitoStore, read-only from admin)
        FRONTEND_ORDERS: 'tatito_orders',
        FRONTEND_REVIEWS: 'tatito_reviews',
        FRONTEND_USER: 'tatito_user',
        FRONTEND_AUTH: 'tatito_auth',
        FRONTEND_CART: 'tatito_cart',
        FRONTEND_ADDRESSES: 'tatito_addresses',
        FRONTEND_BOOKINGS: 'tatito_bookings',
        FRONTEND_CONTACT: 'tatito_contact_messages',
        FRONTEND_SELLER_APPS: 'tatito_seller_apps',
        FRONTEND_CONSULTATIONS: 'tatito_consultations',
        FRONTEND_NOTIFICATIONS: 'tatito_notifications',
        FRONTEND_CUSTOM_REQUESTS: 'tatito_custom_requests',
    };

    /* ---- Internal helpers ---- */
    function _read(key, fallback) {
        try {
            var raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) {
            console.warn('[Bridge] Failed to read key:', key, e);
            return fallback;
        }
    }

    function _write(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('[Bridge] Failed to write key:', key, e);
            return false;
        }
    }

    function _remove(key) {
        localStorage.removeItem(key);
    }

    /* ================================================================
       AUTH — Admin account registry & session management
       NEW: Shared between frontend login page and admin panel.
       ================================================================ */
    var Auth = {
        /**
         * NEW: Returns the list of registered admin accounts.
         * Checks the admin registry in localStorage first,
         * falls back to MockData.accounts if registry is empty.
         */
        getAccounts: function () {
            if (BACKEND_MODE) {
                // TODO (backend): GET /api/v1/auth/accounts
            }
            var registry = _read(KEYS.ADMIN_REGISTRY, null);
            if (registry && registry.length > 0) return registry;
            // Fallback to MockData accounts (from admin/js/data.js)
            if (typeof MockData !== 'undefined' && MockData.accounts) {
                return MockData.accounts;
            }
            return [];
        },

        /**
         * NEW: Check if an email belongs to an admin/seller account.
         * Called by the frontend login page after login.
         * Returns the matching account object or null.
         */
        checkAdminAccess: function (email) {
            var accounts = this.getAccounts();
            var match = null;
            accounts.forEach(function (a) {
                if (a.email.toLowerCase() === email.toLowerCase()) {
                    match = a;
                }
            });
            return match;
        },

        /**
         * NEW: Set admin session after frontend login verifies the
         * user is an admin. Creates the same session object the admin
         * panel's app.js checks in localStorage.
         */
        setAdminSession: function (account) {
            var session = {
                email: account.email,
                name: account.name,
                role: account.role,
                linkedId: account.linkedId || null,
                loginTime: new Date().toISOString()
            };
            _write('tatito_admin_session', session);
        },

        /**
         * NEW: Check if a valid admin session exists.
         * Used by admin/app.html to gate access.
         */
        hasAdminSession: function () {
            var session = _read('tatito_admin_session', null);
            if (!session) return false;
            if (session.role !== 'admin' && session.role !== 'seller' && session.role !== 'designer') return false;
            // Check session age (24 hour expiry)
            if (session.loginTime) {
                var age = Date.now() - new Date(session.loginTime).getTime();
                if (age > 24 * 60 * 60 * 1000) return false;
            }
            return true;
        },

        /**
         * NEW: Get current admin session data.
         */
        getSession: function () {
            return _read('tatito_admin_session', null);
        },

        /**
         * NEW: Clear admin session (logout).
         */
        clearSession: function () {
            _remove('tatito_admin_session');
        },

        /**
         * NEW: Register a new admin account in the registry.
         * For future use when admin can be created from the panel.
         */
        registerAccount: function (account) {
            if (BACKEND_MODE) {
                // TODO (backend): POST /api/v1/auth/register
            }
            var registry = _read(KEYS.ADMIN_REGISTRY, []);
            registry.push(account);
            _write(KEYS.ADMIN_REGISTRY, registry);
        },
    };

    /* ================================================================
       DATA — Admin dataset persistence (products, orders, etc.)
       NEW: Wraps MockData with localStorage persistence.
       ================================================================ */
    var Data = {
        /**
         * NEW: Load the admin dataset.
         * On first run, seeds from MockData defaults and saves.
         * On subsequent runs, loads from localStorage so changes persist.
         */
        load: function () {
            if (BACKEND_MODE) {
                // TODO (backend): GET /api/v1/admin/data (returns full dataset)
                return Promise.resolve({});
            }
            var stored = _read(KEYS.ADMIN_DATA, null);
            if (stored && Object.keys(stored).length > 0) {
                /* Merge: use persisted data as base, but always refresh
                   catalog entities from MockData so schema changes
                   (e.g. businessName field) are picked up correctly.
                   User-added/edited records in other entities are preserved. */
                if (typeof MockData !== 'undefined') {
                    if (!stored.sellers || (stored.sellers.length > 0 && !stored.sellers[0].businessName)) {
                        stored.sellers = MockData.sellers;
                    }
                    if (!stored.products || (stored.products.length > 0 && !stored.products[0].name)) {
                        stored.products = MockData.products;
                    }
                    if (!stored.categoryTree || (stored.categoryTree.length > 0 && !stored.categoryTree[0].subCategories)) {
                        stored.categoryTree = MockData.categoryTree;
                    }
                    _write(KEYS.ADMIN_DATA, stored);
                }
                return stored;
            }
            // First run — seed from MockData
            if (typeof MockData !== 'undefined') {
                _write(KEYS.ADMIN_DATA, MockData);
                return MockData;
            }
            return {};
        },

        /**
         * NEW: Save the full admin dataset to localStorage.
         */
        save: function (data) {
            if (BACKEND_MODE) {
                // TODO (backend): PUT /api/v1/admin/data
                return Promise.resolve(true);
            }
            _write(KEYS.ADMIN_DATA, data);
            return true;
        },

        /**
         * NEW: Save a single entity (e.g. products, orders) within the dataset.
         * Loads the current dataset, updates the entity array, saves back.
         */
        saveEntity: function (entityName, dataArray) {
            var data = this.load();
            data[entityName] = dataArray;
            this.save(data);
        },

        /**
         * NEW: Get a single entity array from the dataset.
         */
        getEntity: function (entityName) {
            var data = this.load();
            return data[entityName] || [];
        },

        /**
         * NEW: Reset admin data to MockData defaults.
         */
        reset: function () {
            if (typeof MockData !== 'undefined') {
                _write(KEYS.ADMIN_DATA, MockData);
            }
        },

        /**
         * NEW: Clear all admin data from localStorage.
         */
        clear: function () {
            _remove(KEYS.ADMIN_DATA);
        },
    };

    /* ================================================================
       FRONTEND — Read customer-facing data from localStorage
       NEW: Allows the admin panel to see real customer activity.
       ================================================================ */
    var Frontend = {
        /**
         * NEW: Read customer orders placed via the frontend checkout.
         */
        getOrders: function () {
            return _read(KEYS.FRONTEND_ORDERS, []);
        },

        /**
         * NEW: Read customer reviews.
         */
        getReviews: function () {
            return _read(KEYS.FRONTEND_REVIEWS, []);
        },

        /**
         * NEW: Read the currently logged-in frontend user.
         */
        getUser: function () {
            return _read(KEYS.FRONTEND_USER, null);
        },

        /**
         * NEW: Check if frontend user is logged in.
         */
        isAuthed: function () {
            return localStorage.getItem(KEYS.FRONTEND_AUTH) === 'true';
        },

        /**
         * NEW: Read frontend cart contents.
         */
        getCart: function () {
            return _read(KEYS.FRONTEND_CART, []);
        },

        /**
         * NEW: Read frontend saved addresses.
         */
        getAddresses: function () {
            return _read(KEYS.FRONTEND_ADDRESSES, []);
        },

        /**
         * NEW: Read frontend bookings/consultations.
         */
        getBookings: function () {
            return _read(KEYS.FRONTEND_BOOKINGS, []);
        },

        getConsultations: function () {
            return _read(KEYS.FRONTEND_CONSULTATIONS, []);
        },

        /**
         * NEW: Read contact form submissions.
         */
        getContactMessages: function () {
            return _read(KEYS.FRONTEND_CONTACT, []);
        },

        /**
         * NEW: Read seller applications.
         */
        getSellerApps: function () {
            return _read(KEYS.FRONTEND_SELLER_APPS, []);
        },

        /**
         * NEW: Read custom design requests.
         */
        getCustomRequests: function () {
            return _read(KEYS.FRONTEND_CUSTOM_REQUESTS, []);
        },

        /**
         * NEW: Read all frontend localStorage data at once (for admin dashboard).
         */
        getAll: function () {
            return {
                orders: this.getOrders(),
                reviews: this.getReviews(),
                user: this.getUser(),
                cart: this.getCart(),
                addresses: this.getAddresses(),
                bookings: this.getBookings(),
                consultations: this.getConsultations(),
                contactMessages: this.getContactMessages(),
                sellerApps: this.getSellerApps(),
                customRequests: this.getCustomRequests(),
            };
        },
    };

    /* ================================================================
       SETTINGS — Website settings (colors, site name, logo, etc.)
       NEW: Admin can change these; frontend reads them.
       ================================================================ */
    var Settings = {
        /**
         * NEW: Get website settings from localStorage or MockData defaults.
         */
        get: function () {
            if (BACKEND_MODE) {
                // TODO (backend): GET /api/v1/settings
            }
            var stored = _read(KEYS.ADMIN_SETTINGS, null);
            if (stored) return stored;
            if (typeof MockData !== 'undefined' && MockData.settings) {
                return MockData.settings;
            }
            return {};
        },

        /**
         * NEW: Save website settings.
         */
        save: function (settings) {
            if (BACKEND_MODE) {
                // TODO (backend): PUT /api/v1/settings
                return Promise.resolve(true);
            }
            _write(KEYS.ADMIN_SETTINGS, settings);
            return true;
        },
    };

    /* ================================================================
       CATALOG — Read storefront data from frontend data.js
       NEW: Provides admin pages with real frontend data instead of
       MockData. Reads from global arrays (STORES, CATEGORIES, etc.)
       that are loaded via frontend/js/data.js in app.html.
       ================================================================ */
    var Catalog = {
        /**
         * NEW: Returns all storefront categories (CATEGORIES array from frontend data.js).
         * Each item: {slug, name, emoji, image}
         */
        getCategories: function () {
            return (typeof CATEGORIES !== 'undefined') ? CATEGORIES : [];
        },

        /**
         * NEW: Returns all navigation verticals (NAV_VERTICALS from frontend data.js).
         * These are the main mega-menu items on the storefront.
         * Each item: {slug, name, emoji, image}
         */
        getNavVerticals: function () {
            return (typeof NAV_VERTICALS !== 'undefined') ? NAV_VERTICALS : [];
        },

        /**
         * NEW: Returns collection sections (COLLECTION_SECTIONS from frontend data.js).
         * These are the sub-items under "Collections" in the mega-menu.
         * Each item: {slug, name, emoji, image}
         */
        getCollectionSections: function () {
            return (typeof COLLECTION_SECTIONS !== 'undefined') ? COLLECTION_SECTIONS : [];
        },

        /**
         * NEW: Returns all subcategories (SUBCATEGORIES from frontend data.js).
         * Keyed by category slug, each value is array of {group, items[]}
         */
        getSubcategories: function () {
            return (typeof SUBCATEGORIES !== 'undefined') ? SUBCATEGORIES : {};
        },

        /**
         * NEW: Returns all storefront stores (STORES array from frontend data.js).
         * Each store has products[], services[], etc.
         */
        getStores: function () {
            return (typeof STORES !== 'undefined') ? STORES : [];
        },

        /**
         * NEW: Returns all products across all stores, flattened.
         * Each product includes storeId and storeName for reference.
         */
        getProducts: function () {
            if (typeof STORES === 'undefined') return [];
            var products = [];
            STORES.forEach(function (store) {
                if (store.products) {
                    store.products.forEach(function (p) {
                        products.push(Object.assign({}, p, {
                            storeId: store.id,
                            storeName: store.name,
                            storeCategory: store.category || ''
                        }));
                    });
                }
            });
            return products;
        },

        /**
         * NEW: Returns the hero slider slides from the frontend homepage.
         * Reads from MockData.homePageSettings.sliderImages if admin has customized them,
         * otherwise returns the default slides matching the frontend index.html.
         */
        getHeroSlides: function () {
            var data = _read(KEYS.ADMIN_DATA, {});
            if (data.homePageSettings && data.homePageSettings.sliderImages && data.homePageSettings.sliderImages.length > 0) {
                /* Check if sliderImages are in new format (have title field) or old format (file objects with name/size) */
                var first = data.homePageSettings.sliderImages[0];
                if (first.title) {
                    return data.homePageSettings.sliderImages;
                }
                /* Old format — fall through to defaults */
            }
            // Default slides matching frontend index.html
            return [
                { id: 'SL001', tag: '✨ New Collection', title: 'Royal Bridal Collection', desc: 'Handcrafted lehengas, sherwanis & couture for your special day', image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1920&q=80', ctaText: 'Explore Wedding', ctaLink: 'category.html?category=wedding' },
                { id: 'SL002', tag: '👔 Premium Men\'s Wear', title: 'Dapper & Distinctive', desc: 'Sherwanis, kurtas, suits & accessories from top designers near you', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1920&q=80', ctaText: 'Shop Men\'s Wear', ctaLink: 'category.html?category=men-wear' },
                { id: 'SL003', tag: '💍 Exquisite Jewellery', title: 'Timeless Adornments', desc: 'Gold, diamond & traditional pieces from trusted jewellers', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1920&q=80', ctaText: 'Shop Jewellery', ctaLink: 'category.html?category=jewellery' },
            ];
        },

        /**
         * NEW: Returns the actual homepage sections from the frontend.
         * These match the <section> blocks rendered in index.html.
         * Admin can toggle visibility, reorder, and edit titles.
         */
        getHomepageSections: function () {
            return [
                { id: 'heroSlider', title: 'Hero Slider', subtitle: 'Rotating banner with 3 slides', enabled: true, sortOrder: 1 },
                { id: 'categoryGrid', title: 'Shop by Category', subtitle: 'Grid of storefront categories', enabled: true, sortOrder: 2 },
                { id: 'featuredProducts', title: 'Trending Products', subtitle: 'Featured products from all stores', enabled: true, sortOrder: 3 },
                { id: 'dealsProducts', title: 'Deals & Offers', subtitle: 'Limited-time discounted products', enabled: true, sortOrder: 4 },
                { id: 'storeGrid', title: 'Nearby Stores', subtitle: 'Store/boutique directory', enabled: true, sortOrder: 5 },
                { id: 'weddingFeature', title: 'Wedding Collection Feature', subtitle: '3-card feature strip for wedding services', enabled: true, sortOrder: 6 },
                { id: 'newsletter', title: 'Newsletter Signup', subtitle: 'Email subscription form', enabled: true, sortOrder: 7 },
            ];
        },

        /**
         * NEW: Returns all frontend pages that exist on the storefront.
         * Used by the CMS module to show real pages instead of fake ones.
         */
        getFrontendPages: function () {
            return [
                { id: 'FP001', title: 'About Us', slug: 'about', url: 'about.html', exists: true },
                { id: 'FP002', title: 'Careers', slug: 'careers', url: 'careers.html', exists: true },
                { id: 'FP003', title: 'Contact Us', slug: 'contact', url: 'contact.html', exists: true },
                { id: 'FP004', title: 'Shop', slug: 'shop', url: 'shop.html', exists: true },
                { id: 'FP005', title: 'All Products', slug: 'products', url: 'products.html', exists: true },
                { id: 'FP006', title: 'Deals & Offers', slug: 'deals', url: 'deals.html', exists: true },
                { id: 'FP007', title: 'Customize', slug: 'customize', url: 'customize.html', exists: true },
                { id: 'FP008', title: 'AI Try-On', slug: 'try-on', url: 'try-on.html', exists: true },
                { id: 'FP009', title: 'Consultations', slug: 'consultations', url: 'consultations.html', exists: true },
                { id: 'FP010', title: 'Sell on Tatito', slug: 'seller-register', url: 'seller-register.html', exists: true },
                { id: 'FP011', title: 'Referral Program', slug: 'referral', url: 'referral.html', exists: true },
                { id: 'FP012', title: 'Track Orders', slug: 'orders', url: 'orders.html', exists: true },
                { id: 'FP013', title: 'Wishlist', slug: 'wishlist', url: 'wishlist.html', exists: true },
                { id: 'FP014', title: 'Cart', slug: 'cart', url: 'cart.html', exists: true },
                { id: 'FP015', title: 'Checkout', slug: 'checkout', url: 'checkout.html', exists: true },
                { id: 'FP016', title: 'Login', slug: 'login', url: 'login.html', exists: true },
                { id: 'FP017', title: 'Register', slug: 'register', url: 'register.html', exists: true },
                { id: 'FP018', title: 'Profile', slug: 'profile', url: 'profile.html', exists: true },
            ];
        },

        /**
         * NEW: Returns all image assets used by the frontend.
         * Collects images from STORES (store.image + product images) + CATEGORIES.
         */
        getMediaAssets: function () {
            var assets = [];
            var seen = {};

            // Store images
            if (typeof STORES !== 'undefined') {
                STORES.forEach(function (store) {
                    if (store.image && !seen[store.image]) {
                        assets.push({ id: 'MED_STORE_' + store.id, name: store.name + ' — Store Image', url: store.image, type: 'image', source: 'store', storeId: store.id });
                        seen[store.image] = true;
                    }
                    if (store.products) {
                        store.products.forEach(function (p) {
                            if (p.image && !seen[p.image]) {
                                assets.push({ id: 'MED_PROD_' + p.id, name: p.name + ' — Product Image', url: p.image, type: 'image', source: 'product', storeId: store.id });
                                seen[p.image] = true;
                            }
                            if (p.images) {
                                p.images.forEach(function (img, idx) {
                                    if (img && !seen[img]) {
                                        assets.push({ id: 'MED_PROD_' + p.id + '_' + idx, name: p.name + ' — Image ' + (idx+1), url: img, type: 'image', source: 'product-gallery', storeId: store.id });
                                        seen[img] = true;
                                    }
                                });
                            }
                        });
                    }
                });
            }

            // Category images
            if (typeof CATEGORIES !== 'undefined') {
                CATEGORIES.forEach(function (cat) {
                    if (cat.image && !seen[cat.image]) {
                        assets.push({ id: 'MED_CAT_' + cat.slug, name: cat.name + ' — Category Image', url: cat.image, type: 'image', source: 'category' });
                        seen[cat.image] = true;
                    }
                });
            }

            return assets;
        },

        /**
         * NEW: Returns popular cities from frontend data.
         */
        getCities: function () {
            return (typeof POPULAR_CITIES !== 'undefined') ? POPULAR_CITIES : [];
        },
    };

    /* ================================================================
       PUBLIC API
       ================================================================ */
    global.Bridge = {
        BACKEND_MODE: BACKEND_MODE,
        API_BASE_URL: API_BASE_URL,
        KEYS: KEYS,
        Auth: Auth,
        Data: Data,
        Frontend: Frontend,
        Settings: Settings,
        Catalog: Catalog,
    };
})(typeof window !== 'undefined' ? window : this);
