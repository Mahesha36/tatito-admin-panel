#!/usr/bin/env python3
"""Module content definitions — part 1: Dashboard, Catalog, Sales, Members."""

BADGE = {
    'success': '<span class="badge badge-success">{}</span>',
    'warning': '<span class="badge badge-warning">{}</span>',
    'danger': '<span class="badge badge-danger">{}</span>',
    'info': '<span class="badge badge-info">{}</span>',
    'gold': '<span class="badge badge-gold">{}</span>',
    'pending': '<span class="badge badge-warning">Pending</span>',
    'paid': '<span class="badge badge-success">Paid</span>',
    'processing': '<span class="badge badge-info">Processing</span>',
    'shipped': '<span class="badge badge-info">Shipped</span>',
    'delivered': '<span class="badge badge-success">Delivered</span>',
    'cancelled': '<span class="badge badge-danger">Cancelled</span>',
    'active': '<span class="badge badge-success">Active</span>',
    'inactive': '<span class="badge badge-secondary">Inactive</span>',
    'confirmed': '<span class="badge badge-success">Confirmed</span>',
    'booked': '<span class="badge badge-success">Booked</span>',
}

def stat(icon, color, label, value, sub=''):
    sub_html = f'<div class="stat-sub">{sub}</div>' if sub else ''
    return (f'<div class="stat-card"><div class="stat-icon {color}"><i class="bi {icon}"></i></div>'
            f'<div class="stat-info"><p>{label}</p><h3>{value}</h3>{sub_html}</div></div>')

def toolbar(title, sub, actions=''):
    a = f'<div class="toolbar-actions">{actions}</div>' if actions else ''
    return f'<div class="page-toolbar"><div><h3>{title}</h3><p class="text-muted">{sub}</p></div>{a}</div>'

BTN_ADD = '<button class="btn btn-primary"><i class="bi bi-plus-lg"></i> Add New</button>'
BTN_EXPORT = '<button class="btn btn-ghost"><i class="bi bi-download"></i> Export</button>'
BTN_SAVE = '<button class="btn btn-primary"><i class="bi bi-check-lg"></i> Save Changes</button>'

def acts(view=True, edit=True, extra='', delete=True):
    s = ''
    if view: s += '<button class="action-btn view" title="View"><i class="bi bi-eye"></i></button> '
    if edit: s += '<button class="action-btn edit" title="Edit"><i class="bi bi-pencil"></i></button> '
    if extra: s += extra + ' '
    if delete: s += '<button class="action-btn del" title="Delete"><i class="bi bi-trash"></i></button>'
    return s

def table(headers, rows):
    h = ''.join(f'<th>{x}</th>' for x in headers)
    b = ''.join(f'<tr>{r}</tr>' for r in rows)
    return (f'<div class="card"><div class="card-body"><table class="table table-hover">'
            f'<thead><tr>{h}</tr></thead><tbody>{b}</tbody></table></div></div>')

def uc(avatar_text, name, sub, cls=''):
    return (f'<div class="user-cell"><span class="avatar {cls}">{avatar_text}</span>'
            f'<span>{name}<br><span class="uc-sub">{sub}</span></span></div>')

