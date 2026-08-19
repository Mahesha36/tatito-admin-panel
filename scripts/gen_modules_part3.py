#!/usr/bin/env python3
"""Module content — part 3: Website, Home Feed, Weddings, Customise, Jewellery, VIP, Stylist, Settings."""
from gen_modules_part1 import (stat, toolbar, table, acts, uc, BADGE,
                               BTN_ADD, BTN_EXPORT, BTN_SAVE)

def upload_zone(label='Click or drag to upload'):
    return (f'<div class="upload-zone"><i class="bi bi-cloud-arrow-up"></i>'
            f'<strong>{label}</strong><span class="uz-hint">PNG, JPG, WEBP or MP4 · max 5 MB</span></div>')

def toggle(title, sub='', on=True):
    checked = 'checked' if on else ''
    return (f'<div class="toggle-row"><div class="toggle-info"><div class="ti-title">{title}</div>'
            + (f'<div class="ti-sub">{sub}</div>' if sub else '') +
            f'</div><label class="toggle-switch"><input type="checkbox" {checked}><span class="toggle-slider"></span></label></div>')

# ---------- CMS ----------
def cms():
    return toolbar('CMS Pages', 'Static storefront pages.', BTN_ADD) + '''
<div class="filter-bar">
    <a class="filter-pill active">All <span class="pill-count">24</span></a>
    <a class="filter-pill">Published <span class="pill-count">21</span></a>
    <a class="filter-pill">Draft <span class="pill-count">3</span></a>
</div>
''' + table(
    ['Page', 'URL', 'Views (30d)', 'Updated', 'Status', 'Actions'],
    [
        '<td><strong>About Us</strong></td><td class="text-muted">/about</td><td>4,120</td><td>02 Aug 2026</td><td>' + BADGE['active'].format('Published') + '</td><td>' + acts() + '</td>',
        '<td><strong>Careers</strong></td><td class="text-muted">/careers</td><td>1,845</td><td>28 Jul 2026</td><td>' + BADGE['active'].format('Published') + '</td><td>' + acts() + '</td>',
        '<td><strong>Sell on Tatito</strong></td><td class="text-muted">/sell-on-tatito</td><td>990</td><td>19 Jul 2026</td><td>' + BADGE['active'].format('Published') + '</td><td>' + acts() + '</td>',
        '<td><strong>Privacy Policy</strong></td><td class="text-muted">/privacy</td><td>2,310</td><td>10 Jul 2026</td><td>' + BADGE['active'].format('Published') + '</td><td>' + acts() + '</td>',
        '<td><strong>Festive Edit 2026</strong></td><td class="text-muted">/festive-edit</td><td>—</td><td>18 Aug 2026</td><td>' + BADGE['pending'].format('Draft') + '</td><td>' + acts() + '</td>',
    ])

# ---------- WEBSITE HEADER ----------
def website_header():
    return toolbar('Header', 'Top bar and main navigation header.', BTN_SAVE) + '''
<div class="card" style="margin-bottom:16px"><div class="card-header"><h4>Preview</h4></div><div class="card-body">
    <div style="border:1px solid var(--border-light);border-radius:var(--radius-md);padding:14px 20px;display:flex;align-items:center;gap:18px">
        <strong style="font-family:var(--font-display);color:var(--gold);letter-spacing:1px">TATITO</strong>
        <span style="flex:1"></span>
        <span style="font-size:0.85rem">New In</span><span style="font-size:0.85rem">Women</span>
        <span style="font-size:0.85rem">Men</span><span style="font-size:0.85rem">Jewellery</span>
        <span style="font-size:0.85rem">Weddings</span>
        <span class="badge badge-gold">Offers</span>
        <span class="avatar">S</span>
    </div>
</div></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
    <div class="card"><div class="card-header"><h4>Brand Row</h4></div><div class="card-body">
        <div class="form-group"><label>Logo</label>''' + upload_zone('Replace logo (tatito-logo.png)') + '''</div>
        <div class="form-group"><label>Announcement Text</label><input class="form-control" value="Free shipping above ₹999 · Easy 7-day returns"></div>
        ''' + toggle('Show Announcement Bar', 'Strip above the header', True) + '''
        ''' + toggle('Sticky Header', 'Header follows scroll', True) + '''
    </div></div>
    <div class="card"><div class="card-header"><h4>Navigation Links</h4></div><div class="card-body">
''' + table(['Label', 'URL', ''], [
        '<td>New In</td><td class="text-muted">/new-arrivals</td><td>' + acts(view=False, delete=True, edit=True) + '</td>',
        '<td>Women</td><td class="text-muted">/women</td><td>' + acts(view=False, delete=True, edit=True) + '</td>',
        '<td>Jewellery</td><td class="text-muted">/jewellery</td><td>' + acts(view=False, delete=True, edit=True) + '</td>',
    ]) + '''
        <button class="btn btn-ghost btn-sm"><i class="bi bi-plus-lg"></i> Add Link</button>
    </div></div>
</div>'''

