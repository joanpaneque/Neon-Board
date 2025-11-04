/**
 * Main Application - Orchestrator
 * Connects all modules and handles initialization
 */
import { CANVAS_CONFIG, NEON_COLORS, HISTORY_CONFIG, STORAGE_KEYS } from './config/constants.js';
import { StorageService } from './storage/StorageService.js';
import { CanvasManager } from './core/canvas/CanvasManager.js';
import { ColorManager } from './core/color/ColorManager.js';
import { BrushCalculator } from './core/drawing/BrushCalculator.js';
import { DrawingEngine } from './core/drawing/DrawingEngine.js';
import { HistoryManager } from './core/history/HistoryManager.js';
import { DrawingController } from './core/drawing/DrawingController.js';
import { RecordingManager } from './core/recording/RecordingManager.js';
import { KeyboardHandler } from './utils/KeyboardHandler.js';
import { UIController } from './ui/UIController.js';
import { EventHandler } from './ui/EventHandler.js';

/**
 * Main Neon Paint application class
 */
class NeonPaintApp {
    constructor() {
        this.config = {
            maxWidth: CANVAS_CONFIG.DEFAULT_MAX_WIDTH,
            glowLevel: CANVAS_CONFIG.DEFAULT_GLOW_LEVEL,
            uniformityFactor: CANVAS_CONFIG.DEFAULT_UNIFORMITY_FACTOR,
        };

        this.storageService = null;
        this.canvasManager = null;
        this.colorManager = null;
        this.brushCalculator = null;
        this.drawingEngine = null;
        this.historyManager = null;
        this.drawingController = null;
        this.recordingManager = null;
        this.keyboardHandler = null;
        this.uiController = null;
        this.eventHandler = null;
    }

    /**
     * Initializes the application
     */
    init() {
        // Initialize storage services
        this.storageService = new StorageService(STORAGE_KEYS.CONFIG);
        this.loadConfig();

        // Initialize canvas
        const canvasElement = document.getElementById('canvas');
        if (!canvasElement) {
            throw new Error('Canvas element not found');
        }
        this.canvasManager = new CanvasManager(canvasElement);

        // Initialize domain managers
        this.colorManager = new ColorManager(NEON_COLORS);
        this.brushCalculator = new BrushCalculator(CANVAS_CONFIG);
        this.brushCalculator.setMaxWidth(this.config.maxWidth);
        this.brushCalculator.setUniformityFactor(this.config.uniformityFactor);

        this.drawingEngine = new DrawingEngine(
            this.canvasManager,
            this.brushCalculator
        );
        this.drawingEngine.setGlowLevel(this.config.glowLevel);

        this.historyManager = new HistoryManager(
            this.canvasManager,
            HISTORY_CONFIG.MAX_SIZE
        );

        // Initialize recording manager
        this.recordingManager = new RecordingManager(this.canvasManager);

        // Initialize drawing controller
        this.drawingController = new DrawingController(
            this.canvasManager,
            this.drawingEngine,
            this.brushCalculator,
            this.colorManager,
            this.historyManager,
            this.recordingManager
        );

        // Initialize event handlers
        this.keyboardHandler = new KeyboardHandler();
        this.eventHandler = new EventHandler(
            this.canvasManager,
            this.drawingController,
            this.keyboardHandler
        );

        // Initialize UI
        this.uiController = new UIController(this.colorManager, this.config, this.recordingManager);
        this.setupUI();

        // Initialize history with initial state
        setTimeout(() => {
            this.historyManager.initialize();
            this.uiController.updateColorSelector();
        }, 0);
    }

    /**
     * Loads configuration from storage
     */
    loadConfig() {
        const savedConfig = this.storageService.load({
            maxWidth: CANVAS_CONFIG.DEFAULT_MAX_WIDTH,
            glowLevel: CANVAS_CONFIG.DEFAULT_GLOW_LEVEL,
            uniformityFactor: CANVAS_CONFIG.DEFAULT_UNIFORMITY_FACTOR,
        });

        if (savedConfig) {
            this.config = savedConfig;
        }
    }

    /**
     * Saves the current configuration
     */
    saveConfig() {
        this.storageService.save(this.config);
    }

    /**
     * Sets up UI controls
     */
    setupUI() {
        // Setup size slider
        this.uiController.setupSizeSlider((value) => {
            this.config.maxWidth = value;
            this.brushCalculator.setMaxWidth(value);
            this.saveConfig();
        });

        // Setup uniformity slider
        this.uiController.setupUniformitySlider((value) => {
            this.config.uniformityFactor = value;
            this.brushCalculator.setUniformityFactor(value);
            this.saveConfig();
        });

        // Setup glow slider
        this.uiController.setupGlowSlider((value) => {
            this.config.glowLevel = value;
            this.drawingEngine.setGlowLevel(value);
            this.saveConfig();
        });

        // Setup recording controls
        this.uiController.setupRecordingControls(
            () => {
                // onStartRecording callback
                this.recordingManager.startRecording();
            },
            () => {
                // onStopRecording callback
                const pathExpression = this.recordingManager.stopRecording();
                return pathExpression;
            }
        );
    }
}

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const app = new NeonPaintApp();
        app.init();
    });
} else {
    const app = new NeonPaintApp();
    app.init();
}
