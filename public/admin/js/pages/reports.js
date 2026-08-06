'use strict';
/* TATITO FASHIONS — Reports page */
App.pages.reports = function() {
    var totalRev = MockData.orders.reduce(function(s,o){return s+(o.amount||0);},0);
    var avgOrder = totalRev / (MockData.orders.length || 1);
    var statusCounts = {};
    MockData.orders.forEach(function(o){statusCounts[o.status]=(statusCounts[o.status]||0)+1;});
    var sellerRev = {};
    MockData.orders.forEach(function(o){sellerRev[o.seller]=(sellerRev[o.seller]||0)+(o.amount||0);});
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Reports & Analytics</h3><p class="text-muted">Marketplace performance metrics</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-ghost" onclick="App.downloadReport()"><i class="bi bi-download"></i> Export Report</button></div></div>' +
        '<div class="stat-grid">' +
        '<div class="stat-card"><div class="stat-icon gold"><i class="bi bi-graph-up"></i></div><div class="stat-body"><div class="stat-label">Total Revenue</div><div class="stat-value">'+Helpers.formatCurrency(totalRev)+'</div></div></div>' +
        '<div class="stat-card"><div class="stat-icon blue"><i class="bi bi-bag-check"></i></div><div class="stat-body"><div class="stat-label">Total Orders</div><div class="stat-value">'+MockData.orders.length+'</div></div></div>' +
        '<div class="stat-card"><div class="stat-icon purple"><i class="bi bi-calculator"></i></div><div class="stat-body"><div class="stat-label">Avg Order Value</div><div class="stat-value">'+Helpers.formatCurrency(avgOrder)+'</div></div></div>' +
        '</div>' +
        '<div class="content-grid two-col">' +
        '<div class="card"><div class="card-header"><h3>Order Status Distribution</h3></div><div class="card-body"><canvas id="statusChart" height="200"></canvas></div></div>' +
        '<div class="card"><div class="card-header"><h3>Top Sellers by Revenue</h3></div><div class="card-body"><canvas id="sellerChart" height="200"></canvas></div></div>' +
        '</div>' +
        '<div class="card" style="margin-top:1rem"><div class="card-header"><h3>Detailed Sales Report</h3></div><div class="card-body">' +
        '<table class="table table-hover" id="reportTable"><thead><tr><th>Order</th><th>Customer</th><th>Product</th><th>Seller</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>' +
        MockData.orders.map(function(o){return '<tr><td><strong>'+o.id+'</strong></td><td>'+o.customer+'</td><td>'+o.product+'</td><td>'+(o.seller||'\u2014')+'</td><td>'+Helpers.formatCurrency(o.amount)+'</td><td><span class="badge '+Helpers.statusBadge(o.status)+'">'+Helpers.capitalize(o.status)+'</span></td><td>'+Helpers.formatDate(o.date)+'</td></tr>';}).join('')+
        '</tbody></table></div></div></div>';
    var sCtx=document.getElementById('statusChart');if(sCtx){App.charts.status=new Chart(sCtx,{type:'doughnut',data:{labels:Object.keys(statusCounts),datasets:[{data:Object.values(statusCounts),backgroundColor:['#C9A24B','#3D5A80','#7B2D26','#2D6A4F','#8338EC','#E63946','#457B9D']}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right'}}}});}
    var slCtx=document.getElementById('sellerChart');if(slCtx){var topSellers=Object.entries(sellerRev).sort(function(a,b){return b[1]-a[1];}).slice(0,8);App.charts.seller=new Chart(slCtx,{type:'bar',data:{labels:topSellers.map(function(s){return s[0];}),datasets:[{label:'Revenue',data:topSellers.map(function(s){return s[1];}),backgroundColor:'#C9A24B'}]},options:{responsive:true,maintainAspectRatio:false,indexAxis:'y',plugins:{legend:{display:false}}}});}
    if(typeof $!=='undefined'){$('#reportTable').DataTable({pageLength:10,order:[[6,'desc']]});}
};
App.downloadReport = function() {
    var headers = ['Order ID','Customer','Product','Seller','Amount','Status','Date'];
    var rows = MockData.orders.map(function(o){return [o.id,o.customer,o.product,o.seller||'',o.amount,o.status,o.date];});
    Helpers.downloadCSV('sales_report.csv', headers, rows);
    Helpers.toast('Report exported', 'success');
};
