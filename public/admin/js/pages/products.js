'use strict';
/* TATITO FASHIONS — Products page (with image upload) */

App._productImages = {};

App.pages.products = function() {
    var products = MockData.products;

    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Products</h3><p class="text-muted">All marketplace products</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-primary" onclick="App.addProduct()"><i class="bi bi-plus-lg"></i> Add Product</button></div></div>' +
        '<div class="stat-grid">' +
        '<div class="stat-card"><div class="stat-icon gold"><i class="bi bi-bag"></i></div><div class="stat-info"><p>Total Products</p><h3>' + products.length + '</h3></div></div>' +
        '<div class="stat-card"><div class="stat-icon green"><i class="bi bi-box-seam"></i></div><div class="stat-info"><p>In Stock</p><h3>' + products.filter(function(p){return (p.stock||0)>0;}).length + '</h3></div></div>' +
        '<div class="stat-card"><div class="stat-icon blue"><i class="bi bi-currency-rupee"></i></div><div class="stat-info"><p>Avg Price</p><h3>' + (products.length > 0 ? Helpers.formatCurrency(Math.round(products.reduce(function(s,p){return s+(p.price||0);},0)/products.length)) : '₹0') + '</h3></div></div>' +
        '<div class="stat-card"><div class="stat-icon purple"><i class="bi bi-star"></i></div><div class="stat-info"><p>Total Reviews</p><h3>' + products.reduce(function(s,p){return s+(p.reviews||0);},0) + '</h3></div></div>' +
        '</div>' +
        '<div class="card"><div class="card-header"><h4 class="card-title">All Products</h4></div>' +
        '<div class="table-wrap"><table class="admin-table" id="productsTable">' +
        '<thead><tr><th>ID</th><th>Image</th><th>Product Name</th><th>Category</th><th>Price</th><th>Seller</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>' +
        '<tbody>' + products.map(function(p) {
            var img = App._productImages[p.id] || p.image || '';
            return '<tr>' +
                '<td class="cell-strong">' + p.id + '</td>' +
                '<td>' + (img
                    ? '<img src="' + img + '" style="width:40px;height:40px;border-radius:8px;object-fit:cover">'
                    : '<div class="avatar" style="width:40px;height:40px;background:' + Helpers.avatarColor(p.name) + '">' + Helpers.initials(p.name) + '</div>') + '</td>' +
                '<td><strong>' + Helpers.escapeHtml(p.name) + '</strong></td>' +
                '<td>' + Helpers.escapeHtml(p.category || '—') + '</td>' +
                '<td>' + Helpers.formatCurrency(p.price) + '</td>' +
                '<td>' + Helpers.escapeHtml(p.seller || '—') + '</td>' +
                '<td>' + (p.stock || 0) + '</td>' +
                '<td><span class="badge ' + (p.status === 'active' || p.status === 'published' ? 'badge-success' : 'badge-warning') + '">' + Helpers.capitalize(p.status || 'active') + '</span></td>' +
                '<td><div class="table-actions">' +
                '<button class="action-btn view" onclick="App.viewProduct(\'' + p.id + '\')" title="View"><i class="bi bi-eye"></i></button>' +
                '<button class="action-btn edit" onclick="App.editProduct(\'' + p.id + '\')" title="Edit"><i class="bi bi-pencil"></i></button>' +
                '<button class="action-btn delete" onclick="App.deleteProduct(\'' + p.id + '\')" title="Delete"><i class="bi bi-trash"></i></button>' +
                '</div></td></tr>';
        }).join('') + '</tbody></table></div></div></div>';

    var tbl = document.getElementById('productsTable');
    if (tbl && typeof $ !== 'undefined') $(tbl).DataTable({ pageLength: 10, retrieve: true });
};

