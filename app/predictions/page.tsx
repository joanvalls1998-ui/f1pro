"use client";

import { useState } from "react";

// ── Driver/Team data ──────────────────────────────────────────────────────────
const DRIVERS_2026 = [
  { name: "Kimi Antonelli", acronym: "ANT", team: "Mercedes", color: "27F4D2", pts: 72, wins: 2, podiums: 3 },
  { name: "George Russell", acronym: "RUS", team: "Mercedes", color: "27F4D2", pts: 63, wins: 1, podiums: 3 },
  { name: "Charles Leclerc", acronym: "LEC", team: "Ferrari", color: "F91536", pts: 49, wins: 0, podiums: 2 },
  { name: "Lewis Hamilton", acronym: "HAM", team: "Ferrari", color: "F91536", pts: 41, wins: 0, podiums: 2 },
  { name: "Lando Norris", acronym: "NOR", team: "McLaren", color: "F58020", pts: 25, wins: 0, podiums: 1 },
  { name: "Oscar Piastri", acronym: "PIA", team: "McLaren", color: "F58020", pts: 21, wins: 0, podiums: 1 },
  { name: "Max Verstappen", acronym: "VER", team: "Red Bull Racing", color: "3671C6", pts: 18, wins: 0, podiums: 1 },
  { name: "Oliver Bearman", acronym: "BEA", team: "Haas", color: "B6BABD", pts: 12, wins: 0, podiums: 0 },
  { name: "Fernando Alonso", acronym: "ALO", team: "Aston Martin", color: "358C75", pts: 8, wins: 0, podiums: 0 },
  { name: "Gabriel Bortoleto", acronym: "BOR", team: "Audi", color: "F50537", pts: 6, wins: 0, podiums: 0 },
  { name: "Nico Hülkenberg", acronym: "HUL", team: "Audi", color: "F50537", pts: 4, wins: 0, podiums: 0 },
  { name: "Pierre Gasly", acronym: "GAS", team: "Alpine", color: "2293D1", pts: 4, wins: 0, podiums: 0 },
  { name: "Isack Hadjar", acronym: "HAD", team: "Red Bull Racing", color: "3671C6", pts: 4, wins: 0, podiums: 0 },
  { name: "Lance Stroll", acronym: "STR", team: "Aston Martin", color: "358C75", pts: 2, wins: 0, podiums: 0 },
  { name: "Carlos Sainz", acronym: "SAI", team: "Williams", color: "37BEDD", pts: 2, wins: 0, podiums: 0 },
  { name: "Alex Albon", acronym: "ALB", team: "Williams", color: "37BEDD", pts: 0, wins: 0, podiums: 0 },
  { name: "Liam Lawson", acronym: "LAW", team: "Racing Bulls", color: "2D0D0D", pts: 0, wins: 0, podiums: 0 },
  { name: "Arvid Lindblad", acronym: "LIN", team: "Racing Bulls", color: "2D0D0D", pts: 0, wins: 0, podiums: 0 },
  { name: "Franco Colapinto", acronym: "COL", team: "Alpine", color: "2293D1", pts: 0, wins: 0, podiums: 0 },
  { name: "Esteban Ocon", acronym: "OCO", team: "Haas", color: "B6BABD", pts: 0, wins: 0, podiums: 0 },
  { name: "Valtteri Bottas", acronym: "BOT", team: "Cadillac", color: "909090", pts: 0, wins: 0, podiums: 0 },
  { name: "Sergio Pérez", acronym: "PER", team: "Cadillac", color: "909090", pts: 0, wins: 0, podiums: 0 },
];

const TEAMS = [
  { name: "Mercedes", color: "27F4D2", pts: 135 },
  { name: "Ferrari", color: "F91536", pts: 90 },
  { name: "McLaren", color: "F58020", pts: 46 },
  { name: "Red Bull Racing", color: "3671C6", pts: 22 },
  { name: "Haas", color: "B6BABD", pts: 18 },
  { name: "Alpine", color: "2293D1", pts: 16 },
  { name: "Aston Martin", color: "358C75", pts: 10 },
  { name: "Audi", color: "F50537", pts: 10 },
  { name: "Williams", color: "37BEDD", pts: 2 },
  { name: "Racing Bulls", color: "2D0D0D", pts: 0 },
  { name: "Cadillac", color: "909090", pts: 0 },
];

