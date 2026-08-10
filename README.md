# 🚌 Laal Paari Radio

> *Window seat. Old songs. Long route.*

A nostalgic, immersive web radio experience set inside a red Maharashtra ST (State Transport) bus. Ride from **Pune to Satara** through six stops and seven decades of Bollywood music — each stop tunes the radio to its era.

---

## ✨ Features

- 🎵 **Era-locked radio** — Each bus stop corresponds to a Bollywood decade (1950s–2010s). The radio changes as you travel.
- 🚌 **Live journey simulation** — Animated route board showing your current stop and next destination.
- 🎧 **Spotify integration** — Connect your Spotify Premium account for full playback control, or use the built-in embed player without Premium.
- 📻 **Shayari ticker** — Scrolling Urdu/Hindi poetry lines in the footer, like a real bus radio.
- 🌅 **Cinematic hero** — Full-viewport illustration of a young man at a bus window at golden hour.
- 👥 **Live traveller count** — See how many people are riding the bus with you in real time (via Supabase Realtime).

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) (React + SSR) |
| Routing | [TanStack Router](https://tanstack.com/router) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Build | [Vite](https://vitejs.dev/) |
| Backend / Realtime | [Supabase](https://supabase.com/) |
| Music | [Spotify Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk) + Spotify Embed |
| Icons | [Lucide React](https://lucide.dev/) |
| Language | TypeScript |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- A [Spotify Developer App](https://developer.spotify.com/dashboard) (for music playback)
- A [Supabase](https://supabase.com/) project (for realtime traveller count)

### 1. Clone the repository

```bash
git clone https://github.com/AmanMishra107/bus-seat-radio.git
cd bus-seat-radio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env` and fill in your credentials:

```bash
cp .env .env.local
```

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key

# Spotify OAuth (server-side)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:8080/callback
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 📁 Project Structure

```
bus-seat-radio/
├── public/
│   ├── favicon.svg          # Bus + music note favicon
│   └── hero-bus.jpg         # Hero background image
├── src/
│   ├── components/
│   │   ├── bus/             # Core app components (TopBar, SpotifyPlayer, RouteBoard, etc.)
│   │   └── ui/              # Generic shadcn/ui primitives
│   ├── data/
│   │   ├── decades.ts       # Decade → playlist/track mapping
│   │   └── journey.ts       # Bus stops with coordinates and metadata
│   ├── hooks/
│   │   ├── useJourney.ts    # Bus travel state machine
│   │   └── useLiveViewers.ts# Supabase Realtime presence hook
│   ├── integrations/
│   │   └── supabase/        # Supabase client + auth middleware
│   ├── lib/
│   │   ├── spotify/         # Spotify SDK + embed hooks
│   │   ├── playlist.functions.ts
│   │   └── error-reporting.ts
│   ├── routes/
│   │   ├── __root.tsx       # Root layout, fonts, meta
│   │   ├── index.tsx        # Main app page
│   │   └── callback.tsx     # Spotify OAuth callback
│   └── styles.css           # Global CSS + design tokens
├── supabase/                # Supabase migrations & config
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 🎶 How It Works

1. **The Journey** — The app simulates a bus journey from Pune → Satara with 6 stops: Pune, Katraj, Shirwal, Wai, Koregaon, Satara.
2. **Decade Radio** — Each stop is assigned a Bollywood decade. When the bus arrives, the radio switches to that era's Spotify playlist.
3. **Spotify Embed** — Without Premium, tracks play via Spotify's iframe embed. With Premium, full SDK control is available.
4. **Realtime Presence** — Supabase Realtime tracks concurrent visitors and shows a live "X travelling" count.

---

## 🧑‍💻 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server at `localhost:8080` |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

---

## 🌐 Deployment

This project uses TanStack Start with SSR. It can be deployed to any Node.js-compatible host:

- **Vercel** — Works out of the box with `npm run build`
- **Railway / Render / Fly.io** — Use the `npm run build && npm run preview` or a custom `node` server start
- **Cloudflare Workers** — Supported via Nitro (configured in vite.config.ts)

Set your environment variables in the platform dashboard before deploying.

---

## 📄 License

MIT — feel free to use, modify, and share.

---

<p align="center">Made with ❤️ and nostalgia for the red Laal Paari bus</p>
