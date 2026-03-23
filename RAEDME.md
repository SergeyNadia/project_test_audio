# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains an AI Music Generator web app.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Auth**: Replit Auth (OpenID Connect with PKCE)
- **Frontend**: React + Vite, Tailwind CSS, Framer Motion

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server (auth + music generation routes)
│   └── music-app/          # React + Vite frontend (SonicAI app)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   ├── db/                 # Drizzle ORM schema + DB connection
│   └── replit-auth-web/    # Browser auth hook (useAuth)
├── scripts/
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Features

### AI Music Generator (SonicAI)

- **Landing page**: Dark-themed with animated hero. Unauthenticated users see a sign-in prompt.
- **Auth**: Replit Auth OIDC — `/api/login` → callback → session cookie. `/api/logout` to sign out.
- **Generator page**: Text prompt input → POST `/api/generate` → async background task. Polls `/api/status/:taskId` every 2 seconds. Shows live status: pending → waking → generating → complete.
- **Audio player**: Custom HTML5 audio player with progress bar, play/pause, download. Appears when generation is complete.
- **Session history**: Right sidebar showing all generations in the current session.

### API Endpoints

- `GET /api/healthz` — Health check
- `POST /api/generate` — Start music generation (returns task_id)
- `GET /api/status/:taskId` — Poll task status (pending/waking/generating/complete/error)
- `GET /api/auth/user` — Current auth state
- `GET /api/login` — Begin OIDC login flow
- `GET /api/callback` — OIDC callback
- `GET /api/logout` — Sign out

### Mock GPU Worker

The background worker in `artifacts/api-server/src/routes/music.ts` simulates async ML inference:
- 3s sleep → status "waking" (simulates GPU cold start)
- 10s sleep → status "generating" (simulates model inference)
- Sets status "complete" with a hardcoded sample MP3 URL

**To replace with real GPU service (RunPod/Modal)**: See the comments in `artifacts/api-server/src/routes/music.ts` for the exact lines to replace.

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` with `composite: true`. Root `tsconfig.json` lists lib packages as project references.

- **Always typecheck from the root** — `pnpm run typecheck`
- **`emitDeclarationOnly`** — only `.d.ts` files during typecheck; JS bundled by esbuild/vite

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build`
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly`
- `pnpm --filter @workspace/api-spec run codegen` — regenerates React Query hooks and Zod schemas

## Database

Production migrations via Replit on publish. Development: `pnpm --filter @workspace/db run push`.

Tables: `users`, `sessions` (managed by Replit Auth)
