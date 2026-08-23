#!/usr/bin/env python3
"""Strip comments from admin panel source files.

- HTML pages + index.html: remove <!-- ... --> blocks (data-* attrs and
  visible text are unaffected; pages have exactly one header comment each).
- CSS files: remove /* ... */ blocks (no odd quotes / no url() with http
  anywhere — verified safe for this codebase).
- JS files:
    data.js        — remove ONLY the leading /* ... */ header (lines 2-13);
                     string content is untouched.
    admin-design.js — remove // line comments and /* */ blocks using a
                     character scanner that tracks string/template state so
                     'https://' inside strings is never touched.

Backs up originals to /tmp/before-strip/ for diffing, verifies syntax after.
"""
import glob, os, re, shutil, subprocess

ROOT = '/workspace/laravel-clean/public/admin'
BACKUP = '/tmp/before-strip'

def strip_js_comments(src):
    out = []
    i, n = 0, len(src)
    state = None  # None | "'" | '"' | '`' | 'line' | 'block'
    while i < n:
        c = src[i]
        nxt = src[i + 1] if i + 1 < n else ''
        if state is None:
            if c == "'" or c == '"':
                state = c; out.append(c); i += 1
            elif c == '`':
                state = '`'; out.append(c); i += 1
            elif c == '/' and nxt == '/':
                state = 'line'; i += 2
            elif c == '/' and nxt == '*':
                state = 'block'; i += 2
            elif c == '/' and nxt == '/':  # unreachable
                pass
            else:
                out.append(c); i += 1
        elif state in ("'", '"', '`'):
            if c == '\\':
                out.append(c); out.append(nxt); i += 2
            elif c == state:
                state = None; out.append(c); i += 1
            else:
                out.append(c); i += 1
        elif state == 'line':
            if c == '\n':
                state = None; out.append(c); i += 1
            else:
                i += 1
        elif state == 'block':
            if c == '*' and nxt == '/':
                state = None; i += 2
            else:
                i += 1
    # collapse >2 consecutive blank lines left by block removals
    s = ''.join(out)
    s = re.sub(r'\n{3,}', '\n\n', s)
    # drop trailing whitespace on comment-only lines
    return s

def main():
    os.makedirs(BACKUP, exist_ok=True)
    report = []

    # HTML
    for f in sorted(glob.glob(os.path.join(ROOT, '*.html'))):
        rel = os.path.relpath(f, ROOT)
        shutil.copy(f, os.path.join(BACKUP, rel.replace('/', '__')))
        s = open(f).read()
        s2 = re.sub(r'<!--.*?-->\s*\n?', '', s, flags=re.S)
        if s2 != s:
            open(f, 'w').write(s2)
            report.append(f'{rel}: HTML comments removed')

    # CSS
    for f in sorted(glob.glob(os.path.join(ROOT, 'css', '*.css'))):
        rel = os.path.relpath(f, ROOT)
        shutil.copy(f, os.path.join(BACKUP, rel.replace('/', '__')))
        s = open(f).read()
        s2 = re.sub(r'/\*.*?\*/\s*\n?', '', s, flags=re.S)
        if s2 != s:
            open(f, 'w').write(s2)
            report.append(f'{rel}: CSS comments removed')

    # data.js: only the header block
    f = os.path.join(ROOT, 'js', 'data.js')
    shutil.copy(f, os.path.join(BACKUP, 'js__data.js'))
    s = open(f).read()
    m = re.match(r"('use strict';\n)(/\*.*?\*/\n)", s, flags=re.S)
    assert m, 'data.js header not found'
    s2 = m.group(1) + s[m.end():]
    open(f, 'w').write(s2)
    report.append('js/data.js: header comment removed')

    # admin-design.js: full strip with scanner
    f = os.path.join(ROOT, 'js', 'admin-design.js')
    shutil.copy(f, os.path.join(BACKUP, 'js__admin-design.js'))
    s = open(f).read()
    s2 = strip_js_comments(s)
    open(f, 'w').write(s2)
    report.append('js/admin-design.js: comments stripped')

    print('\n'.join(report))

    # verify JS syntax
    for f in [os.path.join(ROOT, 'js', 'data.js'), os.path.join(ROOT, 'js', 'admin-design.js')]:
        r = subprocess.run(['node', '--check', f], capture_output=True, text=True)
        print(os.path.basename(f), 'syntax:', 'OK' if r.returncode == 0 else r.stderr)

if __name__ == '__main__':
    main()
