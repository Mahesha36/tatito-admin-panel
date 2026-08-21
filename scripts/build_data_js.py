#!/usr/bin/env python3
"""Build public/admin/js/data.js from /tmp/captured/design_content.json.

Output: window.DesignData = { "<page>": { main: "...", modals: ["...", ...] } }
Content is JS string literals — `</script` and `<!--` are escaped so the
file can be loaded via <script src> safely. No eval, no JSON.parse at runtime.
"""
import json, os

SRC = '/tmp/captured/design_content.json'
OUT = os.environ.get('DATA_OUT', '/workspace/laravel-clean/public/admin/js/data.js')

def esc(s):
    return s.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n').replace('\r', '').replace('</script', '<\\/script').replace('<!--', '<\\!--')

def main():
    d = json.load(open(SRC))
    lines = []
    lines.append("'use strict';")
    lines.append("/* ============================================================")
    lines.append("   TATITO FASHIONS — Admin demo data (design-only)")
    lines.append("   ============================================================")
    lines.append("   ALL demo content for the 53 module pages, extracted 1:1")
    lines.append("   from the static design pages. One file — when the Laravel")
    lines.append("   backend is connected this is the ONLY file to delete:")
    lines.append("   pages then render server-side (Blade) and admin-design.js")
    lines.append("   detects an empty DesignData and goes fully inert.")
    lines.append("")
    lines.append("   Structure per page:")
    lines.append("     main   — full <main> inner HTML (tables, cards, stats…)")
    lines.append("     modals — every design-mode modal body (view / edit / add)")
    lines.append("   ============================================================ */")
    lines.append("(function () {")
    lines.append("    var data = {")
    for page in sorted(d):
        v = d[page]
        lines.append("        '%s': { main: '%s', modals: [" % (page, esc(v['main'])))
        for m in v['modals']:
            lines.append("            '%s'," % esc(m))
        lines.append("        ]},")
    lines.append("    };")
    lines.append("    window.DesignData = data;")
    lines.append("})();")
    src = '\n'.join(lines) + '\n'
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    open(OUT, 'w').write(src)
    print('wrote', OUT, len(src) // 1024, 'KB,', len(d), 'pages,', sum(len(v['modals']) for v in d.values()), 'modals')

if __name__ == '__main__':
    main()
