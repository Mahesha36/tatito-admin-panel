'use strict';
/* MODULE 3: Jewellery Vault — Products */

App.pages['jewellery-products'] = function() {
    var data = MockData.jewelleryProducts;
    var cats = MockData.jewelleryCategories.filter(function(c){return c.is_active;}).map(function(c){return c.name;});
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Jewellery Products</h3><p class="text-muted">Luxury jewellery with purity tags & certifications</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-primary" onclick="App.addJewelProduct()"><i class="bi bi-plus-lg"></i> Add Product</button></div></div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="jpTable"><thead><tr><th>ID</th><th>Image</th><th>Name</th><th>Gender</th><th>Category</th><th>Price</th><th>Purity Tag</th><th>Badge</th><th>Rating</th><th>Actions</th></tr></thead><tbody>' +
        data.map(function(p) {
            return '<tr><td>'+p.id+'</td><td><img src="'+p.image+'" style="width:40px;height:40px;object-fit:cover;border-radius:4px"></td>' +
                '<td><strong>'+Helpers.escapeHtml(p.name)+'</strong></td>' +
                '<td><span class="badge badge-info">'+p.gender+'</span></td>' +
                '<td>'+Helpers.escapeHtml(p.category)+'</td>' +
                '<td>'+Helpers.formatCurrency(p.price)+(p.original_price?'<br><small class="text-muted"><del>'+Helpers.formatCurrency(p.original_price)+'</del></small>':'')+'</td>' +
                '<td><small style="color:var(--gold-deep);font-weight:600">'+Helpers.escapeHtml(p.purity_tag)+'</small></td>' +
                '<td>'+(p.badge_tag?'<span class="badge badge-gold">'+Helpers.escapeHtml(p.badge_tag)+'</span>':'<span class="text-muted">\u2014</span>')+'</td>' +
                '<td>'+Helpers.stars(p.rating)+' <small>'+p.rating+'</small></td>' +
                '<td><div class="table-actions"><button class="action-btn view" onclick="App.viewJewelProduct(\''+p.id+'\')"><i class="bi bi-eye"></i></button>' +
                '<button class="action-btn edit" onclick="App.editJewelProduct(\''+p.id+'\')"><i class="bi bi-pencil"></i></button>' +
                '<button class="action-btn delete" onclick="App.deleteJewelProduct(\''+p.id+'\')"><i class="bi bi-trash"></i></button></div></td></tr>';
        }).join('') + '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') $('#jpTable').DataTable({ pageLength: 10 });
};

