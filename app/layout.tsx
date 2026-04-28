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
        <main className="flex-1 overflow-auto pb-20">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}

function BottomNav() {
  const navItems = [
    { href: "/", icon: "home", label: "Home" },
    { href: "/live", icon: "bolt", label: "Live" },
    { href: "/calendar", icon: "calendar", label: "Calendari" },
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
    calendar: `<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,
    trophy: `<polyline points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8"/>`,
    chart: `<polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>`,
  };

  return (
    <a
      href={href}
      className="nav-item relative flex flex-col items-center justify-center w-16 h-full text-[#8e8e93] hover:text-white transition-colors duration-200"
    >
      <svg
        className="w-6 h-6 mb-1"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        dangerouslySetInnerHTML={{ __html: icons[icon] || "" }}
      />
      <span className="text-[10px] font-medium">{label}</span>
    </a>
  );
}
