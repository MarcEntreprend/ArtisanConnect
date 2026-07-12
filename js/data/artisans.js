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
    city: "Fond Bleu",
    address: "Rue des Jardins, Cocody, Fond Bleu",
    phone: "+225 07 08 45 12 96",
    verified: true,
    availableToday: true,
    priceFrom: 8000,
    currency: "Gourdes",
    avatar:
      "https://t3.ftcdn.net/jpg/08/41/69/80/240_F_841698011_HWYNrkANayX4nGi8rRHv1n1N1pHqKhoZ.jpg",
    cover:
      "https://t4.ftcdn.net/jpg/01/00/92/77/240_F_100927714_5sBEtJ98fOPbrRQcJAzkbwJJgZqNXa1T.jpg",
    gallery: [
      "https://t4.ftcdn.net/jpg/19/98/13/85/240_F_1998138504_l5Jniw0qUvFZEhplKwrEcnQqO2R8BhFX.jpg",
      "https://t4.ftcdn.net/jpg/06/76/14/57/240_F_676145741_cjrcvzDG3GbMzOnVVFLX4J0GWTbCxtnq.jpg",
      "https://t3.ftcdn.net/jpg/08/41/69/80/240_F_841698011_HWYNrkANayX4nGi8rRHv1n1N1pHqKhoZ.jpg",
      "https://t4.ftcdn.net/jpg/01/97/21/61/240_F_197216166_xTq2CSTfTat6p0VUSDUsQT9sxsxtRX6F.jpg",
      "https://t4.ftcdn.net/jpg/12/93/74/93/240_F_1293749363_83tAaXMHCkQQHYlkyJRFvR4yy2JcKytf.jpg",
    ],
    description:
      "Menuiserie familiale fondée en 2011, spécialisée dans le mobilier sur mesure et la restauration de meubles anciens. Bois locaux (iroko, teck) travaillés à l'atelier de Cocody.",
    amenities: {
      wifi: false,
      parking: true,
      accessibility: false,
      kids: false,
    },
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
    name: "Williams Électricité Générale",
    ownerName: "Malia Williams",
    category: "Électricité",
    categorySlug: "electricite",
    rating: 4.9,
    reviews: 208,
    distance: "1.5 km",
    city: "Maniche",
    address: "Avenue Bourguiba, Sacré-Cœur, Maniche",
    phone: "+221 77 512 34 08",
    verified: true,
    availableToday: true,
    priceFrom: 5000,
    currency: "Gourdes",
    avatar:
      "https://t4.ftcdn.net/jpg/06/36/95/49/240_F_636954924_VUaZK1GxXifZj4oLQaNyq3MrdDMAjHfX.jpg",
    cover:
      "https://t4.ftcdn.net/jpg/14/48/76/19/240_F_1448761954_96WiOEt57acsa4MGcgo8G9JGKmbuy9z2.jpg",
    gallery: [
      "https://t3.ftcdn.net/jpg/00/36/91/00/240_F_36910036_bySUOcQ2rAHC04gqUnvj1Jzmi6v4RSfs.jpg",
      "https://t4.ftcdn.net/jpg/10/64/45/71/240_F_1064457152_GU8INobnZgCFCNpV2CPsHnhzToqpRJs6.jpg",
      "https://t3.ftcdn.net/jpg/20/81/85/84/240_F_2081858462_Vz2tg1MYbSzoWTF1DAvL9KpNYRMCYTbd.jpg",
      "https://t4.ftcdn.net/jpg/02/84/63/67/240_F_284636772_dNSXSADXsOqFx2U8viYubF1Ju75Zoe5I.jpg",
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
          "https://t4.ftcdn.net/jpg/02/84/63/67/240_F_284636772_dNSXSADXsOqFx2U8viYubF1Ju75Zoe5I.jpg",
      },
      {
        id: 202,
        name: "Installation de tableau électrique",
        desc: "Mise aux normes et remplacement de disjoncteurs.",
        price: 55000,
        duration: 240,
        image:
          "https://t4.ftcdn.net/jpg/02/86/71/85/240_F_286718572_zI4bZkM9D1KErFGaRzyR1DI9Y8K06CQw.jpg",
      },
      {
        id: 203,
        name: "Dépannage urgence",
        desc: "Panne de courant, court-circuit, intervention rapide.",
        price: 15000,
        duration: 45,
        image:
          "https://t4.ftcdn.net/jpg/00/92/68/43/240_F_92684369_jTVFSDyc3IIm1Vf3k9nDoLzz97WRqRIP.jpg",
      },
    ],
  },
  {
    id: 3,
    name: "Plomberie Champlois Services",
    ownerName: "Jean-Paul Mbeki",
    category: "Plomberie",
    categorySlug: "plomberie",
    rating: 4.6,
    reviews: 84,
    distance: "3.8 km",
    city: "Champlois",
    address: "Quartier Bonapriso, Champlois",
    phone: "+237 6 77 34 21 09",
    verified: true,
    availableToday: false,
    priceFrom: 6000,
    currency: "Gourdes",
    avatar:
      "https://t3.ftcdn.net/jpg/06/92/72/48/240_F_692724880_TVkUVmPnvPDd3PCvQtO15hJCil3a5cNL.jpg",
    cover:
      "https://t4.ftcdn.net/jpg/01/97/42/69/240_F_197426968_uMePQ3EbNk9NajFW4f1kGILR9fdvWB9G.jpg",
    gallery: [
      "https://t4.ftcdn.net/jpg/16/53/67/85/240_F_1653678523_HlIr0Oq3WiBB2tRyqZNksK2QTdUWLaZe.jpg",
      "https://t4.ftcdn.net/jpg/08/47/57/51/240_F_847575159_yssboVDzurCtvzP0Mo9GGoES7mkxGKx6.jpg",
    ],
    description:
      "Plombier polyvalent : fuites, sanitaires, chauffe-eau et installation complète de salles d'eau. Interventions dans tout le Littoral.",
    amenities: {
      wifi: false,
      parking: false,
      accessibility: false,
      kids: false,
    },
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
          "https://t4.ftcdn.net/jpg/19/12/31/41/240_F_1912314144_GfwWWNL9ozzvzGIA36iLPyhzhMfv4vOy.jpg",
      },
      {
        id: 302,
        name: "Installation chauffe-eau",
        desc: "Pose et raccordement, garantie 6 mois.",
        price: 38000,
        duration: 150,
        image:
          "https://t3.ftcdn.net/jpg/01/81/10/52/240_F_181105284_1iSZIIGzqDDkcwRp17DRIWNRgBKP6SMy.jpg",
      },
    ],
  },
  {
    id: 4,
    name: "Everest Construction",
    ownerName: "Patrice McCollins",
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
    currency: "Gourdes",
    avatar:
      "https://t4.ftcdn.net/jpg/16/26/17/91/240_F_1626179105_tDBw7IxKpYgmJFn1PhC9kLAuncpuzR8b.jpg",
    cover:
      "https://t4.ftcdn.net/jpg/05/16/47/81/240_F_516478137_A172Yao4NDb25xsaq9M1U5h9kSKDcsHh.jpg",
    gallery: [
      "https://t4.ftcdn.net/jpg/05/16/47/81/240_F_516478137_A172Yao4NDb25xsaq9M1U5h9kSKDcsHh.jpg",
      "https://t4.ftcdn.net/jpg/08/12/10/01/240_F_812100169_qpY9YgECjAVMXs1JY44va5s93ivrqltZ.jpg",
      "https://t3.ftcdn.net/jpg/17/55/22/66/240_F_1755226683_N6JLFiREjBLa7wQDhuvAxq1NTFsKuYnm.jpg",
    ],
    description:
      "Équipe de 6 maçons pour gros œuvre, fondations et rénovation. Chantiers résidentiels et petits collectifs partout à Kinshasa.",
    amenities: {
      wifi: false,
      parking: true,
      accessibility: false,
      kids: false,
    },
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
          "https://t4.ftcdn.net/jpg/20/76/85/73/240_F_2076857375_z6X24pUhTViVTP6766sJzjzZHxovbxPG.jpg",
      },
      {
        id: 402,
        name: "Réparation de fissures",
        desc: "Diagnostic structurel et reprise.",
        price: 22000,
        duration: 180,
        image:
          "https://t4.ftcdn.net/jpg/05/82/69/25/240_F_582692534_o7g2w4h17BZrvfOXsK1a5KTMYVJAlhqq.jpg",
      },
    ],
  },
  {
    id: 5,
    name: "Dayo Couleurs",
    ownerName: "Dayo Johnson",
    category: "Peinture",
    categorySlug: "peinture",
    rating: 4.8,
    reviews: 61,
    distance: "1.8 km",
    city: "Maniche",
    address: "Rue 12, Médina, Maniche",
    phone: "+221 76 890 21 45",
    verified: true,
    availableToday: true,
    priceFrom: 4000,
    currency: "Gourdes",
    avatar:
      "https://t3.ftcdn.net/jpg/03/61/02/42/240_F_361024248_435bikjuasQLQc4HoOQcSBxxyxKgMreG.jpg",
    cover:
      "https://t4.ftcdn.net/jpg/19/49/37/15/240_F_1949371563_oHfs5he2gC4gYVqB5nb3AX4KISHExQCS.jpg",
    gallery: [
      "https://t4.ftcdn.net/jpg/00/93/48/97/240_F_93489738_mC2yY1e9GE6ScjcqZu3uCiXgSTFTomKQ.jpg",
      "https://t4.ftcdn.net/jpg/20/54/96/79/240_F_2054967926_KP4zFkgi8IXzYGwfOeHl34E5ZNcUXeHS.jpg",
      "https://t4.ftcdn.net/jpg/06/45/78/85/240_F_645788585_AUxyS0vvWT0heHXG73VPWBVU6fQ3nWUE.jpg",
      "https://t4.ftcdn.net/jpg/19/49/37/15/240_F_1949371563_oHfs5he2gC4gYVqB5nb3AX4KISHExQCS.jpg",
    ],
    description:
      "Peintre en bâtiment, finitions soignées, teintes personnalisées. Intérieur et extérieur, du studio à la villa.",
    amenities: {
      wifi: false,
      parking: false,
      accessibility: false,
      kids: true,
    },
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
          "https://t4.ftcdn.net/jpg/19/49/37/15/240_F_1949371563_oHfs5he2gC4gYVqB5nb3AX4KISHExQCS.jpg",
      },
      {
        id: 502,
        name: "Peinture façade",
        desc: "Traitement anti-humidité inclus.",
        price: 65000,
        duration: 360,
        image:
          "https://t4.ftcdn.net/jpg/20/54/96/79/240_F_2054967926_KP4zFkgi8IXzYGwfOeHl34E5ZNcUXeHS.jpg",
      },
    ],
  },
  {
    id: 6,
    name: "Chantale Couture",
    ownerName: "Chantale Dubois",
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
    priceFrom: 5000,
    currency: "Gourdes",
    avatar:
      "https://t4.ftcdn.net/jpg/03/96/56/45/240_F_396564583_oyJEFbQMGky9wYe64s1cmvcoe5QCviuZ.jpg",
    cover:
      "https://t3.ftcdn.net/jpg/20/60/05/60/240_F_2060056005_Kq4gjJFnl6Mc3XtpMfEEOSYB3pmkoIUt.jpg",
    gallery: [
      "https://t3.ftcdn.net/jpg/20/84/97/34/240_F_2084973422_UmhzHoxGbws88W01jFci2cCrnOI3cBct.jpg",
      "https://t4.ftcdn.net/jpg/05/20/34/85/240_F_520348583_15GZY3WL0f947422Fl8INlD9mc12sUk6.jpg",
      "https://t4.ftcdn.net/jpg/05/20/34/85/240_F_520348583_15GZY3WL0f947422Fl8INlD9mc12sUk6.jpg",
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
          "https://t3.ftcdn.net/jpg/20/48/53/30/240_F_2048533050_jMgj3dPELApQOXuxeLhqdfh2mVCc5aod.jpg",
      },
      {
        id: 602,
        name: "Retouche express",
        desc: "Ourlet, ajustement, fermeture éclair.",
        price: 3500,
        duration: 20,
        image:
          "https://t4.ftcdn.net/jpg/10/31/14/45/240_F_1031144592_MzroIPvj31ycY6KTMN0YSpblokZl77KO.jpg",
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
    city: "Port-Salut",
    address: "Boulevard Saint-Michel, Port-Salut",
    phone: "+229 97 55 12 84",
    verified: true,
    availableToday: true,
    priceFrom: 500,
    currency: "Gourdes",
    avatar:
      "https://t4.ftcdn.net/jpg/15/63/28/17/240_F_1563281757_KMXnHzXEeGd6ce6Gff7k8nVI28HjXDs6.jpg",
    cover:
      "https://t4.ftcdn.net/jpg/19/13/07/89/240_F_1913078995_AG7tCOFBiWTXTu1JxqxRfy0DR0MOF72O.jpg",
    gallery: [
      "https://t4.ftcdn.net/jpg/02/53/05/27/240_F_253052787_7dcGCTphwIsFbolAiGOtymHofSD7T9mR.jpg",
      "https://t4.ftcdn.net/jpg/19/13/07/89/240_F_1913078995_AG7tCOFBiWTXTu1JxqxRfy0DR0MOF72O.jpg",
      "https://t3.ftcdn.net/jpg/01/20/11/28/240_F_120112877_YupEoEBZ53vQFFWAxCcTadp7kD0xrKaG.jpg",
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
          "https://t4.ftcdn.net/jpg/20/11/05/35/240_F_2011053558_6y7l8DJCC4bCRb4CVE6l0ZRuxYtStrrR.jpg",
      },
      {
        id: 702,
        name: "Taille de barbe",
        desc: "Rasage à l'ancienne, serviette chaude.",
        price: 1500,
        duration: 20,
        image:
          "https://t4.ftcdn.net/jpg/19/13/07/89/240_F_1913078995_AG7tCOFBiWTXTu1JxqxRfy0DR0MOF72O.jpg",
      },
      {
        id: 703,
        name: "Coupe + Barbe",
        desc: "La formule complète.",
        price: 3500,
        duration: 50,
        image:
          "https://t3.ftcdn.net/jpg/04/07/17/94/240_F_407179412_ZPCWhFBSICbucUAM8yKJZNedmco2coA2.jpg",
      },
    ],
  },
  {
    id: 8,
    name: "Garage Grand Rapide",
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
    currency: "Gourdes",
    avatar:
      "https://t3.ftcdn.net/jpg/04/19/47/86/240_F_419478604_8PNwaMshpwfvOy6ApDtPikrHoxNxED3D.jpg",
    cover:
      "https://t4.ftcdn.net/jpg/20/63/61/55/240_F_2063615520_g76SI0hnvMYEryrX5NqeQ5pNMkKz0g6S.jpg",
    gallery: [
      "https://t3.ftcdn.net/jpg/20/62/00/62/240_F_2062006278_q8TXSEmbRMuAf0K6v5wKE7qPND1CbQgm.jpg",
      "https://t4.ftcdn.net/jpg/20/59/84/11/240_F_2059841141_tCbvJbTpEBC2qn2OIRNno8dU6WTAz16M.jpg",
      "https://t3.ftcdn.net/jpg/04/19/47/86/240_F_419478604_8PNwaMshpwfvOy6ApDtPikrHoxNxED3D.jpg",
    ],
    description:
      "Garage polyvalent : vidange, freins, diagnostic électronique. Devis transparent avant toute intervention.",
    amenities: {
      wifi: false,
      parking: true,
      accessibility: false,
      kids: false,
    },
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
          "https://t4.ftcdn.net/jpg/20/59/83/83/240_F_2059838382_S2C9NIq0wrNVuAqhavEHoA9s8k5oWU18.jpg",
      },
      {
        id: 802,
        name: "Diagnostic électronique",
        desc: "Lecture des codes défaut, rapport détaillé.",
        price: 8000,
        duration: 30,
        image:
          "https://t4.ftcdn.net/jpg/20/59/84/11/240_F_2059841141_tCbvJbTpEBC2qn2OIRNno8dU6WTAz16M.jpg",
      },
    ],
  },
];

