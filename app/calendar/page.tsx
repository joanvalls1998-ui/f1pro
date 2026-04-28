const RACES = [
  { name: "Australian Grand Prix", date: "2026-03-06", location: "Melbourne", flag: "AU", status: "completed", laps: 58, km: 5.278 },
  { name: "Chinese Grand Prix", date: "2026-03-13", location: "Shanghai", flag: "CN", status: "completed", laps: 56, km: 5.451 },
  { name: "Japanese Grand Prix", date: "2026-03-27", location: "Suzuka", flag: "JP", status: "completed", laps: 53, km: 5.807 },
  { name: "Miami Grand Prix", date: "2026-05-01", location: "Miami", flag: "US", status: "next", laps: 57, km: 5.412 },
  { name: "Canadian Grand Prix", date: "2026-05-22", location: "Montreal", flag: "CA", status: "upcoming", laps: 70, km: 4.361 },
  { name: "Monaco Grand Prix", date: "2026-06-05", location: "Monaco", flag: "MC", status: "upcoming", laps: 78, km: 3.337 },
  { name: "Spanish Grand Prix (Barcelona)", date: "2026-06-12", location: "Barcelona", flag: "ES", status: "upcoming", laps: 66, km: 4.675 },
  { name: "Austrian Grand Prix", date: "2026-06-26", location: "Spielberg", flag: "AT", status: "upcoming", laps: 71, km: 4.318 },
  { name: "British Grand Prix", date: "2026-07-03", location: "Silverstone", flag: "GB", status: "upcoming", laps: 52, km: 5.891 },
  { name: "Belgian Grand Prix", date: "2026-07-17", location: "Spa", flag: "BE", status: "upcoming", laps: 44, km: 7.004 },
  { name: "Hungarian Grand Prix", date: "2026-07-24", location: "Budapest", flag: "HU", status: "upcoming", laps: 70, km: 4.381 },
  { name: "Dutch Grand Prix", date: "2026-08-21", location: "Zandvoort", flag: "NL", status: "upcoming", laps: 72, km: 4.259 },
  { name: "Italian Grand Prix", date: "2026-09-04", location: "Monza", flag: "IT", status: "upcoming", laps: 53, km: 5.793 },
  { name: "Spanish Grand Prix (Madrid)", date: "2026-09-11", location: "Madrid", flag: "ES", status: "upcoming", laps: 65, km: 4.600 },
  { name: "Azerbaijan Grand Prix", date: "2026-09-24", location: "Baku", flag: "AZ", status: "upcoming", laps: 51, km: 6.003 },
  { name: "Singapore Grand Prix", date: "2026-10-09", location: "Singapore", flag: "SG", status: "upcoming", laps: 61, km: 4.928 },
  { name: "United States Grand Prix", date: "2026-10-23", location: "Austin", flag: "US", status: "upcoming", laps: 56, km: 5.513 },
  { name: "Mexican Grand Prix", date: "2026-10-30", location: "Mexico City", flag: "MX", status: "upcoming", laps: 71, km: 4.304 },
  { name: "Brazilian Grand Prix", date: "2026-11-06", location: "Interlagos", flag: "BR", status: "upcoming", laps: 71, km: 4.309 },
  { name: "Las Vegas Grand Prix", date: "2026-11-19", location: "Las Vegas", flag: "US", status: "upcoming", laps: 50, km: 6.120 },
  { name: "Qatar Grand Prix", date: "2026-11-27", location: "Lusail", flag: "QA", status: "upcoming", laps: 57, km: 5.380 },
  { name: "Abu Dhabi Grand Prix", date: "2026-12-04", location: "Yas Marina", flag: "AE", status: "upcoming", laps: 55, km: 5.281 },
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
  const completedCount = RACES.filter(r => r.status === "completed").length;
  
  return (
    <div className="min-h-full px-4 pt-16 pb-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Calendari 2026</h1>
        <p className="text-[#8e8e93] text-sm">{completedCount}/24 curses completades</p>
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
            {["FP1", "SQ", "Sprint", "Q", "Race"].map((session) => (
              <div key={session} className="bg-[#2c2c2e] rounded-lg p-2 text-center">
                <p className="text-[10px] text-[#636366]">{session}</p>
                <p className="text-xs font-semibold">{SESSION_TIMES[session] || "--:--"}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Race list */}
      <div className="space-y-2">
        {RACES.map((race, i) => (
          <div 
            key={i} 
            className={`card flex items-center gap-3 p-3 ${
              race.status === "next" ? "border border-[#00ff94]/50" : ""
            }`}
          >
            <div className="text-center w-10 flex-shrink-0">
              <span className="text-xl">{getFlagEmoji(race.flag)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-medium text-sm ${race.status === "next" ? "text-[#00ff94]" : ""}`}>
                {race.name}
              </p>
              <p className="text-[#636366] text-xs">{race.location} · {race.laps} vols · {race.km} km</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-[#8e8e93]">{formatDate(race.date)}</p>
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
    AU: "🇦🇺", CN: "🇨🇳", JP: "🇯🇵", BH: "🇧🇭", SA: "🇸🇦",
    US: "🇺🇸", CA: "🇨🇦", MC: "🇲🇨", ES: "🇪🇸", AT: "🇦🇹",
    GB: "🇬🇧", BE: "🇧🇪", HU: "🇭🇺", NL: "🇳🇱", IT: "🇮🇹",
    AZ: "🇦🇿", SG: "🇸🇬", MX: "🇲🇽", BR: "🇧🇷", QA: "🇶🇦", AE: "🇦🇪",
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
