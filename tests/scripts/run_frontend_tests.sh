#!/bin/bash

echo "🚀 Starting Frontend Testing Suite"
echo "=================================="

# Check if required services are running
echo "📋 Checking backend services..."

# Check auth service
if curl -s http://localhost:9000/docs > /dev/null 2>&1; then
    echo "✅ Auth service is running on port 9000"
else
    echo "❌ Auth service is not running on port 9000"
    echo "Please start: cd auth-service && uvicorn src.main:app --host 0.0.0.0 --port 9000"
fi

# Check API service  
if curl -s http://localhost:8001/athletes > /dev/null 2>&1; then
    echo "✅ API service is running on port 8001"
else
    echo "❌ API service is not running on port 8001"
    echo "Please start: cd api-service && uvicorn src.main:app --host 0.0.0.0 --port 8001"
fi

# Check frontend dev server
if curl -s http://localhost:5173/ > /dev/null 2>&1; then
    echo "✅ Frontend dev server is running on port 5173"
else
    echo "❌ Frontend dev server is not running on port 5173"
    echo "Please start: cd frontend && npm run dev"
fi

echo ""
echo "🧪 Running automated tests..."
echo "-----------------------------"

# Run the basic frontend test
echo "Running basic integration test..."
node tests/integration/test_frontend_basic.js

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 All automated tests passed!"
    echo ""
    echo "💻 Frontend Application URLs:"
    echo "   • Frontend App: http://localhost:5173/"
    echo "   • Auth Service: http://localhost:9000/docs"
    echo "   • API Service:  http://localhost:8001/docs"
    echo ""
    echo "🔍 Manual Testing Steps:"
    echo "1. Open http://localhost:5173/ in your browser"
    echo "2. Try to register a new user"
    echo "3. Login with your credentials"
    echo "4. Navigate through the application"
    echo "5. Test the different user roles (athlete, sponsor, fan)"
    echo ""
    echo "✅ Frontend testing completed successfully!"
else
    echo "❌ Some tests failed. Please check the output above."
    exit 1
fi