/* ===== Product Image Upload helper ===== */
App.handleProductImage = function(input, previewId) {
    var preview = document.getElementById(previewId);
    if (!preview) return;
    var key = input.getAttribute('data-key') || '_new';
    preview.innerHTML = '';
    var files = input.files;
    if (!files || files.length === 0) return;

    var allImages = [];
    for (var i = 0; i < files.length; i++) {
        (function(file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                allImages.push(e.target.result);
                App._productImages[key] = allImages;
                preview.innerHTML = allImages.map(function(src, idx) {
                    return '<div class="product-img-preview-item">' +
                        '<img src="' + src + '">' +
                        '<button type="button" class="img-remove-btn" onclick="App.removeProductImage(\'' + key + '\',' + idx + ',\'' + previewId + '\')">&times;</button>' +
                        '</div>';
                }).join('');
            };
            reader.readAsDataURL(file);
        })(files[i]);
    }
};

App.removeProductImage = function(key, idx, previewId) {
    if (!App._productImages[key]) return;
    App._productImages[key].splice(idx, 1);
    if (App._productImages[key].length === 0) delete App._productImages[key];
    var preview = document.getElementById(previewId);
    if (preview && App._productImages[key]) {
        preview.innerHTML = App._productImages[key].map(function(src, i) {
            return '<div class="product-img-preview-item"><img src="' + src + '"><button type="button" class="img-remove-btn" onclick="App.removeProductImage(\'' + key + '\',' + i + ',\'' + previewId + '\')">&times;</button></div>';
        }).join('');
    } else if (preview) {
        preview.innerHTML = '';
    }
};

/* ===== View Product ===== */
App.viewProduct = function(id) {
    var p = MockData.products.find(function(x) { return x.id == id; });
    if (!p) return;
    var imgs = App._productImages[p.id] || (p.image ? [p.image] : []);
    var galleryHtml = imgs.length > 0
        ? '<div style="display:flex;gap:8px;flex-wrap:wrap">' + imgs.map(function(src) { return '<img src="' + src + '" style="width:100px;height:100px;border-radius:10px;object-fit:cover;border:1px solid var(--line)">'; }).join('') + '</div>'
        : '<div class="avatar" style="width:80px;height:80px;font-size:2rem;background:' + Helpers.avatarColor(p.name) + '">' + Helpers.initials(p.name) + '</div>';

    Helpers.openModal(
        '<div class="modal-header"><h3 class="modal-title">Product Details</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body">' +
        galleryHtml +
        '<div style="margin-top:1rem">' +
        '<h4 style="font-family:var(--font-heading);color:var(--black)">' + Helpers.escapeHtml(p.name) + '</h4>' +
        '<p class="text-muted">' + Helpers.escapeHtml(p.category || '') + '</p></div>' +
        '<div class="detail-section" style="margin-top:16px">' +
        '<div class="detail-row"><span class="label">Price</span><span class="value">' + Helpers.formatCurrency(p.price) + '</span></div>' +
        '<div class="detail-row"><span class="label">MRP</span><span class="value">' + (p.mrp ? Helpers.formatCurrency(p.mrp) : '—') + '</span></div>' +
        '<div class="detail-row"><span class="label">Seller</span><span class="value">' + Helpers.escapeHtml(p.seller || '—') + '</span></div>' +
        '<div class="detail-row"><span class="label">Stock</span><span class="value">' + (p.stock || 0) + '</span></div>' +
        '<div class="detail-row"><span class="label">Rating</span><span class="value">' + (p.rating || 0) + ' / 5 (' + (p.reviews || 0) + ' reviews)</span></div>' +
        '<div class="detail-row"><span class="label">Variants</span><span class="value">' + (p.variants ? p.variants.join(', ') : 'None') + '</span></div>' +
        '<div class="detail-row"><span class="label">Status</span><span class="value"><span class="badge ' + (p.status === 'active' || p.status === 'published' ? 'badge-success' : 'badge-warning') + '">' + Helpers.capitalize(p.status || 'active') + '</span></span></div>' +
        '</div></div>' +
        '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Close</button>' +
        '<button class="btn btn-primary" onclick="Helpers.closeModal();App.editProduct(\'' + p.id + '\')"><i class="bi bi-pencil"></i> Edit</button></div>',
        'modal-lg'
    );
};

