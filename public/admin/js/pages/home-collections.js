'use strict';
/* MODULE 0: Home Screen — Collections */

App.pages['home-collections'] = function() {
    var data = MockData.homeCollections;
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Home Collections</h3><p class="text-muted">Manage homepage collection banners by gender & module</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-primary" onclick="App.addHomeCollection()"><i class="bi bi-plus-lg"></i> Add Collection</button></div></div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="hcTable"><thead><tr><th>ID</th><th>Module</th><th>Gender</th><th>Title</th><th>Subtitle</th><th>Sort</th><th>Video</th><th>Status</th><th>Actions</th></tr></thead><tbody>' +
        data.map(function(c) {
            return '<tr><td>' + c.id + '</td>' +
                '<td><span class="badge badge-info">' + c.target_module + '</span></td>' +
                '<td>' + c.gender + '</td>' +
                '<td><strong>' + Helpers.escapeHtml(c.title) + '</strong></td>' +
                '<td>' + Helpers.escapeHtml(c.subtitle) + '</td>' +
                '<td>' + c.sort_order + '</td>' +
                '<td>' + (c.video_url ? '<i class="bi bi-camera-video" style="color:var(--gold)" title="Has video"></i>' : '<span class="text-muted">\u2014</span>') + '</td>' +
                '<td><span class="badge ' + (c.is_active ? 'badge-success' : 'badge-danger') + '">' + (c.is_active ? 'Active' : 'Inactive') + '</span></td>' +
                '<td><div class="table-actions">' +
                '<button class="action-btn edit" onclick="App.editHomeCollection(\'' + c.id + '\')"><i class="bi bi-pencil"></i></button>' +
                '<button class="action-btn delete" onclick="App.deleteHomeCollection(\'' + c.id + '\')"><i class="bi bi-trash"></i></button>' +
                '</div></td></tr>';
        }).join('') +
        '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') $('#hcTable').DataTable({ pageLength: 10 });
};

App.addHomeCollection = function() {
    var html = '<div class="modal-header"><h3 class="modal-title">Add Home Collection</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="hcForm">' +
        '<div class="form-row"><div class="form-group"><label>Target Module *</label><select class="form-control" name="target_module"><option value="fashions">Fashions</option><option value="weddings">Weddings</option><option value="jewellery">Jewellery</option></select></div>' +
        '<div class="form-group"><label>Gender *</label><select class="form-control" name="gender"><option value="Men">Men</option><option value="Women">Women</option><option value="Kids">Kids</option></select></div></div>' +
        '<div class="form-group"><label>Title *</label><input type="text" class="form-control" name="title" required></div>' +
        '<div class="form-group"><label>Subtitle</label><input type="text" class="form-control" name="subtitle"></div>' +
        '<div class="form-group"><label>Image</label><div class="upload-zone" onclick="this.querySelector(\'input\').click()"><i class="bi bi-cloud-arrow-up"></i><p>Click to upload image</p><input type="file" accept="image/*" hidden></div></div>' +
        '<div class="form-group"><label>Video URL</label><input type="url" class="form-control" name="video_url" placeholder="https://..."></div>' +
        '<div class="form-row"><div class="form-group"><label>Sort Order</label><input type="number" class="form-control" name="sort_order" value="1"></div>' +
        '<div class="form-group"><label>Active</label><div><button type="button" class="toggle-switch on" onclick="this.classList.toggle(\'on\')"><span class="toggle-knob"></span></button></div></div></div>' +
        '</form></div><div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveHomeCollection()">Save</button></div>';
    Helpers.openModal(html);
};
App.saveHomeCollection = function() {
    var f = document.getElementById('hcForm');
    var fd = new FormData(f);
    MockData.homeCollections.push({
        id: 'HC' + String(MockData.homeCollections.length + 1).padStart(3, '0'),
        target_module: fd.get('target_module'), gender: fd.get('gender'),
        title: fd.get('title'), subtitle: fd.get('subtitle') || '',
        image: 'assets/logo.svg', video_url: fd.get('video_url') || '',
        sort_order: parseInt(fd.get('sort_order')) || 1, is_active: f.querySelector('.toggle-switch').classList.contains('on')
    });
    Helpers.closeModal(); Helpers.toast('Collection added', 'success'); App.navigate('home-collections');
};
App.editHomeCollection = function(id) {
    var c = MockData.homeCollections.find(function(x) { return x.id === id; }); if (!c) return;
    var html = '<div class="modal-header"><h3 class="modal-title">Edit Collection</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="hcForm">' +
        '<div class="form-row"><div class="form-group"><label>Target Module</label><select class="form-control" name="target_module"><option ' + (c.target_module==='fashions'?'selected':'') + '>fashions</option><option ' + (c.target_module==='weddings'?'selected':'') + '>weddings</option><option ' + (c.target_module==='jewellery'?'selected':'') + '>jewellery</option></select></div>' +
        '<div class="form-group"><label>Gender</label><select class="form-control" name="gender"><option ' + (c.gender==='Men'?'selected':'') + '>Men</option><option ' + (c.gender==='Women'?'selected':'') + '>Women</option><option ' + (c.gender==='Kids'?'selected':'') + '>Kids</option></select></div></div>' +
        '<div class="form-group"><label>Title</label><input type="text" class="form-control" name="title" value="' + Helpers.escapeHtml(c.title) + '"></div>' +
        '<div class="form-group"><label>Subtitle</label><input type="text" class="form-control" name="subtitle" value="' + Helpers.escapeHtml(c.subtitle) + '"></div>' +
        '<div class="form-group"><label>Video URL</label><input type="url" class="form-control" name="video_url" value="' + (c.video_url||'') + '"></div>' +
        '<div class="form-row"><div class="form-group"><label>Sort Order</label><input type="number" class="form-control" name="sort_order" value="' + c.sort_order + '"></div>' +
        '<div class="form-group"><label>Active</label><div><button type="button" class="toggle-switch ' + (c.is_active?'on':'') + '" onclick="this.classList.toggle(\'on\')"><span class="toggle-knob"></span></button></div></div></div>' +
        '</form></div><div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveEditHomeCollection(\'' + id + '\')">Save</button></div>';
    Helpers.openModal(html);
};
App.saveEditHomeCollection = function(id) {
    var c = MockData.homeCollections.find(function(x){return x.id===id;}); if(!c) return;
    var f=document.getElementById('hcForm'); var fd=new FormData(f);
    c.target_module=fd.get('target_module'); c.gender=fd.get('gender'); c.title=fd.get('title'); c.subtitle=fd.get('subtitle')||''; c.video_url=fd.get('video_url')||''; c.sort_order=parseInt(fd.get('sort_order'))||1; c.is_active=f.querySelector('.toggle-switch').classList.contains('on');
    Helpers.closeModal(); Helpers.toast('Collection updated','success'); App.navigate('home-collections');
};
App.deleteHomeCollection = function(id) {
    Helpers.confirm('Delete this collection?','This cannot be undone.','warning').then(function(r){if(r.isConfirmed){MockData.homeCollections=MockData.homeCollections.filter(function(x){return x.id!==id;});Helpers.toast('Deleted','success');App.navigate('home-collections');}});
};
