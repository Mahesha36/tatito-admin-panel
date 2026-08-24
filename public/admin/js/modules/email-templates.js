(function () {
    if (!window.Design) return;
    Design._wireOnce('_listWired', function () {
        document.addEventListener('click', function (e) {
            var li = e.target.closest('[data-list-item]');
            if (li) {
                Design.toast('Template editor opens when backend is connected', 'info');
                return;
            }
        });
    });
})();
