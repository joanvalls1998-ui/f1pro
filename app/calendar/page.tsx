export default function CalendarPage() {
  const races = [
    { name: "Bahrain Grand Prix", date: "2026-03-14", location: "Sakhir", flag: "BH", status: "completed" },
    { name: "Saudi Arabian Grand Prix", date: "2026-03-21", location: "Jeddah", flag: "SA", status: "completed" },
    { name: "Australian Grand Prix", date: "2026-03-28", location: "Melbourne", flag: "AU", status: "completed" },
    { name: "Chinese Grand Prix", date: "2026-04-05", location: "Shanghai", flag: "CN", status: "completed" },
    { name: "Japanese Grand Prix", date: "2026-04-12", location: "Suzuka", flag: "JP", status: "completed" },
    { name: "Miami Grand Prix", date: "2026-05-01", location: "Miami", flag: "US", status: "next" },
    { name: "Spanish Grand Prix", date: "2026-05-10", location: "Barcelona", flag: "ES", status: "upcoming" },
    { name: "Monaco Grand Prix", date: "2026-05-24", location: "Monaco", flag: "MC", status: "upcoming" },
    { name: "Canadian Grand Prix", date: "2026-06-07", location: "Montreal", flag: "CA", status: "upcoming" },
    { name: "British Grand Prix", date: "2026-07-05", location: "Silverstone", flag: "GB", status: "upcoming" },
  ];

  return (
    <div className="min-h-full px-5 pt-16 pb-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Calendari 2026</h1>
        <p className="text-[#8e8e93] text-sm">24 curses · Març - Desembre</p>
      </div>

      <div className="space-y-3">
        {races.map((race, i) => (
          <div key={i} className="card flex items-center gap-4 p-4">
            <div className="text-center w-12">
              <span className="text-2xl">{getFlagEmoji(race.flag)}</span>
            </div>
            <div className="flex-1">
              <p className="font-medium">{race.name}</p>
              <p className="text-[#8e8e93] text-sm">{race.location}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#636366]">{formatDate(race.date)}</p>
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
  };
  return flags[code] || "🏁";
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ca-ES", { day: "numeric", month: "short" });
}

function StatusBadge({ status }: { status: string }) {
  if (status === "completed") {
    return <span className="text-xs text-[#00ff94]">✓ Finalitzada</span>;
  }
  if (status === "next") {
    return <span className="pill">PRÒXIMA</span>;
  }
  return <span className="text-xs text-[#636366]">Pendent</span>;
}
