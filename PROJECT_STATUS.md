# F1Pro - Project Status

## URL
**https://f1pro.netlify.app**

## GitHub
**https://github.com/joanvalls1998-ui/f1pro**

## Build Status
- **Last build:** 2026-04-28 - CLEAN (15 routes, 0 errors)
- **Deployed:** YES - Netlify automatic deploy

## REAL 2026 Season Data

### Real 2026 Race Results (after 3 races)
- **R1 Australian GP:** George Russell (Mercedes) 🥇
- **R2 Chinese GP:** Kimi Antonelli (Mercedes) 🥇
- **R3 Japanese GP:** Kimi Antonelli (Mercedes) 🥇
- **Bahrain GP:** CANCELLED
- **Saudi Arabian GP:** CANCELLED

### Real Driver Standings (after 3 races)
1. Kimi Antonelli (Mercedes) - 72 pts 🥇
2. George Russell (Mercedes) - 63 pts
3. Charles Leclerc (Ferrari) - 49 pts
4. Lewis Hamilton (Ferrari) - 41 pts
5. Lando Norris (McLaren) - 25 pts
6. Oscar Piastri (McLaren) - 21 pts
7. Max Verstappen (Red Bull) - 18 pts
8. Oliver Bearman (Haas) - 12 pts
9. Fernando Alonso (Aston Martin) - 8 pts
10. Gabriel Bortoleto (Audi) - 6 pts
11. Nico Hülkenberg (Audi) - 4 pts
12. Pierre Gasly (Alpine) - 4 pts
13. Isack Hadjar (Red Bull) - 4 pts
14. Lance Stroll (Aston Martin) - 2 pts
15. Carlos Sainz (Williams) - 2 pts
16-22. Rest of grid - 0 pts

### Real Constructor Standings
1. Mercedes - 135 pts
2. Ferrari - 90 pts
3. McLaren - 46 pts
4. Haas - 18 pts
5. Alpine - 16 pts
6. Red Bull - 22 pts
7. Aston Martin - 10 pts
8. Audi - 10 pts
9. Williams - 2 pts
10. Racing Bulls - 0 pts
11. Cadillac - 0 pts

## REAL 2026 F1 GRID
- McLaren: Lando Norris (#4), Oscar Piastri (#81) - color: F58020
- Mercedes: George Russell (#63), Andrea Kimi Antonelli (#12) - color: 27F4D2
- Ferrari: Lewis Hamilton (#44), Charles Leclerc (#16) - color: F91536
- Red Bull Racing: Max Verstappen (#1), Isack Hadjar (#6) - color: 3671C6
- Williams: Alex Albon (#23), Carlos Sainz (#55) - color: 37BEDD
- Racing Bulls: Liam Lawson (#30), Arvid Lindblad (#41) - color: 2D0D0D
- Aston Martin: Fernando Alonso (#14), Lance Stroll (#18) - color: 358C75
- Audi: Nico Hülkenberg (#27), Gabriel Bortoleto (#5) - color: F50537
- Haas: Oliver Bearman (#87), Esteban Ocon (#31) - color: B6BABD
- Alpine: Pierre Gasly (#10), Franco Colapinto (#7) - color: 2293D1
- Cadillac: Valtteri Bottas (#77), Sergio Perez (#11) - color: 909090

## 2026 Calendar (24 races - UPDATED)
1. Australian GP - 6-8 Març ✅ COMPLETAT
2. Chinese GP - 13-15 Març ✅ COMPLETAT
3. Japanese GP - 27-29 Març ✅ COMPLETAT
4. Miami GP - 1-3 Maig 🔥 PRÒXIM
5. Canadian GP - 22-24 Maig
6. Monaco GP - 5-7 Juny
7. Spanish GP - 12-14 Juny
8. Austrian GP - 26-28 Juny
9. British GP - 3-5 Juliol
10. Hungarian GP - 24-26 Juliol
11. Belgian GP - 17-19 Juliol
12. Dutch GP - 21-23 Agost
13. Italian GP - 4-6 Setembre
14. Madrid GP - 11-13 Setembre
15. Azerbaijan GP - 24-26 Setembre
16. Singapore GP - 9-11 Octubre
17. US GP - 23-25 Octubre
18. Mexican GP - 30 Oct-1 Nov
19. Brazilian GP - 6-8 Novembre
20. Las Vegas GP - 19-21 Novembre
21. Qatar GP - 27-29 Novembre
22. Abu Dhabi GP - 4-6 Desembre

**Sprint Races 2026:** Chinese, Miami, Canadian, British, Dutch, Singapore

## Key Pages
- **Live:** `/live` - Live positions (OpenF1 API - no 2026 data, uses static fallback)
- **Standings:** `/standings` - Real 2026 standings (corrected)
- **Calendar:** `/calendar` - 24 races, Miami next
- **Telemetry:** `/telemetry` - Speed trace comparator
- **Weather:** `/weather` - Per-session weather
- **Circuits:** `/circuits` - All 24 circuits with info

## API Notes
- **OpenF1:** No 2026 data (only through 2024) → use static fallback
- **Ergast:** No 2026 data → use static fallback  
- **TracingInsights/2026 GitHub:** REAL telemetry data available

## Miami GP 2026 Sessions
- FP1: 2026-05-01T16:00:00Z
- Sprint Qualifying: 2026-05-01T20:30:00Z
- Sprint Race: 2026-05-02T16:00:00Z
- Qualifying: 2026-05-02T20:00:00Z
- Race: 2026-05-03T20:00:00Z

## TracingInsights/2026 GitHub Repo
Real telemetry data available:
- Path: `https://github.com/TracingInsights/2026`
- Structure: `{GP}/{Session}/{DRIVER}/{N}_tel.json`
- Driver codes: NOR, LEC, VER, HAM, PIA, RUS, ANT, ALB, ALO, STR, BOT, PER, GAS, HUL, BOR, BEA, OCO, LAW, HAD, LIN, COL
- tel.json fields: time, speed, rpm, gear, throttle, brake, drs, distance, rel_distance
- weather.json available per session

## TODO
- [x] Standings: Update with real 2026 results
- [x] Calendar: Remove Bahrain and Saudi Arabia (cancelled)
- [ ] Live page: Integrate TracingInsights telemetry (advanced)
- [ ] Push to GitHub (build clean)
