'use strict';
/* MODULE 0: Home Screen — Dynamic Sections
   ================================================================
   NEW: This page now shows the REAL homepage sections from the
   frontend (index.html). Admin can:
   - View all homepage sections with their current visibility
   - Toggle section visibility on/off
   - Reorder sections
   - Edit section title/subtitle
   - Changes persist via Bridge.Data and the frontend reads them
     through FrontendBridge.getAdminHomepageSections()

   OLD CODE: The original MockData.homeDynamicSections CRUD code
   is commented out below. It used fake section data.
   ================================================================ */

App.pages['home-dynamic-sections'] = function() {
    /* ---- NEW: Fetch real homepage sections via Bridge.Catalog ---- */
    var sections = (typeof Bridge !== 'undefined' && Bridge.Catalog) ? Bridge.Catalog.getHomepageSections() : [];

    /* Load admin overrides (visibility, ordering, custom titles) */
    var adminData = (typeof Bridge !== 'undefined') ? Bridge.Data.load() : (MockData || {});
    var sectionOverrides = adminData.homepageSectionSettings || {};
    var hiddenSections = sectionOverrides.hidden || [];
    var customTitles = sectionOverrides.customTitles || {};
    var customOrder = sectionOverrides.order || {};

    /* Apply custom order if set */
    if (Object.keys(customOrder).length > 0) {
        sections.sort(function(a, b) {
            var oa = customOrder[a.id] !== undefined ? customOrder[a.id] : a.sortOrder;
            var ob = customOrder[b.id] !== undefined ? customOrder[b.id] : b.sortOrder;
            return oa - ob;
        });
    }

    document.getElementById('pageContent').innerHTML =
        '<div class="page-content">' +
        '<div class="page-toolbar"><div><h3>Dynamic Sections</h3><p class="text-muted">Homepage section layout — control visibility and order</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-outline btn-sm" onclick="App._resetSectionSettings()"><i class="bi bi-arrow-clockwise"></i> Reset</button></div></div>' +

        /* ---- NEW: Info banner ---- */
        '<div style="padding:10px 14px;border-radius:8px;background:rgba(201,162,75,0.1);border:1px solid rgba(201,162,75,0.3);margin-bottom:16px;font-size:0.82rem;color:var(--gray-600)">' +
        '<i class="bi bi-info-circle" style="color:var(--gold)"></i> These sections appear on the homepage in order. Toggle visibility to show/hide sections on the storefront. Hidden sections remain in code but are not rendered.' +
        '</div>' +

        /* ---- NEW: Sections list ---- */
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="dsTable">' +
        '<thead><tr><th style="width:40px">#</th><th>Section</th><th>Description</th><th style="width:100px">Visible</th><th style="width:120px">Actions</th></tr></thead><tbody>' +
        sections.map(function(sec, idx) {
            var isVisible = hiddenSections.indexOf(sec.id) === -1;
            var displayTitle = customTitles[sec.id] || sec.title;
            return '<tr>' +
                '<td><span style="font-weight:600;color:var(--gold)">' + (idx + 1) + '</span></td>' +
                '<td><strong>' + Helpers.escapeHtml(displayTitle) + '</strong>' + (customTitles[sec.id] ? ' <span class="badge badge-info" style="font-size:0.6rem">edited</span>' : '') + '<br><code style="font-size:0.7rem;color:var(--gray-500)">' + sec.id + '</code></td>' +
                '<td style="font-size:0.82rem;color:var(--gray-500)">' + Helpers.escapeHtml(sec.subtitle) + '</td>' +
                '<td><button class="toggle-switch ' + (isVisible ? 'on' : '') + '" onclick="App._toggleSectionVisibility(\'' + sec.id + '\')"><span class="toggle-knob"></span></button></td>' +
                '<td><div class="table-actions">' +
                '<button class="action-btn edit" onclick="App._editSectionTitle(\'' + sec.id + '\')" title="Edit title"><i class="bi bi-pencil"></i></button>' +
                '<button class="action-btn" onclick="App._moveSection(\'' + sec.id + '\', -1)" ' + (idx === 0 ? 'disabled' : '') + ' title="Move up"><i class="bi bi-arrow-up"></i></button>' +
                '<button class="action-btn" onclick="App._moveSection(\'' + sec.id + '\', 1)" ' + (idx === sections.length - 1 ? 'disabled' : '') + ' title="Move down"><i class="bi bi-arrow-down"></i></button>' +
                '</div></td>' +
            '</tr>';
        }).join('') +
        '</tbody></table></div></div>' +
        '</div>';
};

