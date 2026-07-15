// src/lib/constants.ts
// Catégories partagées
import type { Category } from "./types";

export const CATEGORIES: Category[] = [
  { id: 1, slug: "menuiserie", label: "Menuiserie", icon: "🔨" },
  { id: 2, slug: "electricite", label: "Électricité", icon: "⚡" },
  { id: 3, slug: "plomberie", label: "Plomberie", icon: "🔧" },
  { id: 4, slug: "maconnerie", label: "Maçonnerie", icon: "🧱" },
  { id: 5, slug: "peinture", label: "Peinture", icon: "🎨" },
  { id: 6, slug: "couture", label: "Couture", icon: "✂️" },
  { id: 7, slug: "coiffure", label: "Coiffure", icon: "💇" },
  { id: 8, slug: "mecanique", label: "Mécanique auto", icon: "🚗" },
];
