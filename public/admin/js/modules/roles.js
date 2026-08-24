(function () {
    if (!window.Design) return;
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
})();
