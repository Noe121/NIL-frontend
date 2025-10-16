
# NILbx Frontend 🏆

A modern React/Vite frontend for the NILbx platform - connecting athletes, sponsors, and fans through Name, Image, and Likeness (NIL) deals. Features JWT authentication, real-time API integration, and cloud deployment on AWS.

**Live Demo**: [https://nilbx.com](https://nilbx.com) ✅

This frontend integrates with microservices backend APIs and is hosted statically on S3 via CloudFront for global performance.

## ✨ Features
- **Modern React SPA**: Built with React 18 and Vite for fast development
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Landing Page**: Engaging interface for athletes, sponsors, and fans
- **Early Access Form**: Integrated with Formspree for lead capture
- **API Integration**: Real-time connection to backend microservices
- **JWT Authentication**: Secure login/register with role-based access
- **Cloud Ready**: Deployed on AWS S3 + CloudFront for global performance
- **Dual Build System**: Static landing page + React SPA in one bundle (267KB)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Docker Desktop (for local backend services)
- AWS CLI configured (for cloud deployment)

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   The app runs at http://localhost:5173

3. **Build for production:**
   ```bash
   npm run build
   ```
   Output is in `dist/` folder ready for S3 deployment

### Environment Configuration

Create a `.env` file for local development:
```bash
REACT_APP_API_URL=http://localhost:8000/
REACT_APP_AUTH_SERVICE_URL=http://localhost:9000/
```

For cloud deployment:
```bash
REACT_APP_API_URL=https://dev-nilbx-alb-961031935.us-east-1.elb.amazonaws.com/
REACT_APP_AUTH_SERVICE_URL=https://<auth-service-endpoint>/
```

## 📁 Project Structure
```
frontend/
├── src/
│   ├── components/           # Reusable React components
│   ├── views/               # Page-level components
│   ├── Auth.jsx            # Authentication UI (login/register)
│   ├── ApiDemo.jsx         # API integration demo
│   ├── LandingPage.jsx     # Main landing page
│   ├── NavBar.jsx          # Navigation component
│   ├── UserInfo.jsx        # User profile display
│   ├── main.jsx           # React app entry point
│   └── app.js             # Static site JavaScript
├── public/                 # Static assets
│   ├── styles.css         # Main stylesheet
│   ├── robots.txt         # SEO configuration
│   └── error.html         # Error page
├── assets/                # Images, icons, fonts
├── tests/                 # Test files
│   ├── test_frontend_basic.js    # Local integration tests
│   └── test_frontend_aws.js      # Cloud deployment tests
├── index.html            # Static landing page
├── index-react.html      # React SPA entry point
├── vite.config.js       # Vite build configuration
└── package.json         # Dependencies and scripts
```


## 🔗 API & Cloud Integration

### Current Deployment Status ✅
- **Frontend**: https://nilbx.com (CloudFront + S3)
- **API Service**: https://dev-nilbx-alb-961031935.us-east-1.elb.amazonaws.com
- **Health Check**: `curl http://dev-nilbx-alb-961031935.us-east-1.elb.amazonaws.com/health`

### Backend Integration
The frontend connects to three microservices:
- **API Service** (`dev-api-service`): Main application API on port 80
- **Auth Service** (`dev-auth-service`): JWT authentication on port 8001  
- **Company API** (`dev-company-api`): Company management on port 8080

All services are deployed on **AWS ECS Fargate** behind an **Application Load Balancer**.

### API Demo Component
The `src/ApiDemo.jsx` component demonstrates:
- Real-time API calls to backend services
- JWT token management
- Error handling and loading states
- Integration patterns for other components

### 🔄 Endpoint Auto-Detection
The frontend automatically detects and switches between local and cloud endpoints:

**Startup Logging:**
```
[INFO] Using API_URL: https://dev-nilbx-alb-961031935.us-east-1.elb.amazonaws.com/
[INFO] Using AUTH_SERVICE_URL: <auth-service-endpoint>/
[INFO] Environment: cloud/local detected
```

**Configuration Priority:**
1. Environment variables (`.env` file)
2. Cloud outputs (`../NILbx-env/outputs.json`)
3. Default local endpoints

**Sync Script:**
```bash
# Update local environment with latest cloud endpoints
./sync_env.sh
```

### 🔐 JWT Authentication Flow
- **Registration/Login**: UI at `/auth` route (`src/Auth.jsx`)
- **Token Storage**: JWT stored securely in `localStorage`
- **API Headers**: Automatic `Authorization: Bearer <token>` on all requests
- **Protected Routes**: Middleware redirects unauthenticated users to `/auth`
- **Token Validation**: Backend validates using `AUTH_SECRET_KEY`
- **Role Support**: User roles (athlete, sponsor, fan) for feature access

**Authentication Environment Variables:**
- `REACT_APP_API_URL`: Backend API base URL
- `REACT_APP_AUTH_SERVICE_URL`: Auth service base URL

**Current Values (Cloud):**
- API URL: `https://dev-nilbx-alb-961031935.us-east-1.elb.amazonaws.com/`
- Auth URL: `<auth-service-internal-endpoint>/`

**Local Development:**
- API URL: `http://localhost:8000/`
- Auth URL: `http://localhost:9000/`


## 🧪 Testing & Integration

### Automated Test Suite

**1. Basic Integration Test**
```bash
node tests/test_frontend_basic.js
```
Tests local development setup and basic functionality.

**2. Cloud Configuration Test**
```bash
node tests/test_frontend_aws.js
```
Validates AWS deployment and cloud endpoints:
- ✅ API URL accessibility
- ✅ Auth Service integration  
- ✅ Frontend URL (https://nilbx.com)
- ✅ CloudFront distribution
- ✅ S3 website endpoint

**Test Results (Current):**
```
✅ Frontend URL is accessible (Status: 200)
✅ API Service responding (Health check passed)
⚠️  Auth Service URL needs configuration
✅ CloudFront distribution active
⚠️  S3 website endpoint ready for deployment
```

### Full Integration Workflow

**Prerequisites:**
- Node.js and npm installed
- Backend services running (local or cloud)
- Database connection established

**1. Environment Setup**
```bash
# Install dependencies
cd api-service && pip install -r requirements.txt
cd ../frontend && npm install

# Set environment variables
export REACT_APP_API_URL=http://localhost:8000/
export REACT_APP_AUTH_SERVICE_URL=http://localhost:9000/
```

**2. Database Connection (Local)**
Set up SSH tunnel to RDS instance:
```bash
ssh -i <your-key.pem> -L 3306:<rds-endpoint>:3306 ec2-user@<ec2-host>
```

**3. Run Integration Tests**
```bash
# Full frontend-backend integration
./run_landingpage_integration.sh
```

This script:
- Starts backend FastAPI services
- Runs integration test suite
- Validates authentication flow
- Tests API connectivity
- Stops services cleanly

## 🔐 Authentication Flow

### User Journey
1. **Landing**: User visits https://nilbx.com
2. **Auth Required**: Protected routes redirect to `/auth`
3. **Login/Register**: Choose role (athlete, sponsor, fan) and authenticate
4. **Token Storage**: JWT stored in `localStorage` with expiration
5. **API Access**: All requests include `Authorization: Bearer <token>`
6. **Session Management**: Automatic token refresh and logout

### Role-Based Access
- **Athletes**: Profile management, deal creation, analytics
- **Sponsors**: Company dashboard, deal discovery, campaign management  
- **Fans**: Browse deals, support athletes, exclusive content

### Security Features
- Secure JWT token handling
- Automatic token expiration
- Protected route middleware
- CORS configuration for cloud deployment
- Input validation and sanitization

## 🚀 Deployment

### Production Build
Build optimized bundle for production:
```bash
npm run build
```
**Output**: `dist/` folder (267KB JavaScript bundle, gzipped)

### AWS S3 Deployment
Deploy to S3 bucket with CloudFront CDN:
```bash
# Deploy built assets to S3
aws s3 cp dist/ s3://dev-nilbx-frontend/ --recursive --acl public-read

# Invalidate CloudFront cache (optional)
aws cloudfront create-invalidation --distribution-id <distribution-id> --paths "/*"
```

### Deployment Verification
**Primary URL**: https://nilbx.com (Route 53 → CloudFront → S3)
**Direct CloudFront**: https://d22nfs7sczrzkh.cloudfront.net
**S3 Website**: http://dev-nilbx-frontend.s3-website-us-east-1.amazonaws.com

### Health Checks
```bash
# Frontend accessibility
curl -I https://nilbx.com

# API connectivity  
curl http://dev-nilbx-alb-961031935.us-east-1.elb.amazonaws.com/health

# Full deployment test
node tests/test_frontend_aws.js
```

### Environment Variables (Production)
Update for cloud deployment:
```bash
REACT_APP_API_URL=https://dev-nilbx-alb-961031935.us-east-1.elb.amazonaws.com/
REACT_APP_AUTH_SERVICE_URL=https://<auth-service-endpoint>/
NODE_ENV=production
```

### Deployment Pipeline
1. **Build**: `npm run build` (creates optimized bundle)
2. **Test**: Run integration tests
3. **Deploy**: Upload to S3 bucket
4. **Verify**: Check health endpoints
5. **Monitor**: CloudWatch logs and metrics

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

### Monitoring
- **CloudWatch**: Frontend access logs and metrics
- **Real User Monitoring**: Performance tracking
- **Error Tracking**: JavaScript error reporting
- **Uptime**: 99.9% availability target

## 🛠️ Development Tools

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run preview      # Preview production build
npm run test         # Run test suite
npm run lint         # Code linting
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

# Test cloud integration
node tests/test_frontend_aws.js

# Deploy to production
npm run build && aws s3 cp dist/ s3://dev-nilbx-frontend/ --recursive

# Check deployment health
curl -I https://nilbx.com
```

### Troubleshooting
- **CORS Issues**: Check API URL configuration
- **Auth Failures**: Verify JWT token and endpoints
- **Build Errors**: Clear `node_modules` and reinstall
- **Deployment Issues**: Check S3 bucket permissions

### Related Documentation
- [Main Project README](../README.md)
- [API Service Documentation](../api-service/README.md)
- [Auth Service Documentation](../auth-service/README.md)
- [Infrastructure Guide](../NILbx-env/README.md)

---

## 📜 License

© 2025 NILbx.com. All rights reserved.

**Status**: ✅ **Production Ready** - Deployed and operational at https://nilbx.com

Last Updated: October 16, 2025