# ---------- WEBSITE FOOTER ----------
def website_footer():
    return toolbar('Footer', 'Footer widgets, links and copyright.', BTN_SAVE) + '''
<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:16px">
    <div class="card"><div class="card-header"><h4>Column — Shop</h4></div><div class="card-body">
        <div class="detail-row"><span class="label">All Products</span><span class="value text-muted">/products</span></div>
        <div class="detail-row"><span class="label">Men</span><span class="value text-muted">/men</span></div>
        <div class="detail-row"><span class="label">Women</span><span class="value text-muted">/women</span></div>
        <div class="detail-row"><span class="label">Kids</span><span class="value text-muted">/kids</span></div>
        <div class="detail-row"><span class="label">Deals</span><span class="value text-muted">/deals</span></div>
    </div></div>
    <div class="card"><div class="card-header"><h4>Column — Services</h4></div><div class="card-body">
        <div class="detail-row"><span class="label">Customize</span><span class="value text-muted">/customise</span></div>
        <div class="detail-row"><span class="label">Weddings</span><span class="value text-muted">/weddings</span></div>
        <div class="detail-row"><span class="label">Jewellery</span><span class="value text-muted">/jewellery</span></div>
        <div class="detail-row"><span class="label">Event Management</span><span class="value text-muted">/events</span></div>
        <div class="detail-row"><span class="label">Consultations</span><span class="value text-muted">/consult</span></div>
    </div></div>
    <div class="card"><div class="card-header"><h4>Column — Company</h4></div><div class="card-body">
        <div class="detail-row"><span class="label">About Us</span><span class="value text-muted">/about</span></div>
        <div class="detail-row"><span class="label">Careers</span><span class="value text-muted">/careers</span></div>
        <div class="detail-row"><span class="label">Sell on Tatito</span><span class="value text-muted">/sell-on-tatito</span></div>
        <div class="detail-row"><span class="label">Contact Us</span><span class="value text-muted">/contact</span></div>
    </div></div>
</div>
<div style="display:grid;grid-template-columns:2fr 1fr;gap:16px">
    <div class="card"><div class="card-header"><h4>About &amp; Contacts</h4></div><div class="card-body">
        <div class="form-group"><label>About Text</label><textarea class="form-control" rows="2">Custom fashion for everyone.</textarea></div>
        <div class="form-row">
            <div class="form-group"><label>Helpline</label><input class="form-control" value="+91 1800 202 4040"></div>
            <div class="form-group"><label>Email</label><input class="form-control" value="care@tatitofashions.com"></div>
        </div>
        <div class="form-group"><label>Copyright Text</label><input class="form-control" value="© 2026 Tatito Fashions. All rights reserved."></div>
    </div></div>
    <div class="card"><div class="card-header"><h4>Social &amp; Apps</h4></div><div class="card-body">
        ''' + toggle('Instagram', '@tatitofashions', True) + '''
        ''' + toggle('Facebook', 'Tatito Fashions', True) + '''
        ''' + toggle('Pinterest', False and '' or 'Tatito Board', True) + '''
        <div class="form-group"><label>Play Store Badge</label>''' + upload_zone('Upload badge') + '''</div>
    </div></div>
</div>'''

# ---------- WEBSITE SETUP ----------
def websiteSetup():
    return toolbar('Website Setup', 'Global site identity and behaviour.', BTN_SAVE) + '''
<div class="tabs"><a class="tab active">General</a><a class="tab">SEO</a><a class="tab">Scripts</a><a class="tab">Advanced</a></div>
<div style="display:grid;grid-template-columns:2fr 1fr;gap:16px">
    <div class="card"><div class="card-header"><h4>General</h4></div><div class="card-body">
        <div class="form-group"><label>Website Name</label><input class="form-control" value="TATITO Fashions"></div>
        <div class="form-row">
            <div class="form-group"><label>Primary Color</label><input class="form-control" type="color" value="#C9A24B" style="height:42px"></div>
            <div class="form-group"><label>Base Font</label><select class="form-control"><option>Playfair Display + Inter</option><option>Inter only</option></select></div>
        </div>
        <div class="form-group"><label>Favicon</label>''' + upload_zone('Replace favicon') + '''</div>
    </div></div>
    <div class="card"><div class="card-header"><h4>Quick Toggles</h4></div><div class="card-body">
        ''' + toggle('Maintenance Mode', 'Show maintenance page', False) + '''
        ''' + toggle('Storefront Open', 'Accept new orders', True) + '''
        ''' + toggle('Guest Checkout', 'Allow checkout without login', True) + '''
    </div></div>
</div>'''

