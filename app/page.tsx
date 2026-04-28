import Link from "next/link";

const NEXT_RACE = {
  name: "Miami Grand Prix",
  date: "2026-05-01T16:00:00Z",
  circuit: "Miami International Autodrome",
  country: "US",
};

function getCountdown(targetDate: string) {
  const now = new Date().getTime();
  const target = new Date(targetDate).getTime();
  const diff = Math.max(0, target - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, mins };
}

export default function HomePage() {
  const countdown = getCountdown(NEXT_RACE.date);

  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00ff94]/10 to-transparent" />
        <div className="relative px-5 pt-12 pb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[#8e8e93] text-xs font-medium uppercase tracking-widest mb-1">Temporada 2026</p>
              <h1 className="text-3xl font-bold tracking-tight">F1Pro</h1>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#00ff94] to-[#00cc77] rounded-2xl flex items-center justify-center">
              <span className="text-xl">🏎️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Countdown Card */}
      <div className="px-5 mb-6">
        <Link href="/calendar" className="card block p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🇺🇸</span>
              <div>
                <p className="text-[#8e8e93] text-xs">PRÒXIMA CURS</p>
                <p className="text-lg font-semibold">{NEXT_RACE.name}</p>
                <p className="text-[#636366] text-sm">{NEXT_RACE.circuit}</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-[#636366]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </div>

          {/* Countdown */}
          <div className="flex gap-3">
            <CountdownUnit value={countdown.days} label="DIES" />
            <CountdownUnit value={countdown.hours} label="HORES" />
            <CountdownUnit value={countdown.mins} label="MINS" />
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <QuickAction href="/live" icon="⚡" label="Live Timing" color="#00ff94" />
          <QuickAction href="/standings" icon="🏆" label="Classificació" color="#ffd700" />
          <QuickAction href="/telemetry" icon="📊" label="Telemetria" color="#00b4d8" />
          <QuickAction href="/calendar" icon="📅" label="Calendari" color="#ff6b6b" />
        </div>
      </div>

      {/* Standings Preview */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Classificació</h2>
          <Link href="/standings" className="text-[#00ff94] text-sm font-medium">Veure tot →</Link>
        </div>

        <div className="card overflow-hidden">
          <StandingRow rank={1} driver="Lando Norris" team="McLaren" points={85} color="#ff8000" />
          <StandingRow rank={2} driver="Oscar Piastri" team="McLaren" points={74} color="#ff8000" />
          <StandingRow rank={3} driver="Max Verstappen" team="Red Bull Racing" points={71} color="#1e41db" />
          <StandingRow rank={4} driver="Kimi Antonelli" team="Mercedes" points={52} color="#27f4d2" />
          <StandingRow rank={5} driver="George Russell" team="Mercedes" points={48} color="#27f4d2" />
        </div>
      </div>
    </div>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex-1 bg-[#1c1c1e] rounded-xl p-3 text-center">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-[10px] text-[#636366] uppercase tracking-wider">{label}</p>
    </div>
  );
}

function QuickAction({ href, icon, label, color }: { href: string; icon: string; label: string; color: string }) {
  return (
    <Link href={href} className="card flex flex-col items-center justify-center p-4 gap-2" style={{ borderColor: `${color}30` }}>
      <span className="text-2xl">{icon}</span>
      <span className="text-sm font-medium text-center">{label}</span>
    </Link>
  );
}

function StandingRow({ rank, driver, team, points, color }: { rank: number; driver: string; team: string; points: number; color: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-[#38383a] last:border-0">
      <span className={`w-6 text-center font-bold ${rank <= 3 ? "text-[#ffd700]" : "text-[#636366]"}`}>
        {rank}
      </span>
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      <div className="flex-1">
        <p className="text-sm font-medium">{driver}</p>
        <p className="text-[#636366] text-xs">{team}</p>
      </div>
      <span className="text-sm font-bold text-[#00ff94]">{points}</span>
    </div>
  );
}
