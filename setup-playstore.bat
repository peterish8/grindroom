@echo off
chcp 65001 >nul
cls

echo ==========================================
echo   GrindRoom Play Store Setup
echo ==========================================
echo.

echo [Step 1] Initialize EAS Project
echo This will create a project on Expo's servers...
echo Command: eas init
echo.
echo Press any key to continue...
pause >nul

echo.
echo [Step 2] Generate Android Keystore
echo This creates your app signing credentials (SAVE THESE!)
echo Command: eas credentials --platform android
echo.
echo When prompted:
echo   - Select "Android"
echo   - Select "production" build profile
echo   - Select "Generate new keystore"
echo   - Save the keystore and credentials securely!
echo.
echo Press any key to continue...
pause >nul

echo.
echo [Step 3] Build Production AAB
echo Command: eas build --profile production --platform android
echo.
echo This will build an .aab file ready for Play Store upload.
echo.

echo ==========================================
echo   After Build Completes:
echo ==========================================
echo 1. Download the .aab file from the build link
echo 2. Go to https://play.google.com/console
echo 3. Create new app ^> Upload AAB
echo 4. Complete store listing (see PLAYSTORE_SUBMISSION.md)
echo.
echo All configuration files are ready!
echo.
pause
