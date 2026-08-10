'use strict';
/* MODULE 1: Weddings Hub — Collections */

App.pages['wedding-collections'] = function() {
    var data = MockData.weddingCollections;
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Wedding Collections</h3><p class="text-muted">Bridal & groom collections by gender</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-primary" onclick="App.addWeddingCollection()"><i class="bi bi-plus-lg"></i> Add Collection</button></div></div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="wcTable"><thead><tr><th>ID</th><th>Gender</th><th>Title</th><th>Subtitle</th><th>Count Badge</th><th>Video</th><th>Sort</th><th>Status</th><th>Actions</th></tr></thead><tbody>' +
        data.map(function(c) {
            return '<tr><td>' + c.id + '</td><td><span class="badge badge-info">' + c.gender + '</span></td><td><strong>' + Helpers.escapeHtml(c.title) + '</strong></td><td>' + Helpers.escapeHtml(c.subtitle) + '</td>' +
                '<td><span class="badge badge-gold">' + Helpers.escapeHtml(c.count_badge) + '</span></td>' +
                '<td>' + (c.video_url ? '<i class="bi bi-camera-video" style="color:var(--gold)"></i>' : '<span class="text-muted">\u2014</span>') + '</td>' +
                '<td>' + c.sort_order + '</td><td><span class="badge ' + (c.is_active?'badge-success':'badge-danger') + '">' + (c.is_active?'Active':'Inactive') + '</span></td>' +
                '<td><div class="table-actions"><button class="action-btn edit" onclick="App.editWeddingCollection(\'' + c.id + '\')"><i class="bi bi-pencil"></i></button>' +
                '<button class="action-btn delete" onclick="App.deleteWeddingCollection(\'' + c.id + '\')"><i class="bi bi-trash"></i></button></div></td></tr>';
        }).join('') + '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') $('#wcTable').DataTable({ pageLength: 10 });
};

function _wcForm(c) {
    c = c || {};
    return '<div class="modal-header"><h3 class="modal-title">' + (c.id?'Edit':'Add') + ' Wedding Collection</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="wcForm">' +
        '<div class="form-group"><label>Gender *</label><select class="form-control" name="gender"><option '+(c.gender==='Men'?'selected':'')+'>Men</option><option '+(c.gender==='Women'?'selected':'')+'>Women</option><option '+(c.gender==='Kids'?'selected':'')+'>Kids</option></select></div>' +
        '<div class="form-group"><label>Title *</label><input type="text" class="form-control" name="title" value="'+Helpers.escapeHtml(c.title||'')+'" required></div>' +
        '<div class="form-group"><label>Subtitle</label><input type="text" class="form-control" name="subtitle" value="'+Helpers.escapeHtml(c.subtitle||'')+'"></div>' +
        '<div class="form-group"><label>Count Badge</label><input type="text" class="form-control" name="count_badge" value="'+Helpers.escapeHtml(c.count_badge||'')+'" placeholder="120+ Designs"></div>' +
        '<div class="form-group"><label>Image</label><div class="upload-zone"><i class="bi bi-cloud-arrow-up"></i><p>Click to upload</p><input type="file" id="wcImage" accept="image/*" hidden></div></div>' +
        '<div class="form-group"><label>Video URL</label><input type="url" class="form-control" name="video_url" value="'+(c.video_url||'')+'"></div>' +
        '<div class="form-row"><div class="form-group"><label>Sort Order</label><input type="number" class="form-control" name="sort_order" value="'+(c.sort_order||1)+'"></div>' +
        '<div class="form-group"><label>Active</label><button type="button" class="toggle-switch '+(c.is_active!==false?'on':'')+'" onclick="this.classList.toggle(\'on\')"><span class="toggle-knob"></span></button></div></div>' +
        '</form></div><div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveWeddingCollection(\''+(c.id||'')+'\')">Save</button></div>';
}
App.addWeddingCollection = function() { Helpers.openModal(_wcForm()); };
App.editWeddingCollection = function(id) { var c=MockData.weddingCollections.find(function(x){return x.id===id;}); if(!c)return; Helpers.openModal(_wcForm(c)); };
App.saveWeddingCollection = function(id) {
    var f=document.getElementById('wcForm'); var fd=new FormData(f);
    if(!fd.get('title')){Helpers.toast('Title required','error');return;}
    var entry={gender:fd.get('gender'),title:fd.get('title'),subtitle:fd.get('subtitle')||'',count_badge:fd.get('count_badge')||'',image:App.getUpload('wcImage')||(id?(MockData.weddingCollections.find(function(x){return x.id===id;}).image):'assets/tatito-logo.png'),video_url:fd.get('video_url')||'',sort_order:parseInt(fd.get('sort_order'))||1,is_active:f.querySelector('.toggle-switch').classList.contains('on')};
    if(id){Object.assign(MockData.weddingCollections.find(function(x){return x.id===id;}),entry);}else{entry.id='WPC'+String(MockData.weddingCollections.length+1).padStart(3,'0');MockData.weddingCollections.push(entry);}
    Helpers.closeModal();Helpers.toast('Saved','success');App.navigate('wedding-collections');
};
App.deleteWeddingCollection = function(id) { Helpers.confirm('Delete this collection?','','warning').then(function(r){if(r.isConfirmed){MockData.weddingCollections=MockData.weddingCollections.filter(function(x){return x.id!==id;});Helpers.toast('Deleted','success');App.navigate('wedding-collections');}}); };
