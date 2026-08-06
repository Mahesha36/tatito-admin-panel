'use strict';
/* TATITO FASHIONS — Categories page (multi-level hierarchical tree, recursive) */

App._expandedCats = {};

App.pages.categories = function() {
    var tree = MockData.categoryTree || [];

    function countProducts(catId) {
        return MockData.products.filter(function(p) {
            return p.mainCategoryId === catId || p.subCategoryId === catId || p.subSubCategoryId === catId;
        }).length;
    }

    function countAllInSubTree(cat) {
        var count = countProducts(cat.id);
        if (cat.subCategories) {
            cat.subCategories.forEach(function(sc) { count += countAllInSubTree(sc); });
        }
        return count;
    }

    /* Recursive tree node renderer — supports unlimited depth */
    function renderNode(node, level) {
        var isExpanded = App._expandedCats[node.id] !== false; // default expanded
        var children = node.subCategories || [];
        var hasChildren = children.length > 0;
        var prodCount = countAllInSubTree(node);

        var levelClass = 'cat-level-' + Math.min(level, 4);
        var indent = level === 1 ? '' : 'padding-left:' + ((level - 1) * 20) + 'px;';

        // Build child HTML
        var childrenHtml = '';
        if (hasChildren && isExpanded) {
            childrenHtml = '<div class="cat-tree-children">' +
                children.map(function(child) { return renderNode(child, level + 1); }).join('') +
                '</div>';
        }

        // Determine parent path for edit/delete operations
        var parentPath = findParentPath(tree, node.id, []);

        var nodeHtml = '<div class="cat-tree-item ' + levelClass + (isExpanded ? '' : ' collapsed') + '" style="' + indent + '">' +
            '<div class="cat-tree-node' + (level === 1 ? ' cat-main-node' : '') + '"' +
            (hasChildren ? ' onclick="App.toggleCatNode(\'' + node.id + '\')"' : '') + '>' +
            (hasChildren
                ? '<i class="bi bi-chevron-' + (isExpanded ? 'down' : 'right') + ' cat-chevron"></i>'
                : '<span style="width:16px;display:inline-block"></span>') +
            (level === 1
                ? '<i class="bi ' + (node.icon || 'bi-folder') + ' cat-icon-main"></i>'
                : (hasChildren
                    ? '<i class="bi bi-folder' + (isExpanded ? '-open' : '') + ' cat-icon-sm"></i>'
                    : '<i class="bi bi-dot"></i>')) +
            '<span class="cat-name' + (level === 1 ? ' cat-name-main' : '') + '">' + Helpers.escapeHtml(node.name) + '</span>' +
            '<span class="cat-badge">' + (hasChildren ? children.length + ' sub-categories · ' : '') + prodCount + ' products</span>' +
            '<div class="cat-actions">' +
            '<button class="btn btn-sm btn-outline" onclick="event.stopPropagation();App.addChildCategory(\'' + node.id + '\',' + level + ')" title="Add child"><i class="bi bi-plus"></i></button>' +
            '<button class="action-btn edit" onclick="event.stopPropagation();App.editCategoryItemAny(\'' + node.id + '\')" title="Edit"><i class="bi bi-pencil"></i></button>' +
            '<button class="action-btn delete" onclick="event.stopPropagation();App.deleteCategoryItemAny(\'' + node.id + '\')" title="Delete"><i class="bi bi-trash"></i></button>' +
            '</div></div>' +
            childrenHtml +
            '</div>';

        return nodeHtml;
    }

    // Find the path to a node by id — returns array of ancestor ids
    function findParentPath(nodes, targetId, path) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].id === targetId) return path.slice();
            if (nodes[i].subCategories) {
                var result = findParentPath(nodes[i].subCategories, targetId, path.concat(nodes[i].id));
                if (result) return result;
            }
        }
        return null;
    }

    // Store findParentPath for use by edit/delete functions
    App._findCategoryNode = function(id) {
        function search(nodes) {
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].id === id) return nodes[i];
                if (nodes[i].subCategories) {
                    var found = search(nodes[i].subCategories);
                    if (found) return found;
                }
            }
            return null;
        }
        return search(MockData.categoryTree);
    };

    App._findCategoryParent = function(id) {
        function search(nodes, parent) {
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].id === id) return parent;
                if (nodes[i].subCategories) {
                    var found = search(nodes[i].subCategories, nodes[i]);
                    if (found !== undefined) return found;
                }
            }
            return undefined;
        }
        var result = search(MockData.categoryTree, null);
        return result === undefined ? null : result;
    };

    var treeHtml = tree.map(function(mainCat) { return renderNode(mainCat, 1); }).join('');

    // Chart data
    var catLabels = tree.map(function(c) { return c.name; });
    var catData = tree.map(function(c) { return countAllInSubTree(c); });
    var totalCats = tree.length;

    // Count all sub-categories recursively (levels 2+)
    function countAllSubs(nodes, level) {
        var count = 0;
        nodes.forEach(function(n) {
            if (n.subCategories && n.subCategories.length) {
                if (level === 2) count += n.subCategories.length;
                count += countAllSubs(n.subCategories, level + 1);
            }
        });
        return count;
    }
    var totalSubs = 0, totalSubSubs = 0;
    tree.forEach(function(c) {
        if (c.subCategories) {
            totalSubs += c.subCategories.length;
            c.subCategories.forEach(function(sc) {
                if (sc.subCategories) totalSubSubs += sc.subCategories.length;
            });
        }
    });

    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Categories</h3><p class="text-muted">Manage product categories (multi-level hierarchy)</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-primary" onclick="App.addMainCategory()"><i class="bi bi-plus-lg"></i> Add Main Category</button></div></div>' +
        '<div class="stat-grid">' +
        '<div class="stat-card"><div class="stat-icon gold"><i class="bi bi-folder"></i></div><div class="stat-info"><p>Main Categories</p><h3>' + totalCats + '</h3></div></div>' +
        '<div class="stat-card"><div class="stat-icon blue"><i class="bi bi-folder2-open"></i></div><div class="stat-info"><p>Sub Categories</p><h3>' + totalSubs + '</h3></div></div>' +
        '<div class="stat-card"><div class="stat-icon green"><i class="bi bi-diagram-3"></i></div><div class="stat-info"><p>Sub-Sub Categories</p><h3>' + totalSubSubs + '</h3></div></div>' +
        '<div class="stat-card"><div class="stat-icon purple"><i class="bi bi-bag"></i></div><div class="stat-info"><p>Total Products</p><h3>' + MockData.products.length + '</h3></div></div>' +
        '</div>' +
        '<div class="main-row" style="grid-template-columns:1.6fr 1fr">' +
        '<div class="card"><div class="card-header"><h4 class="card-title">Category Tree</h4>' +
        '<div style="display:flex;gap:8px"><button class="btn btn-sm btn-outline" onclick="App.expandAllCats()">Expand All</button>' +
        '<button class="btn btn-sm btn-outline" onclick="App.collapseAllCats()">Collapse All</button></div></div>' +
        '<div class="card-body" style="max-height:600px;overflow-y:auto"><div class="cat-tree">' + treeHtml + '</div></div></div>' +
        '<div class="card"><div class="card-header"><h4 class="card-title">Distribution</h4></div><div class="card-body">' +
        '<div class="chart-container-sm"><canvas id="catChart"></canvas></div>' +
        '</div></div>' +
        '</div></div>';

    // Render chart
    var ctx = document.getElementById('catChart');
    if (ctx) {
        var existing = Chart.getChart(ctx);
        if (existing) existing.destroy();
        new Chart(ctx, {
            type: 'doughnut',
            data: { labels: catLabels, datasets: [{ data: catData, backgroundColor: ['#C9A24B','#3B6CB7','#2D9A6C','#7C5FCF','#C0463A','#E8923C'] }] },
            options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, color: '#4B4540' } } } }
        });
    }
};

