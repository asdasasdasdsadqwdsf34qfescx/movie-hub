import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const key = process.env.NEXT_OMDBAP_AUTH_KEY;
  if (!key) return NextResponse.json({ error: "OMDb key not configured" }, { status: 500 });
  const { searchParams } = new URL(req.url);
  const s = searchParams.get("s");
  if (!s) return NextResponse.json({ Search: [] });
  const url = `https://www.omdbapi.com/?apikey=${key}&s=${encodeURIComponent(s)}`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  const json = await res.json();
  return NextResponse.json(json);
}
