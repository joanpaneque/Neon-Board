/**
 * Drawing Controller
 * Coordinates all drawing operations
 */
import { DrawingState } from './DrawingState.js';
import { CANVAS_CONFIG } from '../../config/constants.js';

export class DrawingController {
    constructor(canvasManager, drawingEngine, brushCalculator, colorManager, historyManager, recordingManager = null) {
        this.canvasManager = canvasManager;
        this.drawingEngine = drawingEngine;
        this.brushCalculator = brushCalculator;
        this.colorManager = colorManager;
        this.historyManager = historyManager;
        this.recordingManager = recordingManager;
        this.drawingState = new DrawingState();
    }

    /**
     * Starts the drawing process
     * @param {number} x - Initial X coordinate
     * @param {number} y - Initial Y coordinate
     */
    startDrawing(x, y) {
        this.historyManager.saveState();
        const maxWidth = this.brushCalculator.maxWidth;
        this.drawingState.start(x, y, maxWidth);
        
        // Record point if recording
        if (this.recordingManager && this.recordingManager.getIsRecording()) {
            this.recordingManager.startPath();
            this.recordingManager.recordPoint(x, y, Date.now());
        }
    }

    /**
     * Continues the drawing process
     * @param {number} x - Current X coordinate
     * @param {number} y - Current Y coordinate
     */
    continueDrawing(x, y) {
        if (!this.drawingState.getIsDrawing()) return;

        const distance = this.drawingState.getDistance(x, y);
        const timeDelta = this.drawingState.getTimeDelta();

        // Only draw if there's significant movement
        if (distance < CANVAS_CONFIG.MIN_DISTANCE_THRESHOLD) return;

        const targetWidth = this.brushCalculator.calculateLineWidth(distance, timeDelta);
        const smoothedWidth = this.brushCalculator.getSmoothedWidth(targetWidth);

        const color = this.colorManager.getCurrentColor();
        const state = this.drawingState.getState();

        this.drawingEngine.drawCurvedPath(
            state.prevX,
            state.prevY,
            state.lastX,
            state.lastY,
            x,
            y,
            state.prevWidth,
            state.lastWidth,
            smoothedWidth,
            color,
            distance
        );

        this.drawingState.update(x, y, smoothedWidth);
        
        // Record point if recording
        if (this.recordingManager && this.recordingManager.getIsRecording()) {
            this.recordingManager.recordPoint(x, y, Date.now());
        }
    }

    /**
     * Stops the drawing process
     */
    stopDrawing() {
        if (!this.drawingState.getIsDrawing()) return;

        this.drawingState.stop();

        if (this.drawingState.getHasDrawn()) {
            // Remove the initial saved state and save the final one
            this.historyManager.removeLastState();
            this.historyManager.saveState();
        } else {
            // Nothing was drawn, draw a point
            const color = this.colorManager.getCurrentColor();
            const state = this.drawingState.getState();
            const pointWidth = this.brushCalculator.maxWidth;
            this.drawingEngine.drawPoint(state.lastX, state.lastY, pointWidth, color);

            this.historyManager.removeLastState();
            this.historyManager.saveState();
        }

        // End path recording if recording
        if (this.recordingManager && this.recordingManager.getIsRecording()) {
            this.recordingManager.endPath();
        }

        this.brushCalculator.reset();
    }

    /**
     * Gets the drawing state manager
     * @returns {DrawingState}
     */
    getDrawingState() {
        return this.drawingState;
    }

    /**
     * Undoes the last change
     */
    undo() {
        return this.historyManager.undo();
    }

    /**
     * Redoes the last undone change
     */
    redo() {
        return this.historyManager.redo();
    }
}

