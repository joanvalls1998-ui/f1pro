"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ── Constants ────────────────────────────────────────────────────────────────
const DRIVERS = [
  { number: 4, name: "Lando Norris", acronym: "NOR", team: "McLaren", color: "F58020" },
  { number: 81, name: "Oscar Piastri", acronym: "PIA", team: "McLaren", color: "F58020" },
  { number: 63, name: "George Russell", acronym: "RUS", team: "Mercedes", color: "27F4D2" },
  { number: 12, name: "Kimi Antonelli", acronym: "ANT", team: "Mercedes", color: "27F4D2" },
  { number: 44, name: "Lewis Hamilton", acronym: "HAM", team: "Ferrari", color: "F91536" },
  { number: 16, name: "Charles Leclerc", acronym: "LEC", team: "Ferrari", color: "F91536" },
  { number: 1, name: "Max Verstappen", acronym: "VER", team: "Red Bull Racing", color: "3671C6" },
  { number: 6, name: "Isack Hadjar", acronym: "HAD", team: "Red Bull Racing", color: "3671C6" },
  { number: 23, name: "Alex Albon", acronym: "ALB", team: "Williams", color: "37BEDD" },
  { number: 55, name: "Carlos Sainz", acronym: "SAI", team: "Williams", color: "37BEDD" },
  { number: 30, name: "Liam Lawson", acronym: "LAW", team: "Racing Bulls", color: "2D0D0D" },
  { number: 41, name: "Arvid Lindblad", acronym: "LIN", team: "Racing Bulls", color: "2D0D0D" },
  { number: 14, name: "Fernando Alonso", acronym: "ALO", team: "Aston Martin", color: "358C75" },
  { number: 18, name: "Lance Stroll", acronym: "STR", team: "Aston Martin", color: "358C75" },
  { number: 27, name: "Nico Hülkenberg", acronym: "HUL", team: "Audi", color: "F50537" },
  { number: 5, name: "Gabriel Bortoleto", acronym: "BOR", team: "Audi", color: "F50537" },
  { number: 87, name: "Oliver Bearman", acronym: "BEA", team: "Haas", color: "B6BABD" },
  { number: 31, name: "Esteban Ocon", acronym: "OCO", team: "Haas", color: "B6BABD" },
  { number: 10, name: "Pierre Gasly", acronym: "GAS", team: "Alpine", color: "2293D1" },
  { number: 7, name: "Franco Colapinto", acronym: "COL", team: "Alpine", color: "2293D1" },
  { number: 77, name: "Valtteri Bottas", acronym: "BOT", team: "Cadillac", color: "909090" },
  { number: 11, name: "Sergio Pérez", acronym: "PER", team: "Cadillac", color: "909090" },
];

const GPS = [
  { id: "AUS", name: "Australian GP", flag: "🇦🇺", date: "6-8 Mar" },
  { id: "CHN", name: "Chinese GP", flag: "🇨🇳", date: "13-15 Mar" },
  { id: "JPN", name: "Japanese GP", flag: "🇯🇵", date: "27-29 Mar" },
  { id: "MIA", name: "Miami GP", flag: "🇺🇸", date: "1-3 May" },
];

const SESSIONS = [
  { id: "FP1", label: "FP1", icon: "🔧" },
  { id: "FP2", label: "FP2", icon: "🔧" },
  { id: "FP3", label: "FP3", icon: "🔧" },
  { id: "Q", label: "Qualifying", icon: "⚡" },
  { id: "SQ", label: "Sprint Q", icon: "⚡" },
  { id: "RACE", label: "Race", icon: "🏁" },
];

// ── Types ────────────────────────────────────────────────────────────────────
interface TelemetryData {
  time: number[];
  speed: number[];
  rpm: number[];
  gear: number[];
  throttle: number[];
  brake: number[];
  drs: number[];
  distance: number[];
  gX: number[];
  gY: number[];
}

interface WeatherData {
  air_temp?: number;
  track_temp?: number;
  rainfall?: number;
  humidity?: number;
  wind_speed?: number;
}

