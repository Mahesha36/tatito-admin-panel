'use strict';
/* TATITO FASHIONS — Support Tickets page */
App.pages.supportTickets = function() {
    var tickets = MockData.supportTickets || [];

    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Support Tickets</h3><p class="text-muted">Customer support ticket management</p></div></div>' +
        '<div class="stat-grid">' +
        '<div class="stat-card"><div class="stat-icon gold"><i class="bi bi-life-preserver"></i></div><div class="stat-info"><p>Total Tickets</p><h3>' + tickets.length + '</h3></div></div>' +
        '<div class="stat-card"><div class="stat-icon blue"><i class="bi bi-exclamation-circle"></i></div><div class="stat-info"><p>Open</p><h3>' + tickets.filter(function(t){return t.status==='open';}).length + '</h3></div></div>' +
        '<div class="stat-card"><div class="stat-icon purple"><i class="bi bi-arrow-repeat"></i></div><div class="stat-info"><p>In Progress</p><h3>' + tickets.filter(function(t){return t.status==='in_progress';}).length + '</h3></div></div>' +
        '<div class="stat-card"><div class="stat-icon green"><i class="bi bi-check-circle"></i></div><div class="stat-info"><p>Resolved</p><h3>' + tickets.filter(function(t){return t.status==='resolved';}).length + '</h3></div></div>' +
        '</div>' +
        '<div class="card"><div class="card-header"><h4 class="card-title">All Support Tickets</h4></div>' +
        '<div class="table-wrap"><table class="admin-table" id="ticketsTable">' +
        '<thead><tr><th>Ticket ID</th><th>Subject</th><th>User</th><th>Priority</th><th>Category</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>' +
        '<tbody>' + tickets.map(function(t) {
            var priCls = t.priority === 'high' ? 'badge-danger' : t.priority === 'medium' ? 'badge-warning' : 'badge-gray';
            var stsCls = t.status === 'open' ? 'badge-danger' : t.status === 'in_progress' ? 'badge-warning' : t.status === 'resolved' ? 'badge-success' : 'badge-gray';
            return '<tr>' +
                '<td class="cell-strong">' + t.id + '</td>' +
                '<td>' + Helpers.escapeHtml(t.subject) + '</td>' +
                '<td><div class="cell-user"><div class="avatar" style="background:' + Helpers.avatarColor(t.user) + '">' + Helpers.initials(t.user) + '</div><div class="user-cell-info"><div class="user-cell-name">' + Helpers.escapeHtml(t.user) + '</div><div class="user-cell-meta">' + Helpers.escapeHtml(t.email) + '</div></div></div></td>' +
                '<td><span class="badge ' + priCls + '">' + Helpers.capitalize(t.priority) + '</span></td>' +
                '<td>' + Helpers.escapeHtml(t.category) + '</td>' +
                '<td><span class="badge ' + stsCls + '">' + t.status.replace(/_/g, ' ').replace(/\b\w/g, function(c){return c.toUpperCase();}) + '</span></td>' +
                '<td>' + Helpers.formatDate(t.date) + '</td>' +
                '<td><div class="table-actions">' +
                '<button class="action-btn view" onclick="App.viewTicket(\'' + t.id + '\')" title="View"><i class="bi bi-eye"></i></button>' +
                '<button class="action-btn edit" onclick="App.updateTicketStatus(\'' + t.id + '\')" title="Update Status"><i class="bi bi-pencil"></i></button>' +
                '<button class="action-btn delete" onclick="App.deleteTicket(\'' + t.id + '\')" title="Delete"><i class="bi bi-trash"></i></button>' +
                '</div></td>' +
                '</tr>';
        }).join('') + '</tbody></table></div></div></div>';

    var tbl = document.getElementById('ticketsTable');
    if (tbl && typeof $ !== 'undefined') $(tbl).DataTable({ pageLength: 10, retrieve: true, order: [[6, 'desc']] });
};

