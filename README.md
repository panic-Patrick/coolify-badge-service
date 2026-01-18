# Example
## flat
![Deployment Status](https://badge.kaempf.dev/api/badge/j4c8owgkw4k8888ckkgc84s4?label=Website&style=flat)
## flat square
![Deployment Status](https://badge.kaempf.dev/api/badge/j4c8owgkw4k8888ckkgc84s4?label=Website&style=flat-square)
## plastic
![Deployment Status](https://badge.kaempf.dev/api/badge/j4c8owgkw4k8888ckkgc84s4?label=Website&style=plastic)
## for-the-badge
![Deployment Status](https://badge.kaempf.dev/api/badge/j4c8owgkw4k8888ckkgc84s4?label=Website&style=for-the-badge)
## social
![Deployment Status](https://badge.kaempf.dev/api/badge/j4c8owgkw4k8888ckkgc84s4?label=Website&style=social)


# Coolify Deployment Badge Service (Next.js)

Generates live SVG status badges for Coolify apps.

## Features
- Badge SVGs with strict no-cache headers
- Custom label and style (Shields presets)
- Status-to-color mapping in one place
- Simple UI with copy buttons and optional login gate

## Quickstart
```bash
npm install
npm run dev
# open http://localhost:3000/
```

For production:
```bash
npm run build
npm start   # uses PORT
```

## Configuration
Create `.env.local` (do not commit secrets):
```
COOLIFY_API_URL=https://cool.coolify.dev
API_TOKEN=your_token_here
PORT=3000
SITE_PASSWORD=change_me      # protects the UI; badges remain public
```

## Endpoints
- `/api/health` → `{ status: "ok" }`
- `/api/badge/:app_uuid` → SVG badge (no-cache)

## Badge Usage
Markdown example:
```md
![Deployment Status](https://your-domain/api/badge/your-app-uuid)
```
Query options:
- `?label=Text` overrides left text
- `?style=for-the-badge` selects a Shields style
- `?type=service` targets services instead of applications (default tries applications, then services)

## Status Mapping
Colors/texts live in [app/api/badge/status-config.ts](app/api/badge/status-config.ts). Default mapping:
- finished → Live → `#3fb950`
- running:healthy → Live → `#3fb950`
- failed → Failed → `#f85149`
- in_progress → Deploying → `#2188ff`
- queued → Queued → `#6e7681`
- no_history → No history → `#d1d5da`
- unauthorized → Unauthorized → `#cea61b`
- offline/other → Offline/raw key → `#cea61b`

## UI Builder
- Access the builder at `/` (login required if `SITE_PASSWORD` is set).
- Configure App UUID, label, host override, badge style, and target (auto/application/service); copy URL/Markdown; preview updates live.
