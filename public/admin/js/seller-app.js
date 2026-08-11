/* ============================================
   TATITO FASHIONS — Seller Dashboard Controller
   Same theme, fonts, colors as admin panel
   ============================================ */

const SellerApp = {
    session: null,
    seller: null,
    currentPage: null,
    charts: {},

    // Navigation — seller-specific
    navConfig: [
        { section: 'Main', items: [
            { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
        ]},
        { section: 'Catalog', items: [
            { id: 'products', label: 'My Products', icon: 'bi-bag' },
            { id: 'orders', label: 'Orders', icon: 'bi-cart-check' },
        ]},
        { section: 'Finance', items: [
            { id: 'earnings', label: 'Earnings & Payouts', icon: 'bi-wallet2' },
        ]},
        { section: 'Engagement', items: [
            { id: 'reviews', label: 'Reviews', icon: 'bi-star' },
            { id: 'notifications', label: 'Notifications', icon: 'bi-bell' },
        ]},
        { section: 'Account', items: [
            { id: 'profile', label: 'Store Profile', icon: 'bi-shop' },
        ]},
    ],

    pages: {},

    // ============================================
    // INIT
    // ============================================
    init() {
        // Check session
        const raw = localStorage.getItem('tatito_admin_session');
        if (!raw) {
            window.location.href = 'index.html';
            return;
        }
        this.session = JSON.parse(raw);

        // Verify seller role
        if (this.session.role !== 'seller') {
            window.location.href = 'index.html';
            return;
        }

        // Find seller record
        this.seller = MockData.sellers.find(s => s.id === this.session.linkedId);
        if (!this.seller) {
            Swal.fire({ icon: 'error', title: 'Seller Not Found', text: 'No seller profile found for this account.' }).then(() => {
                window.location.href = 'index.html';
            });
            return;
        }

        // Suppress DataTables reinitialise warning
        if (typeof $ !== 'undefined' && $.fn.dataTable) {
            $.extend(true, $.fn.dataTable.defaults, { retrieve: true });
        }

        // Build sidebar
        this.buildSidebar();

        // Update topbar/sidebar user info
        this.updateUserInfo();

        // Route to page from URL hash or default
        const hash = window.location.hash.substring(1) || 'dashboard';
        this.navigate(hash);

        // Handle hash changes
        window.addEventListener('hashchange', () => {
            const page = window.location.hash.substring(1) || 'dashboard';
            this.navigate(page);
        });

        // Update notification dot
        this.updateNotifDot();
    },

    updateUserInfo() {
        const name = this.seller.businessName || 'Seller';
        const initials = Helpers.initials(name);
        document.getElementById('sidebarUserName').textContent = name;
        document.getElementById('topbarUserName').textContent = name;
        document.getElementById('sidebarAvatar').textContent = initials;
        document.getElementById('topbarAvatar').textContent = initials;
    },

    buildSidebar() {
        const nav = document.getElementById('sidebarNav');
        let html = '';
        this.navConfig.forEach(section => {
            if (section.section) {
                html += `<div class="nav-section-title">${section.section}</div>`;
            }
            section.items.forEach(item => {
                html += `
                    <a class="nav-item" data-page="${item.id}" onclick="SellerApp.navigate('${item.id}')">
                        <i class="bi ${item.icon}"></i>
                        <span>${item.label}</span>
                    </a>`;
            });
        });
        nav.innerHTML = html;
    },

    navigate(pageId) {
        this.currentPage = pageId;

        // Destroy DataTables
        if (typeof $ !== 'undefined' && $.fn.dataTable) {
            try { $.fn.dataTable.tables({ visible: false, api: true }).destroy(); } catch(e) {}
        }

        // Destroy all charts
        document.querySelectorAll('canvas').forEach(cv => {
            const existing = Chart.getChart(cv);
            if (existing) { try { existing.destroy(); } catch(e) {} }
        });

        // Update hash
        if (window.location.hash.substring(1) !== pageId) {
            window.location.hash = pageId;
        }

        // Update active nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === pageId);
        });

        // Close mobile sidebar
        this.closeSidebar();

        // Render page
        const renderer = this.pages[pageId];
        const content = document.getElementById('pageContent');

        if (renderer && typeof renderer.render === 'function') {
            const html = renderer.render();
            content.innerHTML = html;
            if (typeof renderer.afterRender === 'function') {
                setTimeout(() => renderer.afterRender(), 50);
            }
        } else {
            content.innerHTML = `<div class="empty-state">
                <i class="bi bi-exclamation-triangle"></i>
                <h3>Page Not Found</h3>
                <p>The "${pageId}" page is not available.</p>
            </div>`;
        }

        window.scrollTo(0, 0);
    },

    toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('show');
        document.getElementById('sidebarOverlay').classList.toggle('show');
    },

    closeSidebar() {
        document.getElementById('sidebar').classList.remove('show');
        document.getElementById('sidebarOverlay').classList.remove('show');
    },

    logout() {
        Helpers.confirm('Logout?', 'You will be returned to the login screen.', 'question').then(result => {
            if (result.isConfirmed) {
                localStorage.removeItem('tatito_admin_session');
                window.location.href = '../frontend/login.html';
            }
        });
    },

    // ============================================
    // Modal helpers (same pattern as admin App)
    // ============================================
    showModal(title, bodyHtml, footerHtml, size = '') {
        const box = document.getElementById('modalBox');
        const overlay = document.getElementById('modalOverlay');
        box.className = 'modal-box' + (size ? ' modal-' + size : '');
        box.innerHTML = `
            <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                <button class="modal-close" onclick="SellerApp.closeModal()">&times;</button>
            </div>
            <div class="modal-body">${bodyHtml}</div>
            ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
        `;
        overlay.classList.add('show');
        overlay.onclick = (e) => {
            if (e.target === overlay) this.closeModal();
        };
    },

    closeModal() {
        document.getElementById('modalOverlay').classList.remove('show');
    },

    // ============================================
    // Data helpers — filter by seller's businessName
    // ============================================
    getMyProducts() {
        return MockData.products.filter(p => p.seller === this.seller.businessName);
    },

    getMyOrders() {
        return MockData.orders.filter(o => o.seller === this.seller.businessName);
    },

    getMyReviews() {
        return MockData.reviews.filter(r => {
            const prod = MockData.products.find(p => p.name === r.product);
            return prod && prod.seller === this.seller.businessName;
        });
    },

    getMyPayouts() {
        return MockData.sellerPayouts.filter(p => p.sellerId === this.seller.id);
    },

    getMyNotifications() {
        // Return all notifications for now (seller sees order + system notifications)
        return MockData.notifications.filter(n =>
            n.type === 'order' || n.type === 'system' || n.type === 'payment'
        );
    },

    updateNotifDot() {
        const unread = this.getMyNotifications().filter(n => !n.isRead);
        const dot = document.getElementById('notifDot');
        if (dot) {
            dot.style.display = unread.length > 0 ? 'block' : 'none';
        }
    },

    // ============================================
    // Stats computation
    // ============================================
    getStats() {
        const orders = this.getMyOrders();
        const products = this.getMyProducts();
        const reviews = this.getMyReviews();
        const revenue = orders.reduce((sum, o) => sum + (o.status === 'cancelled' ? 0 : o.amount), 0);
        const completedOrders = orders.filter(o => o.status === 'delivered' || o.status === 'completed').length;
        const pendingOrders = orders.filter(o => !['delivered','completed','cancelled'].includes(o.status)).length;
        const avgRating = reviews.length > 0
            ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
            : '0.0';
        const commissionPaid = Math.round(revenue * (this.seller.commission / 100));

        return {
            totalRevenue: revenue,
            totalOrders: orders.length,
            totalProducts: products.length,
            totalReviews: reviews.length,
            pendingOrders,
            completedOrders,
            rating: avgRating,
            commissionPaid,
            netEarnings: revenue - commissionPaid,
        };
    },

    // ============================================
    // Revenue chart data
    // ============================================
    getRevenueData() {
        const orders = this.getMyOrders();
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const revenue = new Array(12).fill(0);
        const orderCounts = new Array(12).fill(0);

        orders.forEach(o => {
            if (o.status === 'cancelled') return;
            const d = new Date(o.date);
            const m = d.getMonth();
            revenue[m] += o.amount;
            orderCounts[m]++;
        });

        // Return last 7 months
        const now = new Date();
        const labels = [];
        const revData = [];
        const ordData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            labels.push(months[d.getMonth()]);
            revData.push(revenue[d.getMonth()] || 0);
            ordData.push(orderCounts[d.getMonth()] || 0);
        }

        return { labels, revenue: revData, orders: ordData };
    },
};

