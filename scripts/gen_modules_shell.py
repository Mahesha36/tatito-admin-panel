#!/usr/bin/env python3
"""Shared shell builder: sidebar + topbar + page wrapper for module pages."""

# Full nav structure: (section_label, icon, [(nav_id, label, href), ...])
NAV = [
    ('Dashboard', 'bi-grid-1x2', [
        ('dashboard', 'Dashboard', 'dashboard/dashboard.html'),
        ('reports', 'Reports & Analytics', 'dashboard/reports.html'),
        ('tracking', 'Live Order Tracking', 'dashboard/tracking.html'),
    ]),
    ('Catalog', 'bi-tags', [
        ('categories', 'Categories', 'catalog/categories.html'),
        ('products', 'Products', 'catalog/products.html'),
    ]),
    ('Sales', 'bi-bag', [
        ('orders', 'Orders', 'sales/orders.html'),
        ('bookings', 'Bookings', 'sales/bookings.html'),
        ('payments', 'Payments', 'sales/payments.html'),
        ('refunds', 'Refunds', 'sales/refunds.html'),
    ]),
    ('Members', 'bi-people', [
        ('approvals', 'Approvals', 'members/approvals.html'),
        ('users', 'Customers', 'members/users.html'),
        ('sellers', 'Sellers', 'members/sellers.html'),
        ('designers', 'Designers', 'members/designers.html'),
    ]),
    ('Services', 'bi-stars', [
        ('boutiques', 'Boutiques', 'services/boutiques.html'),
        ('customizations', 'Customizations', 'services/customizations.html'),
        ('quotations', 'Quotations', 'services/quotations.html'),
        ('consultations', 'Consultations', 'services/consultations.html'),
        ('photography', 'Photography', 'services/photography.html'),
        ('events', 'Event Management', 'services/events.html'),
    ]),
    ('Marketing', 'bi-megaphone', [
        ('reviews', 'Reviews & Ratings', 'marketing/reviews.html'),
        ('referrals', 'Referral Program', 'marketing/referrals.html'),
        ('offers', 'Offers & Coupons', 'marketing/offers.html'),
        ('notifications', 'Notifications', 'marketing/notifications.html'),
    ]),
    ('Support', 'bi-life-preserver', [
        ('contactQueries', 'Contact Queries', 'support/contact-queries.html'),
        ('supportTickets', 'Support Tickets', 'support/support-tickets.html'),
    ]),
    ('Staff', 'bi-person-badge', [
        ('staff', 'All Staff', 'staff/staff.html'),
        ('roles', 'Staff Roles', 'staff/roles.html'),
    ]),
    ('Website', 'bi-globe2', [
        ('cms', 'CMS Pages', 'website/cms.html'),
        ('website-header', 'Header', 'website/header.html'),
        ('website-footer', 'Footer', 'website/footer.html'),
        ('websiteSetup', 'Website Setup', 'website/setup.html'),
        ('homePageSettings', 'Home Page Settings', 'website/home-settings.html'),
        ('mediaManager', 'Media Manager', 'website/media-manager.html'),
    ]),
    ('Home Feed', 'bi-images', [
        ('home-collections', 'Home Collections', 'home-feed/collections.html'),
        ('home-video-banners', 'Video Banners', 'home-feed/video-banners.html'),
        ('home-dynamic-sections', 'Dynamic Layout', 'home-feed/dynamic-layout.html'),
    ]),
    ('Weddings Hub', 'bi-heart', [
        ('wedding-collections', 'Collections', 'weddings/collections.html'),
        ('wedding-banners', 'Banners', 'weddings/banners.html'),
        ('wedding-featured', 'Featured Couture', 'weddings/featured.html'),
    ]),
    ('Customise', 'bi-scissors', [
        ('customisation-studios', 'Studios', 'customise/studios.html'),
        ('customisation-options', 'Options & Swatches', 'customise/options.html'),
        ('bespoke-orders', 'Bespoke Orders', 'customise/bespoke-orders.html'),
    ]),
    ('Jewellery Vault', 'bi-gem', [
        ('jewellery-collections', 'Collections', 'jewellery/collections.html'),
        ('jewellery-categories', 'Categories', 'jewellery/categories.html'),
        ('jewellery-products', 'Products', 'jewellery/products.html'),
    ]),
    ('VIP Events', 'bi-calendar-event', [
        ('events-vip', 'Event Calendar', 'vip-events/calendar.html'),
        ('event-rsvps', 'RSVPs', 'vip-events/rsvps.html'),
    ]),
    ('Stylist', 'bi-person-heart', [
        ('stylist-bookings', 'Bookings', 'stylist/bookings.html'),
    ]),
    ('Settings', 'bi-gear', [
        ('settings', 'General Settings', 'settings/general.html'),
        ('payment-setup', 'Payment Setup', 'settings/payment-setup.html'),
        ('currencies', 'Currencies', 'settings/currencies.html'),
        ('languages', 'Languages', 'settings/languages.html'),
        ('emailTemplates', 'Email Templates', 'settings/email-templates.html'),
    ]),
]