function _jpForm(p) {
    p=p||{};
    var cats = MockData.jewelleryCategories.map(function(c){return c.name;});
    return '<div class="modal-header"><h3 class="modal-title">'+(p.id?'Edit':'Add')+' Jewellery Product</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="jpForm">' +
        '<div class="form-group"><label>Name *</label><input type="text" class="form-control" name="name" value="'+Helpers.escapeHtml(p.name||'')+'" required></div>' +
        '<div class="form-row"><div class="form-group"><label>Gender</label><select class="form-control" name="gender"><option '+(p.gender==='Men'?'selected':'')+'>Men</option><option '+(p.gender==='Women'?'selected':'')+'>Women</option><option '+(p.gender==='Unisex'?'selected':'')+'>Unisex</option></select></div>' +
        '<div class="form-group"><label>Category</label><select class="form-control" name="category">'+cats.map(function(c){return '<option '+(p.category===c?'selected':'')+'>'+c+'</option>';}).join('')+'</select></div></div>' +
        '<div class="form-row"><div class="form-group"><label>Price (₹) *</label><input type="number" class="form-control" name="price" value="'+(p.price||0)+'" required></div>' +
        '<div class="form-group"><label>Original Price (₹)</label><input type="number" class="form-control" name="original_price" value="'+(p.original_price||0)+'"></div></div>' +
        '<div class="form-group"><label>Purity Tag</label><input type="text" class="form-control" name="purity_tag" value="'+Helpers.escapeHtml(p.purity_tag||'')+'" placeholder="22K BIS Gold · Uncut Diamonds"></div>' +
        '<div class="form-group"><label>Badge Tag</label><input type="text" class="form-control" name="badge_tag" value="'+Helpers.escapeHtml(p.badge_tag||'')+'" placeholder="ROYAL HERITAGE, IGI CERTIFIED"></div>' +
        '<div class="form-group"><label>Image</label><div class="upload-zone" onclick="this.querySelector(\'input\').click()"><i class="bi bi-cloud-arrow-up"></i><p>Upload product image</p><input type="file" accept="image/*" hidden></div></div>' +
        '</form></div><div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveJewelProduct(\''+(p.id||'')+'\')">Save</button></div>';
}
App.addJewelProduct=function(){Helpers.openModal(_jpForm());};
App.editJewelProduct=function(id){var p=MockData.jewelleryProducts.find(function(x){return x.id===id;});if(!p)return;Helpers.openModal(_jpForm(p));};
App.saveJewelProduct=function(id){var f=document.getElementById('jpForm');var fd=new FormData(f);if(!fd.get('name')){Helpers.toast('Name required','error');return;}var entry={gender:fd.get('gender'),category:fd.get('category'),name:fd.get('name'),price:parseInt(fd.get('price'))||0,original_price:parseInt(fd.get('original_price'))||0,purity_tag:fd.get('purity_tag')||'',badge_tag:fd.get('badge_tag')||'',rating:id?(MockData.jewelleryProducts.find(function(x){return x.id===id;}).rating):0,image:'assets/logo.svg'};if(id){Object.assign(MockData.jewelleryProducts.find(function(x){return x.id===id;}),entry);}else{entry.id='JP'+String(MockData.jewelleryProducts.length+1).padStart(3,'0');MockData.jewelleryProducts.push(entry);}Helpers.closeModal();Helpers.toast('Saved','success');App.navigate('jewellery-products');};
App.viewJewelProduct=function(id){var p=MockData.jewelleryProducts.find(function(x){return x.id===id;});if(!p)return;Helpers.openModal('<div class="modal-header"><h3 class="modal-title">Product Details</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div><div class="modal-body"><div style="text-align:center;margin-bottom:16px"><img src="'+p.image+'" style="width:100px;height:100px;border-radius:8px"></div><table class="table table-borderless"><tr><td class="text-muted">Name</td><td><strong>'+Helpers.escapeHtml(p.name)+'</strong></td></tr><tr><td class="text-muted">Gender</td><td>'+p.gender+'</td></tr><tr><td class="text-muted">Category</td><td>'+Helpers.escapeHtml(p.category)+'</td></tr><tr><td class="text-muted">Price</td><td>'+Helpers.formatCurrency(p.price)+(p.original_price?'<br><small><del>'+Helpers.formatCurrency(p.original_price)+'</del></small>':'')+'</td></tr><tr><td class="text-muted">Purity</td><td><span style="color:var(--gold-deep);font-weight:600">'+Helpers.escapeHtml(p.purity_tag)+'</span></td></tr><tr><td class="text-muted">Badge</td><td>'+(p.badge_tag?'<span class="badge badge-gold">'+Helpers.escapeHtml(p.badge_tag)+'</span>':'\u2014')+'</td></tr><tr><td class="text-muted">Rating</td><td>'+Helpers.stars(p.rating)+' '+p.rating+'/5</td></tr></table></div><div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Close</button></div>');};
App.deleteJewelProduct=function(id){Helpers.confirm('Delete this product?','','warning').then(function(r){if(r.isConfirmed){MockData.jewelleryProducts=MockData.jewelleryProducts.filter(function(x){return x.id!==id;});Helpers.toast('Deleted','success');App.navigate('jewellery-products');}});};
