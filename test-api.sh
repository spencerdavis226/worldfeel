#!/bin/bash

# Test script for WorldFeel API
# Usage: ./test-api.sh [API_BASE_URL]
# Example: ./test-api.sh https://worldfeel-api.onrender.com

API_BASE=${1:-"http://localhost:8080"}

echo "🧪 Testing WorldFeel API at: $API_BASE"
echo "======================================"
echo ""

# Test health endpoint
echo "1. Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s "$API_BASE/api/health")
if [[ $? -eq 0 ]]; then
    echo "✅ Health check passed"
    echo "Response: $HEALTH_RESPONSE"
else
    echo "❌ Health check failed"
fi
echo ""

# Test public emotion endpoint
echo "2. Testing public emotion endpoint..."
EMOTION_RESPONSE=$(curl -s "$API_BASE/api/public/emotion-of-the-day")
if [[ $? -eq 0 ]]; then
    echo "✅ Public emotion endpoint working"
    echo "Response: $EMOTION_RESPONSE"
else
    echo "❌ Public emotion endpoint failed"
fi
echo ""

# Test stats endpoint
echo "3. Testing stats endpoint..."
STATS_RESPONSE=$(curl -s "$API_BASE/api/stats")
if [[ $? -eq 0 ]]; then
    echo "✅ Stats endpoint working"
    echo "Response: $STATS_RESPONSE"
else
    echo "❌ Stats endpoint failed"
fi
echo ""

echo "🎉 API testing complete!"
echo ""
echo "If all tests passed, your API is working correctly."
echo "Next step: Update your frontend's VITE_API_BASE environment variable in Vercel."
