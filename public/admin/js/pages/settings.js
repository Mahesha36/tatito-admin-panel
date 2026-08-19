'use strict';
/* TATITO FASHIONS — Settings (Enhanced with Image 3 + Image 4 features)
   Tabs: General, Features, Activation, Payment, SMTP, Third-Party, Social, Notifications, Language
   General tab: system name, logo upload, timezone, member code prefix, activation toggles (Image 3)
   Website Setup page handles site identity, colors, SEO, cookies, custom scripts (Image 4) */

App.pages.settings = function() {
    var self = this;
    var s = MockData.settings || {};
    if (!s.features) s.features = { marketplace: true, ai_tryon: true, customization: true, quotations: true, boutique: true, consultation: true, photography: true, events: true, tracking: true, referrals: true, reviews: true };
    if (!s.general) s.general = { siteName: 'TATITO Fashions', supportEmail: 'support@tatitofashions.com', contactPhone: '+91 98765 43210', currency: 'INR' };
    if (!s.payment) s.payment = { razorpayKey: 'rzp_test_XXXXXXXX', currency: 'INR', autoCapture: true };
    if (!s.notifications) s.notifications = { emailAlerts: true, smsAlerts: false, pushNotifications: true };
    if (!s.activation) s.activation = { https: true, maintenanceMode: false, walletSystem: true, emailVerification: true, memberApproval: true, sellerApproval: true, premiumProfileAccess: true, profilePictureApproval: true };
    if (!s.smtp) s.smtp = MockData.smtpSettings || { host: 'smtp.gmail.com', port: 587, username: '', password: '', encryption: 'TLS' };
    if (!s.social) s.social = { facebookLogin: false, googleLogin: true, facebookClientId: '', googleClientId: '' };

    self._settingsTab = self._settingsTab || 'general';
    var tabs = [
        { id: 'general', label: 'General', icon: 'bi-gear' },
        { id: 'features', label: 'Features', icon: 'bi-toggle-on' },
        { id: 'activation', label: 'Activation', icon: 'bi-shield-check' },
        { id: 'smtp', label: 'SMTP', icon: 'bi-server' },
        { id: 'thirdparty', label: 'Third-Party', icon: 'bi-cloud-arrow-up' },
        { id: 'social', label: 'Social Login', icon: 'bi-google' },
        { id: 'notifications', label: 'Notifications', icon: 'bi-bell' },
        { id: 'language', label: 'Language', icon: 'bi-translate' },
    ];

    function renderTab() {
        var tab = self._settingsTab;
        var html = '';

        if (tab === 'general') {
            var gs = MockData.generalSettings || {};
            var timezones = ['(GMT+05:30) New Delhi', '(GMT+05:30) Mumbai', '(GMT+05:30) Kolkata', '(GMT+05:30) Chennai', '(GMT+00:00) London', '(GMT-05:00) New York', '(GMT-08:00) Los Angeles', '(GMT+01:00) Paris', '(GMT+03:00) Dubai', '(GMT+08:00) Singapore', '(GMT+09:00) Tokyo'];

            html = '<div class="form-section">' +
                '<h4 style="font-size:0.88rem;font-weight:700;margin-bottom:16px"><i class="bi bi-gear" style="color:var(--gold)"></i> General Settings</h4>' +
                '<div class="form-group"><label>System Name</label><input type="text" class="form-control" id="gsSystemName" value="' + (gs.systemName || 'TATITO Fashions') + '"></div>' +

                '<div class="form-group"><label>System Logo</label>' +
                '<div class="upload-field" onclick="document.getElementById(\'gsLogo\').click()">' +
                '<div class="upload-preview"><img src="' + (gs.logoPreview || 'assets/logo.svg') + '" style="max-height:60px" onerror="this.style.display=\'none\'"></div>' +
                '<div class="upload-info"><i class="bi bi-cloud-arrow-up"></i> <span id="gsLogoName">' + (gs.logoFile || 'Choose file') + '</span><br><small class="text-muted">PNG, JPG, SVG (max 2MB)</small></div>' +
                '</div><input type="file" id="gsLogo" accept="image/*" style="display:none" onchange="App._previewUpload(this, \'gsLogoName\', \'gsLogoPreview\')"></div>' +

                '<div class="form-group"><label>System Timezone</label><select class="form-control" id="gsTimezone">' +
                timezones.map(function(tz) { return '<option' + (gs.timezone === tz ? ' selected' : '') + '>' + tz + '</option>'; }).join('') +
                '</select></div>' +

                '<div class="form-group"><label>Admin Login Page Background</label>' +
                '<div class="upload-field" onclick="document.getElementById(\'gsLoginBg\').click()">' +
                '<div class="upload-preview"><img src="' + (gs.logoPreview || 'assets/logo.svg') + '" style="max-height:60px" onerror="this.style.display=\'none\'"></div>' +
                '<div class="upload-info"><i class="bi bi-cloud-arrow-up"></i> <span id="gsLoginBgName">' + (gs.loginBgFile || 'Choose file') + '</span></div>' +
                '</div><input type="file" id="gsLoginBg" accept="image/*" style="display:none" onchange="App._previewUpload(this, \'gsLoginBgName\', \'\')"></div>' +

                '<div class="form-row">' +
                '<div class="form-group"><label>Member Code Prefix</label><input type="text" class="form-control" id="gsCodePrefix" value="' + (gs.memberCodePrefix || 'TTF') + '"></div>' +
                '<div class="form-group"><label>Member Minimum Age</label><input type="number" class="form-control" id="gsMinAge" value="' + (gs.memberMinAge || 18) + '"></div>' +
                '</div>' +
                '<div class="form-row">' +
                '<div class="form-group"><label>Member Profile Picture Privacy</label><select class="form-control" id="gsProfilePrivacy"><option' + (gs.profilePicturePrivacy === 'All' ? ' selected' : '') + '>All</option><option' + (gs.profilePicturePrivacy === 'Friends Only' ? ' selected' : '') + '>Friends Only</option><option' + (gs.profilePicturePrivacy === 'Private' ? ' selected' : '') + '>Private</option></select></div>' +
                '<div class="form-group"><label>Member Gallery Image Privacy</label><select class="form-control" id="gsGalleryPrivacy"><option' + (gs.galleryImagePrivacy === 'All' ? ' selected' : '') + '>All</option><option' + (gs.galleryImagePrivacy === 'Friends Only' ? ' selected' : '') + '>Friends Only</option><option' + (gs.galleryImagePrivacy === 'Private' ? ' selected' : '') + '>Private</option></select></div>' +
                '</div>' +
                '<button class="btn btn-primary" onclick="App.saveGeneralSettings()"><i class="bi bi-check-lg"></i> Update</button>' +
                '</div>';
        } else if (tab === 'features') {
            var featureLabels = {
                marketplace: 'Marketplace', ai_tryon: 'AI Virtual Try-On', customization: 'Fashion Customization',
                quotations: 'Designer Quotation System', boutique: 'Boutique Selection', consultation: 'Call Consultation with Translator',
                photography: 'Photography & Videography', events: 'Event Management', tracking: 'Live Order Tracking',
                referrals: '4-Level Referral Program', reviews: 'Reviews & Ratings',
            };
            html = '<div class="feature-toggles">' + Object.keys(s.features).map(function(k) {
                var on = s.features[k];
                var label = featureLabels[k] || Helpers.capitalize(k);
                return '<div class="toggle-row"><div class="toggle-info"><strong>' + label + '</strong><p class="text-muted">' + (on ? 'Enabled' : 'Disabled') + '</p></div>' +
                    '<button class="toggle-switch ' + (on ? 'on' : '') + '" onclick="App.toggleFeature(\'' + k + '\')"><span class="toggle-knob"></span></button></div>';
            }).join('') + '</div>';
        } else if (tab === 'activation') {
            var actLabels = {
                https: { label: 'HTTPS Activation', desc: 'Force HTTPS for all connections' },
                maintenanceMode: { label: 'Maintenance Mode', desc: 'Take the website offline temporarily' },
                walletSystem: { label: 'Wallet System', desc: 'Enable digital wallet for users' },
                emailVerification: { label: 'Email/Phone Verification', desc: 'Require verification on registration' },
                memberApproval: { label: 'Member Approval by Admin', desc: 'Admin must approve new user registrations' },
                sellerApproval: { label: 'Seller Approval by Admin', desc: 'Admin must approve new seller registrations' },
                premiumProfileAccess: { label: 'Only Premium Member Can See Full Profile', desc: 'Restricts full profile visibility to premium members' },
                profilePictureApproval: { label: 'Member Profile Picture Approval by Admin', desc: 'Admin must approve uploaded profile pictures' },
            };
            html = '<div class="form-section">' +
                '<h4 style="font-size:0.88rem;font-weight:700;margin-bottom:16px"><i class="bi bi-shield-check" style="color:var(--gold)"></i> Activation</h4>' +
                '<div class="feature-toggles">' + Object.keys(s.activation).map(function(k) {
                var on = s.activation[k];
                var info = actLabels[k] || { label: Helpers.capitalize(k), desc: '' };
                return '<div class="toggle-row"><div class="toggle-info"><strong>' + info.label + '</strong><p class="text-muted">' + info.desc + '</p></div>' +
                    '<button class="toggle-switch ' + (on ? 'on' : '') + '" onclick="App.toggleActivation(\'' + k + '\')"><span class="toggle-knob"></span></button></div>';
            }).join('') + '</div></div>';
        } else if (tab === 'smtp') {
            var smtp = MockData.smtpSettings || s.smtp;
            html = '<div style="display:grid;grid-template-columns:1fr 280px;gap:20px">' +
                '<div class="form-section">' +
                '<h4 style="font-size:0.88rem;font-weight:700;margin-bottom:16px"><i class="bi bi-server" style="color:var(--gold)"></i> SMTP Settings</h4>' +
                '<div class="form-group"><label>Type</label><select class="form-control" id="smtpType"><option ' + (smtp.type === 'SMTP' ? 'selected' : '') + '>SMTP</option><option ' + (smtp.type === 'sendmail' ? 'selected' : '') + '>sendmail</option></select></div>' +
                '<div class="form-group"><label>MAIL HOST</label><input type="text" class="form-control" id="smtpHost" value="' + (smtp.host || '') + '"></div>' +
                '<div class="form-row"><div class="form-group"><label>MAIL PORT</label><input type="number" class="form-control" id="smtpPort" value="' + (smtp.port || 587) + '"></div>' +
                '<div class="form-group"><label>MAIL ENCRYPTION</label><input type="text" class="form-control" id="smtpEncryption" value="' + (smtp.encryption || 'TLS') + '"></div></div>' +
                '<div class="form-group"><label>MAIL USERNAME</label><input type="text" class="form-control" id="smtpUsername" value="' + (smtp.username || '') + '"></div>' +
                '<div class="form-group"><label>MAIL PASSWORD</label><input type="password" class="form-control" id="smtpPassword" value="' + (smtp.password || '') + '"></div>' +
                '<div class="form-row"><div class="form-group"><label>MAIL FROM ADDRESS</label><input type="text" class="form-control" id="smtpFromAddr" value="' + (smtp.fromAddress || '') + '"></div>' +
                '<div class="form-group"><label>MAIL FROM NAME</label><input type="text" class="form-control" id="smtpFromName" value="' + (smtp.fromName || '') + '"></div></div>' +
                '<button class="btn btn-primary" onclick="App.saveSmtpSettings()"><i class="bi bi-check-lg"></i> Update</button>' +
                '</div><div>' +
                '<div style="padding:14px 16px;background:#FEF6F0;border:1px solid #F4D7C4;border-radius:10px;margin-bottom:16px"><div style="font-weight:700;font-size:0.8rem;margin-bottom:6px;color:#A0460F"><i class="bi bi-exclamation-triangle"></i> Test SMTP Configuration</div>' +
                '<input type="email" class="form-control" id="smtpTestEmail" placeholder="test@example.com" style="margin-bottom:8px">' +
                '<button class="btn btn-outline btn-sm" style="width:100%" onclick="App.sendTestEmail()"><i class="bi bi-send"></i> Send Test Email</button></div>' +
                '<div style="padding:16px;background:var(--ivory);border-radius:10px;border:1px solid var(--line)">' +
                '<div style="font-weight:700;font-size:0.8rem;margin-bottom:10px"><i class="bi bi-info-circle" style="color:var(--gold)"></i> SMTP Instructions</div>' +
                '<p style="font-size:0.75rem;color:var(--gray-500);margin-bottom:10px">Please be careful when configuring SMTP. Incorrect settings cause errors during order placement, registrations, or newsletter sending.</p>' +
                '<div style="font-weight:600;font-size:0.76rem;margin-bottom:4px">For Non-SSL:</div>' +
                '<ul style="font-size:0.72rem;color:var(--gray-500);padding-left:16px;margin-bottom:10px"><li>Use <code>sendmail</code> if SMTP fails</li><li>Set Mail Port to <strong>587</strong></li><li>Use <code>TLS</code> encryption</li></ul>' +
                '<div style="font-weight:600;font-size:0.76rem;margin-bottom:4px">For SSL:</div>' +
                '<ul style="font-size:0.72rem;color:var(--gray-500);padding-left:16px"><li>Use <code>sendmail</code> if SMTP fails</li><li>Set Mail Port to <strong>465</strong></li><li>Use <code>SSL</code> encryption</li></ul>' +
                '</div></div></div>';
        } else if (tab === 'thirdparty') {
            var tp = MockData.thirdPartySettings || {};
            html = '<div style="display:flex;flex-direction:column;gap:20px">' +
                renderTPCard('recaptcha', 'Google reCAPTCHA', 'bi-shield-lock', tp) +
                renderTPCard('googleAnalytics', 'Google Analytics', 'bi-graph-up', tp) +
                '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">' +
                renderTPCard('facebookChat', 'Facebook Chat', 'bi-chat-dots', tp, ['Login to Facebook page','Find "About" section','Locate "Facebook Page ID"','Go to "Advanced Messaging"','Add your domain to whitelist']) +
                renderTPCard('facebookPixel', 'Facebook Pixel', 'bi-facebook', tp, ['Login to Ads Manager','Open Events Manager','Copy Pixel ID']) +
                '</div>' +
                renderTPCard('facebookComment', 'Facebook Comment', 'bi-chat-quote', tp, ['Login to Facebook','Visit developers.facebook.com/apps','Create an App','Get App ID from Dashboard']) +
                '</div>';
        } else if (tab === 'notifications') {
            html = '<div class="form-section">' +
                '<div class="toggle-row"><div class="toggle-info"><strong>Email Alerts</strong></div>' +
                '<button class="toggle-switch ' + (s.notifications.emailAlerts ? 'on' : '') + '" onclick="App.toggleNotifSetting(\'emailAlerts\')"><span class="toggle-knob"></span></button></div>' +
                '<div class="toggle-row"><div class="toggle-info"><strong>SMS Alerts</strong></div>' +
                '<button class="toggle-switch ' + (s.notifications.smsAlerts ? 'on' : '') + '" onclick="App.toggleNotifSetting(\'smsAlerts\')"><span class="toggle-knob"></span></button></div>' +
                '<div class="toggle-row"><div class="toggle-info"><strong>Push Notifications</strong></div>' +
                '<button class="toggle-switch ' + (s.notifications.pushNotifications ? 'on' : '') + '" onclick="App.toggleNotifSetting(\'pushNotifications\')"><span class="toggle-knob"></span></button></div>' +
                '</div>';
        } else if (tab === 'social') {
            html = '<div class="form-section">' +
                '<div class="toggle-row"><div class="toggle-info"><strong>Facebook Login</strong><p class="text-muted">Allow users to login with Facebook</p></div>' +
                '<button class="toggle-switch ' + (s.social.facebookLogin ? 'on' : '') + '" onclick="App.toggleSocial(\'facebookLogin\')"><span class="toggle-knob"></span></button></div>' +
                '<div class="form-group"><label>Facebook App ID</label><input type="text" class="form-control" value="' + (s.social.facebookClientId || '') + '"></div>' +
                '<div class="toggle-row"><div class="toggle-info"><strong>Google Login</strong><p class="text-muted">Allow users to login with Google</p></div>' +
                '<button class="toggle-switch ' + (s.social.googleLogin ? 'on' : '') + '" onclick="App.toggleSocial(\'googleLogin\')"><span class="toggle-knob"></span></button></div>' +
                '<div class="form-group"><label>Google Client ID</label><input type="text" class="form-control" value="' + (s.social.googleClientId || '') + '"></div>' +
                '<button class="btn btn-primary" onclick="App.saveSocialSettings()">Save Settings</button>' +
                '</div>';
        } else if (tab === 'language') {
            var langs = MockData.languages || [
                { code: 'en', name: 'English' }, { code: 'hi', name: 'Hindi' }, { code: 'mr', name: 'Marathi' },
                { code: 'ta', name: 'Tamil' }, { code: 'te', name: 'Telugu' }, { code: 'kn', name: 'Kannada' },
            ];
            var currentLang = localStorage.getItem('tatito_lang') || 'en';
            html = '<div class="form-section"><p class="text-muted" style="margin-bottom:1rem">Select your preferred language for the admin panel.</p>' +
                '<div class="lang-grid">' + langs.map(function(l) {
                    return '<div class="lang-card ' + (currentLang === l.code ? 'active' : '') + '" onclick="App.changeLanguage(\'' + l.code + '\')">' +
                        '<div class="lang-name">' + l.name + '</div>' +
                        (currentLang === l.code ? '<i class="bi bi-check-circle-fill lang-check"></i>' : '') +
                        '</div>';
                }).join('') + '</div></div>';
        }
        document.getElementById('settingsTabContent').innerHTML = html;
    }

    function renderTPCard(key, title, icon, tp, steps) {
        var data = tp[key] || {};
        var fieldLabel = { recaptcha: { fields: [{ label: 'Site KEY', key: 'siteKey' }, { label: 'SECRET KEY', key: 'secretKey' }] }, googleAnalytics: { fields: [{ label: 'Tracking ID', key: 'trackingId' }] }, facebookChat: { fields: [{ label: 'Facebook Page ID', key: 'pageId' }] }, facebookPixel: { fields: [{ label: 'Facebook Pixel ID', key: 'pixelId' }] }, facebookComment: { fields: [{ label: 'Facebook App ID', key: 'appId' }] } };
        var conf = fieldLabel[key] || { fields: [] };
        var html = '<div class="card" style="padding:0"><div style="padding:14px 16px;border-bottom:1px solid var(--line);font-weight:700;font-size:0.85rem"><i class="bi ' + icon + '" style="color:var(--gold)"></i> ' + title + '</div><div class="card-body">' +
            '<div class="toggle-row" style="margin-bottom:12px"><div class="toggle-info"><strong>Activation</strong></div>' +
            '<button class="toggle-switch ' + (data.enabled ? 'on' : '') + '" onclick="App.toggleThirdParty(\'' + key + '\')"><span class="toggle-knob"></span></button></div>';
        conf.fields.forEach(function(f) {
            html += '<div class="form-group"><label>' + f.label + '</label><input type="text" class="form-control" value="' + (data[f.key] || '') + '"></div>';
        });
        html += '<button class="btn btn-primary btn-sm" onclick="Helpers.toast(\'' + title + ' saved\', \'success\')">Save</button>';
        if (steps) {
            html += '<div style="margin-top:12px;padding:10px;background:var(--ivory);border-radius:8px;font-size:0.72rem;color:var(--gray-500)"><strong>How to configure:</strong><ol style="padding-left:16px;margin-top:4px">';
            steps.forEach(function(s) { html += '<li>' + s + '</li>'; });
            html += '</ol></div>';
        }
        html += '</div></div>';
        return html;
    }

    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Settings</h3><p class="text-muted">Marketplace configuration</p></div></div>' +
        '<div class="settings-layout"><div class="settings-sidebar">' +
        tabs.map(function(t) { return '<a href="javascript:void(0)" class="settings-tab ' + (self._settingsTab === t.id ? 'active' : '') + '" onclick="App.switchSettingsTab(\'' + t.id + '\')"><i class="bi ' + t.icon + '"></i> ' + t.label + '</a>'; }).join('') +
        '</div><div class="settings-main"><div id="settingsTabContent"></div></div></div></div>';

    renderTab();
    self._renderSettingsTab = renderTab;
};

