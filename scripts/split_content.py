#!/usr/bin/env python3
"""Split each page's captured main into structure (HTML) + data (data.js).

Input : current public/admin/js/data.js (single source of truth, page mains)
Output: /tmp/captured/split_pages.json
        { page: { structure: str, data: { rows: {slot: [tr,...]},
                                          stats: {key: value},
                                          lists: {key: [item,...]},
                                          tree: str|None,
                                          modals: [str,...] } } }

Rules
-----
- <tbody>...</tbody>  -> <tbody data-rows="<slot>"></tbody>, rows extracted.
  slot = page + optional suffix for multi-table pages (disambiguated by
  preceding card-header h3 text or table id).
- stat-value divs     -> <div class="stat-value" data-stat="<key>"></div>,
  value extracted. key = slug of the stat-label text.
- notif-item rows     -> collected under list slot 'notifications' in the
  .notif-list container -> <div class="notif-list" data-list="notifications"></div>
- role-item / template items / seller-list items -> lists by class scan.
- categories: .cat-list children -> tree content extracted wholesale.
- Everything else stays in structure verbatim.
"""
import json, os, re, sys

DATA_JS = os.environ.get('DATA_JS', '/workspace/laravel-clean/public/admin/js/data.js')
OUT = '/tmp/captured/split_pages.json'

def unescape(t):
    return t.replace("\\'", "'").replace('\\"', '"').replace('\\n', '\n').replace('<\\/script', '</script').replace('<\\!--', '<!--')

def split_flat_items(inner, cls):
    return [b[0] for b in split_flat_items_at(inner, cls)]

def split_flat_items_at(inner, cls):
    """like split_flat_items but returns [(html, end_offset), ...] where
    end_offset is the offset in `inner` one past the block's final </div>."""
    blocks = []
    i = 0
    pat = re.compile(r'<div class="' + cls + r'[^"]*"[^>]*>')
    while True:
        m = pat.search(inner, i)
        if not m:
            break
        start = m.start()
        j = m.end(); depth = 1
        while j < len(inner) and depth:
            if inner.startswith('<div', j):
                depth += 1; j += 4
            elif inner.startswith('</div>', j):
                depth -= 1; j += 6
            else:
                j += 1
        blocks.append((inner[start:j], j))
        i = j
    return blocks

def split_by_marker(inner, marker):
    """inner html whose top level is a series of <div class="cls ..."> blocks
    (each block itself contains nested divs). Returns the list of block html."""
    blocks = []
    i = 0
    pat = re.compile(r'<div class="' + cls + r'[^"]*"[^>]*>')
    while True:
        m = pat.search(inner, i)
        if not m:
            break
        start = m.start()
        j = m.end(); depth = 1
        while j < len(inner) and depth:
            if inner.startswith('<div', j): depth += 1
            elif inner.startswith('</div>', j): depth -= 1
            if depth: j += 1
        blocks.append(inner[start:j])
        i = j
    return blocks

def split_by_marker(inner, marker):
    """Split inner html into blocks that each start with a tag carrying
    `marker` as an attribute fragment (e.g. data-list-item="1")."""
    blocks = []
    starts = [m.start() for m in re.finditer(r'<div [^>]*' + marker + r'="[^"]*"[^>]*>', inner)]
    if not starts:
        return blocks
    starts.append(len(inner))
    for a, b in zip(starts, starts[1:]):
        block = inner[a:b]
        # trim trailing whitespace/closers of the container itself
        block = block.rstrip()
        blocks.append(block)
    return blocks

def slug(t):
    t = re.sub(r'<[^>]+>', ' ', t)
    t = re.sub(r'[^a-zA-Z0-9]+', '-', t).strip('-').lower()
    return t or 'x'

def extract_mains():
    s = open(DATA_JS).read()
    out = {}
    for m in re.finditer(r"'([a-z0-9-]+)': \{ main: '(.*?)', modals: \[", s, re.S):
        page, main = m.group(1), unescape(m.group(2))
        mod_start = m.end()
        # modals: parse the list items
        modals = []
        depth_scan = s[mod_start:]
        # each modal is a '...' string element; use the same scanner idea:
        i = 0
        items = []
        while i < len(depth_scan):
            if depth_scan[i] == "'":
                j = i + 1
                buf = []
                while j < len(depth_scan):
                    if depth_scan[j] == '\\' and j + 1 < len(depth_scan):
                        buf.append(depth_scan[j]); buf.append(depth_scan[j+1]); j += 2
                    elif depth_scan[j] == "'":
                        break
                    else:
                        buf.append(depth_scan[j]); j += 1
                items.append(''.join(buf))
                i = j + 1
            elif depth_scan[i] == ']':
                break
            else:
                i += 1
        modals = [unescape(x) for x in items if x.strip()]
        out[page] = {'main': main, 'modals': modals}
    return out

