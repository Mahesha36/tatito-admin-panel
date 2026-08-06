'use strict';
/* TATITO FASHIONS — Quotations page */
App.pages.quotations = function() {
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Quotations</h3><p class="text-muted">Designer quotation requests</p></div></div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="quotationsTable"><thead><tr><th>ID</th><th>Customer</th><th>Designer</th><th>Item</th><th>Budget</th><th>Status</th><th>Date</th><th></th></tr></thead><tbody>' +
        MockData.quotations.map(function(q) {
            return '<tr><td>' + q.id + '</td><td>' + q.customer + '</td><td>' + (q.designer || '\u2014') + '</td><td>' + q.requestName + '</td>' +
                '<td>' + Helpers.formatCurrency(q.amount) + '</td>' +
                '<td><span class="badge ' + Helpers.statusBadge(q.status) + '">' + Helpers.capitalize(q.status) + '</span></td>' +
                '<td>' + Helpers.formatDate(q.date) + '</td>' +
                '<td><button class="btn btn-sm btn-ghost" onclick="App.viewQuotation(\'' + q.id + '\')"><i class="bi bi-eye"></i></button></td></tr>';
        }).join('') +
        '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') { $('#quotationsTable').DataTable({ pageLength: 10 }); }
};
App.viewQuotation = function(id) {
    var q = MockData.quotations.find(function(x) { return x.id == id; }); if (!q) return;
    Helpers.openModal('<div class="modal-header"><h3>Quotation ' + q.id + '</h3><button class="btn-close" onclick="Helpers.closeModal()">\u00D7</button></div>' +
        '<div class="modal-body"><table class="table table-borderless">' +
        '<tr><td class="text-muted">Customer</td><td><strong>' + q.customer + '</strong></td></tr>' +
        '<tr><td class="text-muted">Designer</td><td>' + (q.designer || '\u2014') + '</td></tr>' +
        '<tr><td class="text-muted">Item</td><td>' + q.requestName + '</td></tr>' +
        '<tr><td class="text-muted">Budget</td><td>' + Helpers.formatCurrency(q.amount) + '</td></tr>' +
        '<tr><td class="text-muted">Status</td><td><span class="badge ' + Helpers.statusBadge(q.status) + '">' + Helpers.capitalize(q.status) + '</span></td></tr>' +
        '<tr><td class="text-muted">Date</td><td>' + Helpers.formatDate(q.date) + '</td></tr>' +
        (q.details ? '<tr><td class="text-muted">Details</td><td>' + q.details + '</td></tr>' : '') +
        '</table></div>' +
        '<div class="modal-footer">' +
        '<select class="form-control" id="quoteStatusSelect" style="width:auto;display:inline-block"><option value="pending"' + (q.status === 'pending' ? ' selected' : '') + '>Pending</option><option value="accepted"' + (q.status === 'accepted' ? ' selected' : '') + '>Accepted</option><option value="rejected"' + (q.status === 'rejected' ? ' selected' : '') + '>Rejected</option><option value="negotiating"' + (q.status === 'negotiating' ? ' selected' : '') + '>Negotiating</option></select>' +
        (q.status === 'pending' ?
            '<button class="btn btn-success" onclick="App.actionQuotation(\'' + q.id + '\', \'accepted\')"><i class="bi bi-check-lg"></i> Accept</button>' +
            '<button class="btn btn-danger" onclick="App.actionQuotation(\'' + q.id + '\', \'rejected\')"><i class="bi bi-x-lg"></i> Reject</button>' +
            '<button class="btn btn-warning" onclick="App.actionQuotation(\'' + q.id + '\', \'negotiating\')"><i class="bi bi-arrow-left-right"></i> Negotiate</button>' : '') +
        '<button class="btn btn-ghost" onclick="Helpers.closeModal()">Close</button></div>'
    );
};
App.actionQuotation = function(id, action) {
    var q = MockData.quotations.find(function(x) { return x.id == id; }); if (!q) return;
    var labels = { accepted: 'accepted', rejected: 'rejected', negotiating: 'sent for negotiation' };
    Helpers.confirm('Mark quotation ' + id + ' as ' + (labels[action] || action) + '?', function() {
        q.status = action;
        Helpers.closeModal(); Helpers.toast('Quotation ' + (labels[action] || action), 'success'); App.navigate('quotations');
    });
};