# ---------- HOME PAGE SETTINGS ----------
def homePageSettings():
    return toolbar('Home Page Settings', 'Section order and visibility on the storefront homepage.', BTN_SAVE) + '''
<div class="card"><div class="card-body">
''' + ''.join([
        toggle(f'{i+1}. {name}', sub, on) for i, (name, sub, on) in enumerate([
            ('Hero Slider', 'Video banners at the very top', True),
            ('Category Circles', 'Shop by category quick links', True),
            ('Featured Stores', 'Curated store cards', True),
            ('Trending Products', 'Auto from best sellers', True),
            ('Wedding Hub Teaser', 'Bridal destination banner', True),
            ('Jewellery Vault Strip', 'Premium jewellery row', False),
            ('Testimonials', 'Customer love carousel', True),
            ('Newsletter Block', 'Email capture with ₹100 off', True),
        ])]) + '''
</div></div>'''

# ---------- MEDIA MANAGER ----------
def mediaManager():
    items = ''.join('<div class="media-item"><div class="media-thumb"><i class="bi bi-image"></i></div>'
                    '<div class="media-meta"><span>hero-{i}.webp</span><span>142 KB</span></div></div>'.format(i=i)
                    for i in range(1, 9))
    items += ''.join('<div class="media-item"><div class="media-thumb"><i class="bi bi-play-btn"></i></div>'
                     '<div class="media-meta"><span>banner-{i}.mp4</span><span>1.8 MB</span></div></div>'.format(i=i)
                     for i in range(1, 3))
    return toolbar('Media Manager', 'Images and videos used across the site.',
                   '<button class="btn btn-primary"><i class="bi bi-cloud-arrow-up"></i> Upload</button>') + '''
<div class="filter-bar">
    <a class="filter-pill active">All <span class="pill-count">89</span></a>
    <a class="filter-pill">Images <span class="pill-count">81</span></a>
    <a class="filter-pill">Videos <span class="pill-count">8</span></a>
</div>
<div class="card"><div class="card-body">
    <div class="media-grid">''' + items + '''</div>
</div></div>'''

# ---------- HOME COLLECTIONS ----------
def home_collections():
    rows = []
    data = [
        ('hc-1', 'Shop by Category', 'category_grid', 'All genders', True),
        ('hc-2', 'Trending Now', 'product_carousel', 'Women', True),
        ('hc-3', 'Wedding Destination', 'nav_vertical', 'All genders', True),
        ('hc-4', 'Jewellery Vault', 'store_row', 'Women', False),
    ]
    for cid, title, typ, gender, vis in data:
        badge = BADGE['active'].format('Visible') if vis else BADGE['inactive'].format('Hidden')
        rows.append(f'<td><strong>{title}</strong></td><td><span class="badge badge-gold">{typ}</span></td><td>{gender}</td><td>{badge}</td><td>{acts()}</td>')
    return toolbar('Home Collections', 'Curated collection rails on the homepage.', BTN_ADD) + table(
    ['Collection', 'Type', 'Gender', 'Visibility', 'Actions'], rows)

# ---------- VIDEO BANNERS ----------
def home_video_banners():
    rows = []
    data = [
        ('VB-01', 'Festive 2026 — Silk Story', 'banner', True, '01 Sep 2026'),
        ('VB-02', 'Kundan Edit', 'video', True, '15 Aug 2026'),
        ('VB-03', 'Monsoon Sale', 'banner', False, '30 Jul 2026'),
    ]
    for bid, title, typ, vis, date in data:
        badge = BADGE['active'].format('Visible') if vis else BADGE['inactive'].format('Hidden')
        icon = 'bi-film' if typ == 'video' else 'bi-image'
        rows.append(f'<td><div class="user-cell"><span class="thumb"><i class="bi {icon}"></i></span><span><strong>{title}</strong><br><span class="uc-sub">{bid}</span></span></div></td><td><span class="badge badge-gold">{typ.title()}</span></td><td>{badge}</td><td>{date}</td><td>{acts()}</td>')
    return toolbar('Video Banners', 'Hero slider slides — images and videos.', BTN_ADD) + '''
<div class="module-banner"><i class="bi bi-eye"></i><span><strong>Hero Slider Visibility</strong> — master switch for the whole slider</span>
<span style="flex:1"></span><label class="toggle-switch"><input type="checkbox" checked><span class="toggle-slider"></span></label></div>
''' + table(['Slide', 'Type', 'Visibility', 'Added', 'Actions'], rows)

