/* =========================================================
   app.js — Shared navbar/footer renderer, theme, language,
   mobile menu, homepage rendering, and global UI utilities.
   Loaded on EVERY page. Reads TATITO_I18N + TatitoStore.
   ========================================================= */

/* ---------- Global UI utilities ---------- */
function showToast(message, type = "") {
  const toast = document.getElementById("shopToast");
  if (!toast) return;
  toast.textContent = message;
  toast.className = "shop-toast show " + type;
  setTimeout(() => {
    toast.className = "shop-toast " + type;
  }, 2200);
}

function formatPrice(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

/* ---------- Navbar renderer (shared across all pages) ---------- */
function renderNavbar() {
  const header = document.querySelector(".navbar");
  if (!header) return;

  const loggedIn = TatitoStore.isLoggedIn();
  const cartCount = TatitoStore.cartCount();
  const wishlistCount = TatitoStore.wishlistCount();
  const notifCount = loggedIn ? TatitoStore.unreadNotificationCount() : 0;

  /* Read admin header settings if available */
  const adminHeader = (typeof FrontendBridge !== "undefined" && FrontendBridge.getAdminHeader) ? FrontendBridge.getAdminHeader() : {};

  header.innerHTML = `
    <div class="nav-inner">
      <a class="nav-logo" href="index.html">
        <img src="assets/images/tatito-logo-official.jpg" alt="Tatito Fashions" />
        <div class="nav-brand-name">
          <span class="brand-title">TATITO</span>
          <em class="brand-sub">FASHIONS</em>
        </div>
      </a>
      ${adminHeader.helplineNumber ? `
      <a href="tel:${adminHeader.helplineNumber}" class="nav-helpline" style="display:flex;align-items:center;gap:4px;font-size:0.78rem;color:var(--gold);white-space:nowrap;" data-admin-helpline>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>${adminHeader.helplineNumber}</span>
      </a>` : ''}
      <nav class="nav-links mega-menu-nav">
        ${adminHeader.quickLinkText ? `<a href="${adminHeader.quickLinkUrl || '#'}" class="nav-quick-link">${adminHeader.quickLinkText}</a>` : ''}
        <a href="index.html" data-i18n="home">Home</a>
        ${(typeof NAV_VERTICALS !== "undefined" ? NAV_VERTICALS : []).map((cat) => {
          if (cat.slug === "collections") {
            const sections = (typeof COLLECTION_SECTIONS !== "undefined" ? COLLECTION_SECTIONS : []);
            return `
        <div class="mega-item" data-cat="collections">
          <a href="products.html" class="mega-trigger">${cat.name}<span class="nav-chev">▾</span></a>
          <div class="mega-panel mega-fw">
            <div class="mega-fw-inner mega-fw-collections">
              ${sections.map((sec) => {
                const groups = (typeof SUBCATEGORIES !== "undefined" && SUBCATEGORIES[sec.slug]) || [];
                return `
              <div class="mega-col">
                <div class="mega-col-header">
                  <img src="${sec.image}" alt="${sec.name}" loading="lazy" class="mega-col-img" />
                  <a href="category.html?category=${sec.slug}"><h5 class="mega-col-title">${sec.name}</h5></a>
                </div>
                ${groups.map((g) => `
                <div class="mega-group">
                  <span class="mega-group-label">${g.group}</span>
                  <div class="mega-group-items">
                    ${g.items.map((item) => `<a href="category.html?category=${sec.slug}&sub=${encodeURIComponent(item.toLowerCase().replace(/\s+/g,'-'))}" class="mega-sub-link">${item}</a>`).join("")}
                  </div>
                </div>`).join("")}
              </div>`;
              }).join("")}
            </div>
            <div class="mega-fw-footer">
              <a href="products.html" class="mega-view-all">View All Collections →</a>
            </div>
          </div>
        </div>`;
          }
          // All other verticals
          const groups = (typeof SUBCATEGORIES !== "undefined" && SUBCATEGORIES[cat.slug]) || [];
          if (!groups.length) return "";
          return `
        <div class="mega-item" data-cat="${cat.slug}">
          <a href="category.html?category=${cat.slug}" class="mega-trigger">${cat.name}<span class="nav-chev">▾</span></a>
          <div class="mega-panel mega-fw">
            <div class="mega-fw-inner mega-fw-vertical">
              <div class="mega-fw-links">
                <div class="mega-fw-grid">
                  ${groups.map((g) => `
                  <div class="mega-group">
                    <span class="mega-group-label">${g.group}</span>
                    <div class="mega-group-items">
                      ${g.items.map((item) => `<a href="category.html?category=${cat.slug}&sub=${encodeURIComponent(item.toLowerCase().replace(/\s+/g,'-'))}" class="mega-sub-link">${item}</a>`).join("")}
                    </div>
                  </div>`).join("")}
                </div>
                <a href="category.html?category=${cat.slug}" class="mega-view-all">View All ${cat.name} →</a>
              </div>
              <div class="mega-fw-promo">
                <img src="${cat.image}" alt="${cat.name}" loading="lazy" />
                <div class="mega-promo-overlay">
                  <span>${cat.name}</span>
                  <a href="category.html?category=${cat.slug}">Shop Now</a>
                </div>
              </div>
            </div>
          </div>
        </div>`;
        }).join("")}
        <a href="deals.html" title="Hot Deals">🔥</a>
      </nav>
      <div class="nav-location">
        <div class="location-dropdown">
          <button class="location-btn" id="navLocationBtn" title="Detect or change location">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="1.6"/></svg>
            <span id="navLocationText">Select City</span>
            <span class="nav-chev">▾</span>
          </button>
          <div class="location-dropdown-menu" id="locationDropdownMenu">
            <button class="loc-detect-btn" id="locDetectAction">📍 Detect My Location</button>
            <input type="text" class="loc-search-input" id="locSearchInput" placeholder="🔍 Search city (Google Maps)…" autocomplete="off" />
            <div id="locSearchResults" class="loc-search-results"></div>
            <div class="loc-divider" id="locNearbyDivider" style="display:none;">Nearby Shops</div>
            <div class="loc-nearby-grid" id="locNearbyGrid" style="display:none;"></div>
            <div class="loc-divider">Popular Cities</div>
            <div class="loc-city-grid" id="locCityGrid"></div>
          </div>
        </div>
      </div>
      <div class="nav-actions">
        ${loggedIn ? `
          <a href="notifications.html" class="icon-btn" aria-label="Notifications" title="Notifications" style="position:relative;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M13.7 21a2 2 0 0 1-3.4 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
            <span class="notif-badge ${notifCount ? '' : 'hidden'}" id="notifBadge">${notifCount}</span>
          </a>
          <a href="cart.html" class="icon-btn" aria-label="Cart" title="Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 4h2l2.5 12.5a2 2 0 0 0 2 1.5h7.5a2 2 0 0 0 2-1.5L21 8H6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="9" cy="21" r="1.5" fill="currentColor"/><circle cx="18" cy="21" r="1.5" fill="currentColor"/></svg>
            <span class="pill-count ${cartCount ? '' : 'hidden'}" id="cartCount">${cartCount}</span>
          </a>
          <div class="nav-dropdown">
            <a href="profile.html" class="icon-btn" aria-label="Account" title="Account">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.6"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" stroke-width="1.6"/></svg>
            </a>
            <div class="nav-dropdown-menu">
              <a href="profile.html"><span>👤</span> Profile</a>
              <a href="orders.html"><span>📦</span> My Orders</a>
              <a href="addresses.html"><span>📍</span> Addresses</a>
              <a href="referral.html"><span>🎁</span> Referral Program</a>
              <a href="notifications.html"><span>🔔</span> Notifications</a>
              <a href="quotations.html"><span>📋</span> My Quotations</a>
              <a href="consultations.html"><span>📞</span> Consultations</a>
              <a href="seller-register.html"><span>🏪</span> Sell on Tatito</a>
            </div>
          </div>
          <button class="theme-toggle" id="themeToggle" type="button" aria-label="Toggle theme">🌙</button>
          <select id="languageSelect" class="language-select" aria-label="Select language"></select>
          <button class="nav-login is-logout" id="logoutBtn" data-i18n="logout">Logout</button>
        ` : `
          <button class="theme-toggle" id="themeToggle" type="button" aria-label="Toggle theme">🌙</button>
          <select id="languageSelect" class="language-select" aria-label="Select language"></select>
          <a class="nav-login" href="login.html" data-i18n="login">Login</a>
        `}
        <button id="menuToggle" class="menu-toggle" aria-label="Menu"><span></span><span></span><span></span></button>
      </div>
    </div>
    <div id="mobileNav" class="mobile-nav">
      <div class="mobile-nav-section">
        <p class="mobile-nav-title">Navigation</p>
        <a href="index.html" data-i18n="home">🏠 Home</a>
        <a href="products.html">🛍️ All Products</a>
        <a href="deals.html">🔥 Deals</a>
        ${(typeof NAV_VERTICALS !== "undefined" ? NAV_VERTICALS : []).map((c) =>
          `<a href="${c.slug === 'collections' ? 'products.html' : 'category.html?category=' + c.slug}">${c.emoji} ${c.name}</a>`
        ).join("")}
      </div>
      <div class="mobile-nav-section">
        <p class="mobile-nav-title">Quick Links</p>
        <a href="about.html">ℹ️ About Us</a>
        <a href="careers.html">💼 Careers</a>
        <a href="contact.html">📞 Contact Us</a>
        <a href="seller-register.html" data-i18n="sellOnTatito">🏪 Sell on Tatito</a>
      </div>
      ${loggedIn ? `
        <div class="mobile-nav-section">
          <p class="mobile-nav-title">My Account</p>
          <a href="profile.html">👤 Profile</a>
          <a href="orders.html">📦 My Orders</a>
          <a href="cart.html">🛒 Cart</a>
          <a href="wishlist.html">❤️ Wishlist</a>
          <a href="addresses.html">📍 Addresses</a>
          <a href="notifications.html">🔔 Notifications</a>
          <a href="quotations.html">📋 Quotations</a>
          <a href="consultations.html">📞 Consultations</a>
          <a href="referral.html">🎁 Referral</a>
        </div>
      ` : `
        <div class="mobile-nav-section">
          <p class="mobile-nav-title">Account</p>
          <a href="login.html" data-i18n="login">👤 Login</a>
          <a href="register.html" data-i18n="register">✏️ Register</a>
        </div>
      `}
      <div class="mobile-nav-section">
        <p class="mobile-nav-title">Settings</p>
        <div class="mobile-nav-controls">
          <button type="button" class="mobile-nav-btn" id="mobileThemeToggle">
            <span>🌙</span> <span>Dark Mode</span>
          </button>
          <select id="mobileLangSelect" class="seller-select" style="margin-top:6px;">
          </select>
        </div>
      </div>
      ${loggedIn ? `
        <a href="index.html" id="mobileLogoutBtn" class="mobile-nav-logout" data-i18n="logout">🚪 Logout</a>
      ` : ''}
    </div>
  `;

  // Populate language options
  const langSelect = document.getElementById("languageSelect");
  if (langSelect) {
    langSelect.innerHTML = TATITO_I18N.availableLanguages
      .map((l) => `<option value="${l.code}">${l.label}</option>`)
      .join("");
    langSelect.value = TATITO_I18N.currentLang();
  }

  setupThemeToggle();
  setupLanguageToggle();
  setupMobileMenu();
  setupLocation();
  setupLogout();

  // Apply translations to the freshly-rendered navbar
  TATITO_I18N.applyI18n();
}

/* ---------- Footer renderer (shared) ---------- */
function renderFooter() {
  const footer = document.querySelector(".footer");
  if (!footer) return;

  /* Read admin footer settings if available */
  const f = (typeof FrontendBridge !== "undefined" && FrontendBridge.getAdminFooter) ? FrontendBridge.getAdminFooter() : {};

  footer.innerHTML = `
    <div class="footer-top">
      <div class="footer-brand">
        <img src="assets/images/tatito-logo-official.jpg" alt="Tatito Fashions" />
        <div class="brand-name" style="display:flex;flex-direction:column;align-items:flex-start;gap:2px;">
          <span class="brand-title" style="font-family:var(--font-display);font-size:19px;font-weight:600;letter-spacing:2px;">TATITO</span>
          <span class="brand-sub" style="font-size:12px;color:var(--gold);letter-spacing:4px;font-family:var(--font-display);">FASHIONS</span>
        </div>
        <p style="font-size:12.5px;color:var(--muted);margin-top:4px;" data-admin-about>Custom fashion for everyone.</p>
      </div>
      <div class="footer-col">
        <h4 data-i18n="footerShop">Shop</h4>
        <a href="products.html">All Products</a>
        <a href="category.html?category=men-wear" data-i18n="men">Men</a>
        <a href="category.html?category=women-wear" data-i18n="women">Women</a>
        <a href="category.html?category=kids-wear" data-i18n="kids">Kids</a>
        <a href="deals.html">🔥 Deals & Offers</a>
        <a href="try-on.html">AI Try-On</a>
      </div>
      <div class="footer-col">
        <h4 data-i18n="footerServices">Services</h4>
        <a href="customize.html">Customize</a>
        <a href="category.html?category=wedding">Wedding</a>
        <a href="category.html?category=jewellery">Jewellery</a>
        <a href="category.html?category=events">Event Management</a>
        <a href="category.html?category=customize">Custom Fashion</a>
        <a href="consultations.html">Consultations</a>
      </div>
      <div class="footer-col">
        <h4 data-i18n="footerCompany">Company</h4>
        <a href="about.html">About Us</a>
        <a href="careers.html">Careers</a>
        <a href="seller-register.html" data-i18n="sellOnTatito">Sell on Tatito</a>
        <a href="contact.html">Contact Us</a>
        <a href="referral.html">Referral Program</a>
        <a href="orders.html">Track Orders</a>
      </div>
      ${f.contactsWidget ? `
      <div class="footer-col footer-contacts">
        <h4>Contact Us</h4>
        ${f.contactsWidget.address ? `<p style="font-size:12.5px;color:var(--muted);margin-bottom:4px;" data-admin-address>${f.contactsWidget.address}</p>` : ''}
        ${f.contactsWidget.email ? `<a href="mailto:${f.contactsWidget.email}" style="font-size:12.5px;display:block;margin-bottom:4px;" data-admin-email>${f.contactsWidget.email}</a>` : ''}
        ${(f.contactsWidget.phones && f.contactsWidget.phones[0]) ? `<a href="tel:${f.contactsWidget.phones[0]}" style="font-size:12.5px;display:block;margin-bottom:4px;" data-admin-phone>${f.contactsWidget.phones[0]}</a>` : ''}
      </div>` : ''}
    </div>
    <div class="footer-bottom">
      <span data-admin-copyright>© 2026 <span data-i18n="brandName">Tatito</span> <span data-i18n="brandSub">Fashions</span>. <span data-i18n="allRightsReserved">All rights reserved.</span></span>
      ${(f.copyrightWidget && f.copyrightWidget.showSocialLinks && f.copyrightWidget.social) ? `
      <div class="footer-social">
        ${f.copyrightWidget.social.facebook ? `<a href="${f.copyrightWidget.social.facebook}" target="_blank" data-social="facebook"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg></a>` : ''}
        ${f.copyrightWidget.social.twitter ? `<a href="${f.copyrightWidget.social.twitter}" target="_blank" data-social="twitter"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>` : ''}
        ${f.copyrightWidget.social.instagram ? `<a href="${f.copyrightWidget.social.instagram}" target="_blank" data-social="instagram"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.41 1.44c.795 0 1.441-.645 1.441-1.44s-.646-1.44-1.441-1.44z"/></svg></a>` : ''}
        ${f.copyrightWidget.social.youtube ? `<a href="${f.copyrightWidget.social.youtube}" target="_blank" data-social="youtube"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg></a>` : ''}
        ${f.copyrightWidget.social.linkedin ? `<a href="${f.copyrightWidget.social.linkedin}" target="_blank" data-social="linkedin"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg></a>` : ''}
      </div>` : ''}
    </div>
  `;
}

/* ---------- Theme toggle ---------- */
function setupThemeToggle() {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;
  const saved = localStorage.getItem("tatito-theme") || "light";
  document.body.dataset.theme = saved;
  toggle.textContent = saved === "dark" ? "☀️" : "🌙";
  toggle.addEventListener("click", () => {
    const next = document.body.dataset.theme === "dark" ? "light" : "dark";
    document.body.dataset.theme = next;
    localStorage.setItem("tatito-theme", next);
    toggle.textContent = next === "dark" ? "☀️" : "🌙";
  });
}

/* ---------- Language toggle ---------- */
function setupLanguageToggle() {
  const select = document.getElementById("languageSelect");
  if (!select) return;
  select.value = TATITO_I18N.currentLang();
  select.addEventListener("change", () => {
    TATITO_I18N.setLanguage(select.value);
    // Re-render navbar to pick up new translations for badge labels etc.
    updateNavBadges();
  });
}

/* ---------- Mobile menu ---------- */
function setupMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");
  if (!toggle || !mobileNav) return;
  toggle.addEventListener("click", () => mobileNav.classList.toggle("open"));

  // Mobile theme toggle
  const mobileThemeToggle = document.getElementById("mobileThemeToggle");
  if (mobileThemeToggle) {
    const updateMobileToggle = () => {
      const isDark = document.body.dataset.theme === "dark";
      mobileThemeToggle.querySelector("span:first-child").textContent = isDark ? "☀️" : "🌙";
      mobileThemeToggle.querySelector("span:last-child").textContent = isDark ? "Light Mode" : "Dark Mode";
    };
    updateMobileToggle();
    mobileThemeToggle.addEventListener("click", () => {
      const next = document.body.dataset.theme === "dark" ? "light" : "dark";
      document.body.dataset.theme = next;
      localStorage.setItem("tatito-theme", next);
      updateMobileToggle();
      // Sync desktop toggle
      const dt = document.getElementById("themeToggle");
      if (dt) dt.textContent = next === "dark" ? "☀️" : "🌙";
    });
  }

  // Mobile language select
  const mobileLangSelect = document.getElementById("mobileLangSelect");
  if (mobileLangSelect && typeof TATITO_I18N !== "undefined") {
    mobileLangSelect.innerHTML = TATITO_I18N.availableLanguages
      .map((l) => `<option value="${l.code}">🌐 ${l.label}</option>`)
      .join("");
    mobileLangSelect.value = TATITO_I18N.currentLang();
    mobileLangSelect.addEventListener("change", (e) => {
      TATITO_I18N.setLang(e.target.value);
      // Sync desktop select
      const dl = document.getElementById("languageSelect");
      if (dl) dl.value = e.target.value;
    });
  }
}

