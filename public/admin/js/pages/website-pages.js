'use strict';
/* TATITO FASHIONS — Website Pages (Image 2e177b1c)
   List of public website pages with URLs, edit/delete actions */

App.pages['website-pages'] = function() {
    var pages = MockData.websitePages || [];

    document.getElementById('pageContent').innerHTML =
        '<div class="page-content">' +
        '<div class="page-toolbar"><div><h3>Website Pages</h3><p class="text-muted">All Pages</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-primary" onclick="App.addWebsitePage()"><i class="bi bi-file-earmark-plus"></i> Add New Page</button></div></div>' +

        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="wsPagesTable">' +
        '<thead><tr><th>Name</th><th>URL</th><th>Actions</th></tr></thead>' +
        '<tbody>' + pages.map(function(p) {
            var url = 'tatitofashions.com/' + p.slug;
            return '<tr>' +
                '<td><button class="btn btn-sm btn-ghost p-0" onclick="App.togglePageExpand(this)"><i class="bi bi-plus-circle"></i></button> <strong>' + Helpers.escapeHtml(p.title) + '</strong></td>' +
                '<td><code>' + url + '</code></td>' +
                '<td><div class="table-actions">' +
                '<button class="action-btn edit" onclick="App.editWebsitePage(\'' + p.id + '\')" title="Edit"><i class="bi bi-pencil"></i></button>' +
                '<button class="action-btn delete" onclick="App.deleteWebsitePage(\'' + p.id + '\')" title="Delete"><i class="bi bi-trash"></i></button>' +
                '</div></td></tr>';
        }).join('') +
        '</tbody></table></div></div></div>';

    if (typeof $ !== 'undefined') { try { $('#wsPagesTable').DataTable({ pageLength: 10, retrieve: true }); } catch (e) {} }
};

App.togglePageExpand = function(btn) {
    var icon = btn.querySelector('i');
    if (icon.classList.contains('bi-plus-circle')) { icon.classList.remove('bi-plus-circle'); icon.classList.add('bi-dash-circle'); }
    else { icon.classList.remove('bi-dash-circle'); icon.classList.add('bi-plus-circle'); }
};
App.addWebsitePage = function() {
    Helpers.openModal(
        '<div class="modal-header"><h3 class="modal-title">Add New Page</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="addWsPageForm">' +
        '<div class="form-group"><label>Page Name <span class="required">*</span></label><input type="text" class="form-control" name="title" required></div>' +
        '<div class="form-group"><label>Slug</label><input type="text" class="form-control" name="slug" placeholder="auto-generated"></div>' +
        '</form></div><div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveWebsitePage()">Save</button></div>'
    );
};
App.saveWebsitePage = function() {
    var form = document.getElementById('addWsPageForm');
    var title = form.elements.title.value.trim(); if (!title) { Helpers.toast('Page name required', 'error'); return; }
    var slug = form.elements.slug.value.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    MockData.websitePages.push({ id: 'WPG' + String(MockData.websitePages.length + 1).padStart(3, '0'), title: title, slug: slug, status: 'published', lastModified: new Date().toISOString().split('T')[0] });
    Helpers.closeModal(); Helpers.toast('Page added', 'success'); App.navigate('website-pages');
};
App.editWebsitePage = function(id) {
    var p = MockData.websitePages.find(function(x) { return x.id === id; }); if (!p) return;
    App.editCmsPage(id); // reuse CMS editor which has CKEditor
};
App.deleteWebsitePage = function(id) {
    Helpers.confirm('Delete this page?', 'This action cannot be undone.', 'warning').then(function(r) {
        if (r.isConfirmed) { MockData.websitePages = MockData.websitePages.filter(function(p) { return p.id !== id; }); Helpers.toast('Page deleted', 'success'); App.navigate('website-pages'); }
    });
};
