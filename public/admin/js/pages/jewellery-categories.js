'use strict';
/* MODULE 3: Jewellery Vault — Categories */

App.pages['jewellery-categories'] = function() {
    var data = MockData.jewelleryCategories;
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Jewellery Categories</h3><p class="text-muted">Product categories for the jewellery vault</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-primary" onclick="App.addJewelCategory()"><i class="bi bi-plus-lg"></i> Add Category</button></div></div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="jcatTable"><thead><tr><th>ID</th><th>Category Name</th><th>Product Count</th><th>Status</th><th>Actions</th></tr></thead><tbody>' +
        data.map(function(c) {
            return '<tr><td>'+c.id+'</td><td><strong>'+Helpers.escapeHtml(c.name)+'</strong></td>' +
                '<td><span class="badge badge-info">'+c.product_count+'</span></td>' +
                '<td><span class="badge '+(c.is_active?'badge-success':'badge-danger')+'">'+(c.is_active?'Active':'Inactive')+'</span></td>' +
                '<td><div class="table-actions"><button class="action-btn edit" onclick="App.editJewelCategory(\''+c.id+'\')"><i class="bi bi-pencil"></i></button>' +
                '<button class="action-btn delete" onclick="App.deleteJewelCategory(\''+c.id+'\')"><i class="bi bi-trash"></i></button></div></td></tr>';
        }).join('') + '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') $('#jcatTable').DataTable({ pageLength: 10 });
};
App.addJewelCategory=function(){
    Helpers.openModal('<div class="modal-header"><h3 class="modal-title">Add Category</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
    '<div class="modal-body"><form id="jcatForm"><div class="form-group"><label>Name *</label><input type="text" class="form-control" name="name" required></div>' +
    '<div class="form-group"><label>Active</label><button type="button" class="toggle-switch on" onclick="this.classList.toggle(\'on\')"><span class="toggle-knob"></span></button></div></form></div>' +
    '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveJewelCategory()">Save</button></div>');
};
App.saveJewelCategory=function(){var f=document.getElementById('jcatForm');var fd=new FormData(f);if(!fd.get('name')){Helpers.toast('Name required','error');return;}MockData.jewelleryCategories.push({id:'JCAT'+String(MockData.jewelleryCategories.length+1).padStart(2,'0'),name:fd.get('name'),product_count:0,is_active:f.querySelector('.toggle-switch').classList.contains('on')});Helpers.closeModal();Helpers.toast('Added','success');App.navigate('jewellery-categories');};
App.editJewelCategory=function(id){var c=MockData.jewelleryCategories.find(function(x){return x.id===id;});if(!c)return;
    Helpers.openModal('<div class="modal-header"><h3 class="modal-title">Edit Category</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
    '<div class="modal-body"><form id="jcatForm"><div class="form-group"><label>Name</label><input type="text" class="form-control" name="name" value="'+Helpers.escapeHtml(c.name)+'"></div>' +
    '<div class="form-group"><label>Active</label><button type="button" class="toggle-switch '+(c.is_active?'on':'')+'" onclick="this.classList.toggle(\'on\')"><span class="toggle-knob"></span></button></div></form></div>' +
    '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveEditJewelCategory(\''+id+'\')">Save</button></div>');
};
App.saveEditJewelCategory=function(id){var c=MockData.jewelleryCategories.find(function(x){return x.id===id;});if(!c)return;var f=document.getElementById('jcatForm');var fd=new FormData(f);c.name=fd.get('name');c.is_active=f.querySelector('.toggle-switch').classList.contains('on');Helpers.closeModal();Helpers.toast('Updated','success');App.navigate('jewellery-categories');};
App.deleteJewelCategory=function(id){Helpers.confirm('Delete this category?','','warning').then(function(r){if(r.isConfirmed){MockData.jewelleryCategories=MockData.jewelleryCategories.filter(function(x){return x.id!==id;});Helpers.toast('Deleted','success');App.navigate('jewellery-categories');}});};
