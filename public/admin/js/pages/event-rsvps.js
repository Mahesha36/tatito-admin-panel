'use strict';
/* MODULE 4: Events & VIP Passbook — RSVPs */

App.pages['event-rsvps'] = function() {
    var data = MockData.eventRSVPs;
    var statusClass = { approved: 'badge-success', pending: 'badge-warning', declined: 'badge-danger' };
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Event RSVPs</h3><p class="text-muted">Manage guest ticket reservations</p></div></div>' +
        '<div class="stat-grid">' +
        '<div class="stat-card"><div class="stat-icon gold"><i class="bi bi-people"></i></div><div class="stat-info"><p>Total RSVPs</p><h3>'+data.length+'</h3></div></div>' +
        '<div class="stat-card"><div class="stat-icon green"><i class="bi bi-check-circle"></i></div><div class="stat-info"><p>Approved</p><h3>'+data.filter(function(r){return r.status==='approved';}).length+'</h3></div></div>' +
        '<div class="stat-card"><div class="stat-icon blue"><i class="bi bi-hourglass-split"></i></div><div class="stat-info"><p>Pending</p><h3>'+data.filter(function(r){return r.status==='pending';}).length+'</h3></div></div>' +
        '</div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="rsvpTable"><thead><tr><th>ID</th><th>Guest Name</th><th>Email</th><th>Event</th><th>Pass Type</th><th>Ticket No</th><th>RSVP Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>' +
        data.map(function(r) {
            return '<tr><td>'+r.id+'</td><td><strong>'+Helpers.escapeHtml(r.user_name)+'</strong></td><td>'+Helpers.escapeHtml(r.email)+'</td>' +
                '<td>'+Helpers.escapeHtml(r.event_title)+'</td>' +
                '<td><span class="badge badge-gold">'+Helpers.escapeHtml(r.pass_type)+'</span></td>' +
                '<td>'+(r.ticket_no?'<code>'+r.ticket_no+'</code>':'<span class="text-muted">Pending</span>')+'</td>' +
                '<td>'+Helpers.formatDate(r.rsvp_date)+'</td>' +
                '<td><span class="badge '+(statusClass[r.status]||'badge-info')+'">'+Helpers.capitalize(r.status)+'</span></td>' +
                '<td><div class="table-actions">' +
                (r.status==='pending'?
                    '<button class="action-btn view" onclick="App.approveRSVP(\''+r.id+'\')" title="Approve"><i class="bi bi-check-lg" style="color:var(--success)"></i></button>' +
                    '<button class="action-btn delete" onclick="App.declineRSVP(\''+r.id+'\')" title="Decline"><i class="bi bi-x-lg" style="color:var(--danger)"></i></button>'
                :
                    '<button class="action-btn view" onclick="App.viewRSVP(\''+r.id+'\')"><i class="bi bi-eye"></i></button>'
                ) +
                '</div></td></tr>';
        }).join('') + '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') $('#rsvpTable').DataTable({ pageLength: 10 });
};
App.approveRSVP=function(id){var r=MockData.eventRSVPs.find(function(x){return x.id===id;});if(!r)return;Helpers.confirm('Approve RSVP for '+r.user_name+'?','A ticket will be issued.','info').then(function(res){if(res.isConfirmed){r.status='approved';r.ticket_no=(r.ticket_no||r.pass_type.split(' ').map(function(w){return w.substring(0,3);}).join('-'))+'-'+String(MockData.eventRSVPs.indexOf(r)+1).padStart(3,'0');Helpers.toast('RSVP approved & ticket issued','success');App.navigate('event-rsvps');}});};
App.declineRSVP=function(id){var r=MockData.eventRSVPs.find(function(x){return x.id===id;});if(!r)return;Helpers.confirm('Decline RSVP for '+r.user_name+'?','','warning').then(function(res){if(res.isConfirmed){r.status='declined';Helpers.toast('RSVP declined','info');App.navigate('event-rsvps');}});};
App.viewRSVP=function(id){var r=MockData.eventRSVPs.find(function(x){return x.id===id;});if(!r)return;Helpers.openModal('<div class="modal-header"><h3 class="modal-title">RSVP Details</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div><div class="modal-body"><table class="table table-borderless"><tr><td class="text-muted">Guest</td><td><strong>'+Helpers.escapeHtml(r.user_name)+'</strong></td></tr><tr><td class="text-muted">Email</td><td>'+Helpers.escapeHtml(r.email)+'</td></tr><tr><td class="text-muted">Event</td><td>'+Helpers.escapeHtml(r.event_title)+'</td></tr><tr><td class="text-muted">Pass Type</td><td><span class="badge badge-gold">'+Helpers.escapeHtml(r.pass_type)+'</span></td></tr><tr><td class="text-muted">Ticket No</td><td>'+(r.ticket_no?'<code>'+r.ticket_no+'</code>':'Not issued')+'</td></tr><tr><td class="text-muted">Status</td><td><span class="badge '+(r.status==='approved'?'badge-success':r.status==='pending'?'badge-warning':'badge-danger')+'">'+Helpers.capitalize(r.status)+'</span></td></tr><tr><td class="text-muted">RSVP Date</td><td>'+Helpers.formatDate(r.rsvp_date)+'</td></tr></table></div><div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Close</button></div>');};
