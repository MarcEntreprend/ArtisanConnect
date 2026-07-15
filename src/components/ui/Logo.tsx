// src/components/ui/Logo.tsx

import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="w-[34px] h-[34px] rounded-lg bg-accent text-white flex items-center justify-center font-extrabold text-base flex-shrink-0">
        AC
      </span>
      <span className="font-bold text-[1.05rem] tracking-tight text-[var(--color-ink)]">
        ArtisanConnect
      </span>
    </Link>
  );
}