// ============================================
// PAGE: Dashboard
// ============================================
SellerApp.pages.dashboard = {
    render() {
        const stats = SellerApp.getStats();
        const recentOrders = SellerApp.getMyOrders().slice(0, 5);
        const topProducts = SellerApp.getMyProducts().slice(0, 5);

        let statCards = `
            <div class="stat-card">
                <div class="stat-icon gold"><i class="bi bi-currency-rupee"></i></div>
                <div class="stat-info">
                    <p>Total Revenue</p>
                    <h3>${Helpers.currency(stats.totalRevenue)}</h3>
                    <span class="stat-trend up"><i class="bi bi-arrow-up"></i> ${stats.totalOrders} orders</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon blue"><i class="bi bi-cart-check"></i></div>
                <div class="stat-info">
                    <p>Total Orders</p>
                    <h3>${stats.totalOrders}</h3>
                    <span class="stat-trend up">${stats.pendingOrders} pending</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon green"><i class="bi bi-bag"></i></div>
                <div class="stat-info">
                    <p>Products Listed</p>
                    <h3>${stats.totalProducts}</h3>
                    <span class="stat-trend up">${stats.completedOrders} delivered</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon purple"><i class="bi bi-star"></i></div>
                <div class="stat-info">
                    <p>Rating & Reviews</p>
                    <h3>${stats.rating} <span style="font-size:14px;color:var(--gray-400)">/ 5</span></h3>
                    <span class="stat-trend up">${stats.totalReviews} reviews</span>
                </div>
            </div>
        `;

        let recentRows = recentOrders.length > 0 ? recentOrders.map(o => `
            <tr>
                <td class="cell-strong">${o.id}</td>
                <td>${Helpers.escapeHtml(o.customer)}</td>
                <td>${Helpers.escapeHtml(o.product)}</td>
                <td class="cell-strong">${Helpers.currency(o.amount)}</td>
                <td><span class="badge ${Helpers.statusBadge(o.status)}">${Helpers.capitalize(o.status)}</span></td>
                <td><button class="action-btn view" onclick="SellerApp.pages.orders.view('${o.id}')" title="View"><i class="bi bi-eye"></i></button></td>
            </tr>
        `).join('') : '<tr><td colspan="6" class="text-center text-muted" style="padding:30px">No orders yet</td></tr>';

        let productRows = topProducts.length > 0 ? topProducts.map(p => `
            <div class="top-product-item">
                <div class="avatar" style="background:${Helpers.avatarColor(p.name)}">${Helpers.initials(p.name)}</div>
                <div class="product-info">
                    <div class="product-name">${Helpers.escapeHtml(p.name)}</div>
                    <div class="product-meta">${Helpers.escapeHtml(p.category)} · ${p.stock} in stock</div>
                </div>
                <div class="product-sales">${Helpers.currency(p.price)}</div>
            </div>
        `).join('') : '<p class="text-muted text-center" style="padding:20px">No products listed yet</p>';

        return `
            <div class="page-header">
                <div>
                    <h1 class="page-title"><i class="bi bi-speedometer2"></i> Dashboard</h1>
                    <p class="page-subtitle">Welcome back, ${Helpers.escapeHtml(SellerApp.seller.businessName)}! Here's your store overview.</p>
                </div>
            </div>
            <div class="stat-grid">${statCards}</div>
            <div class="main-row">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Revenue Overview</h3>
                    </div>
                    <div class="card-body">
                        <div class="chart-container"><canvas id="revenueChart"></canvas></div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Top Products</h3>
                    </div>
                    <div class="card-body">${productRows}</div>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Recent Orders</h3>
                    <button class="btn btn-outline btn-sm" onclick="SellerApp.navigate('orders')">View All</button>
                </div>
                <div class="table-wrap">
                    <table class="admin-table">
                        <thead><tr><th>Order ID</th><th>Customer</th><th>Product</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>${recentRows}</tbody>
                    </table>
                </div>
            </div>
        `;
    },

    afterRender() {
        const data = SellerApp.getRevenueData();
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;

        // Destroy existing chart
        const existing = Chart.getChart(ctx);
        if (existing) existing.destroy();

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Revenue (₹)',
                        data: data.revenue,
                        backgroundColor: 'rgba(201, 162, 75, 0.6)',
                        borderColor: 'rgba(139, 111, 46, 1)',
                        borderWidth: 2,
                        borderRadius: 6,
                        yAxisID: 'y',
                    },
                    {
                        label: 'Orders',
                        data: data.orders,
                        type: 'line',
                        borderColor: 'rgba(45, 154, 108, 1)',
                        backgroundColor: 'rgba(45, 154, 108, 0.1)',
                        tension: 0.4,
                        yAxisID: 'y1',
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                scales: {
                    y: { beginAtZero: true, position: 'left', grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { callback: v => '₹' + (v >= 1000 ? (v/1000).toFixed(0)+'k' : v) } },
                    y1: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false }, ticks: { precision: 0 } },
                    x: { grid: { display: false } },
                },
                plugins: {
                    legend: { position: 'top', labels: { font: { size: 11 }, color: '#4B4540' } },
                },
            },
        });
    },
};

