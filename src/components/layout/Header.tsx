// src/components/layout/Header.tsx

import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus, X, Menu } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

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
  const [mobileOpen, setMobileOpen] = useState(false);
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

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest(".language-wrapper")) setLangOpen(false);
      if (!t.closest(".profile-wrapper")) setProfileOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const initials =
    user?.full_name
      ?.split(" ")
      .map((w: string) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??";

  return (
    <>
      <header className={`header ${headerHidden ? "header-hidden" : ""}`}>
        <div className="container header-content">
          <a href="/" className="logo-container">
            <span className="logo-mark">AC</span>
            <span className="logo-text">ArtisanConnect</span>
          </a>

          <nav className="header-nav" aria-label="Navigation principale">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={active ? "active" : ""}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="header-actions">
            <Link to="/dashboard" className="artisan-cta">
              <Plus size={16} strokeWidth={2} />
              Espace artisan
            </Link>

            <button
              className="theme-switch"
              type="button"
              role="switch"
              onClick={toggleTheme}
              aria-label="Changer de thème"
            >
              <span className="theme-switch-track">
                <span
                  className={`theme-switch-icon sun ${isDark ? "" : "active"}`}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                </span>
                <span
                  className={`theme-switch-icon moon ${isDark ? "active" : ""}`}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                </span>
              </span>
            </button>

            <div className="language-wrapper">
              <button
                className="lang-trigger"
                onClick={(e) => {
                  e.stopPropagation();
                  setLangOpen(!langOpen);
                }}
              >
                <img src={lang.flag} alt="" className="lang-flag-img" />
                <span className="lang-text">{lang.short}</span>
              </button>
              {langOpen && (
                <ul className="lang-dropdown open">
                  {LANGUAGES.map((l) => (
                    <li
                      key={l.code}
                      className={lang.code === l.code ? "active" : ""}
                      onClick={() => {
                        setLang(l);
                        setLangOpen(false);
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <img src={l.flag} alt="" className="lang-flag-img" />
                        <span className="lang-name">{l.name}</span>
                      </span>
                      <svg
                        className={`lang-check ${lang.code === l.code ? "active" : ""}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="profile-wrapper">
              {user ? (
                <button
                  className="profile-trigger"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileOpen(!profileOpen);
                  }}
                >
                  <span>{initials}</span>
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="btn btn-outline"
                  style={{ padding: "0.4rem 1rem" }}
                >
                  Se connecter
                </Link>
              )}
              {profileOpen && (
                <div className="profile-dropdown open">
                  <Link to="/dashboard" onClick={() => setProfileOpen(false)}>
                    Espace artisan
                  </Link>
                  <Link
                    to="/appointments"
                    onClick={() => setProfileOpen(false)}
                  >
                    Mes rendez-vous
                  </Link>
                  <Link to="/messages" onClick={() => setProfileOpen(false)}>
                    Messagerie
                  </Link>
                  <Link to="/favorites" onClick={() => setProfileOpen(false)}>
                    Favoris
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setProfileOpen(false);
                    }}
                  >
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>

            {/* Burger mobile */}
            <button
              className="icon-btn lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? (
                <X size={18} strokeWidth={2.5} />
              ) : (
                <Menu size={18} strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 lg:hidden bg-(--bg)/98 backdrop-blur-2xl flex flex-col">
          <div className="h-17 flex items-center justify-between px-5 border-b border-(--border)">
            <a href="/" className="logo-container">
              <span className="logo-mark">AC</span>
              <span className="logo-text">ArtisanConnect</span>
            </a>
            <button className="icon-btn" onClick={() => setMobileOpen(false)}>
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>
          <nav className="flex-1 flex flex-col justify-center px-8 gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-5 py-4 rounded-2xl text-xl font-bold ${location.pathname === link.path ? "bg-(--accent-soft) text-(--accent-strong)" : "text-(--ink-soft) hover:bg-(--bg-sunken)"}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="px-8 py-8 border-t border-(--border)">
            <Link
              to="/dashboard"
              className="btn btn-primary w-full justify-center text-sm"
            >
              <Plus size={15} />
              Espace artisan
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