/* ---------- Location detection & city selector ---------- */
function setupLocation() {
  const btn = document.getElementById("navLocationBtn");
  const textEl = document.getElementById("navLocationText");
  const menu = document.getElementById("locationDropdownMenu");
  const detectBtn = document.getElementById("locDetectAction");
  const cityGrid = document.getElementById("locCityGrid");
  const searchInput = document.getElementById("locSearchInput");
  const searchResults = document.getElementById("locSearchResults");
  const nearbyDivider = document.getElementById("locNearbyDivider");
  const nearbyGrid = document.getElementById("locNearbyGrid");
  if (!btn || !menu) return;

  // Populate city grid
  if (cityGrid) {
    cityGrid.innerHTML = (typeof POPULAR_CITIES !== "undefined" ? POPULAR_CITIES : []).map((c) =>
      `<button class="loc-city-chip" data-city="${c}">${c}</button>`
    ).join("");
  }

  // Load saved location
  const saved = TatitoStore.getLocation();
  if (saved && saved.city) {
    if (textEl) textEl.textContent = `📍 ${saved.city}`;
    if (saved.lat && saved.lng && typeof TatitoLocation !== "undefined") {
      TatitoLocation.applyStoreDistances(saved.lat, saved.lng);
      renderNearbyShops(saved.lat, saved.lng);
    }
  } else {
    /* Auto-detect location silently on first visit to any page */
    setTimeout(autoDetectLocation, 600);
  }

  // Toggle dropdown
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("open");
    if (menu.classList.contains("open") && searchInput) {
      setTimeout(() => searchInput.focus(), 100);
    }
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".location-dropdown")) menu.classList.remove("open");
  });

  // Detect button
  detectBtn?.addEventListener("click", () => {
    menu.classList.remove("open");
    if (textEl) textEl.textContent = "📍 Detecting...";
    autoDetectLocation();
  });

  // City chip click
  cityGrid?.addEventListener("click", (e) => {
    const chip = e.target.closest(".loc-city-chip");
    if (!chip) return;
    // Find lat/lng from WORLD_CITIES for the selected popular city
    let lat = null, lng = null;
    const wc = (typeof WORLD_CITIES !== "undefined" ? WORLD_CITIES : []).find(c => c.city === chip.dataset.city);
    if (wc) { lat = wc.lat; lng = wc.lng; }
    selectNavCity(chip.dataset.city, lat, lng);
  });

  // Nearby shop click — navigate to shop
  nearbyGrid?.addEventListener("click", (e) => {
    const chip = e.target.closest(".loc-nearby-chip");
    if (!chip) return;
    window.location.href = `shop.html?shop=${chip.dataset.storeId}`;
  });

  // Initialize location system (async — loads Google Maps if key available)
  TatitoLocation.init().then(() => {
    // Attach autocomplete to search input
    if (searchInput) {
      const mode = TatitoLocation.attachAutocomplete(searchInput, (place) => {
        selectNavCity(place.name, place.lat, place.lng);
      });

      // If fallback mode, use world cities search
      if (mode === "fallback") {
        searchInput.addEventListener("input", () => {
          const q = searchInput.value.trim();
          if (!q) {
            if (searchResults) searchResults.innerHTML = "";
            searchResults?.classList.remove("open");
            return;
          }
          const matches = TatitoLocation.searchCities(q, 15);
          if (!matches.length) {
            if (searchResults) searchResults.innerHTML = `<div class="loc-no-results">No cities found</div>`;
            searchResults?.classList.add("open");
            return;
          }
          if (searchResults) {
            searchResults.innerHTML = matches.map((c) =>
              `<button class="loc-search-result-item" data-city="${c.city}" data-lat="${c.lat}" data-lng="${c.lng}">
                 <span>${c.city}</span><span class="loc-country">${c.country}</span>
               </button>`
            ).join("");
            searchResults.classList.add("open");
          }
        });

        searchResults?.addEventListener("click", (e) => {
          const item = e.target.closest(".loc-search-result-item");
          if (!item) return;
          selectNavCity(item.dataset.city, item.dataset.lat, item.dataset.lng);
        });
      }
    }
  });
}

