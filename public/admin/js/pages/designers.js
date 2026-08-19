'use strict';
/* TATITO FASHIONS — Designers page
   Member actions: View, Edit, Block, Login-as, Delete */

App.pages.designers = function() {
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Designers</h3><p class="text-muted">Registered fashion designers</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-primary" onclick="App.addDesigner()"><i class="bi bi-person-plus"></i> Add Designer</button></div></div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="designersTable"><thead><tr><th>ID</th><th>Name</th><th>Specialty</th><th>City</th><th>Rating</th><th>Status</th><th></th></tr></thead><tbody>' +
        MockData.designers.map(function(d) {
            var badgeClass = d.status === 'blocked' ? 'badge-danger' : (d.status === 'pending' ? 'badge-warning' : 'badge-success');
            return '<tr><td>' + d.id + '</td><td><div class="cell-user"><div class="avatar" style="background:' + Helpers.avatarColor(d.id) + '">' + Helpers.initials(d.brand) + '</div><strong>' + Helpers.escapeHtml(d.brand) + '</strong></div></td><td>' + Helpers.escapeHtml(d.specialization || '\u2014') + '</td><td>' + Helpers.escapeHtml(d.city || '\u2014') + '</td>' +
                '<td>' + Helpers.stars(d.rating || 0) + '</td>' +
                '<td><span class="badge ' + badgeClass + '">' + Helpers.capitalize(d.status || 'active') + '</span></td>' +
                '<td>' + MemberActions.render('designers', d) + '</td></tr>';
        }).join('') +
        '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') { $('#designersTable').DataTable({ pageLength: 10 }); }
};

App.addDesigner = function() {
    Helpers.openModal('<div class="modal-header"><h3 class="modal-title"><i class="bi bi-person-plus" style="color:var(--gold)"></i> Add Designer</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="addDesignerForm"><div class="form-group"><label>Name <span class="required">*</span></label><input type="text" class="form-control" id="newDesignerName" required></div>' +
        '<div class="form-row"><div class="form-group"><label>Specialty</label><input type="text" class="form-control" id="newDesignerSpecialty"></div>' +
        '<div class="form-group"><label>City</label><input type="text" class="form-control" id="newDesignerCity"></div></div>' +
        '<div class="form-row"><div class="form-group"><label>Email</label><input type="email" class="form-control" id="newDesignerEmail"></div>' +
        '<div class="form-group"><label>Phone</label><input type="tel" class="form-control" id="newDesignerPhone"></div></div>' +
        '</form></div><div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveDesigner()"><i class="bi bi-check-lg"></i> Save</button></div>');
};

App.saveDesigner = function() {
    var name = (document.getElementById('newDesignerName') || {}).value || '';
    if (!name.trim()) { Helpers.toast('Name is required', 'error'); return; }
    MockData.designers.push({
        id: 'DSR' + (MockData.designers.length + 1),
        brand: name.trim(),
        specialization: (document.getElementById('newDesignerSpecialty') || {}).value || '',
        city: (document.getElementById('newDesignerCity') || {}).value || '',
        email: (document.getElementById('newDesignerEmail') || {}).value || '',
        phone: (document.getElementById('newDesignerPhone') || {}).value || '',
        rating: 0, status: 'pending'
    });
    Helpers.closeModal(); Helpers.toast('Designer added', 'success'); App.navigate('designers');
};
