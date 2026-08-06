'use strict';
/* MODULE 4: Events & VIP Passbook — Event Calendar */

App.pages['events-vip'] = function() {
    var data = MockData.vipEvents;
    var catColors = { 'Runway Premiere':'badge-gold','Trunk Show':'badge-info','Jewellery Gala':'badge-primary','Atelier Salon':'badge-success' };
    document.getElementById('pageContent').innerHTML =
        '<div class="page-content"><div class="page-toolbar"><div><h3>Events & VIP Passbook</h3><p class="text-muted">Runway shows, trunk exhibitions & jewellery galas</p></div>' +
        '<div class="toolbar-actions"><button class="btn btn-primary" onclick="App.addVipEvent()"><i class="bi bi-plus-lg"></i> Add Event</button></div></div>' +
        '<div class="stat-grid">' +
        '<div class="stat-card"><div class="stat-icon gold"><i class="bi bi-calendar-event"></i></div><div class="stat-info"><p>Total Events</p><h3>'+data.length+'</h3></div></div>' +
        '<div class="stat-card"><div class="stat-icon green"><i class="bi bi-ticket-perforated"></i></div><div class="stat-info"><p>Total Seats</p><h3>'+data.reduce(function(a,e){return a+e.available_seats;},0)+'</h3></div></div>' +
        '<div class="stat-card"><div class="stat-icon blue"><i class="bi bi-cash-coin"></i></div><div class="stat-info"><p>Avg Price</p><h3>'+Helpers.formatCurrency(Math.round(data.reduce(function(a,e){return a+e.price;},0)/data.length))+'</h3></div></div>' +
        '</div>' +
        '<div class="card"><div class="card-body">' +
        '<table class="table table-hover" id="evtTable"><thead><tr><th>ID</th><th>Event</th><th>Category</th><th>Date</th><th>Time</th><th>Location</th><th>Host</th><th>Pass Type</th><th>Ticket Prefix</th><th>Price</th><th>Seats</th><th>Actions</th></tr></thead><tbody>' +
        data.map(function(e) {
            return '<tr><td>'+e.id+'</td><td><strong>'+Helpers.escapeHtml(e.title)+'</strong>'+(e.video_url?' <i class="bi bi-camera-video" style="color:var(--gold)" title="Has trailer"></i>':'')+'</td>' +
                '<td><span class="badge '+(catColors[e.category]||'badge-info')+'">'+e.category+'</span></td>' +
                '<td>'+Helpers.formatDate(e.event_date)+'</td><td>'+e.event_time+'</td><td>'+Helpers.escapeHtml(e.location)+'</td><td>'+Helpers.escapeHtml(e.host)+'</td>' +
                '<td><span class="badge badge-gold">'+Helpers.escapeHtml(e.pass_type)+'</span></td>' +
                '<td><code>'+e.ticket_prefix+'</code></td>' +
                '<td>'+Helpers.formatCurrency(e.price)+'</td>' +
                '<td>'+(e.available_seats>10?'<span class="text-success">'+e.available_seats+'</span>':'<span class="text-danger">'+e.available_seats+' left</span>')+'</td>' +
                '<td><div class="table-actions"><button class="action-btn view" onclick="App.viewVipEvent(\''+e.id+'\')"><i class="bi bi-eye"></i></button>' +
                '<button class="action-btn edit" onclick="App.editVipEvent(\''+e.id+'\')"><i class="bi bi-pencil"></i></button>' +
                '<button class="action-btn delete" onclick="App.deleteVipEvent(\''+e.id+'\')"><i class="bi bi-trash"></i></button></div></td></tr>';
        }).join('') + '</tbody></table></div></div></div>';
    if (typeof $ !== 'undefined') $('#evtTable').DataTable({ pageLength: 10 });
};

