'use strict';

(function () {
    var Design = {};

    
    Design.injectData = function () {
        var data = window.DesignData;
        if (!data) return;
        var page = (document.body.getAttribute('data-design-page') ||
            (location.pathname.split('/').pop() || '').replace(/\.html$/, ''));
        var entry = data[page];
        if (!entry) return;
        var q = function (sel) { return document.querySelectorAll(sel); };
        if (entry.rows) {
            Object.keys(entry.rows).forEach(function (slot) {
                q('[data-rows="' + slot + '"]').forEach(function (tb) {
                    tb.innerHTML = entry.rows[slot].join('\n');
                });
            });
        }
        if (entry.stats) {
            Object.keys(entry.stats).forEach(function (key) {
                q('[data-stat="' + key + '"]').forEach(function (el) {
                    el.textContent = entry.stats[key];
                });
            });
        }
        if (entry.lists) {
            Object.keys(entry.lists).forEach(function (key) {
                q('[data-list="' + key + '"]').forEach(function (host) {
                    host.insertAdjacentHTML('beforeend', entry.lists[key].join('\n'));
                });
            });
        }
        if (entry.tree) {
            q('.cat-tree[data-tree], .cat-tree').forEach(function (host) {
                host.insertAdjacentHTML('beforeend', entry.tree);
            });
        }
        if (entry.modals) {
            var frag = document.createElement('div');
            frag.innerHTML = entry.modals.join('\n');
            while (frag.firstChild) {
                document.body.appendChild(frag.firstChild);
            }
        }
    };

    
    Design._wireOnce = function (key, fn) {
        if (Design[key]) return;
        Design[key] = true;
        fn();
    };

    
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
    Design.closeNearestModal = function (el) {
        var m = el.closest('.design-modal');
        if (m) Design.closeModal(m.id);
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
                    Design.closeNearestModal(closer);
                    return;
                }
                
                var x = e.target.closest('.design-modal .modal-close, .design-modal .btn-close');
                if (x) {
                    Design.closeNearestModal(x);
                    return;
                }
                var g = e.target.closest('.design-modal .modal-footer .btn-ghost');
                if (g && (g.textContent || '').trim().toLowerCase() === 'close') {
                    var gm = g.closest('.design-modal');
                    if (gm) Design.closeModal(gm.id);
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

    
    Design.initToggles = function () {
        Design._wireOnce('_togglesWired', function () {
            var lastToggle = { el: null, t: 0 };
            document.addEventListener('click', function (e) {
                var t = e.target.closest('.toggle-switch');
                if (!t || t.hasAttribute('data-static')) return;
                var now = Date.now();
                if (lastToggle.el === t && (now - lastToggle.t) < 60) return; 
                lastToggle.el = t; lastToggle.t = now;
                t.classList.toggle('on');
                var row = t.closest('.toggle-row');
                var status = row ? row.querySelector('.toggle-info p') : null;
                if (status) status.textContent = t.classList.contains('on') ? 'Enabled' : 'Disabled';
            });
        });
    };

    
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
                
                Design.closeDropdowns();
            });
        });
    };

    
    Design.initUploads = function () {
        document.querySelectorAll('.upload-field, .upload-zone').forEach(function (field) {
            if (field._uploadWired) return;
            field._uploadWired = true;
            field.addEventListener('click', function () {
                Design.toast('File picker opens when backend is connected', 'info');
            });
        });
    };

    

    
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
    document.addEventListener('DOMContentLoaded', function () {
        Design.injectData();
        Design.initTabs();
        Design.initModals();
        Design.initToggles();
        Design.initToastButtons();
        Design.initConfirm();
        Design.initDropdowns();
        Design.initUploads();
        Design.initTopbar();
        Design.initNavGroups();
    });


    window.Design = Design;
})();
