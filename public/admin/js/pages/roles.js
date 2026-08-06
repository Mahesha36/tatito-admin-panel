'use strict';
/* TATITO FASHIONS — Roles & Permissions Management
   Role management with granular toggle-based permissions across all modules */

App.pages.roles = function() {
    var roles = MockData.roles || [];
    var modules = MockData.permissionModules || [];
    App._currentRole = App._currentRole || (roles[0] ? roles[0].id : null);

    document.getElementById('pageContent').innerHTML =
        '<div class="page-content">' +
        '<div class="page-toolbar"><div><h3>Roles & Permissions</h3><p class="text-muted">Manage staff roles and access control</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-primary" onclick="App.addRole()"><i class="bi bi-shield-plus"></i> Add Role</button></div></div>' +

        '<div class="roles-layout" style="display:grid;grid-template-columns:240px 1fr;gap:20px">' +

        '<div class="roles-sidebar">' +
        '<div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--gray-400);margin-bottom:10px;padding:0 4px">Roles</div>' +
        roles.map(function(r) {
            return '<div class="role-item ' + (App._currentRole === r.id ? 'active' : '') + '" onclick="App.selectRole(\'' + r.id + '\')" style="padding:10px 14px;border-radius:8px;cursor:pointer;margin-bottom:4px;display:flex;align-items:center;justify-content:space-between;background:' + (App._currentRole === r.id ? 'var(--ivory)' : 'transparent') + ';border:1px solid ' + (App._currentRole === r.id ? 'var(--line)' : 'transparent') + '">' +
                '<div><div style="font-weight:600;font-size:0.85rem">' + Helpers.escapeHtml(r.name) + '</div><div style="font-size:0.72rem;color:var(--gray-500)">' + r.staffCount + ' staff</div></div>' +
                (r.isDefault ? '<span class="badge badge-gold" style="font-size:0.65rem">Default</span>' : '') +
                '</div>';
        }).join('') +
        '</div>' +

        '<div>' + renderRoleContent() + '</div>' +
        '</div></div>';
};

