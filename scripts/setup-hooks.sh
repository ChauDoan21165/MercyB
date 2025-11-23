#!/bin/bash
# Setup git hooks for automatic room validation and registry generation

set -e  # Exit on error

echo "🔧 Setting up git hooks for Kids Rooms..."
echo ""

# Check if husky is installed
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npx not found. Please install Node.js first."
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not a git repository. Please run 'git init' first."
    exit 1
fi

# Initialize husky
echo "📦 Initializing Husky..."
npx husky init

# Ensure .husky directory exists
mkdir -p .husky

# Make pre-commit hook executable
chmod +x .husky/pre-commit

# Verify the hook is properly configured
if [ -f .husky/pre-commit ]; then
    echo "✅ Pre-commit hook installed successfully!"
else
    echo "❌ Error: Failed to create pre-commit hook"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Git Hooks Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🛡️  Pre-commit hook will now:"
echo "   • Validate kids room JSON files"
echo "   • Check for invalid filename characters"
echo "   • Auto-generate room registry"
echo "   • Block commits with validation errors"
echo ""
echo "📝 To manually validate rooms: npm run validate:rooms"
echo "🔄 To manually generate registry: npm run registry:generate"
echo ""
