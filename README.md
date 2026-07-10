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

## Structure

```
artisanconnect/
├── index.html                  # Accueil
├── artisan-detail.html         # Profil détaillé d'un artisan
├── components/
│   ├── header.html
│   ├── bottom-nav.html
│   ├── modal-login.html
│   └── modal-reservation.html
├── css/
│   └── style.css               # Design system "Terrain" (clair + sombre)
├── js/
│   ├── main.js                 # Logique applicative
│   └── data/
│       └── artisans.js         # Données mockées (8 artisans, 8 catégories, avis)
├── AUDIT.md                    # Audit et direction créative
└── ROADMAP.md                  # Prochaines étapes (backend, paiement…)
```

## État actuel

- Toutes les données sont mockées dans `js/data/artisans.js`. Aucun backend, aucune base de données.
- Les favoris sont stockés dans `localStorage` (clé `favorites`), le thème dans `localStorage` (clé `theme`).
- La réservation et la connexion se terminent par une notification (toast) mais n'enregistrent rien de façon persistante.

## Prochaines étapes

Voir `ROADMAP.md`.
