#!/usr/bin/env python3
"""Module content definitions — part 2: Services, Marketing, Support, Staff, Website."""
from gen_modules_part1 import (stat, toolbar, table, acts, uc, BADGE,
                               BTN_ADD, BTN_EXPORT, BTN_SAVE)

# ---------- BOUTIQUES ----------
def boutiques():
    rows = []
    data = [
        ('TBT-01', 'Tatito Flagship — Bandra', 'Mumbai', '10 AM – 9 PM', 'active'),
        ('TBT-02', 'Meera Silks Studio', 'Bengaluru', '10:30 AM – 8:30 PM', 'active'),
        ('TBT-03', 'Aarav Collective', 'Delhi', '11 AM – 9 PM', 'inactive'),
    ]
    for bid, name, city, hours, st in data:
        badge = BADGE['active'] if st == 'active' else BADGE['inactive']
        rows.append(f'<td><strong>{bid}</strong></td><td>{name}</td><td>{city}</td><td>{hours}</td><td>{badge}</td><td>{acts()}</td>')
    return toolbar('Boutiques', 'Physical boutique locations.', BTN_ADD) + table(
    ['ID', 'Boutique', 'City', 'Hours', 'Status', 'Actions'], rows)

# ---------- CUSTOMIZATIONS ----------
def customizations():
    rows = []
    data = [
        ('CZ-771', 'Priya Sharma', 'Blouse Stitching', 'Measurements submitted', 'in_progress'),
        ('CZ-770', 'Ananya Iyer', 'Lehenga Alteration', 'At studio', 'in_progress'),
        ('CZ-769', 'Neha Kulkarni', 'Gown Customisation', 'Quote sent', 'quoted'),
        ('CZ-768', 'Kavya Reddy', 'Sherwani Fitting', 'Awaiting customer', 'pending'),
        ('CZ-767', 'Ritu Deshpande', 'Saree Fall & Pico', 'Completed', 'completed'),
    ]
    for cid, cust, job, note, st in data:
        badge = {'pending': BADGE['pending'], 'quoted': BADGE['gold'].format('Quoted'),
                 'in_progress': BADGE['processing'], 'completed': BADGE['success'].format('Completed')}[st]
        rows.append(f'<td><strong>{cid}</strong></td><td>{cust}</td><td>{job}</td><td class="text-muted">{note}</td><td>{badge}</td><td>{acts(edit=False)}</td>')
    return toolbar('Customizations', 'Garment customisation jobs.') + table(
    ['Job ID', 'Customer', 'Service', 'Stage', 'Status', 'Actions'], rows)

# ---------- QUOTATIONS ----------
def quotations():
    rows = []
    data = [
        ('QT-3341', 'Ananya Iyer', 'Bridal Lehenga — bespoke', '₹45,000 – ₹62,000', 'sent', '16 Aug 2026'),
        ('QT-3340', 'Kavya Reddy', 'Groom Sherwani set', '₹28,000 – ₹35,000', 'accepted', '14 Aug 2026'),
        ('QT-3339', 'Neha Kulkarni', 'Gown re-design', '₹8,500', 'draft', '13 Aug 2026'),
    ]
    for qid, cust, job, price, st, date in data:
        badge = {'sent': BADGE['info'].format('Sent'), 'accepted': BADGE['success'].format('Accepted'), 'draft': BADGE['pending'].format('Draft')}[st]
        rows.append(f'<td><strong>{qid}</strong></td><td>{cust}</td><td>{job}</td><td>{price}</td><td>{badge}</td><td>{date}</td><td>{acts()}</td>')
    return toolbar('Quotations', 'Custom job price quotations.', BTN_ADD) + table(
    ['Quote ID', 'Customer', 'Job', 'Quoted Range', 'Status', 'Date', 'Actions'], rows)

