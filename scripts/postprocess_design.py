#!/usr/bin/env python3
"""Post-process generated static module pages:

1. Inject all captured tab panels into Settings + Website Setup pages
   (Settings: 8 tabs, Website Setup: 4 tabs), with data-tab panels so
   admin-design.js can switch them.
2. Parse every table row, extract its visible cell data, and append a
   per-row detail modal (id=<page>-row-N) after the content.
3. Rewire action buttons that were stripped during JS cleanup:
   - View (eye)           → data-modal-open="<page>-row-N"
   - Edit (pencil)        → data-modal-open="<page>-row-N" (prefilled look)
   - Delete (trash)       → data-confirm="Delete this record? (design mode)"
   - Add <something>      → data-modal-open="<page>-add" generic form modal
   - Save/Update/submit   → data-toast="Saved (design mode)"
   - Export/Download      → data-toast="Export would run here (design mode)"
4. Add a per-page generic Add modal + <script admin-design.js> tag.
"""
import re, os, json, html as H
from pathlib import Path

ROOT = Path('/workspace/laravel-clean/public/admin/modules')
FORMS = json.load(open('/tmp/captured/_modal_forms.json')) if Path('/tmp/captured/_modal_forms.json').exists() else {}

INLINE_JS = re.compile(r'\son(click|change|submit|error|load|input|focus|blur|mouseover|mouseout|keyup|keydown)="[^"]*"')

def legacy_modal_html(page_id, key):
    """Return cleaned legacy modal HTML (inline handlers stripped, assets fixed,
    buttons rewired to design-mode attributes)."""
    h = (FORMS.get(page_id, {}) or {}).get(key)
    if not h:
        return None
    mid = {'view': 'v', 'member-view': 'mv', 'edit': 'e', 'member-edit': 'me'}.get(key.split('-')[0] if key.startswith('member-') else key.split('-')[0], 'x')
    h = INLINE_JS.sub('', h)
    h = h.replace('href="javascript:void(0)"', 'href="#"')
    h = h.replace('src="assets/', 'src="../../assets/')
    h = h.replace('<script>', '&lt;script&gt;').replace('</script>', '&lt;/script&gt;')
    # close / cancel buttons that lost onclick → data-modal-close="<page>-legacy"
    full_id = f'{page_id}-legacy'
    h = h.replace('<button class="modal-close">&times;</button>',
                  f'<button class="modal-close" type="button" data-modal-close="{full_id}">&times;</button>')
    h = h.replace('<button class="btn btn-outline">Cancel</button>',
                  f'<button class="btn btn-outline" type="button" data-modal-close="{full_id}">Cancel</button>')
    h = h.replace('<button class="btn btn-outline">Close</button>',
                  f'<button class="btn btn-outline" type="button" data-modal-close="{full_id}">Close</button>')
    # any other btn-primary whose onclick was stripped → toast (catch-all)
    h = re.sub(r'<button class="btn btn-primary"(?![^>]*data-toast)([^>]*)>',
               r'<button class="btn btn-primary"\1 type="button" data-toast="Saved (design mode)">', h)
    # save/primary buttons that lost onclick → toast
    h = re.sub(r'<button class="btn btn-primary">(\s*<i [^>]*></i>\s*[^<]*)</button>',
               r'<button class="btn btn-primary" type="button" data-toast="Saved (design mode)">\1</button>', h)
    return h

# ---------------- helpers ----------------

def attr_safe(s):
    return s.replace('"', '&quot;')

