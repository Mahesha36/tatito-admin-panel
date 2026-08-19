'use strict';
/* MODULE 0: Home Screen — Collections
   ================================================================
   NEW: This page now reads REAL frontend data from data.js via
   Bridge.Catalog instead of MockData.homeCollections.
   - Shows actual storefront categories (CATEGORIES array)
   - Shows actual storefront stores (STORES array)
   - Admin can toggle visibility and reorder
   - Changes persist via Bridge.Data and reflect on the frontend

   OLD CODE: The original MockData.homeCollections CRUD code is
   commented out below. It used fake data that was never connected
   to the storefront.
   ================================================================ */

App.pages['home-collections'] = function() {
    /* ---- NEW: Fetch real frontend data via Bridge.Catalog ---- */
    var categories = (typeof Bridge !== 'undefined' && Bridge.Catalog) ? Bridge.Catalog.getCategories() : [];
    var navVerticals = (typeof Bridge !== 'undefined' && Bridge.Catalog) ? Bridge.Catalog.getNavVerticals() : [];
    var collectionSections = (typeof Bridge !== 'undefined' && Bridge.Catalog) ? Bridge.Catalog.getCollectionSections() : [];
    var stores = (typeof Bridge !== 'undefined' && Bridge.Catalog) ? Bridge.Catalog.getStores() : [];

    /* Load admin visibility/order settings (persisted overrides) */
    var adminData = (typeof Bridge !== 'undefined') ? Bridge.Data.load() : (MockData || {});
    var collectionSettings = adminData.homeCollectionsSettings || {};
    var hiddenItems = collectionSettings.hidden || [];
    var sortOrder = collectionSettings.sortOrder || {};

    /* Combine all frontend categories into one list */
    var allItems = [];
    navVerticals.forEach(function(v) { allItems.push({ type: 'Nav Vertical', id: v.slug, name: v.name, image: v.image, emoji: v.emoji, url: '#mega-' + v.slug, productCount: _countStoreProducts(v.slug) }); });
    collectionSections.forEach(function(c) { allItems.push({ type: 'Collection Section', id: c.slug, name: c.name, image: c.image, emoji: c.emoji, url: 'category.html?category=' + c.slug, productCount: _countStoreProducts(c.slug) }); });
    categories.forEach(function(c) { allItems.push({ type: 'Category', id: c.slug, name: c.name, image: c.image, emoji: c.emoji, url: 'category.html?category=' + c.slug, productCount: _countStoreProducts(c.slug) }); });

    document.getElementById('pageContent').innerHTML =
        '<div class="page-content">' +
        '<div class="page-toolbar"><div><h3>Home Collections</h3><p class="text-muted">Storefront categories & collections — sourced from frontend data</p></div>' +
        '<div class="toolbar-actions">' +
        '<button class="btn btn-outline btn-sm" onclick="App._resetCollectionSettings()"><i class="bi bi-arrow-clockwise"></i> Reset to Defaults</button>' +
        '</div></div>' +

        /* ---- NEW: Stats Summary ---- */
        '<div class="stats-row" style="display:flex;gap:16px;margin-bottom:20px;flex-wrap:wrap">' +
        _statCard('Categories', categories.length, 'bi-grid') +
        _statCard('Nav Verticals', navVerticals.length, 'bi-list-nested') +
        _statCard('Collection Sections', collectionSections.length, 'bi-collection') +
        _statCard('Stores', stores.length, 'bi-shop') +
        '</div>' +

        /* ---- NEW: Categories grid from frontend ---- */
        '<div class="card"><div class="card-body">' +
        '<h5 style="margin-bottom:12px"><i class="bi bi-grid-3x3-gap-fill" style="color:var(--gold)"></i> Storefront Categories <span class="text-muted" style="font-size:0.8rem;font-weight:normal">(from frontend data.js)</span></h5>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px">' +
        allItems.map(function(item) {
            var isVisible = hiddenItems.indexOf(item.id) === -1;
            return '<div style="border:1px solid var(--line);border-radius:10px;overflow:hidden;background:var(--card-bg)">' +
                '<div style="height:100px;background:url(\'' + (item.image || '') + '\') center/cover;position:relative">' +
                '<span style="position:absolute;top:6px;right:6px;padding:2px 8px;border-radius:4px;font-size:0.65rem;background:rgba(0,0,0,0.6);color:#fff">' + item.type + '</span>' +
                '</div>' +
                '<div style="padding:10px">' +
                '<div style="font-weight:600;font-size:0.85rem">' + (item.emoji || '') + ' ' + Helpers.escapeHtml(item.name) + '</div>' +
                '<div style="font-size:0.72rem;color:var(--gray-500);margin-top:2px">' + item.productCount + ' products &bull; <a href="/frontend/' + item.url + '" target="_blank" style="color:var(--gold)">View</a></div>' +
                '<div style="margin-top:8px">' +
                '<button class="toggle-switch ' + (isVisible ? 'on' : '') + '" onclick="App._toggleCollectionVisibility(\'' + item.id + '\')"><span class="toggle-knob"></span></button>' +
                '<span style="font-size:0.72rem;margin-left:6px;color:var(--gray-500)">' + (isVisible ? 'Visible' : 'Hidden') + '</span>' +
                '</div>' +
                '</div>' +
            '</div>';
        }).join('') +
        '</div></div></div>' +

        /* ---- NEW: Stores grid from frontend ---- */
        '<div class="card" style="margin-top:16px"><div class="card-body">' +
        '<h5 style="margin-bottom:12px"><i class="bi bi-shop-window" style="color:var(--gold)"></i> Storefront Stores <span class="text-muted" style="font-size:0.8rem;font-weight:normal">(from frontend data.js — ' + stores.length + ' stores)</span></h5>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;max-height:500px;overflow-y:auto">' +
        stores.map(function(s) {
            var productCount = s.products ? s.products.length : 0;
            var isVisible = hiddenItems.indexOf('store-' + s.id) === -1;
            return '<div style="border:1px solid var(--line);border-radius:10px;overflow:hidden;background:var(--card-bg)">' +
                '<div style="height:80px;background:url(\'' + (s.image || '') + '\') center/cover;position:relative;display:flex;align-items:flex-end;padding:6px">' +
                (s.badge ? '<span style="padding:2px 8px;border-radius:4px;font-size:0.62rem;background:var(--gold);color:#fff">' + s.badge + '</span>' : '') +
                '</div>' +
                '<div style="padding:10px">' +
                '<div style="font-weight:600;font-size:0.85rem">' + (s.emoji || '') + ' ' + Helpers.escapeHtml(s.name) + '</div>' +
                '<div style="font-size:0.72rem;color:var(--gray-500);margin-top:2px">' + productCount + ' products &bull; ⭐ ' + (s.rating || 'N/A') + '</div>' +
                '<div style="margin-top:8px">' +
                '<button class="toggle-switch ' + (isVisible ? 'on' : '') + '" onclick="App._toggleCollectionVisibility(\'store-' + s.id + '\')"><span class="toggle-knob"></span></button>' +
                '<span style="font-size:0.72rem;margin-left:6px;color:var(--gray-500)">' + (isVisible ? 'Visible' : 'Hidden') + '</span>' +
                '</div>' +
                '</div>' +
            '</div>';
        }).join('') +
        '</div></div></div>' +
        '</div>';
};

