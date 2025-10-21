
# NILbx Frontend 🏆

A modern React/Vite frontend for the NILbx platform - connecting athletes, sponsors, and fans through Name, Image, and Likeness (NIL) deals. Features secure JWT authentication, dual-mode operation (standalone/centralized), blockchain integration, and cloud deployment on AWS.

**Live Demo**: [https://nilbx.com](https://nilbx.com) ✅

This frontend integrates with microservices backend APIs and is hosted statically on S3 via CloudFront for global performance.

## ✨ Core Features

### 🔐 Authentication
- **Secure Authentication**: Industry-standard JWT with bcrypt password hashing
- **Smart Password Handling**: Automatic password truncation for bcrypt's 72-byte limit
- **Complete Reset Flow**: Email-based password reset with secure token validation
- **Role-Based Access**: Athlete, sponsor, and fan role management

### 🌐 Dual-Mode Operation
- **Standalone Mode**: Local development with independent services
- **Centralized Mode**: AWS infrastructure integration with shared services
- **Dynamic Configuration**: Automatic environment detection and setup
- **Feature Flags**: Mode-specific feature enablement

### ⛓️ Blockchain Integration
- **Web3 Wallet Support**: MetaMask and WalletConnect integration
- **NFT Management**: Token minting, transfer, and validation
- **Smart Contracts**: Sponsorship contract interactions
- **Ethereum Networks**: Support for mainnet and test networks

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

1. **Clone and Install**
   ```bash
   git clone https://github.com/Noe121/NIL-env.git
   cd frontend
   npm install --legacy-peer-deps
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5174
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
VITE_BLOCKCHAIN_SERVICE_URL=http://localhost:8003  # Blockchain service

# Feature Flags
VITE_ENABLE_BLOCKCHAIN=false
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
│   │   ├── auth/           # Authentication components
│   │   ├── blockchain/     # Web3 integration components
│   │   └── ui/            # Common UI components
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
│   └── pages/             # Route-based page components
├── public/                # Static assets
├── tests/                 # Test files (180+ tests)
│   ├── components/        # Component unit tests
│   ├── utils/            # Utility function tests
│   └── integration/      # End-to-end tests
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
- **Blockchain Service**: http://localhost:8545 ❌ (Not running locally)

### Production Endpoints (AWS)
- **Frontend**: https://nilbx.com (CloudFront + S3)
- **API Service**: https://dev-nilbx-alb-961031935.us-east-1.elb.amazonaws.com
- **Auth Service**: https://auth.nilbx.com
- **Company API**: https://company.nilbx.com
- **Blockchain Service**: https://blockchain.nilbx.com

### Backend Integration
The frontend connects to three microservices with per-service databases:
- **API Service** (`api-service`): Main application API on port 8001 with `api_db`
- **Auth Service** (`auth-service`): JWT authentication on port 9000 with `auth_db`
- **Company API** (`company-api`): Company management on port 8002 with `company_db`

All services are deployed on **AWS ECS Fargate** behind an **Application Load Balancer**.

### Health Check Results (Current)
```
✅ API Service: Healthy (http://localhost:8001/health)
✅ Auth Service: Healthy (http://localhost:9000/health)
✅ Company API: Healthy (http://localhost:8002/health)
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

## 🎨 Component Library & User Interface Design

### 📦 **Core Components**

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

### Automated Test Suite

**🔬 Comprehensive Testing Framework**
- **Framework**: Vitest + React Testing Library + Jest DOM
- **Coverage**: 180+ tests across 15 test suites
- **Scope**: Unit, integration, accessibility, and mobile testing
- **CI/CD Ready**: Automated testing pipeline support

**Test Results (Current):**
```
✅ Test Files: 15 passed (15)
✅ Tests: 348 passed | 1 skipped (349)
✅ Duration: ~22 seconds
✅ All Components: Tested and validated
✅ Authentication: Login/register/reset flows working
✅ Accessibility: WCAG 2.1 AA compliance verified
✅ Mobile: Touch interactions and responsive design validated
```

### Running Tests
```bash
# Run full test suite
npm test

# Run specific test categories
npm run test:components    # Component tests
npm run test:utils         # Utility function tests
npm run test:integration   # Integration tests

# Run with coverage
npm run test:coverage
```

## 🚀 Deployment

### Deployment Options

The NILbx frontend supports multiple deployment strategies for different environments:

#### 🌐 **Local Development Deployment**
Deploy locally for development and testing:

```bash
# Build for local development
npm run build:centralized

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
npm run build:centralized

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
```

### Automated Deployment Scripts

#### **AWS Deployment Script**
```bash
#!/bin/bash
# deploy-aws.sh

# Build production bundle
npm run build:centralized

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
- **Bundle Size**: 267KB JavaScript (gzipped)
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
npm test                       # Run full test suite
npm run test:coverage          # Generate coverage report

# Environment Management
npm run setup:per-service      # Setup per-service mode
npm run switch:per-service     # Switch to per-service mode
npm run toggle:blockchain      # Toggle blockchain features
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

## 🤝 Contributing

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
© 2025 NILbx.com. All rights reserved.
