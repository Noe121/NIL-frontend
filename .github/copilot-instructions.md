# Copilot Instructions for NILBx Frontend

## Project Overview
- **NILBx Frontend** is a modern React/Vite application for the NILBx platform, integrating with six backend microservices (API, Auth, Company, Feature Flag, Payment, Blockchain).
- Architecture is **per-service**: each service has its own endpoint and database, with feature flags controlling rollout and integration.
- Contracts system supports both traditional (PDF/Stripe) and Web3 (Polygon/NFT/USDC) deals, with NCAA compliance and tiered payouts.

## Key Directories & Files
- `src/components/Contracts/`: Core contract flow components (e.g., `CreateDealModal.jsx`, `CreateDealWeb3Modal.jsx`)
- `src/hooks/`: Custom hooks for payment calculation, feature flags, authentication
- `src/services/`: API, Auth, Blockchain service integration
- `src/pages/`: Route-based page components (e.g., `DealsPage.jsx`, `MarketplacePage.jsx`)
- `src/__tests__/`: 201+ tests, 100% page coverage, accessibility-first
- `vite.config.js`, `vitest.config.js`: Build and test configuration

## Developer Workflows
- **Install:** `npm install --legacy-peer-deps`
- **Start Dev Server:** `npm run dev` (port 5173)
- **Build:** `npm run build:per-service` (local/AWS), `npm run build:production` (AWS prod)
- **Test:** `npm test` (full suite), `npm test -- --watch`, `npm test -- --coverage`
- **Deploy AWS:** Build, upload to S3, invalidate CloudFront (see `deploy-aws.sh`)
- **Docker:** `docker build -t nilbx-frontend .`, `docker-compose up frontend`

## Patterns & Conventions
- **Feature Flags:** Managed via backend service, surfaced in UI via `useFeatureFlags` hook
- **Authentication:** JWT stored in `localStorage`, role-based access, auto-refresh
- **Contracts:** Dual system (traditional/Web3), conditional UI, payout calculation via `usePaymentCalculation`
- **Testing:** All pages/components have dedicated test files; accessibility and responsive design are required
- **UI:** Uses shadcn/ui, Tailwind CSS v4, Framer Motion for animations, glassmorphism design
- **Environment:** `.env.local` for local, `.env.production` for AWS; endpoints and flags are set via VITE_ variables

## Integration Points
- **API URLs:** Set via environment variables (see README)
- **Health Checks:** `/health` endpoints for all services
- **Payments:** Stripe/PayPal for traditional, USDC for Web3
- **Blockchain:** Polygon network, MetaMask/WalletConnect integration

## Examples
- **Create Deal:** `CreateDealModal` for traditional, `CreateDealWeb3Modal` for Web3
- **Accept Deal:** `DealAcceptanceCard` with API POST
- **Calculate Payout:** `usePaymentCalculation` hook

## Troubleshooting
- **CORS:** Check API URLs
- **Auth:** Verify JWT and endpoints
- **Build:** Clear `node_modules` and reinstall if issues

---
For more details, see `frontend/README.md`, `src/__tests__/TESTS_README.md`, and `QUICKSTART_CONTRACTS.md`.