/* ===== Expand/collapse all nodes recursively ===== */
App.toggleCatNode = function(catId) {
    App._expandedCats[catId] = App._expandedCats[catId] === false ? true : false;
    App.navigate('categories');
};

function _walkAllCats(val) {
    var tree = MockData.categoryTree || [];
    tree.forEach(function(c) {
        App._expandedCats[c.id] = val;
        (c.subCategories || []).forEach(function(sc) {
            App._expandedCats[sc.id] = val;
            (sc.subCategories || []).forEach(function(ssc) {
                App._expandedCats[ssc.id] = val;
                (ssc.subCategories || []).forEach(function(sssc) { App._expandedCats[sssc.id] = val; });
            });
        });
    });
}

App.expandAllCats = function() { _walkAllCats(true); App.navigate('categories'); };
App.collapseAllCats = function() { _walkAllCats(false); App.navigate('categories'); };

/* ===== Add child category (works at any level) ===== */
App.addChildCategory = function(parentId, parentLevel) {
    Helpers.openModal(
        '<div class="modal-header"><h3 class="modal-title">Add Sub-Category</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="addChildCatForm">' +
        '<div class="form-group"><label>Category Name <span style="color:#C0463A">*</span></label><input type="text" class="form-control" name="name" required></div>' +
        '</form></div>' +
        '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button>' +
        '<button class="btn btn-primary" onclick="App.saveChildCategory(\'' + parentId + '\')"><i class="bi bi-check-lg"></i> Save</button></div>'
    );
};
App.saveChildCategory = function(parentId) {
    var form = document.getElementById('addChildCatForm');
    var name = (new FormData(form).get('name') || '').toString().trim();
    if (!name) { Helpers.toast('Name is required', 'error'); return; }
    var parent = App._findCategoryNode(parentId);
    if (!parent) return;
    if (!parent.subCategories) parent.subCategories = [];
    var num = parent.subCategories.length + 1;
    parent.subCategories.push({ id: parentId + '-' + String(num).padStart(2, '0'), name: name });
    App._expandedCats[parentId] = true;
    Helpers.closeModal();
    Helpers.toast('Category added', 'success');
    App.navigate('categories');
};

