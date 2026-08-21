# Spec: Legacy-content static module pages (regeneration round 2)

## Goal
Regenerate all admin module pages so their CONTENT matches the old working admin
panel exactly (same stat cards, tables, columns, rows, buttons, badges) — captured
from the legacy renderers — while remaining pure static HTML+CSS with no JavaScript.

## Context
- Round 1 generated pages with invented sample data → user rejected: content must
  equal what the old JS panel showed.
- Legacy panel preserved at git commit `4da8bca` (app.html + js/, deleted from
  working tree afterwards).
- Admin login removed: login handled by the centralized frontend login page
  (public/frontend/login.html). No changes to frontend files.

## Method
1. `git archive 4da8bca public/admin` → /tmp/legacy (temp, never committed).
2. Extract navConfig from legacy app.js → 16 sections, 53 modules (exact menu).
3. Node script with DOM shim loads data.js (MockData), helpers, bridge stubs,
   then executes each legacy renderer `App.pages[id].call(App)` and captures the
   innerHTML it writes into #pageContent → /tmp/captured/<id>.html.
   - Chart stub captures config; canvases replaced by placeholder divs.
   - `refunds` had no legacy renderer (listed inside Payments) → hand-built
     placeholder page noting this.
4. Generator `scripts/gen_static_modules.py` writes each page:
   head (admin CSS, Bootstrap Icons CDN) + sidebar (from navConfig, CSS-only
   `<details>` groups, active item marked) + topbar + captured content verbatim.
5. Inline JS stripped from captured HTML: all on* attributes, javascript: hrefs,
   contenteditable. href="javascript:..." → "#".
6. index.html (admin root) = meta-refresh → ../frontend/login.html.
   login.html deleted. Sidebar brand + All Modules + Logout → ../../index.html
   or ../index.html (the redirect page) → frontend login.

## Files changed
- public/admin/modules/**/*  (53 module pages + index.html) — regenerated
- public/admin/index.html — redirect to frontend login
- public/admin/login.html — DELETED
- scripts/gen_static_modules.py — new generator (kept for regeneration)

## Acceptance criteria
- [x] 54 HTML files under modules/ (53 modules + index)
- [x] Content of every page = captured legacy render (spot-check: orders 42 rows,
      categories, dashboard stat cards)
- [x] Sidebar on every page built from navConfig — 16 sections, all 53 links,
      active page marked, CSS-only collapse
- [x] Zero inline JS (on*=, javascript:) and zero <script> tags
- [x] Zero broken internal links (full sweep)
- [x] No admin/login.html; /admin/ redirects to ../frontend/login.html
- [x] No frontend file modified