// ============================================
// PAGE: My Products
// ============================================
SellerApp.pages.products = {
    render() {
        const products = SellerApp.getMyProducts();
        let rows = products.length > 0 ? products.map(p => {
            const discount = p.mrp > 0 ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
            return `
            <tr>
                <td class="cell-strong">${p.id}</td>
                <td>
                    <div class="cell-user">
                        <div class="avatar" style="background:${Helpers.avatarColor(p.name)}">${Helpers.initials(p.name)}</div>
                        <div class="user-cell-info">
                            <div class="user-cell-name">${Helpers.escapeHtml(p.name)}</div>
                            <div class="user-cell-meta">${Helpers.escapeHtml(p.category)}</div>
                        </div>
                    </div>
                </td>
                <td class="cell-strong">${Helpers.currency(p.price)}</td>
                <td>${p.mrp > 0 ? Helpers.currency(p.mrp) : '—'}</td>
                <td>${p.stock}</td>
                <td><span class="badge badge-warning"><i class="bi bi-check-circle"></i> Published</span></td>
                <td><span class="badge badge-warning">${p.rating || 0} <i class="bi bi-star-fill"></i></span></td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn view" onclick="SellerApp.pages.products.view('${p.id}')" title="View"><i class="bi bi-eye"></i></button>
                        <button class="action-btn edit" onclick="SellerApp.pages.products.edit('${p.id}')" title="Edit"><i class="bi bi-pencil"></i></button>
                        <button class="action-btn delete" onclick="SellerApp.pages.products.del('${p.id}')" title="Delete"><i class="bi bi-trash"></i></button>
                    </div>
                </td>
            </tr>`;
        }).join('') : '<tr><td colspan="8" class="text-center text-muted" style="padding:30px">No products listed</td></tr>';

        return `
            <div class="page-header">
                <div>
                    <h1 class="page-title"><i class="bi bi-bag"></i> My Products</h1>
                    <p class="page-subtitle">Manage your product listings</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary" onclick="SellerApp.pages.products.add()"><i class="bi bi-plus-circle"></i> Add Product</button>
                </div>
            </div>
            <div class="stat-grid">
                <div class="stat-card">
                    <div class="stat-icon gold"><i class="bi bi-bag"></i></div>
                    <div class="stat-info"><p>Total Products</p><h3>${products.length}</h3></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green"><i class="bi bi-box-seam"></i></div>
                    <div class="stat-info"><p>Total Stock</p><h3>${products.reduce((s, p) => s + p.stock, 0)}</h3></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon blue"><i class="bi bi-star"></i></div>
                    <div class="stat-info"><p>Avg Rating</p><h3>${products.length > 0 ? (products.reduce((s, p) => s + (p.rating || 0), 0) / products.length).toFixed(1) : '0.0'}</h3></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple"><i class="bi bi-chat-dots"></i></div>
                    <div class="stat-info"><p>Total Reviews</p><h3>${products.reduce((s, p) => s + (p.reviews || 0), 0)}</h3></div>
                </div>
            </div>
            <div class="card">
                <div class="card-header"><h3 class="card-title">Product List</h3></div>
                <div class="table-wrap">
                    <table class="admin-table" id="productsTable">
                        <thead><tr><th>ID</th><th>Product</th><th>Price</th><th>MRP</th><th>Stock</th><th>Status</th><th>Rating</th><th>Actions</th></tr></thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            </div>
        `;
    },

    afterRender() {
        const t = document.getElementById('productsTable');
        if (t && typeof $ !== 'undefined' && $.fn.dataTable) {
            $(t).DataTable({ pageLength: 10, retrieve: true });
        }
    },

    view(id) {
        const p = MockData.products.find(x => x.id === id);
        if (!p) return;
        const discount = p.mrp > 0 ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
        SellerApp.showModal('Product Details', `
            <div class="detail-section">
                <div class="detail-row"><span class="label"><i class="bi bi-tag"></i> Product ID</span><span class="value">${p.id}</span></div>
                <div class="detail-row"><span class="label"><i class="bi bi-bag"></i> Name</span><span class="value">${Helpers.escapeHtml(p.name)}</span></div>
                <div class="detail-row"><span class="label"><i class="bi bi-grid"></i> Category</span><span class="value">${Helpers.escapeHtml(p.category)}</span></div>
                <div class="detail-row"><span class="label"><i class="bi bi-currency-rupee"></i> Price</span><span class="value">${Helpers.currency(p.price)}</span></div>
                <div class="detail-row"><span class="label"><i class="bi bi-receipt"></i> MRP</span><span class="value">${p.mrp > 0 ? Helpers.currency(p.mrp) + ` (${discount}% off)` : 'N/A'}</span></div>
                <div class="detail-row"><span class="label"><i class="bi bi-box"></i> Stock</span><span class="value">${p.stock} units</span></div>
                <div class="detail-row"><span class="label"><i class="bi bi-star"></i> Rating</span><span class="value">${p.rating || 0} / 5 (${p.reviews || 0} reviews)</span></div>
                <div class="detail-row"><span class="label"><i class="bi bi-palette"></i> Variants</span><span class="value">${(p.variants || []).join(', ') || 'None'}</span></div>
                <div class="detail-row"><span class="label"><i class="bi bi-calendar"></i> Listed On</span><span class="value">${Helpers.formatDate(p.createdAt)}</span></div>
            </div>
        `, '', 'lg');
    },

    edit(id) {
        const p = MockData.products.find(x => x.id === id);
        if (!p) return;
        SellerApp.showModal('Edit Product', `
            <form id="editProductForm">
                <div class="form-group">
                    <label>Product Name</label>
                    <input type="text" class="form-control" name="name" value="${Helpers.escapeHtml(p.name)}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Price (₹)</label>
                        <input type="number" class="form-control" name="price" value="${p.price}" required>
                    </div>
                    <div class="form-group">
                        <label>MRP (₹)</label>
                        <input type="number" class="form-control" name="mrp" value="${p.mrp}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Stock</label>
                        <input type="number" class="form-control" name="stock" value="${p.stock}" required>
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select class="form-control" name="status">
                            <option value="published" selected>Published</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Variants (comma separated)</label>
                    <input type="text" class="form-control" name="variants" value="${(p.variants || []).join(', ')}">
                </div>
            </form>
        `, `
            <button class="btn btn-outline" onclick="SellerApp.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="SellerApp.pages.products.saveEdit('${id}')"><i class="bi bi-check-lg"></i> Save Changes</button>
        `, 'lg');
    },

    saveEdit(id) {
        const p = MockData.products.find(x => x.id === id);
        if (!p) return;
        const form = document.getElementById('editProductForm');
        const data = new FormData(form);
        p.name = data.get('name');
        p.price = parseInt(data.get('price'));
        p.mrp = parseInt(data.get('mrp')) || 0;
        p.stock = parseInt(data.get('stock'));
        p.variants = data.get('variants').split(',').map(v => v.trim()).filter(Boolean);
        SellerApp.closeModal();
        Helpers.toast('success', 'Product updated!');
        SellerApp.navigate('products');
    },

    add() {
        const tree = MockData.categoryTree || [];
        const catOptions = '<option value="">— Select Main Category —</option>' +
            tree.map(c => `<option value="${c.id}" data-name="${c.name}">${c.name}</option>`).join('');

        SellerApp.showModal('Add New Product', `
            <form id="addProductForm">
                <div class="form-group">
                    <label>Product Images</label>
                    <div class="img-upload-zone" onclick="document.getElementById('sellerProductImgInput').click()">
                        <i class="bi bi-cloud-upload"></i>
                        <p>Click to upload product images</p>
                        <p style="font-size:0.75rem;color:var(--gray-400)">JPG, PNG, WEBP · Max 5MB each</p>
                        <input type="file" id="sellerProductImgInput" accept="image/*" multiple style="display:none" onchange="SellerApp.handleProductImage(this,'sellerImgPreview')">
                    </div>
                    <div class="product-img-preview" id="sellerImgPreview"></div>
                </div>
                <div class="form-group">
                    <label>Product Name</label>
                    <input type="text" class="form-control" name="name" placeholder="Enter product name" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Main Category</label>
                        <select class="form-control" name="mainCat" id="sellerMainCat" onchange="SellerApp.loadSubCats(this)">
                            ${catOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Sub Category</label>
                        <select class="form-control" name="subCat" id="sellerSubCat" onchange="SellerApp.loadSubSubCats(this)" disabled>
                            <option value="">Select sub-category</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Sub-Sub Category</label>
                    <select class="form-control" name="subSubCat" id="sellerSubSubCat" disabled>
                        <option value="">Select sub-sub-category</option>
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Price (₹)</label>
                        <input type="number" class="form-control" name="price" placeholder="0" required>
                    </div>
                    <div class="form-group">
                        <label>MRP (₹)</label>
                        <input type="number" class="form-control" name="mrp" placeholder="0">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Stock</label>
                        <input type="number" class="form-control" name="stock" placeholder="0" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Variants (comma separated)</label>
                    <input type="text" class="form-control" name="variants" placeholder="Red, Blue, Green">
                </div>
            </form>
        `, `
            <button class="btn btn-outline" onclick="SellerApp.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="SellerApp.pages.products.saveAdd()"><i class="bi bi-check-lg"></i> Add Product</button>
        `, 'xl');
    },

    _sellerImages: [],
    handleProductImage(input, previewId) {
        const preview = document.getElementById(previewId);
        if (!preview) return;
        const files = input.files;
        if (!files || files.length === 0) return;
        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.onload = (e) => {
                SellerApp.pages.products._sellerImages.push(e.target.result);
                preview.innerHTML = SellerApp.pages.products._sellerImages.map((src, idx) =>
                    `<div class="product-img-preview-item"><img src="${src}"><button type="button" class="img-remove-btn" onclick="SellerApp.removeSellerImage(${idx})">&times;</button></div>`
                ).join('');
            };
            reader.readAsDataURL(files[i]);
        }
    },

    loadSubCats(mainSelect) {
        const mainId = mainSelect.value;
        const subSelect = document.getElementById('sellerSubCat');
        const subSubSelect = document.getElementById('sellerSubSubCat');
        subSelect.innerHTML = '<option value="">Select sub-category</option>';
        subSubSelect.innerHTML = '<option value="">Select sub-sub-category</option>';
        subSubSelect.disabled = true;
        if (!mainId) { subSelect.disabled = true; return; }
        const mainCat = (MockData.categoryTree || []).find(c => c.id === mainId);
        if (!mainCat) { subSelect.disabled = true; return; }
        (mainCat.subCategories || []).forEach(sc => {
            const opt = document.createElement('option');
            opt.value = sc.id; opt.setAttribute('data-name', sc.name); opt.textContent = sc.name;
            subSelect.appendChild(opt);
        });
        subSelect.disabled = false;
    },

    loadSubSubCats(subSelect) {
        const subId = subSelect.value;
        const subSubSelect = document.getElementById('sellerSubSubCat');
        subSubSelect.innerHTML = '<option value="">Select sub-sub-category</option>';
        if (!subId) { subSubSelect.disabled = true; return; }
        const mainId = document.getElementById('sellerMainCat').value;
        const mainCat = (MockData.categoryTree || []).find(c => c.id === mainId);
        if (!mainCat) { subSubSelect.disabled = true; return; }
        const subCat = mainCat.subCategories.find(s => s.id === subId);
        if (!subCat) { subSubSelect.disabled = true; return; }
        (subCat.subCategories || []).forEach(ssc => {
            const opt = document.createElement('option');
            opt.value = ssc.id; opt.setAttribute('data-name', ssc.name); opt.textContent = ssc.name;
            subSubSelect.appendChild(opt);
        });
        subSubSelect.disabled = false;
    },

    removeSellerImage(idx) {
        SellerApp.pages.products._sellerImages.splice(idx, 1);
        const preview = document.getElementById('sellerImgPreview');
        if (preview) {
            preview.innerHTML = SellerApp.pages.products._sellerImages.map((src, i) =>
                `<div class="product-img-preview-item"><img src="${src}"><button type="button" class="img-remove-btn" onclick="SellerApp.removeSellerImage(${i})">&times;</button></div>`
            ).join('');
        }
    },

    saveAdd() {
        const form = document.getElementById('addProductForm');
        const data = new FormData(form);
        const name = (data.get('name') || '').trim();
        if (!name) { Helpers.toast('error', 'Product name is required'); return; }

        // Build category string from cascading selects
        const mainSel = document.getElementById('sellerMainCat');
        const subSel = document.getElementById('sellerSubCat');
        const subSubSel = document.getElementById('sellerSubSubCat');
        const catParts = [];
        if (mainSel && mainSel.value) catParts.push(mainSel.options[mainSel.selectedIndex].getAttribute('data-name'));
        if (subSel && subSel.value) catParts.push(subSel.options[subSel.selectedIndex].getAttribute('data-name'));
        if (subSubSel && subSubSel.value) catParts.push(subSubSel.options[subSubSel.selectedIndex].getAttribute('data-name'));
        const categoryStr = catParts.join(' — ') || 'Uncategorized';

        const newId = 'PRD' + String(MockData.products.length + 1).padStart(3, '0');
        const imgs = SellerApp.pages.products._sellerImages || [];
        MockData.products.push({
            id: newId,
            name: name,
            category: categoryStr,
            mainCategoryId: mainSel ? mainSel.value : '',
            subCategoryId: subSel ? subSel.value : '',
            subSubCategoryId: subSubSel ? subSubSel.value : '',
            seller: SellerApp.seller.businessName,
            price: parseInt(data.get('price')) || 0,
            mrp: parseInt(data.get('mrp')) || 0,
            stock: parseInt(data.get('stock')) || 0,
            status: 'published',
            rating: 0,
            reviews: 0,
            image: imgs.length > 0 ? imgs[0] : '',
            images: imgs,
            variants: (data.get('variants') || '').split(',').map(v => v.trim()).filter(Boolean),
            createdAt: new Date().toISOString().split('T')[0],
        });
        SellerApp.pages.products._sellerImages = [];
        SellerApp.closeModal();
        Helpers.toast('success', 'Product added!');
        SellerApp.navigate('products');
    },

    del(id) {
        Helpers.confirm('Delete Product?', 'This product will be removed from your listings.', 'warning').then(r => {
            if (r.isConfirmed) {
                const idx = MockData.products.findIndex(p => p.id === id);
                if (idx >= 0) MockData.products.splice(idx, 1);
                Helpers.toast('success', 'Product deleted!');
                SellerApp.navigate('products');
            }
        });
    },
};

