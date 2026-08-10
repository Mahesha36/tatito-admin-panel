'use strict';
/* TATITO FASHIONS — Payment Setup / Gateways (Image 9c9f0d89)
   Gateway cards (Razorpay, Stripe, Paypal, Paytm, Cashfree, PayStack)
   + Manual Payment Methods with CKEditor instructions */

App.pages['payment-setup'] = function() {
    var gateways = MockData.paymentGateways || [];
    var manuals = MockData.manualPayments || [];

    function gatewayCard(gw) {
        var fieldsHtml = gw.fields.map(function(f) {
            if (f.type === 'select') {
                return '<div class="form-group"><label>' + f.label + '</label><select class="form-control">' +
                    (f.options || []).map(function(o) { return '<option' + (f.value === o ? ' selected' : '') + '>' + o + '</option>'; }).join('') +
                    '</select></div>';
            }
            return '<div class="form-group"><label>' + f.label + '</label><input type="text" class="form-control" value="' + Helpers.escapeHtml(f.value || '') + '" placeholder="' + f.label + '"></div>';
        }).join('');

        return '<div class="card" style="margin-bottom:16px"><div class="card-header" style="display:flex;justify-content:space-between;align-items:center">' +
            '<h3 style="font-size:0.85rem"><i class="bi bi-credit-card" style="color:var(--gold)"></i> ' + gw.name + ' Credential</h3>' +
            '<button class="toggle-switch ' + (gw.enabled ? 'on' : '') + '" onclick="App.toggleGateway(\'' + gw.id + '\')"><span class="toggle-knob"></span></button></div>' +
            '<div class="card-body">' + fieldsHtml +
            '<button class="btn btn-primary btn-sm" onclick="Helpers.toast(\'' + gw.name + ' settings saved\', \'success\')"><i class="bi bi-check-lg"></i> Save</button>' +
            '</div></div>';
    }

    function manualCard(mp) {
        return '<div class="card" style="margin-bottom:16px"><div class="card-header" style="display:flex;justify-content:space-between;align-items:center">' +
            '<h3 style="font-size:0.85rem"><i class="bi bi-cash-stack" style="color:var(--gold)"></i> ' + mp.name + '</h3>' +
            '<button class="toggle-switch ' + (mp.enabled ? 'on' : '') + '" onclick="App.toggleManualPayment(\'' + mp.id + '\')"><span class="toggle-knob"></span></button></div>' +
            '<div class="card-body">' +
            '<div class="form-group"><label>Name</label><input type="text" class="form-control" value="' + Helpers.escapeHtml(mp.name) + '"></div>' +
            '<div class="form-group"><label>Instruction</label><textarea class="form-control" rows="3">' + Helpers.escapeHtml(mp.instructions) + '</textarea></div>' +
            '<div class="form-group"><label>Image</label><div class="upload-field" style="padding:10px;border:2px dashed var(--line);border-radius:6px;text-align:center;cursor:pointer" onclick="document.getElementById(\'mpImg_'+mp.id+'\').click()"><button type="button" class="btn btn-outline btn-sm">Browse</button> <span style="font-size:0.78rem;color:var(--gray-500)">' + (mp.imageFile ? mp.imageFile : 'No file selected') + '</span><input type="file" id="mpImg_'+mp.id+'" accept="image/*" style="display:none" onchange="App._previewUploadEnhanced(this,\'\',\'\')"></div></div>' +
            '<button class="btn btn-primary btn-sm" onclick="Helpers.toast(\'Manual payment saved\', \'success\')"><i class="bi bi-check-lg"></i> Save</button>' +
            '</div></div>';
    }

    document.getElementById('pageContent').innerHTML =
        '<div class="page-content">' +
        '<div class="page-toolbar"><div><h3>Payment Setup</h3><p class="text-muted">Payment Gateways & Manual Methods</p></div></div>' +

        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">' +

        '<div><h4 style="font-size:0.85rem;font-weight:700;margin-bottom:12px"><i class="bi bi-credit-card-2-front" style="color:var(--gold)"></i> Payment Gateways</h4>' +
        gateways.map(gatewayCard).join('') + '</div>' +

        '<div><h4 style="font-size:0.85rem;font-weight:700;margin-bottom:12px"><i class="bi bi-cash-stack" style="color:var(--gold)"></i> Manual Payment Methods</h4>' +
        manuals.map(manualCard).join('') + '</div>' +

        '</div></div>';
};

App.toggleGateway = function(id) {
    var gw = MockData.paymentGateways.find(function(x) { return x.id === id; }); if (!gw) return;
    gw.enabled = !gw.enabled; Helpers.toast(gw.name + ' ' + (gw.enabled ? 'enabled' : 'disabled'), 'success');
    App.navigate('payment-setup');
};
App.toggleManualPayment = function(id) {
    var mp = MockData.manualPayments.find(function(x) { return x.id === id; }); if (!mp) return;
    mp.enabled = !mp.enabled; Helpers.toast(mp.name + ' ' + (mp.enabled ? 'enabled' : 'disabled'), 'success');
    App.navigate('payment-setup');
};
