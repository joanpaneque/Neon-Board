/**
 * Recording Manager
 * Records drawing actions and converts them to After Effects mask path format
 */
export class RecordingManager {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
        this.isRecording = false;
        this.recordingStartTime = 0;
        this.recordedPaths = [];
        this.currentPath = null;
    }

    /**
     * Starts recording
     */
    startRecording() {
        this.isRecording = true;
        this.recordingStartTime = Date.now();
        this.recordedPaths = [];
        this.currentPath = null;
    }

    /**
     * Stops recording and generates After Effects path string
     * @returns {string} - After Effects mask path expression
     */
    stopRecording() {
        this.isRecording = false;
        
        if (this.recordedPaths.length === 0) {
            return '';
        }

        // Generate After Effects shape path expression
        return this.generateAEPathExpression();
    }

    /**
     * Records a point in the current path
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} time - Timestamp in milliseconds
     */
    recordPoint(x, y, time) {
        if (!this.isRecording) return;

        const relativeTime = (time - this.recordingStartTime) / 1000; // Convert to seconds

        if (!this.currentPath) {
            this.currentPath = {
                points: [],
                startTime: relativeTime
            };
        }

        // Convert canvas coordinates to After Effects coordinates
        // After Effects uses the same coordinate system (top-left origin, Y increases downward)
        const aeX = x;
        const aeY = y;

        this.currentPath.points.push({
            x: aeX,
            y: aeY,
            time: relativeTime
        });
    }

    /**
     * Starts a new path (stroke)
     */
    startPath() {
        if (this.currentPath && this.currentPath.points.length > 0) {
            this.recordedPaths.push(this.currentPath);
        }
        this.currentPath = {
            points: [],
            startTime: (Date.now() - this.recordingStartTime) / 1000
        };
    }

    /**
     * Ends the current path (stroke)
     */
    endPath() {
        if (this.currentPath && this.currentPath.points.length > 0) {
            this.recordedPaths.push(this.currentPath);
        }
        this.currentPath = null;
    }

    /**
     * Generates After Effects shape path expression
     * @returns {string} - Expression string to paste in After Effects
     */
    generateAEPathExpression() {
        if (this.recordedPaths.length === 0) {
            return '';
        }

        // If there's a current path that hasn't been saved, save it
        if (this.currentPath && this.currentPath.points.length > 0) {
            this.recordedPaths.push(this.currentPath);
        }

        // Collect all points from all paths with their timestamps
        let allPoints = [];
        this.recordedPaths.forEach((path) => {
            if (path.points.length === 0) return;
            path.points.forEach((point) => {
                allPoints.push({
                    x: point.x,
                    y: point.y,
                    time: point.time
                });
            });
        });

        // Sort all points by time
        allPoints.sort((a, b) => a.time - b.time);

        // Generate After Effects expression
        let expression = '// Paste this expression in After Effects Mask Path property\n';
        expression += '// This expression recreates the drawing path in real-time\n\n';
        expression += 'var points = [\n';

        allPoints.forEach((point, index) => {
            expression += `  [${point.time.toFixed(3)}, [${point.x.toFixed(2)}, ${point.y.toFixed(2)}]]`;
            if (index < allPoints.length - 1) {
                expression += ',';
            }
            expression += '\n';
        });

        expression += '];\n\n';

        expression += '// Build cumulative path up to current time\n';
        expression += 'var currentTime = time;\n';
        expression += 'var vertices = [];\n';
        expression += 'var inTangents = [];\n';
        expression += 'var outTangents = [];\n\n';

        expression += 'for (var i = 0; i < points.length; i++) {\n';
        expression += '  if (points[i][0] <= currentTime) {\n';
        expression += '    vertices.push(points[i][1]);\n';
        expression += '    inTangents.push([0, 0]);\n';
        expression += '    outTangents.push([0, 0]);\n';
        expression += '  }\n';
        expression += '}\n\n';

        expression += '// Return the shape path\n';
        expression += 'createPath(vertices, inTangents, outTangents, false);\n';

        return expression;
    }


    /**
     * Checks if currently recording
     * @returns {boolean}
     */
    getIsRecording() {
        return this.isRecording;
    }

    /**
     * Clears all recorded data
     */
    clear() {
        this.recordedPaths = [];
        this.currentPath = null;
    }
}

