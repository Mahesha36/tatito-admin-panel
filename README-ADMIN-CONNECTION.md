# TATITO Admin Panel — Complete Integration & Backend Connection Guide

This document explains how the admin panel, frontend, and backend are wired together, what data flows where, and exactly which files and line numbers to change when connecting a real database via API.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Current Data Flow (MockData + localStorage)](#2-current-data-flow-mockdata--localstorage)
3. [Admin ↔ Frontend Bridge](#3-admin--frontend-bridge)
4. [Authentication Flow](#4-authentication-flow)
5. [Backend Connection: Step-by-Step](#5-backend-connection-step-by-step)
6. [Entity-by-Entity Connection Guide](#6-entity-by-entity-connection-guide)
7. [File Map: What to Change and Where](#7-file-map-what-to-change-and-where)
8. [API Endpoint Reference](#8-api-endpoint-reference)
9. [Environment Variables](#9-environment-variables)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                        │
│                                                         │
│  ┌──────────────┐          ┌──────────────────────┐    │
│  │   FRONTEND   │          │    ADMIN PANEL        │    │
│  │              │          │                       │    │
│  │  public/     │          │  public/admin/        │    │
│  │  frontend/   │          │                       │    │
│  │              │          │                       │    │
│  │  Store.js    │          │  Bridge.Data          │    │
│  │  (localStorage│  ←───→  │  (localStorage:       │    │
│  │   keys)      │  BRIDGE  │   tatito_admin_data)  │    │
│  │              │          │                       │    │
│  │  admin-      │  ←──────│  Bridge.Frontend      │    │
│  │  bridge.js   │  READ    │  (reads frontend      │    │
│  │  (reads      │  ONLY    │   localStorage keys)  │    │
│  │   admin data)│          │                       │    │
│  └──────────────┘          └──────────────────────┘    │
│          │                          │                   │
└──────────┼──────────────────────────┼───────────────────┘
           │                          │
           ▼                          ▼
     [FUTURE: API calls]        [FUTURE: API calls]
           │                          │
           ▼                          ▼
    ┌─────────────────────────────────────┐
    │          BACKEND (Laravel API)       │
    │                                      │
    │  /api/v1/sellers                     │
    │  /api/v1/products                    │
    │  /api/v1/orders                      │
    │  /api/v1/seller-applications         │
    │  /api/v1/auth/login                  │
    │  ...etc                              │
    │                                      │
    │  MySQL Database                      │
    └─────────────────────────────────────┘
```

### Key Principle

Currently there is **no backend**. All data lives in the browser's `localStorage`. The admin panel and frontend each have their own localStorage keys, and a **bridge layer** connects them read-only. When a real database is connected, the API replaces localStorage as the shared data store.

---

## 2. Current Data Flow (MockData + localStorage)

### Admin Panel Side

| Component | File | What it does |
|---|---|---|
| **MockData** | `public/admin/js/data.js` | In-memory object with ALL admin data (accounts, sellers, products, orders, etc.). 1206 lines. |
| **Bridge.Data** | `public/admin/js/bridge.js` (lines 160–310) | Saves/loads MockData to/from `localStorage['tatito_admin_data']`. Methods: `save()`, `load()`, `saveEntity(key, data)`. |
| **Bridge.Auth** | `public/admin/js/bridge.js` (lines 84–159) | Admin authentication. Checks accounts in MockData, manages session in `localStorage['tatito_admin_session']`. 24-hour session expiry. |
| **Bridge.Frontend** | `public/admin/js/bridge.js` (lines 310–420) | Read-only access to frontend localStorage keys (orders, reviews, cart, seller apps, etc.). |
| **Bridge.Settings** | `public/admin/js/bridge.js` (lines 420–500) | Saves/loads website settings to `localStorage['tatito_admin_settings']`. |
| **Bridge.Catalog** | `public/admin/js/bridge.js` (lines 414–600) | Reads catalog data from frontend's `data.js` (categories, stores, hero slides, homepage sections). |

### Frontend Side

| Component | File | What it does |
|---|---|---|
| **TatitoStore** | `public/frontend/js/store.js` | IIFE managing frontend localStorage. Cart, wishlist, orders, user session, seller apps, custom requests, bookings, consultations, addresses, notifications. |
| **FrontendBridge** | `public/frontend/js/admin-bridge.js` | Read-only bridge. Reads admin's `localStorage['tatito_admin_data']` to display admin-managed products, offers, settings on the storefront. |

### localStorage Keys Map

| Key | Written by | Read by | Purpose |
|---|---|---|---|
| `tatito_admin_data` | Admin Bridge.Data | Admin app.js, FrontendBridge | All admin MockData (products, sellers, orders, settings, etc.) |
| `tatito_admin_session` | Admin Bridge.Auth | Admin app.js (session gate) | Admin login session (email, name, role, loginTime) |
| `tatito_admin_settings` | Admin Bridge.Settings | FrontendBridge.applyAdminSettings | Website name, colors, SEO, scripts |
| `tatito_cart` | Frontend TatitoStore | Frontend only | Shopping cart |
| `tatito_user` | Frontend TatitoStore | Frontend, Admin Bridge.Frontend | Logged-in customer |
| `tatito_orders` | Frontend TatitoStore | Frontend, Admin Bridge.Frontend | Customer orders |
| `tatito_reviews` | Frontend TatitoStore | Frontend, Admin Bridge.Frontend | Product reviews |
| `tatito_seller_apps` | Frontend TatitoStore | Frontend, Admin Bridge.Frontend | Seller registration applications |
| `tatito_custom_requests` | Frontend TatitoStore | Frontend, Admin Bridge.Frontend | Custom design requests |
| `tatito_wishlist` | Frontend TatitoStore | Frontend only | Wishlist items |
| `tatito_addresses` | Frontend TatitoStore | Frontend, Admin Bridge.Frontend | Saved addresses |
| `tatito_bookings` | Frontend TatitoStore | Frontend, Admin Bridge.Frontend | Service bookings |
| `tatito_consultations` | Frontend TatitoStore | Frontend, Admin Bridge.Frontend | Consultation bookings |

---

## 3. Admin ↔ Frontend Bridge

### How data flows TODAY

```
Admin Panel edits → Bridge.Data.saveEntity() → localStorage['tatito_admin_data']
                                                        ↓
Frontend loads → FrontendBridge.getAdminData() reads localStorage → renders on storefront
```

### What's connected (admin edits → frontend reflects)

| Admin Page | MockData Key | How frontend reads it |
|---|---|---|
| Products | `MockData.products` | `FrontendBridge.getAdminProducts()` → injected as "Tatito Official" store |
| Offers | `MockData.offers` | `FrontendBridge.getAdminOffers()` |
| Categories | `MockData.categories` | `FrontendBridge.getAdminCategories()` |
| Website Header | `MockData.websiteHeader` | `FrontendBridge.getAdminHeader()` → `renderNavbar()` |
| Website Footer | `MockData.websiteFooter` | `FrontendBridge.getAdminFooter()` → `renderFooter()` |
| Website Setup | `MockData.websiteSetup` | `FrontendBridge.getAdminWebsiteSetup()` → colors, SEO, site name |
| Home Page Settings | `MockData.homePageSettings` | `FrontendBridge.showHeroSlider()`, section visibility |
| Video Banners | `MockData.homePageSettings.sliderImages` | `FrontendBridge.getAdminHeroSlides()` → `applyHeroSlider()` |
| Home Collections | `MockData.homeCollectionsSettings` | `FrontendBridge.applyCollectionVisibility()` |
| Dynamic Sections | `MockData.homepageSectionSettings` | `FrontendBridge.applyHomepageSectionSettings()` |
| Reviews | `MockData.reviews` | `FrontendBridge` reads, admin manages |
| Orders | `MockData.orders` | `Bridge.Frontend.getOrders()` reads frontend orders |
| Users | `MockData.users` | `Bridge.Frontend.getUser()` reads frontend user |
| Contact Queries | `MockData.contactQueries` | `Bridge.Frontend.getContactMessages()` |

### What's NOT connected (frontend writes, admin never sees)

| Frontend Key | Bridge Method Exists? | Admin Page Calls It? |
|---|---|---|
| `tatito_seller_apps` | ✅ `Bridge.Frontend.getSellerApps()` (bridge.js line 337) | ❌ **Never called** |
| `tatito_custom_requests` | ✅ `Bridge.Frontend.getCustomRequests()` (bridge.js line 343) | ❌ **Never called** |
| `tatito_bookings` | ✅ `Bridge.Frontend.getBookings()` (bridge.js line ~360) | ❌ **Never called** |
| `tatito_consultations` | ✅ `Bridge.Frontend.getConsultations()` (bridge.js line ~360) | ❌ **Never called** |
| `tatito_addresses` | ✅ `Bridge.Frontend.getAddresses()` (bridge.js line ~360) | ❌ **Never called** |
| `tatito_notifications` | ✅ `FrontendBridge` method | ❌ **Never called** |
| `tatito_wishlist` | ✅ `FrontendBridge` method | ❌ **Never called** |

---

## 4. Authentication Flow

### Current (MockData)

```
User visits /admin/index.html
  → JavaScript checks localStorage for valid session
  → If no session → redirect to /frontend/login.html

User logs in on /frontend/login.html
  → auth.js (line 168): TatitoStore.login() sets frontend user session
  → auth.js (line 181-191): Bridge.Auth.checkAdminAccess(emailVal)
     → Checks email against MockData.accounts (via admin/js/data.js)
     → If admin match: Bridge.Auth.setAdminSession(account)
     → Redirects to /admin/app.html (admin) or /admin/seller.html (seller)
  → If no admin match: normal customer login → redirect to frontend/index.html

Admin panel app.html loads
  → app.js (line 107): Bridge.Auth.hasAdminSession()
  → If valid session → load dashboard
  → If invalid/expired → redirect to /frontend/login.html
```

### Files involved in auth

| File | Lines | Role |
|---|---|---|
| `public/admin/index.html` | 1–40 | Redirect script — checks session, redirects to app.html or frontend login |
| `public/frontend/login.html` | 1–155 | The ONLY login page (shared for customers, admins, sellers) |
| `public/frontend/js/auth.js` | 168–194 | Login form handler — detects admin accounts and redirects to admin panel |
| `public/admin/js/bridge.js` | 84–159 | Bridge.Auth — session management, account lookup, 24-hour expiry |
| `public/admin/js/app.js` | 97–116 | Session gate — blocks app.html if no valid session |

### When connecting backend

1. **`public/frontend/js/auth.js`** (line 168): Replace `TatitoStore.login()` with `POST /api/v1/auth/login`. On success, store JWT token.
2. **`public/admin/js/bridge.js`** (line 108): `checkAdminAccess()` → `GET /api/v1/auth/check-admin?email=X` (or decode JWT role claim).
3. **`public/admin/js/bridge.js`** (line 124): `setAdminSession()` → store JWT token in localStorage.
4. **`public/admin/js/bridge.js`** (line 139): `hasAdminSession()` → validate JWT token (check expiry).
5. **`public/admin/js/app.js`** (line 107): Session gate → check JWT token validity.

---

## 5. Backend Connection: Step-by-Step

### Step 1: Set `BACKEND_MODE = true`

| File | Line | Change |
|---|---|---|
| `public/admin/js/bridge.js` | 5 | `var BACKEND_MODE = false;` → `var BACKEND_MODE = true;` |
| `public/frontend/js/admin-bridge.js` | 18 | `var BACKEND_MODE = false;` → `var BACKEND_MODE = true;` |

### Step 2: Build API endpoints

Create these Laravel routes in `routes/api.php` (see [Section 8](#8-api-endpoint-reference) for full list).

### Step 3: Replace MockData reads with API calls

Every admin page file in `public/admin/js/pages/*.js` currently reads from `MockData.X`. Replace each with a `fetch()` call.

**Pattern:**

```javascript
// BEFORE (MockData):
var products = MockData.products;

// AFTER (API):
fetch('/api/v1/products')
  .then(r => r.json())
  .then(products => {
    // ... render with products
  });
```

### Step 4: Replace frontend localStorage writes with API calls

**Pattern:**

```javascript
// BEFORE (localStorage):
TatitoStore.addSellerApp(formData);
// → writes to localStorage['tatito_seller_apps']

// AFTER (API):
fetch('/api/v1/seller-applications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
  body: JSON.stringify(formData)
})
.then(r => r.json())
.then(result => { /* success */ });
```

### Step 5: Remove MockData

Once all pages use the API, delete the MockData object from `public/admin/js/data.js` and remove its `<script>` tag from `public/admin/app.html` (line 76).

---

## 6. Entity-by-Entity Connection Guide

### 6.1 Seller Registration

**Current flow:** Frontend `seller.js` → `TatitoStore.addSellerApp()` → `localStorage['tatito_seller_apps']`. Admin NEVER sees it.

**To connect:**

| File | Line(s) | Current | Change to |
|---|---|---|---|
| `public/frontend/js/seller.js` | ~398 | `TatitoStore.addSellerApp({...})` | `fetch('/api/v1/seller-applications', { method:'POST', body:JSON.stringify({...}) })` |
| `public/frontend/js/store.js` | 253–260 | `addSellerApp()` writes localStorage | Remove or redirect to API |
| `public/admin/js/pages/sellers.js` | ~14 | `MockData.sellers.map(...)` | `fetch('/api/v1/sellers').then(sellers => sellers.map(...))` |
| `public/admin/js/pages/approvals.js` | ~4 | `MockData.sellers.filter(s => s.status==='pending')` | `fetch('/api/v1/seller-applications?status=pending')` |
| `public/admin/js/pages/approvals.js` | approve/reject | Mutates MockData.sellers | `POST /api/v1/seller-applications/{id}/approve` |
| `public/admin/js/pages/dashboard.js` | ~7 | `MockData.sellers.length` | `fetch('/api/v1/sellers?count=true')` |
| `public/admin/js/bridge.js` | 337 | `getSellerApps()` reads localStorage | `fetch('/api/v1/seller-applications')` (or remove if unused) |

### 6.2 Products

| File | Line(s) | Current | Change to |
|---|---|---|---|
| `public/admin/js/pages/products.js` | ~14 | `MockData.products` | `fetch('/api/v1/products')` |
| `public/admin/js/pages/products.js` | save/delete | Mutates MockData.products | `POST/PUT/DELETE /api/v1/products/{id}` |
| `public/frontend/js/admin-bridge.js` | ~52 | `getAdminProducts()` reads localStorage | `fetch('/api/v1/products')` |

### 6.3 Orders

| File | Line(s) | Current | Change to |
|---|---|---|---|
| `public/admin/js/pages/orders.js` | ~14 | `MockData.orders` | `fetch('/api/v1/orders')` |
| `public/admin/js/pages/orders.js` | update status | Mutates MockData.orders | `PUT /api/v1/orders/{id}/status` |
| `public/frontend/js/store.js` | checkout flow | Writes `localStorage['tatito_orders']` | `POST /api/v1/orders` |
| `public/admin/js/bridge.js` | ~310 | `Bridge.Frontend.getOrders()` reads localStorage | `fetch('/api/v1/orders')` |

### 6.4 Users / Customers

| File | Line(s) | Current | Change to |
|---|---|---|---|
| `public/admin/js/pages/users.js` | ~14 | `MockData.users` | `fetch('/api/v1/users')` |
| `public/frontend/js/auth.js` | 168 | `TatitoStore.login()` → localStorage | `POST /api/v1/auth/login` → JWT |
| `public/frontend/js/auth.js` | 336–341 | Registration writes localStorage | `POST /api/v1/auth/register` |

### 6.5 Reviews

| File | Line(s) | Current | Change to |
|---|---|---|---|
| `public/admin/js/pages/reviews.js` | ~14 | `MockData.reviews` merged with `Bridge.Frontend.getReviews()` | `fetch('/api/v1/reviews')` (all reviews from API) |
| `public/frontend/js/store.js` | review submission | Writes `localStorage['tatito_reviews']` | `POST /api/v1/reviews` |

### 6.6 Categories

| File | Line(s) | Current | Change to |
|---|---|---|---|
| `public/admin/js/pages/categories.js` | ~14 | `MockData.categories`, `MockData.categoryTree` | `fetch('/api/v1/categories')` |
| `public/admin/js/pages/home-collections.js` | ~14 | Reads from frontend `data.js` CATEGORIES | `fetch('/api/v1/categories')` |

### 6.7 Offers / Coupons

| File | Line(s) | Current | Change to |
|---|---|---|---|
| `public/admin/js/pages/offers.js` | ~14 | `MockData.offers` | `fetch('/api/v1/offers')` |
| `public/frontend/js/admin-bridge.js` | ~62 | `getAdminOffers()` reads localStorage | `fetch('/api/v1/offers?status=active')` |

### 6.8 Staff

| File | Line(s) | Current | Change to |
|---|---|---|---|
| `public/admin/js/pages/staff.js` (if exists) | — | `MockData.staff` | `fetch('/api/v1/staff')` |

### 6.9 Contact Queries

| File | Line(s) | Current | Change to |
|---|---|---|---|
| `public/admin/js/pages/contact-us-queries.js` | ~14 | `MockData.contactQueries` + `Bridge.Frontend.getContactMessages()` | `fetch('/api/v1/contact-queries')` |
| `public/frontend/js/store.js` | contact form | Writes `localStorage['tatito_contact']` | `POST /api/v1/contact-queries` |

### 6.10 Website Settings (Header / Footer / Setup)

| File | Line(s) | Current | Change to |
|---|---|---|---|
| `public/admin/js/pages/website-header.js` | ~14 | `MockData.websiteHeader` | `fetch('/api/v1/settings/website-header')` |
| `public/admin/js/pages/website-footer.js` | ~7 | `MockData.websiteFooter` | `fetch('/api/v1/settings/website-footer')` |
| `public/admin/js/pages/website-setup.js` | ~14 | `MockData.websiteSetup` | `fetch('/api/v1/settings/website-setup')` |
| `public/admin/js/pages/home-page-settings.js` | ~14 | `MockData.homePageSettings` | `fetch('/api/v1/settings/home-page')` |
| `public/frontend/js/admin-bridge.js` | ~85–100 | `getAdminHeader/Footer/Settings()` read localStorage | `fetch('/api/v1/settings/...')` |

### 6.11 Homepage (Hero Slider, Collections, Sections)

| File | Line(s) | Current | Change to |
|---|---|---|---|
| `public/admin/js/pages/home-video-banners.js` | ~14 | `MockData.homePageSettings.sliderImages` | `fetch('/api/v1/settings/hero-slides')` |
| `public/admin/js/pages/home-collections.js` | ~14 | Reads frontend `data.js` directly | `fetch('/api/v1/categories')` + `fetch('/api/v1/stores')` |
| `public/admin/js/pages/home-dynamic-sections.js` | ~14 | `MockData.homepageSectionSettings` | `fetch('/api/v1/settings/home-sections')` |
| `public/frontend/js/admin-bridge.js` | ~386 | `getAdminHeroSlides()` reads localStorage | `fetch('/api/v1/settings/hero-slides')` |
| `public/frontend/js/admin-bridge.js` | ~400 | `showHeroSlider()` reads localStorage | Read from API settings |

### 6.12 Payments / Reports / Dashboard

| File | Line(s) | Current | Change to |
|---|---|---|---|
| `public/admin/js/pages/dashboard.js` | ~7–25 | Reads everything from MockData | `fetch('/api/v1/dashboard/stats')` |
| `public/admin/js/pages/reports.js` | ~14 | Reads MockData.orders + MockData.sellers | `fetch('/api/v1/reports/sales')`, `fetch('/api/v1/reports/sellers')` |
| `public/admin/js/pages/payments.js` (if exists) | — | `MockData.payments` | `fetch('/api/v1/payments')` |

---

## 7. File Map: What to Change and Where

### Admin Panel — Core

| File | Purpose | Key Lines to Change |
|---|---|---|
| `public/admin/js/bridge.js` | Data/Auth/Frontend/Settings/Catalog bridge | Line 5: `BACKEND_MODE`. Lines 160–310: Data methods. Lines 84–159: Auth methods. Lines 310–420: Frontend read methods. |
| `public/admin/js/data.js` | MockData object (1206 lines) | DELETE entirely once all pages use API |
| `public/admin/js/app.js` | Admin app init, session gate, migrations | Line 107: session check. Line 108: redirect. Lines 129–164: admin name migration (remove when MockData gone). |
| `public/admin/app.html` | Admin panel layout, script includes | Line 76: remove `data.js` include when MockData gone. Line 79: remove frontend `data.js` include. |
| `public/admin/index.html` | Redirect to frontend login (40 lines) | No changes needed — already redirects to `/frontend/login.html` |

### Admin Panel — Pages (`public/admin/js/pages/`)

Every file in this directory reads from `MockData.X`. Replace each `MockData.X` reference with a `fetch('/api/v1/X')` call.

| File | MockData Keys Used |
|---|---|
| `dashboard.js` | `orders, sellers, products, users, reviews` |
| `products.js` | `products, categories, sellers` |
| `orders.js` | `orders, products, users` |
| `sellers.js` | `sellers` |
| `users.js` | `users` |
| `reviews.js` | `reviews` + `Bridge.Frontend.getReviews()` |
| `offers.js` | `offers` |
| `categories.js` | `categories, categoryTree` |
| `contact-us-queries.js` | `contactQueries` + `Bridge.Frontend.getContactMessages()` |
| `settings.js` | `generalSettings, activation, paymentGateways` |
| `website-header.js` | `websiteHeader` |
| `website-footer.js` | `websiteFooter` |
| `website-setup.js` | `websiteSetup` |
| `home-page-settings.js` | `homePageSettings` |
| `home-collections.js` | `homeCollectionsSettings` + frontend `data.js` |
| `home-video-banners.js` | `homePageSettings.sliderImages` |
| `home-dynamic-sections.js` | `homepageSectionSettings` |
| `cms.js` | `cmsPages` |
| `media-manager.js` | frontend `data.js` images |
| `approvals.js` | `sellers` (pending only) |
| `staff.js` (if exists) | `staff` |
| `roles.js` (if exists) | `roles` |
| `reports.js` | `orders, sellers, products` |
| `payments.js` (if exists) | `payments` |
| `services.js` (if exists) | `services` |
| `designers.js` (if exists) | `designers` |
| `boutiques.js` (if exists) | `boutiques` |

### Frontend — Core

| File | Purpose | Key Lines to Change |
|---|---|---|
| `public/frontend/js/store.js` | TatitoStore — all frontend localStorage operations | Lines 248–260: `addSellerApp()`. Lines 262–275: custom requests. Lines 89–110: cart. All methods that read/write localStorage → replace with API calls |
| `public/frontend/js/auth.js` | Login/register forms | Line 168: `TatitoStore.login()` → `POST /api/v1/auth/login`. Line 181–191: admin detection → JWT role check |
| `public/frontend/js/admin-bridge.js` | FrontendBridge — reads admin data | Line 18: `BACKEND_MODE`. Lines 41–100: all `getAdminX()` methods → API calls |
| `public/frontend/js/app.js` | App init, renderNavbar/Footer/Categories | Line 890–945: `initApp()` — update function calls to async |
| `public/frontend/js/seller.js` | Seller registration 5-step form | Line 398: `TatitoStore.addSellerApp()` → `POST /api/v1/seller-applications` |
| `public/frontend/js/checkout.js` | Checkout flow | Replace localStorage order writes with `POST /api/v1/orders` |

### Frontend — Data

| File | Purpose | When connecting backend |
|---|---|---|
| `public/frontend/js/data.js` | Static catalog data (STORES, CATEGORIES, NAV_VERTICALS, etc.) | Replace static data with `fetch('/api/v1/catalog')` or keep as seed data |

---

## 8. API Endpoint Reference

### Authentication

```
POST   /api/v1/auth/login            — Login (email+password or mobile+OTP)
POST   /api/v1/auth/register          — Register new customer
POST   /api/v1/auth/logout            — Logout (invalidate token)
GET    /api/v1/auth/me                — Current user profile
GET    /api/v1/auth/check-admin       — Check if email is admin/seller
POST   /api/v1/auth/forgot-password   — Send reset link
POST   /api/v1/auth/reset-password    — Reset password with token
```

### Seller Applications

```
POST   /api/v1/seller-applications          — Frontend submits registration
GET    /api/v1/seller-applications           — Admin: all applications
GET    /api/v1/seller-applications?status=pending — Admin: pending only
POST   /api/v1/seller-applications/{id}/approve — Admin approves → creates seller
POST   /api/v1/seller-applications/{id}/reject  — Admin rejects
```

### Sellers (approved)

```
GET    /api/v1/sellers                 — List all sellers
GET    /api/v1/sellers/{id}            — Seller detail
PUT    /api/v1/sellers/{id}            — Update seller
DELETE /api/v1/sellers/{id}            — Deactivate seller
```

### Products

```
GET    /api/v1/products                — List all products
GET    /api/v1/products?category=X     — Filter by category
GET    /api/v1/products/{id}           — Product detail
POST   /api/v1/products                — Admin creates product
PUT    /api/v1/products/{id}           — Admin updates product
DELETE /api/v1/products/{id}           — Admin deletes product
```

### Orders

```
GET    /api/v1/orders                  — List all orders
GET    /api/v1/orders/{id}             — Order detail
POST   /api/v1/orders                  — Frontend creates order (checkout)
PUT    /api/v1/orders/{id}/status      — Admin updates order status
```

### Users / Customers

```
GET    /api/v1/users                   — List all users
GET    /api/v1/users/{id}              — User detail
PUT    /api/v1/users/{id}              — Update user
```

### Reviews

```
GET    /api/v1/reviews                 — List all reviews
GET    /api/v1/reviews?product_id=X    — Reviews for a product
POST   /api/v1/reviews                 — Frontend submits review
PUT    /api/v1/reviews/{id}            — Admin updates (approve/reject)
```

### Categories

```
GET    /api/v1/categories              — List all categories (flat)
GET    /api/v1/categories/tree         — Category tree (parent-child)
POST   /api/v1/categories              — Admin creates category
PUT    /api/v1/categories/{id}         — Admin updates category
DELETE /api/v1/categories/{id}         — Admin deletes category
```

### Offers / Coupons

```
GET    /api/v1/offers                  — List all offers
GET    /api/v1/offers?status=active    — Active offers (frontend)
POST   /api/v1/offers                  — Admin creates offer
PUT    /api/v1/offers/{id}             — Admin updates offer
DELETE /api/v1/offers/{id}             — Admin deletes offer
```

### Contact Queries

```
GET    /api/v1/contact-queries         — List all contact messages
POST   /api/v1/contact-queries         — Frontend submits contact form
PUT    /api/v1/contact-queries/{id}    — Admin marks as read/resolved
```

### Custom Requests

```
GET    /api/v1/custom-requests         — List all custom design requests
POST   /api/v1/custom-requests         — Frontend submits request
PUT    /api/v1/custom-requests/{id}    — Admin updates (quote, status)
```

### Website Settings

```
GET    /api/v1/settings/website-header  — Get header settings
PUT    /api/v1/settings/website-header  — Update header settings
GET    /api/v1/settings/website-footer  — Get footer settings
PUT    /api/v1/settings/website-footer  — Update footer settings
GET    /api/v1/settings/website-setup   — Get site settings (name, colors, SEO)
PUT    /api/v1/settings/website-setup   — Update site settings
GET    /api/v1/settings/home-page       — Get homepage settings
PUT    /api/v1/settings/home-page       — Update homepage settings
```

### Staff

```
GET    /api/v1/staff                   — List all staff
POST   /api/v1/staff                   — Create staff member
PUT    /api/v1/staff/{id}              — Update staff
DELETE /api/v1/staff/{id}              — Delete staff
```

### CMS Pages

```
GET    /api/v1/cms-pages               — List CMS pages
GET    /api/v1/cms-pages/{slug}        — Get page content
POST   /api/v1/cms-pages               — Create page
PUT    /api/v1/cms-pages/{id}          — Update page
DELETE /api/v1/cms-pages/{id}          — Delete page
```

### Dashboard & Reports

```
GET    /api/v1/dashboard/stats         — Dashboard summary (counts, revenue)
GET    /api/v1/reports/sales           — Sales report data
GET    /api/v1/reports/sellers         — Seller revenue report
GET    /api/v1/reports/products        — Product performance report
```

### Payments

```
GET    /api/v1/payments                — List all payments
GET    /api/v1/payments/{id}           — Payment detail
```

---

## 9. Environment Variables

When connecting the backend, add these environment variables:

```
# API Configuration
API_BASE_URL=/api/v1          # Base URL for all API calls
BACKEND_MODE=true             # Toggle between MockData and API

# Database
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=tatito
DB_USERNAME=root
DB_PASSWORD=

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRY=24h

# File Storage (for product images, documents)
STORAGE_DISK=public
FILESYSTEM_ROOT=/storage/app/public

# Payment Gateways
RAZORPAY_KEY=
RAZORPAY_SECRET=
STRIPE_KEY=
STRIPE_SECRET=
```

---

## Quick Reference: Backend Connection Checklist

- [ ] Set `BACKEND_MODE = true` in `bridge.js` and `admin-bridge.js`
- [ ] Build all API endpoints in Laravel (`routes/api.php`)
- [ ] Replace `MockData.X` reads in all admin pages (`public/admin/js/pages/*.js`)
- [ ] Replace `TatitoStore.X()` writes in all frontend JS
- [ ] Replace `FrontendBridge.getAdminX()` localStorage reads with API calls
- [ ] Replace `Bridge.Frontend.getX()` localStorage reads with API calls
- [ ] Connect the 6 unused frontend localStorage keys to admin pages
- [ ] Implement JWT authentication (replace session-based MockData auth)
- [ ] Delete `public/admin/js/data.js` (MockData) and remove from `app.html`
- [ ] Test every page end-to-end
