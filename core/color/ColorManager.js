/**
 * Color Manager
 * Handles neon color selection and management
 */
export class ColorManager {
    constructor(colors) {
        this.colors = colors;
        this.currentIndex = 0;
    }

    /**
     * Gets the current color
     * @returns {Object} - Object with main and glow properties
     */
    getCurrentColor() {
        return this.colors[this.currentIndex];
    }

    /**
     * Gets all available colors
     * @returns {Array}
     */
    getAllColors() {
        return this.colors;
    }

    /**
     * Changes to the next color
     */
    nextColor() {
        this.currentIndex = (this.currentIndex + 1) % this.colors.length;
    }

    /**
     * Changes to a specific color by index
     * @param {number} index - Color index
     */
    setColor(index) {
        if (index >= 0 && index < this.colors.length) {
            this.currentIndex = index;
        }
    }

    /**
     * Gets the current color index
     * @returns {number}
     */
    getCurrentIndex() {
        return this.currentIndex;
    }
}

