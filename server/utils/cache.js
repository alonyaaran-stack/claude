const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 900, checkperiod: 120 });

/**
 * Builds a cache key from a prefix and date range parameters.
 * @param {string} prefix - Cache key prefix (e.g., 'creatives', 'summary')
 * @param {string} since - Start date (YYYY-MM-DD)
 * @param {string} until - End date (YYYY-MM-DD)
 * @returns {string} Cache key
 */
function buildKey(prefix, since, until) {
  return `${prefix}:${since}:${until}`;
}

module.exports = { cache, buildKey };
