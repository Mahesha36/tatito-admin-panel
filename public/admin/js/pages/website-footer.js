'use strict';
/* TATITO FASHIONS — Website Footer (Image 5874eab1)
   About Widget, Contacts, Link Widgets (3), Mobile App, Copyright + Social Links
   FIXED: All 6 save buttons now read form values and persist via Bridge */

App.pages['website-footer'] = function() {
    var f = MockData.websiteFooter || {};

    function widgetCard(title, icon, body) {
        return '<div class="card" style="margin-bottom:16px"><div class="card-header" style="display:flex;justify-content:space-between;align-items:center"><h3 style="font-size:0.85rem"><i class="bi ' + icon + '" style="color:var(--gold)"></i> ' + title + '</h3></div><div class="card-body">' + body + '</div></div>';
    }

    document.getElementById('pageContent').innerHTML =
        '<div class="page-content">' +
        '<div class="page-toolbar"><div><h3>Website Footer</h3><p class="text-muted">Footer Setting</p></div></div>' +
        '<div style="max-width:900px">' +

        widgetCard('About Widget', 'bi-info-circle',
            '<div class="form-group"><label>Footer Logo</label><div class="upload-field" onclick="document.getElementById(\'footerLogo\').click()" style="cursor:pointer;display:flex;align-items:center;gap:12px;padding:14px;border:2px dashed var(--line);border-radius:8px"><div class="upload-preview"><img src="assets/tatito-logo.png" style="max-height:40px" onerror="this.style.display=\'none\'"></div><div class="upload-info"><button type="button" class="btn btn-outline btn-sm">Browse</button></div></div><input type="file" id="footerLogo" accept="image/*" style="display:none" onchange="App._previewUploadEnhanced(this,\'\',\'\')"></div>' +
            '<div class="form-group"><label>About Description</label><textarea class="form-control" rows="4" id="footerAbout">' + Helpers.escapeHtml(f.aboutWidget ? f.aboutWidget.description : '') + '</textarea></div>' +
            '<button class="btn btn-primary" onclick="App.saveFooterAbout()"><i class="bi bi-check-lg"></i> Update</button>'
        ) +

        widgetCard('Contacts Widget', 'bi-telephone',
            '<div class="form-group"><label>Address</label><input type="text" class="form-control" id="footerAddress" value="' + Helpers.escapeHtml(f.contactsWidget ? f.contactsWidget.address : '') + '"></div>' +
            '<div class="form-group"><label>Website</label><input type="text" class="form-control" id="footerWebsite" value="' + Helpers.escapeHtml(f.contactsWidget ? f.contactsWidget.website : '') + '"></div>' +
            '<div class="form-group"><label>Email</label><input type="email" class="form-control" id="footerEmail" value="' + Helpers.escapeHtml(f.contactsWidget ? f.contactsWidget.email : '') + '"></div>' +
            '<div class="form-group"><label>Phone</label><input type="text" class="form-control" id="footerPhone" value="' + Helpers.escapeHtml((f.contactsWidget && f.contactsWidget.phones) ? f.contactsWidget.phones[0] : '') + '" placeholder="Phone Number"> <button class="btn btn-outline btn-sm" style="margin-top:6px" onclick="App.addFooterPhone()"><i class="bi bi-plus"></i> Add New</button></div>' +
            '<button class="btn btn-primary" onclick="App.saveFooterContacts()"><i class="bi bi-check-lg"></i> Update</button>'
        ) +

        (f.linkWidgets || []).map(function(lw) {
            return widgetCard(lw.title, 'bi-link-45deg',
                '<div class="form-group"><label>Title</label><input type="text" class="form-control" id="lwTitle_' + lw.id + '" value="' + Helpers.escapeHtml(lw.title) + '"></div>' +
                '<label>Links</label>' +
                lw.links.map(function(link, linkIdx) { return '<div class="form-row" style="margin-bottom:6px"><input type="text" class="form-control" id="lwText_' + lw.id + '_' + linkIdx + '" value="' + Helpers.escapeHtml(link.text) + '" placeholder="Text"><input type="text" class="form-control" id="lwUrl_' + lw.id + '_' + linkIdx + '" value="' + Helpers.escapeHtml(link.url) + '" placeholder="URL"></div>'; }).join('') +
                '<button class="btn btn-outline btn-sm" style="margin-top:6px" onclick="Helpers.toast(\'Add new link (demo)\', \'info\')"><i class="bi bi-plus"></i> Add New</button>' +
                '<div style="margin-top:8px"><button class="btn btn-primary btn-sm" onclick="App.saveFooterLinks(\'' + lw.id + '\')"><i class="bi bi-check-lg"></i> Update</button></div>'
            );
        }).join('') +

        widgetCard('Mobile App Widget', 'bi-phone',
            '<div class="form-group"><label>Title</label><input type="text" class="form-control" id="appTitle" value="' + Helpers.escapeHtml(f.mobileAppWidget ? f.mobileAppWidget.title : '') + '"></div>' +
            '<div class="form-row"><div class="form-group"><label>Play Store Image</label><div class="upload-field" style="padding:10px;border:2px dashed var(--line);border-radius:6px;text-align:center;cursor:pointer" onclick="document.getElementById(\'playStoreImg\').click()"><button type="button" class="btn btn-outline btn-sm">Browse</button><input type="file" id="playStoreImg" accept="image/*" style="display:none" onchange="App._previewUploadEnhanced(this,\'\',\'\')"></div></div>' +
            '<div class="form-group"><label>Play Store Link</label><input type="text" class="form-control" id="playLink" value="' + Helpers.escapeHtml(f.mobileAppWidget ? f.mobileAppWidget.playStoreLink : '') + '" placeholder="http://"></div></div>' +
            '<div class="form-row"><div class="form-group"><label>App Store Image</label><div class="upload-field" style="padding:10px;border:2px dashed var(--line);border-radius:6px;text-align:center;cursor:pointer" onclick="document.getElementById(\'appStoreImg\').click()"><button type="button" class="btn btn-outline btn-sm">Browse</button><input type="file" id="appStoreImg" accept="image/*" style="display:none" onchange="App._previewUploadEnhanced(this,\'\',\'\')"></div></div>' +
            '<div class="form-group"><label>App Store Link</label><input type="text" class="form-control" id="appLink" value="' + Helpers.escapeHtml(f.mobileAppWidget ? f.mobileAppWidget.appStoreLink : '') + '" placeholder="http://"></div></div>' +
            '<button class="btn btn-primary" onclick="App.saveFooterMobileApp()"><i class="bi bi-check-lg"></i> Update</button>'
        ) +

        widgetCard('Copyright Widget', 'bi-c-circle',
            '<div class="form-group"><label>Copyright Text</label><textarea class="form-control" rows="2" id="footerCopyright">' + Helpers.escapeHtml(f.copyrightWidget ? f.copyrightWidget.text : '') + '</textarea></div>' +
            '<button class="btn btn-primary" onclick="App.saveFooterCopyright()"><i class="bi bi-check-lg"></i> Update</button>'
        ) +

        widgetCard('Social Link Widget', 'bi-share',
            '<div class="toggle-row" style="margin-bottom:12px"><div class="toggle-info"><strong>Show Social Links?</strong></div>' +
            '<button class="toggle-switch ' + (f.copyrightWidget && f.copyrightWidget.showSocialLinks ? 'on' : '') + '" onclick="App.toggleFooterSocial()"><span class="toggle-knob"></span></button></div>' +
            ['facebook', 'twitter', 'instagram', 'youtube', 'linkedin'].map(function(social) {
                var val = (f.copyrightWidget && f.copyrightWidget.social) ? (f.copyrightWidget.social[social] || '') : '';
                return '<div class="form-group"><label>' + Helpers.capitalize(social) + '</label><input type="text" class="form-control" id="social_' + social + '" value="' + Helpers.escapeHtml(val) + '" placeholder="http://"></div>';
            }).join('') +
            '<button class="btn btn-primary" onclick="App.saveFooterSocial()"><i class="bi bi-check-lg"></i> Update</button>'
        ) +

        '</div></div>';
};

