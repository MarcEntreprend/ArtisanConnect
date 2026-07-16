# Run

# Architecture

```
artisanconnect2/
├── .vscode/
│   └── settings.json
├── dist/
│   └── assets/
│       ├── index-D-9xztfc.js
│       └── index-dLvuQpOI.css
│   └── index.html
├── node_modules/
├── public/
├── src/
│   ├── components/
│   │   ├── features/
│   │   │   └── BookingModal.tsx
│   │   ├── layout/
│   │   │   ├── BottomNav.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Header.tsx
│   │   └── ui/
│   │       ├── Logo.tsx
│   │       └── ThemeToggle.tsx
│   ├── hooks/
│   │   ├── useArtisans.ts
│   │   ├── useAuth.tsx
│   │   └── useTheme.ts
│   ├── lib/
│   │   ├── constants.ts
│   │   ├── supabase.ts
│   │   └── types.ts
│   ├── pages/
│   │   ├── Appointments.tsx
│   │   ├── ArtisanDetail.tsx
│   │   ├── Auth.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Favorites.tsx
│   │   ├── Home.tsx
│   │   ├── Messages.tsx
│   │   ├── NotFound.tsx
│   │   ├── Onboarding.tsx
│   │   └── Search.tsx
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .gitignore
├── .oxlintrc.json
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

# ArtisanConnect – Spécification Fonctionnelle Exhaustive

## 1. Vision et Positionnement

**ArtisanConnect** est une plateforme de gestion et de mise en relation en ligne destinée aux **artisans de tous les métiers** (coiffure, plomberie, électricité, couture, etc.) du public Haitien. Elle permet aux professionnels de **digitaliser leur activité** (agenda, vitrine, paiements, fidélisation) et aux clients de **trouver, réserver et payer** des prestations en toute simplicité.

La plateforme repose sur deux piliers :

1. **Un site vitrine/public** pour chaque artisan (présentation, services, avis, réservation en ligne).
2. **Un tableau de bord de gestion** (web et mobile) pour l’artisan, son équipe et le client.

---

## 2. Architecture et Rôles

### 2.1. Rôles utilisateurs

| Rôle                         | Description                                                                                              |
| ---------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Visiteur**                 | Non connecté. Consulte les fiches publiques et peut réserver sans compte (selon configuration).          |
| **Client**                   | Compte personnel. Gère ses rendez-vous, favoris, avis, messages et paiements.                            |
| **Artisan solo**             | Artisan indépendant. Gère son agenda, ses services, sa vitrine et ses finances.                          |
| **Responsable d’entreprise** | Dirigeant d’une structure avec plusieurs employés. Supervise l’équipe, les finances et les assignations. |
| **Employé**                  | Membre d’une équipe. Dispose de permissions définies par le responsable (agenda, services, etc.).        |

### 2.2. Modules de la plateforme

- **Module Web** (back-office) : gestion complète de l’établissement (agenda, clients, finances, équipe, ...).

une **Module Application** (mobile) a venir (pas encore): qui sera accessible au professionnel (agenda, commissions) et au client (réservation, notifications, programmes de fidélité). en attendant, la version web sur apareil mobile doit fonctionner comme une application.

---

## 3. Fonctionnalités détaillées

### 3.1. Vitrine et site de l’artisan

Chaque artisan dispose d’un profil (par exemple : https://artisan-connected.vercel.app/jeanbernard/....) avec :

- **Informations** : horaires, prix, moyens de paiement, photos, localisation, description des services et des professionnels.
- **Agenda en ligne** : les clients peuvent voir les créneaux disponibles et réserver directement.
- **Visibilité** : le site est référencé par les moteurs de recherche et peut être intégré à une page Facebook existante.

### 3.2. Gestion de l’agenda et des rendez-vous

| Fonctionnalité                       | Description                                                                                                              |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| **Agenda 24/7**                      | Les clients réservent à toute heure, sans intervention manuelle.                                                         |
| **Jours et horaires flexibles**      | Chaque professionnel peut définir sa propre journée de travail (par jour de la semaine ou période spécifique).           |
| **Créneaux d’exception**             | Possibilité d’ajouter des horaires exceptionnels (ex. ouverture un jour férié).                                          |
| **Liste d’attente**                  | Les clients s’inscrivent sur une liste d’attente ; ils sont automatiquement notifiés si un créneau se libère.            |
| **Gestion des absences/annulations** | L’artisan peut annuler un rendez-vous (avec notification client) ; le client peut annuler selon les règles de l’artisan. |

### 3.3. Gestion des services, produits et packs

| Fonctionnalité                 | Description                                                                                |
| ------------------------------ | ------------------------------------------------------------------------------------------ |
| **Services**                   | Création et gestion de services (nom, description, prix, durée). Activation/désactivation. |
| **Packs de services/produits** | Création de packs (ex. « Forfait entretien 3 séances ») avec suivi des consommations.      |
| **Produits en stock**          | Gestion d’un catalogue de produits (cosmétiques, fournitures) avec prix de vente.          |

### 3.4. Gestion financière et paiements

| Fonctionnalité                   | Description                                                                                           |
| -------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Caisse et flux de trésorerie** | Suivi des encaissements, comptes clients/fournisseurs, taxes et frais de carte.                       |
| **Paiement en ligne**            | Intégration d’un paiement en ligne (carte, virement) pour les réservations et les achats de produits. |
| **Acomptes et cautions**         | Possibilité d’exiger un acompte à la réservation (remboursable ou non).                               |
| **Commissions et rémunérations** | Gestion des commissions par service/produit pour les employés, avec suivi des avances.                |
| **Relatorios financiers**        | Tableaux de bord : chiffre d’affaires, rentabilité par service, par professionnel, par période.       |

### 3.5. Gestion des clients et fidélisation

| Fonctionnalité                      | Description                                                                                                                    |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Base de données clients**         | Historique des rendez-vous, préférences, anniversaires.                                                                        |
| **Programme de fidélité**           | Système de points (comme les programmes de cartes de crédit) : accumulation et échange de points contre des services/produits. |
| **Club clients**                    | Création d’un club avec avantages et réductions automatiques pour les membres.                                                 |
| **Notifications personnalisées**    | Envoi de promotions, d’événements ou de messages de rappel (push, e-mail, SMS).                                                |
| **Messages automatiques de retour** | Configuration de messages de suivi après un service pour encourager la fidélisation.                                           |
| **Evaluation de satisfaction**      | Envoi automatique d’une enquête de satisfaction après chaque service.                                                          |

### 3.6. Gestion de l’équipe (pour les entreprises)

| Fonctionnalité                  | Description                                                                                                                              |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Gestion des profils**         | Ajout/suppression d’employés, définition des rôles et permissions.                                                                       |
| **Agenda partagé**              | Chaque employé voit ses propres rendez-vous ; le responsable voit l’agenda de tous.                                                      |
| **Assignation des rendez-vous** | Les rendez-vous non assignés sont proposés aux employés disponibles ; le responsable peut les attribuer manuellement ou automatiquement. |
| **Suivi des performances**      | Statistiques individuelles (nombre de services, chiffre d’affaires, taux de satisfaction).                                               |

### 3.7. Gestion des stocks et des commandes

| Fonctionnalité                | Description                                                                                                                   |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Contrôle des stocks**       | Suivi des entrées/sorties, alertes de stock bas, gestion des péremptions.                                                     |
| **Commandes et consommation** | Chaque rendez-vous génère une commande (consommation de produits/services). Possibilité d’ajouter des produits à la commande. |
| **Intégration caisse**        | La caisse enregistre automatiquement les ventes de produits et de services.                                                   |

### 3.8. Communication et relation client

| Fonctionnalité           | Description                                                                   |
| ------------------------ | ----------------------------------------------------------------------------- |
| **Messagerie intégrée**  | Échanges entre client et artisan (avant/après le rendez-vous).                |
| **Notifications push**   | Rappels de rendez-vous, confirmations, promotions.                            |
| **Envoi de newsletters** | Ciblage par groupe de clients (ex. tous les clients d’un service spécifique). |
| **Réponses aux avis**    | L’artisan peut répondre publiquement aux avis clients.                        |

### 3.9. Statistiques et rapports

| Fonctionnalité                | Description                                                                    |
| ----------------------------- | ------------------------------------------------------------------------------ |
| **Tableaux de bord**          | Indicateurs clés : nombre de rendez-vous, CA, taux d’occupation, satisfaction. |
| **Rapports personnalisables** | Filtres par période, service, professionnel, etc.                              |
| **Export**                    | Export en CSV/PDF des données (agenda, finances, clients).                     |

### 3.10. Fonctionnalités avancées (selon formule) (a venir , pas maintenant)

| Fonctionnalité                     | Description                                                                                          |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Intégration Facebook/Instagram** | Les clients peuvent réserver directement depuis les réseaux sociaux.                                 |
| **Application mobile**             | Version mobile pour les professionnels (agenda, commissions) et les clients (réservation, fidélité). |
| **API de paiement**                | Intégration avec des prestataires de paiement (Stripe, visa, mastercard, etc.).                      |
| **Gestion des notes fiscales**     | Émission de reçus/factures.                                                                          |
| **Multi-langues et multi-devises** | Support pour plusieurs pays et langues.                                                              |

---

## 4. Expérience utilisateur (UX)

### 4.1. Parcours client

1. **Découverte** : recherche d’un artisan (par métier, ville, note, disponibilité).
2. **Consultation** : fiche détaillée (services, avis, horaires).
3. **Réservation** : choix du service, du créneau, éventuel paiement en ligne.
4. **Suivi** : notifications de confirmation, rappel, enquête de satisfaction.
5. **Fidélisation** : accumulation de points, réception de promotions.

### 4.2. Parcours artisan

1. **Onboarding** : création du compte, configuration de la vitrine (services, horaires, photos).
2. **Gestion quotidienne** : consultation de l’agenda, gestion des rendez-vous, réponse aux messages.
3. **Suivi financier** : consultation des recettes, des commissions, des stocks.
4. **Développement** : analyse des statistiques, lancement de campagnes de fidélisation.

---

## 5. Différenciateurs clés d’ArtisanConnect par rapport à AppBarber

| AppBarber                           | ArtisanConnect                                                                    |
| ----------------------------------- | --------------------------------------------------------------------------------- |
| Focalisé sur les barbiers/coiffeurs | Adapté à **tous les métiers artisanaux** (plombier, électricien, couturier, etc.) |
| Pas de module de devis              | Intégration d’un **module de devis et de facturation**                            |

---

## 6. Offre commerciale (exemple)

Inspiré des tarifs d’AppBarber, ArtisanConnect pourrait proposer :

| Formule        | Prix (mensuel) | Profils inclus        |
| -------------- | -------------- | --------------------- |
| **Solo**       | 99,00 Gourdes  | 1 professionnel       |
| **Duo**        | 190,90 Gourdes | 2 à 5 professionnels  |
| **Équipe**     | 249,90 Gourdes | 6 à 15 professionnels |
| **Entreprise** | 500,90 Gourdes | +15 professionnels    |

> Toutes les formules incluent un **essai gratuit de 30 jours** sans limitation.

---

## 7. Prochaines étapes (roadmap)

- **Version 1.0** : lancement du site vitrine + back-office de base (agenda, services, paiements).
- **Version 1.1** : application mobile (iOS/Android).
- **Version 1.2** : intégration des réseaux sociaux et des places de marché.
- **Version 2.0** : intelligence artificielle pour la recommandation de services et la détection d’anomalies.

---

Ce document est une spécification complète et ambitieuse pour ArtisanConnect, qui va bien au‑delà de la simple transposition d’AppBarber. Il intègre toutes les fonctionnalités observées sur la plateforme source tout en les adaptant et en les enrichissant pour couvrir l’ensemble des métiers artisanaux.