/* ===== Upload preview helper ===== */
App._previewUpload = function(input, nameId, previewId) {
    if (!input.files || !input.files[0]) return;
    var file = input.files[0];
    var nameEl = document.getElementById(nameId);
    if (nameEl) nameEl.textContent = file.name + ' (' + Math.round(file.size / 1024) + ' KB)';
    var reader = new FileReader();
    reader.onload = function(e) {
        if (previewId) { var p = document.getElementById(previewId); if (p) p.src = e.target.result; }
        var previewImg = input.closest('.upload-field').querySelector('img');
        if (previewImg) { previewImg.src = e.target.result; previewImg.style.display = 'block'; }
    };
    reader.readAsDataURL(file);
};

/* ===== General Settings save ===== */
App.saveGeneralSettings = function() {
    var gs = MockData.generalSettings;
    var get = function(id) { var el = document.getElementById(id); return el ? el.value : ''; };
    gs.systemName = get('gsSystemName');
    gs.timezone = get('gsTimezone');
    gs.memberCodePrefix = get('gsCodePrefix');
    gs.memberMinAge = get('gsMinAge');
    gs.profilePicturePrivacy = get('gsProfilePrivacy');
    gs.galleryImagePrivacy = get('gsGalleryPrivacy');
    if (typeof Bridge !== 'undefined') { Bridge.Data.saveEntity('settings', MockData.settings); Bridge.Settings.save(MockData.settings); }
    Helpers.toast('General settings saved successfully', 'success');
};