/* ---- NEW: Helper to count products in a category from frontend data ---- */
function _countStoreProducts(categorySlug) {
    if (typeof STORES === 'undefined') return 0;
    var count = 0;
    STORES.forEach(function(s) {
        if (s.categoryId === categorySlug || s.category === categorySlug) {
            count += s.products ? s.products.length : 0;
        }
    });
    return count;
}

/* ---- NEW: Helper stat card ---- */
function _statCard(label, value, icon) {
    return '<div style="flex:1;min-width:120px;padding:14px;border-radius:10px;background:var(--card-bg);border:1px solid var(--line)">' +
        '<div style="display:flex;align-items:center;gap:8px"><i class="bi ' + icon + '" style="font-size:1.2rem;color:var(--gold)"></i>' +
        '<div><div style="font-size:1.3rem;font-weight:700">' + value + '</div><div style="font-size:0.72rem;color:var(--gray-500)">' + label + '</div></div></div></div>';
}

/* ---- NEW: Toggle visibility of a category/store on the frontend ---- */
App._toggleCollectionVisibility = function(itemId) {
    var data = Bridge.Data.load();
    if (!data.homeCollectionsSettings) data.homeCollectionsSettings = { hidden: [], sortOrder: {} };
    if (!data.homeCollectionsSettings.hidden) data.homeCollectionsSettings.hidden = [];
    var idx = data.homeCollectionsSettings.hidden.indexOf(itemId);
    if (idx === -1) {
        data.homeCollectionsSettings.hidden.push(itemId);
    } else {
        data.homeCollectionsSettings.hidden.splice(idx, 1);
    }
    Bridge.Data.saveEntity('homeCollectionsSettings', data.homeCollectionsSettings);
    Helpers.toast(itemId + ' is now ' + (idx === -1 ? 'hidden' : 'visible') + ' on the storefront', 'success');
    App.navigate('home-collections');
};

/* ---- NEW: Reset collection visibility settings ---- */
App._resetCollectionSettings = function() {
    var data = Bridge.Data.load();
    data.homeCollectionsSettings = { hidden: [], sortOrder: {} };
    Bridge.Data.saveEntity('homeCollectionsSettings', data.homeCollectionsSettings);
    Helpers.toast('Collection settings reset to defaults', 'success');
    App.navigate('home-collections');
};

/* ================================================================
   OLD CODE — MockData.homeCollections CRUD (commented out)
   The code below used fake data that was never connected to the
   storefront. It is preserved here for reference.
   ================================================================ */

