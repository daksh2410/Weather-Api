// Simple in-memory cache for weather data
// In a production environment, this would be replaced with Redis or similar

class Cache {
    constructor() {
        this.cache = new Map();
        this.maxCacheItems = 100; // Limit cache to 100 items
        this.cacheDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
    }
    
    // Get item from cache
    get(key) {
        const item = this.cache.get(key);
        
        if (!item) {
            return null;
        }
        
        // Check if item has expired
        if (Date.now() - item.timestamp > this.cacheDuration) {
            this.cache.delete(key);
            return null;
        }
        
        console.log(`Cache hit for key: ${key}`);
        return item.data;
    }
    
    // Set item in cache
    set(key, data) {
        // If cache is full, remove oldest item
        if (this.cache.size >= this.maxCacheItems) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        
        const item = {
            data: data,
            timestamp: Date.now()
        };
        
        this.cache.set(key, item);
        console.log(`Cached data for key: ${key}`);
    }
    
    // Clear cache
    clear() {
        this.cache.clear();
    }
    
    // Get cache statistics
    getStats() {
        return {
            size: this.cache.size,
            maxCacheItems: this.maxCacheItems,
            cacheDuration: this.cacheDuration
        };
    }
}

// Export singleton instance
module.exports = new Cache();