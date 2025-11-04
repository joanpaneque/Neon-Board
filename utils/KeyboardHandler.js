/**
 * Keyboard Handler
 * Manages keyboard shortcuts
 */
export class KeyboardHandler {
    constructor(shortcuts) {
        this.shortcuts = shortcuts;
    }

    /**
     * Handles keyboard events for undo/redo
     * @param {KeyboardEvent} event - Keyboard event
     * @param {Function} undoCallback - Callback for undo
     * @param {Function} redoCallback - Callback for redo
     */
    handleKeyDown(event, undoCallback, redoCallback) {
        const isMetaPressed = event.metaKey;
        const isCtrlPressed = event.ctrlKey;
        const isShiftPressed = event.shiftKey;

        // Undo: CMD+Z (Mac) or CTRL+Z (Windows/Linux)
        if ((event.key === 'z' || event.key === 'Z') && !isShiftPressed) {
            if (isMetaPressed || isCtrlPressed) {
                event.preventDefault();
                undoCallback();
                return;
            }
        }

        // Redo: CMD+SHIFT+Z (Mac) or CTRL+Y (Windows/Linux)
        if ((event.key === 'z' || event.key === 'Z') && isShiftPressed && isMetaPressed) {
            event.preventDefault();
            redoCallback();
            return;
        }

        if ((event.key === 'y' || event.key === 'Y') && isCtrlPressed && !isMetaPressed) {
            event.preventDefault();
            redoCallback();
            return;
        }
    }
}

