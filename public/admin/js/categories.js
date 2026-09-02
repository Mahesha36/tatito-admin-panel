(function () {
    if (!window.Design) return;
    Design._wireOnce('_treeWired', function () {
        document.addEventListener('click', function (e) {
            var ex = e.target.closest('[data-tree-expand]');
            var co = e.target.closest('[data-tree-collapse]');
            if (ex || co) {
                var expanding = !!ex;
                document.querySelectorAll('.cat-tree-item').forEach(function (it) {
                    it.classList.toggle('collapsed', !expanding);
                });
                return;
            }
            var node = e.target.closest('.cat-tree-node');
            if (!node) return;
            if (e.target.closest('.cat-actions')) return;
            if (!node.querySelector(':scope > .cat-chevron')) return;
            var item = node.closest('.cat-tree-item');
            if (item) item.classList.toggle('collapsed');
        });
    });
})();