App.switchSettingsTab = function(tabId) {
    this._settingsTab = tabId;
    // Update active class on sidebar tabs
    document.querySelectorAll('.settings-tab').forEach(function(el) {
        el.classList.remove('active');
    });
    var activeTab = document.querySelector('.settings-tab[onclick*="' + tabId + '"]');
    if (activeTab) activeTab.classList.add('active');
    if (this._renderSettingsTab) this._renderSettingsTab();
};
App.toggleFeature = function(key) {
    var s = MockData.settings; if (!s || !s.features) return;
    s.features[key] = !s.features[key];
    if (typeof Bridge !== 'undefined') { Bridge.Data.saveEntity('settings', MockData.settings); Bridge.Settings.save(MockData.settings); }
    Helpers.toast((s.features[key] ? 'Enabled' : 'Disabled') + ': ' + key, 'success');
    if (this._renderSettingsTab) this._renderSettingsTab();
};
App.togglePaymentSetting = function(key) {
    var s = MockData.settings; if (!s || !s.payment) return;
    s.payment[key] = !s.payment[key];
    if (typeof Bridge !== 'undefined') { Bridge.Data.saveEntity('settings', MockData.settings); Bridge.Settings.save(MockData.settings); }
    Helpers.toast('Payment setting updated', 'success');
    if (this._renderSettingsTab) this._renderSettingsTab();
};
App.toggleNotifSetting = function(key) {
    var s = MockData.settings; if (!s || !s.notifications) return;
    s.notifications[key] = !s.notifications[key];
    if (typeof Bridge !== 'undefined') { Bridge.Data.saveEntity('settings', MockData.settings); Bridge.Settings.save(MockData.settings); }
    Helpers.toast('Notification setting updated', 'success');
    if (this._renderSettingsTab) this._renderSettingsTab();
};
App.changeLanguage = function(code) {
    localStorage.setItem('tatito_lang', code);
    if (typeof I18n !== 'undefined' && I18n.setLang) I18n.setLang(code);
    Helpers.toast('Language changed successfully', 'success');
    if (this._renderSettingsTab) this._renderSettingsTab();
};
App.toggleActivation = function(key) {
    var s = MockData.settings; if (!s || !s.activation) return;
    s.activation[key] = !s.activation[key];
    if (typeof Bridge !== 'undefined') { Bridge.Data.saveEntity('settings', MockData.settings); Bridge.Settings.save(MockData.settings); }
    Helpers.toast((s.activation[key] ? 'Enabled' : 'Disabled') + ': ' + key, 'success');
    if (this._renderSettingsTab) this._renderSettingsTab();
};
App.toggleSocial = function(key) {
    var s = MockData.settings; if (!s || !s.social) return;
    s.social[key] = !s.social[key];
    if (typeof Bridge !== 'undefined') { Bridge.Data.saveEntity('settings', MockData.settings); Bridge.Settings.save(MockData.settings); }
    Helpers.toast((s.social[key] ? 'Enabled' : 'Disabled') + ': ' + key, 'success');
    if (this._renderSettingsTab) this._renderSettingsTab();
};
App.toggleThirdParty = function(key) {
    var tp = MockData.thirdPartySettings; if (!tp || !tp[key]) return;
    tp[key].enabled = !tp[key].enabled;
    if (typeof Bridge !== 'undefined') { Bridge.Data.saveEntity('settings', MockData.settings); Bridge.Settings.save(MockData.settings); }
    Helpers.toast(key + ' ' + (tp[key].enabled ? 'enabled' : 'disabled'), 'success');
    if (this._renderSettingsTab) this._renderSettingsTab();
};
App.saveSmtpSettings = function() {
    var smtp = MockData.smtpSettings;
    var get = function(id) { var el = document.getElementById(id); return el ? el.value : ''; };
    smtp.type = get('smtpType'); smtp.host = get('smtpHost'); smtp.port = get('smtpPort');
    smtp.encryption = get('smtpEncryption'); smtp.username = get('smtpUsername');
    smtp.password = get('smtpPassword'); smtp.fromAddress = get('smtpFromAddr'); smtp.fromName = get('smtpFromName');
    if (typeof Bridge !== 'undefined') { Bridge.Data.saveEntity('settings', MockData.settings); Bridge.Settings.save(MockData.settings); }
    Helpers.toast('SMTP settings saved successfully', 'success');
};
App.sendTestEmail = function() {
    var emailEl = document.getElementById('smtpTestEmail');
    if (!emailEl || !emailEl.value.trim()) { Helpers.toast('Please enter a test email address', 'error'); return; }
    Helpers.toast('Test email sent to ' + emailEl.value.trim(), 'success');
};
App.saveSocialSettings = function() {
    if (typeof Bridge !== 'undefined') { Bridge.Data.saveEntity('settings', MockData.settings); Bridge.Settings.save(MockData.settings); }
    Helpers.toast('Social login settings saved', 'success');
};
