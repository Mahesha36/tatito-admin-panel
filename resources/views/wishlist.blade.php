<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Wishlist | Tatito Fashions</title>
  <link rel="icon" href="assets/images/tatito-logo.jpeg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css" />
</head>
<body data-page="wishlist">
  <header class="navbar">
    <div class="nav-inner">
      <a class="nav-logo" href="index.html">
        <img src="assets/images/tatito-logo.jpeg" alt="Tatito Fashions" />
        <span>Tatito<em>Fashions</em></span>
      </a>
      <nav class="nav-links">
        <a href="cart.html">Cart <span id="cartCount" class="pill-count">0</span></a>
        <a href="wishlist.html">Wishlist <span id="wishlistCount" class="pill-count">0</span></a>
      </nav>
    </div>
  </header>

  <main class="page-shell">
    <section class="category-hero">
      <div>
        <p class="eyebrow">Saved favourites</p>
        <h1>Your wishlist</h1>
        <p>Keep your favourite boutiques, designers and services ready to shop later.</p>
      </div>
      <div class="hero-card">
        <h3>Coming back soon?</h3>
        <p>Move any saved item to your cart when you’re ready.</p>
      </div>
    </section>

    <section class="section" style="padding:0;">
      <div id="wishlistItems" class="cart-stack"></div>
    </section>
  </main>

  <script src="js/data.js"></script>
  <script src="js/shop.js"></script>
</body>
</html>