# ---------- DYNAMIC LAYOUT ----------
def home_dynamic_sections():
    rows = []
    data = [
        ('New Arrivals', 'product_grid', 1, True),
        ('Best Sellers', 'product_carousel', 2, True),
        ('Editor’s Pick', 'manual_curated', 3, True),
        ('Clearance — Up to 40%', 'product_grid', 4, False),
    ]
    for title, typ, order, vis in data:
        badge = BADGE['active'].format('Visible') if vis else BADGE['inactive'].format('Hidden')
        extra = ('<button class="action-btn view" title="Move up"><i class="bi bi-arrow-up"></i></button>'
                 '<button class="action-btn view" title="Move down"><i class="bi bi-arrow-down"></i></button>')
        rows.append(f'<td><strong>{title}</strong></td><td><span class="badge badge-gold">{typ}</span></td><td>{order}</td><td>{badge}</td><td>{acts(delete=False, extra=extra)}</td>')
    return toolbar('Dynamic Layout', 'Homepage section order and visibility.', BTN_ADD) + table(
    ['Section', 'Type', 'Order', 'Visibility', 'Actions'], rows)

# ---------- WEDDING COLLECTIONS ----------
def wedding_collections():
    rows = []
    data = [
        ('WC-11', 'Royal Bridal Lehengas', 'Bridal', 14, True),
        ('WC-10', 'Groom Sherwanis', 'Groom', 11, True),
        ('WC-09', 'Reception Glam', 'Reception', 8, True),
        ('WC-08', 'Mehendi Pastels', 'Mehendi', 9, False),
    ]
    for cid, name, typ, count, vis in data:
        badge = BADGE['active'].format('Visible') if vis else BADGE['inactive'].format('Hidden')
        rows.append(f'<td><strong>{name}</strong></td><td><span class="badge badge-gold">{typ}</span></td><td>{count}</td><td>{badge}</td><td>{acts()}</td>')
    return toolbar('Collections — Weddings Hub', 'Curated wedding collections.', BTN_ADD) + table(
    ['Collection', 'Theme', 'Items', 'Visibility', 'Actions'], rows)

# ---------- WEDDING BANNERS ----------
def wedding_banners():
    rows = []
    data = [
        ('WB-06', 'Bridal Couture 2026', 'banner', True),
        ('WB-05', 'Book a Stylist', 'banner', True),
        ('WB-04', 'Sangeet Edit', 'video', False),
    ]
    for bid, title, typ, vis in data:
        badge = BADGE['active'].format('Visible') if vis else BADGE['inactive'].format('Hidden')
        icon = 'bi-film' if typ == 'video' else 'bi-image'
        rows.append(f'<td><div class="user-cell"><span class="thumb"><i class="bi {icon}"></i></span><span><strong>{title}</strong><br><span class="uc-sub">{bid}</span></span></div></td><td><span class="badge badge-gold">{typ.title()}</span></td><td>{badge}</td><td>{acts()}</td>')
    return toolbar('Banners — Weddings Hub', 'Wedding hub hero banners and videos.', BTN_ADD) + '''
<div class="card"><div class="card-header"><h4>New Banner</h4></div><div class="card-body">
    <div class="form-row">
        <div class="form-group"><label>Title</label><input class="form-control" placeholder="Banner title"></div>
        <div class="form-group"><label>Link (optional)</label><input class="form-control" placeholder="/weddings/..."></div>
    </div>
    <div class="form-group"><label>Media</label>''' + upload_zone() + '''</div>
    <button class="btn btn-primary"><i class="bi bi-plus-lg"></i> Add Banner</button>
</div></div><br>
''' + table(['Banner', 'Type', 'Visibility', 'Actions'], rows)

# ---------- WEDDING FEATURED ----------
def wedding_featured():
    rows = []
    data = [
        ('Anarkali Gown', 'Meera Silks', '₹2,999', True),
        ('Velvet Bridal Lehenga', 'Tatito Couture', '₹48,999', True),
        ('Ivory Sherwani', 'Aarav Fashions', '₹21,999', True),
    ]
    for name, seller, price, vis in data:
        badge = BADGE['active'].format('Featured') if vis else BADGE['inactive'].format('Hidden')
        rows.append(f'<td><div class="user-cell"><span class="thumb"><i class="bi bi-gem"></i></span><span><strong>{name}</strong></span></div></td><td>{seller}</td><td>{price}</td><td>{badge}</td><td>{acts()}</td>')
    return toolbar('Featured Couture — Weddings', 'Spotlighted couture pieces.', BTN_ADD) + table(
    ['Piece', 'Seller', 'Price', 'Status', 'Actions'], rows)

