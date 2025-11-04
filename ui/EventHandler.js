/**
 * Event Handler
 * Manages all canvas and keyboard events
 */
export class EventHandler {
    constructor(canvasManager, drawingController, keyboardHandler) {
        this.canvasManager = canvasManager;
        this.drawingController = drawingController;
        this.keyboardHandler = keyboardHandler;
        this.setupMouseEvents();
        this.setupTouchEvents();
        this.setupKeyboardEvents();
    }

    /**
     * Sets up mouse events
     */
    setupMouseEvents() {
        const canvas = this.canvasManager.getCanvas();

        canvas.addEventListener('mousedown', (e) => {
            const coords = this.canvasManager.getCanvasCoordinates(e);
            this.drawingController.startDrawing(coords.x, coords.y);
        });

        canvas.addEventListener('mousemove', (e) => {
            const coords = this.canvasManager.getCanvasCoordinates(e);
            this.drawingController.continueDrawing(coords.x, coords.y);
        });

        canvas.addEventListener('mouseup', () => {
            this.drawingController.stopDrawing();
        });

        canvas.addEventListener('mouseout', () => {
            this.drawingController.stopDrawing();
        });
    }

    /**
     * Sets up touch events
     */
    setupTouchEvents() {
        const canvas = this.canvasManager.getCanvas();

        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const coords = this.canvasManager.getCanvasCoordinates(e);
            this.drawingController.startDrawing(coords.x, coords.y);
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const coords = this.canvasManager.getCanvasCoordinates(e);
            this.drawingController.continueDrawing(coords.x, coords.y);
        });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.drawingController.stopDrawing();
        });
    }

    /**
     * Sets up keyboard events
     */
    setupKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            this.keyboardHandler.handleKeyDown(
                e,
                () => this.drawingController.undo(),
                () => this.drawingController.redo()
            );
        });
    }
}

