# ROADMAP

## Itération 1 — Frontend (livrée)
- [x] Design system "Terrain" (clair + sombre)
- [x] Accueil (recherche, catégories, grille d'artisans, témoignages)
- [x] Profil artisan détaillé
- [x] Modale de réservation (calendrier, professionnel, créneau, confirmation)
- [x] Modale de connexion / inscription (validation inline)
- [x] Favoris en `localStorage`
- [x] Données mockées réalistes (8 métiers, 6 villes)

## Itération 2 — Pages manquantes (frontend, mock)
- [ ] `search.html` — recherche avancée avec filtres (prix, note, disponibilité, ville)
- [ ] `favorites.html` — liste des artisans favoris
- [ ] `appointments.html` — historique et rendez-vous à venir (mock)
- [ ] Page 404 personnalisée
- [ ] Messagerie client ↔ artisan (mock, avant intégration temps réel)

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

## Itération 5 — Espace artisan (dashboard)
- [ ] Gestion du profil, des services, des tarifs
- [ ] Calendrier de disponibilités (récurrent + exceptions ponctuelles)
- [ ] Statistiques (taux de réponse, note moyenne, réservations par mois)
- [ ] Réponse aux avis

## Notes techniques pour la suite
- Le design system (`css/style.css`) est déjà construit en variables CSS ; un passage à Tailwind ou à un framework component (React/Next) pourra réutiliser les mêmes tokens sans perte.
- `js/main.js` sépare rendu (fonctions `*HTML`) et logique (favoris, recherche, thème) : la partie rendu sera la plus facile à porter vers des composants si le projet migre vers un framework.
- Les identifiants d'artisans (`id`) et de services sont numériques et stables : ils peuvent devenir des clés primaires Postgres sans renommage.
