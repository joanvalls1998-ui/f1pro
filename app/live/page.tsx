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
  headshot_url: string;
}

interface Position {
  driver_number: number;
  position: number;
  gap_to_leader: string | null;
  interval_to_position_ahead: string | null;
  date: string;
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

export default function LivePage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<string>("");

  const fetchData = useCallback(async () => {
    try {
      setError("");

      // Get current/live session
      const now = new Date().toISOString();
      const sessionsRes = await fetch(
        `${API}?endpoint=sessions&year=2026&date_start=lte${encodeURIComponent(now)}&date_end=gte${encodeURIComponent(now)}&limit=10`
      );
      const sessions: Session[] = await sessionsRes.json();

      // If no live session, get the most recent race
      if (!sessions || sessions.length === 0) {
        const pastRes = await fetch(
          `${API}?endpoint=sessions&year=2026&session_type=Race&limit=1&sort=date_end&order=desc`
        );
        const pastSessions: Session[] = await pastRes.json();
        if (pastSessions && pastSessions.length > 0) {
          setSession(pastSessions[0]);
          // Fetch drivers for this session
          const driversRes = await fetch(
            `${API}?endpoint=drivers&session_key=${pastSessions[0].session_key}`
          );
          const driversData: Driver[] = await driversRes.json();
          setDrivers(driversData.sort((a, b) => a.driver_number - b.driver_number));
        }
        setIsLive(false);
        setLoading(false);
        return;
      }

      const liveSession = sessions.find(s => !s.date_end || new Date(s.date_end) > new Date());
      if (!liveSession) {
        setIsLive(false);
        setLoading(false);
        return;
      }

      setSession(liveSession);
      setIsLive(true);

      // Fetch drivers
      const driversRes = await fetch(
        `${API}?endpoint=drivers&session_key=${liveSession.session_key}`
      );
      const driversData: Driver[] = await driversRes.json();
      setDrivers(driversData.sort((a, b) => a.driver_number - b.driver_number));

      // Fetch positions
      const posRes = await fetch(
        `${API}?endpoint=position&session_key=${liveSession.session_key}&limit=20`
      );
      const posData: Position[] = await posRes.json();
      setPositions(posData || []);

      setLastUpdate(new Date().toLocaleTimeString("ca-ES"));
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Error carregant dades. Torna a intentar.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll every 3s
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-[#00ff94] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#8e8e93]">Carregant dades...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full flex items-center justify-center px-5">
        <div className="text-center">
          <span className="text-4xl mb-4 block">⚠️</span>
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-[#2c2c2e] rounded-xl text-sm font-medium"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const sortedDrivers = [...drivers].sort((a, b) => {
    const posA = positions.find((p) => p.driver_number === a.driver_number);
    const posB = positions.find((p) => p.driver_number === b.driver_number);
    return (posA?.position ?? 99) - (posB?.position ?? 99);
  });

  return (
    <div className="min-h-full px-4 pt-10 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            {isLive && (
              <span className="flex items-center gap-1.5 bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full text-xs font-semibold">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                LIVE
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
            Actualitzat {lastUpdate}
          </span>
        )}
      </div>

      {/* Live indicator */}
      {isLive && (
        <div className="card p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <span className="text-sm font-medium">Sessió en directe</span>
          </div>
          <span className="pill">POLLING 3s</span>
        </div>
      )}

      {/* No live session message */}
      {!isLive && (
        <div className="card p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📺</span>
            <span className="text-sm font-medium">Sense sessió activa</span>
          </div>
          <span className="pill">DEMÀ: Miami FP1</span>
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

        {sortedDrivers.length === 0 ? (
          <div className="p-8 text-center text-[#8e8e93]">
            <p>Sense dades disponibles</p>
            <p className="text-sm text-[#636366] mt-1">
              Les posicions apareixeran aquí quan comenci la sessió
            </p>
          </div>
        ) : (
          sortedDrivers.map((driver, idx) => {
            const pos = positions.find(
              (p) => p.driver_number === driver.driver_number
            );
            const position = pos?.position ?? idx + 1;
            const isTop3 = position <= 3;

            return (
              <div
                key={driver.driver_number}
                className="flex items-center px-4 py-3 border-b border-[#38383a]/50 last:border-0 hover:bg-[#2c2c2e]/50 transition-colors"
              >
                {/* Position */}
                <span
                  className={`w-8 text-center font-bold text-lg ${
                    isTop3 ? "text-[#ffd700]" : "text-[#8e8e93]"
                  }`}
                >
                  {position}
                </span>

                {/* Number */}
                <span className="w-10 text-center text-[#636366] font-mono text-sm">
                  {driver.driver_number}
                </span>

                {/* Driver info */}
                <div className="flex-1 flex items-center gap-2 ml-2">
                  <img
                    src={driver.headshot_url}
                    alt={driver.full_name}
                    className="w-8 h-8 rounded-full object-cover bg-[#2c2c2e]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">
                      {driver.first_name} {driver.last_name}
                    </p>
                    <p className="text-[#636366] text-xs">{driver.name_acronym}</p>
                  </div>
                </div>

                {/* Team color */}
                <div className="w-20 flex justify-end">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: `#${driver.team_colour}` }}
                  />
                </div>

                {/* Gap */}
                <span className="w-16 text-right font-mono text-xs text-[#8e8e93]">
                  {pos?.gap_to_leader ?? "—"}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Footer info */}
      <div className="mt-4 text-center text-[#636366] text-xs">
        <p>Dades: OpenF1 API · Actualització cada 3 segons</p>
        <p className="mt-1">
          Pròxima sessió: <span className="text-white">Miami GP FP1</span> — 1 Maig 2026 16:00 UTC
        </p>
      </div>
    </div>
  );
}