/* ===== Add Product (with image upload + category dropdown) ===== */
App.addProduct = function() {
    // Build cascading category options from tree
    var tree = MockData.categoryTree || [];
    var catOptions = '<option value="">— Select Main Category —</option>' +
        tree.map(function(c) { return '<option value="' + c.id + '" data-name="' + c.name + '">' + c.name + '</option>'; }).join('');

    var sellerOptions = MockData.sellers.map(function(s) { return '<option value="' + s.businessName + '">' + s.businessName + '</option>'; }).join('');

    Helpers.openModal(
        '<div class="modal-header"><h3 class="modal-title">Add Product</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="addProductForm">' +

        '<div class="form-group"><label>Product Images</label>' +
        '<div class="img-upload-zone" onclick="document.getElementById(\'newProductImgInput\').click()">' +
        '<i class="bi bi-cloud-upload"></i><p>Click to upload product images</p><p style="font-size:0.75rem;color:var(--gray-400)">JPG, PNG, WEBP · Max 5MB each</p>' +
        '<input type="file" id="newProductImgInput" accept="image/*" multiple style="display:none" data-key="_new" onchange="App.handleProductImage(this,\'newProductImgPreview\')">' +
        '</div>' +
        '<div class="product-img-preview" id="newProductImgPreview"></div></div>' +

        '<div class="form-group"><label>Product Name <span style="color:#C0463A">*</span></label><input type="text" class="form-control" name="name" required></div>' +

        '<div class="form-row">' +
        '<div class="form-group"><label>Main Category</label><select class="form-control" name="mainCat" id="newMainCat" onchange="App.loadSubCategories(this,\'newSubCat\')">' + catOptions + '</select></div>' +
        '<div class="form-group"><label>Sub Category</label><select class="form-control" name="subCat" id="newSubCat" onchange="App.loadSubSubCategories(this,\'newSubSubCat\')" disabled><option value="">Select sub-category</option></select></div>' +
        '</div>' +
        '<div class="form-group"><label>Sub-Sub Category</label><select class="form-control" name="subSubCat" id="newSubSubCat" disabled><option value="">Select sub-sub-category</option></select></div>' +

        '<div class="form-row">' +
        '<div class="form-group"><label>Price (₹) <span style="color:#C0463A">*</span></label><input type="number" class="form-control" name="price" required></div>' +
        '<div class="form-group"><label>MRP (₹)</label><input type="number" class="form-control" name="mrp"></div>' +
        '</div>' +
        '<div class="form-row">' +
        '<div class="form-group"><label>Stock</label><input type="number" class="form-control" name="stock" value="0"></div>' +
        '<div class="form-group"><label>Seller</label><select class="form-control" name="seller">' + sellerOptions + '</select></div>' +
        '</div>' +
        '<div class="form-group"><label>Variants (comma separated)</label><input type="text" class="form-control" name="variants" placeholder="e.g. Red, Blue, Green"></div>' +
        '<div class="form-group"><label>Description</label><textarea class="form-control" rows="3" name="description" placeholder="Product description..."></textarea></div>' +

        '</form></div>' +
        '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button>' +
        '<button class="btn btn-primary" onclick="App.saveProduct()"><i class="bi bi-check-lg"></i> Save Product</button></div>',
        'modal-xl'
    );
};

/* Cascading category loaders */
App.loadSubCategories = function(mainSelect, subSelectId) {
    var mainId = mainSelect.value;
    var subSelect = document.getElementById(subSelectId);
    if (!subSelect) return;
    subSelect.innerHTML = '<option value="">Select sub-category</option>';
    if (!mainId) { subSelect.disabled = true; return; }
    var mainCat = (MockData.categoryTree || []).find(function(c) { return c.id === mainId; });
    if (!mainCat || !mainCat.subCategories) { subSelect.disabled = true; return; }
    mainCat.subCategories.forEach(function(sc) {
        var opt = document.createElement('option');
        opt.value = sc.id; opt.setAttribute('data-name', sc.name); opt.textContent = sc.name;
        subSelect.appendChild(opt);
    });
    subSelect.disabled = false;
    var subSub = document.getElementById(subSelectId.replace('SubCat','SubSubCat'));
    if (subSub) { subSub.innerHTML = '<option value="">Select sub-sub-category</option>'; subSub.disabled = true; }
};

