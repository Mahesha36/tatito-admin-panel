'use strict';
/* TATITO FASHIONS — Email Templates (Enhanced)
   Template list sidebar + CKEditor rich text editor + [[variables]]
   Activation toggle, subject, body, variables note */

App.pages.emailTemplates = function() {
    var templates = MockData.emailTemplates || [];
    App._selectedTemplate = App._selectedTemplate || (templates[0] ? templates[0].id : null);

    document.getElementById('pageContent').innerHTML =
        '<div class="page-content">' +
        '<div class="page-toolbar"><div><h3>Email Templates</h3><p class="text-muted">Manage automated email templates with rich text</p></div></div>' +

        '<div style="display:grid;grid-template-columns:280px 1fr;gap:20px">' +

        '<div class="card" style="padding:0">' +
        '<div style="padding:14px 16px;border-bottom:1px solid var(--line);font-weight:700;font-size:0.85rem"><i class="bi bi-list-ul" style="color:var(--gold)"></i> Templates</div>' +
        '<div style="max-height:560px;overflow-y:auto">' +
        templates.map(function(t) {
            return '<div onclick="App.selectTemplate(\'' + t.id + '\')" style="padding:10px 16px;cursor:pointer;border-bottom:1px solid rgba(0,0,0,0.03);display:flex;align-items:center;gap:8px;background:' + (App._selectedTemplate === t.id ? 'var(--ivory)' : 'white') + '">' +
                '<i class="bi ' + (t.status === 'active' ? 'bi-envelope-check' : 'bi-envelope') + '" style="color:' + (t.status === 'active' ? 'var(--gold)' : 'var(--gray-400)') + ';font-size:0.85rem"></i>' +
                '<div style="flex:1;min-width:0"><div style="font-size:0.8rem;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + Helpers.escapeHtml(t.name) + '</div><div style="font-size:0.7rem;color:var(--gray-500)">' + (t.activation ? 'Active' : 'Inactive') + '</div></div>' +
                '</div>';
        }).join('') +
        '</div></div>' +

        '<div>' + renderTemplateDetail() + '</div>' +
        '</div></div>';
};

function renderTemplateDetail() {
    var t = MockData.emailTemplates.find(function(x) { return x.id === App._selectedTemplate; });
    if (!t) return '<div class="empty-state"><p>Select a template from the left.</p></div>';

    var isEditing = App._editingTemplate === t.id;

    if (isEditing) {
        return '<div class="card">' +
            '<div class="card-header" style="display:flex;justify-content:space-between;align-items:center">' +
            '<h3 style="font-size:0.9rem"><i class="bi bi-envelope-open" style="color:var(--gold)"></i> Edit: ' + Helpers.escapeHtml(t.name) + '</h3>' +
            '<button class="btn btn-primary btn-sm" onclick="App.saveTemplateEdit(\'' + t.id + '\')"><i class="bi bi-check-lg"></i> Update Settings</button>' +
            '</div>' +
            '<div class="card-body">' +
            '<div class="toggle-row" style="margin-bottom:16px"><div class="toggle-info"><strong>Activation</strong><p class="text-muted">Enable or disable this email template</p></div>' +
            '<button class="toggle-switch ' + (t.activation ? 'on' : '') + '" onclick="App.toggleTemplateActivation(\'' + t.id + '\')"><span class="toggle-knob"></span></button></div>' +

            '<div class="form-group"><label>Subject</label><input type="text" class="form-control" id="tplSubject" value="' + Helpers.escapeHtml(t.subject || '') + '"></div>' +
            '<div class="form-group"><label>Email Body</label><div id="emailEditor" style="min-height:280px"></div></div>' +
            '<div style="padding:10px 14px;background:#FEF6F0;border:1px solid #F4D7C4;border-radius:8px;font-size:0.78rem;color:#A0460F"><strong>N.B:</strong> Do Not Change The Variables Like [[ ____ ]].</div>' +
            '</div></div>';
    }

    var previewBody = t.body || '<p>No template body defined.</p>';
    return '<div class="card">' +
        '<div class="card-header" style="display:flex;justify-content:space-between;align-items:center">' +
        '<div><h3 style="font-size:0.9rem"><i class="bi bi-envelope" style="color:var(--gold)"></i> ' + Helpers.escapeHtml(t.name) + '</h3>' +
        '<p class="text-muted" style="font-size:0.75rem">Trigger: ' + Helpers.escapeHtml(t.trigger || '') + '</p></div>' +
        '<div style="display:flex;gap:8px">' +
        '<button class="btn btn-outline btn-sm" onclick="App.previewEmailTemplate(\'' + t.id + '\')"><i class="bi bi-eye"></i> Preview</button>' +
        '<button class="btn btn-primary btn-sm" onclick="App.editTemplate(\'' + t.id + '\')"><i class="bi bi-pencil"></i> Edit Template</button>' +
        '</div></div>' +
        '<div class="card-body">' +
        '<div class="toggle-row" style="margin-bottom:16px"><div class="toggle-info"><strong>Activation</strong><p class="text-muted">' + (t.activation ? 'This template is active' : 'This template is inactive') + '</p></div>' +
        '<button class="toggle-switch ' + (t.activation ? 'on' : '') + '" onclick="App.toggleTemplateActivation(\'' + t.id + '\')" disabled><span class="toggle-knob"></span></button></div>' +
        '<div class="info-box" style="margin-bottom:16px"><span class="info-label">Subject</span><div style="font-size:0.85rem;margin-top:4px">' + Helpers.escapeHtml(t.subject || '') + '</div></div>' +
        '<div class="info-box"><span class="info-label">Email Body</span><div style="margin-top:8px;padding:16px;background:white;border:1px solid var(--line);border-radius:8px;font-size:0.85rem;line-height:1.6">' + previewBody + '</div></div>' +
        '</div></div>';
}