# ---------- DASHBOARD ----------
def dashboard():
    content = toolbar('Dashboard', 'Welcome back, Super Admin — here is what is happening today.') + '''
<div class="stat-grid">
''' + stat('bi-currency-rupee', 'gold', 'Total Revenue', '₹12,48,930', '+8.2% vs last month') + '''
''' + stat('bi-bag-check', 'blue', 'Total Orders', '1,248', '18 pending') + '''
''' + stat('bi-box-seam', 'purple', 'Products', '39', '5 out of stock') + '''
''' + stat('bi-shop', 'green', 'Active Sellers', '12', '2 awaiting approval') + '''
''' + stat('bi-people', 'orange', 'Customers', '10', '+3 this week') + '''
</div>
<div class="card" style="margin-bottom:16px">
    <div class="card-header"><h4>Revenue — Last 12 Months</h4></div>
    <div class="card-body">
        <div class="chart-box">
            <div class="chart-bar" style="height:35%"></div>
            <div class="chart-bar" style="height:48%"></div>
            <div class="chart-bar" style="height:42%"></div>
            <div class="chart-bar" style="height:60%"></div>
            <div class="chart-bar" style="height:55%"></div>
            <div class="chart-bar" style="height:72%"></div>
            <div class="chart-bar" style="height:66%"></div>
            <div class="chart-bar" style="height:80%"></div>
            <div class="chart-bar" style="height:74%"></div>
            <div class="chart-bar" style="height:88%"></div>
            <div class="chart-bar" style="height:82%"></div>
            <div class="chart-bar" style="height:96%"></div>
        </div>
    </div>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
    <div class="card"><div class="card-header"><h4>Recent Orders</h4></div><div class="card-body">
''' + table(
    ['Order', 'Customer', 'Amount', 'Status'],
    [
        '<td><strong>#TF-1042</strong></td><td>Priya Sharma</td><td>₹4,499</td><td>' + BADGE['processing'] + '</td>',
        '<td><strong>#TF-1041</strong></td><td>Ananya Iyer</td><td>₹12,999</td><td>' + BADGE['shipped'] + '</td>',
        '<td><strong>#TF-1040</strong></td><td>Neha Kulkarni</td><td>₹2,199</td><td>' + BADGE['delivered'] + '</td>',
        '<td><strong>#TF-1039</strong></td><td>Kavya Reddy</td><td>₹8,750</td><td>' + BADGE['pending'] + '</td>',
    ]) + '''
    </div></div>
    <div class="card"><div class="card-header"><h4>Latest Sellers</h4></div><div class="card-body">
''' + table(
    ['Seller', 'City', 'Products', 'Status'],
    [
        '<td>' + uc('R', 'Rajesh Textiles', 'Mumbai') + '</td><td>8</td><td>' + BADGE['active'] + '</td>',
        '<td>' + uc('M', 'Meera Silks', 'Bengaluru', 'blue') + '</td><td>6</td><td>' + BADGE['active'] + '</td>',
        '<td>' + uc('A', 'Aarav Fashions', 'Delhi', 'green') + '</td><td>5</td><td>' + BADGE['pending'] + '</td>',
    ]) + '''
    </div></div>
</div>'''
    return content

# ---------- REPORTS ----------
def reports():
    return toolbar('Reports & Analytics', 'Business performance across all channels.',
                   BTN_EXPORT + ' <button class="btn btn-ghost"><i class="bi bi-calendar3"></i> Last 30 Days</button>') + '''
<div class="stat-grid">
''' + stat('bi-graph-up', 'gold', 'Gross Sales', '₹18,62,400', '+12.4%') + '''
''' + stat('bi-graph-down-arrow', 'blue', 'Refunds', '₹48,120', '-3.1%') + '''
''' + stat('bi-percent', 'purple', 'Avg Discount', '14.2%', '+0.8%') + '''
''' + stat('bi-star-half', 'green', 'Avg Rating', '4.6 / 5', 'from 214 reviews') + '''
</div>
<div class="tabs"><a class="tab active">Sales</a><a class="tab">Products</a><a class="tab">Customers</a><a class="tab">Sellers</a><a class="tab">Categories</a></div>
<div class="card" style="margin-bottom:16px"><div class="card-header"><h4>Sales by Category</h4></div><div class="card-body">
''' + table(
    ['Category', 'Orders', 'Revenue', 'Avg Order Value', 'Share'],
    [
        '<td><strong>Women Ethnic</strong></td><td>412</td><td>₹8,24,000</td><td>₹2,000</td><td>44%</td>',
        '<td><strong>Men Formal</strong></td><td>268</td><td>₹4,02,000</td><td>₹1,500</td><td>22%</td>',
        '<td><strong>Jewellery</strong></td><td>186</td><td>₹3,72,000</td><td>₹2,000</td><td>20%</td>',
        '<td><strong>Kids Wear</strong></td><td>142</td><td>₹1,42,000</td><td>₹1,000</td><td>8%</td>',
        '<td><strong>Wedding Couture</strong></td><td>40</td><td>₹1,22,400</td><td>₹3,060</td><td>6%</td>',
    ]) + '''
</div></div>
<div class="card"><div class="card-header"><h4>Top Products</h4></div><div class="card-body">
''' + table(
    ['#', 'Product', 'Category', 'Units Sold', 'Revenue'],
    [
        '<td>1</td><td><strong>Banarasi Silk Saree</strong></td><td>Women Ethnic</td><td>86</td><td>₹2,58,000</td>',
        '<td>2</td><td><strong>Emerald Kundan Set</strong></td><td>Jewellery</td><td>64</td><td>₹1,92,000</td>',
        '<td>3</td><td><strong>Linen Nehru Jacket</strong></td><td>Men Formal</td><td>52</td><td>₹78,000</td>',
        '<td>4</td><td><strong>Anarkali Gown</strong></td><td>Wedding Couture</td><td>31</td><td>₹93,000</td>',
    ]) + '''
</div></div>'''

