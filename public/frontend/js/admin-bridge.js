/* ================================================================
   TATITO FASHIONS — Frontend Bridge (Admin Data Reader)
   NEW: Lightweight read-only bridge for the frontend to access
   admin-managed data (products, offers, settings) stored in
   localStorage by the admin panel's Bridge.Data layer.

   This is intentionally minimal — the frontend only READS admin
   data. It never writes to admin keys.

   When the backend is connected, this file will switch from
   localStorage reads to fetch() calls to the API.
   ================================================================ */

(function (global) {
    'use strict';

    /* NEW: BACKEND_MODE flag — matches admin bridge */
    var BACKEND_MODE = false;
    var API_BASE_URL = '/api/v1';

    /* localStorage keys (must match admin/js/bridge.js KEYS) */
    var ADMIN_DATA_KEY = 'tatito_admin_data';
    var ADMIN_SETTINGS_KEY = 'tatito_admin_settings';

    function _read(key, fallback) {
        try {
            var raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) {
            return fallback;
        }
    }

    var FrontendBridge = {
        BACKEND_MODE: BACKEND_MODE,

        /**
         * NEW: Read the full admin dataset from localStorage.
         * Returns null if no admin data has been saved yet.
         */
        getAdminData: function () {
            if (BACKEND_MODE) {
                // TODO (backend): GET /api/v1/admin/data
            }
            return _read(ADMIN_DATA_KEY, null);
        },

        /**
         * NEW: Get admin-managed products.
         * Returns an empty array if no admin data exists.
         */
        getAdminProducts: function () {
            var data = this.getAdminData();
            if (!data || !data.products) return [];
            return data.products;
        },

        /**
         * NEW: Get admin-managed offers/coupons.
         */
        getAdminOffers: function () {
            var data = this.getAdminData();
            if (!data || !data.offers) return [];
            return data.offers.filter(function(o) {
                return o.status === 'active';
            });
        },

        /**
         * NEW: Get admin-managed categories.
         */
        getAdminCategories: function () {
            var data = this.getAdminData();
            if (!data) return { categories: [], categoryTree: [] };
            return {
                categories: data.categories || [],
                categoryTree: data.categoryTree || []
            };
        },

        /**
         * NEW: Get admin website settings.
         */
        getAdminSettings: function () {
            var stored = _read(ADMIN_SETTINGS_KEY, null);
            if (stored) return stored;
            var data = this.getAdminData();
            return (data && data.settings) ? data.settings : {};
        },

        /**
         * NEW: Get admin header settings (helpline, quick links, etc.)
         */
        getAdminHeader: function () {
            var data = this.getAdminData();
            return (data && data.websiteHeader) ? data.websiteHeader : {};
        },

        /**
         * NEW: Get admin footer settings (about, contacts, social links, etc.)
         */
        getAdminFooter: function () {
            var data = this.getAdminData();
            return (data && data.websiteFooter) ? data.websiteFooter : {};
        },

        /**
         * NEW: Get admin website setup (site name, colors, SEO, etc.)
         */
        getAdminWebsiteSetup: function () {
            var data = this.getAdminData();
            return (data && data.websiteSetup) ? data.websiteSetup : {};
        },

        /**
         * NEW: Convert admin product to frontend product format.
         * Maps admin product fields → frontend product schema
         * so admin-added products appear in the storefront.
         */
        adaptProduct: function (adminProduct) {
            return {
                id: adminProduct.id,
                name: adminProduct.name,
                price: adminProduct.price || 0,
                originalPrice: adminProduct.mrp || adminProduct.price || 0,
                description: adminProduct.description || '',
                image: adminProduct.image || '',
                images: adminProduct.images || (adminProduct.image ? [adminProduct.image] : []),
                variantType: adminProduct.variants && adminProduct.variants.length > 0 ? 'select' : 'none',
                variantLabel: 'Variant',
                variantOptions: adminProduct.variants || [],
                stock: adminProduct.stock || 0,
                category: adminProduct.category || '',
                _source: 'admin'
            };
        },

        /**
         * NEW: Get admin products adapted to frontend format.
         */
        getStorefrontProducts: function () {
            return this.getAdminProducts().map(this.adaptProduct);
        },

        /**
         * NEW: Validate a coupon code against admin offers.
         * Returns the matching offer or null.
         */
        validateCoupon: function (code) {
            var offers = this.getAdminOffers();
            var match = null;
            offers.forEach(function(o) {
                if (o.code.toUpperCase() === code.toUpperCase()) {
                    match = o;
                }
            });
            return match;
        },

        /**
         * NEW: Apply a coupon discount to a cart total.
         * Returns { discount, total, offer } or null if invalid.
         */
        applyCoupon: function (code, cartTotal) {
            var offer = this.validateCoupon(code);
            if (!offer) return null;

            var discount = 0;
            var discountStr = offer.discount || '';
            if (discountStr.indexOf('%') !== -1) {
                var pct = parseFloat(discountStr) || 0;
                discount = Math.round((cartTotal * pct) / 100);
            } else if (discountStr.indexOf('\u20B9') !== -1 || discountStr.indexOf('Rs') !== -1) {
                discount = parseInt(discountStr.replace(/[^\d]/g, '')) || 0;
            }

            return {
                discount: discount,
                total: Math.max(0, cartTotal - discount),
                offer: offer
            };
        },
    };

    /* ================================================================
       STORE INTEGRATION — Inject admin products into the storefront
       Runs immediately when this script loads (after data.js defines
       STORES). Creates a virtual "Tatito Official" store containing
       all admin-managed products adapted to the frontend schema.
       ================================================================ */
    function injectAdminProducts() {
        if (typeof STORES === 'undefined') return;

        var adminProducts = FrontendBridge.getStorefrontProducts();
        if (adminProducts.length === 0) return;

        /* Only include published/active products */
        var visible = adminProducts.filter(function (p) {
            return p.name && p.name.length > 0;
        });
        if (visible.length === 0) return;

        /* Remove existing admin store if present (so we don't duplicate on re-run) */
        var existingIdx = -1;
        for (var i = 0; i < STORES.length; i++) {
            if (STORES[i].id === 'tatito-admin-catalog') { existingIdx = i; break; }
        }
        if (existingIdx !== -1) STORES.splice(existingIdx, 1);

        /* Create virtual store for admin products */
        var adminStore = {
            id: 'tatito-admin-catalog',
            name: 'Tatito Official',
            categoryId: 'collections',
            category: 'Admin Catalog',
            emoji: '👑',
            image: visible[0].image || '',
            rating: 4.5,
            reviewCount: visible.length * 3,
            distance: 0.5,
            open: true,
            badge: 'Admin Managed',
            lat: 19.0760,
            lng: 72.8820,
            description: 'Products curated by the Tatito Admin Panel.',
            tags: ['official', 'admin'],
            products: visible.map(function (p) {
                return {
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    originalPrice: p.originalPrice || undefined,
                    description: p.description || '',
                    image: p.image || '',
                    images: (p.images && p.images.length > 0) ? p.images : (p.image ? [p.image] : []),
                    variantType: p.variantType || 'none',
                    variantLabel: p.variantLabel || 'Variant',
                    variantOptions: p.variantOptions || [],
                    stock: p.stock || 0,
                    _source: 'admin'
                };
            })
        };

        STORES.unshift(adminStore);
    }

    /* Run immediately — data.js has already defined STORES */
    injectAdminProducts();

    /* Also expose so it can be re-run if needed */
    FrontendBridge.injectAdminProducts = injectAdminProducts;

    /* ================================================================
       SETTINGS INTEGRATION — Apply admin-managed site name, colors,
       header helpline, footer content to the frontend.
       Called AFTER renderNavbar/renderFooter by app.js so DOM exists.

       NEW: renderNavbar/renderFooter now build directly from admin
       data, so we no longer need to patch header text, footer text,
       contacts, copyright, or brand name via DOM queries here.
       We only apply things the render functions CAN'T do:
         - Brand colors (CSS variables)
         - SEO meta tags
         - Custom header/footer scripts
       PREV: Also patched .brand-title, .brand-sub, [data-admin-helpline],
       [data-admin-about], [data-admin-address], [data-admin-email],
       [data-admin-phone], [data-admin-copyright] — all now handled
       directly in renderNavbar()/renderFooter().
       ================================================================ */
    function applyAdminSettings() {
        var data = FrontendBridge.getAdminData() || {};
        var ws = data.websiteSetup || {};

        /* ---- Apply brand colors from websiteSetup ---- */
        if (ws.baseColor) document.documentElement.style.setProperty('--ruby', ws.baseColor);
        if (ws.baseHoverColor) document.documentElement.style.setProperty('--ruby-deep', ws.baseHoverColor);
        if (ws.secondaryColor) document.documentElement.style.setProperty('--gold', ws.secondaryColor);

        /* ---- Apply SEO meta tags if set ---- */
        var siteName = ws.websiteName || '';
        if (ws.metaTitle) {
            document.title = ws.metaTitle;
        } else if (siteName) {
            if (document.title.indexOf('Tatito') !== -1) {
                document.title = siteName + ' — ' + (document.title.split('—')[1] || 'Fashion').trim();
            }
        }
        if (ws.metaDescription) {
            var metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.content = ws.metaDescription;
            }
        }
        if (ws.metaKeywords) {
            var metaKeywords = document.querySelector('meta[name="keywords"]');
            if (metaKeywords) {
                metaKeywords.content = ws.metaKeywords;
            }
        }

        /* ---- Apply header/footer custom scripts if set ---- */
        if (ws.headerScript) {
            var head = document.querySelector('head');
            if (head && !document.getElementById('admin-header-script')) {
                var scriptDiv = document.createElement('div');
                scriptDiv.id = 'admin-header-script';
                scriptDiv.innerHTML = ws.headerScript;
                while (scriptDiv.firstChild) {
                    head.appendChild(scriptDiv.firstChild);
                }
            }
        }
        if (ws.footerScript) {
            if (!document.getElementById('admin-footer-script')) {
                var footScriptDiv = document.createElement('div');
                footScriptDiv.id = 'admin-footer-script';
                footScriptDiv.innerHTML = ws.footerScript;
                document.body.appendChild(footScriptDiv);
            }
        }
    }

    FrontendBridge.applyAdminSettings = applyAdminSettings;

    /* ================================================================
       NEW: Homepage integration methods
       These allow the frontend to read admin-managed homepage
       settings (hero slides, section visibility, collection visibility)
       and apply them to the storefront.
       ================================================================ */

    /**
     * NEW: Get admin-managed hero slider slides.
     * Returns slides from homePageSettings.sliderImages ONLY if they
     * are in the new format (have a 'title' field). Old-format file
     * objects ({name, size}) are ignored — frontend uses default HTML.
     * Returns null if no admin override exists.
     */
    FrontendBridge.getAdminHeroSlides = function () {
        var data = this.getAdminData();
        if (!data || !data.homePageSettings) return null;
        var slides = data.homePageSettings.sliderImages;
        if (!slides || slides.length === 0) return null;
        /* Check format: new slides have 'title', old file objects have 'name'/'size' */
        if (!slides[0].title) return null;
        return slides;
    };

    /**
     * NEW: Check if the hero slider should be shown.
     * Returns true unless admin explicitly disabled it.
     */
    FrontendBridge.showHeroSlider = function () {
        var data = this.getAdminData();
        if (!data || !data.homePageSettings) return true;
        return data.homePageSettings.showSlider !== false;
    };

    /**
     * NEW: Get admin-managed homepage section settings.
     * Returns { hidden: [], customTitles: {}, order: {} } or null.
     */
    FrontendBridge.getHomepageSectionSettings = function () {
        var data = this.getAdminData();
        if (!data || !data.homepageSectionSettings) return null;
        return data.homepageSectionSettings;
    };

    /**
     * NEW: Check if a specific homepage section is hidden by admin.
     */
    FrontendBridge.isSectionHidden = function (sectionId) {
        var settings = this.getHomepageSectionSettings();
        if (!settings || !settings.hidden) return false;
        return settings.hidden.indexOf(sectionId) !== -1;
    };

    /**
     * NEW: Get custom title for a homepage section (if admin set one).
     */
    FrontendBridge.getSectionTitle = function (sectionId, defaultTitle) {
        var settings = this.getHomepageSectionSettings();
        if (!settings || !settings.customTitles) return defaultTitle;
        return settings.customTitles[sectionId] || defaultTitle;
    };

    /**
     * NEW: Get admin-managed collection visibility settings.
     * Returns { hidden: [], sortOrder: {} } or null.
     */
    FrontendBridge.getCollectionSettings = function () {
        var data = this.getAdminData();
        if (!data || !data.homeCollectionsSettings) return null;
        return data.homeCollectionsSettings;
    };

    /**
     * NEW: Check if a specific category or store is hidden by admin.
     */
    FrontendBridge.isCollectionHidden = function (itemId) {
        var settings = this.getCollectionSettings();
        if (!settings || !settings.hidden) return false;
        return settings.hidden.indexOf(itemId) !== -1;
    };

    /**
     * NEW: Apply admin hero slider slides to the frontend.
     * If admin has customized the slider via Video Banners page, replace
     * the hardcoded HTML slides with the admin-managed ones.
     * Must run BEFORE initHeroSlider() so the dots/arrows match the new slide count.
     */
    FrontendBridge.applyHeroSlider = function () {
        var slides = this.getAdminHeroSlides();
        if (!slides || slides.length === 0) return; /* No admin override — use default HTML */

        var track = document.getElementById('heroSliderTrack');
        if (!track) return;

        /* Filter out slides admin has toggled off (visible === false) */
        var visibleSlides = slides.filter(function (s) { return s.visible !== false; });

        /* Build slide HTML from admin data */
        track.innerHTML = visibleSlides.map(function (slide, idx) {
            var bg = slide.image
                ? 'background-image:linear-gradient(135deg,rgba(26,18,15,0.55),rgba(90,10,24,0.45)),url(\'' + slide.image + '\');'
                : 'background: linear-gradient(135deg, #1a120f, #5a0a18);';
            return '<div class="hero-slide' + (idx === 0 ? ' active' : '') + '" style="' + bg + '">' +
                '<div class="hero-slide-content">' +
                (slide.tag ? '<span class="hero-slide-tag">' + slide.tag + '</span>' : '') +
                (slide.title ? '<h2 class="hero-slide-title">' + slide.title + '</h2>' : '') +
                (slide.desc ? '<p class="hero-slide-desc">' + slide.desc + '</p>' : '') +
                '<div class="hero-slide-actions">' +
                    (slide.ctaText ? '<a href="' + (slide.ctaLink || '#') + '" class="btn btn-gold-slider">' + slide.ctaText + '</a>' : '') +
                    '<a href="try-on.html" class="btn btn-ghost-slider">Virtual Try-On</a>' +
                '</div>' +
            '</div></div>';
        }).join('');
    };

    /**
     * NEW: Apply admin collection visibility flags to STORES/CATEGORIES.
     * Sets _hidden = true on items admin has toggled off, deletes _hidden
     * on items admin has made visible again.
     * IMPORTANT: Must run BEFORE renderCategories()/renderStores()
     * so the render functions filter them out.
     */
    FrontendBridge.applyCollectionVisibility = function () {
        var self = this;
        if (typeof STORES !== 'undefined') {
            STORES.forEach(function (store) {
                if (self.isCollectionHidden('store-' + store.id)) {
                    store._hidden = true;
                } else {
                    delete store._hidden;
                }
            });
        }
        if (typeof CATEGORIES !== 'undefined') {
            CATEGORIES.forEach(function (cat) {
                if (self.isCollectionHidden(cat.slug)) {
                    cat._hidden = true;
                } else {
                    delete cat._hidden;
                }
            });
        }
    };

    /**
     * NEW: Apply admin homepage section visibility to the DOM.
     * Hides entire homepage sections admin toggled off, applies custom titles.
     * Called from app.js AFTER rendering (this operates on existing DOM elements).
     */
    FrontendBridge.applyHomepageSectionSettings = function () {
        /* Hide toggled-off sections */
        var sectionIds = ['heroSlider', 'categoryGrid', 'featuredProducts', 'dealsProducts', 'storeGrid', 'weddingFeature', 'newsletter'];
        var self = this;
        sectionIds.forEach(function (id) {
            if (self.isSectionHidden(id)) {
                var el = document.getElementById(id);
                if (el) el.style.display = 'none';
            }
        });

        /* NEW: Also check Video Banners master toggle (showSlider).
           If admin turned the slider off from the Video Banners page,
           hide the entire hero slider section. */
        if (!self.showHeroSlider()) {
            var sliderEl = document.getElementById('heroSlider');
            if (sliderEl) sliderEl.style.display = 'none';
        }

        /* Apply custom section titles */
        var titleMap = {
            'categoryGrid': { selector: '#categoryGrid', titleSelector: '.section-head h2' },
            'featuredProducts': { selector: '#featuredProducts', titleSelector: '.section-head h2' },
            'dealsProducts': { selector: '#dealsProducts', titleSelector: '.section-head h2' },
        };
        Object.keys(titleMap).forEach(function (sectionId) {
            var customTitle = self.getSectionTitle(sectionId, null);
            if (customTitle) {
                var container = document.querySelector(titleMap[sectionId].selector);
                if (container) {
                    var titleEl = container.parentElement.querySelector(titleMap[sectionId].titleSelector);
                    if (titleEl) titleEl.textContent = customTitle;
                }
            }
        });
    };

    global.FrontendBridge = FrontendBridge;
})(typeof window !== 'undefined' ? window : this);
