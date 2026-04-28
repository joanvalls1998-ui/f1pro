import Link from "next/link";

// ─── Miami GP 2026 Schedule ─────────────────────────────────────────────────
const MIAMI_GP_SESSIONS = [
  {
    id: "fp1",
    label: "Practice 1",
    shortLabel: "FP1",
    type: "fp1",
    date: "2026-05-01T16:00:00Z",
    icon: "🏎️",
    durationMin: 60,
  },
  {
    id: "sprint-qualifying",
    label: "Sprint Qualifying",
    shortLabel: "SQ",
    type: "sprint-qualifying",
    date: "2026-05-01T20:30:00Z",
    icon: "⚡",
    durationMin: 30,
  },
  {
    id: "sprint-race",
    label: "Sprint Race",
    shortLabel: "SPR",
    type: "sprint",
    date: "2026-05-02T16:00:00Z",
    icon: "⚡",
    durationMin: 60,
  },
  {
    id: "qualifying",
    label: "Qualifying",
    shortLabel: "QUAL",
    type: "qualifying",
    date: "2026-05-02T20:00:00Z",
    icon: "🔴",
    durationMin: 60,
  },
  {
    id: "race",
    label: "Race",
    shortLabel: "RACE",
    type: "race",
    date: "2026-05-03T20:00:00Z",
    icon: "🏁",
    durationMin: 120,
  },
];

const MIAMI_GP = {
  name: "Miami Grand Prix",
  shortName: "Miami GP",
  circuit: "Miami International Autodrome",
  country: "US",
  flag: "🇺🇸",
  round: 7,
  year: 2026,
};

// ─── Countdown Logic ─────────────────────────────────────────────────────────
type SessionStatus = "upcoming" | "live" | "finished";

interface ActiveSession {
  session: (typeof MIAMI_GP_SESSIONS)[number];
  status: SessionStatus;
  countdown: { days: number; hours: number; mins: number; secs: number };
}

function getActiveSession(): ActiveSession {
  const now = Date.now();

  for (let i = 0; i < MIAMI_GP_SESSIONS.length; i++) {
    const session = MIAMI_GP_SESSIONS[i];
    const start = new Date(session.date).getTime();
    const end = start + session.durationMin * 60 * 1000;

    // Is in progress
    if (now >= start && now < end) {
      const diff = Math.max(0, end - now);
      return {
        session,
        status: "live",
        countdown: formatCountdown(diff),
      };
    }

    // Is next upcoming
    if (now < start) {
      const diff = Math.max(0, start - now);
      return {
        session,
        status: "upcoming",
        countdown: formatCountdown(diff),
      };
    }
  }

  // All sessions finished — return last one as finished
  const last = MIAMI_GP_SESSIONS[MIAMI_GP_SESSIONS.length - 1];
  return {
    session: last,
    status: "finished",
    countdown: { days: 0, hours: 0, mins: 0, secs: 0 },
  };
}

function formatCountdown(ms: number) {
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((ms % (1000 * 60)) / 1000);
  return { days, hours, mins, secs };
}