def split_table(tbody_inner, struct_doc, page, used, data, header_hint):
    slot = slug(header_hint) if header_hint else page
    if slot in used:
        base = slot; k = 2
        while slot in used:
            slot = f'{base}-{k}'; k += 1
    used.add(slot)
    rows = re.findall(r'<tr>.*?</tr>', tbody_inner, re.S)
    data.setdefault('rows', {})[slot] = rows
    return f'<tbody data-rows="{slot}"></tbody>'

def split_page(page, main, modals):
    data = {'rows': {}, 'stats': {}, 'lists': {}, 'modals': modals}
    s = main
    used = set()

    # 1) tables: find <table ...>...</table>, take thead as structure, tbody as rows
    def table_repl(m):
        tbl = m.group(0)
        # header hint: nearest preceding h3 in the card, or table id
        pre = struct['head'] if False else None
        tbl_id = re.match(r'<table[^>]*id="([^"]+)"', tbl)
        before = s[:m.start()]
        h3 = re.findall(r'<h3[^>]*>(.*?)</h3>', before)
        hint = (h3[-1] if h3 else '') or (tbl_id.group(1) if tbl_id else '')
        new_tbl = tbl
        for tm in list(re.finditer(r'(<tbody[^>]*>)(.*?)(</tbody>)', tbl, re.S)):
            inner = tm.group(2)
            if '<tr' not in inner:
                continue
            slot = split_table(inner, None, page, used, data, hint)
            new_tbl = new_tbl.replace(tm.group(0), slot, 1)
        return new_tbl
    # need mutable context for thead hints — do a simple sequential pass
    out = []
    pos = 0
    for tm in re.finditer(r'<table[^>]*>.*?</table>', s, re.S):
        out.append(s[pos:tm.start()])
        tbl = tm.group(0)
        before = ''.join(out)
        h3 = re.findall(r'<h3[^>]*>(.*?)</h3>', before)
        tbl_id = re.match(r'<table[^>]*id="([^"]+)"', tbl)
        hint = (h3[-1] if h3 else '') or (tbl_id.group(1) if tbl_id else '')
        new_tbl = tbl
        for tbm in list(re.finditer(r'(<tbody[^>]*>)(.*?)(</tbody>)', tbl, re.S)):
            inner = tbm.group(2)
            if '<tr' not in inner:
                continue
            slot = split_table(inner, None, page, used, data, hint)
            new_tbl = new_tbl.replace(tbm.group(0), slot, 1)
        out.append(new_tbl)
        pos = tm.end()
    out.append(s[pos:])
    s = ''.join(out)

    # 2) stat values
    def stat_repl(m):
        val = m.group(2)
        before = s[:m.start()]
        lbl = re.findall(r'stat-label">([^<]*)<', before)
        key = slug(lbl[-1]) if lbl else 'stat-%d' % m.start()
        if key in data['stats']:
            base = key; k = 2
            while key in data['stats']:
                key = f'{base}-{k}'; k += 1
        data['stats'][key] = val.strip()
        return '<div class="stat-value" data-stat="%s"></div>' % key
    s = re.sub(r'<div class="stat-value"[^>]*>(.*?)</div>', lambda m: stat_repl_with(m, data, s), s, flags=re.S)

    # 3) notifications list
    nl = re.search(r'<div class="notif-list"[^>]*>', s)
    if nl:
        # items run from nl.end() to the last notif-item's close; the list's
        # own </div> is the first </div> AFTER the final item close.
        # Robust: split items with split_flat_items over the remainder, tracking
        # where the last item ends.
        blocks = split_flat_items_at(s[nl.end():], 'notif-item')
        if blocks:
            end_of_last = nl.end() + blocks[-1][1]
            data['lists']['notifications'] = [b[0] for b in blocks]
            s = s[:nl.end()] + '</div>' + s[end_of_last + 6:]
            # mark the host container so injectData can find it
            s = s.replace('<div class="notif-list">', '<div class="notif-list" data-list="notifications">', 1)

    # 4) role items (roles page sidebar)
    rs = re.search(r'<div class="roles-sidebar"[^>]*>', s)
    if rs and 'role-item' in s:
        blocks = split_flat_items_at(s[rs.end():], 'role-item')
        if blocks:
            end_of_last = rs.end() + blocks[-1][1]
            data['lists']['roles'] = [b[0] for b in blocks]
            label = re.match(r'\s*<div[^>]*>[^<]*Roles[^<]*</div>', s[rs.end():])
            label = label.group(0) if label else ''
            s = s[:rs.end()] + label + '</div>' + s[end_of_last + 6:]
            # mark container for injection
            s = s[:rs.start()] + '<div class="roles-sidebar" data-list="roles">' + s[rs.end():]

    # 5) email-templates list: [data-list-item] rows inside the templates card
    if 'data-list-item' in s:
        first = re.search(r'<div data-list-item="[^"]*"[^>]*>', s)
        if first:
            blocks = []
            i = first.start()
            pat = re.compile(r'<div data-list-item="[^"]*"[^>]*>')
            m2 = pat.search(s, i)
            while m2:
                start = m2.start()
                j = m2.end(); depth = 1
                while j < len(s) and depth:
                    if s.startswith('<div', j): depth += 1; j += 4
                    elif s.startswith('</div>', j): depth -= 1; j += 6
                    else: j += 1
                blocks.append((s[start:j], j))
                m2 = pat.search(s, j)
            if blocks:
                end_of_last = blocks[-1][1]
                data['lists']['templates'] = [b[0] for b in blocks]
                # after the last item: container close + card close — keep container's
                s = s[:first.start()] + '</div>' + s[end_of_last + 6:]
                m3 = re.search(r'<div style="max-height:560px;overflow-y:auto">', s)
                if m3 and m3.end() <= first.start():
                    s = s[:m3.end()-1] + ' data-list="templates">' + s[m3.end():]

    # 6) top sellers list (dashboard): container of .top-seller blocks
    tm = re.search(r'<(div|ul)[^>]*class="[^"]*top-sellers[^"]*"[^>]*>', s)
    if tm:
        i = tm.end(); depth = 1
        while i < len(s) and depth:
            if s.startswith('<div', i): depth += 1
            elif s.startswith('</div>', i): depth -= 1
            i += 1
        inner = s[tm.end():i-6]
        items = split_flat_items(inner, 'top-seller')
        if items:
            data['lists']['top-sellers'] = items
            s = s[:tm.end()] + s[i-6:]

    # 7) categories tree: whole .cat-tree content
    cl = re.search(r'<div class="cat-tree"[^>]*>', s)
    if cl:
        blocks = split_flat_items_at(s[cl.end():], 'cat-tree-item')
        if blocks:
            end_of_last = cl.end() + blocks[-1][1]
            data['tree'] = ''.join(b[0] for b in blocks)
            # after the last tree item: cat-tree close + card-body close — keep cat-tree's
            s = s[:cl.end()] + '</div>' + s[end_of_last + 6:]

    return s, data

