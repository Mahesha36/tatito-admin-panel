@extends('layouts.app')

@section('title', 'Home')

@section('content')


  <main>
    <!-- HERO -->
    <section class="hero">
      <div class="hero-text">
        <p class="eyebrow">Showing results near <span id="heroLocationText">your city</span></p>
        <h1>Discover Fashion, <em>Tailored</em> to Where You Stand</h1>
        <p class="hero-desc">From heirloom bridal lehengas to the tailor three streets away — Tatito connects you with the boutiques, designers and stylists closest to you.</p>
        <form id="heroSearchForm" class="hero-search">
          <button type="button" id="heroLocationBtn" class="hero-search-location">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22Z" stroke="#C9A24B" stroke-width="1.6"/><circle cx="12" cy="9.5" r="2.2" stroke="#C9A24B" stroke-width="1.6"/></svg>
            <span id="heroSearchLocationText">Select City</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" class="chev"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <span class="hero-search-divider"></span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="hero-search-icon"><circle cx="11" cy="11" r="7" stroke="#8B6F2E" stroke-width="1.7"/><path d="M21 21l-4-4" stroke="#8B6F2E" stroke-width="1.7" stroke-linecap="round"/></svg>
          <input id="heroSearchInput" type="text" placeholder="Search boutiques, designers, jewellery, photographers…" />
          <button type="submit" class="hero-search-submit">Search</button>
        </form>
        <div class="hero-stats">
          <div><strong>2,400+</strong><span>Verified Vendors</span></div>
          <div><strong>18</strong><span>Service Categories</span></div>
          <div><strong>4.8★</strong><span>Avg. Customer Rating</span></div>
        </div>
      </div>
      <div class="hero-visual">
        <img src="{{ asset('assets/images/tatito-logo.jpeg') }}" alt="Tatito Fashions" />
        <div class="hero-visual-glow"></div>
      </div>
    </section>

    <!-- CATEGORY GRID -->
    <section class="section">
      <div class="section-head">
        <h2>Shop by Category</h2>
        <p>Curated categories across fashion, jewellery and wedding services</p>
      </div>
      <div id="categoryGrid" class="category-grid"></div>
    </section>

    <!-- NEARBY STORES -->
    <section id="nearby" class="section alt">
      <div class="section-head">
        <div>
          <h2>Nearby Stores &amp; Services</h2>
          <p>Handpicked results around <span id="nearbyLocationText">your area</span></p>
        </div>
        <div class="sort-row">
          <button class="sort-chip active">Nearest</button>
          <button class="sort-chip">Top Rated</button>
          <button class="sort-chip">Premium</button>
          <button class="sort-chip">Open Now</button>
        </div>
      </div>
      <div id="storeGrid" class="store-grid"></div>
    </section>

    <!-- FEATURED / WEDDING -->
    <section class="section">
      <div class="section-head">
        <h2>Wedding &amp; Occasion Collection</h2>
        <p>Bridal wear, mandap decor, photographers and planners — all in one place</p>
      </div>
      <div class="feature-strip">
        <div class="feature-card">
          <span class="feature-tag">Bridal</span>
          <h3>Wedding Lehengas &amp; Sherwanis</h3>
          <p>Explore handpicked bridal collections from top-rated boutiques near you.</p>
        </div>
        <div class="feature-card dark">
          <span class="feature-tag gold">Custom</span>
          <h3>Design Your Own Outfit</h3>
          <p>Upload a reference, share your measurements, and get quotes from nearby designers.</p>
        </div>
        <div class="feature-card">
          <span class="feature-tag">Services</span>
          <h3>Photographers &amp; Decorators</h3>
          <p>Book verified event professionals for your big day, sorted by rating and distance.</p>
        </div>
      </div>
    </section>

    <!-- NEWSLETTER -->
    <section class="newsletter">
      <h2>Stay in the loop</h2>
      <p>Get new boutique arrivals and offers near you, once a week.</p>
      <form onsubmit="return false;" class="newsletter-form">
        <input type="email" placeholder="Enter your email" required />
        <button type="submit">Subscribe</button>
      </form>
    </section>
  </main>
 @endsection