"use client";

import { useEffect, useState } from "react";

interface RssItem {
  id: string;
  title: string;
  source: string;
  time: string;
  thumbnail: string | null;
  link: string;
}

interface RssResponse {
  status: string;
  items: Array<{
    title: string;
    link: string;
    pubDate: string;
    thumbnail?: string;
    enclosure?: { link: string };
    feed?: { title: string };
  }>;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return "Ara mateix";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return date.toLocaleDateString("ca-ES", { day: "numeric", month: "short" });
}

function getThumbnail(item: RssResponse["items"][0]): string | null {
  if (item.thumbnail) return item.thumbnail;
  if (item.enclosure?.link) return item.enclosure.link;
  // Try to extract image from description or media content
  const mediaMatch =
    typeof item === "object" && item
      ? null
      : null;
  return null;
}

export default function NewsPage() {
  const [news, setNews] = useState<RssItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("Totes");

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch(
          "https://api.rss2json.com/v1/api.json?rss_url=https://www.motorsport.com/rss/f1/news/"
        );
        if (!res.ok) throw new Error("Error en carregar les notícies");
        const data: RssResponse = await res.json();

        if (data.status !== "ok") throw new Error("Resposta RSS invàlida");

        const items: RssItem[] = data.items.slice(0, 15).map((item, i) => ({
          id: item.link || String(i),
          title: item.title,
          source: item.feed?.title || "F1",
          time: timeAgo(item.pubDate),
          thumbnail: getThumbnail(item),
          link: item.link,
        }));

        setNews(items);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No s'han pogut carregar les notícies"
        );
        // Fallback a dades estàtiques
        setNews(FALLBACK_NEWS);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  const categories = ["Totes", "Mercat", "Temporada", "Equips", "Tècnica"];

  if (loading) {
    return (
      <div className="min-h-full px-4 pt-16 pb-4 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-[#00ff94] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#636366] text-sm">Carregant notícies...</p>
      </div>
    );
  }

  return (
    <div className="min-h-full px-4 pt-16 pb-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Notícies</h1>
        <p className="text-[#8e8e93] text-sm">
          Últimes novetats de la Fórmula 1
        </p>
      </div>

      {/* Featured news */}
      {news[0] && (
        <div className="mb-6">
          <FeaturedNews news={news[0]} />
        </div>
      )}

      {/* Categories */}
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? "bg-[#00ff94] text-black"
                : "bg-[#2c2c2e] text-[#8e8e93]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
          ⚠️ {error} — Mostrant dades en cache
        </div>
      )}

      {/* News list */}
      <div className="space-y-3">
        {news.slice(1).map((item) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-[#636366] text-xs">
        <p>Notícies agregades de fonts públiques</p>
        <p className="mt-1">F1Pro · Temporada 2026</p>
      </div>
    </div>
  );
}

function FeaturedNews({ news }: { news: RssItem }) {
  return (
    <a
      href={news.link}
      target="_blank"
      rel="noopener noreferrer"
      className="card block overflow-hidden group"
    >
      {news.thumbnail && (
        <div className="relative w-full h-40 overflow-hidden rounded-t-xl">
          <img
            src={news.thumbnail}
            alt={news.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}
      <div
        className={`p-4 ${news.thumbnail ? "" : "bg-gradient-to-br from-[#00ff94]/20 to-transparent"}`}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="pill">Destacat</span>
        </div>
        <h2 className="text-lg font-bold mb-2 group-hover:text-[#00ff94] transition-colors leading-snug">
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

function NewsCard({ news }: { news: RssItem }) {
  return (
    <a
      href={news.link}
      target="_blank"
      rel="noopener noreferrer"
      className="card flex items-center gap-3 p-4 group"
    >
      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[#2c2c2e] flex items-center justify-center">
        {news.thumbnail ? (
          <img
            src={news.thumbnail}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <span className="text-2xl">🏎️</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-[#00ff94] transition-colors">
          {news.title}
        </p>
        <p className="text-[#636366] text-xs mt-1">
          {news.source} · {news.time}
        </p>
      </div>
    </a>
  );
}

const FALLBACK_NEWS: RssItem[] = [
  {
    id: "1",
    title: "Hamilton a Ferrari: el moviment que canvia la Fórmula 1",
    source: "F1.com",
    time: "2h",
    thumbnail: null,
    link: "#",
  },
  {
    id: "2",
    title: "Antonelli ascendeix a Mercedes: el jove italià代替Hamilton",
    source: "Autosport",
    time: "4h",
    thumbnail: null,
    link: "#",
  },
  {
    id: "3",
    title: "Hadjar promogut a Red Bull: el substitut de Pérez arriba",
    source: "The Race",
    time: "5h",
    thumbnail: null,
    link: "#",
  },
  {
    id: "4",
    title: "McLaren 2025 Campió: Norris i Piastri consoliden la dominant",
    source: "Motorsport.com",
    time: "6h",
    thumbnail: null,
    link: "#",
  },
  {
    id: "5",
    title: "Sainz deixa Ferrari i firma per Williams: nova etapa el 2026",
    source: "ESPN F1",
    time: "8h",
    thumbnail: null,
    link: "#",
  },
  {
    id: "6",
    title: "Colapinto a Alpine: l'argentí tornar a la graella el 2026",
    source: "F1.com",
    time: "10h",
    thumbnail: null,
    link: "#",
  },
  {
    id: "7",
    title: "Bottas i Pérez a Cadillac: el nou projecte americà arriba a la F1",
    source: "Sky Sports",
    time: "12h",
    thumbnail: null,
    link: "#",
  },
  {
    id: "8",
    title: "Bearman a Haas: jove britànic agafa el segon seient americà",
    source: "F1.com",
    time: "14h",
    thumbnail: null,
    link: "#",
  },
];
