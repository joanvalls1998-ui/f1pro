import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "F1Pro | 2026",
  description: "F1 Live Timing, Telemetry & More",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏎️</text></svg>",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca" className="h-full">
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white antialiased">
        <TopBar />
        <main className="flex-1 overflow-auto pb-20">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}

function TopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#38383a]/50 z-50 safe-top">
      <div className="flex items-center justify-between px-4 h-12 max-w-md mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏎️</span>
          <span className="font-bold tracking-tight">F1Pro</span>
          <span className="text-[10px] bg-[#00ff94]/20 text-[#00ff94] px-1.5 py-0.5 rounded font-semibold">2026</span>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge />
        </div>
      </div>
    </header>
  );
}

function StatusBadge() {
  // Check if there's a live session (Miami GP timeframe: May 1-3)
  const now = new Date();
  const miamiStart = new Date("2026-05-01T16:00:00Z");
  const miamiEnd = new Date("2026-05-03T22:00:00Z");
  
  const isLive = now >= miamiStart && now <= miamiEnd;
  const isSoon = now >= new Date("2026-04-30T00:00:00Z") && now < miamiStart;
  
  if (isLive) {
    return (
      <span className="flex items-center gap-1 bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full text-xs font-semibold">
        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
        LIVE
      </span>
    );
  }
  
  if (isSoon) {
    return (
      <span className="flex items-center gap-1 bg-[#00ff94]/20 text-[#00ff94] px-2 py-0.5 rounded-full text-xs font-semibold">
        <span className="w-1.5 h-1.5 bg-[#00ff94] rounded-full" />
        SOON
      </span>
    );
  }
  
  return (
    <span className="text-[10px] text-[#636366]">
      {now.toLocaleDateString("ca-ES", { day: "numeric", month: "short" })}
    </span>
  );
}

function BottomNav() {
  const navItems = [
    { href: "/", icon: "home", label: "Home" },
    { href: "/live", icon: "bolt", label: "Live" },
    { href: "/weather", icon: "weather", label: "Weather" },
    { href: "/circuits", icon: "circuit", label: "Circuits" },
    { href: "/standings", icon: "trophy", label: "Classificació" },
    { href: "/telemetry", icon: "chart", label: "Telemetry" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1c1c1e] border-t border-[#38383a] safe-bottom z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </div>
    </nav>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: string; label: string }) {
  const icons: Record<string, string> = {
    home: `<path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>`,
    bolt: `<path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>`,
    weather: `<path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/><circle cx="12" cy="12" r="4"/>`,
    circuit: `<path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>`,
    trophy: `<polyline points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8"/>`,
    chart: `<polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>`,
  };

  return (
    <a
      href={href}
      className="nav-item relative flex flex-col items-center justify-center px-1 h-full text-[#8e8e93] hover:text-white transition-colors duration-200"
    >
      <svg
        className="w-5 h-5 mb-0.5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        dangerouslySetInnerHTML={{ __html: icons[icon] || "" }}
      />
      <span className="text-[9px] font-medium">{label}</span>
    </a>
  );
}
