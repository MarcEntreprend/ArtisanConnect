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
              {category?.label || "Artisan"} · {artisan.city || "—"}
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

function SkeletonCard() {
  return (
    <div className="rounded-(--r-card) border border-(--border) bg-(--bg-elevated) overflow-hidden">
      <div className="skeleton aspect-4/3" />
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
      <section className="hero-section">
        <div className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-10 md:gap-12 items-center">
          <div className="fade-in">
            <span className="hero-eyebrow">
              <span className="w-3.25 h-3.25 rounded-full bg-(--accent)" />8
              métiers, des centaines d'artisans vérifiés
            </span>
            <h1>
              Le bon artisan, <em>à côté de chez vous.</em>
            </h1>
            <p className="hero-sub">
              Comparez les profils, lisez les avis et réservez en ligne.
              Menuisiers, électriciens, couturières et plus encore, prêts à
              intervenir aujourd'hui.
            </p>
            <p className="date-text" id="currentDate">
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <div className="search-container">
              <div className="search-box">
                <Search size={19} className="search-icon" />
                <input
                  type="search"
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Un électricien à Maniche, une couturière à Lomé…"
                  maxLength={50}
                />
                <button
                  className="search-submit"
                  onClick={handleSearch}
                  aria-label="Rechercher"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="hero-visual fade-in">
            <div className="hero-tile">
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&h=500&fit=crop"
                alt=""
              />
              <span className="hero-tile-tag">
                <Star size={12} fill="var(--star)" /> 4.9
              </span>
            </div>
            <div className="hero-tile">
              <img
                src="https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=500&h=500&fit=crop"
                alt=""
              />
            </div>
            <div className="hero-tile">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&h=500&fit=crop"
                alt=""
              />
            </div>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="category-section">
        <div className="flex gap-[0.65rem] overflow-x-auto pb-[0.3rem] scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`category-btn ${selectedCategory === "all" ? "active" : ""}`}
          >
            ⭐ Tous les métiers
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`category-btn ${selectedCategory === cat.slug ? "active" : ""}`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Grille artisans */}
      <section className="near-section">
        <div className="section-heading">
          <div>
            <h2>Près de vous</h2>
            <p>
              {loading
                ? "Chargement…"
                : `${filtered.length} artisan${filtered.length > 1 ? "s" : ""} disponible${filtered.length > 1 ? "s" : ""}`}
            </p>
          </div>
          <Link to="/search" className="section-link">
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
            <div className="w-16 h-16 rounded-full bg-(--bg-sunken) flex items-center justify-center text-2xl">
              🔍
            </div>
            <h3 className="text-lg font-bold text-(--ink)">
              Aucun artisan dans cette catégorie
            </h3>
            <p className="text-sm text-(--ink-faint) max-w-xs">
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
      <section className="testimonial-section">
        <div className="section-heading">
          <div>
            <h2>Ils ont trouvé leur artisan</h2>
            <p>Des retours vérifiés, publiés après chaque prestation</p>
          </div>
        </div>
        <div className="testimonial-track">
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
            {
              name: "Aïcha Omar",
              role: "Cliente à Maniche",
              rating: 4,
              text: "Bonne plateforme, les avis des autres clients m'ont aidée à choisir le bon menuisier pour ma bibliothèque.",
              avatar:
                "https://t3.ftcdn.net/jpg/01/06/55/58/240_F_106555867_yd9obhwNljC895BovPDzclkRbsMLXL2M.jpg",
            },
          ].map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="testimonial-stars">
                {Array.from({ length: t.rating }).map((_, si) => (
                  <Star key={si} size={15} fill="currentColor" />
                ))}
              </div>
              <p className="testimonial-quote">« {t.text} »</p>
              <div className="testimonial-author">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="testimonial-avatar"
                  loading="lazy"
                />
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
