/**
 * Brush Calculator
 * Calculates brush width based on speed and parameters
 */
export class BrushCalculator {
    constructor(config) {
        this.minWidth = config.MIN_WIDTH;
        this.maxWidth = config.DEFAULT_MAX_WIDTH;
        this.uniformityFactor = config.DEFAULT_UNIFORMITY_FACTOR;
        this.minSpeed = config.MIN_SPEED;
        this.maxSpeed = config.MAX_SPEED;
        this.smoothingFactor = config.SMOOTHING_FACTOR;
        this.lastWidth = config.DEFAULT_MAX_WIDTH;
    }

    /**
     * Sets the maximum brush width
     * @param {number} width - Maximum width
     */
    setMaxWidth(width) {
        this.maxWidth = width;
    }

    /**
     * Sets the uniformity factor (0-100)
     * @param {number} factor - Uniformity factor
     */
    setUniformityFactor(factor) {
        this.uniformityFactor = factor;
    }

    /**
     * Calculates line width based on distance and time
     * @param {number} distance - Distance traveled in pixels
     * @param {number} timeDelta - Elapsed time in milliseconds
     * @returns {number} - Calculated width
     */
    calculateLineWidth(distance, timeDelta) {
        if (timeDelta === 0) return (this.minWidth + this.maxWidth) / 2;

        // If uniformityFactor is 0, use fixed width (homogeneous)
        if (this.uniformityFactor === 0) {
            return (this.minWidth + this.maxWidth) / 2;
        }

        // Speed in pixels per second
        const speed = distance / (timeDelta / 1000);

        // Higher speed = thinner line (like real marker)
        const normalizedSpeed = Math.max(this.minSpeed, Math.min(this.maxSpeed, speed));
        const speedRatio = (normalizedSpeed - this.minSpeed) / (this.maxSpeed - this.minSpeed);

        // Calculate width based on speed
        const variableWidth = this.minWidth + (this.maxWidth - this.minWidth) * (1 - speedRatio);

        // Fixed width (homogeneous)
        const fixedWidth = (this.minWidth + this.maxWidth) / 2;

        // Interpolate between fixed and variable width according to uniformityFactor
        const uniformityRatio = this.uniformityFactor / 100;
        const width = fixedWidth + (variableWidth - fixedWidth) * uniformityRatio;

        return Math.max(this.minWidth, Math.min(this.maxWidth, width));
    }

    /**
     * Calculates smoothed width to avoid abrupt changes
     * @param {number} targetWidth - Target width
     * @returns {number} - Smoothed width
     */
    getSmoothedWidth(targetWidth) {
        const smoothed = this.lastWidth * this.smoothingFactor + targetWidth * (1 - this.smoothingFactor);
        this.lastWidth = smoothed;
        return smoothed;
    }

    /**
     * Resets the last stored width
     */
    reset() {
        this.lastWidth = this.maxWidth;
    }
}

