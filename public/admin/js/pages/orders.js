'use strict';
/* TATITO FASHIONS — Orders page
   NEW: Now merges admin MockData orders with real frontend orders
   (from localStorage tatito_orders). Also supports status changes. */

App.pages.orders = function() {
    /* NEW: Merge admin orders with real frontend customer orders */
    var adminOrders = MockData.orders.slice(); // copy MockData orders
    var frontendOrders = [];

    /* NEW: Read real orders placed via the frontend checkout */
    if (typeof Bridge !== 'undefined') {
        var fOrders = Bridge.Frontend.getOrders();
        frontendOrders = fOrders.map(function(fo) {
            // Convert frontend order format to admin order format
            var items = (fo.items || []).map(function(item) {
                return item.name || item.id || 'Product';
            });
            return {
                id: fo.id || fo.orderId || 'TF-WEB-' + Date.now(),
                customer: fo.customerName || (Bridge.Frontend.getUser() || {}).name || 'Guest Customer',
                product: items.join(', ') || 'Multiple items',
                seller: '—',
                date: fo.createdAt || fo.date || new Date().toISOString().split('T')[0],
                amount: fo.total || fo.amount || 0,
                payment: fo.paymentMethod === 'cod' ? 'pending' : 'paid',
                status: fo.status || 'pending',
                trackingId: fo.trackingId || '',
                _source: 'frontend' /* NEW: tag to identify frontend-sourced orders */
            };
        });
    }

    var allOrders = frontendOrders.concat(adminOrders);

    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Orders</h3><p class="text-muted">All marketplace orders</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-ghost" onclick="App.exportOrders()"><i class="bi bi-download"></i> Export</button></div></div>' +
        /* NEW: Info banner showing frontend order count */
        (frontendOrders.length > 0
            ? '<div style="background:var(--success-bg);border:1px solid var(--success);border-radius:var(--radius-md);padding:10px 16px;margin-bottom:16px;display:flex;align-items:center;gap:8px;">' +
              '<i class="bi bi-bag-check" style="color:var(--success)"></i>' +
              '<span style="font-size:13px;color:var(--text)"><strong>' + frontendOrders.length + '</strong> order(s) from the live storefront</span></div>'
            : '') +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="ordersTable"><thead><tr>' +
        '<th>Order ID</th><th>Customer</th><th>Product</th><th>Seller</th><th>Date</th><th>Amount</th><th>Payment</th><th>Status</th><th>Actions</th>' +
        '</tr></thead><tbody>' +
        allOrders.map(function(o) {
            return '<tr' + (o._source === 'frontend' ? ' style="background:rgba(63,138,91,0.03)"' : '') + '>' +
                '<td><strong>' + o.id + '</strong>' +
                /* NEW: Badge for frontend-sourced orders */
                (o._source === 'frontend' ? ' <span class="badge badge-success" style="font-size:9px;padding:2px 6px">WEB</span>' : '') +
                '</td>' +
                '<td>' + Helpers.escapeHtml(o.customer) + '</td><td>' + Helpers.escapeHtml(o.product) + '</td><td>' + (o.seller || '\u2014') + '</td>' +
                '<td>' + Helpers.formatDate(o.date) + '</td><td>' + Helpers.formatCurrency(o.amount) + '</td>' +
                '<td><span class="badge ' + (o.payment === 'paid' ? 'badge-success' : 'badge-warning') + '">' + Helpers.capitalize(o.payment || 'pending') + '</span></td>' +
                '<td><span class="badge ' + Helpers.statusBadge(o.status) + '">' + Helpers.capitalize(o.status) + '</span></td>' +
                '<td>' +
                '<button class="action-btn view" onclick="App.viewOrder(\'' + o.id + '\')" title="View"><i class="bi bi-eye"></i></button>' +
                /* NEW: Status change dropdown button */
                '<button class="action-btn edit" onclick="App.changeOrderStatus(\'' + o.id + '\')" title="Change Status"><i class="bi bi-arrow-left-right"></i></button>' +
                '</td></tr>';
        }).join('') +
        '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') { $('#ordersTable').DataTable({ pageLength: 10, order: [[4, 'desc']] }); }

    /* NEW: Store merged orders for lookup by viewOrder/changeOrderStatus */
    App._allOrders = allOrders;
};

