---
name: AI Music Teacher v2
overview: "Revised architecture for the AI Music Teacher web app: Next.js 16 with optimized App Router (parallel, intercepting, dynamic routes), Tailwind CSS v4 with hand-built components, Biome.js for linting/formatting, Neon Postgres via Drizzle ORM (@vercel/postgres driver) for user progress/history/piece tracking, Neon Auth for authentication, Ollama for AI feedback, and a 3D avatar. Sheet music rendered via OSMD from bundled MusicXML files."
todos:
  - id: phase1-foundation
    content: "Phase 1: Next.js scaffold, Tailwind/Biome setup, App Router structure, Neon/Drizzle schema, Neon Auth, core layout + common components, DB seed"
    status: completed
  - id: phase2-sheet-library
    content: "Phase 2: OSMD integration, MusicXML parser, piece library with genre filter, piece detail page, intercepting route modal, DB wiring"
    status: completed
  - id: phase3-audio-practice
    content: "Phase 3: Mic capture (Web Audio API), WASM pitch detection (Rust/wasm-pack, YIN algorithm), note detector, comparison engine, practice page, save sessions + progress to DB"
    status: completed
  - id: phase4-avatar-feedback
    content: "Phase 4: React Three Fiber scene, universal 3D model upload (any GLB), transform-based reaction system, live note feedback via avatar, Ollama AI feedback, feedback panel"
    status: completed
  - id: phase5-dashboard-history
    content: "Phase 5: Dashboard parallel routes (@history, @progress), history feed, progress cards, full history page with pagination"
    status: pending
  - id: phase6-polish-ship
    content: "Phase 6: Landing page, dark/light theme, responsive design, README, GitHub Actions CI, seed script"
    status: pending
isProject: false
---

# AI Music Teacher - Revised Architecture Plan (v2)

## Tech Stack (Revised)

- **Framework**: Next.js 16, App Router, TypeScript, React 19
- **Styling**: Tailwind CSS v4 (hand-built components, no UI library)
- **Linter/Formatter**: Biome.js 2
- **ORM**: Drizzle ORM + `@vercel/postgres` driver
- **Database**: Neon Postgres (hosted on Vercel)
- **Auth**: Neon Auth (Vercel integration, cookie-based sessions)
- **Sheet Music**: OpenSheetMusicDisplay (OSMD) rendering MusicXML
- **Audio**: Web Audio API + WASM (Rust/wasm-pack, YIN algorithm) for low-latency pitch detection
- **3D Avatar**: React Three Fiber + Drei + Mixamo animations
- **AI Feedback**: Ollama (local) via API route
- **State**: Zustand (client-side session state only; persistent data goes to DB)

---

## App Router Structure (Optimized)

