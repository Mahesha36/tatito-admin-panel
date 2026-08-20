'use strict';
/* ================================================================
   TATITO FASHIONS — Admin Design Runtime (design-only, no backend)
   ================================================================
   Minimal JS so the static module pages behave like the old working
   panel at the DESIGN level: tab switching, modals (view details /
   add / edit), toggle switches, toasts, confirm dialogs.
   No data is saved, no API is called — visual behavior only.

   Per-module JS: each module may ship js/modules/<page>.js which is
   executed once its page loads (registration at the bottom). The
   shared runtime stays tiny; module files hold page-specific wiring
   only if a page truly needs it.
   ================================================================ */
(function () {
    var Design = {};
    Design.modules = {};   // name -> init fn, called on DOMContentLoaded

    /* one-time binding guard (protects against double script loads) */
    Design._wireOnce = function (key, fn) {
        if (Design[key]) return;
        Design[key] = true;
        fn();
    };

    /* ---------- Tabs ----------
       Two known layouts:
       1) Settings page: .settings-tab[data-tab-btn] buttons + panels
          inside #settingsTabContent (.tab-panel[data-tab])
       2) Website Setup: .tab-btn[data-tab-btn] buttons + panels
          inside #wsTabContent (.tab-panel[data-tab])
       Wiring is idempotent and page-scoped. */
    function wireTabs(tabs, panels) {
        if (!tabs.length || !panels.length) return;
        tabs.forEach(function (t) {
            if (t._tabWired) return;
            t._tabWired = true;
            t.addEventListener('click', function () {
                tabs.forEach(function (x) { x.classList.remove('active'); });
                t.classList.add('active');
                var id = t.getAttribute('data-tab-btn') || t.getAttribute('data-tab');
                panels.forEach(function (p) {
                    p.style.display = (p.getAttribute('data-tab') === id) ? '' : 'none';
                });
            });
        });
    }
    Design.initTabs = function () {
        var stabs = Array.prototype.slice.call(document.querySelectorAll('.settings-tab'));
        var spanels = Array.prototype.slice.call(document.querySelectorAll('#settingsTabContent .tab-panel, #settingsTabContent .tab-panel[data-tab]'));
        if (!spanels.length) spanels = Array.prototype.slice.call(document.querySelectorAll('.tab-panel'));
        wireTabs(stabs, spanels);

        var wtabs = Array.prototype.slice.call(document.querySelectorAll('.tab-btn'));
        var wpanels = Array.prototype.slice.call(document.querySelectorAll('#wsTabContent .tab-panel'));
        if (wtabs.length && wpanels.length) wireTabs(wtabs, wpanels);
    };

    /* ---------- Modals ---------- */
    Design.openModal = function (id) {
        Design.closeDropdowns();
        var m = document.getElementById(id);
        if (!m) return;
        m.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };
    Design.closeModal = function (id) {
        var m = document.getElementById(id);
        if (!m) return;
        m.style.display = 'none';
        document.body.style.overflow = '';
    };
    Design.initModals = function () {
        Design._wireOnce('_modalsWired', function () {
            document.addEventListener('click', function (e) {
                var opener = e.target.closest('[data-modal-open]');
                if (opener) {
                    Design.openModal(opener.getAttribute('data-modal-open'));
                    return;
                }
                var closer = e.target.closest('[data-modal-close]');
                if (closer) {
                    Design.closeModal(closer.getAttribute('data-modal-close'));
                    return;
                }
                if (e.target.classList && e.target.classList.contains('design-modal')) {
                    e.target.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') {
                    document.querySelectorAll('.design-modal').forEach(function (m) {
                        m.style.display = 'none';
                    });
                    document.body.style.overflow = '';
                }
            });
        });
    };

    /* ---------- Toggles (design-only flip, debounced) ---------- */
    Design.initToggles = function () {
        Design._wireOnce('_togglesWired', function () {
            var lastToggle = { el: null, t: 0 };
            document.addEventListener('click', function (e) {
                var t = e.target.closest('.toggle-switch');
                if (!t || t.hasAttribute('data-static')) return;
                var now = Date.now();
                if (lastToggle.el === t && (now - lastToggle.t) < 60) return; // double-fire guard
                lastToggle.el = t; lastToggle.t = now;
                t.classList.toggle('on');
                var row = t.closest('.toggle-row');
                var status = row ? row.querySelector('.toggle-info p') : null;
                if (status) status.textContent = t.classList.contains('on') ? 'Enabled' : 'Disabled';
            });
        });
    };

    /* ---------- Toast (design feedback) ---------- */
    Design.toast = function (msg, type) {
        var wrap = document.getElementById('designToastWrap');
        if (!wrap) {
            wrap = document.createElement('div');
            wrap.id = 'designToastWrap';
            document.body.appendChild(wrap);
        }
        var el = document.createElement('div');
        el.className = 'design-toast ' + (type || 'success');
        el.innerHTML = '<i class="bi ' + (type === 'error' ? 'bi-x-circle' : 'bi-check-circle') + '"></i>';
        var span = document.createElement('span');
        span.textContent = msg;
        el.appendChild(span);
        wrap.appendChild(el);
        setTimeout(function () { el.classList.add('show'); }, 10);
        setTimeout(function () {
            el.classList.remove('show');
            setTimeout(function () { el.remove(); }, 300);
        }, 2600);
    };
    Design.initToastButtons = function () {
        Design._wireOnce('_toastsWired', function () {
            document.addEventListener('click', function (e) {
                var b = e.target.closest('[data-toast]');
                if (b) Design.toast(b.getAttribute('data-toast') || 'Saved (design mode)', b.getAttribute('data-toast-type') || 'success');
            });
        });
    };

    /* ---------- Confirm (design) ---------- */
    Design.initConfirm = function () {
        Design._wireOnce('_confirmWired', function () {
            document.addEventListener('click', function (e) {
                var b = e.target.closest('[data-confirm]');
                if (!b) return;
                e.preventDefault();
                var msg = b.getAttribute('data-confirm');
                if (window.confirm(msg)) {
                    Design.toast('Action performed (design mode): ' + msg.replace(/\?$/, ''), 'success');
                }
            });
        });
    };

    /* ---------- Member three-dot dropdowns ----------
       Each member row: .member-actions-btn toggles the sibling
       .member-dropdown (.show). Items carry data-modal-open /
       data-confirm / data-toast and reuse the generic handlers above. */
    Design.closeDropdowns = function (except) {
        document.querySelectorAll('.member-dropdown.show').forEach(function (d) {
            if (d !== except) d.classList.remove('show');
        });
    };
    Design.initDropdowns = function () {
        Design._wireOnce('_dropdownsWired', function () {
            document.addEventListener('click', function (e) {
                var btn = e.target.closest('.member-actions-btn');
                if (btn) {
                    e.stopPropagation();
                    var dd = btn.parentElement ? btn.parentElement.querySelector('.member-dropdown') : null;
                    if (!dd) dd = btn.nextElementSibling;
                    if (!dd) return;
                    var isOpen = dd.classList.contains('show');
                    Design.closeDropdowns();
                    if (!isOpen) dd.classList.add('show');
                    return;
                }
                /* any click outside a dropdown (incl. its items) closes it */
                Design.closeDropdowns();
            });
        });
    };

    /* ---------- Upload zones (file-picker placeholder) ---------- */
    Design.initUploads = function () {
        document.querySelectorAll('.upload-field, .upload-zone').forEach(function (field) {
            if (field._uploadWired) return;
            field._uploadWired = true;
            field.addEventListener('click', function () {
                Design.toast('File picker opens when backend is connected', 'info');
            });
        });
    };

    /* ---------- Round 2: page-level controls ---------- */

    /* Topbar: hamburger toggle (legacy toggleSidebar) + clear cache */
    Design.initTopbar = function () {
        Design._wireOnce('_topbarWired', function () {
            document.addEventListener('click', function (e) {
                var t = e.target.closest('.topbar-toggle');
                if (t) {
                    var sb = document.getElementById('sidebar');
                    var ov = document.querySelector('.sidebar-overlay');
                    if (sb) sb.classList.toggle('open');
                    if (ov) ov.classList.toggle('show');
                    return;
                }
                if (e.target.closest('.sidebar-overlay')) {
                    var sb2 = document.getElementById('sidebar');
                    var ov2 = document.querySelector('.sidebar-overlay');
                    if (sb2) sb2.classList.remove('open');
                    if (ov2) ov2.classList.remove('show');
                    return;
                }
                if (e.target.closest('[data-clear-cache]')) {
                    Design.toast('Cache cleared successfully', 'success');
                }
            });
        });
    };

    /* Sidebar nav groups: click header to expand/collapse (legacy toggleSection).
       The active section ships expanded via inline display; JS only toggles
       groups — stays inert if markup is plain <details>. */
    Design.initNavGroups = function () {
        Design._wireOnce('_navWired', function () {
            document.addEventListener('click', function (e) {
                var h = e.target.closest('a.nav-group-header');
                if (!h) return;
                var group = h.closest('.nav-group');
                var items = group ? group.querySelector('.nav-group-items') : null;
                var chev = h.querySelector('.nav-group-chevron');
                if (!items) return;
                e.preventDefault();
                var collapsed = items.style.display === 'none';
                items.style.display = collapsed ? 'block' : 'none';
                if (chev) chev.classList.toggle('rotated', collapsed);
                if (group) group.classList.toggle('expanded', collapsed);
            });
        });
    };

    /* Categories tree: Expand All / Collapse All */
    Design.initTree = function () {
        Design._wireOnce('_treeWired', function () {
            document.addEventListener('click', function (e) {
                var ex = e.target.closest('[data-tree-expand]');
                var co = e.target.closest('[data-tree-collapse]');
                if (!ex && !co) return;
                var expanding = !!ex;
                document.querySelectorAll('.cat-tree-item').forEach(function (it) {
                    it.classList.toggle('collapsed', !expanding);
                });
            });
        });
    };

    /* Generic tab switchers: [data-tab-switch] activate among siblings */
    Design.initTabSwitch = function () {
        Design._wireOnce('_tabSwitchWired', function () {
            document.addEventListener('click', function (e) {
                var b = e.target.closest('[data-tab-switch]');
                if (!b) return;
                var sibs = b.parentElement.querySelectorAll('[data-tab-switch]');
                sibs.forEach(function (x) { x.classList.remove('active'); });
                b.classList.add('active');
            });
        });
    };

    /* Filter pills (tracking/notifications): click = active */
    Design.initPills = function () {
        Design._wireOnce('_pillsWired', function () {
            document.addEventListener('click', function (e) {
                var p = e.target.closest('[data-pill]');
                if (!p) return;
                var sibs = p.parentElement.querySelectorAll('[data-pill]');
                sibs.forEach(function (x) { x.classList.remove('active'); });
                p.classList.add('active');
            });
        });
    };

    /* Roles sidebar list: click to select */
    Design.initRoleSelect = function () {
        Design._wireOnce('_roleWired', function () {
            document.addEventListener('click', function (e) {
                var r = e.target.closest('[data-role-select]');
                if (!r) return;
                document.querySelectorAll('[data-role-select]').forEach(function (x) {
                    x.classList.remove('active');
                    x.style.background = 'transparent';
                    x.style.border = '1px solid transparent';
                });
                r.classList.add('active');
                r.style.background = 'var(--ivory)';
                r.style.border = '1px solid var(--line)';
            });
        });
    };

    /* Notifications: check button marks item read (and must NOT open the modal).
       The item itself is a data-modal-open trigger handled by initModals. */
    Design.initNotifs = function () {
        Design._wireOnce('_notifWired', function () {
            document.addEventListener('click', function (e) {
                var mk = e.target.closest('[data-mark-read]');
                if (mk) {
                    e.preventDefault();
                    e.stopPropagation();
                    var item = mk.closest('.notif-item');
                    if (item) {
                        item.classList.remove('unread');
                        item.classList.add('read');
                        var dot = item.querySelector('.notif-dot');
                        if (dot) dot.remove();
                        mk.remove();
                    }
                    Design.toast('Marked as read', 'success');
                }
            }, true);   // capture: runs before the modal-open delegated handler
        });
    };

    /* Clickable list items: templates list (notifications now via modals) */
    Design.initListItems = function () {
        Design._wireOnce('_listWired', function () {
            document.addEventListener('click', function (e) {
                var li = e.target.closest('[data-list-item]');
                if (li) {
                    Design.toast('Template editor opens when backend is connected', 'info');
                    return;
                }
            });
        });
    };

    /* Copy buttons (tracking) */
    Design.initCopy = function () {
        Design._wireOnce('_copyWired', function () {
            document.addEventListener('click', function (e) {
                var c = e.target.closest('[data-copy]');
                if (!c) return;
                Design.toast('Copied (design mode)', 'success');
            });
        });
    };

    document.addEventListener('DOMContentLoaded', function () {
        Design.initTabs();
        Design.initModals();
        Design.initToggles();
        Design.initToastButtons();
        Design.initConfirm();
        Design.initDropdowns();
        Design.initUploads();
        Design.initTopbar();
        Design.initNavGroups();
        Design.initTree();
        Design.initTabSwitch();
        Design.initPills();
        Design.initRoleSelect();
        Design.initNotifs();
        Design.initListItems();
        Design.initCopy();
        /* run any registered page module for this document */
        var path = location.pathname.split('/').pop() || 'index.html';
        var key = path.replace('.html', '');
        if (Design.modules[key]) {
            try { Design.modules[key](Design); } catch (err) { /* design-only */ }
        }
    });

    window.Design = Design;
Design.register = function (name, init) { Design.modules[name] = init; };
})();
