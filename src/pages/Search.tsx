// src/pages/Search.tsx

import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search as SearchIcon, Star } from "lucide-react";
import { supabase } from "../lib/supabase";
import { CATEGORIES } from "../lib/constants";
import type { Artisan } from "../lib/types";

type SortKey = "pertinence" | "rating" | "price-asc" | "distance";

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
    let results = artisans;
    if (selectedCategories.size)
      results = results.filter((a) =>
        selectedCategories.has(
          CATEGORIES.find((c) => c.id === a.category_id)?.slug || "",
        ),
      );
    if (selectedCities.size)
      results = results.filter((a) => selectedCities.has(a.city));
    if (minRating) results = results.filter((a) => a.rating >= minRating);
    if (maxPrice < 65000)
      results = results.filter((a) => (a.price_from || 0) <= maxPrice);
    if (availableToday) results = results.filter((a) => a.available_today);
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q),
      );
    }
    if (sort === "rating") results.sort((a, b) => b.rating - a.rating);
    else if (sort === "price-asc")
      results.sort((a, b) => (a.price_from || 0) - (b.price_from || 0));
    return results;
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold">Trouver un artisan</h1>
      <div className="mt-4 max-w-xl relative">
        <SearchIcon
          className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint"
          size={20}
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Un métier, une ville, un nom d'artisan…"
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-bg-elevated text-sm"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 mt-8">
        {/* Filters */}
        <aside className="bg-bg-elevated border border-border rounded-2xl p-5 sticky top-24 self-start">
          {/* Categories */}
          <div className="pb-4 border-b border-border">
            <h3 className="font-bold text-sm mb-2">Métier</h3>
            {CATEGORIES.map((c) => (
              <label
                key={c.slug}
                className="flex items-center gap-2 py-1 text-sm text-ink-soft cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.has(c.slug)}
                  onChange={(e) => {
                    const next = new Set(selectedCategories);
                    e.target.checked ? next.add(c.slug) : next.delete(c.slug);
                    setSelectedCategories(next);
                  }}
                  className="accent-[var(--color-accent)]"
                />
                {c.label}
              </label>
            ))}
          </div>

          {/* Cities */}
          <div className="py-4 border-b border-border">
            <h3 className="font-bold text-sm mb-2">Ville</h3>
            {cities.map((city) => (
              <label
                key={city}
                className="flex items-center gap-2 py-1 text-sm text-ink-soft cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCities.has(city)}
                  onChange={(e) => {
                    const next = new Set(selectedCities);
                    e.target.checked ? next.add(city) : next.delete(city);
                    setSelectedCities(next);
                  }}
                  className="accent-[var(--color-accent)]"
                />
                {city}
              </label>
            ))}
          </div>

          {/* Rating */}
          <div className="py-4 border-b border-border">
            <h3 className="font-bold text-sm mb-2">Note minimale</h3>
            {[0, 4, 4.5].map((r) => (
              <label
                key={r}
                className="flex items-center gap-2 py-1 text-sm text-ink-soft cursor-pointer"
              >
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === r}
                  onChange={() => setMinRating(r)}
                  className="accent-[var(--color-accent)]"
                />
                {r === 0 ? "Toutes les notes" : `${r} et plus`}
              </label>
            ))}
          </div>

          {/* Price */}
          <div className="py-4 border-b border-border">
            <h3 className="font-bold text-sm mb-2">Budget max</h3>
            <input
              type="range"
              min="0"
              max="65000"
              step="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[var(--color-accent)]"
            />
            <div className="flex justify-between text-xs text-ink-faint font-mono mt-1">
              <span>0 G</span>
              <span>{maxPrice.toLocaleString("fr-FR")} G</span>
            </div>
          </div>

          {/* Available today */}
          <div className="py-4">
            <label className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer">
              <input
                type="checkbox"
                checked={availableToday}
                onChange={(e) => setAvailableToday(e.target.checked)}
                className="accent-[var(--color-accent)]"
              />
              Disponible aujourd'hui uniquement
            </label>
          </div>

          <button
            onClick={resetFilters}
            className="w-full text-center text-xs font-semibold text-ink-faint hover:text-red-500 transition-colors mt-2"
          >
            Réinitialiser les filtres
          </button>
        </aside>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
            <p className="text-sm text-ink-soft">
              <strong className="text-[var(--color-ink)]">
                {filtered.length}
              </strong>{" "}
              artisans trouvés
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="px-3 py-2 rounded-full border border-border bg-bg-elevated text-sm font-semibold"
            >
              <option value="pertinence">Pertinence</option>
              <option value="rating">Meilleure note</option>
              <option value="price-asc">Prix croissant</option>
              <option value="distance">Distance</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="aspect-4/3 bg-bg-sunken" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center text-center py-24 border border-dashed border-[var(--color-border-strong)] rounded-2xl">
              <SearchIcon size={48} className="text-ink-faint mb-4" />
              <h3 className="font-bold text-lg">Aucun résultat</h3>
              <p className="text-sm text-ink-soft mt-1">
                Essayez d'élargir vos filtres.
              </p>
              <button onClick={resetFilters} className="btn btn-outline mt-6">
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((a) => (
                <Link
                  key={a.id}
                  to={`/artisan/${a.id}`}
                  className="artisan-card"
                >
                  <div className="artisan-card-media">
                    <img src={a.avatar_url || ""} alt={a.name} />
                    {a.available_today && (
                      <span className="artisan-availability">
                        <span className="availability-dot" /> Disponible
                      </span>
                    )}
                  </div>
                  <div className="artisan-card-body">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{a.name}</h3>
                        <p className="text-xs text-ink-faint">
                          {
                            CATEGORIES.find((c) => c.id === a.category_id)
                              ?.label
                          }{" "}
                          · {a.city}
                        </p>
                      </div>
                      <span className="flex items-center gap-1 text-sm text-[var(--color-star)]">
                        <Star size={14} fill="currentColor" />
                        {a.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
