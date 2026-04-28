"use client";

import { useState } from "react";

const TOTAL_LAPS = 57;

type Compound = "Soft" | "Medium" | "Hard";

interface TyreSegment {
  compound: Compound;
  startLap: number;
  endLap: number;
}

interface DriverStrategy {
  driver: string;
  team: string;
  number: number;
  color: string;
  segments: TyreSegment[];
  stops: number;
  stopLaps: number[];
}

const compoundColors: Record<Compound, string> = {
  Soft: "#FF6B6B",
  Medium: "#FFD93D",
  Hard: "#FFFFFF",
};

const compoundBgColors: Record<Compound, string> = {
  Soft: "rgba(255, 107, 107, 0.2)",
  Medium: "rgba(255, 217, 61, 0.2)",
  Hard: "rgba(255, 255, 255, 0.1)",
};

const compoundEmoji: Record<Compound, string> = {
  Soft: "🔴",
  Medium: "🟡",
  Hard: "⚪",
};

const compoundLabel: Record<Compound, string> = {
  Soft: "SOFT",
  Medium: "MEDIUM",
  Hard: "HARD",
};

const strategies: DriverStrategy[] = [
  {
    driver: "Lando Norris",
    team: "McLaren",
    number: 4,
    color: "F58020",
    segments: [
      { compound: "Medium", startLap: 1, endLap: 18 },
      { compound: "Hard", startLap: 19, endLap: 42 },
      { compound: "Medium", startLap: 43, endLap: 57 },
    ],
    stops: 2,
    stopLaps: [18, 42],
  },
  {
    driver: "Oscar Piastri",
    team: "McLaren",
    number: 81,
    color: "F58020",
    segments: [
      { compound: "Hard", startLap: 1, endLap: 17 },
      { compound: "Medium", startLap: 18, endLap: 41 },
      { compound: "Hard", startLap: 42, endLap: 57 },
    ],
    stops: 2,
    stopLaps: [17, 41],
  },
  {
    driver: "Lewis Hamilton",
    team: "Ferrari",
    number: 44,
    color: "F91536",
    segments: [
      { compound: "Medium", startLap: 1, endLap: 16 },
      { compound: "Hard", startLap: 17, endLap: 44 },
      { compound: "Medium", startLap: 45, endLap: 57 },
    ],
    stops: 2,
    stopLaps: [16, 44],
  },
  {
    driver: "Charles Leclerc",
    team: "Ferrari",
    number: 16,
    color: "F91536",
    segments: [
      { compound: "Medium", startLap: 1, endLap: 22 },
      { compound: "Hard", startLap: 23, endLap: 57 },
    ],
    stops: 1,
    stopLaps: [22],
  },
  {
    driver: "George Russell",
    team: "Mercedes",
    number: 63,
    color: "27F4D2",
    segments: [
      { compound: "Hard", startLap: 1, endLap: 15 },
      { compound: "Medium", startLap: 16, endLap: 40 },
      { compound: "Hard", startLap: 41, endLap: 57 },
    ],
    stops: 2,
    stopLaps: [15, 40],
  },
  {
    driver: "Andrea Kimi Antonelli",
    team: "Mercedes",
    number: 12,
    color: "27F4D2",
    segments: [
      { compound: "Medium", startLap: 1, endLap: 20 },
      { compound: "Hard", startLap: 21, endLap: 45 },
      { compound: "Medium", startLap: 46, endLap: 57 },
    ],
    stops: 2,
    stopLaps: [20, 45],
  },
  {
    driver: "Max Verstappen",
    team: "Red Bull Racing",
    number: 1,
    color: "3671C6",
    segments: [
      { compound: "Hard", startLap: 1, endLap: 18 },
      { compound: "Medium", startLap: 19, endLap: 43 },
      { compound: "Hard", startLap: 44, endLap: 57 },
    ],
    stops: 2,
    stopLaps: [18, 43],
  },
  {
    driver: "Isack Hadjar",
    team: "Red Bull Racing",
    number: 6,
    color: "3671C6",
    segments: [
      { compound: "Medium", startLap: 1, endLap: 15 },
      { compound: "Hard", startLap: 16, endLap: 40 },
      { compound: "Medium", startLap: 41, endLap: 57 },
    ],
    stops: 2,
    stopLaps: [15, 40],
  },
];

