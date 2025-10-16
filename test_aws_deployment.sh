#!/bin/bash

echo "🌩️  Frontend AWS Cloud Configuration Test"
echo "========================================="

# Test the cloud configuration
echo "📋 Running AWS cloud configuration test..."
node tests/test_frontend_aws.js

echo ""
echo "📦 Frontend Build Analysis"
echo "=========================="

# Check if dist directory exists
if [ -d "dist" ]; then
    echo "✅ Frontend build directory exists"
    echo "📁 Build contents:"
    ls -la dist/
    echo ""
    
    # Check build sizes
    echo "📊 Build file sizes:"
    du -h dist/*
    echo ""
    
    # Check if React app is built
    if [ -f "dist/index-react.html" ]; then
        echo "✅ React application build found"
    else
        echo "❌ React application build missing"
    fi
    
    # Check if static landing page is built
    if [ -f "dist/index.html" ]; then
        echo "✅ Static landing page build found"
    else
        echo "❌ Static landing page build missing"
    fi
    
else
    echo "❌ No build directory found. Run 'npm run build' first."
    exit 1
fi

echo ""
echo "🚀 AWS Deployment Guide"
echo "======================="

# Load Terraform outputs
if [ -f "../NILbx-env/outputs.json" ]; then
    echo "📋 Reading Terraform outputs..."
    S3_BUCKET=$(grep -o '"s3_bucket_name"[^}]*"value"[^"]*"[^"]*"' ../NILbx-env/outputs.json | sed 's/.*"value": "\([^"]*\)".*/\1/')
    CLOUDFRONT_DOMAIN=$(grep -o '"cloudfront_domain_name"[^}]*"value"[^"]*"[^"]*"' ../NILbx-env/outputs.json | sed 's/.*"value": "\([^"]*\)".*/\1/')
    FRONTEND_URL=$(grep -o '"frontend_url"[^}]*"value"[^"]*"[^"]*"' ../NILbx-env/outputs.json | sed 's/.*"value": "\([^"]*\)".*/\1/')
    API_URL=$(grep -o '"api_url"[^}]*"value"[^"]*"[^"]*"' ../NILbx-env/outputs.json | sed 's/.*"value": "\([^"]*\)".*/\1/')
    
    echo "   • S3 Bucket: $S3_BUCKET"
    echo "   • CloudFront: $CLOUDFRONT_DOMAIN"
    echo "   • Frontend URL: $FRONTEND_URL"
    echo "   • API URL: $API_URL"
    echo ""
    
    echo "📦 To deploy to AWS S3:"
    echo "1. Install AWS CLI: 'brew install awscli' (macOS) or 'pip install awscli'"
    echo "2. Configure AWS credentials: 'aws configure'"
    echo "3. Sync build to S3: 'aws s3 sync dist/ s3://$S3_BUCKET/'"
    echo "4. Invalidate CloudFront cache: 'aws cloudfront create-invalidation --distribution-id <DISTRIBUTION_ID> --paths \"/*\"'"
    echo ""
    
    echo "🔧 Environment Configuration:"
    echo "For production deployment, update these environment variables:"
    echo "   • REACT_APP_API_URL=https://$API_URL/"
    echo "   • AUTH_SERVICE_URL=<your-auth-service-url>/login"
    echo ""
    
else
    echo "❌ Terraform outputs not found. Run 'terraform apply' in NILbx-env/environments/dev first."
fi

echo "🧪 Testing Deployment Readiness"
echo "==============================="

# Check if required files exist for deployment
required_files=("dist/index.html" "dist/index-react.html")
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

# Test if builds contain proper assets
if grep -q "src/main.jsx" dist/index-react.html; then
    echo "✅ React app has proper entry point"
else
    echo "❌ React app missing entry point"
fi

# Check for JavaScript bundles
if ls dist/assets/*.js >/dev/null 2>&1; then
    echo "✅ JavaScript bundles found"
    echo "   Bundles: $(ls dist/assets/*.js)"
else
    echo "❌ No JavaScript bundles found"
fi

echo ""
echo "📝 Deployment Checklist"
echo "======================="
echo "☐ AWS CLI configured with proper credentials"
echo "☐ S3 bucket permissions set for static hosting"
echo "☐ CloudFront distribution configured"
echo "☐ Domain name (if any) pointed to CloudFront"
echo "☐ CORS configuration set on API endpoints"
echo "☐ Environment variables updated for production"
echo "☐ SSL certificates configured for HTTPS"
echo ""

echo "🎉 Frontend AWS cloud configuration test completed!"
echo "📖 See the deployment guide above for next steps."