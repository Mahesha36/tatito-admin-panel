#!/usr/bin/env python3
"""Generate 53 standalone admin module HTML files (design only).
Reuses existing admin CSS. Static sidebar + topbar + per-module content."""

import os

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, '..', 'public', 'admin', 'modules')

# (section_dir, file, section_label, module_label, active_id, icon)
MODULES = [
    # Dashboard
    ('dashboard', 'dashboard.html', 'Dashboard', 'Dashboard', 'dashboard'),
    ('dashboard', 'reports.html', 'Dashboard', 'Reports & Analytics', 'reports'),
    ('dashboard', 'tracking.html', 'Dashboard', 'Live Order Tracking', 'tracking'),
    # Catalog
    ('catalog', 'categories.html', 'Catalog', 'Categories', 'categories'),
    ('catalog', 'products.html', 'Catalog', 'Products', 'products'),
    # Sales
    ('sales', 'orders.html', 'Sales', 'Orders', 'orders'),
    ('sales', 'bookings.html', 'Sales', 'Bookings', 'bookings'),
    ('sales', 'payments.html', 'Sales', 'Payments', 'payments'),
    ('sales', 'refunds.html', 'Sales', 'Refunds', 'refunds'),
    # Members
    ('members', 'approvals.html', 'Members', 'Approvals', 'approvals'),
    ('members', 'users.html', 'Members', 'Customers', 'users'),
    ('members', 'sellers.html', 'Members', 'Sellers', 'sellers'),
    ('members', 'designers.html', 'Members', 'Designers', 'designers'),
    # Services
    ('services', 'boutiques.html', 'Services', 'Boutiques', 'boutiques'),
    ('services', 'customizations.html', 'Services', 'Customizations', 'customizations'),
    ('services', 'quotations.html', 'Services', 'Quotations', 'quotations'),
    ('services', 'consultations.html', 'Services', 'Consultations', 'consultations'),
    ('services', 'photography.html', 'Services', 'Photography', 'photography'),
    ('services', 'events.html', 'Services', 'Event Management', 'events'),
    # Marketing
    ('marketing', 'reviews.html', 'Marketing', 'Reviews & Ratings', 'reviews'),
    ('marketing', 'referrals.html', 'Marketing', 'Referral Program', 'referrals'),
    ('marketing', 'offers.html', 'Marketing', 'Offers & Coupons', 'offers'),
    ('marketing', 'notifications.html', 'Marketing', 'Notifications', 'notifications'),
    # Support
    ('support', 'contact-queries.html', 'Support', 'Contact Queries', 'contactQueries'),
    ('support', 'support-tickets.html', 'Support', 'Support Tickets', 'supportTickets'),
    # Staff
    ('staff', 'staff.html', 'Staff', 'All Staff', 'staff'),
    ('staff', 'roles.html', 'Staff', 'Staff Roles', 'roles'),
    # Website
    ('website', 'cms.html', 'Website', 'CMS Pages', 'cms'),
    ('website', 'header.html', 'Website', 'Header', 'website-header'),
    ('website', 'footer.html', 'Website', 'Footer', 'website-footer'),
    ('website', 'setup.html', 'Website', 'Website Setup', 'websiteSetup'),
    ('website', 'home-settings.html', 'Website', 'Home Page Settings', 'homePageSettings'),
    ('website', 'media-manager.html', 'Website', 'Media Manager', 'mediaManager'),
    # Home Feed
    ('home-feed', 'collections.html', 'Home Feed', 'Home Collections', 'home-collections'),
    ('home-feed', 'video-banners.html', 'Home Feed', 'Video Banners', 'home-video-banners'),
    ('home-feed', 'dynamic-layout.html', 'Home Feed', 'Dynamic Layout', 'home-dynamic-sections'),
    # Weddings
    ('weddings', 'collections.html', 'Weddings Hub', 'Collections', 'wedding-collections'),
    ('weddings', 'banners.html', 'Weddings Hub', 'Banners', 'wedding-banners'),
    ('weddings', 'featured.html', 'Weddings Hub', 'Featured Couture', 'wedding-featured'),
    # Customise
    ('customise', 'studios.html', 'Customise', 'Studios', 'customisation-studios'),
    ('customise', 'options.html', 'Customise', 'Options & Swatches', 'customisation-options'),
    ('customise', 'bespoke-orders.html', 'Customise', 'Bespoke Orders', 'bespoke-orders'),
    # Jewellery
    ('jewellery', 'collections.html', 'Jewellery Vault', 'Collections', 'jewellery-collections'),
    ('jewellery', 'categories.html', 'Jewellery Vault', 'Categories', 'jewellery-categories'),
    ('jewellery', 'products.html', 'Jewellery Vault', 'Products', 'jewellery-products'),
    # VIP Events
    ('vip-events', 'calendar.html', 'VIP Events', 'Event Calendar', 'events-vip'),
    ('vip-events', 'rsvps.html', 'VIP Events', 'RSVPs', 'event-rsvps'),
    # Stylist
    ('stylist', 'bookings.html', 'Stylist', 'Bookings', 'stylist-bookings'),
    # Settings
    ('settings', 'general.html', 'Settings', 'General Settings', 'settings'),
    ('settings', 'payment-setup.html', 'Settings', 'Payment Setup', 'payment-setup'),
    ('settings', 'currencies.html', 'Settings', 'Currencies', 'currencies'),
    ('settings', 'languages.html', 'Settings', 'Languages', 'languages'),
    ('settings', 'email-templates.html', 'Settings', 'Email Templates', 'emailTemplates'),
]

# nav id -> (label, href) for sidebar links
HREFS = {f'{d}/{n}': (label, f'{d}/{n}') for d, n, _, label, _ in MODULES}
