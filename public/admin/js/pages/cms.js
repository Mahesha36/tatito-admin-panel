'use strict';
/* TATITO FASHIONS — CMS Pages Management
   ================================================================
   NEW: This page now shows REAL frontend pages alongside admin-
   created CMS pages. The page list is split into two sections:
   1. "Storefront Pages" — actual frontend HTML pages (read-only,
      linked to the live storefront)
   2. "Custom CMS Pages" — admin-created pages with CKEditor content

   The CKEditor, SEO, and CRUD functionality for custom pages is
   unchanged. Old functions are preserved with Bridge persistence
   added.

   OLD CODE: The original code only showed MockData.cmsPages (6
   fake pages). It is preserved below, with NEW frontend page
   listing added on top.
   ================================================================ */

App.pages.cms = function() {
    var pages = MockData.cmsPages || [];

    /* ---- NEW: Fetch real frontend pages via Bridge.Catalog ---- */
    var frontendPages = (typeof Bridge !== 'undefined' && Bridge.Catalog) ? Bridge.Catalog.getFrontendPages() : [];

    document.getElementById('pageContent').innerHTML =
        '<div class="page-content">' +
        '<div class="page-toolbar"><div><h3>CMS Pages</h3><p class="text-muted">Manage website pages and content</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-primary" onclick="App.addCmsPage()"><i class="bi bi-file-earmark-plus"></i> Add Custom Page</button></div></div>' +

        '<div class="stat-grid">' +
        '<div class="stat-card"><div class="stat-icon blue"><i class="bi bi-file-earmark"></i></div><div class="stat-body"><div class="stat-label">Storefront Pages</div><div class="stat-value">' + frontendPages.length + '</div></div></div>' +
        '<div class="stat-card"><div class="stat-icon green"><i class="bi bi-globe"></i></div><div class="stat-body"><div class="stat-label">Custom Pages</div><div class="stat-value">' + pages.length + '</div></div></div>' +
        '<div class="stat-card"><div class="stat-icon gold"><i class="bi bi-file-earmark-diff"></i></div><div class="stat-body"><div class="stat-label">Published</div><div class="stat-value">' + pages.filter(function(p) { return p.status === 'published'; }).length + '</div></div></div>' +
        '</div>' +

        /* ---- NEW: Storefront Pages section (real frontend pages) ---- */
        '<div class="card" style="margin-bottom:16px"><div class="card-header"><h3 style="font-size:0.9rem"><i class="bi bi-shop-window" style="color:var(--gold)"></i> Storefront Pages <span class="text-muted" style="font-size:0.75rem">— actual pages on the frontend</span></h3></div>' +
        '<div class="card-body">' +
        '<table class="table table-hover" id="frontendPagesTable">' +
        '<thead><tr><th>Page Title</th><th>Slug</th><th>URL</th><th style="width:80px">Actions</th></tr></thead><tbody>' +
        frontendPages.map(function(p) {
            return '<tr>' +
                '<td><strong>' + Helpers.escapeHtml(p.title) + '</strong></td>' +
                '<td><code>/' + p.slug + '</code></td>' +
                '<td><a href="/frontend/' + p.url + '" target="_blank" style="color:var(--gold);font-size:0.82rem"><i class="bi bi-box-arrow-up-right"></i> /frontend/' + p.url + '</a></td>' +
                '<td><a href="/frontend/' + p.url + '" target="_blank" class="action-btn view" title="Open on storefront"><i class="bi bi-eye"></i></a></td>' +
            '</tr>';
        }).join('') +
        '</tbody></table></div></div>' +

        /* ---- Custom CMS Pages (admin-created) ---- */
        '<div class="card"><div class="card-header"><h3 style="font-size:0.9rem"><i class="bi bi-file-earmark-text" style="color:var(--gold)"></i> Custom CMS Pages</h3></div><div class="card-body">' +
        '<table class="table table-hover" id="cmsTable">' +
        '<thead><tr><th>Title</th><th>Slug</th><th>Status</th><th>Author</th><th>Last Updated</th><th>Actions</th></tr></thead>' +
        '<tbody>' + pages.map(function(p) {
            return '<tr>' +
                '<td><strong>' + Helpers.escapeHtml(p.title) + '</strong></td>' +
                '<td><code>/' + p.slug + '</code></td>' +
                '<td><span class="badge ' + Helpers.statusBadge(p.status) + '">' + Helpers.capitalize(p.status) + '</span></td>' +
                '<td>' + Helpers.escapeHtml(p.author || 'Admin') + '</td>' +
                '<td>' + Helpers.formatDate(p.lastUpdated) + '</td>' +
                '<td><div class="table-actions">' +
                '<button class="action-btn edit" onclick="App.editCmsPage(\'' + p.id + '\')" title="Edit"><i class="bi bi-pencil"></i></button>' +
                '<button class="action-btn view" onclick="App.viewCmsPage(\'' + p.id + '\')" title="View"><i class="bi bi-eye"></i></button>' +
                '<button class="action-btn delete" onclick="App.deleteCmsPage(\'' + p.id + '\')" title="Delete"><i class="bi bi-trash"></i></button>' +
                '</div></td></tr>';
        }).join('') +
        '</tbody></table></div></div></div>';

    if (typeof $ !== 'undefined') {
        try { $('#cmsTable').DataTable({ pageLength: 10, retrieve: true }); } catch (e) {}
        try { $('#frontendPagesTable').DataTable({ pageLength: 10, retrieve: true }); } catch (e) {}
    }
};

