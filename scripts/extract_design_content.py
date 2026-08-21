#!/usr/bin/env python3
"""Extract design-mode content from static admin pages.

Page shape (since the flat move):
  <body class="admin-body">
    <div class="sidebar">...</div>
    <div class="main-wrapper"><div class="topbar">...</div>
      <main>...page content...</main>
    </div>
    <div class="sidebar-overlay"></div>
    <script src="js/admin-design.js"></script>
    <script src="js/modules/<page>.js"></script>
    <!-- legacy modal forms -->
    <div class="design-modal" id="...">...</div>   x N
    <!-- design-mode modals (postprocess) -->
    ...
    </body></html>

Collects per page: main content (as-is) + all design-modal blocks.
Writes /tmp/captured/design_content.json
"""
import glob, json, os, re

ROOT = os.environ.get('ADMIN_ROOT', '/workspace/laravel-clean/public/admin')
OUT = '/tmp/captured/design_content.json'

def extract(f):
    s = open(f).read()
    m = re.search(r'(<main[^>]*>)(.*?)(</main>)', s, re.S)
    if not m:
        return None
    main_html = m.group(2).strip()
    # modals: everything after the last </script> in the tail
    tail = s[m.end():]
    last_script = tail.rfind('</script>')
    modals_html = tail[last_script + len('</script>'):]
    modals = []
    for mm in re.finditer(r'<div class="design-modal"[^>]*>.*?(?=<div class="design-modal"|\Z)', modals_html, re.S):
        block = mm.group(0)
        if re.search(r'</body>|</html>', block):
            block = re.split(r'</body>', block)[0]
        modals.append(block.strip())
    return {'main': main_html, 'modals': modals}

def main():
    out = {}
    for f in sorted(glob.glob(os.path.join(ROOT, '*.html'))):
        b = os.path.basename(f)
        if b == 'index.html':
            continue
        r = extract(f)
        if r is None:
            print('NO MATCH:', b)
            continue
        out[b[:-5]] = r
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(out, open(OUT, 'w'), indent=1)
    total_modals = sum(len(v['modals']) for v in out.values())
    print(f'pages: {len(out)}  modals: {total_modals}  -> {OUT}')
    for sz, k in sorted(((len(v['main']) + sum(len(x) for x in v['modals']), k) for k, v in out.items()), reverse=True)[:8]:
        print(f'  {k}: {sz//1024}KB')

if __name__ == '__main__':
    main()