/* Select city from navbar, update UI + storage + recalculate shop distances */
function selectNavCity(city, lat, lng) {
  const textEl = document.getElementById("navLocationText");
  const menu = document.getElementById("locationDropdownMenu");
  TatitoStore.setLocation(city, lat || null, lng || null);
  if (textEl) textEl.textContent = `📍 ${city}`;
  if (menu) menu.classList.remove("open");
  const searchInput = document.getElementById("locSearchInput");
  const searchResults = document.getElementById("locSearchResults");
  if (searchInput) searchInput.value = "";
  if (searchResults) { searchResults.innerHTML = ""; searchResults.classList.remove("open"); }

  // Apply dynamic distances to stores and re-render nearby shops
  if (lat && lng && typeof TatitoLocation !== "undefined") {
    TatitoLocation.applyStoreDistances(lat, lng);
    renderNearbyShops(lat, lng);
    // Refresh product/store grids on the current page
    refreshDistancesOnPage(lat, lng);
  }
  showToast(`Location set to ${city}`, "success");
}

/* Render nearby SHOPS (not cities) based on user's lat/lng */
function renderNearbyShops(lat, lng) {
  const nearbyDivider = document.getElementById("locNearbyDivider");
  const nearbyGrid = document.getElementById("locNearbyGrid");
  if (!nearbyDivider || !nearbyGrid || typeof TatitoLocation === "undefined") return;

  const nearby = TatitoLocation.findNearbyStores(lat, lng, 6);
  if (!nearby.length) {
    nearbyDivider.style.display = "none";
    nearbyGrid.style.display = "none";
    return;
  }
  nearbyDivider.style.display = "";
  nearbyGrid.style.display = "";
  nearbyGrid.innerHTML = nearby.map((s) => `
    <button class="loc-nearby-chip" data-store-id="${s.id}">
       <span class="loc-nearby-name">${s.emoji} ${s.name}</span>
       <span class="loc-nearby-dist">${TatitoLocation.formatDist(s._dynamicDistance)} away</span>
     </button>`).join("");
}