# ---------- CONSULTATIONS ----------
def consultations():
    rows = []
    data = [
        ('CN-556', 'Priya Sharma', 'Stylist — Video Call', '20 Aug 2026 · 11:00 AM', 'confirmed', '₹500'),
        ('CN-555', 'Ananya Iyer', 'Bridal — In Studio', '21 Aug 2026 · 3:00 PM', 'confirmed', '₹1,000'),
        ('CN-554', 'Kavya Reddy', 'Wardrobe Review', '24 Aug 2026 · 5:30 PM', 'pending', '₹500'),
    ]
    for cid, cust, typ, when, st, fee in data:
        badge = BADGE['success'].format('Confirmed') if st == 'confirmed' else BADGE['pending']
        rows.append(f'<td><strong>{cid}</strong></td><td>{cust}</td><td>{typ}</td><td>{when}</td><td>{fee}</td><td>{badge}</td><td>{acts(edit=False)}</td>')
    return toolbar('Consultations', 'Styling and bridal consultations.', BTN_ADD) + table(
    ['ID', 'Customer', 'Type', 'Slot', 'Fee', 'Status', 'Actions'], rows)

# ---------- PHOTOGRAPHY ----------
def photography():
    rows = []
    data = [
        ('PH-221', 'Neha Kulkarni', 'Studio Portfolio', '22 Aug 2026 · 10:00 AM', 'booked', '₹3,500'),
        ('PH-220', 'Ritu Deshpande', 'Product Shoot — 12 items', '26 Aug 2026 · 9:00 AM', 'pending', '₹7,200'),
        ('PH-219', 'Meera Silks', 'Lookbook', '30 Aug 2026 · 8:00 AM', 'booked', '₹12,000'),
    ]
    for pid, cust, typ, when, st, fee in data:
        badge = BADGE['success'].format('Booked') if st == 'booked' else BADGE['pending']
        rows.append(f'<td><strong>{pid}</strong></td><td>{cust}</td><td>{typ}</td><td>{when}</td><td>{fee}</td><td>{badge}</td><td>{acts(edit=False)}</td>')
    return toolbar('Photography', 'Photography and shoot bookings.') + table(
    ['ID', 'Client', 'Shoot', 'Slot', 'Fee', 'Status', 'Actions'], rows)

# ---------- EVENTS (service) ----------
def events():
    rows = []
    data = [
        ('EV-90', 'Monsoon Bridal Edit', 'Mumbai', '05 Sep 2026', 'published', 320),
        ('EV-89', 'Festive Pop-Up', 'Pune', '19 Sep 2026', 'published', 210),
        ('EV-88', 'Designers Meet', 'Delhi', '03 Oct 2026', 'draft', 0),
    ]
    for eid, name, city, date, st, rsvps in data:
        badge = BADGE['active'].format('Published') if st == 'published' else BADGE['pending'].format('Draft')
        rows.append(f'<td><strong>{eid}</strong></td><td>{name}</td><td>{city}</td><td>{date}</td><td>{rsvps}</td><td>{badge}</td><td>{acts()}</td>')
    return toolbar('Event Management', 'Offline events and pop-ups.', BTN_ADD) + table(
    ['ID', 'Event', 'City', 'Date', 'RSVPs', 'Status', 'Actions'], rows)

# ---------- REVIEWS ----------
def reviews():
    rows = []
    data = [
        ('Priya Sharma', 'Banarasi Silk Saree', 5, 'Fabric quality is outstanding. Loved the drape!', 'pending'),
        ('Ananya Iyer', 'Emerald Kundan Set', 4, 'Beautiful set, slightly heavier than expected.', 'published'),
        ('Neha Kulkarni', 'Anarkali Gown', 5, 'Perfect fit and timely delivery.', 'published'),
        ('Kavya Reddy', 'Linen Nehru Jacket', 2, 'Colour differs from photos.', 'pending'),
    ]
    for cust, prod, rating, text, st in data:
        stars = '★' * rating + '<span class="off">' + '★' * (5 - rating) + '</span>'
        badge = BADGE['pending'] if st == 'pending' else BADGE['success'].format('Published')
        extra = '<button class="action-btn edit" title="Publish"><i class="bi bi-check-lg"></i></button>' if st == 'pending' else ''
        rows.append(f'<td>{uc(cust[0], cust, "Verified purchase")}</td><td>{prod}</td><td><span class="stars">{stars}</span></td><td class="text-muted">{text}</td><td>{badge}</td><td>{acts(view=False, delete=False, extra=extra)}</td>')
    return toolbar('Reviews & Ratings', 'Moderate product reviews.', '') + '''
<div class="stat-grid">
''' + stat('bi-star', 'gold', 'Avg Rating', '4.6 / 5') + '''
''' + stat('bi-chat-square-text', 'blue', 'Total Reviews', '214') + '''
''' + stat('bi-hourglass-split', 'purple', 'Awaiting Moderation', '9') + '''
''' + stat('bi-slash-circle', 'danger', 'Rejected', '11') + '''
</div>
''' + table(['Customer', 'Product', 'Rating', 'Review', 'Status', 'Actions'], rows)

