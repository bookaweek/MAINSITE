const vault = {
    signs: [],
    collections: [
        { id: 'general', name: 'General', icon: '📁', count: 0 },
        { id: 'medical', name: 'Medical', icon: '🏥', count: 0 },
        { id: 'work', name: 'Work', icon: '💼', count: 0 },
        { id: 'daily', name: 'Daily Life', icon: '🍳', count: 0 }
    ],
    currentStep: 1,
    captureMode: null,
    mediaRecorder: null,
    recordedChunks: [],
    isRecording: false,
    recordingTimer: null,
    recordingSeconds: 0,

    init() {
        this.loadDemoData();
        this.renderCollections();
        this.renderSigns();
        this.updateStats();
    },

    loadDemoData() {
        this.signs = [
            {
                id: '1',
                name: 'Help',
                collection: 'general',
                tags: ['urgent', 'basic'],
                status: 'mastered',
                mastery: 92,
                views: 45,
                lastPracticed: new Date().toISOString(),
                addedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
                videoUrl: '',
                thumbnail: ''
            },
            {
                id: '2',
                name: 'Doctor',
                collection: 'medical',
                tags: ['medical', 'urgent'],
                status: 'learning',
                mastery: 65,
                views: 12,
                lastPracticed: new Date(Date.now() - 86400000 * 2).toISOString(),
                addedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
                videoUrl: '',
                thumbnail: ''
            },
            {
                id: '3',
                name: 'Pain',
                collection: 'medical',
                tags: ['medical', 'emergency'],
                status: 'learning',
                mastery: 45,
                views: 8,
                lastPracticed: new Date(Date.now() - 86400000).toISOString(),
                addedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
                videoUrl: '',
                thumbnail: ''
            },
            {
                id: '4',
                name: '911/Emergency',
                collection: 'medical',
                tags: ['emergency', 'critical'],
                status: 'new',
                mastery: 0,
                views: 3,
                lastPracticed: null,
                addedAt: new Date().toISOString(),
                videoUrl: '',
                thumbnail: ''
            }
        ];
    },

    renderCollections() {
        const grid = document.getElementById('collections-grid');
        if (!grid) return;
        
        grid.innerHTML = this.collections.map(col => {
            const count = this.signs.filter(s => s.collection === col.id).length;
            return `
                <div class="collection-card" onclick="vault.filterByCollection('${col.id}')">
                    <span class="collection-icon">${col.icon}</span>
                    <div class="collection-info">
                        <h4>${col.name}</h4>
                        <span class="collection-count">${count} signs</span>
                    </div>
                </div>
            `;
        }).join('');
    },

  function renderSigns(signsToShow = ASL_SIGNS) {
    const grid = document.getElementById('signs-grid');
    if (!grid) return;
    
    if (signsToShow.length === 0) {
        grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px;">No signs found</p>';
        return;
    }
    
    grid.innerHTML = signsToShow.map(sign => `
        <div class="sign-card" onclick="playASLVideo('${sign.id}')">
            <div class="sign-thumbnail">
                <img src="${getYouTubeThumbnail(sign.video)}" 
                     style="width:100%;height:100%;object-fit:cover;"
                     onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                <div style="display:none;width:100%;height:100%;background:linear-gradient(135deg,rgba(255,0,110,0.2),rgba(251,86,7,0.1));align-items:center;justify-content:center;font-size:3rem;">✋</div>
                <div class="play-overlay">
                    <div class="play-icon">▶️</div>
                </div>
            </div>
            <div class="sign-info">
                <h4 class="sign-name">${sign.name}</h4>
                <div class="sign-meta">
                    <span class="status-badge" style="background:rgba(255,0,110,0.2);color:#FF006E;">${sign.category}</span>
                    <span style="font-size:0.7rem;color:var(--text-muted);">Level ${sign.difficulty}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function playASLVideo(signId) {
    const sign = ASL_SIGNS.find(s => s.id == signId);
    if (!sign) return;
    
    // Create video modal
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.style.cssText = 'display:flex;align-items:center;justify-content:center;';
    modal.innerHTML = `
        <div class="modal-content modal-large" style="max-width:900px;width:90%;background:#0a0a0f;border:1px solid rgba(255,0,110,0.3);">
            <div class="modal-header" style="border-bottom:1px solid rgba(255,255,255,0.1);">
                <h2 style="color:white;">${sign.name}</h2>
                <button class="btn-close" onclick="this.closest('.modal').remove()" style="background:rgba(255,0,110,0.2);color:#FF006E;">×</button>
            </div>
            <div style="padding:20px;">
                <div style="aspect-ratio:16/9;background:black;border-radius:12px;overflow:hidden;">
                    <iframe src="${sign.video}?autoplay=1&rel=0" 
                            style="width:100%;height:100%;border:none;"
                            allowfullscreen
                            allow="autoplay; encrypted-media">
                    </iframe>
                </div>
                <div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap;">
                    <button class="btn-primary" onclick="addToMyVault('${sign.id}')" style="flex:1;min-width:140px;">
                        + Add to My Vault
                    </button>
                    <button class="btn-secondary" onclick="showRelated('${sign.category}')" style="flex:1;min-width:140px;">
                        More ${sign.category}
                    </button>
                    <button class="btn-secondary" onclick="this.closest('.modal').remove()">
                        Close
                    </button>
                </div>
                <div style="margin-top:20px;padding:15px;background:rgba(255,255,255,0.03);border-radius:8px;">
                    <p style="color:var(--text-secondary);font-size:0.9rem;">
                        <strong>Category:</strong> ${sign.category} | 
                        <strong>Difficulty:</strong> ${'⭐'.repeat(sign.difficulty)} | 
                        <strong>ID:</strong> ${sign.id}
                    </p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Increment view count (in real app, save to database)
    sign.views = (sign.views || 0) + 1;
}

function addToMyVault(signId) {
    const sign = ASL_SIGNS.find(s => s.id == signId);
    showToast(`"${sign.name}" added to your vault!`, 'success');
}

function showRelated(category) {
    const related = getSignsByCategory(category);
    renderSigns(related);
    document.querySelector('.modal.active')?.remove();
    showToast(`Showing ${related.length} ${category} signs`, 'info');
    goToPage('vault');
}

// Initialize with all signs
function initVault() {
    renderCollections();
    renderSigns(ASL_SIGNS); // Show ALL 50 signs immediately
    updateStats();
}

function renderCollections() {
    const grid = document.getElementById('collections-grid');
    if (!grid) return;
    
    grid.innerHTML = CATEGORIES.map(cat => {
        const count = cat.id === 'all' ? ASL_SIGNS.length : ASL_SIGNS.filter(s => s.category === cat.id).length;
        return `
            <div class="collection-card" onclick="filterByCategory('${cat.id}')">
                <span class="collection-icon" style="font-size:2rem;">${cat.icon}</span>
                <div class="collection-info">
                    <h4 style="color:white;margin-bottom:4px;">${cat.name}</h4>
                    <span class="collection-count" style="color:var(--text-muted);font-size:0.875rem;">${count} signs</span>
                </div>
            </div>
        `;
    }).join('');
}

function filterByCategory(categoryId) {
    const filtered = getSignsByCategory(categoryId);
    renderSigns(filtered);
    showToast(`${filtered.length} signs in ${categoryId}`, 'info');
}

function updateStats() {
    document.getElementById('stat-total').textContent = ASL_SIGNS.length;
    document.getElementById('stat-mastered').textContent = '0'; // User hasn't mastered any yet
    document.getElementById('stat-learning').textContent = '0';
    document.getElementById('vault-count').textContent = '0';
}

    openAddModal() {
        this.currentStep = 1;
        this.resetAddForm();
        this.updateStepIndicator();
        document.getElementById('add-sign-modal').classList.add('active');
    },

    closeAddModal() {
        this.stopRecording();
        document.getElementById('add-sign-modal').classList.remove('active');
    },

    resetAddForm() {
        document.getElementById('sign-name').value = '';
        document.getElementById('sign-collection').value = 'general';
        document.getElementById('sign-tags').value = '';
        document.getElementById('sign-note').value = '';
        document.getElementById('capture-options').style.display = 'grid';
        document.getElementById('capture-preview').style.display = 'none';
        this.recordedChunks = [];
        this.captureMode = null;
    },

    updateStepIndicator() {
        document.querySelectorAll('.step').forEach((el, i) => {
            el.classList.toggle('active', i + 1 === this.currentStep);
        });
        
        document.getElementById('prev-btn').style.display = this.currentStep > 1 ? 'block' : 'none';
        document.getElementById('next-btn').style.display = this.currentStep < 3 ? 'block' : 'none';
        document.getElementById('save-btn').style.display = this.currentStep === 3 ? 'block' : 'none';
    },

    setCaptureMode(mode) {
        this.captureMode = mode;
        document.getElementById('capture-options').style.display = 'none';
        document.getElementById('capture-preview').style.display = 'block';
        
        if (mode === 'camera') {
            this.initCamera();
        } else if (mode === 'upload') {
            this.triggerUpload();
        }
    },

    async initCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'user', width: 1280, height: 720 },
                audio: false 
            });
            
            const video = document.getElementById('capture-video');
            video.srcObject = stream;
            
            this.mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp9,opus'
            });
            
            this.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) this.recordedChunks.push(e.data);
            };
            
            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                video.srcObject = null;
                video.src = url;
                video.controls = true;
            };
        } catch (err) {
            app.showToast('Camera access denied', 'error');
        }
    },

    triggerUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const url = URL.createObjectURL(file);
                const video = document.getElementById('capture-video');
                video.src = url;
                video.controls = true;
                this.recordedChunks = [file];
            }
        };
        input.click();
    },

    toggleRecording() {
        const btn = document.getElementById('record-btn');
        
        if (!this.isRecording) {
            this.recordedChunks = [];
            this.mediaRecorder.start();
            this.isRecording = true;
            btn.classList.add('recording');
            
            this.recordingSeconds = 0;
            this.recordingTimer = setInterval(() => {
                this.recordingSeconds++;
                const mins = Math.floor(this.recordingSeconds / 60).toString().padStart(2, '0');
                const secs = (this.recordingSeconds % 60).toString().padStart(2, '0');
                document.getElementById('record-timer').textContent = `${mins}:${secs}`;
            }, 1000);
        } else {
            this.mediaRecorder.stop();
            this.isRecording = false;
            btn.classList.remove('recording');
            clearInterval(this.recordingTimer);
            
            const video = document.getElementById('capture-video');
            if (video.srcObject) {
                video.srcObject.getTracks().forEach(track => track.stop());
            }
        }
    },

    stopRecording() {
        if (this.isRecording) this.toggleRecording();
    },

    nextStep() {
        if (this.currentStep === 1 && this.recordedChunks.length === 0) {
            app.showToast('Please record or upload a video first', 'warning');
            return;
        }
        
        if (this.currentStep === 2) {
            const name = document.getElementById('sign-name').value.trim();
            if (!name) {
                app.showToast('Please enter a sign name', 'warning');
                return;
            }
            this.updatePreview();
        }
        
        this.currentStep++;
        this.updateStepIndicator();
        
        document.querySelectorAll('.step-content').forEach((el, i) => {
            el.classList.toggle('active', i + 1 === this.currentStep);
        });
    },

    prevStep() {
        this.currentStep--;
        this.updateStepIndicator();
        
        document.querySelectorAll('.step-content').forEach((el, i) => {
            el.classList.toggle('active', i + 1 === this.currentStep);
        });
    },

    updatePreview() {
        const name = document.getElementById('sign-name').value;
        document.getElementById('preview-name').textContent = name;
        
        const video = document.getElementById('final-preview');
        const captureVideo = document.getElementById('capture-video');
        video.src = captureVideo.src;
    },

    saveSign() {
        const name = document.getElementById('sign-name').value.trim();
        const collection = document.getElementById('sign-collection').value;
        const tags = document.getElementById('sign-tags').value.split(',').map(t => t.trim()).filter(t => t);
        const note = document.getElementById('sign-note').value;
        
        const newSign = {
            id: Date.now().toString(),
            name,
            collection,
            tags,
            note,
            status: 'new',
            mastery: 0,
            views: 0,
            lastPracticed: null,
            addedAt: new Date().toISOString(),
            videoUrl: document.getElementById('capture-video').src,
            thumbnail: null
        };
        
        this.signs.unshift(newSign);
        this.renderSigns();
        this.renderCollections();
        this.updateStats();
        this.closeAddModal();
        
        app.showToast(`"${name}" added to vault!`, 'success');
    },

    openSignDetail(signId) {
        const sign = this.signs.find(s => s.id === signId);
        if (!sign) return;
        
        sign.views++;
        
        const modal = document.getElementById('sign-detail-modal');
        const content = document.getElementById('sign-detail-content');
        
        content.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <div>
                    <div style="aspect-ratio: 16/9; background: var(--bg-tertiary); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 5rem; margin-bottom: 1rem;">
                        ✋
                    </div>
                    <button class="btn-primary" onclick="vault.practiceSign('${sign.id}')" style="width: 100%; margin-bottom: 0.5rem;">
                        🪞 Practice in Mirror
                    </button>
                    <button class="btn-secondary" onclick="vault.deleteSign('${sign.id}')" style="width: 100%;">
                        🗑️ Delete
                    </button>
                </