/* Re-render any store/product cards on the page with updated distances */
function refreshDistancesOnPage(lat, lng) {
  if (typeof TatitoLocation === "undefined") return;
  // Update all distance elements that have data-store-id
  document.querySelectorAll("[data-store-distance]").forEach((el) => {
    const storeId = el.dataset.storeDistance;
    const store = (typeof STORES !== "undefined" ? STORES : []).find((s) => s.id === storeId);
    if (store && store.lat && store.lng) {
      const dist = TatitoLocation.distanceTo(lat, lng, store.lat, store.lng);
      el.textContent = TatitoLocation.formatDist(dist);
    }
  });
}

function autoDetectLocation() {
  const textEl = document.getElementById("navLocationText");

  if (!navigator.geolocation) {
    if (textEl) textEl.textContent = "📍 Select City";
    return;
  }

  if (textEl && (!textEl.textContent || textEl.textContent === "📍 Select City")) {
    textEl.textContent = "📍 Detecting…";
  }

  TatitoStore.detectLocation().then(async (loc) => {
    if (!loc || (!loc.lat && !loc.lng)) {
      const defaultCity = "Mumbai";
      TatitoStore.setLocation(defaultCity);
      if (textEl) textEl.textContent = `📍 ${defaultCity}`;
      return;
    }
    if (typeof TatitoLocation === "undefined") {
      if (textEl) textEl.textContent = "📍 Location Set";
      return;
    }
    // Reverse geocode via TatitoLocation (Google Maps or Nominatim fallback)
    const result = await TatitoLocation.reverseGeocode(loc.lat, loc.lng);
    const cleanName = result.name || "Your Area";
    TatitoStore.setLocation(cleanName, loc.lat, loc.lng);
    if (textEl) textEl.textContent = `📍 ${cleanName}`;
    TatitoLocation.applyStoreDistances(loc.lat, loc.lng);
    renderNearbyShops(loc.lat, loc.lng);
    // Update hero location texts if present
    const heroLoc = document.getElementById("heroLocationText");
    if (heroLoc) heroLoc.textContent = cleanName;
    const nearbyLoc = document.getElementById("nearbyLocationText");
    if (nearbyLoc) nearbyLoc.textContent = cleanName;
    const heroSearchLoc = document.getElementById("heroSearchLocationText");
    if (heroSearchLoc) heroSearchLoc.textContent = cleanName;
  });
}

