"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ── Static driver grid (2026) ────────────────────────────────────────────────
const DRIVERS = [
  { number: 4,  name: "Lando Norris",       acronym: "NOR", team: "McLaren",          color: "F58020" },
  { number: 81, name: "Oscar Piastri",      acronym: "PIA", team: "McLaren",          color: "F58020" },
  { number: 63, name: "George Russell",    acronym: "RUS", team: "Mercedes",         color: "27F4D2" },
  { number: 12, name: "Kimi Antonelli",    acronym: "ANT", team: "Mercedes",         color: "27F4D2" },
  { number: 44, name: "Lewis Hamilton",    acronym: "HAM", team: "Ferrari",          color: "F91536" },
  { number: 16, name: "Charles Leclerc",   acronym: "LEC", team: "Ferrari",          color: "F91536" },
  { number: 1,  name: "Max Verstappen",    acronym: "VER", team: "Red Bull Racing",  color: "3671C6" },
  { number: 6,  name: "Isack Hadjar",       acronym: "HAD", team: "Red Bull Racing",  color: "3671C6" },
  { number: 23, name: "Alex Albon",         acronym: "ALB", team: "Williams",         color: "37BEDD" },
  { number: 55, name: "Carlos Sainz",       acronym: "SAI", team: "Williams",        color: "37BEDD" },
  { number: 30, name: "Liam Lawson",        acronym: "LAW", team: "Racing Bulls",     color: "2D0D0D" },
  { number: 41, name: "Arvid Lindblad",     acronym: "LIN", team: "Racing Bulls",    color: "2D0D0D" },
  { number: 14, name: "Fernando Alonso",   acronym: "ALO", team: "Aston Martin",    color: "358C75" },
  { number: 18, name: "Lance Stroll",       acronym: "STR", team: "Aston Martin",    color: "358C75" },
  { number: 27, name: "Nico Hülkenberg",   acronym: "HUL", team: "Audi",             color: "F50537" },
  { number: 5,  name: "Gabriel Bortoleto", acronym: "BOR", team: "Audi",             color: "F50537" },
  { number: 87, name: "Oliver Bearman",    acronym: "BEA", team: "Haas",             color: "B6BABD" },
  { number: 31, name: "Esteban Ocon",      acronym: "OCO", team: "Haas",             color: "B6BABD" },
  { number: 10, name: "Pierre Gasly",       acronym: "GAS", team: "Alpine",          color: "2293D1" },
  { number: 7,  name: "Franco Colapinto",  acronym: "COL", team: "Alpine",          color: "2293D1" },
  { number: 77, name: "Valtteri Bottas",   acronym: "BOT", team: "Cadillac",         color: "909090" },
  { number: 11, name: "Sergio Pérez",       acronym: "PER", team: "Cadillac",         color: "909090" },
];

const DRIVER_MAP = Object.fromEntries(DRIVERS.map((d) => [d.number, d]));

// ── 2026 Miami GP Schedule ───────────────────────────────────────────────────
const MIAMI_SESSIONS = [
  { id: "fp1",   label: "Free Practice 1",    short: "FP1",  icon: "🏎️", date: "2026-05-01T16:00:00Z" },
  { id: "sq",    label: "Sprint Qualifying",   short: "SQ",   icon: "⚡", date: "2026-05-01T20:30:00Z" },
  { id: "sprint",label: "Sprint Race",          short: "SPR",  icon: "⚡", date: "2026-05-02T16:00:00Z" },
  { id: "q",     label: "Qualifying",           short: "QUALY",icon: "🔴", date: "2026-05-02T20:00:00Z" },
  { id: "race",  label: "Miami Grand Prix",     short: "RACE", icon: "🏁", date: "2026-05-03T20:00:00Z" },
];

// ── Types ─────────────────────────────────────────────────────────────────────
interface LiveEntry {
  driverNumber: number;
  position: number;
  gap: string;
  interval: string;
  lastLap: string;
  pitLap?: number;
  deleted?: boolean;
}

interface SessionStatus {
  session_name: string;
  session_type: string;
  date_start: string;
  date_end: string;
  gmtOffset: string;
  status: "active" | "completed" | "scheduled";
}

// ── Countdown hook ────────────────────────────────────────────────────────────
function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, started: false });
  const target = new Date(targetDate).getTime();

  useEffect(() => {
    function update() {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, started: true });
        return;
      }
      setTimeLeft({
        days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        started: false,
      });
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [target]);

  return timeLeft;
}

