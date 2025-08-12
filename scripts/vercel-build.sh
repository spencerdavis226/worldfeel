#!/bin/bash

echo "🔨 Building for Vercel deployment..."

# Ensure we're in the right directory
cd /vercel/path0

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build shared package first
echo "🔧 Building shared package..."
npm run build --workspace=packages/shared

# Build server
echo "🔧 Building server..."
npm run build --workspace=apps/server

# Build web app
echo "🔧 Building web app..."
npm run build --workspace=apps/web

echo "✅ Build complete!"
