#!/usr/bin/env python3
"""Generate all 53 standalone module HTML files + index listing."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from gen_modules_core import MODULES
from gen_modules_shell import page, NAV
from gen_modules_part1 import CONTENT_1
from gen_modules_part2 import CONTENT_2
from gen_modules_part3 import CONTENT_3

CONTENT = {**CONTENT_1, **CONTENT_2, **CONTENT_3}

OUT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                    '..', 'public', 'admin', 'modules'))

# Map nav id -> section dir for index page
NAV_MAP = {}
for sec_label, _icon, items in NAV:
    for nav_id, label, href in items:
        NAV_MAP[href] = (sec_label, label)

def build_index():
    cards = []
    cur = None
    html = ['<div class="idx-hero">',
            '  <span class="idx-badge"><i class="bi bi-grid-3x3-gap"></i> Design Templates</span>',
            '  <h1>TATITO Admin — Module Pages</h1>',
            '  <p>53 standalone HTML design files · one per admin module · ready for Laravel Blade conversion</p>',
            '</div>']
    for sec_label, _icon, items in NAV:
        links = ''.join(f'<a class="idx-card" href="{href}"><i class="bi bi-file-earmark-code"></i>'
                        f'<span>{label}</span><small>{href}</small></a>'
                        for _id, label, href in items)
        html.append(f'<div class="idx-section"><h2><i class="bi bi-collection"></i> {sec_label} '
                    f'<small>({len(items)})</small></h2><div class="idx-grid">{links}</div></div>')
    return '\n'.join(html)

IDX_HEAD = '''<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>All Modules — TATITO Admin</title>
<link rel="icon" href="../assets/tatito-logo.png" type="image/png">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/theme.css">
<link rel="stylesheet" href="../css/layout.css">
<link rel="stylesheet" href="../css/components.css">
<link rel="stylesheet" href="../css/modules.css">
<style>
body { background: var(--bg); padding: 32px 24px; max-width: 1180px; margin: 0 auto; }
.idx-hero { text-align: center; padding: 40px 16px 28px; }
.idx-hero h1 { font-family: var(--font-display); font-size: 2rem; color: var(--text); margin: 10px 0 6px; }
.idx-hero p { color: var(--text-muted); font-size: 0.9rem; }
.idx-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px;
  border-radius: 20px; background: rgba(201,162,75,0.12); color: var(--gold-deep);
  font-size: 0.75rem; font-weight: 600; letter-spacing: 0.5px; }
.idx-section { margin-bottom: 28px; }
.idx-section h2 { font-family: var(--font-display); font-size: 1.1rem; color: var(--gold-deep);
  border-bottom: 2px solid var(--border-light); padding-bottom: 8px; margin-bottom: 14px; }
.idx-section h2 small { color: var(--text-muted); font-weight: 400; }
.idx-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; }
.idx-card { display: flex; flex-direction: column; gap: 2px; padding: 14px 16px;
  background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 10px;
  text-decoration: none; transition: all 0.15s; }
.idx-card:hover { border-color: var(--gold); transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(201,162,75,0.15); }
.idx-card i { color: var(--gold); font-size: 1.1rem; margin-bottom: 4px; }
.idx-card span { font-size: 0.88rem; font-weight: 600; color: var(--text); }
.idx-card small { font-size: 0.7rem; color: var(--text-muted); }
</style>
</head>
<body class="admin-body">
'''

def main():
    missing = [m for m in MODULES if m[4] not in CONTENT]
    if missing:
        print('MISSING content for:', [m[4] for m in missing]); sys.exit(1)

    count = 0
    for sec_dir, fname, _sec_label, title, active_id in MODULES:
        d = os.path.join(OUT, sec_dir)
        os.makedirs(d, exist_ok=True)
        html = page(title, active_id, CONTENT[active_id]())
        with open(os.path.join(d, fname), 'w') as f:
            f.write(html)
        count += 1
        print(f'  ✓ {sec_dir}/{fname}')

    # index
    with open(os.path.join(OUT, 'index.html'), 'w') as f:
        f.write(IDX_HEAD + build_index() + '\n</body>\n</html>\n')
    print(f'  ✓ index.html')
    print(f'\nGenerated {count} module files + index')

if __name__ == '__main__':
    main()
