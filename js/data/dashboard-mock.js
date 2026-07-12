// js/data/dashboard-mock.js
/**
 * ARTISANCONNECT — Données mockées de l'Espace Artisan
 * Simule les comptes solo / responsable / employé en attendant Supabase + Auth.
 * Ce fichier est chargé après js/data/artisans.js (il étend certaines données existantes)
 * et avant js/dashboard.js.
 */

// Date de référence pour tous les calculs "aujourd'hui / cette semaine" du mock.
// Correspond à la date actuelle du produit — évite les décalages si le prototype
// est ouvert un autre jour que celui du développement.
const TODAY_MOCK = "2026-07-08";

/* ============================================================
   PERSONAS DE DÉMONSTRATION
   ============================================================ */
const DEMO_PERSONAS = {
  solo: {
    type: "solo",
    label: "Vue solo",
    artisanId: 1, // Koffi Atelier Bois
    firstName: "Koffi",
    teamId: null,
    memberId: null,
  },
  responsable: {
    type: "responsable",
    label: "Vue responsable",
    artisanId: 7, // Wytalo Barbershop
    firstName: "Wytalo",
    teamId: 1,
    memberId: 101,
  },
  employe: {
    type: "employe",
    label: "Vue employé",
    artisanId: 7, // Wytalo Barbershop (l'équipe pour laquelle Carlos travaille)
    firstName: "Carlos",
    teamId: 1,
    memberId: 102,
  },
};

/* ============================================================
   ÉQUIPES
   ============================================================ */
const teamsData = [
  {
    id: 1,
    artisanId: 7,
    name: "Wytalo Barbershop",
    members: [
      {
        id: 101,
        name: "Wytalo Costa",
        role: "responsable",
        specialty: "Coupe & Barbe",
        avatar:
          "https://s3-sa-east-1.amazonaws.com/img-appbarber-appbeleza/barbeariarb19un-ptx5/696623ba84938.png",
        status: "actif",
        permissions: {
          voitStats: true,
          modifieServicesHoraires: true,
          reponsAvis: true,
        },
        hasSoloActivity: false,
      },
      {
        id: 102,
        name: "Carlos",
        role: "employe",
        specialty: "Coupe classique",
        avatar:
          "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&fit=crop",
        status: "actif",
        permissions: {
          voitStats: true,
          modifieServicesHoraires: true,
          reponsAvis: true,
        },
        hasSoloActivity: true,
      },
      {
        id: 103,
        name: "Ana",
        role: "employe",
        specialty: "Coloration",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
        status: "actif",
        permissions: {
          voitStats: false,
          modifieServicesHoraires: false,
          reponsAvis: false,
        },
        hasSoloActivity: false,
      },
      {
        id: 104,
        name: "Miguel",
        role: "employe",
        specialty: "Taille de barbe",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
        status: "en_pause",
        permissions: {
          voitStats: false,
          modifieServicesHoraires: false,
          reponsAvis: false,
        },
        hasSoloActivity: false,
      },
    ],
  },
];

function getTeamByArtisan(artisanId) {
  return teamsData.find((t) => t.artisanId === artisanId) || null;
}

function getTeamMember(teamId, memberId) {
  const team = teamsData.find((t) => t.id === teamId);
  if (!team) return null;
  return team.members.find((m) => m.id === memberId) || null;
}

/* ============================================================
   MODIFICATIONS EN ATTENTE DE VALIDATION (proposées par un employé)
   ============================================================ */
const pendingChangesData = [
  {
    id: 1,
    teamId: 1,
    memberId: 102,
    type: "service",
    targetId: 701, // id du service "Coupe de cheveux"
    description:
      "Nouveau prix proposé pour « Coupe de cheveux » : 400 Gourdes (au lieu de 550 Gourdes)",
    date: "2026-07-06",
    status: "en_attente",
  },
];

/* ============================================================
   FINANCES (mock)
   ============================================================ */
