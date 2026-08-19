#!/usr/bin/env node
/* Capture legacy EDIT/ADD/VIEW modal HTML for every entity by executing the
 * legacy App.editXxx/addXxx/viewXxx functions with real MockData items and
 * intercepting Helpers.openModal output.
 * Output: /tmp/captured/_modal_forms.json — { pageKey: { 'edit-<id>': html, ... } }
 * Usage: node scripts/capture_modal_forms.cjs
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO = __dirname + '/..';
const COMMIT = '4da8bca';
const TMP = '/tmp/legacyjs';
const OUT = '/tmp/captured/_modal_forms.json';

execSync(`cd ${REPO} && rm -rf ${TMP} && mkdir -p ${TMP} && git archive ${COMMIT} public/admin/js | tar -x -C ${TMP}`, { stdio: 'pipe' });
const JSDIR = TMP + '/public/admin/js';

/* which App functions open which kind of modal, per page key */
const SPEC = {
  'products':        { edit: 'editProduct', args: (MD) => [MD.products[0].id], add: 'addProduct', view: 'viewProduct' },
  'categories':      { edit: null, add: 'addMainCategory' }, // tree editor: use custom fallback
  'currencies':      { edit: 'editCurrency', args: (MD) => [MD.currencies[0].id], add: 'addCurrency' },
  'customisation-options': { edit: 'editCustomOption', args: (MD) => [MD.customisationOptions[0].id], add: 'addCustomOption' },
  'customisation-studios': { edit: 'editStudio', args: (MD) => [MD.customisationStudios[0].id], add: 'addStudio' },
  'events-vip':      { edit: 'editVipEvent', args: (MD) => [MD.vipEvents[0].id], add: 'addVipEvent', view: 'viewVipEvent' },
  'jewellery-categories': { edit: 'editJewelCategory', args: (MD) => [MD.jewelleryCategories[0].id], add: 'addJewelCategory' },
  'jewellery-collections': { edit: 'editJewelCollection', args: (MD) => [MD.jewelleryCollections[0].id], add: 'addJewelCollection' },
  'jewellery-products': { edit: 'editJewelProduct', args: (MD) => [MD.jewelleryProducts[0].id], add: 'addJewelProduct', view: 'viewJewelProduct' },
  'languages':       { edit: 'editLanguage', args: (MD) => [MD.languages[0].id], add: 'addLanguage' },
  'offers':          { edit: 'editOffer', args: (MD) => [MD.offers[0].id], add: 'addOffer', view: 'viewOffer' },
  'cms':             { edit: 'editCmsPage', args: (MD) => [MD.cmsPages[0].id], add: 'addCmsPage', view: 'viewCmsPage' },
  'website-pages':   { edit: 'editWebsitePage', args: (MD) => [MD.websitePages[0].id], add: 'addWebsitePage' },
  'wedding-banners': { edit: 'editWeddingBanner', args: (MD) => [MD.weddingBanners[0].id], add: 'addWeddingBanner' },
  'wedding-collections': { edit: 'editWeddingCollection', args: (MD) => [MD.weddingCollections[0].id], add: 'addWeddingCollection' },
  'wedding-featured':{ edit: 'editWeddingFeatured', args: (MD) => [MD.weddingFeatured[0].id], add: 'addWeddingFeatured' },
  'boutiques':       { add: 'addBoutique', view: 'viewBoutique' },
  'events':          { add: 'addEvent', view: 'viewEvent' },
  'users':           { add: 'addUser' },
  'sellers':         { add: 'addSeller' },
  'designers':       { add: 'addDesigner' },
  'staff':           { add: 'addStaff' },
  'orders':          { edit: 'changeOrderStatus', args: (MD) => [MD.orders[0].id], view: 'viewOrder', viewArgs: (MD) => [MD.orders[0].id] },
  'support-tickets': { edit: 'updateTicketStatus', args: (MD) => [MD.supportTickets[0].id], view: 'viewTicket', viewArgs: (MD) => [MD.supportTickets[0].id] },
  'reviews':         { view: 'viewReview', viewArgs: (MD) => [MD.reviews[0].id] },
  'tracking':        { view: 'viewTracking', viewArgs: (MD) => [MD.orders[0].id] },
  'stylist-bookings':{ edit: 'updateStylistStatus', args: (MD) => [MD.stylistBookings[0].id], view: 'viewStylistBooking', viewArgs: (MD) => [MD.stylistBookings[0].id] },
  'event-rsvps':     { view: 'viewRSVP', viewArgs: (MD) => [MD.eventRSVPs[0].id] },
  'quotations':      { view: 'viewQuotation', viewArgs: (MD) => [MD.quotations[0].id] },
  'bespoke-orders':  { edit: 'updateBespokeStatus', args: (MD) => [MD.bespokeOrders[0].id], view: 'viewBespokeOrder', viewArgs: (MD) => [MD.bespokeOrders[0].id] },
  'customizations':  { view: 'viewCustomization', viewArgs: (MD) => [MD.customizations[0].id] },
  'contactQueries':  { view: 'viewQuery', viewArgs: (MD) => [MD.contactQueries[0].id], edit: 'replyQuery', args: (MD) => [MD.contactQueries[0].id] },
 };

