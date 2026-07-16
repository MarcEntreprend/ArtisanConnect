// src/components/layout/Footer.tsx

import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="border-t border-(--border) bg-(--bg-sunken) pb-6 mt-6"
      style={{ paddingTop: "4rem" }}
    >
      <div
        className="max-w-7xl mx-auto px-4 md:px-10"
        style={{ marginLeft: "auto", marginRight: "auto" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.4fr] gap-10 mb-8">
          {/* Brand */}
          <div className="flex flex-col gap-[0.9rem]">
            <div className="flex items-center gap-[0.55rem] font-bold">
              <img
                src="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2224%22 fill=%22%232f6b4f%22/><text x=%2250%22 y=%2266%22 font-size=%2252%22 fill=%22white%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-weight=%22800%22>AC</text></svg>"
                alt=""
                className="w-8.5 h-8.5 rounded-(--r-sm)"
              />
              <span>ArtisanConnect</span>
            </div>
            <p className="text-[0.85rem] text-(--ink-soft) leading-[1.55] max-w-[32ch]">
              La plateforme qui connecte les artisans locaux à leurs clients, un
              rendez-vous à la fois.
            </p>
            <div className="flex gap-[0.6rem] mt-[0.3rem]">
              {["facebook", "instagram", "youtube"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 rounded-full border border-(--border) flex items-center justify-center hover:border-(--accent) hover:bg-(--accent-soft) transition-colors"
                >
                  <span className="text-xs font-bold uppercase">{s[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Accès rapide */}
          <div>
            <h3 className="text-[0.82rem] font-bold mb-4">Accès rapide</h3>
            <ul className="flex flex-col gap-[0.65rem] text-[0.85rem] text-(--ink-soft)">
              <li>
                <Link to="/" className="hover:text-(--ink) transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="hover:text-(--ink) transition-colors"
                >
                  Trouver un artisan
                </Link>
              </li>
              <li>
                <Link
                  to="/appointments"
                  className="hover:text-(--ink) transition-colors"
                >
                  Mes rendez-vous
                </Link>
              </li>
              <li>
                <Link
                  to="/favorites"
                  className="hover:text-(--ink) transition-colors"
                >
                  Favoris
                </Link>
              </li>
              <li>
                <Link
                  to="/messages"
                  className="hover:text-(--ink) transition-colors"
                >
                  Messagerie
                </Link>
              </li>
            </ul>
          </div>

          {/* Plus */}
          <div>
            <h3 className="text-[0.82rem] font-bold mb-4">Plus</h3>
            <ul className="flex flex-col gap-[0.65rem] text-[0.85rem] text-(--ink-soft)">
              <li>
                <a href="#" className="hover:text-(--ink) transition-colors">
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-(--ink) transition-colors">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <button className="hover:text-(--ink) transition-colors">
                  Préférences des cookies
                </button>
              </li>
            </ul>
          </div>

          {/* Artisan */}
          <div>
            <h3 className="text-[0.82rem] font-bold mb-4">
              Vous êtes un artisan ?
            </h3>
            <p className="text-[0.82rem] text-(--ink-soft) leading-normal mb-[0.6rem]">
              Créez votre vitrine, gérez vos disponibilités et recevez des
              réservations en ligne.
            </p>
            <Link
              to="/auth"
              className="text-[0.85rem] font-semibold text-(--accent) hover:underline"
            >
              Inscrire mon activité →
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-between pt-6 border-t border-(--border) text-[0.8rem] text-(--ink-faint)">
          <p>© 2026 ArtisanConnect. Tous droits réservés.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-9.5 h-9.5 rounded-full border border-(--border) flex items-center justify-center hover:-translate-y-0.5 hover:border-(--accent) transition-all"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
