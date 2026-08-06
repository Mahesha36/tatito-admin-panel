'use strict';
/* MODULE 0: Home Screen — Video Banners */

App.pages['home-video-banners'] = function() {
    var data = MockData.homeVideoBanners;
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Video Banners</h3><p class="text-muted">Homepage video reel banners</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-primary" onclick="App.addVideoBanner()"><i class="bi bi-plus-lg"></i> Add Banner</button></div></div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="vbTable"><thead><tr><th>ID</th><th>Title</th><th>Subtitle</th><th>CTA Label</th><th>Video URL</th><th>Status</th><th>Actions</th></tr></thead><tbody>' +
        data.map(function(b) {
            return '<tr><td>' + b.id + '</td><td><strong>' + Helpers.escapeHtml(b.title) + '</strong></td><td>' + Helpers.escapeHtml(b.subtitle) + '</td>' +
                '<td><span class="badge badge-info">' + Helpers.escapeHtml(b.cta_label) + '</span></td>' +
                '<td>' + (b.video_url ? '<i class="bi bi-camera-video" style="color:var(--gold)"></i> <small>Linked</small>' : '<span class="text-muted">\u2014</span>') + '</td>' +
                '<td><span class="badge ' + (b.is_active ? 'badge-success' : 'badge-danger') + '">' + (b.is_active?'Active':'Inactive') + '</span></td>' +
                '<td><div class="table-actions"><button class="action-btn edit" onclick="App.editVideoBanner(\'' + b.id + '\')"><i class="bi bi-pencil"></i></button>' +
                '<button class="action-btn delete" onclick="App.deleteVideoBanner(\'' + b.id + '\')"><i class="bi bi-trash"></i></button></div></td></tr>';
        }).join('') +
        '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') $('#vbTable').DataTable({ pageLength: 10 });
};
App.addVideoBanner = function() {
    Helpers.openModal('<div class="modal-header"><h3 class="modal-title">Add Video Banner</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="vbForm">' +
        '<div class="form-group"><label>Title *</label><input type="text" class="form-control" name="title" required></div>' +
        '<div class="form-group"><label>Subtitle</label><input type="text" class="form-control" name="subtitle"></div>' +
        '<div class="form-row"><div class="form-group"><label>CTA Label</label><input type="text" class="form-control" name="cta_label" value="Watch Now"></div>' +
        '<div class="form-group"><label>CTA Route</label><input type="text" class="form-control" name="cta_route" placeholder="/fashion-week"></div></div>' +
        '<div class="form-group"><label>Video URL *</label><input type="url" class="form-control" name="video_url" required placeholder="https://youtube.com/..."></div>' +
        '<div class="form-group"><label>Active</label><button type="button" class="toggle-switch on" onclick="this.classList.toggle(\'on\')"><span class="toggle-knob"></span></button></div>' +
        '</form></div><div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveVideoBanner()">Save</button></div>');
};
App.saveVideoBanner = function() {
    var f = document.getElementById('vbForm'); var fd = new FormData(f);
    if (!fd.get('title') || !fd.get('video_url')) { Helpers.toast('Title and Video URL are required', 'error'); return; }
    MockData.homeVideoBanners.push({ id:'HVB'+String(MockData.homeVideoBanners.length+1).padStart(3,'0'), title:fd.get('title'), subtitle:fd.get('subtitle')||'', cta_label:fd.get('cta_label')||'Watch Now', cta_route:fd.get('cta_route')||'', video_url:fd.get('video_url'), is_active:f.querySelector('.toggle-switch').classList.contains('on') });
    Helpers.closeModal(); Helpers.toast('Banner added','success'); App.navigate('home-video-banners');
};
App.editVideoBanner = function(id) {
    var b = MockData.homeVideoBanners.find(function(x){return x.id===id;}); if(!b) return;
    Helpers.openModal('<div class="modal-header"><h3 class="modal-title">Edit Banner</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="vbForm">' +
        '<div class="form-group"><label>Title</label><input type="text" class="form-control" name="title" value="'+Helpers.escapeHtml(b.title)+'"></div>' +
        '<div class="form-group"><label>Subtitle</label><input type="text" class="form-control" name="subtitle" value="'+Helpers.escapeHtml(b.subtitle)+'"></div>' +
        '<div class="form-row"><div class="form-group"><label>CTA Label</label><input type="text" class="form-control" name="cta_label" value="'+Helpers.escapeHtml(b.cta_label)+'"></div>' +
        '<div class="form-group"><label>CTA Route</label><input type="text" class="form-control" name="cta_route" value="'+Helpers.escapeHtml(b.cta_route||'')+'"></div></div>' +
        '<div class="form-group"><label>Video URL</label><input type="url" class="form-control" name="video_url" value="'+(b.video_url||'')+'"></div>' +
        '<div class="form-group"><label>Active</label><button type="button" class="toggle-switch '+(b.is_active?'on':'')+'" onclick="this.classList.toggle(\'on\')"><span class="toggle-knob"></span></button></div>' +
        '</form></div><div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveEditVideoBanner(\''+id+'\')">Save</button></div>');
};
App.saveEditVideoBanner = function(id) {
    var b = MockData.homeVideoBanners.find(function(x){return x.id===id;}); if(!b) return;
    var f=document.getElementById('vbForm'); var fd=new FormData(f);
    b.title=fd.get('title'); b.subtitle=fd.get('subtitle')||''; b.cta_label=fd.get('cta_label'); b.cta_route=fd.get('cta_route')||''; b.video_url=fd.get('video_url'); b.is_active=f.querySelector('.toggle-switch').classList.contains('on');
    Helpers.closeModal(); Helpers.toast('Updated','success'); App.navigate('home-video-banners');
};
App.deleteVideoBanner = function(id) {
    Helpers.confirm('Delete this banner?','This cannot be undone.','warning').then(function(r){if(r.isConfirmed){MockData.homeVideoBanners=MockData.homeVideoBanners.filter(function(x){return x.id!==id;});Helpers.toast('Deleted','success');App.navigate('home-video-banners');}});
};
