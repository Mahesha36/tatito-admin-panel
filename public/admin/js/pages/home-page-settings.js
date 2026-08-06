'use strict';
/* TATITO FASHIONS — Home Page Settings (Image 5)
   Slider toggle, CKEditor slider text, registration form toggle,
   slider image uploads (dynamic add/remove), page section toggles */

App.pages.homePageSettings = function() {
    var hps = MockData.homePageSettings || {};

    function renderSliderImages() {
        return (hps.sliderImages || []).map(function(img) {
            return '<div class="slider-img-item" style="display:flex;align-items:center;gap:12px;padding:10px;border:1px solid var(--line);border-radius:8px;margin-bottom:8px">' +
                '<div style="width:60px;height:60px;border-radius:6px;overflow:hidden;background:var(--ivory);flex-shrink:0"><img src="assets/logo.svg" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display=\'none\'"></div>' +
                '<div style="flex:1"><div style="font-size:0.82rem;font-weight:600">' + img.name + '</div><div style="font-size:0.72rem;color:var(--gray-500)">' + img.size + '</div></div>' +
                '<button class="action-btn delete" onclick="App.removeSliderImage(\'' + img.id + '\')"><i class="bi bi-x-lg"></i></button>' +
                '</div>';
        }).join('');
    }

    function renderPageSections() {
        return (hps.pageSections || []).map(function(sec) {
            return '<div class="toggle-row" style="border-bottom:1px solid var(--line)">' +
                '<div class="toggle-info"><strong>' + sec.name + '</strong></div>' +
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
        '<div class="toggle-row" style="margin-bottom:16px"><div class="toggle-info"><strong>Show Home Page Slider?</strong></div>' +
        '<button class="toggle-switch ' + (hps.showSlider ? 'on' : '') + '" onclick="App.toggleHPS(\'showSlider\')"><span class="toggle-knob"></span></button></div>' +

        '<div class="form-group"><label>Home Page Slider Text</label><div id="sliderTextEditor" style="min-height:160px"></div></div>' +

        '<div class="toggle-row" style="margin-top:16px"><div class="toggle-info"><strong>Show right side registration form?</strong></div>' +
        '<button class="toggle-switch ' + (hps.showRegistrationForm ? 'on' : '') + '" onclick="App.toggleHPS(\'showRegistrationForm\')"><span class="toggle-knob"></span></button></div>' +
        '</div></div>' +

        '<div class="card"><div class="card-header" style="display:flex;justify-content:space-between;align-items:center">' +
        '<h3 style="font-size:0.88rem">Photos (Slider Images)</h3>' +
        '<button class="btn btn-outline btn-sm" onclick="App.addSliderImage()"><i class="bi bi-plus-lg"></i> Add New</button></div>' +
        '<div class="card-body">' +
        renderSliderImages() +
        '</div></div>' +
        '</div>' +

        '<div class="card"><div class="card-header"><h3 style="font-size:0.88rem">Page Sections</h3></div><div class="card-body">' +
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
    Helpers.toast(key + ' ' + (hps[key] ? 'enabled' : 'disabled'), 'success');
    App.navigate('homePageSettings');
};

App.addSliderImage = function() {
    var input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*';
    input.onchange = function() {
        if (!input.files || !input.files[0]) return;
        var file = input.files[0];
        MockData.homePageSettings.sliderImages.push({
            id: 'HPSI' + String(MockData.homePageSettings.sliderImages.length + 1).padStart(3, '0'),
            name: file.name, size: Math.round(file.size / (1024 * 1024) * 10) / 10 + ' MB',
        });
        Helpers.toast('Slider image added', 'success');
        App.navigate('homePageSettings');
    };
    input.click();
};

App.removeSliderImage = function(id) {
    MockData.homePageSettings.sliderImages = MockData.homePageSettings.sliderImages.filter(function(img) { return img.id !== id; });
    Helpers.toast('Slider image removed', 'success');
    App.navigate('homePageSettings');
};

App.togglePageSection = function(id) {
    var sec = MockData.homePageSettings.pageSections.find(function(s) { return s.id === id; });
    if (!sec) return;
    sec.enabled = !sec.enabled;
    Helpers.toast(sec.name + ' ' + (sec.enabled ? 'enabled' : 'disabled'), 'success');
    App.navigate('homePageSettings');
};

App.editPageSection = function(id) {
    var sec = MockData.homePageSettings.pageSections.find(function(s) { return s.id === id; });
    if (!sec) return;
    App._destroyEditors();
    Helpers.openModal(
        '<div class="modal-header"><h3 class="modal-title">Edit: ' + sec.name + '</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body">' +
        '<div class="form-group"><label>Section Name</label><input type="text" class="form-control" id="sectionName" value="' + sec.name + '"></div>' +
        '<div class="form-group"><label>Section Content</label><div id="sectionEditor" style="min-height:200px"></div></div>' +
        '</div>' +
        '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.savePageSection(\'' + id + '\')">Save</button></div>',
        'modal-lg'
    );
    setTimeout(function() {
        if (typeof ClassicEditor !== 'undefined') {
            ClassicEditor.create(document.getElementById('sectionEditor'), {
                toolbar: ['heading', '|', 'bold', 'italic', '|', 'link', 'bulletedList', 'numberedList', '|', 'undo', 'redo'],
            }).then(function(editor) {
                App._ckEditorInstances.sectionEditor = editor;
                editor.setData('<p>Edit content for ' + sec.name + '</p>');
            }).catch(function(e) { console.warn('CKEditor:', e); });
        }
    }, 300);
};

App.savePageSection = function(id) {
    var sec = MockData.homePageSettings.pageSections.find(function(s) { return s.id === id; });
    if (!sec) return;
    var nameEl = document.getElementById('sectionName');
    if (nameEl && nameEl.value.trim()) sec.name = nameEl.value.trim();
    if (App._ckEditorInstances.sectionEditor) sec.content = App._ckEditorInstances.sectionEditor.getData();
    App._destroyEditors();
    Helpers.closeModal();
    Helpers.toast('Section updated', 'success');
    App.navigate('homePageSettings');
};

App.saveHomePageSettings = function() {
    var hps = MockData.homePageSettings;
    if (App._ckEditorInstances.sliderText) hps.sliderText = App._ckEditorInstances.sliderText.getData();
    Helpers.toast('Home page settings saved successfully', 'success');
};