// ============================================
// PAGE: Orders
// ============================================
SellerApp.pages.orders = {
    render() {
        const orders = SellerApp.getMyOrders();
        let rows = orders.length > 0 ? orders.map(o => `
            <tr>
                <td class="cell-strong">${o.id}</td>
                <td>
                    <div class="cell-user">
                        <div class="avatar" style="background:${Helpers.avatarColor(o.customer)}">${Helpers.initials(o.customer)}</div>
                        <div class="user-cell-info">
                            <div class="user-cell-name">${Helpers.escapeHtml(o.customer)}</div>
                            <div class="user-cell-meta">${Helpers.escapeHtml(o.customerCity || '')}</div>
                        </div>
                    </div>
                </td>
                <td>${Helpers.escapeHtml(o.product)}</td>
                <td class="cell-strong">${Helpers.currency(o.amount)}</td>
                <td><span class="badge ${Helpers.statusBadge(o.status)}">${Helpers.capitalize(o.status)}</span></td>
                <td><span class="badge ${o.payment === 'paid' ? 'badge-success' : o.payment === 'refunded' ? 'badge-gray' : 'badge-warning'}">${Helpers.escapeHtml(o.payment)}</span></td>
                <td>${Helpers.formatDate(o.date)}</td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn view" onclick="SellerApp.pages.orders.view('${o.id}')" title="View"><i class="bi bi-eye"></i></button>
                        <button class="action-btn edit" onclick="SellerApp.pages.orders.updateStatus('${o.id}')" title="Update Status"><i class="bi bi-pencil"></i></button>
                    </div>
                </td>
            </tr>
        `).join('') : '<tr><td colspan="8" class="text-center text-muted" style="padding:30px">No orders found</td></tr>';

        return `
            <div class="page-header">
                <div>
                    <h1 class="page-title"><i class="bi bi-cart-check"></i> Orders</h1>
                    <p class="page-subtitle">Track and manage your customer orders</p>
                </div>
            </div>
            <div class="stat-grid">
                <div class="stat-card">
                    <div class="stat-icon blue"><i class="bi bi-cart-check"></i></div>
                    <div class="stat-info"><p>Total Orders</p><h3>${orders.length}</h3></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon gold"><i class="bi bi-clock"></i></div>
                    <div class="stat-info"><p>Pending</p><h3>${orders.filter(o => !['delivered','completed','cancelled'].includes(o.status)).length}</h3></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green"><i class="bi bi-box-seam"></i></div>
                    <div class="stat-info"><p>Completed</p><h3>${orders.filter(o => ['delivered','completed'].includes(o.status)).length}</h3></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon red"><i class="bi bi-x-circle"></i></div>
                    <div class="stat-info"><p>Cancelled</p><h3>${orders.filter(o => o.status === 'cancelled').length}</h3></div>
                </div>
            </div>
            <div class="card">
                <div class="card-header"><h3 class="card-title">Order List</h3></div>
                <div class="table-wrap">
                    <table class="admin-table" id="ordersTable">
                        <thead><tr><th>Order ID</th><th>Customer</th><th>Product</th><th>Amount</th><th>Status</th><th>Payment</th><th>Date</th><th>Actions</th></tr></thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            </div>
        `;
    },

    afterRender() {
        const t = document.getElementById('ordersTable');
        if (t && typeof $ !== 'undefined' && $.fn.dataTable) {
            $(t).DataTable({ pageLength: 10, retrieve: true, order: [[6, 'desc']] });
        }
    },

    view(id) {
        const o = MockData.orders.find(x => x.id === id);
        if (!o) return;
        SellerApp.showModal('Order Details — ' + o.id, `
            <div class="detail-section">
                <h4 style="font-size:0.82rem;font-weight:700;color:var(--gray-500);margin-bottom:12px;text-transform:uppercase;letter-spacing:0.5px">Order Information</h4>
                <div class="detail-row"><span class="label"><i class="bi bi-tag"></i> Order ID</span><span class="value">${o.id}</span></div>
                <div class="detail-row"><span class="label"><i class="bi bi-person"></i> Customer</span><span class="value">${Helpers.escapeHtml(o.customer)}</span></div>
                <div class="detail-row"><span class="label"><i class="bi bi-geo-alt"></i> City</span><span class="value">${Helpers.escapeHtml(o.customerCity || '')}</span></div>
                <div class="detail-row"><span class="label"><i class="bi bi-bag"></i> Product</span><span class="value">${Helpers.escapeHtml(o.product)}</span></div>
                <div class="detail-row"><span class="label"><i class="bi bi-123"></i> Items</span><span class="value">${o.items}</span></div>
                <div class="detail-row"><span class="label"><i class="bi bi-currency-rupee"></i> Amount</span><span class="value">${Helpers.currency(o.amount)}</span></div>
                <div class="detail-row"><span class="label"><i class="bi bi-info-circle"></i> Status</span><span class="value"><span class="badge ${Helpers.statusBadge(o.status)}">${Helpers.capitalize(o.status)}</span></span></div>
                <div class="detail-row"><span class="label"><i class="bi bi-credit-card"></i> Payment</span><span class="value">${Helpers.escapeHtml(o.payment)}</span></div>
                <div class="detail-row"><span class="label"><i class="bi bi-calendar"></i> Date</span><span class="value">${Helpers.formatDate(o.date)}</span></div>
                <div class="detail-row"><span class="label"><i class="bi bi-truck"></i> Tracking ID</span><span class="value">${o.trackingId || 'N/A'}</span></div>
            </div>
            <div class="detail-section">
                <h4 style="font-size:0.82rem;font-weight:700;color:var(--gray-500);margin-bottom:12px;text-transform:uppercase;letter-spacing:0.5px">Order Timeline</h4>
                ${Helpers.orderTimeline(o.status)}
            </div>
        `, '', 'xl');
    },

    updateStatus(id) {
        const o = MockData.orders.find(x => x.id === id);
        if (!o) return;
        const statuses = ['pending','confirmed','processing','shipped','out_for_delivery','delivered','completed','cancelled'];
        let options = statuses.map(s => `<option value="${s}" ${s === o.status ? 'selected' : ''}>${s.replace(/_/g,' ').replace(/\b\w/g, c => c.toUpperCase())}</option>`).join('');

        SellerApp.showModal('Update Order Status — ' + o.id, `
            <div class="detail-section">
                <div class="detail-row"><span class="label"><i class="bi bi-bag"></i> Product</span><span class="value">${Helpers.escapeHtml(o.product)}</span></div>
                <div class="detail-row"><span class="label"><i class="bi bi-person"></i> Customer</span><span class="value">${Helpers.escapeHtml(o.customer)}</span></div>
                <div class="detail-row"><span class="label"><i class="bi bi-info-circle"></i> Current Status</span><span class="value"><span class="badge ${Helpers.statusBadge(o.status)}">${Helpers.capitalize(o.status)}</span></span></div>
            </div>
            <div class="form-group">
                <label>Update Status</label>
                <select class="form-control" id="statusSelect">${options}</select>
            </div>
            <div class="form-group">
                <label>Notes (optional)</label>
                <textarea class="form-control" id="statusNotes" placeholder="Add a note about this status update..."></textarea>
            </div>
        `, `
            <button class="btn btn-outline" onclick="SellerApp.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="SellerApp.pages.orders.saveStatus('${id}')"><i class="bi bi-check-lg"></i> Update Status</button>
        `, 'lg');
    },

    saveStatus(id) {
        const o = MockData.orders.find(x => x.id === id);
        if (!o) return;
        o.status = document.getElementById('statusSelect').value;
        SellerApp.closeModal();
        Helpers.toast('success', 'Order status updated!');
        SellerApp.navigate('orders');
    },
};

