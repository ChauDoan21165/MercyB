#!/bin/bash

echo "🔧 Setting up Room Management System..."

# Make pre-commit hook executable
chmod +x .husky/pre-commit
echo "✅ Pre-commit hook configured"

# Run initial registry generation
echo "🔄 Generating room registry..."
node scripts/generate-room-registry.js

echo "
✨ Room Management System Setup Complete!

📖 Documentation: See ROOM_MANAGEMENT.md for full guide

🚀 Quick Start:
  - Add room JSON files to: public/data/
  - File naming: {Room_Name}_{tier}.json
  - Commit changes: git add . && git commit -m 'Add new room'
  - Registry updates automatically via pre-commit hook

🛠️ Manual Commands:
  - Generate registry:    npm run registry:generate
  - Validate rooms:       npm run validate:rooms
  - Check missing audio:  npm run registry:missing-audio

📊 GitHub Actions:
  - Workflow: .github/workflows/validate-and-update-registry.yml
  - Auto-runs on push to main/develop
  - Validates JSON syntax and registry integrity
"
