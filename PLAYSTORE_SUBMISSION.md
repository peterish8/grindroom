# GrindRoom - Play Store Submission Guide

## Prerequisites

1. **Expo Account** - Sign up at https://expo.dev
2. **Google Play Developer Account** - $25 one-time fee at https://play.google.com/console
3. **EAS CLI** - Already installed (eas-cli/18.0.1)

## Step 1: Configure EAS Project

Run this to link your project to EAS:

```bash
eas init
```

This will create a project on Expo's servers and update your app.json with the project ID.

## Step 2: Generate Android Signing Credentials

**IMPORTANT:** Run this interactively and save the credentials securely:

```bash
npx eas credentials --platform android
```

Select:
1. `grindingroom` project
2. Select "Android" platform
3. Select "production" build profile
4. Select "Generate new keystore" (if prompted)
5. **SAVE THE CREDENTIALS** - Download and store them safely (you cannot recover them!)

## Step 3: Build Production AAB

```bash
# Build for production
npm run build:production

# Or manually:
eas build --profile production --platform android
```

This will:
- Build an Android App Bundle (.aab)
- Sign it with your release keystore
- Upload to EAS servers
- Provide a download link

## Step 4: Upload to Google Play Console

1. Go to https://play.google.com/console
2. Create a new app
3. Fill in app details:
   - App name: GrindRoom
   - Default language: English
   - App category: Health & Fitness
   - Email address: your support email

### Required Assets

| Asset | Requirement | Status |
|-------|-------------|--------|
| App Icon (512x512 PNG) | ✅ | `assets/images/icon.png` |
| Feature Graphic (1024x500) | ❌ | Create one |
| Screenshots (Phone/Tablet) | ❌ | Take 3-5 screenshots |
| Short Description (80 chars) | ❌ | Write one |
| Full Description (4000 chars) | ❌ | Write one |
| Privacy Policy URL | ✅ | `PRIVACY_POLICY.md` (host on GitHub Pages) |

### Store Listing Suggestions

**Short Description:**
```
Join fitness accountability rooms. Track workouts, build streaks, compete together.
```

**Full Description:**
```
GrindRoom is a fitness accountability app that helps you stay consistent with your workouts through social motivation.

**Features:**
• Create or join workout rooms with friends
• Track your daily workouts and build streaks
• Compete on leaderboards
• Level up as you progress (Beginner → Pro)
• Dark, modern UI designed for focus

Whether you're just starting your fitness journey or you're a seasoned athlete, GrindRoom keeps you accountable and motivated.

Download now and start building your streak!
```

## Step 5: Content Rating & Compliance

1. **Content Rating Questionnaire** - Complete in Play Console
2. **Data Safety Form** - Declare what data you collect:
   - Email (account creation)
   - Phone number (account creation)
   - Fitness data (user-provided)
   - App interactions

3. **Privacy Policy** - Upload/host your privacy policy:
   - Option 1: Host on GitHub Pages (free)
   - Option 2: Use a free service like Termly or PrivacyPolicyGenerator

## Step 6: Release

1. Go to "Production" > "Create new release"
2. Upload your .aab file from Step 3
3. Review and roll out to production

## Maintenance

### Updating the App

1. Increment `versionCode` and `version` in `app.json`
2. Run: `npm run build:production`
3. Upload new .aab to Play Console
4. Create release and roll out

### Useful Commands

```bash
# Preview build (APK for testing)
npm run build:preview

# Production build (AAB for Play Store)
npm run build:production

# Submit to Play Store (if configured)
npm run submit
```

## Checklist Before Submission

- [ ] App builds successfully with `eas build --profile production`
- [ ] Tested on real Android device
- [ ] All features work (auth, rooms, workouts, leaderboard)
- [ ] Privacy policy hosted and linked
- [ ] Screenshots taken (various screen sizes)
- [ ] Feature graphic created
- [ ] App description written
- [ ] Content rating completed
- [ ] Data safety form filled

## Troubleshooting

**Build fails?**
- Check `eas.json` env vars are correct
- Run `eas credentials` to verify keystore
- Check logs: `eas build:logs`

**App crashes on launch?**
- Verify EXPO_PUBLIC_CONVEX_URL is set
- Check that Convex deployment is active
- Review Sentry/Logcat logs

**Need help?**
- Expo docs: https://docs.expo.dev/build/setup/
- Play Console help: https://support.google.com/googleplay/android-developer
