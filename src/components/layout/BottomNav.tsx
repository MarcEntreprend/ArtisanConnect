// src/components/layout/BottomNav.tsx

import { Link, useLocation } from "react-router-dom";
import { House, Search, Calendar, Heart } from "lucide-react";

const NAV_ITEMS = [
  { path: "/", label: "Accueil", icon: House },
  { path: "/search", label: "Recherche", icon: Search },
  { path: "/appointments", label: "RDV", icon: Calendar },
  { path: "/favorites", label: "Favoris", icon: Heart },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg/85 backdrop-blur-lg border-t border-border/60 pb-safe">
      <div className="flex items-center justify-around h-15.5">
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center gap-0.5 w-16 h-full text-[10px] font-bold tracking-wide transition-all duration-200 ${
                active ? "text-accent scale-105" : "text-ink-faint hover:text-ink"
              }`}
            >
              <item.icon size={20} className={active ? "stroke-[2.5px]" : "stroke-[2px]"} />
              <span>{item.label}</span>
              {active && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-accent animate-fade-in-up" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
