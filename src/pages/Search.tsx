// src/pages/Search.tsx
import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search as SearchIcon,
  Star,
  MapPin,
  Heart,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { CATEGORIES } from "../lib/constants";
import type { Artisan } from "../lib/types";

type SortKey = "pertinence" | "rating" | "price-asc";

function formatPrice(amount: number | null, currency: string) {
  if (!amount) return "Sur devis";
  return `dès ${amount.toLocaleString("fr-FR")} ${currency}`;
}

/* ─── Carte inline (réutilise les classes CSS globales) ─── */
function ResultCard({ artisan, index }: { artisan: Artisan; index: number }) {
  const category = CATEGORIES.find((c) => c.id === artisan.category_id);
  const [fav, setFav] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          obs.disconnect();
        }
      },
      { threshold: 0.06 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Link
      ref={ref}
      to={`/artisan/${artisan.id}`}
      className="artisan-card"
      style={{
        opacity: 0,
        transform: "translateY(20px)",
        transition: `opacity 0.5s cubic-bezier(0.32,0.72,0,1) ${index * 0.055}s, transform 0.5s cubic-bezier(0.32,0.72,0,1) ${index * 0.055}s`,
      }}
    >
      <div className="artisan-card-media">
        <img
          src={
            artisan.avatar_url ||
            "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=450&fit=crop"
          }
          alt={artisan.name}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />

        {artisan.available_today && (
          <span className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-(--forest) text-white text-[10px] font-extrabold uppercase tracking-widest shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Dispo
          </span>
        )}

        <button
          className={`
            absolute top-3 right-3 w-8 h-8 rounded-full
            bg-white/80 backdrop-blur-sm shadow-sm
            flex items-center justify-center
            transition-all duration-300
            ${fav ? "text-(--danger) scale-110" : "text-(--ink-faint) hover:text-(--danger) hover:scale-105"}
          `}
          onClick={(e) => {
            e.preventDefault();
            setFav(!fav);
          }}
        >
          <Heart
            size={13}
            fill={fav ? "currentColor" : "none"}
            strokeWidth={2}
          />
        </button>

        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-[11px] font-bold">
          <Star size={10} fill="currentColor" className="text-(--star)" />
          {artisan.rating.toFixed(1)}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-(--accent)">
            {category?.icon} {category?.label || "Artisan"}
          </span>
          <h3 className="mt-0.5 font-bold text-(--ink) text-[0.92rem] leading-snug line-clamp-1">
            {artisan.name}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-[11px] text-(--ink-faint)">
            <MapPin size={11} strokeWidth={2} />
            {artisan.city || "Haïti"}
          </p>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-(--border)">
          <span className="text-[11px] text-(--ink-faint)">
            {artisan.reviews_count} avis
          </span>
          <span className="mono-num text-[0.82rem] font-bold text-(--ink)">
            {formatPrice(artisan.price_from, artisan.currency)}
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ─── Skeleton ─── */
function SkeletonCard() {
  return (
    <div className="rounded-(--r-lg) border border-(--border) bg-(--bg-elevated) overflow-hidden">
      <div className="skeleton aspect-4/3" />
      <div className="p-4 space-y-2.5">
        <div className="skeleton h-2.5 w-1/3 rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
        <div className="skeleton h-2.5 w-1/2 rounded" />
      </div>
    </div>
  );
}

export default function Search() {
  const [searchParams] = useSearchParams();
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [selectedCities, setSelectedCities] = useState<Set<string>>(new Set());
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(65000);
  const [availableToday, setAvailableToday] = useState(false);
  const [sort, setSort] = useState<SortKey>("pertinence");
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile drawer

  useEffect(() => {
    supabase
      .from("artisans")
      .select("*")
      .eq("status", "actif")
      .then(({ data, error }) => {
        if (!error && data) setArtisans(data as Artisan[]);
        setLoading(false);
      });
  }, []);

  const cities = useMemo(
    () => [...new Set(artisans.map((a) => a.city).filter(Boolean))].sort(),
    [artisans],
  );

  const filtered = useMemo(() => {
    let res = [...artisans];
    if (selectedCategories.size)
      res = res.filter((a) =>
        selectedCategories.has(
          CATEGORIES.find((c) => c.id === a.category_id)?.slug || "",
        ),
      );
    if (selectedCities.size)
      res = res.filter((a) => selectedCities.has(a.city));
    if (minRating) res = res.filter((a) => a.rating >= minRating);
    if (maxPrice < 65000)
      res = res.filter((a) => (a.price_from || 0) <= maxPrice);
    if (availableToday) res = res.filter((a) => a.available_today);
    if (query) {
      const q = query.toLowerCase();
      res = res.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q),
      );
    }
    if (sort === "rating") res.sort((a, b) => b.rating - a.rating);
    if (sort === "price-asc")
      res.sort((a, b) => (a.price_from || 0) - (b.price_from || 0));
    return res;
  }, [
    artisans,
    selectedCategories,
    selectedCities,
    minRating,
    maxPrice,
    availableToday,
    query,
    sort,
  ]);

  function resetFilters() {
    setSelectedCategories(new Set());
    setSelectedCities(new Set());
    setMinRating(0);
    setMaxPrice(65000);
    setAvailableToday(false);
    setQuery("");
    setSort("pertinence");
  }

  const activeFilterCount =
    selectedCategories.size +
    selectedCities.size +
    (minRating > 0 ? 1 : 0) +
    (maxPrice < 65000 ? 1 : 0) +
    (availableToday ? 1 : 0);

  /* ─── Panneau filtres (commun desktop sidebar / mobile drawer) ─── */
  function FiltersPane() {
    return (
      <div className="space-y-6">
        {/* Métier */}
        <div>
          <h3 className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-(--ink-faint) mb-3">
            Métier
          </h3>
          <div className="space-y-1.5">
            {CATEGORIES.map((c) => (
              <label
                key={c.slug}
                className="flex items-center gap-2.5 py-1 text-sm text-(--ink-soft) hover:text-(--ink) cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.has(c.slug)}
                  onChange={(e) => {
                    const next = new Set(selectedCategories);
                    e.target.checked ? next.add(c.slug) : next.delete(c.slug);
                    setSelectedCategories(next);
                  }}
                  className="accent-(--accent) w-3.5 h-3.5"
                />
                <span>
                  {c.icon} {c.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Ville */}
        {cities.length > 0 && (
          <div className="border-t border-(--border) pt-5">
            <h3 className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-(--ink-faint) mb-3">
              Ville
            </h3>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {cities.map((city) => (
                <label
                  key={city}
                  className="flex items-center gap-2.5 py-1 text-sm text-(--ink-soft) hover:text-(--ink) cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedCities.has(city)}
                    onChange={(e) => {
                      const next = new Set(selectedCities);
                      e.target.checked ? next.add(city) : next.delete(city);
                      setSelectedCities(next);
                    }}
                    className="accent-(--accent) w-3.5 h-3.5"
                  />
                  {city}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Note minimale */}
        <div className="border-t border-(--border) pt-5">
          <h3 className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-(--ink-faint) mb-3">
            Note minimale
          </h3>
          <div className="space-y-1.5">
            {([0, 4, 4.5] as const).map((r) => (
              <label
                key={r}
                className="flex items-center gap-2.5 py-1 text-sm text-(--ink-soft) hover:text-(--ink) cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === r}
                  onChange={() => setMinRating(r)}
                  className="accent-(--accent) w-3.5 h-3.5"
                />
                {r === 0 ? (
                  "Toutes les notes"
                ) : (
                  <span className="flex items-center gap-1">
                    {r}&thinsp;
                    <Star
                      size={11}
                      fill="currentColor"
                      className="text-(--star)"
                    />{" "}
                    et plus
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className="border-t border-(--border) pt-5">
          <h3 className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-(--ink-faint) mb-3">
            Budget max
          </h3>
          <input
            type="range"
            min="0"
            max="65000"
            step="1000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-(--accent) bg-(--bg-sunken)"
          />
          <div className="flex justify-between text-xs font-mono mt-2 text-(--ink-faint)">
            <span>0 G</span>
            <span className="font-bold text-(--accent)">
              {maxPrice.toLocaleString("fr-FR")} G
            </span>
          </div>
        </div>

        {/* Disponible aujourd'hui */}
        <div className="border-t border-(--border) pt-5">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              className={`
              w-10 h-5 rounded-full relative transition-all duration-300 shrink-0
              ${availableToday ? "bg-(--forest)" : "bg-(--border-strong)"}
            `}
              onClick={() => setAvailableToday(!availableToday)}
            >
              <div
                className={`
                absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm
                transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
                ${availableToday ? "left-5" : "left-0.5"}
              `}
              />
            </div>
            <span className="text-sm font-semibold text-(--ink-soft) group-hover:text-(--ink) transition-colors">
              Disponible aujourd'hui
            </span>
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 animate-fade-in-up">
      {/* ─── En-tête + barre de recherche ─── */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-(--ink) mb-1">
          Trouver un artisan
        </h1>
        <p className="text-(--ink-faint) text-sm mb-6">
          {artisans.length > 0
            ? `${artisans.length} artisans certifiés en Haïti`
            : "Découvrez les talents locaux"}
        </p>

        {/* Double-bezel search */}
        <div className="p-1.5 rounded-(--r-pill) bg-(--bg-elevated) border border-(--border) shadow-(--shadow-md) max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 pl-4">
              <SearchIcon
                size={17}
                strokeWidth={2}
                className="text-(--ink-faint) shrink-0"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Un électricien à Pétion-Ville, une couturière…"
                className="flex-1 bg-transparent text-sm text-(--ink) placeholder-(--ink-faint) outline-none py-1.5"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-(--ink-faint) hover:text-(--ink) transition-colors"
                >
                  <X size={15} />
                </button>
              )}
            </div>
            {/* Bouton filtres mobile (visible < lg) */}
            <button
              onClick={() => setFiltersOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-(--bg-sunken) text-(--ink-soft) text-xs font-bold transition-colors hover:bg-(--border) mr-1 shrink-0"
            >
              <SlidersHorizontal size={14} strokeWidth={2} />
              Filtres
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-(--accent) text-white text-[9px] flex items-center justify-center font-extrabold ml-0.5">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Layout 2 colonnes ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-[256px_1fr] gap-8">
        {/* Sidebar filtres desktop */}
        <aside className="hidden lg:block self-start sticky top-24">
          <div className="bg-(--bg-elevated) border border-(--border) rounded-(--r-lg) p-5 shadow-(--shadow-sm)">
            <div className="flex items-center justify-between mb-5">
              <span className="font-extrabold text-sm text-(--ink) flex items-center gap-2">
                <SlidersHorizontal size={15} strokeWidth={2} />
                Filtres
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-(--accent) text-white text-[10px] flex items-center justify-center font-extrabold">
                    {activeFilterCount}
                  </span>
                )}
              </span>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] font-bold text-(--accent) hover:text-(--accent-strong) transition-colors"
                >
                  Tout effacer
                </button>
              )}
            </div>
            <FiltersPane />
          </div>
        </aside>

        {/* Résultats */}
        <div>
          {/* Toolbar tri */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <p className="text-sm text-(--ink-soft)">
              <strong className="text-(--ink) font-extrabold">
                {filtered.length}
              </strong>{" "}
              artisan{filtered.length > 1 ? "s" : ""}
              {query && (
                <span className="text-(--ink-faint)">
                  {" "}
                  pour « {query} »
                </span>
              )}
            </p>

            {/* Select tri custom */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="
                  appearance-none pl-4 pr-8 py-2 rounded-full
                  border border-(--border) bg-(--bg-elevated)
                  text-xs font-bold text-(--ink-soft)
                  focus:outline-none focus:ring-2 focus:ring-(--accent)
                  cursor-pointer
                "
              >
                <option value="pertinence">Pertinence</option>
                <option value="rating">Meilleure note</option>
                <option value="price-asc">Prix croissant</option>
              </select>
              <ChevronDown
                size={13}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-(--ink-faint) pointer-events-none"
              />
            </div>
          </div>

          {/* Grille */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center text-center py-20 rounded-(--r-lg) border border-dashed border-(--border-strong) bg-(--bg-elevated)/50">
              <div className="w-16 h-16 rounded-full bg-(--bg-sunken) flex items-center justify-center text-2xl mb-4">
                🔍
              </div>
              <h3 className="font-bold text-lg text-(--ink)">
                Aucun résultat
              </h3>
              <p className="text-sm text-(--ink-soft) mt-1 max-w-xs">
                Essayez d'élargir vos filtres ou modifiez votre recherche.
              </p>
              <button onClick={resetFilters} className="btn btn-outline mt-6">
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((artisan, i) => (
                <ResultCard key={artisan.id} artisan={artisan} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── Drawer filtres mobile ─── */}
      {filtersOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setFiltersOpen(false)}
          />
          <div
            className="
              fixed bottom-0 left-0 right-0 z-50 lg:hidden
              bg-(--bg-elevated) rounded-t-(--r-xl)
              border-t border-(--border)
              shadow-(--shadow-lg)
              max-h-[85dvh] overflow-y-auto
            "
            style={{
              animation: "fadeUp 0.35s cubic-bezier(0.32,0.72,0,1) both",
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-(--border-strong)" />
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-b border-(--border)">
              <span className="font-extrabold text-(--ink)">Filtres</span>
              <button
                onClick={() => setFiltersOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-(--bg-sunken) transition-colors"
              >
                <X size={17} />
              </button>
            </div>
            <div className="p-5 pb-8">
              <FiltersPane />
              <div className="flex gap-3 mt-8">
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => {
                      resetFilters();
                      setFiltersOpen(false);
                    }}
                    className="btn btn-ghost flex-1"
                  >
                    Effacer tout
                  </button>
                )}
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="btn btn-primary flex-1"
                >
                  Voir {filtered.length} résultat
                  {filtered.length > 1 ? "s" : ""}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