// ── Prediction logic ────────────────────────────────────────────────────────
function predictRace() {
  // Simple prediction based on: form (recent pts) + Miami circuit characteristics
  // Miami: high top speed (long straights), medium downforce, good braking zones
  // Favorites: Mercedes (top speed), Ferrari (engine), McLaren (overall package)
  // Overachievers: Haas (good on straights)
  // Under-achievers: Red Bull (RB21 has been unreliable), Aston Martin (still adapting)

  const form = DRIVERS_2026.map((d) => {
    let score = d.pts * 1.2; // base form
    score += d.wins * 25;
    score += d.podiums * 10;

    // Miami-specific adjustments
    if (d.team === "Mercedes") score += 8; // strong top speed
    if (d.team === "Ferrari") score += 7; // power unit advantage
    if (d.team === "McLaren") score += 6; // balanced package
    if (d.acronym === "NOR") score += 5; // Norris strong on this track type
    if (d.acronym === "VER") score -= 8; // unreliable car
    if (d.acronym === "BEA") score += 4; // Haas good on straights
    if (d.acronym === "HAM") score += 3; // Hamilton motivated, Ferrari improved
    if (d.acronym === "ALO") score += 2; // experience matters

    return { ...d, score };
  });

  const sorted = form.sort((a, b) => b.score - a.score);

  return sorted.map((d, i) => ({
    ...d,
    predictedPosition: i + 1,
    predictedPoints: i < 10 ? [25, 18, 15, 12, 10, 8, 6, 4, 2, 1][i] : 0,
    predictedDNF: i > 15 ? Math.random() < 0.15 : Math.random() < 0.03,
    winProbability: Math.max(0, Math.min(100, Math.round((d.score / form[0].score) * 40))),
  }));
}

const PREDICTION = predictRace();
const DNF_LIST = PREDICTION.filter((d) => d.predictedDNF);

// ── Sprint prediction ──────────────────────────────────────────────────────────
function predictSprint() {
  const form = DRIVERS_2026.map((d) => {
    let score = d.pts * 0.8; // less weight on season pts for sprint
    score += d.wins * 20;
    if (d.team === "Mercedes") score += 6;
    if (d.team === "Ferrari") score += 5;
    if (d.acronym === "VER") score -= 5;
    return { ...d, score };
  });
  return form.sort((a, b) => b.score - a.score).map((d, i) => ({
    ...d,
    predictedPosition: i + 1,
    sprintPoints: i < 8 ? [8, 7, 6, 5, 4, 3, 2, 1][i] : 0,
  }));
}

const SPRINT_PRED = predictSprint();

// ── Components ────────────────────────────────────────────────────────────────
function PodiumCard({ drivers, label }: { drivers: { acronym: string; name: string; team: string; color: string }[]; label: string }) {
  return (
    <div className="card p-4 mb-4">
      <p className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold mb-3">
        {label}
      </p>
      <div className="flex items-end justify-center gap-2">
        {/* 2nd */}
        <div className="flex flex-col items-center flex-1">
          <div
            className="w-full rounded-t-2xl flex flex-col items-center pt-3 pb-2"
            style={{ background: "#c0c0c0", minHeight: 80 }}
          >
            <span className="text-[10px] font-bold text-gray-700 mb-1">2nd</span>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ backgroundColor: `#${drivers[1].color}40`, color: `#${drivers[1].color}` }}
            >
              {drivers[1].acronym}
            </div>
            <p className="text-xs font-semibold text-gray-800 mt-1">{drivers[1].acronym}</p>
            <p className="text-[9px] text-gray-600">{drivers[1].team.split(" ")[0]}</p>
          </div>
          <p className="text-xs font-semibold text-gray-500 mt-1">18 pts</p>
        </div>

        {/* 1st */}
        <div className="flex flex-col items-center flex-1">
          <div
            className="w-full rounded-t-2xl flex flex-col items-center pt-3 pb-2"
            style={{ background: "#ffd700", minHeight: 100 }}
          >
            <span className="text-[10px] font-bold text-yellow-800 mb-1">1st</span>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ backgroundColor: "#0003", color: "#000" }}
            >
              {drivers[0].acronym}
            </div>
            <p className="text-sm font-bold text-yellow-900 mt-1">{drivers[0].acronym}</p>
            <p className="text-[9px] text-yellow-800">{drivers[0].team.split(" ")[0]}</p>
          </div>
          <p className="text-sm font-bold text-[#ffd700] mt-1">25 pts</p>
        </div>

        {/* 3rd */}
        <div className="flex flex-col items-center flex-1">
          <div
            className="w-full rounded-t-2xl flex flex-col items-center pt-3 pb-2"
            style={{ background: "#cd7f32", minHeight: 65 }}
          >
            <span className="text-[10px] font-bold text-orange-900 mb-1">3rd</span>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ backgroundColor: `#${drivers[2].color}40`, color: `#${drivers[2].color}` }}
            >
              {drivers[2].acronym}
            </div>
            <p className="text-xs font-semibold text-orange-900 mt-1">{drivers[2].acronym}</p>
            <p className="text-[9px] text-orange-800">{drivers[2].team.split(" ")[0]}</p>
          </div>
          <p className="text-xs font-semibold text-orange-400 mt-1">15 pts</p>
        </div>
      </div>
    </div>
  );
}

