"use client";

import { useEffect, useState } from "react";

// ── Team colours ──────────────────────────────────────────────────────────────
const TEAM_COLORS: Record<string, string> = {
  "McLaren": "#ff8000",
  "Mercedes": "#27f4d2",
  "Red Bull Racing": "#1e41db",
  "Ferrari": "#e6002d",
  "Williams": "#00ccff",
  "Alpine": "#ff87ab",
  "Haas": "#c8102e",
  "Aston Martin": "#00594b",
  "Audi": "#bf2626",
  "Racing Bulls": "#1631cb",
  "Sauber": "#bf2626",
  "AlphaTauri": "#4e4e4e",
  "Lotus": "#004225",
  "Force India": "#ff8000",
  "Manor Marussia": "#6f0000",
  "Renault": "#ffce0a",
};

// ── Fallback data ─────────────────────────────────────────────────────────────
const FALLBACK_DRIVERS = [
  { position: "1", Driver: { givenName: "Lando", familyName: "Norris", team: "McLaren" }, points: "85" },
  { position: "2", Driver: { givenName: "Oscar", familyName: "Piastri", team: "McLaren" }, points: "74" },
  { position: "3", Driver: { givenName: "Max", familyName: "Verstappen", team: "Red Bull Racing" }, points: "71" },
  { position: "4", Driver: { givenName: "Kimi", familyName: "Antonelli", team: "Mercedes" }, points: "52" },
  { position: "5", Driver: { givenName: "George", familyName: "Russell", team: "Mercedes" }, points: "48" },
  { position: "6", Driver: { givenName: "Charles", familyName: "Leclerc", team: "Ferrari" }, points: "40" },
  { position: "7", Driver: { givenName: "Lewis", familyName: "Hamilton", team: "Mercedes" }, points: "38" },
  { position: "8", Driver: { givenName: "Carlos", familyName: "Sainz Jr.", team: "Williams" }, points: "30" },
  { position: "9", Driver: { givenName: "Pierre", familyName: "Gasly", team: "Alpine" }, points: "22" },
  { position: "10", Driver: { givenName: "Isack", familyName: "Hadjar", team: "Red Bull Racing" }, points: "18" },
  { position: "11", Driver: { givenName: "Alex", familyName: "Albon", team: "Williams" }, points: "14" },
  { position: "12", Driver: { givenName: "Lance", familyName: "Stroll", team: "Aston Martin" }, points: "12" },
  { position: "13", Driver: { givenName: "Fernando", familyName: "Alonso", team: "Aston Martin" }, points: "8" },
  { position: "14", Driver: { givenName: "Nico", familyName: "Hülkenberg", team: "Haas" }, points: "6" },
  { position: "15", Driver: { givenName: "Yuki", familyName: "Tsunoda", team: "Racing Bulls" }, points: "5" },
  { position: "16", Driver: { givenName: "Oliver", familyName: "Bearman", team: "Haas" }, points: "4" },
  { position: "17", Driver: { givenName: "Gabriel", familyName: "Bortoleto", team: "Sauber" }, points: "2" },
  { position: "18", Driver: { givenName: "Zhou", familyName: "Guanyu", team: "Sauber" }, points: "1" },
  { position: "19", Driver: { givenName: "Liam", familyName: "Lawson", team: "Racing Bulls" }, points: "1" },
  { position: "20", Driver: { givenName: "Franco", familyName: "Colapinto", team: "Alpine" }, points: "0" },
];

const FALLBACK_CONSTRUCTORS = [
  { position: "1", Constructor: { name: "McLaren" }, points: "159" },
  { position: "2", Constructor: { name: "Mercedes" }, points: "138" },
  { position: "3", Constructor: { name: "Red Bull Racing" }, points: "89" },
  { position: "4", Constructor: { name: "Ferrari" }, points: "78" },
  { position: "5", Constructor: { name: "Williams" }, points: "52" },
  { position: "6", Constructor: { name: "Alpine" }, points: "34" },
  { position: "7", Constructor: { name: "Haas" }, points: "18" },
  { position: "8", Constructor: { name: "Aston Martin" }, points: "12" },
  { position: "9", Constructor: { name: "Audi" }, points: "8" },
  { position: "10", Constructor: { name: "Racing Bulls" }, points: "6" },
];

// ── Types ─────────────────────────────────────────────────────────────────────
interface ErgastDriverStanding {
  position: string;
  Driver: { givenName: string; familyName: string; team?: string };
  points: string;
  Constructors?: Array<{ name: string }>;
}

interface ErgastConstructorStanding {
  position: string;
  Constructor: { name: string };
  points: string;
}

