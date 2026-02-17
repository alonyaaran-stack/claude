const express = require('express');
const router = express.Router();
const { fetchAdsWithInsights, fetchSingleAd } = require('../services/metaApi');
const { scoreCreatives } = require('../services/creativeScoring');
const { cache, buildKey } = require('../utils/cache');

/**
 * GET /api/creatives
 *
 * Fetches all ads with insights from the Meta Marketing API.
 * Returns normalized and scored creative data.
 * Results are cached for 15 minutes per date range.
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

    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({
        data: cached,
        meta: { total: cached.length, dateRange: { since, until }, cached: true },
      });
    }

    const ads = await fetchAdsWithInsights(since, until);
    const scored = scoreCreatives(ads);

    cache.set(cacheKey, scored);

    res.json({
      data: scored,
      meta: { total: scored.length, dateRange: { since, until }, cached: false },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/creatives/:ad_id
 *
 * Returns a single ad with full metrics and scoring.
 * Checks the cache first, falls back to an individual API call.
 *
 * @param {import('express').Request} req - Express request
 * @param {string} req.params.ad_id - The Meta ad ID
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
router.get('/:ad_id', async (req, res, next) => {
  try {
    const { ad_id } = req.params;
    const { since, until } = getDateRange(req.query);
    const cacheKey = buildKey('creatives', since, until);

    // Check if we have cached data with this ad
    const cached = cache.get(cacheKey);
    if (cached) {
      const ad = cached.find((c) => c.ad_id === ad_id);
      if (ad) return res.json({ data: ad });
    }

    // Fetch individually
    const ad = await fetchSingleAd(ad_id, since, until);
    const [scored] = scoreCreatives([ad]);

    res.json({ data: scored });
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
