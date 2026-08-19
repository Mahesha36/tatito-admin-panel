'use strict';
/* TATITO FASHIONS — Live Order Tracking (Enhanced)
   Rich timeline modal, carrier/AWB, ETA, status filter, live map placeholder */

App.pages.tracking = function() {
    var orders = MockData.orders || [];
    var steps = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'completed', 'cancelled'];

    var inTransit = orders.filter(function(o) { return ['confirmed', 'processing', 'shipped', 'out_for_delivery'].indexOf(o.status) >= 0; });
    var delivered = orders.filter(function(o) { return ['delivered', 'completed'].indexOf(o.status) >= 0; });
    var cancelled = orders.filter(function(o) { return o.status === 'cancelled'; });
    var pending = orders.filter(function(o) { return o.status === 'pending' || o.status === 'placed'; });

    var allStatuses = [
        { key: 'all', label: 'All Orders', count: orders.length },
        { key: 'pending', label: 'Pending', count: pending.length },
        { key: 'in_transit', label: 'In Transit', count: inTransit.length },
        { key: 'delivered', label: 'Delivered', count: delivered.length },
        { key: 'cancelled', label: 'Cancelled', count: cancelled.length },
    ];

    App._trackingFilter = App._trackingFilter || 'all';

    function getStatusIndex(status) {
        var normalized = (status || 'pending').toLowerCase();
        if (normalized === 'completed') normalized = 'delivered';
        return steps.indexOf(normalized);
    }

    function getProgress(status) {
        var idx = getStatusIndex(status);
        if (idx < 0 || status === 'cancelled') return 0;
        return Math.round((idx / (steps.length - 2)) * 100);
    }

    function statusColor(status) {
        var map = { delivered: '#2D9A6C', completed: '#2D9A6C', shipped: '#3D5A80', out_for_delivery: '#3D5A80', processing: '#C9A24B', confirmed: '#C9A24B', pending: '#888', placed: '#888', cancelled: '#C0463A' };
        return map[(status || '').toLowerCase()] || '#888';
    }

    function renderTable() {
        var filtered = orders;
        if (App._trackingFilter === 'pending') filtered = pending;
        else if (App._trackingFilter === 'in_transit') filtered = inTransit;
        else if (App._trackingFilter === 'delivered') filtered = delivered;
        else if (App._trackingFilter === 'cancelled') filtered = cancelled;

        return filtered.map(function(o) {
            var td = MockData.trackingDetails[o.id] || {};
            var pct = getProgress(o.status);
            var col = statusColor(o.status);
            var carrier = td.carrier || '—';
            var eta = td.eta ? Helpers.formatDate(td.eta) : (o.status === 'delivered' || o.status === 'completed' ? 'Delivered' : '—');

            return '<tr>' +
                '<td><strong>' + o.id + '</strong></td>' +
                '<td>' + Helpers.escapeHtml(o.customer) + '<br><small class="text-muted">' + Helpers.escapeHtml(o.customerCity || '') + '</small></td>' +
                '<td><code>' + (o.trackingId || 'TRK' + o.id.replace(/\D/g, '')) + '</code><br><small>' + carrier + '</small></td>' +
                '<td><div class="tracking-progress-wrap">' +
                    '<div class="tracking-progress"><div class="tracking-bar" style="width:' + pct + '%;background:' + col + '"></div></div>' +
                    '<small style="color:' + col + '">' + Helpers.capitalize(o.status) + '</small>' +
                '</div></td>' +
                '<td>' + eta + '</td>' +
                '<td>' + Helpers.formatDate(o.date) + '</td>' +
                '<td><button class="btn btn-sm btn-ghost" onclick="App.viewTracking(\'' + o.id + '\')" title="Track"><i class="bi bi-geo-alt"></i></button>' +
                '<button class="btn btn-sm btn-ghost" onclick="App.copyTracking(\'' + (o.trackingId || '') + '\')" title="Copy Tracking ID"><i class="bi bi-clipboard"></i></button></td>' +
                '</tr>';
        }).join('');
    }

    document.getElementById('pageContent').innerHTML =
        '<div class="page-content">' +
        '<div class="page-toolbar"><div><h3>Live Order Tracking</h3><p class="text-muted">Real-time order status and delivery tracking</p></div>' +
        '<div class="toolbar-actions">' +
        '<button class="btn btn-outline" onclick="Helpers.toast(\'Tracking data refreshed\', \'success\')"><i class="bi bi-arrow-clockwise"></i> Refresh</button>' +
        '<button class="btn btn-outline" onclick="Helpers.downloadCSV(\'tracking_export.csv\', [\'Order ID\',\'Customer\',\'Tracking ID\',\'Carrier\',\'Status\',\'Date\'], MockData.orders.map(function(o){var td=MockData.trackingDetails[o.id]||{};return [o.id,o.customer,o.trackingId||\'\',td.carrier||\'\',o.status,o.date]}))"><i class="bi bi-download"></i> Export</button>' +
        '</div></div>' +

        '<div class="stat-grid">' +
        '<div class="stat-card"><div class="stat-icon ' + (App._trackingFilter === 'all' ? 'gold' : 'blue') + '"><i class="bi bi-box-seam"></i></div><div class="stat-body"><div class="stat-label">Total Orders</div><div class="stat-value">' + orders.length + '</div></div></div>' +
        '<div class="stat-card"><div class="stat-icon gray"><i class="bi bi-clock-history"></i></div><div class="stat-body"><div class="stat-label">Pending</div><div class="stat-value">' + pending.length + '</div></div></div>' +
        '<div class="stat-card"><div class="stat-icon blue"><i class="bi bi-truck"></i></div><div class="stat-body"><div class="stat-label">In Transit</div><div class="stat-value">' + inTransit.length + '</div></div></div>' +
        '<div class="stat-card"><div class="stat-icon green"><i class="bi bi-check-circle"></i></div><div class="stat-body"><div class="stat-label">Delivered</div><div class="stat-value">' + delivered.length + '</div></div></div>' +
        '</div>' +

        '<div class="filter-pills">' +
        allStatuses.map(function(s) {
            return '<button class="filter-pill ' + (App._trackingFilter === s.key ? 'active' : '') + '" onclick="App.setTrackingFilter(\'' + s.key + '\')">' + s.label + ' <span class="pill-count">' + s.count + '</span></button>';
        }).join('') +
        '</div>' +

        '<div class="card"><div class="card-header"><h3>Tracked Orders</h3></div><div class="card-body">' +
        '<table class="table table-hover" id="trackingTable">' +
        '<thead><tr><th>Order</th><th>Customer</th><th>Tracking ID</th><th>Status</th><th>ETA</th><th>Date</th><th></th></tr></thead>' +
        '<tbody>' + renderTable() + '</tbody></table>' +
        '</div></div></div>';

    if (typeof $ !== 'undefined') {
        try { $('#trackingTable').DataTable({ pageLength: 10, retrieve: true }); } catch (e) {}
    }
};

