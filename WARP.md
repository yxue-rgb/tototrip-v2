# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repository layout (high level)
- `v2/`: **Primary app** (recommended). Next.js 15 (App Router) + Anthropic (Claude) + Supabase + Leaflet map.
- `webapp/`: Legacy Next.js app (GraphQL/Auth0/Mapbox-era). Requires a GraphQL backend and env vars.
- Project notes (useful context, not required to run): `QUICK_START.md`, `CHANGELOG.md`, `PROJECT_STATUS.md`, plus `v2/PRD.md`, `v2/DEVELOPMENT_ROADMAP.md`, `v2/DEVELOPMENT_LOG.md`.

## Common commands

### v2 (recommended)
From repo root:
```bash
cd v2
```

Install deps:
```bash
npm install
```

Run dev server (Turbopack):
```bash
npm run dev
```

Build + start production server:
```bash
npm run build
npm run start
```

Lint:
```bash
npm run lint
```

Environment variables:
- Template: `v2/.env.example`
- Required in practice (used by `v2/app/api/chat/route.ts` and `v2/lib/supabase.ts`):
  - `ANTHROPIC_API_KEY`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Tests:
- No test runner is currently configured (no `test` script, no `tests/`/`__tests__/`).

### webapp (legacy)
From repo root:
```bash
cd webapp
```

Install / dev / build / lint:
```bash
npm install
npm run dev
npm run build
npm run lint
```

GraphQL codegen (watch mode):
```bash
npm run codegen
```
Note: `webapp/codegen.ts` points to a schema at `../server/schema.graphql`.

## Architecture overview (v2)

### Runtime model
- Next.js App Router:
  - UI routes in `v2/app/**`.
  - Server endpoints in `v2/app/api/**` (Next Route Handlers).
- Auth + persistence are handled via Supabase.
- AI responses are streamed from the server to the client via SSE.

### Auth (Supabase)
- Supabase client + DB typings: `v2/lib/supabase.ts`.
- Client auth state lives in `v2/contexts/AuthContext.tsx` and is provided by `v2/app/layout.tsx`.
- The app expects an extended profile row in `public.users` (see Supabase SQL below); profile fetches happen via `supabase.from('users')`.

### AI chat flow (end-to-end)
- UI entry: `v2/app/chat/[id]/page.tsx`.
  - Sends chat requests to `POST /api/chat`.
  - Renders messages via `v2/app/chat/components/MessageList.tsx` and input via `MessageInput.tsx`.
- Server endpoint: `v2/app/api/chat/route.ts`.
  - Calls Anthropic via `@anthropic-ai/sdk`.
  - Returns `text/event-stream` where each chunk is emitted as `data: {"text":"..."}` and ends with `data: [DONE]`.
- Location extraction:
  - The system prompt instructs the model to append JSON inside `<LOCATION_DATA>...</LOCATION_DATA>`.
  - `v2/lib/parseLocations.ts` strips these blocks and parses them (JSON5-enabled).
  - `MessageList` uses `parseLocationsFromMessage()` and, when locations exist, renders:
    - Cards: `v2/app/chat/components/LocationCard.tsx`
    - Map: `v2/app/chat/components/LocationMap.tsx` (Leaflet/OpenStreetMap, dynamically imported to avoid SSR).
  - `v2/next.config.mjs` disables React Strict Mode to avoid Leaflet double-init issues.

### Persistence APIs (Supabase-backed)
These routes expect a Supabase access token in `Authorization: Bearer <token>`.
- Chat sessions: `v2/app/api/sessions/**`
- Chat messages: `v2/app/api/messages/route.ts`
- Trips CRUD: `v2/app/api/trips/**`
- Saved locations CRUD: `v2/app/api/locations/**`

The “save location” UX is driven from chat:
- `SaveLocationDialog`: `v2/app/chat/components/SaveLocationDialog.tsx`
- Saves to `saved_locations`, optionally attaches to a trip via `trip_id`.

### Supabase schema & security
- SQL lives in `v2/supabase/*.sql`.
  - `schema.sql`: tables + RLS policies.
  - `auto-create-user-profile.sql`: trigger to create `public.users` rows on new `auth.users`.
  - `fix-users-policy.sql`: inserts policy for `public.users`.

When changing DB shape, keep `v2/lib/supabase.ts` (types) and the API route handlers in sync with the SQL schema.