function _evtForm(e) {
    e=e||{};
    return '<div class="modal-header"><h3 class="modal-title">'+(e.id?'Edit':'Add')+' Event</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div>' +
        '<div class="modal-body"><form id="evtForm">' +
        '<div class="form-group"><label>Title *</label><input type="text" class="form-control" name="title" value="'+Helpers.escapeHtml(e.title||'')+'" required></div>' +
        '<div class="form-row"><div class="form-group"><label>Category</label><select class="form-control" name="category"><option '+(e.category==='Runway Premiere'?'selected':'')+'>Runway Premiere</option><option '+(e.category==='Trunk Show'?'selected':'')+'>Trunk Show</option><option '+(e.category==='Jewellery Gala'?'selected':'')+'>Jewellery Gala</option><option '+(e.category==='Atelier Salon'?'selected':'')+'>Atelier Salon</option></select></div>' +
        '<div class="form-group"><label>Host</label><input type="text" class="form-control" name="host" value="'+Helpers.escapeHtml(e.host||'')+'"></div></div>' +
        '<div class="form-row"><div class="form-group"><label>Date</label><input type="date" class="form-control" name="event_date" value="'+(e.event_date||'')+'"></div>' +
        '<div class="form-group"><label>Time</label><input type="time" class="form-control" name="event_time" value="'+(e.event_time||'')+'"></div></div>' +
        '<div class="form-group"><label>Location</label><input type="text" class="form-control" name="location" value="'+Helpers.escapeHtml(e.location||'')+'"></div>' +
        '<div class="form-row"><div class="form-group"><label>Pass Type</label><input type="text" class="form-control" name="pass_type" value="'+Helpers.escapeHtml(e.pass_type||'')+'" placeholder="FRONT ROW RUNWAY"></div>' +
        '<div class="form-group"><label>Ticket Prefix</label><input type="text" class="form-control" name="ticket_prefix" value="'+Helpers.escapeHtml(e.ticket_prefix||'')+'" placeholder="TT-VIP-XXXX"></div></div>' +
        '<div class="form-row"><div class="form-group"><label>Price (₹)</label><input type="number" class="form-control" name="price" value="'+(e.price||0)+'"></div>' +
        '<div class="form-group"><label>Available Seats</label><input type="number" class="form-control" name="available_seats" value="'+(e.available_seats||0)+'"></div></div>' +
        '<div class="form-group"><label>Video URL (Trailer)</label><input type="url" class="form-control" name="video_url" value="'+(e.video_url||'')+'"></div>' +
        '<div class="form-group"><label>Event Image</label><div class="upload-zone" onclick="this.querySelector(\'input\').click()"><i class="bi bi-cloud-arrow-up"></i><p>Upload event image</p><input type="file" accept="image/*" hidden></div></div>' +
        '</form></div><div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Cancel</button><button class="btn btn-primary" onclick="App.saveVipEvent(\''+(e.id||'')+'\')">Save</button></div>';
}
App.addVipEvent=function(){Helpers.openModal(_evtForm());};
App.editVipEvent=function(id){var e=MockData.vipEvents.find(function(x){return x.id===id;});if(!e)return;Helpers.openModal(_evtForm(e));};
App.saveVipEvent=function(id){var f=document.getElementById('evtForm');var fd=new FormData(f);if(!fd.get('title')){Helpers.toast('Title required','error');return;}var entry={title:fd.get('title'),category:fd.get('category'),event_date:fd.get('event_date'),event_time:fd.get('event_time'),location:fd.get('location'),host:fd.get('host'),pass_type:fd.get('pass_type'),ticket_prefix:fd.get('ticket_prefix'),price:parseInt(fd.get('price'))||0,available_seats:parseInt(fd.get('available_seats'))||0,video_url:fd.get('video_url')||'',image:'assets/logo.svg'};if(id){Object.assign(MockData.vipEvents.find(function(x){return x.id===id;}),entry);}else{entry.id='EVT'+String(MockData.vipEvents.length+1).padStart(3,'0');MockData.vipEvents.push(entry);}Helpers.closeModal();Helpers.toast('Saved','success');App.navigate('events-vip');};
App.viewVipEvent=function(id){var e=MockData.vipEvents.find(function(x){return x.id===id;});if(!e)return;Helpers.openModal('<div class="modal-header"><h3 class="modal-title">Event Details</h3><button class="modal-close" onclick="Helpers.closeModal()">&times;</button></div><div class="modal-body"><table class="table table-borderless"><tr><td class="text-muted">Title</td><td><strong>'+Helpers.escapeHtml(e.title)+'</strong></td></tr><tr><td class="text-muted">Category</td><td>'+e.category+'</td></tr><tr><td class="text-muted">Date & Time</td><td>'+Helpers.formatDate(e.event_date)+' at '+e.event_time+'</td></tr><tr><td class="text-muted">Location</td><td>'+Helpers.escapeHtml(e.location)+'</td></tr><tr><td class="text-muted">Host</td><td>'+Helpers.escapeHtml(e.host)+'</td></tr><tr><td class="text-muted">Pass Type</td><td><span class="badge badge-gold">'+Helpers.escapeHtml(e.pass_type)+'</span></td></tr><tr><td class="text-muted">Ticket Prefix</td><td><code>'+e.ticket_prefix+'</code></td></tr><tr><td class="text-muted">Price</td><td>'+Helpers.formatCurrency(e.price)+'</td></tr><tr><td class="text-muted">Available Seats</td><td>'+e.available_seats+'</td></tr></table>'+(e.video_url?'<a href="'+e.video_url+'" target="_blank" class="btn btn-outline"><i class="bi bi-camera-video"></i> Watch Trailer</a>':'')+'</div><div class="modal-footer"><button class="btn btn-outline" onclick="Helpers.closeModal()">Close</button></div>');};
App.deleteVipEvent=function(id){Helpers.confirm('Delete this event?','','warning').then(function(r){if(r.isConfirmed){MockData.vipEvents=MockData.vipEvents.filter(function(x){return x.id!==id;});Helpers.toast('Deleted','success');App.navigate('events-vip');}});};