App.loadSubSubCategories = function(subSelect, subSubSelectId) {
    var subId = subSelect.value;
    var subSubSelect = document.getElementById(subSubSelectId);
    if (!subSubSelect) return;
    subSubSelect.innerHTML = '<option value="">Select sub-sub-category</option>';
    if (!subId) { subSubSelect.disabled = true; return; }
    var mainId = document.getElementById('newMainCat') ? document.getElementById('newMainCat').value : '';
    var mainCat = (MockData.categoryTree || []).find(function(c) { return c.id === mainId; });
    if (!mainCat) { subSubSelect.disabled = true; return; }
    var subCat = mainCat.subCategories.find(function(s) { return s.id === subId; });
    if (!subCat || !subCat.subCategories) { subSubSelect.disabled = true; return; }
    subCat.subCategories.forEach(function(ssc) {
        var opt = document.createElement('option');
        opt.value = ssc.id; opt.setAttribute('data-name', ssc.name); opt.textContent = ssc.name;
        subSubSelect.appendChild(opt);
    });
    subSubSelect.disabled = false;
};

/* ===== Save Product ===== */
App.saveProduct = function() {
    var form = document.getElementById('addProductForm');
    var data = new FormData(form);
    var name = (data.get('name') || '').toString().trim();
    if (!name) { Helpers.toast('Product name is required', 'error'); return; }

    // Build category string from cascading selects
    var mainSel = document.getElementById('newMainCat');
    var subSel = document.getElementById('newSubCat');
    var subSubSel = document.getElementById('newSubSubCat');
    var catParts = [];
    if (mainSel && mainSel.value) catParts.push(mainSel.options[mainSel.selectedIndex].getAttribute('data-name'));
    if (subSel && subSel.value) catParts.push(subSel.options[subSel.selectedIndex].getAttribute('data-name'));
    if (subSubSel && subSubSel.value) catParts.push(subSubSel.options[subSubSel.selectedIndex].getAttribute('data-name'));
    var categoryStr = catParts.join(' — ') || 'Uncategorized';

    var newId = 'PRD' + String(MockData.products.length + 1).padStart(3, '0');
    var imgs = App._productImages['_new'] || [];
    var newProduct = {
        id: newId,
        name: name,
        category: categoryStr,
        mainCategoryId: mainSel ? mainSel.value : '',
        subCategoryId: subSel ? subSel.value : '',
        subSubCategoryId: subSubSel ? subSubSel.value : '',
        price: parseFloat(data.get('price')) || 0,
        mrp: parseFloat(data.get('mrp')) || 0,
        stock: parseInt(data.get('stock')) || 0,
        seller: data.get('seller') || '',
        status: 'published',
        rating: 0,
        reviews: 0,
        image: imgs.length > 0 ? imgs[0] : '',
        images: imgs,
        variants: (data.get('variants') || '').split(',').map(function(v) { return v.trim(); }).filter(Boolean),
        description: data.get('description') || '',
        createdAt: new Date().toISOString().split('T')[0],
    };
    if (imgs.length > 0) App._productImages[newId] = imgs;
    delete App._productImages['_new'];

    MockData.products.push(newProduct);
    Helpers.closeModal();
    Helpers.toast('Product added successfully', 'success');
    App.navigate('products');
};

