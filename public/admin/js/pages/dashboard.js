'use strict';
/* TATITO FASHIONS — Dashboard page */
App.pages.dashboard = function() {
    var totalRevenue = MockData.orders.reduce(function(s, o) { return s + (o.amount || 0); }, 0);
    var pendingOrders = MockData.orders.filter(function(o) { return o.status === 'pending'; }).length;
    var totalProducts = MockData.products.length;
    var totalSellers = MockData.sellers.length;
    var totalCustomers = MockData.users.length;
    var monthlyData = {};
    MockData.orders.forEach(function(o) {
        var d = new Date(o.date);
        var key = d.toLocaleString('en', { month: 'short' });
        monthlyData[key] = (monthlyData[key] || 0) + (o.amount || 0);
    });
    var monthLabels = Object.keys(monthlyData);
    var monthValues = Object.values(monthlyData);
    var catCounts = {};
    MockData.products.forEach(function(p) {
        var c = p.category || 'Other';
        catCounts[c] = (catCounts[c] || 0) + 1;
    });

    document.getElementById('pageContent').innerHTML =
        '<div class="page-content">' +
        '<div class="welcome-banner"><div><h2>Welcome back, Admin!</h2><p>TATITO Fashions — Overview of your marketplace</p></div></div>' +
        '<div class="stat-grid">' +
        '<div class="stat-card"><div class="stat-icon gold"><i class="bi bi-currency-rupee"></i></div><div class="stat-body"><div class="stat-label">Total Revenue</div><div class="stat-value">' + Helpers.formatCurrency(totalRevenue) + '</div></div></div>' +
        '<div class="stat-card"><div class="stat-icon blue"><i class="bi bi-bag-check"></i></div><div class="stat-body"><div class="stat-label">Total Orders</div><div class="stat-value">' + MockData.orders.length + '</div><div class="stat-sub">' + pendingOrders + ' pending</div></div></div>' +
        '<div class="stat-card"><div class="stat-icon purple"><i class="bi bi-box-seam"></i></div><div class="stat-body"><div class="stat-label">Products</div><div class="stat-value">' + totalProducts + '</div></div></div>' +
        '<div class="stat-card"><div class="stat-icon green"><i class="bi bi-shop"></i></div><div class="stat-body"><div class="stat-label">Active Sellers</div><div class="stat-value">' + totalSellers + '</div></div></div>' +
        '<div class="stat-card"><div class="stat-icon orange"><i class="bi bi-people"></i></div><div class="stat-body"><div class="stat-label">Customers</div><div class="stat-value">' + totalCustomers + '</div></div></div>' +
        '</div>' +
        '<div class="content-grid two-col">' +
        '<div class="card"><div class="card-header"><h3>Revenue Trend</h3></div><div class="card-body"><canvas id="revenueChart" height="200"></canvas></div></div>' +
        '<div class="card"><div class="card-header"><h3>Products by Category</h3></div><div class="card-body"><canvas id="categoryChart" height="200"></canvas></div></div>' +
        '</div>' +
        '<div class="content-grid two-col">' +
        '<div class="card"><div class="card-header"><h3>Recent Orders</h3><a href="#orders" class="btn btn-sm btn-ghost">View All</a></div><div class="card-body">' +
        '<table class="table table-hover"><thead><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead><tbody>' +
        MockData.orders.slice(0, 6).map(function(o) {
            return '<tr><td><strong>' + o.id + '</strong></td><td>' + o.customer + '</td><td>' + Helpers.formatCurrency(o.amount) + '</td><td><span class="badge ' + Helpers.statusBadge(o.status) + '">' + Helpers.capitalize(o.status) + '</span></td></tr>';
        }).join('') +
        '</tbody></table></div></div>' +
        '<div class="card"><div class="card-header"><h3>Top Sellers</h3></div><div class="card-body"><div class="seller-list">' +
        MockData.sellers.slice(0, 5).map(function(s) {
            var revenue = MockData.orders.filter(function(o) { return o.seller === s.businessName; }).reduce(function(a, o) { return a + (o.amount || 0); }, 0);
            return '<div class="seller-row"><div class="seller-avatar" style="background:' + Helpers.avatarColor(s.id) + '">' + (s.businessName || '?').charAt(0) + '</div><div class="seller-info"><strong>' + s.businessName + '</strong><small>' + s.city + ' &bull; ' + Helpers.formatCurrency(revenue) + '</small></div></div>';
        }).join('') +
        '</div></div></div>' +
        '</div></div>';

    var revCtx = document.getElementById('revenueChart');
    if (revCtx) {
        App.charts.revenue = new Chart(revCtx, {
            type: 'line',
            data: { labels: monthLabels, datasets: [{ label: 'Revenue', data: monthValues, borderColor: '#C9A24B', backgroundColor: 'rgba(201,162,75,.1)', fill: true, tension: 0.3 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
        });
    }
    var catCtx = document.getElementById('categoryChart');
    if (catCtx) {
        App.charts.category = new Chart(catCtx, {
            type: 'doughnut',
            data: { labels: Object.keys(catCounts), datasets: [{ data: Object.values(catCounts), backgroundColor: ['#C9A24B', '#3D5A80', '#7B2D26', '#2D6A4F', '#8338EC', '#E63946'] }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }
        });
    }
};
