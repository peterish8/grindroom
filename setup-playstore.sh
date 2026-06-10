#!/bin/bash

# GrindRoom Play Store Setup Script
# Run this in your terminal to complete Play Store submission setup

echo "=========================================="
echo "  GrindRoom Play Store Setup"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Initialize EAS Project${NC}"
echo "This will create a project on Expo's servers..."
echo "Run: eas init"
echo ""

echo -e "${YELLOW}Step 2: Generate Android Keystore${NC}"
echo "This creates your app signing credentials (SAVE THESE!)..."
echo "Run: eas credentials --platform android"
echo ""
echo "When prompted:"
echo "  - Select 'Android'"
echo "  - Select 'production' build profile"
echo "  - Select 'Generate new keystore'"
echo "  - Save the keystore and credentials securely!"
echo ""

echo -e "${YELLOW}Step 3: Build Production AAB${NC}"
echo "Run: eas build --profile production --platform android"
echo ""

echo -e "${YELLOW}Optional: Build Preview APK for Testing${NC}"
echo "Run: eas build --profile preview --platform android"
echo ""

echo "=========================================="
echo "  After Build Completes:"
echo "=========================================="
echo "1. Download the .aab file from the build link"
echo "2. Go to https://play.google.com/console"
echo "3. Create new app → Upload AAB"
echo "4. Complete store listing (see PLAYSTORE_SUBMISSION.md)"
echo ""
echo -e "${GREEN}All configuration files are ready!${NC}"
