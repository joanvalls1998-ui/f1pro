"use client";

import { useEffect, useState } from "react";

// ── Team colours (corrected 2026) ──────────────────────────────────────────────
const TEAM_COLORS: Record<string, string> = {
  "McLaren": "#F58020",
  "Mercedes": "#27F4D2",
  "Red Bull Racing": "#3671C6",
  "Ferrari": "#F91536",
  "Williams": "#37BEDD",
  "Racing Bulls": "#2D0D0D",
  "Aston Martin": "#358C75",
  "Audi": "#F50537",
  "Haas": "#B6BABD",
  "Alpine": "#2293D1",
  "Cadillac": "#909090",
};

// ── 2026 Season Results (after Round 3: Australia, China, Japan) ──────────────
// Bahrain & Saudi Arabia were cancelled
const FALLBACK_DRIVERS = [
  { position: "1", Driver: { givenName: "Kimi", familyName: "Antonelli", team: "Mercedes" }, points: "72" },
  { position: "2", Driver: { givenName: "George", familyName: "Russell", team: "Mercedes" }, points: "63" },
  { position: "3", Driver: { givenName: "Charles", familyName: "Leclerc", team: "Ferrari" }, points: "49" },
  { position: "4", Driver: { givenName: "Lewis", familyName: "Hamilton", team: "Ferrari" }, points: "41" },
  { position: "5", Driver: { givenName: "Lando", familyName: "Norris", team: "McLaren" }, points: "25" },
  { position: "6", Driver: { givenName: "Oscar", familyName: "Piastri", team: "McLaren" }, points: "21" },
  { position: "7", Driver: { givenName: "Max", familyName: "Verstappen", team: "Red Bull Racing" }, points: "18" },
  { position: "8", Driver: { givenName: "Oliver", familyName: "Bearman", team: "Haas" }, points: "12" },
  { position: "9", Driver: { givenName: "Fernando", familyName: "Alonso", team: "Aston Martin" }, points: "8" },
  { position: "10", Driver: { givenName: "Gabriel", familyName: "Bortoleto", team: "Audi" }, points: "6" },
  { position: "11", Driver: { givenName: "Nico", familyName: "Hülkenberg", team: "Audi" }, points: "4" },
  { position: "12", Driver: { givenName: "Pierre", familyName: "Gasly", team: "Alpine" }, points: "4" },
  { position: "13", Driver: { givenName: "Isack", familyName: "Hadjar", team: "Red Bull Racing" }, points: "4" },
  { position: "14", Driver: { givenName: "Lance", familyName: "Stroll", team: "Aston Martin" }, points: "2" },
  { position: "15", Driver: { givenName: "Carlos", familyName: "Sainz", team: "Williams" }, points: "2" },
  { position: "16", Driver: { givenName: "Alex", familyName: "Albon", team: "Williams" }, points: "0" },
  { position: "17", Driver: { givenName: "Liam", familyName: "Lawson", team: "Racing Bulls" }, points: "0" },
  { position: "18", Driver: { givenName: "Arvid", familyName: "Lindblad", team: "Racing Bulls" }, points: "0" },
  { position: "19", Driver: { givenName: "Franco", familyName: "Colapinto", team: "Alpine" }, points: "0" },
  { position: "20", Driver: { givenName: "Esteban", familyName: "Ocon", team: "Haas" }, points: "0" },
  { position: "21", Driver: { givenName: "Valtteri", familyName: "Bottas", team: "Cadillac" }, points: "0" },
  { position: "22", Driver: { givenName: "Sergio", familyName: "Pérez", team: "Cadillac" }, points: "0" },
];

const FALLBACK_CONSTRUCTORS = [
  { position: "1", Constructor: { name: "Mercedes" }, points: "135" },
  { position: "2", Constructor: { name: "Ferrari" }, points: "90" },
  { position: "3", Constructor: { name: "McLaren" }, points: "46" },
  { position: "4", Constructor: { name: "Haas" }, points: "18" },
  { position: "5", Constructor: { name: "Alpine" }, points: "16" },
  { position: "6", Constructor: { name: "Red Bull Racing" }, points: "22" },
  { position: "7", Constructor: { name: "Aston Martin" }, points: "10" },
  { position: "8", Constructor: { name: "Audi" }, points: "10" },
  { position: "9", Constructor: { name: "Williams" }, points: "2" },
  { position: "10", Constructor: { name: "Racing Bulls" }, points: "0" },
  { position: "11", Constructor: { name: "Cadillac" }, points: "0" },
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

  const driverRows = drivers.slice(0, 22);
  const constructorRows = constructors.slice(0, 11);

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

      {/* Race results banner */}
      <div className="bg-[#ffd700]/10 border border-[#ffd700]/30 rounded-xl p-3 mb-4 flex items-center gap-3">
        <span className="text-xl">🏆</span>
        <div>
          <p className="text-sm font-semibold text-[#ffd700]">Temporada 2026 en curs · 3 curses completades</p>
          <p className="text-xs text-[#8e8e93]">R1: Russell (AUS) · R2: Antonelli (CHN) · R3: Antonelli (JPN) · Bahrain &amp; Saudi: CANCEL·LADES</p>
        </div>
      </div>

      {/* ── Drivers ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Pilots</h2>
          <span className="pill">Top 22</span>
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
          <span className="pill">Top 11</span>
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
