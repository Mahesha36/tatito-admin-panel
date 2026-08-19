/* ============================================
   AI Try-On Management Page
   ============================================ */

const AITryOnPage = {
    render() {
        const total = MockData.aiTryOns.length;
        const converted = MockData.aiTryOns.filter(a => a.converted).length;
        const convRate = total > 0 ? Math.round(converted / total * 100) : 0;
        const totalColors = MockData.aiTryOns.reduce((s, a) => s + a.colorsTried.length, 0);
        return `
        <div class="breadcrumb">
            <i class="bi bi-house"></i> <span>${I18n.t('common.home')}</span> <i class="bi bi-chevron-right"></i> <span>${I18n.t('nav.aiTryOn')}</span>
        </div>
        <div class="page-header">
            <div>
                <h1 class="page-title"><i class="bi bi-magic"></i> ${I18n.t('aitryon.title')}</h1>
                <p class="page-subtitle">${I18n.t('aitryon.subtitle')}</p>
            </div>
        </div>

        <div class="stat-grid">
            <div class="ai-stat-card">
                <div class="ai-icon"><i class="bi bi-magic"></i></div>
                <h3>${total}</h3>
                <p>${I18n.t('aitryon.totalSessions')}</p>
            </div>
            <div class="ai-stat-card">
                <div class="ai-icon"><i class="bi bi-graph-up-arrow"></i></div>
                <h3>${convRate}%</h3>
                <p>${I18n.t('aitryon.convRate')}</p>
            </div>
            <div class="ai-stat-card">
                <div class="ai-icon"><i class="bi bi-cart-check"></i></div>
                <h3>${converted}</h3>
                <p>${I18n.t('aitryon.purchases')}</p>
            </div>
            <div class="ai-stat-card">
                <div class="ai-icon"><i class="bi bi-palette"></i></div>
                <h3>${totalColors}</h3>
                <p>${I18n.t('aitryon.colorsTried')}</p>
            </div>
        </div>

        <div class="main-row">
            <div class="card">
                <div class="card-header"><h3 class="card-title">${I18n.t('aitryon.activityOverTime')}</h3></div>
                <div class="card-body"><div class="chart-container"><canvas id="tryOnChart"></canvas></div></div>
            </div>
            <div class="card">
                <div class="card-header"><h3 class="card-title">${I18n.t('aitryon.convChart')}</h3></div>
                <div class="card-body"><div class="chart-container"><canvas id="convChart"></canvas></div></div>
            </div>
        </div>

        <div class="table-wrap">
            <table id="aiTryOnTable" class="display" style="width:100%">
                <thead>
                    <tr>
                        <th>${I18n.t('sellers.id')}</th>
                        <th>${I18n.t('aitryon.user')}</th>
                        <th>${I18n.t('orders.product')}</th>
                        <th>${I18n.t('aitryon.tryOnCount')}</th>
                        <th>${I18n.t('aitryon.colorsTriedCol')}</th>
                        <th>${I18n.t('common.date')}</th>
                        <th>${I18n.t('aitryon.convertedCol')}</th>
                        <th>${I18n.t('common.status')}</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        `;
    },

    afterRender() {
        if (!window._tatitoCharts) window._tatitoCharts = {};
        { const c = document.getElementById('tryOnChart'); if (c) { const e = Chart.getChart(c); if (e) e.destroy(); } }
        window._tatitoCharts.tryOn = new Chart(document.getElementById('tryOnChart'), {
            type: 'bar',
            data: {
                labels: ['Jul 14', 'Jul 15', 'Jul 16', 'Jul 17', 'Jul 18', 'Jul 19', 'Jul 20'],
                datasets: [{
                    label: I18n.t('aitryon.totalSessions'),
                    data: [12, 18, 15, 22, 28, 31, 35],
                    backgroundColor: '#7C5FCF',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, grid: { color: '#F3F4F6' } } }
            }
        });

        const converted = MockData.aiTryOns.filter(a => a.converted).length;
        const notConverted = MockData.aiTryOns.length - converted;
        { const c = document.getElementById('convChart'); if (c) { const e = Chart.getChart(c); if (e) e.destroy(); } }
        window._tatitoCharts.conv = new Chart(document.getElementById('convChart'), {
            type: 'doughnut',
            data: {
                labels: [I18n.t('aitryon.converted'), I18n.t('aitryon.notConverted')],
                datasets: [{
                    data: [converted, notConverted],
                    backgroundColor: ['#2D9A6C', '#E5E7EB'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false, cutout: '70%',
                plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } }
            }
        });

        $('#aiTryOnTable').DataTable({
            data: MockData.aiTryOns,
            columns: [
                { data: 'id' },
                { data: 'user' },
                { data: 'product' },
                { data: 'tryOnCount' },
                { data: 'colorsTried', render: d => d.map(c => `<span class="badge badge-info text-xs">${c}</span>`).join(' ') },
                { data: 'date', render: d => Helpers.formatDate(d) },
                { data: 'converted', render: d => d ? `<span class="badge badge-success"><i class="bi bi-check-circle"></i> ${I18n.t('common.active').split(' ')[0]}</span>` : `<span class="badge badge-gray"><i class="bi bi-x-circle"></i> ✗</span>` },
                { data: 'status', render: d => Helpers.statusBadge(d) }
            ],
            pageLength: 10,
            language: { search: "", searchPlaceholder: I18n.t('common.search') + '...' }
        });
    }
};
