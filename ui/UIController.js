/**
 * UI Controller
 * Manages UI and its interactions
 */
export class UIController {
    constructor(colorManager, config, recordingManager = null) {
        this.colorManager = colorManager;
        this.config = config;
        this.recordingManager = recordingManager;
    }

    /**
     * Updates the color selector in the UI
     */
    updateColorSelector() {
        const colorSelector = document.getElementById('colorSelector');
        if (!colorSelector) return;

        colorSelector.innerHTML = '';

        const colors = this.colorManager.getAllColors();
        const currentIndex = this.colorManager.getCurrentIndex();

        colors.forEach((color, index) => {
            const button = document.createElement('div');
            button.className = `color-button ${index === currentIndex ? 'active' : ''}`;
            button.style.color = color.main;
            button.addEventListener('click', () => {
                this.colorManager.setColor(index);
                this.updateColorSelector();
            });
            colorSelector.appendChild(button);
        });
    }

    /**
     * Sets up the size slider
     * @param {Function} onChange - Callback when value changes
     */
    setupSizeSlider(onChange) {
        const sizeSlider = document.getElementById('sizeSlider');
        if (!sizeSlider) return;

        sizeSlider.value = this.config.maxWidth;
        sizeSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            onChange(value);
        });
    }

    /**
     * Sets up the uniformity slider
     * @param {Function} onChange - Callback when value changes
     */
    setupUniformitySlider(onChange) {
        const uniformitySlider = document.getElementById('uniformitySlider');
        if (!uniformitySlider) return;

        uniformitySlider.value = this.config.uniformityFactor;
        uniformitySlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            onChange(value);
        });
    }

    /**
     * Sets up the glow slider
     * @param {Function} onChange - Callback when value changes
     */
    setupGlowSlider(onChange) {
        const glowSlider = document.getElementById('glowSlider');
        if (!glowSlider) return;

        glowSlider.value = this.config.glowLevel;
        glowSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            onChange(value);
        });
    }

    /**
     * Sets up recording controls
     * @param {Function} onStartRecording - Callback when recording starts
     * @param {Function} onStopRecording - Callback when recording stops
     */
    setupRecordingControls(onStartRecording, onStopRecording) {
        const startBtn = document.getElementById('startRecordingBtn');
        const stopBtn = document.getElementById('stopRecordingBtn');
        const modal = document.getElementById('pathModal');
        const pathTextarea = document.getElementById('pathTextarea');
        const copyBtn = document.getElementById('copyPathBtn');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const closeModalX = document.getElementById('closeModal');

        if (!startBtn || !stopBtn || !modal || !pathTextarea) return;

        // Start recording
        startBtn.addEventListener('click', () => {
            if (onStartRecording && this.recordingManager) {
                this.recordingManager.startRecording();
                startBtn.style.display = 'none';
                stopBtn.style.display = 'block';
                stopBtn.classList.add('recording');
            }
        });

        // Stop recording
        stopBtn.addEventListener('click', () => {
            if (onStopRecording && this.recordingManager) {
                const pathExpression = this.recordingManager.stopRecording();
                
                if (pathExpression) {
                    pathTextarea.value = pathExpression;
                    modal.classList.add('active');
                } else {
                    alert('No se grabó ningún dibujo. Dibuja algo antes de detener la grabación.');
                }

                startBtn.style.display = 'block';
                stopBtn.style.display = 'none';
                stopBtn.classList.remove('recording');
            }
        });

        // Copy path to clipboard
        if (copyBtn) {
            copyBtn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(pathTextarea.value);
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => {
                        copyBtn.textContent = 'Copy Path';
                    }, 2000);
                } catch (err) {
                    // Fallback for older browsers
                    pathTextarea.select();
                    document.execCommand('copy');
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => {
                        copyBtn.textContent = 'Copy Path';
                    }, 2000);
                }
            });
        }

        // Close modal
        const closeModal = () => {
            modal.classList.remove('active');
        };

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }

        if (closeModalX) {
            closeModalX.addEventListener('click', closeModal);
        }

        // Close modal on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

