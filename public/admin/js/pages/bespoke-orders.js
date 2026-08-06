'use strict';
/* MODULE 2: Customisation Atelier — Bespoke Orders */

App.pages['bespoke-orders'] = function() {
    var data = MockData.bespokeOrders;
    var statusClass = { 'Pending':'badge-warning','Tailoring in Progress':'badge-info','Ready for Fitting':'badge-primary','Completed':'badge-success' };
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Bespoke Orders</h3><p class="text-muted">Custom tailoring & jewellery crafting orders</p></div></div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="boTable"><thead><tr><th>ID</th><th>Customer</th><th>Item</th><th>Brand</th><th>Fabric</th><th>Color</th><th>Appointment</th><th>Status</th><th>Actions</th></tr></thead><tbody>' +
        data.map(function(o) {
            return '<tr><td>' + o.id + '</td><td><strong>' + Helpers.escapeHtml(o.user_name) + '</strong></td>' +
                '<td>' + Helpers.escapeHtml(o.item_name) + '</td>' +
                '<td>' + (o.brand ? Helpers.escapeHtml(o.brand) : '\u2014') + '</td>' +
                '<td>' + (o.fabric ? Helpers.escapeHtml(o.fabric) : '\u2014') + '</td>' +
                '<td>' + (o.color ? '<div style="display:flex;align-items:center;gap:4px"><div style="width:16px;height:16px;border-radius:3px;background:'+(function(){var c=MockData.customisationOptions.find(function(x){return x.name===o.color;});return c?c.hex_code:'#ccc';})()+'"></div>'+o.color+'</div>' : '\u2014') + '</td>' +
                '<td>' + (o.appointment_date ? Helpers.formatDate(o.appointment_date) : '\u2014') + '</td>' +
                '<td><span class="badge '+(statusClass[o.status]||'badge-info')+'">'+o.status+'</span></td>' +
                '<td><div class="table-actions"><button class="action-btn view" onclick="App.viewBespokeOrder(\''+o.id+'\')"><i class="bi bi-eye"></i></button>' +
                '<button class="action-btn edit" onclick="App.updateBespokeStatus(\''+o.id+'\')"><i class="bi bi-arrow-clockwise"></i></button></div></td></tr>';
        }).join('') + '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') $('#boTable').DataTable({ pageLength: 10 });
};

App.viewBespokeOrder = function(id) {
    var o = MockData.bespokeOrders.find(function(x){return x.id===id;}); if(!o) return;
    var measHtml = Object.keys(o.measurements||{}).map(function(k){
        return '<tr><td class="text-muted" style="text-transform:capitalize">'+k.replace(/_/g,' ')+'</td><td><strong>'+o.measurements[k]+'</strong></td></tr>';
    }).join('');
    Helpers.openModal('<div class="modal-header"><h3 class="modal-title">Bespoke Order Details</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body">' +
        '<table class="table table-borderless"><tr><td class="text-muted">Order ID</td><td><strong>'+o.id+'</strong></td></tr><tr><td class="text-muted">Customer</td><td>'+Helpers.escapeHtml(o.user_name)+'</td></tr><tr><td class="text-muted">Item</td><td>'+Helpers.escapeHtml(o.item_name)+'</td></tr><tr><td class="text-muted">Brand</td><td>'+(o.brand||'\u2014')+'</td></tr><tr><td class="text-muted">Fabric</td><td>'+(o.fabric||'\u2014')+'</td></tr><tr><td class="text-muted">Color</td><td>'+(o.color||'\u2014')+'</td></tr><tr><td class="text-muted">Appointment</td><td>'+(o.appointment_date?Helpers.formatDate(o.appointment_date):'\u2014')+'</td></tr></table>' +
        '<h4 style="margin:16px 0 8px;font-size:0.9rem"><i class="bi bi-rulers" style="color:var(--gold)"></i> Measurements</h4><table class="table table-sm">'+measHtml+'</table>' +
        (o.special_notes?'<div style="margin-top:12px;padding:12px;background:var(--border-light);border-radius:8px"><strong>Special Notes:</strong><br>'+Helpers.escapeHtml(o.special_notes)+'</div>':'') +
        '</div><div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Close</button></div>');
};

App.updateBespokeStatus = function(id) {
    var o = MockData.bespokeOrders.find(function(x){return x.id===id;}); if(!o) return;
    var statuses = ['Pending','Tailoring in Progress','Ready for Fitting','Completed'];
    Helpers.openModal('<div class="modal-header"><h3 class="modal-title">Update Status</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><p style="margin-bottom:12px">Order: <strong>'+Helpers.escapeHtml(o.item_name)+'</strong> — '+Helpers.escapeHtml(o.user_name)+'</p>' +
        '<div class="status-flow">' + statuses.map(function(s,i){
            var isCurrent = o.status===s; var isPast = statuses.indexOf(o.status)>i;
            return '<div style="display:flex;align-items:center;gap:8px;padding:8px;border-radius:6px;margin-bottom:4px;cursor:pointer;'+(isCurrent?'background:rgba(201,162,75,0.1);border:1px solid var(--gold)':'background:'+(isPast?'rgba(45,154,108,0.05)':'transparent'))+'" onclick="App._setBespokeStatus(\''+id+'\',\''+s+'\')">' +
                '<div style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;'+(isPast?'background:var(--success);color:white':'background:var(--border-light)')+'">'+(i+1)+'</div>' +
                '<span style="'+(isCurrent?'font-weight:700;color:var(--gold-deep)':'')+'">'+s+'</span>' +
                (isCurrent?'<i class="bi bi-check-circle" style="color:var(--gold);margin-left:auto"></i>':'') +
                '</div>';
        }).join('') + '</div></div><div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button></div>');
};
App._setBespokeStatus = function(id,status) {
    var o = MockData.bespokeOrders.find(function(x){return x.id===id;}); if(!o) return;
    o.status = status; Helpers.closeModal(); Helpers.toast('Status updated to: '+status,'success'); App.navigate('bespoke-orders');
};
