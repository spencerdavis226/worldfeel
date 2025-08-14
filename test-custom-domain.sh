#!/bin/bash

# Test script for custom domain availability
# Usage: ./test-custom-domain.sh

echo "🔍 Testing custom domain: api.worldfeel.org"
echo "=========================================="
echo ""

# Test DNS resolution
echo "1. Testing DNS resolution..."
if nslookup api.worldfeel.org > /dev/null 2>&1; then
    echo "✅ DNS resolution working"
else
    echo "❌ DNS resolution failed"
    exit 1
fi

# Test HTTPS connection
echo ""
echo "2. Testing HTTPS connection..."
HTTPS_RESPONSE=$(curl -s -w "%{http_code}" "https://api.worldfeel.org/api/health" -o /dev/null 2>/dev/null)
if [[ $HTTPS_RESPONSE == "200" ]]; then
    echo "✅ HTTPS working (Status: $HTTPS_RESPONSE)"
    echo "🎉 Your custom domain is ready!"

    # Test the actual API response
    echo ""
    echo "3. Testing API response..."
    API_RESPONSE=$(curl -s "https://api.worldfeel.org/api/health")
    echo "Response: $API_RESPONSE"

    echo ""
    echo "✅ SUCCESS! Your custom domain is working correctly."
    echo "You can now update your Vercel environment variable to:"
    echo "VITE_API_BASE=https://api.worldfeel.org"

elif [[ $HTTPS_RESPONSE == "000" ]]; then
    echo "⏳ SSL certificate still provisioning..."
    echo "This can take 5-15 minutes. Please wait and try again."
elif [[ $HTTPS_RESPONSE == "301" || $HTTPS_RESPONSE == "302" ]]; then
    echo "🔄 Redirect detected (Status: $HTTPS_RESPONSE)"
    echo "Domain is resolving but may need more time for SSL."
else
    echo "❌ HTTPS failed (Status: $HTTPS_RESPONSE)"
    echo "Please check your Render.com custom domain configuration."
fi

echo ""
echo "💡 Tip: Run this script again in a few minutes to check progress."
