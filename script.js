// script.js - Tatito Fashions Admin Panel

// ============================================
// NAVIGATION - Section Switching
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a[data-section]');

    function switchSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section-content').forEach(section => {
            section.classList.remove('active-section');
        });

        // Show selected section
        const targetSection = document.getElementById(`section-${sectionId}`);
        if (targetSection) {
            targetSection.classList.add('active-section');
        }

        // Update active state in sidebar
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === sectionId) {
                link.classList.add('active');
            }
        });

        // Update page title
        const titleMap = {
            'dashboard': 'Admin · Dashboard',
            'users': 'Admin · Users',
            'sellers': 'Admin · Sellers',
            'providers': 'Admin · Service Providers',
            'designers': 'Admin · Designers',
            'bookings': 'Admin · Bookings'
        };

        const topBar = document.querySelector('.top-bar h1');
        if (topBar && titleMap[sectionId]) {
            topBar.textContent = titleMap[sectionId];
        }
    }

    // Sidebar link clicks
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            if (section) {
                switchSection(section);
            }
        });
    });

    // ============================================
    // LOGOUT FUNCTIONALITY
    // ============================================

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                showNotification('Logging out...');
                setTimeout(() => {
                    showNotification('Logged out successfully');
                }, 500);
            }
        });
    }

    // ============================================
    // TOAST NOTIFICATION SYSTEM
    // ============================================

    window.showNotification = function(message, isSuccess = true) {
        const toast = document.getElementById('notificationToast');
        if (!toast) return;

        if (toast._timeout) {
            clearTimeout(toast._timeout);
        }

        const icon = isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle';
        toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
        toast.classList.add('show');

        toast._timeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };

    // ============================================
    // KEYBOARD SHORTCUTS
    // ============================================

    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key >= '1' && e.key <= '6') {
            e.preventDefault();
            const sections = ['dashboard', 'users', 'sellers', 'providers', 'designers', 'bookings'];
            const index = parseInt(e.key) - 1;
            if (sections[index]) {
                switchSection(sections[index]);
                showNotification(`Navigated to ${sections[index]}`);
            }
        }

        if (e.key === 'Escape') {
            const toast = document.getElementById('notificationToast');
            if (toast) {
                toast.classList.remove('show');
            }
        }
    });

    // ============================================
    // AUTO-REFRESH STATS (simulated)
    // ============================================

    setInterval(() => {
        const stats = document.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            const current = parseInt(stat.textContent.replace(/,/g, ''));
            if (!isNaN(current) && current > 0) {
                const change = Math.floor(Math.random() * 3) + 1;
                const newVal = current + (Math.random() > 0.5 ? change : -change);
                stat.textContent = Math.max(newVal, 10).toLocaleString();
            }
        });
    }, 30000);

    // ============================================
    // INITIAL LOAD
    // ============================================

    switchSection('dashboard');

    console.log('Tatito Fashions Admin Panel loaded successfully!');
    console.log('Keyboard shortcuts: Ctrl+1 (Dashboard), Ctrl+2 (Users), Ctrl+3 (Sellers), etc.');
});