```
src/app/
├── layout.tsx                              # Root layout (fonts, global providers)
├── page.tsx                                # Public landing page
├── globals.css                             # Global styles, Tailwind directives, CSS variables
│
├── (auth)/                                 # Route group: auth pages (minimal layout)
│   ├── layout.tsx                          # Centered card layout, no sidebar
│   ├── login/
│   │   └── page.tsx                        # Redirects to /auth/sign-in
│   ├── signup/
│   │   └── page.tsx                        # Redirects to /auth/sign-up
│   ├── auth/[pathname]/
│   │   └── page.tsx                        # Neon Auth UI wrapper
│   └── account/[pathname]/
│       └── page.tsx                        # Account management
│
├── (app)/                                  # Route group: authenticated app
│   ├── layout.tsx                          # App shell (sidebar nav, header, auth guard)
│   │
│   ├── dashboard/
│   │   ├── page.tsx                        # Dashboard overview
│   │   ├── @history/
│   │   │   └── default.tsx                 # Parallel route: recent activity feed
│   │   └── @progress/
│   │       └── default.tsx                 # Parallel route: progress summary cards
│   │
│   ├── library/
│   │   ├── page.tsx                        # Browse all pieces (grid/list)
│   │   ├── loading.tsx                     # Skeleton loader
│   │   ├── [genre]/
│   │   │   └── page.tsx                    # Dynamic: filter by genre
│   │   └── @modal/
│   │       ├── default.tsx                 # Empty default (no modal open)
│   │       └── (..)piece/[pieceId]/
│   │           └── page.tsx                # Intercepting route: piece preview modal
│   │
│   ├── piece/
│   │   └── [pieceId]/
│   │       ├── page.tsx                    # Full piece detail (direct URL)
│   │       ├── loading.tsx                 # Piece loading skeleton
│   │       └── practice/
│   │           └── page.tsx                # Practice session (sheet music + audio + avatar)
│   │
│   ├── history/
│   │   ├── page.tsx                        # Full history log (paginated)
│   │   └── loading.tsx
│   │
│   ├── settings/
│   │   └── page.tsx                        # User settings (theme, instrument prefs)
│   │
│   └── manage/
│       └── page.tsx                        # Admin piece management
│
├── (cms)/                                  # Route group: public CMS pages
│   ├── layout.tsx                          # Public nav wrapper
│   └── [...slug]/
│       └── page.tsx                        # Dynamic CMS pages
│
└── api/
    ├── auth/[...path]/
    │   └── route.ts                        # Neon Auth catch-all (GET/POST/PUT/DELETE/PATCH)
    ├── feedback/
    │   └── route.ts                        # POST: Ollama feedback proxy
    └── progress/
        └── route.ts                        # GET/POST: user progress
```

**App Router features used:**

- **Route groups** `(auth)` / `(app)` -- separate layouts for auth vs main app without affecting URL
- **Parallel routes** `@history` / `@progress` -- dashboard loads history feed and progress cards independently and in parallel, each with its own loading/error states
- **Intercepting routes** `(..)piece/[pieceId]` -- clicking a piece in the library opens a preview modal (intercepted); refreshing or navigating directly to `/piece/[pieceId]` renders the full page
- **Dynamic routes** `[genre]`, `[pieceId]` -- standard dynamic segments
- **Loading boundaries** -- per-route `loading.tsx` skeletons for streaming SSR

---

## Database Schema (Neon Postgres via Drizzle)

```mermaid
erDiagram
    users ||--o{ practice_sessions : has
    users ||--o{ user_piece_progress : tracks
    users ||--o{ activity_log : generates
    pieces ||--o{ practice_sessions : practiced_in
    pieces ||--o{ user_piece_progress : tracked_for
    pieces }o--o{ piece_collections : belongs_to
    piece_collections ||--o{ collection_pieces : contains
    pieces ||--o{ activity_log : referenced_in

    users {
        uuid id PK
        text email UK
        text name
        text image
        timestamp created_at
        timestamp updated_at
    }

    pieces {
        uuid id PK
        text title
        text composer
        text difficulty
        text genre
        text style
        text instrument_id
        text musicxml_path
        int tempo
        int measure_count
        timestamp created_at
    }

    piece_collections {
        uuid id PK
        text name
        text description
        text difficulty
        text genre
        int sort_order
        timestamp created_at
    }

    collection_pieces {
        uuid collection_id FK
        uuid piece_id FK
        int sort_order
    }

    practice_sessions {
        uuid id PK
        uuid user_id FK
        uuid piece_id FK
        timestamp started_at
        timestamp ended_at
        real overall_score
        real pitch_accuracy
        real rhythm_accuracy
        text ai_feedback
        jsonb detected_notes
    }

    user_piece_progress {
        uuid user_id FK
        uuid piece_id FK
        real best_score
        real avg_score
        int total_sessions
        text mastery_level
        timestamp last_practiced
    }

    activity_log {
        uuid id PK
        uuid user_id FK
        text activity_type
        uuid piece_id FK
        jsonb metadata
        timestamp created_at
    }
```



**Key design decisions:**

