import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search as SearchIcon, Star, MapPin, Heart } from "lucide-react";
import { supabase } from "../lib/supabase";
import { CATEGORIES } from "../lib/constants";
import type { Artisan } from "../lib/types";

type SortKey = "pertinence" | "rating" | "price-asc" | "distance";

function formatPrice(amount: number | null, currency: string) {
  if (!amount) return "Devis gratuit";
  return `dès ${amount.toLocaleString("fr-FR")} ${currency}`;
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
    <div className="py-4 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/40 pb-6 mt-6">
        <div>
          <h1 className="text-3xl font-extrabold text-ink">
            Trouver un artisan
          </h1>
          <p className="text-sm text-ink-faint mt-1">
            Découvrez les talents locaux certifiés près de chez vous
          </p>
        </div>
        <div className="relative max-w-md w-full">
          <SearchIcon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint"
            size={18}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Un électricien à Pétion-Ville, une couturière à Jacmel…"
            className="w-full pl-11 pr-4 py-3 rounded-full border border-border bg-bg-elevated text-sm text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 mt-8">
        {/* Filters */}
        <aside className="bg-bg-elevated border border-border rounded-3xl p-6 sticky top-24 self-start shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
            <h2 className="font-extrabold text-sm text-ink">Filtres</h2>
            <button
              onClick={resetFilters}
              className="text-[11px] font-bold text-accent hover:text-accent-strong transition-colors"
            >
              Effacer tout
            </button>
          </div>

          {/* Categories */}
          <div className="pb-5 border-b border-border">
            <h3 className="font-bold text-xs text-ink uppercase tracking-wider mb-3">
              Métier
            </h3>
            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
              {CATEGORIES.map((c) => (
                <label
                  key={c.slug}
                  className="flex items-center gap-2.5 py-0.5 text-sm text-ink-soft hover:text-ink cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.has(c.slug)}
                    onChange={(e) => {
                      const next = new Set(selectedCategories);
                      e.target.checked ? next.add(c.slug) : next.delete(c.slug);
                      setSelectedCategories(next);
                    }}
                    className="accent-accent"
                  />
                  <span>
                    {c.icon} {c.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Cities */}
          <div className="py-5 border-b border-border">
            <h3 className="font-bold text-xs text-ink uppercase tracking-wider mb-3">
              Ville
            </h3>
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {cities.length === 0 ? (
                <p className="text-xs text-ink-faint italic">
                  Aucune ville disponible
                </p>
              ) : (
                cities.map((city) => (
                  <label
                    key={city}
                    className="flex items-center gap-2.5 py-0.5 text-sm text-ink-soft hover:text-ink cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCities.has(city)}
                      onChange={(e) => {
                        const next = new Set(selectedCities);
                        e.target.checked ? next.add(city) : next.delete(city);
                        setSelectedCities(next);
                      }}
                      className="accent-accent"
                    />
                    <span>{city}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="py-5 border-b border-border">
            <h3 className="font-bold text-xs text-ink uppercase tracking-wider mb-3">
              Note minimale
            </h3>
            <div className="space-y-2">
              {[0, 4, 4.5].map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-2.5 py-0.5 text-sm text-ink-soft hover:text-ink cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === r}
                    onChange={() => setMinRating(r)}
                    className="accent-accent"
                  />
                  <span>{r === 0 ? "Toutes les notes" : `${r} et plus`}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="py-5 border-b border-border">
            <h3 className="font-bold text-xs text-ink uppercase tracking-wider mb-2">
              Budget max
            </h3>
            <input
              type="range"
              min="0"
              max="65000"
              step="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-accent h-1 bg-bg-sunken rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-ink-faint font-mono mt-2">
              <span>0 G</span>
              <span className="font-semibold text-accent">
                {maxPrice.toLocaleString("fr-FR")} G
              </span>
            </div>
          </div>

          {/* Available today */}
          <div className="pt-5">
            <label className="flex items-center gap-2.5 text-sm text-ink-soft hover:text-ink cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={availableToday}
                onChange={(e) => setAvailableToday(e.target.checked)}
                className="accent-accent"
              />
              <span className="font-semibold text-xs uppercase tracking-wider text-forest">
                Disponible aujourd'hui
              </span>
            </label>
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
            <p className="text-sm text-ink-soft">
              <strong className="text-ink font-extrabold">
                {filtered.length}
              </strong>{" "}
              artisans trouvés
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="px-4 py-2 rounded-full border border-border bg-bg-elevated text-xs font-bold text-ink-soft focus:outline-none focus:ring-2 focus:ring-accent shadow-sm"
            >
              <option value="pertinence">Pertinence</option>
              <option value="rating">Meilleure note</option>
              <option value="price-asc">Prix croissant</option>
              <option value="distance">Distance</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-card border border-border bg-bg-elevated animate-pulse"
                >
                  <div className="aspect-4/3 bg-bg-sunken rounded-t-card" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-bg-sunken rounded w-3/4" />
                    <div className="h-3 bg-bg-sunken rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center text-center py-24 border border-dashed border-border-strong rounded-3xl bg-bg-elevated/40">
              <SearchIcon size={48} className="text-ink-faint mb-4" />
              <h3 className="font-bold text-lg text-ink">Aucun résultat</h3>
              <p className="text-sm text-ink-soft mt-1">
                Aucun artisan ne correspond à ces critères. Essayez d'élargir
                vos filtres.
              </p>
              <button onClick={resetFilters} className="btn btn-outline mt-6">
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((a) => {
                const category = CATEGORIES.find((c) => c.id === a.category_id);
                return (
                  <Link
                    key={a.id}
                    to={`/artisan/${a.id}`}
                    className="artisan-card"
                  >
                    <div className="artisan-card-media">
                      <img
                        src={
                          a.avatar_url ||
                          "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop"
                        }
                        alt={a.name}
                        loading="lazy"
                      />
                      {a.available_today && (
                        <span className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest text-white text-[10px] font-bold tracking-wide uppercase shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          Disponible
                        </span>
                      )}
                      {a.verified && (
                        <span className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-bg-elevated/90 text-forest text-[10px] font-extrabold tracking-wide uppercase border border-forest/20 backdrop-blur-sm shadow-sm">
                          Vérifié
                        </span>
                      )}
                      <button
                        className="absolute top-3 right-3 w-8.5 h-8.5 rounded-full bg-bg-elevated/80 backdrop-blur-sm flex items-center justify-center text-ink-soft hover:text-danger hover:bg-bg-elevated transition-all shadow-sm"
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        <Heart size={15} />
                      </button>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent">
                              {category?.label || "Artisan"}
                            </span>
                            <h3 className="font-bold text-ink text-base mt-0.5 truncate hover:text-accent transition-colors">
                              {a.name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1 text-sm font-semibold text-ochre shrink-0 bg-ochre-soft px-2 py-0.5 rounded-lg">
                            <Star size={13} fill="currentColor" />
                            <span>{a.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <p className="text-xs text-ink-soft mt-2 flex items-center gap-1">
                          <MapPin size={12} className="text-ink-faint" />
                          <span>{a.city || "Haïti"}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/60 text-xs text-ink-soft">
                        <span className="text-ink-faint">
                          {a.reviews_count} avis
                        </span>
                        <span className="font-mono font-bold text-ink text-sm">
                          {formatPrice(a.price_from, a.currency)}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
