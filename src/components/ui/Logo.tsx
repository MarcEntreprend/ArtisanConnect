// src/components/ui/Logo.tsx

import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="w-8.5 h-8.5 rounded-lg bg-accent text-white flex items-center justify-center font-extrabold text-base shrink-0">
        AC
      </span>
      <span className="font-bold text-[1.05rem] tracking-tight text-ink">
        ArtisanConnect
      </span>
    </Link>
  );
}
