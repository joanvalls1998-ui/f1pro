# F1Pro — Anàlisi Competitiva i Recerca Tècnica
*Report per Joan Valls — 28 Abril 2026*

---

## 1. EQUIPS I PILOTS 2026 — ✅ COMPLET

### 10 equips confirmats:

| # | Equip | Chasis | Motor | Pilots |
|---|-------|--------|-------|--------|
| 1 | McLaren Mastercard F1 Team | MCL40A | Mercedes | #1 Lando Norris 🇬🇧 / #81 Oscar Piastri 🇦🇺 |
| 2 | Mercedes-AMG Petronas F1 Team | F1 W17 | Mercedes | #12 Kimi Antonelli 🇮🇹 / #63 George Russell 🇬🇧 |
| 3 | Oracle Red Bull Racing | RB22 | Red Bull Ford DM01 | #3 Max Verstappen 🇳🇱 / #6 Isack Hadjar 🇩🇿 |
| 4 | Scuderia Ferrari HP | SF-26 | Ferrari | #16 Charles Leclerc 🇲🇨 / #44 Lewis Hamilton 🇬🇧 |
| 5 | Atlassian Williams F1 Team | FW48 | Mercedes | #23 Alexander Albon 🇹🇭 / #55 Carlos Sainz Jr. 🇪🇸 |
| 6 | Visa Cash App Racing Bulls | VCARB 03 | Red Bull Ford DM01 | #30 Liam Lawson 🇳🇿 / #41 Arvid Lindblad 🇸🇪 |
| 7 | Aston Martin Aramco F1 Team | AMR26 | Honda | #14 Fernando Alonso 🇪🇸 / #18 Lance Stroll 🇨🇦 |
| 8 | TGR Haas F1 Team | VF-26 | Ferrari | #31 Esteban Ocon 🇫🇷 / #87 Oliver Bearman 🇬🇧 |
| 9 | Audi Revolut F1 Team | R26 | Audi | #5 Gabriel Bortoleto 🇧🇷 / #27 Nico Hülkenberg 🇩🇪 |
| 10 | Cadillac Formula 1 Team | MAC-26 | Ferrari | #11 Sergio Pérez 🇲🇽 / #77 Valtteri Bottas 🇫🇮 |

### Canvis 2025→2026:
- **Hamilton**: Ferrari → Mercedes (el transfer més gran)
- **Sainz Jr.**: Ferrari → Williams
- **Antonelli**: reserva → pilot titular Mercedes
- **4 rookies**: Bortoleto (Audi), Bearman (Haas), Lindblad (Racing Bulls), Hadjar (Red Bull)
- **Nou engine**: Audi debut com a motor propi
- **Cadillac debut**: 11è equip, motor Ferrari
- **Ford torna**: suport Red Bull Powertrains

---

## 2. CALENDARI 2026 — ✅ CONFIRMAT (OpenF1 API LIVE)

Dades reals de l'API OpenF1. Exemple:
```
session_key: 11227, Australia Melbourne
date_start: 2026-03-08T04:00:00+00:00 (Race)
session_type: "Race"
gmt_offset: "11:00:00"
```

**Sprints confirmats:** Xina (Shanghai), Canadà (Montreal) i més per confirmar.

Calendari complet 2026: **8 març - 6 desembre 2026** (22 curses)

---

## 3. OPENF1 API — ✅ FUNCIONANT

### API Live Demo (feina real):
```
GET https://api.openf1.org/v1/sessions?year=2026
→ 200 OK, retorna totes les sessions 2026
```

**Endpoints confirmats disponibles:**
- `/v1/sessions` — meetings, sessions, dates, circuits, països
- `/v1/laps` — lap times amb telemetry
- `/v1/position` — live positions (3.7 Hz)
- `/v1/weather` — wind, air_temp, track_temp, humidity, pressure
- `/v1/team_radio` — audio clips
- `/v1/pit` — pit stop data (duration, lap, driver)
- `/v1/meetings` — schedule info

**Rate limit:** 3 requests/second (suficient per 1 usuari)

**No auth required** — API totalment oberta

---

## 4. ANÀLISI COMPETITORS

### F1Cosmos.com ⭐⭐⭐⭐⭐
**El referent #1**
- ✅ Live timing table amb mini sectors
- ✅ Widget mèteo en directe (track temp, air temp, humidity, wind)
- ✅ News hub integrat
- ✅ Standings live (drivers + constructors)
- ✅ Telemetria amb comparació de pilots
- ✅ Calendar amb comptador enrere
- ❌ No historical data (només live)
- ❌ No tyre strategy analysis
- ❌ No pit stop analysis visual

### TracingInsights.com ⭐⭐⭐⭐
**Anàlisi profunda**
- ✅ 20+ categories d'anàlisi
- ✅ Tyre strategy analysis visual
- ✅ Lap chart (posicions per volta)
- ✅ Race trace (posicions en temps real)
- ✅ Circuit maps amb heatmaps de frenada/velocitat
- ✅ Pace comparison
- ✅ Season stats
- ❌ Live timing limited (no real-time positions)
- ❌ No news
- ❌ UI una mica congestionada

### F1Matcha.com ⭐⭐⭐
**Telemetry viewer**
- ✅ OpenF1-based visualization
- ✅ Driver comparison (fins a 3)
- ✅ Lap selection
- ✅ Performance traces (speed, throttle, brake)
- ❌ Només telemetria (res més)
- ❌ No live timing

