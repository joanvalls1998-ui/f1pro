"use client";

import { useState, useEffect, useCallback } from "react";

// ── Static driver grid (2026) ────────────────────────────────────────────────
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

// ── 2026 Miami GP Schedule ───────────────────────────────────────────────────
const MIAMI_SESSIONS = [
  { id: "fp1", label: "Free Practice 1", short: "FP1", icon: "🏎️", date: "2026-05-01T16:00:00Z" },
  { id: "sq", label: "Sprint Qualifying", short: "SQ", icon: "⚡", date: "2026-05-01T20:30:00Z" },
  { id: "sprint", label: "Sprint Race", short: "SPR", icon: "⚡", date: "2026-05-02T16:00:00Z" },
  { id: "q", label: "Qualifying", short: "QUALY", icon: "🔴", date: "2026-05-02T20:00:00Z" },
  { id: "race", label: "Miami Grand Prix", short: "RACE", icon: "🏁", date: "2026-05-03T20:00:00Z" },
];

// ── Countdown hook ───────────────────────────────────────────────────────────
function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, started: false });

  useEffect(() => {
    function update() {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, started: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        started: false,
      });
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

// ── Next session logic ───────────────────────────────────────────────────────
function getNextSession() {
  const now = new Date();
  for (const session of MIAMI_SESSIONS) {
    const sessionDate = new Date(session.date);
    if (sessionDate > now) {
      return { session, startsAt: sessionDate };
    }
  }
  return { session: MIAMI_SESSIONS[MIAMI_SESSIONS.length - 1], started: true };
}

function getCurrentSession() {
  const now = new Date();
  for (const session of MIAMI_SESSIONS) {
    const start = new Date(session.date);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // +2h window
    if (now >= start && now <= end) {
      return session;
    }
  }
  return null;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function LivePage() {
  const { session: nextSessionData, started: allStarted } = getNextSession();
  const currentSession = getCurrentSession();
  const countdown = useCountdown(nextSessionData.date);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const isLive = currentSession !== null;

  // Sort drivers by championship position for demo
  const orderedDrivers = [...DRIVERS];

  return (
    <div className="min-h-full px-4 pt-16 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            {isLive ? (
              <span className="flex items-center gap-1.5 bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-bold animate-pulse">
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                LIVE
              </span>
            ) : (
              <span className="flex items-center gap-1.5 bg-[#2c2c2e] text-[#8e8e93] px-2 py-0.5 rounded-full text-xs font-semibold">
                🇺🇸 Miami GP
              </span>
            )}
            <h1 className="text-xl font-bold">Live</h1>
          </div>
          <p className="text-[#8e8e93] text-sm">Miami International Autodrome</p>
        </div>
        <span className="text-[10px] text-[#636366]">2026 Season</span>
      </div>

      {/* LIVE badge / Next session */}
      {isLive ? (
        <div className="card p-4 mb-4 bg-gradient-to-r from-red-900/30 to-transparent border-red-800/50">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-xs font-bold uppercase tracking-wider">En directe ara</span>
          </div>
          <p className="text-white font-semibold text-lg">{currentSession.icon} {currentSession.label}</p>
          <p className="text-[#8e8e93] text-xs mt-1">Sessió en curs · Actualitzacions en temps real</p>
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
                  day: "numeric",
                  month: "short",
                })}{" "}
                ·{" "}
                {new Date(nextSessionData.date).toLocaleTimeString("ca-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "UTC",
                })}{" "}
                UTC
              </p>
            </div>
          </div>

          {/* Countdown */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: countdown.days, label: "Dies" },
              { value: countdown.hours, label: "Hores" },
              { value: countdown.minutes, label: "Min" },
              { value: countdown.seconds, label: "Seg" },
            ].map(({ value, label }) => (
              <div key={label} className="bg-[#1c1c1e] rounded-xl p-2 text-center">
                <div className="text-2xl font-bold text-[#00ff94] tabular-nums">
                  {String(value).padStart(2, "0")}
                </div>
                <div className="text-[10px] text-[#636366] uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
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
            const isPast = sessionDate < new Date();
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
                {isCurrent && (
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
                {isPast && !isCurrent && (
                  <span className="text-[10px] text-[#636366]">✓</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Position table (demo / fallback) */}
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold">
            Graella · Posicions
          </p>
          <span className="text-[10px] text-[#636366]">Cursa no iniciada</span>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-4 py-2 bg-[#2c2c2e] flex items-center text-[10px] uppercase tracking-wider text-[#636366] font-semibold">
          <span className="w-8 text-center">Pos</span>
          <span className="w-10 text-center">#</span>
          <span className="flex-1 ml-2">Pilot</span>
          <span className="w-8 text-right">Team</span>
          <span className="w-12 text-right">Gap</span>
        </div>

        {orderedDrivers.map((driver, idx) => {
          const position = idx + 1;
          const isTop3 = position <= 3;
          const gaps = ["LEAD", "+0.442", "+0.891", "+1.204", "+1.556", "+1.823", "+2.102", "+2.445", "+2.789", "+3.112", "+3.445", "+3.789", "+4.102", "+4.445", "+4.789", "+5.102", "+5.445", "+5.789", "+6.102", "+6.445", "+6.789", "+7.102"];

          return (
            <div
              key={driver.number}
              className="flex items-center px-4 py-3 border-b border-[#38383a]/50 last:border-0"
            >
              <span
                className={`w-8 text-center font-bold text-lg ${
                  isTop3 ? "text-[#ffd700]" : "text-[#8e8e93]"
                }`}
              >
                {position}
              </span>

              <span className="w-10 text-center text-[#636366] font-mono text-sm">
                {driver.number}
              </span>

              <div className="flex-1 flex items-center gap-2 ml-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ backgroundColor: `#${driver.color}30`, color: `#${driver.color}` }}
                >
                  {driver.acronym}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{driver.name.split(" ")[0]}</p>
                  <p className="text-[#636366] text-xs">{driver.acronym}</p>
                </div>
              </div>

              <div className="w-8 flex justify-end">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: `#${driver.color}` }}
                />
              </div>

              <span className="w-12 text-right font-mono text-[11px] text-[#00ff94]">
                {gaps[idx]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Live indicator */}
      <div className="mt-4 card p-3 bg-[#1c1c1e]">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isLive ? "bg-red-500 animate-pulse" : "bg-[#00ff94]"}`} />
          <p className="text-xs text-[#8e8e93]">
            {isLive
              ? `Live timing actiu · ${currentSession?.label}`
              : "Sense sessió en directe ara · Dades de preview"}
          </p>
        </div>
      </div>
    </div>
  );
}
