/**
 * Canvas Manager
 * Responsible for canvas initialization and management
 */
export class CanvasManager {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.init();
    }

    /**
     * Initializes the canvas and sets up resize events
     */
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    /**
     * Resizes the canvas to window size
     */
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.clear();
    }

    /**
     * Clears the canvas with background color
     * @param {string} color - Background color (defaults to black)
     */
    clear(color = '#000000') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Gets the canvas context
     * @returns {CanvasRenderingContext2D}
     */
    getContext() {
        return this.ctx;
    }

    /**
     * Gets the canvas element
     * @returns {HTMLCanvasElement}
     */
    getCanvas() {
        return this.canvas;
    }

    /**
     * Gets the canvas dimensions
     * @returns {{width: number, height: number}}
     */
    getDimensions() {
        return {
            width: this.canvas.width,
            height: this.canvas.height,
        };
    }

    /**
     * Saves the current canvas state as ImageData
     * @returns {ImageData}
     */
    saveState() {
        return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Restores a saved canvas state
     * @param {ImageData} imageData - State to restore
     */
    restoreState(imageData) {
        this.ctx.putImageData(imageData, 0, 0);
    }

    /**
     * Converts event coordinates to canvas coordinates
     * @param {MouseEvent|TouchEvent} event - Mouse or touch event
     * @returns {{x: number, y: number}}
     */
    getCanvasCoordinates(event) {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0].clientY);
        
        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
    }
}

