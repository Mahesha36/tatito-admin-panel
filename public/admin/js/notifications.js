(function () {
    if (!window.Design) return;
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
})();