App._ckEditorInstances = App._ckEditorInstances || {};

App._destroyEditors = function() {
    Object.keys(App._ckEditorInstances).forEach(function(key) {
        if (App._ckEditorInstances[key]) {
            try { App._ckEditorInstances[key].destroy(); } catch (e) {}
            delete App._ckEditorInstances[key];
        }
    });
};

/* ================================================================
   Custom CMS Page CRUD — preserved from original code.
   NEW: Added Bridge.Data persistence so changes survive page reload.
   ================================================================ */

App.addCmsPage = function() {
    App._destroyEditors();
    Helpers.openModal(
        '<div class="modal-header"><h3 class="modal-title">Create New Page</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="addCmsForm">' +
        '<div class="form-row">' +
        '<div class="form-group"><label>Page Title <span class="required">*</span></label><input type="text" class="form-control" name="title" required></div>' +
        '<div class="form-group"><label>Slug</label><input type="text" class="form-control" name="slug" placeholder="auto-generated"></div>' +
        '</div>' +
        '<div class="form-row">' +
        '<div class="form-group"><label>Status</label><select class="form-control" name="status"><option value="draft">Draft</option><option value="published">Published</option></select></div>' +
        '<div class="form-group"><label>Author</label><input type="text" class="form-control" name="author" value="Admin"></div>' +
        '</div>' +
        '<div class="form-group"><label>Meta Description (SEO)</label><textarea class="form-control" rows="2" name="metaDesc" placeholder="Short description for search engines"></textarea></div>' +
        '<div class="form-group"><label>Page Content</label><div id="cmsEditor" style="min-height:300px"></div></div>' +
        '</form></div>' +
        '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveCmsPage()"><i class="bi bi-check-lg"></i> Create Page</button></div>',
        'modal-xl'
    );

    setTimeout(function() {
        if (typeof ClassicEditor !== 'undefined') {
            ClassicEditor.create(document.getElementById('cmsEditor'), {
                toolbar: ['heading', '|', 'bold', 'italic', '|', 'link', 'bulletedList', 'numberedList', '|', 'undo', 'redo'],
            }).then(function(editor) {
                App._ckEditorInstances.cmsEditor = editor;
                editor.setData('<h2>New Page</h2><p>Start writing your content here...</p>');
            }).catch(function(e) { console.warn('CKEditor:', e); });
        }
    }, 300);
};

App.saveCmsPage = function() {
    var form = document.getElementById('addCmsForm');
    if (!form) return;
    var title = form.elements.title.value.trim();
    if (!title) { Helpers.toast('Page title is required', 'error'); return; }

    var slug = form.elements.slug.value.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    var content = App._ckEditorInstances.cmsEditor ? App._ckEditorInstances.cmsEditor.getData() : '';

    MockData.cmsPages.push({
        id: 'CMS' + String(MockData.cmsPages.length + 1).padStart(3, '0'),
        title: title, slug: slug, status: form.elements.status.value,
        author: form.elements.author.value || 'Admin',
        lastUpdated: new Date().toISOString().split('T')[0],
        content: content,
        metaDesc: form.elements.metaDesc ? form.elements.metaDesc.value : '',
    });

    /* ---- NEW: Persist via Bridge ---- */
    if (typeof Bridge !== 'undefined') { Bridge.Data.saveEntity('cmsPages', MockData.cmsPages); }

    App._destroyEditors();
    Helpers.closeModal();
    Helpers.toast('Page created successfully', 'success');
    App.navigate('cms');
};

