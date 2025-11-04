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
        const mobileColorSelector = document.getElementById('mobileColorSelector');
        
        const colors = this.colorManager.getAllColors();
        const currentIndex = this.colorManager.getCurrentIndex();

        // Update desktop selector
        if (colorSelector) {
            colorSelector.innerHTML = '';
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

        // Update mobile selector
        if (mobileColorSelector) {
            mobileColorSelector.innerHTML = '';
            colors.forEach((color, index) => {
                const button = document.createElement('div');
                button.className = `color-button ${index === currentIndex ? 'active' : ''}`;
                button.style.color = color.main;
                button.addEventListener('click', () => {
                    this.colorManager.setColor(index);
                    this.updateColorSelector();
                });
                mobileColorSelector.appendChild(button);
            });
        }
    }

    /**
     * Sets up the size slider
     * @param {Function} onChange - Callback when value changes
     */
    setupSizeSlider(onChange) {
        const sizeSlider = document.getElementById('sizeSlider');
        const mobileSizeSlider = document.getElementById('mobileSizeSlider');

        const updateValue = (value) => {
            if (sizeSlider) sizeSlider.value = value;
            if (mobileSizeSlider) mobileSizeSlider.value = value;
            onChange(value);
        };

        if (sizeSlider) {
            sizeSlider.value = this.config.maxWidth;
            sizeSlider.addEventListener('input', (e) => {
                updateValue(parseFloat(e.target.value));
            });
        }

        if (mobileSizeSlider) {
            mobileSizeSlider.value = this.config.maxWidth;
            mobileSizeSlider.addEventListener('input', (e) => {
                updateValue(parseFloat(e.target.value));
            });
        }
    }

    /**
     * Sets up the uniformity slider
     * @param {Function} onChange - Callback when value changes
     */
    setupUniformitySlider(onChange) {
        const uniformitySlider = document.getElementById('uniformitySlider');
        const mobileUniformitySlider = document.getElementById('mobileUniformitySlider');

        const updateValue = (value) => {
            if (uniformitySlider) uniformitySlider.value = value;
            if (mobileUniformitySlider) mobileUniformitySlider.value = value;
            onChange(value);
        };

        if (uniformitySlider) {
            uniformitySlider.value = this.config.uniformityFactor;
            uniformitySlider.addEventListener('input', (e) => {
                updateValue(parseFloat(e.target.value));
            });
        }

        if (mobileUniformitySlider) {
            mobileUniformitySlider.value = this.config.uniformityFactor;
            mobileUniformitySlider.addEventListener('input', (e) => {
                updateValue(parseFloat(e.target.value));
            });
        }
    }

    /**
     * Sets up the glow slider
     * @param {Function} onChange - Callback when value changes
     */
    setupGlowSlider(onChange) {
        const glowSlider = document.getElementById('glowSlider');
        const mobileGlowSlider = document.getElementById('mobileGlowSlider');

        const updateValue = (value) => {
            if (glowSlider) glowSlider.value = value;
            if (mobileGlowSlider) mobileGlowSlider.value = value;
            onChange(value);
        };

        if (glowSlider) {
            glowSlider.value = this.config.glowLevel;
            glowSlider.addEventListener('input', (e) => {
                updateValue(parseFloat(e.target.value));
            });
        }

        if (mobileGlowSlider) {
            mobileGlowSlider.value = this.config.glowLevel;
            mobileGlowSlider.addEventListener('input', (e) => {
                updateValue(parseFloat(e.target.value));
            });
        }
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

    /**
     * Sets up mobile menu toggle
     */
    setupMobileMenu() {
        const toggleBtn = document.getElementById('mobileMenuToggle');
        const menuPanel = document.getElementById('mobileMenuPanel');

        if (!toggleBtn || !menuPanel) return;

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = menuPanel.classList.contains('active');
            
            if (isActive) {
                menuPanel.classList.remove('active');
                toggleBtn.classList.remove('active');
            } else {
                menuPanel.classList.add('active');
                toggleBtn.classList.add('active');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (menuPanel.classList.contains('active') && 
                !menuPanel.contains(e.target) && 
                e.target !== toggleBtn &&
                !toggleBtn.contains(e.target)) {
                menuPanel.classList.remove('active');
                toggleBtn.classList.remove('active');
            }
        });
    }

    /**
     * Sets up desktop sliders dropdown
     */
    setupDesktopSlidersDropdown() {
        const slidersButton = document.getElementById('slidersButton');
        const slidersDropdown = document.getElementById('slidersDropdown');

        if (!slidersButton || !slidersDropdown) return;

        slidersButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = slidersDropdown.classList.contains('active');
            
            if (isActive) {
                slidersDropdown.classList.remove('active');
                slidersButton.classList.remove('active');
            } else {
                slidersDropdown.classList.add('active');
                slidersButton.classList.add('active');
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (slidersDropdown.classList.contains('active') && 
                !slidersDropdown.contains(e.target) && 
                e.target !== slidersButton &&
                !slidersButton.contains(e.target)) {
                slidersDropdown.classList.remove('active');
                slidersButton.classList.remove('active');
            }
        });

        // Prevent closing when clicking inside dropdown
        slidersDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

