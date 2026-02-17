# CLAUDE.md - AI Assistant Guide

> **Purpose**: This file provides AI assistants with comprehensive context about this repository's structure, conventions, and development workflows.

## Repository Overview

**Repository Name**: `alonyaaran-stack/claude`

**Purpose**: Meta Creative Analytics Platform — a dashboard for Datarails' marketing team to analyze Meta ad creative performance for B2B SaaS lead gen campaigns.

**Main Technologies**:
- Backend: Node.js + Express (plain JavaScript with JSDoc)
- Frontend: React + TypeScript + Tailwind CSS (Vite)
- Data source: Meta Marketing API (v19.0)
- Charts: Recharts
- Monorepo: npm workspaces

### Quick Start

```bash
cp .env.example .env    # Add your Meta credentials
npm install             # Installs all workspace deps
npm run dev             # Starts Express (3001) + Vite (5173) concurrently
```

---

## Codebase Structure

```
/
├── server/                       # Express backend
│   ├── index.js                  # Entry point (port 3001)
│   ├── config/index.js           # Env var loading
│   ├── middleware/errorHandler.js # Error handling
│   ├── routes/
│   │   ├── creatives.js          # GET /api/creatives, /api/creatives/:ad_id
│   │   └── summary.js           # GET /api/summary
│   ├── services/
│   │   ├── metaApi.js            # Meta Marketing API calls
│   │   └── creativeScoring.js    # Scoring, summary, pattern analysis
│   └── utils/cache.js            # node-cache wrapper (15-min TTL)
│
├── client/                       # React frontend (Vite)
│   ├── src/
│   │   ├── api/client.ts         # API client (fetch wrapper)
│   │   ├── components/           # UI components (layout, ui, dashboard, table, comparison, patterns)
│   │   ├── context/              # DateRangeContext, ComparisonContext
│   │   ├── hooks/                # useCreatives, useSummary, useDebounce
│   │   ├── pages/                # Dashboard, Creatives, Comparison, Patterns
│   │   ├── types/index.ts        # TypeScript interfaces
│   │   └── utils/formatters.ts   # Number/currency formatting
│   └── vite.config.ts            # Vite + Tailwind + API proxy config
│
├── .env.example                  # Required: META_ACCESS_TOKEN, META_AD_ACCOUNT_ID
├── package.json                  # Root workspace config
└── README.md                     # Setup and usage guide
```

### Key Architecture Notes

- Vite proxies `/api` requests to Express at localhost:3001 (no CORS in dev)
- Server uses in-memory cache (node-cache) with 15-min TTL keyed by date range
- Frontend state: React Context for date range and comparison selection
- Status scoring: Winning/Watch/Fatigued/Low Spend based on ROAS, CTR, frequency, spend thresholds

---

## Code Conventions

### Backend (server/)
- Plain JavaScript with JSDoc comments on all route handlers and service functions
- async/await throughout, error propagation via `next(err)` to error middleware
- Meta API calls isolated in `services/metaApi.js`
- Scoring logic isolated in `services/creativeScoring.js`

### Frontend (client/)
- TypeScript strict mode
- Functional components with hooks
- Tailwind CSS for styling (dark mode: gray-950/900/800 palette)
- Custom hooks for data fetching (useCreatives, useSummary)
- react-hot-toast for error notifications

---

## Development Workflow

### Scripts
- `npm run dev` — Start both servers concurrently
- `npm run build` — Build client for production
- `npm run start` — Start production server

### Branch Strategy
- Feature branches: `claude/<description>-<session-id>`
- Always push with `git push -u origin <branch-name>`

---

## External Services

### Meta Marketing API
- Version: v19.0
- Auth: Long-lived access token stored in `.env`
- Endpoints used: `/act_{id}/ads` with creative and insights fields
- Rate limiting: Handled with exponential backoff on 429 responses
- Cache: 15-minute TTL to reduce API calls

---

**Last Updated**: 2026-02-17