# ---------- REFERRALS ----------
def referrals():
    rows = []
    data = [
        ('Priya Sharma', 'Ananya Iyer', 'joined', '₹250 off coupon', '18 Aug 2026'),
        ('Ananya Iyer', 'Neha Kulkarni', 'joined', '₹250 off coupon', '02 Aug 2026'),
        ('Neha Kulkarni', 'Kavya Reddy', 'clicked', '—', '28 Jul 2026'),
    ]
    for ref, invited, st, reward, date in data:
        badge = BADGE['success'].format('Joined') if st == 'joined' else BADGE['info'].format('Clicked')
        rows.append(f'<td>{ref}</td><td>{invited}</td><td>{badge}</td><td>{reward}</td><td>{date}</td><td>{acts(view=False, edit=False)}</td>')
    return toolbar('Referral Program', 'Customer referral tracking and rewards.', BTN_EXPORT) + '''
<div class="stat-grid">
''' + stat('bi-people', 'gold', 'Total Referrals', '68') + '''
''' + stat('bi-person-check', 'green', 'Converted', '41') + '''
''' + stat('bi-gift', 'purple', 'Rewards Given', '₹10,250') + '''
</div>
''' + table(['Referrer', 'Invited', 'Status', 'Reward', 'Date', 'Actions'], rows)

# ---------- OFFERS ----------
def offers():
    rows = []
    data = [
        ('FESTIVE25', 'Flat 25% off above ₹2,999', 'Coupon', '01 Sep – 15 Sep 2026', 412, 'active'),
        ('WELCOME100', '₹100 off first order', 'Coupon', 'Always on', 1089, 'active'),
        ('MONSOON10', 'Extra 10% monsoon sale', 'Banner Offer', '01 Aug – 31 Aug 2026', 322, 'expired'),
        ('FREESHIP', 'Free shipping above ₹999', 'Shipping', 'Always on', 2431, 'active'),
    ]
    for code, desc, typ, window, uses, st in data:
        badge = BADGE['active'] if st == 'active' else BADGE['inactive'].format('Expired')
        rows.append(f'<td><strong>{code}</strong></td><td>{desc}</td><td><span class="badge badge-gold">{typ}</span></td><td>{window}</td><td>{uses}</td><td>{badge}</td><td>{acts()}</td>')
    return toolbar('Offers & Coupons', 'Discount campaigns across the storefront.', BTN_ADD) + table(
    ['Code', 'Description', 'Type', 'Window', 'Redemptions', 'Status', 'Actions'], rows)

