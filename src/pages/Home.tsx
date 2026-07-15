import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Star, MapPin, ArrowRight, Heart } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Artisan } from "../lib/types";
import { CATEGORIES } from "../lib/constants";

function formatPrice(amount: number | null, currency: string) {
  if (!amount) return "Devis gratuit";
  return `dès ${amount.toLocaleString("fr-FR")} ${currency}`;
}

function ArtisanCard({ artisan }: { artisan: Artisan }) {
  const category = CATEGORIES.find((c) => c.id === artisan.category_id);

  return (
    <Link
      to={`/artisan/${artisan.id}`}
      className="artisan-card animate-fade-in-up"
    >
      <div className="artisan-card-media">
        <img
          src={artisan.avatar_url || "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop"}
          alt={artisan.name}
          loading="lazy"
        />
        {artisan.available_today && (
          <span className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest text-white text-[10px] font-bold tracking-wide uppercase shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Disponible
          </span>
        )}
        {artisan.verified && (
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
                {artisan.name}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-ochre shrink-0 bg-ochre-soft px-2 py-0.5 rounded-lg">
              <Star size={13} fill="currentColor" />
              <span>{artisan.rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-xs text-ink-soft mt-2 flex items-center gap-1">
            <MapPin size={12} className="text-ink-faint" />
            <span>{artisan.city || "Haïti"}</span>
          </p>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/60 text-xs text-ink-soft">
          <span className="text-ink-faint">
            {artisan.reviews_count} avis clients
          </span>
          <span className="font-mono font-bold text-ink text-sm">
            {formatPrice(artisan.price_from, artisan.currency)}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

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

  const filtered =
    selectedCategory === "all"
      ? artisans
      : artisans.filter(
        (a) =>
          a.category_id ===
          CATEGORIES.find((c) => c.slug === selectedCategory)?.id,
      );

  return (
    <div className="py-4 animate-fade-in-up">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-accent-soft/80 via-bg-elevated/40 to-bg-sunken/40 border border-border/60 p-8 md:p-14 lg:p-20 mt-6 mb-12 shadow-sm">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute left-1/3 bottom-0 -mb-20 w-96 h-96 rounded-full bg-forest-soft/40 blur-3xl" />

        <div className="max-w-2xl relative z-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-soft text-xs font-bold text-forest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-forest animate-pulse" />
            Haïti local · 8 métiers certifiés
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink leading-[1.15]">
            Le savoir-faire local, <br />
            <span className="text-accent italic font-medium">à côté de chez vous.</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-ink-soft leading-relaxed max-w-xl">
            Trouvez des menuisiers, électriciens, couturières et artisans de confiance en Haïti.
            Comparez les profils, lisez les avis authentiques et réservez en ligne.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-2.5 max-w-lg">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint"
                size={18}
              />
              <input
                type="search"
                placeholder="Un électricien à Pétion-Ville, une couturière à Jacmel…"
                className="w-full pl-11 pr-4 py-3.5 rounded-full border border-border bg-bg-elevated text-sm text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-sm"
              />
            </div>
            <button className="btn btn-primary px-6 py-3.5 text-sm shadow-md">
              Rechercher
            </button>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="pb-10">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-ink-faint mb-4">
          Filtrer par métier
        </h3>
        <div className="flex gap-2.5 overflow-x-auto pb-4 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 border ${selectedCategory === "all"
              ? "bg-accent border-accent text-white shadow-sm"
              : "bg-bg-elevated border-border text-ink-soft hover:border-border-strong hover:bg-bg-sunken"
              }`}
          >
            🌟 Tous les métiers
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 border ${selectedCategory === cat.slug
                ? "bg-accent border-accent text-white shadow-sm"
                : "bg-bg-elevated border-border text-ink-soft hover:border-border-strong hover:bg-bg-sunken"
                }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Grille artisans */}
      <section className="py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-ink">Près de vous</h2>
            <p className="text-sm text-ink-faint mt-1">
              {filtered.length} artisan{filtered.length > 1 ? "s" : ""} disponible{filtered.length > 1 ? "s" : ""}
            </p>
          </div>
          <Link
            to="/search"
            className="flex items-center gap-1 text-sm font-bold text-accent hover:text-accent-strong transition-colors"
          >
            Voir tout <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((artisan) => (
              <ArtisanCard key={artisan.id} artisan={artisan} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
