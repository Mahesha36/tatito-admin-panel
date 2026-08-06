'use strict';
/* TATITO FASHIONS — Staff Management (Enhanced)
   Full CRUD: First/Last Name, Email, Phone, Password, Role dropdown
   Member actions dropdown: View, Edit, Block, Login-as, Delete
   Role sub-tab for managing roles */

App.pages.staff = function() {
    var staff = MockData.staff || [];
    App._staffTab = App._staffTab || 'all';

    function renderStaffTable() {
        return staff.map(function(s) {
            var avatarColor = Helpers.avatarColor(s.id);
            return '<tr>' +
                '<td><div class="cell-user"><div class="avatar" style="background:' + avatarColor + '">' + Helpers.initials(s.name) + '</div><div><div class="user-cell-name">' + Helpers.escapeHtml(s.name) + '</div><div class="user-cell-meta">' + s.id + '</div></div></div></td>' +
                '<td><span class="badge ' + (s.role === 'Super Admin' ? 'badge-gold' : 'badge-info') + '">' + Helpers.escapeHtml(s.role) + '</span></td>' +
                '<td>' + Helpers.escapeHtml(s.email) + '<br><small class="text-muted">' + Helpers.escapeHtml(s.phone || '') + '</small></td>' +
                '<td>' + (s.lastLogin ? Helpers.formatDateTime(s.lastLogin) : '\u2014') + '</td>' +
                '<td><span class="badge ' + (s.status === 'active' ? 'badge-success' : s.status === 'blocked' ? 'badge-danger' : 'badge-danger') + '">' + Helpers.capitalize(s.status) + '</span></td>' +
                '<td>' + MemberActions.render('staff', s) + '</td></tr>';
        }).join('');
    }

    function renderRolesTable() {
        var roles = MockData.roles || [];
        return roles.map(function(r) {
            return '<tr>' +
                '<td><strong>' + Helpers.escapeHtml(r.name) + '</strong>' + (r.isDefault ? ' <span class="badge badge-gold" style="font-size:0.65rem">Default</span>' : '') + '</td>' +
                '<td>' + Helpers.escapeHtml(r.description) + '</td>' +
                '<td><span class="badge badge-info">' + r.staffCount + '</span></td>' +
                '<td>' + (r.permissions === 'all' ? 'Full Access' : Helpers.capitalize(r.permissions)) + '</td>' +
                '<td><div class="table-actions">' +
                '<button class="action-btn view" onclick="App.selectRoleFromStaff(\'' + r.id + '\')" title="Manage Permissions"><i class="bi bi-shield-check"></i></button>' +
                '</div></td></tr>';
        }).join('');
    }

    document.getElementById('pageContent').innerHTML =
        '<div class="page-content">' +
        '<div class="page-toolbar"><div><h3>Staff Management</h3><p class="text-muted">Admin panel staff and roles</p></div>' +
        '<div class="toolbar-actions">' +
        (App._staffTab === 'all' ? '<button class="btn btn-primary" onclick="App.addStaff()"><i class="bi bi-person-plus"></i> Add Staff</button>' : '') +
        '</div></div>' +

        '<div class="tab-bar" style="margin-bottom:20px">' +
        '<button class="tab-btn ' + (App._staffTab === 'all' ? 'active' : '') + '" onclick="App.switchStaffTab(\'all\')"><i class="bi bi-people"></i> All Staff</button>' +
        '<button class="tab-btn ' + (App._staffTab === 'roles' ? 'active' : '') + '" onclick="App.switchStaffTab(\'roles\')"><i class="bi bi-shield-check"></i> Staff Roles</button>' +
        '</div>' +

        (App._staffTab === 'all' ?
            '<div class="card"><div class="card-body">' +
            '<table class="table table-hover" id="staffTable">' +
            '<thead><tr><th>Staff Member</th><th>Role</th><th>Email / Phone</th><th>Last Login</th><th>Status</th><th>Actions</th></tr></thead>' +
            '<tbody>' + renderStaffTable() + '</tbody></table>' +
            '</div></div>'
        :
            '<div class="card"><div class="card-body">' +
            '<table class="table table-hover" id="rolesTable">' +
            '<thead><tr><th>Role Name</th><th>Description</th><th>Staff Count</th><th>Permissions</th><th>Actions</th></tr></thead>' +
            '<tbody>' + renderRolesTable() + '</tbody></table>' +
            '</div></div>'
        ) +

        '</div>';

    if (typeof $ !== 'undefined') {
        var tblId = App._staffTab === 'all' ? 'staffTable' : 'rolesTable';
        try { $('#' + tblId).DataTable({ pageLength: 10, retrieve: true }); } catch (e) {}
    }
};

