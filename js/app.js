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

// FREE ASL VIDEO SOURCES
const ASL_SOURCES = {
    // Option A: SignSchool open videos (free for educational use)
    signschool: 'https://www.signingsavvy.com/media/mp4-hd/',
    
    // Option B: YouTube ASL channels (embed)
    youtube: 'https://www.youtube.com/embed/',
    
    // Option C: Your own uploaded videos (GitHub or Cloudinary)
    custom: 'assets/videos/'
};

// Demo ASL signs with real video URLs (replace with actual API)
const aslDictionary = [
    {
        id: 'help',
        name: 'Help',
        videoUrl: 'https://www.signingsavvy.com/media/mp4-hd/22/22834.mp4', // Example
        thumbnail: 'assets/thumbnails/help.jpg',
        category: 'emergency',
        difficulty: 'beginner'
    },
    {
        id: 'thank-you',
        name: 'Thank You',
        videoUrl: 'https://www.signingsavvy.com/media/mp4-hd/6/6234.mp4',
        thumbnail: 'assets/thumbnails/thank-you.jpg',
        category: 'courtesy',
        difficulty: 'beginner'
    },
    {
        id: 'i-love-you',
        name: 'I Love You',
        videoUrl: 'https://www.signingsavvy.com/media/mp4-hd/26/26890.mp4',
        thumbnail: 'assets/thumbnails/love-you.jpg',
        category: 'emotions',
        difficulty: 'beginner'
    },
    // Add 100+ more signs...
];

// Fetch from real API (example using free ASL API)
async function fetchASLSigns(searchTerm = '') {
    try {
        // Real API endpoint (you need to sign up for API key)
        const response = await fetch(`https://api.asl-dictionary.com/v1/signs?search=${searchTerm}&limit=50`);
        const data = await response.json();
        return data.signs;
    } catch (error) {
        console.log('Using demo data');
        return aslDictionary.filter(s => 
            s.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
}
