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

  header.innerHTML = `
    <div class="nav-inner">
      <a class="nav-logo" href="index.html">
        <img src="assets/images/tatito-logo-official.jpg" alt="Tatito Fashions" />
        <div class="nav-brand-name">
          <span class="brand-title">TATITO</span>
          <em class="brand-sub">FASHIONS</em>
        </div>
      </a>
      <nav class="nav-links">
        <a href="index.html" data-i18n="home">Home</a>
        <a href="products.html">Products</a>
        <div class="nav-dropdown nav-cat-dropdown">
          <a href="category.html" class="nav-cat-trigger">Categories <span class="nav-chev">▾</span></a>
          <div class="nav-cat-menu">
            ${CATEGORIES.map((c) => `<a href="category.html?category=${c.slug}">${c.emoji} ${c.name}</a>`).join("")}
          </div>
        </div>
        <a href="deals.html">🔥 Deals</a>
        <a href="try-on.html" data-i18n="aiTryOn">AI Try-On</a>
        <a href="customize.html" data-i18n="customize">Customize</a>
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
          <a href="wishlist.html" class="icon-btn" aria-label="Wishlist" title="Wishlist">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 6.5-7 11-7 11Z" stroke="currentColor" stroke-width="1.6"/></svg>
            <span class="pill-count ${wishlistCount ? '' : 'hidden'}" id="wishlistCount">${wishlistCount}</span>
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
              <a href="wishlist.html"><span>❤️</span> Wishlist</a>
              <a href="referral.html"><span>🎁</span> Referral Program</a>
              <a href="notifications.html"><span>🔔</span> Notifications</a>
              <a href="quotations.html"><span>📋</span> My Quotations</a>
              <a href="consultations.html"><span>📞</span> Consultations</a>
              <a href="seller-register.html"><span>🏪</span> Sell on Tatito</a>
            </div>
          </div>
          <button class="theme-toggle" id="themeToggle" type="button" aria-label="Toggle theme">🌙</button>
          <select id="languageSelect" class="language-select" aria-label="Select language"></select>
          <button class="nav-login" id="logoutBtn" data-i18n="logout">Logout</button>
        ` : `
          <button class="theme-toggle" id="themeToggle" type="button" aria-label="Toggle theme">🌙</button>
          <select id="languageSelect" class="language-select" aria-label="Select language"></select>
          <a class="nav-login" href="login.html" data-i18n="login">Login</a>
        `}
        <button id="menuToggle" class="menu-toggle" aria-label="Menu"><span></span><span></span><span></span></button>
      </div>
    </div>
    <div id="mobileNav" class="mobile-nav">
      <a href="index.html" data-i18n="home">Home</a>
      <a href="products.html">Products</a>
      <a href="deals.html">🔥 Deals</a>
      <a href="try-on.html" data-i18n="aiTryOn">AI Try-On</a>
      <a href="customize.html" data-i18n="customize">Customize</a>
      <a href="category.html" data-i18n="categories">All Categories</a>
      <a href="about.html">About Us</a>
      <a href="careers.html">Careers</a>
      <a href="contact.html">Contact Us</a>
      ${loggedIn ? `
        <a href="orders.html" data-i18n="orders">My Orders</a>
        <a href="profile.html" data-i18n="profile">Profile</a>
        <a href="referral.html" data-i18n="referral">Referral</a>
        <a href="notifications.html" data-i18n="notifications">Notifications</a>
        <a href="quotations.html">📋 My Quotations</a>
        <a href="consultations.html">📞 Consultations</a>
        <a href="cart.html">🛒 Cart</a>
        <a href="wishlist.html">❤️ Wishlist</a>
        <a href="seller-register.html" data-i18n="sellOnTatito">Sell on Tatito</a>
        <a href="index.html" id="mobileLogoutBtn" data-i18n="logout">Logout</a>
      ` : `
        <a href="login.html" data-i18n="login">Login</a>
        <a href="register.html" data-i18n="register">Register</a>
        <a href="seller-register.html" data-i18n="sellOnTatito">Sell on Tatito</a>
      `}
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

  footer.innerHTML = `
    <div class="footer-top">
      <div class="footer-brand">
        <img src="assets/images/tatito-logo-official.jpg" alt="Tatito Fashions" />
        <div class="brand-name" style="display:flex;flex-direction:column;align-items:flex-start;gap:2px;">
          <span class="brand-title" style="font-family:var(--font-display);font-size:19px;font-weight:600;letter-spacing:2px;">TATITO</span>
          <span class="brand-sub" style="font-size:12px;color:var(--gold);letter-spacing:4px;font-family:var(--font-display);">FASHIONS</span>
        </div>
        <p style="font-size:12.5px;color:var(--muted);margin-top:4px;" data-i18n="footerTagline">Custom fashion for everyone.</p>
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
        <a href="category.html?category=designers" data-i18n="designers">Designers</a>
        <a href="category.html?category=photographers" data-i18n="photographers">Photographers</a>
        <a href="category.html?category=decorators" data-i18n="decorators">Decorators</a>
        <a href="category.html?category=caterers" data-i18n="caterers">Caterers</a>
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
    </div>
    <div class="footer-bottom">
      <span>© 2026 <span data-i18n="brandName">Tatito</span> <span data-i18n="brandSub">Fashions</span>. <span data-i18n="allRightsReserved">All rights reserved.</span></span>
      <span data-i18n="madeForYou">Made for fashion, made for you.</span>
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
}

/* ---------- Location detection & city selector ---------- */
function setupLocation() {
  const btn = document.getElementById("navLocationBtn");
  const textEl = document.getElementById("navLocationText");
  const menu = document.getElementById("locationDropdownMenu");
  const detectBtn = document.getElementById("locDetectAction");
  const cityGrid = document.getElementById("locCityGrid");
  if (!btn || !menu) return;

  // Populate city grid
  if (cityGrid) {
    cityGrid.innerHTML = POPULAR_CITIES.map((c) => `<button class="loc-city-chip" data-city="${c}">${c}</button>`).join("");
  }

  // Load saved location
  const saved = TatitoStore.getLocation();
  if (saved && saved.city) {
    textEl.textContent = `📍 ${saved.city}`;
  } else {
    // Auto-detect on first load
    setTimeout(autoDetectLocation, 500);
  }

  // Toggle dropdown
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("open");
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".location-dropdown")) menu.classList.remove("open");
  });

  // Detect button
  detectBtn?.addEventListener("click", () => {
    menu.classList.remove("open");
    textEl.textContent = "📍 Detecting...";
    autoDetectLocation();
  });

  // City chip click
  cityGrid?.addEventListener("click", (e) => {
    const chip = e.target.closest(".loc-city-chip");
    if (!chip) return;
    const city = chip.dataset.city;
    TatitoStore.setLocation(city);
    textEl.textContent = `📍 ${city}`;
    menu.classList.remove("open");
    showToast(`Location set to ${city}`, "success");
  });
}

function autoDetectLocation() {
  const textEl = document.getElementById("navLocationText");

  if (!navigator.geolocation) {
    if (textEl) textEl.textContent = "📍 Select City";
    return;
  }

  TatitoStore.detectLocation().then((loc) => {
    if (!loc) {
      const defaultCity = "Mumbai";
      TatitoStore.setLocation(defaultCity);
      if (textEl) textEl.textContent = `📍 ${defaultCity}`;
      return;
    }
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${loc.lat}&lon=${loc.lng}&zoom=10`)
      .then((r) => r.json())
      .then((data) => {
        const city = data?.address?.city || data?.address?.town ||
                     data?.address?.state_district || data?.address?.state || "";
        if (city) {
          TatitoStore.setLocation(city, loc.lat, loc.lng);
          if (textEl) textEl.textContent = `📍 ${city}`;
        } else {
          if (textEl) textEl.textContent = "📍 Current Location";
        }
      })
      .catch(() => {
        if (textEl) textEl.textContent = "📍 Current Location";
      });
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
  grid.innerHTML = CATEGORIES.map((cat) => `
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

  if (item.variantType && item.variantType !== "none") {
    showToast("Please select a size on the shop page");
    setTimeout(() => { window.location.href = `shop.html?shop=${storeId}`; }, 800);
    return;
  }

  TatitoStore.addToCart(storeId, itemId, {
    name: item.name,
    price: item.price,
    image: item.image,
    shopName: store.name,
    category: store.category
  });
  showToast(`${item.name} added to cart`, "success");
});

let currentSort = "distance";

function renderStores() {
  const grid = document.getElementById("storeGrid");
  if (!grid) return;

  let stores = [...STORES];
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
          <span class="store-dist">${formatDistance(store.distance)}</span>
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
    case "premium": return arr.sort((a, b) => (b.badge === "Premium" ? 1 : 0) - (a.badge === "Premium" ? 1 : 0) || b.rating - a.rating);
    case "open": return arr.sort((a, b) => (b.open ? 1 : 0) - (a.open ? 1 : 0));
    case "distance":
    default: return arr.sort((a, b) => a.distance - b.distance);
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

/* ---------- Init on every page ---------- */
function initApp() {
  renderNavbar();
  renderFooter();

  // Homepage-specific
  renderCategories();
  renderFeaturedProducts();
  renderDealsProducts();
  if (document.body.dataset.page !== "category") {
    renderStores();
  }
  setupSortChips();
  setupHeroSearch();

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