interface ErgastResponse {
  StandingsTable?: {
    StandingsLists?: Array<{
      DriverStandings?: ErgastDriverStanding[];
      ConstructorStandings?: ErgastConstructorStanding[];
    }>;
  };
}

// ── Fetch helpers ─────────────────────────────────────────────────────────────
async function fetchStandings() {
  const [driversRes, constructorsRes] = await Promise.all([
    fetch("/api/ergast?endpoint=current/driverStandings.json"),
    fetch("/api/ergast?endpoint=current/constructorStandings.json"),
  ]);

  if (!driversRes.ok || !constructorsRes.ok) throw new Error("Ergast fetch failed");

  const [driversData, constructorsData]: [ErgastResponse, ErgastResponse] = await Promise.all([
    driversRes.json(),
    constructorsRes.json(),
  ]);

  const driversStanding =
    driversData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? [];
  const constructorsStanding =
    constructorsData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ?? [];

  return { drivers: driversStanding, constructors: constructorsStanding };
}

// ── Sub-components ────────────────────────────────────────────────────────────
function DriverRow({
  rank,
  driver,
  team,
  points,
  color,
}: {
  rank: number;
  driver: string;
  team: string;
  points: string;
  color: string;
}) {
  const isPodium = rank <= 3;
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#38383a] last:border-0">
      <span
        className={`w-7 text-center font-bold text-xl tabular-nums ${
          isPodium ? "text-[#ffd700]" : "text-[#636366]"
        }`}
      >
        {rank}
      </span>
      <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[15px] truncate">{driver}</p>
        <p className="text-[#636366] text-xs truncate">{team}</p>
      </div>
      <span className="text-lg font-bold text-white tabular-nums flex-shrink-0">{points}</span>
    </div>
  );
}

function ConstructorRow({
  rank,
  team,
  points,
  color,
}: {
  rank: number;
  team: string;
  points: string;
  color: string;
}) {
  const isPodium = rank <= 3;
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#38383a] last:border-0">
      <span
        className={`w-7 text-center font-bold text-xl tabular-nums ${
          isPodium ? "text-[#ffd700]" : "text-[#636366]"
        }`}
      >
        {rank}
      </span>
      <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[15px] truncate">{team}</p>
      </div>
      <span className="text-lg font-bold text-white tabular-nums flex-shrink-0">{points}</span>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function StandingsPage() {
  const [drivers, setDrivers] = useState<ErgastDriverStanding[]>(FALLBACK_DRIVERS);
  const [constructors, setConstructors] = useState<ErgastConstructorStanding[]>(FALLBACK_CONSTRUCTORS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchStandings()
      .then(({ drivers: d, constructors: c }) => {
        setDrivers(d.length > 0 ? d : FALLBACK_DRIVERS);
        setConstructors(c.length > 0 ? c : FALLBACK_CONSTRUCTORS);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const driverRows = drivers.slice(0, 20);
  const constructorRows = constructors.slice(0, 10);

  return (
    <div className="min-h-full px-5 pt-16 pb-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-0.5">Classificació</h1>
            <p className="text-[#8e8e93] text-sm">Temporada 2026</p>
          </div>
          {!loading && !error && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#30d158] animate-pulse" />
              <span className="text-xs text-[#8e8e93]">Live</span>
            </div>
          )}
          {error && (
            <span className="text-xs text-[#ff9500]">Dades offline</span>
          )}
        </div>
      </div>

      {/* ── Drivers ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Pilots</h2>
          <span className="pill">Top 20</span>
        </div>
        <div className="card overflow-hidden">
          {driverRows.map((d, i) => {
            const rank = i + 1;
            const driverName = `${d.Driver.givenName} ${d.Driver.familyName}`;
            // team from Ergast is in Constructors[0].name
            const teamName = d.Constructors?.[0]?.name ?? d.Driver.team ?? "Unknown";
            const color = TEAM_COLORS[teamName] ?? "#636366";
            return (
              <DriverRow
                key={`driver-${rank}`}
                rank={rank}
                driver={driverName}
                team={teamName}
                points={d.points}
                color={color}
              />
            );
          })}
        </div>
      </div>

      {/* ── Constructors ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Constructors</h2>
          <span className="pill">Top 10</span>
        </div>
        <div className="card overflow-hidden">
          {constructorRows.map((c, i) => {
            const rank = i + 1;
            const color = TEAM_COLORS[c.Constructor.name] ?? "#636366";
            return (
              <ConstructorRow
                key={`constructor-${rank}`}
                rank={rank}
                team={c.Constructor.name}
                points={c.points}
                color={color}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