/* ---------- Logout ---------- */
function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  const mobileLogout = document.getElementById("mobileLogoutBtn");

  const doLogout = (e) => {
    e.preventDefault();
    TatitoStore.logout();
    window.location.href = "index.html";
  };

  if (logoutBtn) logoutBtn.addEventListener("click", doLogout);
  if (mobileLogout) mobileLogout.addEventListener("click", doLogout);
}

/* ---------- Update nav badge counts ---------- */
function updateNavBadges() {
  const cartEl = document.getElementById("cartCount");
  const wlEl = document.getElementById("wishlistCount");
  const cartN = TatitoStore.cartCount();
  const wlN = TatitoStore.wishlistCount();
  if (cartEl) {
    cartEl.textContent = cartN;
    cartEl.classList.toggle("hidden", cartN === 0);
  }
  if (wlEl) {
    wlEl.textContent = wlN;
    wlEl.classList.toggle("hidden", wlN === 0);
  }
}

/* ---------- Homepage rendering ---------- */
function renderCategories() {
  const grid = document.getElementById("categoryGrid");
  if (!grid) return;
  /* NEW: Filter out categories hidden by admin via Home Collections page */
  const visibleCats = CATEGORIES.filter((cat) => !cat._hidden);
  grid.innerHTML = visibleCats.map((cat) => `
    <a href="category.html?category=${cat.slug}" class="category-card">
      <div class="cat-image-wrap">
        ${cat.image
          ? `<img src="${cat.image}" alt="${cat.name}" class="cat-image" loading="lazy" />`
          : `<div class="cat-emoji">${cat.emoji}</div>`}
      </div>
      <span>${cat.name}</span>
    </a>
  `).join("");
}

