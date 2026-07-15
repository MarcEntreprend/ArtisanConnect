## Rapport d'analyse — AppBarber (appbarber.com.br)

### Contexte

AppBarber est une plateforme SaaS de réservation en ligne pour barbiers et salons de beauté, en production au Brésil. Ce rapport analyse les fonctionnalités implémentées pour les comparer à ArtisanConnect et identifier les manques à combler.

---

### Fonctionnalités AppBarber déjà présentes dans ArtisanConnect

| Fonctionnalité                                                        | ArtisanConnect                 |
| --------------------------------------------------------------------- | ------------------------------ |
| Page établissement avec services, pros, horaires, galerie, commodités | ✅ artisan-detail.html         |
| Réservation avec choix du professionnel                               | ✅ modal-reservation.html      |
| Authentification (email/signup/login/recover)                         | ✅ auth.html                   |
| Header dynamique (login ↔ avatar)                                     | ✅ main.js                     |
| Favoris                                                               | ✅ favorites.html              |
| Messagerie client-artisan                                             | ✅ messages.html               |
| Dashboard artisan (services, dispos, profil, stats, avis)             | ✅ dashboard.js                |
| Onboarding guidé                                                      | ✅ onboarding.html             |
| Mode sombre/clair                                                     | ✅ style.css                   |
| Équipe/professionnels avec permissions                                | ✅ dashboard.js (mode Complet) |
| Paiement en ligne avec acompte (%)                                    | 🟠 UI mockée, pas branchée     |
| Notifications (email)                                                 | 🔴 Non implémenté              |

---

### Fonctionnalités AppBarber manquantes dans ArtisanConnect

**Priorité haute (cœur du produit) :**

- **Panier multi-services** (max 3 services par réservation) → actuellement 1 seul service par RDV
- **Paiement en ligne réel** avec pourcentage d'acompte minimum configurable → UI mockée, pas d'intégration
- **Paiement PIX + carte bancaire** → pas implémenté
- **Géolocalisation** pour trouver les établissements proches → filtrage par ville uniquement
- **Confirmation d'email obligatoire** → désactivée pour le dev
- **Liste d'attente** si aucun créneau dispo → pas implémenté
- **Recherche par nom ou ville** avec chargement progressif → recherche mockée

**Priorité moyenne (engagement & rétention) :**

- **Abonnements** (plans récurrents avec tarifs réduits) → UI teaser uniquement
- **Packs** (achat groupé de services) → pas implémenté
- **Programme de fidélité** (points, échange de récompenses) → pas implémenté
- **Anamnese** (questionnaire client avant RDV) → pas implémenté
- **Avis avec notation** → mock uniquement, pas de création par le client
- **Gestion des cartes bancaires** (multi-cartes, suppression) → pas implémenté
- **Multi-établissements** (un compte client peut suivre plusieurs salons) → pas implémenté

**Priorité basse (qualité de vie) :**

- **Réagendement** (modifier un RDV existant) → pas implémenté
- **Historique de recherche et de navigation** → pas implémenté
- **PWA** (installation sur mobile) → pas encore
- **i18n** (5 langues) → français uniquement
- **Cookies consent** avancé (essentiels/fonctionnels/analytiques) → consentement simple
- **Double protection anti-bots** (Cloudflare Turnstile + Google reCAPTCHA)
- **Suppression de compte** avec feedback utilisateur → suspendu uniquement

---

### Architecture technique d'AppBarber

- **Next.js** : SSR + client-side rendering
- **Supabase** : auth + base de données (confirmé par les patterns API)
- **MUI (Material UI)** : composants d'interface
- **Lottie** : animations légères
- **AWS S3** : stockage images
- **Cloudflare Turnstile + Google reCAPTCHA** : anti-bots
- **Toastify** : notifications toast
- **Zoop** : processeur de paiement brésilien (PIX + cartes)

---

### Points d'inspiration directe pour ArtisanConnect

1. **Panier de réservation** : permettre au client d'ajouter jusqu'à 3 services avant de confirmer
2. **Paiement avec acompte** : le pourcentage minimum est configuré par l'artisan, le client voit le montant exact avant de payer
3. **Géolocalisation** : détecter la position du client et afficher les artisans les plus proches en premier
4. **Liste d'attente** : si aucun créneau n'est disponible, proposer au client d'être notifié
5. **Abonnements** : formule récurrente (ex: 5 coupes/mois à tarif réduit) gérée côté artisan
6. **Packs** : achat groupé de prestations (ex: 10 coupes + 5 barbes à -20%)
7. **Fidélité** : accumulation de points par visite, échange contre des services gratuits
8. **Anamnese** : questionnaire personnalisable que le client remplit avant son RDV
9. **Multi-établissements** : un utilisateur peut suivre plusieurs artisans/salons différents
10. **Cookies consent** granulaire : essentiels / fonctionnels / analytiques

---

### État actuel d'ArtisanConnect vs AppBarber

ArtisanConnect a **l'infrastructure complète** (auth, CRUD, dashboard, réservation, messagerie) branchée sur Supabase. Il lui manque **les fonctionnalités avancées de monétisation et d'engagement** (paiement réel, abonnements, fidélité, géolocalisation) qui transforment un outil de réservation en plateforme business complète.

**Prochaine étape recommandée** : implémenter le paiement avec acompte (Itération 8), puis les abonnements et la géolocalisation (Itération 9).
