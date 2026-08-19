'use strict';
/* MODULE 0: Home Screen — Video Banners
   ================================================================
   NEW: This page now shows the REAL hero slider slides from the
   frontend homepage (index.html). Admin can:
   - View all slider slides (matching the frontend)
   - Edit slide text (tag, title, description, CTA)
   - Change slide background image
   - Add/remove slides
   - Changes persist via Bridge.Data and reflect on the frontend
     through FrontendBridge.getAdminHeroSlides()

   OLD CODE: The original MockData.homeVideoBanners CRUD code is
   commented out below. It used fake banner data that was never
   connected to the storefront.
   ================================================================ */

App.pages['home-video-banners'] = function() {
    /* ---- NEW: Fetch real hero slider slides via Bridge.Catalog ---- */
    var slides = (typeof Bridge !== 'undefined' && Bridge.Catalog) ? Bridge.Catalog.getHeroSlides() : [];

    /* ---- NEW: Read slider visibility setting ---- */
    var adminData = (typeof Bridge !== 'undefined') ? Bridge.Data.load() : (MockData || {});
    var hps = adminData.homePageSettings || {};
    var sliderVisible = hps.showSlider !== false; /* default: visible */

    document.getElementById('pageContent').innerHTML =
        '<div class="page-content">' +
        '<div class="page-toolbar"><div><h3>Video Banners / Hero Slider</h3><p class="text-muted">Homepage hero slider slides — sourced from frontend</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-primary" onclick="App._addHeroSlide()"><i class="bi bi-plus-lg"></i> Add Slide</button></div></div>' +

        /* ---- NEW: Show/Hide Hero Slider master toggle ---- */
        '<div class="card" style="margin-bottom:16px"><div class="card-body" style="display:flex;justify-content:space-between;align-items:center">' +
        '<div><strong style="font-size:0.92rem"><i class="bi bi-toggle-on" style="color:var(--gold)"></i> Hero Slider Visibility</strong>' +
        '<p class="text-muted" style="font-size:0.78rem;margin-top:2px">Toggle OFF to completely hide the hero slider from the homepage</p></div>' +
        '<div style="display:flex;align-items:center;gap:10px">' +
        '<span style="font-size:0.82rem;color:var(--gray-500)">' + (sliderVisible ? 'Visible' : 'Hidden') + '</span>' +
        '<button class="toggle-switch ' + (sliderVisible ? 'on' : '') + '" onclick="App._toggleHeroSliderVisibility()"><span class="toggle-knob"></span></button>' +
        '</div></div></div>' +

        /* ---- NEW: Info banner ---- */
        '<div style="padding:10px 14px;border-radius:8px;background:rgba(201,162,75,0.1);border:1px solid rgba(201,162,75,0.3);margin-bottom:16px;font-size:0.82rem;color:var(--gray-600)">' +
        '<i class="bi bi-info-circle" style="color:var(--gold)"></i> These slides appear on the homepage hero slider. Changes are reflected on the storefront immediately.' +
        '</div>' +

        /* ---- NEW: Slides grid ---- */
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(350px,1fr));gap:16px">' +
        slides.map(function(slide, idx) {
            return '<div style="border:1px solid var(--line);border-radius:12px;overflow:hidden;background:var(--card-bg)">' +
                '<div style="height:160px;background:linear-gradient(135deg,rgba(26,18,15,0.55),rgba(90,10,24,0.45)),url(\'' + (slide.image || '') + '\') center/cover;position:relative;padding:14px;display:flex;flex-direction:column;justify-content:flex-end;color:#fff">' +
                '<span style="font-size:0.7rem;background:rgba(255,255,255,0.15);padding:2px 8px;border-radius:4px;display:inline-block;width:fit-content;margin-bottom:4px">' + (slide.tag || '') + '</span>' +
                '<h5 style="color:#fff;margin:0;font-size:1rem">' + Helpers.escapeHtml(slide.title || '') + '</h5>' +
                '<p style="font-size:0.75rem;opacity:0.8;margin:2px 0 0">' + Helpers.escapeHtml(slide.desc || '') + '</p>' +
                '<span style="position:absolute;top:8px;left:8px;background:var(--ruby);color:#fff;padding:2px 8px;border-radius:4px;font-size:0.65rem">Slide ' + (idx + 1) + '</span>' +
                (slide.visible === false ? '<span style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.6);color:#fff;padding:2px 8px;border-radius:4px;font-size:0.6rem"><i class="bi bi-eye-slash"></i> Hidden</span>' : '') +
                (slide.visible === false ? '<div style="opacity:0.4;filter:grayscale(0.6)">' : '') +
                '</div>' +
                '<div style="padding:10px">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
                '<span style="font-size:0.75rem;color:var(--gray-500)">CTA: <strong>' + Helpers.escapeHtml(slide.ctaText || 'N/A') + '</strong> &rarr; ' + Helpers.escapeHtml(slide.ctaLink || '') + '</span>' +
                '<div style="display:flex;align-items:center;gap:6px">' +
                '<span style="font-size:0.7rem;color:var(--gray-500)">' + (slide.visible === false ? 'Hidden' : 'Visible') + '</span>' +
                '<button class="toggle-switch ' + (slide.visible !== false ? 'on' : '') + '" onclick="App._toggleSlideVisibility(\'' + slide.id + '\')" title="Show/Hide slide"><span class="toggle-knob"></span></button>' +
                '</div>' +
                '</div>' +
                '<div style="display:flex;gap:6px">' +
                '<button class="btn btn-outline btn-sm" onclick="App._editHeroSlide(\'' + slide.id + '\')"><i class="bi bi-pencil"></i> Edit</button>' +
                '<button class="btn btn-outline btn-sm" onclick="App._moveHeroSlide(\'' + slide.id + '\', -1)" ' + (idx === 0 ? 'disabled' : '') + '><i class="bi bi-arrow-left"></i></button>' +
                '<button class="btn btn-outline btn-sm" onclick="App._moveHeroSlide(\'' + slide.id + '\', 1)" ' + (idx === slides.length - 1 ? 'disabled' : '') + '><i class="bi bi-arrow-right"></i></button>' +
                '<button class="btn btn-outline btn-sm" style="color:var(--ruby);border-color:var(--ruby)" onclick="App._deleteHeroSlide(\'' + slide.id + '\')"><i class="bi bi-trash"></i></button>' +
                '</div>' +
                '</div>' +
            '</div>';
        }).join('') +
        '</div>' +
        '</div>';
};

