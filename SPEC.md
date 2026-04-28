# F1Pro — Especificació Tècnica

## 1. Concept & Vision

F1Pro és la plataforma fan definitiva per a F1 2026: dark, premium, i brutalment ràpida. L'estètica és el que veuries al mur d'un enginyer de cursa de veritat — dades dures, visualitzacions clares, zero fluff. Cada pantalla ha de fer anar l'usuari "wow, això sembla oficial".

**Sensació:** RaceControl après a fer coses com cal. F1 Cosmos però millor dissenyat i nostre.

---

## 2. Design Language

### Colors
```
--bg-primary:    #0a0a0a   (negre profund F1)
--bg-secondary:  #111318   (card backgrounds)
--bg-elevated:   #1a1d24   (hover/elevated)
--accent:        #00ff94   (el verd F1 que ja tenim)
--accent-dim:    rgba(0,255,148,0.15)
--text-primary:  #f0f0f0
--text-muted:    #888899
--danger:        #ff4757   (vermell alertes)
--warning:       #ffa502   (groc warning)
--success:       #2ed573
```

### Tipografia
- **Display:** Bebas Neue (headings grossos, números de cursa)
- **UI:** Inter (cos text, legibilitat)
- **Mono:** JetBrains Mono (timing, telemetria)

### Espaiat
- Base unit: 4px
- Sections: 24px padding
- Cards: 16px padding, 12px border-radius
- Gaps: 8px / 12px / 16px

### Motion
- Durations: 150ms micro, 250ms transitions, 400ms entrances
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Skeleton loaders per totes les dades async
- Live dots amb pulse animation

---

## 3. Layout & Structure

### Mobile-first Bottom Navigation
```
┌──────────────────────────────────────┐
│ [Content area - scrollable]          │
│                                      │
├──────────────────────────────────────┤
│  🏠 Home  │  📅 Calendar  │  📊 Live │
│  🏆 Stand │  🔧 Telemetry │  📰 News │
└──────────────────────────────────────┘
```
6 tabs, icones, label sota, tab activa amb accent color.

### Pages
1. **/** — Home amb GP featured card, live positions, news
2. **/calendar** — Tots els GPs 2026 en grid cards
3. **/live** — Live timing (quan sessió activa) o última sessió
4. **/standings** — Driver + Constructor standings
5. **/telemetry** — Seleccionar GP/Sessió/Pilot, playback lap
6. **/news** — RSS news feed

### Responsive
- Mobile: 1 columna, bottom nav
- Tablet: 2 columnes on cal
- Desktop: max-width 1200px centrat

---

## 4. Features & Interactions

### Home
- **GP Card:** Nom GP, circuit SVG, dates, horari pròxima sessió (amb countdown si upcoming)
- **Live Banner:** Si hi ha sessió activa → posicions actualitzades cada 4s
- **News Strip:** 5 últimes notícies RSS scroll horitzontal

### Calendari
- **GP Cards en grid:** Circuit SVG, nom, país, dates, estat (🟢 live / ⏳ upcoming / ✅ completed)
- **Click → Expandir:** Horaris detallats de totes les sessions (FP1, FP2, FP3, Q, SQ, Race)
- **Timezone:** Hora local espanyola (Europe/Madrid)

### Live Timing
- **Posicions:** #, pilot, team, Gap to leader, Última volta
- **刷新:** Auto-refresh cada 4 segons (OpenF1 interval)
- **Session info:** GP, sessió, temps meteorològic

### Classificacions
- **Driver Standings:** Pos, Driver, Team, Punts, Victòries, Podis
- **Constructor Standings:** Pos, Team, Punts
- **Recent form:** Últimes 5 curses com sparkline o icones ✅❌

### Telemetría
- **Selectors:** GP → Sessió → Pilot (dropdowns encadenats)
- **Lap list:** Chips horitzontals amb temps i compound
- **Playback:** Play/Pause, scrubber, speed controls (0.25× 0.5× 1× 2×)
- **Telemetry traces:** Speed, Throttle, Brake com SVG line charts
- **Sector times:** 3 sectors color-coded (verde=s1 bo, groc=normal, vermell=lent)

### News
- **Source:** RSS feeds F1 (Feedspot)
- **Layout:** Cards verticals, imatge + titular + font + data
- **Click:** Obriu article en finestra nova

---

## 5. Component Inventory