App.switchStaffTab = function(tab) {
    App._staffTab = tab;
    App.navigate('staff');
};

App.selectRoleFromStaff = function(roleId) {
    App._currentRole = roleId;
    App.navigate('roles');
};

App.addStaff = function() {
    var roles = MockData.roles || [];
    var roleOptions = roles.map(function(r) { return '<option value="' + r.name + '">' + r.name + '</option>'; }).join('');

    Helpers.openModal(
        '<div class="modal-header"><h3 class="modal-title"><i class="bi bi-person-plus" style="color:var(--gold)"></i> Staff Information</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="addStaffForm">' +
        '<div class="form-row">' +
        '<div class="form-group"><label>First Name <span class="required">*</span></label><input type="text" class="form-control" name="firstName" placeholder="First Name" required></div>' +
        '<div class="form-group"><label>Last Name <span class="required">*</span></label><input type="text" class="form-control" name="lastName" placeholder="Last Name" required></div>' +
        '</div>' +
        '<div class="form-row">' +
        '<div class="form-group"><label>Email <span class="required">*</span></label><input type="email" class="form-control" name="email" placeholder="Email" required></div>' +
        '<div class="form-group"><label>Phone</label><input type="tel" class="form-control" name="phone" placeholder="Phone"></div>' +
        '</div>' +
        '<div class="form-row">' +
        '<div class="form-group"><label>Password <span class="required">*</span></label><div style="position:relative"><input type="password" class="form-control" name="password" id="staffPassword" placeholder="Password" required>' +
        '<button type="button" onclick="App._togglePwd(\'staffPassword\', this)" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--gray-400);cursor:pointer"><i class="bi bi-eye"></i></button></div></div>' +
        '<div class="form-group"><label>Role <span class="required">*</span></label><select class="form-control" name="role">' + roleOptions + '</select></div>' +
        '</div>' +
        '</form></div>' +
        '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveStaff()"><i class="bi bi-check-lg"></i> Save</button></div>'
    );
};

App._togglePwd = function(inputId, btn) {
    var input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') { input.type = 'text'; btn.innerHTML = '<i class="bi bi-eye-slash"></i>'; }
    else { input.type = 'password'; btn.innerHTML = '<i class="bi bi-eye"></i>'; }
};

App.saveStaff = function() {
    var form = document.getElementById('addStaffForm');
    if (!form) return;
    var firstName = form.elements.firstName.value.trim();
    var lastName = form.elements.lastName.value.trim();
    var email = form.elements.email.value.trim();
    if (!firstName || !lastName) { Helpers.toast('First and Last Name are required', 'error'); return; }
    if (!email) { Helpers.toast('Email is required', 'error'); return; }

    var newId = 'STF' + String(MockData.staff.length + 1).padStart(3, '0');
    MockData.staff.push({
        id: newId,
        firstName: firstName, lastName: lastName, name: firstName + ' ' + lastName,
        email: email, phone: form.elements.phone.value,
        role: form.elements.role.value, status: 'active',
        lastLogin: null, permissions: 'custom',
    });

    var role = MockData.roles.find(function(r) { return r.name === form.elements.role.value; });
    if (role) role.staffCount++;

    Helpers.closeModal();
    Helpers.toast('Staff member added successfully', 'success');
    App.navigate('staff');
};
