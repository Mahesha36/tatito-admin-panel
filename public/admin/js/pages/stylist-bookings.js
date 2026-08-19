'use strict';
/* MODULE 5: Stylist & Consultation Bookings */

App.pages['stylist-bookings'] = function() {
    var data = MockData.stylistBookings;
    var statusClass = { Confirmed: 'badge-success', Pending: 'badge-warning', Completed: 'badge-info', Cancelled: 'badge-danger' };
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Stylist Bookings</h3><p class="text-muted">Bridal consultations & grooming styling sessions</p></div></div>' +
        '<div class="stat-grid">' +
        '<div class="stat-card"><div class="stat-icon gold"><i class="bi bi-calendar2-check"></i></div><div class="stat-info"><p>Total Bookings</p><h3>'+data.length+'</h3></div></div>' +
        '<div class="stat-card"><div class="stat-icon green"><i class="bi bi-check2-circle"></i></div><div class="stat-info"><p>Confirmed</p><h3>'+data.filter(function(b){return b.status==='Confirmed';}).length+'</h3></div></div>' +
        '<div class="stat-card"><div class="stat-icon blue"><i class="bi bi-hourglass-split"></i></div><div class="stat-info"><p>Pending</p><h3>'+data.filter(function(b){return b.status==='Pending';}).length+'</h3></div></div>' +
        '<div class="stat-card"><div class="stat-icon purple"><i class="bi bi-trophy"></i></div><div class="stat-info"><p>Completed</p><h3>'+data.filter(function(b){return b.status==='Completed';}).length+'</h3></div></div>' +
        '</div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="sbTable"><thead><tr><th>ID</th><th>Customer</th><th>Service Type</th><th>Date</th><th>Time</th><th>Notes</th><th>Status</th><th>Actions</th></tr></thead><tbody>' +
        data.map(function(b) {
            return '<tr><td>'+b.id+'</td><td><strong>'+Helpers.escapeHtml(b.user_name)+'</strong></td>' +
                '<td><span class="badge badge-info">'+Helpers.escapeHtml(b.service_type)+'</span></td>' +
                '<td>'+Helpers.formatDate(b.booking_date)+'</td><td>'+Helpers.escapeHtml(b.time_slot)+'</td>' +
                '<td style="max-width:200px;overflow:hidden;text-overflow:ellipsis">'+Helpers.escapeHtml(b.notes)+'</td>' +
                '<td><span class="badge '+(statusClass[b.status]||'badge-info')+'">'+b.status+'</span></td>' +
                '<td><div class="table-actions">' +
                '<button class="action-btn view" onclick="App.viewStylistBooking(\''+b.id+'\')"><i class="bi bi-eye"></i></button>' +
                '<button class="action-btn edit" onclick="App.updateStylistStatus(\''+b.id+'\')"><i class="bi bi-arrow-clockwise"></i></button>' +
                '</div></td></tr>';
        }).join('') + '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') $('#sbTable').DataTable({ pageLength: 10 });
};
App.viewStylistBooking=function(id){var b=MockData.stylistBookings.find(function(x){return x.id===id;});if(!b)return;Helpers.openModal('<div class="modal-header"><h3 class="modal-title">Booking Details</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div><div class="modal-body"><table class="table table-borderless"><tr><td class="text-muted">Booking ID</td><td><strong>'+b.id+'</strong></td></tr><tr><td class="text-muted">Customer</td><td>'+Helpers.escapeHtml(b.user_name)+'</td></tr><tr><td class="text-muted">Service Type</td><td><span class="badge badge-info">'+Helpers.escapeHtml(b.service_type)+'</span></td></tr><tr><td class="text-muted">Date & Time</td><td>'+Helpers.formatDate(b.booking_date)+' at '+Helpers.escapeHtml(b.time_slot)+'</td></tr><tr><td class="text-muted">Status</td><td><span class="badge '+(b.status==='Confirmed'?'badge-success':b.status==='Pending'?'badge-warning':b.status==='Completed'?'badge-info':'badge-danger')+'">'+b.status+'</span></td></tr></table>'+(b.notes?'<div style="padding:12px;background:var(--border-light);border-radius:8px;margin-top:8px"><strong>Customer Notes:</strong><br>'+Helpers.escapeHtml(b.notes)+'</div>':'')+'</div><div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Close</button></div>');};
App.updateStylistStatus=function(id){var b=MockData.stylistBookings.find(function(x){return x.id===id;});if(!b)return;var statuses=['Pending','Confirmed','Completed','Cancelled'];var statusColors={'Pending':'badge-warning','Confirmed':'badge-success','Completed':'badge-info','Cancelled':'badge-danger'};Helpers.openModal('<div class="modal-header"><h3 class="modal-title">Update Status</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div><div class="modal-body"><p style="margin-bottom:12px">'+Helpers.escapeHtml(b.service_type)+' — <strong>'+Helpers.escapeHtml(b.user_name)+'</strong></p><div>'+statuses.map(function(s){return '<button class="btn '+(b.status===s?'btn-primary':'btn-outline')+'" style="margin:4px;width:calc(50% - 8px)" onclick="App._setStylistStatus(\''+id+'\',\''+s+'\')"><span class="badge '+(statusColors[s])+'" style="margin-right:6px">&nbsp;</span>'+s+'</button>';}).join('')+'</div></div>');};
App._setStylistStatus=function(id,status){var b=MockData.stylistBookings.find(function(x){return x.id===id;});if(!b)return;b.status=status;Helpers.closeModal();Helpers.toast('Status updated to: '+status,'success');App.navigate('stylist-bookings');};
