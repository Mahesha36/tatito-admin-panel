# Spec: Design-mode interactivity for static module pages

## Goal
Make the 53 static admin module pages behave like the old working panel at the
DESIGN level — tabs, view-details modals, add/edit forms, toggles, toasts,
confirm dialogs — with NO backend and minimal JS.

## Background
- Previous round captured legacy content but left two gaps: (1) Settings &
  Website Setup tab content lived in a SECOND render call (`_renderSettingsTab`
  / `_renderWSTab`) not captured by the first pass → General Settings page was
  empty. (2) All 360 legacy onclick handlers had been stripped → buttons dead.

## Solution
1. `scripts/rebuild_captures.cjs` — rebuilds /tmp captures from git history
   (commit 4da8bca), now ALSO capturing each tab panel:
   - Settings: 8 tabs (general, features, activation, smtp, thirdparty,
     social, notifications, language)
   - Website Setup: 4 tabs (general, seo, cookies, scripts)
2. `scripts/postprocess_design.py` — post-processor run after generation:
   - Injects all tab panels into the pages (`.tab-panel[data-tab]`)
   - Parses table header + rows; emits a detail modal per row
     (`<page>-row-N`) using header labels + real cell values
   - Wires view/edit buttons via `data-modal-open`, delete via `data-confirm`,
     Add buttons → generic add-form modal (`<page>-add`),
     Save/Update → `data-toast="Saved (design mode)"`
   - Appends one `<script src="../../assets/admin-design.js">` per page
3. `public/admin/assets/admin-design.js` (~180 lines, the ONLY runtime JS):
   - Tabs: whole-page wiring (settings-tab ↔ #settingsTabContent panels,
     tab-btn ↔ #wsTabContent panels)
   - Delegated click handlers with `_wireOnce` guards (double-load safe)
   - Modals: open/close/backdrop/Escape; Toggles: flip + debounce;
     Toasts; confirm(); upload-zone placeholder toast
4. `modules.css`: .design-modal/.modal-box/.detail-grid/.design-toast styles.

## Pipeline (regenerate everything)
```
node scripts/rebuild_captures.cjs      # captures → /tmp/captured
python3 scripts/gen_static_modules.py  # 54 pages
python3 scripts/postprocess_design.py  # tabs + modals + wiring
# (fix refunds logo src manually — known wart)
```

## Acceptance criteria
- [x] Settings: all 8 tabs render full content, clickable, swap correctly
- [x] Website Setup: all 4 tabs render full content, clickable
- [x] View modal per table row shows REAL row values with header labels
      (ORD001 → Priya Sharma / ₹25,000 / Delivered …)
- [x] Add buttons (22 pages) open add-form modal
- [x] Edit buttons open modal; Delete shows confirm
- [x] Save/Update shows exactly ONE "Saved (design mode)" toast
- [x] Toggles flip once per click
- [x] admin-design.js loaded exactly once per page
- [x] Zero console errors, zero broken links (verified 3 tester rounds)