/* ---------- Featured products & deals on homepage ---------- */
function getAllProducts() {
  const items = [];
  STORES.forEach((store) => {
    (store.products || []).forEach((p) => {
      items.push({
        ...p,
        storeId: store.id,
        storeName: store.name,
        storeRating: store.rating,
        category: store.category
      });
    });
  });
  return items;
}

function renderProductCard(p) {
  const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
  return `
    <div class="product-card">
      <a href="shop.html?shop=${p.storeId}" class="product-card-media">
        ${discount > 0 ? `<span class="product-discount-badge">-${discount}%</span>` : ""}
        <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" />
      </a>
      <div class="product-card-body">
        <p class="product-card-store">${escapeHtml(p.storeName)} · ★${p.storeRating}</p>
        <a href="shop.html?shop=${p.storeId}"><h3>${escapeHtml(p.name)}</h3></a>
        <div class="product-card-price">
          <span class="price-now">${formatPrice(p.price)}</span>
          ${p.originalPrice ? `<span class="price-was">${formatPrice(p.originalPrice)}</span>` : ""}
        </div>
        <button class="btn btn-primary small block product-quick-add"
          data-store-id="${p.storeId}"
          data-item-id="${p.id}"
          ${p.stock <= 0 ? "disabled" : ""}>
          ${p.stock <= 0 ? "Out of Stock" : "🛒 Add to Cart"}
        </button>
        <div class="product-card-actions">
          <a href="try-on.html?product=${p.id}" class="btn btn-ghost small product-mini-action">🤖 Try-On</a>
          <a href="customize.html" class="btn btn-ghost small product-mini-action">✂️ Customize</a>
        </div>
      </div>
    </div>`;
}

