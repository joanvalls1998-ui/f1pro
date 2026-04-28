import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint");

  if (!endpoint) {
    return new Response(JSON.stringify({ error: "Missing endpoint" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const url = `https://api.openf1.org/v1/${endpoint}`;
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 0 }, // Always fresh data
    });

    if (!response.ok) {
      throw new Error(`OpenF1 API error: ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("OpenF1 proxy error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch from OpenF1" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