// ============================================
// PAGE: Earnings & Payouts
// ============================================
SellerApp.pages.earnings = {
    render() {
        const stats = SellerApp.getStats();
        const payouts = SellerApp.getMyPayouts();
        const orders = SellerApp.getMyOrders();

        let payoutRows = payouts.length > 0 ? payouts.map(p => `
            <tr>
                <td class="cell-strong">${p.id}</td>
                <td>${Helpers.formatDate(p.date)}</td>
                <td class="cell-strong">${Helpers.currency(p.amount)}</td>
                <td>${Helpers.escapeHtml(p.method)}</td>
                <td>${p.txnId ? Helpers.escapeHtml(p.txnId) : '—'}</td>
                <td><span class="badge ${Helpers.statusBadge(p.status)}">${Helpers.capitalize(p.status)}</span></td>
            </tr>
        `).join('') : '<tr><td colspan="6" class="text-center text-muted" style="padding:30px">No payouts yet</td></tr>';

        return `
            <div class="page-header">
                <div>
                    <h1 class="page-title"><i class="bi bi-wallet2"></i> Earnings & Payouts</h1>
                    <p class="page-subtitle">Track your revenue, commission and payouts</p>
                </div>
            </div>
            <div class="stat-grid">
                <div class="stat-card">
                    <div class="stat-icon gold"><i class="bi bi-currency-rupee"></i></div>
                    <div class="stat-info"><p>Gross Revenue</p><h3>${Helpers.currency(stats.totalRevenue)}</h3></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon red"><i class="bi bi-percent"></i></div>
                    <div class="stat-info"><p>Commission (${SellerApp.seller.commission}%)</p><h3>${Helpers.currency(stats.commissionPaid)}</h3></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green"><i class="bi bi-wallet2"></i></div>
                    <div class="stat-info"><p>Net Earnings</p><h3>${Helpers.currency(stats.netEarnings)}</h3></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon blue"><i class="bi bi-bank"></i></div>
                    <div class="stat-info"><p>Pending Payout</p><h3>${Helpers.currency(payouts.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0))}</h3></div>
                </div>
            </div>
            <div class="main-row">
                <div class="card">
                    <div class="card-header"><h3 class="card-title">Revenue Trend</h3></div>
                    <div class="card-body">
                        <div class="chart-container"><canvas id="earningsChart"></canvas></div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header"><h3 class="card-title">Payment Breakdown</h3></div>
                    <div class="card-body">
                        <div class="chart-container-sm"><canvas id="paymentChart"></canvas></div>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-header"><h3 class="card-title">Payout History</h3></div>
                <div class="table-wrap">
                    <table class="admin-table" id="payoutsTable">
                        <thead><tr><th>Payout ID</th><th>Date</th><th>Amount</th><th>Method</th><th>Transaction ID</th><th>Status</th></tr></thead>
                        <tbody>${payoutRows}</tbody>
                    </table>
                </div>
            </div>
        `;
    },

    afterRender() {
        const revData = SellerApp.getRevenueData();
        const orders = SellerApp.getMyOrders();

        // Revenue chart
        const ctx1 = document.getElementById('earningsChart');
        if (ctx1) {
            const ex1 = Chart.getChart(ctx1);
            if (ex1) ex1.destroy();
            new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: revData.labels,
                    datasets: [{
                        label: 'Revenue (₹)',
                        data: revData.revenue,
                        borderColor: 'rgba(139, 111, 46, 1)',
                        backgroundColor: 'rgba(201, 162, 75, 0.15)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2,
                        borderRadius: 6,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, ticks: { callback: v => '₹' + (v >= 1000 ? (v/1000).toFixed(0)+'k' : v) }, grid: { color: 'rgba(0,0,0,0.05)' } },
                        x: { grid: { display: false } },
                    },
                    plugins: { legend: { display: false } },
                },
            });
        }

        // Payment status donut chart
        const ctx2 = document.getElementById('paymentChart');
        if (ctx2) {
            const ex2 = Chart.getChart(ctx2);
            if (ex2) ex2.destroy();
            const paidCount = orders.filter(o => o.payment === 'paid').length;
            const pendingCount = orders.filter(o => o.payment === 'pending').length;
            const refundedCount = orders.filter(o => o.payment === 'refunded').length;
            new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: ['Paid', 'Pending', 'Refunded'],
                    datasets: [{
                        data: [paidCount, pendingCount, refundedCount],
                        backgroundColor: ['rgba(45, 154, 108, 0.8)', 'rgba(201, 162, 75, 0.8)', 'rgba(192, 70, 58, 0.8)'],
                        borderColor: ['#2D9A6C', '#C9A24B', '#C0463A'],
                        borderWidth: 2,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '60%',
                    plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, color: '#4B4540' } } },
                },
            });
        }

        // DataTable for payouts
        const t = document.getElementById('payoutsTable');
        if (t && typeof $ !== 'undefined' && $.fn.dataTable) {
            $(t).DataTable({ pageLength: 10, retrieve: true, order: [[1, 'desc']] });
        }
    },
};

