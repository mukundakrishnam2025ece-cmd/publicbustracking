# Bus Tracker — Phase 1: Project Setup

Passenger-first public bus tracking app. Built incrementally, one verified
phase at a time — see roadmap below.

## Status: Phase 1 + Phase 2 done, verified

**Phase 1 — pages**
- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Page structure for the MVP passenger flow, all placeholder content:
  - `/` — home
  - `/map` — live map (Phase 6)
  - `/routes`, `/routes/[id]` — route list & detail (Phase 3/4)
  - `/stops`, `/stops/[id]` — stop list & detail (Phase 3/4)
  - `/buses`, `/buses/[id]` — bus list & detail (Phase 3/4)
  - `/favourites` — saved routes/stops (Phase 11, after core tracking works)
- `npm run build` passes, all 9 routes compile.

**Phase 2 — database schema** (`prisma/schema.prisma`)
- Tables: `routes`, `bus_stops`, `route_stops` (ordered join table), `drivers`,
  `buses` (static), `trips`, `bus_locations` (real-time — separated from
  `buses` so high-frequency location writes never touch static bus data).
- Verified by running the equivalent SQL against a real local Postgres,
  inserting realistic sample data, and running the three queries the app
  actually needs: route-with-ordered-stops, nearest-stops-by-distance, and
  latest-location-for-a-trip. All three returned correct results.
- Not yet run against *your* database — see setup below.

No map, no live data feed, no auth yet — intentionally. Every placeholder
page says so; nothing here is faked as real.

## Run it locally

```
npm install
```

### Set up your database (Phase 2)
1. Create a free Postgres database at [neon.tech](https://neon.tech) or
   [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env` and paste your connection string into
   `DATABASE_URL`.
3. Push the schema to your database:
   ```
   npm run db:push
   ```
   **Expected result:** terminal prints `Your database is now in sync with
   your Prisma schema`. If it fails, check that `DATABASE_URL` in `.env` is
   exactly what your provider gave you (including `?sslmode=require` for
   Neon/Supabase).
4. (Optional) Browse the empty tables visually: `npm run db:studio` opens a
   local GUI at http://localhost:5555.

### Run the app
```
npm run dev
```
Open http://localhost:3000 — home page with links to each section, each
showing a "Placeholder" message.

## Roadmap (from the project spec)

| Phase | What | Status |
|---|---|---|
| 1 | Project setup | done |
| 2 | Database schema (PostgreSQL) | done |
| 3 | Static bus/route/stop mock data | next |
| 4 | Backend APIs | - |
| 5 | Basic frontend wired to APIs | - |
| 6 | Map integration (Leaflet + OpenStreetMap) | - |
| 7 | Search (bus/route/stop) | - |
| 8 | Simulated live bus movement | - |
| 9 | Realtime updates | - |
| 10 | ETA calculation | - |
| 11 | User accounts / favourites | - |
| 12 | Admin dashboard | - |
| 13 | Real GPS integration (driver phone, buffer/sync) | - |
| 14 | Testing | - |
| 15 | Deployment (Vercel) | - |

## Planned stack (all free-tier)

- **DB**: PostgreSQL via Neon or Supabase free tier
- **Maps**: Leaflet.js + OpenStreetMap tiles (no API key needed)
- **Realtime**: Supabase Realtime or polling - decide in Phase 9
- **Driver auth**: phone/OTP or username+password (not biometric/face -
  unnecessary for this use case and a privacy liability for no real benefit)
- **GPS ingestion**: driver's phone sends location; client buffers points
  locally and syncs on reconnect to handle weak/no signal - see Phase 13
- **Deploy**: Vercel free tier

## Demo build (deadline mode)

Built for a tight deadline — real database, auth, and driver/admin app were
skipped on purpose (see the plan in chat). What's real for the demo:

- `/map` — live Leaflet + OpenStreetMap map, bus marker moves continuously
  along route 27A (Tiruchengode → Namakkal), simulated GPS (Phase 8 logic,
  `src/lib/gps-simulator.ts`), tap the bus for route/next-stop/ETA.
- `/routes`, `/routes/[id]`, `/stops`, `/stops/[id]`, `/buses`, `/buses/[id]`
  — all wired to mock data in `src/lib/mock-data.ts`, not placeholders.
- Data is in-memory mock data, not the database — `prisma/schema.prisma`
  from Phase 2 is unused tonight. Wiring the real DB in is the next step
  once there's no deadline pressure.
