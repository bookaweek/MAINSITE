const app = {
    currentPage: 'vault',
    isOnline: navigator.onLine,

    init() {
        this.checkOnlineStatus();
        this.setupEventListeners();
        
        // Start with splash
        setTimeout(() => {
            this.hideSplash();
        }, 2500);
    },

    hideSplash() {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.classList.add('hidden');
            setTimeout(() => splash.remove(), 500);
        }
        
        // Initialize vault
        vault.init();
    },

    enterApp() {
        document.getElementById('landing-page').classList.remove('active');
        document.getElementById('main-app').classList.add('active');
        this.navigate('vault');
        vault.init();
    },

    showDemo() {
        this.showToast('Demo video coming soon!', 'info');
    },

    navigate(page) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === page) item.classList.add('active');
        });

        document.querySelectorAll('.page-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const target = document.getElementById(`page-${page}`);
        if (target) target.classList.add('active');

        this.currentPage = page;
        
        if (page === 'mirror') mirror.init();
    },

    checkOnlineStatus() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateSyncStatus(true);
            this.showToast('Back online!', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateSyncStatus(false);
            this.showToast('Offline mode active', 'warning');
        });
    },

    updateSyncStatus(online) {
        const indicator = document.querySelector('.sync-indicator');
        const text = document.querySelector('.sync-text');
        if (indicator && text) {
            indicator.classList.toggle('online', online);
            indicator.classList.toggle('offline', !online);
            text.textContent = online ? 'Online' : 'Offline';
        }
    },

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
            }
        });

        const search = document.getElementById('global-search');
        if (search) {
            search.addEventListener('input', (e) => {
                if (this.currentPage === 'vault') vault.search(e.target.value);
            });
        }
    },

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    openProfile() {
        this.showToast('Profile coming soon!', 'info');
    },

    openSettings() {
        this.showToast('Settings coming soon!', 'info');
    },

    toggleNotifications() {
        this.showToast('No new notifications', 'info');
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
