/**
 * Drawing State
 * Manages state during the drawing process
 */
export class DrawingState {
    constructor() {
        this.isDrawing = false;
        this.hasDrawn = false;
        this.lastX = 0;
        this.lastY = 0;
        this.lastWidth = 0;
        this.prevX = 0;
        this.prevY = 0;
        this.prevWidth = 0;
        this.lastTime = 0;
    }

    /**
     * Starts the drawing state
     * @param {number} x - Initial X coordinate
     * @param {number} y - Initial Y coordinate
     * @param {number} width - Initial width
     */
    start(x, y, width) {
        this.isDrawing = true;
        this.hasDrawn = false;
        this.lastX = x;
        this.lastY = y;
        this.prevX = x;
        this.prevY = y;
        this.prevWidth = width;
        this.lastWidth = width;
        this.lastTime = Date.now();
    }

    /**
     * Updates the state during drawing
     * @param {number} x - New X coordinate
     * @param {number} y - New Y coordinate
     * @param {number} width - New width
     */
    update(x, y, width) {
        this.prevX = this.lastX;
        this.prevY = this.lastY;
        this.prevWidth = this.lastWidth;
        this.lastX = x;
        this.lastY = y;
        this.lastWidth = width;
        this.lastTime = Date.now();
        this.hasDrawn = true;
    }

    /**
     * Calculates distance from the last point
     * @param {number} x - Current X coordinate
     * @param {number} y - Current Y coordinate
     * @returns {number} - Distance in pixels
     */
    getDistance(x, y) {
        return Math.sqrt(Math.pow(x - this.lastX, 2) + Math.pow(y - this.lastY, 2));
    }

    /**
     * Calculates time delta since last update
     * @returns {number} - Time delta in milliseconds
     */
    getTimeDelta() {
        return Date.now() - this.lastTime;
    }

    /**
     * Stops the drawing state
     */
    stop() {
        this.isDrawing = false;
        this.hasDrawn = false;
    }

    /**
     * Checks if currently drawing
     * @returns {boolean}
     */
    getIsDrawing() {
        return this.isDrawing;
    }

    /**
     * Checks if something has been drawn
     * @returns {boolean}
     */
    getHasDrawn() {
        return this.hasDrawn;
    }

    /**
     * Gets the complete current state
     * @returns {Object}
     */
    getState() {
        return {
            prevX: this.prevX,
            prevY: this.prevY,
            prevWidth: this.prevWidth,
            lastX: this.lastX,
            lastY: this.lastY,
            lastWidth: this.lastWidth,
        };
    }
}