# ---------- NOTIFICATIONS ----------
def notifications():
    rows = []
    data = [
        ('NTF-1023', 'Order Shipped', '#TF-1041 has left the Mumbai hub.', '18 Aug 2026 · 9:12 AM', 'All Customers', 'sent'),
        ('NTF-1022', 'Festive Sale Live', 'Flat 25% off is now live on ethnic wear.', '01 Sep 2026 · 10:00 AM', 'All Users', 'scheduled'),
        ('NTF-1021', 'Cart Reminder', 'You left 2 items in your cart.', '17 Aug 2026 · 7:30 PM', 'Segmented', 'sent'),
        ('NTF-1020', 'New Arrival', 'Kundan edit just dropped.', '15 Aug 2026 · 11:00 AM', 'All Users', 'sent'),
    ]
    for nid, title, body, when, aud, st in data:
        badge = BADGE['success'].format('Sent') if st == 'sent' else BADGE['info'].format('Scheduled')
        rows.append(f'<td><strong>{nid}</strong></td><td>{title}</td><td class="text-muted">{body}</td><td>{when}</td><td>{aud}</td><td>{badge}</td><td>{acts(view=False, edit=False)}</td>')
    return toolbar('Notifications', 'Push and email notifications.', BTN_ADD) + '''
<div class="card" style="margin-bottom:16px"><div class="card-header"><h4>Compose</h4></div><div class="card-body">
    <div class="form-group"><label>Title</label><input class="form-control" placeholder="Notification title"></div>
    <div class="form-group"><label>Message</label><textarea class="form-control" rows="3" placeholder="What should customers know?"></textarea></div>
    <div class="form-row">
        <div class="form-group"><label>Audience</label><select class="form-control"><option>All Users</option><option>All Customers</option><option>Segmented</option></select></div>
        <div class="form-group"><label>Schedule</label><input class="form-control" type="datetime-local"></div>
    </div>
    <button class="btn btn-primary"><i class="bi bi-send"></i> Send</button>
</div></div>
''' + table(['ID', 'Title', 'Message', 'Sent', 'Audience', 'Status', 'Actions'], rows)

# ---------- CONTACT QUERIES ----------
def contactQueries():
    rows = []
    data = [
        ('CQ-881', 'Sanjay Patil', 'Bulk / corporate order', 'open', '18 Aug 2026'),
        ('CQ-880', 'Divya Menon', 'Return window question', 'open', '17 Aug 2026'),
        ('CQ-879', 'Farhan Shaikh', 'Sell on Tatito — seller enquiry', 'resolved', '15 Aug 2026'),
        ('CQ-878', 'Lakshmi Rao', 'Order #TF-1031 delay', 'resolved', '12 Aug 2026'),
    ]
    for cid, name, subj, st, date in data:
        badge = BADGE['info'].format('Open') if st == 'open' else BADGE['success'].format('Resolved')
        extra = '<button class="action-btn edit" title="Reply"><i class="bi bi-reply"></i></button>' if st == 'open' else ''
        rows.append(f'<td><strong>{cid}</strong></td><td>{name}</td><td>{subj}</td><td>{badge}</td><td>{date}</td><td>{acts(view=False, delete=False, extra=extra)}</td>')
    return toolbar('Contact Queries', 'Messages from the contact-us form.', '') + '''
<div class="module-banner info"><i class="bi bi-envelope"></i><span><strong>2</strong> open queries</span></div>
''' + table(['ID', 'From', 'Subject', 'Status', 'Received', 'Actions'], rows)

# ---------- SUPPORT TICKETS ----------
def supportTickets():
    rows = []
    data = [
        ('TK-1205', 'Order Issue', '#TF-1039 — payment debited, order pending', 'high', 'open', 'Kavya Reddy'),
        ('TK-1204', 'Return', 'Kids Lehenga size exchange', 'medium', 'open', 'Ritu Deshpande'),
        ('TK-1203', 'Refund', 'Refund not credited after 5 days', 'high', 'in_progress', 'Neha Kulkarni'),
        ('TK-1202', 'Other', 'Update shipping address', 'low', 'resolved', 'Ananya Iyer'),
    ]
    for tid, typ, subj, pri, st, cust in data:
        badge = {'open': BADGE['info'].format('Open'), 'in_progress': BADGE['processing'],
                 'resolved': BADGE['success'].format('Resolved')}[st]
        pri_badge = {'high': BADGE['danger'].format('High'), 'medium': BADGE['warning'].format('Medium'), 'low': BADGE['info'].format('Low')}[pri]
        rows.append(f'<td><strong>{tid}</strong></td><td>{typ}</td><td class="text-muted">{subj}</td><td>{cust}</td><td>{pri_badge}</td><td>{badge}</td><td>{acts(edit=False)}</td>')
    return toolbar('Support Tickets', 'Customer support queue.', '') + table(
    ['Ticket', 'Type', 'Subject', 'Customer', 'Priority', 'Status', 'Actions'], rows)

