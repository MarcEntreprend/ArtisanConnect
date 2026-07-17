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
        <button
          className={`artisan-fav ${fav ? "active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            setFav(!fav);
          }}
          aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart size={18} fill={fav ? "currentColor" : "none"} />
        </button>
        {artisan.available_today && (
          <span className="artisan-availability">
            <span className="availability-dot" />
            Disponible aujourd'hui
          </span>
        )}
      </div>
      <div className="artisan-card-body">
        <div className="artisan-card-top">
          <div>
            <div className="artisan-name">{artisan.name}</div>
            <div className="artisan-category">
              {category?.icon} {category?.label || "Artisan"} ·{" "}
              {artisan.city || "—"}
            </div>
          </div>
          <div className="artisan-rating">
            <Star size={15} fill="var(--star)" />
            {artisan.rating.toFixed(1)}
            <span className="count">({artisan.reviews_count})</span>
          </div>
        </div>
        <div className="artisan-card-meta">
          <span className="artisan-location">
            <MapPin size={14} />—
          </span>
          <span className="artisan-price mono-num">
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
      <div>
        {/* Métier */}
        <div className="filter-block">
          <h3>Métier</h3>
          <div id="filterCategories">
            {CATEGORIES.map((c) => (
              <label key={c.slug} className="filter-check">
                <input
                  type="checkbox"
                  checked={selectedCategories.has(c.slug)}
                  onChange={(e) => {
                    const next = new Set(selectedCategories);
                    e.target.checked ? next.add(c.slug) : next.delete(c.slug);
                    setSelectedCategories(next);
                  }}
                />
                {c.icon} {c.label}
              </label>
            ))}
          </div>
        </div>

        {/* Ville */}
        {cities.length > 0 && (
          <div className="filter-block">
            <h3>Ville</h3>
            <div id="filterCities">
              {cities.map((city) => (
                <label key={city} className="filter-check">
                  <input
                    type="checkbox"
                    checked={selectedCities.has(city)}
                    onChange={(e) => {
                      const next = new Set(selectedCities);
                      e.target.checked ? next.add(city) : next.delete(city);
                      setSelectedCities(next);
                    }}
                  />
                  {city}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Note minimale */}
        <div className="filter-block">
          <h3>Note minimale</h3>
          <div id="filterRating">
            {([0, 4, 4.5] as const).map((r, i) => (
              <label key={r} className="filter-check">
                <input
                  type="radio"
                  name="rating"
                  value={r}
                  checked={minRating === r}
                  onChange={() => setMinRating(r)}
                />
                {r === 0 ? "Toutes les notes" : `${r} et plus`}
              </label>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className="filter-block">
          <h3>Budget max</h3>
          <input
            type="range"
            className="filter-range"
            id="filterPrice"
            min="0"
            max="65000"
            step="1000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
          <div className="filter-range-value">
            <span>0 G</span>
            <span id="filterPriceValue">
              {maxPrice.toLocaleString("fr-FR")} G
            </span>
          </div>
        </div>

        {/* Disponible aujourd'hui */}
        <div className="filter-block">
          <label className="filter-check">
            <input
              type="checkbox"
              id="filterAvailableToday"
              checked={availableToday}
              onChange={(e) => setAvailableToday(e.target.checked)}
            />
            Disponible aujourd'hui uniquement
          </label>
        </div>

        <button className="filter-reset" onClick={resetFilters}>
          Réinitialiser les filtres
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 animate-fade-in-up">
      {/* ─── En-tête + barre de recherche ─── */}
      <div className="page-header">
        <h1>Trouver un artisan</h1>

        <p className="text-(--ink-faint) text-sm mb-6">
          {artisans.length > 0
            ? `${artisans.length} artisans certifiés en Haïti`
            : "Découvrez les talents locaux"}
        </p>

        <div className="search-container max-w-2xl">
          <div className="search-box">
            <SearchIcon size={19} className="search-icon" />
            <input
              type="search"
              className="search-input"
              placeholder="Un métier, une ville, un nom d'artisan…"
              maxLength={50}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-(--ink-faint) hover:text-(--ink) transition-colors shrink-0"
                aria-label="Effacer la recherche"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Layout 2 colonnes ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-[256px_1fr] gap-8">
        {/* Sidebar filtres desktop */}
        <aside className="hidden lg:block self-start sticky top-24">
          <div className="filter-panel">
            <div className="flex items-center justify-between mb-2">
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
          <div className="search-toolbar">
            <p className="search-toolbar-count">
              <strong>{filtered.length}</strong> artisans trouvés
              {query && (
                <span className="text-(--ink-faint)"> pour « {query} »</span>
              )}
            </p>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="sort-select"
              >
                <option value="pertinence">Pertinence</option>
                <option value="rating">Meilleure note</option>
                <option value="price-asc">Prix croissant</option>
              </select>
              <ChevronDown
                size={14}
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
            <div className="empty-state">
              <div className="empty-state-icon">
                <SearchIcon size={28} />
              </div>
              <h3>Aucun résultat</h3>
              <p>
                Essayez d'élargir vos filtres ou de rechercher un autre métier.
              </p>
              <button onClick={resetFilters} className="btn btn-outline">
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
