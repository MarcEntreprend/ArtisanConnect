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
      if (!t.closest(".lang-wrapper")) setLangOpen(false);
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
      <header
        className={`sticky top-0 z-40 bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-[14px] border-b border-[var(--border)] transition-transform duration-300 ${
          headerHidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div
          className="max-w-7xl mx-auto px-4 md:px-10 h-[68px] flex items-center justify-between gap-6"
          style={{ marginLeft: "auto", marginRight: "auto" }}
        >
          <Logo />

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-8 text-[0.9rem] font-medium text-[var(--ink-soft)]">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative transition-colors hover:text-[var(--ink)] ${
                    active ? "text-[var(--ink)]" : ""
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute left-0 right-0 -bottom-[20px] h-[2px] bg-[var(--accent)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Espace artisan */}
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-[0.55rem] py-[0.55rem] rounded-full border border-[var(--border-strong)] text-[0.85rem] font-semibold hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] transition-colors"
            >
              <Plus size={16} />
              Espace artisan
            </Link>

            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />

            {/* Langue */}
            <div className="relative lang-wrapper">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLangOpen(!langOpen);
                }}
                className="flex items-center gap-[0.35rem] px-[0.45rem] py-[0.6rem] rounded-full text-[0.8rem] font-semibold hover:bg-[var(--bg-sunken)] transition-colors"
              >
                <img
                  src={lang.flag}
                  alt=""
                  className="w-[18px] h-[18px] rounded-full object-cover"
                />
                <span>{lang.short}</span>
              </button>
              {langOpen && (
                <ul className="absolute right-0 top-full mt-[10px] min-w-[180px] bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[var(--r-sm)] shadow-[var(--shadow-lg)] p-[0.4rem] z-50">
                  {LANGUAGES.map((l) => (
                    <li
                      key={l.code}
                      onClick={() => {
                        setLang(l);
                        setLangOpen(false);
                      }}
                      className={`flex items-center justify-between gap-2 px-[0.55rem] py-[0.6rem] rounded-lg text-[0.85rem] cursor-pointer hover:bg-[var(--bg-sunken)] transition-colors ${
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
                        <Check size={16} className="text-[var(--accent)]" />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Profil */}
            <div className="relative profile-wrapper">
              {user ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileOpen(!profileOpen);
                  }}
                  className="w-10 h-10 rounded-full bg-[var(--accent-soft)] text-[var(--accent-strong)] font-bold text-[0.85rem] flex items-center justify-center border border-[var(--border)] hover:scale-[1.04] transition-transform"
                >
                  {initials}
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="px-[0.4rem] py-1 rounded-full border border-[var(--border)] text-[0.85rem] font-medium text-[var(--ink)] hover:bg-[var(--bg-sunken)] transition-colors"
                >
                  Se connecter
                </Link>
              )}
              {profileOpen && (
                <div className="absolute right-0 top-full mt-[10px] min-w-[220px] bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[var(--r-sm)] shadow-[var(--shadow-lg)] p-[0.5rem] z-50">
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
                      className="block px-[0.6rem] py-[0.7rem] text-[0.85rem] font-medium hover:bg-[var(--bg-sunken)] rounded-lg transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      signOut();
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-[0.6rem] py-[0.7rem] text-[0.85rem] font-medium hover:bg-[var(--bg-sunken)] rounded-lg transition-colors"
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
              {mobileOpen ? (
                <X size={18} strokeWidth={2.5} />
              ) : (
                <Menu size={18} strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 lg:hidden bg-[var(--bg)]/98 backdrop-blur-2xl flex flex-col">
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
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-5 py-4 rounded-2xl text-xl font-bold transition-all ${
                    active
                      ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
                      : "text-[var(--ink-soft)] hover:bg-[var(--bg-sunken)] hover:text-[var(--ink)]"
                  }`}
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
              <Plus size={15} />
              Espace artisan
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