# ---------- TRACKING ----------
def tracking():
    rows = []
    data = [
        ('#TF-1042', 'Priya Sharma', 'Delhivery', 'DEL-88231', 'processing', 45),
        ('#TF-1041', 'Ananya Iyer', 'Blue Dart', 'BD-77410', 'shipped', 75),
        ('#TF-1040', 'Neha Kulkarni', 'Ecom Express', 'EE-55102', 'delivered', 100),
        ('#TF-1038', 'Kavya Reddy', 'Delhivery', 'DEL-87999', 'shipped', 60),
    ]
    for oid, cust, courier, tid, st, prog in data:
        rows.append(
            f'<td><strong>{oid}</strong></td><td>{cust}</td><td>{courier}</td><td>{tid}</td>'
            f'<td>{BADGE[st]}</td>'
            f'<td style="min-width:160px"><div class="progress-bar"><div class="progress-fill" style="width:{prog}%"></div></div></td>'
            f'<td>{acts(delete=False)}</td>')
    return toolbar('Live Order Tracking', 'Shipment status across all couriers.') + table(
        ['Order ID', 'Customer', 'Courier', 'Tracking #', 'Status', 'Progress', 'Actions'], rows) + '''
<div class="card" style="margin-top:16px"><div class="card-header"><h4>Shipment Timeline — #TF-1041</h4></div><div class="card-body">
    <div class="timeline">
        <div class="timeline-item"><div class="timeline-dot done"></div><div class="tl-title">Order Placed</div><div class="tl-sub">12 Aug 2026, 10:24 AM</div></div>
        <div class="timeline-item"><div class="timeline-dot done"></div><div class="tl-title">Payment Confirmed</div><div class="tl-sub">12 Aug 2026, 10:26 AM</div></div>
        <div class="timeline-item"><div class="timeline-dot done"></div><div class="tl-title">Packed by Seller</div><div class="tl-sub">12 Aug 2026, 4:40 PM</div></div>
        <div class="timeline-item"><div class="timeline-dot"></div><div class="tl-title">In Transit — Mumbai Hub</div><div class="tl-sub">13 Aug 2026, 6:12 AM</div></div>
        <div class="timeline-item"><div class="timeline-dot"></div><div class="tl-title">Out for Delivery</div><div class="tl-sub">Expected 15 Aug</div></div>
    </div>
</div></div>'''

# ---------- CATEGORIES ----------
def categories():
    return toolbar('Categories', '3-level category tree powering storefront navigation.', BTN_ADD) + '''
<div class="card"><div class="card-body">
<div class="cat-tree">
    <div class="cat-row">
        <span class="cat-name"><i class="bi bi-folder2" style="color:var(--gold)"></i> <span class="cat-name-main">Women</span></span>
        <span class="cat-badge">3 sub-categories · 14 products</span>
        <span class="cat-actions">''' + acts() + '''</span>
    </div>
    <div class="cat-tree-children">
        <div class="cat-row"><span class="cat-name"><i class="bi bi-folder" style="color:var(--gold)"></i> <span class="cat-name-main">Ethnic Wear</span></span><span class="cat-badge">2 sub-categories · 8 products</span><span class="cat-actions">''' + acts() + '''</span></div>
        <div class="cat-tree-children">
            <div class="cat-row"><span class="cat-name"><i class="bi bi-file-earmark" style="color:var(--text-muted)"></i> <span class="cat-name-main">Sarees</span></span><span class="cat-badge">5 products</span><span class="cat-actions">''' + acts() + '''</span></div>
            <div class="cat-row"><span class="cat-name"><i class="bi bi-file-earmark" style="color:var(--text-muted)"></i> <span class="cat-name-main">Kurtis</span></span><span class="cat-badge">3 products</span><span class="cat-actions">''' + acts() + '''</span></div>
        </div>
        <div class="cat-row"><span class="cat-name"><i class="bi bi-folder" style="color:var(--gold)"></i> <span class="cat-name-main">Western Wear</span></span><span class="cat-badge">6 products</span><span class="cat-actions">''' + acts() + '''</span></div>
    </div>
    <div class="cat-row"><span class="cat-name"><i class="bi bi-folder2" style="color:var(--gold)"></i> <span class="cat-name-main">Men</span></span><span class="cat-badge">2 sub-categories · 11 products</span><span class="cat-actions">''' + acts() + '''</span></div>
    <div class="cat-tree-children">
        <div class="cat-row"><span class="cat-name"><i class="bi bi-folder" style="color:var(--gold)"></i> <span class="cat-name-main">Formal</span></span><span class="cat-badge">6 products</span><span class="cat-actions">''' + acts() + '''</span></div>
        <div class="cat-row"><span class="cat-name"><i class="bi bi-folder" style="color:var(--gold)"></i> <span class="cat-name-main">Casual</span></span><span class="cat-badge">5 products</span><span class="cat-actions">''' + acts() + '''</span></div>
    </div>
    <div class="cat-row"><span class="cat-name"><i class="bi bi-folder2" style="color:var(--gold)"></i> <span class="cat-name-main">Kids</span></span><span class="cat-badge">2 sub-categories · 9 products</span><span class="cat-actions">''' + acts() + '''</span></div>
    <div class="cat-row"><span class="cat-name"><i class="bi bi-folder2" style="color:var(--gold)"></i> <span class="cat-name-main">Jewellery</span></span><span class="cat-badge">3 sub-categories · 5 products</span><span class="cat-badge">Hub-linked</span></div>
</div>
</div></div>'''

