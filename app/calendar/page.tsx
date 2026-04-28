const RACES = [
  { name: "Bahrain Grand Prix", date: "2026-03-14", location: "Sakhir", flag: "BH", status: "completed", sessions: ["FP1", "FP2", "FP3", "Q", "Race"] },
  { name: "Saudi Arabian Grand Prix", date: "2026-03-21", location: "Jeddah", flag: "SA", status: "completed", sessions: ["FP1", "Q", "Sprint", "SQ", "Race"] },
  { name: "Australian Grand Prix", date: "2026-03-28", location: "Melbourne", flag: "AU", status: "completed", sessions: ["FP1", "FP2", "FP3", "Q", "Race"] },
  { name: "Chinese Grand Prix", date: "2026-04-05", location: "Shanghai", flag: "CN", status: "completed", sessions: ["FP1", "SQ", "Sprint", "FP2", "Q", "Race"] },
  { name: "Japanese Grand Prix", date: "2026-04-12", location: "Suzuka", flag: "JP", status: "completed", sessions: ["FP1", "FP2", "FP3", "Q", "Race"] },
  { name: "Miami Grand Prix", date: "2026-05-01", location: "Miami", flag: "US", status: "next", sessions: ["FP1", "SQ", "Sprint", "Q", "Race"] },
  { name: "Spanish Grand Prix", date: "2026-05-10", location: "Barcelona", flag: "ES", status: "upcoming", sessions: ["FP1", "FP2", "FP3", "Q", "Race"] },
  { name: "Monaco Grand Prix", date: "2026-05-24", location: "Monaco", flag: "MC", status: "upcoming", sessions: ["FP1", "FP2", "FP3", "Q", "Race"] },
  { name: "Canadian Grand Prix", date: "2026-06-07", location: "Montreal", flag: "CA", status: "upcoming", sessions: ["FP1", "SQ", "Sprint", "Q", "Race"] },
  { name: "British Grand Prix", date: "2026-07-05", location: "Silverstone", flag: "GB", status: "upcoming", sessions: ["FP1", "FP2", "FP3", "Q", "Race"] },
  { name: "Belgian Grand Prix", date: "2026-07-26", location: "Spa", flag: "BE", status: "upcoming", sessions: ["FP1", "FP2", "FP3", "Q", "Race"] },
  { name: "Dutch Grand Prix", date: "2026-08-30", location: "Zandvoort", flag: "NL", status: "upcoming", sessions: ["FP1", "FP2", "FP3", "Q", "Race"] },
  { name: "Italian Grand Prix", date: "2026-09-06", location: "Monza", flag: "IT", status: "upcoming", sessions: ["FP1", "FP2", "FP3", "Q", "Race"] },
  { name: "Azerbaijan Grand Prix", date: "2026-09-20", location: "Baku", flag: "AZ", status: "upcoming", sessions: ["FP1", "SQ", "Sprint", "Q", "Race"] },
  { name: "Singapore Grand Prix", date: "2026-10-04", location: "Singapore", flag: "SG", status: "upcoming", sessions: ["FP1", "FP2", "FP3", "Q", "Race"] },
  { name: "Las Vegas Grand Prix", date: "2026-10-31", location: "Las Vegas", flag: "US", status: "upcoming", sessions: ["FP1", "FP2", "FP3", "Q", "Race"] },
  { name: "Qatar Grand Prix", date: "2026-11-29", location: "Lusail", flag: "QA", status: "upcoming", sessions: ["FP1", "SQ", "Sprint", "Q", "Race"] },
  { name: "Abu Dhabi Grand Prix", date: "2026-12-06", location: "Yas Marina", flag: "AE", status: "upcoming", sessions: ["FP1", "FP2", "FP3", "Q", "Race"] },
];

const SESSION_TIMES: Record<string, string> = {
  "FP1": "16:00",
  "FP2": "20:00",
  "FP3": "15:00",
  "SQ": "20:30",
  "Sprint": "16:00",
  "Q": "20:00",
  "Race": "20:00",
};

export default function CalendarPage() {
  const nextRace = RACES.find(r => r.status === "next");
  
  return (
    <div className="min-h-full px-4 pt-16 pb-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Calendari 2026</h1>
        <p className="text-[#8e8e93] text-sm">18 curses · Març - Desembre</p>
      </div>

      {/* Miami highlight */}
      {nextRace && (
        <div className="card mb-6 p-4 border-[#00ff94]/50 bg-gradient-to-br from-[#00ff94]/10 to-transparent">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{getFlagEmoji(nextRace.flag)}</span>
            <div>
              <p className="text-[#00ff94] text-xs font-semibold uppercase tracking-wider">PRÒXIMA CURS</p>
              <p className="font-bold text-lg">{nextRace.name}</p>
              <p className="text-[#8e8e93] text-sm">{nextRace.location}</p>
            </div>
          </div>
          
          {/* Session times */}
          <div className="grid grid-cols-5 gap-2 mt-3">
            {nextRace.sessions.slice(0, 5).map((session) => (
              <div key={session} className="bg-[#2c2c2e] rounded-lg p-2 text-center">
                <p className="text-[10px] text-[#636366]">{session}</p>
                <p className="text-xs font-semibold">{SESSION_TIMES[session] || "--:--"}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Race list */}
      <div className="space-y-3">
        {RACES.map((race, i) => (
          <div 
            key={i} 
            className={`card flex items-center gap-4 p-4 ${
              race.status === "next" ? "border-[#00ff94]/50" : ""
            }`}
          >
            <div className="text-center w-12 flex-shrink-0">
              <span className="text-2xl">{getFlagEmoji(race.flag)}</span>
              <p className="text-[10px] text-[#636366] mt-1">{race.sessions.length} ses.</p>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-medium ${race.status === "next" ? "text-[#00ff94]" : ""}`}>
                {race.name}
              </p>
              <p className="text-[#636366] text-sm">{race.location}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm text-[#8e8e93]">{formatDate(race.date)}</p>
              <StatusBadge status={race.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getFlagEmoji(code: string): string {
  const flags: Record<string, string> = {
    BH: "🇧🇭", SA: "🇸🇦", AU: "🇦🇺", CN: "🇨🇳", JP: "🇯🇵",
    US: "🇺🇸", ES: "🇪🇸", MC: "🇲🇨", CA: "🇨🇦", GB: "🇬🇧",
    BE: "🇧🇪", NL: "🇳🇱", IT: "🇮🇹", AZ: "🇦🇿", SG: "🇸🇬",
    QA: "🇶🇦", AE: "🇦🇪",
  };
  return flags[code] || "🏁";
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ca-ES", { day: "numeric", month: "short" });
}

function StatusBadge({ status }: { status: string }) {
  if (status === "completed") {
    return <span className="text-xs text-[#00ff94]">✓</span>;
  }
  if (status === "next") {
    return <span className="pill">PRÒXIMA</span>;
  }
  return <span className="text-xs text-[#636366]">-</span>;
}
