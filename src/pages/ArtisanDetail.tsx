// src/pages/ArtisanDetail.tsx

import { useParams, Link } from "react-router-dom";
import { useArtisan } from "../hooks/useArtisans";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import {
  Star,
  MapPin,
  Phone,
  ArrowLeft,
  Heart,
  Clock,
  Wifi,
  ParkingCircle,
  Accessibility,
  Baby,
} from "lucide-react";
import { CATEGORIES } from "../lib/constants";

// Mapping des icônes d’amenities
const amenityIcons: Record<string, React.FC<{ size?: number }>> = {
  wifi: Wifi,
  parking: ParkingCircle,
  accessibility: Accessibility,
  kids: Baby,
};

export default function ArtisanDetail() {
  const { id } = useParams<{ id: string }>();
  const { artisan, services, hours, loading } = useArtisan(Number(id));
  const {} = useAuth();
  const [activeTab, setActiveTab] = useState<"services" | "about" | "reviews">(
    "services",
  );

  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 animate-pulse">
        Chargement…
      </div>
    );
  if (!artisan)
    return (
      <div className="text-center py-24">
        <h1 className="text-xl font-bold">Artisan introuvable</h1>
        <p className="text-ink-faint mt-2">
          Ce profil n'existe pas ou a été retiré.
        </p>
        <Link
          to="/"
          className="mt-4 inline-block text-[var(--color-accent)] font-semibold"
        >
          Retour à l'accueil
        </Link>
      </div>
    );

  const isFav = false; // TODO: hook useFavorites

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        to="/search"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-[var(--color-ink)] transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Retour aux résultats
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10">
        {/* Colonne principale */}
        <div>
          {/* Hero */}
          <div className="flex items-start gap-4 mb-6">
            <img
              src={artisan.avatar_url ?? ""}
              alt={artisan.name}
              className="w-20 h-20 rounded-2xl border-3 border-white shadow-md"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <h1 className="text-3xl font-extrabold tracking-tight">
                  {artisan.name}
                </h1>
                <div className="flex gap-2">
                  <button
                    className={`p-2 rounded-full border ${isFav ? "text-red-500 border-red-200" : "text-ink-soft border-border"} hover:scale-105 transition-transform`}
                  >
                    <Heart size={19} fill={isFav ? "currentColor" : "none"} />
                  </button>
                  <button className="px-4 py-2 bg-accent text-white rounded-full text-sm font-semibold hover:bg-[var(--color-accent-strong)] transition-colors">
                    Réserver
                  </button>
                </div>
              </div>
              {artisan.verified && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-accent)] mt-1">
                  ✓ Profil vérifié
                </span>
              )}
              <div className="flex flex-wrap items-center gap-1 text-sm text-ink-soft mt-1.5">
                <span className="flex items-center gap-1">
                  <Star
                    size={15}
                    fill="var(--color-star)"
                    color="var(--color-star)"
                  />{" "}
                  {artisan.rating.toFixed(1)} ({artisan.reviews_count} avis)
                </span>
                <span className="text-[var(--color-border-strong)] mx-1">
                  ·
                </span>
                <span>
                  {CATEGORIES.find((c) => c.id === artisan.category_id)
                    ?.label ?? "Artisan"}
                </span>
                <span className="text-[var(--color-border-strong)] mx-1">
                  ·
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {artisan.city}
                </span>
              </div>
            </div>
          </div>

          {/* Cover */}
          {artisan.cover_url && (
            <div className="rounded-2xl overflow-hidden mb-8 shadow-sm">
              <img
                src={artisan.cover_url}
                alt={artisan.name}
                className="w-full aspect-video object-cover"
              />
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-6 border-b border-border mb-6 overflow-x-auto scrollbar-hide">
            {(["services", "about", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${activeTab === tab ? "text-[var(--color-ink)] border-accent" : "text-ink-faint border-transparent hover:text-[var(--color-ink)]"}`}
              >
                {tab === "services"
                  ? "Services"
                  : tab === "about"
                    ? "À propos"
                    : `Avis (${artisan.reviews_count})`}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === "services" && (
            <>
              <p className="text-ink-soft leading-relaxed mb-8 max-w-prose">
                {artisan.description}
              </p>

              {/* Amenities */}
              <h2 className="font-bold mb-3 text-lg">Commodités</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
                {Object.entries(amenityIcons).map(([key]) => {
                  const available = (artisan as any)[key] ?? false;
                  return (
                    <div
                      key={key}
                      className={`flex flex-col items-center p-4 rounded-xl border text-center ${available ? "border-border" : "opacity-40 line-through"}`}
                    >
                      <Wifi
                        size={22}
                        style={{ color: "var(--color-ink-soft)" }}
                      />
                      <span className="text-xs font-medium mt-2 text-ink-soft">
                        {key === "kids"
                          ? "Enfants"
                          : key.charAt(0).toUpperCase() + key.slice(1)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Services list */}
              <h2 className="font-bold mb-4 text-lg">Services proposés</h2>
              <div className="divide-y divide-[var(--color-border)]">
                {services.map((s) => (
                  <div key={s.id} className="flex items-center gap-4 py-4">
                    <img
                      src={s.image_url ?? artisan.avatar_url ?? ""}
                      alt=""
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{s.name}</h3>
                      <p className="text-sm text-ink-faint mt-0.5">
                        {s.description}
                      </p>
                      <div className="flex items-center gap-4 mt-1.5">
                        <span className="text-sm font-mono font-bold text-[var(--color-accent-strong)]">
                          {s.price
                            ? s.price.toLocaleString("fr-FR") +
                              " " +
                              artisan.currency
                            : "Gratuit"}
                        </span>
                        <span className="text-xs text-ink-faint flex items-center gap-1">
                          <Clock size={14} /> {s.duration_min} min
                        </span>
                      </div>
                    </div>
                    <button className="shrink-0 px-4 py-2 rounded-full bg-bg-sunken text-sm font-semibold hover:bg-accent hover:text-white transition-colors">
                      Réserver
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "about" && (
            <div>
              <p className="text-ink-soft leading-relaxed">
                {artisan.description}
              </p>
              {/* Gallery placeholder */}
            </div>
          )}

          {activeTab === "reviews" && (
            <p className="text-sm text-ink-faint">
              Les avis détaillés seront disponibles après connexion à la base de
              données.
            </p>
          )}
        </div>

        {/* Sidebar */}
        <aside className="bg-bg-elevated border border-border rounded-2xl shadow-sm divide-y divide-[var(--color-border)]">
          {/* Location */}
          <div className="p-5">
            <h3 className="font-bold mb-2">Localisation</h3>
            <p className="text-sm text-ink-soft">{artisan.address}</p>
          </div>
          {/* Hours */}
          <div className="p-5">
            <h3 className="font-bold mb-3">Horaires d'ouverture</h3>
            {hours.map((h) => (
              <div
                key={h.day_index}
                className="flex items-center justify-between text-sm py-1"
              >
                <span className="text-ink-soft">{h.day_label}</span>
                <span className="font-mono text-ink-soft">
                  {h.is_open
                    ? `${h.opens_at?.slice(0, 5)} - ${h.closes_at?.slice(0, 5)}`
                    : "Fermé"}
                </span>
              </div>
            ))}
          </div>
          {/* Payment */}
          <div className="p-5">
            <h3 className="font-bold mb-2">Moyens de paiement</h3>
            <div className="flex flex-wrap gap-2">
              {["Espèces", "Mobile Money", "Virement"].map((m) => (
                <span
                  key={m}
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-bg-sunken"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
          {/* Contact */}
          <div className="p-5">
            <h3 className="font-bold mb-2">Contact</h3>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-sunken hover:bg-[var(--color-border)] transition-colors cursor-pointer">
              <Phone size={17} />
              <span className="text-sm font-medium">{artisan.phone}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