# ---------- PRODUCTS ----------
def products():
    return toolbar('Products', 'All marketplace products across sellers.',
                   BTN_ADD + ' ' + BTN_EXPORT) + '''
<div class="stat-grid">
''' + stat('bi-bag', 'gold', 'Total Products', '39') + '''
''' + stat('bi-box-seam', 'green', 'In Stock', '34') + '''
''' + stat('bi-currency-rupee', 'blue', 'Avg Price', '₹3,240') + '''
''' + stat('bi-star', 'purple', 'Total Reviews', '214') + '''
</div>
<div class="filter-bar">
    <a class="filter-pill active">All <span class="pill-count">39</span></a>
    <a class="filter-pill">In Stock <span class="pill-count">34</span></a>
    <a class="filter-pill">Out of Stock <span class="pill-count">5</span></a>
    <a class="filter-pill">Featured <span class="pill-count">6</span></a>
    <a class="filter-pill">Women <span class="pill-count">14</span></a>
    <a class="filter-pill">Men <span class="pill-count">11</span></a>
    <a class="filter-pill">Kids <span class="pill-count">9</span></a>
</div>
''' + table(
    ['Product', 'Category', 'Seller', 'Price', 'MRP', 'Stock', 'Status', 'Actions'],
    [
        '<td><div class="user-cell"><span class="thumb"><i class="bi bi-image"></i></span><span><strong>Banarasi Silk Saree</strong><br><span class="uc-sub">SKU-1001</span></span></div></td><td>Women › Ethnic</td><td>Rajesh Textiles</td><td>₹2,999</td><td><s>₹3,999</s></td><td>12</td><td>' + BADGE['active'] + '</td><td>' + acts() + '</td>',
        '<td><div class="user-cell"><span class="thumb"><i class="bi bi-gem"></i></span><span><strong>Emerald Kundan Set</strong><br><span class="uc-sub">SKU-2011</span></span></div></td><td>Jewellery</td><td>Tatito Official</td><td>₹18,999</td><td><s>₹24,999</s></td><td>4</td><td>' + BADGE['active'] + '</td><td>' + acts() + '</td>',
        '<td><div class="user-cell"><span class="thumb"><i class="bi bi-suit-heart"></i></span><span><strong>Linen Nehru Jacket</strong><br><span class="uc-sub">SKU-1108</span></span></div></td><td>Men › Formal</td><td>Aarav Fashions</td><td>₹1,499</td><td><s>₹1,999</s></td><td>0</td><td>' + BADGE['danger'].format('Out of Stock') + '</td><td>' + acts() + '</td>',
        '<td><div class="user-cell"><span class="thumb"><i class="bi bi-dress"></i></span><span><strong>Anarkali Gown</strong><br><span class="uc-sub">SKU-1009</span></span></div></td><td>Women › Wedding</td><td>Meera Silks</td><td>₹2,999</td><td><s>₹4,499</s></td><td>8</td><td>' + BADGE['active'] + '</td><td>' + acts() + '</td>',
        '<td><div class="user-cell"><span class="thumb"><i class="bi bi-brightness-alt-high"></i></span><span><strong>Kids Lehenga Set</strong><br><span class="uc-sub">SKU-3011</span></span></div></td><td>Kids › Ethnic</td><td>Little Land</td><td>₹1,299</td><td><s>₹1,799</s></td><td>15</td><td>' + BADGE['active'] + '</td><td>' + acts() + '</td>',
    ])

