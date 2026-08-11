'use strict';
/* MODULE 2: Customisation Atelier — Options & Swatches */

App.pages['customisation-options'] = function() {
    var data = MockData.customisationOptions;
    var typeIcons = { brand: 'bi-tag', fabric: 'bi-layers', color_swatch: 'bi-palette' };
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Options & Swatches</h3><p class="text-muted">Brands, fabrics and color swatches</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-primary" onclick="App.addCustomOption()"><i class="bi bi-plus-lg"></i> Add Option</button></div></div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="coTable"><thead><tr><th>ID</th><th>Type</th><th>Name</th><th>Color</th><th>Actions</th></tr></thead><tbody>' +
        data.map(function(o) {
            return '<tr><td>' + o.id + '</td>' +
                '<td><span class="badge badge-info"><i class="bi '+(typeIcons[o.type]||'bi-tag')+'"></i> ' + o.type + '</span></td>' +
                '<td><strong>' + Helpers.escapeHtml(o.name) + '</strong></td>' +
                '<td>' + (o.hex_code ? '<div style="display:flex;align-items:center;gap:8px"><div style="width:24px;height:24px;border-radius:4px;background:'+o.hex_code+';border:1px solid #ccc"></div><code>'+o.hex_code+'</code></div>' : '<span class="text-muted">\u2014</span>') + '</td>' +
                '<td><div class="table-actions"><button class="action-btn edit" onclick="App.editCustomOption(\''+o.id+'\')"><i class="bi bi-pencil"></i></button>' +
                '<button class="action-btn delete" onclick="App.deleteCustomOption(\''+o.id+'\')"><i class="bi bi-trash"></i></button></div></td></tr>';
        }).join('') + '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') $('#coTable').DataTable({ pageLength: 10 });
};
function _coForm(o) {
    o=o||{};
    var colorRow = o.type==='color_swatch' || !o.id
        ? '<div class="form-group" id="hexGroup"><label>Color Hex Code</label><div style="display:flex;align-items:center;gap:8px"><input type="color" id="colorPicker" value="'+(o.hex_code||'#C9A24B')+'" style="width:50px;height:38px;border:none;cursor:pointer"><input type="text" class="form-control" name="hex_code" id="hexText" value="'+(o.hex_code||'')+'" placeholder="#C9A24B"></div></div>'
        : '';
    return '<div class="modal-header"><h3 class="modal-title">'+(o.id?'Edit':'Add')+' Option</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="coForm">' +
        '<div class="form-group"><label>Type *</label><select class="form-control" name="type" id="typeSelect" onchange="App._toggleHexField()"><option value="brand"'+(o.type==='brand'?' selected':'')+'>Brand</option><option value="fabric"'+(o.type==='fabric'?' selected':'')+'>Fabric</option><option value="color_swatch"'+(o.type==='color_swatch'?' selected':'')+'>Color Swatch</option></select></div>' +
        '<div class="form-group"><label>Name *</label><input type="text" class="form-control" name="name" value="'+Helpers.escapeHtml(o.name||'')+'" required></div>' +
        colorRow +
        '</form></div><div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveCustomOption(\''+(o.id||'')+'\')">Save</button></div>';
}
App._toggleHexField=function(){var sel=document.getElementById('typeSelect');var grp=document.getElementById('hexGroup');if(!grp)return;if(sel.value==='color_swatch'){grp.style.display='block';}else{grp.style.display='none';}};
App.addCustomOption=function(){Helpers.openModal(_coForm());};
App.editCustomOption=function(id){var o=MockData.customisationOptions.find(function(x){return x.id===id;});if(!o)return;Helpers.openModal(_coForm(o));};
App.saveCustomOption=function(id){var f=document.getElementById('coForm');var fd=new FormData(f);if(!fd.get('name')){Helpers.toast('Name required','error');return;}var type=fd.get('type');var hex=type==='color_swatch'?(fd.get('hex_code')||'#C9A24B'):'';var entry={type:type,name:fd.get('name'),hex_code:hex};if(id){Object.assign(MockData.customisationOptions.find(function(x){return x.id===id;}),entry);}else{entry.id='CO'+String(MockData.customisationOptions.length+1).padStart(3,'0');MockData.customisationOptions.push(entry);}Helpers.closeModal();Helpers.toast('Saved','success');App.navigate('customisation-options');};
App.deleteCustomOption=function(id){Helpers.confirm('Delete this option?','','warning').then(function(r){if(r.isConfirmed){MockData.customisationOptions=MockData.customisationOptions.filter(function(x){return x.id!==id;});Helpers.toast('Deleted','success');App.navigate('customisation-options');}});};