/* ===== Add Main Category ===== */
App.addMainCategory = function() {
    Helpers.openModal(
        '<div class="modal-header"><h3 class="modal-title">Add Main Category</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="addCatForm">' +
        '<div class="form-group"><label>Category Name <span style="color:#C0463A">*</span></label><input type="text" class="form-control" name="name" required placeholder="e.g. Home Decor"></div>' +
        '<div class="form-group"><label>Icon (Bootstrap Icon class)</label><input type="text" class="form-control" name="icon" value="bi-folder" placeholder="e.g. bi-house"></div>' +
        '</form></div>' +
        '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button>' +
        '<button class="btn btn-primary" onclick="App.saveMainCategory()"><i class="bi bi-check-lg"></i> Save</button></div>'
    );
};
App.saveMainCategory = function() {
    var form = document.getElementById('addCatForm');
    var data = new FormData(form);
    var name = (data.get('name') || '').toString().trim();
    if (!name) { Helpers.toast('Category name is required', 'error'); return; }
    var newId = 'CAT' + String(MockData.categoryTree.length + 1).padStart(3, '0');
    MockData.categoryTree.push({ id: newId, name: name, icon: data.get('icon') || 'bi-folder', subCategories: [] });
    Helpers.closeModal();
    Helpers.toast('Main category added', 'success');
    App.navigate('categories');
};

/* ===== Legacy sub/subsub add aliases (for backward compatibility) ===== */
App.addSubCategory = function(mainCatId) { App.addChildCategory(mainCatId, 1); };
App.addSubSubCategory = function(subCatId, mainCatId) { App.addChildCategory(subCatId, 2); };

/* ===== Edit category item at any level ===== */
App.editCategoryItemAny = function(catId) {
    var item = App._findCategoryNode(catId);
    if (!item) return;
    var isMain = MockData.categoryTree.some(function(c) { return c.id === catId; });

    Helpers.openModal(
        '<div class="modal-header"><h3 class="modal-title">Edit Category</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="editCatForm">' +
        '<div class="form-group"><label>Category Name</label><input type="text" class="form-control" name="name" value="' + Helpers.escapeHtml(item.name) + '" required></div>' +
        (isMain ? '<div class="form-group"><label>Icon</label><input type="text" class="form-control" name="icon" value="' + (item.icon || 'bi-folder') + '"></div>' : '') +
        '</form></div>' +
        '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button>' +
        '<button class="btn btn-primary" onclick="App.saveEditCategoryItemAny(\'' + catId + '\')"><i class="bi bi-check-lg"></i> Save</button></div>'
    );
};
App.saveEditCategoryItemAny = function(catId) {
    var form = document.getElementById('editCatForm');
    var data = new FormData(form);
    var name = (data.get('name') || '').toString().trim();
    if (!name) return;
    var item = App._findCategoryNode(catId);
    if (item) {
        item.name = name;
        if (data.get('icon')) item.icon = data.get('icon');
    }
    Helpers.closeModal();
    Helpers.toast('Category updated', 'success');
    App.navigate('categories');
};

/* ===== Legacy edit alias ===== */
App.editCategoryItem = function(level, catId, parentId, grandParentId) { App.editCategoryItemAny(catId); };

/* ===== Delete category item at any level ===== */
App.deleteCategoryItemAny = function(catId) {
    var item = App._findCategoryNode(catId);
    if (!item) return;
    var childCount = (item.subCategories || []).length;
    var msg = childCount > 0
        ? 'Delete "' + item.name + '"? All ' + childCount + ' sub-categories within it will also be removed.'
        : 'Delete "' + item.name + '"?';

    Helpers.confirm(msg, 'This action cannot be undone.', 'warning').then(function(r) {
        if (r.isConfirmed) {
            var parent = App._findCategoryParent(catId);
            if (parent) {
                parent.subCategories = parent.subCategories.filter(function(s) { return s.id !== catId; });
            } else {
                // Top-level
                MockData.categoryTree = MockData.categoryTree.filter(function(c) { return c.id !== catId; });
            }
            Helpers.toast('Category deleted', 'success');
            App.navigate('categories');
        }
    });
};

/* ===== Legacy delete alias ===== */
App.deleteCategoryItem = function(level, catId, parentId) { App.deleteCategoryItemAny(catId); };
