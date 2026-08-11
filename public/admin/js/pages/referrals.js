'use strict';
/* TATITO FASHIONS — Referrals page */
App.pages.referrals = function() {
    var refs = MockData.referrals || MockData.users.filter(function(u) { return u.referralCode; }).map(function(u, i) {
        return { id: 'REF' + (i + 1), user: u.name, code: u.referralCode, level: (i % 4) + 1, earnings: Math.floor(Math.random() * 5000), joins: Math.floor(Math.random() * 20) + 1 };
    });
    var totalEarn = refs.reduce(function(s, r) { return s + (r.earnings || 0); }, 0);
    var levelCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    refs.forEach(function(r) { if (levelCounts[r.level]) levelCounts[r.level]++; });
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Referral Program</h3><p class="text-muted">4-Level referral tracking</p></div></div>' +
        '<div class="stat-grid">' +
        '<div class="stat-card"><div class="stat-icon gold"><i class="bi bi-share"></i></div><div class="stat-body"><div class="stat-label">Total Referrals</div><div class="stat-value">' + refs.length + '</div></div></div>' +
        '<div class="stat-card"><div class="stat-icon green"><i class="bi bi-currency-rupee"></i></div><div class="stat-body"><div class="stat-label">Total Earnings</div><div class="stat-value">' + Helpers.formatCurrency(totalEarn) + '</div></div></div>' +
        '<div class="stat-card"><div class="stat-icon purple"><i class="bi bi-diagram-3"></i></div><div class="stat-body"><div class="stat-label">Levels Active</div><div class="stat-value">' + Object.keys(levelCounts).filter(function(k){return levelCounts[k]>0;}).length + '/4</div></div></div>' +
        '</div>' +
        '<div class="content-grid two-col">' +
        '<div class="card"><div class="card-header"><h3>Level Distribution</h3></div><div class="card-body"><canvas id="refChart" height="200"></canvas></div></div>' +
        '<div class="card"><div class="card-header"><h3>Referral Details</h3></div><div class="card-body"><table class="table table-hover"><thead><tr><th>Level</th><th>Referrals</th></tr></thead><tbody>' +
        Object.keys(levelCounts).map(function(k){return '<tr><td><strong>Level '+k+'</strong></td><td>'+levelCounts[k]+'</td></tr>';}).join('') +
        '</tbody></table></div></div></div>' +
        '<div class="card" style="margin-top:1rem"><div class="card-body">' +
        '<table class="table table-hover" id="refTable"><thead><tr><th>ID</th><th>User</th><th>Code</th><th>Level</th><th>Joins</th><th>Earnings</th></tr></thead><tbody>' +
        refs.map(function(r){return '<tr><td>'+r.id+'</td><td>'+r.user+'</td><td><strong>'+r.code+'</strong></td><td>'+r.level+'</td><td>'+r.joins+'</td><td>'+Helpers.formatCurrency(r.earnings)+'</td></tr>';}).join('') +
        '</tbody></table></div></div></div>';
    var ctx=document.getElementById('refChart'); if(ctx){App.charts.ref=new Chart(ctx,{type:'bar',data:{labels:['L1','L2','L3','L4'],datasets:[{label:'Referrals',data:[levelCounts[1],levelCounts[2],levelCounts[3],levelCounts[4]],backgroundColor:['#C9A24B','#3D5A80','#2D6A4F','#8338EC']}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}}}});}
    if(typeof $!=='undefined'){$('#refTable').DataTable({pageLength:10});}
};
