# Task: Standalone HTML files for every admin panel module (design only)

## Goal
Create one standalone HTML file per admin module (53 modules, 21 sections). These are
**design templates for a Laravel rebuild** — no JS logic, no localStorage, no MockData.
The client will later convert these into Laravel Blade views wired to a real backend.

## Source of truth
- Module map: `public/admin/js/app.js` navConfig (53 ids, 21 sections) — parsed below
- Visual language: existing `css/theme.css`, `layout.css`, `components.css`, `pages.css`
  (Playfair Display + Inter, gold #C9A24B palette, ivory bg)
- Content shapes: `public/admin/js/pages/*.js` render functions (tables, stat cards,
  forms, toggles, tabs)

## File layout
All files go in `public/admin/modules/<section>/<module>.html`:
```
modules/
  index.html                 ← listing of all 53, links to each
  dashboard/    dashboard.html reports.html tracking.html
  catalog/      categories.html products.html
  sales/        orders.html bookings.html payments.html refunds.html
  members/      approvals.html users.html sellers.html designers.html
  services/     boutiques.html customizations.html quotations.html consultations.html photography.html events.html
  marketing/    reviews.html referrals.html offers.html notifications.html
  support/      contact-queries.html support-tickets.html
  staff/        staff.html roles.html
  website/      cms.html header.html footer.html setup.html home-settings.html media-manager.html
  home-feed/    collections.html video-banners.html dynamic-layout.html
  weddings/     collections.html banners.html featured.html
  customise/    studios.html options.html bespoke-orders.html
  jewellery/    collections.html categories.html products.html
  vip-events/   calendar.html rsvps.html
  stylist/      bookings.html
  settings/     general.html payment-setup.html currencies.html languages.html email-templates.html
```

## Each file contains
1. Full HTML5 doc, same head as app.html (bootstrap-icons, Google fonts, existing CSS)
2. Static sidebar (all 21 sections, active item highlighted, plain `href` links — no JS)
3. Static topbar (module title)
4. Static page content mirroring the JS-rendered layout of that module:
   stat cards, tables with 5-8 sample rows, badges, action buttons (dead links),
   form groups, toggle switches (CSS-only), tabs (CSS-only), upload zones, modals
   rendered inline-hidden
5. Sample data uses realistic Tatito names/products (from data.js seeds)
6. No external JS beyond what CSS needs; buttons have no onclick

## Acceptance criteria
- [ ] 53 module HTML files exist at the paths above
- [ ] modules/index.html lists and links all 53 grouped by section
- [ ] Every file renders standalone (open file → styled page with sidebar/topbar)
- [ ] Reuses existing CSS files (theme/layout/components/pages) — no new framework
- [ ] Zero console errors; no 404 on assets
- [ ] Design matches current admin look (gold/ivory, Playfair headings, Inter body)
- [ ] No localStorage/MockData/API references anywhere in modules/
- [ ] Sample rows reflect each module's real fields (orders: id/customer/product/
      seller/date/amount/payment/status/actions)
