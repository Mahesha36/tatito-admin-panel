'use strict';
/* TATITO FASHIONS — Offers & Promotions page
   NEW: Fixed saveOffer() (was a no-op stub) and added full CRUD.
   Offers now persist via Bridge and are visible to the frontend. */

App.pages.offers = function() {
    var offers = MockData.offers || [
        { id: 'OFF1', title: 'Diwali Dhamaka - 40% Off', code: 'DIWALI40', discount: '40%', validTill: '2024-11-15', used: 156, status: 'expired' },
        { id: 'OFF2', title: 'Wedding Season Special', code: 'WEDDING25', discount: '25%', validTill: '2025-03-31', used: 42, status: 'active' },
        { id: 'OFF3', title: 'New User Welcome Bonus', code: 'WELCOME100', discount: '\u20B9100 Off', validTill: '2025-12-31', used: 389, status: 'active' },
        { id: 'OFF4', title: 'Designer Collection 15%', code: 'DESIGN15', discount: '15%', validTill: '2025-02-28', used: 23, status: 'active' },
        { id: 'OFF5', title: 'Republic Day Sale', code: 'RDAY50', discount: '\u20B950 Off', validTill: '2025-01-31', used: 0, status: 'pending' },
    ];

    /* NEW: Ensure MockData.offers exists (first load) */
    if (!MockData.offers) MockData.offers = offers;

    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Offers & Promotions</h3><p class="text-muted">Discount codes and promotions</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-primary" onclick="App.addOffer()"><i class="bi bi-plus-lg"></i> Add Offer</button></div></div>' +
        '<div class="stat-grid">' +
        '<div class="stat-card"><div class="stat-icon gold"><i class="bi bi-tag"></i></div><div class="stat-info"><p>Total Offers</p><h3>' + MockData.offers.length + '</h3></div></div>' +
        '<div class="stat-card"><div class="stat-icon green"><i class="bi bi-check-circle"></i></div><div class="stat-info"><p>Active</p><h3>' + MockData.offers.filter(function(o){return o.status==='active';}).length + '</h3></div></div>' +
        '<div class="stat-card"><div class="stat-icon orange"><i class="bi bi-clock"></i></div><div class="stat-info"><p>Pending</p><h3>' + MockData.offers.filter(function(o){return o.status==='pending';}).length + '</h3></div></div>' +
        '<div class="stat-card"><div class="stat-icon blue"><i class="bi bi-x-circle"></i></div><div class="stat-info"><p>Expired</p><h3>' + MockData.offers.filter(function(o){return o.status==='expired';}).length + '</h3></div></div>' +
        '</div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="offersTable"><thead><tr><th>ID</th><th>Title</th><th>Code</th><th>Discount</th><th>Valid Till</th><th>Used</th><th>Status</th><th>Actions</th></tr></thead><tbody>' +
        MockData.offers.map(function(o) {
            return '<tr><td>' + o.id + '</td><td><strong>' + Helpers.escapeHtml(o.title) + '</strong></td>' +
                '<td><code>' + Helpers.escapeHtml(o.code) + '</code></td><td>' + Helpers.escapeHtml(o.discount) + '</td>' +
                '<td>' + Helpers.formatDate(o.validTill) + '</td><td>' + o.used + '</td>' +
                '<td><span class="badge ' + (o.status === 'active' ? 'badge-success' : o.status === 'expired' ? 'badge-danger' : 'badge-warning') + '">' + Helpers.capitalize(o.status) + '</span></td>' +
                '<td><div class="table-actions">' +
                '<button class="action-btn view" onclick="App.viewOffer(\'' + o.id + '\')" title="View"><i class="bi bi-eye"></i></button>' +
                '<button class="action-btn edit" onclick="App.editOffer(\'' + o.id + '\')" title="Edit"><i class="bi bi-pencil"></i></button>' +
                '<button class="action-btn delete" onclick="App.deleteOffer(\'' + o.id + '\')" title="Delete"><i class="bi bi-trash"></i></button>' +
                '</div></td></tr>';
        }).join('') +
        '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') { $('#offersTable').DataTable({ pageLength: 10 }); }
};

App.addOffer = function() {
    Helpers.openModal('<div class="modal-header"><h3>Add Offer</h3><button class="btn-close" onclick="Helpers.closeModal()">\u00D7</button></div>' +
        '<div class="modal-body"><form id="addOfferForm">' +
        '<div class="form-group"><label>Title <span class="required">*</span></label><input type="text" class="form-control" id="newOfferTitle" required></div>' +
        '<div class="form-group"><label>Code <span class="required">*</span></label><input type="text" class="form-control" id="newOfferCode" placeholder="e.g. SUMMER20"></div>' +
        '<div class="form-row"><div class="form-group"><label>Discount <span class="required">*</span></label><input type="text" class="form-control" id="newOfferDiscount" placeholder="e.g. 20% or \u20B9500"></div>' +
        '<div class="form-group"><label>Valid Till</label><input type="date" class="form-control" id="newOfferValid"></div></div>' +
        '<div class="form-group"><label>Status</label><select class="form-control" id="newOfferStatus"><option value="active">Active</option><option value="pending">Pending</option><option value="expired">Expired</option></select></div>' +
        '</form></div><div class="modal-footer"><button class="btn btn-ghost" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveOffer()"><i class="bi bi-check-lg"></i> Save</button></div>');
};

/* NEW: Fixed saveOffer() — was a no-op stub that just closed the modal.
   PREV: App.saveOffer = function() { Helpers.closeModal(); Helpers.toast('Offer added (demo)', 'success'); }; */
