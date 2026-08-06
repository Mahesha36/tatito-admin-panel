'use strict';
/* TATITO FASHIONS — Reviews & Ratings page */
App.pages.reviews = function() {
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Reviews & Ratings</h3><p class="text-muted">Customer reviews across products</p></div></div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="reviewsTable"><thead><tr><th>ID</th><th>Product</th><th>Customer</th><th>Rating</th><th>Comment</th><th>Date</th><th></th></tr></thead><tbody>' +
        MockData.reviews.map(function(r) {
            return '<tr><td>' + r.id + '</td><td><strong>' + r.product + '</strong></td><td>' + r.customer + '</td>' +
                '<td>' + Helpers.stars(r.rating) + '</td><td style="max-width:300px">' + (r.comment || '') + '</td>' +
                '<td>' + Helpers.formatDate(r.date) + '</td>' +
                '<td><button class="btn btn-sm btn-ghost" onclick="App.viewReview(\'' + r.id + '\')"><i class="bi bi-eye"></i></button></td></tr>';
        }).join('') +
        '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') { $('#reviewsTable').DataTable({ pageLength: 10, order: [[5, 'desc']] }); }
};
App.viewReview = function(id) {
    var r = MockData.reviews.find(function(x) { return x.id == id; }); if (!r) return;
    Helpers.openModal('<div class="modal-header"><h3>Review Details</h3><button class="btn-close" onclick="Helpers.closeModal()">\u00D7</button></div>' +
        '<div class="modal-body"><table class="table table-borderless">' +
        '<tr><td class="text-muted">Product</td><td><strong>' + r.product + '</strong></td></tr>' +
        '<tr><td class="text-muted">Customer</td><td>' + r.customer + '</td></tr>' +
        '<tr><td class="text-muted">Rating</td><td>' + Helpers.stars(r.rating) + ' (' + r.rating + '/5)</td></tr>' +
        '<tr><td class="text-muted">Comment</td><td>' + (r.comment || '\u2014') + '</td></tr>' +
        '<tr><td class="text-muted">Date</td><td>' + Helpers.formatDate(r.date) + '</td></tr>' +
        '</table></div><div class="modal-footer"><button class="btn btn-ghost" onclick="Helpers.closeModal()">Close</button></div>');
};
