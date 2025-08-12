#!/bin/bash

echo "🚀 WorldFeel Deployment Script"
echo "=============================="
echo ""

# Check if git is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Git working directory is not clean. Please commit or stash your changes first."
    exit 1
fi

# Check if we're on main branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "⚠️  You're not on the main branch. Current branch: $current_branch"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "✅ Pre-deployment checks passed"
echo ""

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful"
echo ""

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

if [ $? -ne 0 ]; then
    echo "❌ Failed to push to GitHub. Please check your git configuration."
    exit 1
fi

echo "✅ Code pushed to GitHub"
echo ""

echo "🎉 Deployment initiated!"
echo ""
echo "Next steps:"
echo "1. Vercel will automatically deploy from GitHub"
echo "2. Check your Vercel dashboard for deployment status"
echo "3. Configure environment variables in Vercel:"
echo "   - MONGODB_URI"
echo "   - WEB_ORIGIN=https://worldfeel.org"
echo "   - DAY_SALT_SECRET"
echo "4. Add your custom domain in Vercel settings"
echo "5. Update DNS records in GoDaddy"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