// ============================================
// PAGE: Reviews
// ============================================
SellerApp.pages.reviews = {
    render() {
        const reviews = SellerApp.getMyReviews();
        const avgRating = reviews.length > 0
            ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
            : '0.0';

        let cards = reviews.length > 0 ? reviews.map(r => `
            <div class="customization-card" style="margin-bottom:14px">
                <div class="req-header">
                    <div>
                        <div class="cell-user">
                            <div class="avatar" style="background:${Helpers.avatarColor(r.customer)}">${Helpers.initials(r.customer)}</div>
                            <div class="user-cell-info">
                                <div class="user-cell-name">${Helpers.escapeHtml(r.customer)}</div>
                                <div class="user-cell-meta">${Helpers.formatDate(r.date)}</div>
                            </div>
                        </div>
                    </div>
                    <div style="text-align:right">
                        <span class="badge badge-gold">${r.rating} <i class="bi bi-star-fill"></i></span>
                        ${r.hasImage ? '<span class="badge badge-info" style="margin-left:4px"><i class="bi bi-camera"></i> Photo</span>' : ''}
                    </div>
                </div>
                <h4 style="font-family:var(--font-heading);font-size:1rem;font-weight:600;color:var(--black);margin-bottom:4px">${Helpers.escapeHtml(r.title)}</h4>
                <p style="font-size:0.85rem;color:var(--gray-500);line-height:1.5">${Helpers.escapeHtml(r.comment)}</p>
                <div style="margin-top:8px;font-size:0.78rem;color:var(--gray-400)">
                    <i class="bi bi-hand-thumbs-up"></i> ${r.helpful} found this helpful
                </div>
            </div>
        `).join('') : '<div class="empty-state"><i class="bi bi-star"></i><h3>No Reviews Yet</h3><p>Reviews from your customers will appear here.</p></div>';

        return `
            <div class="page-header">
                <div>
                    <h1 class="page-title"><i class="bi bi-star"></i> Reviews</h1>
                    <p class="page-subtitle">Customer reviews for your products</p>
                </div>
            </div>
            <div class="stat-grid">
                <div class="stat-card">
                    <div class="stat-icon gold"><i class="bi bi-star"></i></div>
                    <div class="stat-info"><p>Average Rating</p><h3>${avgRating} <span style="font-size:14px;color:var(--gray-400)">/ 5</span></h3></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green"><i class="bi bi-chat-dots"></i></div>
                    <div class="stat-info"><p>Total Reviews</p><h3>${reviews.length}</h3></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon blue"><i class="bi bi-camera"></i></div>
                    <div class="stat-info"><p>With Photos</p><h3>${reviews.filter(r => r.hasImage).length}</h3></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple"><i class="bi bi-hand-thumbs-up"></i></div>
                    <div class="stat-info"><p>Total Helpful Votes</p><h3>${reviews.reduce((s, r) => s + (r.helpful || 0), 0)}</h3></div>
                </div>
            </div>
            <div class="card">
                <div class="card-header"><h3 class="card-title">Customer Reviews</h3></div>
                <div class="card-body">${cards}</div>
            </div>
        `;
    },
};

