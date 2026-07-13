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

- [x] `search.html` — recherche avancée avec filtres et tri
- [x] `favorites.html` — liste des artisans favoris avec état vide
- [x] `appointments.html` — onglets à venir / passés / annulés, annulation mock
- [x] `error.html` — page 404 personnalisée avec recherche
- [x] `messages.html` — messagerie client ↔ artisan (mock, conversations + envoi en session)

## Itération 3 — Modèle de données réel (Supabase) — livrée

- [x] Schéma Postgres complet : `users`, `artisans`, `categories`, `services`, `artisan_hours`, `artisan_amenities`, `artisan_payment_methods`, `teams`, `team_members`, `appointments`, `reviews`, `favorites`, `conversations`, `messages`, `pending_changes`, `payouts`, `payment_settings`
- [x] RLS activé sur toutes les tables avec politiques par rôle
- [x] Auth Supabase : signUp, signIn, signOut, resetPassword avec création auto profil `public.users`
- [x] Seeds SQL complets (8 catégories, 8 artisans, 15 utilisateurs, horaires, services, équipe Wytalo, RDV, avis, conversations)

## Itération 4 — API & intégrations — en cours

- [x] `supabase-client.js` : tous les endpoints (auth, artisans, services, hours, appointments, reviews, favorites, messages, team, finances, paymentSettings, categories, storage)
- [x] Fix 500 : suppression des jointures FK non reconnues par PostgREST
- [ ] Upload d'images (galerie artisan, avatar) via Supabase Storage
- [ ] Recherche géolocalisée (PostGIS ou filtrage côté client par ville)
- [ ] Paiement (Mobile Money en priorité, Stripe en option)
- [ ] Notifications (email via Resend, SMS/WhatsApp)

## Itération 5 — Espace artisan (dashboard, mock) — livrée

- [x] `dashboard.html` — gestion du profil (formulaire pré-rempli)
- [x] Gestion des services (ajout, suppression)
- [x] Disponibilités récurrentes (bascule ouvert/fermé + horaires par jour)
- [x] Statistiques (bento : réservations, taux de réponse, note moyenne, revenu estimé)
- [x] Réponse aux avis (formulaire inline, persistance en session)

## Itération 6 — Refonte Espace Artisan (Supabase) — livrée

- [x] Double mode Essentiel / Complet avec bouton de bascule
- [x] `dashboard.html` : chargement réel Supabase, fallback mock, création artisan vide si nouveau compte, footer démo masqué si connecté
- [x] `dashboard.js` : CRUD services/dispos/avis → Supabase, suppression de compte (suspendu + signOut)
- [x] `auth.html` : loadTheme(), états disabled pendant requête, redirection onboarding, flèche retour avec history.back()
- [x] `onboarding.html` : vrai artisanId Supabase, détection si déjà passé, création artisan + service en base
- [x] `modal-reservation.html` : state étendu, chargement pros Supabase, persistence `appointments.create`
- [x] `js/main.js` : `serviceRowHTML` avec data-attributes complets, header dynamique loginBtn ↔ initiales + logout
- [x] Fix "voit Koffi" : artisan réel injecté dans `artisansData`, `DEMO_PERSONAS["solo"].artisanId` branché sur le vrai ID
- [x] Nettoyage doublons `supabase-client.js`
- [x] `appointments.html` et `messages.html` : chargement depuis Supabase si connecté

## Itération 7 — Stabilisation & finitions (priorité haute)

- [ ] État "Connectez-vous" sur `appointments.html` si `!session`
- [ ] État "Connectez-vous" sur `favorites.html` si `!session`
- [ ] État "Connectez-vous" sur `messages.html` si `!session`
- [ ] `initFavoriteButtons` → sync `SupabaseAPI.favorites.add/remove` si session active
- [ ] `window.teamData` consommé par `dashboard.js` à la place de `teamsData` mock
- [ ] Upload réel photo dans Votre vitrine via `SupabaseAPI.storage.uploadAvatar` (+ bucket + policy SQL)
- [ ] Fix `messages.getConversations` pour rôle artisan (via `owner_id`, pas `artisan_id = UUID`)
- [ ] Fix `supabase-client.js` : `messages.getConversations` adapté aux membres d'équipe
- [ ] Ligne orpheline `showToast("Service supprimé.");` après `break;` dans `dashboard.js`
- [ ] `onboarding.html` : `IS_FIRST_LOGIN` vérifie si l'artisan a déjà des services en base
- [ ] Vérifier que la clé de service Supabase n'est JAMAIS dans le frontend

## Itération 8 — Fonctionnalités avancées (priorité moyenne)

- [ ] Statistiques réelles : stat-tiles branchées sur données live
- [ ] Paiement settings : `renderPaiementPanel` → `SupabaseAPI.paymentSettings.upsert`
- [ ] Finances réelles : `renderFinancesPanel` → `SupabaseAPI.finances.getPayouts`
- [ ] Messagerie artisan : `SupabaseAPI.messages.send` depuis le dashboard
- [ ] Équipe : `SupabaseAPI.team.addMember/removeMember/updateMember`
- [ ] Notifications email (Resend + Supabase Edge Functions)

## Itération 9 — Post-lancement (priorité basse)

- [ ] Page admin / back-office (modération artisans, statistiques globales)
- [ ] Paiement en ligne réel (Mobile Money : Wave, Orange Money ; Stripe international)
- [ ] PWA / app mobile : manifest.json + service worker
- [ ] Migration React/Next.js (design system CSS prêt, fonctions de rendu séparables)
- [ ] Badges et confiance (vérifié, réactif, 100+ RDV)

---

## Notes techniques

- Design system CSS en variables — prêt pour Tailwind ou composants React/Next sans perte de tokens.
- `js/main.js` sépare rendu (`*HTML`) et logique — portage facilité vers un framework.
- IDs artisans/services numériques et stables — prêts pour clés primaires Postgres.
- `js/supabase-client.js` est le point d'entrée unique Supabase. Séparation future en `api/*.js` possible.
- Clé anon exposée côté client = normal (RLS activé sur toutes les tables). Clé de service = backend exclusivement.
