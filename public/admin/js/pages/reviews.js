'use strict';
/* TATITO FASHIONS — Reviews & Ratings page
   NEW: Now merges admin MockData reviews with real frontend reviews.
   Also supports approve / reject / delete actions. */

App.pages.reviews = function() {
    /* NEW: Merge admin reviews with real frontend customer reviews */
    var adminReviews = MockData.reviews.slice();
    var frontendReviews = [];

    if (typeof Bridge !== 'undefined') {
        var fReviews = Bridge.Frontend.getReviews();
        frontendReviews = fReviews.map(function(fr) {
            return {
                id: fr.id || 'RW-FE-' + Math.random().toString(36).substr(2, 5),
                product: fr.productName || fr.productId || 'Product',
                customer: fr.userName || fr.customer || (Bridge.Frontend.getUser() || {}).name || 'Customer',
                rating: fr.rating || 5,
                comment: fr.comment || fr.review || '',
                date: fr.createdAt || fr.date || new Date().toISOString().split('T')[0],
                status: fr.status || 'pending',
                _source: 'frontend'
            };
        });
    }

    var allReviews = frontendReviews.concat(adminReviews);

    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Reviews & Ratings</h3><p class="text-muted">Customer reviews across products</p></div></div>' +
        /* NEW: Info banner for frontend reviews */
        (frontendReviews.length > 0
            ? '<div style="background:var(--success-bg);border:1px solid var(--success);border-radius:var(--radius-md);padding:10px 16px;margin-bottom:16px;display:flex;align-items:center;gap:8px;">' +
              '<i class="bi bi-star-fill" style="color:var(--success)"></i>' +
              '<span style="font-size:13px;color:var(--text)"><strong>' + frontendReviews.length + '</strong> review(s) from the live storefront</span></div>'
            : '') +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="reviewsTable"><thead><tr><th>ID</th><th>Product</th><th>Customer</th><th>Rating</th><th>Comment</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>' +
        allReviews.map(function(r) {
            return '<tr' + (r._source === 'frontend' ? ' style="background:rgba(63,138,91,0.03)"' : '') + '>' +
                '<td>' + r.id + (r._source === 'frontend' ? ' <span class="badge badge-success" style="font-size:9px;padding:2px 6px">WEB</span>' : '') + '</td>' +
                '<td><strong>' + Helpers.escapeHtml(r.product) + '</strong></td><td>' + Helpers.escapeHtml(r.customer) + '</td>' +
                '<td>' + Helpers.stars(r.rating) + '</td><td style="max-width:300px">' + Helpers.escapeHtml(r.comment || '') + '</td>' +
                '<td>' + Helpers.formatDate(r.date) + '</td>' +
                '<td><span class="badge ' + (r.status === 'approved' ? 'badge-success' : r.status === 'rejected' ? 'badge-danger' : 'badge-warning') + '">' + Helpers.capitalize(r.status || 'pending') + '</span></td>' +
                '<td><div class="table-actions">' +
                '<button class="action-btn view" onclick="App.viewReview(\'' + r.id + '\')" title="View"><i class="bi bi-eye"></i></button>' +
                /* NEW: Approve / Reject / Delete buttons */
                '<button class="action-btn edit" onclick="App.approveReview(\'' + r.id + '\')" title="Approve"><i class="bi bi-check-circle"></i></button>' +
                '<button class="action-btn delete" onclick="App.deleteReview(\'' + r.id + '\')" title="Delete"><i class="bi bi-trash"></i></button>' +
                '</div></td></tr>';
        }).join('') +
        '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') { $('#reviewsTable').DataTable({ pageLength: 10, order: [[5, 'desc']] }); }

    App._allReviews = allReviews;
};

/* PREV: App.viewReview was read-only. NEW: Now shows status + approve/reject buttons */
App.viewReview = function(id) {
    var allReviews = App._allReviews || MockData.reviews;
    var r = allReviews.find(function(x) { return x.id == id; });
    if (!r) r = MockData.reviews.find(function(x) { return x.id == id; });
    if (!r) return;
    Helpers.openModal('<div class="modal-header"><h3>Review Details</h3><button class="btn-close" onclick="Helpers.closeModal()">\u00D7</button></div>' +
        '<div class="modal-body"><table class="table table-borderless">' +
        '<tr><td class="text-muted">Product</td><td><strong>' + Helpers.escapeHtml(r.product) + '</strong></td></tr>' +
        '<tr><td class="text-muted">Customer</td><td>' + Helpers.escapeHtml(r.customer) + '</td></tr>' +
        '<tr><td class="text-muted">Rating</td><td>' + Helpers.stars(r.rating) + ' (' + r.rating + '/5)</td></tr>' +
        '<tr><td class="text-muted">Comment</td><td>' + Helpers.escapeHtml(r.comment || '\u2014') + '</td></tr>' +
        '<tr><td class="text-muted">Date</td><td>' + Helpers.formatDate(r.date) + '</td></tr>' +
        '<tr><td class="text-muted">Status</td><td><span class="badge ' + (r.status === 'approved' ? 'badge-success' : r.status === 'rejected' ? 'badge-danger' : 'badge-warning') + '">' + Helpers.capitalize(r.status || 'pending') + '</span></td></tr>' +
        (r._source === 'frontend' ? '<tr><td class="text-muted">Source</td><td><span class="badge badge-success">Live Storefront</span></td></tr>' : '') +
        '</table></div>' +
        '<div class="modal-footer">' +
        '<button class="btn btn-ghost" onclick="Helpers.closeModal()">Close</button>' +
        '<button class="btn btn-success" onclick="App.approveReview(\'' + r.id + '\')"><i class="bi bi-check-circle"></i> Approve</button>' +
        '<button class="btn btn-danger" onclick="App.deleteReview(\'' + r.id + '\')"><i class="bi bi-trash"></i> Delete</button>' +
        '</div>');
};

/* NEW: Approve a review */
App.approveReview = function(id) {
    var allReviews = App._allReviews || MockData.reviews;
    var r = allReviews.find(function(x) { return x.id == id; });
    if (r) r.status = 'approved';
    var mockReview = MockData.reviews.find(function(x) { return x.id == id; });
    if (mockReview) mockReview.status = 'approved';
    if (typeof Bridge !== 'undefined') { Bridge.Data.saveEntity('reviews', MockData.reviews); }
    Helpers.closeModal();
    Helpers.toast('Review approved', 'success');
    App.navigate('reviews');
};

/* NEW: Delete a review */
App.deleteReview = function(id) {
    Helpers.confirm('Delete this review?', 'This action cannot be undone.', 'warning').then(function(res) {
        if (res.isConfirmed) {
            MockData.reviews = MockData.reviews.filter(function(r) { return r.id != id; });
            if (typeof Bridge !== 'undefined') { Bridge.Data.saveEntity('reviews', MockData.reviews); }
            Helpers.toast('Review deleted', 'success');
            App.navigate('reviews');
        }
    });
};
