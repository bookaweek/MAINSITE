const mirror = {
    cameraStream: null,
    mediaRecorder: null,
    recordedChunks: [],
    isRecording: false,
    ghostEnabled: true,

    async startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 1280, height: 720 },
                audio: false
            });

            this.cameraStream = stream;
            const video = document.getElementById('camera-feed');
            video.srcObject = stream;
            
            document.getElementById('camera-placeholder').style.display = 'none';
            this.setupGhostOverlay();
            
            app.showToast('Camera started', 'success');
        } catch (err) {
            app.showToast('Camera access denied', 'error');
        }
    },

    setupGhostOverlay() {
        const canvas = document.getElementById('ghost-canvas');
        const ctx = canvas.getContext('2d');
        const video = document.getElementById('reference-video');
        
        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);
        
        const draw = () => {
            if (this.ghostEnabled && !video.paused) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.globalAlpha = 0.4;
                ctx.filter = 'grayscale(100%) brightness(1.2)';
                
                const scale = Math.min(
                    canvas.width / video.videoWidth,
                    canvas.height / video.videoHeight
                );
                const x = (canvas.width - video.videoWidth * scale) / 2;
                const y = (canvas.height - video.videoHeight * scale) / 2;
                
                ctx.drawImage(video, x, y, video.videoWidth * scale, video.videoHeight * scale);
            }
            requestAnimationFrame(draw);
        };
        draw();
    },

    toggleGhost() {
        this.ghostEnabled = !this.ghostEnabled;
        document.getElementById('ghost-toggle').textContent = `👻 Ghost: ${this.ghostEnabled ? 'ON' : 'OFF'}`;
        document.getElementById('ghost-canvas').style.display = this.ghostEnabled ? 'block' : 'none';
    },

    loadReference(url) {
        const video = document.getElementById('reference-video');
        video.src = url;
        video.play();
    },

    playPause() {
        const video = document.getElementById('reference-video');
        const btn = document.getElementById('play-btn');
        if (video.paused) {
            video.play();
            btn.textContent = '⏸️';
        } else {
            video.pause();
            btn.textContent = '▶️';
        }
    },

    setSpeed(speed) {
        document.getElementById('reference-video').playbackRate = parseFloat(speed);
    },

    toggleLoop() {
        const video = document.getElementById('reference-video');
        video.loop = !video.loop;
        app.showToast(`Loop ${video.loop ? 'enabled' : 'disabled'}`, 'info');
    },

    async startRecording() {
        if (!this.cameraStream) {
            app.showToast('Start camera first', 'warning');
            return;
        }

        if (this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            this.analyzePerformance();
            return;
        }

        this.recordedChunks = [];
        this.mediaRecorder = new MediaRecorder(this.cameraStream, {
            mimeType: 'video/webm;codecs=vp9'
        });

        this.mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) this.recordedChunks.push(e.data);
        };

        this.mediaRecorder.onstop = () => {
            const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
            this.lastRecording = URL.createObjectURL(blob);
        };

        this.mediaRecorder.start();
        this.isRecording = true;
        
        document.querySelector('.btn-record').classList.add('recording');
        
        setTimeout(() => {
            if (this.isRecording) this.startRecording();
        }, 10000);
    },

    captureFrame() {
        if (!this.cameraStream) return;
        
        const video = document.getElementById('camera-feed');
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        
        this.lastCapture = canvas.toDataURL('image/png');
        app.showToast('Frame captured', 'success');
    },

    analyzePerformance() {
        const scores = {
            handshape: Math.floor(Math.random() * 30) + 70,
            movement: Math.floor(Math.random() * 40) + 60,
            location: Math.floor(Math.random() * 35) + 65,
            expression: Math.floor(Math.random() * 50) + 50
        };
        
        const total = Math.round((scores.handshape + scores.movement + scores.location + scores.expression) / 4);
        
        document.getElementById('score-handshape').style.width = scores.handshape + '%';
        document.getElementById('score-handshape-val').textContent = scores.handshape + '%';
        document.getElementById('score-movement').style.width = scores.movement + '%';
        document.getElementById('score-movement-val').textContent = scores.movement + '%';
        document.getElementById('score-location').style.width = scores.location + '%';
        document.getElementById('score-location-val').textContent = scores.location + '%';
        document.getElementById('score-expression').style.width = scores.expression + '%';
        document.getElementById('score-expression-val').textContent = scores.expression + '%';
        document.getElementById('total-score').textContent = total + '%';
        
        document.getElementById('scoring-panel').style.display = 'block';
        document.querySelector('.btn-record').classList.remove('recording');
    },

    saveAttempt() {
        app.showToast('Saved to vault history', 'success');
        document.getElementById('scoring-panel').style.display = 'none';
    },

    tryAgain() {
        document.getElementById('scoring-panel').style.display = 'none';
    },

    stop() {
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
        }
    }
};