const testimonialsData = [
  {
    name: "Chantal James",
    role: "Cliente à Port-Salut",
    rating: 5,
    quote:
      "J'ai trouvé une couturière à deux rues de chez moi en trois minutes. La prise de rendez-vous en ligne m'a évité trois appels perdus.",
    avatar:
      "https://t4.ftcdn.net/jpg/03/51/56/07/240_F_351560776_sEYcaEM5PK8BxRx4GewPAYCbCmlKbBOJ.jpg",
  },
  {
    name: "Serge Jean",
    role: "Client à Fond Bleu",
    rating: 5,
    quote:
      "L'électricienne est arrivée à l'heure annoncée, avec un devis clair avant de commencer. Ça change de mes anciennes expériences.",
    avatar:
      "https://t4.ftcdn.net/jpg/05/17/43/25/240_F_517432572_Q7cWReFsAWbFjmOCxbJUnMeEbLacZCEl.jpg",
  },
  {
    name: "Aïcha Omar",
    role: "Cliente à Maniche",
    rating: 4,
    quote:
      "Bonne plateforme, les avis des autres clients m'ont aidée à choisir le bon menuisier pour ma bibliothèque.",
    avatar:
      "https://t3.ftcdn.net/jpg/01/06/55/58/240_F_106555867_yd9obhwNljC895BovPDzclkRbsMLXL2M.jpg",
  },
  {
    name: "Patrick Mvondo",
    role: "Client à Champlois",
    rating: 5,
    quote:
      "Le suivi par messagerie avant le rendez-vous m'a permis de préciser exactement ce qu'il fallait réparer.",
    avatar:
      "https://t4.ftcdn.net/jpg/01/37/36/37/240_F_137363729_sjPyXboShqUJp4nTRl4KTWxcx9IS6Kip.jpg",
  },
];

