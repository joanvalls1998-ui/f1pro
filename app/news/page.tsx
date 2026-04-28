// Static news data - shows latest F1 news
const NEWS = [
  {
    id: 1,
    title: "Norris i Piastri dominen els entrenaments a Miami",
    source: "F1.com",
    time: "2h",
    category: "Pràctica",
    emoji: "🏎️",
  },
  {
    id: 2,
    title: "Hamilton confia en el rendiment del Mercedes per a la classificació",
    source: "Autosport",
    time: "4h",
    category: "Qualifying",
    emoji: "📊",
  },
  {
    id: 3,
    title: "Verstappen: \"El cotxe millora cada vegada que sortim a pista\"",
    source: "The Race",
    time: "5h",
    category: "Declaracions",
    emoji: "🎙️",
  },
  {
    id: 4,
    title: "Leclerc espera una classificació difícil per a Ferrari",
    source: "Motorsport.com",
    time: "6h",
    category: "Qualifying",
    emoji: "🔴",
  },
  {
    id: 5,
    title: "Sainz Jr. sorprèn amb el tercer temps als FP2",
    source: "ESPN F1",
    time: "8h",
    category: "Pràctica",
    emoji: "📈",
  },
  {
    id: 6,
    title: "Antonelli: \"Encara estic aprenent, però milloro\"",
    source: "F1.com",
    time: "10h",
    category: "Declaracions",
    emoji: "⭐",
  },
  {
    id: 7,
    title: "Piastri: \"McLaren està en un bon moment, hem de seguir així\"",
    source: "Sky Sports",
    time: "12h",
    category: "Declaracions",
    emoji: "🏆",
  },
  {
    id: 8,
    title: "Les pluges podrien complicar la sessió sprint de dissabte",
    source: "Weather.com",
    time: "14h",
    category: "Meteorologia",
    emoji: "🌧️",
  },
];

export default function NewsPage() {
  return (
    <div className="min-h-full px-4 pt-16 pb-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Notícies</h1>
        <p className="text-[#8e8e93] text-sm">Últimes novetats de la Fórmula 1</p>
      </div>

      {/* Featured news */}
      <div className="mb-6">
        <FeaturedNews news={NEWS[0]} />
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
        {["Totes", "Pràctica", "Qualifying", "Sprint", "Meteorologia", "Declaracions"].map((cat, i) => (
          <button
            key={cat}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              i === 0
                ? "bg-[#00ff94] text-black"
                : "bg-[#2c2c2e] text-[#8e8e93]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News list */}
      <div className="space-y-3">
        {NEWS.slice(1).map((item) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-[#636366] text-xs">
        <p>Notícies agregades de fonts públiques</p>
      </div>
    </div>
  );
}

function FeaturedNews({ news }: { news: typeof NEWS[0] }) {
  return (
    <a href="#" className="card block overflow-hidden group">
      <div className="bg-gradient-to-br from-[#00ff94]/20 to-transparent p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{news.emoji}</span>
          <span className="pill">{news.category}</span>
        </div>
        <h2 className="text-lg font-bold mb-2 group-hover:text-[#00ff94] transition-colors">
          {news.title}
        </h2>
        <div className="flex items-center gap-2 text-[#636366] text-xs">
          <span>{news.source}</span>
          <span>·</span>
          <span>{news.time}</span>
        </div>
      </div>
    </a>
  );
}

function NewsCard({ news }: { news: typeof NEWS[0] }) {
  return (
    <a href="#" className="card flex items-center gap-3 p-4 group">
      <div className="w-12 h-12 bg-[#2c2c2e] rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
        {news.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate group-hover:text-[#00ff94] transition-colors">
          {news.title}
        </p>
        <p className="text-[#636366] text-xs">
          {news.source} · {news.time}
        </p>
      </div>
    </a>
  );
}
