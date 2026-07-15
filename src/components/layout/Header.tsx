// src/components/layout/Header.tsx

import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus, Check } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import Logo from "../ui/Logo";
import ThemeToggle from "../ui/ThemeToggle";

const NAV_LINKS = [
  { path: "/", label: "Accueil" },
  { path: "/search", label: "Trouver un artisan" },
  { path: "/appointments", label: "Mes rendez-vous" },
  { path: "/favorites", label: "Favoris" },
  { path: "/messages", label: "Messagerie" },
];

const LANGUAGES = [
  {
    code: "fr-FR",
    short: "FR",
    name: "Français",
    flag: "https://flagcdn.com/w40/fr.png",
  },
  {
    code: "en-US",
    short: "EN",
    name: "English",
    flag: "https://flagcdn.com/w40/gb.png",
  },
  {
    code: "pt-BR",
    short: "PT",
    name: "Português",
    flag: "https://flagcdn.com/w40/pt.png",
  },
];

export default function Header() {
  const { user, signOut } = useAuth();
  const { isDark, toggle: toggleTheme } = useTheme();
  const location = useLocation();

  const [lang, setLang] = useState(LANGUAGES[0]);
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);

  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHeaderHidden(y > 80 && y > lastScrollY.current);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const initials =
    user?.full_name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??";

  return (
    <header
      className={`sticky top-0 z-50 bg-bg/90 backdrop-blur-md border-b border-border transition-transform duration-300 ${
        headerHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-[68px] flex items-center justify-between gap-6">
        <Logo />

        {/* Nav desktop */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-ink-soft">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative transition-colors hover:text-[var(--color-ink)] ${
                location.pathname === link.path ? "text-ink" : ""
              }`}
            >
              {link.label}
              {location.pathname === link.path && (
                <span className="absolute left-0 right-0 -bottom-5 h-[2px] bg-accent" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Espace artisan */}
          <Link
            to="/dashboard"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[var(--color-border-strong)] text-sm font-semibold hover:border-accent hover:bg-[var(--color-accent-soft)] transition-colors"
          >
            <Plus size={16} />
            Espace artisan
          </Link>

          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />

          {/* Langue */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-full text-xs font-semibold hover:bg-bg-sunken transition-colors"
            >
              <img
                src={lang.flag}
                alt=""
                className="w-4.5 h-4.5 rounded-full object-cover"
              />
              <span>{lang.short}</span>
            </button>
            {langOpen && (
              <ul className="absolute right-0 top-full mt-2 min-w-[180px] bg-bg-elevated border border-border rounded-xl shadow-lg p-1 z-50">
                {LANGUAGES.map((l) => (
                  <li
                    key={l.code}
                    onClick={() => {
                      setLang(l);
                      setLangOpen(false);
                    }}
                    className={`flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-sm cursor-pointer hover:bg-bg-sunken transition-colors ${
                      lang.code === l.code ? "font-semibold" : ""
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <img
                        src={l.flag}
                        alt=""
                        className="w-[18px] h-[18px] rounded-full"
                      />
                      {l.name}
                    </span>
                    {lang.code === l.code && (
                      <Check size={16} className="text-[var(--color-accent)]" />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Profil */}
          <div className="relative">
            {user ? (
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-[38px] h-[38px] rounded-full bg-accent text-white font-bold text-sm flex items-center justify-center hover:opacity-85 transition-opacity"
              >
                {initials}
              </button>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-bg-sunken transition-colors"
              >
                Se connecter
              </Link>
            )}
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 min-w-[200px] bg-bg-elevated border border-border rounded-xl shadow-lg p-1 z-50">
                <Link
                  to="/dashboard"
                  onClick={() => setProfileOpen(false)}
                  className="block px-3 py-2 text-sm hover:bg-bg-sunken rounded-lg"
                >
                  Espace artisan
                </Link>
                <Link
                  to="/appointments"
                  onClick={() => setProfileOpen(false)}
                  className="block px-3 py-2 text-sm hover:bg-bg-sunken rounded-lg"
                >
                  Mes rendez-vous
                </Link>
                <Link
                  to="/messages"
                  onClick={() => setProfileOpen(false)}
                  className="block px-3 py-2 text-sm hover:bg-bg-sunken rounded-lg"
                >
                  Messagerie
                </Link>
                <Link
                  to="/favorites"
                  onClick={() => setProfileOpen(false)}
                  className="block px-3 py-2 text-sm hover:bg-bg-sunken rounded-lg"
                >
                  Favoris
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-bg-sunken rounded-lg"
                >
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
