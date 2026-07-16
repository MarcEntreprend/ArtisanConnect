// src/pages/Home.tsx

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const [fav, setFav] = useState(false);

  return (
    <Link to={`/artisan/${artisan.id}`} className="artisan-card">
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
          className={`absolute top-[0.65rem] right-[0.65rem] w-9 h-9 rounded-full bg-[color-mix(in_srgb,var(--bg-elevated)_82%,transparent)] backdrop-blur-[6px] flex items-center justify-center transition-transform hover:scale-[1.08] ${
            fav ? "text-[var(--danger)]" : "text-[var(--ink)]"
          }`}
          onClick={(e) => {
            e.preventDefault();
            setFav(!fav);
          }}
        >
          <Heart size={18} fill={fav ? "currentColor" : "none"} />
        </button>
        {artisan.available_today && (
          <span className="absolute bottom-[0.65rem] left-[0.65rem] flex items-center gap-[0.35rem] px-[0.3rem] py-[0.6rem] rounded-full bg-[color-mix(in_srgb,var(--bg-elevated)_88%,transparent)] backdrop-blur-[6px] text-[0.7rem] font-semibold">
            <span className="w-[6px] h-[6px] rounded-full bg-[var(--accent)]" />
            Disponible aujourd'hui
          </span>
        )}
      </div>
      <div className="p-[1.1rem] flex-1 flex flex-col gap-[0.55rem]">
        <div className="flex items-start justify-between gap-[0.6rem]">
          <div className="min-w-0">
            <h3 className="font-bold text-[1rem] leading-[1.3] text-[var(--ink)]">
              {artisan.name}
            </h3>
            <p className="text-[0.8rem] text-[var(--ink-faint)] mt-[0.1rem]">
              {category?.label || "Artisan"} · {artisan.city || "—"}
            </p>
          </div>
          <div className="flex items-center gap-[0.3rem] text-[0.82rem] font-semibold text-[var(--star)] shrink-0">
            <Star size={15} fill="currentColor" />
            {artisan.rating.toFixed(1)}
            <span className="text-[var(--ink-faint)] font-normal">
              ({artisan.reviews_count})
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-[0.55rem] border-t border-[var(--border)] text-[0.8rem] text-[var(--ink-soft)]">
          <span className="flex items-center gap-[0.3rem]">
            <MapPin size={14} className="text-[var(--ink-faint)]" />—
          </span>
          <span className="font-mono font-semibold text-[var(--ink)]">
            {formatPrice(artisan.price_from, artisan.currency)}
          </span>
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-[var(--r-card)] border border-[var(--border)] bg-[var(--bg-elevated)] overflow-hidden">
      <div className="skeleton aspect-[4/3]" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  function handleSearch() {
    const q = searchQuery.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
    else navigate("/search");
  }

  return (
    <div className="py-4 md:py-8" style={{ paddingTop: "2rem" }}>
      {/* Hero */}
      <section className="relative pt-4 md:pt-6 pb-14 md:pb-20 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-10 md:gap-12 items-center">
          {/* Texte */}
          <div>
            <span className="inline-flex items-center gap-[0.4rem] text-[0.78rem] font-semibold text-[var(--accent-strong)] bg-[var(--accent-soft)] px-[0.35rem] py-[0.8rem] rounded-full mb-[1.1rem]">
              <span className="w-[13px] h-[13px] rounded-full bg-[var(--accent)]" />
              8 métiers, des centaines d'artisans vérifiés
            </span>
            <h1 className="text-[clamp(2.1rem,4.6vw,3.4rem)] font-extrabold tracking-[-0.025em] leading-[1.05] max-w-[15ch] text-[var(--ink)]">
              Le bon artisan,{" "}
              <em className="italic text-[var(--accent)]">
                à côté de chez vous.
              </em>
            </h1>
            <p className="mt-[1.1rem] text-[1.05rem] text-[var(--ink-soft)] max-w-[46ch] leading-[1.6]">
              Comparez les profils, lisez les avis et réservez en ligne.
              Menuisiers, électriciens, couturières et plus encore, prêts à
              intervenir aujourd'hui.
            </p>
            <p className="text-[var(--ink-faint)] text-[0.85rem] mt-[0.35rem] capitalize">
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            {/* Barre de recherche */}
            <div className="mt-[1.75rem] max-w-[560px]">
              <div className="flex items-center gap-[0.7rem] bg-[var(--bg-elevated)] border-[1.5px] border-[var(--border)] rounded-full py-[0.35rem] pl-[1.15rem] pr-[0.35rem] shadow-[var(--shadow-sm)] focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_4px_var(--accent-soft)] transition-shadow">
                <Search
                  size={19}
                  className="text-[var(--ink-faint)] shrink-0"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Un électricien à Dakar, une couturière à Lomé…"
                  className="flex-1 bg-transparent text-[0.95rem] py-[0.65rem] outline-none placeholder-[var(--ink-faint)]"
                />
                <button
                  onClick={handleSearch}
                  className="shrink-0 w-[42px] h-[42px] rounded-full bg-[var(--accent)] text-[var(--accent-ink)] flex items-center justify-center hover:bg-[var(--accent-strong)] active:scale-[0.94] transition-all"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Mosaïque */}
          <div className="hidden md:grid grid-cols-2 gap-4">
            <div className="rounded-[var(--r-card)] overflow-hidden aspect-square shadow-[var(--shadow-md)] hover:-translate-y-[6px] transition-transform duration-400 relative">
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&h=500&fit=crop"
                alt=""
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-3 left-3 bg-[color-mix(in_srgb,var(--bg-elevated)_88%,transparent)] backdrop-blur-[8px] px-[0.3rem] py-[0.65rem] rounded-full text-[0.72rem] font-semibold flex items-center gap-[0.3rem]">
                <Star size={12} fill="var(--star)" /> 4.9
              </span>
            </div>
            <div className="rounded-[var(--r-card)] overflow-hidden aspect-square shadow-[var(--shadow-md)] mt-8 hover:-translate-y-[6px] transition-transform duration-400">
              <img
                src="https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=500&h=500&fit=crop"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-[var(--r-card)] overflow-hidden aspect-square shadow-[var(--shadow-md)] -mt-8 hover:-translate-y-[6px] transition-transform duration-400">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&h=500&fit=crop"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="py-2 md:py-4">
        <div className="flex gap-[0.65rem] overflow-x-auto pb-[0.3rem] scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`flex items-center gap-[0.45rem] px-[0.6rem] py-[1.05rem] rounded-full border-[1.5px] text-[0.85rem] font-semibold whitespace-nowrap transition-all shrink-0 ${
              selectedCategory === "all"
                ? "bg-[var(--ink)] border-[var(--ink)] text-[var(--bg)]"
                : "bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--ink-soft)] hover:border-[var(--border-strong)]"
            }`}
          >
            ⭐ Tous les métiers
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`flex items-center gap-[0.45rem] px-[0.6rem] py-[1.05rem] rounded-full border-[1.5px] text-[0.85rem] font-semibold whitespace-nowrap transition-all shrink-0 ${
                selectedCategory === cat.slug
                  ? "bg-[var(--accent)] border-[var(--accent)] text-[var(--accent-ink)]"
                  : "bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--ink-soft)] hover:border-[var(--border-strong)]"
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Grille artisans */}
      <section className="py-6 md:py-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[1.5rem] font-bold tracking-[-0.01em] text-[var(--ink)]">
              Près de vous
            </h2>
            <p className="text-[var(--ink-faint)] text-[0.88rem] mt-[0.2rem]">
              {loading
                ? "Chargement…"
                : `${filtered.length} artisan${filtered.length > 1 ? "s" : ""} disponible${filtered.length > 1 ? "s" : ""}`}
            </p>
          </div>
          <Link
            to="/search"
            className="flex items-center gap-[0.25rem] text-[0.85rem] font-semibold text-[var(--accent)] hover:gap-[0.45rem] transition-all whitespace-nowrap"
          >
            Voir tout <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1.1rem]">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center text-center py-20 gap-4">
            <div className="w-16 h-16 rounded-full bg-[var(--bg-sunken)] flex items-center justify-center text-2xl">
              🔍
            </div>
            <h3 className="text-lg font-bold text-[var(--ink)]">
              Aucun artisan dans cette catégorie
            </h3>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1.1rem]">
            {filtered.map((artisan) => (
              <ArtisanCard key={artisan.id} artisan={artisan} />
            ))}
          </div>
        )}
      </section>

      {/* Témoignages */}
      <section className="py-12 md:py-16">
        <div className="bg-[var(--bg-sunken)] rounded-[var(--r-card)] p-8 md:p-10">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-[1.5rem] font-bold tracking-[-0.01em] text-[var(--ink)]">
                Ils ont trouvé leur artisan
              </h2>
              <p className="text-[var(--ink-faint)] text-[0.88rem] mt-[0.2rem]">
                Des retours vérifiés, publiés après chaque prestation
              </p>
            </div>
          </div>
          <div className="flex gap-[1.1rem] overflow-x-auto scrollbar-hide pb-2">
            {[
              {
                name: "Chantal James",
                role: "Cliente à Port-Salut",
                rating: 5,
                text: "J'ai trouvé une couturière à deux rues de chez moi en trois minutes. La prise de rendez-vous en ligne m'a évité trois appels perdus.",
                avatar:
                  "https://t4.ftcdn.net/jpg/03/51/56/07/240_F_351560776_sEYcaEM5PK8BxRx4GewPAYCbCmlKbBOJ.jpg",
              },
              {
                name: "Serge Jean",
                role: "Client à Fond Bleu",
                rating: 5,
                text: "L'électricienne est arrivée à l'heure annoncée, avec un devis clair avant de commencer. Ça change de mes anciennes expériences.",
                avatar:
                  "https://t4.ftcdn.net/jpg/05/17/43/25/240_F_517432572_Q7cWReFsAWbFjmOCxbJUnMeEbLacZCEl.jpg",
              },
              {
                name: "Patrick Mvondo",
                role: "Client à Champlois",
                rating: 5,
                text: "Le suivi par messagerie avant le rendez-vous m'a permis de préciser exactement ce qu'il fallait réparer.",
                avatar:
                  "https://t4.ftcdn.net/jpg/01/37/36/37/240_F_137363729_sjPyXboShqUJp4nTRl4KTWxcx9IS6Kip.jpg",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="shrink-0 w-[min(340px,82vw)] bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[var(--r-card)] p-6 flex flex-col gap-4"
              >
                <div className="flex gap-[0.15rem]">
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Star
                      key={si}
                      size={15}
                      fill="currentColor"
                      className="text-[var(--star)]"
                    />
                  ))}
                </div>
                <p className="text-[0.92rem] leading-[1.55] text-[var(--ink)]">
                  « {t.text} »
                </p>
                <div className="flex items-center gap-[0.65rem] mt-auto">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-[38px] h-[38px] rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-[0.85rem]">{t.name}</p>
                    <p className="text-[0.76rem] text-[var(--ink-faint)]">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