App.viewOrder = function(id) {
    /* NEW: Look up from merged orders list (admin + frontend) */
    var allOrders = App._allOrders || MockData.orders;
    var o = allOrders.find(function(x) { return x.id == id; });
    if (!o) {
        o = MockData.orders.find(function(x) { return x.id == id; });
    }
    if (!o) return;
    Helpers.openModal(
        '<div class="modal-header"><h3>Order ' + o.id + '</h3><button class="btn-close" onclick="Helpers.closeModal()">\u00D7</button></div>' +
        '<div class="modal-body"><table class="table table-borderless">' +
        '<tr><td class="text-muted">Customer</td><td><strong>' + Helpers.escapeHtml(o.customer) + '</strong></td></tr>' +
        '<tr><td class="text-muted">Product</td><td>' + Helpers.escapeHtml(o.product) + '</td></tr>' +
        '<tr><td class="text-muted">Seller</td><td>' + (o.seller || '\u2014') + '</td></tr>' +
        '<tr><td class="text-muted">Date</td><td>' + Helpers.formatDate(o.date) + '</td></tr>' +
        '<tr><td class="text-muted">Amount</td><td>' + Helpers.formatCurrency(o.amount) + '</td></tr>' +
        '<tr><td class="text-muted">Payment</td><td><span class="badge ' + (o.payment === 'paid' ? 'badge-success' : 'badge-warning') + '">' + Helpers.capitalize(o.payment || 'pending') + '</span></td></tr>' +
        '<tr><td class="text-muted">Status</td><td><span class="badge ' + Helpers.statusBadge(o.status) + '">' + Helpers.capitalize(o.status) + '</span></td></tr>' +
        (o.trackingId ? '<tr><td class="text-muted">Tracking ID</td><td>' + o.trackingId + '</td></tr>' : '') +
        (o._source === 'frontend' ? '<tr><td class="text-muted">Source</td><td><span class="badge badge-success">Live Storefront</span></td></tr>' : '') +
        '</table></div>' +
        '<div class="modal-footer">' +
        '<button class="btn btn-ghost" onclick="Helpers.closeModal()">Close</button>' +
        /* NEW: Quick status change button in the modal */
        '<button class="btn btn-primary" onclick="App.changeOrderStatus(\'' + o.id + '\')"><i class="bi bi-arrow-left-right"></i> Change Status</button>' +
        '</div>'
    );
};

/* NEW: Change order status — supports both admin and frontend orders */
App.changeOrderStatus = function(id) {
    var allOrders = App._allOrders || MockData.orders;
    var o = allOrders.find(function(x) { return x.id == id; });
    if (!o) o = MockData.orders.find(function(x) { return x.id == id; });
    if (!o) return;

    var statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    var currentIdx = statuses.indexOf(o.status);

    Helpers.openModal(
        '<div class="modal-header"><h3>Change Order Status</h3><button class="btn-close" onclick="Helpers.closeModal()">\u00D7</button></div>' +
        '<div class="modal-body">' +
        '<p style="margin-bottom:16px">Order <strong>' + o.id + '</strong> — current status: <span class="badge ' + Helpers.statusBadge(o.status) + '">' + Helpers.capitalize(o.status) + '</span></p>' +
        '<div class="form-group"><label>New Status</label>' +
        '<select class="form-control" id="orderStatusSelect">' +
        statuses.map(function(s) {
            return '<option value="' + s + '"' + (s === o.status ? ' selected' : '') + '>' + Helpers.capitalize(s) + '</option>';
        }).join('') +
        '</select></div>' +
        '</div>' +
        '<div class="modal-footer"><button class="btn btn-ghost" onclick="Helpers.closeModal()">Cancel</button>' +
        '<button class="btn btn-primary" onclick="App.saveOrderStatus(\'' + o.id + '\')"><i class="bi bi-check-lg"></i> Update Status</button></div>'
    );
};

/* NEW: Save the new order status */
App.saveOrderStatus = function(id) {
    var select = document.getElementById('orderStatusSelect');
    if (!select) return;
    var newStatus = select.value;

    /* Update in merged orders */
    var allOrders = App._allOrders || MockData.orders;
    var o = allOrders.find(function(x) { return x.id == id; });
    if (o) o.status = newStatus;

    /* Also update in MockData.orders if it exists there */
    var mockOrder = MockData.orders.find(function(x) { return x.id == id; });
    if (mockOrder) mockOrder.status = newStatus;

    /* NEW: Persist to localStorage */
    if (typeof Bridge !== 'undefined') {
        Bridge.Data.saveEntity('orders', MockData.orders);
    }

    Helpers.closeModal();
    Helpers.toast('Order status updated to ' + newStatus, 'success');
    App.navigate('orders');
};

App.exportOrders = function() {
    var allOrders = App._allOrders || MockData.orders;
    var headers = ['Order ID', 'Customer', 'Product', 'Seller', 'Date', 'Amount', 'Payment', 'Status'];
    var rows = allOrders.map(function(o) { return [o.id, o.customer, o.product, o.seller || '', o.date, o.amount, o.payment || '', o.status]; });
    Helpers.downloadCSV('orders_export.csv', headers, rows);
    Helpers.toast('Orders exported', 'success');
};
