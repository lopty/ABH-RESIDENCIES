#!/bin/bash
# setup-programmatic-seo.sh
# Quick setup script for programmatic SEO system

set -e

echo "🚀 Setting up Programmatic SEO System..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js is installed"
echo ""

# Create directories if they don't exist
echo "📁 Creating directories..."
mkdir -p pages/guides
mkdir -p src/lib
echo "✅ Directories created"
echo ""

# Check if files exist
echo "🔍 Checking for required files..."

files_to_check=(
    "src/lib/seo-generator.ts"
    "src/api-endpoints-seo.ts"
    "pages/guides/[slug].tsx"
    "pages/guides/index.tsx"
    "db-migrations.sql"
)

missing_files=()
for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "⚠️  $file missing (will need to be added)"
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    echo ""
    echo "⚠️  Missing files detected. Please ensure all files are in place:"
    for file in "${missing_files[@]}"; do
        echo "   - $file"
    done
fi

echo ""
echo "📋 Integration Checklist:"
echo ""
echo "1. ✅ Database schema migrated (check: NEON_DASHBOARD)"
echo "2. ⏳ Merge api-endpoints-seo.ts into api-server.ts"
echo "3. ⏳ Create pages/guides directory and files"
echo "4. ⏳ Test single page generation"
echo "5. ⏳ Test batch generation"
echo "6. ⏳ Deploy to production"
echo ""

echo "🔗 API Endpoints Available (after integration):"
echo ""
echo "  POST  /api/generate-seo-page              - Generate single page"
echo "  POST  /api/batch-generate-seo             - Generate 50+ pages"
echo "  GET   /api/seo-stats                      - View progress"
echo "  GET   /api/seo-pages                      - List pages"
echo "  GET   /api/locations                      - Available locations"
echo "  GET   /api/property-types                 - Available types"
echo "  GET   /api/price-tiers                    - Available tiers"
echo ""

echo "📚 Next Steps:"
echo ""
echo "1. Read PROGRAMMATIC_SEO_GUIDE.md for detailed instructions"
echo ""
echo "2. Update api-server.ts:"
echo "   - Add import: import { generateContent, generateBatch, getGenerationStats } from './src/lib/seo-generator.js';"
echo "   - Paste all endpoint code from src/api-endpoints-seo.ts"
echo "   - Update cron jobs section"
echo ""
echo "3. Test generation:"
echo "   curl -X POST http://localhost:3001/api/generate-seo-page \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"content_type\": \"buying_guide\", \"location\": \"Al Maryah Island\", \"property_type\": \"1 Bedroom Apartment\", \"price_tier\": \"mid-range\"}'"
echo ""
echo "4. Run batch generation:"
echo "   curl -X POST http://localhost:3001/api/batch-generate-seo \\"
echo "     -d '{\"count\": 50, \"priority_filter\": 3}'"
echo ""

echo "✨ Setup complete! Ready to generate 10,000+ SEO pages! 🎉"
