// src/pages/NotFound.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function goToSearch() {
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <span className="font-mono text-7xl font-bold text-[var(--color-accent)]">
        404
      </span>
      <h1 className="text-2xl font-bold mt-4">
        Cette page a pris un jour de congé
      </h1>
      <p className="text-sm text-ink-soft mt-2 max-w-md">
        La page que vous cherchez n'existe pas ou a été déplacée.
      </p>
      <div className="mt-6 flex items-center gap-2 max-w-md w-full">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
            size={18}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && goToSearch()}
            placeholder="Rechercher un artisan…"
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border bg-bg text-sm"
          />
        </div>
        <button
          onClick={goToSearch}
          className="btn btn-primary px-4 py-2.5 rounded-full text-sm font-semibold"
        >
          Rechercher
        </button>
      </div>
      <div className="flex gap-3 mt-6">
        <Link to="/" className="btn btn-primary">
          Retour à l'accueil
        </Link>
        <Link to="/search" className="btn btn-outline">
          Voir tous les artisans
        </Link>
      </div>
    </div>
  );
}
