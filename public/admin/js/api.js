/* TATITO FASHIONS — API Layer (dual-mode) */

const Api = {
    BACKEND_MODE: false,
    API_BASE_URL: '/api',
    token: localStorage.getItem('tatito_token') || null,

    async request(method, path, body) {
        if (!this.BACKEND_MODE) throw new Error('Backend mode disabled');
        var headers = { 'Content-Type': 'application/json' };
        if (this.token) headers['Authorization'] = 'Bearer ' + this.token;
        var res = await fetch(this.API_BASE_URL + path, { method: method, headers: headers, body: body ? JSON.stringify(body) : null });
        if (res.status === 401) { localStorage.removeItem('tatito_token'); window.location.href = 'index.html'; return; }
        var data = await res.json();
        if (!res.ok) throw new Error(data.message || 'API Error');
        return data;
    },

    auth: {
        async login(email, password) {
            if (!Api.BACKEND_MODE) {
                var account = MockData.accounts.find(function(a) {
                    return a.email.toLowerCase() === email.toLowerCase() && a.password === password;
                });
                if (!account) throw new Error('Invalid credentials');
                return { token: btoa(account.email + ':' + Date.now()), account: account };
            }
            var res = await Api.request('POST', '/auth/login', { email: email, password: password });
            Api.token = res.token;
            localStorage.setItem('tatito_token', res.token);
            return res;
        },
        async register(data) {
            if (!Api.BACKEND_MODE) return { success: true };
            return await Api.request('POST', '/auth/register', data);
        },
        logout() {
            Api.token = null;
            localStorage.removeItem('tatito_token');
        }
    }
};
