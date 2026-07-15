// src/pages/Favorites.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import type { Artisan } from "../lib/types";

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
      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-ink-faint">
        Chargement…
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold">Mes favoris</h1>
      <p className="text-sm text-ink-faint mt-1">
        {message || "Retrouvez ici les artisans que vous avez enregistrés."}
      </p>
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center text-center py-24 border border-dashed border-[var(--color-border-strong)] rounded-2xl mt-6">
          <Heart size={48} className="text-ink-faint mb-4" />
          <h3 className="font-bold text-lg">Aucun favori pour l'instant</h3>
          <p className="text-sm text-ink-soft mt-1">
            Ajoutez des artisans à vos favoris en cliquant sur le cœur de leur
            profil.
          </p>
          <Link to="/search" className="btn btn-primary mt-6">
            Découvrir des artisans
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {favorites.map((a) => (
            <Link key={a.id} to={`/artisan/${a.id}`} className="artisan-card">
              <div className="artisan-card-media">
                <img src={a.avatar_url || ""} alt={a.name} />
              </div>
              <div className="artisan-card-body">
                <h3 className="font-semibold">{a.name}</h3>
                <p className="text-sm text-ink-faint">{a.city}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
