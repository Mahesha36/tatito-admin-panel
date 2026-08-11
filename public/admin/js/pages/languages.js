'use strict';
/* TATITO FASHIONS — Language Management (Image b08dfc4d)
   Default language, language table with RTL toggle, add language */

App.pages.languages = function() {
    var languages = MockData.languages || [];

    document.getElementById('pageContent').innerHTML =
        '<div class="page-content">' +
        '<div class="page-toolbar"><div><h3>Languages</h3><p class="text-muted">Manage website languages</p></div></div>' +

        '<div class="form-section" style="max-width:400px;margin-bottom:20px">' +
        '<h4 style="font-size:0.88rem;font-weight:700;margin-bottom:16px"><i class="bi bi-translate" style="color:var(--gold)"></i> Default Language</h4>' +
        '<div class="form-group"><label>Select Default Language</label>' +
        '<select class="form-control" id="defaultLang">' +
        languages.map(function(l) { return '<option value="' + l.code + '"' + (l.isDefault ? ' selected' : '') + '>' + l.name + '</option>'; }).join('') +
        '</select></div>' +
        '<button class="btn btn-primary" onclick="App.saveDefaultLang()"><i class="bi bi-check-lg"></i> Save</button>' +
        '</div>' +

        '<div class="card"><div class="card-header"><h3>All Languages</h3></div><div class="card-body">' +
        '<table class="table table-hover" id="langTable">' +
        '<thead><tr><th>#</th><th>Name</th><th>Code</th><th>RTL</th><th>Default</th><th>Options</th></tr></thead>' +
        '<tbody>' + languages.map(function(l, i) {
            return '<tr><td>' + (i + 1) + '</td><td><strong>' + l.name + '</strong></td>' +
                '<td><code>' + l.code + '</code></td>' +
                '<td><button class="toggle-switch ' + (l.rtl ? 'on' : '') + '" onclick="App.toggleLangRTL(\'' + l.id + '\')"><span class="toggle-knob"></span></button></td>' +
                '<td>' + (l.isDefault ? '<span class="badge badge-gold">Default</span>' : '\u2014') + '</td>' +
                '<td><div class="table-actions">' +
                '<button class="action-btn edit" onclick="App.editLanguage(\'' + l.id + '\')"><i class="bi bi-pencil"></i></button>' +
                '<button class="action-btn delete" onclick="App.deleteLanguage(\'' + l.id + '\')"><i class="bi bi-trash"></i></button>' +
                '</div></td></tr>';
        }).join('') +
        '</tbody></table></div></div>' +

        '<div class="form-section" style="max-width:500px;margin-top:20px">' +
        '<h4 style="font-size:0.88rem;font-weight:700;margin-bottom:16px"><i class="bi bi-plus-circle" style="color:var(--gold)"></i> Add New Language</h4>' +
        '<div class="form-row"><div class="form-group"><label>Name</label><input type="text" class="form-control" id="newLangName" placeholder="Eg. English"></div>' +
        '<div class="form-group"><label>Code</label><input type="text" class="form-control" id="newLangCode" placeholder="Eg. en"></div></div>' +
        '<button class="btn btn-primary" onclick="App.addLanguage()"><i class="bi bi-check-lg"></i> Save</button>' +
        '</div></div>';

    if (typeof $ !== 'undefined') { try { $('#langTable').DataTable({ pageLength: 10, retrieve: true }); } catch (e) {} }
};

App.saveDefaultLang = function() {
    var sel = document.getElementById('defaultLang');
    var code = sel ? sel.value : 'en';
    MockData.languages.forEach(function(l) { l.isDefault = (l.code === code); });
    Helpers.toast('Default language set to ' + code, 'success');
    App.navigate('languages');
};
App.toggleLangRTL = function(id) {
    var l = MockData.languages.find(function(x) { return x.id === id; }); if (!l) return;
    l.rtl = !l.rtl; Helpers.toast(l.name + ' RTL ' + (l.rtl ? 'enabled' : 'disabled'), 'success');
    App.navigate('languages');
};
App.addLanguage = function() {
    var name = document.getElementById('newLangName');
    var code = document.getElementById('newLangCode');
    if (!name.value.trim() || !code.value.trim()) { Helpers.toast('Name and Code required', 'error'); return; }
    MockData.languages.push({ id: 'LNG' + String(MockData.languages.length + 1).padStart(3, '0'), name: name.value, code: code.value.toLowerCase(), rtl: false, isDefault: false });
    Helpers.toast('Language added', 'success'); App.navigate('languages');
};
App.editLanguage = function(id) {
    var l = MockData.languages.find(function(x) { return x.id === id; }); if (!l) return;
    Helpers.openModal(
        '<div class="modal-header"><h3 class="modal-title">Edit Language</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="editLangForm"><div class="form-row">' +
        '<div class="form-group"><label>Name</label><input type="text" class="form-control" name="name" value="' + l.name + '"></div>' +
        '<div class="form-group"><label>Code</label><input type="text" class="form-control" name="code" value="' + l.code + '"></div></div></form></div>' +
        '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.updateLanguage(\'' + id + '\')">Save</button></div>'
    );
};
App.updateLanguage = function(id) {
    var l = MockData.languages.find(function(x) { return x.id === id; }); if (!l) return;
    var form = document.getElementById('editLangForm'); l.name = form.elements.name.value; l.code = form.elements.code.value.toLowerCase();
    Helpers.closeModal(); Helpers.toast('Language updated', 'success'); App.navigate('languages');
};
App.deleteLanguage = function(id) {
    Helpers.confirm('Delete this language?', 'This action cannot be undone.', 'warning').then(function(r) {
        if (r.isConfirmed) { MockData.languages = MockData.languages.filter(function(l) { return l.id !== id; }); Helpers.toast('Language deleted', 'success'); App.navigate('languages'); }
    });
};
