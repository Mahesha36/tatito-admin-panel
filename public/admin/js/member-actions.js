'use strict';
/* TATITO FASHIONS — Member Actions (shared dropdown for all member-type pages)
   Provides: View, Edit, Block/Unblock, Login-as, Delete
   Works with: Customers (users), Sellers, Designers, Staff
   Usage:  MemberActions.render('users', userObj)  → HTML string
           MemberActions.toggle(btnEl)              → open/close dropdown
           MemberActions.closeAll()                 → close all open dropdowns
*/

var MemberActions = {

    /* Generate the dropdown trigger button + menu HTML */
    render: function(entityType, item) {
        var id = item.id;
        var name = item.name || item.businessName || item.brand || item.email || id;
        var isBlocked = item.status === 'blocked' || item.status === 'inactive';
        var dataAttrs = 'data-entity="' + entityType + '" data-id="' + id + '" data-name="' + Helpers.escapeHtml(name) + '"';

        return '<div class="member-actions" ' + dataAttrs + '>' +
            '<button class="member-actions-btn" onclick="MemberActions.toggle(this)" title="Actions"><i class="bi bi-three-dots-vertical"></i></button>' +
            '<div class="member-dropdown">' +
                '<button class="member-dropdown-item view" onclick="MemberActions.doAction(\'view\', \'' + entityType + '\', \'' + id + '\')">' +
                    '<i class="bi bi-eye"></i> View</button>' +
                '<button class="member-dropdown-item edit" onclick="MemberActions.doAction(\'edit\', \'' + entityType + '\', \'' + id + '\')">' +
                    '<i class="bi bi-pencil"></i> Edit</button>' +
                (isBlocked
                    ? '<button class="member-dropdown-item unblock" onclick="MemberActions.doAction(\'unblock\', \'' + entityType + '\', \'' + id + '\')">' +
                      '<i class="bi bi-unlock"></i> Unblock</button>'
                    : '<button class="member-dropdown-item block" onclick="MemberActions.doAction(\'block\', \'' + entityType + '\', \'' + id + '\')">' +
                      '<i class="bi bi-slash-circle"></i> Block</button>'
                ) +
                '<button class="member-dropdown-item login" onclick="MemberActions.doAction(\'login\', \'' + entityType + '\', \'' + id + '\')">' +
                    '<i class="bi bi-box-arrow-in-right"></i> Log in as this member</button>' +
                '<div class="member-dropdown-divider"></div>' +
                '<button class="member-dropdown-item delete" onclick="MemberActions.doAction(\'delete\', \'' + entityType + '\', \'' + id + '\')">' +
                    '<i class="bi bi-trash"></i> Delete</button>' +
            '</div>' +
        '</div>';
    },

    /* Toggle a dropdown open/closed */
    _openDropdown: null,

    toggle: function(btn) {
        var dropdown = btn.nextElementSibling;
        var isOpen = dropdown.classList.contains('show');
        this.closeAll();
        if (!isOpen) {
            dropdown.classList.add('show');
            btn.classList.add('active');
            this._openDropdown = dropdown;
        }
    },

    closeAll: function() {
        document.querySelectorAll('.member-dropdown.show').forEach(function(d) { d.classList.remove('show'); });
        document.querySelectorAll('.member-actions-btn.active').forEach(function(b) { b.classList.remove('active'); });
        this._openDropdown = null;
    },

    /* Execute the chosen action */
    doAction: function(action, entityType, id) {
        this.closeAll();

        var collectionMap = {
            'users': MockData.users,
            'sellers': MockData.sellers,
            'designers': MockData.designers,
            'staff': MockData.staff,
        };
        var list = collectionMap[entityType];
        if (!list) { Helpers.toast('Unknown member type', 'error'); return; }
        var item = list.find(function(x) { return String(x.id) === String(id); });
        if (!item) { Helpers.toast('Member not found', 'error'); return; }

        var name = item.name || item.businessName || item.brand || item.email || id;
        var entityLabel = { users: 'Customer', sellers: 'Seller', designers: 'Designer', staff: 'Staff' }[entityType] || 'Member';

        switch (action) {
            case 'view':
                this.viewMember(entityType, item, entityLabel);
                break;
            case 'edit':
                this.editMember(entityType, item, entityLabel);
                break;
            case 'block':
                Helpers.confirm('Block ' + entityLabel + ': ' + name + '?', 'They will be unable to access the platform.', 'warning').then(function(r) {
                    if (r.isConfirmed) {
                        item.status = 'blocked';
                        Helpers.toast(entityLabel + ' blocked successfully', 'success');
                        App.navigate(App.currentPage);
                    }
                });
                break;
            case 'unblock':
                Helpers.confirm('Unblock ' + entityLabel + ': ' + name + '?', 'Their access will be restored.', 'info').then(function(r) {
                    if (r.isConfirmed) {
                        item.status = 'active';
                        Helpers.toast(entityLabel + ' unblocked successfully', 'success');
                        App.navigate(App.currentPage);
                    }
                });
                break;
            case 'login':
                this.loginAs(entityType, item, entityLabel);
                break;
            case 'delete':
                Helpers.confirm('Delete ' + entityLabel + ': ' + name + '?', 'This action cannot be undone. All associated data will be removed.', 'warning').then(function(r) {
                    if (r.isConfirmed) {
                        var idx = list.findIndex(function(x) { return String(x.id) === String(id); });
                        if (idx >= 0) list.splice(idx, 1);
                        Helpers.toast(entityLabel + ' deleted successfully', 'success');
                        App.navigate(App.currentPage);
                    }
                });
                break;
        }
    },

    /* View modal — works for all member types */
    viewMember: function(entityType, item, label) {
        var name = item.name || item.businessName || item.brand || item.email;
        var avatar = Helpers.initials(name);
        var color = Helpers.avatarColor(item.id);

        var fields = [];
        if (entityType === 'users') {
            fields = [
                ['Name', item.name], ['Email', item.email], ['Phone', item.phone || '\u2014'],
                ['City', item.city || '\u2014'], ['Status', this.statusHtml(item.status)],
                ['Referral Code', item.referralCode || '\u2014'], ['Joined', Helpers.formatDate(item.joined)],
            ];
        } else if (entityType === 'sellers') {
            var productCount = MockData.products.filter(function(p) { return p.seller === item.businessName; }).length;
            var orderCount = MockData.orders.filter(function(o) { return o.seller === item.businessName; }).length;
            var revenue = MockData.orders.filter(function(o) { return o.seller === item.businessName; }).reduce(function(a, o) { return a + (o.amount || 0); }, 0);
            fields = [
                ['Business', item.businessName], ['Email', item.email || '\u2014'], ['Phone', item.phone || '\u2014'],
                ['Category', item.category || '\u2014'], ['City', item.city], ['GSTIN', item.gstin || '\u2014'],
                ['Commission', (item.commission || 0) + '%'], ['Products', productCount], ['Orders', orderCount],
                ['Revenue', Helpers.formatCurrency(revenue)],
                ['Rating', Helpers.stars(item.rating || 0) + ' (' + (item.rating || 0) + '/5)'],
                ['Status', this.statusHtml(item.status)],
            ];
        } else if (entityType === 'designers') {
            fields = [
                ['Brand', item.brand], ['Specialty', item.specialization || '\u2014'],
                ['Email', item.email || '\u2014'], ['Phone', item.phone || '\u2014'],
                ['City', item.city || '\u2014'],
                ['Rating', Helpers.stars(item.rating || 0) + ' (' + (item.rating || 0) + '/5)'],
                ['Status', this.statusHtml(item.status)],
            ];
        } else if (entityType === 'staff') {
            fields = [
                ['Name', item.name], ['Role', '<span class="badge ' + (item.role === 'Super Admin' ? 'badge-gold' : 'badge-info') + '">' + Helpers.escapeHtml(item.role) + '</span>'],
                ['Email', item.email], ['Phone', item.phone || '\u2014'],
                ['Status', this.statusHtml(item.status)], ['Last Login', item.lastLogin ? Helpers.formatDateTime(item.lastLogin) : '\u2014'],
            ];
        }

        var fieldsHtml = fields.map(function(f) {
            return '<tr><td class="text-muted" style="width:40%">' + f[0] + '</td><td><strong>' + f[1] + '</strong></td></tr>';
        }).join('');

        Helpers.openModal(
            '<div class="modal-header"><h3 class="modal-title">' + label + ' Details</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
            '<div class="modal-body">' +
                '<div style="text-align:center;margin-bottom:20px">' +
                    '<div style="width:70px;height:70px;border-radius:50%;background:' + color + ';display:flex;align-items:center;justify-content:center;margin:0 auto 10px;font-size:1.6rem;font-weight:700;color:white">' + avatar + '</div>' +
                    '<h3 style="margin:0">' + Helpers.escapeHtml(name) + '</h3>' +
                    '<span class="badge ' + (item.status === 'active' || !item.status ? 'badge-success' : item.status === 'blocked' ? 'badge-danger' : 'badge-warning') + '">' + Helpers.capitalize(item.status || 'active') + '</span>' +
                '</div>' +
                '<table class="table table-borderless">' + fieldsHtml + '</table>' +
            '</div>' +
            '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Close</button>' +
            '<button class="btn btn-primary" onclick="Helpers.closeModal();MemberActions.editMember(\'' + entityType + '\',' + JSON.stringify(item).replace(/'/g, '&#39;') + ',\'' + label + '\')"><i class="bi bi-pencil"></i> Edit</button></div>',
            'modal-md'
        );
    },

    /* Edit modal — works for all member types */
    editMember: function(entityType, item, label) {
        var formId = 'editMemberForm';
        var name = item.name || item.businessName || item.brand || '';

        var fieldsHtml = '';
        if (entityType === 'users') {
            fieldsHtml =
                '<div class="form-row"><div class="form-group"><label>Full Name</label><input type="text" class="form-control" name="name" value="' + Helpers.escapeHtml(item.name || '') + '"></div>' +
                '<div class="form-group"><label>Email</label><input type="email" class="form-control" name="email" value="' + Helpers.escapeHtml(item.email || '') + '"></div></div>' +
                '<div class="form-row"><div class="form-group"><label>Phone</label><input type="tel" class="form-control" name="phone" value="' + Helpers.escapeHtml(item.phone || '') + '"></div>' +
                '<div class="form-group"><label>City</label><input type="text" class="form-control" name="city" value="' + Helpers.escapeHtml(item.city || '') + '"></div></div>' +
                '<div class="form-group"><label>Status</label><select class="form-control" name="status"><option value="active"' + (item.status === 'active' ? ' selected' : '') + '>Active</option><option value="blocked"' + (item.status === 'blocked' ? ' selected' : '') + '>Blocked</option></select></div>';
        } else if (entityType === 'sellers') {
            fieldsHtml =
                '<div class="form-group"><label>Business Name</label><input type="text" class="form-control" name="businessName" value="' + Helpers.escapeHtml(item.businessName || '') + '"></div>' +
                '<div class="form-row"><div class="form-group"><label>Email</label><input type="email" class="form-control" name="email" value="' + Helpers.escapeHtml(item.email || '') + '"></div>' +
                '<div class="form-group"><label>Phone</label><input type="tel" class="form-control" name="phone" value="' + Helpers.escapeHtml(item.phone || '') + '"></div></div>' +
                '<div class="form-row"><div class="form-group"><label>Category</label><input type="text" class="form-control" name="category" value="' + Helpers.escapeHtml(item.category || '') + '"></div>' +
                '<div class="form-group"><label>City</label><input type="text" class="form-control" name="city" value="' + Helpers.escapeHtml(item.city || '') + '"></div></div>' +
                '<div class="form-row"><div class="form-group"><label>Commission (%)</label><input type="number" class="form-control" name="commission" value="' + (item.commission || 10) + '"></div>' +
                '<div class="form-group"><label>Status</label><select class="form-control" name="status"><option value="active"' + (item.status === 'active' ? ' selected' : '') + '>Active</option><option value="blocked"' + (item.status === 'blocked' ? ' selected' : '') + '>Blocked</option><option value="pending"' + (item.status === 'pending' ? ' selected' : '') + '>Pending</option></select></div></div>';
        } else if (entityType === 'designers') {
            fieldsHtml =
                '<div class="form-group"><label>Brand Name</label><input type="text" class="form-control" name="brand" value="' + Helpers.escapeHtml(item.brand || '') + '"></div>' +
                '<div class="form-row"><div class="form-group"><label>Specialty</label><input type="text" class="form-control" name="specialization" value="' + Helpers.escapeHtml(item.specialization || '') + '"></div>' +
                '<div class="form-group"><label>City</label><input type="text" class="form-control" name="city" value="' + Helpers.escapeHtml(item.city || '') + '"></div></div>' +
                '<div class="form-row"><div class="form-group"><label>Email</label><input type="email" class="form-control" name="email" value="' + Helpers.escapeHtml(item.email || '') + '"></div>' +
                '<div class="form-group"><label>Phone</label><input type="tel" class="form-control" name="phone" value="' + Helpers.escapeHtml(item.phone || '') + '"></div></div>' +
                '<div class="form-group"><label>Status</label><select class="form-control" name="status"><option value="active"' + (item.status === 'active' ? ' selected' : '') + '>Active</option><option value="blocked"' + (item.status === 'blocked' ? ' selected' : '') + '>Blocked</option><option value="pending"' + (item.status === 'pending' ? ' selected' : '') + '>Pending</option></select></div>';
        } else if (entityType === 'staff') {
            var roles = MockData.roles || [];
            var roleOptions = roles.map(function(r) { return '<option value="' + r.name + '"' + (r.name === item.role ? ' selected' : '') + '>' + r.name + '</option>'; }).join('');
            fieldsHtml =
                '<div class="form-row"><div class="form-group"><label>First Name</label><input type="text" class="form-control" name="firstName" value="' + Helpers.escapeHtml(item.firstName || (item.name || '').split(' ')[0]) + '"></div>' +
                '<div class="form-group"><label>Last Name</label><input type="text" class="form-control" name="lastName" value="' + Helpers.escapeHtml(item.lastName || (item.name || '').split(' ').slice(1).join(' ')) + '"></div></div>' +
                '<div class="form-row"><div class="form-group"><label>Email</label><input type="email" class="form-control" name="email" value="' + Helpers.escapeHtml(item.email || '') + '"></div>' +
                '<div class="form-group"><label>Phone</label><input type="tel" class="form-control" name="phone" value="' + Helpers.escapeHtml(item.phone || '') + '"></div></div>' +
                '<div class="form-group"><label>Role</label><select class="form-control" name="role">' + roleOptions + '</select></div>' +
                '<div class="form-group"><label>Status</label><select class="form-control" name="status"><option value="active"' + (item.status === 'active' ? ' selected' : '') + '>Active</option><option value="blocked"' + (item.status === 'blocked' ? ' selected' : '') + '>Blocked</option></select></div>';
        }

        Helpers.openModal(
            '<div class="modal-header"><h3 class="modal-title"><i class="bi bi-person-gear" style="color:var(--gold)"></i> Edit ' + label + '</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
            '<div class="modal-body"><form id="' + formId + '">' + fieldsHtml + '</form></div>' +
            '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button>' +
            '<button class="btn btn-primary" onclick="MemberActions.saveEdit(\'' + entityType + '\',\'' + item.id + '\')"><i class="bi bi-check-lg"></i> Save Changes</button></div>'
        );
    },

    /* Save edited member data */
    saveEdit: function(entityType, id) {
        var form = document.getElementById('editMemberForm');
        if (!form) return;

        var list = { users: MockData.users, sellers: MockData.sellers, designers: MockData.designers, staff: MockData.staff }[entityType];
        var item = list.find(function(x) { return String(x.id) === String(id); });
        if (!item) { Helpers.toast('Member not found', 'error'); return; }

        var get = function(name) { var el = form.elements[name]; return el ? el.value.trim() : ''; };

        if (entityType === 'users') {
            item.name = get('name'); item.email = get('email'); item.phone = get('phone'); item.city = get('city'); item.status = get('status');
        } else if (entityType === 'sellers') {
            item.businessName = get('businessName'); item.email = get('email'); item.phone = get('phone');
            item.category = get('category'); item.city = get('city'); item.commission = parseInt(get('commission')) || 0; item.status = get('status');
        } else if (entityType === 'designers') {
            item.brand = get('brand'); item.specialization = get('specialization'); item.city = get('city');
            item.email = get('email'); item.phone = get('phone'); item.status = get('status');
        } else if (entityType === 'staff') {
            var fn = get('firstName'), ln = get('lastName');
            item.firstName = fn; item.lastName = ln; item.name = fn + ' ' + ln;
            item.email = get('email'); item.phone = get('phone'); item.role = get('role'); item.status = get('status');
        }

        Helpers.closeModal();
        Helpers.toast('Changes saved successfully', 'success');
        App.navigate(App.currentPage);
    },

    /* Login as member — stores a "login as" session and redirects */
    loginAs: function(entityType, item, label) {
        var name = item.name || item.businessName || item.brand || item.email;
        var roleMap = { users: 'customer', sellers: 'seller', designers: 'designer', staff: 'staff' };
        var role = roleMap[entityType] || 'member';
        var redirectMap = { customer: 'index.html', seller: 'seller.html', designer: 'seller.html', staff: 'app.html' };

        Helpers.confirm(
            'Log in as ' + label + ': ' + name + '?',
            'You will be redirected to their portal to see the platform from their perspective.',
            'info'
        ).then(function(r) {
            if (r.isConfirmed) {
                var session = { id: item.id, name: name, email: item.email || '', role: role, loginAs: true };
                localStorage.setItem('tatito_admin_session', JSON.stringify(session));
                sessionStorage.setItem('tatito_session', JSON.stringify(session));
                localStorage.setItem('tatito_login_as', JSON.stringify({ adminId: 'admin', targetId: item.id, targetRole: role, targetName: name, ts: Date.now() }));
                var dest = redirectMap[role] || 'index.html';
                Helpers.toast('Logging in as ' + name + '...', 'info');
                setTimeout(function() { window.location.href = dest; }, 600);
            }
        });
    },

    /* Helper: status badge HTML */
    statusHtml: function(status) {
        if (!status || status === 'active') return '<span class="badge badge-success">Active</span>';
        if (status === 'blocked') return '<span class="badge badge-danger">Blocked</span>';
        if (status === 'pending') return '<span class="badge badge-warning">Pending</span>';
        return '<span class="badge badge-info">' + Helpers.capitalize(status) + '</span>';
    },
};

/* Close dropdown when clicking outside */
document.addEventListener('click', function(e) {
    if (!e.target.closest('.member-actions')) {
        MemberActions.closeAll();
    }
}, true);
