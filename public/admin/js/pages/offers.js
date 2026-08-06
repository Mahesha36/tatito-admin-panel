'use strict';
/* TATITO FASHIONS — Offers & Promotions page */
App.pages.offers = function() {
    var offers = MockData.offers || [
        { id: 'OFF1', title: 'Diwali Dhamaka - 40% Off', code: 'DIWALI40', discount: '40%', validTill: '2024-11-15', used: 156, status: 'expired' },
        { id: 'OFF2', title: 'Wedding Season Special', code: 'WEDDING25', discount: '25%', validTill: '2025-03-31', used: 42, status: 'active' },
        { id: 'OFF3', title: 'New User Welcome Bonus', code: 'WELCOME100', discount: '\u20B9100 Off', validTill: '2025-12-31', used: 389, status: 'active' },
        { id: 'OFF4', title: 'Designer Collection 15%', code: 'DESIGN15', discount: '15%', validTill: '2025-02-28', used: 23, status: 'active' },
        { id: 'OFF5', title: 'Republic Day Sale', code: 'RDAY50', discount: '\u20B950 Off', validTill: '2025-01-31', used: 0, status: 'pending' },
    ];
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Offers & Promotions</h3><p class="text-muted">Discount codes and promotions</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-primary" onclick="App.addOffer()"><i class="bi bi-plus-lg"></i> Add Offer</button></div></div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="offersTable"><thead><tr><th>ID</th><th>Title</th><th>Code</th><th>Discount</th><th>Valid Till</th><th>Used</th><th>Status</th><th></th></tr></thead><tbody>' +
        offers.map(function(o) {
            return '<tr><td>' + o.id + '</td><td><strong>' + o.title + '</strong></td>' +
                '<td><code>' + o.code + '</code></td><td>' + o.discount + '</td>' +
                '<td>' + Helpers.formatDate(o.validTill) + '</td><td>' + o.used + '</td>' +
                '<td><span class="badge ' + (o.status === 'active' ? 'badge-success' : o.status === 'expired' ? 'badge-danger' : 'badge-warning') + '">' + Helpers.capitalize(o.status) + '</span></td>' +
                '<td><button class="btn btn-sm btn-ghost" onclick="App.viewOffer(\'' + o.id + '\')"><i class="bi bi-eye"></i></button></td></tr>';
        }).join('') +
        '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') { $('#offersTable').DataTable({ pageLength: 10 }); }
};
App.addOffer = function() {
    Helpers.openModal('<div class="modal-header"><h3>Add Offer</h3><button class="btn-close" onclick="Helpers.closeModal()">\u00D7</button></div>' +
        '<div class="modal-body"><form><div class="form-group"><label>Title</label><input type="text" class="form-control" id="newOfferTitle" required></div>' +
        '<div class="form-group"><label>Code</label><input type="text" class="form-control" id="newOfferCode"></div>' +
        '<div class="form-group"><label>Discount</label><input type="text" class="form-control" id="newOfferDiscount"></div>' +
        '<div class="form-group"><label>Valid Till</label><input type="date" class="form-control" id="newOfferValid"></div>' +
        '</form></div><div class="modal-footer"><button class="btn btn-ghost" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveOffer()">Save</button></div>');
};
App.saveOffer = function() { Helpers.closeModal(); Helpers.toast('Offer added (demo)', 'success'); };
App.viewOffer = function(id) { Helpers.toast('Offer details (demo)', 'info'); };
