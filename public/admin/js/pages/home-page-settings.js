'use strict';
/* TATITO FASHIONS — Home Page Settings
   ================================================================
   NEW: Updated to use REAL frontend homepage sections via
   Bridge.Catalog.getHomepageSections(). The page section toggles
   now control actual storefront visibility. Slider settings,
   registration form toggle, and all changes persist via Bridge.Data
   and are read by the frontend via FrontendBridge.

   OLD CODE: The original code used MockData.homePageSettings with
   9 fake page sections that were never connected to the storefront.
   Old functions are preserved but now persist properly.
   ================================================================ */

App.pages.homePageSettings = function() {
    var hps = MockData.homePageSettings || {};

    /* ---- NEW: Get real frontend sections and merge with admin overrides ---- */
    var frontendSections = (typeof Bridge !== 'undefined' && Bridge.Catalog) ? Bridge.Catalog.getHomepageSections() : [];
    var adminData = (typeof Bridge !== 'undefined') ? Bridge.Data.load() : {};
    var sectionSettings = adminData.homepageSectionSettings || {};
    var hiddenSections = sectionSettings.hidden || [];
    var customTitles = sectionSettings.customTitles || {};

    /* Use real frontend sections (merged with admin overrides) instead of MockData fake sections */
    var realSections = frontendSections.map(function(sec) {
        return {
            id: sec.id,
            name: customTitles[sec.id] || sec.title,
            subtitle: sec.subtitle,
            enabled: hiddenSections.indexOf(sec.id) === -1,
            sortOrder: sec.sortOrder
        };
    });

    function renderSliderImages() {
        /* ---- NEW: Show real slider images from Bridge.Catalog ---- */
        var slides = (typeof Bridge !== 'undefined' && Bridge.Catalog) ? Bridge.Catalog.getHeroSlides() : [];
        return slides.map(function(slide) {
            return '<div class="slider-img-item" style="display:flex;align-items:center;gap:12px;padding:10px;border:1px solid var(--line);border-radius:8px;margin-bottom:8px">' +
                '<div style="width:80px;height:50px;border-radius:6px;overflow:hidden;flex-shrink:0"><img src="' + (slide.image || '') + '" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display=\'none\'"></div>' +
                '<div style="flex:1"><div style="font-size:0.82rem;font-weight:600">' + Helpers.escapeHtml(slide.title || slide.id) + '</div><div style="font-size:0.72rem;color:var(--gray-500)">' + Helpers.escapeHtml(slide.tag || '') + '</div></div>' +
                '<a href="#/home-video-banners" onclick="App.navigate(\'home-video-banners\');return false;" class="btn btn-outline btn-sm">Edit in Video Banners</a>' +
                '</div>';
        }).join('');
    }

    function renderPageSections() {
        /* ---- NEW: Render real frontend sections ---- */
        return realSections.map(function(sec) {
            return '<div class="toggle-row" style="border-bottom:1px solid var(--line)">' +
                '<div class="toggle-info"><strong>' + sec.name + '</strong><p class="text-muted" style="font-size:0.75rem">' + sec.subtitle + '</p></div>' +
                '<div style="display:flex;gap:6px">' +
                '<button class="action-btn edit" onclick="App.editPageSection(\'' + sec.id + '\')"><i class="bi bi-pencil"></i></button>' +
                '<button class="toggle-switch ' + (sec.enabled ? 'on' : '') + '" onclick="App.togglePageSection(\'' + sec.id + '\')"><span class="toggle-knob"></span></button>' +
                '</div></div>';
        }).join('');
    }

    document.getElementById('pageContent').innerHTML =
        '<div class="page-content">' +
        '<div class="page-toolbar"><div><h3>Home Page Settings</h3><p class="text-muted">Configure homepage slider, content and page sections</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-primary" onclick="App.saveHomePageSettings()"><i class="bi bi-check-lg"></i> Update</button></div></div>' +

        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">' +

        '<div class="card"><div class="card-body">' +
        '<div class="toggle-row" style="margin-bottom:16px"><div class="toggle-info"><strong>Show Home Page Slider?</strong><p class="text-muted" style="font-size:0.75rem">Controls hero slider visibility on storefront</p></div>' +
        '<button class="toggle-switch ' + (hps.showSlider ? 'on' : '') + '" onclick="App.toggleHPS(\'showSlider\')"><span class="toggle-knob"></span></button></div>' +

        '<div class="form-group"><label>Home Page Slider Text</label><div id="sliderTextEditor" style="min-height:160px"></div></div>' +

        '<div class="toggle-row" style="margin-top:16px"><div class="toggle-info"><strong>Show right side registration form?</strong><p class="text-muted" style="font-size:0.75rem">Quick registration form next to slider</p></div>' +
        '<button class="toggle-switch ' + (hps.showRegistrationForm ? 'on' : '') + '" onclick="App.toggleHPS(\'showRegistrationForm\')"><span class="toggle-knob"></span></button></div>' +
        '</div></div>' +

        '<div class="card"><div class="card-header" style="display:flex;justify-content:space-between;align-items:center">' +
        '<h3 style="font-size:0.88rem">Slider Slides <span class="text-muted" style="font-size:0.72rem">(from frontend)</span></h3>' +
        '<button class="btn btn-outline btn-sm" onclick="App.navigate(\'home-video-banners\')"><i class="bi bi-pencil"></i> Manage Slides</button></div>' +
        '<div class="card-body">' +
        renderSliderImages() +
        '</div></div>' +
        '</div>' +

        /* ---- NEW: Page sections now show REAL frontend sections ---- */
        '<div class="card"><div class="card-header"><h3 style="font-size:0.88rem">Page Sections <span class="text-muted" style="font-size:0.72rem">(real storefront sections)</span></h3></div><div class="card-body">' +
        renderPageSections() +
        '</div></div>' +

        '</div>';

    setTimeout(function() {
        if (typeof ClassicEditor !== 'undefined') {
            ClassicEditor.create(document.getElementById('sliderTextEditor'), {
                toolbar: ['heading', '|', 'bold', 'italic', '|', 'textColor', 'alignment', '|', 'link', 'bulletedList', 'numberedList', '|', 'undo', 'redo'],
            }).then(function(editor) {
                App._ckEditorInstances.sliderText = editor;
                editor.setData(hps.sliderText || '');
            }).catch(function(e) { console.warn('CKEditor:', e); });
        }
    }, 300);
};

