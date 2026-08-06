'use strict';
/* TATITO FASHIONS — Consultations page */
App.pages.consultations = function() {
    var consultations = MockData.consultations || [
        { id: 'CN1', customer: 'Priya Sharma', type: 'Call Consultation', language: 'Hindi', agent: 'Rajesh Kumar', date: '2024-12-18', time: '3:00 PM', status: 'confirmed', duration: '30 min' },
        { id: 'CN2', customer: 'Anita Desai', type: 'Video Call', language: 'Marathi', agent: 'Sunita Patil', date: '2024-12-16', time: '5:00 PM', status: 'completed', duration: '45 min' },
        { id: 'CN3', customer: 'Rahul Mehta', type: 'Chat Support', language: 'English', agent: 'Auto Bot', date: '2024-12-15', time: '2:00 PM', status: 'completed', duration: '15 min' },
        { id: 'CN4', customer: 'Vikram Singh', type: 'Call Consultation', language: 'Punjabi', agent: 'Harpreet Singh', date: '2025-01-08', time: '11:00 AM', status: 'pending', duration: '30 min' },
        { id: 'CN5', customer: 'Meena Iyer', type: 'Video Call', language: 'English', agent: 'Sarah Joseph', date: '2024-12-10', time: '4:00 PM', status: 'confirmed', duration: '30 min' },
    ];
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Consultations</h3><p class="text-muted">Call, video & chat consultations with translator support</p></div></div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="consultTable"><thead><tr><th>ID</th><th>Customer</th><th>Type</th><th>Language</th><th>Agent</th><th>Date</th><th>Duration</th><th>Status</th></tr></thead><tbody>' +
        consultations.map(function(c) {
            return '<tr><td>'+c.id+'</td><td>'+c.customer+'</td><td>'+c.type+'</td><td>'+c.language+'</td><td>'+c.agent+'</td>' +
                '<td>'+Helpers.formatDate(c.date)+'</td><td>'+c.duration+'</td>' +
                '<td><span class="badge '+Helpers.statusBadge(c.status)+'">'+Helpers.capitalize(c.status)+'</span></td></tr>';
        }).join('') +
        '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') { $('#consultTable').DataTable({ pageLength: 10 }); }
};
