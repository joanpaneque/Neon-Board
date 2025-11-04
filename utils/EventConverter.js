/**
 * Event Converter
 * Converts touch events to mouse events for compatibility
 */
export class EventConverter {
    /**
     * Converts a touchstart event to mousedown
     * @param {TouchEvent} touchEvent - Touch event
     * @returns {MouseEvent} - Simulated mouse event
     */
    static touchToMouseDown(touchEvent) {
        const touch = touchEvent.touches[0];
        return new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY,
        });
    }

    /**
     * Converts a touchmove event to mousemove
     * @param {TouchEvent} touchEvent - Touch event
     * @returns {MouseEvent} - Simulated mouse event
     */
    static touchToMouseMove(touchEvent) {
        const touch = touchEvent.touches[0];
        return new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY,
        });
    }

    /**
     * Converts a touchend event to mouseup
     * @param {TouchEvent} touchEvent - Touch event
     * @returns {MouseEvent} - Simulated mouse event
     */
    static touchToMouseUp(touchEvent) {
        return new MouseEvent('mouseup', {});
    }
}