App.viewTicket = function(id) {
    var t = MockData.supportTickets.find(function(x) { return x.id === id; });
    if (!t) return;
    var msgs = t.messages.map(function(m) {
        var isStaff = m.from === 'Support Team';
        return '<div style="margin-bottom:12px;padding:12px;border-radius:8px;background:' + (isStaff ? 'rgba(201,162,75,0.1)' : 'var(--ivory)') + '">' +
            '<div style="display:flex;justify-content:space-between;margin-bottom:4px">' +
            '<strong style="font-size:0.82rem;color:' + (isStaff ? 'var(--gold-deep)' : 'var(--black)') + '">' + Helpers.escapeHtml(m.from) + '</strong>' +
            '<span style="font-size:0.72rem;color:var(--gray-400)">' + Helpers.formatDateTime(m.date) + '</span>' +
            '</div><div style="font-size:0.85rem;color:var(--gray-600);line-height:1.5">' + Helpers.escapeHtml(m.text) + '</div></div>';
    }).join('');

    Helpers.openModal(
        '<div class="modal-header"><h3 class="modal-title">Ticket ' + t.id + ' — ' + Helpers.escapeHtml(t.subject) + '</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body">' +
        '<div class="detail-section">' +
        '<div class="detail-row"><span class="label">User</span><span class="value">' + Helpers.escapeHtml(t.user) + '</span></div>' +
        '<div class="detail-row"><span class="label">Email</span><span class="value">' + Helpers.escapeHtml(t.email) + '</span></div>' +
        '<div class="detail-row"><span class="label">Category</span><span class="value">' + Helpers.escapeHtml(t.category) + '</span></div>' +
        '<div class="detail-row"><span class="label">Priority</span><span class="value">' + Helpers.capitalize(t.priority) + '</span></div>' +
        '<div class="detail-row"><span class="label">Status</span><span class="value">' + t.status.replace(/_/g,' ') + '</span></div>' +
        '</div>' +
        '<h4 style="font-size:0.82rem;font-weight:700;color:var(--gray-500);text-transform:uppercase;letter-spacing:0.5px;margin:16px 0 8px">Conversation</h4>' +
        '<div>' + msgs + '</div>' +
        '<div class="form-group" style="margin-top:16px"><label>Reply as Support</label><textarea class="form-control" rows="3" id="ticketReplyText" placeholder="Type your response..."></textarea></div>' +
        '</div>' +
        '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Close</button><button class="btn btn-primary" onclick="App.sendTicketReply(\'' + t.id + '\')"><i class="bi bi-send"></i> Send Reply</button></div>',
        'modal-xl'
    );
};

App.sendTicketReply = function(id) {
    var t = MockData.supportTickets.find(function(x) { return x.id === id; });
    if (!t) return;
    var text = document.getElementById('ticketReplyText').value.trim();
    if (!text) { Helpers.toast('Please enter a message', 'error'); return; }
    t.messages.push({ from: 'Support Team', text: text, date: new Date().toISOString() });
    if (t.status === 'open') t.status = 'in_progress';
    Helpers.closeModal();
    Helpers.toast('Reply sent', 'success');
    App.navigate('supportTickets');
};

App.updateTicketStatus = function(id) {
    var t = MockData.supportTickets.find(function(x) { return x.id === id; });
    if (!t) return;
    var statuses = ['open', 'in_progress', 'resolved', 'closed'];
    var options = statuses.map(function(s) {
        return '<option value="' + s + '"' + (s === t.status ? ' selected' : '') + '>' + s.replace(/_/g,' ').replace(/\b\w/g, function(c){return c.toUpperCase();}) + '</option>';
    }).join('');
    Helpers.openModal(
        '<div class="modal-header"><h3 class="modal-title">Update Ticket Status</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body">' +
        '<div class="detail-row"><span class="label">Ticket</span><span class="value">' + t.id + ' — ' + Helpers.escapeHtml(t.subject) + '</span></div>' +
        '<div class="detail-row"><span class="label">Current Status</span><span class="value">' + t.status.replace(/_/g,' ') + '</span></div>' +
        '<div class="form-group" style="margin-top:16px"><label>New Status</label><select class="form-control" id="ticketStatusSelect">' + options + '</select></div>' +
        '</div>' +
        '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveTicketStatus(\'' + t.id + '\')"><i class="bi bi-check-lg"></i> Update</button></div>'
    );
};

App.saveTicketStatus = function(id) {
    var t = MockData.supportTickets.find(function(x) { return x.id === id; });
    if (!t) return;
    t.status = document.getElementById('ticketStatusSelect').value;
    Helpers.closeModal();
    Helpers.toast('Ticket status updated', 'success');
    App.navigate('supportTickets');
};

App.deleteTicket = function(id) {
    Helpers.confirm('Delete this ticket?', 'This action cannot be undone.', 'warning').then(function(r) {
        if (r.isConfirmed) {
            var idx = MockData.supportTickets.findIndex(function(x) { return x.id === id; });
            if (idx >= 0) MockData.supportTickets.splice(idx, 1);
            Helpers.toast('Ticket deleted', 'success');
            App.navigate('supportTickets');
        }
    });
};
