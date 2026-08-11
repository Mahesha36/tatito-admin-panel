'use strict';
/* TATITO FASHIONS — Approvals page */
App.pages.approvals = function() {
    var pendingSellers = MockData.sellers.filter(function(s) { return s.status === 'pending'; });
    var pendingDesigners = MockData.designers.filter(function(d) { return d.status === 'pending'; });
    var pendingBoutiques = (MockData.boutiques || []).filter(function(b) { return b.status === 'pending'; });
    var totalPending = pendingSellers.length + pendingDesigners.length + (pendingBoutiques ? pendingBoutiques.length : 0);
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Approvals</h3><p class="text-muted">User/Seller/Designer registration approvals</p></div></div>' +
        '<div class="stat-grid">' +
        '<div class="stat-card"><div class="stat-icon orange"><i class="bi bi-hourglass-split"></i></div><div class="stat-body"><div class="stat-label">Pending Sellers</div><div class="stat-value">'+pendingSellers.length+'</div></div></div>' +
        '<div class="stat-card"><div class="stat-icon purple"><i class="bi bi-palette"></i></div><div class="stat-body"><div class="stat-label">Pending Designers</div><div class="stat-value">'+pendingDesigners.length+'</div></div></div>' +
        '<div class="stat-card"><div class="stat-icon blue"><i class="bi bi-shop"></i></div><div class="stat-body"><div class="stat-label">Pending Boutiques</div><div class="stat-value">'+(pendingBoutiques?pendingBoutiques.length:0)+'</div></div></div>' +
        '</div>' +
        '<div class="card" style="margin-top:1rem"><div class="card-header"><h3>Seller Approval Requests</h3></div><div class="card-body">' +
        (pendingSellers.length === 0 ? '<div class="empty-state"><i class="bi bi-check-circle"></i><p>No pending seller requests.</p></div>' :
        '<table class="table table-hover"><thead><tr><th>ID</th><th>Business</th><th>City</th><th></th></tr></thead><tbody>' +
        pendingSellers.map(function(s) {
            return '<tr><td>'+s.id+'</td><td><strong>'+s.businessName+'</strong></td><td>'+s.city+'</td>' +
                '<td><button class="btn btn-sm btn-success" onclick="App.approveEntity(\'sellers\',\''+s.id+'\')"><i class="bi bi-check-lg"></i></button> ' +
                '<button class="btn btn-sm btn-danger" onclick="App.rejectEntity(\'sellers\',\''+s.id+'\')"><i class="bi bi-x-lg"></i></button></td></tr>';
        }).join('') + '</tbody></table>') +
        '</div></div>' +
        '<div class="card" style="margin-top:1rem"><div class="card-header"><h3>Designer Approval Requests</h3></div><div class="card-body">' +
        (pendingDesigners.length === 0 ? '<div class="empty-state"><i class="bi bi-check-circle"></i><p>No pending designer requests.</p></div>' :
        '<table class="table table-hover"><thead><tr><th>ID</th><th>Name</th><th>Specialty</th><th></th></tr></thead><tbody>' +
        pendingDesigners.map(function(d) {
            return '<tr><td>'+d.id+'</td><td><strong>'+d.name+'</strong></td><td>'+(d.specialty||'\u2014')+'</td>' +
                '<td><button class="btn btn-sm btn-success" onclick="App.approveEntity(\'designers\',\''+d.id+'\')"><i class="bi bi-check-lg"></i></button> ' +
                '<button class="btn btn-sm btn-danger" onclick="App.rejectEntity(\'designers\',\''+d.id+'\')"><i class="bi bi-x-lg"></i></button></td></tr>';
        }).join('') + '</tbody></table>') +
        '</div></div></div>';
};
App.approveEntity = function(type, id) {
    var list = MockData[type]; if (!list) return;
    var item = list.find(function(x) { return x.id == id; }); if (!item) return;
    item.status = 'active';
    Helpers.toast(Helpers.capitalize(type.slice(0,-1)) + ' approved', 'success');
    App.navigate('approvals');
};
App.rejectEntity = function(type, id) {
    Helpers.confirm('Reject this request?', function() {
        var list = MockData[type]; if (!list) return;
        var item = list.find(function(x) { return x.id == id; });
        if (item) item.status = 'rejected';
        Helpers.toast('Request rejected', 'success');
        App.navigate('approvals');
    });
};