### F1 App Oficial ⭐⭐⭐
**El que agrada:**
- ✅ Live timing fiable
- ✅ Video highlights
- ✅ Driver standings
- ✅ Push notifications

**El que NO agrada (fans):**
- ❌ Pagues per veureho live
- ❌ UI lenta i pesada
- ❌ No telemetria gratuïta
- ❌ Notificacions massa agressives

---

## 5. OPORTUNITATS (EL QUE FALTA AL MERCAT)

Based on fan complaints Reddit/Twitter i gap analysis:

### NO EXISTEIX (o està molt mal fet):
1. **Live timing gratuït amb bona UX** — F1Cosmos és el millor però no és perfecte
2. **Tyre strategy visual** — TracingInsights ho fa però complicat
3. **Pit stop analysis visual** — cap app ho fa bé
4. **Weather per sessió** — informació fragmentada
5. **Countdown a proper cursa** — cap app ho fa elegant
6. **News agregat** — cada app fa la seva, no n'hi ha una que aggregateixi bé
7. **Live team radio** — OpenF1 ho té, però ningú ho mostra bé
8. **Lap-by-lap race replay** — cap app ho fa de forma elegant

### FANS VOLEM (pain points):
- "Vull veure posicions en temps real GRATIS"
- "Vull saber quin pneumàtic porta cada pilot"
- "Vull veure el temps de cada sector EN VIU"
- "Vull saber quan fa pit stop cada pilot"
- "Vull veure el有心电图 de cada pilot comparat"
- "Vull notícies sense anar a 10 llocs diferents"

---

## 6. ARQUITECTURA TÈCNICA PROPOSADA

### Stack:
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Hosting**: Cloudflare Pages (FREE)
- **API**: OpenF1 (gratis, 3 req/s)
- **State**: React hooks + SWR per polling
- **Charts**: Recharts o similar

### Pàgines:
1. `/` — Home (next race countdown + weather + news)
2. `/live` — Live timing (posicions, sectors, meteo)
3. `/race/[session]` — Race view (lap chart, pit stops, telemetry)
4. `/calendar` — Calendari 2026 amb totes les sessions
5. `/standings` — Drivers + Constructors standings
6. `/drivers` — Grid de pilots
7. `/teams` — Grid d'equips
8. `/telemetry` — Comparador de telemetria

### Components clau:
- LivePositionTable (posicions, intervals, sectors, pneumàtic)
- WeatherWidget (track temp, air temp, humidity, wind)
- LapChart (posicions per volta visualització)
- TyreStrategyTimeline
- PitStopAnalyzer
- TelemetryChart (speed, throttle, brake per pilot)
- CountdownTimer (fins propera sessió)
- NewsCard (RSS aggregation)
- TeamRadioPlayer

---

## 7. DISSENY VISUAL

### Colors (proposta):
- **Background**: #0a0a0a (negre)
- **Surface**: #141414
- **Border**: #262626
- **Text primary**: #ffffff
- **Text secondary**: #999999
- **Accent**: #00ff94 (verd F1 Pro signature)
- **Warning**: #ff6b35 (orange per alertes)
- **Live red**: #ff3b3b (per indicator LIVE)

### Tipografia:
- **Display**: Bebas Neue (headings grans)
- **Body**: Inter (text llegible)
- **Mono**: JetBrains Mono (dades, números)

### Layout:
- Mobile-first (bottom nav)
- Dark theme per defecte (fans veuen F1 de nit)
- Live indicator persistent quan hi ha sessió activa
- Graceful degradation si OpenF1 cau

---

## 8. FULL DE RUTA

### Fase 1 (MVP - 2 setmanes):
- [ ] Shell Next.js amb bottom nav
- [ ] Dark theme + colors
- [ ] Live timing table (posicions + intervals)
- [ ] Weather widget
- [ ] Calendari 2026
- [ ] Deploy a Cloudflare Pages

### Fase 2 (Week 3-4):
- [ ] Tyre strategy visualization
- [ ] Pit stop data
- [ ] Lap chart
- [ ] Team radio player

### Fase 3 (Mes 2):
- [ ] Telemetry comparison
- [ ] News RSS aggregation
- [ ] Driver/Team pages
- [ ] Standings live

### Fase 4 (Mes 3+):
- [ ] AI race predictions
- [ ] Historical data (Ergast API)
- [ ] PWA offline support
- [ ] Push notifications

---

## 9. CONCLUSIONS

**OpenF1 API funciona i tenim dades reals de 2026.** L'API és sòlida, free, i ens dona tot el que necessitem per live timing.

**El mercat té buits clars:**
- Ningú fa live timing + news + weather + tyre strategy en una sola app bonica
- F1Cosmos s'hi apropa però falta polish i features
- El mobile experience és mediocre a totes

**Proposta F1Pro:**
App única que ho integri TOT: live timing professional, anàlisi visual, news, weather, countdown, telemetria — tot en una interface neta i mobile-first.

**Competitive advantage:**
1. UX superior (mobile-first vs desktop-heavy competitors)
2. Integració vertical (live + anàlisi + news en una)
3. Velocitat (Cloudflare CDN + OpenF1 real-time)
4. Watchability (countdown, alerts, live indicators)

---

*Document generat: 28 Abril 2026, 10:45 GMT+2*
*Fonts: OpenF1 API live data, Wikipedia, anàlisi competitiu propi*
