# TATITO Admin Panel — Static Design Package (v3)

> **Laravel handoff package.** The admin panel is delivered as 53 static
> HTML pages (one per module) with the same content the working demo
> panel showed, plus minimal design-mode JS. No backend is connected.

## What this is

| Part | Location | Notes |
|---|---|---|
| Module design pages (53) | `public/admin/modules/<section>/<page>.html` | Content = captured from the legacy working panel (MockData: 41 orders, 39 products, 12 sellers…). Sample data only. |
| All-modules index | `public/admin/modules/index.html` | Catalog of all 16 sections / 53 modules |
| Design runtime (only JS) | `public/admin/assets/admin-design.js` | ~180 lines: tabs, modals, toggles, toasts, confirm. Design-level only — nothing saves, no API calls. |
| Admin stylesheets | `public/admin/css/` | theme (tokens), layout (sidebar/topbar/shell), components (buttons/tables/cards), pages, modules (design extras) |
| Logo | `public/admin/assets/tatito-logo.png` | Single brand asset |
| Entry redirect | `public/admin/index.html` | Meta-refresh → `../frontend/login.html` (centralized login) |

## How the pages are built (regenerate anytime)

```
node scripts/rebuild_captures.cjs       # re-capture legacy renderers from git (commit 4da8bca)
python3 scripts/gen_static_modules.py   # write 54 pages (sidebar + topbar + captured content)
python3 scripts/postprocess_design.py   # inject tab panels, per-row modals, wire buttons
```

## Design-mode interactions (what the JS does)

- **Tabs** — Settings (8 tabs) and Website Setup (4 tabs) swap panels
- **View 👁** — opens a modal with that row's real captured values
- **Add / Edit** — open form modals; **Delete** — confirm dialog
- **Save/Update** — "Saved (design mode)" toast; **Toggles** — flip
- Esc / backdrop click closes modals

## Laravel conversion guide (per module)

1. Convert each `modules/<section>/<page>.html` to a Blade view:
   - sidebar+topbar → `@include('admin.partials.sidebar')` / `topbar`
   - page content → `@yield('content')`
2. Replace sample rows with `@foreach` over Eloquent models
3. Replace `data-modal-open` / `data-toast` hooks with real form submits
   (`admin-design.js` can be deleted once controllers exist)
4. Chart placeholders (dashboard, reports, referrals, categories) → Chart.js
   with live data
5. Auth: replace `admin/index.html` redirect with Laravel auth middleware;
   the centralized frontend login forwards admins after login

### Backend connection plan
See `/workspace/.drytis/notes/backend-connection-plan.md` for the full
entity-by-entity mapping (MockData → DB tables → API endpoints).

## History (recoverable)

The full working JS panel (MockData, localStorage bridge to the customer
frontend) lives in git history at commit **4da8bca** on branch
`old-admin-panel`. `git show 4da8bca:public/admin/app.html` to inspect.
