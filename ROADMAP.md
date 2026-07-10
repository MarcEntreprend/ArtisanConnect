# ROADMAP

## Itération 1 — Frontend (livrée)
- [x] Design system "Terrain" (clair + sombre)
- [x] Accueil (recherche, catégories, grille d'artisans, témoignages)
- [x] Profil artisan détaillé
- [x] Modale de réservation (calendrier, professionnel, créneau, confirmation)
- [x] Modale de connexion / inscription (validation inline)
- [x] Favoris en `localStorage`
- [x] Données mockées réalistes (8 métiers, 6 villes)

## Itération 2 — Pages manquantes (frontend, mock) — livrée
- [x] `search.html` — recherche avancée avec filtres (métier, ville, note, budget, disponibilité) et tri
- [x] `favorites.html` — liste des artisans favoris avec état vide
- [x] `appointments.html` — onglets à venir / passés / annulés, annulation mock
- [x] `error.html` — page 404 personnalisée avec recherche
- [x] `messages.html` — messagerie client ↔ artisan (mock, conversations + envoi en session)

## Itération 3 — Modèle de données réel (Supabase)
- [ ] Schéma Postgres : `artisans`, `services`, `disponibilites`, `reservations`, `avis`, `favoris`, `messages`, `utilisateurs`
- [ ] RLS (Row Level Security) : un artisan ne modifie que son propre profil, un client ne voit que ses propres réservations
- [ ] Auth Supabase : deux rôles (client / artisan), séparation des tableaux de bord
- [ ] Migration des données mockées vers des seeds SQL

## Itération 4 — API & intégrations
- [ ] Recherche géolocalisée (PostGIS ou filtrage côté client par ville dans un premier temps)
- [ ] Paiement (Mobile Money en priorité vu le contexte, Stripe en option internationale)
- [ ] Notifications (email via Resend, SMS/WhatsApp à évaluer selon les pays ciblés)
- [ ] Upload d'images (galerie artisan, avatar) via Supabase Storage

## Itération 5 — Espace artisan (dashboard, mock) — livrée
- [x] `dashboard.html` — gestion du profil (formulaire pré-rempli)
- [x] Gestion des services (ajout, suppression ; édition détaillée en attente du backend)
- [x] Disponibilités récurrentes (bascule ouvert/fermé + horaires par jour)
- [x] Statistiques (bento : réservations, taux de réponse, note moyenne, revenu estimé)
- [x] Réponse aux avis (formulaire inline, persistance en mémoire pour la session)

> Démo branchée sur un seul artisan (`CURRENT_ARTISAN_ID` dans `js/data/artisans.js`), en attendant l'authentification réelle.

## Notes techniques pour la suite
- Le design system (`css/style.css`) est déjà construit en variables CSS ; un passage à Tailwind ou à un framework component (React/Next) pourra réutiliser les mêmes tokens sans perte.
- `js/main.js` sépare rendu (fonctions `*HTML`) et logique (favoris, recherche, thème) : la partie rendu sera la plus facile à porter vers des composants si le projet migre vers un framework.
- Les identifiants d'artisans (`id`) et de services sont numériques et stables : ils peuvent devenir des clés primaires Postgres sans renommage.
