/**
 * Drawing Engine
 * Responsible for rendering strokes on the canvas
 */
import { CANVAS_CONFIG } from '../../config/constants.js';

export class DrawingEngine {
    constructor(canvasManager, brushCalculator) {
        this.canvasManager = canvasManager;
        this.ctx = canvasManager.getContext();
        this.brushCalculator = brushCalculator;
        this.glowLevel = CANVAS_CONFIG.DEFAULT_GLOW_LEVEL;
    }

    /**
     * Sets the glow level
     * @param {number} level - Glow level (0-50)
     */
    setGlowLevel(level) {
        this.glowLevel = level;
    }

    /**
     * Draws a smooth segment between points
     * @param {number} x1 - X coordinate of first point
     * @param {number} y1 - Y coordinate of first point
     * @param {number} x2 - X coordinate of second point
     * @param {number} y2 - Y coordinate of second point
     * @param {number} x3 - X coordinate of third point (optional)
     * @param {number} y3 - Y coordinate of third point (optional)
     * @param {number} width1 - Width at first point
     * @param {number} width2 - Width at second point
     * @param {number} width3 - Width at third point
     * @param {Object} color - Object with main and glow properties
     */
    drawSmoothSegment(x1, y1, x2, y2, x3, y3, width1, width2, width3, color) {
        const avgWidth = (width1 + width2 + width3) / 3;

        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);

        if (x3 !== undefined && y3 !== undefined) {
            const endX = (x2 + x3) / 2;
            const endY = (y2 + y3) / 2;
            this.ctx.quadraticCurveTo(x2, y2, endX, endY);
        } else {
            this.ctx.lineTo(x2, y2);
        }

        this._applyNeonStyle(avgWidth, color);
        this.ctx.stroke();

        // Additional layer for more intensity
        this.ctx.shadowBlur = this.glowLevel * 2;
        this.ctx.lineWidth = avgWidth * 0.6;
        this.ctx.stroke();

        this._resetShadow();
    }

    /**
     * Draws a curved path with smooth interpolation
     * @param {number} x1 - X coordinate of first point
     * @param {number} y1 - Y coordinate of first point
     * @param {number} x2 - X coordinate of second point
     * @param {number} y2 - Y coordinate of second point
     * @param {number} x3 - X coordinate of third point
     * @param {number} y3 - Y coordinate of third point
     * @param {number} width1 - Width at first point
     * @param {number} width2 - Width at second point
     * @param {number} width3 - Width at third point
     * @param {Object} color - Object with main and glow properties
     * @param {number} distance - Total stroke distance
     */
    drawCurvedPath(x1, y1, x2, y2, x3, y3, width1, width2, width3, color, distance) {
        const maxSegmentLength = CANVAS_CONFIG.MAX_SEGMENT_LENGTH;
        const steps = Math.ceil(distance / maxSegmentLength);

        if (steps <= 1) {
            this.drawSmoothSegment(x1, y1, x2, y2, x3, y3, width1, width2, width3, color);
            return;
        }

        const points = this._generateInterpolatedPoints(x2, y2, x3, y3, width2, width3, steps);

        for (let i = 0; i < points.length - 1; i++) {
            const p0 = i === 0 ? { x: x2, y: y2, width: width2 } : points[i - 1];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = i + 2 < points.length ? points[i + 2] : null;

            if (p3) {
                this.drawSmoothSegment(p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, p0.width, p1.width, p2.width, color);
            } else {
                this._drawFinalSegment(p1, p2, color);
            }
        }
    }

    /**
     * Draws a point on the canvas
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} width - Point width
     * @param {Object} color - Object with main and glow properties
     */
    drawPoint(x, y, width, color) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, width / 2, 0, Math.PI * 2);

        this.ctx.fillStyle = color.main;
        this.ctx.shadowBlur = this.glowLevel;
        this.ctx.shadowColor = color.glow;
        this.ctx.fill();

        // Additional layer for more intensity
        this.ctx.shadowBlur = this.glowLevel * 2;
        this.ctx.beginPath();
        this.ctx.arc(x, y, width * 0.3, 0, Math.PI * 2);
        this.ctx.fill();

        this._resetShadow();
    }

    /**
     * Generates interpolated points for smooth curves
     * @private
     */
    _generateInterpolatedPoints(x2, y2, x3, y3, width2, width3, steps) {
        const points = [];
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const smoothT = t * t * (3 - 2 * t); // smoothstep

            const x = x2 + (x3 - x2) * smoothT;
            const y = y2 + (y3 - y2) * smoothT;
            const width = width2 + (width3 - width2) * smoothT;

            points.push({ x, y, width });
        }
        return points;
    }

    /**
     * Draws the final segment of a path
     * @private
     */
    _drawFinalSegment(p1, p2, color) {
        const avgWidth = (p1.width + p2.width) / 2;
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);

        this._applyNeonStyle(avgWidth, color);
        this.ctx.stroke();

        this.ctx.shadowBlur = this.glowLevel * 2;
        this.ctx.lineWidth = avgWidth * 0.6;
        this.ctx.stroke();

        this._resetShadow();
    }

    /**
     * Applies neon style to the context
     * @private
     */
    _applyNeonStyle(width, color) {
        this.ctx.strokeStyle = color.main;
        this.ctx.lineWidth = width;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.shadowBlur = this.glowLevel;
        this.ctx.shadowColor = color.glow;
    }

    /**
     * Resets the context shadow
     * @private
     */
    _resetShadow() {
        this.ctx.shadowBlur = 0;
    }
}

