export default function StandingsPage() {
  return (
    <div className="min-h-full px-5 pt-16 pb-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Classificació</h1>
        <p className="text-[#8e8e93] text-sm">Temporada 2026</p>
      </div>

      {/* Pilots */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Pilots</h2>
          <span className="pill">5 primers</span>
        </div>

        <div className="card overflow-hidden">
          <DriverStanding rank={1} driver="Lando Norris" team="McLaren" points={85} color="#ff8000" />
          <DriverStanding rank={2} driver="Oscar Piastri" team="McLaren" points={74} color="#ff8000" />
          <DriverStanding rank={3} driver="Max Verstappen" team="Red Bull Racing" points={71} color="#1e41db" />
          <DriverStanding rank={4} driver="Kimi Antonelli" team="Mercedes" points={52} color="#27f4d2" />
          <DriverStanding rank={5} driver="George Russell" team="Mercedes" points={48} color="#27f4d2" />
        </div>
      </div>

      {/* Constructors */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Constructors</h2>
        </div>

        <div className="card overflow-hidden">
          <TeamStanding rank={1} team="McLaren" points={159} color="#ff8000" />
          <TeamStanding rank={2} team="Mercedes" points={100} color="#27f4d2" />
          <TeamStanding rank={3} team="Red Bull Racing" points={71} color="#1e41db" />
          <TeamStanding rank={4} team="Ferrari" points={65} color="#e6002d" />
          <TeamStanding rank={5} team="Williams" points={45} color="#00ccff" />
        </div>
      </div>
    </div>
  );
}

function DriverStanding({ rank, driver, team, points, color }: { rank: number; driver: string; team: string; points: number; color: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-[#38383a] last:border-0">
      <span className={`w-6 text-center font-bold text-lg ${rank <= 3 ? "text-[#ffd700]" : "text-[#636366]"}`}>
        {rank}
      </span>
      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
      <div className="flex-1">
        <p className="font-medium">{driver}</p>
        <p className="text-[#636366] text-xs">{team}</p>
      </div>
      <span className="text-lg font-bold text-white">{points}</span>
    </div>
  );
}

function TeamStanding({ rank, team, points, color }: { rank: number; team: string; points: number; color: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-[#38383a] last:border-0">
      <span className={`w-6 text-center font-bold text-lg ${rank <= 3 ? "text-[#ffd700]" : "text-[#636366]"}`}>
        {rank}
      </span>
      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
      <div className="flex-1">
        <p className="font-medium">{team}</p>
      </div>
      <span className="text-lg font-bold text-white">{points}</span>
    </div>
  );
}