/* ============================================================
   AVIS CLIENTS (par artisan)
   ============================================================ */
const reviewsData = [
  {
    id: 1,
    artisanId: 1,
    author: "Chantal James",
    avatar:
      "https://t4.ftcdn.net/jpg/16/62/14/29/240_F_1662142902_8XSsDdZwm1HbNx354XoS3qc03x39SWRg.jpg",
    rating: 5,
    date: "2026-06-28",
    comment:
      "Table sur mesure magnifique, livrée avec une semaine d'avance. Le bois est superbe.",
    reply: null,
  },
  {
    id: 2,
    artisanId: 1,
    author: "Serge Jean",
    avatar:
      "https://d6qwfb5pdou4u.cloudfront.net/product-images/410001-420000/416518/147320575577c4834f80896cba3c0313c83f641833/1500-1500-frame-90.jpg",
    rating: 4,
    date: "2026-06-14",
    comment:
      "Bon travail sur la restauration de mon armoire, un peu de retard sur le délai annoncé.",
    reply: {
      text: "Merci Serge, désolé pour le délai — nous avons eu une rupture de vernis. Content que le résultat vous plaise !",
      date: "2026-06-15",
    },
  },
  {
    id: 3,
    artisanId: 2,
    author: "Aïcha Omar",
    avatar: "https://i.sstatic.net/CFGMu.jpg",
    rating: 5,
    date: "2026-06-30",
    comment:
      "Intervention rapide et propre, tableau électrique aux normes enfin ! Merci Aminata.",
    reply: null,
  },
  {
    id: 4,
    artisanId: 7,
    author: "Patrick Slovesky",
    avatar:
      "https://t4.ftcdn.net/jpg/12/30/25/55/240_F_1230255583_UQI2SUYEepSjx81EzDgLPvQ9ricZMRPn.jpg",
    rating: 5,
    date: "2026-07-02",
    comment: "Meilleur barbershop du quartier, ambiance top et coupe nickel.",
    reply: {
      text: "Merci Patrick, à très vite pour la prochaine coupe 🙌",
      date: "2026-07-02",
    },
  },
];

