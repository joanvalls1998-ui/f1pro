export default function TelemetryPage() {
  return (
    <div className="min-h-full px-5 pt-12 pb-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Telemetria</h1>
        <p className="text-[#8e8e93] text-sm">Comparador i anàlisi</p>
      </div>

      <div className="card p-8 text-center">
        <span className="text-4xl mb-4 block">📊</span>
        <p className="text-[#8e8e93] mb-2">Selecciona una sessió passada</p>
        <p className="text-[#636366] text-sm">Explora la telemetria dels pilots a cada cursa</p>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Sessions disponibles</h2>
        <div className="space-y-3">
          <SessionCard
            race="Australian Grand Prix"
            session="Qualifying"
            drivers={20}
          />
          <SessionCard
            race="Australian Grand Prix"
            session="Race"
            drivers={20}
          />
          <SessionCard
            race="Chinese Grand Prix"
            session="Qualifying"
            drivers={20}
          />
        </div>
      </div>
    </div>
  );
}

function SessionCard({ race, session, drivers }: { race: string; session: string; drivers: number }) {
  return (
    <button className="card w-full flex items-center gap-4 p-4 text-left">
      <div className="w-12 h-12 bg-[#2c2c2e] rounded-xl flex items-center justify-center text-2xl">
        🏎️
      </div>
      <div className="flex-1">
        <p className="font-medium">{race}</p>
        <p className="text-[#8e8e93] text-sm">{session} · {drivers} pilots</p>
      </div>
      <svg className="w-5 h-5 text-[#636366]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9,18 15,12 9,6" />
      </svg>
    </button>
  );
}