function renderFeaturedProducts() {
  const grid = document.getElementById("featuredProducts");
  if (!grid) return;
  const all = getAllProducts().sort((a, b) => b.storeRating - a.storeRating).slice(0, 8);
  grid.innerHTML = all.map(renderProductCard).join("");
}

function renderDealsProducts() {
  const grid = document.getElementById("dealsProducts");
  if (!grid) return;
  const deals = getAllProducts().filter((p) => p.originalPrice).slice(0, 4);
  if (!deals.length) {
    grid.innerHTML = `<p class="empty-state">No active deals right now.</p>`;
    return;
  }
  grid.innerHTML = deals.map(renderProductCard).join("");
}

/* Quick add-to-cart from product cards */
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".product-quick-add");
  if (!btn || btn.disabled) return;
  e.preventDefault();
  const storeId = btn.dataset.storeId;
  const itemId = btn.dataset.itemId;
  const store = STORES.find((s) => s.id === storeId);
  if (!store) return;
  const item = (store.products || []).find((p) => p.id === itemId);
  if (!item) return;

  if (!TatitoStore.isLoggedIn()) {
    showToast("Please login to add items to cart", "error");
    setTimeout(() => { window.location.href = "login.html"; }, 900);
    return;
  }

  // Out of stock check
  if ((item.stock || 0) <= 0) {
    showToast("This item is out of stock", "error");
    return;
  }

  if (item.variantType && item.variantType !== "none") {
    showToast("Please select a size on the shop page");
    setTimeout(() => { window.location.href = `shop.html?shop=${storeId}`; }, 800);
    return;
  }

  TatitoStore.addToCart(storeId, itemId, {
    name: item.name,
    price: item.price,
    originalPrice: item.originalPrice,
    image: item.image,
    shopName: store.name,
    category: store.category,
    variantType: item.variantType,
    stock: item.stock
  });
  showToast(`${item.name} added to cart`, "success");
});

let currentSort = "distance";

function renderStores() {
  const grid = document.getElementById("storeGrid");
  if (!grid) return;

  let stores = [...STORES];
  /* NEW: Filter out stores hidden by admin via Home Collections page */
  stores = stores.filter((s) => !s._hidden);
  stores = sortStores(stores, currentSort);

  if (!stores.length) {
    grid.innerHTML = `<p class="empty-state">${t("noVendors")}</p>`;
    return;
  }

  grid.innerHTML = stores.map((store) => renderStoreCard(store)).join("");
}

function renderStoreCard(store) {
  return `
    <a href="shop.html?shop=${store.id}" class="store-card-link">
      <div class="store-card">
        <div class="store-media">
            <span class="store-badge">${store.badge}</span>
          <span class="store-dist" data-store-distance="${store.id}">${typeof TatitoLocation !== "undefined" ? TatitoLocation.formatDist(store._dynamicDistance ?? store.distance) : formatDistance(store.distance)}</span>
          ${store.image
            ? `<img src="${store.image}" alt="${store.name}" class="store-media-img" loading="lazy" />`
            : `<span>${store.emoji}</span>`}
        </div>
        <div class="store-body">
          <h3>${store.name}</h3>
          <p class="store-cat">${store.category}</p>
          <p class="store-desc">${store.description}</p>
          <div class="store-meta">
            <span class="store-rating">★ ${store.rating} <span style="color:var(--muted);font-weight:400;">(${store.reviewCount || 0})</span></span>
            <span class="store-open ${store.open ? "" : "closed"}">${store.open ? t("openNow") : t("closed")}</span>
          </div>
          <div class="store-actions">
            <span class="btn btn-primary small">${t("viewShop")}</span>
          </div>
        </div>
      </div>
    </a>`;
}

