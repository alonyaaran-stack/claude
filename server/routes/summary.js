const express = require('express');
const router = express.Router();
const { fetchAdsWithInsights } = require('../services/metaApi');
const { scoreCreatives, getSummary, getWinningPatterns } = require('../services/creativeScoring');
const { cache, buildKey } = require('../utils/cache');

/**
 * GET /api/summary
 *
 * Returns aggregated stats including top/worst performer,
 * average CTR, average ROAS, and total spend.
 * Reuses cached creative data when available.
 *
 * @param {import('express').Request} req - Express request
 * @param {string} [req.query.since] - Start date (YYYY-MM-DD), defaults to 30 days ago
 * @param {string} [req.query.until] - End date (YYYY-MM-DD), defaults to today
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
router.get('/', async (req, res, next) => {
  try {
    const { since, until } = getDateRange(req.query);
    const cacheKey = buildKey('creatives', since, until);

    let scored = cache.get(cacheKey);

    if (!scored) {
      const ads = await fetchAdsWithInsights(since, until);
      scored = scoreCreatives(ads);
      cache.set(cacheKey, scored);
    }

    const summary = getSummary(scored);
    const patterns = getWinningPatterns(scored);

    res.json({
      data: {
        ...summary,
        patterns,
        dateRange: { since, until },
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Extracts and validates date range from query parameters.
 * Defaults to last 30 days if not provided.
 *
 * @param {Object} query - Express query parameters
 * @returns {{ since: string, until: string }}
 */
function getDateRange(query) {
  const until = query.until || new Date().toISOString().split('T')[0];
  const since =
    query.since ||
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  return { since, until };
}

module.exports = router;
