(function () {
    if (!window.Design) return;

    function parentInfo(modal) {
        var info = document.getElementById('addChildParentInfo');
        if (!info) {
            var f = modal.querySelector('#addChildCatForm');
            if (!f) return null;
            info = document.createElement('p');
            info.id = 'addChildParentInfo';
            info.className = 'text-muted';
            info.style.cssText = 'font-size:0.8rem;margin:-4px 0 12px';
            f.insertBefore(info, f.firstChild);
        }
        return info;
    }

    Design._wireOnce('_catActionsWired', function () {
        document.addEventListener('click', function (e) {
            var addBtn = e.target.closest('[title="Add child"]');
            if (addBtn) {
                e.stopPropagation();
                var n = addBtn.closest('.cat-tree-node');
                var label = n ? n.querySelector('.cat-name') : null;
                var parentName = label ? (label.textContent || '').trim() : '';
                var modal = document.getElementById('categories-add');
                if (modal) {
                    var info = parentInfo(modal);
                    if (info) info.textContent = parentName ? ('Adding under: ' + parentName) : '';
                    var nameInput = modal.querySelector('input[name="name"]');
                    if (nameInput) nameInput.value = '';
                }
                Design.openModal('categories-add');
                return;
            }
            var toolbarAdd = e.target.closest('[data-modal-open="categories-add"]');
            if (toolbarAdd) {
                e.stopPropagation();
                var tm = document.getElementById('categories-add');
                if (tm) {
                    var ti = parentInfo(tm);
                    if (ti) ti.textContent = '';
                    var tn = tm.querySelector('input[name="name"]');
                    if (tn) tn.value = '';
                }
                Design.openModal('categories-add');
                return;
            }
            var editBtn = e.target.closest('.cat-actions .action-btn.edit');
            if (editBtn) {
                e.stopPropagation();
                var en = editBtn.closest('.cat-tree-node');
                var ename = en ? ((en.querySelector('.cat-name') || {}).textContent || '').trim() : '';
                var isMain = editBtn.closest('.cat-tree-item').classList.contains('cat-level-1');
                var em = document.getElementById('categories-edit-node');
                if (em) {
                    var nf = em.querySelector('input[name="name"]');
                    if (nf) nf.value = ename;
                    var iconWrap = em.querySelector('.form-group.icon-group');
                    if (iconWrap) iconWrap.style.display = isMain ? '' : 'none';
                    if (isMain) {
                        var iconEl = en ? en.querySelector('.cat-icon-main') : null;
                        var m = iconEl ? (iconEl.className.match(/bi-[\w-]+/) || []) : [];
                        var ii = em.querySelector('input[name="icon"]');
                        if (ii) ii.value = m[0] || 'bi-folder';
                    }
                }
                Design.openModal('categories-edit-node');
            }
        }, true);
    });

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
