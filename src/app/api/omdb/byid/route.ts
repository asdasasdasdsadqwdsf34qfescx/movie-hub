import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const key = process.env.NEXT_OMDBAP_AUTH_KEY;
  if (!key) return NextResponse.json({ error: "OMDb key not configured" }, { status: 500 });
  const { searchParams } = new URL(req.url);
  const i = searchParams.get("i");
  const t = searchParams.get("t");
  if (!i && !t) return NextResponse.json({ error: "Missing i or t" }, { status: 400 });
  const query = i ? `i=${encodeURIComponent(i)}` : `t=${encodeURIComponent(t!)}`;
  const url = `https://www.omdbapi.com/?apikey=${key}&${query}`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  const json = await res.json();
  return NextResponse.json(json);
}
