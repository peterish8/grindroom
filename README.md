<p align="center">
  <img src="assets/readme/banner.svg" alt="GrindRoom — fitness accountability app" width="100%"/>
</p>

<p align="center">
  A dark-mode fitness accountability app built with <strong>React Native</strong>, <strong>Expo</strong>, and <strong>Convex</strong>.
</p>

<p align="center">
  <!-- Dynamic shields -->
  <img src="https://img.shields.io/badge/Expo-54-000000?style=for-the-badge&logo=expo&logoColor=white&labelColor=1a1a1a" alt="Expo 54"/>
  <img src="https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=black&labelColor=0e0e0e" alt="React Native"/>
  <img src="https://img.shields.io/badge/Convex-Realtime-FF6B6B?style=for-the-badge&logo=firebase&logoColor=white&labelColor=1a1a1a" alt="Convex"/>
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white&labelColor=0e0e0e" alt="TypeScript"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20Web-C8F135?style=flat-square&labelColor=141414&color=0e0e0e" alt="Platforms"/>
  <img src="https://img.shields.io/badge/Theme-Dark_Mode-0e0e0e?style=flat-square&labelColor=C8F135&color=ffffff" alt="Dark mode"/>
  <img src="https://img.shields.io/badge/License-Private-red?style=flat-square&labelColor=1a1a1a" alt="License"/>
  <img src="https://img.shields.io/badge/Status-v1.0.0-C8F135?style=flat-square&labelColor=141414&color=0e0e0e" alt="Version"/>
</p>

---

## ✦ What is GrindRoom?

GrindRoom is a **fitness accountability app** where athletes log bodyweight workouts, earn points, maintain streaks, and compete in private **Rooms** (squads) with live monthly leaderboards.

<p align="center">
  <img src="assets/readme/features.svg" alt="GrindRoom features" width="100%"/>
</p>

<table>
  <tr>
    <td width="50%" valign="top">

### 💪 Daily Workout Logger
- **10 workout presets** — push-ups, squats, planks, burpees & more
- **3 difficulty levels** — beginner, medium, advanced
- **Point system** — 10 / 20 / 30 pts per log
- **5-workout daily goal** with celebration animation

    </td>
    <td width="50%" valign="top">

### 🔥 Streaks & Points
- Streak increments when you log consecutive days
- Monthly points reset on the 1st (UTC cron)
- Historical snapshots with room rank preserved
- Animated counters & progress arcs on Home

    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">

### 🏆 Squad Rooms
- Create or join rooms via **6-char invite codes**
- Live leaderboard sorted by `monthlyPoints → streak`
- Today's activity feed — see who logged in
- Up to **20 members** per room

    </td>
    <td width="50%" valign="top">

### ⚡ Realtime Everything
- Convex subscriptions — no manual refresh
- Google OAuth + email/password auth
- Rate-limited mutations for abuse protection
- Secure token storage via `expo-secure-store`

    </td>
  </tr>
</table>

---

## ✦ App Flow

```mermaid
flowchart LR
    classDef accent fill:#C8F135,stroke:#0e0e0e,color:#0e0e0e,font-weight:bold
    classDef dark fill:#141414,stroke:#2A2A2A,color:#ffffff
    classDef muted fill:#1A1A1A,stroke:#333,color:#888

    A["🚀 Splash / Auth"]:::dark --> B["🏠 Home"]:::accent
    B --> C["📝 Log Workout"]:::dark
    B --> D["🏆 Rooms"]:::dark
    D --> E["👥 Room Detail"]:::accent
    B --> F["👤 Profile"]:::dark

    C -->|"logWorkout()"| G[("Convex DB")]:::muted
    E -->|"live query"| G
    G -->|"reactive push"| B
    G -->|"reactive push"| E
```

---

## ✦ Tech Stack

<table>
  <thead>
    <tr>
      <th>Layer</th>
      <th>Technology</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>📱 Mobile</td><td>React Native + Expo 54</td><td>Cross-platform app shell</td></tr>
    <tr><td>🧭 Navigation</td><td>Expo Router 6</td><td>File-based routing</td></tr>
    <tr><td>🗄️ Backend</td><td>Convex</td><td>Realtime DB, auth, crons</td></tr>
    <tr><td>🔐 Auth</td><td>@convex-dev/auth</td><td>Google OAuth + password</td></tr>
    <tr><td>🎨 Styling</td><td>NativeWind 4 + Tailwind</td><td>Utility-first classes</td></tr>
    <tr><td>✨ Motion</td><td>Reanimated 4</td><td>Spring animations & gestures</td></tr>
    <tr><td>🧠 UI State</td><td>Zustand</td><td>Local UI state only</td></tr>
    <tr><td>🔤 Icons</td><td>Lucide React Native</td><td>Consistent iconography</td></tr>
  </tbody>
