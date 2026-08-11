<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Category Catalog | Tatito Fashions</title>
  <meta name="description" content="Browse Tatito fashion categories and filtered vendor listings." />
  <link rel="icon" href="assets/images/tatito-logo.jpeg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <header class="navbar">
    <div class="nav-inner">
      <a class="nav-logo" href="index.html">
        <img src="assets/images/tatito-logo.jpeg" alt="Tatito Fashions" />
        <span>Tatito<em>Fashions</em></span>
      </a>
      <nav class="nav-links">
        <a href="category.html?category=boutiques">Boutiques</a>
        <a href="category.html?category=designers">Designers</a>
        <a href="category.html?category=wedding">Wedding</a>
        <a href="category.html?category=jewellery">Jewellery</a>
        <a href="category.html?category=photographers">Photographers</a>
      </nav>
      <div class="nav-actions">
        <a class="location-pill" href="index.html">Back to Home</a>
        <a class="icon-btn" href="wishlist.html" title="Wishlist" aria-label="Wishlist">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M12 20.5s-7.5-4.6-10-9.3C.5 7.6 2.7 4 6.3 4c2 0 3.6 1 5.7 3 2.1-2 3.7-3 5.7-3 3.6 0 5.8 3.6 4.3 7.2-2.5 4.7-10 9.3-10 9.3Z" stroke="currentColor" stroke-width="1.5"/></svg>
          <span id="wishlistCount" class="pill-count">0</span>
        </a>
        <a class="icon-btn" href="cart.html" title="Cart" aria-label="Cart">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M3 4h2l2.2 12.2a2 2 0 0 0 2 1.8h7.6a2 2 0 0 0 2-1.6L20.5 8H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="21" r="1.3" fill="currentColor"/><circle cx="18" cy="21" r="1.3" fill="currentColor"/></svg>
          <span id="cartCount" class="pill-count">0</span>
        </a>
      </div>
    </div>
  </header>

  <main class="page-shell">
    <section class="category-hero">
      <div>
        <p class="eyebrow">Tatito catalog</p>
        <h1 id="categoryPageTitle">Browse All Categories</h1>
        <p id="categoryPageDescription">Explore curated fashion, event and service vendors from Tatito.</p>
        <div id="categoryChipList" class="category-badges"></div>
      </div>
      <div class="hero-card">
        <h3>Search your next favourite vendor</h3>
        <p>Use the search bar to find boutiques, designers, planners, jewelers and photographers by keyword.</p>
        <form id="catalogSearchForm" class="hero-search" style="margin-top:18px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="hero-search-icon"><circle cx="11" cy="11" r="7" stroke="#8B6F2E" stroke-width="1.7"/><path d="M21 21l-4-4" stroke="#8B6F2E" stroke-width="1.7" stroke-linecap="round"/></svg>
          <input id="catalogSearchInput" type="text" placeholder="Search by keyword or category" />
          <button type="submit" class="hero-search-submit">Search</button>
        </form>
      </div>
    </section>

    <section class="section" style="padding:0;">
      <div class="section-head">
        <div>
          <h2 id="resultsHeading">Featured Vendors</h2>
          <p id="resultsSummary">Browse top-rated vendors curated for your city.</p>
        </div>
      </div>
      <div id="storeGrid" class="store-grid"></div>
    </section>
  </main>

  <footer class="footer">
    <div class="footer-top">
      <div class="footer-brand">
        <img src="assets/images/tatito-logo.jpeg" alt="Tatito Fashions" />
        <p>Tatito Fashions</p>
        <span>Custom fashion for everyone.</span>
      </div>
    </div>
  </footer>

  <script src="js/data.js"></script>
  <script src="js/catalog.js"></script>
  <script src="js/shop.js"></script>
</body>
</html>
