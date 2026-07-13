# ArtisanConnect — Audit & direction créative

## 1. Lecture du brief

Plateforme de mise en relation entre artisans et clients, contexte Afrique francophone. Vibe demandée : un réseau social où l'artisan expose fièrement son travail, pas un LinkedIn froid, pas un catalogue Etsy statique. Inspirations : AppBarber (réservation), Airbnb (mise en avant des profils), Dribbble (cartes), TaskRabbit/Helpling (services à la personne).

**Lecture retenue :** marketplace de services grand public, orientée mobile d'abord, avec une identité chaleureuse mais professionnelle — proche d'un Airbnb pour artisans plutôt que d'un ERP de gestion.

## 2. Constats sur la base de code fournie

**Forces**

- Structure de composants déjà pensée (header, bottom-nav, modales chargées en `fetch`) — bonne base pour un futur passage en composants React.
- La modale de réservation avait déjà une vraie logique de calendrier (semaine glissante) et de sélection de professionnel : réutilisable.

**Faiblesses corrigées dans cette passe**

- `js/main.js` et `artisan-detail.html` redéfinissaient deux fois les mêmes fonctions (`initHeaderComponents`, `getFlagEmoji`) → conflits silencieux. Corrigé : une seule source de vérité (`main.js`).
- Couleurs codées en dur dans `modal-reservation.html` (`#0072bc`, `#18181b`…) indépendantes du reste du site → aucune cohérence avec un futur mode sombre. Corrigé : tout passe par les variables CSS du design system.
- Données mockées génériques (villes françaises, un seul visuel réutilisé pour les 6 artisans, avatar image de chat en `og:image`) → peu crédible pour le contexte réel du produit. Corrigé : données diversifiées (8 métiers, 6 villes ouest/centre-africaines, visuels distincts, prix en Gourdes).
- Aucun état vide, aucun skeleton, `window.alert` implicite via les anciens formulaires → contraire à vos propres règles de qualité. Corrigé.
- Aucune action de la modale de réservation n'aboutissait à une confirmation visible. Corrigé : récapitulatif + toast de confirmation.

## 3. Direction visuelle : "Terrain"

- **Palette** : vert forêt `#2f6b4f` en accent unique, neutres pierre chaude (`#faf9f6` / `#1c1c1a`), une seule couleur sémantique supplémentaire (ambre pour les étoiles). Choix déconnecté des palettes "beige + laiton" trop vues sur les briefs artisanat/premium, et distinct des teintes déjà utilisées sur vos autres projets (bleu Opera, corail InstaWear).
- **Typographie** : Plus Jakarta Sans (texte) + JetBrains Mono (prix, horaires, chiffres) — cohérent avec votre stack Opera, mais appliqué à une identité différente.
- **Rayon** : 20px sur les cartes, pilule sur les boutons/inputs de recherche, cohérent sur toute la plateforme.
- **Mode sombre** : piloté par `body.dark`, mêmes tokens que l'existant pour ne rien casser côté logique JS.

## 4. Ce que cette itération livre

- `index.html` — accueil avec recherche, mosaïque de portraits en hero, filtres par métier, grille d'artisans (skeletons + état vide géolocalisation), bandeau de témoignages.
- `artisan-detail.html` — profil façon Airbnb : en-tête avec note et vérification, onglets Services / À propos / Avis, commodités, horaires, moyens de paiement, contact.
- `components/modal-reservation.html` — calendrier semaine, sélection de professionnel, créneaux, récapitulatif et confirmation.
- `components/modal-login.html` — connexion/inscription avec validation inline (pas de `window.alert`).
- `components/header.html`, `components/bottom-nav.html` — navigation cohérente desktop/mobile.
- `js/main.js` — toute la logique consolidée (thème, favoris en localStorage, recherche, filtres, toasts, rendu des cartes et de la page détail).
- `js/data/artisans.js` — 8 artisans réalistes, 8 catégories, 4 témoignages.

## 5. Ce qui n'est pas encore fait (volontairement)

Conformément à votre règle de livraison itérative : `search.html`, `appointments.html`, `favorites.html`, le dashboard artisan et la messagerie ne sont pas construits dans cette passe. Ils sont documentés dans `ROADMAP.md`. Toutes les données sont mockées ; le passage à Supabase est l'étape suivante que nous avons convenu de traiter séparément.
