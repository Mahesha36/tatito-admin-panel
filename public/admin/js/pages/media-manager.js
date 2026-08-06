'use strict';
/* TATITO FASHIONS — Media Manager page */
App.pages.mediaManager = function() {
    var files = MockData.mediaFiles || [];
    var iconMap = { image: 'bi-image', video: 'bi-play-circle', document: 'bi-file-earmark-text' };
    var colorMap = { image: '#C9A24B', video: '#3B6CB7', document: '#7C5FCF' };

    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Media Manager</h3><p class="text-muted">Upload and manage website files</p></div>' +
        '<div><button class="btn btn-primary" onclick="App.uploadMedia()"><i class="bi bi-cloud-upload"></i> Upload Files</button></div></div>' +
        '<div class="stat-grid">' +
        '<div class="stat-card"><div class="stat-icon gold"><i class="bi bi-folder"></i></div><div class="stat-info"><p>Total Files</p><h3>' + files.length + '</h3></div></div>' +
        '<div class="stat-card"><div class="stat-icon blue"><i class="bi bi-image"></i></div><div class="stat-info"><p>Images</p><h3>' + files.filter(function(f){return f.type==='image';}).length + '</h3></div></div>' +
        '<div class="stat-card"><div class="stat-icon purple"><i class="bi bi-play-circle"></i></div><div class="stat-info"><p>Videos</p><h3>' + files.filter(function(f){return f.type==='video';}).length + '</h3></div></div>' +
        '<div class="stat-card"><div class="stat-icon green"><i class="bi bi-file-earmark-text"></i></div><div class="stat-info"><p>Documents</p><h3>' + files.filter(function(f){return f.type==='document';}).length + '</h3></div></div>' +
        '</div>' +
        '<div class="card"><div class="card-header"><h4 class="card-title">All Files</h4></div><div class="card-body">' +
        '<div class="media-grid">' + files.map(function(f) {
            return '<div class="media-item">' +
                '<div class="media-icon" style="background:' + (colorMap[f.type] || '#6B655C') + '20;color:' + (colorMap[f.type] || '#6B655C') + '">' +
                '<i class="bi ' + (iconMap[f.type] || 'bi-file') + '"></i></div>' +
                '<div class="media-info"><div class="media-name">' + Helpers.escapeHtml(f.name) + '</div>' +
                '<div class="media-meta">' + f.size + ' · ' + Helpers.formatDate(f.date) + '</div></div>' +
                '<div class="media-actions"><button class="action-btn delete" onclick="App.deleteMedia(\'' + f.id + '\')" title="Delete"><i class="bi bi-trash"></i></button></div>' +
                '</div>';
        }).join('') + '</div></div></div></div>';
};

App.uploadMedia = function() {
    Helpers.openModal(
        '<div class="modal-header"><h3 class="modal-title">Upload Files</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body">' +
        '<div style="border:2px dashed var(--line);border-radius:12px;padding:40px;text-align:center;cursor:pointer" onclick="document.getElementById(\'mediaFileInput\').click()">' +
        '<i class="bi bi-cloud-upload" style="font-size:2.5rem;color:var(--gold)"></i>' +
        '<p style="margin-top:12px;font-weight:600;color:var(--black)">Click to browse or drag files here</p>' +
        '<p style="font-size:0.82rem;color:var(--gray-400)">Supported: JPG, PNG, MP4, PDF · Max 50MB</p>' +
        '<input type="file" id="mediaFileInput" multiple style="display:none" onchange="App.handleMediaUpload(this)"></div>' +
        '<div id="uploadPreview" style="margin-top:16px"></div>' +
        '</div>' +
        '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.confirmUpload()"><i class="bi bi-check-lg"></i> Upload</button></div>',
        'modal-lg'
    );
};

App._pendingUploads = [];
App.handleMediaUpload = function(input) {
    var preview = document.getElementById('uploadPreview');
    var html = '';
    App._pendingUploads = [];
    for (var i = 0; i < input.files.length; i++) {
        var f = input.files[i];
        var type = f.type.startsWith('image/') ? 'image' : f.type.startsWith('video/') ? 'video' : 'document';
        var size = (f.size / 1024).toFixed(0) + ' KB';
        if (f.size > 1024 * 1024) size = (f.size / (1024*1024)).toFixed(1) + ' MB';
        App._pendingUploads.push({ name: f.name, type: type, size: size });
        html += '<div style="display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:8px;background:var(--ivory);margin-bottom:8px">' +
            '<i class="bi ' + (type === 'image' ? 'bi-image' : type === 'video' ? 'bi-play-circle' : 'bi-file-earmark') + '" style="color:var(--gold)"></i>' +
            '<div style="flex:1"><div style="font-weight:600;font-size:0.85rem">' + Helpers.escapeHtml(f.name) + '</div><div style="font-size:0.75rem;color:var(--gray-400)">' + size + '</div></div>' +
            '</div>';
    }
    preview.innerHTML = html;
};

App.confirmUpload = function() {
    App._pendingUploads.forEach(function(f) {
        var newId = 'MED' + String(MockData.mediaFiles.length + 1).padStart(3, '0');
        MockData.mediaFiles.push({
            id: newId, name: f.name, type: f.type, size: f.size,
            uploadedBy: 'Admin', date: new Date().toISOString().split('T')[0], url: ''
        });
    });
    App._pendingUploads = [];
    Helpers.closeModal();
    Helpers.toast('Files uploaded successfully', 'success');
    App.navigate('mediaManager');
};

App.deleteMedia = function(id) {
    Helpers.confirm('Delete this file?', 'This action cannot be undone.', 'warning').then(function(r) {
        if (r.isConfirmed) {
            var idx = MockData.mediaFiles.findIndex(function(x) { return x.id === id; });
            if (idx >= 0) MockData.mediaFiles.splice(idx, 1);
            Helpers.toast('File deleted', 'success');
            App.navigate('mediaManager');
        }
    });
};
