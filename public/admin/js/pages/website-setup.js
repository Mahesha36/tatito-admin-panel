'use strict';
/* TATITO FASHIONS — Website Setup (Image 4)
   Site identity (name, motto, icon, colors, banner), Global SEO, Cookies Agreement (CKEditor), Custom Scripts */

App.pages.websiteSetup = function() {
    var ws = MockData.websiteSetup || {};
    var s = MockData.settings || {};
    App._websiteSetupTab = App._websiteSetupTab || 'general';

    var tabs = [
        { id: 'general', label: 'General', icon: 'bi-sliders' },
        { id: 'seo', label: 'Global SEO', icon: 'bi-search' },
        { id: 'cookies', label: 'Cookies Agreement', icon: 'bi-cookie' },
        { id: 'scripts', label: 'Custom Script', icon: 'bi-code-slash' },
    ];

    function renderTab() {
        var tab = App._websiteSetupTab;
        var html = '';

        if (tab === 'general') {
            html = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">' +
                '<div class="form-section">' +
                '<h4 style="font-size:0.88rem;font-weight:700;margin-bottom:16px"><i class="bi bi-sliders" style="color:var(--gold)"></i> General Settings</h4>' +
                '<div class="form-group"><label>Frontend Website Name</label><input type="text" class="form-control" id="wsName" value="' + (ws.websiteName || 'TATITO Fashions') + '"></div>' +
                '<div class="form-group"><label>Site Motto</label><input type="text" class="form-control" id="wsMotto" value="' + (ws.siteMotto || '') + '"></div>' +
                '<div class="form-group"><label>Site Icon</label>' +
                '<div class="upload-field" onclick="document.getElementById(\'wsIcon\').click()">' +
                '<div class="upload-preview"><img src="assets/tatito-logo.png" style="max-height:50px" onerror="this.style.display=\'none\'"></div>' +
                '<div class="upload-info"><i class="bi bi-cloud-arrow-up"></i> <span>' + (ws.siteIcon || 'Choose file') + '</span></div>' +
                '</div><input type="file" id="wsIcon" accept="image/*" style="display:none" onchange="App._previewUpload(this,\'\',\'\')"></div>' +
                '<div class="form-row">' +
                '<div class="form-group"><label>Website Base Color</label><input type="color" class="form-control form-color" id="wsBaseColor" value="' + (ws.baseColor || '#C9A24B') + '"></div>' +
                '<div class="form-group"><label>Base Hover Color</label><input type="color" class="form-control form-color" id="wsHoverColor" value="' + (ws.baseHoverColor || '#8B6F2E') + '"></div>' +
                '</div>' +
                '<div class="form-group"><label>Website Secondary Color</label><input type="color" class="form-control form-color" id="wsSecondaryColor" value="' + (ws.secondaryColor || '#14120F') + '"><small class="text-muted">Hex Color Code. Gradient color will be generated with base color and secondary color.</small></div>' +
                '<button class="btn btn-primary" onclick="App.saveWebsiteGeneral()"><i class="bi bi-check-lg"></i> Update</button>' +
                '</div>' +
                '<div class="form-section">' +
                '<h4 style="font-size:0.88rem;font-weight:700;margin-bottom:16px"><i class="bi bi-image" style="color:var(--gold)"></i> Member Banner</h4>' +
                '<div class="form-group"><label>Member Public Profile Page Banner</label>' +
                '<div class="upload-field" onclick="document.getElementById(\'wsBanner\').click()">' +
                '<div class="upload-preview"><img src="assets/tatito-logo.png" style="max-height:50px" onerror="this.style.display=\'none\'"></div>' +
                '<div class="upload-info"><i class="bi bi-cloud-arrow-up"></i> <span>' + (ws.bannerImage || 'Choose file') + '</span></div>' +
                '</div><input type="file" id="wsBanner" accept="image/*" style="display:none" onchange="App._previewUpload(this,\'\',\'\')"></div>' +
                '<div class="form-group"><label>Banner Link</label><input type="text" class="form-control" id="wsBannerLink" value="' + (ws.bannerLink || '') + '" placeholder="https://"></div>' +
                '<button class="btn btn-primary" onclick="App.saveWebsiteGeneral()"><i class="bi bi-check-lg"></i> Update</button>' +
                '</div>' +
                '</div>';
        } else if (tab === 'seo') {
            html = '<div class="form-section" style="max-width:800px">' +
                '<h4 style="font-size:0.88rem;font-weight:700;margin-bottom:16px"><i class="bi bi-search" style="color:var(--gold)"></i> Global SEO</h4>' +
                '<div class="form-group"><label>Meta Title</label><input type="text" class="form-control" id="seoTitle" value="' + (ws.metaTitle || '') + '"></div>' +
                '<div class="form-group"><label>Meta Description</label><textarea class="form-control" rows="3" id="seoDesc">' + (ws.metaDescription || '') + '</textarea></div>' +
                '<div class="form-group"><label>Keywords</label><textarea class="form-control" rows="3" id="seoKeywords">' + (ws.metaKeywords || '') + '</textarea></div>' +
                '<div class="form-group"><label>Meta Image</label>' +
                '<div class="upload-field" onclick="document.getElementById(\'seoImage\').click()">' +
                '<div class="upload-preview"><img src="assets/tatito-logo.png" style="max-height:50px" onerror="this.style.display=\'none\'"></div>' +
                '<div class="upload-info"><i class="bi bi-cloud-arrow-up"></i> <span>' + (ws.metaImage || 'Choose file') + '</span></div>' +
                '</div><input type="file" id="seoImage" accept="image/*" style="display:none" onchange="App._previewUpload(this,\'\',\'\')"></div>' +
                '<button class="btn btn-primary" onclick="App.saveWebsiteSEO()"><i class="bi bi-check-lg"></i> Update</button>' +
                '</div>';
        } else if (tab === 'cookies') {
            html = '<div class="form-section" style="max-width:800px">' +
                '<h4 style="font-size:0.88rem;font-weight:700;margin-bottom:16px"><i class="bi bi-cookie" style="color:var(--gold)"></i> Cookies Agreement</h4>' +
                '<div class="toggle-row" style="margin-bottom:16px"><div class="toggle-info"><strong>Show Cookies Agreement?</strong><p class="text-muted">Display cookie consent banner on the website</p></div>' +
                '<button class="toggle-switch ' + (ws.cookiesEnabled ? 'on' : '') + '" onclick="App.toggleCookies()"><span class="toggle-knob"></span></button></div>' +
                '<div class="form-group"><label>Cookies Agreement Text</label><div id="cookiesEditor" style="min-height:200px"></div></div>' +
                '<button class="btn btn-primary" onclick="App.saveCookies()"><i class="bi bi-check-lg"></i> Update</button>' +
                '</div>';
        } else if (tab === 'scripts') {
            html = '<div class="form-section" style="max-width:800px">' +
                '<h4 style="font-size:0.88rem;font-weight:700;margin-bottom:16px"><i class="bi bi-code-slash" style="color:var(--gold)"></i> Custom Script</h4>' +
                '<div class="form-group"><label>Header custom script (before &lt;/head&gt;)</label><textarea class="form-control code-textarea" rows="6" id="headerScript" placeholder="<script> or <style> code...">' + (ws.headerScript || '') + '</textarea></div>' +
                '<div class="form-group"><label>Footer custom script (before &lt;/body&gt;)</label><textarea class="form-control code-textarea" rows="6" id="footerScript" placeholder="<script> code...">' + (ws.footerScript || '') + '</textarea></div>' +
                '<button class="btn btn-primary" onclick="App.saveScripts()"><i class="bi bi-check-lg"></i> Update</button>' +
                '</div>';
        }
        document.getElementById('wsTabContent').innerHTML = html;

        if (tab === 'cookies') {
            setTimeout(function() {
                if (typeof ClassicEditor !== 'undefined') {
                    ClassicEditor.create(document.getElementById('cookiesEditor'), {
                        toolbar: ['heading', '|', 'bold', 'italic', '|', 'link', 'bulletedList', 'numberedList', '|', 'undo', 'redo'],
                    }).then(function(editor) {
                        App._ckEditorInstances.cookiesEditor = editor;
                        editor.setData(ws.cookiesText || '');
                    }).catch(function(e) { console.warn('CKEditor:', e); });
                }
            }, 300);
        }
    }

    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Website Setup</h3><p class="text-muted">Customize site identity, SEO, cookies and custom scripts</p></div></div>' +
        '<div class="tab-bar" style="margin-bottom:20px">' +
        tabs.map(function(t) { return '<button class="tab-btn ' + (App._websiteSetupTab === t.id ? 'active' : '') + '" onclick="App.switchWSTab(\'' + t.id + '\')"><i class="bi ' + t.icon + '"></i> ' + t.label + '</button>'; }).join('') +
        '</div><div id="wsTabContent"></div></div>';

    renderTab();
    App._renderWSTab = renderTab;
};