# ---------- ORDERS ----------
def orders():
    rows = []
    data = [
        ('#TF-1042', 'Priya Sharma', 'Banarasi Silk Saree', 'Rajesh Textiles', '18 Aug 2026', 4499, 'paid', 'processing'),
        ('#TF-1041', 'Ananya Iyer', 'Emerald Kundan Set', 'Tatito Official', '17 Aug 2026', 12999, 'paid', 'shipped'),
        ('#TF-1040', 'Neha Kulkarni', 'Anarkali Gown', 'Meera Silks', '16 Aug 2026', 2999, 'cod', 'delivered'),
        ('#TF-1039', 'Kavya Reddy', 'Linen Nehru Jacket ×2', 'Aarav Fashions', '15 Aug 2026', 8750, 'pending', 'pending'),
        ('#TF-1038', 'Ritu Deshpande', 'Kids Lehenga Set', 'Little Land', '14 Aug 2026', 1299, 'paid', 'delivered'),
    ]
    for oid, cust, prod, seller, date, amt, pay, st in data:
        pay_badge = BADGE['paid'] if pay == 'paid' else (BADGE['warning'].format('COD Pending') if pay == 'cod' else BADGE['pending'])
        rows.append(f'<td><strong>{oid}</strong></td><td>{cust}</td><td>{prod}</td><td>{seller}</td>'
                    f'<td>{date}</td><td>₹{amt:,}</td><td>{pay_badge}</td><td>{BADGE[st]}</td><td>{acts()}</td>')
    return toolbar('Orders', 'All marketplace orders.', BTN_EXPORT) + '''
<div class="stat-grid">
''' + stat('bi-bag-check', 'gold', 'Total Orders', '1,248') + '''
''' + stat('bi-hourglass-split', 'blue', 'Pending', '18') + '''
''' + stat('bi-truck', 'purple', 'Shipped', '64') + '''
''' + stat('bi-check-circle', 'green', 'Delivered', '1,142') + '''
''' + stat('bi-x-circle', 'orange', 'Cancelled', '24') + '''
</div>
<div class="module-banner info"><i class="bi bi-bag-check"></i><span><strong>3</strong> order(s) from the live storefront</span></div>
''' + table(
    ['Order ID', 'Customer', 'Product', 'Seller', 'Date', 'Amount', 'Payment', 'Status', 'Actions'], rows)

# ---------- BOOKINGS ----------
def bookings():
    rows = []
    data = [
        ('BK-2088', 'Priya Sharma', 'Styling Consultation', '18 Aug 2026 · 11:00 AM', 'confirmed', 500),
        ('BK-2087', 'Ananya Iyer', 'Wedding Consultation', '19 Aug 2026 · 4:30 PM', 'confirmed', 1000),
        ('BK-2086', 'Neha Kulkarni', 'Photography — Studio', '22 Aug 2026 · 10:00 AM', 'pending', 3500),
        ('BK-2085', 'Kavya Reddy', 'Styling Consultation', '25 Aug 2026 · 2:00 PM', 'pending', 500),
    ]
    for bid, cust, svc, when, st, fee in data:
        rows.append(f'<td><strong>{bid}</strong></td><td>{cust}</td><td>{svc}</td><td>{when}</td>'
                    f'<td>₹{fee:,}</td><td>{BADGE[st]}</td><td>{acts(edit=False)}</td>')
    return toolbar('Bookings', 'Service and consultation bookings.', BTN_ADD) + table(
    ['Booking ID', 'Customer', 'Service', 'Slot', 'Fee', 'Status', 'Actions'], rows)