/* ============================================================
   RENDEZ-VOUS (utilisateur connecté, mock)
   ============================================================ */
const appointmentsData = [
  {
    id: 1001,
    artisanId: 7,
    serviceName: "Coupe + Barbe",
    date: "2026-07-12",
    time: "10:30",
    status: "upcoming",
    price: 3500,
  },
  {
    id: 1002,
    artisanId: 2,
    serviceName: "Diagnostic électrique complet",
    date: "2026-07-18",
    time: "09:00",
    status: "upcoming",
    price: 12000,
  },
  {
    id: 1003,
    artisanId: 1,
    serviceName: "Restauration de meuble ancien",
    date: "2026-06-20",
    time: "14:00",
    status: "done",
    price: 18000,
  },
  {
    id: 1004,
    artisanId: 6,
    serviceName: "Tenue traditionnelle sur mesure",
    date: "2026-06-05",
    time: "11:00",
    status: "done",
    price: 25000,
  },
  {
    id: 1005,
    artisanId: 5,
    serviceName: "Peinture pièce (jusqu'à 20 m²)",
    date: "2026-05-22",
    time: "08:00",
    status: "cancelled",
    price: 28000,
  },
];

/* ============================================================
   MESSAGERIE (mock)
   ============================================================ */
const conversationsData = [
  {
    id: 1,
    artisanId: 7,
    unread: true,
    messages: [
      {
        from: "me",
        text: "Bonjour, avez-vous un créneau ce vendredi après-midi ?",
        time: "09:12",
      },
      {
        from: "them",
        text: "Bonjour ! Oui, il me reste 15h30 ou 17h. Ça vous va ?",
        time: "09:20",
      },
      { from: "me", text: "Va pour 15h30, merci !", time: "09:22" },
      {
        from: "them",
        text: "Parfait, c'est noté 👍 À vendredi.",
        time: "09:24",
      },
    ],
  },
  {
    id: 2,
    artisanId: 2,
    unread: false,
    messages: [
      {
        from: "me",
        text: "Bonjour, mon tableau électrique disjoncte souvent, pouvez-vous passer voir ?",
        time: "Hier",
      },
      {
        from: "them",
        text: "Bonjour, je peux passer jeudi matin pour un diagnostic. Ça vous convient ?",
        time: "Hier",
      },
      { from: "me", text: "Oui très bien, merci beaucoup.", time: "Hier" },
    ],
  },
  {
    id: 3,
    artisanId: 1,
    unread: false,
    messages: [
      {
        from: "them",
        text: "Votre table est prête, vous pouvez venir la récupérer à l'atelier.",
        time: "20 juin",
      },
      { from: "me", text: "Super merci, je passe demain !", time: "20 juin" },
    ],
  },
  {
    id: 4,
    artisanId: 6,
    unread: true,
    messages: [
      {
        from: "them",
        text: "Bonjour, j'ai bien reçu vos mesures. Quel tissu souhaitez-vous pour la tenue ?",
        time: "Lun",
      },
    ],
  },
];

const CURRENT_ARTISAN_ID = 1; // Pour la démo de l'espace artisan (Koffi Atelier Bois)