const financeData = {
  entreprise: {
    soldeGlobal: 245000,
    recettesDuMois: 380000,
    ceQuOnDoitAuxMembres: [
      { memberId: 102, montant: 45000 },
      { memberId: 103, montant: 32000 },
      { memberId: 104, montant: 18000 },
    ],
    historiqueTransactions: [
      {
        id: 1,
        label: "Paiement client — Coupe + Barbe",
        montant: 3500,
        date: "2026-07-07",
      },
      {
        id: 2,
        label: "Paiement client — Coloration",
        montant: 8000,
        date: "2026-07-06",
      },
      {
        id: 3,
        label: "Paiement client — Coupe de cheveux",
        montant: 2500,
        date: "2026-07-05",
      },
    ],
  },
  membres: {
    102: {
      gainsEntreprise: 45000,
      gainsSolo: 12000,
      historique: [
        {
          id: 1,
          label: "Versement Wytalo Barbershop",
          montant: 40000,
          date: "2026-06-30",
          statut: "verse",
        },
        {
          id: 2,
          label: "Demande de retrait",
          montant: 45000,
          date: "2026-07-08",
          statut: "en_attente",
        },
      ],
    },
  },
};

/* ============================================================
   EXTENSION DES RENDEZ-VOUS (professionnel assigné, entrées du jour)
   ============================================================ */
(function extendAppointmentsData() {
  const existing = appointmentsData.find((a) => a.id === 1001);
  if (existing) existing.professionalId = 101; // Wytalo

  appointmentsData.push(
    {
      id: 2001,
      artisanId: 1,
      serviceName: "Fabrication de meuble sur mesure",
      date: TODAY_MOCK,
      time: "14:00",
      status: "upcoming",
      price: 45000,
    },
    {
      id: 2002,
      artisanId: 7,
      professionalId: 101,
      serviceName: "Coupe de cheveux",
      date: TODAY_MOCK,
      time: "09:30",
      status: "upcoming",
      price: 2500,
    },
    {
      id: 2003,
      artisanId: 7,
      professionalId: 102,
      serviceName: "Taille de barbe",
      date: TODAY_MOCK,
      time: "11:00",
      status: "upcoming",
      price: 1500,
    },
    {
      id: 2004,
      artisanId: 7,
      professionalId: 103,
      serviceName: "Coupe + Barbe",
      date: "2026-07-09",
      time: "15:00",
      status: "upcoming",
      price: 3500,
    },
    {
      id: 2005,
      artisanId: 7,
      professionalId: null,
      preference: "sans_preference",
      serviceName: "Coupe de cheveux",
      date: "2026-07-10",
      time: "16:00",
      status: "upcoming",
      price: 2500,
    },
    {
      id: 2006,
      artisanId: 7,
      professionalId: 102,
      serviceName: "Coupe de cheveux",
      date: "2026-06-25",
      time: "10:00",
      status: "done",
      price: 2500,
    },
  );
})();

/* ============================================================
   EXTENSION DES AVIS (avis rattaché à un membre de l'équipe)
   ============================================================ */
(function extendReviewsData() {
  const wytaloReview = reviewsData.find((r) => r.id === 4);
  if (wytaloReview) wytaloReview.memberId = 101;

  reviewsData.push(
    {
      id: 5,
      artisanId: 7,
      memberId: 102,
      author: "Fatoumata Diallo",
      avatar:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop",
      rating: 5,
      date: "2026-07-04",
      comment:
        "Carlos a été adorable, très pédagogue sur l'entretien de ma coupe. Je reviendrai !",
      reply: null,
    },
    {
      id: 6,
      artisanId: 7,
      memberId: 103,
      author: "Yann Kacou",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      rating: 3,
      date: "2026-06-29",
      comment:
        "Correct, mais l'attente était plus longue que prévu pour la coloration.",
      reply: null,
    },
  );
})();

/* ============================================================
   EXTENSION DES CONVERSATIONS (messagerie côté artisan)
   ============================================================ */
(function extendConversationsData() {
  const wytaloConv = conversationsData.find((c) => c.artisanId === 7);
  if (wytaloConv) wytaloConv.memberId = 101;

  conversationsData.push({
    id: 5,
    artisanId: 7,
    memberId: 102,
    unread: true,
    messages: [
      {
        from: "them",
        text: "Bonjour Carlos, est-ce que vous faites les dégradés américains ?",
        time: "08:40",
      },
      {
        from: "me",
        text: "Bonjour ! Oui bien sûr, c'est même ma spécialité 😊",
        time: "08:52",
      },
    ],
  });
})();
