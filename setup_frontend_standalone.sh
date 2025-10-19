#!/bin/bash

# Frontend Standalone Setup Script
# Sets up the frontend for independent development

set -e  # Exit on any error

echo "🖥️  Setting up Frontend in Standalone Mode"
echo "==========================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running from correct directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the frontend directory"
    exit 1
fi

print_status "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is required but not installed"
    exit 1
fi

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is required but not installed"
    exit 1
fi

print_success "Prerequisites check passed"

# Install dependencies
print_status "Installing dependencies..."
npm install
print_success "Dependencies installed"

# Set up standalone environment
print_status "Configuring standalone environment..."
cp .env.standalone .env
print_success "Environment configured for standalone mode"

# Verify environment configuration
print_status "Verifying configuration..."
if [ -f ".env" ]; then
    print_success "Environment file created"
    echo ""
    print_status "Current configuration:"
    grep -E "^VITE_" .env | head -10
else
    print_error "Failed to create environment file"
    exit 1
fi

# Build the application
print_status "Building application for standalone mode..."
npm run build:standalone
if [ $? -eq 0 ]; then
    print_success "Build completed successfully"
else
    print_warning "Build encountered issues, but continuing..."
fi

# Check if backend services are available
print_status "Checking backend service availability..."

# Check Auth Service
if curl -s http://localhost:9000/health &> /dev/null; then
    print_success "Auth Service (port 9000) is available"
else
    print_warning "Auth Service (port 9000) not available - start it with: cd ../auth-service && ./setup_auth_standalone.sh"
fi

# Check Company API
if curl -s http://localhost:8002/health &> /dev/null; then
    print_success "Company API (port 8002) is available"
else
    print_warning "Company API (port 8002) not available - start it with: cd ../company-api && ./setup_company_standalone.sh"
fi

# Create convenience scripts
print_status "Creating convenience scripts..."

cat > start_standalone.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Frontend in Standalone Mode..."
cp .env.standalone .env
npm run dev:standalone
EOF

cat > build_standalone.sh << 'EOF'
#!/bin/bash
echo "🏗️  Building Frontend for Standalone Mode..."
cp .env.standalone .env
npm run build:standalone
EOF

chmod +x start_standalone.sh build_standalone.sh

print_success "Convenience scripts created"

echo ""
print_success "🎉 Frontend Standalone Setup Complete!"
echo ""
echo "📋 What's configured:"
echo "  🌐 Mode: Standalone"
echo "  📡 API URL: http://localhost:8002"
echo "  🔐 Auth Service: http://localhost:9000"
echo "  🖥️  Dev Server Port: 5173"
echo ""
echo "🚀 Quick start:"
echo "  npm run dev:standalone        # Start development server"
echo "  ./start_standalone.sh         # Alternative start command"
echo "  npm run build:standalone      # Build for production"
echo ""
echo "📝 To switch modes later:"
echo "  ./setup_frontend_centralized.sh  # Switch to centralized mode"
echo ""
echo "🔧 Backend services needed:"
echo "  cd ../auth-service && ./setup_auth_standalone.sh"
echo "  cd ../company-api && ./setup_company_standalone.sh"
echo ""
echo "🌐 Development URL: http://localhost:5173"

# Create a simple alias script
cat > setup.sh << 'EOF'
#!/bin/bash
# Simple alias for standalone setup
./setup_frontend_standalone.sh "$@"
EOF
chmod +x setup.sh

print_success "Created setup.sh alias for easy access"