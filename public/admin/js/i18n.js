/* TATITO FASHIONS — i18n (EN/HI/MR) */

const I18n = {
    lang: localStorage.getItem('tatito_lang') || 'en',
    translations: {
        en: {
            dashboard: 'Dashboard', users: 'Users', sellers: 'Sellers', designers: 'Designers',
            categories: 'Categories', products: 'Products', services: 'Services', orders: 'Orders',
            bookings: 'Bookings', payments: 'Payments', reviews: 'Reviews', customization: 'Customization',
            quotations: 'Quotations', ai_tryon: 'AI Try-On', referrals: 'Referrals', offers: 'Offers',
            notifications: 'Notifications', cms: 'CMS / Pages', reports: 'Reports', settings: 'Settings',
            welcome_back: 'Welcome back', total_revenue: 'Total Revenue', total_orders: 'Total Orders',
            total_users: 'Total Users', total_sellers: 'Total Sellers', total_products: 'Total Products',
            recent_orders: 'Recent Orders', quick_actions: 'Quick Actions', view_all: 'View All',
            logout: 'Logout', search: 'Search...', add_new: 'Add New', edit: 'Edit', delete: 'Delete',
            save: 'Save', cancel: 'Cancel', confirm_delete: 'Are you sure you want to delete this?',
            status: 'Status', actions: 'Actions', name: 'Name', email: 'Email', phone: 'Phone',
            city: 'City', date: 'Date', amount: 'Amount', category: 'Category', price: 'Price',
            login: 'Login', register: 'Register', password: 'Password', forgot_password: 'Forgot Password?',
            my_products: 'My Products', my_orders: 'My Orders', earnings: 'Earnings & Payouts',
            profile_settings: 'Profile & Settings', my_reviews: 'My Reviews', my_collection: 'My Collection',
            customization_requests: 'Customization Requests', welcome: 'Welcome back',
            total_spent: 'Total Spent', reviews_given: 'Reviews Given', referral_code: 'Referral Code',
        },
        hi: {
            dashboard: '\u0921\u0948\u0936\u092C\u094B\u0930\u094D\u0921', users: '\u0909\u092A\u092F\u094B\u0917\u0915\u0947\u0924\u093E', sellers: '\u0935\u093F\u0915\u094D\u0930\u0947\u0924\u093E', designers: '\u0921\u093F\u091C\u093E\u0907\u0928\u0930',
            categories: '\u0936\u094D\u0930\u0947\u0923\u093F\u092F\u093E\u0902', products: '\u0909\u0924\u094D\u092A\u093E\u0926', services: '\u0938\u0947\u0935\u093E\u090F\u0902', orders: '\u0911\u0930\u094D\u0921\u0930',
            bookings: '\u092C\u0941\u0915\u093F\u0902\u0917', payments: '\u092D\u0941\u0917\u0924\u093E\u0928', reviews: '\u0930\u0947\u091F\u093F\u0902\u0917', customization: '\u0915\u0938\u094D\u091F\u092E\u093E\u0907\u091C\u093C\u0947\u0936\u0928',
            quotations: '\u0915\u094B\u091F\u0947\u0936\u0928', ai_tryon: 'AI \u091F\u094D\u0930\u093E\u092F-\u0911\u0928', referrals: '\u0930\u0947\u092B\u0930\u0932', offers: '\u0911\u092B\u0930',
            notifications: '\u0938\u0942\u091A\u0928\u093E\u090F\u0902', cms: 'CMS / \u092A\u0947\u091C', reports: '\u0930\u093F\u092A\u094B\u0930\u094D\u091F', settings: '\u0938\u0947\u091F\u093F\u0902\u0917\u094D\u0938',
            welcome_back: '\u0935\u093E\u092A\u0938 \u092A\u0941\u0928\u0930\u094D\u0935\u093E\u0926\u0928 \u0915\u0930\u0947\u0902',
        },
        mr: {
            dashboard: '\u0921\u0945\u0936\u092C\u094B\u0930\u094D\u0921', users: '\u0935\u093E\u092A\u0930\u0915\u0930\u094D\u0924\u0947', sellers: '\u0935\u093F\u0915\u094D\u0930\u0947\u0924\u093E', designers: '\u0921\u093F\u091D\u093E\u0907\u0928\u0930',
            categories: '\u0936\u094D\u0930\u0947\u0923\u0940', products: '\u0909\u0924\u094D\u092A\u093E\u0926\u0928\u0947', services: '\u0938\u0947\u0935\u093E', orders: '\u0911\u0930\u094D\u0921\u0930',
            bookings: '\u092C\u0941\u0915\u093F\u0902\u0917', payments: '\u092A\u0947\u092E\u0947\u0902\u091F', reviews: '\u0930\u0947\u091F\u093F\u0902\u0917\u094D\u0938', settings: '\u0938\u0947\u091F\u093F\u0902\u0917\u094D\u0938',
        }
    },
    t(key) {
        var t = this.translations[this.lang] || this.translations.en;
        return t[key] || this.translations.en[key] || key;
    },
    setLang(lang) {
        this.lang = lang;
        localStorage.setItem('tatito_lang', lang);
        this.apply();
    },
    apply() {
        document.querySelectorAll('[data-i18n]').forEach(function(el) {
            var key = el.getAttribute('data-i18n');
            el.textContent = I18n.t(key);
        });
    },
    init() {
        this.apply();
    }
};
