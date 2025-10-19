#!/bin/bash

# Frontend Centralized Setup Script
# Sets up the frontend for centralized development with blockchain integration

set -e  # Exit on any error

echo "🌐 Setting up Frontend in Centralized Mode"
echo "=========================================="

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

# Install blockchain-specific dependencies if not already present
print_status "Installing blockchain dependencies..."
npm install web3 ethers wagmi @rainbow-me/rainbowkit --save-dev
print_success "Blockchain dependencies installed"

# Set up centralized environment
print_status "Configuring centralized environment..."
cp .env.centralized .env
print_success "Environment configured for centralized mode"

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

# Check for blockchain project directory
print_status "Checking blockchain integration..."
if [ -d "../blockchain" ]; then
    print_success "Blockchain directory found"
    
    # Check if blockchain contracts are built
    if [ -d "../blockchain/contracts" ]; then
        print_success "Blockchain contracts directory found"
    else
        print_warning "Blockchain contracts not found - blockchain features may be limited"
    fi
else
    print_warning "Blockchain directory not found - blockchain features will be disabled"
fi

# Check for nilbx-db
print_status "Checking database integration..."
if [ -d "../nilbx-db" ]; then
    print_success "NILbx database directory found"
else
    print_warning "NILbx database directory not found"
fi

# Build the application
print_status "Building application for centralized mode..."
npm run build:centralized
if [ $? -eq 0 ]; then
    print_success "Build completed successfully"
else
    print_warning "Build encountered issues, but continuing..."
fi

# Check service availability
print_status "Checking service availability..."

# Check Auth Service
if curl -s http://localhost:9001/health &> /dev/null; then
    print_success "Auth Service (centralized port 9001) is available"
else
    print_warning "Auth Service (centralized port 9001) not available"
fi

# Check Company API
if curl -s http://localhost:8003/health &> /dev/null; then
    print_success "Company API (centralized port 8003) is available"
else
    print_warning "Company API (centralized port 8003) not available"
fi

# Check Blockchain Service
if curl -s http://localhost:8545 &> /dev/null; then
    print_success "Blockchain node (port 8545) is available"
else
    print_warning "Blockchain node (port 8545) not available - blockchain features may not work"
fi

# Check NILbx Database
if curl -s http://localhost:3306 &> /dev/null; then
    print_success "NILbx Database (port 3306) is available"
else
    print_warning "NILbx Database (port 3306) not available"
fi

# Create convenience scripts
print_status "Creating convenience scripts..."

cat > start_centralized.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Frontend in Centralized Mode..."
cp .env.centralized .env
npm run dev:centralized
EOF

cat > build_centralized.sh << 'EOF'
#!/bin/bash
echo "🏗️  Building Frontend for Centralized Mode..."
cp .env.centralized .env
npm run build:centralized
EOF

cat > start_with_blockchain.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Frontend with Full Blockchain Integration..."
cp .env.centralized .env
echo "🔗 Starting blockchain node..."
# Add blockchain startup commands here if needed
npm run dev:centralized
EOF

chmod +x start_centralized.sh build_centralized.sh start_with_blockchain.sh

print_success "Convenience scripts created"

# Create blockchain integration health check
cat > check_blockchain.sh << 'EOF'
#!/bin/bash
echo "🔗 Checking Blockchain Integration..."

# Check if Web3 is available
if curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":1}' http://localhost:8545 &> /dev/null; then
    echo "✅ Blockchain node is responding"
else
    echo "❌ Blockchain node not available"
fi

# Check contracts directory
if [ -d "../blockchain/contracts" ]; then
    echo "✅ Smart contracts directory found"
    contract_count=$(find ../blockchain/contracts -name "*.sol" | wc -l)
    echo "📄 Found $contract_count Solidity contracts"
else
    echo "❌ Smart contracts not found"
fi

# Check if contracts are compiled
if [ -d "../blockchain/build" ] || [ -d "../blockchain/artifacts" ]; then
    echo "✅ Compiled contracts found"
else
    echo "⚠️  Contracts may need compilation"
fi
EOF

chmod +x check_blockchain.sh

echo ""
print_success "🎉 Frontend Centralized Setup Complete!"
echo ""
echo "📋 What's configured:"
echo "  🌐 Mode: Centralized"
echo "  📡 API URL: http://localhost:8003"
echo "  🔐 Auth Service: http://localhost:9001"
echo "  🔗 Blockchain: http://localhost:8545"
echo "  🗄️  Database: localhost:3306"
echo "  🖥️  Dev Server Port: 5174"
echo ""
echo "🚀 Quick start:"
echo "  npm run dev:centralized        # Start development server"
echo "  ./start_centralized.sh         # Alternative start command"
echo "  ./start_with_blockchain.sh     # Start with blockchain"
echo "  npm run build:centralized      # Build for production"
echo ""
echo "🔧 Check integrations:"
echo "  ./check_blockchain.sh          # Check blockchain status"
echo ""
echo "📝 To switch modes later:"
echo "  ./setup_frontend_standalone.sh  # Switch to standalone mode"
echo ""
echo "🔧 Backend services needed:"
echo "  cd ../auth-service && ./setup_auth_centralized.sh"
echo "  cd ../company-api && ./setup_company_centralized.sh"
echo "  cd ../blockchain && npm run start"
echo "  cd ../nilbx-db && docker-compose up -d"
echo ""
echo "🌐 Development URL: http://localhost:5174"
echo ""
echo "🎯 Blockchain features enabled:"
echo "  • Web3 wallet integration"
echo "  • Smart contract interaction"
echo "  • NFT marketplace functionality"
echo "  • DeFi integration"
echo "  • Analytics and monitoring"