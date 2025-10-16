#!/bin/bash

# Master Frontend Test Runner
# Runs all frontend tests in organized structure

set -e

echo "🧪 Running Complete Frontend Test Suite"
echo "======================================="

# Get script directory and frontend root
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$FRONTEND_DIR"

echo "📁 Frontend directory: $FRONTEND_DIR"
echo ""

# Component Tests
echo "🧩 Running Component Tests..."
echo "=============================="
npm run test:components -- --run
echo ""

# Utility Tests  
echo "🔧 Running Utility Tests..."
echo "============================"
npm run test:utils -- --run
echo ""

# Integration Tests
echo "🔗 Running Integration Tests..."
echo "==============================="
echo "1. Basic Frontend Integration..."
npm run test:integration
echo ""

echo "2. AWS Deployment Integration..."
npm run test:integration:aws
echo ""

echo "3. Landing Page Integration..."
npm run test:integration:landing
echo ""

# Role-Based Background System Test
echo "🎨 Running Role-Based Background Tests..."
echo "========================================="
npm run test:role-backgrounds
echo ""

# AWS Deployment Test
echo "☁️ Running AWS Deployment Tests..."
echo "=================================="
npm run test:aws-deployment
echo ""

echo "✅ All Frontend Tests Complete!"
echo ""
echo "📊 Test Summary:"
echo "=================="
echo "✅ Component Tests: Passed"
echo "✅ Utility Tests: Passed"  
echo "✅ Integration Tests: Passed"
echo "✅ Role-Based Backgrounds: Passed"
echo "✅ AWS Deployment: Passed"
echo ""
echo "🚀 Frontend ready for production!"