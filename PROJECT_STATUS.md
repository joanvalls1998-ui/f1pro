# F1Pro - Project Status

## URL
**https://f1pro.netlify.app**

## GitHub
**https://github.com/joanvalls1998-ui/f1pro**

## Last Push
`bda8af1` - 2026-04-28 12:40 GMT+2

## Pages (11 routes)
- `/` - Home amb countdown Miami GP
- `/live` - Live timing (OpenF1 + fallback 12 pilots)
- `/weather` - Weather widget Miami GP (OpenF1)
- `/calendar` - Calendari 2026 (18 curses)
- `/standings` - Classificació pilots/constructors (Ergast proxy)
- `/telemetry` - Comparador telemetria
- `/news` - Notícies F1
- `/circuits` - 19 circuits 2026
- `/api/openf1` - Proxy OpenF1 CORS
- `/api/ergast` - Proxy Ergast CORS

## Features
- Dark theme iOS-style
- TopBar amb logo + LIVE/SOON badge
- Bottom nav 6 tabs
- Catalan language
- Static fallback data per a totes les pàgines
- Polling 60s per weather, 15s per live timing

## Team Colors
- McLaren: F47600
- Red Bull: 4781D7
- Ferrari: E8002D
- Mercedes: 27F4D2
- Alpine: 00A1E8
- Audi: F50537
- Williams: 64C3FF
- Haas: B6BABD
- Racing Bulls: 6692FF
- Aston Martin: 229971

## API Keys/Creds
- GitHub PAT: guardat a Mac Keychain (user: joanvalls1998-ui)
- OpenF1: API pública, rate limit 3 req/s
- Ergast: API pública, no requireix auth

## Pending
- PWA manifest (per instal·lar a iPhone)
- Real telemetry amb TracingInsights (GitHub: TracingInsights/2026)
- Tyre strategy visualization
- Speed traps / G-force analysis
