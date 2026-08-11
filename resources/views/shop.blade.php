<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Shop Details | Tatito Fashions</title>
  <link rel="icon" href="assets/images/tatito-logo.jpeg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css" />
</head>
<body data-page="shop">
  <header class="navbar">
    <div class="nav-inner">
      <a class="nav-logo" href="index.html">
        <img src="assets/images/tatito-logo.jpeg" alt="Tatito Fashions" />
        <span>Tatito<em>Fashions</em></span>
      </a>
      <nav class="nav-links">
        <a href="category.html">All Shops</a>
        <a href="wishlist.html">Wishlist</a>
        <a href="cart.html">Cart <span id="cartCount" class="pill-count">0</span></a>
      </nav>
    </div>
  </header>

  <main class="page-shell">
    <div id="shopDetailRoot"></div>
  </main>

  <script src="js/data.js"></script>
  <script src="js/shop.js"></script>
</body>
</html>
