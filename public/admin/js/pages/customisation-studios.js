'use strict';
/* MODULE 2: Customisation Atelier — Studios */

App.pages['customisation-studios'] = function() {
    var data = MockData.customisationStudios;
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Customisation Studios</h3><p class="text-muted">Bespoke atelier departments</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-primary" onclick="App.addStudio()"><i class="bi bi-plus-lg"></i> Add Studio</button></div></div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="csTable"><thead><tr><th>ID</th><th>Studio Name</th><th>Type</th><th>Subtitle</th><th>Icon</th><th>Badge</th><th>Status</th><th>Actions</th></tr></thead><tbody>' +
        data.map(function(s) {
            return '<tr><td>' + s.id + '</td><td><strong>' + Helpers.escapeHtml(s.category_name) + '</strong></td>' +
                '<td><span class="badge badge-info">' + s.type + '</span></td>' +
                '<td>' + Helpers.escapeHtml(s.subtitle) + '</td>' +
                '<td><i class="bi ' + s.icon_name + '" style="font-size:1.2rem;color:var(--gold)"></i></td>' +
                '<td><span class="badge badge-gold">' + Helpers.escapeHtml(s.badge_text) + '</span></td>' +
                '<td><span class="badge ' + (s.is_active?'badge-success':'badge-danger') + '">' + (s.is_active?'Active':'Inactive') + '</span></td>' +
                '<td><div class="table-actions"><button class="action-btn edit" onclick="App.editStudio(\''+s.id+'\')"><i class="bi bi-pencil"></i></button>' +
                '<button class="action-btn delete" onclick="App.deleteStudio(\''+s.id+'\')"><i class="bi bi-trash"></i></button></div></td></tr>';
        }).join('') + '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') $('#csTable').DataTable({ pageLength: 10 });
};
function _studioForm(s) {
    s=s||{};
    return '<div class="modal-header"><h3 class="modal-title">' + (s.id?'Edit':'Add') + ' Studio</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="csForm">' +
        '<div class="form-group"><label>Studio Name *</label><input type="text" class="form-control" name="category_name" value="'+Helpers.escapeHtml(s.category_name||'')+'" required></div>' +
        '<div class="form-group"><label>Subtitle</label><input type="text" class="form-control" name="subtitle" value="'+Helpers.escapeHtml(s.subtitle||'')+'"></div>' +
        '<div class="form-row"><div class="form-group"><label>Type</label><select class="form-control" name="type"><option value="men"'+(s.type==='men'?' selected':'')+'>Men</option><option value="women"'+(s.type==='women'?' selected':'')+'>Women</option><option value="jewellery"'+(s.type==='jewellery'?' selected':'')+'>Jewellery</option></select></div>' +
        '<div class="form-group"><label>Icon (Bootstrap)</label><input type="text" class="form-control" name="icon_name" value="'+(s.icon_name||'bi-gear')+'"></div></div>' +
        '<div class="form-group"><label>Badge Text</label><input type="text" class="form-control" name="badge_text" value="'+Helpers.escapeHtml(s.badge_text||'')+'"></div>' +
        '<div class="form-group"><label>Active</label><button type="button" class="toggle-switch '+(s.is_active!==false?'on':'')+'" onclick="this.classList.toggle(\'on\')"><span class="toggle-knob"></span></button></div>' +
        '</form></div><div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveStudio(\''+(s.id||'')+'\')">Save</button></div>';
}
App.addStudio=function(){Helpers.openModal(_studioForm());};
App.editStudio=function(id){var s=MockData.customisationStudios.find(function(x){return x.id===id;});if(!s)return;Helpers.openModal(_studioForm(s));};
App.saveStudio=function(id){var f=document.getElementById('csForm');var fd=new FormData(f);if(!fd.get('category_name')){Helpers.toast('Name required','error');return;}var entry={category_name:fd.get('category_name'),subtitle:fd.get('subtitle')||'',type:fd.get('type'),icon_name:fd.get('icon_name'),badge_text:fd.get('badge_text')||'',is_active:f.querySelector('.toggle-switch').classList.contains('on')};if(id){Object.assign(MockData.customisationStudios.find(function(x){return x.id===id;}),entry);}else{entry.id='CS'+String(MockData.customisationStudios.length+1).padStart(3,'0');MockData.customisationStudios.push(entry);}Helpers.closeModal();Helpers.toast('Saved','success');App.navigate('customisation-studios');};
App.deleteStudio=function(id){Helpers.confirm('Delete this studio?','','warning').then(function(r){if(r.isConfirmed){MockData.customisationStudios=MockData.customisationStudios.filter(function(x){return x.id!==id;});Helpers.toast('Deleted','success');App.navigate('customisation-studios');}});};