# ---------- PAYMENTS ----------
def payments():
    rows = []
    data = [
        ('PAY-5501', '#TF-1042', 'UPI', '₹4,499', '18 Aug 2026', 'success'),
        ('PAY-5500', '#TF-1041', 'Card', '₹12,999', '17 Aug 2026', 'success'),
        ('PAY-5499', '#TF-1039', 'COD', '—', '15 Aug 2026', 'pending'),
        ('PAY-5498', '#TF-1037', 'NetBanking', '₹2,199', '13 Aug 2026', 'success'),
        ('PAY-5497', '#TF-1035', 'UPI', '₹8,750', '11 Aug 2026', 'failed'),
    ]
    for pid, oid, method, amt, date, st in data:
        badge = BADGE['success'] if st == 'success' else (BADGE['pending'] if st == 'pending' else BADGE['danger'].format('Failed'))
        rows.append(f'<td><strong>{pid}</strong></td><td>{oid}</td><td>{method}</td><td>{amt}</td><td>{date}</td><td>{badge}</td><td>{acts(edit=False)}</td>')
    return toolbar('Payments', 'Payment transactions across gateways.', BTN_EXPORT) + '''
<div class="stat-grid">
''' + stat('bi-cash-coin', 'gold', 'Collected', '₹10,44,930') + '''
''' + stat('bi-wallet2', 'blue', 'Pending (COD)', '₹2,199') + '''
''' + stat('bi-x-octagon', 'danger', 'Failed', '₹8,750', '2 transactions') + '''
</div>
''' + table(['Payment ID', 'Order', 'Method', 'Amount', 'Date', 'Status', 'Actions'], rows)

# ---------- REFUNDS ----------
def refunds():
    rows = []
    data = [
        ('REF-318', '#TF-1031', 'Kavya Reddy', '₹1,499', 'approved', 'Refund to source'),
        ('REF-317', '#TF-1028', 'Ritu Deshpande', '₹2,999', 'processing', 'UPI refund'),
        ('REF-316', '#TF-1024', 'Ananya Iyer', '₹18,999', 'pending', 'Awaiting approval'),
        ('REF-315', '#TF-1019', 'Neha Kulkarni', '₹899', 'rejected', 'Outside window'),
    ]
    for rid, oid, cust, amt, st, note in data:
        badge = {'approved': BADGE['success'].format('Approved'), 'processing': BADGE['processing'],
                 'pending': BADGE['pending'], 'rejected': BADGE['cancelled']}[st]
        extra = '' if st != 'pending' else '<button class="action-btn edit" title="Approve"><i class="bi bi-check-lg"></i></button>'
        rows.append(f'<td><strong>{rid}</strong></td><td>{oid}</td><td>{cust}</td><td>{amt}</td><td>{badge}</td><td class="text-muted">{note}</td><td>{acts(view=False, delete=False, extra=extra)}</td>')
    return toolbar('Refunds', 'Customer refund requests.', '') + table(
    ['Refund ID', 'Order', 'Customer', 'Amount', 'Status', 'Note', 'Actions'], rows)

# ---------- APPROVALS ----------
def approvals():
    rows = []
    data = [
        ('AP-092', 'seller', 'Aarav Fashions', 'Delhi', 'GST + PAN verified', '18 Aug 2026'),
        ('AP-091', 'seller', 'Little Land', 'Pune', 'Awaiting GST', '17 Aug 2026'),
        ('AP-090', 'product', 'Pearl Choker — SKU-2014', 'Tatito Official', 'Hallmark cert pending', '16 Aug 2026'),
        ('AP-089', 'designer', 'Sneha Kapoor', 'Mumbai', 'Portfolio review', '15 Aug 2026'),
    ]
    for aid, typ, name, extra1, note, date in data:
        badge = BADGE['gold'].format(typ.title())
        rows.append(f'<td><strong>{aid}</strong></td><td>{badge}</td><td>{name}</td><td>{extra1}</td><td class="text-muted">{note}</td><td>{date}</td>'
                    f'<td><button class="action-btn edit" title="Approve"><i class="bi bi-check-lg"></i></button> <button class="action-btn del" title="Reject"><i class="bi bi-x-lg"></i></button></td>')
    return toolbar('Approvals', 'Seller, product and designer approval queue.') + '''
<div class="module-banner warn"><i class="bi bi-exclamation-triangle"></i><span><strong>4</strong> requests awaiting review</span></div>
''' + table(['ID', 'Type', 'Name', 'Detail', 'Note', 'Requested', 'Actions'], rows)

