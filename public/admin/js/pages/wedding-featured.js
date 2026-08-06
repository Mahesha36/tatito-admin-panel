'use strict';
/* MODULE 1: Weddings Hub — Featured Couture */

App.pages['wedding-featured'] = function() {
    var data = MockData.weddingFeatured;
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Featured Couture</h3><p class="text-muted">Showcase featured wedding products</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-primary" onclick="App.addWeddingFeatured()"><i class="bi bi-plus-lg"></i> Add Featured</button></div></div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="wfTable"><thead><tr><th>ID</th><th>Product Name</th><th>Price</th><th>Image</th><th>Sort</th><th>Status</th><th>Actions</th></tr></thead><tbody>' +
        data.map(function(f) {
            return '<tr><td>' + f.id + '</td><td><strong>' + Helpers.escapeHtml(f.name) + '</strong></td>' +
                '<td>' + Helpers.formatCurrency(f.price) + '</td>' +
                '<td><img src="' + f.image + '" style="width:40px;height:40px;object-fit:cover;border-radius:4px"></td>' +
                '<td>' + f.sort_order + '</td>' +
                '<td><span class="badge '+(f.is_active?'badge-success':'badge-danger')+'">'+(f.is_active?'Active':'Inactive')+'</span></td>' +
                '<td><div class="table-actions"><button class="action-btn edit" onclick="App.editWeddingFeatured(\''+f.id+'\')"><i class="bi bi-pencil"></i></button>' +
                '<button class="action-btn delete" onclick="App.deleteWeddingFeatured(\''+f.id+'\')"><i class="bi bi-trash"></i></button></div></td></tr>';
        }).join('') + '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') $('#wfTable').DataTable({ pageLength: 10 });
};
App.addWeddingFeatured = function() {
    Helpers.openModal('<div class="modal-header"><h3 class="modal-title">Add Featured Product</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="wfForm">' +
        '<div class="form-group"><label>Product Name *</label><input type="text" class="form-control" name="name" required></div>' +
        '<div class="form-row"><div class="form-group"><label>Price</label><input type="number" class="form-control" name="price" value="0"></div>' +
        '<div class="form-group"><label>Sort Order</label><input type="number" class="form-control" name="sort_order" value="1"></div></div>' +
        '<div class="form-group"><label>Active</label><button type="button" class="toggle-switch on" onclick="this.classList.toggle(\'on\')"><span class="toggle-knob"></span></button></div>' +
        '</form></div><div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveWeddingFeatured()">Save</button></div>');
};
App.saveWeddingFeatured = function() {
    var f=document.getElementById('wfForm');var fd=new FormData(f);
    if(!fd.get('name')){Helpers.toast('Name required','error');return;}
    MockData.weddingFeatured.push({id:'WPF'+String(MockData.weddingFeatured.length+1).padStart(3,'0'),product_id:'',name:fd.get('name'),price:parseInt(fd.get('price'))||0,image:'assets/logo.svg',sort_order:parseInt(fd.get('sort_order'))||1,is_active:f.querySelector('.toggle-switch').classList.contains('on')});
    Helpers.closeModal();Helpers.toast('Added','success');App.navigate('wedding-featured');
};
App.editWeddingFeatured=function(id){var p=MockData.weddingFeatured.find(function(x){return x.id===id;});if(!p)return;
    Helpers.openModal('<div class="modal-header"><h3 class="modal-title">Edit Featured</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
    '<div class="modal-body"><form id="wfForm"><div class="form-group"><label>Name</label><input type="text" class="form-control" name="name" value="'+Helpers.escapeHtml(p.name)+'"></div>' +
    '<div class="form-row"><div class="form-group"><label>Price</label><input type="number" class="form-control" name="price" value="'+p.price+'"></div><div class="form-group"><label>Sort Order</label><input type="number" class="form-control" name="sort_order" value="'+p.sort_order+'"></div></div>' +
    '<div class="form-group"><label>Active</label><button type="button" class="toggle-switch '+(p.is_active?'on':'')+'" onclick="this.classList.toggle(\'on\')"><span class="toggle-knob"></span></button></div></form></div>' +
    '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveEditWeddingFeatured(\''+id+'\')">Save</button></div>');
};
App.saveEditWeddingFeatured=function(id){var p=MockData.weddingFeatured.find(function(x){return x.id===id;});if(!p)return;var f=document.getElementById('wfForm');var fd=new FormData(f);p.name=fd.get('name');p.price=parseInt(fd.get('price'))||0;p.sort_order=parseInt(fd.get('sort_order'))||1;p.is_active=f.querySelector('.toggle-switch').classList.contains('on');Helpers.closeModal();Helpers.toast('Updated','success');App.navigate('wedding-featured');};
App.deleteWeddingFeatured=function(id){Helpers.confirm('Remove from featured?','','warning').then(function(r){if(r.isConfirmed){MockData.weddingFeatured=MockData.weddingFeatured.filter(function(x){return x.id!==id;});Helpers.toast('Removed','success');App.navigate('wedding-featured');}});};
