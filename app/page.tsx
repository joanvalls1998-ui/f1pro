import Link from "next/link";
import { getDriverStandings, getNextRace, getCurrentSession, getSessionsByMeeting } from "@/lib/openf1";
import HomeWeatherSummary from "@/app/components/HomeWeatherSummary";

// ─── Static fallback data ───────────────────────────────────────────────────
const FALLBACK_NEXT_GP = {
  name: "Miami Grand Prix",
  shortName: "Miami GP",
  circuit: "Miami International Autodrome",
  country: "United States",
  flag: "🇺🇸",
  round: 4,
  year: 2026,
};

const FALLBACK_SESSIONS = [
  { id: "fp1", label: "Practice 1", shortLabel: "FP1", type: "fp1", date: "2026-05-01T16:00:00Z", icon: "🔧", durationMin: 60 },
  { id: "sprint-qualifying", label: "Sprint Qualifying", shortLabel: "SQ", type: "sprint-qualifying", date: "2026-05-01T20:30:00Z", icon: "⚡", durationMin: 30 },
  { id: "sprint-race", label: "Sprint Race", shortLabel: "SPR", type: "sprint", date: "2026-05-02T16:00:00Z", icon: "⚡", durationMin: 60 },
  { id: "qualifying", label: "Qualifying", shortLabel: "QUAL", type: "qualifying", date: "2026-05-02T20:00:00Z", icon: "🔴", durationMin: 60 },
  { id: "race", label: "Race", shortLabel: "RACE", type: "race", date: "2026-05-03T20:00:00Z", icon: "🏁", durationMin: 120 },
];

const FALLBACK_STANDINGS = [
  { position: "1", driver: "Kimi Antonelli", team: "Mercedes", points: "72", color: "#27F4D2", wins: "2" },
  { position: "2", driver: "George Russell", team: "Mercedes", points: "63", color: "#27F4D2", wins: "1" },
  { position: "3", driver: "Charles Leclerc", team: "Ferrari", points: "49", color: "#F91536", wins: "1" },
  { position: "4", driver: "Lando Norris", team: "McLaren", points: "38", color: "#F58020", wins: "0" },
  { position: "5", driver: "Oscar Piastri", team: "McLaren", points: "30", color: "#F58020", wins: "0" },
];

const FALLBACK_NEWS = [
  { title: "Antonelli claims maiden F1 victory in dramatic Jeddah finish", link: "#", pubDate: "2026-04-27", source: "F1.com" },
  { title: "Ferrari confident of podium fight ahead of Miami weekend", link: "#", pubDate: "2026-04-26", source: "Autosport" },
  { title: "McLaren unveil major upgrade package for Miami GP", link: "#", pubDate: "2026-04-25", source: "The Race" },
  { title: "Hamilton adapting well to Ferrari, says Vasseur", link: "#", pubDate: "2026-04-24", source: "Sky Sports" },
  { title: "Sainz targets strong home European opener after tough start", link: "#", pubDate: "2026-04-23", source: "Motorsport.com" },
];

