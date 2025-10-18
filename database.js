// Simple in-memory database for storing search history
// In a production environment, this would be replaced with a proper database like MongoDB or Supabase

class Database {
    constructor() {
        this.searchHistory = [];
        this.maxHistoryItems = 50; // Limit history to 50 items
    }
    
    // Add a search to history
    addSearch(city, timestamp = new Date()) {
        // Create search record
        const searchRecord = {
            id: this.generateId(),
            city: city.toLowerCase(),
            timestamp: timestamp
        };
        
        // Add to beginning of array (most recent first)
        this.searchHistory.unshift(searchRecord);
        
        // Limit history size
        if (this.searchHistory.length > this.maxHistoryItems) {
            this.searchHistory = this.searchHistory.slice(0, this.maxHistoryItems);
        }
        
        console.log(`Added search for "${city}" to history`);
    }
    
    // Get search history
    getSearchHistory(limit = 10) {
        return this.searchHistory.slice(0, limit);
    }
    
    // Get recent unique cities
    getRecentCities(limit = 5) {
        const uniqueCities = [];
        const seenCities = new Set();
        
        for (const record of this.searchHistory) {
            const city = record.city;
            if (!seenCities.has(city)) {
                seenCities.add(city);
                uniqueCities.push(city);
                
                if (uniqueCities.length >= limit) {
                    break;
                }
            }
        }
        
        return uniqueCities;
    }
    
    // Clear search history
    clearHistory() {
        this.searchHistory = [];
    }
    
    // Generate a simple ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Get statistics
    getStats() {
        const totalSearches = this.searchHistory.length;
        const uniqueCities = new Set(this.searchHistory.map(record => record.city)).size;
        
        return {
            totalSearches,
            uniqueCities,
            lastSearch: this.searchHistory[0] ? this.searchHistory[0].timestamp : null
        };
    }
}

// Export singleton instance
module.exports = new Database();