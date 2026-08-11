/* TATITO FASHIONS — Helpers */

const Helpers = {
    currency(n) {
        if (n == null || isNaN(n)) return '\u20B90';
        return '\u20B9' + Number(n).toLocaleString('en-IN');
    },
    formatCurrency(n) { return this.currency(n); },
    formatNumber(n) {
        if (n == null || isNaN(n)) return '0';
        return Number(n).toLocaleString('en-IN');
    },
    formatDate(d) {
        if (!d) return '\u2014';
        const date = new Date(d);
        if (isNaN(date)) return '\u2014';
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    },
    formatDateTime(d) {
        if (!d) return '\u2014';
        const date = new Date(d);
        if (isNaN(date)) return '\u2014';
        return date.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
    capitalize(str) {
        if (!str) return '\u2014';
        return String(str).charAt(0).toUpperCase() + String(str).slice(1);
    },
    statusBadge(status) {
        var map = { active:'badge-success', pending:'badge-warning', approved:'badge-success', rejected:'badge-danger', completed:'badge-success', delivered:'badge-success', shipped:'badge-info', out_for_delivery:'badge-info', processing:'badge-info', stitching:'badge-info', qc:'badge-info', packing:'badge-info', accepted:'badge-info', placed:'badge-info', cancelled:'badge-danger', confirmed:'badge-info', paid:'badge-success', published:'badge-success', draft:'badge-gray' };
        var cls = map[(status||'pending').toLowerCase()] || 'badge-warning';
        return cls;
    },
    avatar(name) {
        if (!name) return '?';
        return name.charAt(0).toUpperCase();
    },
    initials(name) {
        if (!name) return '?';
        var parts = String(name).trim().split(/\s+/);
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    },
    escapeHtml(str) {
        if (str == null) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },
    destroyChart(canvasId) {
        if (typeof Chart === 'undefined') return;
        var canvas = document.getElementById(canvasId);
        if (!canvas) return;
        var existing = Chart.getChart(canvas);
        if (existing) { try { existing.destroy(); } catch(e) {} }
    },
    orderTimeline(currentStatus) {
        var steps = ['placed','confirmed','processing','shipped','out_for_delivery','delivered'];
        var labels = { placed: 'Order Placed', confirmed: 'Confirmed', processing: 'Processing', shipped: 'Shipped', out_for_delivery: 'Out for Delivery', delivered: 'Delivered' };
        var currentIdx = steps.indexOf(currentStatus);
        if (currentStatus === 'completed') currentIdx = steps.indexOf('delivered');
        if (currentStatus === 'cancelled') {
            return '<div style="padding:12px;background:#FEF2F2;border-radius:8px;color:#C0463A;font-size:0.85rem;text-align:center"><i class="bi bi-x-circle"></i> Order was cancelled</div>';
        }
        var html = '<div class="order-timeline" style="display:flex;flex-direction:column;gap:12px">';
        steps.forEach(function(step, i) {
            var isDone = i <= currentIdx;
            var isCurrent = i === currentIdx;
            var iconClass = isDone ? (isCurrent ? 'bi-check-circle-fill' : 'bi-check-circle-fill') : 'bi-circle';
            var color = isDone ? '#2D9A6C' : '#C4C0B8';
            html += '<div style="display:flex;align-items:center;gap:10px">';
            html += '<i class="bi ' + iconClass + '" style="font-size:1.2rem;color:' + color + '"></i>';
            html += '<div>';
            html += '<div style="font-size:0.85rem;font-weight:' + (isCurrent ? '600' : '400') + ';color:' + (isDone ? 'var(--black)' : 'var(--gray-400)') + '">' + (labels[step] || step) + '</div>';
            html += '</div></div>';
        });
        html += '</div>';
        return html;
    },
    avatarColor(seed) {
        var colors = ['#C9A24B','#3D5A80','#7B2D26','#2D6A4F','#8338EC','#E63946','#457B9D','#F4A261','#264653','#A72608'];
        var s = String(seed || '');
        var total = 0;
        for (var i = 0; i < s.length; i++) total += s.charCodeAt(i);
        return colors[total % colors.length];
    },
    truncate(str, len) {
        if (!str) return '';
        return str.length > len ? str.substring(0, len) + '\u2026' : str;
    },
    stars(rating) {
        if (!rating) return '';
        var r = Math.round(rating);
        return '\u2605'.repeat(r) + '\u2606'.repeat(5 - r);
    },
    percentage(val, total) {
        if (!total) return '0%';
        return Math.round((val / total) * 100) + '%';
    },
    timeAgo(dateStr) {
        if (!dateStr) return '';
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'just now';
        if (mins < 60) return mins + 'm ago';
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return hrs + 'h ago';
        return Math.floor(hrs / 24) + 'd ago';
    },
    toast(typeOrMessage, messageOrType) {
        var type, message;
        if (typeof typeOrMessage === 'string' && ['success','error','warning','info'].indexOf(typeOrMessage) >= 0) {
            type = typeOrMessage; message = messageOrType;
        } else {
            message = typeOrMessage; type = messageOrType || 'info';
        }
        if (!message) return;
        var container = document.querySelector('.toast-container');
        if (!container) { container = document.createElement('div'); container.className = 'toast-container'; document.body.appendChild(container); }
        var icon = type === 'success' ? 'bi-check-circle-fill' : type === 'error' ? 'bi-x-circle-fill' : type === 'warning' ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill';
        var toast = document.createElement('div');
        toast.className = 'toast-item ' + type;
        toast.innerHTML = '<i class="bi ' + icon + '"></i><span>' + message + '</span>';
        container.appendChild(toast);
        setTimeout(function() { toast.style.opacity = '0'; setTimeout(function() { toast.remove(); }, 300); }, 3000);
    },
    confirm(messageOrOpts, callbackOrText, icon) {
        var message, callback;
        if (typeof messageOrOpts === 'object' && messageOrOpts !== null) {
            message = messageOrOpts.title || messageOrOpts.text || 'Are you sure?';
            callback = messageOrOpts.callback;
        } else if (typeof callbackOrText === 'function') {
            message = messageOrOpts; callback = callbackOrText;
        } else {
            message = messageOrOpts; callback = null;
        }
        if (typeof Swal !== 'undefined') {
            return Swal.fire({
                title: message, icon: icon || 'warning',
                showCancelButton: true, confirmButtonColor: '#C9A24B', cancelButtonColor: '#888',
                confirmButtonText: 'Yes', cancelButtonText: 'Cancel'
            }).then(function(result) {
                if (result.isConfirmed && typeof callback === 'function') callback();
                return result;
            });
        } else {
            var confirmed = window.confirm(message);
            if (confirmed && typeof callback === 'function') callback();
            return Promise.resolve({ isConfirmed: confirmed });
        }
    },
    openModal(html) {
        var overlay = document.getElementById('modalOverlay');
        var box = document.getElementById('modalBox');
        if (!overlay || !box) return;
        box.innerHTML = html;
        overlay.style.display = 'flex';
        overlay.onclick = function(e) { if (e.target === overlay) Helpers.closeModal(); };
    },
    closeModal() {
        var overlay = document.getElementById('modalOverlay');
        if (overlay) overlay.style.display = 'none';
    },
    downloadCSV(filename, headersOrRows, rowsArg) {
        var rows, headers;
        if (Array.isArray(headersOrRows) && rowsArg) {
            headers = headersOrRows; rows = rowsArg;
            rows = [headers].concat(rows);
        } else {
            rows = headersOrRows || [];
        }
        var csv = rows.map(function(r) { return r.map(function(c) { return '"' + String(c || '').replace(/"/g, '""') + '"'; }).join(','); }).join('\n');
        var blob = new Blob([csv], { type: 'text/csv' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a'); a.href = url; a.download = filename; a.click();
        URL.revokeObjectURL(url);
    }
};