function _persistFooter() {
    if (typeof Bridge !== 'undefined') {
        Bridge.Data.saveEntity('websiteFooter', MockData.websiteFooter);
        Bridge.Settings.save(MockData.websiteFooter);
    }
}

App.addFooterPhone = function() { Helpers.toast('Add phone (demo)', 'info'); };

App.saveFooterAbout = function() {
    var f = MockData.websiteFooter; if (!f) return;
    if (!f.aboutWidget) f.aboutWidget = {};
    var el = document.getElementById('footerAbout');
    if (el) f.aboutWidget.description = el.value;
    _persistFooter();
    Helpers.toast('About widget saved', 'success');
};

App.saveFooterContacts = function() {
    var f = MockData.websiteFooter; if (!f) return;
    if (!f.contactsWidget) f.contactsWidget = {};
    var get = function(id) { var el = document.getElementById(id); return el ? el.value : ''; };
    f.contactsWidget.address = get('footerAddress'); f.contactsWidget.website = get('footerWebsite');
    f.contactsWidget.email = get('footerEmail'); f.contactsWidget.phones = [get('footerPhone')];
    _persistFooter();
    Helpers.toast('Contacts widget saved', 'success');
};

App.saveFooterLinks = function(widgetId) {
    var f = MockData.websiteFooter; if (!f || !f.linkWidgets) return;
    var lw = f.linkWidgets.find(function(w) { return w.id === widgetId; });
    if (!lw) return;
    var titleEl = document.getElementById('lwTitle_' + widgetId);
    if (titleEl) lw.title = titleEl.value;
    lw.links = lw.links.map(function(link, idx) {
        var textEl = document.getElementById('lwText_' + widgetId + '_' + idx);
        var urlEl = document.getElementById('lwUrl_' + widgetId + '_' + idx);
        return { text: textEl ? textEl.value : link.text, url: urlEl ? urlEl.value : link.url };
    });
    _persistFooter();
    Helpers.toast(lw.title + ' saved', 'success');
};

