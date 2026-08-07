'use strict';
/* TATITO FASHIONS — Media Manager
   ================================================================
   NEW: This page now shows REAL frontend image assets via
   Bridge.Catalog.getMediaAssets(). It scans all store images,
   product images, and category images from the frontend data.js
   and displays them in a browsable gallery. Admin-uploaded files
   (from MockData.mediaFiles) are still shown alongside.

   OLD CODE: The original code only showed MockData.mediaFiles
   (14 fake files). It is preserved below, with the NEW frontend
   media gallery added on top.
   ================================================================ */

App.pages.mediaManager = function() {
    /* ---- NEW: Fetch real frontend media assets via Bridge.Catalog ---- */
    var frontendAssets = (typeof Bridge !== 'undefined' && Bridge.Catalog) ? Bridge.Catalog.getMediaAssets() : [];
    var adminFiles = MockData.mediaFiles || [];

    /* Combine stats */
    var totalImages = frontendAssets.length + adminFiles.length;
    var storeImages = frontendAssets.filter(function(a) { return a.source === 'store'; }).length;
    var productImages = frontendAssets.filter(function(a) { return a.source === 'product' || a.source === 'product-gallery'; }).length;
    var categoryImages = frontendAssets.filter(function(a) { return a.source === 'category'; }).length;

    document.getElementById('pageContent').innerHTML =
        '<div class="page-content">' +
        '<div class="page-toolbar"><div><h3>Media Manager</h3><p class="text-muted">Image assets and uploads</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-primary" onclick="App.uploadMedia()"><i class="bi bi-cloud-arrow-up"></i> Upload</button></div></div>' +

        '<div class="stat-grid">' +
        '<div class="stat-card"><div class="stat-icon blue"><i class="bi bi-image"></i></div><div class="stat-body"><div class="stat-label">Total Images</div><div class="stat-value">' + totalImages + '</div></div></div>' +
        '<div class="stat-card"><div class="stat-icon green"><i class="bi bi-shop"></i></div><div class="stat-body"><div class="stat-label">Store Images</div><div class="stat-value">' + storeImages + '</div></div></div>' +
        '<div class="stat-card"><div class="stat-icon gold"><i class="bi bi-bag"></i></div><div class="stat-body"><div class="stat-label">Product Images</div><div class="stat-value">' + productImages + '</div></div></div>' +
        '<div class="stat-card"><div class="stat-icon red"><i class="bi bi-grid"></i></div><div class="stat-body"><div class="stat-label">Category Images</div><div class="stat-value">' + categoryImages + '</div></div></div>' +
        '</div>' +

        /* ---- NEW: Frontend Media Gallery (real assets) ---- */
        '<div class="card" style="margin-bottom:16px"><div class="card-header" style="display:flex;justify-content:space-between;align-items:center">' +
        '<h3 style="font-size:0.9rem"><i class="bi bi-images" style="color:var(--gold)"></i> Storefront Media Gallery <span class="text-muted" style="font-size:0.72rem">— real images from frontend data</span></h3>' +
        '<select id="mediaSourceFilter" class="form-control" style="width:auto;font-size:0.8rem" onchange="App._filterMedia()">' +
        '<option value="all">All Sources (' + frontendAssets.length + ')</option>' +
        '<option value="store">Store Images (' + storeImages + ')</option>' +
        '<option value="product">Product Images (' + productImages + ')</option>' +
        '<option value="category">Category Images (' + categoryImages + ')</option>' +
        '</select></div>' +
        '<div class="card-body">' +
        '<div id="mediaGallery" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;max-height:500px;overflow-y:auto">' +
        frontendAssets.map(function(asset) {
            return '<div class="media-item" data-source="' + asset.source + '" style="border:1px solid var(--line);border-radius:8px;overflow:hidden;background:var(--card-bg);position:relative">' +
                '<div style="height:100px;overflow:hidden">' +
                '<img src="' + asset.url + '" style="width:100%;height:100%;object-fit:cover" loading="lazy" onerror="this.parentElement.innerHTML=\'<div style=display:flex;align-items:center;justify-content:center;height:100%;color:var(--gray-400);font-size:0.7rem>Failed</div>\'">' +
                '</div>' +
                '<div style="padding:6px">' +
                '<div style="font-size:0.7rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + Helpers.escapeHtml(asset.name) + '</div>' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px">' +
                '<span class="badge badge-info" style="font-size:0.6rem">' + asset.source + '</span>' +
                '<a href="' + asset.url + '" target="_blank" class="action-btn view" style="padding:2px 4px" title="View full"><i class="bi bi-box-arrow-up-right" style="font-size:0.7rem"></i></a>' +
                '</div>' +
                '</div>' +
            '</div>';
        }).join('') +
        '</div></div></div>' +

        /* ---- Admin Uploaded Files (from MockData) ---- */
        '<div class="card"><div class="card-header"><h3 style="font-size:0.9rem"><i class="bi bi-cloud-arrow-up" style="color:var(--gold)"></i> Admin Uploads</h3></div>' +
        '<div class="card-body">' +
        '<table class="table table-hover" id="adminMediaTable">' +
        '<thead><tr><th>Name</th><th>Type</th><th>Size</th><th>Uploaded By</th><th>Date</th><th>Actions</th></tr></thead>' +
        '<tbody>' + adminFiles.map(function(f) {
            return '<tr>' +
                '<td><strong>' + Helpers.escapeHtml(f.name) + '</strong></td>' +
                '<td><span class="badge badge-info">' + (f.type || 'image') + '</span></td>' +
                '<td>' + (f.size || '—') + '</td>' +
                '<td>' + Helpers.escapeHtml(f.uploadedBy || 'Admin') + '</td>' +
                '<td>' + Helpers.formatDate(f.date) + '</td>' +
                '<td><button class="action-btn delete" onclick="App.deleteMedia(\'' + f.id + '\')"><i class="bi bi-trash"></i></button></td>' +
            '</tr>';
        }).join('') +
        '</tbody></table></div></div></div>';
};

