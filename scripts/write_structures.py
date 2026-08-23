#!/usr/bin/env python3
"""Write the structural HTML for all 53 pages from split_pages.json.

Each page: <main class="page-content-wrapper" id="pageContent"> + structure
+ </main>. Modals/rows/stats stay in data.js. Keeps the two script tags.
"""
import glob, json, os, re

SRC = '/tmp/captured/split_pages.json'
ROOT = os.environ.get('ADMIN_ROOT', '/workspace/laravel-clean/public/admin')

def main():
    d = json.load(open(SRC))
    written = 0
    for f in sorted(glob.glob(os.path.join(ROOT, '*.html'))):
        b = os.path.basename(f)
        if b == 'index.html':
            continue
        page = b[:-5]
        if page not in d:
            print('NO SPLIT DATA:', b)
            continue
        struct = d[page]['structure']
        s = open(f).read()
        m = re.search(r'(<main[^>]*>).*?(</main>)', s, re.S)
        if not m:
            print('NO MAIN:', b)
            continue
        s = s[:m.start()] + m.group(1) + '\n' + struct + '\n' + m.group(2) + s[m.end():]
        open(f, 'w').write(s)
        written += 1
    print('pages written:', written)

if __name__ == '__main__':
    main()
