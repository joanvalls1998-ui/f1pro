export default function LivePage() {
  return (
    <div className="min-h-full px-5 pt-12 pb-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Live Timing</h1>
        <p className="text-[#8e8e93] text-sm">Posicions en temps real</p>
      </div>

      <div className="card p-8 text-center">
        <span className="text-4xl mb-4 block">⚡</span>
        <p className="text-[#8e8e93] mb-2">No hi ha cap sessió activa ara</p>
        <p className="text-[#636366] text-sm">Les sessions en directe apareixeran aquí quan comencin</p>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Pròxima sessió</h2>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🇺🇸</span>
            <div>
              <p className="font-medium">Miami Grand Prix</p>
              <p className="text-[#8e8e93] text-sm">FP1 · 1 maig 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
