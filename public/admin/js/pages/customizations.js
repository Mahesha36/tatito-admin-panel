'use strict';
/* TATITO FASHIONS — Customizations page */
App.pages.customizations = function() {
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Fashion Customizations</h3><p class="text-muted">Custom design requests from customers</p></div></div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="customTable"><thead><tr><th>ID</th><th>Customer</th><th>Item</th><th>Measurements</th><th>Designer</th><th>Status</th><th>Date</th><th></th></tr></thead><tbody>' +
        MockData.customizations.map(function(c) {
            return '<tr><td>' + c.id + '</td><td>' + c.customer + '</td><td>' + c.type + '</td>' +
                '<td>' + (c.measurements || '\u2014') + '</td><td>' + (c.designer || '\u2014') + '</td>' +
                '<td><span class="badge ' + Helpers.statusBadge(c.status) + '">' + Helpers.capitalize(c.status) + '</span></td>' +
                '<td>' + Helpers.formatDate(c.date) + '</td>' +
                '<td><button class="btn btn-sm btn-ghost" onclick="App.viewCustomization(\'' + c.id + '\')"><i class="bi bi-eye"></i></button></td></tr>';
        }).join('') +
        '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') { $('#customTable').DataTable({ pageLength: 10 }); }
};
App.viewCustomization = function(id) {
    var c = MockData.customizations.find(function(x) { return x.id == id; }); if (!c) return;
    Helpers.openModal('<div class="modal-header"><h3>Customization ' + c.id + '</h3><button class="btn-close" onclick="Helpers.closeModal()">\u00D7</button></div>' +
        '<div class="modal-body"><table class="table table-borderless">' +
        '<tr><td class="text-muted">Customer</td><td><strong>' + c.customer + '</strong></td></tr>' +
        '<tr><td class="text-muted">Item</td><td>' + c.type + '</td></tr>' +
        '<tr><td class="text-muted">Measurements</td><td>' + (c.measurements || '\u2014') + '</td></tr>' +
        '<tr><td class="text-muted">Designer</td><td>' + (c.designer || '\u2014') + '</td></tr>' +
        '<tr><td class="text-muted">Status</td><td><span class="badge ' + Helpers.statusBadge(c.status) + '">' + Helpers.capitalize(c.status) + '</span></td></tr>' +
        '<tr><td class="text-muted">Date</td><td>' + Helpers.formatDate(c.date) + '</td></tr>' +
        (c.clothType ? '<tr><td class="text-muted">Notes</td><td>' + c.clothType + '</td></tr>' : '') +
        '</table></div><div class="modal-footer"><button class="btn btn-ghost" onclick="Helpers.closeModal()">Close</button></div>');
};
