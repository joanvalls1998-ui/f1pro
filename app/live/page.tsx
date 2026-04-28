"use client";

import { useState, useEffect, useCallback } from "react";

interface Driver {
  driver_number: number;
  broadcast_name: string;
  full_name: string;
  name_acronym: string;
  team_name: string;
  team_colour: string;
  first_name: string;
  last_name: string;
}

interface Session {
  session_key: number;
  session_type: string;
  session_name: string;
  date_start: string;
  date_end: string;
  country_name: string;
  circuit_short_name: string;
}

const API = "/api/openf1";

// Static fallback data for when API fails
const FALLBACK_DRIVERS: Driver[] = [
  { driver_number: 1, broadcast_name: "L NORRIS", full_name: "Lando NORRIS", name_acronym: "NOR", team_name: "McLaren", team_colour: "F47600", first_name: "Lando", last_name: "Norris" },
  { driver_number: 3, broadcast_name: "M VERSTAPPEN", full_name: "Max VERSTAPPEN", name_acronym: "VER", team_name: "Red Bull Racing", team_colour: "4781D7", first_name: "Max", last_name: "Verstappen" },
  { driver_number: 16, broadcast_name: "C LECLERC", full_name: "Charles LECLERC", name_acronym: "LEC", team_name: "Ferrari", team_colour: "E8002D", first_name: "Charles", last_name: "Leclerc" },
  { driver_number: 44, broadcast_name: "L HAMILTON", full_name: "Lewis HAMILTON", name_acronym: "HAM", team_name: "Mercedes", team_colour: "27F4D2", first_name: "Lewis", last_name: "Hamilton" },
  { driver_number: 81, broadcast_name: "O PIASTRI", full_name: "Oscar PIASTRI", name_acronym: "PIA", team_name: "McLaren", team_colour: "F47600", first_name: "Oscar", last_name: "Piastri" },
  { driver_number: 63, broadcast_name: "G RUSSELL", full_name: "George RUSSELL", name_acronym: "RUS", team_name: "Mercedes", team_colour: "27F4D2", first_name: "George", last_name: "Russell" },
  { driver_number: 12, broadcast_name: "K ANTONELLI", full_name: "Kimi ANTONELLI", name_acronym: "ANT", team_name: "Mercedes", team_colour: "27F4D2", first_name: "Kimi", last_name: "Antonelli" },
  { driver_number: 5, broadcast_name: "G BORTOLETO", full_name: "Gabriel BORTOLETO", name_acronym: "BOR", team_name: "Audi", team_colour: "F50537", first_name: "Gabriel", last_name: "Bortoleto" },
  { driver_number: 27, broadcast_name: "N HULKENBERG", full_name: "Nico HULKENBERG", name_acronym: "HUL", team_name: "Audi", team_colour: "F50537", first_name: "Nico", last_name: "Hülkenberg" },
  { driver_number: 10, broadcast_name: "P GASLY", full_name: "Pierre GASLY", name_acronym: "GAS", team_name: "Alpine", team_colour: "00A1E8", first_name: "Pierre", last_name: "Gasly" },
];

const FALLBACK_SESSION: Session = {
  session_key: 11280,
  session_type: "Race",
  session_name: "Race",
  date_start: "2026-04-19T17:00:00Z",
  date_end: "2026-04-19T19:00:00Z",
  country_name: "Saudi Arabia",
  circuit_short_name: "Jeddah",
};

