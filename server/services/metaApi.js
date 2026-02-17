const axios = require('axios');
const { config } = require('../config');

const BASE_URL = `https://graph.facebook.com/${config.META_API_VERSION}`;

/**
 * Fetches all ads with their creative details and insights from the Meta Marketing API.
 * Handles pagination automatically by following `paging.next` links.
 *
 * @param {string} since - Start date in YYYY-MM-DD format
 * @param {string} until - End date in YYYY-MM-DD format
 * @returns {Promise<Array>} Array of normalized ad objects with creative and insights data
 * @throws {Error} If the Meta API request fails
 */
async function fetchAdsWithInsights(since, until) {
  const fields = [
    'id',
    'name',
    'status',
    'creative{thumbnail_url,object_type,title,body,call_to_action_type}',
    'insights{spend,impressions,clicks,ctr,cpc,purchase_roas,frequency,reach,date_start,date_stop}',
  ].join(',');

  let params = {
    fields,
    access_token: config.META_ACCESS_TOKEN,
    limit: 100,
  };

  if (since && until) {
    params.time_range = JSON.stringify({ since, until });
  }

  let allAds = [];
  let url = `${BASE_URL}/${config.META_AD_ACCOUNT_ID}/ads`;

  while (url) {
    const response = await requestWithRetry(url, params);
    const data = response.data;

    if (data.data) {
      allAds = allAds.concat(data.data);
    }

    url = data.paging?.next || null;
    // After the first request, params are encoded in the next URL
    params = {};
  }

  return allAds.map(normalizeAd);
}

/**
 * Fetches insights for a single ad by its ID.
 *
 * @param {string} adId - The Meta ad ID
 * @param {string} since - Start date in YYYY-MM-DD format
 * @param {string} until - End date in YYYY-MM-DD format
 * @returns {Promise<Object>} Normalized ad object with insights
 * @throws {Error} If the Meta API request fails
 */
async function fetchSingleAd(adId, since, until) {
  const fields = [
    'id',
    'name',
    'status',
    'creative{thumbnail_url,object_type,title,body,call_to_action_type}',
    'insights{spend,impressions,clicks,ctr,cpc,purchase_roas,frequency,reach,date_start,date_stop}',
  ].join(',');

  const params = {
    fields,
    access_token: config.META_ACCESS_TOKEN,
  };

  if (since && until) {
    params.time_range = JSON.stringify({ since, until });
  }

  const response = await requestWithRetry(`${BASE_URL}/${adId}`, params);
  return normalizeAd(response.data);
}

/**
 * Makes an HTTP GET request with retry logic and exponential backoff
 * for rate limit (429) responses.
 *
 * @param {string} url - Request URL
 * @param {Object} params - Query parameters
 * @param {number} [retries=3] - Number of retries remaining
 * @returns {Promise<Object>} Axios response
 */
async function requestWithRetry(url, params, retries = 3) {
  try {
    return await axios.get(url, { params });
  } catch (err) {
    if (retries > 0 && err.response?.status === 429) {
      const delay = Math.pow(2, 4 - retries) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return requestWithRetry(url, params, retries - 1);
    }
    throw err;
  }
}

/**
 * Normalizes a raw Meta API ad object into a flat structure
 * used throughout the application.
 *
 * @param {Object} ad - Raw ad object from Meta API
 * @returns {Object} Normalized ad object
 */
function normalizeAd(ad) {
  const creative = ad.creative || {};
  const insightsData = ad.insights?.data?.[0] || {};

  return {
    ad_id: ad.id,
    ad_name: ad.name,
    status: ad.status,
    thumbnail_url: creative.thumbnail_url || null,
    object_type: creative.object_type || null,
    title: creative.title || '',
    body: creative.body || '',
    call_to_action_type: creative.call_to_action_type || null,
    spend: parseFloat(insightsData.spend) || 0,
    impressions: parseInt(insightsData.impressions) || 0,
    clicks: parseInt(insightsData.clicks) || 0,
    ctr: parseFloat(insightsData.ctr) || 0,
    cpc: parseFloat(insightsData.cpc) || 0,
    roas: parseFloat(insightsData.purchase_roas?.[0]?.value) || 0,
    frequency: parseFloat(insightsData.frequency) || 0,
    reach: parseInt(insightsData.reach) || 0,
    date_start: insightsData.date_start || null,
    date_stop: insightsData.date_stop || null,
  };
}

module.exports = { fetchAdsWithInsights, fetchSingleAd };
