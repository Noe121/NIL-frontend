#!/bin/bash

# Frontend Deployment Script for AWS S3 + CloudFront
# Uploads the built React frontend to S3 and invalidates CloudFront cache

set -e

echo "🚀 NILBx Frontend Deployment to AWS"
echo "===================================="
echo ""

# Configuration
S3_BUCKET="dev-nilbx-frontend"
CLOUDFRONT_DISTRIBUTION_ID="E18NL7CLGKEJC5"
AWS_REGION="us-east-1"
BUILD_DIR="dist-per-service"

# Check if build directory exists
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Build directory '$BUILD_DIR' not found!"
    echo "   Run 'npm run build:production' first to build the frontend."
    exit 1
fi

echo "✅ Build directory found: $BUILD_DIR"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found!"
    echo "   Install it with: brew install awscli (macOS) or pip install awscli"
    exit 1
fi

echo "✅ AWS CLI found"
echo ""

# Check AWS credentials
echo "🔐 Checking AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured!"
    echo "   Run: aws configure"
    exit 1
fi

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)
echo "✅ AWS Account: $AWS_ACCOUNT_ID"
echo ""

# Show build contents
echo "📦 Build Contents:"
ls -lh "$BUILD_DIR/"
echo ""

# Confirm deployment
echo "📋 Deployment Configuration:"
echo "   • Source: $BUILD_DIR/"
echo "   • S3 Bucket: s3://$S3_BUCKET/"
echo "   • CloudFront: $CLOUDFRONT_DISTRIBUTION_ID"
echo "   • Region: $AWS_REGION"
echo ""

read -p "🤔 Proceed with deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

# Upload to S3
echo ""
echo "📤 Uploading files to S3..."
aws s3 sync "$BUILD_DIR/" "s3://$S3_BUCKET/" \
    --region "$AWS_REGION" \
    --delete \
    --cache-control "public, max-age=31536000" \
    --exclude "*.html" \
    --exclude "*.json"

# Upload HTML files with no-cache
echo "📤 Uploading HTML files (no-cache)..."
aws s3 sync "$BUILD_DIR/" "s3://$S3_BUCKET/" \
    --region "$AWS_REGION" \
    --cache-control "no-cache, no-store, must-revalidate" \
    --content-type "text/html" \
    --exclude "*" \
    --include "*.html"

# Upload JSON files
echo "📤 Uploading JSON files..."
aws s3 sync "$BUILD_DIR/" "s3://$S3_BUCKET/" \
    --region "$AWS_REGION" \
    --cache-control "no-cache, no-store, must-revalidate" \
    --content-type "application/json" \
    --exclude "*" \
    --include "*.json"

echo "✅ Upload complete!"
echo ""

# Invalidate CloudFront cache
echo "🔄 Invalidating CloudFront cache..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text)

echo "✅ CloudFront invalidation created: $INVALIDATION_ID"
echo ""

# Wait for invalidation to complete (optional)
read -p "⏳ Wait for invalidation to complete? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "⏳ Waiting for invalidation to complete..."
    aws cloudfront wait invalidation-completed \
        --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
        --id "$INVALIDATION_ID"
    echo "✅ Invalidation complete!"
fi

echo ""
echo "🎉 Deployment Complete!"
echo "======================="
echo ""
echo "🌐 Frontend URLs:"
echo "   • CloudFront: https://d3fhn2ke26twrq.cloudfront.net"
echo "   • Custom Domain: https://dev.nilbx.com"
echo ""
echo "📊 Deployment Summary:"
echo "   • S3 Bucket: s3://$S3_BUCKET/"
echo "   • Files Uploaded: $(find $BUILD_DIR -type f | wc -l | tr -d ' ') files"
echo "   • Invalidation ID: $INVALIDATION_ID"
echo ""
echo "💡 Tips:"
echo "   • CloudFront cache invalidation may take 5-15 minutes"
echo "   • Check deployment: curl -I https://dev.nilbx.com"
echo "   • View logs: aws cloudfront get-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --id $INVALIDATION_ID"
echo ""
