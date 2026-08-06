'use strict';
/* TATITO FASHIONS — Orders page */
App.pages.orders = function() {
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Orders</h3><p class="text-muted">All marketplace orders</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-ghost" onclick="App.exportOrders()"><i class="bi bi-download"></i> Export</button></div></div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="ordersTable"><thead><tr>' +
        '<th>Order ID</th><th>Customer</th><th>Product</th><th>Seller</th><th>Date</th><th>Amount</th><th>Payment</th><th>Status</th><th></th>' +
        '</tr></thead><tbody>' +
        MockData.orders.map(function(o) {
            return '<tr><td><strong>' + o.id + '</strong></td><td>' + o.customer + '</td><td>' + o.product + '</td><td>' + (o.seller || '\u2014') + '</td>' +
                '<td>' + Helpers.formatDate(o.date) + '</td><td>' + Helpers.formatCurrency(o.amount) + '</td>' +
                '<td><span class="badge ' + (o.payment === 'paid' ? 'badge-success' : 'badge-warning') + '">' + Helpers.capitalize(o.payment || 'pending') + '</span></td>' +
                '<td><span class="badge ' + Helpers.statusBadge(o.status) + '">' + Helpers.capitalize(o.status) + '</span></td>' +
                '<td><button class="btn btn-sm btn-ghost" onclick="App.viewOrder(\'' + o.id + '\')"><i class="bi bi-eye"></i></button></td></tr>';
        }).join('') +
        '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') { $('#ordersTable').DataTable({ pageLength: 10, order: [[4, 'desc']] }); }
};
App.viewOrder = function(id) {
    var o = MockData.orders.find(function(x) { return x.id == id; }); if (!o) return;
    Helpers.openModal(
        '<div class="modal-header"><h3>Order ' + o.id + '</h3><button class="btn-close" onclick="Helpers.closeModal()">\u00D7</button></div>' +
        '<div class="modal-body"><table class="table table-borderless">' +
        '<tr><td class="text-muted">Customer</td><td><strong>' + o.customer + '</strong></td></tr>' +
        '<tr><td class="text-muted">Product</td><td>' + o.product + '</td></tr>' +
        '<tr><td class="text-muted">Seller</td><td>' + (o.seller || '\u2014') + '</td></tr>' +
        '<tr><td class="text-muted">Date</td><td>' + Helpers.formatDate(o.date) + '</td></tr>' +
        '<tr><td class="text-muted">Amount</td><td>' + Helpers.formatCurrency(o.amount) + '</td></tr>' +
        '<tr><td class="text-muted">Payment</td><td><span class="badge ' + (o.payment === 'paid' ? 'badge-success' : 'badge-warning') + '">' + Helpers.capitalize(o.payment || 'pending') + '</span></td></tr>' +
        '<tr><td class="text-muted">Status</td><td><span class="badge ' + Helpers.statusBadge(o.status) + '">' + Helpers.capitalize(o.status) + '</span></td></tr>' +
        (o.trackingId ? '<tr><td class="text-muted">Tracking ID</td><td>' + o.trackingId + '</td></tr>' : '') +
        '</table></div><div class="modal-footer"><button class="btn btn-ghost" onclick="Helpers.closeModal()">Close</button></div>'
    );
};
App.exportOrders = function() {
    var headers = ['Order ID', 'Customer', 'Product', 'Seller', 'Date', 'Amount', 'Payment', 'Status'];
    var rows = MockData.orders.map(function(o) { return [o.id, o.customer, o.product, o.seller || '', o.date, o.amount, o.payment || '', o.status]; });
    Helpers.downloadCSV('orders_export.csv', headers, rows);
    Helpers.toast('Orders exported', 'success');
};
