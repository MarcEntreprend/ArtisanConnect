// src/components/layout/Footer.tsx

import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import Logo from "../ui/Logo";

export default function Footer() {
  return (
    <footer className="bg-bg-sunken/50 border-t border-border/80 mt-32 pb-24 lg:pb-12 text-ink-soft">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Logo />
            <p className="text-sm leading-relaxed">
              La plateforme qui connecte les artisans locaux d'Haïti à leurs clients, un
              rendez-vous à la fois.
            </p>
          </div>

          {/* Accès rapide */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-ink">Accès rapide</h3>
            <ul className="space-y-2 text-sm text-ink-soft">
              <li>
                <Link
                  to="/"
                  className="hover:text-accent transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="hover:text-accent transition-colors"
                >
                  Trouver un artisan
                </Link>
              </li>
              <li>
                <Link
                  to="/appointments"
                  className="hover:text-accent transition-colors"
                >
                  Mes rendez-vous
                </Link>
              </li>
              <li>
                <Link
                  to="/favorites"
                  className="hover:text-accent transition-colors"
                >
                  Favoris
                </Link>
              </li>
              <li>
                <Link
                  to="/messages"
                  className="hover:text-accent transition-colors"
                >
                  Messagerie
                </Link>
              </li>
            </ul>
          </div>

          {/* Plus */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-ink">Plus</h3>
            <ul className="space-y-2 text-sm text-ink-soft">
              <li>
                <a
                  href="#"
                  className="hover:text-accent transition-colors"
                >
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-accent transition-colors"
                >
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <button className="hover:text-accent transition-colors">
                  Préférences des cookies
                </button>
              </li>
            </ul>
          </div>

          {/* Artisan */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-ink">
              Vous êtes un artisan ?
            </h3>
            <p className="text-sm text-ink-soft mb-4 leading-relaxed">
              Créez votre vitrine, gérez vos disponibilités et recevez des
              réservations en ligne.
            </p>
            <Link
              to="/auth"
              className="text-sm font-semibold text-accent hover:underline inline-flex items-center gap-1"
            >
              Inscrire mon activité →
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between mt-16 pt-8 border-t border-border/80 text-xs text-ink-faint">
          <p>© 2026 ArtisanConnect. Tous droits réservés.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-bg hover:text-accent hover:border-accent-strong transition-all duration-200"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
