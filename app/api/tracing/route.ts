import { NextResponse } from "next/server";

const GITHUB_RAW = "https://raw.githubusercontent.com/TracingInsights/2026/main";
const GITHUB_API = "https://api.github.com/repos/TracingInsights/2026/contents";

const SESSION_MAP: Record<string, string> = {
  FP1: "Practice 1",
  FP2: "Practice 2",
  FP3: "Practice 3",
  Q: "Qualifying",
  SQ: "Sprint Qualifying",
  SPRINT: "Sprint",
  RACE: "Race",
};

const GP_MAP: Record<string, string> = {
  AUS: "Australian Grand Prix",
  CHN: "Chinese Grand Prix",
  JPN: "Japanese Grand Prix",
  MIA: "Miami Grand Prix",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gp = searchParams.get("gp") || "AUS";
  const session = searchParams.get("session") || "RACE";
  const driver = searchParams.get("driver") || "NOR";

  const gpName = GP_MAP[gp] || gp;
  const sessionFolder = SESSION_MAP[session] || session;

  const url = `${GITHUB_RAW}/${encodeURIComponent(gpName)}/${encodeURIComponent(sessionFolder)}/${driver}/weather.json`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Telemetry not available" },
        { status: 404 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch telemetry" }, { status: 500 });
  }
}
