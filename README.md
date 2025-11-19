
# NILBx Frontend 🏆

A modern React/Vite frontend for the NILBx platform - connecting athletes, sponsors, and fans through Name, Image, and Likeness (NIL) deals. Features secure JWT authentication, per-service architecture integration, **complete contract system**, blockchain integration, and cloud deployment on AWS.

**Live Demo**: [https://nilbx.com](https://nilbx.com) ✅

**Latest Update (October 26, 2025):** ✨ **Complete Contract System Implementation**
- ✅ Dual contract types (Traditional + Web3)
- ✅ Athlete vs Influencer support
- ✅ Real-time payout calculations
- ✅ NCAA compliance integration
- ✅ Feature flag controlled rollout

This frontend integrates with microservices backend APIs and is hosted statically on S3 via CloudFront for global performance.

## 🎉 What's New - October 26, 2025

### Complete Contract System
**8 New Components** + **2 Custom Hooks** for end-to-end sponsorship deal flow:

```javascript
// Traditional contract creation (95% of deals)
<CreateDealModal targetUser={athlete} onSuccess={handleSuccess} />

// Web3 premium contracts (5% - feature flag controlled)
<CreateDealWeb3Modal targetUser={athlete} />

// Payout calculation
const { payout, platformFee } = usePaymentCalculation({
  amount: 1000,
  tierMultiplier: 5.0
});
// Returns: $3,883.70 payout with $200 platform fee
```

**Key Features:**
- 🤝 **Traditional Contracts**: PDF-based, Stripe integration, 3-second creation
- 🔗 **Web3 Contracts**: Smart contracts on Polygon, NFT minting, USDC payments
- 👥 **Athlete vs Influencer**: Different tier systems and conditional UI
- 📊 **5-Tier Payout System**: 0.575x → 5.0x multiplier based on followers
- ✅ **NCAA Compliance**: Automatic Rule 12.4.1 checks for student-athletes
- 🎚️ **Feature Flags**: Safe rollout with server-side control

**See:** [Contract Implementation Guide](../FRONTEND_CONTRACT_IMPLEMENTATION_2025-10-26.md)

## ✨ Core Features

### 🔐 Authentication
- **Secure Authentication**: Industry-standard JWT with bcrypt password hashing
- **Smart Password Handling**: Automatic password truncation for bcrypt's 72-byte limit
- **Complete Reset Flow**: Email-based password reset with secure token validation
- **Role-Based Access**: Athlete, sponsor, and fan role management

### 🌐 Per-Service Architecture Integration
- **Per-Service Mode**: Communicates with independent microservices via HTTP APIs
- **Cross-Service Communication**: JWT-validated requests between services
- **Dynamic Configuration**: Automatic environment detection and setup
- **Feature Flags**: Service-specific feature enablement

### ⛓️ Blockchain Integration
- **Web3 Wallet Support**: MetaMask and WalletConnect integration
- **NFT Management**: Token minting, transfer, and validation
- **Smart Contracts**: Sponsorship contract interactions
- **Ethereum Networks**: Support for mainnet and test networks

### 💳 Complete Contract & Payment System
**Latest Update:** October 26, 2025 - Full contract system implementation

#### **Dual Contract System**
- **Traditional Contracts (95% of deals)**: PDF-based contracts with Stripe/PayPal integration
- **Web3 Smart Contracts (5% premium)**: On-chain contracts with NFT collectibles
- **Athlete vs Influencer Support**: Conditional UI and tier systems
- **Feature Flag Controlled**: Safe rollout with `enable_web3_sponsorship` flag

#### **Contract Features**
- **Real-time Payout Calculation**: 5-tier multiplier system (0.575x - 5.0x)
- **NCAA Compliance**: Automatic compliance checks for student-athletes
- **Deal Management**: Complete acceptance/rejection flow
- **Smart Contract Deployment**: Polygon-based NFT minting
- **20% Platform Fee**: Transparent fee structure with tier bonuses

#### **Contract Flow Components**
```javascript
// Traditional contract creation
import CreateDealModal from './components/Contracts/CreateDealModal';

<CreateDealModal
  targetUser={athlete}
  onClose={() => setShowModal(false)}
  onSuccess={(deal) => alert(`Deal #${deal.id} created!`)}
/>

// Web3 contract creation (premium)
import CreateDealWeb3Modal from './components/Contracts/CreateDealWeb3Modal';

<CreateDealWeb3Modal
  targetUser={athlete}
  onClose={() => setShowWeb3Modal(false)}
/>

// Payout calculation hook
import { usePaymentCalculation } from './hooks/usePaymentCalculation';

const { payout, platformFee } = usePaymentCalculation({
  amount: 1000,
  userId: athlete.id,
  tierMultiplier: 5.0
});
// Returns: { payout: 3883.70, platformFee: 200 }
```

#### **Feature Flags**
- `enable_traditional_sponsorship` (true): Traditional PDF contracts
- `enable_web3_sponsorship` (false): Smart contracts + NFTs
- `enable_ncaa_compliance` (true): NCAA Rule 12.4.1 checks
- `enable_stripe_payments` (true): Stripe integration
- `enable_paypal_payments` (true): PayPal integration
- `enable_crypto_payments` (false): USDC/ETH payments

#### **Contract Architecture**
```
components/Contracts/
├── CreateDealModal.jsx           - Traditional contracts
├── CreateDealWeb3Modal.jsx       - Web3 smart contracts
├── NCAAComplianceWarning.jsx     - Athlete compliance UI
├── InstantPayoutBadge.jsx        - Influencer payout badge
├── PayoutBreakdown.jsx           - Payout display
└── DealAcceptanceCard.jsx        - Deal acceptance flow

hooks/
├── usePaymentCalculation.js      - Payout calculations
└── useFeatureFlags.js            - Feature flag management

pages/
├── DealsPage.jsx                 - Deal management dashboard
└── MarketplacePage.jsx           - Browse athletes/influencers
```

#### **Payout Calculation Example**
```javascript
// $1,000 deal, MEGA tier (5.0x multiplier)
Deal Amount:          $1,000.00
Platform Fee (20%):   -$200.00
Sponsor Share:         $800.00
Tier Multiplier:       ×5.0
Base Payout:          $4,000.00
Stripe Fee (2.9%):    -$116.30
Final Athlete Payout: $3,883.70
```

#### **Documentation**
- [Contract Flow Documentation](../CONTRACT_FLOW_DOCUMENTATION_2025-10-26.md)
- [Frontend Implementation Guide](../FRONTEND_CONTRACT_IMPLEMENTATION_2025-10-26.md)
- [Quick Start Guide](./QUICKSTART_CONTRACTS.md)

### 🎨 Modern User Interface
- **Component Library**: 12+ production-ready React components
- **Role-Based UI**: Custom interfaces for athletes, sponsors, and fans
- **Mobile First**: Touch-optimized responsive design
- **Accessibility**: WCAG 2.1 AA compliance

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Docker Desktop (for local backend services)
- AWS CLI configured (for cloud deployment)

### Quick Start

1. **Database Setup (Required for Local Development)**

   **⚠️ Important**: The frontend requires backend services with **CONSOLIDATED v5.0** database schema.

   ```bash
   # From NIL root directory
   cd /Users/nicolasvalladares/NIL

   # Start databases (auto-init with v5.0 schema)
   docker-compose up -d auth-mysql nilbx-mysql

   # Start required backend services
   docker-compose up -d auth-service api-service company-api
   ```

   **Test Accounts** (all use password: `test123`):
   | Email | Role | Use Case |
   |-------|------|----------|
   | `test@example.com` | admin | Platform administration |
   | `athlete.football@example.com` | athlete | College athlete (USC) |
   | `athlete.nfl@example.com` | athlete | Professional athlete (NFL) |
   | `sponsor.nike@example.com` | sponsor | Brand sponsor |
   | `coach.football@example.com` | coach | Team coach |
   | `parent.football@example.com` | parent | Parent/guardian |
   | `ncaa.admin@example.com` | NCAA admin | NCAA compliance |

   **Full list**: See `/NILbx-env/modules/db/mysql/README.md`

2. **Clone and Install**
   ```bash
   git clone https://github.com/Noe121/NIL-env.git
   cd frontend
   npm install --legacy-peer-deps
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5174
   - Login with any test account above (password: `test123`)

   **Backend Services:**
   - API Service: http://localhost:8001
   - Auth Service: http://localhost:9000
   - Company API: http://localhost:8002

### Environment Configuration

The application uses `.env.local` for environment variables in per-service mode:

**Current Configuration** (Auto-loaded):
```bash
# API Service Endpoints (Per-Service Architecture)
VITE_API_URL=http://localhost:8001            # API Service
VITE_AUTH_SERVICE_URL=http://localhost:9000   # Auth Service
VITE_COMPANY_API_URL=http://localhost:8002    # Company API
VITE_FEATURE_FLAG_URL=http://localhost:8004   # Feature Flag Service
VITE_PAYMENT_SERVICE_URL=http://localhost:8005 # Payment Service
VITE_BLOCKCHAIN_SERVICE_URL=http://localhost:8003  # Blockchain service

# Feature Flags
VITE_ENABLE_BLOCKCHAIN=false
VITE_ENABLE_TRADITIONAL_PAYMENTS=true
VITE_ENABLE_BLOCKCHAIN_PAYMENTS=false
VITE_ENABLE_ADVANCED_ANALYTICS=true
VITE_ENABLE_SOCIAL_INTEGRATION=true
VITE_ENABLE_CROSS_SERVICE_COMMUNICATION=true

# Feature Flags
VITE_ENABLE_BLOCKCHAIN=false
VITE_ENABLE_TRADITIONAL_PAYMENTS=true
VITE_ENABLE_BLOCKCHAIN_PAYMENTS=false
VITE_ENABLE_ADVANCED_ANALYTICS=true
VITE_ENABLE_SOCIAL_INTEGRATION=true
VITE_ENABLE_CROSS_SERVICE_COMMUNICATION=true

# Authentication
VITE_JWT_STORAGE_KEY=nilbx_token_per_service
VITE_SESSION_TIMEOUT=7200000

# UI Configuration
VITE_THEME=per-service
VITE_DEBUG_MODE=true
```

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Contracts/      # ✨ NEW - Contract system (Oct 2025)
│   │   │   ├── CreateDealModal.jsx
│   │   │   ├── CreateDealWeb3Modal.jsx
│   │   │   ├── NCAAComplianceWarning.jsx
│   │   │   ├── InstantPayoutBadge.jsx
│   │   │   ├── PayoutBreakdown.jsx
│   │   │   └── DealAcceptanceCard.jsx
│   │   ├── Marketplace/    # ✨ NEW - Marketplace components
│   │   │   └── UserProfileCard.jsx
│   │   ├── auth/           # Authentication components
│   │   ├── blockchain/     # Web3 integration components
│   │   └── ui/            # Common UI components
│   ├── hooks/             # ✨ NEW - Custom React hooks
│   │   ├── usePaymentCalculation.js  # Payout calculations
│   │   ├── useFeatureFlags.js        # Feature flags
│   │   └── useAuth.js                # Authentication
│   ├── services/           # API integration services
│   │   ├── api.js         # Core API service
│   │   ├── authService.js  # Authentication service
│   │   └── blockchainService.js # Web3 service
│   ├── utils/             # Utility functions
│   │   └── config.js      # Configuration management
│   ├── contexts/          # React context providers
│   │   ├── UserContext.jsx    # User state management
│   │   ├── Web3Context.jsx    # Blockchain state
│   │   └── GamificationContext.jsx # Achievement system
│   ├── views/             # Page components
│   │   ├── AthleteUserPage.jsx
│   │   ├── SponsorUserPage.jsx
│   │   └── FanUserPage.jsx
│   ├── pages/             # Route-based page components
│   │   ├── DealsPage.jsx      # ✨ NEW - Deal management dashboard
│   │   ├── CreateDeal.jsx     # Deal creation with Stripe checkout
│   │   ├── ClaimDeal.jsx      # Deal claiming for athletes
│   │   ├── FutureDeals.jsx    # Future deal pre-signing
│   │   └── MarketplacePage.jsx # Browse athletes/influencers
├── public/                # Static assets
├── tests/                 # Test files (390+ tests)
│   ├── components/        # Component unit tests
│   ├── utils/            # Utility function tests
│   └── integration/      # End-to-end tests
├── QUICKSTART_CONTRACTS.md # ✨ NEW - Contract system quick reference
├── vite.config.js         # Vite configuration
├── vitest.config.js       # Testing configuration
└── package.json          # Dependencies and scripts
```

## 🔗 API & Cloud Integration

### Current Deployment Status ✅
- **Frontend**: http://localhost:5174 (Development - Per-Service Mode)
- **API Service**: http://localhost:8001 ✅ (Running - Per-Service DB)
- **Auth Service**: http://localhost:9000 ✅ (Running - Per-Service DB)
- **Company API**: http://localhost:8002 ✅ (Running - Per-Service DB)
- **Feature Flag Service**: http://localhost:8004 ✅ (Running - Feature Flags)
- **Payment Service**: http://localhost:8005 ✅ (Running - Payment Processing)
- **Blockchain Service**: http://localhost:8545 ❌ (Not running locally)

### Production Endpoints (AWS)
- **Frontend**: https://nilbx.com (CloudFront + S3)
- **API Service**: https://dev-nilbx-alb-961031935.us-east-1.elb.amazonaws.com
- **Auth Service**: https://auth.nilbx.com
- **Company API**: https://company.nilbx.com
- **Feature Flag Service**: https://feature-flags.nilbx.com
- **Payment Service**: https://payments.nilbx.com
- **Blockchain Service**: https://blockchain.nilbx.com

### Backend Integration
The frontend connects to six microservices with per-service databases:
- **API Service** (`api-service`): Main application API on port 8001 with `nilbx_db`
- **Auth Service** (`auth-service`): JWT authentication on port 9000 with `auth_db`
- **Company API** (`company-api`): Company management on port 8002 with `nilbx_db`
- **Feature Flag Service** (`feature-flag-service`): Feature toggles on port 8004 with `feature_flags_db`
- **Payment Service** (`payment-service`): Payment processing on port 8005 with `nilbx_db`
- **Blockchain Service** (`blockchain-service`): Web3 integration on port 8545

All services are deployed on **AWS ECS Fargate** behind an **Application Load Balancer**.

### Health Check Results (Current)
```
✅ API Service: Healthy (http://localhost:8001/health)
✅ Auth Service: Healthy (http://localhost:9000/health)
✅ Company API: Healthy (http://localhost:8002/health)
✅ Feature Flag Service: Healthy (http://localhost:8004/health)
✅ Payment Service: Healthy (http://localhost:8005/health)
❌ Blockchain Service: Connection refused (http://localhost:8545/health)
```

## 🔐 Authentication Flow

### Complete User Authentication Journey

#### **New User Registration Flow**
1. **Landing**: User visits https://nilbx.com and clicks "Get Started"
2. **Auth Page**: Redirected to `/auth` with toggle between login/register
3. **Registration**: User fills email, password, and selects role (athlete, sponsor, fan)
4. **Account Creation**: Backend creates user account with encrypted password
5. **Auto-Login**: User automatically logged in after successful registration
6. **Dashboard Redirect**: User redirected to role-specific dashboard

#### **Existing User Login Flow**
1. **Auth Page**: User visits `/auth` and enters credentials
2. **Authentication**: Backend validates email/password combination
3. **JWT Token**: Server returns JWT token with user information and role
4. **Token Storage**: JWT stored securely in `localStorage` with expiration
5. **API Access**: All subsequent requests include `Authorization: Bearer <token>`
6. **Session Management**: Automatic token refresh and logout on expiration

#### **Password Reset Flow**
1. **Forgot Password**: User clicks "Forgot your password?" on login form
2. **Email Input**: User enters email address on `/forgot-password` page
3. **Reset Email**: Backend sends secure password reset email via SMTP
4. **Email Link**: User clicks link in email → `/reset-password?token=<secure-token>`
5. **New Password**: User enters and confirms new password
6. **Password Update**: Backend validates token and updates password
7. **Login Redirect**: User redirected to login with success message

### Role-Based Access
- **Athletes**: Profile management, deal creation, analytics
- **Sponsors**: Company dashboard, deal discovery, campaign management
- **Fans**: Browse deals, support athletes, exclusive content

### 🎨 Component Library & User Interface Design

### Landing Page Redesign (October 2025)
**Complete Modern Overhaul**: Transformed the landing page with shadcn/ui-inspired design system, glassmorphism effects, and micro-animations.

**Key Features:**
- **Glassmorphism Design**: Backdrop blur effects with subtle transparency
- **Modern Gradients**: Custom CSS variables for consistent brand colors
- **Micro-Animations**: Smooth hover/tap effects using Framer Motion
- **Responsive Grid**: Perfect mobile-to-desktop scaling
- **Component Architecture**: Modular landing sections (Hero, AthletesGrid, Testimonials, CTA, EarlyAccess)

**New Components:**
- `Hero.jsx`: Gradient hero with animated CTA buttons
- `AthletesGrid.jsx`: Interactive athlete cards with hover effects
- `Testimonials.jsx`: Glassmorphism testimonial cards with ratings
- `CTA.jsx`: Gradient call-to-action with statistics
- `EarlyAccess.jsx`: Modern form with role selection

**Design System:**
- **CSS Variables**: Brand-consistent color palette with dark mode support
- **Glass Effect**: `.glass` utility class for modern transparency effects
- **Gradient Backgrounds**: `.gradient-bg` for subtle background patterns
- **shadcn/ui Integration**: Consistent component primitives throughout

### 📦 **Core Components**

#### **Button Component** (Recently Updated)
**Purpose**: Modern, accessible button component with shadcn/ui integration and smooth animations.

**Recent Updates (October 2025)**:
- ✅ Migrated to shadcn/ui Button internally while maintaining backward compatibility
- ✅ Added motion.div wrappers for smooth hover/tap animations
- ✅ Preserved all original props, compound components, and styling variants
- ✅ Updated tests to work with new DOM structure (motion.div focus behavior)
- ✅ Maintained WCAG 2.1 AA accessibility compliance

**Features**:
- shadcn/ui integration with Tailwind CSS v4
- Smooth hover/tap animations via Framer Motion
- Full backward compatibility with existing implementations
- Support for all variants: primary, secondary, outline, ghost, danger, success, warning
- Compound components: Button.Group, Button.Icon, Button.Fab, Button.Dropdown
- Accessibility: Proper focus management, ARIA labels, keyboard navigation

#### **SocialShare Component**
**Purpose**: Enables users to share profiles, achievements, and content across social media platforms.

**Features**:
- Platform-specific share intents with proper URL encoding
- Mobile native share API integration when available
- Copy-to-clipboard functionality with visual feedback
- Gamification integration (points for sharing)
- Touch-optimized for mobile devices
- Accessibility compliant with ARIA labels

#### **Tooltip Component**
**Purpose**: Provides contextual help, guidance, and additional information throughout the interface.

**Features**:
- Smart positioning with collision detection
- Touch-friendly interactions on mobile
- Keyboard navigation support
- Auto-dismiss after timeout on mobile
- WCAG 2.1 accessibility compliance

#### **FileUpload Component**
**Purpose**: Handles file uploads with validation, preview, and progress tracking.

**Features**:
- Drag & drop interface with visual feedback
- File type and size validation with error messages
- Image preview functionality for visual files
- Progress tracking for uploads
- Mobile-optimized touch interactions

#### **Pagination Component**
**Purpose**: Manages navigation through large datasets with accessibility and mobile support.

**Features**:
- Smart page number display with ellipsis for large ranges
- Keyboard navigation (arrow keys, home, end)
- Mobile-responsive design with touch targets
- Jump to first/last page functionality

## 🧪 Testing & Integration

### ✅ Comprehensive Testing Suite - NOW COMPLETE!

**October 24, 2025 Update: Full Page Coverage Testing**

🎉 **Milestone Achieved:**
- ✅ **21 Frontend Pages** with complete test coverage
- ✅ **201 Total Test Cases** across all pages
- ✅ **100% Page Coverage** - Every page has tests
- ✅ **Accessibility First** - ARIA roles, semantic HTML, keyboard navigation
- ✅ **Production Ready** - CI/CD integration tested and verified

### Test Suite Architecture

**Automated Test Suite**
- **Framework**: Vitest + React Testing Library + Jest DOM
- **Coverage**: 201 tests across 21 page test files + setup configuration
- **Test Categories**:
  - 🏠 Marketing Pages (2 files, 18 tests)
  - 🔐 Authentication (4 files, 40 tests)
  - 👤 User Dashboards (5 files, 50 tests)
  - 👁️ Public Profiles (2 files, 20 tests)
  - 🛍️ Marketplace & Community (3 files, 30 tests)
  - 💰 Payment & Deals (3 files, 30 tests)
  - ⚙️ Settings & Help (2 files, 20 tests)
- **Scope**: Unit, integration, accessibility, and responsive design testing
- **CI/CD Ready**: Automated testing pipeline support

### Complete Test Coverage

**All 21 Pages Tested:**

| Page | Tests | Category |
|------|-------|----------|
| LandingPage | 8 | Marketing |
| SportsPage | 10 | Marketing |
| Auth | 10 | Authentication |
| Register | 10 | Authentication |
| ForgotPassword | 10 | Authentication |
| ResetPassword | 10 | Authentication |
| AthleteUserPage | 10 | Dashboards |
| InfluencerUserPage | 10 | Dashboards |
| SponsorUserPage | 10 | Dashboards |
| FanUserPage | 10 | Dashboards |
| EarningsDashboard | 10 | Dashboards |
| AthleteProfilePage | 10 | Profiles |
| InfluencerProfilePage | 10 | Profiles |
| MarketplacePage | 10 | Marketplace |
| CommunityPage | 10 | Community |
| LeaderboardPage | 10 | Community |
| ProfileEditPage | 10 | Settings |
| HelpCenterPage | 10 | Settings |
| ClaimDeal | 10 | Deals |
| FutureDeals | 10 | Deals |
| ErrorPage | 10 | Error Handling |
| **TOTAL** | **201** | **✅ Complete** |

### Test Results

**Latest Test Run:**
```
✅ Test Files: 21 passed
✅ Tests: 201 passing
✅ Duration: ~30-45 seconds
✅ Coverage Targets: Statements 75%+, Branches 70%+, Functions 75%+, Lines 75%+
```

### What Each Test Validates

✅ **Page Rendering**: Component renders without crashing, all major sections display
✅ **Accessibility**: ARIA roles assigned, semantic HTML, keyboard navigation, screen reader compatible
✅ **Content**: Headings, text, forms, buttons visible and functional
✅ **Navigation**: Links present, buttons clickable, routes working properly
✅ **User Interaction**: Forms can be filled, buttons respond, modals open/close
✅ **Responsive Design**: Mobile, tablet, and desktop layouts all working
✅ **Error Handling**: Error messages display, fallback content shown, graceful degradation

### Running Tests

```bash
# Run all 201 tests
npm test

# Run with watch mode (auto-rerun on changes)
npm test -- --watch

# Run with coverage report
npm test -- --coverage

# Run specific test file
npm test LandingPage.test.jsx

# Run tests matching pattern
npm test -- --grep "Auth"

# Run in CI mode (single run, no watch)
npm test -- --run

# Run with verbose output
npm test -- --reporter=verbose
```

### Test File Structure

**Location**: `frontend/src/__tests__/pages/`

**All test files include:**
- Rendering tests
- Content display verification
- Navigation functionality checks
- Accessibility compliance validation
- Form input testing (where applicable)
- Error state handling
- Responsive design verification

### Test Configuration

**Setup File**: `frontend/src/__tests__/setup.js`

Includes:
- ✅ Cleanup after each test
- ✅ window.matchMedia mock
- ✅ IntersectionObserver mock
- ✅ Console error suppression
- ✅ Jest DOM matchers

### Documentation

**Comprehensive Testing Guides:**
1. `frontend/src/__tests__/TESTS_README.md` - Complete test overview (400+ lines)
2. `frontend/TEST_QUICK_REFERENCE.md` - Quick reference and patterns (250+ lines)

---

### ✅ Old Test Statistics (Legacy)

## 🚀 Deployment

### Deployment Options

The NILBx frontend supports multiple deployment strategies for different environments:

#### 🌐 **Local Development Deployment**
Deploy locally for development and testing:

```bash
# Build for local development
npm run build:per-service

# Serve locally with preview server
npx vite preview --port 4173

# Access at: http://localhost:4173
```

#### 🐳 **Docker Deployment (Non-AWS)**
Deploy using Docker for containerized environments:

```bash
# Build Docker image
docker build -t nilbx-frontend .

# Run container locally
docker run -p 8080:80 nilbx-frontend

# Or use docker-compose (if available)
docker-compose up frontend
```

#### ☁️ **AWS Production Deployment**
Deploy to AWS infrastructure with CloudFront CDN:

```bash
# 1. Build optimized production bundle
npm run build:per-service

# 2. Deploy to S3 bucket
aws s3 cp dist/ s3://dev-nilbx-frontend/ --recursive --acl public-read

# 3. Invalidate CloudFront cache for immediate updates
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

# 4. Verify deployment
curl -I https://nilbx.com
```

### Environment-Specific Configuration

#### **Local Development (.env.local)**
```bash
# Local service endpoints
VITE_API_URL=http://localhost:8000
VITE_AUTH_SERVICE_URL=http://localhost:9000
VITE_COMPANY_API_URL=http://localhost:8002

# Development settings
VITE_DEBUG_MODE=true
VITE_API_TIMEOUT=5000
```

#### **AWS Production (.env.production)**
```bash
# AWS API Gateway endpoints
VITE_API_URL=https://dev-nilbx-alb-961031935.us-east-1.elb.amazonaws.com
VITE_AUTH_SERVICE_URL=https://auth.nilbx.com
VITE_COMPANY_API_URL=https://company.nilbx.com

# Production settings
VITE_DEBUG_MODE=false
VITE_API_TIMEOUT=3000
```

### Deployment Verification

#### **Local Deployment Check**
```bash
# Test local deployment
curl -I http://localhost:4173

# Expected: HTTP/1.1 200 OK
```

#### **AWS Deployment Check**
```bash
# Test production deployment
curl -I https://nilbx.com

# Test CloudFront distribution
curl -I https://d22nfs7sczrzkh.cloudfront.net

# Test S3 website (fallback)
curl -I http://dev-nilbx-frontend.s3-website-us-east-1.amazonaws.com
```

#### **Health Check Endpoints**
```bash
# API Service Health
curl https://dev-nilbx-alb-961031935.us-east-1.elb.amazonaws.com/health

# Auth Service Health
curl https://auth.nilbx.com/health

# Company API Health
curl https://company.nilbx.com/health

# Feature Flag Service Health
curl https://feature-flags.nilbx.com/health

# Payment Service Health
curl https://payments.nilbx.com/health
```

### Automated Deployment Scripts

#### **AWS Deployment Script**
```bash
#!/bin/bash
# deploy-aws.sh

# Build production bundle
npm run build:per-service

# Deploy to S3
aws s3 cp dist/ s3://dev-nilbx-frontend/ --recursive --acl public-read

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
  --paths "/*"

echo "✅ Deployment complete!"
echo "🌐 https://nilbx.com"
```

#### **Docker Deployment Script**
```bash
#!/bin/bash
# deploy-docker.sh

# Build Docker image
docker build -t nilbx-frontend:$VERSION .

# Tag for registry
docker tag nilbx-frontend:$VERSION your-registry.com/nilbx-frontend:$VERSION

# Push to registry
docker push your-registry.com/nilbx-frontend:$VERSION

# Deploy to container platform
kubectl apply -f k8s/frontend-deployment.yaml
```

### Deployment Environments

| Environment | Build Command | Target | URL | Notes |
|-------------|---------------|--------|-----|-------|
| **Local Dev** | `npm run dev` | Localhost | http://localhost:5174 | Hot reload, debug enabled |
| **Local Preview** | `npm run build && npx vite preview` | Localhost | http://localhost:4174 | Production build preview |
| **Docker** | `docker build -t nilbx-frontend .` | Container | http://localhost:8080 | Containerized deployment |
| **AWS Staging** | `npm run build` | S3 + CloudFront | https://staging.nilbx.com | Pre-production testing |
| **AWS Production** | `npm run build:production` | S3 + CloudFront | https://nilbx.com | Live production site |

### CDN and Performance Optimization

#### **AWS CloudFront Configuration**
- **Origins**: S3 bucket + API Gateway endpoints
- **Behaviors**: Static assets cached for 1 year, API calls pass-through
- **SSL/TLS**: Custom certificate with automatic renewal
- **Edge Locations**: 200+ global locations for low latency

#### **Caching Strategy**
```javascript
// Cache static assets aggressively
Cache-Control: public, max-age=31536000, immutable

// API responses with short cache
Cache-Control: private, max-age=300

// No-cache for dynamic content
Cache-Control: no-cache, no-store, must-revalidate
```

### Rollback Procedures

#### **AWS Rollback**
```bash
# Rollback to previous version
aws s3 cp s3://dev-nilbx-frontend-backup/ s3://dev-nilbx-frontend/ --recursive

# Invalidate cache
aws cloudfront create-invalidation --distribution-id $ID --paths "/*"
```

#### **Docker Rollback**
```bash
# Rollback container version
kubectl rollout undo deployment/frontend-deployment

# Or specify revision
kubectl rollout undo deployment/frontend-deployment --to-revision=2
```

## 📊 Performance & Metrics

### Build Optimization
- **Bundle Size**: ~280KB JavaScript (gzipped)
- **Build Tool**: Vite (fast HMR and optimized builds)
- **Code Splitting**: Automatic route-based splitting
- **Asset Optimization**: Images, fonts, and CSS minification

### Production Performance
- **CDN**: CloudFront global edge locations
- **Caching**: Aggressive browser and CDN caching
- **Compression**: Gzip/Brotli compression enabled
- **HTTP/2**: Modern protocol support

## 🛠️ Development Tools

### Available Scripts
```bash
# Development
npm run dev                    # Start development server (port 5174)
npm run dev:per-service        # Start per-service mode explicitly

# Building
npm run build                  # Build for production
npm run build:per-service      # Build for per-service mode
npm run build:production       # Build for production deployment

# Testing
npm test                       # Run full test suite (201 tests)
npm run test:coverage          # Generate coverage report
npm run test:ui               # Open Vitest UI for visual testing

# Environment Management
npm run setup:per-service      # Setup per-service mode
npm run switch:per-service     # Switch to per-service mode
npm run toggle:blockchain      # Toggle blockchain features
```

### Quick Start Examples

#### **Create a Traditional Deal**
```javascript
import { useState } from 'react';
import CreateDealModal from './components/Contracts/CreateDealModal';

function SponsorButton({ athlete }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Sponsor @{athlete.username}
      </button>

      {showModal && (
        <CreateDealModal
          targetUser={athlete}
          onClose={() => setShowModal(false)}
          onSuccess={(deal) => console.log('Deal created:', deal)}
        />
      )}
    </>
  );
}
```

#### **Accept a Deal (Athlete)**
```javascript
import DealAcceptanceCard from './components/Contracts/DealAcceptanceCard';

function MyDeals({ pendingDeals }) {
  const handleAccept = async (dealId) => {
    await fetch(`/api/v1/deals/${dealId}/accept`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ accept_terms: true })
    });
  };

  return pendingDeals.map(deal => (
    <DealAcceptanceCard
      key={deal.id}
      deal={deal}
      onAccept={handleAccept}
      onReject={handleReject}
    />
  ));
}
```

#### **Calculate Payouts**
```javascript
import { usePaymentCalculation } from './hooks/usePaymentCalculation';

function DealPreview({ athlete, amount }) {
  const { payout, platformFee, loading } = usePaymentCalculation({
    amount,
    userId: athlete.id,
    tierMultiplier: athlete.tier_multiplier
  });

  if (loading) return <Spinner />;

  return (
    <div>
      <p>Platform Fee: ${platformFee}</p>
      <p>Athlete Gets: ${payout}</p>
    </div>
  );
}
```

### Development Features
- **Hot Module Replacement**: Instant updates during development
- **TypeScript Support**: Optional TypeScript integration
- **ESLint**: Code quality and consistency
- **Prettier**: Automatic code formatting

### Browser Support
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 🛠️ Development Tools

### CODEX ChatGPT VSCode Extension Setup

The CODEX ChatGPT extension provides AI-powered code assistance directly in VSCode. Follow these steps to set it up for optimal NILBx frontend development.

#### **Installation**

1. **Install the Extension**
   ```bash
   # In VSCode Command Palette (Cmd+Shift+P / Ctrl+Shift+P)
   # Type: "Extensions: Install Extensions"
   # Search for: "CODEX ChatGPT"
   # Click Install
   ```

2. **Verify Installation**
   - Check VSCode Extensions sidebar for "CODEX ChatGPT"
   - Version should be latest (check for updates if needed)

#### **Configuration**

1. **Get OpenAI API Key**
   ```bash
   # Visit: https://platform.openai.com/api-keys
   # Create new API key with appropriate permissions
   # Copy the API key (starts with "sk-")
   ```

2. **Configure Extension Settings**
   ```json
   // VSCode Settings (settings.json)
   {
     "codex-chatgpt.apiKey": "sk-your-api-key-here",
     "codex-chatgpt.model": "gpt-4",
     "codex-chatgpt.maxTokens": 4096,
     "codex-chatgpt.temperature": 0.7,
     "codex-chatgpt.contextWindow": 8000
   }
   ```

3. **Project-Specific Configuration**
   ```json
   // .vscode/settings.json (project-specific)
   {
     "codex-chatgpt.contextFiles": [
       "package.json",
       "vite.config.js",
       "src/utils/config.js",
       "src/services/api.js"
     ],
     "codex-chatgpt.codeStyle": "react-typescript",
     "codex-chatgpt.framework": "react-vite",
     "codex-chatgpt.linting": "eslint-prettier"
   }
   ```

#### **Usage Instructions**

##### **Basic Commands**

1. **Inline Code Generation**
   ```javascript
   // Type a comment describing what you want
   // CODEX: Create a React component for user profile display

   // Press Ctrl+Shift+G (or Cmd+Shift+G on Mac) to generate
   ```

2. **Code Explanation**
   ```javascript
   // Select code and use:
   // Command: "CODEX: Explain Selected Code"
   // Shortcut: Ctrl+Shift+E
   ```

3. **Code Refactoring**
   ```javascript
   // Select code and use:
   // Command: "CODEX: Refactor Selected Code"
   // Shortcut: Ctrl+Shift+R
   ```

##### **NILBx-Specific Commands**

1. **Component Generation**
   ```javascript
   // For NILBx components, use these prompts:

   // CODEX: Create a React component for athlete profile card with sponsor button
   // CODEX: Generate a deal creation modal with Stripe integration
   // CODEX: Build a marketplace user card with follower count and tier badge
   ```

2. **API Integration**
   ```javascript
   // For service integration:

   // CODEX: Create API service function for fetching athlete deals
   // CODEX: Generate authentication hook for JWT token management
   // CODEX: Build feature flag service integration
   ```

3. **Testing Assistance**
   ```javascript
   // For test generation:

   // CODEX: Generate unit tests for CreateDealModal component
   // CODEX: Create integration test for payment flow
   // CODEX: Build accessibility tests for user profile page
   ```

##### **Advanced Features**

1. **Context-Aware Generation**
   ```javascript
   // The extension automatically includes:
   // - Current file context
   // - Project structure
   // - Import statements
   // - Component patterns from existing code
   ```

2. **Multi-File Operations**
   ```javascript
   // CODEX: Create a complete feature for user notifications
   // - Generates component, service, and test files
   // - Includes proper imports and exports
   // - Follows project conventions
   ```

3. **Code Review Assistance**
   ```javascript
   // CODEX: Review this component for React best practices
   // CODEX: Suggest performance optimizations for this code
   // CODEX: Check for accessibility compliance
   ```

#### **Keyboard Shortcuts**

| Command | Shortcut | Description |
|---------|----------|-------------|
| Generate Code | `Ctrl+Shift+G` | Generate code from comment/context |
| Explain Code | `Ctrl+Shift+E` | Explain selected code |
| Refactor Code | `Ctrl+Shift+R` | Refactor selected code |
| Optimize Code | `Ctrl+Shift+O` | Optimize performance |
| Add Tests | `Ctrl+Shift+T` | Generate tests for code |
| Fix Issues | `Ctrl+Shift+F` | Fix linting/code issues |

#### **Best Practices for NILBx Development**

1. **Component Development**
   ```javascript
   // Always specify the framework and context:
   // CODEX: Create a React functional component for athlete dashboard using hooks

   // Include existing patterns:
   // CODEX: Create component similar to AthleteUserPage but for sponsors
   ```

2. **API Integration**
   ```javascript
   // Specify service endpoints:
   // CODEX: Create API call to auth service for user login
   // CODEX: Generate fetch function for company API deals endpoint
   ```

3. **Styling and UI**
   ```javascript
   // Include design system context:
   // CODEX: Create responsive card component using Tailwind CSS
   // CODEX: Build modal with glassmorphism effect like landing page
   ```

4. **Error Handling**
   ```javascript
   // Specify error scenarios:
   // CODEX: Add error handling for failed API calls with user feedback
   // CODEX: Create loading states for async operations
   ```

#### **Next Steps for AWS Deployment**

**For AWS deployment, first configure usable credentials, re-run `./bootstrap_terraform_backend.sh` to create the S3/DynamoDB backend, then continue with `./nil-deploy.sh deploy-dev`.**

#### **Troubleshooting**

1. **API Key Issues**
   ```bash
   # Check API key configuration
   # VSCode Settings → Extensions → CODEX ChatGPT → API Key

   # Verify key format: sk-...
   # Check OpenAI account credits
   ```

2. **Generation Quality**
   ```json
   // Adjust settings for better results:
   {
     "codex-chatgpt.temperature": 0.3,  // More focused
     "codex-chatgpt.maxTokens": 2048,   // Shorter responses
     "codex-chatgpt.model": "gpt-4"     // Better quality
   }
   ```

3. **Context Issues**
   ```json
   // Add more context files:
   {
     "codex-chatgpt.contextFiles": [
       "src/components/ui/Button.jsx",
       "src/hooks/useAuth.js",
       "src/services/api.js",
       "tailwind.config.js"
     ]
   }
   ```

#### **Integration with NILBx Workflow**

1. **Component Library Development**
   ```javascript
   // CODEX: Create a new button variant for the design system
   // CODEX: Build a form component with validation for user registration
   ```

2. **Feature Implementation**
   ```javascript
   // CODEX: Implement the complete flow for creating a traditional deal
   // CODEX: Add Web3 wallet connection for smart contract deals
   ```

3. **Testing and Quality**
   ```javascript
   // CODEX: Generate comprehensive tests for the new feature
   // CODEX: Add accessibility tests for screen reader compatibility
   ```

4. **Documentation**
   ```javascript
   // CODEX: Create JSDoc comments for this complex function
   // CODEX: Generate usage examples for the new component
   ```

#### **Performance Tips**

1. **Response Time**
   - Use GPT-4 for better quality (slower)
   - Use GPT-3.5-turbo for faster responses
   - Adjust max tokens based on task complexity

2. **Context Management**
   - Keep context files relevant to current task
   - Use specific prompts rather than generic ones
   - Include file paths for multi-file operations

3. **Rate Limiting**
   - OpenAI has rate limits based on your account tier
   - Monitor usage in OpenAI dashboard
   - Consider upgrading for higher limits

### Available Scripts

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes and test locally
4. Run test suite (`npm test`)
5. Build and verify (`npm run build`)
6. Commit changes (`git commit -m 'Add amazing feature'`)
7. Push to branch (`git push origin feature/amazing-feature`)
8. Open Pull Request

### Code Standards
- Follow React best practices
- Use functional components and hooks
- Maintain responsive design principles
- Add tests for new features
- Update documentation as needed

## 📞 Support & Documentation

### Useful Commands
```bash
# Start local development environment
npm run dev

# Test service health checks
curl http://localhost:8001/health  # API Service
curl http://localhost:9000/health  # Auth Service
curl http://localhost:8002/health  # Company API
curl http://localhost:8004/health  # Feature Flag Service
curl http://localhost:8005/health  # Payment Service

# Test cloud integration
npm run test:integration:aws

# Deploy to production
npm run build && aws s3 cp dist/ s3://dev-nilbx-frontend/ --recursive

# Check deployment health
curl -I https://nilbx.com
```

### Troubleshooting
- **CORS Issues**: Check API URL configuration
- **Auth Failures**: Verify JWT token and endpoints
- **Build Issues**: Clear node_modules and reinstall

## 📄 License
© 2025 NILBx.com. All rights reserved.