App.setTrackingFilter = function(key) {
    App._trackingFilter = key;
    App.navigate('tracking');
};

App.copyTracking = function(trackingId) {
    if (!trackingId) { Helpers.toast('No tracking ID available', 'warning'); return; }
    if (navigator.clipboard) {
        navigator.clipboard.writeText(trackingId).then(function() {
            Helpers.toast('Tracking ID copied: ' + trackingId, 'success');
        });
    } else {
        Helpers.toast('Tracking ID: ' + trackingId, 'info');
    }
};

App.viewTracking = function(orderId) {
    var order = MockData.orders.find(function(o) { return o.id === orderId; });
    if (!order) return;
    var td = MockData.trackingDetails[orderId] || {};
    var steps = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
    var stepLabels = { pending: 'Order Placed', confirmed: 'Confirmed', processing: 'Processing', shipped: 'Shipped', out_for_delivery: 'Out for Delivery', delivered: 'Delivered' };

    var currentStatus = (order.status || 'pending').toLowerCase();
    if (currentStatus === 'completed') currentStatus = 'delivered';
    if (currentStatus === 'placed') currentStatus = 'pending';
    var currentIdx = steps.indexOf(currentStatus);

    var timelineHtml = '';
    var history = td.history || [];

    if (history.length > 0) {
        timelineHtml = '<div class="tracking-timeline" style="display:flex;flex-direction:column;gap:0">';
        history.forEach(function(h, i) {
            var lineClass = h.done ? 'done' : 'pending';
            var iconClass = h.done ? 'bi-check-circle-fill' : 'bi-circle';
            var color = h.done ? '#2D9A6C' : '#C4C0B8';
            var isLast = i === history.length - 1;
            timelineHtml += '<div class="timeline-item" style="display:flex;gap:14px;position:relative;padding-bottom:' + (isLast ? '0' : '20px') + '">' +
                '<div style="display:flex;flex-direction:column;align-items:center">' +
                '<div style="width:34px;height:34px;border-radius:50%;background:' + (h.done ? '#E8F5E9' : '#F5F3EE') + ';display:flex;align-items:center;justify-content:center;flex-shrink:0;z-index:1">' +
                '<i class="bi ' + iconClass + '" style="font-size:1.1rem;color:' + color + '"></i></div>' +
                (!isLast ? '<div style="width:2px;flex:1;background:' + (h.done ? '#2D9A6C' : '#E0DDD5') + ';margin-top:4px"></div>' : '') +
                '</div>' +
                '<div style="padding-top:4px">' +
                '<div style="font-weight:600;font-size:0.88rem;color:' + (h.done ? 'var(--black)' : 'var(--gray-400)') + '">' + h.status + '</div>' +
                '<div style="font-size:0.78rem;color:var(--gray-500)">' + Helpers.escapeHtml(h.location) + '</div>' +
                '<div style="font-size:0.75rem;color:var(--gray-400)">' + (h.date || 'Pending') + '</div>' +
                '</div></div>';
        });
        timelineHtml += '</div>';
    } else {
        timelineHtml = '<div style="padding:12px;background:var(--ivory);border-radius:8px;color:var(--gray-500);text-align:center"><i class="bi bi-info-circle"></i> No detailed tracking history available yet.</div>';
    }

    var pct = currentIdx >= 0 ? Math.round((currentIdx / (steps.length - 1)) * 100) : 0;

    var html =
        '<div class="modal-header"><h3 class="modal-title"><i class="bi bi-geo-alt-fill" style="color:var(--gold)"></i> Order Tracking — ' + order.id + '</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body">' +

        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">' +
        '<div class="info-box"><span class="info-label">Customer</span><span class="info-value">' + Helpers.escapeHtml(order.customer) + '</span></div>' +
        '<div class="info-box"><span class="info-label">Product</span><span class="info-value" style="font-size:0.82rem">' + Helpers.escapeHtml(order.product) + '</span></div>' +
        '<div class="info-box"><span class="info-label">Tracking ID</span><span class="info-value"><code>' + (order.trackingId || '—') + '</code></span></div>' +
        '<div class="info-box"><span class="info-label">AWB Number</span><span class="info-value"><code>' + (td.awb || '—') + '</code></span></div>' +
        '<div class="info-box"><span class="info-label">Carrier</span><span class="info-value">' + (td.carrier || '—') + '</span></div>' +
        '<div class="info-box"><span class="info-label">Current Location</span><span class="info-value">' + (td.currentLocation || '—') + '</span></div>' +
        '<div class="info-box"><span class="info-label">Shipped Date</span><span class="info-value">' + (td.shippedDate ? Helpers.formatDate(td.shippedDate) : '—') + '</span></div>' +
        '<div class="info-box"><span class="info-label">' + (order.status === 'delivered' || order.status === 'completed' ? 'Delivered' : 'ETA') + '</span><span class="info-value">' + (td.deliveredDate ? Helpers.formatDate(td.deliveredDate) : td.eta ? Helpers.formatDate(td.eta) : '—') + '</span></div>' +
        '</div>' +

        '<div style="margin-bottom:20px">' +
        '<div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-weight:600;font-size:0.85rem">Delivery Progress</span><span style="font-size:0.85rem;color:var(--gold-deep);font-weight:700">' + pct + '%</span></div>' +
        '<div style="height:8px;background:var(--ivory);border-radius:4px;overflow:hidden"><div style="height:100%;width:' + pct + '%;background:linear-gradient(90deg,var(--gold),var(--gold-deep));border-radius:4px;transition:width .5s"></div></div>' +
        '</div>' +

        '<div style="background:#F9FAFB;border:1px solid var(--line);border-radius:10px;padding:20px;margin-bottom:16px">' +
        '<h4 style="font-size:0.9rem;font-weight:700;margin-bottom:16px;color:var(--black)"><i class="bi bi-list-ul" style="color:var(--gold)"></i> Tracking History</h4>' +
        timelineHtml +
        '</div>' +

        (order.status !== 'delivered' && order.status !== 'completed' && order.status !== 'cancelled' ?
            '<div style="display:flex;gap:8px">' +
            '<button class="btn btn-primary" onclick="App.updateOrderStatus(\'' + order.id + '\')"><i class="bi bi-arrow-up-circle"></i> Update Status</button>' +
            '<button class="btn btn-outline" onclick="App.copyTracking(\'' + (order.trackingId || '') + '\')"><i class="bi bi-clipboard"></i> Copy Tracking ID</button>' +
            '</div>' : '') +

        '</div>' +
        '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Close</button></div>';

    Helpers.openModal(html, 'modal-lg');
};

App.updateOrderStatus = function(orderId) {
    var order = MockData.orders.find(function(o) { return o.id === orderId; });
    if (!order) return;
    var statuses = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
    var currentIdx = statuses.indexOf((order.status || 'pending').toLowerCase().replace('completed', 'delivered').replace('placed', 'pending'));
    var nextStatus = statuses[Math.min(currentIdx + 1, statuses.length - 1)];

    Helpers.confirm({
        title: 'Update Order Status',
        text: 'Change status of ' + orderId + ' from "' + Helpers.capitalize(order.status) + '" to "' + Helpers.capitalize(nextStatus) + '"?',
        icon: 'info'
    }).then(function(r) {
        if (r.isConfirmed) {
            order.status = nextStatus;
            Helpers.closeModal();
            Helpers.toast('Order ' + orderId + ' status updated to ' + Helpers.capitalize(nextStatus), 'success');
            App.navigate('tracking');
        }
    });
};
