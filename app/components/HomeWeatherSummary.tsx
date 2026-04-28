"use client";

import { useEffect, useState } from "react";

interface HomeWeather {
  trackTemp: number;
  airTemp: number;
  humidity: number;
  windSpeed: number;
  rain: number;
}

const FALLBACK: HomeWeather = { trackTemp: 32, airTemp: 28, humidity: 65, windSpeed: 18, rain: 10 };

export default function HomeWeatherSummary() {
  const [w, setW] = useState<HomeWeather | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchWeather() {
      try {
        const sessionsRes = await fetch("https://api.openf1.org/v1/sessions?circuit_short_name=Miami&year=2026&limit=1");
        let sessionKey: number | null = null;
        if (sessionsRes.ok) {
          const s = await sessionsRes.json();
          if (s.length > 0) sessionKey = s[0].session_key;
        }
        const url = sessionKey
          ? `https://api.openf1.org/v1/weather?session_key=${sessionKey}&limit=1`
          : "https://api.openf1.org/v1/weather?limit=1";
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            if (data.length > 0) {
              setW({
                trackTemp: data[0].track_temperature ?? 32,
                airTemp: data[0].air_temperature ?? 28,
                humidity: data[0].humidity ?? 65,
                windSpeed: data[0].wind_speed ?? 18,
                rain: data[0].rain_percentage ?? 10,
              });
            } else {
              setW(FALLBACK);
            }
            setLoading(false);
          }
        } else if (!cancelled) {
          setW(FALLBACK);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setW(FALLBACK);
          setLoading(false);
        }
      }
    }
    fetchWeather();
    const t = setInterval(fetchWeather, 120000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  if (loading) {
    return (
      <div className="mt-4 pt-3 border-t border-[#2c2c2e] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">🌤️</span>
          <span className="text-[#636366] text-xs">Miami, FL</span>
        </div>
        <span className="text-[#48484a] text-xs">Loading…</span>
      </div>
    );
  }

  const rainIcon = w && w.rain > 50 ? "🌧️" : w && w.rain > 20 ? "⛅" : w && w.rain > 5 ? "🌤️" : "☀️";

  return (
    <div className="mt-4 pt-3 border-t border-[#2c2c2e] flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-base">{rainIcon}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[#636366] text-xs">Miami, FL</span>
          <span className="text-[#48484a] text-xs">·</span>
          <span className="text-white text-xs font-semibold tabular-nums">
            {w?.airTemp ?? "--"}°C
          </span>
          <span className="text-[#48484a] text-xs">/</span>
          <span className="text-[#00ff94] text-xs font-semibold tabular-nums">
            {w?.trackTemp ?? "--"}°
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-[#636366]">
          💧 {w?.humidity ?? "--"}% · 🌀 {w?.windSpeed ?? "--"}km/h
        </span>
        <a
          href="/weather"
          className="text-[#00ff94]/70 text-[10px] font-medium hover:text-[#00ff94] transition-colors"
        >
          Details →
        </a>
      </div>
    </div>
  );
}