// ============================================
// PAGE: Notifications
// ============================================
SellerApp.pages.notifications = {
    currentFilter: 'all',

    render() {
        const notifs = SellerApp.getMyNotifications();
        const types = [...new Set(notifs.map(n => n.type))];

        let filterChips = `
            <div class="quick-actions" style="grid-template-columns:repeat(auto-fill,minmax(120px,1fr))">
                <div class="quick-action" onclick="SellerApp.pages.notifications.setFilter('all')" id="filter-all">
                    <i class="bi bi-list"></i><span>All (${notifs.length})</span>
                </div>
                ${types.map(t => `
                    <div class="quick-action" onclick="SellerApp.pages.notifications.setFilter('${t}')" id="filter-${t}">
                        <i class="bi ${this.iconFor(t)}"></i><span>${this.labelFor(t)} (${notifs.filter(n => n.type === t).length})</span>
                    </div>
                `).join('')}
            </div>
        `;

        return `
            <div class="page-header">
                <div>
                    <h1 class="page-title"><i class="bi bi-bell"></i> Notifications</h1>
                    <p class="page-subtitle">Order updates and system notifications</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-outline btn-sm" onclick="SellerApp.pages.notifications.markAllRead()"><i class="bi bi-check2-all"></i> Mark All Read</button>
                </div>
            </div>
            ${filterChips}
            <div id="notifList"></div>
        `;
    },

    afterRender() {
        this.renderList();
    },

    renderList() {
        const notifs = SellerApp.getMyNotifications();
        const filtered = this.currentFilter === 'all' ? notifs : notifs.filter(n => n.type === this.currentFilter);

        const container = document.getElementById('notifList');
        if (!container) return;

        if (filtered.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="bi bi-bell-slash"></i><h3>No Notifications</h3><p>You have no notifications in this category.</p></div>';
            return;
        }

        container.innerHTML = filtered.map(n => `
            <div class="card" style="cursor:pointer;opacity:${n.isRead ? '0.7' : '1'}" onclick="SellerApp.pages.notifications.open('${n.id}')">
                <div class="card-body" style="display:flex;align-items:center;gap:14px;padding:16px 22px">
                    <div class="activity-icon" style="background:${this.colorFor(n.type)};color:white;width:40px;height:40px;border-radius:12px">
                        <i class="bi ${this.iconFor(n.type)}"></i>
                    </div>
                    <div style="flex:1">
                        <div style="display:flex;align-items:center;gap:8px">
                            <strong style="font-size:0.88rem;color:var(--black)">${Helpers.escapeHtml(n.title)}</strong>
                            ${!n.isRead ? '<span class="dot" style="width:8px;height:8px;border-radius:50%;background:#C0463A;display:inline-block"></span>' : ''}
                        </div>
                        <div style="font-size:0.82rem;color:var(--gray-500);margin-top:2px">${Helpers.escapeHtml(n.message)}</div>
                        <div style="font-size:0.72rem;color:var(--gray-400);margin-top:4px">${Helpers.timeAgo(n.date)}</div>
                    </div>
                    ${!n.isRead ? `<button class="action-btn view" onclick="event.stopPropagation();SellerApp.pages.notifications.markRead('${n.id}')" title="Mark as Read"><i class="bi bi-check2"></i></button>` : ''}
                </div>
            </div>
        `).join('');
    },

    setFilter(type) {
        this.currentFilter = type;
        this.renderList();
    },

    open(id) {
        const n = MockData.notifications.find(x => x.id === id);
        if (!n) return;
        n.isRead = true;
        SellerApp.updateNotifDot();
        SellerApp.showModal('Notification Details', `
            <div class="detail-section">
                <div class="detail-row"><span class="label"><i class="bi bi-${this.iconFor(n.type)}"></i> Type</span><span class="value">${this.labelFor(n.type)}</span></div>
                <div class="detail-row"><span class="label"><i class="bi bi-heading"></i> Title</span><span class="value">${Helpers.escapeHtml(n.title)}</span></div>
                <div class="detail-row"><span class="label"><i class="bi bi-clock"></i> Time</span><span class="value">${Helpers.formatDateTime(n.date)}</span></div>
            </div>
            <div style="padding:14px;background:var(--ivory);border-radius:8px;font-size:0.88rem;color:var(--gray-600);line-height:1.5">
                ${Helpers.escapeHtml(n.message)}
            </div>
        `, '', 'md');
        this.renderList();
    },

    markRead(id) {
        const n = MockData.notifications.find(x => x.id === id);
        if (n) { n.isRead = true; }
        SellerApp.updateNotifDot();
        this.renderList();
        Helpers.toast('success', 'Marked as read');
    },

    markAllRead() {
        SellerApp.getMyNotifications().forEach(n => { n.isRead = true; });
        SellerApp.updateNotifDot();
        this.renderList();
        Helpers.toast('success', 'All notifications marked as read');
    },

    iconFor(type) {
        const map = { order: 'bi-cart-check', seller: 'bi-shop', payment: 'bi-credit-card', review: 'bi-star', system: 'bi-gear' };
        return map[type] || 'bi-bell';
    },

    colorFor(type) {
        const map = { order: '#3B6CB7', seller: '#C9A24B', payment: '#2D9A6C', review: '#7C5FCF', system: '#6B655C' };
        return map[type] || '#6B655C';
    },

    labelFor(type) {
        const map = { order: 'Orders', seller: 'Seller', payment: 'Payments', review: 'Reviews', system: 'System' };
        return map[type] || type;
    },
};

