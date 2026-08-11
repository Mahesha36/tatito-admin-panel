'use strict';
/* TATITO FASHIONS — Photography page */
App.pages.photography = function() {
    var bookings = MockData.photography || [
        { id: 'PH1', customer: 'Priya Sharma', type: 'Wedding Shoot', photographer: 'Studio Lens', date: '2024-12-20', status: 'confirmed', price: 50000 },
        { id: 'PH2', customer: 'Rahul Mehta', type: 'Pre-Wedding', photographer: 'Capture Moments', date: '2024-11-25', status: 'completed', price: 25000 },
        { id: 'PH3', customer: 'Anita Desai', type: 'Portfolio', photographer: 'Studio Lens', date: '2024-12-05', status: 'pending', price: 15000 },
        { id: 'PH4', customer: 'Vikram Singh', type: 'Event Coverage', photographer: 'Frame Perfect', date: '2025-01-15', status: 'pending', price: 35000 },
        { id: 'PH5', customer: 'Meena Iyer', type: 'Product Shoot', photographer: 'Capture Moments', date: '2024-12-10', status: 'confirmed', price: 10000 },
    ];
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Photography & Videography</h3><p class="text-muted">Studio bookings and assignments</p></div></div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="photoTable"><thead><tr><th>ID</th><th>Customer</th><th>Type</th><th>Photographer</th><th>Date</th><th>Price</th><th>Status</th><th></th></tr></thead><tbody>' +
        bookings.map(function(p) {
            return '<tr><td>' + p.id + '</td><td>' + p.customer + '</td><td>' + p.type + '</td><td>' + p.photographer + '</td>' +
                '<td>' + Helpers.formatDate(p.date) + '</td><td>' + Helpers.formatCurrency(p.price) + '</td>' +
                '<td><span class="badge ' + Helpers.statusBadge(p.status) + '">' + Helpers.capitalize(p.status) + '</span></td>' +
                '<td><button class="btn btn-sm btn-mock" onclick="App.viewPhotoBooking(\'' + p.id + '\')"><i class="bi bi-eye"></i></button></td></tr>';
        }).join('') +
        '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') { $('#photoTable').DataTable({ pageLength: 10 }); }
};
App.viewPhotoBooking = function(id) {
    var list = MockData.photography || [];
    var p = list.find(function(x){return x.id==id;});
    if(!p) { Helpers.toast('Booking not found', 'error'); return; }
    Helpers.openModal('<div class="modal-header"><h3>Booking ' + p.id + '</h3><button class="btn-close" onclick="Helpers.closeModal()">\u00D7</button></div>' +
        '<div class="modal-body"><table class="table table-borderless">' +
        '<tr><td class="text-muted">Customer</td><td><strong>'+p.customer+'</strong></td></tr>' +
        '<tr><td class="text-muted">Type</td><td>'+p.type+'</td></tr>' +
        '<tr><td class="text-muted">Photographer</td><td>'+p.photographer+'</td></tr>' +
        '<tr><td class="text-muted">Date</td><td>'+Helpers.formatDate(p.date)+'</td></tr>' +
        '<tr><td class="text-muted">Price</td><td>'+Helpers.formatCurrency(p.price)+'</td></tr>' +
        '<tr><td class="text-muted">Status</td><td><span class="badge '+Helpers.statusBadge(p.status)+'">'+Helpers.capitalize(p.status)+'</span></td></tr>' +
        '</table></div><div class="modal-footer"><button class="btn btn-ghost" onclick="Helpers.closeModal()">Close</button></div>');
};