# ---------- CUSTOMISATION STUDIOS ----------
def customisation_studios():
    rows = []
    data = [
        ('Studio West — Mumbai', 'blouse_stitching', 'Mumbai', 'active', 86),
        ('Silk Studio — Bengaluru', 'lehenga_bespoke', 'Bengaluru', 'active', 64),
        ('Formal Room — Delhi', 'sherwani_fitting', 'Delhi', 'inactive', 22),
    ]
    for name, key, city, st, jobs in data:
        badge = BADGE['active'] if st == 'active' else BADGE['inactive']
        rows.append(f'<td><strong>{name}</strong></td><td><span class="badge badge-gold">{key}</span></td><td>{city}</td><td>{jobs}</td><td>{badge}</td><td>{acts()}</td>')
    return toolbar('Studios — Customise', 'Customisation studios and their specialities.', BTN_ADD) + table(
    ['Studio', 'Studio Key', 'City', 'Jobs', 'Status', 'Actions'], rows)

# ---------- CUSTOMISATION OPTIONS ----------
def customisation_options():
    brands = ''.join(f'<span class="filter-pill">{b}</span>' for b in ['Sitara Silks', 'Rajwadi', 'Kanchi', 'Bhagalpur'])
    fabrics = ''.join(f'<span class="filter-pill">{f}</span>' for f in ['Silk', 'Georgette', 'Chanderi', 'Linen', 'Velvet'])
    swatches = ''.join(
        f'<span class="swatch"><i style="background:{c}"></i>{n}</span>'
        for c, n in [('#B03A48', 'Rani'), ('#1F3B57', 'Indigo'), ('#2E5E43', 'Emerald'), ('#C9A24B', 'Gold'), ('#6B2D5C', 'Plum')])
    return toolbar('Options & Swatches', 'Brands, fabrics and colour swatches for customisation.', BTN_ADD) + '''
<div class="card" style="margin-bottom:16px"><div class="card-header"><h4>Brands</h4></div><div class="card-body"><div class="filter-bar">''' + brands + '''</div></div></div>
<div class="card" style="margin-bottom:16px"><div class="card-header"><h4>Fabrics</h4></div><div class="card-body"><div class="filter-bar">''' + fabrics + '''</div></div></div>
<div class="card"><div class="card-header"><h4>Colour Swatches</h4></div><div class="card-body">
''' + swatches + '''
</div></div>'''

# ---------- BESPOKE ORDERS ----------
def bespoke_orders():
    rows = []
    data = [
        ('BS-411', 'Ananya Iyer', 'Bridal Lehenga', 'in_progress', 'Delivery 28 Sep'),
        ('BS-410', 'Kavya Reddy', 'Sherwani + Churidar', 'quoted', 'Quote QT-3340 accepted'),
        ('BS-409', 'Neha Kulkarni', 'Gown re-design', 'pending', 'Awaiting measurements'),
        ('BS-408', 'Ritu Deshpande', 'Saree pre-stitching', 'completed', 'Picked up 12 Aug'),
    ]
    for bid, cust, job, st, note in data:
        badge = {'pending': BADGE['pending'], 'quoted': BADGE['gold'].format('Quoted'),
                 'in_progress': BADGE['processing'], 'completed': BADGE['success'].format('Completed')}[st]
        rows.append(f'<td><strong>{bid}</strong></td><td>{cust}</td><td>{job}</td><td class="text-muted">{note}</td><td>{badge}</td><td>{acts(edit=False)}</td>')
    return toolbar('Bespoke Orders', 'Made-to-measure custom orders.') + table(
    ['Order', 'Customer', 'Job', 'Note', 'Status', 'Actions'], rows)

# ---------- JEWELLERY COLLECTIONS ----------
def jewellery_collections():
    rows = []
    data = [
        ('JC-7', 'The Kundan Edit', 'kundan', 12, True),
        ('JC-6', 'Temple Gold', 'temple', 9, True),
        ('JC-5', 'Everyday Minimal', 'minimal', 15, True),
        ('JC-4', 'Pearl Stories', 'pearl', 8, False),
    ]
    for cid, name, key, count, vis in data:
        badge = BADGE['active'].format('Visible') if vis else BADGE['inactive'].format('Hidden')
        rows.append(f'<td><strong>{name}</strong></td><td><span class="badge badge-gold">{key}</span></td><td>{count}</td><td>{badge}</td><td>{acts()}</td>')
    return toolbar('Collections — Jewellery Vault', 'Jewellery collection groupings.', BTN_ADD) + table(
    ['Collection', 'Key', 'Items', 'Visibility', 'Actions'], rows)