// ============================================
// PAGE: Store Profile
// ============================================
SellerApp.pages.profile = {
    render() {
        const s = SellerApp.seller;
        const stats = SellerApp.getStats();

        return `
            <div class="page-header">
                <div>
                    <h1 class="page-title"><i class="bi bi-shop"></i> Store Profile</h1>
                    <p class="page-subtitle">Manage your seller profile and store settings</p>
                </div>
            </div>
            <div class="main-row">
                <div class="card">
                    <div class="card-header"><h3 class="card-title">Business Information</h3></div>
                    <div class="card-body">
                        <div class="detail-section">
                            <div class="detail-row"><span class="label"><i class="bi bi-shop"></i> Business Name</span><span class="value">${Helpers.escapeHtml(s.businessName)}</span></div>
                            <div class="detail-row"><span class="label"><i class="bi bi-grid"></i> Category</span><span class="value">${Helpers.escapeHtml(s.category)}</span></div>
                            <div class="detail-row"><span class="label"><i class="bi bi-tag"></i> Subcategory</span><span class="value">${Helpers.escapeHtml(s.subcategory)}</span></div>
                            <div class="detail-row"><span class="label"><i class="bi bi-envelope"></i> Email</span><span class="value">${Helpers.escapeHtml(s.email)}</span></div>
                            <div class="detail-row"><span class="label"><i class="bi bi-phone"></i> Phone</span><span class="value">${Helpers.escapeHtml(s.phone)}</span></div>
                            <div class="detail-row"><span class="label"><i class="bi bi-geo-alt"></i> City</span><span class="value">${Helpers.escapeHtml(s.city)}</span></div>
                            <div class="detail-row"><span class="label"><i class="bi bi-receipt"></i> GSTIN</span><span class="value">${Helpers.escapeHtml(s.gstin)}</span></div>
                            <div class="detail-row"><span class="label"><i class="bi bi-calendar"></i> Joined On</span><span class="value">${Helpers.formatDate(s.joined)}</span></div>
                            <div class="detail-row"><span class="label"><i class="bi bi-shield-check"></i> Status</span><span class="value"><span class="badge ${Helpers.statusBadge(s.status === 'active' ? 'active' : s.status)}">${Helpers.capitalize(s.status === 'active' ? 'active' : s.status)}</span></span></div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header"><h3 class="card-title">Performance Summary</h3></div>
                    <div class="card-body">
                        <div class="detail-section">
                            <div class="detail-row"><span class="label"><i class="bi bi-star"></i> Rating</span><span class="value">${stats.rating} / 5</span></div>
                            <div class="detail-row"><span class="label"><i class="bi bi-bag"></i> Products</span><span class="value">${stats.totalProducts}</span></div>
                            <div class="detail-row"><span class="label"><i class="bi bi-cart-check"></i> Total Orders</span><span class="value">${stats.totalOrders}</span></div>
                            <div class="detail-row"><span class="label"><i class="bi bi-currency-rupee"></i> Total Revenue</span><span class="value">${Helpers.currency(stats.totalRevenue)}</span></div>
                            <div class="detail-row"><span class="label"><i class="bi bi-percent"></i> Commission Rate</span><span class="value">${s.commission}%</span></div>
                            <div class="detail-row"><span class="label"><i class="bi bi-wallet2"></i> Net Earnings</span><span class="value">${Helpers.currency(stats.netEarnings)}</span></div>
                            <div class="detail-row"><span class="label"><i class="bi bi-chat-dots"></i> Reviews</span><span class="value">${stats.totalReviews}</span></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Edit Store Information</h3>
                </div>
                <div class="card-body">
                    <form id="profileForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Business Name</label>
                                <input type="text" class="form-control" name="businessName" value="${Helpers.escapeHtml(s.businessName)}" required>
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" class="form-control" name="email" value="${Helpers.escapeHtml(s.email)}" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Phone</label>
                                <input type="text" class="form-control" name="phone" value="${Helpers.escapeHtml(s.phone)}">
                            </div>
                            <div class="form-group">
                                <label>City</label>
                                <input type="text" class="form-control" name="city" value="${Helpers.escapeHtml(s.city)}">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Category</label>
                                <input type="text" class="form-control" name="category" value="${Helpers.escapeHtml(s.category)}">
                            </div>
                            <div class="form-group">
                                <label>Subcategory</label>
                                <input type="text" class="form-control" name="subcategory" value="${Helpers.escapeHtml(s.subcategory)}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>GSTIN</label>
                            <input type="text" class="form-control" name="gstin" value="${Helpers.escapeHtml(s.gstin)}">
                        </div>
                        <button type="button" class="btn btn-primary" onclick="SellerApp.pages.profile.save()"><i class="bi bi-check-lg"></i> Save Changes</button>
                    </form>
                </div>
            </div>
        `;
    },

    save() {
        const form = document.getElementById('profileForm');
        const data = new FormData(form);
        const s = SellerApp.seller;
        s.businessName = data.get('businessName');
        s.email = data.get('email');
        s.phone = data.get('phone');
        s.city = data.get('city');
        s.category = data.get('category');
        s.subcategory = data.get('subcategory');
        s.gstin = data.get('gstin');
        SellerApp.updateUserInfo();
        Helpers.toast('success', 'Profile updated!');
        SellerApp.navigate('profile');
    },
};