/* ---- NEW: Filter media gallery by source ---- */
App._filterMedia = function() {
    var filter = document.getElementById('mediaSourceFilter').value;
    var items = document.querySelectorAll('.media-item');
    items.forEach(function(item) {
        if (filter === 'all' || item.getAttribute('data-source').indexOf(filter) !== -1) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
};

/* ================================================================
   Admin upload functions — preserved from original code.
   NEW: Added Bridge.Data persistence.
   ================================================================ */

App.uploadMedia = function() {
    Helpers.openModal(
        '<div class="modal-header"><h3 class="modal-title">Upload Media</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body">' +
        '<div id="uploadPreview" style="min-height:80px;margin-bottom:12px"></div>' +
        '<div class="upload-zone" style="padding:30px;text-align:center;cursor:pointer;border:2px dashed var(--line);border-radius:8px" onclick="document.getElementById(\'mediaFileInput\').click()">' +
        '<i class="bi bi-cloud-arrow-up" style="font-size:2rem;color:var(--gold)"></i>' +
        '<p style="margin-top:8px;color:var(--gray-500)">Click to select files</p>' +
        '<input type="file" id="mediaFileInput" accept="image/*,video/*" multiple hidden onchange="App.handleMediaUpload(this)">' +
        '</div>' +
        '</div>' +
        '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.confirmUpload()">Upload</button></div>'
    );
};

App._mediaUploadBuffer = [];

App.handleMediaUpload = function(input) {
    if (!input.files || input.files.length === 0) return;
    App._mediaUploadBuffer = [];
    var preview = document.getElementById('uploadPreview');
    preview.innerHTML = '';
    Array.from(input.files).forEach(function(file, idx) {
        App._mediaUploadBuffer.push(file);
        var reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML += '<div style="display:inline-block;margin:4px"><div style="width:60px;height:60px;border-radius:6px;overflow:hidden;border:1px solid var(--line)"><img src="' + e.target.result + '" style="width:100%;height:100%;object-fit:cover"></div><div style="font-size:0.65rem;text-align:center;color:var(--gray-500);max-width:60px;overflow:hidden;text-overflow:ellipsis">' + file.name + '</div></div>';
        };
        reader.readAsDataURL(file);
    });
};

App.confirmUpload = function() {
    if (App._mediaUploadBuffer.length === 0) {
        Helpers.toast('No files selected', 'error');
        return;
    }
    App._mediaUploadBuffer.forEach(function(file) {
        MockData.mediaFiles.push({
            id: 'MED' + String(MockData.mediaFiles.length + 1).padStart(3, '0'),
            name: file.name,
            type: file.type.startsWith('video') ? 'video' : 'image',
            size: Math.round(file.size / (1024 * 1024) * 10) / 10 + ' MB',
            uploadedBy: 'Admin',
            date: new Date().toISOString().split('T')[0],
            url: ''
        });
    });
    /* ---- NEW: Persist via Bridge ---- */
    if (typeof Bridge !== 'undefined') { Bridge.Data.saveEntity('mediaFiles', MockData.mediaFiles); }
    App._mediaUploadBuffer = [];
    Helpers.closeModal();
    Helpers.toast('Files uploaded successfully', 'success');
    App.navigate('mediaManager');
};

App.deleteMedia = function(id) {
    Helpers.confirm('Delete this file?', 'This action cannot be undone.', 'warning').then(function(r) {
        if (r.isConfirmed) {
            MockData.mediaFiles = MockData.mediaFiles.filter(function(f) { return f.id !== id; });
            /* ---- NEW: Persist via Bridge ---- */
            if (typeof Bridge !== 'undefined') { Bridge.Data.saveEntity('mediaFiles', MockData.mediaFiles); }
            Helpers.toast('File deleted', 'success');
            App.navigate('mediaManager');
        }
    });
};
