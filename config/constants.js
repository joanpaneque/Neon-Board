/**
 * Application configuration and constants
 */
export const CANVAS_CONFIG = {
    BACKGROUND_COLOR: '#000000',
    MIN_WIDTH: 0.5,
    DEFAULT_MAX_WIDTH: 12,
    DEFAULT_GLOW_LEVEL: 15,
    DEFAULT_UNIFORMITY_FACTOR: 100,
    MIN_SPEED: 50, // pixels per second (minimum speed = thicker line)
    MAX_SPEED: 1500, // pixels per second (maximum speed = thinner line)
    MAX_SEGMENT_LENGTH: 3, // Maximum length of each segment for smooth curves
    MIN_DISTANCE_THRESHOLD: 0.2, // Minimum distance to draw
    SMOOTHING_FACTOR: 0.85, // Smoothing factor for line width
};

export const NEON_COLORS = [
    { main: '#ff00ff', glow: '#ff00ff' }, // Magenta
    { main: '#00ffff', glow: '#00ffff' }, // Cyan
    { main: '#00ff00', glow: '#00ff00' }, // Green
    { main: '#ff8000', glow: '#ff8000' }, // Orange
    { main: '#ff0080', glow: '#ff0080' }, // Pink
    { main: '#0080ff', glow: '#0080ff' }, // Blue
];

export const HISTORY_CONFIG = {
    MAX_SIZE: 50, // Maximum number of states in history
};

export const STORAGE_KEYS = {
    CONFIG: 'neonPaintConfig',
};

export const KEYBOARD_SHORTCUTS = {
    UNDO: { key: 'z', modifier: ['meta', 'ctrl'] },
    REDO_MAC: { key: 'z', modifier: ['meta', 'shift'] },
    REDO_WIN: { key: 'y', modifier: ['ctrl'] },
};

