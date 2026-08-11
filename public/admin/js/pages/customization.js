/* ============================================
   Customization Requests Page
   ============================================ */

const CustomizationPage = {
    render() {
        return `
        <div class="breadcrumb">
            <i class="bi bi-house"></i> <span>${I18n.t('common.home')}</span> <i class="bi bi-chevron-right"></i> <span>${I18n.t('nav.customization')}</span>
        </div>
        <div class="page-header">
            <div>
                <h1 class="page-title"><i class="bi bi-scissors"></i> ${I18n.t('custom.title')}</h1>
                <p class="page-subtitle">${I18n.t('custom.subtitle')}</p>
            </div>
        </div>

        <div class="stat-grid">
            <div class="stat-card"><div class="stat-info"><h3>${MockData.customizations.length}</h3><p>${I18n.t('custom.totalRequests')}</p></div><div class="stat-icon blue"><i class="bi bi-scissors"></i></div></div>
            <div class="stat-card"><div class="stat-info"><h3>${MockData.customizations.filter(c => c.status === 'pending').length}</h3><p>${I18n.t('custom.pending')}</p></div><div class="stat-icon gold"><i class="bi bi-clock"></i></div></div>
            <div class="stat-card"><div class="stat-info"><h3>${MockData.customizations.filter(c => c.status === 'quoted' || c.status === 'accepted').length}</h3><p>${I18n.t('custom.active')}</p></div><div class="stat-icon green"><i class="bi bi-arrow-clockwise"></i></div></div>
            <div class="stat-card"><div class="stat-info"><h3>${MockData.customizations.filter(c => c.status === 'completed').length}</h3><p>${I18n.t('custom.completed')}</p></div><div class="stat-icon purple"><i class="bi bi-check-circle"></i></div></div>
        </div>

        <div class="grid-2">
            ${MockData.customizations.map(c => `
                <div class="customization-card">
                    <div class="req-header">
                        <div class="cell-user">
                            <div class="avatar" style="background:${Helpers.avatarColor(c.customer)}">${Helpers.initials(c.customer)}</div>
                            <div class="user-cell-info">
                                <div class="user-cell-name">${c.customer}</div>
                                <div class="user-cell-meta">${c.id} • ${c.city}</div>
                            </div>
                        </div>
                        ${Helpers.statusBadge(c.status)}
                    </div>
                    <div class="req-grid">
                        <div class="req-field"><span class="label">${I18n.t('custom.type')}</span><span class="value">${c.type}</span></div>
                        <div class="req-field"><span class="label">${I18n.t('custom.cloth')}</span><span class="value">${c.clothType}</span></div>
                        <div class="req-field"><span class="label">${I18n.t('custom.budget')}</span><span class="value text-bold">${Helpers.currency(c.budget)}</span></div>
                        <div class="req-field"><span class="label">${I18n.t('custom.measurements')}</span><span class="value">${c.measurements}</span></div>
                        <div class="req-field"><span class="label">${I18n.t('custom.referenceImage')}</span><span class="value">${c.referenceImage ? `<span class="badge badge-success"><i class="bi bi-image"></i> ${I18n.t('custom.uploaded')}</span>` : `<span class="text-muted">—</span>`}</span></div>
                        <div class="req-field"><span class="label">${I18n.t('common.date')}</span><span class="value">${Helpers.formatDate(c.date)}</span></div>
                    </div>
                    ${c.designer ? `
                        <div class="detail-row" style="padding:8px 0;border-top:1px solid var(--gray-100)">
                            <span class="label">${I18n.t('custom.assignedDesigner')}</span>
                            <span class="value text-bold">${c.designer}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">${I18n.t('custom.quotation')}</span>
                            <span class="value text-success text-bold">${Helpers.currency(c.quotation)}</span>
                        </div>
                    ` : `<p class="text-muted text-sm mt-2">${I18n.t('custom.noDesigner')}</p>`}
                    <div class="flex gap-sm mt-3">
                        <button class="btn btn-outline btn-sm" onclick="CustomizationPage.view('${c.id}')"><i class="bi bi-eye"></i> ${I18n.t('custom.details')}</button>
                        <button class="btn btn-primary btn-sm" onclick="App.navigate('quotations')"><i class="bi bi-file-earmark-text"></i> ${I18n.t('custom.viewQuotations')}</button>
                    </div>
                </div>
            `).join('')}
        </div>
        `;
    },

    view(id) {
        const c = MockData.customizations.find(x => x.id === id);
        if (!c) return;
        App.showModal(I18n.t('custom.requestDetails') + ' — ' + c.id, `
            <div class="detail-section">
                <h4>${I18n.t('custom.customerRequest')}</h4>
                <div class="detail-row"><span class="label">${I18n.t('orders.customer')}</span><span class="value">${c.customer}</span></div>
                <div class="detail-row"><span class="label">${I18n.t('users.city')}</span><span class="value">${c.city}</span></div>
                <div class="detail-row"><span class="label">${I18n.t('custom.type')}</span><span class="value">${c.type}</span></div>
                <div class="detail-row"><span class="label">${I18n.t('custom.clothMaterial')}</span><span class="value">${c.clothType}</span></div>
                <div class="detail-row"><span class="label">${I18n.t('custom.budget')}</span><span class="value text-bold">${Helpers.currency(c.budget)}</span></div>
                <div class="detail-row"><span class="label">${I18n.t('custom.measurements')}</span><span class="value">${c.measurements}</span></div>
                <div class="detail-row"><span class="label">${I18n.t('custom.referenceImage')}</span><span class="value">${c.referenceImage ? I18n.t('custom.uploaded') + ' ✓' : '—'}</span></div>
                <div class="detail-row"><span class="label">${I18n.t('common.status')}</span><span class="value">${Helpers.statusBadge(c.status)}</span></div>
                <div class="detail-row"><span class="label">${I18n.t('common.date')}</span><span class="value">${Helpers.formatDate(c.date)}</span></div>
            </div>
            ${c.designer ? `
                <div class="detail-section">
                    <h4>${I18n.t('custom.designerAssignment')}</h4>
                    <div class="detail-row"><span class="label">${I18n.t('designers.designer')}</span><span class="value">${c.designer}</span></div>
                    <div class="detail-row"><span class="label">${I18n.t('custom.quotation')}</span><span class="value text-success text-bold">${Helpers.currency(c.quotation)}</span></div>
                </div>
            ` : ''}
        `, `<button class="btn btn-outline" onclick="App.closeModal()">${I18n.t('common.close')}</button>
            <button class="btn btn-primary" onclick="App.closeModal();App.navigate('quotations')"><i class="bi bi-file-earmark-text"></i> ${I18n.t('custom.viewQuotations')}</button>`);
    }
};
