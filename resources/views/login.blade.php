<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Login | Tatito Fashions</title>
  <meta name="description" content="Sign in to Tatito Fashions to save favorites and continue browsing." />
  <link rel="icon" href="assets/images/tatito-logo.jpeg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>

  <main class="auth-page">
    <div class="auth-card">
      <p class="eyebrow">Welcome back</p>
      <h1>Login to Tatito</h1>
      <p class="auth-text">Access your saved favorites, recent searches and personalized fashion suggestions.</p>
      <form class="auth-form">
        <label>
          Email
          <input type="email" placeholder="you@example.com" required />
        </label>
        <label>
          Password
          <input type="password" placeholder="Enter your password" required />
        </label>
        <button type="submit" class="btn btn-primary">Login</button>
      </form>
      <p class="auth-switch">New here? <a href="register.html">Create an account</a></p>
    </div>
  </main>

  <script src="js/auth.js"></script>
</body>
</html>
