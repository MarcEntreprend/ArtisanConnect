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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg/90 backdrop-blur-md border-t border-border">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 text-xs font-medium transition-colors ${
                active ? "text-accent" : "text-ink-faint"
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