def sidebar(active_id):
    out = ['<div class="sidebar" id="sidebar">',
           '    <div class="sidebar-header">',
           '        <img src="../../assets/tatito-logo.png" alt="TATITO" class="sidebar-logo" onerror="this.style.display=\'none\'">',
           '        <div>',
           '            <h3 class="sidebar-brand">TATITO</h3>',
           '            <small class="sidebar-subtitle">Admin Panel</small>',
           '        </div>',
           '    </div>',
           '    <div class="sidebar-user">',
           '        <div class="sidebar-avatar">S</div>',
           '        <div class="sidebar-user-info">',
           '            <div class="sidebar-user-name">Super Admin</div>',
           '            <div class="sidebar-user-role">Administrator</div>',
           '        </div>',
           '    </div>',
           '    <nav class="sidebar-nav">']
    for sec_label, sec_icon, items in NAV:
        out.append(f'        <div class="nav-group">')
        out.append(f'            <button class="nav-group-title" type="button"><i class="bi {sec_icon}"></i> {sec_label} <i class="bi bi-chevron-down chevron"></i></button>')
        out.append(f'            <div class="nav-group-items">')
        for nav_id, label, href in items:
            cls = 'nav-item active' if nav_id == active_id else 'nav-item'
            out.append(f'                <a class="{cls}" href="../{href}"><i class="bi bi-circle-fill nav-dot"></i>{label}</a>')
        out.append('            </div>')
        out.append('        </div>')
    out += ['    </nav>',
            '    <div class="sidebar-footer">',
            '        <a class="btn btn-ghost btn-block" href="../index.html"><i class="bi bi-box-arrow-right"></i> Logout</a>',
            '    </div>',
            '</div>']
    return '\n'.join(out)


def topbar(title):
    return f'''<div class="main-wrapper">
    <div class="topbar">
        <button class="topbar-toggle" type="button"><i class="bi bi-list"></i></button>
        <h2>{title}</h2>
        <div class="topbar-actions">
            <a href="../../../frontend/index.html" target="_blank" class="topbar-icon-btn" title="Visit Site"><i class="bi bi-globe"></i></a>
            <a href="../index.html" class="topbar-icon-btn" title="All Modules"><i class="bi bi-grid-3x3-gap"></i></a>
            <a href="#" class="topbar-icon-btn" title="Notifications"><i class="bi bi-bell"></i></a>
        </div>
    </div>
    <main class="page-content-wrapper">
        <div class="page-content">'''


HEAD = '''<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} — TATITO Admin</title>
<link rel="icon" href="../../assets/tatito-logo.png" type="image/png">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../css/theme.css">
<link rel="stylesheet" href="../../css/layout.css">
<link rel="stylesheet" href="../../css/components.css">
<link rel="stylesheet" href="../../css/pages.css">
<link rel="stylesheet" href="../../css/modules.css">
</head>
<body class="admin-body">
'''

FOOT = '''        </div>
    </main>
</div>
</body>
</html>'''


def page(title, active_id, content):
    return HEAD.format(title=title) + sidebar(active_id) + '\n' + topbar(title) + '\n' + content + '\n' + FOOT
