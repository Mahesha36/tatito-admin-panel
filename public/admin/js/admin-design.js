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
                
                var x = e.target.closest('.design-modal .btn-close');
                if (x) {
                    var xm = x.closest('.design-modal');
                    if (xm) Design.closeModal(xm.id);
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
            }, true);   
        });
    };

    
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

    
    Design.initCopy = function () {
        Design._wireOnce('_copyWired', function () {
            document.addEventListener('click', function (e) {
                var c = e.target.closest('[data-copy]');
                if (!c) return;
                Design.toast('Copied (design mode)', 'success');
            });
        });
    };

    
    Design.initNotifFilter = function () {
        Design._wireOnce('_notifFilterWired', function () {
            var TAB_TYPE = {
                all: null,
                order: ['type-primary', 'bag-check', 'bag'],
                payment: ['type-success', 'credit-card', 'currency', 'cash'],
                system: ['type-info', 'bell', 'gear'],
                review: ['type-warning', 'star'],
                user: ['type-secondary', 'person']
            };
            document.addEventListener('click', function (e) {
                var btn = e.target.closest('.filter-tabs [data-tab-switch]');
                if (!btn) return;
                var key = (btn.textContent || '').trim().toLowerCase();
                var want = TAB_TYPE[key];
                if (want === undefined) return;
                document.querySelectorAll('.notif-item').forEach(function (item) {
                    if (want === null) { item.style.display = ''; return; }
                    var iconWrap = item.querySelector('.notif-icon');
                    var icon = iconWrap ? iconWrap.querySelector('i') : null;
                    var wrapperCls = iconWrap ? iconWrap.className : '';
                    var icls = icon ? (icon.className.match(/bi-([\w-]+)/) || [])[1] : '';
                    var show = want.some(function (w) {
                        if (w.indexOf('type-') === 0) return wrapperCls.indexOf(w) > -1;
                        return icls && icls.indexOf(w) > -1;
                    });
                    item.style.display = show ? '' : 'none';
                });
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
        Design.initTree();
        Design.initTabSwitch();
        Design.initPills();
        Design.initRoleSelect();
        Design.initNotifs();
        Design.initNotifFilter();
        Design.initListItems();
        Design.initCopy();
    });

    window.Design = Design;
})();
