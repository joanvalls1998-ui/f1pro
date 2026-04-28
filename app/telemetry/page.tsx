"use client";

import { useState, useEffect, useCallback } from "react";

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
  { id: "MIA", name: "Miami GP", flag: "🇺🇸", date: "1-3 Maig" },
];

const SESSIONS = [
  { id: "FP1", label: "FP1", icon: "🏎️" },
  { id: "FP2", label: "FP2", icon: "🏎️" },
  { id: "FP3", label: "FP3", icon: "🏎️" },
  { id: "Q", label: "Qualy", icon: "🔴" },
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

interface DriverTelemetry {
  driver: (typeof DRIVERS)[0];
  telemetry: TelemetryData | null;
  weather: WeatherData | null;
  lapNumber: string;
  lapTime: string | null;
  hasData: boolean;
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
): Promise<{ tel: TelemetryData; weather: WeatherData; lap: string; time: string | null } | null> {
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

  // Fetch driver list for this session to find lap files
  const driversUrl = `https://api.github.com/repos/TracingInsights/2026/contents/${encodeURIComponent(gpName)}/${encodeURIComponent(sessionName)}/${driverAcronym}?ref=main`;
  const driversRes = await fetch(driversUrl, { next: { revalidate: 60 } });
  if (!driversRes.ok) return null;

  const files: any[] = await driversRes.json();
  const telFiles = files.filter((f: any) => f.name.endsWith("_tel.json"));
  if (telFiles.length === 0) return null;

  // Get most recent lap (last file)
  const lastFile = telFiles[telFiles.length - 1];
  const lapNum = lastFile.name.replace("_tel.json", "");

  // Fetch tel + weather
  const [telData, weatherData] = await Promise.all([
    fetchGitHubJson(lastFile.download_url),
    fetchGitHubJson(
      `https://raw.githubusercontent.com/TracingInsights/2026/main/${encodeURIComponent(gpName)}/${encodeURIComponent(sessionName)}/${driverAcronym}/weather.json`
    ),
  ]);

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
    weather: weatherData || {},
    lap: lapNum,
    time: telData.lap_time || null,
  };
}

// ── Fake data generator (for when no real data) ──────────────────────────────
function generateFakeTelemetry(): TelemetryData {
  const points = 80;
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
    distance.push(progress * 100);
    speed.push(180 + Math.sin(progress * Math.PI * 6) * 40 + Math.random() * 15);
    rpm.push(8000 + Math.sin(progress * Math.PI * 8) * 4000 + Math.random() * 500);
    gear.push(Math.floor(progress * 8) % 8 + 1);
    throttle.push(Math.max(0, Math.min(100, 60 + Math.sin(progress * Math.PI * 4) * 40)));
    brake.push(Math.max(0, Math.sin(progress * Math.PI * 2) * 30));
    drs.push(progress > 0.2 && progress < 0.8 ? 1 : 0);
    gX.push(Math.sin(progress * Math.PI * 6) * 2);
    gY.push(Math.cos(progress * Math.PI * 5) * 1.5);
    t += 0.5 + Math.random() * 0.3;
  }

  return { time, speed, rpm, gear, throttle, brake, drs, distance, gX, gY };
}

