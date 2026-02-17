# Meta Creative Analytics Platform

A dashboard for marketing teams to analyze Meta (Facebook/Instagram) ad creative performance. Built for B2B SaaS teams running lead gen campaigns.

## Features

- **Dashboard** — Summary KPIs (Total Spend, Avg CTR, Avg ROAS, Avg CPC), top winning creatives, fatigued creative alerts
- **Creatives Table** — Sortable, filterable table with status badges (Winning/Watch/Fatigued/Low Spend), search by name
- **Creative Comparison** — Side-by-side comparison of 2-4 creatives with best-value highlighting
- **Winning Patterns** — AI-style insights analyzing top 20% performers by format, CTA, copy length, and frequency

## Tech Stack

- **Backend**: Node.js + Express (REST API)
- **Frontend**: React + TypeScript + Tailwind CSS (Vite)
- **Data**: Meta Marketing API (v19.0)
- **Charts**: Recharts

## Prerequisites

- Node.js 18+
- npm 9+
- A Meta Business account with Marketing API access

## Getting a Meta Access Token

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create an app (Business type)
3. Add the **Marketing API** product
4. Go to **Tools > Graph API Explorer**
5. Select your app and generate a User Access Token with `ads_read` permission
6. For a long-lived token, exchange it via the [token exchange endpoint](https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived/)
7. Find your Ad Account ID in [Ads Manager](https://www.facebook.com/adsmanager/) (format: `act_123456789`)

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd claude
   ```

2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` with your Meta credentials:
   ```
   META_ACCESS_TOKEN=your_long_lived_token
   META_AD_ACCOUNT_ID=act_your_account_id
   PORT=3001
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Start the development servers:
   ```bash
   npm run dev
   ```

   This starts both:
   - Express API server on `http://localhost:3001`
   - Vite dev server on `http://localhost:5173`

6. Open `http://localhost:5173` in your browser.

## Project Structure

```
/
├── server/                   # Express backend
│   ├── index.js              # Entry point
│   ├── config/               # Environment configuration
│   ├── middleware/            # Error handling
│   ├── routes/               # API route handlers
│   │   ├── creatives.js      # GET /api/creatives, /api/creatives/:id
│   │   └── summary.js        # GET /api/summary
│   ├── services/
│   │   ├── metaApi.js        # Meta Marketing API integration
│   │   └── creativeScoring.js # Scoring and pattern analysis
│   └── utils/
│       └── cache.js          # In-memory cache (15-min TTL)
│
├── client/                   # React frontend
│   ├── src/
│   │   ├── api/              # API client
│   │   ├── components/       # UI components
│   │   ├── context/          # React Context (date range, comparison)
│   │   ├── hooks/            # Custom hooks
│   │   ├── pages/            # Page components
│   │   ├── types/            # TypeScript interfaces
│   │   └── utils/            # Formatting utilities
│   └── vite.config.ts
│
├── .env.example
└── package.json              # Root workspace config
```

## API Endpoints

### GET /api/creatives
Fetch all ads with insights and scoring.

Query params:
- `since` (YYYY-MM-DD) — Start date, defaults to 30 days ago
- `until` (YYYY-MM-DD) — End date, defaults to today

### GET /api/creatives/:ad_id
Fetch a single ad with full metrics.

### GET /api/summary
Aggregated stats: total spend, averages, top/worst performers, winning patterns.

Query params: same as `/api/creatives`

## Status Badge Logic

| Status | Condition |
|--------|-----------|
| Winning | ROAS above avg AND CTR above avg |
| Watch | One metric above avg, one below |
| Fatigued | Frequency > 3.5 AND CTR below avg |
| Low Spend | Spend < $50 (insufficient data) |