// ─── Page Component ──────────────────────────────────────────────────────────
export default function HomePage() {
  const active = getActiveSession();
  const isLive = active.status === "live";
  const isFinished = active.status === "finished";

  return (
    <div className="min-h-full">
      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00ff94]/10 to-transparent" />
        <div className="relative px-5 pt-16 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[#8e8e93] text-xs font-medium uppercase tracking-widest mb-0.5">
                Temporada 2026 · Round {MIAMI_GP.round}
              </p>
              <h1 className="text-3xl font-bold tracking-tight">F1Pro</h1>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#00ff94] to-[#00cc77] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00ff94]/20">
              <span className="text-xl">🏎️</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Countdown Card ────────────────────────────────────────────── */}
      <div className="px-5 mb-5">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c1c1e] to-[#141414] border border-[#38383a]">

          {/* Glow effect for live */}
          {isLive && (
            <div className="absolute inset-0 bg-[#00ff94]/5 animate-pulse" />
          )}

          <div className="relative p-5">
            {/* Header row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{MIAMI_GP.flag}</span>
                <div>
                  <p className="text-[#8e8e93] text-[10px] font-semibold uppercase tracking-widest">
                    {isFinished ? "CURS FINALITZADA" : isLive ? "EN VIDA · LIVE" : "PRÒXIMA SESSIÓ"}
                  </p>
                  <p className="text-base font-bold leading-tight">{MIAMI_GP.name}</p>
                  <p className="text-[#636366] text-xs">{MIAMI_GP.circuit}</p>
                </div>
              </div>

              {/* LIVE / Session badge */}
              {isLive ? (
                <div className="flex items-center gap-1.5 bg-red-500/20 border border-red-500/40 rounded-full px-3 py-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-400 text-xs font-bold tracking-wider">LIVE</span>
                </div>
              ) : isFinished ? (
                <div className="bg-[#38383a] rounded-full px-3 py-1">
                  <span className="text-[#636366] text-xs font-medium">FINALITZAT</span>
                </div>
              ) : (
                <div className="bg-[#00ff94]/10 border border-[#00ff94]/30 rounded-full px-3 py-1">
                  <span className="text-[#00ff94] text-xs font-bold">
                    {active.session.shortLabel}
                  </span>
                </div>
              )}
            </div>

            {/* Session info */}
            <div className="flex items-center gap-2 mb-5">
              <span className="text-2xl">{active.session.icon}</span>
              <div>
                <p className="text-white font-semibold text-sm">{active.session.label}</p>
                <p className="text-[#636366] text-xs">
                  {new Date(active.session.date).toLocaleString("es-ES", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Europe/Madrid",
                  })}{" "}
                  (CEST)
                </p>
              </div>
            </div>

            {/* Countdown numbers */}
            {!isFinished && (
              <div className="grid grid-cols-4 gap-2">
                <CountdownBlock value={active.countdown.days} label="DIES" highlight={active.countdown.days > 0} />
                <CountdownBlock value={active.countdown.hours} label="HORES" />
                <CountdownBlock value={active.countdown.mins} label="MINS" />
                <CountdownBlock value={active.countdown.secs} label="SEGS" subtle />
              </div>
            )}

            {isFinished && (
              <div className="text-center py-2">
                <p className="text-[#636366] text-sm">La cursa ha finalitzat</p>
              </div>
            )}

            {/* Weather placeholder */}
            <div className="mt-4 pt-3 border-t border-[#38383a] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">🌤️</span>
                <span className="text-[#636366] text-xs">Miami, FL</span>
              </div>
              <span className="text-[#636366] text-xs">Weather: TBD</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Session Schedule ───────────────────────────────────────────── */}
      <div className="px-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#8e8e93] uppercase tracking-widest">
            Horaris · Miami GP
          </h2>
          <Link href="/calendar" className="text-[#00ff94] text-xs font-medium">
            Calendari →
          </Link>
        </div>

        <div className="space-y-1.5">
          {MIAMI_GP_SESSIONS.map((session) => {
            const sessionStart = new Date(session.date).getTime();
            const sessionEnd = sessionStart + session.durationMin * 60 * 1000;
            const now = Date.now();
            const isSessionLive = now >= sessionStart && now < sessionEnd;
            const isSessionDone = now >= sessionEnd;

            return (
              <div
                key={session.id}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs transition-colors ${
                  isSessionLive
                    ? "bg-[#00ff94]/10 border border-[#00ff94]/30"
                    : isSessionDone
                    ? "bg-[#1c1c1e]/50 opacity-50"
                    : "bg-[#1c1c1e]"
                }`}
              >
                {/* Icon */}
                <span className="text-base w-6 text-center">
                  {isSessionLive ? "🔴" : session.icon}
                </span>

                {/* Label */}
                <div className="flex-1">
                  <p className={`font-medium ${isSessionLive ? "text-[#00ff94]" : "text-white"}`}>
                    {session.label}
                  </p>
                </div>

                {/* Time */}
                <p className="text-[#636366] tabular-nums">
                  {new Date(session.date).toLocaleString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Europe/Madrid",
                  })}{" "}
                  <span className="text-[#48484a]">CEST</span>
                </p>

                {/* Status indicator */}
                {isSessionLive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff94] animate-pulse" />
                )}
                {isSessionDone && (
                  <span className="text-[10px] text-[#636366]">✓</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Quick Actions ───────────────────────────────────────────────── */}
      <div className="px-5 mb-5">
        <div className="grid grid-cols-2 gap-3">
          <QuickAction href="/live" icon="⚡" label="Live Timing" color="#00ff94" />
          <QuickAction href="/standings" icon="🏆" label="Classificació" color="#ffd700" />
          <QuickAction href="/telemetry" icon="📊" label="Telemetria" color="#00b4d8" />
          <QuickAction href="/calendar" icon="📅" label="Calendari" color="#ff6b6b" />
        </div>
      </div>

      {/* ── Standings Preview ──────────────────────────────────────────── */}
      <div className="px-5 mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#8e8e93] uppercase tracking-widest">
            Classificació
          </h2>
          <Link href="/standings" className="text-[#00ff94] text-xs font-medium">
            Veure tot →
          </Link>
        </div>

        <div className="rounded-2xl overflow-hidden border border-[#38383a]">
          <StandingRow
            rank={1}
            driver="Lando Norris"
            team="McLaren"
            points={85}
            color="#ff8000"
          />
          <StandingRow
            rank={2}
            driver="Oscar Piastri"
            team="McLaren"
            points={74}
            color="#ff8000"
          />
          <StandingRow
            rank={3}
            driver="Max Verstappen"
            team="Red Bull Racing"
            points={71}
            color="#1e41db"
          />
          <StandingRow
            rank={4}
            driver="Kimi Antonelli"
            team="Mercedes"
            points={52}
            color="#27f4d2"
          />
          <StandingRow
            rank={5}
            driver="George Russell"
            team="Mercedes"
            points={48}
            color="#27f4d2"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function CountdownBlock({
  value,
  label,
  highlight = false,
  subtle = false,
}: {
  value: number;
  label: string;
  highlight?: boolean;
  subtle?: boolean;
}) {
  return (
    <div
      className={`flex-1 rounded-xl p-3 text-center border transition-colors ${
        highlight
          ? "bg-[#00ff94]/15 border-[#00ff94]/30"
          : subtle
          ? "bg-[#141414] border-[#2c2c2e]"
          : "bg-[#141414] border-[#38383a]"
      }`}
    >
      <p
        className={`font-mono font-bold tabular-nums ${
          highlight
            ? "text-2xl text-[#00ff94]"
            : subtle
            ? "text-xl text-[#48484a]"
            : "text-2xl text-white"
        }`}
      >
        {String(value).padStart(2, "0")}
      </p>
      <p className="text-[9px] text-[#636366] uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  label,
  color,
}: {
  href: string;
  icon: string;
  label: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center p-4 gap-2 rounded-2xl border transition-transform active:scale-95"
      style={{
        background: "#1c1c1e",
        borderColor: `${color}30`,
      }}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-sm font-medium text-center">{label}</span>
    </Link>
  );
}

function StandingRow({
  rank,
  driver,
  team,
  points,
  color,
}: {
  rank: number;
  driver: string;
  team: string;
  points: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-[#38383a] last:border-0 bg-[#1c1c1e] last:rounded-b-2xl">
      <span
        className={`w-5 text-center font-bold tabular-nums text-sm ${
          rank === 1
            ? "text-[#ffd700]"
            : rank === 2
            ? "text-[#c0c0c0]"
            : rank === 3
            ? "text-[#cd7f32]"
            : "text-[#636366]"
        }`}
      >
        {rank}
      </span>
      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <div className="flex-1">
        <p className="text-sm font-medium">{driver}</p>
        <p className="text-[#636366] text-xs">{team}</p>
      </div>
      <span className="text-sm font-bold text-[#00ff94] tabular-nums">{points}</span>
    </div>
  );
}