/* ---- NEW: Toggle hero slider visibility on/off on the storefront ---- */
App._toggleHeroSliderVisibility = function() {
    var data = Bridge.Data.load();
    if (!data.homePageSettings) data.homePageSettings = {};
    var current = data.homePageSettings.showSlider !== false; /* default: visible */
    data.homePageSettings.showSlider = !current;
    Bridge.Data.saveEntity('homePageSettings', data.homePageSettings);
    Helpers.toast('Hero slider is now ' + (!current ? 'visible' : 'hidden') + ' on the storefront', 'success');
    App.navigate('home-video-banners');
};

/* ---- NEW: Toggle individual slide visibility ---- */
App._toggleSlideVisibility = function(slideId) {
    var slides = Bridge.Catalog.getHeroSlides();
    var s = slides.find(function(x) { return x.id === slideId; });
    if (!s) return;
    s.visible = !(s.visible !== false); /* toggle: if currently visible (true or undefined), set false; if false, set true */
    _persistHeroSlides(slides);
    Helpers.toast('Slide "' + (s.title || slideId) + '" is now ' + (s.visible !== false ? 'visible' : 'hidden'), 'success');
    App.navigate('home-video-banners');
};

/* ---- NEW: Add a hero slide ---- */
App._addHeroSlide = function() {
    var html = '<div class="modal-header"><h3 class="modal-title">Add Hero Slide</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="slideForm">' +
        '<div class="form-group"><label>Tag / Badge</label><input type="text" class="form-control" name="tag" placeholder="✨ New Collection"></div>' +
        '<div class="form-group"><label>Title *</label><input type="text" class="form-control" name="title" required placeholder="Royal Bridal Collection"></div>' +
        '<div class="form-group"><label>Description</label><textarea class="form-control" name="desc" rows="2" placeholder="Handcrafted lehengas..."></textarea></div>' +
        '<div class="form-group"><label>Background Image URL *</label><input type="url" class="form-control" name="image" required placeholder="https://images.unsplash.com/..."></div>' +
        '<div class="form-row"><div class="form-group"><label>CTA Button Text</label><input type="text" class="form-control" name="ctaText" placeholder="Explore"></div>' +
        '<div class="form-group"><label>CTA Link</label><input type="text" class="form-control" name="ctaLink" placeholder="category.html?category=wedding"></div></div>' +
        '</form></div>' +
        '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App._saveHeroSlide()">Save</button></div>';
    Helpers.openModal(html);
};

/* ---- NEW: Save new slide ---- */
App._saveHeroSlide = function() {
    var f = document.getElementById('slideForm');
    var fd = new FormData(f);
    var slides = Bridge.Catalog.getHeroSlides();
    slides.push({
        id: 'SL' + String(slides.length + 1).padStart(3, '0'),
        tag: fd.get('tag') || '',
        title: fd.get('title') || '',
        desc: fd.get('desc') || '',
        image: fd.get('image') || '',
        ctaText: fd.get('ctaText') || '',
        ctaLink: fd.get('ctaLink') || ''
    });
    _persistHeroSlides(slides);
    Helpers.closeModal();
    Helpers.toast('Hero slide added', 'success');
    App.navigate('home-video-banners');
};