function sortStores(stores, sortKey) {
  const arr = [...stores];
  switch (sortKey) {
    case "rating": return arr.sort((a, b) => b.rating - a.rating);
    case "open": return arr.sort((a, b) => (b.open ? 1 : 0) - (a.open ? 1 : 0));
    case "distance":
    default: return arr.sort((a, b) => (a._dynamicDistance ?? a.distance) - (b._dynamicDistance ?? b.distance));
  }
}

function setupSortChips() {
  document.querySelectorAll(".sort-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".sort-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      currentSort = chip.dataset.sort || "distance";
      renderStores();
    });
  });
}

function setupHeroSearch() {
  const form = document.getElementById("heroSearchForm");
  const input = document.getElementById("heroSearchInput");
  if (!form || !input) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = input.value.trim();
    window.location.href = query ? `category.html?search=${encodeURIComponent(query)}` : "category.html";
  });
}

/* ============================================================
   HERO SLIDER — Manyavar-style 3-slide auto-advancing carousel
   ============================================================ */
function initHeroSlider() {
  const slider = document.getElementById("heroSlider");
  if (!slider) return;
  const slides = slider.querySelectorAll(".hero-slide");
  const dotsContainer = document.getElementById("heroSliderDots");
  const prevBtn = document.getElementById("heroSliderPrev");
  const nextBtn = document.getElementById("heroSliderNext");
  if (!slides.length) return;

  let current = 0;
  let autoTimer = null;
  const AUTO_INTERVAL = 5000;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "hero-slider-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", "Go to slide " + (i + 1));
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
  });
  const dots = dotsContainer.querySelectorAll(".hero-slider-dot");

  function goTo(index) {
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("active");
    dots[current].classList.add("active");
    resetAuto();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() { autoTimer = setInterval(next, AUTO_INTERVAL); }
  function resetAuto() { clearInterval(autoTimer); startAuto(); }

  if (nextBtn) nextBtn.addEventListener("click", next);
  if (prevBtn) prevBtn.addEventListener("click", prev);

  // Pause on hover
  slider.addEventListener("mouseenter", () => clearInterval(autoTimer));
  slider.addEventListener("mouseleave", startAuto);

  // Touch / swipe support
  let touchStartX = 0;
  slider.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
  }, { passive: true });

  startAuto();
}

/* ---------- Init on every page ---------- */
function initApp() {
  renderNavbar();
  renderFooter();

  /* Apply admin-managed settings (site name, colors, helpline, footer) if available.
     Must run AFTER renderNavbar/renderFooter so the DOM elements exist. */
  if (typeof FrontendBridge !== "undefined" && FrontendBridge.applyAdminSettings) {
    FrontendBridge.applyAdminSettings();
  }

  /* NEW: Apply admin collection visibility BEFORE rendering.
     Sets _hidden flags on STORES/CATEGORIES so renderCategories()
     and renderStores() filter them out. Must run before render. */
  if (typeof FrontendBridge !== "undefined" && FrontendBridge.applyCollectionVisibility) {
    FrontendBridge.applyCollectionVisibility();
  }

  // Homepage-specific
  renderCategories();
  renderFeaturedProducts();
  renderDealsProducts();

  /* NEW: Apply admin hero slider slides BEFORE initHeroSlider().
     If admin has customized slides via Video Banners, replace the
     hardcoded HTML with admin-managed slides. */
  if (typeof FrontendBridge !== "undefined" && FrontendBridge.applyHeroSlider) {
    FrontendBridge.applyHeroSlider();
  }

  initHeroSlider();
  if (document.body.dataset.page !== "category") {
    renderStores();
  }
  setupSortChips();
  setupHeroSearch();

  /* NEW: Apply admin homepage section visibility settings (DOM-level).
     Hides entire sections admin toggled off, applies custom titles.
     Runs AFTER render since it hides existing DOM elements. */
  if (typeof FrontendBridge !== "undefined" && FrontendBridge.applyHomepageSectionSettings) {
    FrontendBridge.applyHomepageSectionSettings();
  }

  // Subscribe to store changes (badge updates)
  TatitoStore.subscribe(updateNavBadges);

  // Re-render dynamic content on language change
  window.addEventListener("languagechange", () => {
    renderCategories();
    renderFeaturedProducts();
    renderDealsProducts();
    if (document.body.dataset.page !== "category") {
      renderStores();
    }
  });
}

document.addEventListener("DOMContentLoaded", initApp);
