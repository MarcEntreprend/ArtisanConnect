// src/pages/Home.tsx — corrigé

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Star, MapPin, ArrowRight } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Artisan, Category } from "../lib/types";

const CATEGORIES: Category[] = [
  { id: 1, slug: "menuiserie", label: "Menuiserie", icon: "🔨" },
  { id: 2, slug: "electricite", label: "Électricité", icon: "⚡" },
  { id: 3, slug: "plomberie", label: "Plomberie", icon: "🔧" },
  { id: 4, slug: "maconnerie", label: "Maçonnerie", icon: "🧱" },
  { id: 5, slug: "peinture", label: "Peinture", icon: "🎨" },
  { id: 6, slug: "couture", label: "Couture", icon: "✂️" },
  { id: 7, slug: "coiffure", label: "Coiffure", icon: "💇" },
  { id: 8, slug: "mecanique", label: "Mécanique auto", icon: "🚗" },
];

function formatPrice(amount: number | null, currency: string) {
  if (!amount) return "Devis gratuit";
  return `dès ${amount.toLocaleString("fr-FR")} ${currency}`;
}

function ArtisanCard({ artisan }: { artisan: Artisan }) {
  const category = CATEGORIES.find((c) => c.id === artisan.category_id);

  return (
    <Link
      to={`/artisan/${artisan.id}`}
      className="group bg-[var(--bg-elevated)] rounded-[var(--r-card)] border border-[var(--border)] overflow-hidden hover:shadow-[var(--shadow-lg)] transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={artisan.avatar_url || ""}
          alt={artisan.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {artisan.available_today && (
          <span className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/90 text-white text-xs font-medium backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Disponible aujourd'hui
          </span>
        )}
        <button
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[var(--ink-soft)] hover:text-red-500 transition-colors"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.6z" />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-[var(--ink)] truncate">
              {artisan.name}
            </h3>
            <p className="text-sm text-[var(--ink-soft)] mt-0.5">
              {category?.label || "Artisan"} · {artisan.city || "—"}
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-[var(--star)] flex-shrink-0">
            <Star size={14} fill="currentColor" />
            {artisan.rating.toFixed(1)}
            <span className="text-(--ink-faint) font-normal">
              ({artisan.reviews_count})
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)] text-xs text-(--ink-faint)">
          <span className="flex items-center gap-1">
            <MapPin size={12} />—
          </span>
          <span className="font-mono font-medium text-(--ink)">
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
    <div className="max-w-7xl mx-auto px-4">
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />8
            métiers, des centaines d'artisans vérifiés
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-(--ink)ing-tight">
            Le bon artisan,{" "}
            <em className="text-(--accent)italic">à côté de chez vous.</em>
          </h1>
          <p className="mt-4 text-lg text-(--ink-soft) leading-relaxed">
            Comparez les profils, lisez les avis et réservez en ligne.
            Menuisiers, électriciens, couturières et plus encore.
          </p>
          <div className="mt-6 relative max-w-xl">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-(--ink-faint)"
              size={20}
            />
            <input
              type="search"
              placeholder="Un électricien à Dakar, une couturière à Lomé…"
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-(--border) bg-(--bg-elevated) text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-shadow"
            />
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="pb-8">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === "all"
                ? "bg-[var(--accent)] text-white"
                : "bg-(--bg-sunken) text-[var(--ink-soft)] hover:bg-[var(--border)]"
            }`}
          >
            ⭐ Tous les métiers
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.slug
                  ? "bg-[var(--accent)] text-white"
                  : "bg-(--bg-sunken) text-[var(--ink-soft)] hover:bg-(--border)"
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Grille artisans */}
      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-(--ink)">Près de vous</h2>
            <p className="text-sm text-(--ink-faint) mt-1">
              {filtered.length} artisan{filtered.length > 1 ? "s" : ""}{" "}
              disponible{filtered.length > 1 ? "s" : ""}
            </p>
          </div>
          <Link
            to="/search"
            className="flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:underline"
          >
            Voir tout <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[var(--r-card)] border border-[var(--border)] animate-pulse"
              >
                <div className="aspect-[4/3] bg-(--bg-sunken)" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-(--bg-sunken) rounded w-3/4" />
                  <div className="h-3 bg-(--bg-sunken) rounded w-1/2" />
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
