# Task: Strip admin folder to design-only (JS-free) for Laravel handover

## Goal
Client has a Laravel backend ready. Convert `public/admin/` to **design-only**:
keep only HTML + CSS. Remove ALL JavaScript except the bare minimum that is
strictly necessary (currently: nothing). Laravel Blade will later replace the
static pages and add behavior.

## Decisions
- **Delete `public/admin/js/` entirely** (64 files: app.js, bridge.js, data.js,
  helpers.js, i18n.js, member-actions.js, seller-app.js, 56 page modules).
- **Delete `app.html`** (SPA shell — dead without JS) and **`index.html`**
  (redirect script). Replace with:
  - `login.html` — static admin login design (Laravel auth takes over later)
  - `index.html` — redirect to login.html using **meta refresh** (no JS)
- **Keep `modules/` (53 pages) as the module designs** — they are already pure
  HTML+CSS with zero script tags. Update their links:
  - Sidebar "Logout" → `../login.html`
  - Topbar "All Modules" → `../modules/index.html`
- **New shell convention for Laravel:** each module page already carries the
  full sidebar + topbar, so Blade can include a shared sidebar partial per page.
- **Update `modules/index.html`** to also link `../login.html`.
- **Keep `css/` (5 files incl. modules.css) and `assets/` (tatito-logo.png).**
- **Delete `package.json`** (was for the JS panel).

## Acceptance criteria
- [ ] `public/admin/js/` does not exist
- [ ] `public/admin/app.html` does not exist
- [ ] Zero `<script` tags anywhere under `public/admin/` (verify with grep)
- [ ] `public/admin/login.html` exists — styled login design matching admin theme
- [ ] `public/admin/index.html` is a no-JS meta-refresh redirect to login.html
- [ ] All 53 module pages + modules/index.html render with sidebar/topbar intact
- [ ] No 404 assets (css paths, logo) on any page
- [ ] Preview URL serves login.html at /admin/ and modules via /admin/modules/
- [ ] Old zip/backup not required — git history preserves the JS panel
