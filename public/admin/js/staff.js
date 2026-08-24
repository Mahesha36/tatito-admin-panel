(function () {
    if (!window.Design) return;
    Design._wireOnce('_tabSwitchWired', function () {
        document.addEventListener('click', function (e) {
            var b = e.target.closest('[data-tab-switch]');
            if (!b) return;
            var sibs = b.parentElement.querySelectorAll('[data-tab-switch]');
            sibs.forEach(function (x) { x.classList.remove('active'); });
            b.classList.add('active');
            var panel = b.getAttribute('data-staff-tab-panel');
            if (panel) {
                document.querySelectorAll('[data-staff-tab-page]').forEach(function (c) {
                    c.style.display = (c.getAttribute('data-staff-tab-page') === panel) ? '' : 'none';
                });
                document.querySelectorAll('[data-staff-tab-panel]').forEach(function (x) {
                    if (x.classList.contains('tab-btn')) return;
                    x.style.display = (x.getAttribute('data-staff-tab-panel') === panel) ? '' : 'none';
                });
            }
        });
    });
})();