function renderRoleContent() {
    var role = MockData.roles.find(function(r) { return r.id === App._currentRole; });
    if (!role) return '<div class="empty-state"><p>No role selected.</p></div>';
    var modules = MockData.permissionModules || [];

    if (App._editingPermissions === App._currentRole) {
        var permState = App._permState || {};

        var modulesHtml = modules.map(function(mod) {
            var permsHtml = mod.permissions.map(function(perm) {
                var key = mod.module + '::' + perm;
                var on = permState[key] !== false;
                return '<div class="perm-toggle-item" style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:white;border:1px solid var(--line);border-radius:6px">' +
                    '<span style="font-size:0.8rem">' + perm + '</span>' +
                    '<button class="toggle-switch ' + (on ? 'on' : '') + '" onclick="App.togglePermission(\'' + mod.module + '\', \'' + perm.replace(/'/g, "\\'") + '\')"><span class="toggle-knob"></span></button>' +
                    '</div>';
            }).join('');

            return '<div class="perm-module" style="margin-bottom:16px">' +
                '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;padding:8px 12px;background:var(--ivory);border-radius:8px;cursor:pointer" onclick="App._togglePermModule(this)">' +
                '<i class="bi ' + mod.icon + '" style="color:var(--gold)"></i>' +
                '<strong style="font-size:0.85rem">' + mod.module + '</strong>' +
                '<i class="bi bi-chevron-down perm-chevron" style="margin-left:auto;color:var(--gray-400)"></i>' +
                '</div>' +
                '<div class="perm-content" style="display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:0 4px">' +
                permsHtml +
                '</div>' +
                '</div>';
        }).join('');

        return '<div class="card">' +
            '<div class="card-header" style="display:flex;justify-content:space-between;align-items:center">' +
            '<h3 style="font-size:0.95rem"><i class="bi bi-shield-lock" style="color:var(--gold)"></i> Role Information</h3>' +
            '<div style="display:flex;gap:8px">' +
            '<button class="btn btn-outline btn-sm" onclick="App.cancelEditPermissions()">Cancel</button>' +
            '<button class="btn btn-primary btn-sm" onclick="App.savePermissions()"><i class="bi bi-check-lg"></i> Save</button>' +
            '</div></div>' +
            '<div class="card-body">' +
            '<div class="form-group" style="max-width:300px;margin-bottom:20px"><label>Role Name</label><input type="text" class="form-control" id="roleNameInput" value="' + Helpers.escapeHtml(role.name) + '"></div>' +

            '<div class="perm-toolbar" style="display:flex;gap:8px;margin-bottom:16px">' +
            '<button class="btn btn-outline btn-sm" onclick="App.selectAllPerms(true)"><i class="bi bi-check2-all"></i> Enable All</button>' +
            '<button class="btn btn-outline btn-sm" onclick="App.selectAllPerms(false)"><i class="bi bi-x-circle"></i> Disable All</button>' +
            '<button class="btn btn-outline btn-sm" onclick="App._expandAllPermModules(true)">Expand All</button>' +
            '<button class="btn btn-outline btn-sm" onclick="App._expandAllPermModules(false)">Collapse All</button>' +
            '</div>' +

            modulesHtml +
            '</div></div>';
    }

    return '<div class="card">' +
        '<div class="card-header" style="display:flex;justify-content:space-between;align-items:center">' +
        '<div><h3 style="font-size:0.95rem"><i class="bi bi-shield-check" style="color:var(--gold)"></i> ' + Helpers.escapeHtml(role.name) + '</h3><p class="text-muted" style="font-size:0.78rem">' + Helpers.escapeHtml(role.description) + '</p></div>' +
        '<div style="display:flex;gap:8px">' +
        '<button class="btn btn-primary btn-sm" onclick="App.editRolePermissions()"><i class="bi bi-pencil"></i> Edit Permissions</button>' +
        (!role.isDefault ? '<button class="btn btn-outline btn-sm" onclick="App.deleteRole(\'' + role.id + '\')"><i class="bi bi-trash"></i> Delete</button>' : '') +
        '</div></div>' +
        '<div class="card-body">' +
        '<div class="info-grid" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:20px">' +
        '<div class="info-box"><span class="info-label">Staff Count</span><span class="info-value">' + role.staffCount + '</span></div>' +
        '<div class="info-box"><span class="info-label">Permission Scope</span><span class="info-value">' + (role.permissions === 'all' ? 'Full Access' : role.permissions) + '</span></div>' +
        '<div class="info-box"><span class="info-label">Type</span><span class="info-value">' + (role.isDefault ? 'System Default' : 'Custom Role') + '</span></div>' +
        '</div>' +
        '<h4 style="font-size:0.82rem;font-weight:700;margin-bottom:10px">Permission Modules</h4>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">' +
        modules.map(function(mod) {
            var enabledCount = mod.permissions.length;
            return '<div class="perm-summary-item" style="padding:10px 14px;background:var(--ivory);border-radius:8px;border:1px solid var(--line)">' +
                '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px"><i class="bi ' + mod.icon + '" style="color:var(--gold);font-size:0.85rem"></i><strong style="font-size:0.8rem">' + mod.module + '</strong></div>' +
                '<div style="font-size:0.72rem;color:var(--gray-500)">' + enabledCount + ' permission' + (enabledCount > 1 ? 's' : '') + '</div>' +
                '</div>';
        }).join('') +
        '</div></div></div>';
}

App.selectRole = function(roleId) {
    App._currentRole = roleId;
    App._editingPermissions = null;
    App.navigate('roles');
};

App.editRolePermissions = function() {
    var role = MockData.roles.find(function(r) { return r.id === App._currentRole; });
    if (!role) return;
    var modules = MockData.permissionModules || [];

    App._permState = {};
    var isFullAccess = role.permissions === 'all';

    modules.forEach(function(mod) {
        mod.permissions.forEach(function(perm) {
            var key = mod.module + '::' + perm;
            if (isFullAccess) {
                App._permState[key] = true;
            } else if (role.permissions === 'manager') {
                App._permState[key] = (mod.module !== 'System' && mod.module !== 'Staff');
            } else if (role.permissions === 'orders') {
                App._permState[key] = (mod.module === 'Orders' || mod.module === 'Payments' || mod.module === 'Dashboard');
            } else if (role.permissions === 'support') {
                App._permState[key] = (mod.module === 'Support Tickets' || mod.module === 'Contact Queries' || mod.module === 'Dashboard');
            } else if (role.permissions === 'content') {
                App._permState[key] = (mod.module === 'CMS Pages' || mod.module === 'Media Manager' || mod.module === 'Dashboard');
            } else {
                App._permState[key] = false;
            }
        });
    });

    App._editingPermissions = App._currentRole;
    App.navigate('roles');
};

App.togglePermission = function(mod, perm) {
    var key = mod + '::' + perm;
    if (!App._permState) App._permState = {};
    App._permState[key] = !App._permState[key];
    App.navigate('roles');
};

App.selectAllPerms = function(on) {
    var modules = MockData.permissionModules || [];
    modules.forEach(function(mod) {
        mod.permissions.forEach(function(perm) {
            App._permState[mod.module + '::' + perm] = on;
        });
    });
    App.navigate('roles');
};

App._togglePermModule = function(header) {
    var content = header.nextElementSibling;
    if (!content) return;
    var chevron = header.querySelector('.perm-chevron');
    if (content.style.display === 'none') {
        content.style.display = 'grid';
        if (chevron) { chevron.classList.remove('bi-chevron-right'); chevron.classList.add('bi-chevron-down'); }
    } else {
        content.style.display = 'none';
        if (chevron) { chevron.classList.remove('bi-chevron-down'); chevron.classList.add('bi-chevron-right'); }
    }
};

App._expandAllPermModules = function(expand) {
    document.querySelectorAll('.perm-module .perm-content').forEach(function(el) {
        el.style.display = expand ? 'grid' : 'none';
    });
    document.querySelectorAll('.perm-chevron').forEach(function(c) {
        c.classList.remove(expand ? 'bi-chevron-right' : 'bi-chevron-down');
        c.classList.add(expand ? 'bi-chevron-down' : 'bi-chevron-right');
    });
};

App.cancelEditPermissions = function() {
    App._editingPermissions = null;
    App.navigate('roles');
};

App.savePermissions = function() {
    var role = MockData.roles.find(function(r) { return r.id === App._currentRole; });
    if (!role) return;
    var nameInput = document.getElementById('roleNameInput');
    if (nameInput && nameInput.value.trim()) role.name = nameInput.value.trim();
    role._savedPermissions = Object.assign({}, App._permState);
    App._editingPermissions = null;
    Helpers.toast('Permissions saved for ' + role.name, 'success');
    App.navigate('roles');
};

App.addRole = function() {
    Helpers.openModal(
        '<div class="modal-header"><h3 class="modal-title">Add New Role</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="addRoleForm">' +
        '<div class="form-group"><label>Role Name <span class="required">*</span></label><input type="text" class="form-control" name="name" placeholder="e.g. Sales Executive" required></div>' +
        '<div class="form-group"><label>Description</label><textarea class="form-control" rows="2" name="desc" placeholder="What can this role do?"></textarea></div>' +
        '<div class="form-group"><label>Base Permission Template</label><select class="form-control" name="template">' +
        '<option value="custom">Custom (no permissions)</option>' +
        '<option value="all">Full Access (like Super Admin)</option>' +
        '<option value="manager">Manager (all except System & Staff)</option>' +
        '<option value="orders">Order Manager (Orders & Payments)</option>' +
        '<option value="support">Support (Tickets & Queries)</option>' +
        '<option value="content">Content (CMS & Media)</option>' +
        '</select></div>' +
        '</form></div>' +
        '<div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveNewRole()"><i class="bi bi-check-lg"></i> Create Role</button></div>'
    );
};

App.saveNewRole = function() {
    var form = document.getElementById('addRoleForm');
    if (!form) return;
    var name = form.elements.name.value.trim();
    if (!name) { Helpers.toast('Role name is required', 'error'); return; }

    var newId = 'ROLE' + String(MockData.roles.length + 1).padStart(3, '0');
    MockData.roles.push({
        id: newId, name: name,
        description: form.elements.desc.value || 'Custom role',
        permissions: form.elements.template.value,
        staffCount: 0, isDefault: false,
    });

    Helpers.closeModal();
    Helpers.toast('Role created. Edit permissions to configure access.', 'success');
    App._currentRole = newId;
    App.navigate('roles');
};

App.deleteRole = function(id) {
    var role = MockData.roles.find(function(r) { return r.id === id; });
    if (!role || role.isDefault) return;
    Helpers.confirm('Delete role "' + role.name + '"?', 'Staff members with this role will need to be reassigned.', 'warning').then(function(r) {
        if (r.isConfirmed) {
            MockData.roles = MockData.roles.filter(function(r) { return r.id !== id; });
            if (App._currentRole === id) App._currentRole = MockData.roles[0] ? MockData.roles[0].id : null;
            Helpers.toast('Role deleted', 'success');
            App.navigate('roles');
        }
    });
};
