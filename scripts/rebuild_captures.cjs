#!/usr/bin/env node
/* Rebuild capture inputs from git history (commit 4da8bca) — reusable. */
const { execSync } = require('child_process');
const fs = require('fs');

const REPO = '/workspace/laravel-clean';
const COMMIT = '4da8bca';
const TMP = '/tmp/legacyjs';

// 1. extract legacy js
execSync(`cd ${REPO} && rm -rf ${TMP} && mkdir -p ${TMP} && git archive ${COMMIT} public/admin/js | tar -x -C ${TMP}`, { stdio: 'pipe' });
const JSDIR = TMP + '/public/admin/js';

// 2. navConfig
const src = fs.readFileSync(JSDIR + '/app.js', 'utf8');
const m = src.match(/navConfig:\s*(\[[\s\S]*?\n\s*\]),\s*\n/);
fs.writeFileSync('/tmp/navConfig.json', JSON.stringify(eval(m[1]), null, 2));

// 3. DOM shim + capture all page renderers (+ tab panels)
const shim = `
global.document = {
  getElementById: (id) => { if (!global.document._els) global.document._els = {}; if (!global.document._els[id]) global.document._els[id] = { innerHTML: '', style: {} }; return global.document._els[id]; },
  querySelectorAll: () => [], querySelector: () => null, addEventListener: () => {},
  createElement: (tag) => ({ tagName: tag, style: {}, classList:{add(){},remove(){},toggle(){}}, dataset:{}, setAttribute(k,v){this[k]=v;}, getContext: () => new Proxy({}, {get:()=>()=>({})}), appendChild(c){return c;}, addEventListener(){}, innerHTML:'', width:400, height:200 }),
};
global.window = global; global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
global.location = { href: '', search: '' }; global.navigator = { language: 'en' };
global.Chart = function(ctx,cfg){ this.config=cfg; }; global.Chart.prototype.destroy=function(){}; global.Chart.getChart=function(){return null}; global.Chart.register=function(){};
const _realSetTimeout = setTimeout; global.setTimeout = (fn) => {};
function load(f){ require('vm').runInThisContext(fs.readFileSync(f,'utf8'),{filename:f}); }
load('${JSDIR}/data.js'); load('${JSDIR}/helpers.js'); load('${JSDIR}/bridge.js'); load('${JSDIR}/i18n.js'); load('${JSDIR}/api.js');
global.App = { pages:{}, charts:{}, navigate(){}, exportOrders(){}, exportCSV(){}, viewOrder(){}, t:(s)=>s, openModal(){}, closeModal(){}, refreshAll(){}, _toggleSlideVisibility(){}, _notifFilter:'all', _settingsTab:'general', _websiteSetupTab:'general', _ckEditorInstances:{} };
load('${JSDIR}/member-actions.js');
fs.readdirSync('${JSDIR}/pages').filter(f=>f.endsWith('.js')).forEach(f=>load('${JSDIR}/pages/'+f));
`;
fs.writeFileSync('/tmp/shim_prelude.js', shim);

const runner = "const fs = require('fs');\n" + shim + `
const nav = JSON.parse(fs.readFileSync('/tmp/navConfig.json'));
fs.mkdirSync('/tmp/captured', { recursive: true });
let ok = 0, failed = [];
for (const sec of nav) for (const item of sec.items) {
  const fn = App.pages[item.id];
  if (typeof fn !== 'function') { failed.push(item.id + ' (no renderer)'); continue; }
  global.document._els = {};
  try {
    fn.call(App);
    const html = global.document._els['pageContent'] ? global.document._els['pageContent'].innerHTML : '';
    if (html.length > 200) { fs.writeFileSync('/tmp/captured/' + item.id + '.html', html); ok++; }
    else failed.push(item.id + ' (empty)');
  } catch (e) { failed.push(item.id + ' ERR ' + e.message); }
}
console.log('pages captured:', ok, '/53', failed.length ? 'FAILED: ' + failed.join(' | ') : '');

// settings tabs
const TABS = ['general','features','activation','smtp','thirdparty','social','notifications','language'];
global.document._els = {};
App.pages.settings.call(App);
const pageHtml = global.document._els['pageContent'].innerHTML;
const panels = {};
for (const t of TABS) { App._settingsTab = t; global.document._els['settingsTabContent'] = { innerHTML: '' }; App._renderSettingsTab(); panels[t] = global.document._els['settingsTabContent'].innerHTML; }
fs.writeFileSync('/tmp/captured/_settings_panels.json', JSON.stringify({ page: pageHtml, panels }));
console.log('settings panels:', Object.entries(panels).map(([k,v])=>k+'='+v.length).join(' '));

// website setup tabs
const WS = ['general','seo','cookies','scripts'];
global.document._els = {};
App.pages.websiteSetup.call(App);
const wsPageHtml = global.document._els['pageContent'].innerHTML;
const wsPanels = {};
for (const t of WS) { App._websiteSetupTab = t; global.document._els['wsTabContent'] = { innerHTML: '' }; App._renderWSTab(); wsPanels[t] = global.document._els['wsTabContent'].innerHTML; }
fs.writeFileSync('/tmp/captured/_ws_panels.json', JSON.stringify({ page: wsPageHtml, panels: wsPanels }));
console.log('ws panels:', Object.entries(wsPanels).map(([k,v])=>k+'='+v.length).join(' '));
`;
fs.writeFileSync('/tmp/run_capture.js', runner);
execSync('node /tmp/run_capture.js', { stdio: 'inherit' });
console.log('capture rebuild done');
