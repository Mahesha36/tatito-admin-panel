'use strict';
/* TATITO FASHIONS — Events page */
App.pages.events = function() {
    var events = MockData.events || [
        { id: 'EVT1', title: 'Winter Wedding Expo 2024', date: '2024-12-15', city: 'Mumbai', attendees: 250, status: 'upcoming' },
        { id: 'EVT2', title: 'Fashion Week Showcase', date: '2024-11-20', city: 'Delhi', attendees: 500, status: 'confirmed' },
        { id: 'EVT3', title: 'Diwali Collection Launch', date: '2024-10-28', city: 'Pune', attendees: 180, status: 'completed' },
        { id: 'EVT4', title: 'Bridal Couture Night', date: '2025-01-10', city: 'Jaipur', attendees: 0, status: 'pending' },
        { id: 'EVT5', title: 'Summer Trend Showcase', date: '2025-02-15', city: 'Bangalore', attendees: 0, status: 'pending' },
    ];
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Events</h3><p class="text-muted">Fashion events and showcases</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-primary" onclick="App.addEvent()"><i class="bi bi-plus-lg"></i> Add Event</button></div></div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="eventsTable"><thead><tr><th>ID</th><th>Title</th><th>Date</th><th>City</th><th>Attendees</th><th>Status</th><th></th></tr></thead><tbody>' +
        events.map(function(e) {
            return '<tr><td>' + e.id + '</td><td><strong>' + e.title + '</strong></td><td>' + Helpers.formatDate(e.date) + '</td><td>' + e.city + '</td>' +
                '<td>' + (e.attendees || 0) + '</td>' +
                '<td><span class="badge ' + Helpers.statusBadge(e.status) + '">' + Helpers.capitalize(e.status) + '</span></td>' +
                '<td><button class="btn btn-sm btn-ghost" onclick="App.viewEvent(\'' + e.id + '\')"><i class="bi bi-eye"></i></button></td></tr>';
        }).join('') +
        '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') { $('#eventsTable').DataTable({ pageLength: 10, order: [[2, 'desc']] }); }
};
App.addEvent = function() {
    Helpers.openModal('<div class="modal-header"><h3>Add Event</h3><button class="btn-close" onclick="Helpers.closeModal()">\u00D7</button></div>' +
        '<div class="modal-body"><form><div class="form-group"><label>Title</label><input type="text" class="form-control" id="newEventTitle" required></div>' +
        '<div class="form-group"><label>Date</label><input type="date" class="form-control" id="newEventDate"></div>' +
        '<div class="form-group"><label>City</label><input type="text" class="form-control" id="newEventCity"></div>' +
        '</form></div><div class="modal-footer"><button class="btn btn-ghost" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveEvent()">Save</button></div>');
};
App.saveEvent = function() { Helpers.closeModal(); Helpers.toast('Event added (demo)', 'success'); };
App.viewEvent = function(id) { Helpers.toast('Event details (demo)', 'info'); };