function loadBundle() {
  const sandbox = makeSandbox();
  const files = ['helpers.js', 'member-actions.js', 'data.js', 'api.js', 'bridge.js'];
  let bundle = '';
  for (const f of files) bundle += fs.readFileSync(path.join(JSDIR, f), 'utf8') + '\n;\n';
  const fn = new Function('window', 'document', 'localStorage', 'sessionStorage', 'navigator', 'location', 'Chart', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'console', bundle + ';return {App:(typeof App!=="undefined"?App:null),Helpers:(typeof Helpers!=="undefined"?Helpers:null),MockData:(typeof MockData!=="undefined"?MockData:null),MemberActions:(typeof MemberActions!=="undefined"?MemberActions:null)};');
  return { sandbox, ctx: fn(sandbox.window, sandbox.document, sandbox.localStorage, sandbox.sessionStorage, sandbox.navigator, sandbox.location, undefined, (f) => 0, () => {}, () => 0, () => {}, console) };
}

function makeEl(tag) {
  const el = { tagName: String(tag || 'div').toUpperCase(), style: {}, dataset: {}, children: [], attributes: {}, _listeners: {}, classList: null };
  const set = new Set();
  el.classList = { add(...c) { c.forEach((x) => set.add(x)); }, remove(...c) { c.forEach((x) => set.delete(x)); }, toggle(c, f) { if (f === undefined) { set.has(c) ? set.delete(c) : set.add(c); } else if (f) set.add(c); else set.delete(c); }, contains(c) { return set.has(c); } };
  el.setAttribute = (k, v) => { el.attributes[k] = String(v); };
  el.getAttribute = (k) => (k in el.attributes ? el.attributes[k] : null);
  el.removeAttribute = (k) => { delete el.attributes[k]; };
  el.appendChild = (c) => { el.children.push(c); return c; };
  el.insertBefore = (c) => { el.children.push(c); return c; };
  el.removeChild = (c) => c; el.remove = () => {};
  el.querySelector = () => null; el.querySelectorAll = () => []; el.closest = () => null;
  el.addEventListener = (t, f) => { (el._listeners[t] = el._listeners[t] || []).push(f); };
  el.removeEventListener = () => {}; el.dispatchEvent = () => true; el.click = () => {}; el.focus = () => {}; el.blur = () => {};
  el.contains = () => false; el.getContext = () => null; el.checked = false; el.disabled = false; el.selectedIndex = 0; el.offsetHeight = 0;
  Object.defineProperty(el, 'innerHTML', { get: () => (el._html || ''), set: (v) => { el._html = String(v); }, configurable: true });
  Object.defineProperty(el, 'textContent', { get: () => (el._text || ''), set: (v) => { el._text = String(v); }, configurable: true });
  Object.defineProperty(el, 'className', { get: () => Array.from(set).join(' '), set: (v) => { set.clear(); String(v).split(/\s+/).filter(Boolean).forEach((x) => set.add(x)); }, configurable: true });
  el._value = ''; Object.defineProperty(el, 'value', { get: () => el._value, set: (v) => { el._value = String(v); }, configurable: true });
  return el;
}

function makeSandbox() {
  const modalHost = makeEl('div');
  let lastModal = null;
  const documentShim = {
    createElement: makeEl, createTextNode: () => ({ nodeType: 3 }), createDocumentFragment: () => makeEl('fragment'),
    getElementById: (id) => (id === 'modalOverlay' || id === 'modalBox' ? modalHost : null),
    querySelector: () => null, querySelectorAll: () => [], getElementsByTagName: () => [],
    addEventListener() {}, removeEventListener() {},
    body: makeEl('body'), documentElement: makeEl('html'), head: makeEl('head'), readyState: 'complete',
  };
  const sandbox = {
    document: documentShim,
    location: { href: 'http://localhost/admin/app.html', pathname: '/admin/app.html', hash: '', search: '', origin: 'http://localhost' },
    navigator: { userAgent: 'node' },
    localStorage: { getItem: () => null, setItem() {}, removeItem() {}, clear() {} },
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {}, clear() {} },
    matchMedia: () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }),
    requestAnimationFrame: (f) => f(), setTimeout: (f) => 0, clearTimeout() {}, setInterval() {}, clearInterval() {},
    Chart: undefined, console,
  };
  sandbox.window = sandbox; sandbox.self = sandbox;
  return sandbox;
}

