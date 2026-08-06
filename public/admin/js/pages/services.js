/* ============================================
   Services Management Page
   ============================================ */

const ServicesPage = {
    render() {
        return `
        <div class="breadcrumb">
            <i class="bi bi-house"></i> <span>${I18n.t('common.home')}</span> <i class="bi bi-chevron-right"></i> <span>${I18n.t('nav.services')}</span>
        </div>
        <div class="page-header">
            <div>
                <h1 class="page-title"><i class="bi bi-briefcase"></i> ${I18n.t('services.title')}</h1>
                <p class="page-subtitle">${I18n.t('services.subtitle')}</p>
            </div>
            <div class="page-actions">
                <button class="btn btn-primary" onclick="ServicesPage.showAddForm()"><i class="bi bi-plus-lg"></i> ${I18n.t('services.addService')}</button>
            </div>
        </div>

        <div class="stat-grid">
            <div class="stat-card">
                <div class="stat-info"><h3>${MockData.services.length}</h3><p>${I18n.t('services.totalServices')}</p></div>
                <div class="stat-icon blue"><i class="bi bi-briefcase"></i></div>
            </div>
            <div class="stat-card">
                <div class="stat-info"><h3>${MockData.services.reduce((s,sv) => s + sv.bookings, 0)}</h3><p>${I18n.t('bookings.totalBookings')}</p></div>
                <div class="stat-icon green"><i class="bi bi-calendar-check"></i></div>
            </div>
            <div class="stat-card">
                <div class="stat-info"><h3>${MockData.bookings.filter(b => b.status === 'confirmed').length}</h3><p>${I18n.t('services.upcoming')}</p></div>
                <div class="stat-icon gold"><i class="bi bi-clock"></i></div>
            </div>
            <div class="stat-card">
                <div class="stat-info"><h3>${(MockData.services.reduce((s,sv) => s + sv.rating, 0) / MockData.services.length).toFixed(1)}</h3><p>${I18n.t('reviews.avgRating')}</p></div>
                <div class="stat-icon purple"><i class="bi bi-star"></i></div>
            </div>
        </div>

        <div class="table-wrap">
            <table id="servicesTable" class="display" style="width:100%">
                <thead>
                    <tr>
                        <th>${I18n.t('sellers.id')}</th>
                        <th>${I18n.t('services.serviceName')}</th>
                        <th>${I18n.t('common.category')}</th>
                        <th>${I18n.t('bookings.provider')}</th>
                        <th>${I18n.t('services.type')}</th>
                        <th>${I18n.t('common.price')}</th>
                        <th>${I18n.t('services.duration')}</th>
                        <th>${I18n.t('services.bookings')}</th>
                        <th>${I18n.t('common.rating')}</th>
                        <th>${I18n.t('users.city')}</th>
                        <th>${I18n.t('common.actions')}</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        `;
    },

    afterRender() {
        $('#servicesTable').DataTable({
            data: MockData.services,
            columns: [
                { data: 'id' },
                { data: 'name' },
                { data: 'category' },
                { data: 'provider' },
                { data: 'type', render: d => `<span class="badge badge-info">${d}</span>` },
                { data: 'price', render: d => Helpers.currency(d) },
                { data: 'duration' },
                { data: 'bookings' },
                { data: 'rating', render: d => `<span class="text-warning"><i class="bi bi-star-fill"></i> ${d}</span>` },
                { data: 'city' },
                {
                    data: null, orderable: false,
                    render: (data, type, row) => `
                        <div class="table-actions">
                            <button class="action-btn view" onclick="ServicesPage.viewService('${row.id}')" title="${I18n.t('common.view')}"><i class="bi bi-eye"></i></button>
                            <button class="action-btn edit" onclick="ServicesPage.editService('${row.id}')" title="${I18n.t('common.edit')}"><i class="bi bi-pencil"></i></button>
                            <button class="action-btn delete" onclick="ServicesPage.deleteService('${row.id}')" title="${I18n.t('common.delete')}"><i class="bi bi-trash"></i></button>
                        </div>`
                }
            ],
            pageLength: 10,
            language: { search: "", searchPlaceholder: I18n.t('services.searchPlaceholder') }
        });
    },

    viewService(id) {
        const sv = MockData.services.find(x => x.id === id);
        if (!sv) return;
        App.showModal(I18n.t('services.serviceDetails') + ' — ' + sv.name, `
            <div class="detail-section">
                <div class="detail-row"><span class="label">${I18n.t('sellers.id')}</span><span class="value">${sv.id}</span></div>
                <div class="detail-row"><span class="label">${I18n.t('common.name')}</span><span class="value">${Helpers.escapeHtml(sv.name)}</span></div>
                <div class="detail-row"><span class="label">${I18n.t('common.category')}</span><span class="value">${sv.category}</span></div>
                <div class="detail-row"><span class="label">${I18n.t('bookings.provider')}</span><span class="value">${sv.provider}</span></div>
                <div class="detail-row"><span class="label">${I18n.t('services.type')}</span><span class="value">${sv.type}</span></div>
                <div class="detail-row"><span class="label">${I18n.t('common.price')}</span><span class="value text-bold">${Helpers.currency(sv.price)}</span></div>
                <div class="detail-row"><span class="label">${I18n.t('services.duration')}</span><span class="value">${sv.duration}</span></div>
                <div class="detail-row"><span class="label">${I18n.t('users.city')}</span><span class="value">${sv.city}</span></div>
                <div class="detail-row"><span class="label">${I18n.t('services.bookings')}</span><span class="value">${sv.bookings}</span></div>
                <div class="detail-row"><span class="label">${I18n.t('common.rating')}</span><span class="value">⭐ ${sv.rating}</span></div>
                <div class="detail-row"><span class="label">${I18n.t('common.status')}</span><span class="value">${Helpers.statusBadge(sv.status)}</span></div>
            </div>
        `, `<button class="btn btn-outline" onclick="App.closeModal()">${I18n.t('common.close')}</button>
            <button class="btn btn-primary" onclick="App.closeModal();ServicesPage.editService('${sv.id}')"><i class="bi bi-pencil"></i> ${I18n.t('common.edit')}</button>`);
    },

    showAddForm() {
        App.showModal(I18n.t('services.addNew'), `
            <form id="addServiceForm">
                <div class="form-group"><label>${I18n.t('services.serviceName')} <span class="required">*</span></label><input type="text" class="form-control" name="name" required></div>
                <div class="form-row">
                    <div class="form-group"><label>${I18n.t('common.category')}</label>
                        <select class="form-control" name="category">
                            <option>Photography</option><option>Videography</option><option>Catering</option>
                            <option>Decoration</option><option>Makeup</option><option>Mandapam</option>
                            <option>Mehendi</option><option>Entertainment</option><option>Wedding Planning</option>
                        </select>
                    </div>
                    <div class="form-group"><label>${I18n.t('bookings.provider')}</label>
                        <select class="form-control" name="provider">
                            ${MockData.sellers.filter(s => s.status === 'approved').map(s => `<option>${s.businessName}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-row-3">
                    <div class="form-group"><label>${I18n.t('common.price')} (₹)</label><input type="number" class="form-control" name="price" value="5000"></div>
                    <div class="form-group"><label>${I18n.t('services.type')}</label>
                        <select class="form-control" name="type"><option>Hourly</option><option>Daily</option><option>Package</option><option>Combo</option></select>
                    </div>
                    <div class="form-group"><label>${I18n.t('services.duration')}</label><input type="text" class="form-control" name="duration" value="1 Hour"></div>
                </div>
                <div class="form-group"><label>${I18n.t('users.city')}</label><input type="text" class="form-control" name="city" value="Mumbai"></div>
            </form>
        `, `<button class="btn btn-outline" onclick="App.closeModal()">${I18n.t('common.cancel')}</button>
            <button class="btn btn-primary" onclick="ServicesPage.saveService()"><i class="bi bi-check-lg"></i> ${I18n.t('services.addService')}</button>`);
    },

    saveService() {
        const data = App.getFormData('addServiceForm');
        if (!data) return;
        MockData.services.push({
            id: Helpers.genId('SRV'),
            name: data.name, provider: data.provider, category: data.category,
            type: data.type, price: parseInt(data.price), duration: data.duration,
            bookings: 0, rating: 0, status: 'active', city: data.city
        });
        App.closeModal();
        Helpers.toast('success', I18n.t('services.serviceAdded'));
        App.navigate('services');
    },

    editService(id) {
        const sv = MockData.services.find(x => x.id === id);
        if (!sv) return;
        App.showModal(I18n.t('services.editService') + ' — ' + sv.name, `
            <form id="editServiceForm">
                <div class="form-group"><label>${I18n.t('services.serviceName')}</label><input type="text" class="form-control" name="name" value="${Helpers.escapeHtml(sv.name)}"></div>
                <div class="form-row">
                    <div class="form-group"><label>${I18n.t('common.price')} (₹)</label><input type="number" class="form-control" name="price" value="${sv.price}"></div>
                    <div class="form-group"><label>${I18n.t('services.duration')}</label><input type="text" class="form-control" name="duration" value="${sv.duration}"></div>
                </div>
                <div class="form-group"><label>${I18n.t('common.status')}</label>
                    <select class="form-control" name="status">
                        <option value="active" ${sv.status === 'active' ? 'selected' : ''}>${I18n.t('common.active')}</option>
                        <option value="inactive" ${sv.status === 'inactive' ? 'selected' : ''}>${I18n.t('common.inactive')}</option>
                    </select>
                </div>
            </form>
        `, `<button class="btn btn-outline" onclick="App.closeModal()">${I18n.t('common.cancel')}</button>
            <button class="btn btn-primary" onclick="ServicesPage.updateService('${id}')"><i class="bi bi-check-lg"></i> ${I18n.t('common.update')}</button>`);
    },

    updateService(id) {
        const data = App.getFormData('editServiceForm');
        if (!data) return;
        Object.assign(MockData.services.find(x => x.id === id), data);
        App.closeModal();
        Helpers.toast('success', I18n.t('services.serviceUpdated'));
        App.navigate('services');
    },

    deleteService(id) {
        Helpers.confirm(I18n.t('services.deleteService'), I18n.t('users.deleteConfirm')).then(r => {
            if (r.isConfirmed) {
                MockData.services = MockData.services.filter(s => s.id !== id);
                Helpers.toast('success', I18n.t('services.serviceDeleted'));
                App.navigate('services');
            }
        });
    }
};
