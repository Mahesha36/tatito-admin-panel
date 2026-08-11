'use strict';
/* TATITO FASHIONS — Notifications page */
App.pages.notifications = function() {
    var self = this;
    self._notifFilter = self._notifFilter || 'all';
    function render() {
        var list = self._notifFilter === 'all' ? MockData.notifications : MockData.notifications.filter(function(n) { return n.type === self._notifFilter; });
        var typeColors = { order: 'primary', system: 'info', payment: 'success', review: 'warning', user: 'primary' };
        var typeIcons = { order: 'bi-bag-check', system: 'bi-gear', payment: 'bi-credit-card', review: 'bi-star', user: 'bi-person' };
        var types = ['all', 'order', 'payment', 'system', 'review', 'user'];
        document.getElementById('pageContent').innerHTML =
            '<div class="page-content"><div class="page-toolbar"><div><h3>Notifications</h3><p class="text-muted">System and transaction notifications</p></div>' +
            '<div class="toolbar-actions"><button class="btn btn-ghost" onclick="App.markAllRead()"><i class="bi bi-check2-all"></i> Mark All Read</button></div></div>' +
            '<div class="filter-tabs" style="display:flex;gap:.5rem;margin-bottom:1rem;flex-wrap:wrap">' +
            types.map(function(t) { return '<button class="btn btn-sm ' + (self._notifFilter === t ? 'btn-primary' : 'btn-ghost') + '" onclick="App.filterNotifs(\'' + t + '\')" style="text-transform:capitalize">' + t + '</button>'; }).join('') +
            '</div>' +
            '<div class="notif-list">' +
            (list.length === 0 ? '<div class="empty-state"><i class="bi bi-bell-slash"></i><p>No notifications found.</p></div>' :
            list.map(function(n) {
                return '<div class="notif-item ' + (n.read ? 'read' : 'unread') + '" onclick="App.openNotif(\'' + n.id + '\')">' +
                    '<div class="notif-icon type-' + (typeColors[n.type] || 'info') + '"><i class="bi ' + (typeIcons[n.type] || 'bi-bell') + '"></i></div>' +
                    '<div class="notif-body"><div class="notif-header"><strong>' + n.title + '</strong>' + (!n.read ? '<span class="notif-dot"></span>' : '') + '</div>' +
                    '<p>' + n.message + '</p><small class="text-muted">' + Helpers.formatDateTime(n.date) + '</small></div>' +
                    (!n.read ? '<button class="btn btn-sm btn-ghost" onclick="event.stopPropagation();App.markNotifRead(\'' + n.id + '\')" title="Mark as read"><i class="bi bi-check2"></i></button>' : '') +
                    '</div>';
            }).join('')) +
            '</div></div>';
    }
    self._renderNotifs = render;
    render();
};
App.filterNotifs = function(type) { this._notifFilter = type; if (this._renderNotifs) this._renderNotifs(); };
App.openNotif = function(id) {
    var n = MockData.notifications.find(function(x) { return x.id == id; }); if (!n) return;
    n.read = true;
    Helpers.openModal('<div class="modal-header"><h3>' + n.title + '</h3><button class="btn-close" onclick="Helpers.closeModal()">\u00D7</button></div>' +
        '<div class="modal-body"><p>' + n.message + '</p><hr><small class="text-muted">' + Helpers.formatDateTime(n.date) + '</small></div>' +
        '<div class="modal-footer"><button class="btn btn-ghost" onclick="Helpers.closeModal()">Close</button></div>');
    if (this._renderNotifs) this._renderNotifs();
};
App.markNotifRead = function(id) {
    var n = MockData.notifications.find(function(x) { return x.id == id; }); if (n) n.read = true;
    if (this._renderNotifs) this._renderNotifs();
};
App.markAllRead = function() {
    MockData.notifications.forEach(function(n) { n.read = true; });
    Helpers.toast('All notifications marked as read', 'success');
    if (this._renderNotifs) this._renderNotifs();
};