App.saveFooterMobileApp = function() {
    var f = MockData.websiteFooter; if (!f) return;
    if (!f.mobileAppWidget) f.mobileAppWidget = {};
    var get = function(id) { var el = document.getElementById(id); return el ? el.value : ''; };
    f.mobileAppWidget.title = get('appTitle');
    f.mobileAppWidget.playStoreLink = get('playLink');
    f.mobileAppWidget.appStoreLink = get('appLink');
    _persistFooter();
    Helpers.toast('Mobile app widget saved', 'success');
};

App.saveFooterCopyright = function() {
    var f = MockData.websiteFooter; if (!f) return;
    if (!f.copyrightWidget) f.copyrightWidget = {};
    var el = document.getElementById('footerCopyright');
    if (el) f.copyrightWidget.text = el.value;
    _persistFooter();
    Helpers.toast('Copyright saved', 'success');
};

App.saveFooterSocial = function() {
    var f = MockData.websiteFooter; if (!f) return;
    if (!f.copyrightWidget) f.copyrightWidget = {};
    if (!f.copyrightWidget.social) f.copyrightWidget.social = {};
    ['facebook', 'twitter', 'instagram', 'youtube', 'linkedin'].forEach(function(social) {
        var el = document.getElementById('social_' + social);
        if (el) f.copyrightWidget.social[social] = el.value;
    });
    _persistFooter();
    Helpers.toast('Social links saved', 'success');
};

App.toggleFooterSocial = function() {
    var f = MockData.websiteFooter; if (!f || !f.copyrightWidget) return;
    f.copyrightWidget.showSocialLinks = !f.copyrightWidget.showSocialLinks;
    _persistFooter();
    Helpers.toast('Social links ' + (f.copyrightWidget.showSocialLinks ? 'shown' : 'hidden'), 'success');
    App.navigate('website-footer');
};
