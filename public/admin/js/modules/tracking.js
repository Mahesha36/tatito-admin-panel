(function () {
    if (!window.Design) return;
    Design._wireOnce('_pillWired', function () {
        document.addEventListener('click', function (e) {
            var p = e.target.closest('[data-pill]');
            if (!p) return;
            var sibs = p.parentElement.querySelectorAll('[data-pill]');
            sibs.forEach(function (x) { x.classList.remove('active'); });
            p.classList.add('active');
        });
    });
    Design._wireOnce('_copyWired', function () {
        document.addEventListener('click', function (e) {
            var c = e.target.closest('[data-copy]');
            if (!c) return;
            Design.toast('Copied (design mode)', 'success');
        });
    });
})();
