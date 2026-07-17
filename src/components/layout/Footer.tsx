// src/components/layout/Footer.tsx

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      className="border-t border-(--border) bg-(--bg-sunken) pt-14 pb-6 mt-6"
      style={{ paddingTop: "5rem" }}
    >
      <div
        className="max-w-7xl mx-auto px-4 md:px-10"
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "1.25rem",
          paddingRight: "1.25rem",
        }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.4fr] gap-6 mb-8">
          {/* Brand */}
          <div className="flex flex-col gap-[0.9rem]">
            <div className="flex items-center gap-[0.55rem] font-bold">
              <img
                src="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2224%22 fill=%22%232f6b4f%22/><text x=%2250%22 y=%2266%22 font-size=%2252%22 fill=%22white%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-weight=%22800%22>AC</text></svg>"
                alt="ArtisanConnect"
                className="w-8.5 h-8.5 rounded-(--r-sm)"
              />
              <span>ArtisanConnect</span>
            </div>
            <p className="text-[0.85rem] text-(--ink-soft) leading-[1.55] max-w-[32ch]">
              La plateforme qui connecte les artisans locaux à leurs clients, un
              rendez-vous à la fois.
            </p>
            <div className="flex gap-[0.6rem] mt-[0.3rem]">
              <a href="#" className="social-link" aria-label="Facebook">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  width="16"
                  height="16"
                >
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  width="16"
                  height="16"
                >
                  <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  width="16"
                  height="16"
                >
                  <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
                </svg>
              </a>
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
            <Link to="/auth" className="learn-more">
              Inscrire mon activité →
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between mt-10 pt-6 border-t border-(--border) text-[0.78rem] text-(--ink-faint)">
          <p>© 2026 ArtisanConnect. Tous droits réservés.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="back-to-top"
            aria-label="Retourner en haut de la page"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="16"
              height="16"
            >
              <path d="m4 12 1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8z" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
