/**
 * UI Controller
 * Manages UI and its interactions
 */
export class UIController {
    constructor(colorManager, config) {
        this.colorManager = colorManager;
        this.config = config;
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
}

