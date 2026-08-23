# TATITO Admin Panel — HTML Design Package

> **Laravel handoff package.** The complete admin panel as 53 static HTML
> pages (one per module) plus one runtime JS file and one data file.
> Content matches the legacy working panel (MockData) exactly — same rows,
> numbers, badges and modals — so each page converts to a Blade view
> one-for-one. No backend is connected.

## Folder layout

| Part | Location | Notes |
|---|---|---|
| Module pages (53) | `public/admin/*.html` — flat | One file per module; filename = future Blade/route name (`orders.html` → `admin/orders`) |
| Entry redirect | `public/admin/index.html` | Meta-refresh → `../frontend/login.html` (centralized login; no admin login page) |
| Design runtime | `public/admin/js/admin-design.js` (~20 KB) | The **only** runtime JS: tabs, modals, toggles, toasts, confirms, dropdowns, notifications, tab-panel swaps (Staff). No fetch/XHR/localStorage — nothing saves. |
| Demo data | `public/admin/js/data.js` (~1.5 MB) | `window.DesignData = { page: { rows, stats, lists, tree, modals } }` — only DB-bound data (table rows, stat values, record lists, category tree, per-record modals) |
| Stylesheets | `public/admin/css/` | `theme.css` (design tokens), `layout.css` (sidebar/topbar/shell), `components.css` (buttons/tables/cards/badges), `pages.css`, `modules.css` (design extras: modals, toasts, tree) |
| Logo | `public/admin/assets/tatito-logo.png` | Single brand asset used everywhere |

## HTML ↔ data.js split (the important part)

Every page keeps **its own layout and options in the HTML** — toolbars, Add
buttons, search/filter controls, tab bars, table shells (thead + empty
`<tbody>` slot), stat-card shells, settings forms. **Only the data that will
come from the database lives in `data.js`.**

```html
<table class="table table-hover" id="rolesTable">
  <thead><tr><th>Role Name</th>…</tr></thead>
  <tbody data-rows="staff-roles"></tbody>   <!-- filled from data.js -->
</table>
```

- `data-rows="key"` → `DesignData[page].rows[key]` injected into the tbody
- `data-stat="key"`  → stat-card values
- `data-list="key"`  → record lists (notifications, roles, email templates)
- `data-tree`        → categories tree
- Modals (view/edit forms per record) are appended from `DesignData[page].modals`
  and opened via `data-modal-open="id"`

At Laravel time: keep the HTML shells as Blade views, delete `data.js`, and
render rows/stats/lists from Eloquent models into the same slots. When
`data.js` is absent, `admin-design.js` goes inert — the pages still render.

## Design-mode interactions (all the runtime JS there is)

| Interaction | Behavior |
|---|---|
| Tabs | Active highlight + panel swap (Settings 8 tabs, Website Setup 4 tabs, Staff: All Staff ↔ Staff Roles) |
| View 👁 / Pencil ✏ | Per-record modals with real demo values; pencil opens the **editable** form prefilled |
| Add / Delete / status | Add form modal, confirm dialog, status-change modal (orders etc.) |
| Three-dot ⋮ | Member dropdown (View / Edit / Block / Log in as member / Delete) |
| Toggles | Flip visually; nothing persists |
| Save/Update | “Saved (design mode)” toast |
| Notifications | Filter tabs + per-item detail modal + mark-as-read |
| Categories tree | Expand/collapse, per-node modals, Expand All / Collapse All |
| Esc / backdrop | Close any modal |

## 53 modules by section

| Section | Pages |
|---|---|
| Dashboard | `dashboard`, `reports`, `tracking` |
| Catalog | `categories`, `products` |
| Sales | `orders`, `bookings`, `payments`, `refunds` |
| Members | `approvals`, `users`, `sellers`, `designers` |
| Staff | `staff` (All Staff ↔ Staff Roles tabs), `roles` |
| Marketing | `offers`, `referrals`, `reviews`, `notifications` |
| Support | `support-tickets`, `contact-queries`, `quotations` |
| Wedding | `wedding-collections`, `wedding-banners`, `wedding-featured`, `photography` |
| Jewellery | `jewellery-categories`, `jewellery-collections`, `jewellery-products` |
| Events | `events`, `events-vip`, `event-rsvps` |
| Customization & Styling | `customizations`, `customisation-options`, `customisation-studios`, `bespoke-orders`, `consultations`, `stylist-bookings`, `boutiques` |
| Website & Home Feed | `cms`, `website-setup`, `website-header`, `website-footer`, `home-collections`, `home-video-banners`, `home-dynamic-sections`, `home-page-settings` |
| System | `settings`, `payment-setup`, `currencies`, `languages`, `email-templates` |
| Media | `media-manager` |

## Design conventions

- Shell: `body.admin-body` → `div.sidebar#sidebar` + `.sidebar-overlay` +
  `div.main-wrapper#mainWrapper` → `div.topbar` → `main.page-content-wrapper#pageContent`
  → `div.page-content`
- Sidebar: `div.nav-group(.expanded/.has-active)` → `a.nav-group-header` →
  `div.nav-group-items` → `a.nav-item(.active)`
- Content area keeps a 24px gutter from the fixed sidebar
- Logo path in every page: `assets/tatito-logo.png`
- Inter + tabular figures (`--font-number`) for all numeric values

## How the pages were generated (regenerate anytime)

```
git show 4da8bca:public/admin/js/data.js > /tmp/legacy-data.js
node scripts/rebuild_captures.cjs        # execute legacy renderers offline
python3 scripts/gen_static_modules.py    # write pages (sidebar+topbar+content)
python3 scripts/postprocess_design.py    # detail modals, wiring, tab panels
python3 scripts/split_content.py         # split HTML ↔ data.js (DB-bound only)
python3 scripts/build_data_js.py         # write public/admin/js/data.js
python3 scripts/write_structures.py      # rewrite pages with empty slots
```

## Laravel conversion guide (per module)

1. Convert each `public/admin/<page>.html` to a Blade view:
   sidebar+topbar → `@include('admin.partials.sidebar')` / `topbar`;
   page content → `@yield('content')`
2. Replace each `data-rows`/`data-stat`/`data-list` slot with `@foreach`
   over Eloquent models
3. Replace `data-modal-open` / `data-toast` / `data-confirm` hooks with real
   form submits; `admin-design.js` can be deleted once controllers exist
4. Chart placeholders (dashboard, reports, referrals, categories) → Chart.js
   with live data
5. Auth: replace `admin/index.html` meta-refresh with Laravel auth
   middleware; the centralized frontend login forwards admins after login

### Backend connection plan
See `.drytis/notes/backend-connection-plan.md` (workspace) for the
entity-by-entity mapping (MockData → DB tables → API endpoints), and
`README-ADMIN-CONNECTION.md` (repo root) for the full connection flow with
file paths.

## History (recoverable)

The full working JS panel (MockData, localStorage bridge to the customer
frontend) lives in git history at commit **4da8bca** on branch
`old-admin-panel`. `git show 4da8bca:public/admin/app.html` to inspect.
