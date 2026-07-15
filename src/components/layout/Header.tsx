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
      className={`sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border/50 transition-transform duration-300 ${
        headerHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between gap-6">
        <Logo />

        {/* Nav desktop */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-ink-soft">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative py-2 transition-colors hover:text-ink ${
                location.pathname === link.path ? "text-ink" : ""
              }`}
            >
              {link.label}
              {location.pathname === link.path && (
                <span className="absolute left-0 right-0 bottom-0 h-[2.5px] rounded-full bg-accent animate-fade-in-up" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Espace artisan */}
          <Link
            to="/dashboard"
            className="hidden sm:inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-full border border-border-strong text-xs font-bold hover:border-accent hover:bg-accent-soft hover:text-accent transition-all duration-200"
          >
            <Plus size={15} />
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
              <ul className="absolute right-0 top-full mt-2.5 min-w-[180px] bg-bg-elevated border border-border rounded-2xl shadow-md p-1.5 z-50 animate-fade-in-up">
                {LANGUAGES.map((l) => (
                  <li
                    key={l.code}
                    onClick={() => {
                      setLang(l);
                      setLangOpen(false);
                    }}
                    className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm cursor-pointer hover:bg-bg-sunken transition-colors ${
                      lang.code === l.code ? "font-semibold text-accent" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <img
                        src={l.flag}
                        alt=""
                        className="w-[18px] h-[18px] rounded-full object-cover"
                      />
                      {l.name}
                    </span>
                    {lang.code === l.code && (
                      <Check size={14} className="text-accent" />
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
                className="w-10 h-10 rounded-full bg-accent text-white font-bold text-sm flex items-center justify-center hover:bg-accent-strong transition-colors"
              >
                {initials}
              </button>
            ) : (
              <Link
                to="/auth"
                className="px-4.5 py-2 rounded-full border border-border hover:border-accent hover:bg-accent-soft text-sm font-semibold hover:text-accent transition-colors"
              >
                Se connecter
              </Link>
            )}
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2.5 min-w-[200px] bg-bg-elevated border border-border rounded-2xl shadow-md p-1.5 z-50 animate-fade-in-up">
                <Link
                  to="/dashboard"
                  onClick={() => setProfileOpen(false)}
                  className="block px-3.5 py-2 text-sm text-ink-soft hover:text-ink hover:bg-bg-sunken rounded-xl transition-colors"
                >
                  Espace artisan
                </Link>
                <Link
                  to="/appointments"
                  onClick={() => setProfileOpen(false)}
                  className="block px-3.5 py-2 text-sm text-ink-soft hover:text-ink hover:bg-bg-sunken rounded-xl transition-colors"
                >
                  Mes rendez-vous
                </Link>
                <Link
                  to="/messages"
                  onClick={() => setProfileOpen(false)}
                  className="block px-3.5 py-2 text-sm text-ink-soft hover:text-ink hover:bg-bg-sunken rounded-xl transition-colors"
                >
                  Messagerie
                </Link>
                <Link
                  to="/favorites"
                  onClick={() => setProfileOpen(false)}
                  className="block px-3.5 py-2 text-sm text-ink-soft hover:text-ink hover:bg-bg-sunken rounded-xl transition-colors"
                >
                  Favoris
                </Link>
                <div className="my-1 border-t border-border/60" />
                <button
                  onClick={() => {
                    signOut();
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-sm text-danger hover:bg-danger-soft rounded-xl transition-colors"
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
