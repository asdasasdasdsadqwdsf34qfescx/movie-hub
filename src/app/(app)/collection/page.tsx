"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

type MovieRow = {
  id?: number;
  created_at?: string;
  name: string;
  poster: string | null;
  watchedCount?: number | null;
  genres?: string[] | null;
  year?: number | null;
  runtime?: number | null;
  isFavorite?: boolean | null;
  watchedDates?: string[] | null;
  userId: string;
  imdbRating?: number | null;
  imdbVotes?: number | null;
  released?: string | null;
};

interface OmdbSearchItem {
  Title: string;
  Year?: string;
  Poster?: string;
  imdbID: string;
}

export default function Collection() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [movies, setMovies] = useState<MovieRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<OmdbSearchItem[]>([]);

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        if (!data.session) {
          router.replace("/sign-in");
          return;
        }
        setUserId(data.session.user.id);
      } catch {
        if (mounted) router.replace("/sign-in");
      }
    }
    init();
    return () => { mounted = false; };
  }, [router]);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("movies")
        .select("id, created_at, name, poster, watchedCount, genres, year, runtime, isFavorite, watchedDates, userId, imdbRating, imdbVotes, released")
        .eq("userId", userId)
        .order("created_at", { ascending: false });
      if (!active) return;
      if (error) {
        setMovies([]);
      } else {
        setMovies((data as MovieRow[]) ?? []);
      }
      setLoading(false);
    })();
    return () => { active = false; };
  }, [userId]);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const id = setTimeout(async () => {
      if (!query.trim()) { setResults([]); return; }
      try {
        setSearching(true);
        const res = await fetch(`/api/omdb/search?s=${encodeURIComponent(query)}`, { signal: controller.signal });
        const json = await res.json();
        setResults(Array.isArray(json.Search) ? json.Search.slice(0, 12) : []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => { clearTimeout(id); controller.abort(); };
  }, [query, open]);

  const saveMovie = async (m: OmdbSearchItem) => {
    if (!userId) return;
    try {
      const detailsRes = await fetch(`/api/omdb/byid?i=${m.imdbID}`);
      const details = await detailsRes.json();
      const posterUrl = details.Poster && details.Poster !== "N/A" ? details.Poster : (m.Poster && m.Poster !== "N/A" ? m.Poster : null);
      const toNumber = (v: unknown) => {
        if (typeof v === "string") {
          const n = parseInt(v.replace(/[^0-9]/g, ""), 10);
          return Number.isFinite(n) ? n : null;
        }
        if (typeof v === "number") return v;
        return null;
      };
      const toFloat = (v: unknown) => {
        if (typeof v === "string") {
          const n = parseFloat(v.replace(/,/g, ""));
          return Number.isFinite(n) ? n : null;
        }
        if (typeof v === "number") return v;
        return null;
      };
      const releasedStr: string | null = typeof details.Released === "string" && details.Released !== "N/A" ? new Date(details.Released).toISOString().slice(0,10) : null;
      const yearNum: number | null = toNumber(details.Year ?? m.Year ?? null);
      const runtimeNum: number | null = toNumber(details.Runtime);
      const genresArr: string[] | null = typeof details.Genre === "string" && details.Genre !== "N/A" ? details.Genre.split(",").map((s: string) => s.trim()).filter(Boolean) : null;
      const imdbRating = toFloat(details.imdbRating);
      const imdbVotes = toNumber(details.imdbVotes);

      const payload: MovieRow = {
        name: details.Title ?? m.Title,
        poster: posterUrl,
        genres: genresArr,
        year: yearNum,
        runtime: runtimeNum,
        isFavorite: false,
        watchedCount: 0,
        watchedDates: [],
        userId,
        imdbRating,
        imdbVotes,
        released: releasedStr,
      };
      const { error } = await supabase.from("movies").insert(payload);
      if (error) throw error;
      setOpen(false);
      setQuery("");
      const { data } = await supabase
        .from("movies")
        .select("id, created_at, name, poster, watchedCount, genres, year, runtime, isFavorite, watchedDates, userId, imdbRating, imdbVotes, released")
        .eq("userId", userId)
        .order("created_at", { ascending: false });
      setMovies((data as MovieRow[]) ?? []);
    } catch {
      // ignore
    }
  };

  const emptyState = useMemo(() => !loading && movies.length === 0, [loading, movies.length]);

  return (
    <div className="w-full min-h-screen pl-2 pr-8 py-4 sm:pl-4 sm:pr-12 lg:pl-6 lg:pr-16 overflow-x-hidden">
      <div className="w-full max-w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold truncate">Collection</h1>
          </div>
        </div>
        <p className="text-base sm:text-lg opacity-70 mb-6 sm:mb-8">Browse and manage your collection with light and dark theme support.</p>

        {emptyState ? (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 sm:p-8 text-center">
            <p className="opacity-70 mb-4">No movies yet. Click Add New to add one.</p>
            <Button onClick={() => setOpen(true)} className="rounded-lg">Add New</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 min-[100px]:grid-cols-2 min-[950px]:grid-cols-3 min-[1250px]:grid-cols-4 min-[1550px]:grid-cols-5 gap-2 sm:gap-3">
            {/* Add New Card */}
            <div 
              onClick={() => setOpen(true)}
              className="p-0 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] overflow-hidden cursor-pointer border-dashed border-2 hover:border-white/20"
            >
              <div className="h-48 sm:h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl sm:text-6xl opacity-50 mb-2">+</div>
                  <p className="text-sm sm:text-base opacity-70">Add Movie</p>
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="text-lg sm:text-xl font-semibold mb-1 text-center opacity-70">Add New</h3>
                <p className="opacity-60 text-xs sm:text-sm text-center">Click to add a movie</p>
              </div>
            </div>
            {movies.map((m) => (
              <div key={m.id} className="p-0 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                {m.poster ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.poster} alt={m.name} className="w-full h-48 sm:h-64 object-cover" />
                ) : (
                  <div className="h-48 sm:h-64 flex items-center justify-center text-xl sm:text-2xl opacity-50">No Image</div>
                )}
                <div className="p-3 sm:p-4">
                  <h3 className="text-lg sm:text-xl font-semibold mb-1 line-clamp-2">{m.name}</h3>
                  <p className="opacity-60 text-xs sm:text-sm truncate">{m.year ?? ""}{m.runtime ? ` • ${m.runtime} min` : ""}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[min(95vw,1600px)] max-w-4xl max-h-[calc(100vh-200px)] overflow-hidden">
          <DialogHeader className="shrink-0">
            <DialogTitle>Add a movie</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 flex-1 overflow-hidden">
            <Input placeholder="Search movies" value={query} onChange={(e) => setQuery(e.target.value)} className="shrink-0" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[calc(90vh-200px)] overflow-y-auto pr-2">
              {searching && <div className="opacity-60 col-span-full text-center py-4">Searching…</div>}
              {!searching && results.map((r, idx) => (
                <div key={`${r.imdbID}-${idx}`} className="flex flex-col gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition">
                  {r.Poster && r.Poster !== "N/A" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.Poster} alt={r.Title} className="w-full h-32 object-cover rounded" />
                  ) : (
                    <div className="w-full h-32 rounded bg-white/10 flex items-center justify-center text-xs opacity-60">No Image</div>
                  )}
                  <div className="flex-1 min-h-0">
                    <div className="font-medium leading-5 line-clamp-2 mb-1">{r.Title}</div>
                    <div className="text-xs opacity-60">{r.Year ?? ""}</div>
                  </div>
                  <Button className="w-full" size="sm" onClick={() => saveMovie(r)}>Save</Button>
                </div>
              ))}
              {!searching && results.length === 0 && query && (
                <div className="opacity-60 col-span-full text-center py-4">No results.</div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