App.editCmsPage = function(id) {
    var p = MockData.cmsPages.find(function(x) { return x.id === id; });
    if (!p) return;
    App._destroyEditors();

    Helpers.openModal(
        '<div class="modal-header"><h3 class="modal-title">Edit Page — ' + Helpers.escapeHtml(p.title) + '</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="editCmsForm">' +
        '<div class="form-row">' +
        '<div class="form-group"><label>Page Title</label><input type="text" class="form-control" name="title" value="' + Helpers.escapeHtml(p.title) + '"></div>' +
        '<div class="form-group"><label>Slug</label><input type="text" class="form-control" name="slug" value="' + p.slug + '"></div>' +
        '</div>' +
        '<div class="form-row">' +
        '<div class="form-group"><label>Status</label><select class="form-control" name="status"><option value="published"' + (p.status === 'published' ? ' selected' : '') + '>Published</option><option value="draft"' + (p.status === 'draft' ? ' selected' : '') + '>Draft</option></select></div>' +
        '<div class="form-group"><label>Author</label><input type="text" class="form-control" name="author" value="' + Helpers.escapeHtml(p.author || 'Admin') + '"></div>' +
        '</div>' +
        '<div class="form-group"><label>Meta Description (SEO)</label><textarea class="form-control" rows="2" name="metaDesc">' + Helpers.escapeHtml(p.metaDesc || '') + '</textarea></div>' +
        '<div class="form-group"><label>Page Content</label><div id="cmsEditor" style="min-height:300px"></div></div>' +
        '</form></div>' +
        '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.updateCmsPage(\'' + id + '\')"><i class="bi bi-check-lg"></i> Update</button></div>',
        'modal-xl'
    );

    setTimeout(function() {
        if (typeof ClassicEditor !== 'undefined') {
            ClassicEditor.create(document.getElementById('cmsEditor'), {
                toolbar: ['heading', '|', 'bold', 'italic', '|', 'link', 'bulletedList', 'numberedList', '|', 'undo', 'redo'],
            }).then(function(editor) {
                App._ckEditorInstances.cmsEditor = editor;
                editor.setData(p.content || '<h2>' + Helpers.escapeHtml(p.title) + '</h2><p>Page content goes here.</p>');
            }).catch(function(e) { console.warn('CKEditor:', e); });
        }
    }, 300);
};

App.updateCmsPage = function(id) {
    var p = MockData.cmsPages.find(function(x) { return x.id === id; });
    if (!p) return;
    var form = document.getElementById('editCmsForm');
    p.title = form.elements.title.value;
    p.slug = form.elements.slug.value;
    p.status = form.elements.status.value;
    p.author = form.elements.author.value;
    p.lastUpdated = new Date().toISOString().split('T')[0];
    p.content = App._ckEditorInstances.cmsEditor ? App._ckEditorInstances.cmsEditor.getData() : (p.content || '');
    p.metaDesc = form.elements.metaDesc.value;

    /* ---- NEW: Persist via Bridge ---- */
    if (typeof Bridge !== 'undefined') { Bridge.Data.saveEntity('cmsPages', MockData.cmsPages); }

    App._destroyEditors();
    Helpers.closeModal();
    Helpers.toast('Page updated successfully', 'success');
    App.navigate('cms');
};

App.viewCmsPage = function(id) {
    var p = MockData.cmsPages.find(function(x) { return x.id === id; });
    if (!p) return;
    Helpers.openModal(
        '<div class="modal-header"><h3 class="modal-title">' + Helpers.escapeHtml(p.title) + '</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body">' +
        '<div style="background:var(--ivory);padding:24px;border-radius:8px;margin-bottom:16px">' +
        '<div style="background:white;padding:32px;border-radius:8px;border:1px solid var(--line)">' +
        '<div style="text-align:center;margin-bottom:20px">' +
        /* ---- NEW: Updated logo from logo.svg to tatito-logo.png ---- */
        '<img src="assets/tatito-logo.png" style="height:40px" onerror="this.style.display=\'none\'">' +
        '<h2 style="font-family:var(--font-heading);color:var(--black);margin-top:8px">' + Helpers.escapeHtml(p.title) + '</h2>' +
        '<small style="color:var(--gray-400)">/' + p.slug + '</small>' +
        '</div>' +
        (p.content || '<p>No content available.</p>') +
        '</div></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
        '<div class="info-box"><span class="info-label">Status</span><span class="info-value"><span class="badge ' + Helpers.statusBadge(p.status) + '">' + Helpers.capitalize(p.status) + '</span></span></div>' +
        '<div class="info-box"><span class="info-label">Author</span><span class="info-value">' + Helpers.escapeHtml(p.author || 'Admin') + '</span></div>' +
        '<div class="info-box"><span class="info-label">Last Updated</span><span class="info-value">' + Helpers.formatDate(p.lastUpdated) + '</span></div>' +
        '<div class="info-box"><span class="info-label">Meta Description</span><span class="info-value" style="font-size:0.8rem">' + Helpers.escapeHtml(p.metaDesc || 'N/A') + '</span></div>' +
        '</div>' +
        '</div>' +
        '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Close</button></div>',
        'modal-lg'
    );
};

App.deleteCmsPage = function(id) {
    Helpers.confirm('Delete this page?', 'This action cannot be undone.', 'warning').then(function(r) {
        if (r.isConfirmed) {
            MockData.cmsPages = MockData.cmsPages.filter(function(p) { return p.id !== id; });
            /* ---- NEW: Persist via Bridge ---- */
            if (typeof Bridge !== 'undefined') { Bridge.Data.saveEntity('cmsPages', MockData.cmsPages); }
            Helpers.toast('Page deleted', 'success');
            App.navigate('cms');
        }
    });
};
