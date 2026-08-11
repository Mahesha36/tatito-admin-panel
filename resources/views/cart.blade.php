<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cart | Tatito Fashions</title>
  <link rel="icon" href="assets/images/tatito-logo.jpeg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css" />
</head>
<body data-page="cart">
  <header class="navbar">
    <div class="nav-inner">
      <a class="nav-logo" href="index.html">
        <img src="assets/images/tatito-logo.jpeg" alt="Tatito Fashions" />
        <span>Tatito<em>Fashions</em></span>
      </a>
      <nav class="nav-links">
        <a href="wishlist.html">Wishlist</a>
        <a href="cart.html">Cart <span id="cartCount" class="pill-count">0</span></a>
      </nav>
    </div>
  </header>

  <main class="page-shell">
    <section class="category-hero">
      <div>
        <p class="eyebrow">Your shopping bag</p>
        <h1>Cart & appointments</h1>
        <p>Place orders for products and confirm service bookings from one place.</p>
      </div>
      <div class="hero-card">
        <h3>Ready to checkout?</h3>
        <p>Use the buttons below to place your order or confirm booked services.</p>
      </div>
    </section>

    <section class="section" style="padding:0;">
      <div class="cart-layout">
        <div id="cartItems" class="cart-stack"></div>
        <div class="cart-sidebar">
          <div id="cartSummary" class="cart-summary"></div>
          <button id="placeOrderBtn" class="btn btn-primary" data-action="place-order">Place Order</button>
          <button id="bookAppointmentBtn" class="btn btn-ghost" data-action="confirm-appointments">Confirm Booked Services</button>
        </div>
      </div>
    </section>
  </main>

  <script src="js/data.js"></script>
  <script src="js/shop.js"></script>
</body>
</html>
