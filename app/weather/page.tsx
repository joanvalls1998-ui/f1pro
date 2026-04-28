"use client";

import { useEffect, useState } from "react";

interface WeatherData {
  air_temperature: number;
  track_temperature: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  rain_percentage: number;
  pressure: number;
}

const FALLBACK: WeatherData = {
  track_temperature: 32,
  air_temperature: 28,
  humidity: 65,
  wind_speed: 18,
  wind_direction: 90,
  rain_percentage: 10,
  pressure: 1013,
};

function getWeatherIcon(rain: number): string {
  if (rain > 50) return "🌧️";
  if (rain > 20) return "⛅";
  if (rain > 5) return "🌤️";
  return "☀️";
}

function getWeatherLabel(rain: number): string {
  if (rain > 50) return "Rainy";
  if (rain > 20) return "Cloudy";
  if (rain > 5) return "Partly Cloudy";
  return "Clear";
}

function getTrackCondition(trackTemp: number, rain: number): { label: string; color: string; icon: string } {
  if (rain > 50) return { label: "Wet", color: "#3b9eff", icon: "🌧️" };
  if (trackTemp > 50) return { label: "Hot", color: "#ff6b35", icon: "🔥" };
  if (trackTemp > 40) return { label: "Warm", color: "#ffaa00", icon: "☀️" };
  if (trackTemp > 25) return { label: "Ideal", color: "#00ff94", icon: "✅" };
  return { label: "Cold", color: "#a0cfff", icon: "❄️" };
}

