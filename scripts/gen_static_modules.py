#!/usr/bin/env python3
"""Regenerate admin module pages from CAPTURED legacy content (real old-panel data).

Structure per page:
  <html> head: admin CSS (../../css/*), Bootstrap Icons CDN
  <body class="admin-body">
    <aside class="sidebar">  — built once from navConfig, active section/page marked
    <div class="admin-main">
      <header class="topbar"> — search, notifications, user
      <main id="pageContent" class="page-content"> — EXACT captured innerHTML from legacy renderer
"""
import json, os, re, html as htmlmod

ROOT = '/workspace/laravel-clean/public/admin'
NAV = json.load(open('/tmp/navConfig.json'))
CAP = '/tmp/captured'

# --- section -> folder mapping (from navConfig section names) ---
def folder_for(section):
    return {
        'Dashboard': 'dashboard', 'Catalog': 'catalog', 'Sales': 'sales',
        'Members': 'members', 'Services': 'services', 'Marketing': 'marketing',
        'Support': 'support', 'Staff': 'staff', 'Website': 'website',
        'Home Feed': 'home-feed', 'Weddings Hub': 'weddings', 'Customise': 'customise',
        'Jewellery Vault': 'jewellery', 'VIP Events': 'vip-events', 'Stylist': 'stylist',
        'Settings': 'settings',
    }[section]

# --- page id -> filename ---
def fname(pid):
    replacements = {
        'contactQueries': 'contact-queries', 'supportTickets': 'support-tickets',
        'websiteSetup': 'website-setup', 'homePageSettings': 'home-page-settings',
        'mediaManager': 'media-manager', 'emailTemplates': 'email-templates',
    }
    s = replacements.get(pid, pid)
    return s + '.html'

# Path relative to modules/index.html (also correct for sidebar links via ../)
def page_path(section, pid):
    return f"{folder_for(section)}/{fname(pid)}"

LOGOUT = 'index.html'   # admin root index redirects to frontend login

def build_sidebar(active_section, active_pid):
    out = ['<div class="sidebar" id="sidebar">']
    out.append('  <div class="sidebar-header">')
    out.append('    <img src="assets/tatito-logo.png" alt="TATITO" class="sidebar-logo">')
    out.append('    <div>')
    out.append('      <h3 class="sidebar-brand">TATITO</h3>')
    out.append('      <small class="sidebar-subtitle">Admin Panel</small>')
    out.append('    </div>')
    out.append('  </div>')
    out.append('  <div class="sidebar-user">')
    out.append('    <div class="sidebar-avatar">SA</div>')
    out.append('    <div class="sidebar-user-info">')
    out.append('      <div class="sidebar-user-name">Super Admin</div>')
    out.append('      <div class="sidebar-user-role">Administrator</div>')
    out.append('    </div>')
    out.append('  </div>')
    out.append('  <nav class="sidebar-nav" id="sidebarNav">')
    for sec in NAV:
        has_active = any(it['id'] == active_pid for it in sec['items'])
        # legacy markup: div.nav-group (+expanded/+has-active) > a.nav-group-header
        # + div.nav-group-items > a.nav-item — matches legacy CSS (gold active
        # highlight, rotated chevron). `open` attr keeps it working without JS.
        gcls = 'nav-group' + (' expanded has-active' if has_active else '')
        style = '' if has_active else ' style="display:none"'
        out.append(f'    <div class="{gcls}">')
        out.append(f'      <a class="nav-group-header" href="{fname(active_pid)}#sec-{sec["section"].lower().replace(" ", "-")}"><i class="bi {sec["icon"]} nav-group-icon"></i><span>{sec["section"]}</span><i class="bi bi-chevron-down nav-group-chevron{" rotated" if has_active else ""}"></i></a>')
        out.append(f'      <div class="nav-group-items"{style}>')
        for item in sec['items']:
            cls = 'nav-item active' if item['id'] == active_pid else 'nav-item'
            out.append(f'        <a class="{cls}" href="{fname(item["id"])}"><i class="bi {item["icon"]}"></i><span>{item["label"]}</span></a>')
        out.append('      </div>')
        out.append('    </div>')
    out.append('  </nav>')
    out.append('  <div class="sidebar-footer">')
    out.append('    <a class="btn btn-ghost btn-block" href="index.html"><i class="bi bi-box-arrow-right"></i> Logout</a>')
    out.append('  </div>')
    out.append('</div>')
    return '\n'.join(out)

