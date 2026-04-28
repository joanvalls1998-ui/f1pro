// OpenF1 API client
const BASE = "https://api.openf1.org/v1";

export interface Session {
  session_key: number;
  meeting_key: number;
  session_name: string;
  session_type: string;
  date_start: string;
  date_end: string;
  country_name: string;
  location: string;
  circuit_short_name: string;
}

export interface Meeting {
  meeting_key: number;
  year: number;
  country_name: string;
  location: string;
  circuit_short_name: string;
  official_name: string;
  session_start: string;
  session_end: string;
}

export async function getNextRace(): Promise<Meeting | null> {
  try {
    const now = new Date().toISOString();
    const res = await fetch(
      `${BASE}/meetings?year=2026&session_start>=${now}&orderby=session_start&limit=1`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error("Failed");
    const data = await res.json();
    return data.data?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function getCurrentSession(): Promise<Session | null> {
  try {
    const now = new Date().toISOString();
    const res = await fetch(
      `${BASE}/sessions?year=2026&date_start<=${now}&date_end>=${now}&limit=1`,
      { next: { revalidate: 30 } }
    );
    if (!res.ok) throw new Error("Failed");
    const data = await res.json();
    return data.data?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function getSessionsByMeeting(meetingKey: number): Promise<Session[]> {
  try {
    const res = await fetch(
      `${BASE}/sessions?meeting_key=${meetingKey}&year=2026`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) throw new Error("Failed");
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

export async function getDriverStandings(season: number = 2026) {
  try {
    const res = await fetch(
      `https://ergast.com/api/f1/${season}/ standings.json`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error("Failed");
    const json = await res.json();
    const standings =
      json.MRData.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? [];
    return standings.slice(0, 7);
  } catch {
    return [];
  }
}

export async function getLatestNews(limit: number = 5) {
  // Using a public F1 RSS-to-JSON service
  try {
    const res = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=https://feeds.feedspot.com/ff_F1&count=${limit}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) throw new Error("Failed");
    const data = await res.json();
    return data.items ?? [];
  } catch {
    return [];
  }
}
