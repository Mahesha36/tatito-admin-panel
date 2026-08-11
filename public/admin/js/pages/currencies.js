'use strict';
/* TATITO FASHIONS — Currency Management (Image 76723767)
   Default currency selector, currency format settings, currency table with CRUD */

App.pages.currencies = function() {
    var currencies = MockData.currencies || [];
    var formats = MockData.currencyFormats || {};

    document.getElementById('pageContent').innerHTML =
        '<div class="page-content">' +
        '<div class="page-toolbar"><div><h3>Currencies</h3><p class="text-muted">Manage currencies and formats</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-primary" onclick="App.addCurrency()"><i class="bi bi-plus-circle"></i> Add New Currency</button></div></div>' +

        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">' +
        '<div class="form-section">' +
        '<h4 style="font-size:0.88rem;font-weight:700;margin-bottom:16px"><i class="bi bi-cash-coin" style="color:var(--gold)"></i> System Default Currency</h4>' +
        '<div class="form-group"><label>Select Default Currency</label>' +
        '<select class="form-control" id="defaultCurrency">' +
        currencies.map(function(c) { return '<option value="' + c.code + '"' + (c.isDefault ? ' selected' : '') + '>' + c.name + ' (' + c.symbol + ') — ' + c.code + '</option>'; }).join('') +
        '</select></div>' +
        '<button class="btn btn-primary" onclick="App.saveDefaultCurrency()"><i class="bi bi-check-lg"></i> Save</button>' +
        '</div>' +

        '<div class="form-section">' +
        '<h4 style="font-size:0.88rem;font-weight:700;margin-bottom:16px"><i class="bi bi-sliders" style="color:var(--gold)"></i> Set Currency Formats</h4>' +
        '<div class="form-group"><label>Symbol Format</label><select class="form-control" id="symbolFormat">' +
        ['[amount] [symbol]', '[symbol] [amount]', '[symbol][amount]', '[amount][symbol]'].map(function(f) { return '<option' + (formats.symbolFormat === f ? ' selected' : '') + '>' + f + '</option>'; }).join('') +
        '</select></div>' +
        '<div class="form-group"><label>Decimal Separator</label><select class="form-control" id="decimalSep">' +
        ['1,23,456.70', '1.23.456,70', '1,234,567.89', '12,34,567.89'].map(function(f) { return '<option' + (formats.decimalSeparator === f ? ' selected' : '') + '>' + f + '</option>'; }).join('') +
        '</select></div>' +
        '<div class="form-group"><label>No of Decimals</label><select class="form-control" id="decimalPlaces">' +
        ['0', '2', '3'].map(function(d) { return '<option' + (formats.decimalPlaces === d ? ' selected' : '') + '>' + d + '</option>'; }).join('') +
        '</select></div>' +
        '<button class="btn btn-primary" onclick="App.saveCurrencyFormats()"><i class="bi bi-check-lg"></i> Save</button>' +
        '</div>' +
        '</div>' +

        '<div class="card"><div class="card-header"><h3>All Currencies</h3></div><div class="card-body">' +
        '<table class="table table-hover" id="currencyTable">' +
        '<thead><tr><th>#</th><th>Currency Name</th><th>Symbol</th><th>Code</th><th>Default</th><th>Options</th></tr></thead>' +
        '<tbody>' + currencies.map(function(c, i) {
            return '<tr><td>' + (i + 1) + '</td><td><strong>' + Helpers.escapeHtml(c.name) + '</strong></td>' +
                '<td style="font-size:1.1rem;font-weight:700">' + c.symbol + '</td>' +
                '<td><code>' + c.code + '</code></td>' +
                '<td>' + (c.isDefault ? '<span class="badge badge-gold">Default</span>' : '\u2014') + '</td>' +
                '<td><div class="table-actions">' +
                '<button class="action-btn edit" onclick="App.editCurrency(\'' + c.id + '\')" title="Edit"><i class="bi bi-pencil"></i></button>' +
                '<button class="action-btn delete" onclick="App.deleteCurrency(\'' + c.id + '\')" title="Delete"><i class="bi bi-trash"></i></button>' +
                '</div></td></tr>';
        }).join('') +
        '</tbody></table></div></div></div>';

    if (typeof $ !== 'undefined') { try { $('#currencyTable').DataTable({ pageLength: 10, retrieve: true }); } catch (e) {} }
};

