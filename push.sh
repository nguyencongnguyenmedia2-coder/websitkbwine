#!/bin/bash
echo "================================================="
echo "  KBWINE - Pushing changes to GitHub Repository  "
echo "================================================="
echo "Repository: https://github.com/nguyencongnguyenmedia2-coder/websitkbwine.git"
echo ""

git add .
git commit -m "Redesign product menu, fix layout bugs, and enrich wine details and specifications" 2>/dev/null || true
echo "Pushing main branch to GitHub..."
git push origin main

echo ""
echo "Done!"