App.toggleHPS = function(key) {
    var hps = MockData.homePageSettings; if (!hps) return;
    hps[key] = !hps[key];
    /* ---- NEW: Persist toggle changes via Bridge ---- */
    if (typeof Bridge !== 'undefined') { Bridge.Data.saveEntity('homePageSettings', MockData.homePageSettings); }
    Helpers.toast(key + ' ' + (hps[key] ? 'enabled' : 'disabled'), 'success');
    App.navigate('homePageSettings');
};

/* ---- OLD: Original addSliderImage used MockData-only file objects ---- */
/* ---- NEW: Redirected to Video Banners page where slides are managed ---- */
App.addSliderImage = function() {
    App.navigate('home-video-banners');
};

/* ---- OLD: removeSliderImage removed items from MockData ---- */
/* ---- NEW: Redirected to Video Banners management ---- */
App.removeSliderImage = function(id) {
    App.navigate('home-video-banners');
};

/* ---- NEW: Toggle now persists to homepageSectionSettings via Bridge ---- */
App.togglePageSection = function(id) {
    /* OLD CODE:
    var sec = MockData.homePageSettings.pageSections.find(function(s) { return s.id === id; });
    if (!sec) return;
    sec.enabled = !sec.enabled;
    Helpers.toast(sec.name + ' ' + (sec.enabled ? 'enabled' : 'disabled'), 'success');
    App.navigate('homePageSettings');
    */

    /* NEW CODE: Persist via Bridge to homepageSectionSettings */
    var data = Bridge.Data.load();
    if (!data.homepageSectionSettings) data.homepageSectionSettings = { hidden: [], customTitles: {}, order: {} };
    if (!data.homepageSectionSettings.hidden) data.homepageSectionSettings.hidden = [];
    var idx = data.homepageSectionSettings.hidden.indexOf(id);
    if (idx === -1) data.homepageSectionSettings.hidden.push(id);
    else data.homepageSectionSettings.hidden.splice(idx, 1);
    Bridge.Data.saveEntity('homepageSectionSettings', data.homepageSectionSettings);

    /* Also update MockData for consistency */
    var sec = MockData.homePageSettings.pageSections.find(function(s) { return s.id === id; });
    if (sec) sec.enabled = !sec.enabled;

    Helpers.toast((sec ? sec.name : id) + ' ' + (idx === -1 ? 'disabled' : 'enabled'), 'success');
    App.navigate('homePageSettings');
};

