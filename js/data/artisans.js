// js/data/artisans.js
/**
 * ARTISANCONNECT — Données mockées
 * Remplacées par Supabase (Postgres) lors de la phase 2.
 * Contexte : plateforme de mise en relation artisans/clients
 * en Afrique de l'Ouest et Centrale francophone.
 */

const CATEGORIES = [
  { slug: "menuiserie", label: "Menuiserie", icon: "hammer" },
  { slug: "electricite", label: "Électricité", icon: "bolt" },
  { slug: "plomberie", label: "Plomberie", icon: "wrench" },
  { slug: "maconnerie", label: "Maçonnerie", icon: "brick" },
  { slug: "peinture", label: "Peinture", icon: "roller" },
  { slug: "couture", label: "Couture", icon: "scissors" },
  { slug: "coiffure", label: "Coiffure", icon: "scissors-hair" },
  { slug: "mecanique", label: "Mécanique auto", icon: "car" },
];

const artisansData = [
  {
    id: 1,
    name: "Koffi Atelier Bois",
    ownerName: "Koffi N'Guessan",
    category: "Menuiserie",
    categorySlug: "menuiserie",
    rating: 4.8,
    reviews: 132,
    distance: "2.3 km",
    city: "Abidjan",
    address: "Rue des Jardins, Cocody, Abidjan",
    phone: "+225 07 08 45 12 96",
    verified: true,
    availableToday: true,
    priceFrom: 8000,
    currency: "FCFA",
    avatar:
      "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=300&h=300&fit=crop",
    cover:
      "https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=1200&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1616627561950-9f746e330187?w=600&h=450&fit=crop",
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&h=450&fit=crop",
    ],
    description:
      "Menuiserie familiale fondée en 2011, spécialisée dans le mobilier sur mesure et la restauration de meubles anciens. Bois locaux (iroko, teck) travaillés à l'atelier de Cocody.",
    amenities: { wifi: false, parking: true, accessibility: false, kids: false },
    hours: [
      { day: "Lundi", time: "08:00 - 18:00" },
      { day: "Mardi", time: "08:00 - 18:00" },
      { day: "Mercredi", time: "08:00 - 18:00" },
      { day: "Jeudi", time: "08:00 - 18:00" },
      { day: "Vendredi", time: "08:00 - 18:00", today: true },
      { day: "Samedi", time: "09:00 - 14:00" },
      { day: "Dimanche", time: "Fermé" },
    ],
    paymentMethods: ["Espèces", "Mobile Money", "Virement"],
    services: [
      {
        id: 101,
        name: "Fabrication de meuble sur mesure",
        desc: "Étagère, table ou armoire conçue selon vos plans.",
        price: 45000,
        duration: 180,
        image:
          "https://images.unsplash.com/photo-1611486212557-88be5ff6f941?w=200&h=200&fit=crop",
      },
      {
        id: 102,
        name: "Restauration de meuble ancien",
        desc: "Ponçage, réparation et vernissage.",
        price: 18000,
        duration: 120,
        image:
          "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=200&h=200&fit=crop",
      },
      {
        id: 103,
        name: "Pose de porte ou fenêtre en bois",
        desc: "Fourniture et installation complète.",
        price: 25000,
        duration: 90,
        image:
          "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?w=200&h=200&fit=crop",
      },
    ],
  },
  {
    id: 2,
    name: "Traoré Électricité Générale",
    ownerName: "Aminata Traoré",
    category: "Électricité",
    categorySlug: "electricite",
    rating: 4.9,
    reviews: 208,
    distance: "1.5 km",
    city: "Dakar",
    address: "Avenue Bourguiba, Sacré-Cœur, Dakar",
    phone: "+221 77 512 34 08",
    verified: true,
    availableToday: true,
    priceFrom: 5000,
    currency: "FCFA",
    avatar:
      "https://images.unsplash.com/photo-1571907480495-4b39d76e2634?w=300&h=300&fit=crop",
    cover:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1621905252472-943afaa20e20?w=600&h=450&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=450&fit=crop",
    ],
    description:
      "Électricienne certifiée, 12 ans d'expérience en installation résidentielle et commerciale. Intervention rapide, devis gratuit sous 24h.",
    amenities: { wifi: true, parking: true, accessibility: true, kids: false },
    hours: [
      { day: "Lundi", time: "07:30 - 19:00" },
      { day: "Mardi", time: "07:30 - 19:00" },
      { day: "Mercredi", time: "07:30 - 19:00" },
      { day: "Jeudi", time: "07:30 - 19:00", today: true },
      { day: "Vendredi", time: "07:30 - 19:00" },
      { day: "Samedi", time: "08:00 - 16:00" },
      { day: "Dimanche", time: "Astreinte urgence" },
    ],
    paymentMethods: ["Espèces", "Carte bancaire", "Mobile Money"],
    services: [
      {
        id: 201,
        name: "Diagnostic électrique complet",
        desc: "Vérification de l'installation, rapport détaillé.",
        price: 12000,
        duration: 60,
        image:
          "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&h=200&fit=crop",
      },
      {
        id: 202,
        name: "Installation de tableau électrique",
        desc: "Mise aux normes et remplacement de disjoncteurs.",
        price: 55000,
        duration: 240,
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
      },
      {
        id: 203,
        name: "Dépannage urgence",
        desc: "Panne de courant, court-circuit, intervention rapide.",
        price: 15000,
        duration: 45,
        image:
          "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=200&h=200&fit=crop",
      },
    ],
  },
  {
    id: 3,
    name: "Plomberie Douala Services",
    ownerName: "Jean-Paul Mbeki",
    category: "Plomberie",
    categorySlug: "plomberie",
    rating: 4.6,
    reviews: 84,
    distance: "3.8 km",
    city: "Douala",
    address: "Quartier Bonapriso, Douala",
    phone: "+237 6 77 34 21 09",
    verified: true,
    availableToday: false,
    priceFrom: 6000,
    currency: "FCFA",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop",
    cover:
      "https://images.unsplash.com/photo-1607472829322-6b5b8f9e6f1c?w=1200&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=600&h=450&fit=crop",
      "https://images.unsplash.com/photo-1607472829322-6b5b8f9e6f1c?w=600&h=450&fit=crop",
    ],
    description:
      "Plombier polyvalent : fuites, sanitaires, chauffe-eau et installation complète de salles d'eau. Interventions dans tout le Littoral.",
    amenities: { wifi: false, parking: false, accessibility: false, kids: false },
    hours: [
      { day: "Lundi", time: "08:00 - 17:30" },
      { day: "Mardi", time: "08:00 - 17:30" },
      { day: "Mercredi", time: "08:00 - 17:30" },
      { day: "Jeudi", time: "08:00 - 17:30" },
      { day: "Vendredi", time: "08:00 - 17:30" },
      { day: "Samedi", time: "Fermé", today: true },
      { day: "Dimanche", time: "Fermé" },
    ],
    paymentMethods: ["Espèces", "Mobile Money"],
    services: [
      {
        id: 301,
        name: "Réparation de fuite",
        desc: "Détection et réparation, pièces comprises.",
        price: 9000,
        duration: 60,
        image:
          "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=200&h=200&fit=crop",
      },
      {
        id: 302,
        name: "Installation chauffe-eau",
        desc: "Pose et raccordement, garantie 6 mois.",
        price: 38000,
        duration: 150,
        image:
          "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=200&h=200&fit=crop",
      },
    ],
  },
  {
    id: 4,
    name: "Bâtir Kinshasa",
    ownerName: "Patrice Ilunga",
    category: "Maçonnerie",
    categorySlug: "maconnerie",
    rating: 4.7,
    reviews: 96,
    distance: "4.1 km",
    city: "Kinshasa",
    address: "Avenue de la Paix, Gombe, Kinshasa",
    phone: "+243 81 234 56 78",
    verified: false,
    availableToday: true,
    priceFrom: 15000,
    currency: "FCFA",
    avatar:
      "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=300&h=300&fit=crop",
    cover:
      "https://images.unsplash.com/photo-1541976590-713941681591?w=1200&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=450&fit=crop",
      "https://images.unsplash.com/photo-1541976590-713941681591?w=600&h=450&fit=crop",
    ],
    description:
      "Équipe de 6 maçons pour gros œuvre, fondations et rénovation. Chantiers résidentiels et petits collectifs partout à Kinshasa.",
    amenities: { wifi: false, parking: true, accessibility: false, kids: false },
    hours: [
      { day: "Lundi", time: "07:00 - 17:00" },
      { day: "Mardi", time: "07:00 - 17:00" },
      { day: "Mercredi", time: "07:00 - 17:00", today: true },
      { day: "Jeudi", time: "07:00 - 17:00" },
      { day: "Vendredi", time: "07:00 - 17:00" },
      { day: "Samedi", time: "07:00 - 13:00" },
      { day: "Dimanche", time: "Fermé" },
    ],
    paymentMethods: ["Espèces", "Virement"],
    services: [
      {
        id: 401,
        name: "Devis chantier gros œuvre",
        desc: "Visite, métré et devis détaillé.",
        price: 0,
        duration: 60,
        image:
          "https://images.unsplash.com/photo-1541976590-713941681591?w=200&h=200&fit=crop",
      },
      {
        id: 402,
        name: "Réparation de fissures",
        desc: "Diagnostic structurel et reprise.",
        price: 22000,
        duration: 180,
        image:
          "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=200&h=200&fit=crop",
      },
    ],
  },
  {
    id: 5,
    name: "Leroy Couleurs",
    ownerName: "Fatou Cissé",
    category: "Peinture",
    categorySlug: "peinture",
    rating: 4.8,
    reviews: 61,
    distance: "1.8 km",
    city: "Dakar",
    address: "Rue 12, Médina, Dakar",
    phone: "+221 76 890 21 45",
    verified: true,
    availableToday: true,
    priceFrom: 4000,
    currency: "FCFA",
    avatar:
      "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=300&h=300&fit=crop",
    cover:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1200&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=450&fit=crop",
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=450&fit=crop",
    ],
    description:
      "Peintre en bâtiment, finitions soignées, teintes personnalisées. Intérieur et extérieur, du studio à la villa.",
    amenities: { wifi: false, parking: false, accessibility: false, kids: true },
    hours: [
      { day: "Lundi", time: "08:00 - 18:00" },
      { day: "Mardi", time: "08:00 - 18:00" },
      { day: "Mercredi", time: "08:00 - 18:00" },
      { day: "Jeudi", time: "08:00 - 18:00" },
      { day: "Vendredi", time: "08:00 - 18:00" },
      { day: "Samedi", time: "09:00 - 15:00", today: true },
      { day: "Dimanche", time: "Fermé" },
    ],
    paymentMethods: ["Espèces", "Mobile Money", "Carte bancaire"],
    services: [
      {
        id: 501,
        name: "Peinture pièce (jusqu'à 20 m²)",
        desc: "Préparation des murs et deux couches.",
        price: 28000,
        duration: 240,
        image:
          "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&h=200&fit=crop",
      },
      {
        id: 502,
        name: "Peinture façade",
        desc: "Traitement anti-humidité inclus.",
        price: 65000,
        duration: 360,
        image:
          "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=200&h=200&fit=crop",
      },
    ],
  },
  {
    id: 6,
    name: "Chez Adjoa Couture",
    ownerName: "Adjoa Mensah",
    category: "Couture",
    categorySlug: "couture",
    rating: 4.9,
    reviews: 174,
    distance: "0.9 km",
    city: "Lomé",
    address: "Marché Adawlato, Lomé",
    phone: "+228 90 45 67 21",
    verified: true,
    availableToday: true,
    priceFrom: 3000,
    currency: "FCFA",
    avatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=300&fit=crop",
    cover:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=450&fit=crop",
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=450&fit=crop",
    ],
    description:
      "Couturière spécialisée en tenues traditionnelles et sur-mesure occidental. Wax, bazin et dentelle sélectionnés en atelier.",
    amenities: { wifi: true, parking: false, accessibility: false, kids: true },
    hours: [
      { day: "Lundi", time: "09:00 - 19:00" },
      { day: "Mardi", time: "09:00 - 19:00" },
      { day: "Mercredi", time: "09:00 - 19:00" },
      { day: "Jeudi", time: "09:00 - 19:00" },
      { day: "Vendredi", time: "09:00 - 19:00" },
      { day: "Samedi", time: "09:00 - 19:00", today: true },
      { day: "Dimanche", time: "Sur rendez-vous" },
    ],
    paymentMethods: ["Espèces", "Mobile Money"],
    services: [
      {
        id: 601,
        name: "Tenue traditionnelle sur mesure",
        desc: "Prise de mesures, un essayage inclus.",
        price: 25000,
        duration: 45,
        image:
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=200&fit=crop",
      },
      {
        id: 602,
        name: "Retouche express",
        desc: "Ourlet, ajustement, fermeture éclair.",
        price: 3500,
        duration: 20,
        image:
          "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&h=200&fit=crop",
      },
    ],
  },
  {
    id: 7,
    name: "Wytalo Barbershop",
    ownerName: "Wytalo Costa",
    category: "Coiffure",
    categorySlug: "coiffure",
    rating: 5.0,
    reviews: 312,
    distance: "0.6 km",
    city: "Cotonou",
    address: "Boulevard Saint-Michel, Cotonou",
    phone: "+229 97 55 12 84",
    verified: true,
    availableToday: true,
    priceFrom: 2000,
    currency: "FCFA",
    avatar:
      "https://s3-sa-east-1.amazonaws.com/img-appbarber-appbeleza/barbeariarb19un-ptx5/696623ba84938.png",
    cover:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1200&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&h=450&fit=crop",
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&h=450&fit=crop",
    ],
    description:
      "Barbershop nouvelle génération. Coupe, taille de barbe, coloration. Ambiance musicale, thé à la menthe offert.",
    amenities: { wifi: true, parking: true, accessibility: false, kids: false },
    hours: [
      { day: "Lundi", time: "09:00 - 20:00" },
      { day: "Mardi", time: "09:00 - 20:00" },
      { day: "Mercredi", time: "09:00 - 20:00" },
      { day: "Jeudi", time: "09:00 - 20:00" },
      { day: "Vendredi", time: "09:00 - 20:00", today: true },
      { day: "Samedi", time: "09:00 - 20:00" },
      { day: "Dimanche", time: "10:00 - 16:00" },
    ],
    paymentMethods: ["Espèces", "Mobile Money", "Carte bancaire"],
    services: [
      {
        id: 701,
        name: "Coupe de cheveux",
        desc: "Coupe classique ou dégradé, shampoing inclus.",
        price: 2500,
        duration: 30,
        image:
          "https://s3-sa-east-1.amazonaws.com/img-appbarber-appbeleza/barbeariarb19un-ptx5/696623ba84938.png",
      },
      {
        id: 702,
        name: "Taille de barbe",
        desc: "Rasage à l'ancienne, serviette chaude.",
        price: 1500,
        duration: 20,
        image:
          "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=200&h=200&fit=crop",
      },
      {
        id: 703,
        name: "Coupe + Barbe",
        desc: "La formule complète.",
        price: 3500,
        duration: 50,
        image:
          "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=200&h=200&fit=crop",
      },
    ],
  },
  {
    id: 8,
    name: "Garage Yaoundé Rapide",
    ownerName: "Emmanuel Ateba",
    category: "Mécanique auto",
    categorySlug: "mecanique",
    rating: 4.5,
    reviews: 58,
    distance: "5.2 km",
    city: "Yaoundé",
    address: "Zone Industrielle, Yaoundé",
    phone: "+237 6 90 12 34 56",
    verified: false,
    availableToday: true,
    priceFrom: 5000,
    currency: "FCFA",
    avatar:
      "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=300&h=300&fit=crop",
    cover:
      "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=1200&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&h=450&fit=crop",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=450&fit=crop",
    ],
    description:
      "Garage polyvalent : vidange, freins, diagnostic électronique. Devis transparent avant toute intervention.",
    amenities: { wifi: false, parking: true, accessibility: false, kids: false },
    hours: [
      { day: "Lundi", time: "07:30 - 18:00" },
      { day: "Mardi", time: "07:30 - 18:00" },
      { day: "Mercredi", time: "07:30 - 18:00" },
      { day: "Jeudi", time: "07:30 - 18:00" },
      { day: "Vendredi", time: "07:30 - 18:00" },
      { day: "Samedi", time: "08:00 - 14:00", today: true },
      { day: "Dimanche", time: "Fermé" },
    ],
    paymentMethods: ["Espèces", "Mobile Money"],
    services: [
      {
        id: 801,
        name: "Vidange + filtres",
        desc: "Huile moteur et filtre à huile inclus.",
        price: 18000,
        duration: 45,
        image:
          "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=200&h=200&fit=crop",
      },
      {
        id: 802,
        name: "Diagnostic électronique",
        desc: "Lecture des codes défaut, rapport détaillé.",
        price: 8000,
        duration: 30,
        image:
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=200&fit=crop",
      },
    ],
  },
];

const testimonialsData = [
  {
    name: "Chantal Boko",
    role: "Cliente à Cotonou",
    rating: 5,
    quote:
      "J'ai trouvé une couturière à deux rues de chez moi en trois minutes. La prise de rendez-vous en ligne m'a évité trois appels perdus.",
    avatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop",
  },
  {
    name: "Serge Kouassi",
    role: "Client à Abidjan",
    rating: 5,
    quote:
      "L'électricienne est arrivée à l'heure annoncée, avec un devis clair avant de commencer. Ça change de mes anciennes expériences.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    name: "Aïcha Ndour",
    role: "Cliente à Dakar",
    rating: 4,
    quote:
      "Bonne plateforme, les avis des autres clients m'ont aidée à choisir le bon menuisier pour ma bibliothèque.",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop",
  },
  {
    name: "Patrick Mvondo",
    role: "Client à Douala",
    rating: 5,
    quote:
      "Le suivi par messagerie avant le rendez-vous m'a permis de préciser exactement ce qu'il fallait réparer.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  },
];
