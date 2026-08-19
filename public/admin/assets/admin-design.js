'use strict';
/* ================================================================
   TATITO FASHIONS — Admin Design Runtime (design-only, no backend)
   ================================================================
   Minimal JS so the static module pages behave like the old working
   panel at the DESIGN level: tab switching, modals (view details /
   add / edit), toggle switches, toasts, confirm dialogs.
   No data is saved, no API is called — visual behavior only.

   Loaded by every page under /admin/modules/. Keep this file small;
   the Laravel rewrite will replace all of this with real controllers.
   ================================================================ */
(function () {
    var Design = {};

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

    document.addEventListener('DOMContentLoaded', function () {
        Design.initTabs();
        Design.initModals();
        Design.initToggles();
        Design.initToastButtons();
        Design.initConfirm();
        Design.initUploads();
    });

    window.Design = Design;
})();
