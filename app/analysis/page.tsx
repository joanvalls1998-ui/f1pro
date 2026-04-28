import Link from "next/link";

// ─── Speed Trap Data (2026 Pre-season predictions) ─────────────────────────
const SPEED_TRAP_DATA = [
  { rank: 1, driver: "Lando Norris", team: "McLaren", speed: 338, color: "#F58020", diff: 0 },
  { rank: 2, driver: "Oscar Piastri", team: "McLaren", speed: 336, color: "#F58020", diff: 2 },
  { rank: 3, driver: "Max Verstappen", team: "Red Bull Racing", speed: 335, color: "#3671C6", diff: 3 },
  { rank: 4, driver: "Lewis Hamilton", team: "Ferrari", speed: 333, color: "#F91536", diff: 5 },
  { rank: 5, driver: "Charles Leclerc", team: "Ferrari", speed: 332, color: "#F91536", diff: 6 },
];

// ─── G-Force Data ─────────────────────────────────────────────────────────────
const GFORCE_DATA = [
  { turn: "Turn 1", name: "Hairpin", gforce: 4.5, note: "Heaviest braking zone" },
  { turn: "Turn 4", name: "Long right", gforce: 3.8, note: "High-speed lateral" },
  { turn: "Turn 7", name: "Chicane", gforce: 3.2, note: "Direction change" },
  { turn: "Turn 11", name: "Medium", gforce: 3.5, note: "Balanced corner" },
  { turn: "Turn 16", name: "Slow corner", gforce: 4.2, note: "Tight + high load" },
];

// ─── Key Insights ─────────────────────────────────────────────────────────────
const INSIGHTS = [
  { label: "Highest G-Force", value: "Turn 1 (4.5G)", icon: "⚠️" },
  { label: "Fastest Trap", value: "338 km/h", icon: "📸" },
  { label: "Average G-Force", value: "3.6G", icon: "📊" },
];

const MAX_GFORCE = 5.0;