def clean(s):
    s = re.sub(r'<[^>]+>', ' ', s)          # strip tags
    s = H.unescape(s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s

def modal_shell(mid, title, body):
    return (f'<div class="design-modal" id="{mid}" role="dialog" aria-modal="true">\n'
            f'  <div class="modal-box">\n'
            f'    <div class="modal-header"><h3>{H.escape(title)}</h3>'
            f'<button class="modal-close" type="button" data-modal-close="{mid}" aria-label="Close">&times;</button></div>\n'
            f'    <div class="modal-body">\n{body}\n    </div>\n'
            f'    <div class="modal-footer">'
            f'<button class="btn btn-ghost" type="button" data-modal-close="{mid}">Close</button>'
            f'<button class="btn btn-primary" type="button" data-toast="Saved (design mode)">Save changes</button>'
            f'    </div>\n  </div>\n</div>\n')

def detail_body_from_row(cells, headers=None):
    """cells: list of cleaned row strings; headers: table column labels."""
    rows = []
    for i, c in enumerate(cells):
        label = (headers[i] if headers and i < len(headers) and headers[i] else ('Name / ID' if i == 0 else f'Detail {i+1}'))
        if c == '':
            continue
        rows.append(f'<dt>{H.escape(label)}</dt><dd class="plain">{H.escape(c[:160])}</dd>')
    rows.append('<dt>Created</dt><dd>18 Aug 2026</dd>')
    rows.append('<dt>Last updated</dt><dd>18 Aug 2026</dd>')
    return '<dl class="detail-grid">\n' + '\n'.join(rows) + '\n</dl>'

ADD_FORM = ('<form>\n'
            '  <div class="form-group"><label>Name</label><input type="text" class="form-control" placeholder="Enter name"></div>\n'
            '  <div class="form-group"><label>Description</label><textarea class="form-control" rows="3" placeholder="Short description"></textarea></div>\n'
            '  <div class="form-row">\n'
            '    <div class="form-group"><label>Status</label><select class="form-control"><option>Active</option><option>Inactive</option><option>Pending</option></select></div>\n'
            '    <div class="form-group"><label>Priority</label><select class="form-control"><option>High</option><option selected>Normal</option><option>Low</option></select></div>\n'
            '  </div>\n'
            '  <div class="toggle-row"><div class="toggle-info"><strong>Enabled</strong><p class="text-muted">Show this record on the storefront</p></div>'
            '<span class="toggle-switch on"><span class="toggle-knob"></span></span></div>\n'
            '</form>')

VIEW_BTN = re.compile(r'(<button[^>]*class="[^"]*action-btn[^"]*view[^"]*")((?:[^>])*?)(/?>)', re.I)
EDIT_BTN = re.compile(r'(<button[^>]*class="[^"]*action-btn[^"]*edit[^"]*")((?:[^>])*?)(/?>)', re.I)
DEL_BTN  = re.compile(r'(<button[^>]*class="[^"]*action-btn[^"]*del[^"]*")((?:[^>])*?)(/?>)', re.I)
ROW_RE   = re.compile(r'<tr[^>]*>(.*?)</tr>', re.S | re.I)
CELL_RE  = re.compile(r'<t[hd][^>]*>(.*?)</t[hd]>', re.S | re.I)
ONCLICK_LEFT = re.compile(r'\s+on(click|change|submit|error|load|input|focus|blur)="[^"]*"')

def wire_member_dropdowns(s, page_id):
    """Wire legacy three-dot member dropdown items to captured member modals
    + design-mode confirms. The dropdown itself is opened by admin-design.js."""
    ids = [k[12:] for k in (FORMS.get(page_id) or {}) if k.startswith('member-edit-')]
    vidx = [0]
    eidx = [0]

    def wire_item(m):
        cls, inner = m.group(1), m.group(2)
        if 'view' in cls:
            i = vidx[0]; vidx[0] += 1
            if i < len(ids):
                return f'<button type="button" class="{cls}" data-modal-open="{page_id}-mv-{ids[i]}" data-modal-title="Details">{inner}</button>'
        elif 'edit' in cls:
            i = eidx[0]; eidx[0] += 1
            if i < len(ids):
                return f'<button type="button" class="{cls}" data-modal-open="{page_id}-me-{ids[i]}" data-modal-title="Edit">{inner}</button>'
        elif 'block' in cls or 'unblock' in cls:
            return f'<button type="button" class="{cls}" data-confirm="Change block status? (design mode)">{inner}</button>'
        elif 'login' in cls:
            return f'<button type="button" class="{cls}" data-toast="Member portal login (design mode)">{inner}</button>'
        elif 'delete' in cls:
            return f'<button type="button" class="{cls}" data-confirm="Delete this member? (design mode — nothing is deleted)">{inner}</button>'
        return m.group(0)

    s = re.sub(r'<button class="(member-dropdown-item[^"]*)"[^>]*>(.*?)</button>', wire_item, s, flags=re.S)
    return s

def process_page(path):
    page_id = path.stem
    s = path.read_text()
    orig = s
    modals = []

    # ---------- 1. find rows & build detail modals + rewire buttons ----------
    # Legacy per-entity forms: rows carry an entity id in cell 0 (PRD001 etc).
    # eye → view-<ID>, pencil → edit-<ID>, both from captured legacy modal HTML.
    legacy_ids = [k.split('-', 1)[1] for k in (FORMS.get(page_id) or {}) if k.startswith(('edit-', 'view-'))]
    member_ids = [k.split('-', 1)[1] for k in (FORMS.get(page_id) or {}) if k.startswith('member-edit-')]

    def row_entity_id(cells):
        """First cell that looks like an entity id (>=3 chars, has digits)."""
        for c in cells[:3]:
            m = re.search(r'\b([A-Z]{2,}[0-9]{2,}[A-Z0-9]*)\b', c)
            if m:
                return m.group(1)
        return None

    # map entity id → row index for pages with table rows
    rows_data = []
    headers = []
    for m in ROW_RE.finditer(s):
        cells = [clean(c) for c in CELL_RE.findall(m.group(1))]
        if not cells or all(c == '' for c in cells):
            continue
        if not headers and ('<th' in m.group(1)):
            headers = cells
            continue
        rows_data.append(cells)

    # assign modals to view/edit buttons in order of appearance.
    # Prefer legacy per-entity forms: nth button ↔ nth entity id (row order == MockData order)
    view_ids = [k[5:] for k in (FORMS.get(page_id) or {}) if k.startswith('view-')]
    edit_ids = [k[5:] for k in (FORMS.get(page_id) or {}) if k.startswith('edit-')]
    btn_index = {'view': 0, 'edit': 0}

    def rewire_view(m):
        idx = btn_index['view']; btn_index['view'] += 1
        if idx < len(view_ids):
            mid = f'{page_id}-v-{view_ids[idx]}'
        else:
            mid = f'{page_id}-row-{idx}'
        return m.group(1) + f' data-modal-open="{mid}"' + m.group(2) + m.group(3)
    def rewire_edit(m):
        idx = btn_index['edit']; btn_index['edit'] += 1
        if idx < len(edit_ids):
            mid = f'{page_id}-e-{edit_ids[idx]}'
        else:
            mid = f'{page_id}-row-{idx}'
        return m.group(1) + f' data-modal-open="{mid}"' + m.group(2) + m.group(3)
    def rewire_del(m):
        return m.group(1) + ' data-confirm="Delete this record? (design mode)"' + m.group(2) + m.group(3)

    s = VIEW_BTN.sub(rewire_view, s)
    s = EDIT_BTN.sub(rewire_edit, s)
    s = DEL_BTN.sub(rewire_del, s)

    # build detail modals for as many rows as have EITHER a view or edit button
    n_modals = max(btn_index['view'], btn_index['edit'])
    built = 0
    for i in range(min(n_modals, len(rows_data))):
        cells = rows_data[i]
        title = cells[0] if cells else page_id
        # use headers, trimmed to the cell count
        hdr = [h for h in headers][:len(cells)] if headers else None
        modals.append(modal_shell(f'{page_id}-row-{i}', f'Details — {title}', detail_body_from_row(cells, hdr)))
        built += 1
    # FALLBACK for non-table pages: no <tr> rows but buttons were rewired →
    # derive a label from the markup nearest each button (cat-badge / card title).
    if built < n_modals:
        # gather candidate labels: nearest preceding text of each action-btn container
        btn_ctx = []
        for m in re.finditer(r'action-btn (?:edit|view)"[^>]*data-modal-open="' + re.escape(page_id) + r'-row-(\d+)"', s):
            idx = int(m.group(1))
            # look backwards up to 500 chars for a title-ish snippet
            back = s[max(0, m.start()-500):m.start()]
            # prefer semantic containers first: .cat-name, .card-title, h3/h4/h5, strong
            label = None
            for pat in (r'class="cat-name">([^<]{3,60})<', r'class="[^"]*(?:card-title|item-title|row-title)[^"]*">([^<]{3,60})<',
                        r'<h[345][^>]*>([^<]{3,60})</h[345]>', r'<strong>([^<]{3,60})</strong>'):
                mm = re.findall(pat, back)
                if mm: label = mm[-1]; break
            if not label:
                texts = re.findall(r'>([A-Za-z][A-Za-z0-9 &\u2014\u2013-]{3,60})<', back)
                label = texts[-1] if texts else None
            label = H.unescape(label) if label else None
            btn_ctx.append((idx, label or f'Item {idx+1}'))
        seen = {i for i in range(built)}
        for idx, label in btn_ctx:
            if idx in seen:
                continue
            body = ('<dl class="detail-grid">\n'
                    f'<dt>Name</dt><dd class="plain">{H.escape(label)}</dd>\n'
                    '<dt>Status</dt><dd class="plain">Active</dd>\n'
                    '<dt>Created</dt><dd>18 Aug 2026</dd>\n'
                    '<dt>Last updated</dt><dd>18 Aug 2026</dd>\n</dl>')
            modals.append(modal_shell(f'{page_id}-row-{idx}', f'Details — {label}', body))
            seen.add(idx)

    # ---------- 1b. legacy per-entity modals (edit forms + view details) ----------
    legacy_modals = []
    for k in (FORMS.get(page_id) or {}):
        body = None
        mid = None
        if k.startswith('view-'):
            mid = f'{page_id}-v-{k[5:]}'; body = legacy_modal_html(page_id, k)
        elif k.startswith('member-view-'):
            mid = f'{page_id}-mv-{k[12:]}'; body = legacy_modal_html(page_id, k)
        elif k.startswith('edit-'):
            mid = f'{page_id}-e-{k[5:]}'; body = legacy_modal_html(page_id, k)
        elif k.startswith('member-edit-'):
            mid = f'{page_id}-me-{k[12:]}'; body = legacy_modal_html(page_id, k)
        elif k == 'add':
            mid = f'{page_id}-legacy-add'; body = legacy_modal_html(page_id, k)
        if mid and body:
            legacy_modals.append(f'<div class="design-modal" id="{mid}" role="dialog" aria-modal="true">\n  <div class="modal-box">\n{body}\n  </div>\n</div>\n')

    # member pages: wire the three-dot dropdown items
    if page_id in ('users', 'sellers', 'designers', 'staff'):
        s = wire_member_dropdowns(s, page_id)

    # ---------- 2. generic Add modal + wire Add buttons ----------
    add_re = re.compile(r'(<button[^>]*?class="[^"]*\bbtn-primary\b[^"]*"[^>]*?)(/?>)(\s*(?:<i[^>]*></i>\s*)?(?:Add|Create|New)\s)', re.I)
    has_add = bool(add_re.search(s))
    if has_add:
        s = add_re.sub(lambda m: m.group(1) + f' data-modal-open="{page_id}-add"' + m.group(2) + m.group(3), s)
        modals.append(modal_shell(f'{page_id}-add', 'Add new record', ADD_FORM))

    # ---------- 3. save buttons → toast ----------
    s = re.sub(r'(<button[^>]*?class="[^"]*\bbtn-primary\b[^"]*")(?=[^>]*>\s*(?:<i[^>]*></i>\s*)?(?:Save|Update|Publish|Send|Approve|Reject))',
               r'\1 data-toast="Saved (design mode)"', s)
    s = re.sub(r'(<button[^>]*?class="[^"]*\bbtn-(?:success|danger)\b[^"]*")(?=[^>]*>\s*(?:<i[^>]*></i>\s*)?(?:Approve|Reject|Delete|Block|Unblock))',
               r'\1 data-confirm="Confirm this action? (design mode)"', s)

    # ---------- 4. append modals + script before </body> ----------
    if legacy_modals:
        block = '\n<!-- ===== legacy modal forms (captured from original admin) ===== -->\n' + '\n'.join(legacy_modals)
        s = s.replace('</body>', block + '</body>')
    if modals or page_id in ('settings', 'website-setup') or legacy_modals:
        block = '\n<!-- ===== design-mode modals (admin-design.js) ===== -->\n' + '\n'.join(modals)
        if 'admin-design.js' not in s:
            s = s.replace('</body>', block + '\n<script src="../../assets/admin-design.js"></script>\n</body>')
        else:
            s = s.replace('</body>', block + '</body>')

    if s != orig:
        path.write_text(s)
        return True, n_modals, int(has_add), len(legacy_modals)
    return False, 0, 0, 0

def inject_tab_panels():
    """Settings + Website Setup: replace empty content div with full tab panels."""
    sp = json.load(open('/tmp/captured/_settings_panels.json'))
    ws = json.load(open('/tmp/captured/_ws_panels.json'))

    def build_panels(panels, container_id):
        out = []
        for i, (tid, html) in enumerate(panels.items()):
            disp = '' if i == 0 else ' style="display:none"'
            # strip legacy inline onclick handlers from panel html
            h = ONCLICK_LEFT.sub('', html)
            h = h.replace('href="javascript:void(0)"', 'href="#"')
            out.append(f'<div class="tab-panel" data-tab="{tid}"{disp}>\n{h}\n</div>')
        return '\n'.join(out)

    st = ROOT / 'settings/settings.html'
    s = st.read_text()
    panels = build_panels(sp['panels'], 'settingsTabContent')
    s = s.replace('<div id="settingsTabContent"></div>',
                  f'<div id="settingsTabContent">\n{panels}\n</div>')
    # wrap settings layout in a [data-tabs] host for admin-design.js
    if 'data-tabs' not in s:
        s = s.replace('<div class="settings-layout"', '<div class="settings-layout" data-tabs', 1)
    # sequential pass: assign each tab button its own tid in order
    order = list(sp['panels'].keys())
    it = iter(order)
    def sub_tab(m):
        try: tid = next(it)
        except StopIteration: tid = order[-1]
        return m.group(1) + f' data-tab-btn="{tid}">'
    s = re.sub(r'(class="settings-tab[ ]?(?:active)?"[^>]*?)(>)', sub_tab, s)
    # add script
    if 'admin-design.js' not in s:
        s = s.replace('</body>', '\n<script src="../../assets/admin-design.js"></script>\n</body>')
    st.write_text(s)
    # asset paths inside injected panels
    s2 = st.read_text().replace('src="assets/', 'src="../../assets/')
    st.write_text(s2)

    wp = ROOT / 'website/website-setup.html'
    s = wp.read_text()
    panels = build_panels(ws['panels'], 'wsTabContent')
    s = s.replace('<div id="wsTabContent"></div>',
                  f'<div id="wsTabContent">\n{panels}\n</div>')
    # wrap tab bar + content in a [data-tabs] host
    if 'data-tabs' not in s:
        s = s.replace('<div class="tab-bar"', '<div class="tab-bar" data-tabs', 1)
    # website-setup uses .tab-btn buttons with onclick stripped → wire sequentially
    order = list(ws['panels'].keys())
    it = iter(order)
    def sub_wtab(m):
        try: tid = next(it)
        except StopIteration: tid = order[-1]
        return m.group(1) + f' data-tab-btn="{tid}">'
    s = re.sub(r'(class="tab-btn[ ]?(?:active)?"[^>]*?)(>)', sub_wtab, s)
    if 'admin-design.js' not in s:
        s = s.replace('</body>', '\n<script src="../../assets/admin-design.js"></script>\n</body>')
    wp.write_text(s)
    s2 = wp.read_text().replace('src="assets/', 'src="../../assets/')
    wp.write_text(s2)
    print('tab panels injected: settings (8 tabs), website-setup (4 tabs)')

def main():
    inject_tab_panels()
    total = 0; modals = 0; adds = 0; legacy = 0
    for p in sorted(ROOT.rglob('*.html')):
        if p.name == 'index.html':
            continue
        changed, n, a, l = process_page(p)
        if changed:
            total += 1; modals += n; adds += a; legacy += l
    print(f'post-processed {total} pages; {modals} generic modals; {adds} add-forms; {legacy} legacy modal forms')

if __name__ == '__main__':
    main()
