"use client";

import { useState } from "react";

const DRIVERS = [
  { number: 1, name: "Lando Norris", acronym: "NOR", team: "McLaren", color: "F47600" },
  { number: 3, name: "Max Verstappen", acronym: "VER", team: "Red Bull", color: "4781D7" },
  { number: 16, name: "Charles Leclerc", acronym: "LEC", team: "Ferrari", color: "E8002D" },
  { number: 44, name: "Lewis Hamilton", acronym: "HAM", team: "Mercedes", color: "27F4D2" },
  { number: 81, name: "Oscar Piastri", acronym: "PIA", team: "McLaren", color: "F47600" },
  { number: 63, name: "George Russell", acronym: "RUS", team: "Mercedes", color: "27F4D2" },
  { number: 12, name: "Kimi Antonelli", acronym: "ANT", team: "Mercedes", color: "27F4D2" },
  { number: 5, name: "Gabriel Bortoleto", acronym: "BOR", team: "Audi", color: "F50537" },
  { number: 27, name: "Nico Hülkenberg", acronym: "HUL", team: "Audi", color: "F50537" },
  { number: 10, name: "Pierre Gasly", acronym: "GAS", team: "Alpine", color: "00A1E8" },
];

const SESSIONS = [
  { id: "FP1", label: "Free Practice 1", icon: "🏎️" },
  { id: "FP2", label: "Free Practice 2", icon: "🏎️" },
  { id: "FP3", label: "Free Practice 3", icon: "🏎️" },
  { id: "SQ", label: "Sprint Qualifying", icon: "⚡" },
  { id: "SPRINT", label: "Sprint Race", icon: "⚡" },
  { id: "Q", label: "Qualifying", icon: "🔴" },
  { id: "RACE", label: "Race", icon: "🏁" },
];

// Generate fake telemetry trace data for visualization
function generateTrace(color: string, baseSpeed: number, laps: number) {
  const points: { x: number; y: number; speed: number }[] = [];
  for (let i = 0; i <= 30; i++) {
    const progress = i / 30;
    const speed = baseSpeed + Math.sin(progress * Math.PI * 4) * 15 + Math.random() * 10;
    points.push({
      x: progress * 100,
      y: 50 + Math.sin(progress * Math.PI * 6) * 25,
      speed: Math.max(0, Math.min(350, speed)),
    });
  }
  return points;
}

function SpeedTrace({ color, driver, selected, onClick }: { color: string; driver: typeof DRIVERS[0]; selected: boolean; onClick: () => void }) {
  const points = generateTrace(color, 180 + Math.random() * 80, 30);
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const gradientId = `gradient-${driver.number}`;
  const traceHeight = 60;

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer transition-all duration-200 ${
        selected ? "scale-[1.02]" : "opacity-60 hover:opacity-80"
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `#${color}` }} />
          <span className="text-xs font-bold">{driver.acronym}</span>
          <span className="text-[10px] text-[#636366]">{driver.name.split(" ").pop()}</span>
        </div>
        <span className="text-xs font-mono text-[#00ff94]">
          {Math.round(points[15].speed)} km/h
        </span>
      </div>
      <svg viewBox={`0 0 100 ${traceHeight}`} className="w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={`#${color}`} stopOpacity="0.2" />
            <stop offset="50%" stopColor={`#${color}`} stopOpacity="0.9" />
            <stop offset="100%" stopColor={`#${color}`} stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {/* Area fill */}
        <path
          d={`${pathD} L 100 ${traceHeight} L 0 ${traceHeight} Z`}
          fill={`url(#${gradientId})`}
        />
        {/* Speed line */}
        <path
          d={pathD}
          stroke={`#${color}`}
          strokeWidth={selected ? 2.5 : 1.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function TelemetryPage() {
  const [selectedDrivers, setSelectedDrivers] = useState<number[]>([1, 3]);
  const [currentSession, setCurrentSession] = useState("RACE");
  const [lapFilter, setLapFilter] = useState("ALL");

  const toggleDriver = (num: number) => {
    setSelectedDrivers((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num].slice(0, 4)
    );
  };

  return (
    <div className="min-h-full px-4 pt-16 pb-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold">Telemetry</h1>
        <p className="text-[#8e8e93] text-sm">Comparador de pilots · Jeddah GP</p>
      </div>

      {/* Session selector */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
        {SESSIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setCurrentSession(s.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              currentSession === s.id
                ? "bg-[#00ff94] text-black"
                : "bg-[#2c2c2e] text-[#8e8e93]"
            }`}
          >
            <span>{s.icon}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Lap filter */}
      <div className="flex gap-2 mb-4">
        {["ALL", "LAP 1", "LAP 10", "LAP 20", "FASTEST"].map((lap) => (
          <button
            key={lap}
            onClick={() => setLapFilter(lap)}
            className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
              lapFilter === lap
                ? "bg-[#38383a] text-white"
                : "bg-[#2c2c2e] text-[#636366]"
            }`}
          >
            {lap}
          </button>
        ))}
      </div>

      {/* Speed traces */}
      <div className="card p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold">
            Speed Trace
          </p>
          <div className="flex items-center gap-1 text-[10px] text-[#636366]">
            <span>↑</span>
            <span>350 km/h</span>
            <span className="mx-1">|</span>
            <span>↓</span>
            <span>0 km/h</span>
          </div>
        </div>

        <div className="space-y-4">
          {DRIVERS.filter((d) => selectedDrivers.includes(d.number)).map((driver) => (
            <SpeedTrace
              key={driver.number}
              color={driver.color}
              driver={driver}
              selected={selectedDrivers.includes(driver.number)}
              onClick={() => toggleDriver(driver.number)}
            />
          ))}
        </div>
      </div>

      {/* Driver selector */}
      <div className="card p-4">
        <p className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold mb-3">
          Compare Drivers (tap to toggle, max 4)
        </p>
        <div className="grid grid-cols-2 gap-2">
          {DRIVERS.map((driver) => {
            const isSelected = selectedDrivers.includes(driver.number);
            return (
              <button
                key={driver.number}
                onClick={() => toggleDriver(driver.number)}
                className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all ${
                  isSelected
                    ? "bg-[#2c2c2e] ring-1 ring-[#00ff94]/50"
                    : "bg-[#1c1c1e]"
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold"
                  style={{ backgroundColor: `#${driver.color}30`, color: `#${driver.color}` }}
                >
                  {driver.acronym}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{driver.name.split(" ")[0]}</p>
                  <p className="text-[10px] text-[#636366]">{driver.team}</p>
                </div>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-[#00ff94]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats summary */}
      {selectedDrivers.length > 0 && (
        <div className="mt-4 card p-4">
          <p className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold mb-3">
            Key Stats
          </p>
          <div className="space-y-2">
            {[
              { label: "Top Speed", value: "326 km/h", driver: "NOR" },
              { label: "Avg Speed", value: "218 km/h", driver: "PIA" },
              { label: "Fastest Lap", value: "1:27.432", driver: "NOR" },
              { label: "G-Force Max", value: "5.2 G", driver: "VER" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-between py-1.5 border-b border-[#38383a]/50 last:border-0">
                <span className="text-xs text-[#8e8e93]">{stat.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#00ff94]">{stat.value}</span>
                  <span className="text-[10px] text-[#636366]">({stat.driver})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {selectedDrivers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-[#636366] text-sm">Selecciona pilots per veure telemetria</p>
        </div>
      )}
    </div>
  );
}
