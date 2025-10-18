"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import Image from "next/image";
import { useSidebar } from "@/contexts/SidebarContext";

interface MovieRow {
  id?: number;
  name: string;
  poster: string | null;
  userId: string;
  isFavorite?: boolean | null;
  wantWatch?: boolean | null;
  year?: number | null;
  runtime?: number | null;
  imdbRating?: number | null;
}

const Home = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<MovieRow[]>([]);
  const [watchlist, setWatchlist] = useState<MovieRow[]>([]);
  const [loading, setLoading] = useState(true);

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
    setLoading(true);
    (async () => {
      try {
        const [favRes, wwRes] = await Promise.all([
          supabase
            .from("movies")
            .select(
              "id, name, poster, userId, isFavorite, wantWatch, year, runtime, imdbRating"
            )
            .eq("userId", userId)
            .eq("isFavorite", true)
            .order("created_at", { ascending: false }),
          supabase
            .from("movies")
            .select(
              "id, name, poster, userId, isFavorite, wantWatch, year, runtime, imdbRating"
            )
            .eq("userId", userId)
            .eq("wantWatch", true)
            .order("created_at", { ascending: false }),
        ]);
        if (!active) return;
        setFavorites((favRes.data as MovieRow[]) || []);
        setWatchlist((wwRes.data as MovieRow[]) || []);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [userId]);

const Row = React.memo(({ title, items }: { title: string; items: MovieRow[] }) => {
    const { expanded } = useSidebar();
    
    if (!items.length) return null;
    
    const renderCard = useCallback((m: MovieRow, key: string | number) => (
      <div
        key={key}
        className="min-w-[160px] max-w-[160px] rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 overflow-hidden"
      >
        <div className="relative w-[160px] h-[220px] bg-black/20">
          {m.poster ? (
            <Image src={m.poster} alt={m.name} fill sizes="160px" className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs opacity-60">No poster</div>
          )}
        </div>
        <div className="p-2">
          <div className="text-sm font-medium line-clamp-2">{m.name}</div>
          <div className="text-xs opacity-60 mt-1">
            {m.year ?? ""}
            {m.runtime ? ` • ${m.runtime} min` : ""}
            {typeof m.imdbRating === "number" ? ` • IMDb ${m.imdbRating.toFixed(1)}` : ""}
          </div>
        </div>
      </div>
    ), []);

    const isSingle = useMemo(() => items.length === 1, [items.length]);
    
    const content = useMemo(() => 
      items.length > 1 ? [...items, ...items] : items, 
      [items]
    );
    
    const leftPad = useMemo(() => 
      expanded ? "lg:pl-[280px]" : "lg:pl-[136px]", 
      [expanded]
    );

    return (
      <div>
        <h2 className={`text-xl font-semibold ${leftPad}`}>{title}</h2>
        <div className="relative">
          {isSingle ? (
            <div className={`${leftPad} pb-2`}>
              {renderCard(items[0], items[0].id ?? items[0].name)}
            </div>
          ) : (
            <div className={`auto-marquee ${leftPad}`}>
              <div className="auto-marquee__inner gap-3 pb-2">
                {content.map((m, idx) =>
                  renderCard(m, `${m.id ?? idx}-${idx}`)
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  });

  return (
   <div className="pt-4 mx-auto">
      {loading ? (
        <div className="opacity-60">Loading…</div>
      ) : (
        <>
          <Row title="Favorites" items={favorites} />
          <Row title="Want to Watch" items={watchlist} />
        </>
      )}
    </div>
  );
};
export default Home;