/* ---- NEW: Toggle section visibility ---- */
App._toggleSectionVisibility = function(sectionId) {
    var data = Bridge.Data.load();
    if (!data.homepageSectionSettings) data.homepageSectionSettings = { hidden: [], customTitles: {}, order: {} };
    if (!data.homepageSectionSettings.hidden) data.homepageSectionSettings.hidden = [];
    var idx = data.homepageSectionSettings.hidden.indexOf(sectionId);
    if (idx === -1) data.homepageSectionSettings.hidden.push(sectionId);
    else data.homepageSectionSettings.hidden.splice(idx, 1);
    Bridge.Data.saveEntity('homepageSectionSettings', data.homepageSectionSettings);
    Helpers.toast(sectionId + ' is now ' + (idx === -1 ? 'hidden' : 'visible'), 'success');
    App.navigate('home-dynamic-sections');
};

/* ---- NEW: Edit section title ---- */
App._editSectionTitle = function(sectionId) {
    var sections = Bridge.Catalog.getHomepageSections();
    var sec = sections.find(function(x) { return x.id === sectionId; });
    if (!sec) return;
    var data = Bridge.Data.load();
    var customTitles = (data.homepageSectionSettings && data.homepageSectionSettings.customTitles) || {};
    var currentTitle = customTitles[sectionId] || sec.title;
    var html = '<div class="modal-header"><h3 class="modal-title">Edit Section Title</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body">' +
        '<div class="form-group"><label>Section Title</label><input type="text" class="form-control" id="sectionTitleInput" value="' + Helpers.escapeHtml(currentTitle) + '"></div>' +
        '<p class="text-muted" style="font-size:0.8rem">Original: ' + Helpers.escapeHtml(sec.title) + '</p>' +
        '</div>' +
        '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App._saveSectionTitle(\'' + sectionId + '\')">Save</button></div>';
    Helpers.openModal(html);
};

/* ---- NEW: Save section title ---- */
App._saveSectionTitle = function(sectionId) {
    var newTitle = document.getElementById('sectionTitleInput').value;
    var data = Bridge.Data.load();
    if (!data.homepageSectionSettings) data.homepageSectionSettings = { hidden: [], customTitles: {}, order: {} };
    if (!data.homepageSectionSettings.customTitles) data.homepageSectionSettings.customTitles = {};
    data.homepageSectionSettings.customTitles[sectionId] = newTitle;
    Bridge.Data.saveEntity('homepageSectionSettings', data.homepageSectionSettings);
    Helpers.closeModal();
    Helpers.toast('Section title updated', 'success');
    App.navigate('home-dynamic-sections');
};

/* ---- NEW: Move section up/down ---- */
App._moveSection = function(sectionId, direction) {
    var sections = Bridge.Catalog.getHomepageSections();
    var data = Bridge.Data.load();
    if (!data.homepageSectionSettings) data.homepageSectionSettings = { hidden: [], customTitles: {}, order: {} };
    if (!data.homepageSectionSettings.order) data.homepageSectionSettings.order = {};

    var idx = sections.findIndex(function(x) { return x.id === sectionId; });
    var newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= sections.length) return;

    /* Swap order values */
    sections.forEach(function(s, i) {
        data.homepageSectionSettings.order[s.id] = i;
    });
    var tempOrder = data.homepageSectionSettings.order[sectionId];
    var swapId = sections[newIdx].id;
    data.homepageSectionSettings.order[sectionId] = data.homepageSectionSettings.order[swapId];
    data.homepageSectionSettings.order[swapId] = tempOrder;

    Bridge.Data.saveEntity('homepageSectionSettings', data.homepageSectionSettings);
    App.navigate('home-dynamic-sections');
};

/* ---- NEW: Reset section settings ---- */
App._resetSectionSettings = function() {
    var data = Bridge.Data.load();
    data.homepageSectionSettings = { hidden: [], customTitles: {}, order: {} };
    Bridge.Data.saveEntity('homepageSectionSettings', data.homepageSectionSettings);
    Helpers.toast('Section settings reset', 'success');
    App.navigate('home-dynamic-sections');
};

/* ================================================================
   OLD CODE — MockData.homeDynamicSections CRUD (commented out)
   ================================================================ */

/*
App.pages['home-dynamic-sections'] = function() {
    var data = MockData.homeDynamicSections;
    // ... original rendering code ...
};
App.addDynamicSection = function() { ... };
App.editDynamicSection = function(id) { ... };
App.saveDynamicSection = function() { ... };
App.deleteDynamicSection = function(id) { ... };
*/