App.saveDefaultCurrency = function() {
    var sel = document.getElementById('defaultCurrency');
    var code = sel ? sel.value : 'INR';
    MockData.currencies.forEach(function(c) { c.isDefault = (c.code === code); });
    Helpers.toast('Default currency set to ' + code, 'success');
    App.navigate('currencies');
};
App.saveCurrencyFormats = function() {
    var get = function(id) { var el = document.getElementById(id); return el ? el.value : ''; };
    MockData.currencyFormats = { defaultCurrency: get('defaultCurrency'), symbolFormat: get('symbolFormat'), decimalSeparator: get('decimalSep'), decimalPlaces: get('decimalPlaces') };
    Helpers.toast('Currency formats saved', 'success');
};
App.addCurrency = function() {
    Helpers.openModal(
        '<div class="modal-header"><h3 class="modal-title">Add New Currency</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="addCurrencyForm">' +
        '<div class="form-group"><label>Currency Name <span class="required">*</span></label><input type="text" class="form-control" name="name" placeholder="Eg. Indian Rupee" required></div>' +
        '<div class="form-row"><div class="form-group"><label>Symbol <span class="required">*</span></label><input type="text" class="form-control" name="symbol" placeholder="\u20B9"></div>' +
        '<div class="form-group"><label>Code <span class="required">*</span></label><input type="text" class="form-control" name="code" placeholder="INR"></div></div>' +
        '</form></div><div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveNewCurrency()">Save</button></div>'
    );
};
App.saveNewCurrency = function() {
    var form = document.getElementById('addCurrencyForm');
    if (!form.elements.name.value.trim()) { Helpers.toast('Currency name required', 'error'); return; }
    MockData.currencies.push({ id: 'CUR' + String(MockData.currencies.length + 1).padStart(3, '0'), name: form.elements.name.value, symbol: form.elements.symbol.value, code: form.elements.code.value.toUpperCase(), isDefault: false });
    Helpers.closeModal(); Helpers.toast('Currency added', 'success'); App.navigate('currencies');
};
App.editCurrency = function(id) {
    var c = MockData.currencies.find(function(x) { return x.id === id; }); if (!c) return;
    Helpers.openModal(
        '<div class="modal-header"><h3 class="modal-title">Edit Currency</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="editCurrencyForm">' +
        '<div class="form-group"><label>Currency Name</label><input type="text" class="form-control" name="name" value="' + Helpers.escapeHtml(c.name) + '"></div>' +
        '<div class="form-row"><div class="form-group"><label>Symbol</label><input type="text" class="form-control" name="symbol" value="' + c.symbol + '"></div>' +
        '<div class="form-group"><label>Code</label><input type="text" class="form-control" name="code" value="' + c.code + '"></div></div>' +
        '</form></div><div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.updateCurrency(\'' + id + '\')">Save</button></div>'
    );
};
App.updateCurrency = function(id) {
    var c = MockData.currencies.find(function(x) { return x.id === id; }); if (!c) return;
    var form = document.getElementById('editCurrencyForm');
    c.name = form.elements.name.value; c.symbol = form.elements.symbol.value; c.code = form.elements.code.value.toUpperCase();
    Helpers.closeModal(); Helpers.toast('Currency updated', 'success'); App.navigate('currencies');
};
App.deleteCurrency = function(id) {
    Helpers.confirm('Delete this currency?', 'This action cannot be undone.', 'warning').then(function(r) {
        if (r.isConfirmed) { MockData.currencies = MockData.currencies.filter(function(c) { return c.id !== id; }); Helpers.toast('Currency deleted', 'success'); App.navigate('currencies'); }
    });
};
