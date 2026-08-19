'use strict';
/* MODULE 1: Weddings Hub — Banners */

App.pages['wedding-banners'] = function() {
    var data = MockData.weddingBanners;
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Wedding Banners</h3><p class="text-muted">Hero banners for weddings hub</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-primary" onclick="App.addWeddingBanner()"><i class="bi bi-plus-lg"></i> Add Banner</button></div></div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="wbTable"><thead><tr><th>ID</th><th>Title</th><th>Image</th><th>Video URL</th><th>Status</th><th>Actions</th></tr></thead><tbody>' +
        data.map(function(b) {
            return '<tr><td>' + b.id + '</td><td><strong>' + Helpers.escapeHtml(b.title) + '</strong></td>' +
                '<td><img src="' + b.image + '" style="width:50px;height:30px;object-fit:cover;border-radius:4px"></td>' +
                '<td>' + (b.video_url ? '<a href="'+b.video_url+'" target="_blank"><i class="bi bi-camera-video" style="color:var(--gold)"></i></a>' : '<span class="text-muted">\u2014</span>') + '</td>' +
                '<td><span class="badge '+(b.is_active?'badge-success':'badge-danger')+'">'+(b.is_active?'Active':'Inactive')+'</span></td>' +
                '<td><div class="table-actions"><button class="action-btn edit" onclick="App.editWeddingBanner(\''+b.id+'\')"><i class="bi bi-pencil"></i></button>' +
                '<button class="action-btn delete" onclick="App.deleteWeddingBanner(\''+b.id+'\')"><i class="bi bi-trash"></i></button></div></td></tr>';
        }).join('') + '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') $('#wbTable').DataTable({ pageLength: 10 });
};
App.addWeddingBanner = function() {
    Helpers.openModal('<div class="modal-header"><h3 class="modal-title">Add Banner</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="wbForm"><div class="form-group"><label>Title *</label><input type="text" class="form-control" name="title" required></div>' +
        '<div class="form-group"><label>Image</label><div class="upload-zone"><i class="bi bi-cloud-arrow-up"></i><p>Upload banner image</p><input type="file" id="wbImage" accept="image/*" hidden></div></div>' +
        '<div class="form-group"><label>Video URL</label><input type="url" class="form-control" name="video_url"></div>' +
        '<div class="form-group"><label>Active</label><button type="button" class="toggle-switch on" onclick="this.classList.toggle(\'on\')"><span class="toggle-knob"></span></button></div></form></div>' +
        '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveWeddingBanner()">Save</button></div>');
};
App.saveWeddingBanner = function() {
    var f=document.getElementById('wbForm');var fd=new FormData(f);
    if(!fd.get('title')){Helpers.toast('Title required','error');return;}
    MockData.weddingBanners.push({id:'WPB'+String(MockData.weddingBanners.length+1).padStart(3,'0'),title:fd.get('title'),image:App.getUpload('wbImage')||'assets/tatito-logo.png',video_url:fd.get('video_url')||'',is_active:f.querySelector('.toggle-switch').classList.contains('on')});
    Helpers.closeModal();Helpers.toast('Added','success');App.navigate('wedding-banners');
};
App.editWeddingBanner=function(id){var b=MockData.weddingBanners.find(function(x){return x.id===id;});if(!b)return;
    Helpers.openModal('<div class="modal-header"><h3 class="modal-title">Edit Banner</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
    '<div class="modal-body"><form id="wbForm"><div class="form-group"><label>Title</label><input type="text" class="form-control" name="title" value="'+Helpers.escapeHtml(b.title)+'"></div>' +
    '<div class="form-group"><label>Video URL</label><input type="url" class="form-control" name="video_url" value="'+(b.video_url||'')+'"></div>' +
    '<div class="form-group"><label>Active</label><button type="button" class="toggle-switch '+(b.is_active?'on':'')+'" onclick="this.classList.toggle(\'on\')"><span class="toggle-knob"></span></button></div></form></div>' +
    '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveEditWeddingBanner(\''+id+'\')">Save</button></div>');
};
App.saveEditWeddingBanner=function(id){var b=MockData.weddingBanners.find(function(x){return x.id===id;});if(!b)return;var f=document.getElementById('wbForm');var fd=new FormData(f);b.title=fd.get('title');b.video_url=fd.get('video_url')||'';b.is_active=f.querySelector('.toggle-switch').classList.contains('on');Helpers.closeModal();Helpers.toast('Updated','success');App.navigate('wedding-banners');};
App.deleteWeddingBanner=function(id){Helpers.confirm('Delete this banner?','','warning').then(function(r){if(r.isConfirmed){MockData.weddingBanners=MockData.weddingBanners.filter(function(x){return x.id!==id;});Helpers.toast('Deleted','success');App.navigate('wedding-banners');}});};
