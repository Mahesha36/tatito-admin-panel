/* TATITO FASHIONS — Admin Panel Controller */

const App = {
    currentPage: 'dashboard',
    charts: {},
    pages: {},
    _dataTables: [],

    navConfig: [
        { section: 'Dashboard', icon: 'bi-speedometer2', items: [
            { id: 'dashboard', label: 'Dashboard', icon: 'bi-house-door' },
            { id: 'reports', label: 'Reports & Analytics', icon: 'bi-bar-chart-line' },
            { id: 'tracking', label: 'Live Order Tracking', icon: 'bi-geo-alt' },
        ]},
        { section: 'Catalog', icon: 'bi-tags', items: [
            { id: 'categories', label: 'Categories', icon: 'bi-grid' },
            { id: 'products', label: 'Products', icon: 'bi-bag' },
        ]},
        { section: 'Sales', icon: 'bi-cart3', items: [
            { id: 'orders', label: 'Orders', icon: 'bi-receipt' },
            { id: 'bookings', label: 'Bookings', icon: 'bi-calendar-check' },
            { id: 'payments', label: 'Payments', icon: 'bi-credit-card' },
            { id: 'refunds', label: 'Refunds', icon: 'bi-cash-coin' },
        ]},
        { section: 'Members', icon: 'bi-people', items: [
            { id: 'approvals', label: 'Approvals', icon: 'bi-person-check' },
            { id: 'users', label: 'Customers', icon: 'bi-people' },
            { id: 'sellers', label: 'Sellers', icon: 'bi-shop' },
            { id: 'designers', label: 'Designers', icon: 'bi-palette' },
        ]},
        { section: 'Services', icon: 'bi-stars', items: [
            { id: 'boutiques', label: 'Boutiques', icon: 'bi-shop-window' },
            { id: 'customizations', label: 'Customizations', icon: 'bi-brush' },
            { id: 'quotations', label: 'Quotations', icon: 'bi-file-text' },
            { id: 'consultations', label: 'Consultations', icon: 'bi-headset' },
            { id: 'photography', label: 'Photography', icon: 'bi-camera' },
            { id: 'events', label: 'Event Management', icon: 'bi-calendar-event' },
        ]},
        { section: 'Marketing', icon: 'bi-megaphone', items: [
            { id: 'reviews', label: 'Reviews & Ratings', icon: 'bi-star' },
            { id: 'referrals', label: 'Referral Program', icon: 'bi-diagram-3' },
            { id: 'offers', label: 'Offers & Coupons', icon: 'bi-tag' },
            { id: 'notifications', label: 'Notifications', icon: 'bi-bell' },
        ]},
        { section: 'Support', icon: 'bi-life-preserver', items: [
            { id: 'contactQueries', label: 'Contact Queries', icon: 'bi-envelope' },
            { id: 'supportTickets', label: 'Support Tickets', icon: 'bi-chat-dots' },
        ]},
        { section: 'Staff', icon: 'bi-person-badge', items: [
            { id: 'staff', label: 'All Staff', icon: 'bi-people' },
            { id: 'roles', label: 'Staff Roles', icon: 'bi-shield-lock' },
        ]},
        { section: 'Website', icon: 'bi-window-stack', items: [
            { id: 'cms', label: 'CMS Pages', icon: 'bi-file-earmark-richtext' },
            { id: 'website-header', label: 'Header', icon: 'bi-window' },
            { id: 'website-footer', label: 'Footer', icon: 'bi-layout-text-window-reverse' },
            { id: 'websiteSetup', label: 'Website Setup', icon: 'bi-palette2' },
            { id: 'homePageSettings', label: 'Home Page Settings', icon: 'bi-house-gear' },
            { id: 'mediaManager', label: 'Media Manager', icon: 'bi-folder2-open' },
        ]},
        { section: 'Home Feed', icon: 'bi-house-door', items: [
            { id: 'home-collections', label: 'Home Collections', icon: 'bi-collection' },
            { id: 'home-video-banners', label: 'Video Banners', icon: 'bi-camera-video' },
            { id: 'home-dynamic-sections', label: 'Dynamic Layout', icon: 'bi-layout-text-window' },
        ]},
        { section: 'Weddings Hub', icon: 'bi-gem', items: [
            { id: 'wedding-collections', label: 'Collections', icon: 'bi-grid-3x3-gap' },
            { id: 'wedding-banners', label: 'Banners', icon: 'bi-image' },
            { id: 'wedding-featured', label: 'Featured Couture', icon: 'bi-star' },
        ]},
        { section: 'Customise', icon: 'bi-brush', items: [
            { id: 'customisation-studios', label: 'Studios', icon: 'bi-shop-window' },
            { id: 'customisation-options', label: 'Options & Swatches', icon: 'bi-palette' },
            { id: 'bespoke-orders', label: 'Bespoke Orders', icon: 'bi-scissors' },
        ]},
        { section: 'Jewellery Vault', icon: 'bi-gem', items: [
            { id: 'jewellery-collections', label: 'Collections', icon: 'bi-collection' },
            { id: 'jewellery-categories', label: 'Categories', icon: 'bi-grid' },
            { id: 'jewellery-products', label: 'Products', icon: 'bi-gem' },
        ]},
        { section: 'VIP Events', icon: 'bi-calendar2-event', items: [
            { id: 'events-vip', label: 'Event Calendar', icon: 'bi-calendar-event' },
            { id: 'event-rsvps', label: 'RSVPs', icon: 'bi-ticket-perforated' },
        ]},
        { section: 'Stylist', icon: 'bi-person-rolodex', items: [
            { id: 'stylist-bookings', label: 'Bookings', icon: 'bi-calendar2-check' },
        ]},
        { section: 'Settings', icon: 'bi-gear', items: [
            { id: 'settings', label: 'General Settings', icon: 'bi-sliders' },
            { id: 'payment-setup', label: 'Payment Setup', icon: 'bi-credit-card-2-front' },
            { id: 'currencies', label: 'Currencies', icon: 'bi-currency-exchange' },
            { id: 'languages', label: 'Languages', icon: 'bi-translate' },
            { id: 'emailTemplates', label: 'Email Templates', icon: 'bi-mailbox' },
        ]},
    ],

    init() {
        /* ========================================================
           NEW: Session check via Bridge.Auth (supports both
           frontend login and legacy admin login).
           PREV code:
           var saved = localStorage.getItem('tatito_admin_session');
           if (!saved) { window.location.href = 'index.html'; return; }
           var session = JSON.parse(saved);
           if (session.role !== 'admin') { window.location.href = 'index.html'; return; }
           ======================================================== */
        if (typeof Bridge !== 'undefined' && !Bridge.Auth.hasAdminSession()) {
            window.location.href = 'index.html';
            return;
        }
        var session = (typeof Bridge !== 'undefined')
            ? Bridge.Auth.getSession()
            : JSON.parse(localStorage.getItem('tatito_admin_session') || '{}');
        if (!session) { window.location.href = 'index.html'; return; }

        /* NEW: Load persisted admin data from localStorage via Bridge.
           This ensures changes survive page reloads.
           If no saved data exists, Bridge seeds from MockData defaults. */
        if (typeof Bridge !== 'undefined') {
            var persisted = Bridge.Data.load();
            // Merge persisted data into MockData so all page modules work unchanged
            if (persisted) {
                Object.keys(persisted).forEach(function(key) {
                    MockData[key] = persisted[key];
                });
            }
        }

        // Set user info
        var nameEl = document.getElementById('sidebarUserName');
        var roleEl = document.getElementById('sidebarUserRole');
        var avatarEl = document.getElementById('sidebarAvatar');
        if (nameEl) nameEl.textContent = session.name || 'Admin';
        if (roleEl) roleEl.textContent = 'Administrator';
        if (avatarEl) avatarEl.textContent = (session.name || 'A').charAt(0).toUpperCase();

        this.buildSidebar();
        I18n.init();

        var hash = window.location.hash.replace('#', '');
        this.navigate(hash || 'dashboard');

        window.addEventListener('hashchange', function() {
            App.navigate(window.location.hash.replace('#', '') || 'dashboard');
        });
    },

    _expandedSections: {},

    buildSidebar() {
        var self = this;
        // Auto-expand the section containing the current page
        this.navConfig.forEach(function(section, idx) {
            var hasActive = section.items.some(function(item) { return item.id === self.currentPage; });
            if (hasActive) self._expandedSections['sec-' + idx] = true;
        });

        var html = '';
        this.navConfig.forEach(function(section, idx) {
            var secId = 'sec-' + idx;
            var isExpanded = self._expandedSections[secId];
            var hasActive = section.items.some(function(item) { return item.id === self.currentPage; });
            html += '<div class="nav-group' + (isExpanded ? ' expanded' : '') + (hasActive ? ' has-active' : '') + '" data-sec="' + secId + '">';
            html += '<a href="javascript:void(0)" class="nav-group-header" onclick="App.toggleSection(\'' + secId + '\')">';
            html += '<i class="bi ' + section.icon + ' nav-group-icon"></i>';
            html += '<span>' + section.section + '</span>';
            html += '<i class="bi bi-chevron-down nav-group-chevron' + (isExpanded ? ' rotated' : '') + '"></i>';
            html += '</a>';
            html += '<div class="nav-group-items" style="display:' + (isExpanded ? 'block' : 'none') + '">';
            section.items.forEach(function(item) {
                html += '<a href="#' + item.id + '" class="nav-item ' + (self.currentPage === item.id ? 'active' : '') + '" data-page="' + item.id + '">' +
                    '<i class="bi ' + item.icon + '"></i><span>' + item.label + '</span></a>';
            });
            html += '</div></div>';
        });
        var navEl = document.getElementById('sidebarNav');
        if (navEl) navEl.innerHTML = html;
    },

    toggleSection(secId) {
        var group = document.querySelector('.nav-group[data-sec="' + secId + '"]');
        if (!group) return;
        var items = group.querySelector('.nav-group-items');
        var chevron = group.querySelector('.nav-group-chevron');
        var isExpanded = items.style.display !== 'none';
        if (isExpanded) {
            items.style.display = 'none';
            chevron.classList.remove('rotated');
            group.classList.remove('expanded');
            this._expandedSections[secId] = false;
        } else {
            items.style.display = 'block';
            chevron.classList.add('rotated');
            group.classList.add('expanded');
            this._expandedSections[secId] = true;
        }
    },

    navigate(pageId) {
        /* NEW: Sync MockData changes to localStorage before navigating.
           IMPORTANT: Only sync MockData entities (products, orders, etc.)
           Do NOT overwrite admin-only settings keys (homeCollectionsSettings,
           homepageSectionSettings, etc.) that MockData doesn't have. */
        if (typeof __saveMockData === 'function') __saveMockData();
        if (typeof Bridge !== 'undefined') {
            var existing = Bridge.Data.load();
            if (!existing) existing = {};
            /* Merge: persisted data is the base. Only copy MockData keys
               that represent catalog entities (not admin-only settings). */
            var merged = Object.assign({}, existing);
            if (typeof MockData !== 'undefined') {
                Object.keys(MockData).forEach(function(key) {
                    /* Skip admin-only settings keys — these are managed
                       exclusively by their respective pages via
                       Bridge.Data.saveEntity() and should never be
                       overwritten by MockData snapshots. */
                    if (key === 'homeCollectionsSettings' ||
                        key === 'homepageSectionSettings' ||
                        key === 'websiteHeader' ||
                        key === 'websiteFooter' ||
                        key === 'websiteSetup' ||
                        key === 'homePageSettings') {
                        /* Preserve existing value, don't copy from MockData */
                        if (existing[key] !== undefined) {
                            merged[key] = existing[key];
                        }
                    } else {
                        /* Catalog entity — safe to copy from MockData */
                        merged[key] = MockData[key];
                    }
                });
            }
            Bridge.Data.save(merged);
        }

        this.currentPage = pageId;
        // Find label
        var label = pageId;
        for (var i = 0; i < this.navConfig.length; i++) {
            for (var j = 0; j < this.navConfig[i].items.length; j++) {
                if (this.navConfig[i].items[j].id === pageId) { label = this.navConfig[i].items[j].label; break; }
            }
        }
        var titleEl = document.getElementById('pageTitle');
        if (titleEl) titleEl.textContent = label;
        this.buildSidebar();

        // Update active state
        document.querySelectorAll('#sidebarNav .nav-item').forEach(function(el) {
            el.classList.toggle('active', el.dataset.page === pageId);
        });

        this.destroyAll();

        var container = document.getElementById('pageContent');
        if (!container) return;
        container.innerHTML = '<div class="loading-state"><i class="bi bi-arrow-repeat"></i> Loading...</div>';

        var pageFn = this.pages[pageId];
        if (pageFn && typeof pageFn === 'function') {
            try { pageFn.call(this); }
            catch (e) { container.innerHTML = '<div class="empty-state"><i class="bi bi-exclamation-triangle"></i><p>Error: ' + e.message + '</p></div>'; }
        } else if (pageFn && pageFn.render && typeof pageFn.render === 'function') {
            try { pageFn.render.call(this); }
            catch (e) { container.innerHTML = '<div class="empty-state"><i class="bi bi-exclamation-triangle"></i><p>Error: ' + e.message + '</p></div>'; }
        } else {
            container.innerHTML = '<div class="empty-state"><i class="bi bi-inbox"></i><p>Page not found.</p></div>';
        }
    },

    destroyAll() {
        // Destroy DataTables
        if (typeof $ !== 'undefined' && $.fn.DataTable) {
            $.fn.DataTable.tables().forEach(function(t) {
                try { $(t).DataTable().destroy(); } catch(e) {}
            });
        }
        // Destroy charts
        Object.keys(this.charts).forEach(function(key) {
            if (App.charts[key]) { try { App.charts[key].destroy(); } catch(e){} delete App.charts[key]; }
        });
        // Sweep all canvases
        if (typeof Chart !== 'undefined') {
            document.querySelectorAll('canvas').forEach(function(c) {
                var existing = Chart.getChart(c);
                if (existing) { try { existing.destroy(); } catch(e){} }
            });
        }
    },

    toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('open');
        document.getElementById('sidebarOverlay').classList.toggle('show');
    },

    toggleLangDropdown(ev) {
        ev.stopPropagation();
        var dd = document.getElementById('langDropdownMenu');
        if (dd) dd.classList.toggle('show');
    },

    changeLang(lang) {
        I18n.setLang(lang);
        var dd = document.getElementById('langDropdownMenu');
        if (dd) dd.classList.remove('show');
    },

    logout() {
        /* NEW: Logout via Bridge (clears admin session consistently) */
        if (typeof Bridge !== 'undefined') {
            Bridge.Auth.clearSession();
        }
        // PREV: localStorage.removeItem('tatito_admin_session');
        localStorage.removeItem('tatito_admin_session');
        sessionStorage.removeItem('tatito_session');
        // NEW: Redirect to frontend login instead of admin login page
        // PREV: window.location.href = 'index.html';
        window.location.href = 'index.html';
    },

    clearCache() {
        Helpers.toast('Cache cleared successfully', 'success');
    },

    showModal(html, size) {
        Helpers.openModal(html);
        if (size) document.getElementById('modalBox').classList.add(size);
    },
};

document.addEventListener('DOMContentLoaded', function() { App.init(); });
