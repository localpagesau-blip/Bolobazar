# SiteFlip — Marketplace for Buying & Selling Websites

A modern marketplace platform connecting website sellers with qualified buyers.

## Project Structure

- **`backend/`** — Node.js/Express REST API with JWT auth, listing CRUD, AI valuation, Stripe payments, and inquiry/messaging system
- **`dashboard/`** — Vite + React + Tailwind CSS frontend with all marketplace pages

## Quick Start

### Backend
```bash
cd backend
npm install
npm run db:init    # Initialize database and seed demo data
npm start          # Start on http://localhost:3001
```

### Frontend
```bash
cd dashboard
npm install
npm run dev        # Start on http://localhost:5173
```

## API Endpoints

| Endpoint | Description |
|---|---|
| `POST /api/auth/register` | Register a new user |
| `POST /api/auth/login` | Authenticate and get JWT |
| `GET/POST/PUT/DELETE /api/listings` | Listing CRUD with search/pagination |
| `POST /api/valuation` | AI-powered website valuation |
| `POST /api/payments/create-payment-intent` | Stripe payment integration |
| `POST /api/inquiries` | Buyer-seller messaging |
| `POST /api/transactions/initiate` | Transaction/escrow flow |
| `GET /api/admin/stats` | Platform analytics |

## Demo Credentials

- **Admin:** admin@siteflip.com / admin123
- **Seller:** demo-seller@siteflip.com / demo123
- **Buyer:** demo-buyer@siteflip.com / demo123