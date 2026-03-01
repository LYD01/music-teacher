# Music Teacher

## Setup

1. **Node** — Use Node 22.17.0 (via [nvm](https://github.com/nvm-sh/nvm)):

   ```bash
   nvm install 22.17.0
   ```

2. **Bun** — Install [Bun](https://bun.sh) and run install:

   ```bash
   bun install
   ```

3. **Environment** — Copy `.env.example` to `.env` and fill in your values. To sync env vars from Vercel:

   ```bash
   bunx vercel link
   bunx vercel env pull .env --environment=production
   ```

## Imports

This project uses path aliases for clean, consistent imports. All shared code lives in `src/` folders prefixed with `_` (e.g. `_components`, `_lib`, `_types`).

### Aliases

- **`@_*`** — Maps to `src/_*`. Use for any `_`-prefixed folder.
- **`@/*`** — Same mapping (both resolve to `./src/_*`).

Examples: `@_components`, `@_lib`, `@_types`, `@_hooks`, `@_stores`, `@_data`, `@_utils`, `@_constants`, `@_interfaces`.

### Barrel files (index.ts)

Each `_` folder uses `index.ts` as the public entry point. Export from the barrel instead of individual files.

```ts
// Prefer barrel imports
import { Footer, PublicNav } from "@_components";
import { auth, getNavItemsForRole } from "@_lib";
import type { AvatarMood, DetectedNote } from "@_types";
import { useSidebar, SidebarProvider } from "@_hooks";

// Subpath when needed
import { HistoryFeed } from "@_components/dashboard";
import type { ComparisonResult } from "@_lib/music/comparison";
```

### Adding new folders

1. Create the folder with a `_` prefix (e.g. `_utils`).
2. Add an `index.ts` barrel that exports the public API.
3. Import via `@_utils` — no `tsconfig` changes needed (wildcard handles it).

### Folder roles

| Folder        | Purpose                          |
| ------------- | -------------------------------- |
| `_components` | React components (UI)            |
| `_lib`        | Utilities, auth, db, nav, etc.   |
| `_types`      | Shared TypeScript types          |
| `_interfaces` | Shared interfaces (API contracts)|
| `_hooks`      | React hooks                      |
| `_stores`     | State (e.g. Zustand)             |
| `_utils`      | Pure helper functions            |
| `_constants`  | App constants, config values     |
| `_data`       | Static data, fixtures            |