// ── Session helpers ───────────────────────────────────────────────────────────
function getNextSession() {
  const now = new Date();
  for (const s of MIAMI_SESSIONS) {
    if (new Date(s.date) > now) return { session: s, started: false };
  }
  return { session: MIAMI_SESSIONS[MIAMI_SESSIONS.length - 1], started: true };
}

function getCurrentSession(): typeof MIAMI_SESSIONS[0] | null {
  const now = new Date();
  for (const s of MIAMI_SESSIONS) {
    const start = new Date(s.date);
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
    if (now >= start && now <= end) return s;
  }
  return null;
}

// ── OpenF1 fetch helpers ───────────────────────────────────────────────────────
const PROXY = "/api/openf1";

async function fetchOpenF1<T>(endpoint: string, params: Record<string, string> = {}): Promise<T | null> {
  try {
    const ps = new URLSearchParams({ endpoint, ...params });
    const res = await fetch(`${PROXY}?${ps}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json() as T;
  } catch {
    return null;
  }
}

async function fetchSessionStatus(): Promise<SessionStatus[]> {
  const data = await fetchOpenF1<SessionStatus[]>("session_status", { limit: "5", sort: "date_start" });
  return data ?? [];
}

async function fetchLivePositions(): Promise<LiveEntry[]> {
  const data = await fetchOpenF1<{ driver_number: number; position: number; interval_to_leader: string; time_to_position_ahead: string; last_lap_time: string; pit_lap: number | null; deleted: number }[]>("position");
  if (!data || data.length === 0) return [];

  return data
    .filter((r) => r.position != null)
    .map((r) => ({
      driverNumber:   r.driver_number,
      position:       r.position,
      gap:            r.interval_to_leader ?? "LEAD",
      interval:       r.time_to_position_ahead ?? "—",
      lastLap:        r.last_lap_time ? formatLapTime(r.last_lap_time) : "—",
      pitLap:         r.pit_lap ?? undefined,
      deleted:        r.deleted === 1,
    }))
    .sort((a, b) => a.position - b.position);
}

function formatLapTime(msStr: string): string {
  try {
    const ms = parseFloat(msStr);
    if (isNaN(ms)) return "—";
    const m = Math.floor(ms / 60000);
    const s = ((ms % 60000) / 1000).toFixed(3);
    return m > 0 ? `${m}:${s.padStart(6, "0")}` : (parseFloat(s)).toFixed(3) + "s";
  } catch {
    return msStr;
  }
}

// ── Build rows: merge live data with static grid ──────────────────────────────
function buildRows(live: LiveEntry[]): (LiveEntry & { driver: typeof DRIVERS[0]; isLive: boolean })[] {
  if (live.length === 0) {
    // Return static grid with placeholder gaps
    const placeholderGaps = ["LEAD","+0.442","+0.891","+1.204","+1.556","+1.823","+2.102","+2.445","+2.789","+3.112","+3.445","+3.789","+4.102","+4.445","+4.789","+5.102","+5.445","+5.789","+6.102","+6.445","+6.789","+7.102"];
    return DRIVERS.map((d, i) => ({
      driverNumber: d.number,
      position: i + 1,
      gap:      placeholderGaps[i] ?? `+${((i + 1) * 0.35).toFixed(3)}`,
      interval: "—",
      lastLap:  "—",
      driver:   d,
      isLive:   false,
    }));
  }

  return DRIVERS.map((d) => {
    const liveEntry = live.find((e) => e.driverNumber === d.number);
    if (liveEntry) {
      return { ...liveEntry, driver: d, isLive: true };
    }
    // Driver in static grid but not in live data
    const lastPos = live.length > 0 ? live[live.length - 1].position : 0;
    return {
      driverNumber: d.number,
      position:    lastPos + 1,
      gap:         "圈",
      interval:    "—",
      lastLap:     "—",
      driver:      d,
      isLive:      false,
    };
  });
}

// ── Sub-components ───────────────────────────────────────────────────────────

function CountdownBlock({ target }: { target: string }) {
  const tc = useCountdown(target);
  return (
    <div className="grid grid-cols-4 gap-2">
      {[
        { value: tc.days,    label: "Dies" },
        { value: tc.hours,   label: "Hores" },
        { value: tc.minutes, label: "Min" },
        { value: tc.seconds, label: "Seg" },
      ].map(({ value, label }) => (
        <div key={label} className="bg-[#1c1c1e] rounded-xl p-2 text-center">
          <div className="text-2xl font-bold text-[#00ff94] tabular-nums">
            {String(value).padStart(2, "0")}
          </div>
          <div className="text-[10px] text-[#636366] uppercase tracking-wider">{label}</div>
        </div>
      ))}
    </div>
  );
}

function SessionBadge({ session, live }: { session: typeof MIAMI_SESSIONS[0] | null; live: boolean }) {
  if (live && session) {
    return (
      <span className="flex items-center gap-1.5 bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-bold animate-pulse">
        <span className="w-1.5 h-1.5 bg-white rounded-full" />
        LIVE · {session.short}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 bg-[#2c2c2e] text-[#8e8e93] px-2 py-0.5 rounded-full text-xs font-semibold">
      🇺🇸 Miami GP
    </span>
  );
}

function LoadingRow() {
  return (
    <div className="flex items-center gap-3 px-4 py-4 border-b border-[#38383a]/50">
      <div className="w-8 h-6 bg-[#2c2c2e] rounded animate-pulse" />
      <div className="w-10 h-4 bg-[#2c2c2e] rounded animate-pulse" />
      <div className="flex-1 flex items-center gap-2">
        <div className="w-8 h-8 bg-[#2c2c2e] rounded-full animate-pulse" />
        <div>
          <div className="w-20 h-4 bg-[#2c2c2e] rounded animate-pulse mb-1" />
          <div className="w-10 h-3 bg-[#2c2c2e] rounded animate-pulse" />
        </div>
      </div>
      <div className="w-12 h-4 bg-[#2c2c2e] rounded animate-pulse" />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function LivePage() {
  const { session: nextSessionData } = getNextSession();
  const currentSession = getCurrentSession();
  const isLive = currentSession !== null;

  const [rows, setRows]             = useState<(ReturnType<typeof buildRows>[0])[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  const fetchData = useCallback(async (isRetry = false) => {
    if (!isMountedRef.current) return;
    if (!isRetry) setLoading(true);
    setError(null);

    const [live] = await Promise.all([fetchLivePositions()]);

    if (!isMountedRef.current) return;

    if (live.length > 0) {
      setRows(buildRows(live));
      setLastUpdated(new Date());
      setError(null);
    } else {
      // Always show static grid as fallback
      setRows(buildRows([]));
      if (!isRetry) {
        // Only show error hint if we had live data before and it disappeared
        setError("OpenF1 sense dades en directe · Mostrant preview");
      }
    }

    setLoading(false);
  }, []);

  // Initial load + polling every 12s
  useEffect(() => {
    isMountedRef.current = true;
    fetchData(false);

    pollRef.current = setInterval(() => {
      fetchData(true);
    }, 12_000);

    return () => {
      isMountedRef.current = false;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchData]);

  const handleRetry = () => {
    setRetryCount((c) => c + 1);
    setError(null);
    setLoading(true);
    fetchData(true);
  };

  const isActuallyLive = rows.some((r) => r.isLive);

  return (
    <div className="min-h-full px-4 pt-16 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <SessionBadge session={currentSession} live={isActuallyLive} />
            <h1 className="text-xl font-bold">Live</h1>
          </div>
          <p className="text-[#8e8e93] text-sm">Miami International Autodrome</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] text-[#636366]">2026 Season</span>
          {lastUpdated && (
            <span className="text-[10px] text-[#636366]">
              {lastUpdated.toLocaleTimeString("ca-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          )}
        </div>
      </div>

      {/* Live session card */}
      {isLive ? (
        <div className="card p-4 mb-4 bg-gradient-to-r from-red-900/30 to-transparent border-red-800/50">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-xs font-bold uppercase tracking-wider">En directe ara</span>
          </div>
          <p className="text-white font-semibold text-lg">{currentSession.icon} {currentSession.label}</p>
          <p className="text-[#8e8e93] text-xs mt-1">
            Sessió en curs · Actualitzacions cada 12s
          </p>
        </div>
      ) : (
        <div className="card p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold mb-1">
                Pròxima sessió
              </p>
              <p className="text-white font-semibold">
                {nextSessionData.icon} {nextSessionData.label}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#8e8e93]">
                {new Date(nextSessionData.date).toLocaleDateString("ca-ES", {
                  day: "numeric", month: "short",
                })} ·{" "}
                {new Date(nextSessionData.date).toLocaleTimeString("ca-ES", {
                  hour: "2-digit", minute: "2-digit", timeZone: "UTC",
                })} UTC
              </p>
            </div>
          </div>
          <CountdownBlock target={nextSessionData.date} />
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="card p-3 mb-4 bg-yellow-900/20 border-yellow-800/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-yellow-500 text-sm">⚠️</span>
            <p className="text-yellow-400 text-xs">{error}</p>
          </div>
          <button
            onClick={handleRetry}
            className="text-xs bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1 rounded-full font-semibold transition-colors shrink-0"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Session schedule */}
      <div className="mb-4">
        <p className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold mb-2">
          Horari Miami GP
        </p>
        <div className="space-y-1.5">
          {MIAMI_SESSIONS.map((s) => {
            const sessionDate = new Date(s.date);
            const isPast    = sessionDate < new Date();
            const isCurrent = currentSession?.id === s.id;
            return (
              <div
                key={s.id}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                  isCurrent
                    ? "bg-red-900/30 border border-red-800/50"
                    : isPast
                    ? "bg-[#1c1c1e] opacity-50"
                    : "bg-[#1c1c1e]"
                }`}
              >
                <span className="text-sm">{s.icon}</span>
                <div className="flex-1">
                  <p className={`text-xs font-medium ${isCurrent ? "text-red-400" : "text-white"}`}>
                    {s.label}
                  </p>
                  <p className="text-[10px] text-[#636366]">
                    {sessionDate.toLocaleDateString("ca-ES", { day: "numeric", month: "short" })} ·{" "}
                    {sessionDate.toLocaleTimeString("ca-ES", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })} UTC
                  </p>
                </div>
                {isCurrent && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                {isPast && !isCurrent && <span className="text-[10px] text-[#636366]">✓</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Position table */}
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold">
            Graella · Posicions
          </p>
          <div className="flex items-center gap-2">
            {loading && rows.length === 0 && (
              <span className="text-[10px] text-[#636366] animate-pulse">Carregant…</span>
            )}
            <span className="text-[10px] text-[#636366]">
              {isActuallyLive ? "Live" : "Preview"}
            </span>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-4 py-2 bg-[#2c2c2e] flex items-center text-[10px] uppercase tracking-wider text-[#636366] font-semibold">
          <span className="w-8 text-center">Pos</span>
          <span className="w-10 text-center">#</span>
          <span className="flex-1 ml-2">Pilot</span>
          <span className="w-8 text-center">Team</span>
          <span className="w-14 text-right">Gap</span>
          <span className="w-14 text-right">Volta</span>
        </div>

        {loading && rows.length === 0
          ? Array.from({ length: 6 }).map((_, i) => <LoadingRow key={i} />)
          : rows.map((row) => {
              const isTop3 = row.position <= 3;
              return (
                <div
                  key={row.driverNumber}
                  className={`flex items-center px-4 py-2.5 border-b border-[#38383a]/50 last:border-0 transition-colors ${
                    row.isLive ? "" : "opacity-60"
                  } ${row.deleted ? "opacity-30 line-through" : ""}`}
                >
                  <span
                    className={`w-8 text-center font-bold text-base ${
                      isTop3 ? "text-[#ffd700]" : "text-[#8e8e93]"
                    }`}
                  >
                    {row.position}
                  </span>

                  <span className="w-10 text-center text-[#636366] font-mono text-sm">
                    {row.driver.number}
                  </span>

                  <div className="flex-1 flex items-center gap-2 ml-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                      style={{
                        backgroundColor: `#${row.driver.color}30`,
                        color: `#${row.driver.color}`,
                      }}
                    >
                      {row.driver.acronym}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{row.driver.name.split(" ")[0]}</p>
                      <p className="text-[#636366] text-xs">{row.driver.acronym}</p>
                    </div>
                  </div>

                  <div className="w-8 flex justify-center">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: `#${row.driver.color}` }}
                    />
                  </div>

                  <span className="w-14 text-right font-mono text-[11px] text-[#00ff94] truncate pl-2">
                    {row.gap}
                  </span>

                  <span className="w-14 text-right font-mono text-[11px] text-[#8e8e93] truncate pl-2">
                    {row.lastLap}
                  </span>
                </div>
              );
            })}
      </div>

      {/* Bottom status */}
      <div className="mt-4 card p-3 bg-[#1c1c1e] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isActuallyLive ? "bg-red-500 animate-pulse" : "bg-[#00ff94]"}`} />
          <p className="text-xs text-[#8e8e93]">
            {isActuallyLive
              ? `Live timing actiu · ${currentSession?.label ?? "Sessió"}`
              : "Sense sessió en directe · Dades de preview"}
          </p>
        </div>
        {error && (
          <button
            onClick={handleRetry}
            className="text-xs text-[#00d4ff] hover:text-white transition-colors"
          >
            Reintentar ↻
          </button>
        )}
      </div>
    </div>
  );
}
