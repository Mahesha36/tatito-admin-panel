'use strict';
/* TATITO FASHIONS — Users (Customers) page
   Member actions: View, Edit, Block, Login-as, Delete */

App.pages.users = function() {
    /* NEW: Merge admin users with real frontend-registered users */
    var adminUsers = MockData.users.slice();
    var frontendUsers = [];

    if (typeof Bridge !== 'undefined') {
        var fUser = Bridge.Frontend.getUser();
        if (fUser && fUser.email) {
            /* Check if this user is already in MockData (avoid duplicates) */
            var exists = adminUsers.some(function(u) {
                return u.email.toLowerCase() === fUser.email.toLowerCase();
            });
            if (!exists) {
                frontendUsers.push({
                    id: 'USR-FE',
                    name: fUser.name || 'Frontend User',
                    email: fUser.email,
                    phone: fUser.phone || '\u2014',
                    city: '\u2014',
                    status: 'active',
                    joined: fUser.createdAt || new Date().toISOString(),
                    orders: 0,
                    totalSpent: 0,
                    _source: 'frontend'
                });
            }
        }
    }

    var allUsers = frontendUsers.concat(adminUsers);
    App._allUsers = allUsers;

    document.getElementById('pageContent').innerHTML =
        '<div class="page-content">' +
        '<div class="page-toolbar"><div><h3>Customers</h3><p class="text-muted">Registered marketplace customers</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-primary" onclick="App.addUser()"><i class="bi bi-person-plus"></i> Add User</button></div></div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="usersTable"><thead><tr>' +
        '<th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>City</th><th>Status</th><th>Joined</th><th></th>' +
        '</tr></thead><tbody>' +
        allUsers.map(function(u) {
            return '<tr' + (u._source === 'frontend' ? ' style="background:rgba(63,138,91,0.03)"' : '') + '><td>' + u.id + (u._source === 'frontend' ? ' <span class="badge badge-success" style="font-size:9px;padding:2px 6px">WEB</span>' : '') + '</td><td><div class="cell-user"><div class="avatar" style="background:' + Helpers.avatarColor(u.id) + '">' + Helpers.initials(u.name) + '</div><strong>' + Helpers.escapeHtml(u.name) + '</strong></div></td><td>' + Helpers.escapeHtml(u.email) + '</td><td>' + Helpers.escapeHtml(u.phone || '\u2014') + '</td><td>' + Helpers.escapeHtml(u.city || '\u2014') + '</td>' +
                '<td><span class="badge ' + (u.status === 'blocked' ? 'badge-danger' : 'badge-success') + '">' + Helpers.capitalize(u.status || 'active') + '</span></td>' +
                '<td>' + Helpers.formatDate(u.joined) + '</td>' +
                '<td>' + MemberActions.render('users', u) + '</td></tr>';
        }).join('') +
        '</tbody></table></div></div></div>';

    if (typeof $ !== 'undefined') {
        $('#usersTable').DataTable({ pageLength: 10, order: [[6, 'desc']] });
    }
};

App.addUser = function() {
    Helpers.openModal(
        '<div class="modal-header"><h3 class="modal-title"><i class="bi bi-person-plus" style="color:var(--gold)"></i> Add New Customer</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="addUserForm">' +
        '<div class="form-group"><label>Name <span class="required">*</span></label><input type="text" class="form-control" id="newUserName" required></div>' +
        '<div class="form-group"><label>Email <span class="required">*</span></label><input type="email" class="form-control" id="newUserEmail" required></div>' +
        '<div class="form-row"><div class="form-group"><label>Phone</label><input type="tel" class="form-control" id="newUserPhone"></div>' +
        '<div class="form-group"><label>City</label><input type="text" class="form-control" id="newUserCity"></div></div>' +
        '</form></div><div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button>' +
        '<button class="btn btn-primary" onclick="App.saveUser()"><i class="bi bi-check-lg"></i> Save</button></div>'
    );
};

App.saveUser = function() {
    var name = document.getElementById('newUserName').value.trim();
    var email = document.getElementById('newUserEmail').value.trim();
    var phone = document.getElementById('newUserPhone').value.trim();
    var city = document.getElementById('newUserCity').value.trim();
    if (!name || !email) { Helpers.toast('Name and Email are required', 'error'); return; }
    MockData.users.push({ id: 'U' + (MockData.users.length + 1), name: name, email: email, phone: phone, city: city, status: 'active', joined: new Date().toISOString() });
    Helpers.closeModal();
    Helpers.toast('Customer added successfully', 'success');
    App.navigate('users');
};