# ---------- USERS (Customers) ----------
def users():
    rows = []
    data = [
        ('PS', 'Priya Sharma', 'priya.sharma@gmail.com', '+91 98220 11223', 'Pune', 24, '₹1,12,400', 'active'),
        ('AI', 'Ananya Iyer', 'ananya.iyer@gmail.com', '+91 99870 33445', 'Mumbai', 31, '₹2,38,900', 'active'),
        ('NK', 'Neha Kulkarni', 'neha.k@gmail.com', '+91 90280 55667', 'Nashik', 12, '₹18,200', 'active'),
        ('KR', 'Kavya Reddy', 'kavya.r@gmail.com', '+91 96400 77889', 'Hyderabad', 9, '₹64,750', 'active'),
        ('RD', 'Ritu Deshpande', 'ritu.d@gmail.com', '+91 97650 99001', 'Nagpur', 5, '₹12,980', 'blocked'),
    ]
    for ini, name, email, phone, city, orders, spent, st in data:
        badge = BADGE['active'] if st == 'active' else BADGE['danger'].format('Blocked')
        cls = 'blue' if ini == 'AI' else ('green' if ini == 'NK' else ('purple' if ini == 'KR' else ''))
        rows.append(f'<td>{uc(ini, name, email, cls)}</td><td>{phone}</td><td>{city}</td><td>{orders}</td><td>{spent}</td><td>{badge}</td><td>{acts()}</td>')
    return toolbar('Customers', 'Registered marketplace customers.', BTN_ADD + ' ' + BTN_EXPORT) + table(
    ['Customer', 'Phone', 'City', 'Orders', 'Lifetime Spend', 'Status', 'Actions'], rows)

# ---------- SELLERS ----------
def sellers():
    rows = []
    data = [
        ('RT', 'Rajesh Textiles', 'Sarees & Ethnic', 'Mumbai', 'approved', 8, '₹4,12,000'),
        ('MS', 'Meera Silks', 'Silk & Wedding', 'Bengaluru', 'approved', 6, '₹2,86,500'),
        ('LL', 'Little Land', 'Kids Wear', 'Pune', 'approved', 5, '₹1,24,300'),
        ('AF', 'Aarav Fashions', 'Men Formal', 'Delhi', 'pending', 4, '₹0'),
    ]
    for ini, name, cat, city, st, prods, rev in data:
        badge = BADGE['active'].format('Approved') if st == 'approved' else BADGE['pending']
        cls = 'blue' if ini == 'MS' else ('green' if ini == 'LL' else ('purple' if ini == 'AF' else ''))
        rows.append(f'<td>{uc(ini, name, cat, cls)}</td><td>{city}</td><td>{prods}</td><td>{rev}</td><td>{badge}</td><td>{acts()}</td>')
    return toolbar('Sellers', 'Marketplace sellers and their performance.', BTN_ADD) + '''
<div class="stat-grid">
''' + stat('bi-shop', 'gold', 'Total Sellers', '12') + '''
''' + stat('bi-patch-check', 'green', 'Approved', '10') + '''
''' + stat('bi-hourglass', 'blue', 'Pending', '2') + '''
</div>
''' + table(['Seller', 'City', 'Products', 'Revenue', 'Status', 'Actions'], rows)

# ---------- DESIGNERS ----------
def designers():
    rows = []
    data = [
        ('SK', 'Sneha Kapoor', 'Couture & Bridal', 'Mumbai', 'active', 14),
        ('RV', 'Rahul Verma', 'Men Formal', 'Delhi', 'active', 9),
        ('MN', 'Meera Nair', 'Indo-Western', 'Kochi', 'inactive', 6),
    ]
    for ini, name, spec, city, st, collections in data:
        badge = BADGE['active'] if st == 'active' else BADGE['inactive']
        cls = 'blue' if ini == 'RV' else ('green' if ini == 'MN' else '')
        rows.append(f'<td>{uc(ini, name, spec, cls)}</td><td>{city}</td><td>{collections}</td><td>{badge}</td><td>{acts()}</td>')
    return toolbar('Designers', 'Boutique designers on the platform.', BTN_ADD) + table(
    ['Designer', 'City', 'Collections', 'Status', 'Actions'], rows)

CONTENT_1 = {
    'dashboard': dashboard,
    'reports': reports,
    'tracking': tracking,
    'categories': categories,
    'products': products,
    'orders': orders,
    'bookings': bookings,
    'payments': payments,
    'refunds': refunds,
    'approvals': approvals,
    'users': users,
    'sellers': sellers,
    'designers': designers,
}