// ── Visualization components ─────────────────────────────────────────────────
function TraceChart({
  data,
  color,
  label,
  unit,
  maxVal = 400,
}: {
  data: number[];
  color: string;
  label: string;
  unit: string;
  maxVal?: number;
}) {
  if (!data || data.length === 0) return null;

  const WIDTH = 300;
  const HEIGHT = 50;
  const padding = 2;

  const maxData = Math.max(...data);
  const minData = Math.min(...data);
  const range = maxData - minData || 1;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (WIDTH - padding * 2);
    const y = HEIGHT - padding - ((v - minData) / range) * (HEIGHT - padding * 2);
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (WIDTH - padding * 2);
    const y = HEIGHT - padding - ((v - minData) / range) * (HEIGHT - padding * 2);
    return `${x},${y}`;
  }).join(" ") + ` ${WIDTH - padding},${HEIGHT} ${padding},${HEIGHT}`;

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-[#636366] uppercase tracking-wider">{label}</span>
        <span className="text-[10px] font-mono text-[#00ff94]">{maxData.toFixed(0)} {unit}</span>
      </div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={`#${color}`} stopOpacity="0.1" />
            <stop offset="50%" stopColor={`#${color}`} stopOpacity="0.6" />
            <stop offset="100%" stopColor={`#${color}`} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill={`url(#grad-${label})`} />
        <polyline points={points} fill="none" stroke={`#${color}`} strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function SpeedTraceChart({
  data,
  color,
  driver,
}: {
  data: TelemetryData;
  color: string;
  driver: (typeof DRIVERS)[0];
}) {
  if (!data.speed || data.speed.length === 0) return null;

  const WIDTH = 300;
  const HEIGHT = 70;

  const maxSpeed = Math.max(...data.speed);

  const points = data.speed.map((v, i) => {
    const x = (i / (data.speed.length - 1)) * WIDTH;
    const y = HEIGHT - (v / 350) * HEIGHT;
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = `${points} ${WIDTH},${HEIGHT} 0,${HEIGHT}`;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `#${color}` }} />
          <span className="text-xs font-bold">{driver.acronym}</span>
          <span className="text-[10px] text-[#636366]">{driver.name.split(" ").pop()}</span>
        </div>
        <span className="text-xs font-mono text-[#00ff94]">{maxSpeed.toFixed(0)} km/h</span>
      </div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`spd-${driver.number}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={`#${color}`} stopOpacity="0.1" />
            <stop offset="50%" stopColor={`#${color}`} stopOpacity="0.8" />
            <stop offset="100%" stopColor={`#${color}`} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill={`url(#spd-${driver.number})`} />
        <polyline points={points} fill="none" stroke={`#${color}`} strokeWidth="2" />
      </svg>
    </div>
  );
}

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
      aria-label={`${driver.name} - ${driver.team}`}
      className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all ${
        isSelected
          ? "bg-[#2c2c2e] ring-1 ring-[#00ff94]/50"
          : "bg-[#1c1c1e]"
      }`}
    >
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold"
        style={{ backgroundColor: `#${driver.color}30`, color: `#${driver.color}` }}
      >
        {driver.acronym}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{driver.name.split(" ")[0]}</p>
        <p className="text-[10px] text-[#636366]">{driver.team}</p>
      </div>
      {hasData && (
        <div className="w-2 h-2 rounded-full bg-[#00ff94]" />
      )}
      {isSelected && (
        <div className="w-2 h-2 rounded-full bg-[#00ff94]" />
      )}
    </button>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function TelemetryPage() {
  const [selectedGP, setSelectedGP] = useState("AUS");
  const [selectedSession, setSelectedSession] = useState("RACE");
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>(["NOR", "HAM"]);
  const [driverData, setDriverData] = useState<Record<string, DriverTelemetry>>({});
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<Record<string, "real" | "fake">>({});

  const loadDriverData = useCallback(async (gp: string, session: string, acronym: string) => {
    const result = await fetchDriverData(gp, session, acronym);

    if (result) {
      setDriverData((prev) => ({
        ...prev,
        [acronym]: {
          driver: DRIVERS.find((d) => d.acronym === acronym)!,
          telemetry: result.tel,
          weather: result.weather,
          lapNumber: result.lap,
          lapTime: result.time,
          hasData: true,
        },
      }));
      setDataSource((prev) => ({ ...prev, [acronym]: "real" }));
    } else {
      // Fall back to fake data
      const fake = generateFakeTelemetry();
      setDriverData((prev) => ({
        ...prev,
        [acronym]: {
          driver: DRIVERS.find((d) => d.acronym === acronym)!,
          telemetry: fake,
          weather: {},
          lapNumber: "?",
          lapTime: null,
          hasData: false,
        },
      }));
      setDataSource((prev) => ({ ...prev, [acronym]: "fake" }));
    }
  }, []);

  useEffect(() => {
    setDriverData({});
    setDataSource({});
    setLoading(true);

    const loadAll = selectedDrivers.map((acronym) =>
      loadDriverData(selectedGP, selectedSession, acronym)
    );

    Promise.all(loadAll).finally(() => setLoading(false));
  }, [selectedGP, selectedSession, selectedDrivers, loadDriverData]);

  const toggleDriver = (acronym: string) => {
    setSelectedDrivers((prev) => {
      if (prev.includes(acronym)) {
        return prev.filter((a) => a !== acronym);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), acronym];
      }
      return [...prev, acronym];
    });
  };

  const selectedGPData = GPS.find((g) => g.id === selectedGP)!;

  return (
    <div className="min-h-full px-4 pt-16 pb-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold">Telemetria</h1>
        <p className="text-[#8e8e93] text-sm">Dades reals · {selectedGPData.flag} {selectedGPData.name}</p>
      </div>

      {/* GP Selector */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
        {GPS.map((gp) => (
          <button
            key={gp.id}
            onClick={() => setSelectedGP(gp.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedGP === gp.id
                ? "bg-[#00ff94] text-black"
                : "bg-[#2c2c2e] text-[#8e8e93]"
            }`}
          >
            <span>{gp.flag}</span>
            <span>{gp.name}</span>
          </button>
        ))}
      </div>

      {/* Session Selector */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
        {SESSIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSession(s.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedSession === s.id
                ? "bg-[#00ff94] text-black"
                : "bg-[#2c2c2e] text-[#8e8e93]"
            }`}
          >
            <span>{s.icon}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Data source badge */}
      <div className="flex items-center gap-2 mb-4">
        {selectedDrivers.map((acronym) => (
          <div
            key={acronym}
            className={`text-[10px] px-2 py-0.5 rounded-full ${
              dataSource[acronym] === "real"
                ? "bg-[#00ff94]/20 text-[#00ff94]"
                : "bg-[#ff9500]/20 text-[#ff9500]"
            }`}
          >
            {DRIVERS.find((d) => d.acronym === acronym)?.name.split(" ").pop()}:{" "}
            {dataSource[acronym] === "real" ? "REAL" : "SIMULAT"}
          </div>
        ))}
      </div>

      {/* Speed Traces */}
      <div className="card p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold">
            Speed Trace
          </p>
          <div className="flex items-center gap-1 text-[10px] text-[#636366]">
            <span>↑</span>
            <span>350</span>
            <span className="mx-1">|</span>
            <span>↓</span>
            <span>0</span>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {selectedDrivers.map((acronym) => (
              <div key={acronym} className="animate-pulse">
                <div className="h-4 bg-[#2c2c2e] rounded mb-1" />
                <div className="h-[70px] bg-[#2c2c2e] rounded" />
              </div>
            ))}
          </div>
        ) : (
          selectedDrivers.map((acronym) => {
            const data = driverData[acronym];
            if (!data) return null;
            return (
              <SpeedTraceChart
                key={acronym}
                data={data.telemetry!}
                color={data.driver.color}
                driver={data.driver}
              />
            );
          })
        )}
      </div>

      {/* Detailed Telemetry (Throttle, Brake, Gear) */}
      {selectedDrivers.length === 1 && driverData[selectedDrivers[0]]?.hasData && (
        <div className="card p-4 mb-4">
          <p className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold mb-3">
            Controls
          </p>
          {(() => {
            const d = driverData[selectedDrivers[0]];
            if (!d?.telemetry) return null;
            const color = d.driver.color;
            return (
              <>
                <TraceChart data={d.telemetry.throttle} color={color} label="Throttle" unit="%" maxVal={100} />
                <TraceChart data={d.telemetry.brake} color="ff3b30" label="Brake" unit="%" maxVal={100} />
                <TraceChart data={d.telemetry.gear} color={color} label="Gear" unit="" maxVal={8} />
              </>
            );
          })()}
        </div>
      )}

      {/* G-Force Chart */}
      {selectedDrivers.length === 1 && driverData[selectedDrivers[0]]?.hasData && (
        <div className="card p-4 mb-4">
          <p className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold mb-3">
            G-Force
          </p>
          {(() => {
            const d = driverData[selectedDrivers[0]];
            if (!d?.telemetry) return null;
            const color = d.driver.color;
            const combinedG = d.telemetry.gX.map((gx, i) => ({
              v: Math.sqrt(gx * gx + (d.telemetry!.gY[i] || 0) ** 2),
            }));
            const maxG = Math.max(...combinedG.map((g) => g.v));
            return (
              <>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-[#636366]">Lateral + Longitudinal</span>
                  <span className="text-[10px] font-mono text-[#00ff94]">{maxG.toFixed(1)} G</span>
                </div>
                <TraceChart data={combinedG.map((g) => g.v)} color={color} label="Combined G" unit="G" maxVal={6} />
              </>
            );
          })()}
        </div>
      )}

      {/* Weather Info */}
      {selectedDrivers.length === 1 && driverData[selectedDrivers[0]]?.weather && (
        <div className="card p-4 mb-4">
          <p className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold mb-3">
            Weather
          </p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(driverData[selectedDrivers[0]]?.weather || {}).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-1 border-b border-[#38383a]/30 last:border-0">
                <span className="text-xs text-[#8e8e93] capitalize">{key.replace(/_/g, " ")}</span>
                <span className="text-xs font-mono text-white">
                  {typeof value === "number" ? value.toFixed(1) : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Driver Selector */}
      <div className="card p-4">
        <p className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold mb-3">
          Compare ({selectedDrivers.length}/4)
        </p>
        <div className="grid grid-cols-2 gap-2">
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