// ─── Page Component ───────────────────────────────────────────────────────────
export default function AnalysisPage() {
  return (
    <div className="min-h-full pb-20">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00ff94]/10 to-transparent" />
        <div className="relative px-5 pt-16 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#8e8e93] text-[10px] font-semibold uppercase tracking-widest mb-1">
                Miami GP · Round 7
              </p>
              <h1 className="text-2xl font-bold tracking-tight">Analysis</h1>
              <p className="text-[#636366] text-xs mt-0.5">Speed traps & G-Force</p>
            </div>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-[#00ff94] text-xs font-medium"
            >
              ← Home
            </Link>
          </div>
        </div>
      </div>

      {/* ── Key Insights ────────────────────────────────────────────────── */}
      <div className="px-5 mb-5">
        <div className="grid grid-cols-3 gap-2">
          {INSIGHTS.map((insight) => (
            <div
              key={insight.label}
              className="bg-[#1c1c1e] border border-[#38383a] rounded-2xl p-3 text-center"
            >
              <div className="text-xl mb-1.5">{insight.icon}</div>
              <p className="text-[10px] text-[#636366] uppercase tracking-wider mb-1">
                {insight.label}
              </p>
              <p className="text-sm font-bold text-white">{insight.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Speed Trap Section ──────────────────────────────────────────── */}
      <div className="px-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-[#8e8e93] uppercase tracking-widest">
            Speed Trap · Main Straight
          </h2>
          <span className="bg-[#00ff94]/10 border border-[#00ff94]/30 rounded-full px-2.5 py-0.5 text-[10px] text-[#00ff94] font-bold">
            TOP 5
          </span>
        </div>

        <div className="space-y-2">
          {SPEED_TRAP_DATA.map((entry) => (
            <div
              key={entry.driver}
              className="flex items-center gap-3 px-4 py-3 bg-[#1c1c1e] rounded-2xl border border-[#38383a]"
            >
              {/* Rank */}
              <span
                className={`w-6 text-center font-bold text-sm tabular-nums ${
                  entry.rank === 1
                    ? "text-[#ffd700]"
                    : entry.rank === 2
                    ? "text-[#c0c0c0]"
                    : entry.rank === 3
                    ? "text-[#cd7f32]"
                    : "text-[#636366]"
                }`}
              >
                {entry.rank}
              </span>

              {/* Team color dot */}
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: entry.color }}
              />

              {/* Driver info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{entry.driver}</p>
                <p className="text-[#636366] text-[10px]">{entry.team}</p>
              </div>

              {/* Speed — large */}
              <div className="text-right flex-shrink-0">
                <p className="text-2xl font-bold font-mono tabular-nums leading-none">
                  {entry.speed}
                  <span className="text-[10px] font-normal text-[#636366] ml-0.5">km/h</span>
                </p>
                {entry.diff > 0 && (
                  <p className="text-[10px] text-[#636366] font-mono mt-0.5">
                    +{entry.diff}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Speed leader bar */}
        <div className="mt-3 px-4 py-2.5 bg-[#141414] rounded-xl border border-[#2c2c2e]">
          <p className="text-[10px] text-[#636366] uppercase tracking-wider mb-1.5">
            Qualifying speed distribution
          </p>
          <div className="flex items-end gap-1.5 h-10">
            {SPEED_TRAP_DATA.map((entry) => {
              const width = ((entry.speed - 320) / 20) * 100;
              return (
                <div key={entry.driver} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-sm transition-all"
                    style={{
                      height: `${width}%`,
                      backgroundColor:
                        entry.rank === 1
                          ? "#00ff94"
                          : entry.rank === 2
                          ? "#00cc77"
                          : entry.rank === 3
                          ? "#00aa66"
                          : "#00ff9430",
                    }}
                  />
                  <span className="text-[8px] text-[#48484a] font-mono">
                    {entry.speed}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── G-Force Analysis ─────────────────────────────────────────────── */}
      <div className="px-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-[#8e8e93] uppercase tracking-widest">
            G-Force Analysis · Miami GP
          </h2>
          <span className="bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 rounded-full px-2.5 py-0.5 text-[10px] text-[#ff6b6b] font-bold">
            PEAK LOADS
          </span>
        </div>

        <div className="space-y-3">
          {GFORCE_DATA.map((corner) => {
            const pct = (corner.gforce / MAX_GFORCE) * 100;
            const barColor =
              corner.gforce > 4
                ? "#ff4444"
                : corner.gforce >= 3
                ? "#ffcc00"
                : "#00ff94";

            return (
              <div
                key={corner.turn}
                className="bg-[#1c1c1e] border border-[#38383a] rounded-2xl p-4"
              >
                {/* Header row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{corner.turn}</span>
                    <span className="text-[#636366] text-xs">({corner.name})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#636366] text-[10px]">{corner.note}</span>
                    <span
                      className="text-xl font-bold font-mono tabular-nums"
                      style={{ color: barColor }}
                    >
                      {corner.gforce}G
                    </span>
                  </div>
                </div>

                {/* G-force bar */}
                <div className="relative h-3 bg-[#2c2c2e] rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: barColor,
                    }}
                  />
                  {/* Threshold markers */}
                  <div className="absolute inset-0 flex items-center">
                    <div className="absolute left-[60%] w-px h-full bg-[#38383a]" />
                    <div className="absolute left-[80%] w-px h-full bg-[#38383a]" />
                  </div>
                </div>

                {/* Scale labels */}
                <div className="flex justify-between mt-1">
                  <span className="text-[9px] text-[#48484a]">0G</span>
                  <span className="text-[9px] text-[#48484a]">3G</span>
                  <span className="text-[9px] text-[#48484a]">4G</span>
                  <span className="text-[9px] text-[#48484a]">5G</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* G-Force legend */}
        <div className="flex items-center justify-center gap-4 mt-3 px-4 py-2.5 bg-[#141414] rounded-xl border border-[#2c2c2e]">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff4444]" />
            <span className="text-[10px] text-[#636366]">&gt;4G High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ffcc00]" />
            <span className="text-[10px] text-[#636366]">3–4G Med</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#00ff94]" />
            <span className="text-[10px] text-[#636366]">&lt;3G Low</span>
          </div>
        </div>
      </div>

      {/* ── Combined Insights Card ───────────────────────────────────────── */}
      <div className="px-5 mb-5">
        <div className="rounded-2xl bg-gradient-to-br from-[#1c1c1e] to-[#141414] border border-[#38383a] p-5">
          <h3 className="text-xs font-semibold text-[#00ff94] uppercase tracking-widest mb-3">
            🏁 Key Takeaways · Miami GP
          </h3>
          <div className="space-y-2.5">
            <InsightRow
              icon="🔴"
              title="Heaviest braking: Turn 1"
              desc="4.5G — the hairpin demands maximum deceleration from 300+ km/h"
            />
            <InsightRow
              icon="📸"
              title="Top speed: 338 km/h"
              desc="Norris leads the speed trap in the McLaren, ahead of Piastri (336) and Verstappen (335)"
            />
            <InsightRow
              icon="⚡"
              title="McLaren dominance"
              desc="Norris (338) and Piastri (336) lead — McLaren looks strong heading into 2026"
            />
            <InsightRow
              icon="📊"
              title="Average G-Force: 3.6G"
              desc="Miami is a medium-high load circuit — sustained concentration required"
            />
          </div>
        </div>
      </div>

      {/* ── Footer nav hint ─────────────────────────────────────────────── */}
      <div className="px-5">
        <div className="flex items-center justify-center gap-6 text-[10px] text-[#48484a]">
          <Link href="/telemetry" className="flex flex-col items-center gap-1">
            <span className="text-xl">📊</span>
            Telemetry
          </Link>
          <Link href="/live" className="flex flex-col items-center gap-1">
            <span className="text-xl">⚡</span>
            Live
          </Link>
          <Link href="/circuits" className="flex flex-col items-center gap-1">
            <span className="text-xl">🏁</span>
            Circuits
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function InsightRow({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-lg leading-none mt-0.5">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-[#636366] text-xs mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}