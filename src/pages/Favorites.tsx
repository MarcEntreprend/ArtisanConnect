import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, MapPin } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import type { Artisan } from "../lib/types";
import { CATEGORIES } from "../lib/constants";

function formatPrice(amount: number | null, currency: string) {
  if (!amount) return "Devis gratuit";
  return `dès ${amount.toLocaleString("fr-FR")} ${currency}`;
}

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      const ids: number[] = JSON.parse(
        localStorage.getItem("favorites") || "[]",
      );
      setMessage(
        ids.length
          ? `${ids.length} favori(s) en local · Connectez-vous pour les sauvegarder.`
          : "Connectez-vous pour synchroniser vos favoris.",
      );
      setFavorites([]);
      setLoading(false);
      return;
    }

    supabase
      .from("favorites")
      .select("artisan_id, artisans(*)")
      .eq("user_id", user.id)
      .then(({ data, error }) => {
        if (!error && data) {
          const ids = data.map((f) => f.artisan_id);
          localStorage.setItem("favorites", JSON.stringify(ids));
          const artisans = data
            .filter((f) => f.artisans)
            .map((f) => f.artisans as unknown as Artisan);
          setFavorites(artisans);
          setMessage(artisans.length ? "" : "Aucun favori pour le moment.");
        }
        setLoading(false);
      });
  }, [user]);

  if (loading)
    return (
      <div className="py-24 text-center text-ink-faint animate-pulse">
        Chargement de vos favoris…
      </div>
    );

  return (
    <div className="py-4 animate-fade-in-up">
      <div className="border-b border-border/40 pb-6 mt-6">
        <h1 className="text-3xl font-extrabold text-ink">Mes favoris</h1>
        <p className="text-sm text-ink-faint mt-1">
          {message || "Retrouvez ici les artisans que vous avez enregistrés."}
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center text-center py-20 border border-dashed border-border-strong rounded-3xl mt-8 bg-bg-elevated/40">
          <Heart size={48} className="text-ink-faint mb-4 stroke-[1.5px]" />
          <h3 className="font-bold text-lg text-ink">Aucun favori pour l'instant</h3>
          <p className="text-sm text-ink-soft mt-1 max-w-sm leading-relaxed">
            Ajoutez des artisans à vos favoris en cliquant sur le cœur de leur profil pour les retrouver facilement.
          </p>
          <Link to="/search" className="btn btn-primary mt-6">
            Découvrir des artisans
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {favorites.map((a) => {
            const category = CATEGORIES.find((c) => c.id === a.category_id);
            return (
              <Link
                key={a.id}
                to={`/artisan/${a.id}`}
                className="artisan-card"
              >
                <div className="artisan-card-media">
                  <img src={a.avatar_url || ""} alt={a.name} loading="lazy" />
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
                    className="absolute top-3 right-3 w-8.5 h-8.5 rounded-full bg-bg-elevated/95 flex items-center justify-center text-danger shadow-sm hover:scale-105 transition-transform"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <Heart size={15} fill="currentColor" />
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
                      <div className="flex items-center gap-1 text-sm font-semibold text-ochre flex-shrink-0 bg-ochre-soft px-2 py-0.5 rounded-lg">
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
                      {a.reviews_count} avis clients
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
  );
}