def build_topbar(section_label, page_label):
    """Legacy topbar: hamburger toggle + title on the left; globe, clear-cache,
    notifications bell, logout on the right (language dropdown omitted on purpose)."""
    return f"""<div class="topbar">
  <button class="topbar-toggle" title="Toggle sidebar"><i class="bi bi-list"></i></button>
  <h2>{page_label}</h2>
  <div class="topbar-actions">
    <a href="/frontend/index.html" target="_blank" class="topbar-icon-btn" title="Visit Site"><i class="bi bi-globe"></i></a>
    <button class="topbar-icon-btn" data-clear-cache="1" title="Clear Cache"><i class="bi bi-arrow-clockwise"></i></button>
    <a href="notifications.html" class="topbar-icon-btn" title="Notifications"><i class="bi bi-bell"></i></a>
    <a href="index.html" class="topbar-icon-btn" title="Logout"><i class="bi bi-box-arrow-right"></i></a>
  </div>
</div>
<div class="sidebar-overlay"></div>"""


HEAD = '''<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} — TATITO Admin</title>
<link rel="icon" type="image/png" href="assets/tatito-logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
<link rel="stylesheet" href="css/theme.css">
<link rel="stylesheet" href="css/layout.css">
<link rel="stylesheet" href="css/components.css">
<link rel="stylesheet" href="css/pages.css">
<link rel="stylesheet" href="css/modules.css">
</head>
<body class="admin-body">
<!-- ============================================================
     TATITO Admin — static design page (no JavaScript)
     Content below = exact rendered output of the legacy admin panel
     (MockData-driven). Sample data is illustrative; Laravel will
     replace with real data via Blade views + API.
     ============================================================ -->
'''

FOOT = '''
<script src="js/admin-design.js"></script>
</body>
</html>
'''

def chart_placeholder(chart_id, caption):
    return f'''<div class="card chart-card" data-chart="{chart_id}">
  <div class="card-header"><h3 class="card-title">{caption}</h3></div>
  <div class="card-body">
    <div class="chart-placeholder" data-chart-id="{chart_id}"><span class="chart-note">Chart renders when data is connected (Laravel + Chart.js)</span></div>
  </div>
</div>'''

def main():
    made = []
    for sec in NAV:
        for item in sec['items']:
            pid = item['id']
            cap_path = os.path.join(CAP, pid + '.html')
            if not os.path.exists(cap_path):
                print(f'!! no capture for {pid} — skipped')
                continue
            content = open(cap_path).read()
            # Strip chart <canvas> elements (replaced by static placeholders)
            content = re.sub(r'<canvas[^>]*id="([^"]+)"[^>]*></canvas>',
                             lambda m: f'<div class="chart-placeholder" data-chart-id="{m.group(1)}"><span class="chart-note">Chart renders when data is connected</span></div>', content)
            page = (HEAD.format(title=item['label'])
                    + build_sidebar(sec['section'], pid)
                    + '<div class="main-wrapper" id="mainWrapper">\n'
                    + build_topbar(sec['section'], item['label'])
                    + '<main class="page-content-wrapper" id="pageContent">\n'
                    + content
                    + '\n</main>\n</div>\n'
                    + FOOT)
            out = os.path.join(ROOT, fname(pid))
            os.makedirs(os.path.dirname(out), exist_ok=True)
            open(out, 'w').write(page)
            made.append(out)
    print(f'wrote {len(made)} pages')

    # --- integrated cleanup pass over generated files ---
    import pathlib
    pats = [
        (re.compile(r'\s+on(click|change|submit|input|load|error|focus|blur|mouseover|mouseout|keyup|keydown|toggle)="[^"]*"'), ''),
        (re.compile(r'href="javascript:[^"]*"'), 'href="#"'),
        (re.compile(r'contenteditable="true"'), ''),
        (re.compile(r'src="assets/'), 'src="../../assets/'),
    ]
    n = 0
    for p in pathlib.Path(ROOT).glob('*.html'):
        t = p.read_text(); o = t
        for rx, repl in pats: t = rx.sub(repl, t)
        if t != o: p.write_text(t); n += 1
    print('cleanup pass:', n, 'files')

    # Refunds page has no legacy renderer — build minimal from payments capture
    build_refunds()

def build_refunds():
    page = (HEAD.format(title='Refunds')
            + build_sidebar('Sales', 'refunds')
            + '<div class="main-wrapper" id="mainWrapper">\n' + build_topbar('Sales', 'Refunds')
            + '<main class="page-content-wrapper" id="pageContent">\n<!-- Legacy panel had no separate refunds renderer; refunds appear under Payments. Design placeholder: -->\n'
            + '<div class="card"><div class="card-header"><h3 class="card-title">Refunds</h3><p class="text-muted">Refund requests and history (legacy panel listed refunds within Payments)</p></div><div class="card-body"><p class="text-muted">All refund records from the payments module are shown here once Laravel data is connected.</p></div></div>'
            + '\n</main>\n</div>\n' + FOOT)
    out = os.path.join(ROOT, 'refunds.html')
    open(out, 'w').write(page)
    print('wrote refunds placeholder')


if __name__ == '__main__':
    main()
