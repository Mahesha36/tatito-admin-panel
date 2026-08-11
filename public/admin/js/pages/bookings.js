'use strict';
/* TATITO FASHIONS — Booking Requests page */
App.pages.bookings = function() {
    var bookings = MockData.bookings || [
        { id: 'BK1', customer: 'Priya Sharma', type: 'Call Consultation', date: '2024-12-18', time: '3:00 PM', status: 'confirmed', translator: 'Yes (Hindi)' },
        { id: 'BK2', customer: 'Rahul Mehta', type: 'Boutique Visit', date: '2024-12-22', time: '11:00 AM', status: 'pending', translator: 'No' },
        { id: 'BK3', customer: 'Anita Desai', type: 'Designer Appointment', date: '2024-12-16', time: '5:00 PM', status: 'completed', translator: 'Yes (Marathi)' },
        { id: 'BK4', customer: 'Vikram Singh', type: 'Virtual Try-On Session', date: '2025-01-08', time: '2:00 PM', status: 'pending', translator: 'No' },
        { id: 'BK5', customer: 'Meena Iyer', type: 'Photography Booking', date: '2024-12-10', time: '9:00 AM', status: 'confirmed', translator: 'No' },
    ];
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Booking Requests</h3><p class="text-muted">Consultations, boutique visits, and appointments</p></div></div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="bookingsTable"><thead><tr><th>ID</th><th>Customer</th><th>Type</th><th>Date</th><th>Time</th><th>Translator</th><th>Status</th><th></th></tr></thead><tbody>' +
        bookings.map(function(b) {
            return '<tr><td>' + b.id + '</td><td>' + b.customer + '</td><td>' + b.type + '</td>' +
                '<td>' + Helpers.formatDate(b.date) + '</td><td>' + b.time + '</td>' +
                '<td>' + (b.translator || 'No') + '</td>' +
                '<td><span class="badge ' + Helpers.statusBadge(b.status) + '">' + Helpers.capitalize(b.status) + '</span></td>' +
                '<td><button class="btn btn-sm btn-ghost" onclick="App.viewBooking(\'' + b.id + '\')"><i class="bi bi-eye"></i></button></td></tr>';
        }).join('') +
        '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') { $('#bookingsTable').DataTable({ pageLength: 10 }); }
};
App.viewBooking = function(id) { Helpers.toast('Booking details (demo)', 'info'); };