/*
App.addHomeCollection = function() {
    var html = '<div class="modal-header"><h3 class="modal-title">Add Home Collection</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="hcForm">' +
        '<div class="form-row"><div class="form-group"><label>Target Module *</label><select class="form-control" name="target_module"><option value="fashions">Fashions</option><option value="weddings">Weddings</option><option value="jewellery">Jewellery</option></select></div>' +
        '<div class="form-group"><label>Gender *</label><select class="form-control" name="gender"><option value="Men">Men</option><option value="Women">Women</option><option value="Kids">Kids</option></select></div></div>' +
        '<div class="form-group"><label>Title *</label><input type="text" class="form-control" name="title" required></div>' +
        '<div class="form-group"><label>Subtitle</label><input type="text" class="form-control" name="subtitle"></div>' +
        '<div class="form-group"><label>Image</label><div class="upload-zone" onclick="this.querySelector(\'input\').click()"><i class="bi bi-cloud-arrow-up"></i><p>Click to upload image</p><input type="file" accept="image/*" hidden></div></div>' +
        '<div class="form-group"><label>Video URL</label><input type="url" class="form-control" name="video_url" placeholder="https://..."></div>' +
        '<div class="form-row"><div class="form-group"><label>Sort Order</label><input type="number" class="form-control" name="sort_order" value="1"></div>' +
        '<div class="form-group"><label>Active</label><div><button type="button" class="toggle-switch on" onclick="this.classList.toggle(\'on\')"><span class="toggle-knob"></span></button></div></div></div>' +
        '</form></div><div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveHomeCollection()">Save</button></div>';
    Helpers.openModal(html);
};
App.saveHomeCollection = function() {
    var f = document.getElementById('hcForm');
    var fd = new FormData(f);
    MockData.homeCollections.push({
        id: 'HC' + String(MockData.homeCollections.length + 1).padStart(3, '0'),
        target_module: fd.get('target_module'), gender: fd.get('gender'),
        title: fd.get('title'), subtitle: fd.get('subtitle') || '',
        image: 'assets/logo.svg', video_url: fd.get('video_url') || '',
        sort_order: parseInt(fd.get('sort_order')) || 1, is_active: f.querySelector('.toggle-switch').classList.contains('on')
    });
    Helpers.closeModal(); Helpers.toast('Collection added', 'success'); App.navigate('home-collections');
};
App.editHomeCollection = function(id) {
    var c = MockData.homeCollections.find(function(x) { return x.id === id; }); if (!c) return;
    var html = '<div class="modal-header"><h3 class="modal-title">Edit Collection</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="hcForm">' +
        '<div class="form-row"><div class="form-group"><label>Target Module</label><select class="form-control" name="target_module"><option ' + (c.target_module==='fashions'?'selected':'') + '>fashions</option><option ' + (c.target_module==='weddings'?'selected':'') + '>weddings</option><option ' + (c.target_module==='jewellery'?'selected':'') + '>jewellery</option></select></div>' +
        '<div class="form-group"><label>Gender</label><select class="form-control" name="gender"><option ' + (c.gender==='Men'?'selected':'') + '>Men</option><option ' + (c.gender==='Women'?'selected':'') + '>Women</option><option ' + (c.gender==='Kids'?'selected':'') + '>Kids</option></select></div></div>' +
        '<div class="form-group"><label>Title</label><input type="text" class="form-control" name="title" value="' + Helpers.escapeHtml(c.title) + '"></div>' +
        '<div class="form-group"><label>Subtitle</label><input type="text" class="form-control" name="subtitle" value="' + Helpers.escapeHtml(c.subtitle) + '"></div>' +
        '<div class="form-group"><label>Video URL</label><input type="url" class="form-control" name="video_url" value="' + (c.video_url||'') + '"></div>' +
        '<div class="form-row"><div class="form-group"><label>Sort Order</label><input type="number" class="form-control" name="sort_order" value="' + c.sort_order + '"></div>' +
        '<div class="form-group"><label>Active</label><div><button type="button" class="toggle-switch ' + (c.is_active?'on':'') + '" onclick="this.classList.toggle(\'on\')"><span class="toggle-knob"></span></button></div></div></div>' +
        '</form></div><div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveEditHomeCollection(\'' + id + '\')">Save</button></div>';
    Helpers.openModal(html);
};
App.saveEditHomeCollection = function(id) {
    var c = MockData.homeCollections.find(function(x){return x.id===id;}); if(!c) return;
    var f=document.getElementById('hcForm'); var fd=new FormData(f);
    c.target_module=fd.get('target_module'); c.gender=fd.get('gender'); c.title=fd.get('title'); c.subtitle=fd.get('subtitle')||''; c.video_url=fd.get('video_url')||''; c.sort_order=parseInt(fd.get('sort_order'))||1; c.is_active=f.querySelector('.toggle-switch').classList.contains('on');
    Helpers.closeModal(); Helpers.toast('Collection updated','success'); App.navigate('home-collections');
};
App.deleteHomeCollection = function(id) {
    Helpers.confirm('Delete this collection?','This cannot be undone.','warning').then(function(r){if(r.isConfirmed){MockData.homeCollections=MockData.homeCollections.filter(function(x){return x.id!==id;});Helpers.toast('Deleted','success');App.navigate('home-collections');}});
};
*/
