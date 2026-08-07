'use strict';
/* TATITO FASHIONS — Website Header Settings (Image 23dd55ff)
   Header logo upload, quick links, helpline, sticky header toggle */

App.pages['website-header'] = function() {
    var h = MockData.websiteHeader || {};

    document.getElementById('pageContent').innerHTML =
        '<div class="page-content">' +
        '<div class="page-toolbar"><div><h3>Website Header</h3><p class="text-muted">Header Setting</p></div></div>' +

        '<div class="card" style="max-width:700px"><div class="card-body">' +
        '<div class="form-group"><label>Header Logo</label>' +
        '<div class="upload-field" onclick="document.getElementById(\'headerLogoInput\').click()" style="cursor:pointer;display:flex;align-items:center;gap:12px;padding:14px;border:2px dashed var(--line);border-radius:8px">' +
        '<div class="upload-preview"><img src="assets/tatito-logo.png" style="max-height:40px" onerror="this.style.display=\'none\'"></div>' +
        '<div class="upload-info"><button type="button" class="btn btn-outline btn-sm">Browse</button> <span style="font-size:0.78rem;color:var(--gray-500)">' + (h.logoFile || 'No file selected') + '</span></div>' +
        '</div><input type="file" id="headerLogoInput" accept="image/*" style="display:none" onchange="App._previewUpload(this,\'\',\'\')"></div>' +

        '<div class="form-group"><label>Header Left Quick Link</label>' +
        '<div class="form-row" style="margin-bottom:8px">' +
        '<input type="text" class="form-control" id="quickLinkText" placeholder="Text" value="' + Helpers.escapeHtml(h.quickLinkText || '') + '">' +
        '<input type="text" class="form-control" id="quickLinkUrl" placeholder="Link" value="' + Helpers.escapeHtml(h.quickLinkUrl || '') + '">' +
        '</div></div>' +

        '<div class="form-group"><label>Helpline Number</label><input type="text" class="form-control" id="helplineNumber" value="' + Helpers.escapeHtml(h.helplineNumber || '') + '" placeholder="0000000000"></div>' +

        '<div class="toggle-row"><div class="toggle-info"><strong>Enable Sticky Header?</strong><p class="text-muted">Keep header fixed when scrolling</p></div>' +
        '<button class="toggle-switch ' + (h.stickyHeader ? 'on' : '') + '" onclick="App.toggleStickyHeader()"><span class="toggle-knob"></span></button></div>' +

        '<button class="btn btn-primary" onclick="App.saveWebsiteHeader()"><i class="bi bi-check-lg"></i> Update</button>' +
        '</div></div></div>';
};

App.toggleStickyHeader = function() {
    var h = MockData.websiteHeader; if (!h) return;
    h.stickyHeader = !h.stickyHeader;
    if (typeof Bridge !== 'undefined') { Bridge.Data.saveEntity('websiteHeader', MockData.websiteHeader); }
    Helpers.toast('Sticky header ' + (h.stickyHeader ? 'enabled' : 'disabled'), 'success');
    App.navigate('website-header');
};
App.saveWebsiteHeader = function() {
    var h = MockData.websiteHeader; if (!h) return;
    var get = function(id) { var el = document.getElementById(id); return el ? el.value : ''; };
    h.quickLinkText = get('quickLinkText'); h.quickLinkUrl = get('quickLinkUrl'); h.helplineNumber = get('helplineNumber');
    if (typeof Bridge !== 'undefined') { Bridge.Data.saveEntity('websiteHeader', MockData.websiteHeader); Bridge.Settings.save(MockData.websiteHeader); }
    Helpers.toast('Header settings saved', 'success');
};
