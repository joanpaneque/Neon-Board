/**
 * History Manager
 * Handles state history for undo/redo
 */
export class HistoryManager {
    constructor(canvasManager, maxSize = 50) {
        this.canvasManager = canvasManager;
        this.history = [];
        this.historyIndex = -1;
        this.maxSize = maxSize;
    }

    /**
     * Saves the current canvas state to history
     */
    saveState() {
        const imageData = this.canvasManager.saveState();

        // Remove any future states if we're in the middle of history
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }

        // Add new state
        this.history.push(imageData);
        this.historyIndex++;

        // Limit history size
        if (this.history.length > this.maxSize) {
            this.history.shift();
            this.historyIndex--;
        }
    }

    /**
     * Restores a state from history
     * @param {ImageData} imageData - State to restore
     */
    restoreState(imageData) {
        this.canvasManager.restoreState(imageData);
    }

    /**
     * Undoes the last change
     * @returns {boolean} - true if undone, false if no more states
     */
    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.restoreState(this.history[this.historyIndex]);
            return true;
        } else if (this.historyIndex === 0) {
            // If we're at the first state, restore empty canvas
            this.canvasManager.clear();
            this.historyIndex = -1;
            return true;
        }
        return false;
    }

    /**
     * Redoes the last undone change
     * @returns {boolean} - true if redone, false if no more states
     */
    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.restoreState(this.history[this.historyIndex]);
            return true;
        }
        return false;
    }

    /**
     * Removes the last saved state (useful for optimization)
     */
    removeLastState() {
        if (this.historyIndex > 0) {
            this.history.pop();
            this.historyIndex--;
        }
    }

    /**
     * Initializes history with the initial canvas state
     */
    initialize() {
        this.saveState();
    }

    /**
     * Clears all history
     */
    clear() {
        this.history = [];
        this.historyIndex = -1;
    }
}