# ---------- JEWELLERY CATEGORIES ----------
def jewellery_categories():
    rows = []
    data = [
        ('Necklaces', 'necklace', 'bi-gem', 18, True),
        ('Earrings', 'earring', 'bi-circle-half', 24, True),
        ('Bangles', 'bangle', 'bi-circle', 16, True),
        ('Rings', 'ring', 'bi-record-circle', 12, True),
        ('Anklets', 'anklet', 'bi-droplet', 6, False),
    ]
    for name, key, icon, count, vis in data:
        badge = BADGE['active'].format('Visible') if vis else BADGE['inactive'].format('Hidden')
        rows.append(f'<td><div class="user-cell"><span class="thumb"><i class="bi {icon}"></i></span><span><strong>{name}</strong></span></div></td><td><span class="badge badge-gold">{key}</span></td><td>{count}</td><td>{badge}</td><td>{acts()}</td>')
    return toolbar('Categories — Jewellery Vault', 'Jewellery product categories.', BTN_ADD) + table(
    ['Category', 'Key', 'Products', 'Visibility', 'Actions'], rows)

# ---------- JEWELLERY PRODUCTS ----------
def jewellery_products():
    rows = []
    data = [
        ('Emerald Kundan Set', 'kundan', '₹18,999', '₹24,999', 4),
        ('Temple Lakshmi Haar', 'temple', '₹32,499', '₹41,999', 2),
        ('Baroque Pearl Choker', 'pearl', '₹8,999', '₹11,499', 9),
        ('Gold Hoop Earrings', 'minimal', '₹2,499', '₹3,299', 21),
    ]
    for name, cat, price, mrp, stock in data:
        rows.append(f'<td><div class="user-cell"><span class="thumb"><i class="bi bi-gem"></i></span><span><strong>{name}</strong></span></div></td>'
                    f'<td><span class="badge badge-gold">{cat}</span></td><td>{price}</td><td><s>{mrp}</s></td><td>{stock}</td><td>{BADGE["active"]}</td><td>{acts()}</td>')
    return toolbar('Products — Jewellery Vault', 'Fine and imitation jewellery listings.', BTN_ADD) + table(
    ['Product', 'Category', 'Price', 'MRP', 'Stock', 'Status', 'Actions'], rows)

# ---------- VIP EVENTS CALENDAR ----------
def events_vip():
    rows = []
    data = [
        ('Monsoon Bridal Edit', 'Mumbai', '05 Sep 2026 · 6 PM', 'published', 320),
        ('Festive Pop-Up', 'Pune', '19 Sep 2026 · 4 PM', 'published', 210),
        ('Designers Meet', 'Delhi', '03 Oct 2026 · 5 PM', 'draft', 0),
        ('Kundan Trunk Show', 'Mumbai', '18 Oct 2026 · 5 PM', 'draft', 0),
    ]
    for name, city, when, st, rsvps in data:
        badge = BADGE['active'].format('Published') if st == 'published' else BADGE['pending'].format('Draft')
        rows.append(f'<td><strong>{name}</strong></td><td>{city}</td><td>{when}</td><td>{rsvps}</td><td>{badge}</td><td>{acts()}</td>')

    event_days = {5: 'Bridal Edit', 19: 'Pop-Up', 18: 'Trunk Show'}
    cal = ['<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;font-size:0.75rem;text-align:center">']
    for wd in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']:
        cal.append(f'<strong>{wd}</strong>')
    cal.append('<span></span>')
    for day in range(1, 31):
        if day in event_days:
            cal.append(f'<div style="padding:14px 4px;border:1px solid var(--gold);border-radius:8px;background:rgba(201,162,75,0.12);font-weight:600">{day}<span style="display:block;font-size:0.6rem">{event_days[day]}</span></div>')
        else:
            cal.append(f'<div style="padding:14px 4px;border:1px solid var(--border-light);border-radius:8px">{day}</div>')
    cal.append('</div>')

    return toolbar('Event Calendar — VIP Events', 'VIP event schedule.', BTN_ADD) + (
        '<div class="card" style="margin-bottom:16px"><div class="card-header"><h4>September 2026</h4></div><div class="card-body">'
        + ''.join(cal) + '</div></div>'
        + table(['Event', 'City', 'When', 'RSVPs', 'Status', 'Actions'], rows))

# ---------- EVENT RSVPS ----------
def event_rsvps():
    rows = []
    data = [
        ('Monsoon Bridal Edit', 'Priya Sharma', 'priya.sharma@gmail.com', 2, 'confirmed'),
        ('Monsoon Bridal Edit', 'Ananya Iyer', 'ananya.iyer@gmail.com', 1, 'confirmed'),
        ('Festive Pop-Up', 'Neha Kulkarni', 'neha.k@gmail.com', 3, 'waitlist'),
        ('Festive Pop-Up', 'Kavya Reddy', 'kavya.r@gmail.com', 1, 'confirmed'),
    ]
    for event, name, email, guests, st in data:
        badge = BADGE['success'].format('Confirmed') if st == 'confirmed' else BADGE['warning'].format('Waitlist')
        rows.append(f'<td><strong>{event}</strong></td><td>{uc(name[0], name, email)}</td><td>{guests}</td><td>{badge}</td><td>{acts(view=False, edit=False)}</td>')
    return toolbar('RSVPs — VIP Events', 'Guest list per event.', BTN_EXPORT) + table(
    ['Event', 'Guest', 'Party Size', 'Status', 'Actions'], rows)

