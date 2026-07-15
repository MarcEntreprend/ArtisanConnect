// src/components/layout/Header.tsx

import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus, Check, X, Menu } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import Logo from "../ui/Logo";
import ThemeToggle from "../ui/ThemeToggle";

const NAV_LINKS = [
  { path: "/", label: "Accueil" },
  { path: "/search", label: "Trouver un artisan" },
  { path: "/appointments", label: "Rendez-vous" },
  { path: "/favorites", label: "Favoris" },
  { path: "/messages", label: "Messages" },
];

const LANGUAGES = [
  { code: "fr-FR", short: "FR", name: "Français", flag: "https://flagcdn.com/w40/fr.png" },
  { code: "en-US", short: "EN", name: "English", flag: "https://flagcdn.com/w40/gb.png" },
  { code: "ht-HT", short: "HT", name: "Kreyòl", flag: "https://flagcdn.com/w40/ht.png" },
];

export default function Header() {
  const { user, signOut } = useAuth();
  const { isDark, toggle: toggleTheme } = useTheme();
  const location = useLocation();

  const [lang, setLang] = useState(LANGUAGES[0]);
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      setHeaderHidden(y > 100 && y > lastScrollY.current);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fermer les dropdowns au clic extérieur
  useEffect(() => {
    const close = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest(".lang-wrapper")) setLangOpen(false);
      if (!t.closest(".profile-wrapper")) setProfileOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  // Verrouiller le scroll quand menu mobile ouvert
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Fermer menu mobile à la navigation
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const initials =
    user?.full_name?.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2) || "??";

  return (
    <>
      <header
        className={`
          sticky top-0 z-40
          transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${headerHidden ? "-translate-y-full" : "translate-y-0"}
          ${scrolled
            ? "bg-[var(--bg)]/90 backdrop-blur-xl border-b border-[var(--border)]/60 shadow-[0_1px_0_var(--border)]"
            : "bg-transparent border-b border-transparent"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-10 h-[68px] flex items-center justify-between gap-4">

          {/* Logo */}
          <Logo />

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300
                    ${active
                      ? "text-[var(--ink)] bg-[var(--bg-sunken)]"
                      : "text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--bg-sunken)]"
                    }
                  `}
                >
                  {link.label}
                  {active && (
                    <span
                      className="absolute inset-x-3 -bottom-[1px] h-[2px] rounded-full bg-[var(--accent)] animate-fade-in"
                      style={{ animation: "fadeIn 0.3s ease both" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions droite */}
          <div className="flex items-center gap-2">
            {/* CTA Espace artisan — desktop only */}
            <Link
              to="/dashboard"
              className="
                hidden sm:inline-flex items-center gap-1.5
                px-4 py-2 rounded-full
                border border-[var(--border-strong)]
                text-xs font-bold text-[var(--ink-soft)]
                hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]
                transition-all duration-300
              "
            >
              <Plus size={13} strokeWidth={2.5} />
              Espace artisan
            </Link>

            {/* Theme toggle */}
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />

            {/* Sélecteur de langue */}
            <div className="relative lang-wrapper">
              <button
                onClick={(e) => { e.stopPropagation(); setLangOpen(!langOpen); }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold text-[var(--ink-soft)] hover:bg-[var(--bg-sunken)] transition-colors"
              >
                <img src={lang.flag} alt="" className="w-4 h-4 rounded-full object-cover" />
                {lang.short}
              </button>
              {langOpen && (
                <ul className="
                  absolute right-0 top-full mt-2 min-w-[172px]
                  bg-[var(--bg-elevated)] border border-[var(--border)]
                  rounded-2xl shadow-[var(--shadow-lg)] p-1.5 z-50
                  animate-slide-down
                ">
                  {LANGUAGES.map((l) => (
                    <li
                      key={l.code}
                      onClick={() => { setLang(l); setLangOpen(false); }}
                      className={`
                        flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm cursor-pointer transition-colors
                        ${lang.code === l.code
                          ? "bg-[var(--accent-soft)] text-[var(--accent)] font-semibold"
                          : "text-[var(--ink-soft)] hover:bg-[var(--bg-sunken)] hover:text-[var(--ink)]"
                        }
                      `}
                    >
                      <span className="flex items-center gap-2">
                        <img src={l.flag} alt="" className="w-4 h-4 rounded-full object-cover" />
                        {l.name}
                      </span>
                      {lang.code === l.code && <Check size={13} className="text-[var(--accent)]" />}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Profil / Connexion */}
            <div className="relative profile-wrapper">
              {user ? (
                <button
                  onClick={(e) => { e.stopPropagation(); setProfileOpen(!profileOpen); }}
                  className="
                    w-9 h-9 rounded-full bg-[var(--accent)] text-white
                    font-bold text-xs flex items-center justify-center
                    hover:bg-[var(--accent-strong)] transition-colors
                    ring-2 ring-[var(--accent-soft)] hover:ring-[var(--accent)]/40
                  "
                >
                  {initials}
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="
                    px-4 py-2 rounded-full text-sm font-semibold
                    bg-[var(--ink)] text-[var(--bg)]
                    hover:bg-[var(--ink-soft)]
                    transition-colors duration-300
                  "
                >
                  Se connecter
                </Link>
              )}
              {profileOpen && (
                <div className="
                  absolute right-0 top-full mt-2 min-w-[210px]
                  bg-[var(--bg-elevated)] border border-[var(--border)]
                  rounded-2xl shadow-[var(--shadow-lg)] p-1.5 z-50
                  animate-slide-down
                ">
                  {[
                    { to: "/dashboard", label: "Espace artisan" },
                    { to: "/appointments", label: "Mes rendez-vous" },
                    { to: "/messages", label: "Messagerie" },
                    { to: "/favorites", label: "Favoris" },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setProfileOpen(false)}
                      className="block px-3.5 py-2.5 text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--bg-sunken)] rounded-xl transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="my-1 border-t border-[var(--border)]" />
                  <button
                    onClick={() => { signOut(); setProfileOpen(false); }}
                    className="w-full text-left px-3.5 py-2.5 text-sm text-[var(--danger)] hover:bg-[var(--danger-soft)] rounded-xl transition-colors"
                  >
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>

            {/* Burger mobile */}
            <button
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-[var(--bg-sunken)] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen
                ? <X size={18} strokeWidth={2.5} />
                : <Menu size={18} strokeWidth={2.5} />
              }
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile — overlay plein écran */}
      {mobileOpen && (
        <div
          className="
            fixed inset-0 z-30 lg:hidden
            bg-[var(--bg)]/98 backdrop-blur-2xl
            flex flex-col
          "
          style={{ animation: "fadeIn 0.25s ease both" }}
        >
          <div className="h-[68px] flex items-center justify-between px-5 border-b border-[var(--border)]">
            <Logo />
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[var(--bg-sunken)] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>
          <nav className="flex-1 flex flex-col justify-center px-8 gap-2">
            {NAV_LINKS.map((link, i) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    px-5 py-4 rounded-2xl text-xl font-bold transition-all duration-300
                    animate-fade-up
                    ${active
                      ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "text-[var(--ink-soft)] hover:bg-[var(--bg-sunken)] hover:text-[var(--ink)]"
                    }
                  `}
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="px-8 py-8 border-t border-[var(--border)]">
            <Link
              to="/dashboard"
              className="btn btn-primary w-full justify-center text-sm"
            >
              <Plus size={15} strokeWidth={2.5} />
              Espace artisan
            </Link>
          </div>
        </div>
      )}
    </>
  );
}