</table>

### Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `background` | `#0e0e0e` | App shell |
| `surface` | `#141414` | Cards |
| `accent` | `#C8F135` | Lime highlights |
| `danger` | `#FF6B51` | Destructive actions |
| `heading` | Oswald | Display text |
| `body` | Inter | UI copy |

---

## ✦ Project Structure

```
grindroom/
├── app/                    # Expo Router screens
│   ├── (auth)/             # Splash, login, signup
│   ├── (tabs)/             # Home, Rooms, Log, Profile
│   ├── room/[id]/          # Room detail + leaderboard
│   ├── create-room/        # Room creation flow
│   └── settings.tsx
├── components/
│   ├── animations/         # FadeIn, ScalePress, Skeleton, etc.
│   ├── GrindUI.tsx         # Shared design primitives
│   └── WorkoutCard.tsx
├── convex/                 # Backend
│   ├── schema.ts           # profiles, rooms, workoutLogs…
│   ├── workoutLogs.ts      # Logging + streak logic
│   ├── rooms.ts            # CRUD + join/leave
│   ├── leaderboard.ts      # Rankings + activity
│   ├── snapshots.ts        # Monthly freeze cron
│   └── lib/                # auth, rateLimit, validation
├── constants/              # workouts, theme
├── store/                  # Zustand UI store
└── assets/readme/            # README SVG assets
```

---

## ✦ Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** or **pnpm**
- [Expo Go](https://expo.dev/go) (mobile testing) or Android/iOS simulator
- A [Convex](https://convex.dev) project

### 1 · Clone & install

```bash
git clone https://github.com/peterish8/grindroom.git
cd grindroom
npm install
```

### 2 · Environment variables

Create `.env.local` in the project root:

```env
EXPO_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### 3 · Run Convex backend

```bash
npx convex dev
```

### 4 · Start the app

```bash
npm start
```

Then press `a` for Android, `i` for iOS, or `w` for web.

### Build commands

| Command | Description |
|---------|-------------|
| `npm run android` | Run on Android device/emulator |
| `npm run ios` | Run on iOS simulator |
| `npm run web` | Start web dev server |
| `npm run build:preview` | EAS preview build (Android) |
| `npm run build:production` | EAS production build (Android) |
| `npm run submit` | Submit to Play Store |

---

## ✦ Scoring Rules

<p align="center">
  <img src="assets/readme/scoring.svg" alt="Scoring tiers: 10, 20, 30 points" width="720"/>
</p>

**Leaderboard sort:** `monthlyPoints` ↓ then `currentStreak` ↓  
**Monthly reset:** 00:00 UTC on the 1st — scores frozen into `monthlySnapshots`

---

## ✦ Convex Schema (at a glance)

```mermaid
erDiagram
    profiles ||--o{ workoutLogs : logs
    profiles ||--o{ roomMembers : joins
    rooms ||--o{ roomMembers : has
    profiles ||--o{ monthlySnapshots : earns

    profiles {
        string displayName
        number currentStreak
        number monthlyPoints
        string lastLogDate
    }
    rooms {
        string name
        string inviteCode
        number memberCount
    }
    workoutLogs {
        string workoutKey
        string level
        number points
        string logDate
    }
```

---

## ✦ Contributing

This is a private project. If you have access:

1. Branch from `main`
2. Keep commits focused
3. Run `npx convex dev` alongside `npm start` when touching backend code
4. Open a PR with a clear description

---

## ✦ Related Docs

- [`PRIVACY_POLICY.md`](./PRIVACY_POLICY.md) — data handling
- [`PLAYSTORE_SUBMISSION.md`](./PLAYSTORE_SUBMISSION.md) — Android release checklist
- [`CLAUDE.md`](./CLAUDE.md) — Convex AI agent guidelines

---

<p align="center">
  <img src="assets/readme/footer.svg" alt="GrindRoom footer" width="600"/>
</p>

<p align="center">
  <sub>© 2026 GrindRoom · <code>com.pratscodes8.grindroom</code></sub>
</p>