/* ---- NEW: editPageSection now saves custom titles via Bridge ---- */
App.editPageSection = function(id) {
    /* OLD CODE:
    var sec = MockData.homePageSettings.pageSections.find(function(s) { return s.id === id; });
    if (!sec) return;
    App._destroyEditors();
    ... (original modal with CKEditor for section content)
    */

    /* NEW CODE: Edit title only (section content is managed by frontend data) */
    var frontendSections = Bridge.Catalog.getHomepageSections();
    var sec = frontendSections.find(function(x) { return x.id === id; });
    if (!sec) return;
    var adminData = Bridge.Data.load();
    var customTitles = (adminData.homepageSectionSettings && adminData.homepageSectionSettings.customTitles) || {};
    var currentTitle = customTitles[id] || sec.title;

    App._destroyEditors();
    Helpers.openModal(
        '<div class="modal-header"><h3 class="modal-title">Edit: ' + sec.title + '</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body">' +
        '<div class="form-group"><label>Section Name (display title)</label><input type="text" class="form-control" id="sectionName" value="' + Helpers.escapeHtml(currentTitle) + '"></div>' +
        '<p class="text-muted" style="font-size:0.8rem">Original title: ' + sec.title + '</p>' +
        '<p class="text-muted" style="font-size:0.8rem">Section ID: <code>' + sec.id + '</code></p>' +
        '</div>' +
        '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.savePageSection(\'' + id + '\')">Save</button></div>',
        'modal-lg'
    );
};

/* ---- NEW: savePageSection now persists custom title via Bridge ---- */
App.savePageSection = function(id) {
    /* OLD CODE:
    var sec = MockData.homePageSettings.pageSections.find(function(s) { return s.id === id; });
    if (!sec) return;
    var nameEl = document.getElementById('sectionName');
    if (nameEl && nameEl.value.trim()) sec.name = nameEl.value.trim();
    if (App._ckEditorInstances.sectionEditor) sec.content = App._ckEditorInstances.sectionEditor.getData();
    */

    /* NEW CODE: Save custom title to homepageSectionSettings */
    var nameEl = document.getElementById('sectionName');
    if (nameEl && nameEl.value.trim()) {
        var data = Bridge.Data.load();
        if (!data.homepageSectionSettings) data.homepageSectionSettings = { hidden: [], customTitles: {}, order: {} };
        if (!data.homepageSectionSettings.customTitles) data.homepageSectionSettings.customTitles = {};
        data.homepageSectionSettings.customTitles[id] = nameEl.value.trim();
        Bridge.Data.saveEntity('homepageSectionSettings', data.homepageSectionSettings);
    }
    App._destroyEditors();
    Helpers.closeModal();
    Helpers.toast('Section updated', 'success');
    App.navigate('homePageSettings');
};

App.saveHomePageSettings = function() {
    var hps = MockData.homePageSettings;
    if (App._ckEditorInstances.sliderText) hps.sliderText = App._ckEditorInstances.sliderText.getData();
    App._destroyEditors();
    /* ---- NEW: Persist via Bridge ---- */
    if (typeof Bridge !== 'undefined') { Bridge.Data.saveEntity('homePageSettings', MockData.homePageSettings); }
    Helpers.toast('Home page settings saved successfully', 'success');
};
