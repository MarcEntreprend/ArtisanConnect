// src/components/layout/Footer.tsx

import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import Logo from "../ui/Logo";

export default function Footer() {
  return (
    <footer className="bg-bg-sunken border-t border-border mt-24 pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Logo />
            <p className="mt-3 text-sm text-ink-soft leading-relaxed">
              La plateforme qui connecte les artisans locaux à leurs clients, un
              rendez-vous à la fois.
            </p>
          </div>

          {/* Accès rapide */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Accès rapide</h3>
            <ul className="space-y-2 text-sm text-ink-soft">
              <li>
                <Link
                  to="/"
                  className="hover:text-[var(--color-ink)] transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="hover:text-[var(--color-ink)] transition-colors"
                >
                  Trouver un artisan
                </Link>
              </li>
              <li>
                <Link
                  to="/appointments"
                  className="hover:text-[var(--color-ink)] transition-colors"
                >
                  Mes rendez-vous
                </Link>
              </li>
              <li>
                <Link
                  to="/favorites"
                  className="hover:text-[var(--color-ink)] transition-colors"
                >
                  Favoris
                </Link>
              </li>
              <li>
                <Link
                  to="/messages"
                  className="hover:text-[var(--color-ink)] transition-colors"
                >
                  Messagerie
                </Link>
              </li>
            </ul>
          </div>

          {/* Plus */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Plus</h3>
            <ul className="space-y-2 text-sm text-ink-soft">
              <li>
                <a
                  href="#"
                  className="hover:text-[var(--color-ink)] transition-colors"
                >
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[var(--color-ink)] transition-colors"
                >
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <button className="hover:text-[var(--color-ink)] transition-colors">
                  Préférences des cookies
                </button>
              </li>
            </ul>
          </div>

          {/* Artisan */}
          <div>
            <h3 className="font-semibold text-sm mb-3">
              Vous êtes un artisan ?
            </h3>
            <p className="text-sm text-ink-soft mb-3">
              Créez votre vitrine, gérez vos disponibilités et recevez des
              réservations en ligne.
            </p>
            <Link
              to="/auth"
              className="text-sm font-medium text-[var(--color-accent)] hover:underline"
            >
              Inscrire mon activité →
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border text-xs text-ink-faint">
          <p>© 2026 ArtisanConnect. Tous droits réservés.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-bg transition-colors"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