def stat_repl_with(m, data, full):
    val = m.group(1).strip()
    before = full[:m.start()]
    lbl = re.findall(r'stat-label">([^<]*)<', before)
    key = slug(lbl[-1]) if lbl else 'stat'
    if key in data['stats']:
        base = key; k = 2
        while key in data['stats']:
            key = f'{base}-{k}'; k += 1
    data['stats'][key] = val
    return '<div class="stat-value" data-stat="%s"></div>' % key

def main():
    pages = extract_mains()
    out = {}
    for page, v in pages.items():
        struct, data = split_page(page, v['main'], v['modals'])
        out[page] = {'structure': struct, 'data': data}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(out, open(OUT, 'w'), indent=1)
    n_rows = sum(len(v['data'].get('rows', {}).get(k, [])) for v in out.values() for k in v['data'].get('rows', {}))
    n_stats = sum(len(v['data']['stats']) for v in out.values())
    n_lists = sum(len(v['data']['lists']) for v in out.values())
    n_modals = sum(len(v['data']['modals']) for v in out.values())
    trees = [p for p, v in out.items() if v['data'].get('tree')]
    print(f'pages: {len(out)}  row-slots: {sum(len(v["data"]["rows"]) for v in out.values())}  rows: {n_rows}  stats: {n_stats}  lists: {n_lists}  modals: {n_modals}  tree-pages: {trees}')
    # sanity: no leftover <tr> in structures that have rows extracted? report pages with residual <tr> in structure
    resid = {p: len(re.findall(r'<tr>', v['structure'])) for p, v in out.items() if re.search(r'<tr>', v['structure'])}
    if resid:
        print('pages with residual <tr> in structure:', resid)

if __name__ == '__main__':
    main()
