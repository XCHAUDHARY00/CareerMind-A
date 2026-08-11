/**
 * Simple localStorage cache with TTL (Time To Live)
 *
 * Usage:
 *   cache.set('skill_gaps_backend', data)         // save
 *   cache.get('skill_gaps_backend')               // get (null if expired/missing)
 *   cache.clear('skill_gaps_backend')             // delete one key
 *   cache.clearAll('skill_gaps_')                 // delete all keys with prefix
 *   cache.isStale('skill_gaps_backend')           // true if expired but data exists
 *   cache.getStale('skill_gaps_backend')          // get data even if expired
 */

const DEFAULT_TTL = 10 * 60 * 1000; // 10 minutes in milliseconds

const cache = {
  /**
   * Save data to cache with timestamp
   * @param {string} key
   * @param {any} data
   * @param {number} ttl - milliseconds (default 10 min)
   */
  set(key, data, ttl = DEFAULT_TTL) {
    try {
      const entry = {
        data,
        savedAt: Date.now(),
        ttl,
      };
      localStorage.setItem(`cm_cache_${key}`, JSON.stringify(entry));
    } catch (e) {
      // localStorage full ya unavailable — silently fail
      console.warn('Cache set failed:', e);
    }
  },

  /**
   * Get data from cache — returns null if expired or not found
   * @param {string} key
   */
  get(key) {
    try {
      const raw = localStorage.getItem(`cm_cache_${key}`);
      if (!raw) return null;

      const entry = JSON.parse(raw);
      const age = Date.now() - entry.savedAt;

      if (age > entry.ttl) {
        // Expired — don't return it
        return null;
      }
      return entry.data;
    } catch (e) {
      return null;
    }
  },

  /**
   * Get data EVEN IF expired (for stale-while-revalidate pattern)
   * Returns null only if key doesn't exist at all
   * @param {string} key
   */
  getStale(key) {
    try {
      const raw = localStorage.getItem(`cm_cache_${key}`);
      if (!raw) return null;
      return JSON.parse(raw).data;
    } catch (e) {
      return null;
    }
  },

  /**
   * Check if key exists but is expired (stale)
   * @param {string} key
   */
  isStale(key) {
    try {
      const raw = localStorage.getItem(`cm_cache_${key}`);
      if (!raw) return false;
      const entry = JSON.parse(raw);
      return Date.now() - entry.savedAt > entry.ttl;
    } catch (e) {
      return false;
    }
  },

  /**
   * How old is the cache (returns human readable string)
   * @param {string} key
   */
  age(key) {
    try {
      const raw = localStorage.getItem(`cm_cache_${key}`);
      if (!raw) return null;
      const entry = JSON.parse(raw);
      const ms = Date.now() - entry.savedAt;
      const mins = Math.floor(ms / 60000);
      const secs = Math.floor((ms % 60000) / 1000);
      return mins > 0 ? `${mins}m ago` : `${secs}s ago`;
    } catch (e) {
      return null;
    }
  },

  /**
   * Delete a single key from cache
   * @param {string} key
   */
  clear(key) {
    localStorage.removeItem(`cm_cache_${key}`);
  },

  /**
   * Delete all cache keys that start with a prefix
   * @param {string} prefix
   */
  clearAll(prefix) {
    const toDelete = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(`cm_cache_${prefix}`)) {
        toDelete.push(k);
      }
    }
    toDelete.forEach(k => localStorage.removeItem(k));
  },
};

export default cache;