/* ---------- main ---------- */
const results = {};

for (const [pageKey, spec] of Object.entries(SPEC)) {
  /* fresh bundle per page with its page file appended */
  const { sandbox, ctx } = (function () {
    const s = makeSandbox();
    const files = ['helpers.js', 'member-actions.js', 'data.js', 'api.js', 'bridge.js'];
    let bundle = '';
    for (const f of files) bundle += fs.readFileSync(path.join(JSDIR, f), 'utf8') + '\n;\n';
    /* app.js defines App; page files extend it */
    bundle += fs.readFileSync(path.join(JSDIR, 'app.js'), 'utf8').split('document.addEventListener')[0] + '\n;\n';
    const pageFileMap = { contactQueries: 'contact-us-queries', websiteSetup: 'website-setup' };
    const pfName = pageFileMap[pageKey] || pageKey;
    const pf = path.join(JSDIR, 'pages', pfName + '.js');
    if (fs.existsSync(pf)) bundle += fs.readFileSync(pf, 'utf8') + '\n;\n';
    const fn = new Function('window', 'document', 'localStorage', 'sessionStorage', 'navigator', 'location', 'Chart', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'console', bundle + ';return {App:(typeof App!=="undefined"?App:null),Helpers:(typeof Helpers!=="undefined"?Helpers:null),MockData:(typeof MockData!=="undefined"?MockData:null),MemberActions:(typeof MemberActions!=="undefined"?MemberActions:null)};');
    return { sandbox: s, ctx: fn(s, s.document, s.localStorage, s.sessionStorage, s.navigator, s.location, undefined, (f) => 0, () => {}, () => 0, () => {}, console) };
  })();

  const App = ctx.App, Helpers = ctx.Helpers, MockData = ctx.MockData, MemberActions = ctx.MemberActions;
  if (!App) { console.error('no App for', pageKey); continue; }
  results[pageKey] = {};

  /* entity list for per-row form capture: id→form for EVERY row when possible */
  const EDIT_FNS = {
    products: { fn: 'editProduct', list: 'products', idKey: 'id' },
    currencies: { fn: 'editCurrency', list: 'currencies', idKey: 'id' },
    'customisation-options': { fn: 'editCustomOption', list: 'customisationOptions', idKey: 'id' },
    'customisation-studios': { fn: 'editStudio', list: 'customisationStudios', idKey: 'id' },
    'events-vip': { fn: 'editVipEvent', list: 'vipEvents', idKey: 'id' },
    'jewellery-categories': { fn: 'editJewelCategory', list: 'jewelleryCategories', idKey: 'id' },
    'jewellery-collections': { fn: 'editJewelCollection', list: 'jewelleryCollections', idKey: 'id' },
    'jewellery-products': { fn: 'editJewelProduct', list: 'jewelleryProducts', idKey: 'id' },
    languages: { fn: 'editLanguage', list: 'languages', idKey: 'id' },
    offers: { fn: 'editOffer', list: 'offers', idKey: 'id' },
    cms: { fn: 'editCmsPage', list: 'cmsPages', idKey: 'id' },
    'website-pages': { fn: 'editWebsitePage', list: 'websitePages', idKey: 'id' },
    'wedding-banners': { fn: 'editWeddingBanner', list: 'weddingBanners', idKey: 'id' },
    'wedding-collections': { fn: 'editWeddingCollection', list: 'weddingCollections', idKey: 'id' },
    'wedding-featured': { fn: 'editWeddingFeatured', list: 'weddingFeatured', idKey: 'id' },
  };
  const VIEW_FNS = {
    products: { fn: 'viewProduct', list: 'products' },
    'events-vip': { fn: 'viewVipEvent', list: 'vipEvents' },
    'jewellery-products': { fn: 'viewJewelProduct', list: 'jewelleryProducts' },
    offers: { fn: 'viewOffer', list: 'offers' },
    cms: { fn: 'viewCmsPage', list: 'cmsPages' },
    orders: { fn: 'viewOrder', list: 'orders' },
    'support-tickets': { fn: 'viewTicket', list: 'supportTickets' },
    reviews: { fn: 'viewReview', list: 'reviews' },
    'stylist-bookings': { fn: 'viewStylistBooking', list: 'stylistBookings' },
    'event-rsvps': { fn: 'viewRSVP', list: 'eventRSVPs' },
    quotations: { fn: 'viewQuotation', list: 'quotations' },
    'bespoke-orders': { fn: 'viewBespokeOrder', list: 'bespokeOrders' },
    customizations: { fn: 'viewCustomization', list: 'customizations' },
    contactQueries: { fn: 'viewQuery', list: 'contactQueries' },
  };

  /* status-update modals: capture PER ROW so every arrow/status button opens the
     real legacy modal with that entity's id, current status and prefilled select. */
  const STATUS_EDIT_FNS = {
    orders: { fn: 'changeOrderStatus', list: 'orders' },
    'support-tickets': { fn: 'updateTicketStatus', list: 'supportTickets' },
    'stylist-bookings': { fn: 'updateStylistStatus', list: 'stylistBookings' },
    'bespoke-orders': { fn: 'updateBespokeStatus', list: 'bespokeOrders' },
    contactQueries: { fn: 'replyQuery', list: 'contactQueries' },
  };

  const captureN = (prefix, fnName, listName) => {
    if (!fnName || typeof App[fnName] !== 'function' || !MockData[listName]) return 0;
    let count = 0;
    for (const item of MockData[listName]) {
      let html = '';
      const orig = Helpers.openModal;
      Helpers.openModal = (h) => { html = h; };
      try { App[fnName].call(App, item.id); } catch (e) { /* skip row */ }
      Helpers.openModal = orig;
      /* later capture for the same entity id wins (per-row status edit replaces generic) */
      if (html && !results[pageKey][prefix + '-' + item.id]) results[pageKey][prefix + '-' + item.id] = html;
      if (html) count++;
    }
    return count;
  };

  const ef = EDIT_FNS[pageKey];
  if (ef) captureN('edit', ef.fn, ef.list);
  const vf = VIEW_FNS[pageKey];
  if (vf) captureN('view', vf.fn, vf.list);
  const sf = STATUS_EDIT_FNS[pageKey];
  if (sf) captureN('edit', sf.fn, sf.list);

  const capture = (label, fnName, argsFn) => {
    if (!fnName || typeof App[fnName] !== 'function') return;
    let html = '';
    const orig = Helpers.openModal;
    Helpers.openModal = (h) => { html = h; };
    try { App[fnName].apply(App, argsFn ? argsFn(MockData) : []); } catch (e) { console.error(pageKey, fnName, e.message.slice(0, 100)); }
    Helpers.openModal = orig;
    if (html) results[pageKey][label] = html;
  };

  if (spec.edit && !STATUS_EDIT_FNS[pageKey]) capture('edit', spec.edit, spec.args || (() => []));
  if (spec.add) capture('add', spec.add, spec.addArgs);
  if (spec.view && !VIEW_FNS[pageKey]) capture('view', spec.view, spec.viewArgs || spec.args || (() => []));

  /* member pages: MemberActions edit forms per entity type — one per row */
  if (MemberActions && (pageKey === 'users' || pageKey === 'sellers' || pageKey === 'designers' || pageKey === 'staff')) {
    const list = MockData[{ users: 'users', sellers: 'sellers', designers: 'designers', staff: 'staff' }[pageKey]];
    const label = { users: 'Customer', sellers: 'Seller', designers: 'Designer', staff: 'Staff' }[pageKey];
    for (const item of list) {
      let html = '';
      const orig = Helpers.openModal;
      Helpers.openModal = (h) => { html = h; };
      try { MemberActions.editMember(pageKey, item, label); } catch (e) { /* skip */ }
      let vhtml = '';
      Helpers.openModal = (h) => { vhtml = h; };
      try { MemberActions.viewMember(pageKey, item, label); } catch (e) { /* skip */ }
      Helpers.openModal = orig;
      if (html) results[pageKey]['member-edit-' + item.id] = html;
      if (vhtml) results[pageKey]['member-view-' + item.id] = vhtml;
    }
  }
}

fs.writeFileSync(OUT, JSON.stringify(results, null, 1));
for (const [k, v] of Object.entries(results)) console.log(k, Object.keys(v).map((x) => x + ':' + (v[x] || '').length).join(' '));
console.log('written', OUT);
