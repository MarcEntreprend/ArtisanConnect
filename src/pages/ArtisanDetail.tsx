// src/pages/ArtisanDetail.tsx
import { useParams, Link } from "react-router-dom";
import { useArtisan } from "../hooks/useArtisans";
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
const amenityIcons: Record<
  string,
  React.FC<{ size?: number; className?: string }>
> = {
  wifi: Wifi,
  parking: ParkingCircle,
  accessibility: Accessibility,
  kids: Baby,
};

export default function ArtisanDetail() {
  const { id } = useParams<{ id: string }>();
  const { artisan, services, hours, loading } = useArtisan(Number(id));
  const [activeTab, setActiveTab] = useState<"services" | "about" | "reviews">(
    "services",
  );

  const triggerBooking = (serviceId?: number, serviceName?: string) => {
    if (!artisan) return;
    window.dispatchEvent(
      new CustomEvent("openBookingModal", {
        detail: {
          artisanId: artisan.id,
          serviceId: serviceId || null,
          artisanName: artisan.name,
          serviceName: serviceName || "Consultation générale",
          depositPercent: 0,
        },
      }),
    );
  };

  if (loading)
    return (
      <div className="py-24 animate-pulse space-y-4">
        <div className="h-8 bg-(--bg-sunken) rounded w-1/4" />
        <div className="h-64 bg-(--bg-sunken) rounded-3xl w-full" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-10 bg-(--bg-sunken) rounded" />
          <div className="h-10 bg-(--bg-sunken) rounded" />
          <div className="h-10 bg-(--bg-sunken) rounded" />
        </div>
      </div>
    );

  if (!artisan)
    return (
      <div className="text-center py-24">
        <h1 className="text-2xl font-bold text-(--ink)">Artisan introuvable</h1>
        <p className="text-(--ink-faint) mt-2">
          Ce profil n'existe pas ou a été retiré.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 text-(--accent) font-bold hover:underline"
        >
          <ArrowLeft size={16} /> Retour à l'accueil
        </Link>
      </div>
    );

  const isFav = false;

  return (
    <div className="py-4 animate-fade-in-up">
      {/* Back */}
      <Link
        to="/search"
        className="inline-flex items-center gap-2 text-sm font-semibold text-(--ink-soft) hover:text-(--accent) transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Retour aux résultats
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-10">
        {/* Colonne principale */}
        <div>
          {/* Hero */}
          <div className="flex flex-col sm:flex-row items-start gap-5 mb-8">
            <img
              src={
                artisan.avatar_url ||
                "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop"
              }
              alt={artisan.name}
              className="w-24 h-24 rounded-3xl object-cover border-4 border-(--bg-elevated) shadow-(--shadow-sm) shrink-0"
            />
            <div className="flex-1 w-full">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-(--ink)">
                      {artisan.name}
                    </h1>
                    {artisan.verified && (
                      <span
                        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-(--accent-soft) text-(--accent) text-[11px] font-bold shadow-(--shadow-sm)"
                        title="Profil vérifié"
                      >
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-(--accent) mt-0.5">
                    {CATEGORIES.find((c) => c.id === artisan.category_id)
                      ?.label ?? "Artisan"}{" "}
                    · {artisan.city}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                      isFav
                        ? "text-red-500 border-red-200 bg-red-50"
                        : "text-(--ink-soft) border-(--border) hover:bg-(--bg-sunken)"
                    } hover:scale-105`}
                  >
                    <Heart size={18} fill={isFav ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={() => triggerBooking()}
                    className="btn btn-primary px-6 py-2 text-sm font-bold shadow-(--shadow-sm)"
                  >
                    Réserver
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-sm text-(--ink-soft) mt-3">
                <span className="flex items-center gap-1 font-semibold text-(--star) bg-(--accent-soft) px-2.5 py-0.5 rounded-lg">
                  <Star size={13} fill="currentColor" />{" "}
                  {artisan.rating.toFixed(1)}
                </span>
                <span className="text-(--ink-faint)">
                  ({artisan.reviews_count} avis clients)
                </span>
                <span className="text-(--border-strong) mx-1.5">·</span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="text-(--ink-faint)" />{" "}
                  {artisan.city || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Cover */}
          {artisan.cover_url && (
            <div className="rounded-3xl overflow-hidden mb-8 shadow-(--shadow-sm) aspect-21/9">
              <img
                src={artisan.cover_url}
                alt={artisan.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex gap-6 border-b border-(--border) mb-6 overflow-x-auto scrollbar-hide">
            {(["services", "about", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3.5 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab
                    ? "text-(--ink) border-(--accent)"
                    : "text-(--ink-faint) border-transparent hover:text-(--ink)"
                }`}
              >
                {tab === "services"
                  ? "Services & Tarifs"
                  : tab === "about"
                    ? "À propos"
                    : `Avis (${artisan.reviews_count})`}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === "services" && (
            <div className="space-y-10">
              <div>
                <h2 className="font-extrabold text-sm text-(--ink) uppercase tracking-wider mb-3">
                  Description
                </h2>
                <p className="text-(--ink-soft) leading-relaxed max-w-prose">
                  {artisan.description ||
                    "Aucune description fournie par l'artisan."}
                </p>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="font-extrabold text-sm text-(--ink) uppercase tracking-wider mb-4">
                  Commodités de l'atelier
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.entries(amenityIcons).map(([key, Icon]) => {
                    const available =
                      (artisan as any)[key] ??
                      (artisan as any).amenities?.[key] ??
                      false;
                    return (
                      <div
                        key={key}
                        className={`flex flex-col items-center justify-center p-5 rounded-2xl border text-center transition-all ${
                          available
                            ? "border-(--border) bg-(--bg-elevated) text-(--ink-soft) shadow-(--shadow-sm)"
                            : "border-(--border)/30 opacity-40 bg-(--bg-sunken)/10 line-through text-(--ink-faint)"
                        }`}
                      >
                        <Icon
                          size={24}
                          className={
                            available ? "text-(--accent)" : "text-(--ink-faint)"
                          }
                        />
                        <span className="text-xs font-semibold mt-2.5">
                          {key === "kids"
                            ? "Enfants bienvenus"
                            : key === "wifi"
                              ? "WiFi gratuit"
                              : key === "parking"
                                ? "Parking"
                                : "Accessibilité"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Services list */}
              <div>
                <h2 className="font-extrabold text-sm text-(--ink) uppercase tracking-wider mb-4">
                  Services proposés
                </h2>
                {services.length === 0 ? (
                  <p className="text-sm text-(--ink-faint) italic py-4">
                    Aucun service spécifique renseigné pour le moment.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {services.map((s) => (
                      <div
                        key={s.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-(--border) bg-(--bg-elevated) hover:border-(--border-strong) hover:shadow-(--shadow-sm) transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={
                              s.image_url ||
                              artisan.avatar_url ||
                              "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop"
                            }
                            alt=""
                            className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-(--border)/50"
                          />
                          <div className="min-w-0">
                            <h3 className="font-bold text-(--ink) text-base">
                              {s.name}
                            </h3>
                            <p className="text-xs text-(--ink-soft) mt-1 leading-relaxed max-w-md">
                              {s.description ||
                                "Aucune description supplémentaire."}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-(--ink-faint)">
                              <span className="flex items-center gap-1 font-mono font-bold text-(--accent-strong)">
                                {s.price
                                  ? s.price.toLocaleString("fr-FR") +
                                    " " +
                                    artisan.currency
                                  : "Devis gratuit"}
                              </span>
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                <Clock size={13} /> {s.duration_min} min
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => triggerBooking(s.id, s.name)}
                          className="btn btn-outline py-2 px-5 text-xs font-bold"
                        >
                          Réserver
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <div className="bg-(--bg-elevated) border border-(--border) rounded-3xl p-6 shadow-(--shadow-sm) space-y-4">
              <h2 className="font-extrabold text-sm text-(--ink) uppercase tracking-wider">
                À propos de {artisan.name}
              </h2>
              <p className="text-(--ink-soft) leading-relaxed max-w-prose">
                {artisan.description || "Aucune description disponible."}
              </p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="bg-(--bg-elevated) border border-(--border) rounded-3xl p-8 text-center shadow-(--shadow-sm)">
              <Star size={36} className="text-(--star)/40 mx-auto mb-3" />
              <h3 className="font-bold text-lg text-(--ink)">
                Avis des clients
              </h3>
              <p className="text-sm text-(--ink-soft) mt-1 max-w-md mx-auto leading-relaxed">
                Les avis détaillés et notes laissés par les clients ayant
                réservé sur ArtisanConnect s'afficheront ici.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="bg-(--bg-elevated) border border-(--border) rounded-3xl shadow-(--shadow-sm) p-6 space-y-6 self-start">
          <div>
            <h3 className="font-extrabold text-xs text-(--ink) uppercase tracking-wider mb-2">
              Localisation
            </h3>
            <p className="text-sm text-(--ink-soft) flex items-start gap-1.5 leading-relaxed">
              <MapPin
                size={16}
                className="text-(--ink-faint) shrink-0 mt-0.5"
              />
              <span>
                {artisan.address || "Adresse non spécifiée, " + artisan.city}
              </span>
            </p>
          </div>

          <div className="border-t border-(--border)/60 pt-6">
            <h3 className="font-extrabold text-xs text-(--ink) uppercase tracking-wider mb-3">
              Horaires d'ouverture
            </h3>
            <div className="space-y-2">
              {hours.length === 0 ? (
                <p className="text-xs text-(--ink-faint) italic">
                  Horaires non disponibles.
                </p>
              ) : (
                hours.map((h) => (
                  <div
                    key={h.day_index}
                    className="flex items-center justify-between text-xs py-0.5"
                  >
                    <span className="font-semibold text-(--ink-soft)">
                      {h.day_label}
                    </span>
                    <span
                      className={`font-mono ${h.is_open ? "text-(--accent) font-semibold" : "text-(--ink-faint)"}`}
                    >
                      {h.is_open
                        ? `${h.opens_at?.slice(0, 5)} - ${h.closes_at?.slice(0, 5)}`
                        : "Fermé"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-t border-(--border)/60 pt-6">
            <h3 className="font-extrabold text-xs text-(--ink) uppercase tracking-wider mb-3">
              Moyens de paiement
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {["Espèces", "Mobile Money", "Virement bancaire"].map((m) => (
                <span
                  key={m}
                  className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-(--bg-sunken) text-(--ink-soft) border border-(--border)/40"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-(--border)/60 pt-6">
            <h3 className="font-extrabold text-xs text-(--ink) uppercase tracking-wider mb-3">
              Contact direct
            </h3>
            <a
              href={`tel:${artisan.phone || ""}`}
              className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-(--accent-soft) text-(--accent) hover:bg-(--accent) hover:text-(--accent-ink) transition-all font-bold text-xs uppercase tracking-wider"
            >
              <Phone size={14} />
              <span>{artisan.phone || "Non renseigné"}</span>
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