App.switchWSTab = function(tabId) {
    App._destroyEditors();
    App._websiteSetupTab = tabId;
    // Update active class on tab buttons
    document.querySelectorAll('.tab-btn').forEach(function(el) {
        el.classList.remove('active');
    });
    var activeBtn = document.querySelector('.tab-btn[onclick*="' + tabId + '"]');
    if (activeBtn) activeBtn.classList.add('active');
    if (App._renderWSTab) App._renderWSTab();
};

App.saveWebsiteGeneral = function() {
    var ws = MockData.websiteSetup;
    var get = function(id) { var el = document.getElementById(id); return el ? el.value : ''; };
    ws.websiteName = get('wsName'); ws.siteMotto = get('wsMotto');
    ws.baseColor = get('wsBaseColor'); ws.baseHoverColor = get('wsHoverColor'); ws.secondaryColor = get('wsSecondaryColor');
    ws.bannerLink = get('wsBannerLink');
    if (typeof Bridge !== 'undefined') { Bridge.Data.saveEntity('websiteSetup', MockData.websiteSetup); Bridge.Settings.save(MockData.websiteSetup); }
    Helpers.toast('Website settings saved', 'success');
};

App.saveWebsiteSEO = function() {
    var ws = MockData.websiteSetup;
    var get = function(id) { var el = document.getElementById(id); return el ? el.value : ''; };
    ws.metaTitle = get('seoTitle'); ws.metaDescription = get('seoDesc'); ws.metaKeywords = get('seoKeywords');
    if (typeof Bridge !== 'undefined') { Bridge.Data.saveEntity('websiteSetup', MockData.websiteSetup); Bridge.Settings.save(MockData.websiteSetup); }
    Helpers.toast('SEO settings saved', 'success');
};

