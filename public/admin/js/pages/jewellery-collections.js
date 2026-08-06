'use strict';
/* MODULE 3: Jewellery Vault — Collections */

App.pages['jewellery-collections'] = function() {
    var data = MockData.jewelleryCollections;
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Jewellery Collections</h3><p class="text-muted">Curated jewellery collections by gender</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-primary" onclick="App.addJewelCollection()"><i class="bi bi-plus-lg"></i> Add Collection</button></div></div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="jcTable"><thead><tr><th>ID</th><th>Gender</th><th>Title</th><th>Subtitle</th><th>Sort</th><th>Status</th><th>Actions</th></tr></thead><tbody>' +
        data.map(function(c) {
            return '<tr><td>'+c.id+'</td><td><span class="badge badge-info">'+c.gender+'</span></td><td><strong>'+Helpers.escapeHtml(c.title)+'</strong></td><td>'+Helpers.escapeHtml(c.subtitle)+'</td>' +
                '<td>'+c.sort_order+'</td><td><span class="badge '+(c.is_active?'badge-success':'badge-danger')+'">'+(c.is_active?'Active':'Inactive')+'</span></td>' +
                '<td><div class="table-actions"><button class="action-btn edit" onclick="App.editJewelCollection(\''+c.id+'\')"><i class="bi bi-pencil"></i></button>' +
                '<button class="action-btn delete" onclick="App.deleteJewelCollection(\''+c.id+'\')"><i class="bi bi-trash"></i></button></div></td></tr>';
        }).join('') + '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') $('#jcTable').DataTable({ pageLength: 10 });
};
function _jcForm(c) {
    c=c||{};
    return '<div class="modal-header"><h3 class="modal-title">'+(c.id?'Edit':'Add')+' Collection</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="jcForm">' +
        '<div class="form-group"><label>Gender</label><select class="form-control" name="gender"><option '+(c.gender==='Men'?'selected':'')+'>Men</option><option '+(c.gender==='Women'?'selected':'')+'>Women</option><option '+(c.gender==='Unisex'?'selected':'')+'>Unisex</option></select></div>' +
        '<div class="form-group"><label>Title *</label><input type="text" class="form-control" name="title" value="'+Helpers.escapeHtml(c.title||'')+'" required></div>' +
        '<div class="form-group"><label>Subtitle</label><input type="text" class="form-control" name="subtitle" value="'+Helpers.escapeHtml(c.subtitle||'')+'"></div>' +
        '<div class="form-group"><label>Image</label><div class="upload-zone" onclick="this.querySelector(\'input\').click()"><i class="bi bi-cloud-arrow-up"></i><p>Upload image</p><input type="file" accept="image/*" hidden></div></div>' +
        '<div class="form-row"><div class="form-group"><label>Sort Order</label><input type="number" class="form-control" name="sort_order" value="'+(c.sort_order||1)+'"></div>' +
        '<div class="form-group"><label>Active</label><button type="button" class="toggle-switch '+(c.is_active!==false?'on':'')+'" onclick="this.classList.toggle(\'on\')"><span class="toggle-knob"></span></button></div></div>' +
        '</form></div><div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveJewelCollection(\''+(c.id||'')+'\')">Save</button></div>';
}
App.addJewelCollection=function(){Helpers.openModal(_jcForm());};
App.editJewelCollection=function(id){var c=MockData.jewelleryCollections.find(function(x){return x.id===id;});if(!c)return;Helpers.openModal(_jcForm(c));};
App.saveJewelCollection=function(id){var f=document.getElementById('jcForm');var fd=new FormData(f);if(!fd.get('title')){Helpers.toast('Title required','error');return;}var entry={gender:fd.get('gender'),title:fd.get('title'),subtitle:fd.get('subtitle')||'',image:'assets/logo.svg',sort_order:parseInt(fd.get('sort_order'))||1,is_active:f.querySelector('.toggle-switch').classList.contains('on')};if(id){Object.assign(MockData.jewelleryCollections.find(function(x){return x.id===id;}),entry);}else{entry.id='JC'+String(MockData.jewelleryCollections.length+1).padStart(3,'0');MockData.jewelleryCollections.push(entry);}Helpers.closeModal();Helpers.toast('Saved','success');App.navigate('jewellery-collections');};
App.deleteJewelCollection=function(id){Helpers.confirm('Delete this collection?','','warning').then(function(r){if(r.isConfirmed){MockData.jewelleryCollections=MockData.jewelleryCollections.filter(function(x){return x.id!==id;});Helpers.toast('Deleted','success');App.navigate('jewellery-collections');}});};