// ─── Countdown logic ─────────────────────────────────────────────────────────
function computeCountdown(targetMs: number) {
  const diff = Math.max(0, targetMs - Date.now());
  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000) / 60000);
  const secs  = Math.floor((diff % 60000) / 1000);
  return { days, hours, mins, secs };
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const [nextGP, currentSession, apiStandings] = await Promise.all([
    getNextRace().catch(() => null),
    getCurrentSession().catch(() => null),
    getDriverStandings(2026).catch(() => []),
  ]);

  // Resolve GP data
  const gp = nextGP
    ? {
        name: nextGP.official_name ?? nextGP.country_name,
        shortName: nextGP.circuit_short_name ?? nextGP.country_name,
        circuit: nextGP.location ?? "",
        country: nextGP.country_name ?? "",
        flag: countryFlag(nextGP.country_name ?? ""),
        round: 0,
        year: 2026,
      }
    : FALLBACK_NEXT_GP;

  // Resolve sessions
  let sessions = FALLBACK_SESSIONS;
  if (nextGP) {
    const meetingSessions = await getSessionsByMeeting(nextGP.meeting_key).catch(() => []);
    if (meetingSessions.length > 0) {
      sessions = meetingSessions.map((s, i) => ({
        id: `session-${i}`,
        label: s.session_name,
        shortLabel: shortSessionLabel(s.session_type),
        type: s.session_type,
        date: s.date_start,
        icon: sessionIcon(s.session_type),
        durationMin: Math.round((new Date(s.date_end).getTime() - new Date(s.date_start).getTime()) / 60000),
      }));
    }
  }

  // Resolve standings
  const standings = apiStandings.length > 0
    ? apiStandings.map((s: any) => ({
        position: s.position,
        driver: `${s.Driver.givenName} ${s.Driver.familyName}`,
        team: s.Constructors?.[0]?.name ?? "",
        points: s.points,
        color: teamColor(s.Constructors?.[0]?.name ?? ""),
        wins: s.wins,
      }))
    : FALLBACK_STANDINGS;

  // Active session detection
  const nowMs = Date.now();
  let activeSession = sessions[0];
  let sessionStatus: "upcoming" | "live" | "finished" = "upcoming";

  for (let i = 0; i < sessions.length; i++) {
    const start = new Date(sessions[i].date).getTime();
    const end = start + sessions[i].durationMin * 60000;
    if (nowMs >= start && nowMs < end) {
      activeSession = sessions[i];
      sessionStatus = "live";
      break;
    }
    if (nowMs < start) {
      activeSession = sessions[i];
      sessionStatus = "upcoming";
      break;
    }
    activeSession = sessions[i];
    sessionStatus = "finished";
  }

  const isLive = sessionStatus === "live";
  const isFinished = sessionStatus === "finished";

  const activeStartMs = new Date(activeSession.date).getTime();
  const activeEndMs = activeStartMs + activeSession.durationMin * 60000;
  const countdown =
    isFinished ? { days: 0, hours: 0, mins: 0, secs: 0 }
    : isLive ? computeCountdown(activeEndMs)
    : computeCountdown(activeStartMs);

  const isCurrentSessionLive = !!(currentSession);

  return (
    <div className="min-h-full">
      {/* ── Live Session Banner ─────────────────────────────────────────── */}
      {isCurrentSessionLive && (
        <div className="mx-5 mt-3 rounded-xl overflow-hidden">
          <div className="relative bg-gradient-to-r from-red-500/20 to-orange-500/10 border border-red-500/30 px-4 py-2.5 flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <span className="text-red-300 text-xs font-bold uppercase tracking-widest">
              Session Live
            </span>
            <span className="text-white/80 text-xs truncate flex-1">
              {currentSession.session_name} · {currentSession.circuit_short_name}
            </span>
            <Link
              href="/live"
              className="text-[10px] font-semibold bg-red-500/30 hover:bg-red-500/50 text-red-200 px-2 py-0.5 rounded-full transition-colors"
            >
              Watch →
            </Link>
          </div>
        </div>
      )}

      {/* ── Hero Header ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00ff94]/8 to-transparent pointer-events-none" />
        <div className="relative px-5 pt-14 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#8e8e93] text-[10px] font-semibold uppercase tracking-[0.2em] mb-0.5">
                {isCurrentSessionLive ? "In-Season Test" : `Season 2026 · Round ${gp.round || 4}`}
              </p>
              <h1 className="text-2xl font-bold tracking-tight leading-none">
                F1Pro
              </h1>
            </div>
            <div className="w-11 h-11 bg-gradient-to-br from-[#00ff94] to-[#00cc77] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00ff94]/25">
              <span className="text-xl">🏎️</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Featured GP Card ───────────────────────────────────────────── */}
      <div className="px-5 mb-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c1c1e] to-[#111111] border border-[#38383a]">

          {/* Ambient glow for live */}
          {isLive && (
            <div className="absolute inset-0 bg-[#00ff94]/6 animate-pulse pointer-events-none" />
          )}

          {/* Top accent line */}
          <div className={`h-0.5 ${isLive ? "bg-gradient-to-r from-[#00ff94] via-red-400 to-[#00ff94]" : "bg-gradient-to-r from-[#00ff94]/60 via-[#00ff94]/20 to-transparent"}`} />

          <div className="relative p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{gp.flag}</span>
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-[0.18em] mb-0.5 ${
                    isLive ? "text-[#00ff94]" : isFinished ? "text-[#636366]" : "text-[#00ff94]/80"
                  }`}>
                    {isFinished ? "Completed" : isLive ? "Live Now" : "Next Session"}
                  </p>
                  <p className="text-lg font-bold leading-tight">{gp.shortName}</p>
                  <p className="text-[#636366] text-xs">{gp.circuit}</p>
                </div>
              </div>

              {/* Status badge */}
              {isLive ? (
                <div className="flex items-center gap-1.5 bg-red-500/20 border border-red-500/50 rounded-full px-3 py-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-400 text-[10px] font-bold tracking-wider">LIVE</span>
                </div>
              ) : isFinished ? (
                <div className="bg-[#2c2c2e] rounded-full px-2.5 py-1">
                  <span className="text-[#636366] text-[10px] font-medium">DONE</span>
                </div>
              ) : (
                <div className="bg-[#00ff94]/10 border border-[#00ff94]/30 rounded-full px-2.5 py-1">
                  <span className="text-[#00ff94] text-[10px] font-bold">{activeSession.shortLabel}</span>
                </div>
              )}
            </div>

            {/* Active Session */}
            <div className="flex items-center gap-2.5 mb-5">
              <span className="text-2xl">{activeSession.icon}</span>
              <div>
                <p className="text-white font-semibold text-sm">{activeSession.label}</p>
                <p className="text-[#636366] text-xs">
                  {new Date(activeSession.date).toLocaleString("es-ES", {
                    weekday: "short", month: "short", day: "numeric",
                    hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid",
                  })} (CEST)
                </p>
              </div>
            </div>

            {/* Countdown */}
            {!isFinished && (
              <div className="grid grid-cols-4 gap-2">
                <CountdownBlock value={countdown.days} label="DIES" highlight={countdown.days > 0} />
                <CountdownBlock value={countdown.hours} label="HORES" />
                <CountdownBlock value={countdown.mins} label="MINS" />
                <CountdownBlock value={countdown.secs} label="SEGS" subtle />
              </div>
            )}

            {isFinished && (
              <div className="text-center py-2">
                <p className="text-[#636366] text-sm">Cursa finalitzada</p>
              </div>
            )}

            <HomeWeatherSummary />
          </div>
        </div>
      </div>

      {/* ── Quick Stats Strip ───────────────────────────────────────────── */}
      <div className="px-5 mb-4 flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-hide">
        {[
          { icon: "🏆", label: "L. Hamilton", sub: "7x Champion", accent: "#F91536" },
          { icon: "🔴", label: "Ferrari", sub: "Constructor Leader", accent: "#F91536" },
          { icon: "⚡", label: "Top Speed", sub: "McLaren 348km/h", accent: "#F58020" },
          { icon: "🌍", label: "21 Races", sub: "2026 Calendar", accent: "#00ff94" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#1c1c1e] border border-[#2c2c2e]"
          >
            <span className="text-lg">{stat.icon}</span>
            <div>
              <p className="text-xs font-semibold leading-tight" style={{ color: stat.accent }}>{stat.label}</p>
              <p className="text-[10px] text-[#636366] leading-tight">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Session Schedule ────────────────────────────────────────────── */}
      <div className="px-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[10px] font-semibold text-[#8e8e93] uppercase tracking-[0.2em]">
            {gp.shortName} · Schedule
          </h2>
          <Link href="/calendar" className="text-[#00ff94] text-[10px] font-medium">
            Calendar →
          </Link>
        </div>

        <div className="space-y-1">
          {sessions.map((session) => {
            const start = new Date(session.date).getTime();
            const end = start + session.durationMin * 60000;
            const now = Date.now();
            const isSLive = now >= start && now < end;
            const isSDone = now >= end;

            return (
              <div
                key={session.id}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                  isSLive
                    ? "bg-[#00ff94]/10 border border-[#00ff94]/30"
                    : isSDone
                    ? "bg-[#1c1c1e]/40 opacity-40"
                    : "bg-[#1c1c1e]"
                }`}
              >
                <span className="text-base w-6 text-center">
                  {isSLive ? "🔴" : session.icon}
                </span>
                <div className="flex-1">
                  <p className={`font-medium text-xs ${isSLive ? "text-[#00ff94]" : "text-white"}`}>
                    {session.label}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[#636366] text-[11px] tabular-nums">
                    {new Date(session.date).toLocaleString("es-ES", {
                      hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid",
                    })}
                  </p>
                  <p className="text-[#48484a] text-[9px]">CEST</p>
                </div>
                {isSLive && <span className="w-1.5 h-1.5 rounded-full bg-[#00ff94] animate-pulse flex-shrink-0" />}
                {isSDone && <span className="text-[#48484a] text-[10px]">✓</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Driver Standings ─────────────────────────────────────────────── */}
      <div className="px-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[10px] font-semibold text-[#8e8e93] uppercase tracking-[0.2em]">
            Drivers Championship
          </h2>
          <Link href="/standings" className="text-[#00ff94] text-[10px] font-medium">
            Standings →
          </Link>
        </div>

        <div className="rounded-2xl overflow-hidden border border-[#2c2c2e]">
          {standings.map((s: { position: string; driver: string; team: string; points: string; color: string; wins: string }, i: number) => (
            <StandingRow key={i} {...s} isLast={i === standings.length - 1} />
          ))}
        </div>
      </div>

      {/* ── News Strip ──────────────────────────────────────────────────── */}
      <div className="px-5 mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[10px] font-semibold text-[#8e8e93] uppercase tracking-[0.2em]">
            Latest News
          </h2>
          <Link href="/news" className="text-[#00ff94] text-[10px] font-medium">
            All News →
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
          {FALLBACK_NEWS.map((news, i) => (
            <a
              key={i}
              href={news.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-64 bg-[#1c1c1e] rounded-xl border border-[#2c2c2e] overflow-hidden hover:border-[#38383a] transition-all active:scale-[0.98]"
            >
              {/* News image placeholder with gradient */}
              <div className="h-24 bg-gradient-to-br from-[#1a1d24] to-[#0d0f14] relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl opacity-30">🏎️</span>
                </div>
                <div className="absolute bottom-2 left-3">
                  <span className="text-[9px] font-semibold bg-[#00ff94]/20 text-[#00ff94] px-1.5 py-0.5 rounded">
                    {news.source}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-medium leading-snug line-clamp-3">{news.title}</p>
                <p className="text-[#48484a] text-[10px] mt-1.5">
                  {new Date(news.pubDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function CountdownBlock({
  value, label, highlight = false, subtle = false,
}: {
  value: number; label: string; highlight?: boolean; subtle?: boolean;
}) {
  return (
    <div className={`flex-1 rounded-xl p-2.5 text-center border transition-colors ${
      highlight ? "bg-[#00ff94]/15 border-[#00ff94]/30"
      : subtle ? "bg-[#141414] border-[#2c2c2e]"
      : "bg-[#141414] border-[#2c2c2e]"
    }`}>
      <p className={`font-mono font-bold tabular-nums ${
        highlight ? "text-2xl text-[#00ff94]"
        : subtle ? "text-xl text-[#48484a]"
        : "text-2xl text-white"
      }`}>
        {String(value).padStart(2, "0")}
      </p>
      <p className="text-[8px] text-[#636366] uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}

function StandingRow({
  position, driver, team, points, color, wins, isLast,
}: {
  position: string; driver: string; team: string;
  points: string; color: string; wins: string; isLast: boolean;
}) {
  const posNum = parseInt(position);
  const posColor = posNum === 1 ? "#ffd700" : posNum === 2 ? "#c0c0c0" : posNum === 3 ? "#cd7f32" : "#636366";

  return (
    <div className={`flex items-center gap-3 px-4 py-3 border-b border-[#2c2c2e] last:border-0 bg-[#1c1c1e] ${
      isLast ? "rounded-b-2xl" : ""
    }`}>
      <span className="w-4 text-center font-bold tabular-nums text-sm" style={{ color: posColor }}>
        {position}
      </span>
      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{driver}</p>
        <p className="text-[#636366] text-[10px] truncate">{team}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-xs font-bold text-[#00ff94] tabular-nums">{points}</p>
        {parseInt(wins) > 0 && (
          <p className="text-[9px] text-[#ffd700]">{wins}W</p>
        )}
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function shortSessionLabel(type: string): string {
  const map: Record<string, string> = {
    "Practice 1": "FP1", "Practice 2": "FP2", "Practice 3": "FP3",
    "Qualifying": "QUAL", "Sprint Qualifying": "SQ", "Sprint": "SPR",
    "Race": "RACE", "Pre-Race": "WARM", "Qualifying Practice": "QP",
  };
  return map[type] ?? type.slice(0, 4).toUpperCase();
}

function sessionIcon(type: string): string {
  if (type.includes("Race") || type === "Race") return "🏁";
  if (type.includes("Qualifying") || type.includes("Sprint Quali")) return "🔴";
  if (type.includes("Sprint")) return "⚡";
  if (type.includes("Practice") || type.includes("Free Practice")) return "🔧";
  return "📋";
}

function teamColor(team: string): string {
  const colors: Record<string, string> = {
    "Mercedes": "#27F4D2",
    "Ferrari": "#F91536",
    "McLaren": "#F58020",
    "Red Bull Racing": "#3671C6",
    "Aston Martin": "#229971",
    " Alpine": "#FF87BC",
    "Williams": "#64C4FF",
    "Haas F1 Team": "#B6BABD",
    "Kick Sauber": "#52E252",
    "RB": "#141E30",
  };
  return colors[team] ?? "#636366";
}

function countryFlag(country: string): string {
  const flags: Record<string, string> = {
    "Bahrain": "🇧🇭", "Saudi Arabia": "🇸🇦", "Australia": "🇦🇺",
    "Japan": "🇯🇵", "China": "🇨🇳", "Miami": "🇺🇸", "United States": "🇺🇸",
    "Monaco": "🇲🇨", "Canada": "🇨🇦", "Spain": "🇪🇸", "Austria": "🇦🇹",
    "United Kingdom": "🇬🇧", "Belgium": "🇧🇪", "Hungary": "🇭🇺",
    "Netherlands": "🇳🇱", "Italy": "🇮🇹", "Azerbaijan": "🇦🇿",
    "Singapore": "🇸🇬", "Qatar": "🇶🇦", "Mexico": "🇲🇽",
    "Brazil": "🇧🇷", "United Arab Emirates": "🇦🇪", "Abu Dhabi": "🇦🇪",
  };
  return flags[country] ?? "🏁";
}
