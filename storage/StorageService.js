/**
 * Abstract storage service
 * Abstraction layer for data persistence
 */
export class StorageService {
    constructor(storageKey) {
        this.storageKey = storageKey;
    }

    /**
     * Saves a configuration to storage
     * @param {Object} config - Configuration to save
     */
    save(config) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(config));
        } catch (error) {
            console.error('Error saving configuration:', error);
        }
    }

    /**
     * Loads a configuration from storage
     * @param {Object} defaults - Default values if no configuration exists
     * @returns {Object|null} - Loaded configuration or null if error
     */
    load(defaults = {}) {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (!saved) return null;

            const config = JSON.parse(saved);
            // Merge with defaults to ensure all properties exist
            return { ...defaults, ...config };
        } catch (error) {
            console.error('Error loading configuration:', error);
            return null;
        }
    }

    /**
     * Removes the saved configuration
     */
    clear() {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (error) {
            console.error('Error clearing configuration:', error);
        }
    }
}