/* ---- NEW: Edit a hero slide ---- */
App._editHeroSlide = function(id) {
    var slides = Bridge.Catalog.getHeroSlides();
    var s = slides.find(function(x) { return x.id === id; });
    if (!s) return;
    var html = '<div class="modal-header"><h3 class="modal-title">Edit Hero Slide</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="slideForm">' +
        '<div class="form-group"><label>Tag / Badge</label><input type="text" class="form-control" name="tag" value="' + Helpers.escapeHtml(s.tag || '') + '"></div>' +
        '<div class="form-group"><label>Title *</label><input type="text" class="form-control" name="title" value="' + Helpers.escapeHtml(s.title || '') + '" required></div>' +
        '<div class="form-group"><label>Description</label><textarea class="form-control" name="desc" rows="2">' + Helpers.escapeHtml(s.desc || '') + '</textarea></div>' +
        '<div class="form-group"><label>Background Image URL *</label><input type="url" class="form-control" name="image" value="' + Helpers.escapeHtml(s.image || '') + '" required></div>' +
        '<div class="form-row"><div class="form-group"><label>CTA Button Text</label><input type="text" class="form-control" name="ctaText" value="' + Helpers.escapeHtml(s.ctaText || '') + '"></div>' +
        '<div class="form-group"><label>CTA Link</label><input type="text" class="form-control" name="ctaLink" value="' + Helpers.escapeHtml(s.ctaLink || '') + '"></div></div>' +
        '</form></div>' +
        '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App._updateHeroSlide(\'' + id + '\')">Save</button></div>';
    Helpers.openModal(html);
};

/* ---- NEW: Update slide ---- */
App._updateHeroSlide = function(id) {
    var f = document.getElementById('slideForm');
    var fd = new FormData(f);
    var slides = Bridge.Catalog.getHeroSlides();
    var s = slides.find(function(x) { return x.id === id; });
    if (!s) return;
    s.tag = fd.get('tag') || '';
    s.title = fd.get('title') || '';
    s.desc = fd.get('desc') || '';
    s.image = fd.get('image') || '';
    s.ctaText = fd.get('ctaText') || '';
    s.ctaLink = fd.get('ctaLink') || '';
    _persistHeroSlides(slides);
    Helpers.closeModal();
    Helpers.toast('Hero slide updated', 'success');
    App.navigate('home-video-banners');
};

/* ---- NEW: Move slide up/down ---- */
App._moveHeroSlide = function(id, direction) {
    var slides = Bridge.Catalog.getHeroSlides();
    var idx = slides.findIndex(function(x) { return x.id === id; });
    if (idx === -1) return;
    var newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= slides.length) return;
    var temp = slides[idx];
    slides[idx] = slides[newIdx];
    slides[newIdx] = temp;
    _persistHeroSlides(slides);
    App.navigate('home-video-banners');
};

/* ---- NEW: Delete slide ---- */
App._deleteHeroSlide = function(id) {
    Helpers.confirm('Delete this slide?', 'It will be removed from the hero slider.', 'warning').then(function(r) {
        if (r.isConfirmed) {
            var slides = Bridge.Catalog.getHeroSlides();
            slides = slides.filter(function(x) { return x.id !== id; });
            _persistHeroSlides(slides);
            Helpers.toast('Slide deleted', 'success');
            App.navigate('home-video-banners');
        }
    });
};

/* ---- NEW: Persist hero slides to admin localStorage ---- */
function _persistHeroSlides(slides) {
    var data = Bridge.Data.load();
    if (!data.homePageSettings) data.homePageSettings = {};
    data.homePageSettings.sliderImages = slides;
    Bridge.Data.saveEntity('homePageSettings', data.homePageSettings);
}

/* ================================================================
   OLD CODE — MockData.homeVideoBanners CRUD (commented out)
   The code below used fake banner data. Preserved for reference.
   ================================================================ */

/*
App.pages['home-video-banners'] = function() {
    var data = MockData.homeVideoBanners;
    document.getElementById('pageContent').innerHTML = ...
    // [original code omitted for brevity — see git history]
};
App.addVideoBanner = function() { ... };
App.saveVideoBanner = function() { ... };
App.editVideoBanner = function(id) { ... };
App.saveEditVideoBanner = function(id) { ... };
App.deleteVideoBanner = function(id) { ... };
*/