/* ===== Edit Product (with image upload) ===== */
App.editProduct = function(id) {
    var p = MockData.products.find(function(x) { return x.id == id; });
    if (!p) return;

    // Pre-populate images from existing
    var existingImgs = App._productImages[p.id] || (p.image ? [p.image] : []);

    // Build cascading category options
    var tree = MockData.categoryTree || [];
    var mainCatName = (p.category || '').split(' — ')[0] || '';

    Helpers.openModal(
        '<div class="modal-header"><h3 class="modal-title">Edit Product</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="editProductForm">' +

        '<div class="form-group"><label>Product Images</label>' +
        '<div class="img-upload-zone" onclick="document.getElementById(\'editProductImgInput\').click()">' +
        '<i class="bi bi-cloud-upload"></i><p>Click to upload or change images</p>' +
        '<input type="file" id="editProductImgInput" accept="image/*" multiple style="display:none" data-key="' + p.id + '" onchange="App.handleProductImage(this,\'editProductImgPreview\')">' +
        '</div>' +
        '<div class="product-img-preview" id="editProductImgPreview">' +
        existingImgs.map(function(src, i) {
            return '<div class="product-img-preview-item"><img src="' + src + '"><button type="button" class="img-remove-btn" onclick="App.removeProductImage(\'' + p.id + '\',' + i + ',\'editProductImgPreview\')">&times;</button></div>';
        }).join('') + '</div></div>' +

        '<div class="form-group"><label>Product Name</label><input type="text" class="form-control" name="name" value="' + Helpers.escapeHtml(p.name) + '" required></div>' +
        '<div class="form-group"><label>Category</label><input type="text" class="form-control" name="category" value="' + Helpers.escapeHtml(p.category || '') + '"></div>' +

        '<div class="form-row">' +
        '<div class="form-group"><label>Price (₹)</label><input type="number" class="form-control" name="price" value="' + (p.price || 0) + '"></div>' +
        '<div class="form-group"><label>MRP (₹)</label><input type="number" class="form-control" name="mrp" value="' + (p.mrp || 0) + '"></div>' +
        '</div>' +
        '<div class="form-row">' +
        '<div class="form-group"><label>Stock</label><input type="number" class="form-control" name="stock" value="' + (p.stock || 0) + '"></div>' +
        '<div class="form-group"><label>Seller</label><input type="text" class="form-control" name="seller" value="' + Helpers.escapeHtml(p.seller || '') + '"></div>' +
        '</div>' +
        '<div class="form-group"><label>Variants (comma separated)</label><input type="text" class="form-control" name="variants" value="' + (p.variants ? p.variants.join(', ') : '') + '"></div>' +
        '<div class="form-group"><label>Description</label><textarea class="form-control" rows="3" name="description">' + Helpers.escapeHtml(p.description || '') + '</textarea></div>' +

        '</form></div>' +
        '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button>' +
        '<button class="btn btn-primary" onclick="App.saveEditProduct(\'' + p.id + '\')"><i class="bi bi-check-lg"></i> Save Changes</button></div>',
        'modal-xl'
    );

    // Pre-load images into App._productImages if not already there
    if (!App._productImages[p.id] && existingImgs.length > 0) {
        App._productImages[p.id] = existingImgs.slice();
    }
};

App.saveEditProduct = function(id) {
    var p = MockData.products.find(function(x) { return x.id == id; });
    if (!p) return;
    var form = document.getElementById('editProductForm');
    var data = new FormData(form);
    p.name = data.get('name');
    p.category = data.get('category');
    p.price = parseFloat(data.get('price')) || 0;
    p.mrp = parseFloat(data.get('mrp')) || 0;
    p.stock = parseInt(data.get('stock')) || 0;
    p.seller = data.get('seller');
    p.variants = (data.get('variants') || '').split(',').map(function(v) { return v.trim(); }).filter(Boolean);
    p.description = data.get('description') || '';
    var imgs = App._productImages[p.id] || [];
    if (imgs.length > 0) { p.image = imgs[0]; p.images = imgs; }
    Helpers.closeModal();
    Helpers.toast('Product updated', 'success');
    App.navigate('products');
};

App.deleteProduct = function(id) {
    Helpers.confirm('Delete this product?', 'This action cannot be undone.', 'warning').then(function(r) {
        if (r.isConfirmed) {
            MockData.products = MockData.products.filter(function(p) { return p.id != id; });
            delete App._productImages[id];
            Helpers.toast('Product deleted', 'success');
            App.navigate('products');
        }
    });
};
