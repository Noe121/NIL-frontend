#!/bin/zsh
# Start FastAPI backend in the background
cd ../api-service/src && uvicorn main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!
cd ../../frontend

# Wait for backend to start
sleep 3

# Run integration test
node test_landingpage_integration.js

# Kill backend
kill $BACKEND_PID