export default function LivePage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<string>("");
  const [apiWorking, setApiWorking] = useState<boolean | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError("");

      // Try to fetch live session
      const now = new Date().toISOString();
      const sessionsRes = await fetch(
        `${API}?endpoint=sessions&year=2026&date_start=lte${encodeURIComponent(now)}&date_end=gte${encodeURIComponent(now)}&limit=5`
      );
      
      if (!sessionsRes.ok) {
        throw new Error(`API error: ${sessionsRes.status}`);
      }
      
      const sessions: Session[] = await sessionsRes.json();
      setApiWorking(true);

      if (sessions && sessions.length > 0) {
        const liveSession = sessions.find(s => !s.date_end || new Date(s.date_end) > new Date());
        if (liveSession) {
          setSession(liveSession);
          setIsLive(true);
        } else {
          setSession(sessions[0]);
          setIsLive(false);
        }

        // Fetch drivers
        const driversRes = await fetch(
          `${API}?endpoint=drivers&session_key=${liveSession?.session_key || sessions[0].session_key}`
        );
        if (driversRes.ok) {
          const driversData: Driver[] = await driversRes.json();
          setDrivers(driversData.sort((a, b) => a.driver_number - b.driver_number));
        }
      } else {
        // No live session - use fallback data
        setSession(FALLBACK_SESSION);
        setDrivers(FALLBACK_DRIVERS);
        setIsLive(false);
      }

      setLastUpdate(new Date().toLocaleTimeString("ca-ES", { hour: "2-digit", minute: "2-digit" }));
    } catch (err) {
      console.error("Error fetching data:", err);
      setApiWorking(false);
      // Use fallback data
      setSession(FALLBACK_SESSION);
      setDrivers(FALLBACK_DRIVERS);
      setIsLive(false);
      setError("API no disponible - dades de mostra");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-[#00ff94] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#8e8e93]">Carregant...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full px-4 pt-10 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            {isLive ? (
              <span className="flex items-center gap-1.5 bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full text-xs font-semibold">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                LIVE
              </span>
            ) : (
              <span className="flex items-center gap-1.5 bg-[#2c2c2e] text-[#8e8e93] px-2 py-0.5 rounded-full text-xs font-semibold">
                📺 DEMO
              </span>
            )}
            <h1 className="text-xl font-bold">Live Timing</h1>
          </div>
          {session && (
            <p className="text-[#8e8e93] text-sm">
              {session.circuit_short_name} — {session.session_name}
            </p>
          )}
        </div>
        {lastUpdate && (
          <span className="text-[#636366] text-xs">
            {lastUpdate}
          </span>
        )}
      </div>

      {/* Status bar */}
      {apiWorking === false && (
        <div className="card p-3 mb-4 bg-yellow-500/10 border-yellow-500/30">
          <p className="text-yellow-500 text-sm text-center">
            ⚠️ OpenF1 API no respon — mostrant dades de demostració
          </p>
        </div>
      )}

      {/* Position table */}
      <div className="card overflow-hidden">
        <div className="px-4 py-2 bg-[#2c2c2e] flex items-center text-[10px] uppercase tracking-wider text-[#636366] font-semibold">
          <span className="w-8 text-center">Pos</span>
          <span className="w-10 text-center">#</span>
          <span className="flex-1 ml-2">Pilot</span>
          <span className="w-20 text-right">Equip</span>
          <span className="w-16 text-right">Gap</span>
        </div>

        {drivers.length === 0 ? (
          <div className="p-8 text-center text-[#8e8e93]">
            <p>Sense dades disponibles</p>
          </div>
        ) : (
          drivers.map((driver, idx) => {
            const position = idx + 1;
            const isTop3 = position <= 3;

            return (
              <div
                key={driver.driver_number}
                className="flex items-center px-4 py-3 border-b border-[#38383a]/50 last:border-0"
              >
                <span
                  className={`w-8 text-center font-bold text-lg ${
                    isTop3 ? "text-[#ffd700]" : "text-[#8e8e93]"
                  }`}
                >
                  {position}
                </span>

                <span className="w-10 text-center text-[#636366] font-mono text-sm">
                  {driver.driver_number}
                </span>

                <div className="flex-1 flex items-center gap-2 ml-2">
                  <div className="w-8 h-8 rounded-full bg-[#2c2c2e] flex items-center justify-center text-xs font-bold">
                    {driver.name_acronym}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">
                      {driver.first_name} {driver.last_name}
                    </p>
                    <p className="text-[#636366] text-xs">{driver.name_acronym}</p>
                  </div>
                </div>

                <div className="w-20 flex justify-end">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: `#${driver.team_colour}` }}
                  />
                </div>

                <span className="w-16 text-right font-mono text-xs text-[#8e8e93]">
                  {idx === 0 ? "LAP" : `+${idx * 1.2}s`}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 text-center text-[#636366] text-xs">
        <p>Dades: OpenF1 API · Actualització cada 15 segons</p>
        <p className="mt-1">
          Pròxima sessió: <span className="text-white">Miami GP FP1</span> — 1 Maig 2026
        </p>
      </div>
    </div>
  );
}
