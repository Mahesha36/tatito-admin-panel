#!/usr/bin/env python3
"""Build the NEW structured data.js (DB-bound data only).

Input : /tmp/captured/split_pages.json
Output: public/admin/js/data.js with
    window.DesignData = { page: { rows: {...}, stats: {...}, lists: {...}, tree: '...', modals: [...] } }
Empty sections are omitted. String-safe escaping for <script src> loading.
"""
import json, os

SRC = '/tmp/captured/split_pages.json'
OUT = os.environ.get('DATA_OUT', '/workspace/laravel-clean/public/admin/js/data.js')

def esc(s):
    return (s.replace('\\', '\\\\').replace("'", "\\'")
             .replace('\n', '\\n').replace('\r', '')
             .replace('</script', '<\\/script').replace('<!--', '<\\!--'))

def main():
    d = json.load(open(SRC))
    parts = ["'use strict';",
             "(function () {",
             "    var data = {};"]
    for page in sorted(d):
        data = d[page]['data']
        parts.append(f"    data['{page}'] = {{")
        if data.get('rows'):
            parts.append("        rows: {")
            for slot, rows in data['rows'].items():
                parts.append(f"            '{slot}': [")
                for r in rows:
                    parts.append(f"                '{esc(r)}',")
                parts.append("            ],")
            parts.append("        },")
        if data.get('stats'):
            parts.append("        stats: {")
            for k, v in data['stats'].items():
                parts.append(f"            '{k}': '{esc(v)}',")
            parts.append("        },")
        if data.get('lists'):
            parts.append("        lists: {")
            for k, items in data['lists'].items():
                parts.append(f"            '{k}': [")
                for it in items:
                    parts.append(f"                '{esc(it)}',")
                parts.append("            ],")
            parts.append("        },")
        if data.get('tree'):
            parts.append(f"        tree: '{esc(data['tree'])}',")
        if data.get('modals'):
            parts.append("        modals: [")
            for m in data['modals']:
                parts.append(f"            '{esc(m)}',")
            parts.append("        ],")
        parts.append("    };")
    parts.append("    window.DesignData = data;")
    parts.append("})();")
    src = '\n'.join(parts) + '\n'
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    open(OUT, 'w').write(src)
    n_rows = sum(len(v['data'].get('rows', {}).get(k, [])) for v in d.values() for k in v['data'].get('rows', {}))
    n_modals = sum(len(v['data']['modals']) for v in d.values())
    n_stats = sum(len(v['data'].get('stats', {})) for v in d.values())
    n_lists = sum(sum(len(x) for x in v['data'].get('lists', {}).values()) for v in d.values())
    print(f'wrote {OUT} {len(src)//1024}KB | pages {len(d)} rows {n_rows} stats {n_stats} list-items {n_lists} modals {n_modals}')

if __name__ == '__main__':
    main()