- `user_piece_progress` is a materialized view of progress per piece -- updated after each practice session via a DB trigger or app-level logic. Enables fast dashboard queries.
- `piece_collections` groups pieces (e.g., "Beginner Classical", "Spanish Guitar Essentials") for displaying grouped progress.
- `mastery_level` is computed from scores: `learning` (0-3 sessions), `practicing` (avg < 70%), `comfortable` (avg 70-89%), `mastered` (avg 90%+).
- `activity_log` powers the history feed. Types: `practice_started`, `practice_completed`, `piece_unlocked`, `milestone_reached`.
- Schema supports future gamification (add XP, streaks, achievements tables later).

---

## Sheet Music Strategy

**MVP approach: Bundled MusicXML files rendered by OSMD**

1. Source 5-8 beginner classical guitar pieces from public domain (IMSLP) or create them in [MuseScore](https://musescore.org) (free, exports MusicXML)
2. Store `.musicxml` files in `public/pieces/` (served as static files) and seed piece metadata to Neon DB
3. OSMD renders them in the browser with full notation, key signatures, time signatures
4. During practice: OSMD API highlights the current measure
5. After analysis: overlay correct (green) / incorrect (red) notes on the score

**Starter pieces (single-note melodies for reliable pitch detection):**

- Ode to Joy (Beethoven) -- beginner, classical
- Romanza / Spanish Romance (Anonymous) -- beginner, classical
- Greensleeves (Traditional English) -- beginner, folk
- Malagueña (Traditional Spanish) -- beginner, latin
- Lágrima (Tárrega) -- intermediate, classical
- Estudio in A minor (Tárrega) -- intermediate, classical
- Adelita (Tárrega) -- intermediate, classical

**Future CMS feature (noted, not built in MVP):**
A content management interface where you can upload MusicXML, PDF, or audio files, tag them with metadata (difficulty, genre, instrument), and have them appear in the library. Could also support community uploads. This would replace the bundled file approach.

---

## Project File Structure (Revised)

```
music-teacher/
├── biome.json                              # Biome config (linting + formatting)
├── tailwind.config.ts                      # Tailwind config (theme, plugins)
├── drizzle.config.ts                       # Drizzle ORM config
├── next.config.ts
├── package.json
├── tsconfig.json
│
├── drizzle/                                # DB migrations (auto-generated)
│   └── 0000_initial.sql
│
├── public/
│   ├── models/                             # 3D character .glb files
│   └── animations/                         # Mixamo animation .glb clips
│
├── src/
│   ├── app/                                # (see App Router section above)
│   │
│   ├── _components/                        # All hand-built, no UI library
│   │   ├── common/                         # Button, Input, Card, Modal, Badge, etc.
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ...
│   │   ├── library/
│   │   │   ├── PieceCard.tsx
│   │   │   └── GenreFilter.tsx
│   │   ├── sheet-music/
│   │   │   ├── SheetMusicViewer.tsx
│   │   │   └── NoteOverlay.tsx
│   │   ├── audio/
│   │   │   ├── AudioControls/
│   │   │   ├── AudioVisualizer/
│   │   │   └── TuningHelper/
│   │   ├── avatar/
│   │   │   ├── AvatarScene/
│   │   │   └── AvatarController/
│   │   ├── feedback/
│   │   │   ├── FeedbackPanel/
│   │   │   └── ScoreBreakdown/
│   │   ├── dashboard/
│   │   │   ├── HistoryFeed/
│   │   │   └── ProgressCard/
│   │   └── layout/
│   │       ├── Sidebar/
│   │       ├── Header/
│   │       └── AppShell/
│   │
│   ├── _lib/
│   │   ├── audio/
│   │   │   ├── capture.ts                  # Mic → MediaStream → AudioWorklet
│   │   │   ├── pitch-detector.ts           # WASM pitch detector wrapper (YIN algorithm)
│   │   │   ├── note-detector.ts            # Onset/offset detection
│   │   │   └── analyzer.ts                 # Score computation
│   │   ├── music/
│   │   │   ├── theory.ts                   # Note math, frequencies, intervals
│   │   │   ├── instruments.ts              # Instrument registry configs
│   │   │   ├── musicxml-parser.ts          # Extract expected notes from MusicXML
│   │   │   └── comparison.ts               # Detected vs expected comparison
│   │   ├── ai/
│   │   │   ├── ollama-client.ts            # HTTP client for Ollama
│   │   │   └── prompts.ts                  # System prompts for music teacher persona
│   │   ├── three/
│   │   │   ├── animations.ts               # Load/manage animation clips
│   │   │   └── gesture-map.ts              # Score ranges → animation names
│   │   └── db/
│   │       ├── schema.ts                   # Drizzle schema definitions
│   │       ├── client.ts                   # Neon connection + drizzle instance
│   │       ├── queries/
│   │       │   ├── pieces.ts               # Piece CRUD queries
│   │       │   ├── progress.ts             # Progress read/update queries
│   │       │   ├── sessions.ts             # Practice session queries
│   │       │   └── activity.ts             # Activity log queries
│   │       └── seed.ts                     # Seed pieces + collections
│   │
│   ├── _stores/
│   │   ├── session-store.ts                # Live practice session state (Zustand)
│   │   └── settings-store.ts               # User prefs (instrument, theme)
│   │
│   ├── _types/
│   │   ├── music.ts                        # Instrument, Piece, Collection
│   │   ├── audio.ts                        # DetectedNote, PitchDetectionConfig
│   │   └── feedback.ts                     # AccuracyReport, FeedbackResponse
│   │
│   ├── _interfaces/                        # Shared interfaces (API contracts)
│   │   └── index.ts
│   │
│   ├── _utils/                             # Pure helper functions
│   │   └── index.ts
│   │
│   ├── _constants/                         # App constants, config values
│   │   └── index.ts
│   │
│   ├── _hooks/                             # React hooks
│   │   ├── use-sidebar.tsx
│   │   ├── use-media-query.ts
│   │   └── use-microphone.ts               # Mic capture lifecycle (start/stop/state)
│   │
│   └── _data/
│       └── instruments/                    # Instrument configs
│           └── acoustic-guitar.ts          # Guitar config
│
├── public/
│   └── pieces/                             # Static MusicXML files (served at /pieces/*)
│       ├── ode-to-joy.musicxml
│       ├── romanza.musicxml
│       ├── greensleeves.musicxml
│       ├── lagrima.musicxml
│       ├── estudio-am.musicxml
│       ├── malaguena.musicxml
│       └── adelita.musicxml
│
└── README.md
```

---

## Auth Flow

```mermaid
sequenceDiagram
    participant User
    participant App as Next.js App
    participant NeonAuth as Neon Auth
    participant Neon as Neon Postgres

    User->>App: Click "Sign in"
    App->>NeonAuth: Redirect to Neon Auth UI
    NeonAuth->>User: Sign-in/sign-up form
    User->>NeonAuth: Submit credentials
    NeonAuth->>Neon: Upsert user
    NeonAuth->>App: Set session cookie
    App->>User: Redirect to /dashboard
```



Neon Auth (via Vercel integration) handles user authentication with cookie-based sessions. The `@neondatabase/neon-js` client provides server-side session access via `auth.getSession()`. Routes under `(app)/` are protected by the layout-level auth guard.

---

## History Log Feature

The history log is powered by the `activity_log` table and surfaced in two places:

1. **Dashboard parallel route** (`@history/default.tsx`) -- shows the 5 most recent activities as a compact feed
2. **Dedicated history page** (`/history`) -- full paginated log with filters

Activity types logged:

- `practice_completed` -- "Practiced Ode to Joy - Score: 82%"
- `new_best_score` -- "New personal best on Romanza! 91%"
- `piece_started` -- "Started learning Lagrima"
- `mastery_reached` -- "Mastered Ode to Joy"

Each activity row stores a `metadata` JSONB field for flexible data (scores, durations, etc.) so we can enrich the display without schema changes.

---

## Build Phases (Revised)

### Phase 1: Foundation (COMPLETED)

- Initialize Next.js 16 with TypeScript, Tailwind CSS v4, Biome.js 2
- Set up the full App Router structure (route groups, parallel routes, layouts)
- Configure Neon + Drizzle ORM (`@vercel/postgres` driver), define schema
- Set up Neon Auth with cookie-based sessions
- Build core layout components: `AppShell`, `Sidebar`, `Header`, `MobileBottomNav`, `Footer` (Tailwind)
- Build common components: `Button`, `Card`, `Input`, `Modal`, `Badge`, `Accordion`, `Separator`, `ScrollWindow`
- Implement login flow and layout-level auth guard
- Landing page with hero section and feature highlights
- Dark/light theme system with cookie persistence

### Phase 2: Sheet Music + Library (COMPLETED)

- Integrated OSMD (`opensheetmusicdisplay@1.9.7`), built `SheetMusicViewer` component with dynamic import, loading/error states, and retry
- Built MusicXML parser to extract expected note sequences (pitch, octave, beat position, duration)
- Created 7 beginner/intermediate classical guitar MusicXML files in `public/pieces/`
- Built library page with `GenreFilter` (pill tabs) and `PieceCard` grid
- Built `[genre]` dynamic route page with filtered pieces from DB
- Built piece detail page with OSMD sheet music preview, metadata cards, and practice link
- Implemented intercepting route modal (`@modal/(..)piece/[pieceId]`) with `ModalOverlay` (backdrop dismiss, ESC key, close button)
- Wired up piece queries (`getAllPieces`, `getPieceById`, `getPiecesByGenre`, `getAvailableGenres`)
- Built seed script (`bun run seed`) to populate pieces and collections

### Phase 3: Audio Pipeline + Practice

- ~~Implement mic capture with Web Audio API (AudioContext → AnalyserNode pipeline, `useMicrophone` hook)~~ ✅
- ~~Build WASM pitch detector (Rust/wasm-pack YIN algorithm, JS fallback, `PitchDetector` class, `usePitchDetection` hook, live `PitchDisplay` tuning meter)~~ ✅
- ~~Build note onset/offset detector (`NoteDetector` state machine, `useNoteDetection` hook, note log UI)~~ ✅
- ~~Build performance comparison engine (detected vs expected)~~ ✅
- ~~Create the practice session page with `AudioControls` and live visualizer~~ ✅
- ~~Save practice sessions to DB~~ ✅
- ~~Update `user_piece_progress` after each session~~ ✅

### Phase 4: 3D Avatar + Feedback (COMPLETED)

- ~~Set up React Three Fiber scene (Canvas, lighting, environment, OrbitControls)~~ ✅
- ~~Universal 3D model support — users upload any `.glb` model (shark, Roblox character, etc.) as their avatar teacher~~ ✅
- ~~Default procedural avatar (capsule body + eyes) for users without a custom model~~ ✅
- ~~Transform-based reaction system (bounce, wobble, glow, scale pulse, spin) — works with ANY model, no skeleton required~~ ✅
- ~~Live note-by-note avatar reactions: good_note (green glow + bounce), bad_note (red flash + wobble), great_streak (gold glow + spin), celebrating (big bounce + particles)~~ ✅
- ~~Reaction particle effects (instanced mesh sparkles for good/great/celebrating moods)~~ ✅
- ~~Model upload via `.glb` file input, persisted to IndexedDB + localStorage~~ ✅
- ~~AvatarController bridges live note detection → mood → avatar transforms~~ ✅
- ~~Integrate Ollama for AI text feedback with graceful fallback when Ollama is not running~~ ✅
- ~~Build enhanced `FeedbackPanel` with suggestions, encouragement, and focus areas~~ ✅
- ~~`/api/feedback` route proxies to Ollama, returns structured JSON feedback~~ ✅
- ~~Score-based fallback feedback when Ollama is unavailable~~ ✅

### Phase 5: Dashboard + History

- Build dashboard with parallel routes (`@history`, `@progress`)
- Implement `HistoryFeed` component reading from `activity_log`
- Implement `ProgressCard` components showing per-piece and per-collection progress
- Build full history page with pagination and filters
- Log all activity types from practice sessions

### Phase 6: Polish + Ship

- Landing page with hero, feature highlights, architecture overview
- Dark/light theme via Tailwind's `dark:` variant + CSS custom properties
- Responsive layout for the non-practice pages
- Comprehensive README: setup guide, architecture diagram, screenshots/GIF, tech decisions
- GitHub Actions CI: Biome check + TypeScript type-check + build
- DB seed script for easy onboarding

---

## WASM Pitch Detection Architecture

```
Audio Pipeline (mic capture → pitch detection):

  Microphone
      │
      ▼
  getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } })
      │
      ▼
  AudioContext (44100 Hz)
      │
      ▼
  MediaStreamSourceNode
      │
      ▼
  AnalyserNode (fftSize: 2048)
      │
      ▼
  getFloatTimeDomainData() → Float32Array (called per animation frame)
      │
      ▼
  WASM Pitch Detector (Rust, YIN algorithm)
      │
      ▼
  { frequency: f32, clarity: f32 }
      │
      ▼
  frequencyToNote() → { name, octave, cents }
      │
      ▼
  Note Onset/Offset Detector → DetectedNote[]
```

**Why WASM over a JS pitch detection library (e.g. Pitchy)?**

- **Lower latency**: YIN algorithm in Rust/WASM runs 3-5x faster than equivalent JS, critical for real-time feedback
- **Deterministic performance**: No GC pauses during pitch analysis; consistent frame timing
- **Future-proof**: AudioWorklet + WASM enables off-main-thread processing (Phase 3 optimization)
- **Precision**: Rust's f32/f64 math compiles to native WASM float ops without JS number coercion edge cases

**WASM module interface** (Rust → wasm-bindgen exports):

```rust
#[wasm_bindgen]
pub fn detect_pitch(samples: &[f32], sample_rate: f32, threshold: f32) -> JsValue
// Returns { frequency: f32, clarity: f32 } or null if no pitch detected
```

**Build pipeline**: `wasm-pack build --target bundler` → generates ES module imported by `pitch-detector.ts`

---

## Ollama Live Feedback Architecture

### Overview

Ollama provides two modes of AI feedback during practice:

1. **Live micro-feedback** (streaming, during practice) — short 1-sentence messages displayed in a Twitch chat-style overlay below the avatar
2. **Post-session summary** (non-streaming, after practice) — structured JSON feedback in the `FeedbackPanel`

### Ollama Configuration

- **Default URL**: `http://localhost:11434` (override via `OLLAMA_URL` env var)
- **Model**: `llama3.2` (local, ~2GB download on first use)
- **Health check**: `GET /api/tags` with 3s timeout before any generation request
- **Fallback**: When Ollama is unavailable, both modes return pre-written score-based/trigger-based fallback messages

### Streaming Pipeline

```
Practice Session (client)
    │
    ▼
useLiveFeedback hook
    │  ── detects triggers (periodic 15s, good streak 5+, bad streak 3+)
    │  ── enforces 8s cooldown, 1 in-flight max
    │
    ▼
POST /api/feedback/stream
    │  ── health check → fallback if Ollama down
    │  ── builds short-form prompt (trigger, recent notes, accuracy)
    │
    ▼
Ollama /api/generate (stream: true)
    │  ── NDJSON: { "response": "token", "done": false }
    │
    ▼
ReadableStream proxied to client
    │
    ▼
LiveFeedbackChat component
    ── accumulates tokens → completed message
    ── auto-scrolls, fades old messages
    ── transparent bg, Twitch chat aesthetic
```

### Trigger System

| Trigger | Condition | Cooldown | Prompt Tone |
|---|---|---|---|
| `periodic` | Every ~15s of playing | 8s min | Observational, varied |
| `good_streak` | 5+ correct notes in row | 8s min | Celebratory |
| `bad_streak` | 3+ wrong notes in row | 8s min | Gentle coaching |
| `section_end` | Phrase boundary reached | 8s min | Section commentary |

Guardrails: maximum 1 in-flight request, triggers during cooldown are dropped.

### Prompt Design

**Live feedback** uses a separate system prompt optimized for brevity:
- 1 sentence max, 15 words or fewer
- Plain text output (no JSON)
- Receives: trigger reason, last ~10 notes (correct/incorrect), running accuracy %, piece title
- Previous message included to prevent repetition

**Post-session feedback** retains the existing structured JSON prompt (message, suggestions, encouragement, focusAreas).

### UI: LiveFeedbackChat (Twitch Chat Style)

- Transparent background, no card/border — floats below avatar in the right sidebar
- Fixed height (~200px), messages stack from bottom
- CSS mask gradient fades oldest messages at top
- New messages slide up with fade-in animation
- Streaming messages show token-by-token with blinking cursor
- Hidden scrollbar (`scrollbar-width: none`)
- Colored dot per message type (green = encouragement, yellow = tip, blue = coaching, gold = celebration)
- Max ~6-8 visible messages before recycling

### Key Files

| File | Purpose |
|---|---|
| `src/_lib/ai/ollama-client.ts` | HTTP client: `generateFeedback()` (non-stream) + `generateFeedbackStream()` (stream) |
| `src/_lib/ai/prompts.ts` | System prompts + prompt builders for both modes |
| `src/app/api/feedback/route.ts` | POST: non-streaming post-session feedback proxy |
| `src/app/api/feedback/stream/route.ts` | POST: streaming live feedback proxy |
| `src/_hooks/use-live-feedback.ts` | Client hook: trigger detection, cooldown, stream consumer |
| `src/_components/feedback/LiveFeedbackChat/` | Twitch chat UI component |
| `src/_components/feedback/FeedbackPanel/` | Post-session structured feedback panel |

---

## Potential Future Features

- **Spotify integration**: Browse songs from Spotify, select a track, generate sheet music from it (via AI or transcription services), and add it to the user's library as a practice session.
- **CMS**: Content management interface for uploading MusicXML, PDF, or audio files, tagging with metadata, and adding to the library (see Sheet Music Strategy).

---

## Key Technical Notes

1. **Imports** — All shared code lives in `_`-prefixed folders (`_components`, `_lib`, `_types`, `_hooks`, `_stores`, `_data`, `_utils`, `_constants`, `_interfaces`). Use `@_*` path aliases and barrel files (`index.ts`) for clean imports. See README for details.
2. **Pitch detection is monophonic only for MVP** -- start with single-note melodies. Uses a Rust-compiled WASM module implementing the YIN algorithm for sub-millisecond pitch detection. The WASM module is loaded as an ES module via wasm-pack's `bundler` target and invoked from the main thread (AudioWorklet integration is a future optimization). Chord detection is a much harder problem and can be a future enhancement.
3. **OSMD is a large library (~2MB)** -- dynamically import it only on the practice/piece pages to keep the initial bundle small. Use `next/dynamic` with `ssr: false` since OSMD needs the DOM.
4. **3D scene isolation** -- render the R3F canvas only on the practice page, lazy-loaded. Run audio analysis in a Web Worker to avoid competing with the Three.js render loop.
5. **Vercel Postgres driver** -- use `@vercel/postgres` which reads `POSTGRES_URL` from env automatically. Works seamlessly with Vercel's edge runtime.
6. **Biome.js configuration** -- enforce consistent formatting (tabs vs spaces, semicolons, quotes) project-wide. Set up a `biome.json` at root with recommended rules plus any custom preferences.
7. **Future CMS note** -- for now, pieces are bundled as static MusicXML files and seeded to the DB. A future admin interface could allow uploading MusicXML/PDF/audio, auto-extracting metadata, and managing the piece catalog. The schema already supports this -- just needs a UI and file storage (Vercel Blob or S3).

