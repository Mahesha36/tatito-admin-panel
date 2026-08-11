<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Tatito Fashions — Custom Fashion For Everyone</title>
<meta name="description" content="Tatito Fashions — discover boutiques, designers, jewellers and wedding services near you." />
<link rel="icon" href="assets/images/tatito-logo.jpeg" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
 
<link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>

<!-- ===================== SPLASH SCREEN ===================== -->
<section id="splash" class="splash">
  <div class="splash-inner">
    <img src="assets/images/tatito-logo.jpeg" alt="Tatito Fashions" class="splash-logo" />
    <div class="splash-name">
      <span class="splash-title">TATITO</span>
      <span class="splash-sub">FASHIONS</span>
    </div>
    <div class="splash-bar"><div class="splash-bar-fill"></div></div>
    <p class="splash-text">Finding fashion and services near you…</p>
  </div>
</section>

<!-- ===================== LOCATION PERMISSION MODAL ===================== -->
<div id="locationModal" class="overlay hidden">
  <div class="modal">
    <div class="modal-icon">
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22Z" stroke="#C9A24B" stroke-width="1.5"/><circle cx="12" cy="9.5" r="2.5" stroke="#C9A24B" stroke-width="1.5"/></svg>
    </div>
    <h2>Allow Location Access</h2>
    <p>We use your location to discover nearby boutiques, fashion designers, jewellery stores, photographers, event planners, caterers, decorators and other services available in your city.</p>
    <div class="modal-actions">
      <button id="allowLocationBtn" class="btn btn-primary">Allow Location</button>
      <button id="manualCityBtn" class="btn btn-ghost">Enter City Manually</button>
    </div>
    <p id="locationStatus" class="modal-status"></p>
  </div>
</div>

<!-- ===================== CITY SELECTION SCREEN ===================== -->
<div id="cityScreen" class="overlay hidden">
  <div class="city-panel">
    <button id="closeCityScreen" class="city-close" aria-label="Close">&times;</button>
    <h2>Select Your City</h2>
    <p class="city-sub">Choose a city to see fashion and services near you</p>

    <div class="city-search-wrap">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#8B6F2E" stroke-width="1.7"/><path d="M21 21l-4-4" stroke="#8B6F2E" stroke-width="1.7" stroke-linecap="round"/></svg>
      <input type="text" id="citySearchInput" placeholder="Search for your city…" autocomplete="off" />
    </div>
    <ul id="citySuggestions" class="city-suggestions hidden"></ul>

    <div id="recentCityWrap" class="city-group hidden">
      <h3>Recent</h3>
      <div id="recentCityList" class="city-chip-list"></div>
    </div>

    <div class="city-group">
      <h3>Popular Cities</h3>
      <div id="popularCityList" class="city-chip-list"></div>
    </div>
  </div>
</div>

<!-- ===================== MAIN SITE ===================== -->
<div id="mainSite" class="hidden">

  <!-- NAVBAR -->
  <header class="navbar">
    <div class="nav-inner">
      <a class="nav-logo" href="#">
        <img src="assets/images/tatito-logo.jpeg" alt="Tatito Fashions" />
        <span>Tatito<em>Fashions</em></span>
      </a>

      <nav class="nav-links">
        <a href="category.html?category=boutiques">Boutiques</a>
        <a href="category.html?category=wedding">Wedding</a>
        <a href="category.html?category=jewellery">Jewellery</a>
        <a href="category.html?category=designers">Designers</a>
        <a href="category.html?category=photographers">Photographers</a>
        <a href="#nearby">Nearby Shops</a>
        <a href="category.html">All Categories</a>
      </nav>

      <div class="nav-actions">
        <button id="locationPill" class="location-pill" title="Change city">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22Z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="9.5" r="2.5" stroke="currentColor" stroke-width="1.6"/></svg>
          <span id="locationPillText">Select City</span>
        </button>
        <button class="icon-btn" title="Wishlist" aria-label="Wishlist">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M12 20.5s-7.5-4.6-10-9.3C.5 7.6 2.7 4 6.3 4c2 0 3.6 1 5.7 3 2.1-2 3.7-3 5.7-3 3.6 0 5.8 3.6 4.3 7.2-2.5 4.7-10 9.3-10 9.3Z" stroke="currentColor" stroke-width="1.5"/></svg>
        </button>
        <button class="icon-btn" title="Cart" aria-label="Cart">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M3 4h2l2.2 12.2a2 2 0 0 0 2 1.8h7.6a2 2 0 0 0 2-1.6L20.5 8H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="21" r="1.3" fill="currentColor"/><circle cx="18" cy="21" r="1.3" fill="currentColor"/></svg>
        </button>
        <a class="icon-btn nav-profile" href="login.html" title="Profile" aria-label="Profile">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.4" stroke="currentColor" stroke-width="1.5"/><path d="M4.5 20c1.6-3.6 4.6-5.4 7.5-5.4s5.9 1.8 7.5 5.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </a>
        <a class="icon-btn" href="wishlist.html" title="Wishlist" aria-label="Wishlist">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M12 20.5s-7.5-4.6-10-9.3C.5 7.6 2.7 4 6.3 4c2 0 3.6 1 5.7 3 2.1-2 3.7-3 5.7-3 3.6 0 5.8 3.6 4.3 7.2-2.5 4.7-10 9.3-10 9.3Z" stroke="currentColor" stroke-width="1.5"/></svg>
          <span id="wishlistCount" class="pill-count">0</span>
        </a>
        <a class="icon-btn" href="cart.html" title="Cart" aria-label="Cart">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M3 4h2l2.2 12.2a2 2 0 0 0 2 1.8h7.6a2 2 0 0 0 2-1.6L20.5 8H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="21" r="1.3" fill="currentColor"/><circle cx="18" cy="21" r="1.3" fill="currentColor"/></svg>
          <span id="cartCount" class="pill-count">0</span>
        </a>
        <button id="menuToggle" class="menu-toggle" aria-label="Menu"><span></span><span></span><span></span></button>
      </div>
    </div>
    <div id="mobileNav" class="mobile-nav">
      <a href="category.html?category=boutiques">Boutiques</a>
      <a href="category.html?category=wedding">Wedding</a>
      <a href="category.html?category=jewellery">Jewellery</a>
      <a href="category.html?category=designers">Designers</a>
      <a href="category.html?category=photographers">Photographers</a>
      <a href="#nearby">Nearby Shops</a>
      <a href="category.html">All Categories</a>
    </div>
  </header>