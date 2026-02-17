/**
 * Computes account-level averages and assigns a status to each creative
 * based on the scoring rules.
 *
 * Status logic:
 * - "Winning"  → ROAS above avg AND CTR above avg
 * - "Watch"    → one metric above avg, one below
 * - "Fatigued" → frequency > 3.5 AND CTR below avg
 * - "Low Spend"→ spend < $50 (not enough data)
 *
 * @param {Array<Object>} creatives - Array of normalized creative objects
 * @returns {Array<Object>} Creatives with added `scoring` field, sorted by ROAS descending
 */
function scoreCreatives(creatives) {
  if (!creatives || creatives.length === 0) return [];

  const avgCtr = average(creatives, 'ctr');
  const avgRoas = average(creatives, 'roas');

  return creatives
    .map((creative) => ({
      ...creative,
      scoring: assignStatus(creative, avgCtr, avgRoas),
    }))
    .sort((a, b) => b.roas - a.roas);
}

/**
 * Assigns a status label and color to a creative based on its metrics
 * relative to account averages.
 *
 * @param {Object} creative - Normalized creative object
 * @param {number} avgCtr - Account average CTR
 * @param {number} avgRoas - Account average ROAS
 * @returns {Object} Scoring object with status, label, and color
 */
function assignStatus(creative, avgCtr, avgRoas) {
  if (creative.spend < 50) {
    return { status: 'low_spend', label: 'Low Spend', color: 'gray' };
  }

  const isFatigued = creative.frequency > 3.5 && creative.ctr < avgCtr;
  if (isFatigued) {
    return { status: 'fatigued', label: 'Fatigued', color: 'red' };
  }

  const roasAbove = creative.roas > avgRoas;
  const ctrAbove = creative.ctr > avgCtr;

  if (roasAbove && ctrAbove) {
    return { status: 'winning', label: 'Winning', color: 'green' };
  }

  if (roasAbove || ctrAbove) {
    return { status: 'watch', label: 'Watch', color: 'yellow' };
  }

  return { status: 'watch', label: 'Watch', color: 'yellow' };
}

/**
 * Computes a summary of aggregated stats across all creatives.
 *
 * @param {Array<Object>} creatives - Array of scored creative objects
 * @returns {Object} Summary with totals, averages, top/worst performers
 */
function getSummary(creatives) {
  if (!creatives || creatives.length === 0) {
    return {
      totalSpend: 0,
      avgCtr: 0,
      avgRoas: 0,
      avgCpc: 0,
      topPerformer: null,
      worstPerformer: null,
    };
  }

  const totalSpend = creatives.reduce((sum, c) => sum + c.spend, 0);
  const avgCtr = average(creatives, 'ctr');
  const avgRoas = average(creatives, 'roas');
  const avgCpc = average(creatives, 'cpc');

  const sorted = [...creatives].sort((a, b) => b.roas - a.roas);
  const topPerformer = sorted[0] || null;
  const worstPerformer = sorted[sorted.length - 1] || null;

  return { totalSpend, avgCtr, avgRoas, avgCpc, topPerformer, worstPerformer };
}

/**
 * Analyzes the top 20% of creatives by ROAS and surfaces common patterns.
 * Returns insights about format distribution, CTA types, copy length, and frequency.
 *
 * @param {Array<Object>} creatives - Array of scored creative objects
 * @returns {Array<Object>} Array of pattern insight objects
 */
function getWinningPatterns(creatives) {
  if (!creatives || creatives.length < 5) {
    return [];
  }

  const sorted = [...creatives].sort((a, b) => b.roas - a.roas);
  const topCount = Math.max(1, Math.ceil(sorted.length * 0.2));
  const winners = sorted.slice(0, topCount);
  const rest = sorted.slice(topCount);

  const patterns = [];

  // Format analysis
  const winnerFormats = countBy(winners, 'object_type');
  const restFormats = countBy(rest, 'object_type');
  const topFormat = Object.entries(winnerFormats).sort((a, b) => b[1] - a[1])[0];
  if (topFormat) {
    const winnerPct = ((topFormat[1] / winners.length) * 100).toFixed(0);
    const winnerAvgRoas = average(
      winners.filter((c) => c.object_type === topFormat[0]),
      'roas'
    );
    const otherAvgRoas = average(
      creatives.filter((c) => c.object_type !== topFormat[0] && c.spend >= 50),
      'roas'
    );
    const multiplier = otherAvgRoas > 0 ? (winnerAvgRoas / otherAvgRoas).toFixed(1) : 'N/A';

    patterns.push({
      category: 'format',
      title: `${topFormat[0] || 'Unknown'} format dominates winners`,
      description: `${winnerPct}% of top-performing creatives use ${topFormat[0]} format with ${multiplier}x higher ROAS`,
      data: { winnerFormats, restFormats },
    });
  }

  // CTA analysis
  const winnerCtas = countBy(winners, 'call_to_action_type');
  const topCta = Object.entries(winnerCtas).sort((a, b) => b[1] - a[1])[0];
  if (topCta) {
    const ctaPct = ((topCta[1] / winners.length) * 100).toFixed(0);
    patterns.push({
      category: 'cta',
      title: `"${formatCta(topCta[0])}" is the top CTA`,
      description: `${ctaPct}% of winning creatives use the "${formatCta(topCta[0])}" call-to-action`,
      data: { winnerCtas },
    });
  }

  // Copy length analysis
  const winnerWordCount = average(
    winners.map((c) => ({
      value: wordCount(c.title) + wordCount(c.body),
    })),
    'value'
  );
  const restWordCount = average(
    rest.map((c) => ({
      value: wordCount(c.title) + wordCount(c.body),
    })),
    'value'
  );
  patterns.push({
    category: 'copy',
    title: 'Optimal copy length',
    description: `Winning creatives average ${Math.round(winnerWordCount)} words vs ${Math.round(restWordCount)} words for others`,
    data: { winnerWordCount: Math.round(winnerWordCount), restWordCount: Math.round(restWordCount) },
  });

  // Frequency analysis
  const winnerAvgFreq = average(winners, 'frequency');
  const fatiguedCreatives = creatives.filter(
    (c) => c.scoring?.status === 'fatigued'
  );
  const fatiguedAvgFreq = fatiguedCreatives.length > 0
    ? average(fatiguedCreatives, 'frequency')
    : 0;
  patterns.push({
    category: 'frequency',
    title: 'Frequency sweet spot',
    description: `Winning creatives average ${winnerAvgFreq.toFixed(1)} frequency vs ${fatiguedAvgFreq.toFixed(1)} for fatigued ads`,
    data: { winnerAvgFreq, fatiguedAvgFreq },
  });

  return patterns;
}

/** @param {Array} arr @param {string} key @returns {number} */
function average(arr, key) {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((sum, item) => sum + (item[key] || 0), 0) / arr.length;
}

/** @param {Array} arr @param {string} key @returns {Object} */
function countBy(arr, key) {
  return arr.reduce((acc, item) => {
    const val = item[key] || 'unknown';
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
}

/** @param {string} text @returns {number} */
function wordCount(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).length;
}

/** @param {string} cta @returns {string} */
function formatCta(cta) {
  if (!cta) return 'None';
  return cta.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

module.exports = { scoreCreatives, getSummary, getWinningPatterns };
