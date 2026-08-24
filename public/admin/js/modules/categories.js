(function () {
    if (!window.Design) return;
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
})();
