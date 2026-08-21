#!/usr/bin/env python3
"""Slim all 53 admin pages to design shells.

Keeps: <!doctype> head, sidebar, topbar, main-wrapper structure, empty <main>,
sidebar-overlay, exactly two script tags (data.js then admin-design.js).
Removes: baked <main> content, all design-modal blocks, module script tag.
"""
import glob, os, re, sys

ROOT = os.environ.get('ADMIN_ROOT', '/workspace/laravel-clean/public/admin')
VERSION = os.environ.get('SCRIPT_VERSION', '1')

SHELL_MAIN = '<main class="page-content" id="pageContent">\n</main>'

def slim(f):
    s = open(f).read()
    orig = s
    # 1) empty main
    m = re.search(r'<main[^>]*>.*?</main>', s, re.S)
    if not m:
        return ('no-main', orig)
    s = s[:m.start()] + SHELL_MAIN + s[m.end():]
    # 2) drop everything between the LAST </script> and </body>
    ls = s.rfind('</script>')
    s = s[:ls + len('</script>')] + '\n</body>\n</html>\n'
    # 3) replace the two script tags (admin-design + modules/<page>) with data.js + admin-design.js
    scripts_re = re.compile(r'<script src="js/(?:admin-design|modules/[^"]+)\.js"[^>]*></script>\s*', re.S)
    s = scripts_re.sub('', s)
    tag = '<script src="js/data.js?v=' + VERSION + '"></script>\n<script src="js/admin-design.js?v=' + str(int(VERSION) + 1) + '"></script>\n'
    # insert right before </body>
    s = s.replace('</body>', tag + '</body>', 1)
    return ('ok', s)

def main():
    counts = {'ok': 0, 'no-main': 0}
    for f in sorted(glob.glob(os.path.join(ROOT, '*.html'))):
        b = os.path.basename(f)
        if b == 'index.html':
            continue
        status, out = slim(f)
        counts[status] += 1
        if status == 'ok':
            open(f, 'w').write(out)
    print('slimmed:', counts['ok'], '| skipped:', counts['no-main'])

if __name__ == '__main__':
    main()