interface LapInfo {
  number: string;
  time: string | null;
  sector1Time: string | null;
  sector2Time: string | null;
  sector3Time: string | null;
  sector1Green: boolean | null;
  sector2Green: boolean | null;
  sector3Green: boolean | null;
  tire?: string;
}

interface DriverTelemetry {
  driver: (typeof DRIVERS)[0];
  telemetry: TelemetryData | null;
  weather: WeatherData | null;
  laps: LapInfo[];
  hasData: boolean;
  lapTimes: Record<string, string | null>;
}

// ── API Fetchers ──────────────────────────────────────────────────────────────
async function fetchGitHubJson(url: string): Promise<any> {
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

async function fetchDriverData(
  gpId: string,
  sessionId: string,
  driverAcronym: string
): Promise<{
  tel: TelemetryData;
  weather: WeatherData;
  laps: LapInfo[];
  lapTimes: Record<string, string | null>;
} | null> {
  const GP_MAP: Record<string, string> = {
    AUS: "Australian Grand Prix",
    CHN: "Chinese Grand Prix",
    JPN: "Japanese Grand Prix",
    MIA: "Miami Grand Prix",
  };
  const SESSION_MAP: Record<string, string> = {
    FP1: "Practice 1",
    FP2: "Practice 2",
    FP3: "Practice 3",
    Q: "Qualifying",
    SQ: "Sprint Qualifying",
    RACE: "Race",
  };

  const gpName = GP_MAP[gpId];
  const sessionName = SESSION_MAP[sessionId];
  if (!gpName || !sessionName) return null;

  const driversUrl = `https://api.github.com/repos/TracingInsights/2026/contents/${encodeURIComponent(gpName)}/${encodeURIComponent(sessionName)}/${driverAcronym}?ref=main`;
  const driversRes = await fetch(driversUrl, { next: { revalidate: 60 } });
  if (!driversRes.ok) return null;

  let files: any[] = await driversRes.json();
  if (!Array.isArray(files)) files = [];

  const telFiles = files.filter((f: any) => f.name.endsWith("_tel.json"));
  if (telFiles.length === 0) return null;

  // Collect all laps info
  const lapTimes: Record<string, string | null> = {};
  const laps: LapInfo[] = [];

  // Fetch all lap files for this driver
  const allFetches = telFiles.map(async (f: any) => {
    const lapNum = f.name.replace("_tel.json", "");
    try {
      const data = await fetchGitHubJson(f.download_url);
      if (data) {
        lapTimes[f.name.replace("_tel.json", "")] = data.lap_time || null;
        laps.push({
          number: lapNum,
          time: data.lap_time || null,
          sector1Time: data.sector_1_time || null,
          sector2Time: data.sector_2_time || null,
          sector3Time: data.sector_3_time || null,
          sector1Green: data.sector_1_green ?? null,
          sector2Green: data.sector_2_green ?? null,
          sector3Green: data.sector_3_green ?? null,
          tire: data.tire || undefined,
        });
      }
    } catch {}
  });

  await Promise.all(allFetches);

  // Sort laps by number descending
  laps.sort((a, b) => parseInt(b.number) - parseInt(a.number));

  // Get most recent lap for main telemetry
  const lastFile = telFiles[telFiles.length - 1];
  const telData = await fetchGitHubJson(lastFile.download_url);
  if (!telData?.tel) return null;

  const tel = telData.tel;
  return {
    tel: {
      time: tel.time || [],
      speed: tel.speed || [],
      rpm: tel.rpm || [],
      gear: tel.gear || [],
      throttle: tel.throttle || [],
      brake: tel.brake || [],
      drs: tel.drs || [],
      distance: tel.distance || [],
      gX: tel.acc_x || [],
      gY: tel.acc_y || [],
    },
    weather: telData.weather || {},
    laps,
    lapTimes,
  };
}

// ── Fake data generator ──────────────────────────────────────────────────────
function generateFakeTelemetry(): { tel: TelemetryData; weather: WeatherData; laps: LapInfo[]; lapTimes: Record<string, string | null> } {
  const points = 120;
  const time: number[] = [];
  const speed: number[] = [];
  const rpm: number[] = [];
  const gear: number[] = [];
  const throttle: number[] = [];
  const brake: number[] = [];
  const drs: number[] = [];
  const distance: number[] = [];
  const gX: number[] = [];
  const gY: number[] = [];

  let t = 0;
  for (let i = 0; i < points; i++) {
    const progress = i / points;
    time.push(t);
    distance.push(progress * 5500);
    const s = 180 + Math.sin(progress * Math.PI * 6) * 50 + Math.random() * 20;
    speed.push(Math.max(60, s));
    rpm.push(8000 + Math.sin(progress * Math.PI * 8) * 4000 + Math.random() * 500);
    gear.push(Math.max(1, Math.min(8, Math.floor(progress * 8) % 8 + 1)));
    throttle.push(Math.max(0, Math.min(100, 60 + Math.sin(progress * Math.PI * 4) * 40 + Math.random() * 10)));
    brake.push(Math.max(0, Math.min(100, Math.sin(progress * Math.PI * 2.5 + 0.5) * 25)));
    drs.push(progress > 0.15 && progress < 0.85 ? 1 : 0);
    gX.push(Math.sin(progress * Math.PI * 6) * 2.5 + Math.random() * 0.5);
    gY.push(Math.cos(progress * Math.PI * 5) * 1.8 + Math.random() * 0.3);
    t += 0.5 + Math.random() * 0.3;
  }

  const sector1Time = "32.847";
  const sector2Time = "41.293";
  const sector3Time = "28.551";

  const laps: LapInfo[] = Array.from({ length: 20 }, (_, i) => ({
    number: String(20 - i),
    time: i === 0 ? "1:42.691" : `1:${42 + i}:${691 + i * 3}`,
    sector1Time,
    sector2Time,
    sector3Time,
    sector1Green: i < 5 ? null : i < 10 ? true : false,
    sector2Green: i < 3 ? null : i < 8 ? false : true,
    sector3Green: i < 7 ? null : i < 12 ? true : false,
    tire: i < 5 ? "MEDIUM" : i < 15 ? "HARD" : "SOFT",
  }));

  const lapTimes: Record<string, string | null> = {};
  laps.forEach((l) => { lapTimes[l.number] = l.time; });

  return {
    tel: { time, speed, rpm, gear, throttle, brake, drs, distance, gX, gY },
    weather: { air_temp: 24.5, track_temp: 38.2, rainfall: 0, humidity: 62, wind_speed: 8 },
    laps,
    lapTimes,
  };
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function formatLapTime(t: string | null | undefined): string {
  if (!t) return "--";
  if (t.includes(":")) return t;
  // Assume seconds
  const s = parseFloat(t);
  if (isNaN(s)) return t;
  const mins = Math.floor(s / 60);
  const secs = (s % 60).toFixed(3);
  return `${mins}:${secs.padStart(6, "0")}`;
}

function formatSector(t: string | null | undefined): string {
  if (!t) return "--";
  const s = parseFloat(t);
  if (isNaN(s)) return t;
  return s.toFixed(3);
}

// ── SVG Chart Components ─────────────────────────────────────────────────────
function MiniTrace({
  data,
  color,
  height = 40,
}: {
  data: number[];
  color: string;
  height?: number;
}) {
  if (!data || data.length < 2) return <div className={`h-[${height}px]`} />;
  const WIDTH = 200;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * WIDTH;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${WIDTH} ${height}`} className="w-full" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={`#${color}`} strokeWidth="1.5" />
    </svg>
  );
}

function SpeedChart({
  data,
  color,
  driver,
  lap,
  onHover,
}: {
  data: TelemetryData;
  color: string;
  driver: (typeof DRIVERS)[0];
  lap: string;
  onHover: (info: { x: number; speed: number; throttle: number; brake: number; gear: number; dist: number } | null) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; speed: number; throttle: number; brake: number; gear: number; dist: number } | null>(null);

  if (!data.speed || data.speed.length === 0) return null;

  const WIDTH = 400;
  const HEIGHT = 100;
  const maxSpeed = Math.max(...data.speed);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = x / rect.width;
    const idx = Math.min(Math.max(0, Math.floor(ratio * data.speed.length)), data.speed.length - 1);
    setTooltip({
      x: e.clientX - rect.left,
      speed: data.speed[idx] || 0,
      throttle: data.throttle[idx] || 0,
      brake: data.brake[idx] || 0,
      gear: data.gear[idx] || 0,
      dist: data.distance[idx] || 0,
    });
    onHover(tooltip);
  };

  const points = data.speed.map((v, i) => {
    const x = (i / (data.speed.length - 1)) * WIDTH;
    const y = HEIGHT - (v / (maxSpeed * 1.1)) * HEIGHT;
    return { x, y, v };
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaD = `${pathD} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`;

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `#${color}` }} />
          <span className="text-xs font-bold tracking-wider">{driver.acronym}</span>
          <span className="text-[10px] text-[#8e8e93]">{driver.name.split(" ").slice(-1)[0]}</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-[#8e8e93]">Lap {lap}</span>
          <span className="font-mono text-[#00ff94]">{maxSpeed.toFixed(0)} <span className="text-[#8e8e93]">km/h</span></span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full cursor-crosshair"
          preserveAspectRatio="none"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTooltip(null)}
        >
          <defs>
            <linearGradient id={`spd-${driver.acronym}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={`#${color}`} stopOpacity="0.05" />
              <stop offset="30%" stopColor={`#${color}`} stopOpacity="0.7" />
              <stop offset="70%" stopColor={`#${color}`} stopOpacity="0.7" />
              <stop offset="100%" stopColor={`#${color}`} stopOpacity="0.05" />
            </linearGradient>
            <filter id={`glow-${driver.acronym}`}>
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((p) => {
            const y = HEIGHT - (p / 100) * HEIGHT;
            return <line key={p} x1="0" y1={y} x2={WIDTH} y2={y} stroke="#38383a" strokeWidth="0.5" strokeDasharray="2,4" />;
          })}
          <path d={areaD} fill={`url(#spd-${driver.acronym})`} />
          <path d={pathD} fill="none" stroke={`#${color}`} strokeWidth="2" filter={`url(#glow-${driver.acronym})`} />
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute top-1 left-1/2 -translate-x-1/2 bg-black/90 border border-[#38383a] rounded-lg px-2 py-1 text-[9px] font-mono pointer-events-none z-10 whitespace-nowrap"
            style={{ top: "-28px" }}
          >
            <span className="text-[#8e8e93]">{tooltip.dist.toFixed(0)}m</span>
            <span className="mx-1 text-[#636366]">|</span>
            <span style={{ color: `#${color}` }}>{tooltip.speed.toFixed(0)} km/h</span>
            <span className="mx-1 text-[#636366]">|</span>
            <span className="text-[#00ff94]">T:{tooltip.throttle.toFixed(0)}%</span>
            <span className="mx-1 text-[#636366]">|</span>
            <span className="text-red-400">B:{tooltip.brake.toFixed(0)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ThrottleBrakeChart({
  telemetry,
  color,
}: {
  telemetry: TelemetryData;
  color: string;
}) {
  if (!telemetry.throttle || telemetry.throttle.length === 0) return null;

  const WIDTH = 400;
  const HEIGHT = 50;
  const count = telemetry.throttle.length;

  const throttlePath = telemetry.throttle.map((v, i) => {
    const x = (i / (count - 1)) * WIDTH;
    const y = HEIGHT - (v / 100) * HEIGHT;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" L");

  const brakePath = telemetry.brake.map((v, i) => {
    const x = (i / (count - 1)) * WIDTH;
    const y = HEIGHT - (v / 100) * HEIGHT;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" L");

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] uppercase tracking-widest text-[#636366] font-semibold">Throttle / Brake</span>
        <div className="flex items-center gap-2 text-[9px]">
          <span className="text-[#00ff94]">● Throttle</span>
          <span className="text-red-400">● Brake</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" preserveAspectRatio="none">
        {/* Grid */}
        <line x1="0" y1={HEIGHT / 2} x2={WIDTH} y2={HEIGHT / 2} stroke="#38383a" strokeWidth="0.5" strokeDasharray="2,4" />
        <polyline points={throttlePath} fill="none" stroke="#00ff94" strokeWidth="1.5" />
        <polyline points={brakePath} fill="none" stroke="#ff3b30" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function GearRpmChart({
  telemetry,
  color,
}: {
  telemetry: TelemetryData;
  color: string;
}) {
  if (!telemetry.gear || telemetry.gear.length === 0) return null;

  const WIDTH = 400;
  const HEIGHT = 50;
  const count = telemetry.gear.length;

  const gearPath = telemetry.gear.map((v, i) => {
    const x = (i / (count - 1)) * WIDTH;
    const y = HEIGHT - ((v - 1) / 7) * HEIGHT;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" L");

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] uppercase tracking-widest text-[#636366] font-semibold">Gear</span>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
            <span key={g} className="text-[8px] text-[#636366] font-mono w-3 text-center">{g}</span>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" preserveAspectRatio="none">
        <polyline points={gearPath} fill="none" stroke={`#${color}`} strokeWidth="2" />
      </svg>
    </div>
  );
}

function GForceChart({
  telemetry,
  color,
}: {
  telemetry: TelemetryData;
  color: string;
}) {
  if (!telemetry.gX || telemetry.gX.length === 0) return null;

  const WIDTH = 400;
  const HEIGHT = 50;
  const count = telemetry.gX.length;

  const gXNorm = telemetry.gX.map((v) => Math.max(-3, Math.min(3, v)));
  const gYNorm = telemetry.gY.map((v) => Math.max(-3, Math.min(3, v)));
  const combined = gXNorm.map((gx, i) => Math.sqrt(gx * gx + (gYNorm[i] || 0) ** 2));
  const maxG = Math.max(...combined);

  const path = combined.map((v, i) => {
    const x = (i / (count - 1)) * WIDTH;
    const y = HEIGHT - (v / (maxG * 1.2)) * HEIGHT;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" L");

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] uppercase tracking-widest text-[#636366] font-semibold">G-Force</span>
        <span className="text-[10px] font-mono text-[#00ff94]">{maxG.toFixed(2)} G</span>
      </div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" preserveAspectRatio="none">
        <line x1="0" y1={HEIGHT / 2} x2={WIDTH} y2={HEIGHT / 2} stroke="#38383a" strokeWidth="0.5" strokeDasharray="2,4" />
        <polyline points={path} fill="none" stroke={`#${color}`} strokeWidth="1.5" />
      </svg>
    </div>
  );
}

// ── Lap Row Component ─────────────────────────────────────────────────────────
function LapRow({
  lap,
  isSelected,
  hasData,
  onClick,
  driverColor,
}: {
  lap: LapInfo;
  isSelected: boolean;
  hasData: boolean;
  onClick: () => void;
  driverColor: string;
}) {
  const sectorColor = (green: boolean | null) => {
    if (green === true) return "text-[#00ff94]";
    if (green === false) return "text-red-400";
    return "text-[#8e8e93]";
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono transition-colors ${
        isSelected
          ? "bg-[#2c2c2e] ring-1 ring-[#00ff94]/40"
          : "hover:bg-[#2c2c2e]/50"
      }`}
    >
      {/* Lap number */}
      <span className="w-6 text-[#636366] text-center">{lap.number}</span>

      {/* Lap time */}
      <span className={`w-16 text-center font-semibold ${hasData ? "text-white" : "text-[#636366]"}`}>
        {formatLapTime(lap.time)}
      </span>

      {/* Sector dividers */}
      <span className="w-px h-3 bg-[#38383a] mx-0.5" />

      {/* S1 */}
      <span className={`w-12 text-right ${sectorColor(lap.sector1Green)}`}>
        {formatSector(lap.sector1Time)}
      </span>

      {/* S2 */}
      <span className={`w-12 text-right ${sectorColor(lap.sector2Green)}`}>
        {formatSector(lap.sector2Time)}
      </span>

      {/* S3 */}
      <span className={`w-12 text-right ${sectorColor(lap.sector3Green)}`}>
        {formatSector(lap.sector3Time)}
      </span>

      {/* Tire */}
      {lap.tire && (
        <span className="ml-auto text-[8px] text-[#636366]">{lap.tire}</span>
      )}

      {/* Indicator */}
      {isSelected && (
        <div className="w-1.5 h-1.5 rounded-full ml-1" style={{ backgroundColor: `#${driverColor}` }} />
      )}
    </button>
  );
}

// ── Driver Card ───────────────────────────────────────────────────────────────
function DriverCard({
  driver,
  isSelected,
  hasData,
  onClick,
}: {
  driver: (typeof DRIVERS)[0];
  isSelected: boolean;
  hasData: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all ${
        isSelected
          ? "bg-[#2c2c2e] ring-1 ring-[#00ff94]/40"
          : "bg-[#1c1c1e] hover:bg-[#2c2c2e]"
      }`}
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
        style={{ backgroundColor: `#${driver.color}30`, color: `#${driver.color}` }}
      >
        {driver.acronym}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate leading-tight">{driver.name}</p>
        <p className="text-[9px] text-[#636366] truncate">{driver.team}</p>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        {hasData && <div className="w-1.5 h-1.5 rounded-full bg-[#00ff94]" />}
        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white/30" />}
      </div>
    </button>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function TelemetryPage() {
  const [selectedGP, setSelectedGP] = useState("AUS");
  const [selectedSession, setSelectedSession] = useState("RACE");
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>(["NOR", "HAM"]);
  const [selectedLaps, setSelectedLaps] = useState<Record<string, string>>({});
  const [driverData, setDriverData] = useState<Record<string, DriverTelemetry>>({});
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<Record<string, "real" | "fake">>({});
  const [lapListMode, setLapListMode] = useState<"list" | "grid">("list");

  const loadDriverData = useCallback(async (gp: string, session: string, acronym: string) => {
    const result = await fetchDriverData(gp, session, acronym);

    if (result) {
      const latestLap = result.laps[0]?.number || "1";
      setSelectedLaps((prev) => ({ ...prev, [acronym]: latestLap }));
      setDriverData((prev) => ({
        ...prev,
        [acronym]: {
          driver: DRIVERS.find((d) => d.acronym === acronym)!,
          telemetry: result.tel,
          weather: result.weather,
          laps: result.laps,
          hasData: true,
          lapTimes: result.lapTimes,
        },
      }));
      setDataSource((prev) => ({ ...prev, [acronym]: "real" }));
    } else {
      const fake = generateFakeTelemetry();
      const latestLap = fake.laps[0]?.number || "1";
      setSelectedLaps((prev) => ({ ...prev, [acronym]: latestLap }));
      setDriverData((prev) => ({
        ...prev,
        [acronym]: {
          driver: DRIVERS.find((d) => d.acronym === acronym)!,
          telemetry: fake.tel,
          weather: fake.weather,
          laps: fake.laps,
          hasData: false,
          lapTimes: fake.lapTimes,
        },
      }));
      setDataSource((prev) => ({ ...prev, [acronym]: "fake" }));
    }
  }, []);

  useEffect(() => {
    setDriverData({});
    setDataSource({});
    setSelectedLaps({});
    setLoading(true);

    const loadAll = selectedDrivers.map((acronym) =>
      loadDriverData(selectedGP, selectedSession, acronym)
    );

    Promise.all(loadAll).finally(() => setLoading(false));
  }, [selectedGP, selectedSession, selectedDrivers, loadDriverData]);

  const toggleDriver = (acronym: string) => {
    setSelectedDrivers((prev) => {
      if (prev.includes(acronym)) {
        const next = prev.filter((a) => a !== acronym);
        const removed = prev.find((a) => a === acronym)!;
        setSelectedLaps((p) => {
          const n = { ...p };
          delete n[removed];
          return n;
        });
        return next;
      }
      if (prev.length >= 4) {
        const removed = prev[0];
        setSelectedLaps((p) => {
          const n = { ...p };
          delete n[removed];
          return n;
        });
        return [...prev.slice(1), acronym];
      }
      return [...prev, acronym];
    });
  };

  const selectLap = (acronym: string, lapNumber: string) => {
    setSelectedLaps((prev) => ({ ...prev, [acronym]: lapNumber }));
  };

  const selectedGPData = GPS.find((g) => g.id === selectedGP)!;

  // Find fastest lap across selected drivers for reference
  const fastestLap = Object.entries(driverData).reduce<{ time: string; driver: string } | null>((best, [acronym, data]) => {
    if (!data.hasData) return best;
    const fastest = data.laps.find((l) => l.time);
    if (!fastest?.time) return best;
    if (!best) return { time: fastest.time, driver: acronym };
    return best;
  }, null);

  return (
    <div className="min-h-full px-3 pt-14 pb-4">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-base">📊</span>
          <h1 className="text-lg font-bold tracking-tight">Telemetry</h1>
          <span className="text-[10px] bg-[#00ff94]/20 text-[#00ff94] px-1.5 py-0.5 rounded font-semibold">
            2026
          </span>
        </div>
        <p className="text-[#8e8e93] text-xs">
          {selectedGPData.flag} {selectedGPData.name} · {SESSIONS.find((s) => s.id === selectedSession)?.label}
        </p>
      </div>

      {/* ── GP Selector ─────────────────────────────────────────────────── */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-2">
        {GPS.map((gp) => (
          <button
            key={gp.id}
            onClick={() => setSelectedGP(gp.id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedGP === gp.id
                ? "bg-[#00ff94] text-black shadow-[0_0_12px_rgba(0,255,148,0.3)]"
                : "bg-[#2c2c2e] text-[#8e8e93] hover:text-white"
            }`}
          >
            <span>{gp.flag}</span>
            <span>{gp.id}</span>
          </button>
        ))}
      </div>

      {/* ── Session Selector ───────────────────────────────────────────── */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-3">
        {SESSIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSession(s.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedSession === s.id
                ? "bg-white text-black"
                : "bg-[#2c2c2e] text-[#8e8e93] hover:text-white"
            }`}
          >
            <span>{s.icon}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* ── Driver Pills (selected) ─────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mb-3">
        {selectedDrivers.map((acronym) => {
          const d = driverData[acronym];
          const color = d?.driver.color || "666666";
          const source = dataSource[acronym];
          return (
            <div
              key={acronym}
              className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap"
              style={{ backgroundColor: `#${color}20`, color: `#${color}` }}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: `#${color}` }} />
              {acronym}
              <span className={`ml-0.5 ${source === "real" ? "text-[#00ff94]/70" : "text-[#ff9500]/70"}`}>
                {source === "real" ? "●" : "◐"}
              </span>
            </div>
          );
        })}
        {fastestLap && (
          <div className="ml-auto text-[9px] text-[#636366] flex items-center gap-1">
            <span>Best:</span>
            <span className="text-[#00ff94] font-mono">{formatLapTime(fastestLap.time)}</span>
            <span className="text-[#8e8e93]">{fastestLap.driver}</span>
          </div>
        )}
      </div>

      {/* ── Speed Charts ────────────────────────────────────────────────── */}
      <div className="card p-3 mb-3">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-3 bg-[#2c2c2e] rounded mb-2 w-1/3" />
                <div className="h-[100px] bg-[#2c2c2e] rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {selectedDrivers.map((acronym) => {
              const data = driverData[acronym];
              if (!data?.telemetry) return null;
              const lap = selectedLaps[acronym] || data.laps[0]?.number || "1";
              return (
                <SpeedChart
                  key={acronym}
                  data={data.telemetry}
                  color={data.driver.color}
                  driver={data.driver}
                  lap={lap}
                  onHover={() => {}}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* ── Throttle/Brake & Gear ────────────────────────────────────────── */}
      {selectedDrivers.length === 1 && driverData[selectedDrivers[0]]?.telemetry && (
        <div className="card p-3 mb-3 space-y-3">
          <ThrottleBrakeChart
            telemetry={driverData[selectedDrivers[0]].telemetry!}
            color={driverData[selectedDrivers[0]].driver.color}
          />
          <div className="border-t border-[#38383a]/50 pt-3">
            <GearRpmChart
              telemetry={driverData[selectedDrivers[0]].telemetry!}
              color={driverData[selectedDrivers[0]].driver.color}
            />
          </div>
          <div className="border-t border-[#38383a]/50 pt-3">
            <GForceChart
              telemetry={driverData[selectedDrivers[0]].telemetry!}
              color={driverData[selectedDrivers[0]].driver.color}
            />
          </div>
        </div>
      )}

      {/* ── Lap List ────────────────────────────────────────────────────── */}
      {selectedDrivers.length > 0 && (
        <div className="card p-3 mb-3">
          {/* Column headers */}
          <div className="flex items-center gap-1 px-2 mb-1.5 text-[8px] uppercase tracking-widest text-[#636366] font-semibold">
            <span className="w-6 text-center">Lap</span>
            <span className="w-16 text-center">Time</span>
            <span className="w-px h-3 bg-[#38383a] mx-0.5" />
            <span className="w-12 text-right">S1</span>
            <span className="w-12 text-right">S2</span>
            <span className="w-12 text-right">S3</span>
            <span className="ml-auto" />
          </div>

          {/* Sector legend */}
          <div className="flex items-center gap-2 px-2 mb-2 text-[8px]">
            <span className="text-[#00ff94]">● Green = personal best sector</span>
            <span className="text-red-400">● Red = slower sector</span>
          </div>

          {/* Per-driver lap lists */}
          {selectedDrivers.map((acronym) => {
            const data = driverData[acronym];
            if (!data?.laps?.length) return null;
            const currentLap = selectedLaps[acronym] || data.laps[0]?.number;

            return (
              <div key={acronym} className="mb-2 last:mb-0">
                {/* Driver label */}
                <div className="flex items-center gap-1.5 px-2 py-0.5 mb-1 rounded" style={{ backgroundColor: `#${data.driver.color}15` }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: `#${data.driver.color}` }} />
                  <span className="text-[9px] font-bold" style={{ color: `#${data.driver.color}` }}>{acronym}</span>
                  <span className="text-[8px] text-[#636366]">{data.driver.name.split(" ").slice(-1)[0]}</span>
                </div>

                {/* Laps */}
                <div className="space-y-0.5 max-h-48 overflow-y-auto">
                  {data.laps.slice(0, 25).map((lap) => (
                    <LapRow
                      key={`${acronym}-${lap.number}`}
                      lap={lap}
                      isSelected={currentLap === lap.number}
                      hasData={data.hasData}
                      onClick={() => selectLap(acronym, lap.number)}
                      driverColor={data.driver.color}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Weather ─────────────────────────────────────────────────────── */}
      {selectedDrivers.length === 1 && driverData[selectedDrivers[0]]?.weather && (
        <div className="card p-3 mb-3">
          <p className="text-[9px] uppercase tracking-widest text-[#636366] font-semibold mb-2">
            🌤️ Weather
          </p>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(driverData[selectedDrivers[0]]?.weather || {}).map(([key, value]) => (
              <div key={key} className="flex flex-col items-center py-1">
                <span className="text-[8px] text-[#636366] capitalize">{key.replace(/_/g, " ")}</span>
                <span className="text-xs font-mono text-white">
                  {typeof value === "number" ? value.toFixed(1) : String(value)}
                  {key.includes("temp") ? "°C" : key.includes("speed") ? " km/h" : key.includes("humidity") ? "%" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Driver Grid ─────────────────────────────────────────────────── */}
      <div className="card p-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[9px] uppercase tracking-widest text-[#636366] font-semibold">
            Compare ({selectedDrivers.length}/4)
          </p>
          <div className="flex gap-1">
            {["list", "grid"].map((mode) => (
              <button
                key={mode}
                onClick={() => setLapListMode(mode as "list" | "grid")}
                className={`text-[9px] px-1.5 py-0.5 rounded ${
                  lapListMode === mode ? "bg-[#00ff94]/20 text-[#00ff94]" : "text-[#636366]"
                }`}
              >
                {mode === "list" ? "☰" : "⊞"}
              </button>
            ))}
          </div>
        </div>
        <div className={`grid gap-1.5 ${lapListMode === "grid" ? "grid-cols-2" : "grid-cols-1"}`}>
          {DRIVERS.map((driver) => (
            <DriverCard
              key={driver.acronym}
              driver={driver}
              isSelected={selectedDrivers.includes(driver.acronym)}
              hasData={driverData[driver.acronym]?.hasData || false}
              onClick={() => toggleDriver(driver.acronym)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
