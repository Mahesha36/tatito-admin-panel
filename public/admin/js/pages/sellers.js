'use strict';
/* TATITO FASHIONS — Sellers page
   Member actions: View, Edit, Block, Login-as, Delete */

App.pages.sellers = function() {
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content">' +
        '<div class="page-toolbar"><div><h3>Sellers</h3><p class="text-muted">Multi-vendor marketplace sellers</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-primary" onclick="App.addSeller()"><i class="bi bi-person-plus"></i> Add Seller</button></div></div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="sellersTable"><thead><tr>' +
        '<th>ID</th><th>Business Name</th><th>Category</th><th>City</th><th>Products</th><th>Rating</th><th>Status</th><th></th>' +
        '</tr></thead><tbody>' +
        MockData.sellers.map(function(s) {
            var productCount = MockData.products.filter(function(p) { return p.seller === s.businessName; }).length;
            var badgeClass = s.status === 'blocked' ? 'badge-danger' : (s.status === 'pending' ? 'badge-warning' : 'badge-success');
            return '<tr><td>' + s.id + '</td><td><div class="cell-user"><div class="avatar" style="background:' + Helpers.avatarColor(s.id) + '">' + Helpers.initials(s.businessName) + '</div><strong>' + Helpers.escapeHtml(s.businessName) + '</strong></div></td><td>' + Helpers.escapeHtml(s.category || '\u2014') + '</td><td>' + Helpers.escapeHtml(s.city || '\u2014') + '</td>' +
                '<td>' + productCount + '</td>' +
                '<td>' + Helpers.stars(s.rating || 0) + '</td>' +
                '<td><span class="badge ' + badgeClass + '">' + Helpers.capitalize(s.status || 'active') + '</span></td>' +
                '<td>' + MemberActions.render('sellers', s) + '</td></tr>';
        }).join('') +
        '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') { $('#sellersTable').DataTable({ pageLength: 10 }); }
};

App.addSeller = function() {
    Helpers.openModal(
        '<div class="modal-header"><h3 class="modal-title"><i class="bi bi-person-plus" style="color:var(--gold)"></i> Add New Seller</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="addSellerForm">' +
        '<div class="form-group"><label>Business Name <span class="required">*</span></label><input type="text" class="form-control" id="newSellerName" required></div>' +
        '<div class="form-row"><div class="form-group"><label>Email</label><input type="email" class="form-control" id="newSellerEmail"></div>' +
        '<div class="form-group"><label>Phone</label><input type="tel" class="form-control" id="newSellerPhone"></div></div>' +
        '<div class="form-row"><div class="form-group"><label>City</label><input type="text" class="form-control" id="newSellerCity"></div>' +
        '<div class="form-group"><label>Category</label><input type="text" class="form-control" id="newSellerCategory"></div></div>' +
        '</form></div><div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button>' +
        '<button class="btn btn-primary" onclick="App.saveSeller()"><i class="bi bi-check-lg"></i> Save</button></div>'
    );
};

App.saveSeller = function() {
    var name = document.getElementById('newSellerName').value.trim();
    var email = document.getElementById('newSellerEmail').value.trim();
    var phone = document.getElementById('newSellerPhone').value.trim();
    var city = document.getElementById('newSellerCity').value.trim();
    var category = document.getElementById('newSellerCategory').value.trim();
    if (!name) { Helpers.toast('Business name is required', 'error'); return; }
    MockData.sellers.push({ id: 'SEL' + (MockData.sellers.length + 1), businessName: name, email: email, phone: phone, city: city, category: category, status: 'pending', rating: 0, totalSales: 0, commission: 10 });
    Helpers.closeModal(); Helpers.toast('Seller added successfully', 'success'); App.navigate('sellers');
};
