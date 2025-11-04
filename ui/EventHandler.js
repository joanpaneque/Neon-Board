/**
 * Event Handler
 * Manages all canvas and keyboard events
 */
export class EventHandler {
    constructor(canvasManager, drawingController, keyboardHandler) {
        this.canvasManager = canvasManager;
        this.drawingController = drawingController;
        this.keyboardHandler = keyboardHandler;
        this.isMultiTouchGesture = false; // Flag to prevent drawing during multi-touch gestures
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
            
            const touchCount = e.touches.length;
            
            // Multi-touch gestures: 2 fingers = undo, 3 fingers = redo
            if (touchCount === 2) {
                this.isMultiTouchGesture = true;
                this.drawingController.undo();
                return;
            }
            
            if (touchCount === 3) {
                this.isMultiTouchGesture = true;
                this.drawingController.redo();
                return;
            }
            
            // Single touch: normal drawing
            if (touchCount === 1) {
                this.isMultiTouchGesture = false;
                const coords = this.canvasManager.getCanvasCoordinates(e);
                this.drawingController.startDrawing(coords.x, coords.y);
            }
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            
            // Don't draw if we're in a multi-touch gesture
            if (this.isMultiTouchGesture) {
                return;
            }
            
            const coords = this.canvasManager.getCanvasCoordinates(e);
            this.drawingController.continueDrawing(coords.x, coords.y);
        });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            
            // If no touches remain or we're in a multi-touch gesture, reset
            if (e.touches.length === 0) {
                if (!this.isMultiTouchGesture) {
                    this.drawingController.stopDrawing();
                }
                this.isMultiTouchGesture = false;
            }
        });

        canvas.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            // Reset gesture state on touch cancel
            if (!this.isMultiTouchGesture) {
                this.drawingController.stopDrawing();
            }
            this.isMultiTouchGesture = false;
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

