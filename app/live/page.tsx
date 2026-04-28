// Static fallback data - works without JavaScript
const FALLBACK_DRIVERS = [
  { driver_number: 1, name_acronym: "NOR", first_name: "Lando", last_name: "Norris", team_name: "McLaren", team_colour: "F47600" },
  { driver_number: 3, name_acronym: "VER", first_name: "Max", last_name: "Verstappen", team_name: "Red Bull Racing", team_colour: "4781D7" },
  { driver_number: 16, name_acronym: "LEC", first_name: "Charles", last_name: "Leclerc", team_name: "Ferrari", team_colour: "E8002D" },
  { driver_number: 44, name_acronym: "HAM", first_name: "Lewis", last_name: "Hamilton", team_name: "Mercedes", team_colour: "27F4D2" },
  { driver_number: 81, name_acronym: "PIA", first_name: "Oscar", last_name: "Piastri", team_name: "McLaren", team_colour: "F47600" },
  { driver_number: 63, name_acronym: "RUS", first_name: "George", last_name: "Russell", team_name: "Mercedes", team_colour: "27F4D2" },
  { driver_number: 12, name_acronym: "ANT", first_name: "Kimi", last_name: "Antonelli", team_name: "Mercedes", team_colour: "27F4D2" },
  { driver_number: 5, name_acronym: "BOR", first_name: "Gabriel", last_name: "Bortoleto", team_name: "Audi", team_colour: "F50537" },
  { driver_number: 27, name_acronym: "HUL", first_name: "Nico", last_name: "Hülkenberg", team_name: "Audi", team_colour: "F50537" },
  { driver_number: 10, name_acronym: "GAS", first_name: "Pierre", last_name: "Gasly", team_name: "Alpine", team_colour: "00A1E8" },
];

export default function LivePage() {
  return (
    <div className="min-h-full px-4 pt-10 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 bg-[#2c2c2e] text-[#8e8e93] px-2 py-0.5 rounded-full text-xs font-semibold">
              📺 DEMO
            </span>
            <h1 className="text-xl font-bold">Live Timing</h1>
          </div>
          <p className="text-[#8e8e93] text-sm">
            Jeddah — Race
          </p>
        </div>
        <span className="text-[#636366] text-xs">
          Sense dades en directe
        </span>
      </div>

      {/* Info banner */}
      <div className="card p-3 mb-4 bg-[#2c2c2e]">
        <p className="text-sm text-center text-[#8e8e93]">
          ℹ️ Dades de mostra · Sessió: Jeddah GP 2026
        </p>
        <p className="text-xs text-center text-[#636366] mt-1">
          Durant una sessió en directe, aquí veuràs les posicions reals
        </p>
      </div>

      {/* Position table */}
      <div className="card overflow-hidden">
        <div className="px-4 py-2 bg-[#2c2c2e] flex items-center text-[10px] uppercase tracking-wider text-[#636366] font-semibold">
          <span className="w-8 text-center">Pos</span>
          <span className="w-10 text-center">#</span>
          <span className="flex-1 ml-2">Pilot</span>
          <span className="w-20 text-right">Equip</span>
          <span className="w-16 text-right">Gap</span>
        </div>

        {FALLBACK_DRIVERS.map((driver, idx) => {
          const position = idx + 1;
          const isTop3 = position <= 3;

          return (
            <div
              key={driver.driver_number}
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
                {driver.driver_number}
              </span>

              <div className="flex-1 flex items-center gap-2 ml-2">
                <div className="w-8 h-8 rounded-full bg-[#2c2c2e] flex items-center justify-center text-xs font-bold">
                  {driver.name_acronym}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">
                    {driver.first_name} {driver.last_name}
                  </p>
                  <p className="text-[#636366] text-xs">{driver.name_acronym}</p>
                </div>
              </div>

              <div className="w-20 flex justify-end">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: `#${driver.team_colour}` }}
                />
              </div>

              <span className="w-16 text-right font-mono text-xs text-[#8e8e93]">
                {idx === 0 ? "LEAD" : `+${(idx * 1.234).toFixed(3)}s`}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 text-center text-[#636366] text-xs">
        <p>Pròxima sessió en directe: <span className="text-white">Miami GP FP1</span></p>
        <p className="mt-1">1 Maig 2026 · 16:00 UTC</p>
      </div>
    </div>
  );
}
