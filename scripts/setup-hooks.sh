#!/bin/bash
# Setup git hooks for automatic room registry generation

echo "🔧 Setting up git hooks..."

# Initialize husky
npx husky init

# Make pre-commit executable
chmod +x .husky/pre-commit

echo "✅ Git hooks configured successfully!"
echo "📝 Room registry will auto-generate on commit when public/data/*.json files change"