# ---------- STAFF ----------
def staff():
    rows = []
    data = [
        ('SA', 'Super Admin', 'admin@tatitofashions.com', 'Super Admin', 'active', 'All modules'),
        ('RK', 'Ravi Kumar', 'ravi.k@tatitofashions.com', 'Catalog Manager', 'active', 'Catalog, Products'),
        ('SC', 'Shalini Chauhan', 'shalini.c@tatitofashions.com', 'Sales Executive', 'active', 'Orders, Payments, Refunds'),
        ('AM', 'Amit Mhatre', 'amit.m@tatitofashions.com', 'Support Agent', 'inactive', 'Support Tickets'),
    ]
    for ini, name, email, role, st, mods in data:
        badge = BADGE['active'] if st == 'active' else BADGE['inactive']
        cls = 'blue' if ini == 'RK' else ('green' if ini == 'SC' else ('purple' if ini == 'AM' else ''))
        rows.append(f'<td>{uc(ini, name, email, cls)}</td><td><span class="badge badge-gold">{role}</span></td><td class="text-muted">{mods}</td><td>{badge}</td><td>{acts()}</td>')
    return toolbar('All Staff', 'Admin panel users and their access.', BTN_ADD) + table(
    ['Staff', 'Role', 'Modules', 'Status', 'Actions'], rows)

# ---------- ROLES ----------
def roles():
    rows = []
    data = [
        ('Super Admin', 'Full access to every module', 5, 53, 'system'),
        ('Catalog Manager', 'Catalog, categories, products', 1, 2, 'custom'),
        ('Sales Executive', 'Orders, payments, refunds, tracking', 3, 8, 'custom'),
        ('Support Agent', 'Support tickets, contact queries', 1, 2, 'custom'),
        ('Seller', 'Seller-scoped catalog and orders', 0, 0, 'system'),
    ]
    for name, desc, members, mods, typ in data:
        typ_badge = BADGE['gold'].format('System') if typ == 'system' else BADGE['info'].format('Custom')
        rows.append(f'<td><strong>{name}</strong></td><td class="text-muted">{desc}</td><td>{members}</td><td>{mods}</td><td>{typ_badge}</td><td>{acts(delete=(typ != "system"))}</td>')
    return toolbar('Staff Roles', 'Role-based access control.', BTN_ADD) + '''
<div class="card"><div class="card-header"><h4>Module Permissions — Sales Executive</h4></div><div class="card-body">
    <div class="form-row">
        <div class="form-group"><label>Orders</label><select class="form-control"><option>Full Access</option><option>Read Only</option><option>No Access</option></select></div>
        <div class="form-group"><label>Payments</label><select class="form-control"><option>Full Access</option><option>Read Only</option><option>No Access</option></select></div>
        <div class="form-group"><label>Refunds</label><select class="form-control"><option>Full Access</option><option>Read Only</option><option>No Access</option></select></div>
        <div class="form-group"><label>Live Tracking</label><select class="form-control"><option>Full Access</option><option>Read Only</option><option>No Access</option></select></div>
    </div>
    ''' + BTN_SAVE + '''
</div></div>
<br>
''' + table(['Role', 'Description', 'Members', 'Modules', 'Type', 'Actions'], rows)

CONTENT_2 = {
    'boutiques': boutiques,
    'customizations': customizations,
    'quotations': quotations,
    'consultations': consultations,
    'photography': photography,
    'events': events,
    'reviews': reviews,
    'referrals': referrals,
    'offers': offers,
    'notifications': notifications,
    'contactQueries': contactQueries,
    'supportTickets': supportTickets,
    'staff': staff,
    'roles': roles,
}