App.selectTemplate = function(id) {
    App._destroyEditors();
    App._selectedTemplate = id;
    App._editingTemplate = null;
    App.navigate('emailTemplates');
};

App.editTemplate = function(id) {
    App._selectedTemplate = id;
    App._editingTemplate = id;
    App.navigate('emailTemplates');

    setTimeout(function() {
        var t = MockData.emailTemplates.find(function(x) { return x.id === id; });
        if (!t) return;
        if (typeof ClassicEditor !== 'undefined') {
            ClassicEditor.create(document.getElementById('emailEditor'), {
                toolbar: ['heading', '|', 'bold', 'italic', '|', 'link', 'bulletedList', 'numberedList', '|', 'undo', 'redo'],
            }).then(function(editor) {
                App._ckEditorInstances.emailEditor = editor;
                editor.setData(t.body || '');
            }).catch(function(e) { console.warn('CKEditor:', e); });
        }
    }, 300);
};

App.saveTemplateEdit = function(id) {
    var t = MockData.emailTemplates.find(function(x) { return x.id === id; });
    if (!t) return;
    var subjectEl = document.getElementById('tplSubject');
    if (subjectEl) t.subject = subjectEl.value;
    if (App._ckEditorInstances.emailEditor) t.body = App._ckEditorInstances.emailEditor.getData();
    t.lastModified = new Date().toISOString().split('T')[0];

    App._destroyEditors();
    App._editingTemplate = null;
    Helpers.toast('Template updated successfully', 'success');
    App.navigate('emailTemplates');
};

App.toggleTemplateActivation = function(id) {
    var t = MockData.emailTemplates.find(function(x) { return x.id === id; });
    if (!t) return;
    t.activation = !t.activation;
    t.status = t.activation ? 'active' : 'draft';
    Helpers.toast(t.name + ' ' + (t.activation ? 'activated' : 'deactivated'), 'success');
    App.navigate('emailTemplates');
};

App.previewEmailTemplate = function(id) {
    var t = MockData.emailTemplates.find(function(x) { return x.id === id; });
    if (!t) return;
    var sitename = MockData.settings.general.siteName || 'TATITO Fashions';
    var body = (t.body || '').replace(/\[\[sitename\]\]/g, sitename).replace(/\[\[name\]\]/g, 'Priya Sharma').replace(/\[\[email\]\]/g, 'priya@example.com').replace(/\[\[order_id\]\]/g, 'ORD001').replace(/\[\[amount\]\]/g, '\u20B925,000').replace(/\[\[tracking_id\]\]/g, 'TRK001234').replace(/\[\[carrier\]\]/g, 'Blue Dart').replace(/\[\[url\]\]/g, 'https://tatitofashions.com/login');

    Helpers.openModal(
        '<div class="modal-header"><h3 class="modal-title">Preview — ' + Helpers.escapeHtml(t.name) + '</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body">' +
        '<div style="background:var(--ivory);padding:24px;border-radius:8px">' +
        '<div style="background:white;padding:32px;border-radius:8px;border:1px solid var(--line);max-width:600px;margin:0 auto">' +
        '<div style="text-align:center;margin-bottom:20px"><img src="assets/logo.svg" style="height:40px" onerror="this.style.display=\'none\'"><h2 style="font-family:var(--font-heading);color:var(--black);margin-top:8px">' + sitename + '</h2></div>' +
        '<h3 style="color:var(--gold-deep)">' + Helpers.escapeHtml(t.subject || '') + '</h3>' +
        '<div style="color:var(--gray-600);line-height:1.6">' + body + '</div>' +
        '<div style="border-top:1px solid var(--line);padding-top:16px;margin-top:20px;text-align:center;font-size:0.78rem;color:var(--gray-400)">© 2026 ' + sitename + '</div>' +
        '</div></div></div>' +
        '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Close</button></div>',
        'modal-lg'
    );
};