# ---------- STYLIST BOOKINGS ----------
def stylist_bookings():
    rows = []
    data = [
        ('SB-778', 'Priya Sharma', 'Aditi Rao (Stylist)', '20 Aug 2026 · 11:00 AM', 'confirmed'),
        ('SB-777', 'Kavya Reddy', 'Aditi Rao (Stylist)', '22 Aug 2026 · 4:00 PM', 'pending'),
        ('SB-776', 'Ananya Iyer', 'Farah K (Bridal)', '29 Aug 2026 · 12:00 PM', 'confirmed'),
    ]
    for bid, cust, stylist, when, st in data:
        badge = BADGE['success'].format('Confirmed') if st == 'confirmed' else BADGE['pending']
        rows.append(f'<td><strong>{bid}</strong></td><td>{cust}</td><td>{stylist}</td><td>{when}</td><td>{badge}</td><td>{acts(edit=False)}</td>')
    return toolbar('Bookings — Stylist', 'Personal styling appointments.', BTN_ADD) + table(
    ['ID', 'Customer', 'Stylist', 'Slot', 'Status', 'Actions'], rows)

# ---------- SETTINGS: GENERAL ----------
def settings_general():
    return toolbar('General Settings', 'Core store configuration.', BTN_SAVE) + '''
<div class="card"><div class="card-header"><h4>Store</h4></div><div class="card-body">
    <div class="form-row">
        <div class="form-group"><label>Store Name</label><input class="form-control" value="TATITO Fashions"></div>
        <div class="form-group"><label>Support Email</label><input class="form-control" value="care@tatitofashions.com"></div>
    </div>
    <div class="form-row">
        <div class="form-group"><label>Support Phone</label><input class="form-control" value="+91 1800 202 4040"></div>
        <div class="form-group"><label>Timezone</label><select class="form-control"><option>Asia/Kolkata (IST)</option></select></div>
    </div>
    <div class="form-row">
        <div class="form-group"><label>Default Currency</label><select class="form-control"><option>INR ₹</option></select></div>
        <div class="form-group"><label>Weight Unit</label><select class="form-control"><option>Kilogram</option></select></div>
    </div>
</div></div>
<div class="card" style="margin-top:16px"><div class="card-header"><h4>Orders</h4></div><div class="card-body">
''' + toggle('Allow Guest Checkout', '', True) + '''
''' + toggle('Auto-approve COD orders', '', False) + '''
''' + toggle('Send order-SMS to customers', '', True) + '''
</div></div>'''

# ---------- SETTINGS: PAYMENT SETUP ----------
def payment_setup():
    return toolbar('Payment Setup', 'Gateways and COD configuration.', BTN_SAVE) + '''
<div class="card"><div class="card-header"><h4>Gateways</h4></div><div class="card-body">
''' + toggle('Razorpay (UPI · Cards · NetBanking)', 'Payments captured on order', True) + '''
''' + toggle('Cashfree', '', False) + '''
''' + toggle('Cash on Delivery', 'Pay on delivery', True) + '''
''' + toggle('Bank Transfer (Manual)', 'Show UPI/NEFT instructions', False) + '''
</div></div>
<div class="card" style="margin-top:16px"><div class="card-header"><h4>Razorpay Keys</h4></div><div class="card-body">
    <div class="form-row">
        <div class="form-group"><label>Key ID</label><input class="form-control" placeholder="rzp_live_••••"></div>
        <div class="form-group"><label>Key Secret</label><input class="form-control" type="password" placeholder="••••••••••••"></div>
    </div>
    <p class="text-muted" style="font-size:0.75rem"><i class="bi bi-shield-lock"></i> Secrets are stored encrypted and never shown again.</p>
</div></div>'''

# ---------- SETTINGS: CURRENCIES ----------
def currencies():
    rows = []
    data = [
        ('INR', '₹', 'Indian Rupee', 'en_IN', True, 1.0),
        ('USD', '$', 'US Dollar', 'en_US', False, 0.012),
        ('AED', 'د.إ', 'UAE Dirham', 'ar_AE', False, 0.044),
        ('GBP', '£', 'Pound Sterling', 'en_GB', False, 0.0094),
    ]
    for code, sym, name, locale, default, rate in data:
        badge = BADGE['gold'].format('Default') if default else BADGE['inactive'].format('Disabled')
        rows.append(f'<td><strong>{code}</strong></td><td>{sym}</td><td>{name}</td><td>{locale}</td><td>{rate}</td><td>{badge}</td><td>{acts()}</td>')
    return toolbar('Currencies', 'Supported display currencies.', BTN_ADD) + table(
    ['Code', 'Symbol', 'Currency', 'Locale', 'Rate vs INR', 'Status', 'Actions'], rows)