function WindArrow({ degrees }: { degrees: number }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ transform: `rotate(${degrees}deg)`, transition: "transform 0.5s ease" }}>
      <path d="M12 2L8 10h3v10l4-12h-3z" fill="#00ff94" stroke="#00ff94" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function CompassLabel({ degrees }: { degrees: number }) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const idx = Math.round(degrees / 45) % 8;
  return <span className="text-[10px] text-[#636366]">{dirs[idx]} · {degrees}°</span>;
}

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    async function fetchWeather() {
      try {
        const sessionsRes = await fetch("https://api.openf1.org/v1/sessions?circuit_short_name=Miami&year=2026&limit=1");
        let sessionKey: number | null = null;
        if (sessionsRes.ok) {
          const sessions = await sessionsRes.json();
          if (sessions.length > 0) sessionKey = sessions[0].session_key;
        }

        let url = "https://api.openf1.org/v1/weather?limit=1";
        if (sessionKey) url = `https://api.openf1.org/v1/weather?session_key=${sessionKey}`;

        const weatherRes = await fetch(url);
        if (weatherRes.ok) {
          const data = await weatherRes.json();
          if (data.length > 0) {
            const w = data[0];
            setWeather({
              air_temperature: w.air_temperature ?? 28,
              track_temperature: w.track_temperature ?? 32,
              humidity: w.humidity ?? 65,
              wind_speed: w.wind_speed ?? 18,
              wind_direction: w.wind_direction ?? 90,
              rain_percentage: w.rain_percentage ?? 10,
              pressure: w.pressure ?? 1013,
            });
            setLastUpdated(new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }));
            setLoading(false);
            return;
          }
        }
        setWeather(FALLBACK);
        setLastUpdated("--:--");
      } catch {
        setWeather(FALLBACK);
        setLastUpdated("--:--");
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
    const interval = setInterval(fetchWeather, 60000);
    return () => clearInterval(interval);
  }, []);

  const condition = weather ? getTrackCondition(weather.track_temperature, weather.rain_percentage) : getTrackCondition(32, 10);
  const weatherIcon = weather ? getWeatherIcon(weather.rain_percentage) : "☀️";
  const weatherLabel = weather ? getWeatherLabel(weather.rain_percentage) : "Clear";

  return (
    <div className="min-h-full px-4 pt-16 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[#8e8e93] text-[10px] font-semibold uppercase tracking-widest">Miami GP 2026</p>
          <h1 className="text-2xl font-bold tracking-tight">Weather</h1>
        </div>
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="w-4 h-4 rounded-full border-2 border-[#00ff94] border-t-transparent animate-spin" />
          ) : (
            <span className="text-[#636366] text-xs">Updated {lastUpdated}</span>
          )}
        </div>
      </div>

      {/* Hero weather card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#1c1c1e] to-[#141414] border border-[#38383a] overflow-hidden mb-4">
        {/* Top strip */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#2c2c2e]/80">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{weatherIcon}</span>
            <div>
              <p className="text-base font-bold text-white leading-tight">{weatherLabel}</p>
              <p className="text-[#636366] text-xs">Miami International Autodrome</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-sm" style={{ color: condition.color }}>{condition.icon}</span>
              <span className="text-xs font-semibold" style={{ color: condition.color }}>{condition.label}</span>
            </div>
            <p className="text-[10px] text-[#636366]">Track Status</p>
          </div>
        </div>

        {/* Track temp — hero number */}
        <div className="px-5 pt-6 pb-5 text-center">
          <p className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold mb-2">Track Temperature</p>
          <div className="flex items-start justify-center gap-1">
            <span className="text-7xl font-bold text-white leading-none tabular-nums">
              {loading ? "--" : weather?.track_temperature ?? "--"}
            </span>
            <span className="text-3xl font-bold text-[#00ff94] mt-2">°C</span>
          </div>
        </div>
      </div>

      {/* Stats grid — 2x2 */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Air Temp */}
        <div className="rounded-2xl bg-[#1c1c1e] border border-[#38383a] p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">🌡️</span>
            <span className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold">Air Temp</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white tabular-nums">{loading ? "--" : weather?.air_temperature ?? "--"}</span>
            <span className="text-lg font-bold text-[#00ff94]">°C</span>
          </div>
        </div>

        {/* Humidity */}
        <div className="rounded-2xl bg-[#1c1c1e] border border-[#38383a] p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">💧</span>
            <span className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold">Humidity</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white tabular-nums">{loading ? "--" : weather?.humidity ?? "--"}</span>
            <span className="text-lg font-bold text-[#00ff94]">%</span>
          </div>
          <div className="mt-2 h-1.5 bg-[#2c2c2e] rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-[#00ff94] to-[#00cc77]" style={{ width: loading ? "0%" : `${weather?.humidity ?? 0}%` }} />
          </div>
        </div>

        {/* Wind */}
        <div className="rounded-2xl bg-[#1c1c1e] border border-[#38383a] p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">🌀</span>
            <span className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold">Wind</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <WindArrow degrees={weather?.wind_direction ?? 0} />
            <span className="text-4xl font-bold text-white tabular-nums">{loading ? "--" : weather?.wind_speed ?? "--"}</span>
            <span className="text-sm font-bold text-[#00ff94]">km/h</span>
          </div>
          <CompassLabel degrees={weather?.wind_direction ?? 0} />
        </div>

        {/* Pressure */}
        <div className="rounded-2xl bg-[#1c1c1e] border border-[#38383a] p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">🧮</span>
            <span className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold">Pressure</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white tabular-nums">{loading ? "--" : weather?.pressure ?? "--"}</span>
            <span className="text-sm font-bold text-[#00ff94]">hPa</span>
          </div>
        </div>
      </div>

      {/* Rain probability */}
      <div className="rounded-2xl bg-[#1c1c1e] border border-[#38383a] p-4 mb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{weatherIcon}</span>
            <span className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold">Rain Probability</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold text-white tabular-nums">{loading ? "--" : weather?.rain_percentage ?? "--"}</span>
            <span className="text-sm font-bold text-[#00ff94]">%</span>
          </div>
        </div>
        <div className="h-3 bg-[#2c2c2e] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: loading ? "0%" : `${weather?.rain_percentage ?? 0}%`,
              background: weather && weather.rain_percentage > 30
                ? "linear-gradient(90deg, #ffaa00, #ff6b35)"
                : "linear-gradient(90deg, #00ff94, #00cc77)",
            }}
          />
        </div>
        {weather && weather.rain_percentage > 30 && (
          <p className="text-xs text-[#ffaa00] mt-2 font-medium">⚠️ Risk of rain during the session</p>
        )}
      </div>

      {/* Weather impact */}
      <div className="rounded-2xl bg-[#1c1c1e] border border-[#38383a] p-4">
        <p className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold mb-3">Conditions Impact</p>
        <div className="flex flex-col gap-2">
          {weather && weather.track_temperature > 50 && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#ff6b35]/10 border border-[#ff6b35]/30">
              <span className="text-lg">🔥</span>
              <span className="text-sm font-semibold text-[#ff6b35]">High degradation — track over 50°C</span>
            </div>
          )}
          {weather && weather.rain_percentage > 30 && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#ffaa00]/10 border border-[#ffaa00]/30">
              <span className="text-lg">🌧️</span>
              <span className="text-sm font-semibold text-[#ffaa00]">Rain risk — monitor closely</span>
            </div>
          )}
          {weather && weather.wind_speed > 30 && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#3b9eff]/10 border border-[#3b9eff]/30">
              <span className="text-lg">💨</span>
              <span className="text-sm font-semibold text-[#3b9eff]">Strong wind — affecting aero balance</span>
            </div>
          )}
          {weather && weather.track_temperature <= 50 && weather.rain_percentage <= 30 && weather.wind_speed <= 30 && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#00ff94]/10 border border-[#00ff94]/30">
              <span className="text-lg">✅</span>
              <span className="text-sm font-semibold text-[#00ff94]">Ideal conditions — no significant impact</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