function RacePredictionRow({ driver, position, isDNF }: { driver: { acronym: string; name: string; team: string; color: string; number?: number; predictedPoints?: number; predictedDNF?: boolean; predictedPosition: number; sprintPoints?: number }; position: number; isDNF?: boolean }) {
  return (
    <div className={`flex items-center px-4 py-3 border-b border-[#38383a]/50 last:border-0 ${isDNF ? "opacity-50" : ""}`}>
      <span className={`w-8 text-center font-bold text-lg ${position === 1 ? "text-[#ffd700]" : position === 2 ? "text-[#c0c0c0]" : position === 3 ? "text-[#cd7f32]" : "text-[#8e8e93]"}`}>
        {isDNF ? "DNF" : position}
      </span>
      <span className="w-10 text-center text-[#636366] font-mono text-sm">{"—"}</span>
      <div className="flex-1 flex items-center gap-2 ml-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold"
          style={{ backgroundColor: `#${driver.color}30`, color: `#${driver.color}` }}
        >
          {driver.acronym}
        </div>
        <div className="min-w-0">
          <p className={`font-medium text-sm truncate ${isDNF ? "line-through" : ""}`}>
            {driver.name.split(" ")[0]}
          </p>
          <p className="text-[#636366] text-xs">{driver.acronym}</p>
        </div>
      </div>
      <div className="w-8 flex justify-end">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `#${driver.color}` }} />
      </div>
      <span className="w-12 text-right font-mono text-[11px] text-[#00ff94]">
        {isDNF ? "DNF" : `${driver.predictedPoints} pts`}
      </span>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function PredictionsPage() {
  const [tab, setTab] = useState<"race" | "sprint" | "qualifying">("race");

  return (
    <div className="min-h-full px-4 pt-16 pb-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold">Prediccions</h1>
        <p className="text-[#8e8e93] text-sm">🇺🇸 Miami GP 2026 · Basat en rendiment 2026</p>
      </div>

      {/* Disclaimer */}
      <div className="card p-3 mb-4 bg-[#ffd700]/10 border border-[#ffd700]/30">
        <p className="text-xs text-[#ffd700] text-center">
          ⚠️ Prediccions algorítmiques · No son apostes · Basat en dades reals de la temporada
        </p>
      </div>

      {/* Podium */}
      {tab === "race" && (
        <PodiumCard drivers={PREDICTION.slice(0, 3)} label="Podi predit" />
      )}
      {tab === "sprint" && (
        <PodiumCard drivers={SPRINT_PRED.slice(0, 3)} label="Podi Sprint predit" />
      )}

      {/* Tab selector */}
      <div className="flex gap-2 mb-4">
        {[
          { id: "race", label: "Carrera", icon: "🏁" },
          { id: "sprint", label: "Sprint", icon: "⚡" },
          { id: "qualifying", label: "Qualy", icon: "🔴" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              tab === t.id ? "bg-[#00ff94] text-black" : "bg-[#2c2c2e] text-[#8e8e93]"
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Race predictions */}
      {tab === "race" && (
        <>
          <div className="mb-3">
            <p className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold mb-2">
              Classificació predita · Top 10
            </p>
            <div className="card overflow-hidden">
              <div className="flex items-center px-4 py-2 bg-[#1c1c1e] border-b border-[#38383a]/50 text-[#636366] text-[10px] font-semibold uppercase tracking-wider">
                <span className="w-8 text-center">Pos</span>
                <span className="w-10 text-center">Nº</span>
                <span className="flex-1 ml-2">Driver</span>
                <span className="w-12 text-right">Pts</span>
              </div>
              {PREDICTION.slice(0, 10).map((driver, idx) => (
                <RacePredictionRow
                  key={driver.acronym}
                  driver={driver}
                  position={idx + 1}
                />
              ))}
            </div>
          </div>

          {/* DNF risk */}
          {DNF_LIST.length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] uppercase tracking-widest text-[#ff3b30] font-semibold mb-2">
                Risc DNF
              </p>
              <div className="card overflow-hidden border-red-900/30">
                {DNF_LIST.slice(0, 4).map((driver) => (
                  <RacePredictionRow
                    key={driver.acronym}
                    driver={driver}
                    position={driver.predictedPosition}
                    isDNF
                  />
                ))}
              </div>
            </div>
          )}

          {/* Win probability bars */}
          <div className="card p-4 mb-4">
            <p className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold mb-3">
              Probabilitat de victòria
            </p>
            {PREDICTION.slice(0, 6).map((driver) => (
              <div key={driver.acronym} className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold"
                      style={{ backgroundColor: `#${driver.color}30`, color: `#${driver.color}` }}
                    >
                      {driver.acronym}
                    </div>
                    <span className="text-xs">{driver.name.split(" ")[0]}</span>
                  </div>
                  <span className="text-xs font-mono text-[#00ff94]">{driver.winProbability}%</span>
                </div>
                <div className="h-1.5 bg-[#2c2c2e] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${driver.winProbability}%`,
                      backgroundColor: `#${driver.color}`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Sprint predictions */}
      {tab === "sprint" && (
        <div>
          <div className="mb-3">
            <p className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold mb-2">
              Classificació Sprint · Top 8
            </p>
            <div className="card overflow-hidden">
              <div className="flex items-center px-4 py-2 bg-[#1c1c1e] border-b border-[#38383a]/50 text-[#636366] text-[10px] font-semibold uppercase tracking-wider">
                <span className="w-8 text-center">Pos</span>
                <span className="w-10 text-center">Nº</span>
                <span className="flex-1 ml-2">Driver</span>
                <span className="w-12 text-right">Pts</span>
              </div>
              {SPRINT_PRED.slice(0, 8).map((driver, idx) => (
                <RacePredictionRow
                  key={driver.acronym}
                  driver={driver}
                  position={idx + 1}
                />
              ))}
            </div>
          </div>

          <div className="card p-4">
            <p className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold mb-3">
              Punts sprint
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { pos: 1, pts: 8 }, { pos: 2, pts: 7 }, { pos: 3, pts: 6 }, { pos: 4, pts: 5 },
                { pos: 5, pts: 4 }, { pos: 6, pts: 3 }, { pos: 7, pts: 2 }, { pos: 8, pts: 1 },
              ].map(({ pos, pts }) => (
                <div key={pos} className="bg-[#1c1c1e] rounded-xl p-2 text-center">
                  <div className="text-xs font-bold text-[#636366]">P{pos}</div>
                  <div className="text-sm font-bold text-[#00ff94]">{pts}pts</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Qualifying predictions */}
      {tab === "qualifying" && (
        <div>
          <div className="mb-4">
            <p className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold mb-2">
              Pole predita
            </p>
            <div className="card p-4 bg-gradient-to-r from-[#ffd700]/10 to-transparent border-[#ffd700]/30">
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: `#${PREDICTION[0].color}30`, color: `#${PREDICTION[0].color}` }}
                >
                  {PREDICTION[0].acronym}
                </div>
                <div>
                  <p className="text-[#ffd700] text-xs font-bold uppercase tracking-wider">Pole Position</p>
                  <p className="text-white font-bold text-lg">{PREDICTION[0].name}</p>
                  <p className="text-[#636366] text-xs">{PREDICTION[0].team}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <p className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold mb-2">
              Top 10 Qualy
            </p>
            <div className="card overflow-hidden">
              {PREDICTION.slice(0, 10).map((driver, idx) => (
                <div
                  key={driver.acronym}
                  className="flex items-center px-4 py-3 border-b border-[#38383a]/50 last:border-0"
                >
                  <span className={`w-8 text-center font-bold ${idx === 0 ? "text-[#ffd700]" : "text-[#8e8e93]"}`}>
                    {idx + 1}
                  </span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ backgroundColor: `#${driver.color}30`, color: `#${driver.color}` }}
                  >
                    {driver.acronym}
                  </div>
                  <div className="flex-1 ml-2">
                    <p className="text-sm font-medium">{driver.name.split(" ")[0]}</p>
                    <p className="text-[#636366] text-xs">{driver.acronym}</p>
                  </div>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `#${driver.color}` }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Constructor standings impact */}
      <div className="card p-4 mb-4">
        <p className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold mb-3">
          Impacte en el Campionat de Constructors
        </p>
        <div className="space-y-2">
          {TEAMS.slice(0, 6).map((team, idx) => {
            const driversInPoints = PREDICTION.filter(
              (d) => d.team === team.name && d.predictedPosition <= 10
            );
            const projectedPts = driversInPoints.reduce((sum, d) => sum + d.predictedPoints, 0);
            const totalPts = team.pts + projectedPts;

            return (
              <div key={team.name} className="flex items-center gap-3">
                <span className="w-6 text-center text-xs text-[#636366] font-bold">{idx + 1}</span>
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: `#${team.color}` }} />
                <div className="flex-1">
                  <p className="text-xs font-medium truncate">{team.name}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-[#00ff94]">+{projectedPts}</span>
                  <span className="text-xs text-[#636366] ml-1">→ {totalPts} pts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
