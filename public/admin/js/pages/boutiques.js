'use strict';
/* TATITO FASHIONS — Boutiques page */
App.pages.boutiques = function() {
    var boutiques = MockData.boutiques || [
        { id: 'BT1', name: 'Royal Threads Boutique', city: 'Mumbai', rating: 4.5, services: 'Bridal, Sarees, Lehengas', status: 'active' },
        { id: 'BT2', name: 'Elegance Couture', city: 'Delhi', rating: 4.8, services: 'Designer Wear, Gowns', status: 'active' },
        { id: 'BT3', name: 'Pearl Fashions', city: 'Pune', rating: 4.2, services: 'Ethnic, Western', status: 'active' },
        { id: 'BT4', name: 'Saffron Studio', city: 'Jaipur', rating: 4.6, services: 'Wedding, Festive', status: 'pending' },
        { id: 'BT5', name: 'Velvet Vogue', city: 'Bangalore', rating: 4.3, services: 'Party Wear, Casuals', status: 'active' },
    ];
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Boutiques</h3><p class="text-muted">Partner boutique studios</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-primary" onclick="App.addBoutique()"><i class="bi bi-plus-lg"></i> Add Boutique</button></div></div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="boutiquesTable"><thead><tr><th>ID</th><th>Name</th><th>City</th><th>Services</th><th>Rating</th><th>Status</th><th></th></tr></thead><tbody>' +
        boutiques.map(function(b) {
            return '<tr><td>' + b.id + '</td><td><strong>' + b.name + '</strong></td><td>' + b.city + '</td>' +
                '<td>' + (b.services || '\u2014') + '</td><td>' + Helpers.stars(b.rating || 0) + '</td>' +
                '<td><span class="badge ' + (b.status === 'active' ? 'badge-success' : 'badge-warning') + '">' + Helpers.capitalize(b.status) + '</span></td>' +
                '<td><button class="btn btn-sm btn-ghost" onclick="App.viewBoutique(\'' + b.id + '\')"><i class="bi bi-eye"></i></button></td></tr>';
        }).join('') +
        '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') { $('#boutiquesTable').DataTable({ pageLength: 10 }); }
};
App.addBoutique = function() {
    Helpers.openModal('<div class="modal-header"><h3>Add Boutique</h3><button class="btn-close" onclick="Helpers.closeModal()">\u00D7</button></div>' +
        '<div class="modal-body"><form><div class="form-group"><label>Name</label><input type="text" class="form-control" id="newBoutiqueName" required></div>' +
        '<div class="form-group"><label>City</label><input type="text" class="form-control" id="newBoutiqueCity"></div>' +
        '<div class="form-group"><label>Services</label><input type="text" class="form-control" id="newBoutiqueServices"></div>' +
        '</form></div><div class="modal-footer"><button class="btn" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveBoutique()">Save</button></div>');
};
App.saveBoutique = function() { Helpers.closeModal(); Helpers.toast('Boutique added (demo)', 'success'); };
