'use strict';
/* TATITO FASHIONS — Payments page */
App.pages.payments = function() {
    var totalPaid = MockData.orders.filter(function(o){return o.payment==='paid';}).reduce(function(s,o){return s+(o.amount||0);},0);
    var totalPending = MockData.orders.filter(function(o){return o.payment!=='paid';}).reduce(function(s,o){return s+(o.amount||0);},0);
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Payments</h3><p class="text-muted">Razorpay payment transactions</p></div></div>' +
        '<div class="stat-grid">' +
        '<div class="stat-card"><div class="stat-icon green"><i class="bi bi-check-circle"></i></div><div class="stat-body"><div class="stat-label">Total Paid</div><div class="stat-value">'+Helpers.formatCurrency(totalPaid)+'</div></div></div>' +
        '<div class="stat-card"><div class="stat-icon orange"><i class="bi bi-clock"></i></div><div class="stat-body"><div class="stat-label">Pending</div><div class="stat-value">'+Helpers.formatCurrency(totalPending)+'</div></div></div>' +
        '</div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="paymentsTable"><thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Payment</th><th>Date</th><th></th></tr></thead><tbody>' +
        MockData.orders.map(function(o){return '<tr><td><strong>'+o.id+'</strong></td><td>'+o.customer+'</td><td>'+Helpers.formatCurrency(o.amount)+'</td><td><span class="badge '+(o.payment==='paid'?'badge-success':'badge-warning')+'">'+Helpers.capitalize(o.payment||'pending')+'</span></td><td>'+Helpers.formatDate(o.date)+'</td><td><button class="btn btn-sm btn-ghost" onclick="App.viewOrder(\''+o.id+'\')"><i class="bi bi-eye"></i></button></td></tr>';}).join('')+
        '</tbody></table></div></div></div>';
    if(typeof $!=='undefined'){$('#paymentsTable').DataTable({pageLength:10,order:[[4,'desc']]});}
};