### GPFeaturedCard
- Estats: upcoming (countdown), live (pulse verde), completed (cincela)
- Circuit SVG (inline, 100% width)
- Nom GP, ubicació, dates
- Prossessió: "PRÒXIMA SESSIÓ: dissabte 15:00" / "EN DIRECTE" amb live dot

### LivePositionsTable
- Header: Pos, Pilot, Equip, Gap, Última volta
- Rows: alternating bg, hover highlight
- Live updates amb flash animation al canvi de posició
- Empty state: "Sense dades en directe ara"

### CircuitSvgCard
- SVG inline del circuit (mateix estil que RaceControl però millorat)
- Accent color #00ff94
- Altura variable (portrait a calendar, landscape a GP card)
- Sense imatges externes

### LapSelectorChips
- Scroll horitzontal
- Cada chip: L{n} + temps volta + dot del compound
- Selected chip: border accent
- Temps en color: fastest=verde, normal=blanc, slow=vermell

### TelemetryTraceChart
- SVG amb múltiples línies (speed, throttle, brake)
- Gràfica responsive (viewBox)
- Tooltip on hover (valor exacte a aquela posició)
- Eixos: X=distancia relativa, Y=valor

### NavigationBar
- Fixed bottom
- 6 tabs amb icona SVG + label
- Active tab: accent color + bold
- Safe area bottom (iOS home indicator)

### SkeletonLoader
- Shimmer animation (bg gradient move)
- Forma del contingut que carrega

---

## 6. Technical Approach

### Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS (o CSS custom properties)
- **API:** OpenF1 (client-side fetch), Ergast
- **Hosting:** Cloudflare Pages (gratuït)
- **Deployment:** GitHub Actions → Cloudflare Pages

### Data Flow
- **Static pages:** SSG amb revalidation ISR (1h per calendari, 5min per standings)
- **Live data:** Client-side polling cada 4s (OpenF1)
- **No backend propi** fins que calgui persistència

### API Endpoints (OpenF1)
```
GET /v1/sessions?year=2026&country_name=Spain
GET /v1/meetings?year=2026
GET /v1/laps?session_key={key}&driver_number={n}
GET /v1/position?session_key={key}
GET /v1/weather?session_key={key}
GET /v1/team_radio?session_key={key}
GET /v1/pit?session_key={key}
```

### Ergast Endpoints
```
GET https://ergast.com/api/f1/current.json  (calendari)
GET https://ergast.com/api/f1/current/standings.json (classificacions)
GET https://ergast.com/api/f1/2026/results/1.json (resultats última cursa)
```

### News RSS
- Feedspot F1 RSS: `https://feeds.feedspot.com/ff_`
- Parser: `rss-parser` (Node) o client-side amb `https://api.rss2json.com/`

### File Structure
```
f1pro/
├── SPEC.md
├── app/
│   ├── layout.tsx          (shell + bottom nav)
│   ├── page.tsx             (home)
│   ├── calendar/page.tsx
│   ├── live/page.tsx
│   ├── standings/page.tsx
│   ├── telemetry/page.tsx
│   └── news/page.tsx
├── components/
│   ├── BottomNav.tsx
│   ├── GPFeaturedCard.tsx
│   ├── CircuitSvg.tsx
│   ├── LivePositionsTable.tsx
│   ├── LapSelectorChips.tsx
│   ├── TelemetryTraceChart.tsx
│   ├── SkeletonLoader.tsx
│   └── ...
├── lib/
│   ├── openf1.ts           (API client)
│   ├── ergast.ts           (API client)
│   ├── circuits.ts         (SVG data inline)
│   └── utils.ts
├── styles/
│   └── globals.css
├── public/
│   └── ...
├── next.config.js
└── wrangler.toml           (Cloudflare Pages)
```

---

## 7. Milestones

**M1:** Projecte configurat, shell amb bottom nav, routing, dark theme
**M2:** Calendari 2026 amb circuits SVG (Albert Park → Abu Dhabi)
**M3:** Classificacions driver + constructor
**M4:** Live timing (quan sessió activa)
**M5:** Telemetría lap-by-lap amb playback
**M6:** News RSS feed
**M7:** Deploy a Cloudflare Pages + domain

---

## 8. Out of Scope (de moment)

- Autenticació / user accounts
- Prediccions guardades (cal BDD)
- Multi-idioma (català + castellà + anglès)
- Dark/light toggle (dark only)
- PWA offline mode
- 3D track visualization

*Last updated: 2026-04-28*
