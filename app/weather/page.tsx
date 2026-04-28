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
  if (rain > 20) return "☁️";
  if (rain > 5) return "🌤️";
  return "☀️";
}

function getWeatherLabel(rain: number): string {
  if (rain > 50) return "Rain";
  if (rain > 20) return "Cloudy";
  if (rain > 5) return "Partly Cloudy";
  return "Clear";
}

function WindArrow({ degrees }: { degrees: number }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: `rotate(${degrees}deg)`, transition: "transform 0.5s ease" }}
    >
      <path
        d="M12 2L8 10h3v10l4-12h-3z"
        fill="#00ff94"
        stroke="#00ff94"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getWeatherImpact(data: WeatherData) {
  const impacts: { icon: string; label: string; key: string }[] = [];
  if (data.track_temperature > 50) {
    impacts.push({ icon: "🔴", label: "High degradation", key: "degradation" });
  }
  if (data.rain_percentage > 30) {
    impacts.push({ icon: "⚠️", label: "Risk of rain", key: "rain" });
  }
  if (data.wind_speed > 30) {
    impacts.push({ icon: "💨", label: "Strong wind", key: "wind" });
  }
  return impacts;
}

function getImpactColor(key: string): string {
  if (key === "degradation") return "text-red-400";
  if (key === "rain") return "text-yellow-400";
  if (key === "wind") return "text-blue-300";
  return "text-white";
}

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    async function fetchWeather() {
      try {
        // 1. Get the latest session key for Miami GP
        const sessionsRes = await fetch(
          "https://api.openf1.org/v1/sessions?circuit_short_name=Miami&year=2026&session_name=Race&limit=1"
        );
        let sessionKey: number | null = null;

        if (sessionsRes.ok) {
          const sessions = await sessionsRes.json();
          if (sessions.length > 0) {
            sessionKey = sessions[0].session_key;
          }
        }

        // 2. Fallback: get any 2026 Miami session
        if (!sessionKey) {
          const fallbackRes = await fetch(
            "https://api.openf1.org/v1/sessions?circuit_short_name=Miami&year=2026&limit=1"
          );
          if (fallbackRes.ok) {
            const fallback = await fallbackRes.json();
            if (fallback.length > 0) {
              sessionKey = fallback[0].session_key;
            }
          }
        }

        // 3. Fetch weather
        let url = "https://api.openf1.org/v1/weather?limit=1";
        if (sessionKey) {
          url = `https://api.openf1.org/v1/weather?session_key=${sessionKey}`;
        }

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

        // Fallback
        setWeather({
          track_temperature: FALLBACK.track_temperature,
          air_temperature: FALLBACK.air_temperature,
          humidity: FALLBACK.humidity,
          wind_speed: FALLBACK.wind_speed,
          wind_direction: FALLBACK.wind_direction,
          rain_percentage: FALLBACK.rain_percentage,
          pressure: FALLBACK.pressure,
        });
        setLastUpdated("--:--");
      } catch {
        setWeather({
          track_temperature: FALLBACK.track_temperature,
          air_temperature: FALLBACK.air_temperature,
          humidity: FALLBACK.humidity,
          wind_speed: FALLBACK.wind_speed,
          wind_direction: FALLBACK.wind_direction,
          rain_percentage: FALLBACK.rain_percentage,
          pressure: FALLBACK.pressure,
        });
        setLastUpdated("--:--");
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
    // Refresh every 60 seconds
    const interval = setInterval(fetchWeather, 60000);
    return () => clearInterval(interval);
  }, []);

  const impacts = weather ? getWeatherImpact(weather) : [];
  const weatherIcon = weather ? getWeatherIcon(weather.rain_percentage) : "☀️";
  const weatherLabel = weather ? getWeatherLabel(weather.rain_percentage) : "Clear";

  return (
    <div className="min-h-full px-4 pt-16 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold">Weather</h1>
          <p className="text-[#8e8e93] text-sm">Miami International Autodrome</p>
        </div>
        {lastUpdated && (
          <span className="text-[#636366] text-xs">
            {loading ? "●●●" : lastUpdated}
          </span>
        )}
      </div>

      {/* Main weather card */}
      <div className="card overflow-hidden mb-4">
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#2c2c2e]">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{weatherIcon}</span>
            <div>
              <p className="text-sm font-semibold text-white">{weatherLabel}</p>
              <p className="text-xs text-[#8e8e93]">Miami GP</p>
            </div>
          </div>
          {loading && (
            <div className="w-4 h-4 rounded-full border-2 border-[#00ff94] border-t-transparent animate-spin" />
          )}
        </div>

        {/* Track temperature — hero number */}
        <div className="px-5 pt-6 pb-4 text-center">
          <p className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold mb-1">
            Track Temperature
          </p>
          <div className="flex items-start justify-center gap-1">
            <span className="text-7xl font-bold text-white leading-none">
              {loading ? "--" : weather?.track_temperature ?? "--"}
            </span>
            <span className="text-3xl font-bold text-[#00ff94] mt-2">°C</span>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-[#38383a]" />

        {/* Stats grid */}
        <div className="px-5 py-5 grid grid-cols-2 gap-4">
          {/* Air temperature */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-sm">🌡️</span>
              <span className="text-[10px] uppercase tracking-wider text-[#636366] font-semibold">
                Air Temp
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white">
                {loading ? "--" : weather?.air_temperature ?? "--"}
              </span>
              <span className="text-lg font-bold text-[#00ff94]">°C</span>
            </div>
          </div>

          {/* Humidity */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-sm">💧</span>
              <span className="text-[10px] uppercase tracking-wider text-[#636366] font-semibold">
                Humidity
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white">
                {loading ? "--" : weather?.humidity ?? "--"}
              </span>
              <span className="text-lg font-bold text-[#00ff94]">%</span>
            </div>
          </div>

          {/* Wind speed + direction */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-sm">🌀</span>
              <span className="text-[10px] uppercase tracking-wider text-[#636366] font-semibold">
                Wind
              </span>
            </div>
            <div className="flex items-center gap-2">
              <WindArrow degrees={weather?.wind_direction ?? 0} />
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">
                    {loading ? "--" : weather?.wind_speed ?? "--"}
                  </span>
                  <span className="text-sm font-bold text-[#00ff94]">km/h</span>
                </div>
                <p className="text-[10px] text-[#636366]">
                  {weather?.wind_direction ?? "--"}°
                </p>
              </div>
            </div>
          </div>

          {/* Pressure */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-sm">🧮</span>
              <span className="text-[10px] uppercase tracking-wider text-[#636366] font-semibold">
                Pressure
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white">
                {loading ? "--" : weather?.pressure ?? "--"}
              </span>
              <span className="text-sm font-bold text-[#00ff94]">mbar</span>
            </div>
          </div>
        </div>

        {/* Rain probability */}
        <div className="mx-5 mb-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{weather?.rain_percentage && weather.rain_percentage > 0 ? "🌧️" : "☀️"}</span>
              <span className="text-[10px] uppercase tracking-wider text-[#636366] font-semibold">
                Rain Probability
              </span>
            </div>
            <span className="text-xl font-bold text-white">
              {loading ? "--" : weather?.rain_percentage ?? "--"}%
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-[#2c2c2e] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: loading ? "0%" : `${weather?.rain_percentage ?? 0}%`,
                background: weather && weather.rain_percentage > 30
                  ? "linear-gradient(90deg, #00ff94, #ffaa00)"
                  : "linear-gradient(90deg, #00ff94, #00cc77)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Weather impact alerts */}
      {impacts.length > 0 && (
        <div className="card p-4">
          <p className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold mb-3">
            Weather Impact
          </p>
          <div className="flex flex-col gap-2">
            {impacts.map((impact) => (
              <div
                key={impact.key}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#2c2c2e]"
              >
                <span className="text-lg">{impact.icon}</span>
                <span className={`text-sm font-semibold ${getImpactColor(impact.key)}`}>
                  {impact.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {impacts.length === 0 && !loading && (
        <div className="card p-4">
          <p className="text-[10px] uppercase tracking-widest text-[#636366] font-semibold mb-3">
            Weather Impact
          </p>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#2c2c2e]">
            <span className="text-lg">✅</span>
            <span className="text-sm font-semibold text-[#00ff94]">
              No significant weather impact
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
