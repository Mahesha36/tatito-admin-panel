# TATITO Fashions — Full Stack Project

## Project Structure

```
tatito-fashions-web/
├── app/                          # Laravel Backend
│   ├── Http/Controllers/Api/     # API Controllers (AuthController, etc.)
│   └── Models/                   # Eloquent Models (User, Otp)
├── bootstrap/                    # Laravel bootstrap
├── config/                       # Laravel config (app, auth, db, passport, etc.)
├── database/
│   ├── factories/                # Model factories
│   ├── migrations/               # Database migrations
│   └── seeders/                  # Database seeders
├── docs/                         # API documentation
│   ├── api/                      # Auth endpoint docs
│   └── database/                 # Migration & schema docs
├── public/                       # Web root (served by web server)
│   ├── admin/                    # ⭐ Admin Panel (HTML/CSS/JS)
│   │   ├── css/                  # theme.css, layout.css, components.css, pages.css
│   │   ├── js/                   # Core: helpers, data, app, i18n, api, member-actions, seller-app
│   │   │   └── pages/            # 56 page modules (dashboard, products, orders, etc.)
│   │   ├── assets/               # logo.svg, feather.svg
│   │   ├── app.html              # Admin dashboard entry point
│   │   ├── index.html            # Admin login page
│   │   └── seller.html           # Seller portal
│   ├── frontend/                 # ⭐ Customer-Facing Website (HTML/CSS/JS)
│   │   ├── css/                  # style.css
│   │   ├── js/                   # 21 modules (app, auth, catalog, checkout, etc.)
│   │   ├── assets/images/        # Logos, favicons
│   │   ├── index.html            # Homepage
│   │   ├── shop.html             # Product listing
│   │   ├── cart.html             # Shopping cart
│   │   ├── checkout.html         # Checkout flow
│   │   ├── login.html            # Customer login
│   │   ├── register.html         # Customer registration
│   │   └── ... (26 pages total)
│   ├── .htaccess                 # Laravel rewrite rules
│   └── index.php                 # Laravel entry point
├── resources/                    # Laravel Blade views & assets
├── routes/
│   ├── api.php                   # API routes (/api/*)
│   └── web.php                   # Web routes
├── storage/                      # Laravel storage (logs, cache, uploads)
├── tests/                        # PHPUnit tests
├── .env.example                  # Environment template
├── artisan                      # Laravel CLI
├── composer.json                 # PHP dependencies
├── package.json                  # Node dependencies
├── phpunit.xml                   # Test config
└── vite.config.js                # Vite config
```

## How It Connects

```
Browser → public/           → Laravel serves API + Blade views
         ├─ /frontend/      → Customer website (static HTML/CSS/JS)
         ├─ /admin/         → Admin panel (static HTML/CSS/JS)
         └─ /api/           → Laravel REST API (Passport auth)
```

## URLs (when deployed)

| URL | What |
|-----|------|
| `yourdomain.com/` | Laravel default route |
| `yourdomain.com/frontend/` | Customer website homepage |
| `yourdomain.com/admin/` | Admin panel login |
| `yourdomain.com/api/login` | API login endpoint |
| `yourdomain.com/api/register` | API register endpoint |

## Setup Instructions

### Backend (Laravel)
```bash
composer install
cp .env.example .env
php artisan key:generate
# Configure database in .env
php artisan migrate
php artisan passport:install
php artisan serve
```

### Frontend (Customer Website)
The files in `public/frontend/` are static HTML — no build step needed.
Open `public/frontend/index.html` directly or serve via web server.

### Admin Panel
The files in `public/admin/` are static HTML — no build step needed.
Open `public/admin/index.html` to access the admin login.
```
Login: admin@tatitofashions.com
Password: admin123
```
```
