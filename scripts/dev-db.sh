#!/bin/bash

# Development Database Management Script
# This script is for development use only and should not be exposed to regular users

set -e

case "$1" in
  "clear")
    echo "⚠️  Clearing development database..."
    npm run db:clear --workspace=apps/server
    echo "✅ Database cleared"
    ;;
  "seed")
    echo "🌱 Seeding development database..."
    npm run db:seed --workspace=apps/server
    echo "✅ Database seeded"
    ;;
  "reset")
    echo "🔄 Resetting development database..."
    npm run db:clear --workspace=apps/server
    npm run db:seed --workspace=apps/server
    echo "✅ Database reset complete"
    ;;
  *)
    echo "Usage: ./scripts/dev-db.sh [clear|seed|reset]"
    echo ""
    echo "Commands:"
    echo "  clear  - Clear all data from development database"
    echo "  seed   - Seed development database with sample data"
    echo "  reset  - Clear and seed database (full reset)"
    echo ""
    echo "⚠️  This script is for development use only!"
    exit 1
    ;;
esac
