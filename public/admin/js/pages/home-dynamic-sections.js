'use strict';
/* MODULE 0: Home Screen — Dynamic Layout Sections */

App.pages['home-dynamic-sections'] = function() {
    var data = MockData.homeDynamicSections;
    var layoutIcons = { banner: 'bi-image', card_ui: 'bi-grid', video: 'bi-camera-video', category_grid: 'bi-grid-3x3' };
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Dynamic Layout Sections</h3><p class="text-muted">Customizable homepage feed blocks</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-primary" onclick="App.addDynamicSection()"><i class="bi bi-plus-lg"></i> Add Section</button></div></div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="dsTable"><thead><tr><th>ID</th><th>Section Title</th><th>Subtitle</th><th>Layout Type</th><th>Media</th><th>CTA</th><th>Sort</th><th>Status</th><th>Actions</th></tr></thead><tbody>' +
        data.map(function(s) {
            return '<tr><td>' + s.id + '</td><td><strong>' + Helpers.escapeHtml(s.section_title) + '</strong></td><td>' + Helpers.escapeHtml(s.section_subtitle) + '</td>' +
                '<td><span class="badge badge-info"><i class="bi ' + (layoutIcons[s.layout_type]||'bi-layout-text-window') + '"></i> ' + s.layout_type + '</span></td>' +
                '<td>' + (s.media_type === 'video' ? '<i class="bi bi-camera-video"></i> Video' : '<i class="bi bi-image"></i> Image') + '</td>' +
                '<td><span class="badge ' + (s.cta_label ? 'badge-gold' : '') + '">' + Helpers.escapeHtml(s.cta_label || '\u2014') + '</span></td>' +
                '<td>' + s.sort_order + '</td>' +
                '<td><span class="badge ' + (s.is_active ? 'badge-success' : 'badge-danger') + '">' + (s.is_active?'Active':'Inactive') + '</span></td>' +
                '<td><div class="table-actions"><button class="action-btn edit" onclick="App.editDynamicSection(\'' + s.id + '\')"><i class="bi bi-pencil"></i></button>' +
                '<button class="action-btn delete" onclick="App.deleteDynamicSection(\'' + s.id + '\')"><i class="bi bi-trash"></i></button></div></td></tr>';
        }).join('') +
        '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') $('#dsTable').DataTable({ pageLength: 10 });
};

function _dynamicSectionForm(s) {
    s = s || {};
    return '<div class="modal-header"><h3 class="modal-title">' + (s.id ? 'Edit' : 'Add') + ' Dynamic Section</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="dsForm">' +
        '<div class="form-group"><label>Section Title *</label><input type="text" class="form-control" name="section_title" value="' + Helpers.escapeHtml(s.section_title || '') + '" required></div>' +
        '<div class="form-group"><label>Section Subtitle</label><input type="text" class="form-control" name="section_subtitle" value="' + Helpers.escapeHtml(s.section_subtitle || '') + '"></div>' +
        '<div class="form-row"><div class="form-group"><label>Layout Type</label><select class="form-control" name="layout_type">' +
            ['banner','card_ui','video','category_grid'].map(function(l){return '<option value="'+l+'"'+(s.layout_type===l?' selected':'')+'>'+l+'</option>';}).join('') +
            '</select></div>' +
        '<div class="form-group"><label>Media Type</label><select class="form-control" name="media_type">' +
            '<option value="image"'+(s.media_type==='image'?' selected':'')+'>Image</option><option value="video"'+(s.media_type==='video'?' selected':'')+'>Video</option></select></div></div>' +
        '<div class="form-group"><label>Image</label><div class="upload-zone" onclick="this.querySelector(\'input\').click()"><i class="bi bi-cloud-arrow-up"></i><p>Click to upload image</p><input type="file" accept="image/*" hidden></div></div>' +
        '<div class="form-group"><label>Video URL</label><input type="url" class="form-control" name="video_url" value="' + (s.video_url||'') + '" placeholder="https://..."></div>' +
        '<div class="form-row"><div class="form-group"><label>CTA Label</label><input type="text" class="form-control" name="cta_label" value="' + Helpers.escapeHtml(s.cta_label||'') + '"></div>' +
        '<div class="form-group"><label>CTA Target Route</label><input type="text" class="form-control" name="cta_target_route" value="' + Helpers.escapeHtml(s.cta_target_route||'') + '" placeholder="/new-arrivals"></div></div>' +
        '<div class="form-row"><div class="form-group"><label>Sort Order</label><input type="number" class="form-control" name="sort_order" value="' + (s.sort_order||1) + '"></div>' +
        '<div class="form-group"><label>Active</label><button type="button" class="toggle-switch ' + (s.is_active !== false ? 'on' : '') + '" onclick="this.classList.toggle(\'on\')"><span class="toggle-knob"></span></button></div></div>' +
        '</form></div><div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveDynamicSection(\'' + (s.id||'') + '\')">Save</button></div>';
}

App.addDynamicSection = function() { Helpers.openModal(_dynamicSectionForm()); };
App.editDynamicSection = function(id) { var s = MockData.homeDynamicSections.find(function(x){return x.id===id;}); if(!s) return; Helpers.openModal(_dynamicSectionForm(s)); };

App.saveDynamicSection = function(id) {
    var f = document.getElementById('dsForm'); var fd = new FormData(f);
    if (!fd.get('section_title')) { Helpers.toast('Title is required','error'); return; }
    var isOn = f.querySelector('.toggle-switch').classList.contains('on');
    var entry = {
        section_title: fd.get('section_title'), section_subtitle: fd.get('section_subtitle')||'',
        layout_type: fd.get('layout_type'), media_type: fd.get('media_type'),
        image: fd.get('media_type')==='image' ? 'assets/logo.svg' : '', video_url: fd.get('video_url')||'',
        cta_label: fd.get('cta_label')||'', cta_target_route: fd.get('cta_target_route')||'',
        sort_order: parseInt(fd.get('sort_order'))||1, is_active: isOn
    };
    if (id) { var s = MockData.homeDynamicSections.find(function(x){return x.id===id;}); Object.assign(s, entry); }
    else { entry.id = 'HDS' + String(MockData.homeDynamicSections.length+1).padStart(3,'0'); MockData.homeDynamicSections.push(entry); }
    Helpers.closeModal(); Helpers.toast('Section saved','success'); App.navigate('home-dynamic-sections');
};

App.deleteDynamicSection = function(id) {
    Helpers.confirm('Delete this section?','This cannot be undone.','warning').then(function(r){if(r.isConfirmed){MockData.homeDynamicSections=MockData.homeDynamicSections.filter(function(x){return x.id!==id;});Helpers.toast('Deleted','success');App.navigate('home-dynamic-sections');}});
};
