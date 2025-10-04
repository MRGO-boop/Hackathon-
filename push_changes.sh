#!/bin/bash

# Script to push all new frontend files to Git

echo "Adding all frontend files..."
git add frontend/

echo "Adding backend changes..."
git add backend/.env
git add backend/app/routers/auth.py
git add backend/create_initial_data.py

echo "Adding docker files..."
git add docker-compose.yml

echo "Checking status..."
git status

echo ""
echo "Ready to commit! Run:"
echo "git commit -m 'Add complete frontend application'"
echo "git push origin your-branch-name"