function TyreTimeline({ strategy }: { strategy: DriverStrategy }) {
  return (
    <div className="relative">
      {/* Lap markers */}
      <div className="flex justify-between text-[9px] text-[#636366] mb-1 px-px">
        <span>1</span>
        <span>14</span>
        <span>28</span>
        <span>42</span>
        <span>57</span>
      </div>

      {/* Timeline bar */}
      <div className="relative h-10 bg-[#2c2c2e] rounded-lg overflow-hidden">
        {strategy.segments.map((seg, i) => {
          const left = ((seg.startLap - 1) / TOTAL_LAPS) * 100;
          const width = ((seg.endLap - seg.startLap + 1) / TOTAL_LAPS) * 100;
          return (
            <div
              key={i}
              className="absolute top-0 h-full flex items-center justify-center transition-all"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                backgroundColor: compoundBgColors[seg.compound],
                borderLeft: i > 0 ? `1px solid #38383a` : "none",
              }}
            >
              <span
                className="text-[10px] font-semibold tracking-wide hidden group-hover:flex"
                style={{ color: compoundColors[seg.compound] }}
              >
                {compoundLabel[seg.compound]}
              </span>
            </div>
          );
        })}

        {/* Pit stop markers */}
        {strategy.stopLaps.map((lap, i) => {
          const left = ((lap - 0.5) / TOTAL_LAPS) * 100;
          return (
            <div
              key={i}
              className="absolute top-0 h-full w-0.5 z-10"
              style={{ left: `${left}%`, backgroundColor: "#00ff94" }}
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#00ff94]" />
            </div>
          );
        })}
      </div>

      {/* Lap labels under timeline */}
      <div className="flex mt-1 text-[9px] text-[#8e8e93]">
        {strategy.stopLaps.map((lap, i) => (
          <div
            key={i}
            className="flex items-center gap-1"
            style={{
              marginLeft:
                i === 0
                  ? `${((lap - 1) / TOTAL_LAPS) * 100}%`
                  : `${((lap - strategy.stopLaps[i - 1] - 1) / TOTAL_LAPS) * 100}%`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff94] inline-block" />
            <span> Lap {lap}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DriverCard({
  strategy,
  expanded,
  onClick,
}: {
  strategy: DriverStrategy;
  expanded: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className="card p-4 cursor-pointer active:scale-[0.98] transition-all"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border border-[#38383a]"
            style={{ backgroundColor: `#${strategy.color}20`, color: `#${strategy.color}` }}
          >
            {strategy.number}
          </div>
          <div>
            <p className="font-semibold text-sm">{strategy.driver}</p>
            <p className="text-xs text-[#8e8e93]">{strategy.team}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="pill">
            {strategy.stops} {strategy.stops === 1 ? "STOP" : "STOPS"}
          </span>
        </div>
      </div>

      {/* Tyre sequence badges */}
      <div className="flex items-center gap-2 mb-3 overflow-x-auto no-scrollbar">
        {strategy.segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-1">
            <span
              className="text-lg"
              style={{ filter: seg.compound === "Hard" ? "grayscale(30%)" : "none" }}
            >
              {compoundEmoji[seg.compound]}
            </span>
            <span className="text-xs text-[#636366] font-mono">
              {compoundLabel[seg.compound]}
            </span>
            {i < strategy.segments.length - 1 && (
              <span className="text-[#00ff94] text-sm mx-1">→</span>
            )}
          </div>
        ))}
      </div>

      {/* Timeline */}
      <TyreTimeline strategy={strategy} />

      {/* Expanded details */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-[#38383a]">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#2c2c2e] rounded-lg p-2">
              <p className="text-[#636366] mb-1">Strategy Type</p>
              <p className="text-[#00ff94] font-semibold">
                {strategy.stops === 1 ? "One-Stop" : "Two-Stop"}
              </p>
            </div>
            <div className="bg-[#2c2c2e] rounded-lg p-2">
              <p className="text-[#636366] mb-1">Risk Level</p>
              <p className={strategy.stops === 1 ? "text-green-400" : "text-yellow-400"}>
                {strategy.stops === 1 ? "LOW" : "MEDIUM"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Legend() {
  const compounds: Compound[] = ["Soft", "Medium", "Hard"];
  return (
    <div className="flex flex-wrap justify-center gap-4 py-3">
      {compounds.map((c) => (
        <div key={c} className="flex items-center gap-2">
          <span
            className="w-4 h-4 rounded flex items-center justify-center text-xs"
            style={{
              backgroundColor: compoundBgColors[c],
              border: `1px solid ${compoundColors[c]}33`,
            }}
          >
            <span style={{ color: compoundColors[c], fontSize: "8px" }}>●</span>
          </span>
          <span className="text-xs text-[#8e8e93]">
            <span style={{ color: compoundColors[c] }}>{compoundEmoji[c]}</span> {c}
          </span>
        </div>
      ))}
      <div className="flex items-center gap-2">
        <div className="w-4 h-0.5 bg-[#00ff94]" />
        <span className="text-xs text-[#8e8e93]">Pit Stop</span>
      </div>
    </div>
  );
}

function SummaryCard() {
  const twoStopDrivers = strategies.filter((s) => s.stops === 2).length;
  const oneStopDrivers = strategies.filter((s) => s.stops === 1).length;

  return (
    <div className="card p-4">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <span className="text-[#00ff94]">📊</span> Race Strategy Analysis
      </h3>

      <div className="space-y-3">
        <div className="bg-[#2c2c2e] rounded-xl p-3">
          <p className="text-[10px] text-[#636366] uppercase tracking-wider mb-1">
            Most Popular Strategy
          </p>
          <p className="text-[#00ff94] font-bold text-lg">Two-Stop</p>
          <p className="text-xs text-[#8e8e93] mt-0.5">
            {twoStopDrivers} of {strategies.length} drivers (
            {Math.round((twoStopDrivers / strategies.length) * 100)}%)
          </p>
        </div>

        <div className="bg-[#2c2c2e] rounded-xl p-3">
          <p className="text-[10px] text-[#636366] uppercase tracking-wider mb-1">
            Expected Pace
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-400 to-white" />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-green-400">🔴 Soft = Fast</span>
            <span className="text-[9px] text-white/60">⚪ Hard = Slow</span>
          </div>
        </div>

        <div className="bg-[#2c2c2e] rounded-xl p-3">
          <p className="text-[10px] text-[#636366] uppercase tracking-wider mb-1">
            Risk Assessment
          </p>
          <div className="flex gap-2 mt-1">
            <div className="flex-1 text-center p-2 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-green-400 text-xs font-semibold">1-Stop</p>
              <p className="text-[9px] text-[#636366] mt-0.5">Low Risk</p>
            </div>
            <div className="flex-1 text-center p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-yellow-400 text-xs font-semibold">2-Stop</p>
              <p className="text-[9px] text-[#636366] mt-0.5">Better Pace</p>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-[#636366] text-center mt-2">
          ⚠️ Strategy data based on simulated race conditions
        </div>
      </div>
    </div>
  );
}

export default function TyresPage() {
  const [expandedDriver, setExpandedDriver] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-16 pb-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl font-bold mb-1">Miami GP 2026</h1>
          <p className="text-sm text-[#8e8e93]">Tyre Strategy Visualizer</p>
        </div>

        {/* Info banner */}
        <div className="bg-[#2c2c2e] rounded-xl p-3 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#00ff94]/10 flex items-center justify-center text-lg">
            🏁
          </div>
          <div>
            <p className="text-sm font-semibold">Miami International Autodrome</p>
            <p className="text-xs text-[#8e8e93]">57 laps • 5.41 km • 19 turns</p>
          </div>
        </div>

        {/* Legend */}
        <div className="card p-2 mb-4">
          <Legend />
        </div>

        {/* Summary Card */}
        <div className="mb-4">
          <SummaryCard />
        </div>

        {/* Driver Strategies */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[#8e8e93] uppercase tracking-wider px-1">
            Top 8 Grid — Strategy Overview
          </h2>
          {strategies.map((strategy) => (
            <DriverCard
              key={strategy.driver}
              strategy={strategy}
              expanded={expandedDriver === strategy.driver}
              onClick={() =>
                setExpandedDriver(
                  expandedDriver === strategy.driver ? null : strategy.driver
                )
              }
            />
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-[10px] text-[#636366]">
          <p>Data refreshed: 28 Apr 2026 12:45</p>
          <p className="mt-1">F1Pro Tyre Strategy Module v1.0</p>
        </div>
      </div>
    </div>
  );
}