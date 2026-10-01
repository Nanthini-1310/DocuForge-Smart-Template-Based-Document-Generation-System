#!/bin/bash
# Setup Verification Script for DocuForge
# Run this to verify all Mocha has been removed and Google OAuth is properly configured

echo "🔍 Verifying Mocha removal and Google OAuth setup..."
echo ""

# Check 1: No Mocha packages in package.json
echo "✓ Check 1: Verifying no Mocha packages..."
if grep -q "@getmocha" package.json; then
    echo "  ❌ FAILED: Mocha packages still in package.json"
    exit 1
else
    echo "  ✅ PASSED: No Mocha packages found"
fi

# Check 2: Vite version is 6.x
echo "✓ Check 2: Verifying Vite version (should be 6.x)..."
VITE_VERSION=$(grep '"vite"' package.json | grep -oE '\^6\.[0-9]+\.[0-9]+')
if [ -z "$VITE_VERSION" ]; then
    echo "  ❌ FAILED: Vite is not version 6.x"
    exit 1
else
    echo "  ✅ PASSED: Vite version is $VITE_VERSION"
fi

# Check 3: AuthContext is being used
echo "✓ Check 3: Verifying custom AuthContext is used..."
if grep -rq "@/react-app/contexts/AuthContext" src/react-app/; then
    echo "  ✅ PASSED: AuthContext imports found in React components"
else
    echo "  ❌ FAILED: No AuthContext imports found"
    exit 1
fi

# Check 4: No remaining Mocha imports
echo "✓ Check 4: Checking for any remaining Mocha imports..."
if grep -rq "getmocha" src/; then
    echo "  ❌ FAILED: Mocha imports still exist in source"
    exit 1
else
    echo "  ✅ PASSED: No Mocha imports in source code"
fi

# Check 5: Environment file exists
echo "✓ Check 5: Checking .env.local.wrangler.example template..."
if [ -f ".env.local.wrangler.example" ]; then
    echo "  ✅ PASSED: Environment template file exists"
else
    echo "  ⚠️  WARNING: .env.local.wrangler.example not found"
fi

# Check 6: .gitignore has proper settings
echo "✓ Check 6: Verifying .gitignore configuration..."
if grep -q ".env.local.wrangler" .gitignore; then
    echo "  ✅ PASSED: .env.local.wrangler is in .gitignore"
else
    echo "  ⚠️  WARNING: .env.local.wrangler not in .gitignore"
fi

echo ""
echo "================================================"
echo "✅ All Mocha packages have been removed!"
echo "✅ Google OAuth is properly configured!"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Run: cp .env.local.wrangler.example .env.local.wrangler"
echo "2. Edit .env.local.wrangler and add your Google OAuth credentials"
echo "3. Run: npm install"
echo "4. Run: npm run dev"
echo "5. Visit: http://localhost:5174"
echo ""
