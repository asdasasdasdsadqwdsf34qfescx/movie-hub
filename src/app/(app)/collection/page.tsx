"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Trash2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

const GENRES = [
  "Drama","Fantasy","Horror","Comedy","Romance","Sci-Fi","Thriller","Adventure","Short","Action","Animation","Family",
] as const;

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
  const [loadingMovies, setLoadingMovies] = useState(true);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<OmdbSearchItem[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const { theme } = useTheme();

  const [filterGenre, setFilterGenre] = useState<string>("");
  const [filterYear, setFilterYear] = useState<string>("");
  const [filterRating, setFilterRating] = useState<string>("");
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => String(currentYear - i));

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
    return () => {
      mounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    setLoadingMovies(true);
    (async () => {
      let q = supabase
        .from("movies")
        .select(
          "id, created_at, name, poster, watchedCount, genres, year, runtime, isFavorite, watchedDates, userId, imdbRating, imdbVotes, released"
        )
        .eq("userId", userId);

      if (filterGenre) {
        q = q.contains("genres", [filterGenre]);
      }
      if (filterYear) {
        const yr = parseInt(filterYear, 10);
        if (Number.isFinite(yr)) q = q.eq("year", yr);
      }
      if (filterRating) {
        const r = parseFloat(filterRating);
        if (Number.isFinite(r)) q = q.gte("imdbRating", r);
      }

      const { data, error } = await q.order("created_at", { ascending: false });
      if (!active) return;
      if (error) {
        setMovies([]);
      } else {
        setMovies((data as MovieRow[]) ?? []);
      }
      setLoadingMovies(false);
    })();
    return () => {
      active = false;
    };
  }, [userId, filterGenre, filterYear, filterRating]);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const id = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      try {
        setSearching(true);
        const res = await fetch(
          `/api/omdb/search?s=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );
        const json = await res.json();
        setResults(Array.isArray(json.Search) ? json.Search.slice(0, 12) : []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => {
      clearTimeout(id);
      controller.abort();
    };
  }, [query, open]);

  const saveMovie = async (m: OmdbSearchItem) => {
    if (!userId) return;
    try {
      const detailsRes = await fetch(`/api/omdb/byid?i=${m.imdbID}`);
      const details = await detailsRes.json();
      const posterUrl =
        details.Poster && details.Poster !== "N/A"
          ? details.Poster
          : m.Poster && m.Poster !== "N/A"
          ? m.Poster
          : null;
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
      const releasedStr: string | null =
        typeof details.Released === "string" && details.Released !== "N/A"
          ? new Date(details.Released).toISOString().slice(0, 10)
          : null;
      const yearNum: number | null = toNumber(details.Year ?? m.Year ?? null);
      const runtimeNum: number | null = toNumber(details.Runtime);
      const genresArr: string[] | null =
        typeof details.Genre === "string" && details.Genre !== "N/A"
          ? details.Genre.split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
          : null;
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
        .select(
          "id, created_at, name, poster, watchedCount, genres, year, runtime, isFavorite, watchedDates, userId, imdbRating, imdbVotes, released"
        )
        .eq("userId", userId)
        .order("created_at", { ascending: false });
      setMovies((data as MovieRow[]) ?? []);
    } catch {
      // ignore
    }
  };

  const deleteMovie = async (id?: number) => {
    if (!id || !userId) return;
    try {
      setDeletingId(id);
      const { error } = await supabase
        .from("movies")
        .delete()
        .eq("id", id)
        .eq("userId", userId);
      if (error) throw error;
      setMovies((prev) => prev.filter((m) => m.id !== id));
    } catch {
      // ignore
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full min-h-screen pl-2 py-4 sm:pl-4 sm:pr-12 lg:pl-6 lg:pr-16 overflow-x-hidden">

      <motion.div 
        className={`mb-4 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-neutral-50 border-neutral-200'} p-4 sm:p-5`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 min-w-0">
          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            size={1}
            className={`min-w-0 w-full px-4 py-3 sm:py-2.5 rounded-lg border text-base sm:text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${theme === 'dark' ? 'bg-neutral-900 text-white border-neutral-700 hover:border-neutral-600 focus:ring-neutral-500 focus:ring-offset-neutral-900' : 'bg-white text-neutral-800 border-neutral-300 hover:border-neutral-400 focus:ring-blue-500 focus:ring-offset-white'}`}
            style={{ maxHeight: '200px', overflowY: 'auto' }}
          >
            <option value="">All Genres</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            size={1}
            className={`min-w-0 w-full px-4 py-3 sm:py-2.5 rounded-lg border text-base sm:text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${theme === 'dark' ? 'bg-neutral-900 text-white border-neutral-700 hover:border-neutral-600 focus:ring-neutral-500 focus:ring-offset-neutral-900' : 'bg-white text-neutral-800 border-neutral-300 hover:border-neutral-400 focus:ring-blue-500 focus:ring-offset-white'}`}
            style={{ maxHeight: '200px', overflowY: 'auto' }}
          >
            <option value="">Select Year</option>
            {yearOptions.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            size={1}
            className={`min-w-0 w-full px-4 py-3 sm:py-2.5 rounded-lg border text-base sm:text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${theme === 'dark' ? 'bg-neutral-900 text-white border-neutral-700 hover:border-neutral-600 focus:ring-neutral-500 focus:ring-offset-neutral-900' : 'bg-white text-neutral-800 border-neutral-300 hover:border-neutral-400 focus:ring-blue-500 focus:ring-offset-white'}`}
            style={{ maxHeight: '200px', overflowY: 'auto' }}
          >
            <option value="">All Ratings</option>
            {Array.from({ length: 10 }, (_, i) => String(i + 1)).map((r) => (
              <option key={r} value={r}>≥ {r}.0</option>
            ))}
          </select>
          <div className="sm:col-span-2 lg:col-span-1">
            <Button
              variant="outline"
              onClick={() => { setFilterGenre(""); setFilterYear(""); setFilterRating(""); }}
              className={`${theme === 'dark' ? 'border-neutral-700 hover:bg-neutral-800 text-white' : 'border-neutral-300 hover:bg-neutral-100 text-neutral-800'} w-full h-12 sm:h-10 text-base sm:text-sm font-medium transition-colors`}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="grid w-full max-w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Add New Card */}
        <motion.div
          onClick={() => setOpen(true)}
          className={`min-w-0 max-w-full p-0 rounded-2xl bg-white/5 backdrop-blur-sm border border-neutral-700/70 hover:bg-white/10 overflow-hidden cursor-pointer border-dashed border-2 hover:border-neutral-600 ${
            theme === "dark" ? "text-white" : ""
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ 
            y: -8,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="h-48 sm:h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl sm:text-6xl opacity-50 mb-2">+</div>
            </div>
          </div>
          <div className="p-3 sm:p-4">
            <p className="opacity-60 text-xs sm:text-sm text-center">
              Click to add a movie
            </p>
          </div>
        </motion.div>
        {loadingMovies && (
          <>
            {[0,1,2,3,4,5,6].map((i) => (
              <div
                key={`skeleton-${i}`}
                className={`min-w-0 max-w-full p-0 rounded-2xl border overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-neutral-50 border-neutral-200'} ${i < 2 ? '' : i < 4 ? 'hidden sm:block' : i < 6 ? 'hidden md:block' : 'hidden lg:block'}`}
                aria-hidden
              >
                <div className={`${theme === 'dark' ? 'bg-white/10' : 'bg-neutral-200'} w-full h-48 sm:h-64 animate-pulse`} />
                <div className="p-3 sm:p-4">
                  <div className={`${theme === 'dark' ? 'bg-white/10' : 'bg-neutral-200'} h-5 sm:h-6 w-3/4 rounded mb-2 animate-pulse`} />
                  <div className={`${theme === 'dark' ? 'bg-white/10' : 'bg-neutral-200'} h-4 w-1/2 rounded animate-pulse`} />
                </div>
              </div>
            ))}
          </>
        )}
        {!loadingMovies && movies.map((m, index) => (
          <motion.div
            key={m.id}
            className={`relative group min-w-0 max-w-full p-0 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 overflow-hidden ${
              theme === "dark" ? "text-white" : ""
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: 0.4 + (index * 0.1),
              ease: "easeOut"
            }}
            whileHover={{ 
              y: -8,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={() => {
                if (typeof m.id === "number") {
                  setPendingDelete({ id: m.id, name: m.name });
                  setConfirmOpen(true);
                }
              }}
              disabled={deletingId === m.id}
              className="absolute top-2 right-2 z-10 inline-flex items-center justify-center w-9 h-9 rounded-full bg-neutral-800/80 hover:bg-neutral-700/80 backdrop-blur-md border border-neutral-600/60 text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label="Delete movie"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            {m.poster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={m.poster}
                alt={m.name}
                className="w-full h-48 sm:h-64 object-cover"
              />
            ) : (
              <div className="h-48 sm:h-64 flex items-center justify-center text-xl sm:text-2xl opacity-50">
                No Image
              </div>
            )}
            <div className="p-3 sm:p-4">
              <h3 className="text-lg sm:text-xl font-semibold mb-1 line-clamp-2 break-words">
                {m.name}
              </h3>
              <p className="opacity-60 text-xs sm:text-sm truncate">
                {m.year ?? ""}
                {m.runtime ? ` • ${m.runtime} min` : ""}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {open && (
          <Dialog
            open={open}
            onOpenChange={(isOpen) => {
              setOpen(isOpen);
              if (!isOpen) {
                setQuery("");
                setResults([]);
              }
            }}
          >
            <DialogContent
              className={`max-w-[95vw] sm:max-w-[600px] lg:max-w-[900px] xl:max-w-[1200px] max-h-[calc(100vh-100px)] sm:max-h-[calc(100vh-200px)] overflow-hidden ${
                theme === "dark"
                  ? "bg-neutral-900 border-neutral-700 text-white"
                  : "bg-white border-neutral-200 text-neutral-900"
              }`}
            >
          <DialogHeader className="shrink-0">
            <DialogTitle
              className={theme === "dark" ? "text-white" : "text-neutral-900"}
            >
              Add a movie
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 flex-1 overflow-hidden">
            <Input
              placeholder="Search movies"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`shrink-0 ${
                theme === "dark"
                  ? "bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-neutral-500 focus:ring-neutral-500/20"
                  : "bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-500 focus:border-blue-500 focus:ring-blue-500/20"
              }`}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 max-h-[calc(80vh-100px)] sm:max-h-[calc(90vh-200px)] overflow-y-auto pr-2">
              {searching && (
                <div className="opacity-60 col-span-full text-center py-4">
                  Searching…
                </div>
              )}
              {!searching &&
                results.map((r, idx) => (
                  <motion.div
                    key={`${r.imdbID}-${idx}`}
                    className={`flex flex-col gap-3 p-3 rounded-lg border transition ${
                      theme === "dark"
                        ? "bg-white/5 border-white/10 hover:bg-white/10"
                        : "bg-neutral-50 border-neutral-200 hover:bg-neutral-100"
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: idx * 0.05,
                      ease: "easeOut"
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {r.Poster && r.Poster !== "N/A" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={r.Poster}
                        alt={r.Title}
                        className="w-full h-48 sm:h-40 lg:h-44 xl:h-48 object-cover rounded"
                      />
                    ) : (
                      <div
                        className={`w-full h-48 sm:h-40 lg:h-44 xl:h-48 rounded flex items-center justify-center text-xs opacity-60 ${
                          theme === "dark" ? "bg-white/10" : "bg-neutral-200"
                        }`}
                      >
                        No Image
                      </div>
                    )}
                    <div className="flex-1 min-h-0">
                      <div className="font-medium leading-5 line-clamp-2 mb-1">
                        {r.Title}
                      </div>
                      <div className="text-xs opacity-60">{r.Year ?? ""}</div>
                    </div>
                    <Button
                      className={`w-full rounded-lg ${
                        theme === "dark"
                          ? "bg-neutral-700 hover:bg-neutral-600 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                      size="sm"
                      onClick={() => saveMovie(r)}
                    >
                      Save
                    </Button>
                  </motion.div>
                ))}
              {!searching && results.length === 0 && query && (
                <div className="opacity-60 col-span-full text-center py-4">
                  No results.
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmOpen && (
          <Dialog
            open={confirmOpen}
            onOpenChange={(v) => {
              if (!v) {
                setConfirmOpen(false);
                setPendingDelete(null);
              }
            }}
          >
        <DialogContent
          className={`max-w-md ${
            theme === "dark"
              ? "bg-neutral-900 border-neutral-700 text-white"
              : "bg-white border-neutral-200 text-neutral-900"
          }`}
        >
          <DialogHeader>
            <DialogTitle
              className={theme === "dark" ? "text-white" : "text-neutral-900"}
            >
              Delete movie
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p
              className={`text-sm ${
                theme === "dark" ? "text-neutral-300" : "text-neutral-600"
              }`}
            >
              Are you sure you want to delete{" "}
              <span className="font-semibold">&ldquo;{pendingDelete?.name}&rdquo;</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setConfirmOpen(false);
                  setPendingDelete(null);
                }}
                className={`rounded-lg ${
                  theme === "dark"
                    ? "border-neutral-600 text-neutral-300 hover:bg-neutral-800"
                    : "border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  const id = pendingDelete?.id;
                  await deleteMovie(id);
                  setConfirmOpen(false);
                  setPendingDelete(null);
                }}
                disabled={deletingId === pendingDelete?.id}
                className="rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                {deletingId === pendingDelete?.id ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
