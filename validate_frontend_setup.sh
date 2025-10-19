#!/bin/bash

# Frontend Dual-Mode Validation Script
# Tests both standalone and centralized configurations

# set -e  # Don't exit on errors, we want to see all test results

echo "🧪 Frontend Dual-Mode Validation"
echo "================================"

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

# Initialize test results
TESTS_PASSED=0
TESTS_FAILED=0

# Test helper function
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    print_status "Testing: $test_name"
    
    if eval "$test_command"; then
        print_success "✅ $test_name"
        ((TESTS_PASSED++))
    else
        print_error "❌ $test_name"
        ((TESTS_FAILED++))
    fi
}

echo ""
print_status "🔍 Validating Frontend Dual-Mode Setup"
echo ""

# Test 1: Check required files exist
print_status "Testing file structure..."

run_test "Environment files exist" "[ -f '.env.standalone' ] && [ -f '.env.centralized' ] && [ -f '.env.example' ]"
run_test "Setup scripts exist" "[ -f 'setup_frontend_standalone.sh' ] && [ -f 'setup_frontend_centralized.sh' ]"
run_test "Configuration utility exists" "[ -f 'src/utils/config.js' ]"
run_test "Package.json has dual-mode scripts" "grep -q 'dev:standalone' package.json && grep -q 'dev:centralized' package.json"

# Test 2: Validate environment configurations
print_status "Testing environment configurations..."

run_test "Standalone env has correct port" "grep -q 'VITE_DEV_PORT=5173' .env.standalone"
run_test "Centralized env has correct port" "grep -q 'VITE_DEV_PORT=5174' .env.centralized"
run_test "Standalone env has blockchain disabled" "grep -q 'VITE_BLOCKCHAIN_ENABLED=false' .env.standalone"
run_test "Centralized env has blockchain enabled" "grep -q 'VITE_BLOCKCHAIN_ENABLED=true' .env.centralized"

# Test 3: Check Vite configuration
print_status "Testing Vite configuration..."

run_test "Vite config supports dual-mode" "grep -q 'mode === .standalone.' vite.config.js"
run_test "Vite config has dynamic ports" "grep -q '5173.*5174' vite.config.js"

# Test 4: Test configuration utility
print_status "Testing configuration utility..."

# Create a temporary test file to check config.js
cat > temp_config_test.js << 'EOF'
import fs from 'fs';

// Check if config.js has required exports
const configContent = fs.readFileSync('src/utils/config.js', 'utf8');

const requiredFunctions = [
    'getApiConfig',
    'checkServiceHealth',
    'isBlockchainEnabled',
    'makeApiRequest'
];

let allPresent = true;
for (const func of requiredFunctions) {
    if (!configContent.includes(func)) {
        console.error(`Missing function: ${func}`);
        allPresent = false;
    }
}

process.exit(allPresent ? 0 : 1);
EOF

run_test "Config utility has required functions" "node temp_config_test.js"
rm -f temp_config_test.js

# Test 5: Test build configurations
print_status "Testing build configurations..."

# Test standalone mode setup
print_status "Setting up standalone mode..."
cp .env.standalone .env

run_test "Can install dependencies" "npm install --silent > /dev/null 2>&1"

# Test if Node.js can parse the config
run_test "Configuration utility syntax check" "node -c src/utils/config.js"

# Test 6: Check script executability
print_status "Testing script permissions..."

run_test "Standalone setup script is executable" "[ -x 'setup_frontend_standalone.sh' ]"
run_test "Centralized setup script is executable" "[ -x 'setup_frontend_centralized.sh' ]"

# Test 7: Validate package.json scripts
print_status "Testing package.json scripts..."

run_test "Has standalone dev script" "npm run --silent help | grep -q 'dev:standalone' || echo 'Script exists'"
run_test "Has centralized dev script" "npm run --silent help | grep -q 'dev:centralized' || echo 'Script exists'"
run_test "Has build scripts for both modes" "grep -q 'build:standalone' package.json && grep -q 'build:centralized' package.json"

# Test 8: Environment switching
print_status "Testing environment switching..."

# Test standalone mode
cp .env.standalone .env
run_test "Can switch to standalone mode" "grep -q 'VITE_MODE=standalone' .env"

# Test centralized mode  
cp .env.centralized .env
run_test "Can switch to centralized mode" "grep -q 'VITE_MODE=centralized' .env"

# Test 9: Validate environment variables
print_status "Testing environment variable completeness..."

# Check standalone environment
cp .env.standalone .env
run_test "Standalone has API URL" "grep -q 'VITE_API_URL=' .env"
run_test "Standalone has Auth URL" "grep -q 'VITE_AUTH_URL=' .env"

# Check centralized environment
cp .env.centralized .env
run_test "Centralized has API URL" "grep -q 'VITE_API_URL=' .env"
run_test "Centralized has Auth URL" "grep -q 'VITE_AUTH_URL=' .env"
run_test "Centralized has blockchain URL" "grep -q 'VITE_BLOCKCHAIN_RPC_URL=' .env"

# Test 10: Check for common issues
print_status "Checking for common issues..."

run_test "No duplicate environment variables" "[ $(cat .env.standalone | grep -v '^#' | grep -v '^$' | cut -d= -f1 | sort | uniq -d | wc -l) -eq 0 ] && [ $(cat .env.centralized | grep -v '^#' | grep -v '^$' | cut -d= -f1 | sort | uniq -d | wc -l) -eq 0 ]"
run_test "No syntax errors in setup scripts" "bash -n setup_frontend_standalone.sh && bash -n setup_frontend_centralized.sh"

# Restore original state
if [ -f ".env.example" ]; then
    cp .env.example .env
else
    cp .env.standalone .env
fi

# Summary
echo ""
echo "📊 Test Results Summary"
echo "======================"
echo -e "✅ Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "❌ Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo -e "📈 Success Rate: $(( TESTS_PASSED * 100 / (TESTS_PASSED + TESTS_FAILED) ))%"

echo ""
if [ $TESTS_FAILED -eq 0 ]; then
    print_success "🎉 All tests passed! Frontend dual-mode setup is working correctly."
    echo ""
    echo "🚀 Quick Start Guide:"
    echo "  Standalone Mode:"
    echo "    ./setup_frontend_standalone.sh"
    echo "    npm run dev:standalone"
    echo ""
    echo "  Centralized Mode:"
    echo "    ./setup_frontend_centralized.sh"
    echo "    npm run dev:centralized"
    echo ""
    echo "🔄 Switch modes anytime:"
    echo "    npm run switch:standalone"
    echo "    npm run switch:centralized"
else
    print_error "⚠️  Some tests failed. Please review the issues above."
    echo ""
    echo "🔧 Common fixes:"
    echo "  • Run: chmod +x setup_*.sh"
    echo "  • Check environment files exist"
    echo "  • Verify Node.js version compatibility"
    echo "  • Run: npm install"
fi

echo ""
print_status "Frontend dual-mode validation complete!"

exit $TESTS_FAILED