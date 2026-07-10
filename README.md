# ArtisanConnect

Plateforme de mise en relation entre artisans et clients (prototype front-end, données mockées).

## Lancer le projet

Aucune dépendance, aucun build. Il faut cependant servir les fichiers via un petit serveur HTTP local (les `fetch()` des composants ne fonctionnent pas en ouvrant le fichier directement avec `file://`) :

### Python (si installé)

python -m http.server 8080

#### ou Node (si installé)

npx serve .

```bash
cd artisanconnect
python3 -m http.server 8080
# puis ouvrir http://localhost:8080
```

ou avec Node :

```bash
npx serve .
```

## Architecture

```
artisanconnect/
├── index.html                  # Accueil
├── search.html                 # Recherche avancée avec filtres et tri
├── artisan-detail.html         # Profil détaillé d'un artisan
├── appointments.html           # Mes rendez-vous (client)
├── favorites.html              # Favoris (client)
├── messages.html               # Messagerie client ↔ artisan
├── dashboard.html              # Espace artisan (solo / entreprise / employé)
├── auth.html                   # Connexion / inscription / récupération
├── onboarding.html             # Onboarding 3 étapes (nouvel artisan)
├── error.html                  # Page 404 personnalisée
├── components/
│   ├── header.html             # Navigation + profil + langue + thème
│   ├── bottom-nav.html         # Navigation mobile
│   ├── modal-login.html        # Modale de connexion (legacy)
│   └── modal-reservation.html  # Modale de réservation
├── css/
│   └── style.css               # Design system "Terrain" (clair + sombre)
├── js/
│   ├── main.js                 # Logique partagée (rendu, thème, favoris, recherche, etc.)
│   ├── dashboard.js            # Espace artisan (navigation, CRUD mock, stats, avis)
│   ├── supabase-client.js      # Client Supabase (auth, API, stockage)
│   └── data/
│       ├── artisans.js         # Données mockées (8 artisans, services, avis, RDV, conversations)
│       └── dashboard-mock.js   # Mock supplémentaires (équipes, permissions, finances)
├── README.md
├── ROADMAP.md
└── AUDIT.md
```

## État actuel

- Toutes les données sont mockées dans `js/data/artisans.js`. Aucun backend, aucune base de données.
- Les favoris sont stockés dans `localStorage` (clé `favorites`), le thème dans `localStorage` (clé `theme`).
- La réservation et la connexion se terminent par une notification (toast) mais n'enregistrent rien de façon persistante.

## Prochaines étapes

Voir `ROADMAP.md`.