App.toggleCookies = function() {
    var ws = MockData.websiteSetup; if (!ws) return;
    ws.cookiesEnabled = !ws.cookiesEnabled;
    if (typeof Bridge !== 'undefined') { Bridge.Data.saveEntity('websiteSetup', MockData.websiteSetup); }
    Helpers.toast('Cookies agreement ' + (ws.cookiesEnabled ? 'enabled' : 'disabled'), 'success');
    if (App._renderWSTab) App._renderWSTab();
};

App.saveCookies = function() {
    var ws = MockData.websiteSetup;
    if (App._ckEditorInstances.cookiesEditor) ws.cookiesText = App._ckEditorInstances.cookiesEditor.getData();
    App._destroyEditors();
    if (typeof Bridge !== 'undefined') { Bridge.Data.saveEntity('websiteSetup', MockData.websiteSetup); Bridge.Settings.save(MockData.websiteSetup); }
    Helpers.toast('Cookies agreement saved', 'success');
};

App.saveScripts = function() {
    var ws = MockData.websiteSetup;
    var get = function(id) { var el = document.getElementById(id); return el ? el.value : ''; };
    ws.headerScript = get('headerScript'); ws.footerScript = get('footerScript');
    if (typeof Bridge !== 'undefined') { Bridge.Data.saveEntity('websiteSetup', MockData.websiteSetup); Bridge.Settings.save(MockData.websiteSetup); }
    Helpers.toast('Custom scripts saved', 'success');
};
