#!/bin/bash

# Frontend Role-Based Background Testing Script
# This script validates the role-based theming system implementation

set -e

echo "🎨 Testing Role-Based Background System"
echo "========================================"

# Change to frontend directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$FRONTEND_DIR"

echo ""
echo "📁 Current directory: $(pwd)"

# Check if required files exist
echo ""
echo "🔍 Checking required files..."

FILES_TO_CHECK=(
    "src/LandingPage.jsx"
    "src/contexts/UserContext.jsx"
    "src/components/RoleDemo.jsx"
    "package.json"
)

for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ Found: $file"
    else
        echo "❌ Missing: $file"
        exit 1
    fi
done

# Check UserContext integration
echo ""
echo "🔗 Verifying UserContext integration..."
if grep -q "import { useUser }" src/LandingPage.jsx; then
    echo "✅ UserContext import found in LandingPage.jsx"
else
    echo "❌ UserContext import missing in LandingPage.jsx"
    exit 1
fi

# Check role-based functions
echo ""
echo "⚙️ Verifying role-based functions..."
if grep -q "getRoleBasedBackground" src/LandingPage.jsx; then
    echo "✅ getRoleBasedBackground function found"
else
    echo "❌ getRoleBasedBackground function missing"
    exit 1
fi

if grep -q "getRoleBasedContentStyle" src/LandingPage.jsx; then
    echo "✅ getRoleBasedContentStyle function found"
else
    echo "❌ getRoleBasedContentStyle function missing"
    exit 1
fi

# Check RoleDemo component integration
echo ""
echo "🧪 Verifying RoleDemo component..."
if grep -q "RoleDemo" src/LandingPage.jsx; then
    echo "✅ RoleDemo component imported and used"
else
    echo "❌ RoleDemo component not integrated"
    exit 1
fi

# Check CSS implementation
echo ""
echo "🎨 Verifying CSS styling..."
STYLE_CHECKS=(
    "linear-gradient"
    "backdrop-filter"
    "text-shadow"
    "rgba"
    "@media"
)

for style in "${STYLE_CHECKS[@]}"; do
    if grep -q "$style" src/LandingPage.jsx; then
        echo "✅ $style implementation found"
    else
        echo "⚠️  $style not found (may be optional)"
    fi
done

# Check role-specific gradients
echo ""
echo "🌈 Verifying role-specific gradients..."
ROLE_GRADIENTS=(
    "#ff6f61"  # Athlete coral
    "#6b48ff"  # Athlete purple
    "#2c3e50"  # Sponsor slate
    "#3498db"  # Sponsor blue
    "#ff9a9e"  # Fan pink
    "#fad0c4"  # Fan peach
)

for gradient in "${ROLE_GRADIENTS[@]}"; do
    if grep -q "$gradient" src/LandingPage.jsx; then
        echo "✅ Gradient color $gradient found"
    else
        echo "❌ Gradient color $gradient missing"
    fi
done

# Install dependencies if needed
echo ""
echo "📦 Checking and installing dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Build test (syntax check)
echo ""
echo "🔧 Testing build (syntax validation)..."
if npm run build --silent > /dev/null 2>&1; then
    echo "✅ Build successful - no syntax errors"
else
    echo "❌ Build failed - checking for errors..."
    npm run build
    exit 1
fi

# Development server test
echo ""
echo "🚀 Starting development server for manual testing..."
echo ""
echo "🎯 Testing Instructions:"
echo "1. Open browser to http://localhost:5173"
echo "2. Look for the '🎨 Role Demo' button in the top-right corner"
echo "3. Click it to expand the demo panel"
echo "4. Test each role (Athlete, Sponsor, Fan) and observe background changes:"
echo "   - 🏃 Athlete: Vibrant coral-to-purple gradient"
echo "   - 💼 Sponsor: Professional slate-to-blue gradient"
echo "   - 💖 Fan: Warm pink-to-peach gradient"
echo "5. Test logout to return to default background"
echo "6. Verify responsive design on mobile devices"
echo ""
echo "⚠️  Press Ctrl+C to stop the server when testing is complete"
echo ""

# Start the development server
npm run dev

echo ""
echo "✅ Testing complete!"
echo ""
echo "📋 Implementation Status:"
echo "========================"
echo "✅ Step 1: Design goals defined (vibrant/sophisticated/warm themes)"
echo "✅ Step 2: Gradient styles selected with role-specific rationale"
echo "✅ Step 3: CSS updated with role-specific backgrounds and dynamic switching"
echo "🔄 Step 4: Overlay system implemented (in progress)"
echo "🔄 Step 5: Testing and validation (manual testing required)"
echo "⏳ Step 6: Deployment and feedback (pending)"
echo ""
echo "🚀 Next Steps:"
echo "- Complete manual testing with role switching"
echo "- Validate accessibility compliance"
echo "- Test mobile responsiveness"
echo "- Deploy to staging environment"
echo "- Gather user feedback on role-based theming"