# ---------- SETTINGS: LANGUAGES ----------
def languages():
    rows = []
    data = [
        ('en', 'English', 'Default interface language', True, 100),
        ('hi', 'हिन्दी', 'Hindi storefront', False, 72),
        ('mr', 'मराठी', 'Marathi storefront', False, 64),
    ]
    for code, name, note, default, pct in data:
        badge = BADGE['gold'].format('Default') if default else BADGE['inactive'].format('Disabled')
        rows.append(f'<td><strong>{code}</strong></td><td>{name}</td><td class="text-muted">{note}</td><td>{pct}%</td><td>{badge}</td><td>{acts()}</td>')
    return toolbar('Languages', 'Interface and storefront languages.', BTN_ADD) + '''
<div class="card" style="margin-top:16px"><div class="card-header"><h4>Translation Coverage — हिन्दी</h4></div><div class="card-body">
    <div class="toggle-row"><div class="toggle-info"><div class="ti-title">Storefront strings</div></div><span>612 / 850</span></div>
    <div class="progress-bar" style="margin-top:8px"><div class="progress-fill" style="width:72%"></div></div>
    <br><button class="btn btn-ghost"><i class="bi bi-pencil"></i> Continue Translating</button>
</div></div>
''' + table(['Code', 'Language', 'Note', 'Translated', 'Status', 'Actions'], rows)

# ---------- SETTINGS: EMAIL TEMPLATES ----------
def email_templates():
    rows = []
    data = [
        ('Order Confirmation', 'order_confirm', 'Customer', 'Order placed', True),
        ('Shipping Update', 'ship_update', 'Customer', 'In transit', True),
        ('Refund Processed', 'refund_done', 'Customer', 'Refund credit', True),
        ('Seller Welcome', 'seller_welcome', 'Seller', 'Approval granted', True),
        ('Password Reset', 'reset_link', 'All', 'Reset link', False),
    ]
    for name, key, audience, trigger, on in data:
        badge = BADGE['active'].format('Enabled') if on else BADGE['inactive'].format('Disabled')
        rows.append(f'<td><strong>{name}</strong></td><td><span class="badge badge-gold">{key}</span></td><td>{audience}</td><td class="text-muted">{trigger}</td><td>{badge}</td><td>{acts()}</td>')
    return toolbar('Email Templates', 'Transactional email designs.', BTN_ADD) + '''
<div class="card" style="margin-top:16px"><div class="card-header"><h4>Preview — Order Confirmation</h4></div><div class="card-body">
    <div style="border:1px solid var(--border-light);border-radius:var(--radius-md);padding:24px;max-width:520px;margin:auto;background:#fffdf8">
        <div style="text-align:center;margin-bottom:16px"><span style="font-family:var(--font-display);color:var(--gold);font-weight:700;letter-spacing:1px">TATITO</span></div>
        <p style="font-size:0.9rem">Hi Priya,</p>
        <p style="font-size:0.85rem;color:var(--text-muted)">Thank you for your order <strong>#TF-1042</strong>. We are getting it ready.</p>
        <div class="detail-row"><span class="label">Banarasi Silk Saree × 1</span><span class="value">₹2,999</span></div>
        <div class="detail-row"><span class="label">Shipping</span><span class="value">Free</span></div>
        <div class="detail-row"><span class="label">Total</span><span class="value">₹2,999</span></div>
        <div style="text-align:center;margin-top:18px"><button class="btn btn-primary btn-sm">Track Order</button></div>
    </div>
</div></div><br>
''' + table(['Template', 'Key', 'Audience', 'Trigger', 'Status', 'Actions'], rows)

CONTENT_3 = {
    'cms': cms,
    'website-header': website_header,
    'website-footer': website_footer,
    'websiteSetup': websiteSetup,
    'homePageSettings': homePageSettings,
    'mediaManager': mediaManager,
    'home-collections': home_collections,
    'home-video-banners': home_video_banners,
    'home-dynamic-sections': home_dynamic_sections,
    'wedding-collections': wedding_collections,
    'wedding-banners': wedding_banners,
    'wedding-featured': wedding_featured,
    'customisation-studios': customisation_studios,
    'customisation-options': customisation_options,
    'bespoke-orders': bespoke_orders,
    'jewellery-collections': jewellery_collections,
    'jewellery-categories': jewellery_categories,
    'jewellery-products': jewellery_products,
    'events-vip': events_vip,
    'event-rsvps': event_rsvps,
    'stylist-bookings': stylist_bookings,
    'settings': settings_general,
    'payment-setup': payment_setup,
    'currencies': currencies,
    'languages': languages,
    'emailTemplates': email_templates,
}
