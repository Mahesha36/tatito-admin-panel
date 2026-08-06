'use strict';
/* TATITO FASHIONS — Contact Us Queries page */
App.pages.contactQueries = function() {
    var self = this;
    var queries = MockData.contactQueries || [];

    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Contact Us Queries</h3><p class="text-muted">Manage customer inquiries and messages</p></div></div>' +
        '<div class="stat-grid">' +
        '<div class="stat-card"><div class="stat-icon gold"><i class="bi bi-envelope"></i></div><div class="stat-info"><p>Total Queries</p><h3>' + queries.length + '</h3></div></div>' +
        '<div class="stat-card"><div class="stat-icon blue"><i class="bi bi-clock"></i></div><div class="stat-info"><p>Pending</p><h3>' + queries.filter(function(q){return q.status==='pending';}).length + '</h3></div></div>' +
        '<div class="stat-card"><div class="stat-icon green"><i class="bi bi-check-circle"></i></div><div class="stat-info"><p>Replied</p><h3>' + queries.filter(function(q){return q.status==='replied';}).length + '</h3></div></div>' +
        '</div>' +
        '<div class="card"><div class="card-header"><h4 class="card-title">All Contact Queries</h4></div>' +
        '<div class="table-wrap"><table class="admin-table" id="contactTable">' +
        '<thead><tr><th>#</th><th>Name</th><th>Email</th><th>Subject</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>' +
        '<tbody>' + queries.map(function(q, i) {
            return '<tr>' +
                '<td>' + (i+1) + '</td>' +
                '<td><div class="cell-user"><div class="avatar" style="background:' + Helpers.avatarColor(q.name) + '">' + Helpers.initials(q.name) + '</div><div class="user-cell-info"><div class="user-cell-name">' + Helpers.escapeHtml(q.name) + '</div></div></div></td>' +
                '<td>' + Helpers.escapeHtml(q.email) + '</td>' +
                '<td>' + Helpers.escapeHtml(q.subject) + '</td>' +
                '<td>' + Helpers.formatDate(q.date) + '</td>' +
                '<td><span class="badge ' + (q.status === 'replied' ? 'badge-success' : 'badge-warning') + '">' + Helpers.capitalize(q.status) + '</span></td>' +
                '<td><div class="table-actions">' +
                '<button class="action-btn view" onclick="App.viewQuery(\'' + q.id + '\')" title="View"><i class="bi bi-eye"></i></button>' +
                '<button class="action-btn reply" onclick="App.replyQuery(\'' + q.id + '\')" title="Reply"><i class="bi bi-reply"></i></button>' +
                '<button class="action-btn delete" onclick="App.deleteQuery(\'' + q.id + '\')" title="Delete"><i class="bi bi-trash"></i></button>' +
                '</div></td>' +
                '</tr>';
        }).join('') + '</tbody></table></div></div></div>';

    var tbl = document.getElementById('contactTable');
    if (tbl && typeof $ !== 'undefined') $(tbl).DataTable({ pageLength: 10, retrieve: true, order: [[4, 'desc']] });
};

App.viewQuery = function(id) {
    var q = MockData.contactQueries.find(function(x) { return x.id === id; });
    if (!q) return;
    Helpers.openModal(
        '<div class="modal-header"><h3 class="modal-title">Query Details</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body">' +
        '<div class="detail-section">' +
        '<div class="detail-row"><span class="label">Name</span><span class="value">' + Helpers.escapeHtml(q.name) + '</span></div>' +
        '<div class="detail-row"><span class="label">Email</span><span class="value">' + Helpers.escapeHtml(q.email) + '</span></div>' +
        '<div class="detail-row"><span class="label">Subject</span><span class="value">' + Helpers.escapeHtml(q.subject) + '</span></div>' +
        '<div class="detail-row"><span class="label">Date</span><span class="value">' + Helpers.formatDate(q.date) + '</span></div>' +
        '<div class="detail-row"><span class="label">Status</span><span class="value"><span class="badge ' + (q.status === 'replied' ? 'badge-success' : 'badge-warning') + '">' + Helpers.capitalize(q.status) + '</span></span></div>' +
        '</div>' +
        '<div style="padding:14px;background:var(--ivory);border-radius:8px;font-size:0.88rem;color:var(--gray-600);line-height:1.5;margin-top:12px">' + Helpers.escapeHtml(q.message) + '</div>' +
        '</div>' +
        '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Close</button><button class="btn btn-primary" onclick="Helpers.closeModal();App.replyQuery(\'' + q.id + '\')"><i class="bi bi-reply"></i> Reply</button></div>',
        'modal-lg'
    );
};

App.replyQuery = function(id) {
    var q = MockData.contactQueries.find(function(x) { return x.id === id; });
    if (!q) return;
    Helpers.openModal(
        '<div class="modal-header"><h3 class="modal-title">Reply to ' + Helpers.escapeHtml(q.name) + '</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body">' +
        '<div class="form-group"><label>To</label><input type="email" class="form-control" value="' + Helpers.escapeHtml(q.email) + '" readonly></div>' +
        '<div class="form-group"><label>Subject</label><input type="text" class="form-control" value="Re: ' + Helpers.escapeHtml(q.subject) + '"></div>' +
        '<div class="form-group"><label>Message</label><textarea class="form-control" rows="6" placeholder="Type your reply..."></textarea></div>' +
        '</div>' +
        '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.sendReply(\'' + q.id + '\')"><i class="bi bi-send"></i> Send Reply</button></div>',
        'modal-lg'
    );
};

App.sendReply = function(id) {
    var q = MockData.contactQueries.find(function(x) { return x.id === id; });
    if (q) q.status = 'replied';
    Helpers.closeModal();
    Helpers.toast('Reply sent successfully', 'success');
    App.navigate('contactQueries');
};

App.deleteQuery = function(id) {
    Helpers.confirm('Delete this query?', 'This action cannot be undone.', 'warning').then(function(r) {
        if (r.isConfirmed) {
            var idx = MockData.contactQueries.findIndex(function(x) { return x.id === id; });
            if (idx >= 0) MockData.contactQueries.splice(idx, 1);
            Helpers.toast('Query deleted', 'success');
            App.navigate('contactQueries');
        }
    });
};
