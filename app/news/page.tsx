// Static news data - shows latest F1 news (2026 pre-season focus)
const NEWS = [
  {
    id: 1,
    title: "Hamilton a Ferrari: el moviment que canvia la Fórmula 1",
    source: "F1.com",
    time: "2h",
    category: "Mercat",
    emoji: "🔴",
  },
  {
    id: 2,
    title: "Antonelli ascendeix a Mercedes: el jove italià代替Hamilton",
    source: "Autosport",
    time: "4h",
    category: "Mercat",
    emoji: "⭐",
  },
  {
    id: 3,
    title: "Hadjar promogut a Red Bull: el substitut de Pérez arriba",
    source: "The Race",
    time: "5h",
    category: "Mercat",
    emoji: "🏎️",
  },
  {
    id: 4,
    title: "McLaren 2025 Campió: Norris i Piastri consoliden la dominant",
    source: "Motorsport.com",
    time: "6h",
    category: "Temporada",
    emoji: "🏆",
  },
  {
    id: 5,
    title: "Sainz deixa Ferrari i firma per Williams: nova etapa el 2026",
    source: "ESPN F1",
    time: "8h",
    category: "Mercat",
    emoji: "📈",
  },
  {
    id: 6,
    title: "Colapinto a Alpine: l'argentí tornar a la graella el 2026",
    source: "F1.com",
    time: "10h",
    category: "Mercat",
    emoji: "🇦🇷",
  },
  {
    id: 7,
    title: "Bottas i Pérez a Cadillac: el nou projecte americà arriba a la F1",
    source: "Sky Sports",
    time: "12h",
    category: "Mercat",
    emoji: "🇺🇸",
  },
  {
    id: 8,
    title: "Bearman a Haas: jove britànic agafa el segon seient americà",
    source: "F1.com",
    time: "14h",
    category: "Mercat",
    emoji: "🇬🇧",
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
        {["Totes", "Mercat", "Temporada", "Equips", "Declaracions"].map((cat, i) => (
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
        <p className="mt-1">F1Pro · Pre-temporada 2026</p>
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