App.saveOffer = function() {
    var title = document.getElementById('newOfferTitle').value.trim();
    var code = document.getElementById('newOfferCode').value.trim();
    var discount = document.getElementById('newOfferDiscount').value.trim();
    var validTill = document.getElementById('newOfferValid').value || '';
    var status = document.getElementById('newOfferStatus').value;

    if (!title || !code || !discount) {
        Helpers.toast('Title, Code, and Discount are required', 'error');
        return;
    }

    var newId = 'OFF' + (MockData.offers.length + 1);
    var newOffer = {
        id: newId,
        title: title,
        code: code.toUpperCase(),
        discount: discount,
        validTill: validTill,
        used: 0,
        status: status
    };

    MockData.offers.push(newOffer);
    /* NEW: Persist to localStorage via Bridge (also makes it visible to frontend) */
    if (typeof Bridge !== 'undefined') { Bridge.Data.saveEntity('offers', MockData.offers); }

    Helpers.closeModal();
    Helpers.toast('Offer "' + code + '" created successfully', 'success');
    App.navigate('offers');
};

/* NEW: View offer details (was just a toast) */
/* PREV: App.viewOffer = function(id) { Helpers.toast('Offer details (demo)', 'info'); }; */
App.viewOffer = function(id) {
    var o = MockData.offers.find(function(x) { return x.id == id; });
    if (!o) return;
    Helpers.openModal(
        '<div class="modal-header"><h3>Offer Details</h3><button class="btn-close" onclick="Helpers.closeModal()">\u00D7</button></div>' +
        '<div class="modal-body"><table class="table table-borderless">' +
        '<tr><td class="text-muted">Title</td><td><strong>' + Helpers.escapeHtml(o.title) + '</strong></td></tr>' +
        '<tr><td class="text-muted">Code</td><td><code>' + Helpers.escapeHtml(o.code) + '</code></td></tr>' +
        '<tr><td class="text-muted">Discount</td><td>' + Helpers.escapeHtml(o.discount) + '</td></tr>' +
        '<tr><td class="text-muted">Valid Till</td><td>' + Helpers.formatDate(o.validTill) + '</td></tr>' +
        '<tr><td class="text-muted">Times Used</td><td>' + o.used + '</td></tr>' +
        '<tr><td class="text-muted">Status</td><td><span class="badge ' + (o.status === 'active' ? 'badge-success' : o.status === 'expired' ? 'badge-danger' : 'badge-warning') + '">' + Helpers.capitalize(o.status) + '</span></td></tr>' +
        '</table></div>' +
        '<div class="modal-footer"><button class="btn btn-ghost" onclick="Helpers.closeModal()">Close</button>' +
        '<button class="btn btn-primary" onclick="Helpers.closeModal();App.editOffer(\'' + o.id + '\')"><i class="bi bi-pencil"></i> Edit</button></div>'
    );
};

/* NEW: Edit offer */
App.editOffer = function(id) {
    var o = MockData.offers.find(function(x) { return x.id == id; });
    if (!o) return;
    Helpers.openModal(
        '<div class="modal-header"><h3>Edit Offer</h3><button class="btn-close" onclick="Helpers.closeModal()">\u00D7</button></div>' +
        '<div class="modal-body"><form id="editOfferForm">' +
        '<div class="form-group"><label>Title</label><input type="text" class="form-control" id="editOfferTitle" value="' + Helpers.escapeHtml(o.title) + '"></div>' +
        '<div class="form-group"><label>Code</label><input type="text" class="form-control" id="editOfferCode" value="' + Helpers.escapeHtml(o.code) + '"></div>' +
        '<div class="form-row"><div class="form-group"><label>Discount</label><input type="text" class="form-control" id="editOfferDiscount" value="' + Helpers.escapeHtml(o.discount) + '"></div>' +
        '<div class="form-group"><label>Valid Till</label><input type="date" class="form-control" id="editOfferValid" value="' + o.validTill + '"></div></div>' +
        '<div class="form-group"><label>Status</label><select class="form-control" id="editOfferStatus"><option value="active"' + (o.status === 'active' ? ' selected' : '') + '>Active</option><option value="pending"' + (o.status === 'pending' ? ' selected' : '') + '>Pending</option><option value="expired"' + (o.status === 'expired' ? ' selected' : '') + '>Expired</option></select></div>' +
        '</form></div><div class="modal-footer"><button class="btn btn-ghost" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveEditOffer(\'' + o.id + '\')"><i class="bi bi-check-lg"></i> Save Changes</button></div>'
    );
};

App.saveEditOffer = function(id) {
    var o = MockData.offers.find(function(x) { return x.id == id; });
    if (!o) return;
    o.title = document.getElementById('editOfferTitle').value.trim();
    o.code = document.getElementById('editOfferCode').value.trim().toUpperCase();
    o.discount = document.getElementById('editOfferDiscount').value.trim();
    o.validTill = document.getElementById('editOfferValid').value;
    o.status = document.getElementById('editOfferStatus').value;
    if (typeof Bridge !== 'undefined') { Bridge.Data.saveEntity('offers', MockData.offers); }
    Helpers.closeModal();
    Helpers.toast('Offer updated', 'success');
    App.navigate('offers');
};

/* NEW: Delete offer */
App.deleteOffer = function(id) {
    Helpers.confirm('Delete this offer?', 'This action cannot be undone.', 'warning').then(function(r) {
        if (r.isConfirmed) {
            MockData.offers = MockData.offers.filter(function(o) { return o.id != id; });
            if (typeof Bridge !== 'undefined') { Bridge.Data.saveEntity('offers', MockData.offers); }
            Helpers.toast('Offer deleted', 'success');
            App.navigate('offers');
        }
    });
};
