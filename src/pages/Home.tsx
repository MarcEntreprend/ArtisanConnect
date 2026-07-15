// src/pages/Home.tsx

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Star, MapPin, ArrowRight, Heart, Sparkles, ChevronRight } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Artisan } from "../lib/types";
import { CATEGORIES } from "../lib/constants";

/* ─── helpers ─── */
function formatPrice(amount: number | null, currency: string) {
  if (!amount) return "Sur devis";
  return `dès ${amount.toLocaleString("fr-FR")} ${currency}`;
}

/* ─── Hook d'animation d'entrée au scroll ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
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
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─── Carte artisan ─── */
function ArtisanCard({ artisan, index }: { artisan: Artisan; index: number }) {
  const category = CATEGORIES.find((c) => c.id === artisan.category_id);
  const [fav, setFav] = useState(false);
  const ref = useReveal();

  return (
    <div
      ref={ref}
      className="artisan-card"
      style={{
        opacity: 0,
        transform: "translateY(24px)",
        transition: `opacity 0.55s cubic-bezier(0.32,0.72,0,1) ${index * 0.07}s, transform 0.55s cubic-bezier(0.32,0.72,0,1) ${index * 0.07}s`,
      }}
    >
      <Link to={`/artisan/${artisan.id}`} className="flex flex-col flex-1">
        {/* Média */}
        <div className="artisan-card-media">
          <img
            src={artisan.avatar_url || "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=450&fit=crop"}
            alt={artisan.name}
            loading="lazy"
          />

          {/* Badges en surimpression */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {artisan.available_today && (
            <span className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--forest)] text-white text-[10px] font-extrabold uppercase tracking-widest shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Dispo
            </span>
          )}

          {/* Bouton favori */}
          <button
            className={`
              absolute top-3 right-3 w-8 h-8 rounded-full
              flex items-center justify-center
              bg-white/80 backdrop-blur-sm
              shadow-sm transition-all duration-300
              ${fav ? "text-[var(--danger)] scale-110" : "text-[var(--ink-faint)] hover:text-[var(--danger)] hover:scale-105"}
            `}
            onClick={(e) => { e.preventDefault(); setFav(!fav); }}
            aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart size={14} fill={fav ? "currentColor" : "none"} strokeWidth={2} />
          </button>

          {/* Note en bas à droite sur la photo */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-bold">
            <Star size={11} fill="currentColor" className="text-[var(--star)]" />
            {artisan.rating.toFixed(1)}
          </div>
        </div>

        {/* Corps de la carte */}
        <div className="p-4 flex-1 flex flex-col gap-3">
          <div>
            {/* Catégorie eyebrow */}
            <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--accent)]">
              {category?.icon} {category?.label || "Artisan"}
            </span>
            {/* Nom */}
            <h3 className="mt-0.5 font-bold text-[var(--ink)] text-[0.95rem] leading-snug line-clamp-1">
              {artisan.name}
            </h3>
            {/* Ville */}
            <p className="mt-1 flex items-center gap-1 text-xs text-[var(--ink-faint)]">
              <MapPin size={11} strokeWidth={2} />
              {artisan.city || "Haïti"}
            </p>
          </div>

          {/* Footer carte */}
          <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
            <span className="text-[11px] text-[var(--ink-faint)]">
              {artisan.reviews_count} avis
            </span>
            <span className="mono-num text-sm font-bold text-[var(--ink)]">
              {formatPrice(artisan.price_from, artisan.currency)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

/* ─── Skeleton card ─── */
function SkeletonCard() {
  return (
    <div className="rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--bg-elevated)] overflow-hidden">
      <div className="skeleton aspect-[4/3]" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-px w-full rounded" style={{ marginTop: "0.75rem" }} />
        <div className="flex justify-between">
          <div className="skeleton h-3 w-1/4 rounded" />
          <div className="skeleton h-3 w-1/3 rounded" />
        </div>
      </div>
    </div>
  );
}

/* ─── Section témoignages (données statiques pour le moment) ─── */
const TESTIMONIALS = [
  {
    name: "Marie-Rose J.",
    role: "Cliente à Port-au-Prince",
    text: "J'ai trouvé un excellent électricien en moins de 5 minutes. Il est arrivé à l'heure, le devis était clair. Je recommande !",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    name: "Jean-Baptiste M.",
    role: "Client à Pétion-Ville",
    text: "Ma couturière est incroyable. Ma tenue était prête avant même la date prévue. ArtisanConnect m'a sauvé pour le mariage !",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=33",
  },
  {
    name: "Claudette S.",
    role: "Cliente à Jacmel",
    text: "Les artisans ici sont sérieux et professionnels. Fini de chercher des heures dans mon quartier.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=56",
  },
];

/* ─── Page Home ─── */
export default function Home() {
  const navigate = useNavigate();
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useReveal();
  const proofRef = useReveal();

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

  // Parallax très subtil sur le hero (GPU-safe via transform)
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onScroll = () => {
      hero.style.transform = `translateY(${window.scrollY * 0.12}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered =
    selectedCategory === "all"
      ? artisans
      : artisans.filter(
        (a) => a.category_id === CATEGORIES.find((c) => c.slug === selectedCategory)?.id
      );

  function handleSearch() {
    const q = searchQuery.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
    else navigate("/search");
  }

  return (
    <div className="min-h-screen">

      {/* ══════════════════════════════════════════════
          HERO — fond texturé avec image artisan en décor
          ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-[88dvh] flex items-center">
        {/* Fond avec dégradé chaud */}
        <div
          ref={heroRef}
          className="absolute inset-0 -z-10"
          style={{ willChange: "transform" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg)] via-[var(--bg-sunken)] to-[var(--bg-deep)]" />
          {/* Orbes de couleur */}
          <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-[var(--accent-soft)] blur-[120px] opacity-60" />
          <div className="absolute bottom-[-5%] left-[-5%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-[var(--forest-soft)] blur-[100px] opacity-50" />
          <div className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] rounded-full bg-[var(--ochre-soft)] blur-[80px] opacity-35" />
        </div>

        {/* Mosaïque de portraits flottants — visible md+ */}
        <div className="absolute right-0 top-0 bottom-0 w-[45%] hidden md:block overflow-hidden">
          <div className="relative h-full w-full">
            {/* Colonne de droite — images artisans */}
            <div className="absolute top-8 right-8 w-[45%] space-y-3 animate-fade-up stagger-4">
              <div className="rounded-[var(--r-lg)] overflow-hidden shadow-[var(--shadow-lg)] ring-1 ring-[var(--border)]">
                <img
                  src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=300&fit=crop"
                  alt=""
                  className="w-full h-32 object-cover"
                />
              </div>
              <div className="rounded-[var(--r-lg)] overflow-hidden shadow-[var(--shadow-md)] ring-1 ring-[var(--border)]">
                <img
                  src="https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=400&h=280&fit=crop"
                  alt=""
                  className="w-full h-28 object-cover"
                />
              </div>
            </div>
            {/* Colonne de gauche */}
            <div className="absolute top-24 right-[52%] w-[42%] space-y-3 animate-fade-up stagger-3">
              <div className="rounded-[var(--r-lg)] overflow-hidden shadow-[var(--shadow-lg)] ring-1 ring-[var(--border)]">
                <img
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=300&fit=crop"
                  alt=""
                  className="w-full h-36 object-cover"
                />
              </div>
              <div className="rounded-[var(--r-lg)] overflow-hidden shadow-[var(--shadow-md)] ring-1 ring-[var(--border)]">
                <img
                  src="https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&h=240&fit=crop"
                  alt=""
                  className="w-full h-24 object-cover"
                />
              </div>
            </div>
            {/* Masque dégradé sur la droite pour fondre dans le fond */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[var(--bg)] to-transparent" />
          </div>
        </div>

        {/* Contenu texte */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-10 py-24 w-full">
          <div className="max-w-xl">
            {/* Eyebrow badge */}
            <span
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--forest-soft)] text-[var(--forest)] text-[11px] font-extrabold uppercase tracking-[0.16em] mb-7 animate-fade-up"
            >
              <Sparkles size={12} strokeWidth={2.5} />
              Artisans certifiés · Haïti
            </span>

            {/* H1 */}
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-[-0.025em] text-[var(--ink)] leading-[1.06] animate-fade-up stagger-1"
            >
              Le savoir-faire
              <br />
              <em className="not-italic text-[var(--accent)]">local,</em>
              <br />
              <span className="text-[var(--ink-soft)] font-medium">à côté de vous.</span>
            </h1>

            <p
              className="mt-6 text-base md:text-lg text-[var(--ink-soft)] leading-relaxed max-w-md animate-fade-up stagger-2"
            >
              Menuisiers, électriciens, couturières et plus encore —
              réservez des artisans de confiance en Haïti, directement depuis votre téléphone.
            </p>

            {/* Barre de recherche */}
            <div
              className="mt-10 animate-fade-up stagger-3"
            >
              {/* Double-bezel sur la search */}
              <div className="p-1.5 rounded-[var(--r-pill)] bg-[var(--bg-elevated)] border border-[var(--border)] shadow-[var(--shadow-md)]">
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 pl-4">
                    <Search size={17} strokeWidth={2} className="text-[var(--ink-faint)] shrink-0" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      placeholder="Ex. : électricien à Jacmel, couturière…"
                      className="flex-1 bg-transparent text-sm text-[var(--ink)] placeholder-[var(--ink-faint)] outline-none py-1.5"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="
                      flex items-center gap-2 px-5 py-2.5 rounded-full
                      bg-[var(--accent)] text-white font-bold text-sm
                      hover:bg-[var(--accent-strong)]
                      active:scale-[0.97]
                      transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
                      shadow-sm
                    "
                  >
                    Rechercher
                    <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center">
                      <ArrowRight size={13} strokeWidth={2.5} />
                    </span>
                  </button>
                </div>
              </div>
              <p className="mt-3 text-xs text-[var(--ink-faint)] pl-1">
                Suggestions : Maçon · Coiffeur · Mécanicien · Menuisier
              </p>
            </div>
          </div>
        </div>

        {/* Indicateur de scroll */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-up stagger-5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-faint)]">Découvrir</span>
          <div className="w-5 h-8 rounded-full border border-[var(--border-strong)] flex items-start justify-center pt-1.5">
            <div
              className="w-1 h-1.5 rounded-full bg-[var(--ink-faint)]"
              style={{
                animation: "slideDown 1.4s cubic-bezier(0.32,0.72,0,1) infinite",
              }}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STATS VISUELLES
          ══════════════════════════════════════════════ */}
      <section className="py-14 border-y border-[var(--border)]">
        <div
          ref={statsRef}
          className="max-w-7xl mx-auto px-5 lg:px-10 grid grid-cols-2 md:grid-cols-4 gap-6"
          style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.6s cubic-bezier(0.32,0.72,0,1), transform 0.6s cubic-bezier(0.32,0.72,0,1)" }}
        >
          {[
            { value: "8", label: "Métiers certifiés", accent: false },
            { value: "500+", label: "Artisans vérifiés", accent: true },
            { value: "4.8★", label: "Note moyenne clients", accent: false },
            { value: "24h", label: "Délai de réponse moyen", accent: false },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span
                className={`text-4xl font-extrabold tracking-tight ${stat.accent ? "text-[var(--accent)]" : "text-[var(--ink)]"}`}
              >
                {stat.value}
              </span>
              <span className="text-sm text-[var(--ink-faint)]">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-5 lg:px-10">

        {/* ══════════════════════════════════════════════
            CATÉGORIES — scroll horizontal
            ══════════════════════════════════════════════ */}
        <section className="pt-16 pb-10">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-xl font-bold text-[var(--ink)]">Filtrer par métier</h2>
            <Link
              to="/search"
              className="flex items-center gap-1 text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-strong)] transition-colors"
            >
              Tout voir <ChevronRight size={15} strokeWidth={2.5} />
            </Link>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-3 scrollbar-hide -mx-1 px-1">
            {/* Tous */}
            <button
              onClick={() => setSelectedCategory("all")}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-full
                text-sm font-semibold whitespace-nowrap
                transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
                border shrink-0
                ${selectedCategory === "all"
                  ? "bg-[var(--ink)] border-[var(--ink)] text-[var(--bg)] shadow-sm"
                  : "bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--ink-soft)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-sunken)]"
                }
              `}
            >
              Tous les métiers
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`
                  flex items-center gap-2 px-5 py-2.5 rounded-full
                  text-sm font-semibold whitespace-nowrap
                  transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
                  border shrink-0
                  ${selectedCategory === cat.slug
                    ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-sm"
                    : "bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--ink-soft)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-sunken)]"
                  }
                `}
              >
                <span className="text-base leading-none">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            GRILLE ARTISANS
            ══════════════════════════════════════════════ */}
        <section className="pb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[var(--ink)]">Près de vous</h2>
              <p className="text-sm text-[var(--ink-faint)] mt-1">
                {loading ? "Chargement…" : `${filtered.length} artisan${filtered.length > 1 ? "s" : ""} disponible${filtered.length > 1 ? "s" : ""}`}
              </p>
            </div>
            <Link
              to="/search"
              className="flex items-center gap-1.5 text-sm font-bold text-[var(--accent)] hover:text-[var(--accent-strong)] transition-colors group"
            >
              Voir tout
              <span className="w-6 h-6 rounded-full bg-[var(--accent-soft)] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight size={12} strokeWidth={2.5} className="text-[var(--accent)]" />
              </span>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center text-center py-20 gap-4">
              <div className="w-16 h-16 rounded-full bg-[var(--bg-sunken)] flex items-center justify-center text-2xl">
                🔍
              </div>
              <h3 className="text-lg font-bold text-[var(--ink)]">Aucun artisan dans cette catégorie</h3>
              <p className="text-sm text-[var(--ink-faint)] max-w-xs">
                Revenez bientôt ou explorez les autres métiers disponibles.
              </p>
              <button
                onClick={() => setSelectedCategory("all")}
                className="btn btn-outline mt-2"
              >
                Voir tous les artisans
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((artisan, i) => (
                <ArtisanCard key={artisan.id} artisan={artisan} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════
            PREUVE SOCIALE — Témoignages
            ══════════════════════════════════════════════ */}
        <section
          ref={proofRef}
          className="py-20 -mx-5 lg:-mx-10 px-5 lg:px-10 bg-[var(--bg-sunken)] rounded-[var(--r-xl)]"
          style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.6s cubic-bezier(0.32,0.72,0,1) 0.1s, transform 0.6s cubic-bezier(0.32,0.72,0,1) 0.1s" }}
        >
          <div className="mb-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--ochre-soft)] text-[var(--ochre)] text-[10px] font-extrabold uppercase tracking-[0.15em] mb-4">
              <Star size={11} fill="currentColor" />
              Avis authentiques
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--ink)] tracking-tight">
              Ils ont trouvé leur artisan
            </h2>
            <p className="mt-2 text-[var(--ink-faint)]">Publiés après chaque prestation vérifiée.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="bg-[var(--bg-elevated)] rounded-[var(--r-card)] p-6 border border-[var(--border)] shadow-[var(--shadow-sm)]"
                style={{
                  animation: "fadeUp 0.5s cubic-bezier(0.32,0.72,0,1) both",
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                {/* Étoiles */}
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Star key={si} size={13} fill="currentColor" className="text-[var(--star)]" />
                  ))}
                </div>
                {/* Citation */}
                <p className="text-[var(--ink)] text-sm leading-relaxed mb-6">
                  « {t.text} »
                </p>
                {/* Auteur */}
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-[var(--border)]"
                  />
                  <div>
                    <p className="text-sm font-bold text-[var(--ink)]">{t.name}</p>
                    <p className="text-xs text-[var(--ink-faint)]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            CTA ARTISAN — Rejoindre la plateforme
            ══════════════════════════════════════════════ */}
        <section className="py-20">
          {/* Double-bezel sur le bloc CTA */}
          <div className="p-1.5 rounded-[var(--r-xl)] bg-gradient-to-br from-[var(--accent)] to-[var(--accent-strong)] shadow-[var(--shadow-glow)]">
            <div className="rounded-[calc(var(--r-xl)-6px)] bg-gradient-to-br from-[var(--accent)]/90 to-[var(--accent-strong)] px-8 py-14 md:px-16 md:py-16 text-center relative overflow-hidden">
              {/* Décoration */}
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-black/10 blur-2xl" />

              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-white text-[10px] font-extrabold uppercase tracking-widest mb-6">
                  <Sparkles size={11} />
                  Gratuit pour commencer
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
                  Vous êtes artisan ?
                  <br />
                  Rejoignez ArtisanConnect.
                </h2>
                <p className="text-white/75 max-w-sm mx-auto text-base mb-8">
                  Créez votre vitrine, gérez vos disponibilités et recevez des réservations en ligne en quelques minutes.
                </p>
                <Link
                  to="/onboarding"
                  className="
                    inline-flex items-center gap-3 px-8 py-4 rounded-full
                    bg-white text-[var(--accent-strong)] font-extrabold text-sm
                    hover:bg-[var(--bg-elevated)]
                    active:scale-[0.98]
                    transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
                    shadow-[0_4px_20px_rgba(0,0,0,0.2)]
                  "
                >
                  Créer mon profil artisan
                  <span className="w-7 h-7 rounded-full bg-[var(--accent-soft)] flex items-center justify-center">
                    <ArrowRight size={14} strokeWidth={2.5} className="text-[var(--accent)]" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}