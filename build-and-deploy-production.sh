#!/bin/bash
# Production Build and Deploy Script - Fixed
# This script builds the frontend with correct production configuration and deploys to S3/CloudFront

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  NILBx Frontend Production Build & Deploy${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

# Step 1: Verify we're in the frontend directory
if [ ! -f "package.json" ]; then
  echo -e "${RED}❌ Error: package.json not found. Please run from frontend directory.${NC}"
  exit 1
fi

echo -e "${YELLOW}Step 1: Building production bundle with correct configuration...${NC}"

# Ensure we're using the production environment
export NODE_ENV=production
export VITE_MODE=centralized

# Check Node version
NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node version: $NODE_VERSION${NC}"

# Clean previous builds
echo -e "${YELLOW}  Cleaning previous builds...${NC}"
rm -rf dist dist-per-service dist-standalone dist-centralized

# Build production bundle - explicitly with production mode
echo -e "${YELLOW}  Running: npm run build -- --mode production${NC}"
npm run build -- --mode production

# Vite outputs to dist-${VITE_MODE}, so copy dist-centralized to dist for S3 sync
if [ -d "dist-centralized" ]; then
  echo -e "${YELLOW}  Copying dist-centralized/ to dist/ for S3 sync...${NC}"
  cp -R dist-centralized dist
  echo -e "${GREEN}✅ Build output copied to dist/${NC}"
elif [ ! -d "dist" ]; then
  echo -e "${RED}❌ Error: Neither dist nor dist-centralized found after build${NC}"
  exit 1
fi

# Verify build output
if [ ! -d "dist" ]; then
  echo -e "${RED}❌ Error: Build failed - dist directory not created${NC}"
  exit 1
fi

BUILD_SIZE=$(du -sh dist | cut -f1)
FILE_COUNT=$(find dist -type f | wc -l)
echo -e "${GREEN}✅ Build successful!${NC}"
echo -e "${GREEN}   Files: $FILE_COUNT | Size: $BUILD_SIZE${NC}"

# Verify index.html exists
if [ ! -f "dist/index.html" ]; then
  echo -e "${RED}❌ Error: dist/index.html not found${NC}"
  exit 1
fi

# Verify config.js is correctly bundled
echo -e "${YELLOW}Step 2: Verifying production configuration in bundle...${NC}"
if grep -r "localhost:9000\|localhost:8001\|localhost:8002" dist/ > /dev/null 2>&1; then
  echo -e "${YELLOW}⚠️  Warning: Found localhost references in bundle!${NC}"
  echo -e "${YELLOW}   These are typically dev fallbacks embedded in config; verify production URLs below.${NC}"
  grep -r "localhost:" dist/ | head -5
fi

if grep -r "dev.nilbx.com/auth\|dev.nilbx.com/api" dist/ > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Production URLs found in bundle${NC}"
else
  echo -e "${YELLOW}⚠️  Warning: Production URLs not explicitly found (may be dynamically loaded)${NC}"
fi

# Step 3: Deploy to S3
echo -e "${YELLOW}Step 3: Deploying to S3 bucket: dev-nilbx-frontend...${NC}"

# Check AWS CLI is available
if ! command -v aws &> /dev/null; then
  echo -e "${RED}❌ Error: AWS CLI not found. Please install it first.${NC}"
  exit 1
fi

# Sync to S3
echo -e "${YELLOW}  Running: aws s3 sync dist/ s3://dev-nilbx-frontend/ --delete${NC}"
aws s3 sync dist/ s3://dev-nilbx-frontend/ --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "index.html" \
  --exclude ".env*" \
  --region us-east-1

# Upload index.html with shorter cache
aws s3 cp dist/index.html s3://dev-nilbx-frontend/index.html \
  --cache-control "public, max-age=3600" \
  --content-type "text/html; charset=utf-8" \
  --region us-east-1

echo -e "${GREEN}✅ Assets deployed to S3${NC}"

# Step 4: Create CloudFront cache invalidation
echo -e "${YELLOW}Step 4: Creating CloudFront cache invalidation...${NC}"

DISTRIBUTION_ID="E17DFALAGO7S8Z"
echo -e "${YELLOW}  Distribution ID: $DISTRIBUTION_ID${NC}"

# Create invalidation for all paths
INVALIDATION_ID=$(aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" \
  --region us-east-1 \
  --query 'Invalidation.Id' \
  --output text)

echo -e "${GREEN}✅ Cache invalidation created${NC}"
echo -e "${GREEN}   Invalidation ID: $INVALIDATION_ID${NC}"

# Wait for invalidation to complete (with timeout)
echo -e "${YELLOW}  Waiting for cache invalidation to complete...${NC}"
for i in {1..30}; do
  STATUS=$(aws cloudfront get-invalidation \
    --distribution-id "$DISTRIBUTION_ID" \
    --id "$INVALIDATION_ID" \
    --region us-east-1 \
    --query 'Invalidation.Status' \
    --output text)

  if [ "$STATUS" = "Completed" ]; then
    echo -e "${GREEN}✅ Cache invalidation completed${NC}"
    break
  fi

  echo -e "${YELLOW}  Status: $STATUS (waiting... $i/30)${NC}"
  sleep 2
done

# Step 5: Verify deployment
echo -e "${YELLOW}Step 5: Verifying deployment...${NC}"

echo -e "${YELLOW}  Checking S3 bucket contents...${NC}"
DEPLOYED_COUNT=$(aws s3 ls s3://dev-nilbx-frontend/ --recursive --region us-east-1 | wc -l)
echo -e "${GREEN}✅ Deployed files: $DEPLOYED_COUNT${NC}"

echo -e "${YELLOW}  Testing CloudFront URL: https://dev.nilbx.com${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://dev.nilbx.com/)
if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✅ Production URL responding (HTTP $HTTP_CODE)${NC}"
else
  echo -e "${RED}❌ Production URL not responding correctly (HTTP $HTTP_CODE)${NC}"
fi

# Step 6: Display summary
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ PRODUCTION DEPLOYMENT COMPLETE${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

echo -e "\n${BLUE}📊 Deployment Summary:${NC}"
echo -e "  ${GREEN}Build Status:${NC} ✅ Success ($FILE_COUNT files, $BUILD_SIZE)"
echo -e "  ${GREEN}S3 Deployment:${NC} ✅ Complete ($DEPLOYED_COUNT files)"
echo -e "  ${GREEN}CloudFront:${NC} ✅ Invalidated (ID: $INVALIDATION_ID)"
echo -e "  ${GREEN}Live URL:${NC} https://dev.nilbx.com"
echo -e "  ${GREEN}Config:${NC} Production (centralized mode)"

echo -e "\n${BLUE}🚀 Next Steps:${NC}"
echo -e "  1. Open https://dev.nilbx.com in browser"
echo -e "  2. Check browser console for config logs"
echo -e "  3. Should see: 'centralized mode' NOT 'per-service mode'"
echo -e "  4. API calls should go to https://dev.nilbx.com/auth (CloudFront → ALB)"
echo -e "  5. No CORS errors should appear (endpoints are https://, not http://localhost)"

echo -e "\n${BLUE}🔍 Verification Commands:${NC}"
echo -e "  ${YELLOW}curl -I https://dev.nilbx.com/{{NC}}"
echo -e "  ${YELLOW}aws cloudfront get-invalidation --distribution-id E17DFALAGO7S8Z --id $INVALIDATION_ID --region us-east-1${NC}"

echo -e "\n${GREEN}✅ All done!${NC}\n"
