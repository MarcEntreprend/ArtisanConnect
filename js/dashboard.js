// js/dashboard.js

// js/dashboard.js — ArtisanConnect — Espace Artisan
"use strict";

/* ============================================================
   ICÔNES SUPPLÉMENTAIRES (étend ICONS défini dans main.js)
   ============================================================ */
Object.assign(ICONS, {
  home: '<path d="M3 12l9-9 9 9M5 10v10h14V10"/>',
  calendar:
    '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>',
  chartLine: '<path d="M3 3v18h18M7 15l4-5 3 3 5-6"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
  bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  camera:
    '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  image:
    '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
  download: '<path d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16"/>',
  sparkle:
    '<path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/>',
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  send: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/>',
  trendUp: '<path d="M3 17 9 11 13 15 21 6"/><path d="M15 6h6v6"/>',
  filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash:
    '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
});

/* ============================================================
   ÉTAT LOCAL DU DASHBOARD (persiste le temps de la session)
   ============================================================ */
let currentPanelKey = "tableau";
let editingServiceId = null;
let confirmingApptId = null;
let apptFilterProfessional = "all";
let apptActiveTab = "upcoming";
let statsScope = "personnel";
const payOnlineState = { solo: false, responsable: true };
let vitrinePhotoDataUrl = null;

/* ============================================================
   PERSONA / PORTÉE (SCOPE) DES DONNÉES
   ============================================================ */
function getCurrentPersonaKey() {
  const params = new URLSearchParams(window.location.search);
  const p = params.get("persona");
  return DEMO_PERSONAS[p] ? p : "solo";
}

function getScope(personaKey) {
  const persona = DEMO_PERSONAS[personaKey];
  const artisan = getArtisanById(persona.artisanId);
  const team = persona.teamId ? getTeamByArtisan(persona.artisanId) : null;
  const member =
    persona.memberId && team ? getTeamMember(team.id, persona.memberId) : null;
  return { persona, artisan, team, member };
}

function getDashMode(personaKey) {
  if (personaKey !== "responsable") return "essentiel";
  return sessionStorage.getItem("dashMode_responsable") || "essentiel";
}

function setDashMode(mode) {
  sessionStorage.setItem("dashMode_responsable", mode);
}

function canEditServices(personaKey, scope) {
  if (personaKey === "solo" || personaKey === "responsable") return true;
  if (personaKey === "employe")
    return !!(scope.member && scope.member.permissions.modifieServicesHoraires);
  return false;
}

function canReplyReviews(personaKey, scope) {
  if (personaKey === "solo" || personaKey === "responsable") return true;
  if (personaKey === "employe")
    return !!(scope.member && scope.member.permissions.reponsAvis);
  return false;
}

function canSeeStats(personaKey, scope) {
  if (personaKey === "solo" || personaKey === "responsable") return true;
  if (personaKey === "employe")
    return !!(scope.member && scope.member.permissions.voitStats);
  return false;
}

/* ============================================================
   NAVIGATION
   ============================================================ */
const ALL_NAV_ITEMS = {
  tableau: { label: "Tableau de bord", icon: "home" },
  rendezvous: { label: "Rendez-vous", icon: "calendar" },
  services: { label: "Services", icon: "wrench" },
  vitrine: { label: "Votre vitrine", icon: "user" },
  dispo: { label: "Disponibilités", icon: "clock" },
  stats: { label: "Statistiques", icon: "chartLine" },
  avis: { label: "Avis", icon: "star" },
  messages: { label: "Messages", icon: "chat" },
  paiement: { label: "Paiement", icon: "card" },
};

function computeVisibleNav(personaKey, scope) {
  if (personaKey === "employe") {
    const items = [
      "tableau",
      "rendezvous",
      "services",
      "dispo",
      "avis",
      "messages",
    ];
    if (canSeeStats(personaKey, scope)) items.splice(4, 0, "stats");
    return items;
  }
  return [
    "tableau",
    "rendezvous",
    "services",
    "vitrine",
    "dispo",
    "stats",
    "avis",
    "messages",
    "paiement",
  ];
}

/* ============================================================
   POINT D'ENTRÉE
   ============================================================ */
function initDashboard() {
  const personaKey = getCurrentPersonaKey();
  const scope = getScope(personaKey);

  renderPersonaSwitcher(personaKey);
  renderPageHeading(personaKey, scope);
  renderModeSwitch(personaKey);
  renderProfileMini(personaKey, scope);

  const visibleNav = computeVisibleNav(personaKey, scope);
  if (!visibleNav.includes(currentPanelKey)) currentPanelKey = visibleNav[0];
  renderNav(personaKey, scope, visibleNav);
  renderPanel(personaKey, scope);

  const panelsEl = document.getElementById("dashPanels");
  panelsEl.addEventListener("click", (e) =>
    handleDashClick(e, personaKey, scope),
  );
  panelsEl.addEventListener("submit", (e) =>
    handleDashSubmit(e, personaKey, scope),
  );
  panelsEl.addEventListener("change", (e) =>
    handleDashChange(e, personaKey, scope),
  );
}

/* ============================================================
   PERSONA SWITCHER (pied de page démo)
   ============================================================ */
function renderPersonaSwitcher(personaKey) {
  document.querySelectorAll(".dash-persona-switcher a").forEach((a) => {
    a.classList.toggle("active", a.dataset.persona === personaKey);
  });
}

function renderPageHeading(personaKey, scope) {
  const title = document.getElementById("dashTitle");
  const subtitle = document.getElementById("dashSubtitle");
  const bannerSlot = document.getElementById("companyBannerSlot");
  if (!title) return;

  if (personaKey === "solo") {
    title.textContent = "Espace artisan";
    subtitle.textContent =
      "Gérez votre vitrine, vos services et vos disponibilités.";
    bannerSlot.innerHTML = "";
  } else if (personaKey === "responsable") {
    title.textContent = "Espace artisan";
    subtitle.textContent =
      scope.team.name + " — Gérez votre équipe et votre activité.";
    bannerSlot.innerHTML = "";
  } else {
    title.textContent = scope.team.name;
    subtitle.textContent = "Espace employé de " + scope.member.name;
    bannerSlot.innerHTML = `
      <div class="company-banner">
        ${icon("user", 18)}
        Vous consultez uniquement ce que votre responsable vous a autorisé à voir.
      </div>`;
  }
}

/* ============================================================
   MODE ESSENTIEL / COMPLET (responsable uniquement)
   ============================================================ */
function renderModeSwitch(personaKey) {
  const slot = document.getElementById("modeSwitchSlot");
  if (!slot) return;

  if (personaKey !== "responsable") {
    slot.innerHTML = "";
    return;
  }

  const mode = getDashMode(personaKey);
  slot.innerHTML = `
    <div class="mode-switch-wrap">
      <div class="mode-switch">
        <button type="button" data-mode="essentiel" class="${mode === "essentiel" ? "active" : ""}">Mode Essentiel</button>
        <button type="button" data-mode="complet" class="${mode === "complet" ? "active" : ""}">Mode Complet</button>
      </div>
      <span class="mode-switch-hint">${mode === "complet" ? "La gestion d'équipe détaillée arrive bientôt dans ce mode." : "Uniquement l'essentiel, pour aller vite."}</span>
    </div>`;

  slot.querySelectorAll("[data-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setDashMode(btn.dataset.mode);
      renderModeSwitch(personaKey);
      if (btn.dataset.mode === "complet") {
        showToast(
          "Mode Complet activé. La section Équipe est en cours de préparation.",
        );
      }
    });
  });
}

/* ============================================================
   PROFIL RÉDUIT (SIDEBAR)
   ============================================================ */
function renderProfileMini(personaKey, scope) {
  const el = document.getElementById("dashProfileMini");
  if (!el) return;
  const name = scope.member ? scope.member.name : scope.artisan.name;
  const sub = scope.member
    ? scope.member.specialty
    : scope.artisan.category + " · " + scope.artisan.city;
  const avatar = scope.member ? scope.member.avatar : scope.artisan.avatar;
  el.innerHTML = `
    <img src="${avatar}" alt="${name}" />
    <div><strong>${name}</strong><span>${sub}</span></div>`;
}

/* ============================================================
   NAVIGATION LATÉRALE
   ============================================================ */
function renderNav(personaKey, scope, visibleNav) {
  const navEl = document.getElementById("dashNav");
  if (!navEl) return;

  navEl.innerHTML = visibleNav
    .map((key) => {
      const item = ALL_NAV_ITEMS[key];
      return `
      <button type="button" class="dash-nav-item ${key === currentPanelKey ? "active" : ""}" data-panel-key="${key}">
        ${icon(item.icon, 18)}
        ${item.label}
      </button>`;
    })
    .join("");

  navEl.querySelectorAll("[data-panel-key]").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentPanelKey = btn.dataset.panelKey;
      navEl
        .querySelectorAll(".dash-nav-item")
        .forEach((n) => n.classList.remove("active"));
      btn.classList.add("active");
      renderPanel(personaKey, scope);
    });
  });
}

function goToPanel(personaKey, scope, key) {
  currentPanelKey = key;
  document
    .querySelectorAll(".dash-nav-item")
    .forEach((n) => n.classList.toggle("active", n.dataset.panelKey === key));
  renderPanel(personaKey, scope);
}

/* ============================================================
   DISPATCH DES PANNEAUX
   ============================================================ */
function renderPanel(personaKey, scope) {
  const container = document.getElementById("dashPanels");
  if (!container) return;
  switch (currentPanelKey) {
    case "tableau":
      return renderTableauDeBord(container, personaKey, scope);
    case "rendezvous":
      return renderRendezVousPanel(container, personaKey, scope);
    case "services":
      return renderServicesPanel(container, personaKey, scope);
    case "vitrine":
      return renderVitrinePanel(container, personaKey, scope);
    case "dispo":
      return renderDisponibilitesPanel(container, personaKey, scope);
    case "stats":
      return renderStatistiquesPanel(container, personaKey, scope);
    case "avis":
      return renderAvisPanel(container, personaKey, scope);
    case "messages":
      return renderMessagesPanel(container, personaKey, scope);
    case "paiement":
      return renderPaiementPanel(container, personaKey, scope);
    default:
      container.innerHTML = "";
  }
}

// -------------------------------------------------------

// PARTIE 2/3

/* ============================================================
   1. TABLEAU DE BORD
   ============================================================ */
function scopedAppointments(personaKey, scope) {
  return appointmentsData.filter((a) => {
    if (a.artisanId !== scope.artisan.id) return false;
    if (personaKey === "employe") return a.professionalId === scope.member.id;
    return true;
  });
}

function scopedReviews(personaKey, scope) {
  return reviewsData.filter((r) => {
    if (r.artisanId !== scope.artisan.id) return false;
    if (personaKey === "employe") return r.memberId === scope.member.id;
    return true;
  });
}

function scopedConversations(personaKey, scope) {
  return conversationsData.filter((c) => {
    if (c.artisanId !== scope.artisan.id) return false;
    if (personaKey === "employe") return c.memberId === scope.member.id;
    return true;
  });
}

function isWithinNextDays(dateStr, days) {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date(TODAY_MOCK + "T00:00:00");
  const diff = (d - today) / 86400000;
  return diff >= 0 && diff <= days;
}

function computeRecettes(personaKey, scope) {
  if (personaKey === "responsable")
    return financeData.entreprise.recettesDuMois;
  if (personaKey === "employe")
    return (financeData.membres[scope.member.id] || {}).gainsEntreprise || 0;
  return scopedAppointments(personaKey, scope)
    .filter((a) => a.status === "done")
    .reduce((sum, a) => sum + a.price, 0);
}

function renderTableauDeBord(container, personaKey, scope) {
  const appts = scopedAppointments(personaKey, scope);
  const todayCount = appts.filter(
    (a) => a.date === TODAY_MOCK && a.status === "upcoming",
  ).length;
  const weekCount = appts.filter(
    (a) => isWithinNextDays(a.date, 6) && a.status === "upcoming",
  ).length;
  const upcoming = appts
    .filter(
      (a) =>
        a.status === "upcoming" && new Date(a.date) >= new Date(TODAY_MOCK),
    )
    .sort(
      (a, b) =>
        new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time),
    );
  const next = upcoming[0];
  const recettes = computeRecettes(personaKey, scope);
  const recettesLabel =
    personaKey === "employe" ? "Ce qu'on vous doit" : "Recettes du mois";
  const reviews = scopedReviews(personaKey, scope);
  const unrepliedCount = reviews.filter((r) => !r.reply).length;
  const convs = scopedConversations(personaKey, scope);
  const unreadCount = convs.filter((c) => c.unread).length;
  const alerts = [];
  if (unrepliedCount > 0)
    alerts.push({
      text: `Vous avez ${unrepliedCount} nouvel${unrepliedCount > 1 ? "s" : ""} avis à traiter`,
      panel: "avis",
    });
  if (unreadCount > 0)
    alerts.push({
      text: `Vous avez ${unreadCount} message${unreadCount > 1 ? "s" : ""} non lu${unreadCount > 1 ? "s" : ""}`,
      panel: "messages",
    });

  const firstName = scope.member
    ? scope.member.name.split(" ")[0]
    : scope.artisan.ownerName
      ? scope.artisan.ownerName.split(" ")[0]
      : scope.persona.firstName;

  container.innerHTML = `
    <div class="tdb-greeting">
      Bonjour ${firstName} 👋
      <span>Voici un résumé de votre activité.</span>
    </div>
    <div class="tdb-grid">
      <div class="tdb-card">
        <div class="tdb-card-icon">${icon("calendar", 18)}</div>
        <div class="tdb-card-label">Aujourd'hui</div>
        <div class="tdb-card-value mono-num">${todayCount}</div>
        <div class="tdb-card-sub">rendez-vous prévus</div>
      </div>
      <div class="tdb-card">
        <div class="tdb-card-icon">${icon("chartLine", 18)}</div>
        <div class="tdb-card-label">Cette semaine</div>
        <div class="tdb-card-value mono-num">${weekCount}</div>
        <div class="tdb-card-sub">rendez-vous à venir</div>
      </div>
      <div class="tdb-card">
        <div class="tdb-card-icon">${icon("clock", 18)}</div>
        <div class="tdb-card-label">Prochain créneau</div>
        <div class="tdb-card-value" style="font-size:1.05rem;">${next ? formatDateFrLong(next.date) + " · " + next.time : "Aucun"}</div>
        <div class="tdb-card-sub">${next ? next.serviceName : "Rien de prévu pour l'instant"}</div>
      </div>
      <div class="tdb-card">
        <div class="tdb-card-icon">${icon("card", 18)}</div>
        <div class="tdb-card-label">${recettesLabel}</div>
        <div class="tdb-card-value mono-num">${recettes.toLocaleString("fr-FR")}</div>
        <div class="tdb-card-sub">FCFA</div>
      </div>
    </div>
    ${
      alerts.length
        ? `
      <div class="tdb-section-title">Ce qui mérite votre attention</div>
      <div class="tdb-alert-list">
        ${alerts
          .map(
            (a) => `
          <div class="tdb-alert">
            ${icon("bell", 18)}
            <span>${a.text}</span>
            <a href="#" data-goto-panel="${a.panel}">Voir →</a>
          </div>`,
          )
          .join("")}
      </div>`
        : `
      <div class="tdb-empty-hint">
        Tout est calme pour le moment — aucune alerte à traiter. Continuez comme ça ! ✨
      </div>`
    }
  `;
}

/* ============================================================
   2. RENDEZ-VOUS
   ============================================================ */
function exportAppointmentsCSV(list) {
  const header = "Service;Date;Heure;Statut;Prix (FCFA)\n";
  const rows = list
    .map((a) => `${a.serviceName};${a.date};${a.time};${a.status};${a.price}`)
    .join("\n");
  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "rendez-vous-artisanconnect.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function dashApptCardHTML(appt, personaKey, scope) {
  const statusMeta = {
    upcoming: ["À venir", "upcoming"],
    done: ["Terminé", "done"],
    cancelled: ["Annulé", "cancelled"],
  };
  const [label, cls] = statusMeta[appt.status];
  const dateLabel = formatDateFrLong(appt.date);
  let proTag = "";
  if (personaKey === "responsable" && scope.team) {
    const pro = appt.professionalId
      ? getTeamMember(scope.team.id, appt.professionalId)
      : null;
    proTag = `<span class="appt-pro-tag">${pro ? pro.name : "Sans préférence · à assigner"}</span>`;
  }
  const isConfirming = confirmingApptId === appt.id;
  const actionsBlock =
    appt.status === "upcoming" && !isConfirming
      ? `
    <div class="appt-actions">
      <button type="button" class="btn btn-ghost" style="padding:.5rem 1rem;font-size:.8rem;" data-dash-action="appt-cancel-ask" data-id="${appt.id}">Annuler</button>
    </div>`
      : "";
  const confirmBlock = isConfirming
    ? `
    <div class="appt-confirm-row">
      <span class="appt-confirm-text">Confirmer l'annulation de ce rendez-vous ?</span>
      <button type="button" class="btn btn-ghost" style="padding:.4rem .8rem;font-size:.78rem;" data-dash-action="appt-cancel-no">Non, garder</button>
      <button type="button" class="btn btn-primary" style="padding:.4rem .8rem;font-size:.78rem;background:var(--danger);" data-dash-action="appt-cancel-yes" data-id="${appt.id}">Oui, annuler</button>
    </div>`
    : "";

  return `
    <div class="appt-card-wrap">
      <div class="appt-card">
        <div class="appt-avatar" style="display:flex;align-items:center;justify-content:center;background:var(--accent-soft);color:var(--accent-strong);">${icon("calendar", 20)}</div>
        <div class="appt-info">
          <div class="appt-service">${appt.serviceName}</div>
          <div class="appt-artisan">${dateLabel} à ${appt.time} · <span class="mono-num">${appt.price.toLocaleString("fr-FR")} FCFA</span></div>
          ${proTag}
        </div>
        <span class="appt-status ${cls}">${label}</span>
        ${actionsBlock}
      </div>
      ${confirmBlock}
    </div>`;
}

function renderRendezVousPanel(container, personaKey, scope) {
  const allAppts = scopedAppointments(personaKey, scope);
  container.innerHTML = `
    <div class="dash-panel-header">
      <div><h2>Rendez-vous</h2><p>Suivez et gérez vos réservations.</p></div>
    </div>
    <div class="appt-toolbar">
      <div class="appt-tabs" style="margin:0;border-bottom:none;" id="dashApptTabs">
        <button type="button" class="appt-tab ${apptActiveTab === "upcoming" ? "active" : ""}" data-tab="upcoming">À venir</button>
        <button type="button" class="appt-tab ${apptActiveTab === "done" ? "active" : ""}" data-tab="done">Passés</button>
        <button type="button" class="appt-tab ${apptActiveTab === "cancelled" ? "active" : ""}" data-tab="cancelled">Annulés</button>
      </div>
      <div style="display:flex;align-items:center;gap:.6rem;">
        ${
          personaKey === "responsable" && scope.team
            ? `
          <select class="appt-filter-select" id="apptProFilter">
            <option value="all">Tous les professionnels</option>
            ${scope.team.members.map((m) => `<option value="${m.id}" ${apptFilterProfessional === String(m.id) ? "selected" : ""}>${m.name}</option>`).join("")}
          </select>`
            : ""
        }
        <button type="button" class="appt-export-btn" data-dash-action="appt-export">${icon("download", 15)} Exporter</button>
      </div>
    </div>
    <div class="appt-list" id="dashApptList"></div>
    <div class="empty-state" id="dashApptEmpty" style="display:none;"></div>
  `;
  // Wire tabs
  container.querySelectorAll(".appt-tab[data-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      apptActiveTab = tab.dataset.tab;
      container
        .querySelectorAll(".appt-tab[data-tab]")
        .forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderApptList(personaKey, scope, allAppts);
    });
  });
  renderApptList(personaKey, scope, allAppts);
}

function renderApptList(personaKey, scope, allAppts) {
  const listEl = document.getElementById("dashApptList");
  const emptyEl = document.getElementById("dashApptEmpty");
  if (!listEl) return;
  let items = allAppts.filter((a) => a.status === apptActiveTab);
  if (personaKey === "responsable" && apptFilterProfessional !== "all") {
    items = items.filter(
      (a) => String(a.professionalId) === apptFilterProfessional,
    );
  }
  items = items.sort((a, b) =>
    apptActiveTab === "upcoming"
      ? new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time)
      : new Date(b.date + "T" + b.time) - new Date(a.date + "T" + a.time),
  );

  if (!items.length) {
    listEl.style.display = "none";
    emptyEl.style.display = "flex";
    const copy = {
      upcoming: [
        "Aucun rendez-vous à venir",
        "Vos prochaines réservations apparaîtront ici.",
      ],
      done: [
        "Aucun rendez-vous passé",
        "L'historique de vos prestations s'affichera ici.",
      ],
      cancelled: ["Aucun rendez-vous annulé", "Rien à signaler de ce côté."],
    }[apptActiveTab];
    emptyEl.innerHTML = `<div class="empty-state-icon">${icon("calendar", 26)}</div><h3>${copy[0]}</h3><p>${copy[1]}</p>`;
    return;
  }
  listEl.style.display = "";
  emptyEl.style.display = "none";
  listEl.innerHTML = items
    .map((a) => dashApptCardHTML(a, personaKey, scope))
    .join("");
}

/* ============================================================
   3. SERVICES
   ============================================================ */
function applyOrQueueChange(personaKey, scope, description, targetId, applyFn) {
  if (personaKey === "employe") {
    pendingChangesData.push({
      id: Date.now(),
      teamId: scope.team.id,
      memberId: scope.member.id,
      type: "service",
      targetId: targetId || null,
      description,
      date: TODAY_MOCK,
      status: "en_attente",
    });
    showToast("Modification envoyée à votre responsable pour validation.");
  } else {
    applyFn();
    showToast("Modification enregistrée.");
  }
}

function hasPendingChange(scope, personaKey, serviceId) {
  if (personaKey !== "employe" || !scope.member) return false;
  return pendingChangesData.some(
    (p) =>
      p.memberId === scope.member.id &&
      p.status === "en_attente" &&
      p.type === "service" &&
      p.targetId === serviceId,
  );
}

function serviceRowHTML(s, personaKey, scope, editable) {
  const isActive = s.active !== false;
  const isEditing = editingServiceId === s.id;
  const pending = hasPendingChange(scope, personaKey, s.id);
  return `
    <div class="dash-service-row ${isActive ? "" : "inactive"}" data-service-id="${s.id}">
      <img src="${s.image}" alt="" style="width:44px;height:44px;border-radius:8px;object-fit:cover;flex-shrink:0;" />
      <div class="dash-service-info">
        <div class="dash-service-name">${s.name} ${!isActive ? '<span style="color:var(--ink-faint);font-weight:500;font-size:.76rem;">(désactivé)</span>' : ""}</div>
        <div class="dash-service-price mono-num">${s.price ? s.price.toLocaleString("fr-FR") + " FCFA" : "Gratuit"} · ${s.duration} min</div>
        ${pending ? `<span class="pending-badge">${icon("clock", 11)} En attente de validation</span>` : ""}
      </div>
      <div class="dash-service-actions">
        ${
          editable
            ? `
          <label class="switch" title="${isActive ? "Désactiver" : "Activer"}">
            <input type="checkbox" data-dash-action="service-toggle-active" data-id="${s.id}" ${isActive ? "checked" : ""} />
            <span class="switch-track"></span>
          </label>
          <button type="button" class="icon-btn-sm" data-dash-action="service-edit-toggle" data-id="${s.id}">${icon("edit", 15)}</button>
          <button type="button" class="icon-btn-sm danger" data-dash-action="service-delete" data-id="${s.id}">${icon("trash", 15)}</button>`
            : ""
        }
      </div>
      ${
        isEditing
          ? `
        <form class="dash-service-edit-form" data-dash-form="service-edit" data-id="${s.id}">
          <input type="text" name="name" value="${s.name}" placeholder="Nom du service" required />
          <input type="number" name="price" value="${s.price}" placeholder="Prix (FCFA)" min="0" step="500" required />
          <input type="number" name="duration" value="${s.duration}" placeholder="Durée (min)" min="5" step="5" required />
          <div class="dash-service-edit-actions">
            <button type="button" class="btn btn-ghost" style="padding:.5rem 1rem;font-size:.8rem;" data-dash-action="service-edit-cancel">Annuler</button>
            <button type="submit" class="btn btn-primary" style="padding:.5rem 1rem;font-size:.8rem;">Enregistrer</button>
          </div>
        </form>`
          : ""
      }
    </div>`;
}

function renderServicesPanel(container, personaKey, scope) {
  const editable = canEditServices(personaKey, scope);
  container.innerHTML = `
    <div class="dash-panel-header">
      <div><h2>Services</h2><p>${editable ? "Ajoutez, modifiez ou activez vos prestations." : "Consultez les services proposés par votre équipe."}</p></div>
    </div>
    ${!editable ? `<div class="locked-note">${icon("lock", 17)} Seul votre responsable peut modifier les services et les tarifs.</div>` : ""}
    <div id="dashServicesList"></div>
    ${editable ? `<button type="button" class="dash-add-service" data-dash-action="service-add">${icon("plus", 16)} Ajouter un service</button>` : ""}
  `;

  if (!scope.artisan.services.length) {
    document.getElementById("dashServicesList").innerHTML = emptyIllustrated(
      "🛠️",
      "Aucun service pour le moment",
      "Ajoutez votre première prestation pour que les clients puissent vous réserver en ligne.",
      editable ? "Ajouter un service" : null,
      editable ? "service-add" : null,
    );
    return;
  }
  renderServicesList(personaKey, scope, editable);
}

function renderServicesList(personaKey, scope, editable) {
  const listEl = document.getElementById("dashServicesList");
  if (!listEl) return;
  listEl.innerHTML = scope.artisan.services
    .map((s) => serviceRowHTML(s, personaKey, scope, editable))
    .join("");
}

/* ============================================================
   4. VOTRE VITRINE
   ============================================================ */
function renderVitrinePanel(container, personaKey, scope) {
  const a = scope.artisan;
  container.innerHTML = `
    <div class="dash-panel-header">
      <div><h2>Votre vitrine</h2><p>C'est ce que les clients voient en premier sur ArtisanConnect.</p></div>
    </div>
    <div class="vitrine-badges">
      <span class="badge-pill">${icon("check", 14)} Vérifié</span>
      <span class="badge-pill">${icon("sparkle", 14)} Réactif</span>
    </div>
    <div class="vitrine-photo-block">
      <div class="vitrine-photo-row">
        <div class="vitrine-photo-zone" id="vitrinePhotoZone">
          <img src="${vitrinePhotoDataUrl || a.avatar}" alt="${a.name}" />
        </div>
        <div class="vitrine-photo-actions">
          <label class="vitrine-photo-btn">
            ${icon("camera", 19)} Prendre une photo
            <input type="file" accept="image/*" capture="environment" data-dash-action="photo-input" style="display:none;" />
          </label>
          <label class="vitrine-photo-btn">
            ${icon("image", 19)} Choisir dans la galerie
            <input type="file" accept="image/*" data-dash-action="photo-input" style="display:none;" />
          </label>
          <p class="vitrine-photo-hint">Vous pouvez aussi glisser une image ou la coller directement dans le cadre.</p>
        </div>
      </div>
    </div>
    <form class="dash-form-grid" id="dashVitrineForm">
      <div class="dash-field"><label for="vName">Nom de l'activité</label><input type="text" id="vName" name="name" value="${a.name}" /></div>
      <div class="dash-field"><label for="vCategory">Métier</label>
        <select id="vCategory" name="category">
          ${CATEGORIES.map((c) => `<option value="${c.slug}" ${c.slug === a.categorySlug ? "selected" : ""}>${c.label}</option>`).join("")}
        </select>
      </div>
      <div class="dash-field"><label for="vCity">Ville</label><input type="text" id="vCity" name="city" value="${a.city}" /></div>
      <div class="dash-field"><label for="vPhone">Téléphone</label><input type="tel" id="vPhone" name="phone" value="${a.phone}" /></div>
      <div class="dash-field span-2"><label for="vAddress">Adresse</label><input type="text" id="vAddress" name="address" value="${a.address}" /></div>
      <div class="dash-field span-2"><label for="vDesc">Description</label><textarea id="vDesc" name="description">${a.description}</textarea></div>
      <div class="dash-form-actions">
        <button type="button" class="btn btn-ghost" data-dash-action="vitrine-cancel">Annuler</button>
        <button type="submit" class="btn btn-primary">Enregistrer les modifications</button>
      </div>
    </form>
  `;

  const zone = document.getElementById("vitrinePhotoZone");
  ["dragover", "dragenter"].forEach((evt) =>
    zone.addEventListener(evt, (e) => {
      e.preventDefault();
      zone.classList.add("drag-over");
    }),
  );
  ["dragleave", "drop"].forEach((evt) =>
    zone.addEventListener(evt, (e) => {
      e.preventDefault();
      zone.classList.remove("drag-over");
    }),
  );
  zone.addEventListener("drop", (e) => {
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) readImageFile(f, personaKey, scope);
  });
  zone.addEventListener("paste", (e) => {
    const item = [...(e.clipboardData?.items || [])].find((i) =>
      i.type.startsWith("image/"),
    );
    if (item) readImageFile(item.getAsFile(), personaKey, scope);
  });
}

function readImageFile(file, personaKey, scope) {
  if (!file || !file.type.startsWith("image/")) {
    showToast("Merci de choisir un fichier image.");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    vitrinePhotoDataUrl = reader.result;
    renderVitrinePanel(
      document.getElementById("dashPanels"),
      personaKey,
      scope,
    );
    showToast("Photo mise à jour. Pensez à enregistrer.");
  };
  reader.readAsDataURL(file);
}

/* ============================================================
   5. DISPONIBILITÉS
   ============================================================ */
function renderDisponibilitesPanel(container, personaKey, scope) {
  const a = scope.artisan;
  container.innerHTML = `
    <div class="dash-panel-header">
      <div><h2>Disponibilités</h2><p>Définissez vos créneaux habituels.</p></div>
    </div>
    ${personaKey === "responsable" && scope.team ? `<div class="avail-note">${icon("user", 17)} Ces créneaux s'appliquent à toute l'équipe. La gestion par professionnel arrive dans une prochaine mise à jour.</div>` : ""}
    <div class="avail-grid" id="dashAvailGrid"></div>
    <div class="dash-form-actions" style="padding-top:1.5rem;">
      <button type="button" class="btn btn-primary" data-dash-action="avail-save">Enregistrer les disponibilités</button>
    </div>
  `;
  const grid = document.getElementById("dashAvailGrid");
  grid.innerHTML = a.hours
    .map((h, i) => {
      const closed = h.time.toLowerCase().includes("ferm");
      const parts = closed ? ["09:00", "18:00"] : h.time.split(" - ");
      return `
      <div class="avail-day">
        <div class="avail-day-name">${h.day}</div>
        <div class="avail-toggle-row">
          <span style="font-size:.75rem;color:var(--ink-faint);" data-avail-label="${i}">${closed ? "Fermé" : "Ouvert"}</span>
          <label class="switch">
            <input type="checkbox" data-dash-action="avail-toggle" data-index="${i}" ${closed ? "" : "checked"} />
            <span class="switch-track"></span>
          </label>
        </div>
        <div class="avail-times">
          <input type="time" value="${parts[0]}" />
          <input type="time" value="${parts[1]}" />
        </div>
      </div>`;
    })
    .join("");
}

// -----------------------------------------------------------

// partie 3/3
/* ============================================================
   6. STATISTIQUES
   ============================================================ */
function renderStatistiquesPanel(container, personaKey, scope) {
  const showToggle = personaKey === "responsable" && scope.team;
  const appts = scopedAppointments(personaKey, scope);
  const hasDone = appts.some((a) => a.status === "done");

  container.innerHTML = `
    <div class="dash-panel-header">
      <div><h2>Statistiques</h2><p>Vue d'ensemble de votre activité sur les 30 derniers jours.</p></div>
    </div>
    ${
      showToggle
        ? `
      <div class="stats-toggle-wrap">
        <div class="mode-switch">
          <button type="button" data-stats-scope="personnel" class="${statsScope === "personnel" ? "active" : ""}">Vos statistiques</button>
          <button type="button" data-stats-scope="entreprise" class="${statsScope === "entreprise" ? "active" : ""}">Toute l'équipe</button>
        </div>
      </div>`
        : ""
    }
    ${
      !hasDone && !showToggle
        ? `
      ${emptyIllustrated("📈", "Pas encore de statistiques", "Elles apparaîtront ici après vos premières prestations terminées.", "Voir mes rendez-vous", "goto-rendezvous")}`
        : `
      <div class="stat-bento" id="dashStatBento"></div>
      <div class="side-panel" style="padding:1.5rem;">
        <h2 style="font-size:.95rem;font-weight:700;margin-bottom:1rem;">Réservations des 7 derniers jours</h2>
        <div class="bar-chart" id="dashBarChart"></div>
      </div>`
    }
  `;

  if (showToggle) {
    container.querySelectorAll("[data-stats-scope]").forEach((btn) => {
      btn.addEventListener("click", () => {
        statsScope = btn.dataset.statsScope;
        renderStatistiquesPanel(container, personaKey, scope);
      });
    });
  }

  if (hasDone || showToggle) {
    renderStatTiles(personaKey, scope);
    renderBarChart(personaKey, scope);
  }
}

function statTileHTML(label, value, trend) {
  return `
    <div class="stat-tile">
      <div class="stat-tile-label">${label}</div>
      <div class="stat-tile-value mono-num">${value}</div>
      ${trend ? `<div class="stat-tile-trend">${icon("trendUp", 13)} ${trend}</div>` : ""}
    </div>`;
}

function renderStatTiles(personaKey, scope) {
  const bento = document.getElementById("dashStatBento");
  const useEntreprise =
    personaKey === "responsable" && statsScope === "entreprise";
  let bookingsCount, notemoyenne, recettes, tauxReponse;
  if (useEntreprise) {
    bookingsCount = appointmentsData.filter(
      (a) => a.artisanId === scope.artisan.id && a.status !== "cancelled",
    ).length;
    notemoyenne = scope.artisan.rating.toFixed(1);
    recettes = financeData.entreprise.recettesDuMois;
    tauxReponse = "94%";
  } else {
    const appts = scopedAppointments(personaKey, scope);
    bookingsCount = appts.filter((a) => a.status !== "cancelled").length;
    const myReviews = scopedReviews(personaKey, scope);
    const avg = myReviews.length
      ? myReviews.reduce((s, r) => s + r.rating, 0) / myReviews.length
      : scope.artisan.rating;
    notemoyenne = avg.toFixed(1);
    recettes = computeRecettes(personaKey, scope);
    tauxReponse = "96%";
  }
  bento.innerHTML =
    statTileHTML("Rendez-vous", String(bookingsCount), null) +
    statTileHTML("Taux de réponse", tauxReponse, "+4 pts") +
    statTileHTML("Note moyenne", notemoyenne, null) +
    statTileHTML(
      personaKey === "employe" ? "Ce qu'on vous doit" : "Recettes",
      recettes.toLocaleString("fr-FR") + " FCFA",
      null,
    );
}

function renderBarChart(personaKey, scope) {
  const el = document.getElementById("dashBarChart");
  const useEntreprise =
    personaKey === "responsable" && statsScope === "entreprise";
  const pool = useEntreprise
    ? appointmentsData.filter((a) => a.artisanId === scope.artisan.id)
    : scopedAppointments(personaKey, scope);
  const days = [];
  const start = new Date(TODAY_MOCK + "T00:00:00");
  for (let i = 6; i >= 0; i--) {
    const d = new Date(start);
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  const counts = days.map((d) => {
    const iso = d.toISOString().split("T")[0];
    return pool.filter((a) => a.date === iso && a.status !== "cancelled")
      .length;
  });
  const max = Math.max(1, ...counts);
  el.innerHTML = days
    .map((d, i) => {
      const label = d.toLocaleDateString("fr-FR", { weekday: "short" });
      const pct = Math.round((counts[i] / max) * 100);
      return `
      <div class="bar-row">
        <span class="bar-label">${label}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
        <span class="bar-value">${counts[i]}</span>
      </div>`;
    })
    .join("");
}

/* ============================================================
   7. AVIS
   ============================================================ */
function dashReviewCardHTML(r, personaKey, scope) {
  const stars = Array.from({ length: 5 })
    .map(
      (_, i) =>
        `<span style="opacity:${i < r.rating ? 1 : 0.25}">${icon("star", 14)}</span>`,
    )
    .join("");
  const dateLabel = new Date(r.date + "T00:00:00").toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const canReply = canReplyReviews(personaKey, scope);
  let memberTag = "";
  if (personaKey === "responsable" && scope.team && r.memberId) {
    const m = getTeamMember(scope.team.id, r.memberId);
    if (m) memberTag = `<span class="review-member-tag">${m.name}</span>`;
  }
  let replyBlock;
  if (r.reply) {
    replyBlock = `<div class="dash-reply-existing"><strong>Votre réponse</strong>${r.reply.text}</div>`;
  } else if (canReply) {
    replyBlock = `
      <form class="dash-reply-form" data-dash-form="review-reply" data-id="${r.id}">
        <input type="text" name="reply" placeholder="Répondre à cet avis…" required />
        <button type="submit" class="dash-reply-submit">Répondre</button>
      </form>`;
  } else {
    replyBlock = `<p class="review-locked-note">Seul votre responsable peut répondre à cet avis.</p>`;
  }
  return `
    <div class="dash-review-card">
      <div class="dash-review-top">
        <div class="dash-review-author">
          <img src="${r.avatar}" alt="${r.author}" />
          <div><div class="dash-review-name">${r.author} ${memberTag}</div><div class="dash-review-date">${dateLabel}</div></div>
        </div>
        <div class="dash-review-stars">${stars}</div>
      </div>
      <p class="dash-review-text">${r.comment}</p>
      <div class="dash-reply-box">${replyBlock}</div>
    </div>`;
}

function renderAvisPanel(container, personaKey, scope) {
  container.innerHTML = `
    <div class="dash-panel-header">
      <div><h2>Avis</h2><p>Répondez à vos clients pour montrer votre sérieux.</p></div>
    </div>
    <div id="dashReviewsList"></div>
  `;
  renderReviewsList(personaKey, scope);
}

function renderReviewsList(personaKey, scope) {
  const el = document.getElementById("dashReviewsList");
  if (!el) return;
  const reviews = scopedReviews(personaKey, scope);
  if (!reviews.length) {
    el.innerHTML = emptyIllustrated(
      "⭐",
      "Aucun avis pour le moment",
      "Vos premiers avis clients apparaîtront ici après vos prestations. Partagez votre vitrine pour en recevoir plus vite !",
      "Partager ma vitrine",
      "share-vitrine",
    );
    return;
  }
  el.innerHTML = reviews
    .map((r) => dashReviewCardHTML(r, personaKey, scope))
    .join("");
}

function renderReviewsList(personaKey, scope) {
  const el = document.getElementById("dashReviewsList");
  if (!el) return;
  const reviews = scopedReviews(personaKey, scope);
  el.innerHTML = reviews.length
    ? reviews.map((r) => dashReviewCardHTML(r, personaKey, scope)).join("")
    : `<div class="empty-state"><div class="empty-state-icon">${icon("star", 26)}</div><h3>Aucun avis pour le moment</h3><p>Ils apparaîtront ici après vos premiers rendez-vous.</p></div>`;
}

/* ============================================================
   8. MESSAGES (intégrés au dashboard)
   ============================================================ */
let dashActiveConvId = null;

function renderMessagesPanel(container, personaKey, scope) {
  const convs = scopedConversations(personaKey, scope);
  if (!dashActiveConvId && convs.length) dashActiveConvId = convs[0].id;
  container.innerHTML = `
    <div class="dash-panel-header">
      <div><h2>Messages</h2><p>Échangez avec vos clients avant et après leurs rendez-vous.</p></div>
    </div>
    <div class="dash-messages-wrap">
      <div class="messages-layout">
        <div class="conv-list mobile-visible" id="dashConvList"></div>
        <div class="thread-panel mobile-hidden" id="dashThreadPanel"></div>
      </div>
    </div>
  `;
  renderDashConvList(personaKey, scope, convs);
  renderDashThread(personaKey, scope, convs);
}

function renderDashConvList(personaKey, scope, convs) {
  const el = document.getElementById("dashConvList");
  if (!el) return;
  if (!convs.length) {
    el.innerHTML = `<div class="empty-state" style="border:none;">Aucune conversation pour le moment.</div>`;
    return;
  }
  el.innerHTML = convs
    .map((c) => {
      const last = c.messages[c.messages.length - 1];
      return `
      <div class="conv-item ${c.id === dashActiveConvId ? "active" : ""}" data-dash-action="conv-select" data-id="${c.id}">
        <div style="width:44px;height:44px;border-radius:999px;background:var(--accent-soft);color:var(--accent-strong);display:flex;align-items:center;justify-content:center;flex-shrink:0;">${icon("user", 20)}</div>
        <div class="conv-info">
          <div class="conv-name"><span>Client</span><span class="conv-time">${last.time}</span></div>
          <div class="conv-preview">${last.from === "me" ? "Vous : " : ""}${last.text}</div>
        </div>
        ${c.unread ? '<span class="conv-unread"></span>' : ""}
      </div>`;
    })
    .join("");
}

function renderDashThread(personaKey, scope, convs) {
  const el = document.getElementById("dashThreadPanel");
  if (!el) return;
  const conv = convs.find((c) => c.id === dashActiveConvId);
  if (!conv) {
    el.innerHTML = `<div class="empty-state" style="border:none;height:100%;justify-content:center;">Sélectionnez une conversation</div>`;
    return;
  }
  el.innerHTML = `
    <div class="thread-header">
      <button class="icon-btn thread-back" data-dash-action="thread-back">${icon("chevronLeft", 18)}</button>
      <div style="width:38px;height:38px;border-radius:999px;background:var(--accent-soft);color:var(--accent-strong);display:flex;align-items:center;justify-content:center;">${icon("user", 18)}</div>
      <div><div style="font-weight:700;font-size:.88rem;">Client</div><div style="font-size:.75rem;color:var(--ink-faint);">Conversation liée à une réservation</div></div>
    </div>
    <div class="thread-messages" id="dashThreadMessages">
      ${conv.messages
        .map(
          (m) => `
        <div class="bubble ${m.from === "me" ? "bubble-me" : "bubble-them"}">
          ${m.text}<span class="bubble-time">${m.time}</span>
        </div>`,
        )
        .join("")}
    </div>
    <div class="thread-composer">
      <input type="text" placeholder="Écrire un message…" id="dashThreadInput" />
      <button class="thread-send" data-dash-action="thread-send">${icon("send", 17)}</button>
    </div>
  `;
  const msgsEl = document.getElementById("dashThreadMessages");
  msgsEl.scrollTop = msgsEl.scrollHeight;
}

/* ============================================================
   9. PAIEMENT
   ============================================================ */
function renderPaiementPanel(container, personaKey, scope) {
  const key = personaKey === "responsable" ? "responsable" : "solo";
  const enabled = payOnlineState[key];
  container.innerHTML = `
    <div class="dash-panel-header">
      <div><h2>Paiement</h2><p>Choisissez si vos clients peuvent payer en ligne au moment de la réservation.</p></div>
    </div>
    <div class="pay-toggle-card">
      <div>
        <div class="pay-toggle-label">Accepter les paiements en ligne</div>
        <div class="pay-toggle-sub">${enabled ? "Activé — vos clients peuvent régler un acompte en ligne." : "Désactivé — le paiement se fait uniquement sur place."}</div>
      </div>
      <label class="switch-lg">
        <input type="checkbox" data-dash-action="pay-toggle" ${enabled ? "checked" : ""} />
        <span class="switch-track"></span>
      </label>
    </div>
    ${
      enabled
        ? `
      <div class="pay-options">
        <div class="pay-field">
          <label for="payDeposit">Pourcentage d'acompte demandé</label>
          <input type="number" id="payDeposit" min="0" max="100" step="5" value="10" />
        </div>
        <div class="pay-field">
          <label>Méthodes de retrait</label>
          <div class="pay-checkbox-list">
            <label class="filter-check"><input type="checkbox" checked /> Mobile Money</label>
            <label class="filter-check"><input type="checkbox" /> Virement bancaire</label>
          </div>
        </div>
      </div>`
        : ""
    }
    <div class="pay-future-teaser">
      ${icon("sparkle", 26)}
      <div>
        <h3>Formules d'abonnement</h3>
        <p>Proposez bientôt des forfaits à vos clients fidèles (ex. 5 coupes par mois à tarif réduit).</p>
      </div>
      <span class="badge-pill muted">Bientôt disponible</span>
    </div>
  `;
}

/* ============================================================
   DÉLÉGATION D'ÉVÉNEMENTS — CLIC
   ============================================================ */
function handleDashClick(e, personaKey, scope) {
  const gotoLink = e.target.closest("[data-goto-panel]");
  if (gotoLink) {
    e.preventDefault();
    goToPanel(personaKey, scope, gotoLink.dataset.gotoPanel);
    return;
  }

  const actionEl = e.target.closest("[data-dash-action]");
  if (!actionEl) return;
  const action = actionEl.dataset.dashAction;
  const id = actionEl.dataset.id ? Number(actionEl.dataset.id) : null;

  switch (action) {
    case "appt-cancel-ask":
      confirmingApptId = id;
      renderApptList(personaKey, scope, scopedAppointments(personaKey, scope));
      break;
    case "appt-cancel-no":
      confirmingApptId = null;
      renderApptList(personaKey, scope, scopedAppointments(personaKey, scope));
      break;
    case "appt-cancel-yes": {
      const appt = appointmentsData.find((a) => a.id === id);
      if (appt) appt.status = "cancelled";
      confirmingApptId = null;
      showToast("Rendez-vous annulé.");
      renderApptList(personaKey, scope, scopedAppointments(personaKey, scope));
      break;
    }
    case "appt-export": {
      let items = scopedAppointments(personaKey, scope).filter(
        (a) => a.status === apptActiveTab,
      );
      if (personaKey === "responsable" && apptFilterProfessional !== "all") {
        items = items.filter(
          (a) => String(a.professionalId) === apptFilterProfessional,
        );
      }
      if (!items.length) {
        showToast("Aucun rendez-vous à exporter dans cette liste.");
        break;
      }
      exportAppointmentsCSV(items);
      showToast("Export téléchargé.");
      break;
    }
    case "service-edit-toggle":
      editingServiceId = editingServiceId === id ? null : id;
      renderServicesList(personaKey, scope, canEditServices(personaKey, scope));
      break;
    case "service-edit-cancel":
      editingServiceId = null;
      renderServicesList(personaKey, scope, canEditServices(personaKey, scope));
      break;
    case "service-delete":
      scope.artisan.services = scope.artisan.services.filter(
        (sv) => sv.id !== id,
      );
      showToast("Service supprimé.");
      renderServicesList(personaKey, scope, canEditServices(personaKey, scope));
      break;
    case "service-add":
      applyOrQueueChange(
        personaKey,
        scope,
        "Ajout d'un nouveau service",
        null,
        () => {
          scope.artisan.services.push({
            id: Date.now(),
            name: "Nouveau service",
            desc: "",
            price: 0,
            duration: 30,
            image: scope.artisan.avatar,
            active: true,
          });
        },
      );
      renderServicesList(personaKey, scope, canEditServices(personaKey, scope));
      break;
    case "vitrine-cancel":
      vitrinePhotoDataUrl = null;
      renderVitrinePanel(
        document.getElementById("dashPanels"),
        personaKey,
        scope,
      );
      break;
    case "avail-save":
      showToast("Disponibilités enregistrées.");
      break;
    case "conv-select": {
      dashActiveConvId = id;
      const conv = conversationsData.find((c) => c.id === id);
      if (conv) conv.unread = false;
      const convs = scopedConversations(personaKey, scope);
      renderDashConvList(personaKey, scope, convs);
      renderDashThread(personaKey, scope, convs);
      document
        .getElementById("dashConvList")
        .classList.remove("mobile-visible");
      document
        .getElementById("dashThreadPanel")
        .classList.remove("mobile-hidden");
      break;
    }
    case "thread-back":
      document.getElementById("dashConvList").classList.add("mobile-visible");
      document.getElementById("dashThreadPanel").classList.add("mobile-hidden");
      break;
    case "thread-send": {
      const input = document.getElementById("dashThreadInput");
      const text = input.value.trim();
      if (!text) break;
      const conv = conversationsData.find((c) => c.id === dashActiveConvId);
      if (conv) conv.messages.push({ from: "me", text, time: "Maintenant" });
      const convs = scopedConversations(personaKey, scope);
      renderDashThread(personaKey, scope, convs);
      renderDashConvList(personaKey, scope, convs);
      break;
    }
    case "share-vitrine":
      showToast(
        "Lien de votre vitrine copié ! (fonctionnalité complète avec Supabase)",
      );
      return;
    case "goto-rendezvous":
      goToPanel(personaKey, scope, "rendezvous");
      return;
  }
}

/* ============================================================
   DÉLÉGATION D'ÉVÉNEMENTS — CHANGE (checkboxes, selects, file)
   ============================================================ */
function handleDashChange(e, personaKey, scope) {
  const actionEl = e.target.closest("[data-dash-action]");

  if (actionEl && actionEl.dataset.dashAction === "photo-input") {
    const file = actionEl.files && actionEl.files[0];
    if (file) readImageFile(file, personaKey, scope);
    return;
  }
  if (actionEl && actionEl.dataset.dashAction === "avail-toggle") {
    const idx = Number(actionEl.dataset.index);
    const label = document.querySelector(`[data-avail-label="${idx}"]`);
    if (label) label.textContent = actionEl.checked ? "Ouvert" : "Fermé";
    return;
  }
  if (actionEl && actionEl.dataset.dashAction === "pay-toggle") {
    const key = personaKey === "responsable" ? "responsable" : "solo";
    payOnlineState[key] = actionEl.checked;
    renderPaiementPanel(
      document.getElementById("dashPanels"),
      personaKey,
      scope,
    );
    return;
  }
  if (actionEl && actionEl.dataset.dashAction === "service-toggle-active") {
    const id = Number(actionEl.dataset.id);
    const s = scope.artisan.services.find((sv) => sv.id === id);
    if (!s) return;
    applyOrQueueChange(
      personaKey,
      scope,
      `${s.active === false ? "Réactivation" : "Désactivation"} du service « ${s.name} »`,
      s.id,
      () => {
        s.active = !(s.active !== false);
      },
    );
    renderServicesList(personaKey, scope, canEditServices(personaKey, scope));
    return;
  }
  if (e.target.id === "apptProFilter") {
    apptFilterProfessional = e.target.value;
    renderApptList(personaKey, scope, scopedAppointments(personaKey, scope));
  }
}

/* ============================================================
   DÉLÉGATION D'ÉVÉNEMENTS — SUBMIT (formulaires)
   ============================================================ */
function handleDashSubmit(e, personaKey, scope) {
  const form = e.target.closest("[data-dash-form]");
  if (!form) return;
  e.preventDefault();
  const type = form.dataset.dashForm;

  if (type === "service-edit") {
    const id = Number(form.dataset.id);
    const s = scope.artisan.services.find((sv) => sv.id === id);
    if (!s) return;
    const name = form.querySelector('[name="name"]').value.trim();
    const price = Number(form.querySelector('[name="price"]').value);
    const duration = Number(form.querySelector('[name="duration"]').value);
    applyOrQueueChange(
      personaKey,
      scope,
      `Modification du service « ${s.name} » → ${name}, ${price.toLocaleString("fr-FR")} FCFA, ${duration} min`,
      s.id,
      () => {
        s.name = name;
        s.price = price;
        s.duration = duration;
      },
    );
    editingServiceId = null;
    renderServicesList(personaKey, scope, canEditServices(personaKey, scope));
    return;
  }

  if (type === "review-reply") {
    const id = Number(form.dataset.id);
    const text = form.querySelector('[name="reply"]').value.trim();
    if (!text) return;
    const review = reviewsData.find((r) => r.id === id);
    if (review) review.reply = { text, date: TODAY_MOCK };
    showToast("Réponse publiée.");
    renderReviewsList(personaKey, scope);
    return;
  }

  if (form.id === "dashVitrineForm") {
    const a = scope.artisan;
    a.name = form.querySelector("#vName").value;
    a.categorySlug = form.querySelector("#vCategory").value;
    a.category =
      CATEGORIES.find((c) => c.slug === a.categorySlug)?.label || a.category;
    a.city = form.querySelector("#vCity").value;
    a.phone = form.querySelector("#vPhone").value;
    a.address = form.querySelector("#vAddress").value;
    a.description = form.querySelector("#vDesc").value;
    if (vitrinePhotoDataUrl) a.avatar = vitrinePhotoDataUrl;
    renderProfileMini(personaKey, scope);
    showToast("Vitrine mise à jour.");
  }
}

/* ============================================================
   HELPERS ÉTATS VIDES ILLUSTRÉS
   ============================================================ */
function emptyIllustrated(emoji, title, text, btnLabel, btnAction) {
  return `
    <div class="empty-illustrated">
      <div class="empty-illustrated-emoji">${emoji}</div>
      <h3>${title}</h3>
      <p>${text}</p>
      ${btnLabel ? `<button type="button" class="btn btn-primary" data-dash-action="${btnAction}">${btnLabel}</button>` : ""}
    </div>`;
}

/* ============================================================
   SÉLECTEUR DE CONTEXTE (employé avec activité solo)
   ============================================================ */
let employeContext = "equipe"; // "equipe" | "solo"

function renderContextSelector(personaKey, scope) {
  if (
    personaKey !== "employe" ||
    !scope.member ||
    !scope.member.hasSoloActivity
  )
    return "";
  return `
    <div class="context-selector">
      <button type="button" class="context-option ${employeContext === "equipe" ? "active" : ""}" data-context="equipe">
        ${scope.team.name}
      </button>
      <button type="button" class="context-option ${employeContext === "solo" ? "active" : ""}" data-context="solo">
        Mon activité solo
      </button>
    </div>`;
}

/* ============================================================
   C.1 — SECTION ÉQUIPE (mode Complet, responsable)
   ============================================================ */
let showAddMemberForm = false;

function renderEquipePanel(container, personaKey, scope) {
  if (personaKey !== "responsable" || !scope.team) {
    container.innerHTML = `<div class="dash-panel-header"><div><h2>Équipe</h2></div></div>
      ${emptyIllustrated("🔒", "Accès réservé", "Cette section est réservée au responsable de l'équipe.", null, null)}`;
    return;
  }

  const pending = pendingChangesData.filter(
    (p) => p.teamId === scope.team.id && p.status === "en_attente",
  );

  container.innerHTML = `
    <div class="dash-panel-header">
      <div>
        <h2>Équipe</h2>
        <p>${scope.team.name} · ${scope.team.members.length} professionnel${scope.team.members.length > 1 ? "s" : ""}</p>
      </div>
      <button type="button" class="btn btn-primary" data-dash-action="team-add-toggle">
        ${icon("plus", 16)} Ajouter un professionnel
      </button>
    </div>

    ${
      pending.length
        ? `
      <div class="team-pending-block">
        <div class="team-pending-title">${icon("clock", 15)} ${pending.length} modification${pending.length > 1 ? "s" : ""} en attente de validation</div>
        ${pending
          .map((p) => {
            const m = getTeamMember(scope.team.id, p.memberId);
            return `
            <div class="team-pending-item">
              <span>${m ? m.name + " — " : ""}${p.description}</span>
              <div style="display:flex;gap:.5rem;">
                <button type="button" class="btn btn-primary" style="padding:.35rem .8rem;font-size:.75rem;" data-dash-action="pending-approve" data-id="${p.id}">Approuver</button>
                <button type="button" class="btn btn-ghost" style="padding:.35rem .8rem;font-size:.75rem;" data-dash-action="pending-reject" data-id="${p.id}">Refuser</button>
              </div>
            </div>`;
          })
          .join("")}
      </div>`
        : ""
    }

    ${
      showAddMemberForm
        ? `
      <form class="team-add-form" data-dash-form="team-add-member">
        <div class="dash-field">
          <label>Nom complet</label>
          <input type="text" name="name" placeholder="Ex. Sofia Mensah" required />
        </div>
        <div class="dash-field">
          <label>Spécialité</label>
          <input type="text" name="specialty" placeholder="Ex. Coloration" required />
        </div>
        <div class="dash-field span-2" style="display:flex;gap:.6rem;justify-content:flex-end;">
          <button type="button" class="btn btn-ghost" data-dash-action="team-add-toggle">Annuler</button>
          <button type="submit" class="btn btn-primary">Ajouter à l'équipe</button>
        </div>
      </form>`
        : ""
    }

    <div class="team-grid" id="teamMemberGrid"></div>
  `;

  renderTeamMemberGrid(scope);
}

function renderTeamMemberGrid(scope) {
  const grid = document.getElementById("teamMemberGrid");
  if (!grid) return;
  grid.innerHTML = scope.team.members
    .map((m) => teamMemberCardHTML(m, scope))
    .join("");
}

function teamMemberCardHTML(m, scope) {
  const statusLabel = m.status === "actif" ? "Actif" : "En pause";
  return `
    <div class="team-member-card ${m.status === "en_pause" ? "en-pause" : ""}">
      <div class="team-member-top">
        <img src="${m.avatar}" alt="${m.name}" class="team-member-avatar" />
        <div>
          <div class="team-member-name">${m.name}</div>
          <div class="team-member-role">${m.specialty}</div>
        </div>
        <span class="team-status-badge ${m.status}">${statusLabel}</span>
      </div>

      <div class="team-permissions">
        <div class="team-perm-row">
          <span class="team-perm-label">Voir les statistiques</span>
          <label class="switch">
            <input type="checkbox" data-dash-action="perm-toggle" data-member-id="${m.id}" data-perm="voitStats" ${m.permissions.voitStats ? "checked" : ""} />
            <span class="switch-track"></span>
          </label>
        </div>
        <div class="team-perm-row">
          <span class="team-perm-label">Modifier services et créneaux (avec validation)</span>
          <label class="switch">
            <input type="checkbox" data-dash-action="perm-toggle" data-member-id="${m.id}" data-perm="modifieServicesHoraires" ${m.permissions.modifieServicesHoraires ? "checked" : ""} />
            <span class="switch-track"></span>
          </label>
        </div>
        <div class="team-perm-row">
          <span class="team-perm-label">Répondre aux avis</span>
          <label class="switch">
            <input type="checkbox" data-dash-action="perm-toggle" data-member-id="${m.id}" data-perm="reponsAvis" ${m.permissions.reponsAvis ? "checked" : ""} />
            <span class="switch-track"></span>
          </label>
        </div>
      </div>

      ${
        m.role !== "responsable"
          ? `
        <div class="team-member-actions">
          <button type="button" class="btn btn-ghost" style="flex:1;font-size:.8rem;padding:.5rem;" data-dash-action="team-toggle-pause" data-member-id="${m.id}">
            ${m.status === "actif" ? "Mettre en pause" : "Réactiver"}
          </button>
          <button type="button" class="btn btn-ghost" style="font-size:.8rem;padding:.5rem;color:var(--danger);" data-dash-action="team-remove" data-member-id="${m.id}">
            Retirer de l'équipe
          </button>
        </div>`
          : `
        <div style="font-size:.75rem;color:var(--ink-faint);text-align:center;padding-top:.5rem;">Responsable · non modifiable</div>`
      }
    </div>`;
}

/* ============================================================
   C.2 — FINANCES (responsable)
   ============================================================ */
function renderFinancesPanel(container, personaKey, scope) {
  if (personaKey === "responsable") {
    renderFinancesResponsable(container, scope);
  } else if (personaKey === "employe") {
    renderFinancesEmploye(container, scope);
  } else {
    renderFinancesSolo(container, scope);
  }
}

function renderFinancesResponsable(container, scope) {
  const fd = financeData.entreprise;
  container.innerHTML = `
    <div class="dash-panel-header">
      <div><h2>Finances</h2><p>Gérez les recettes de ${scope.team.name} et les versements à votre équipe.</p></div>
    </div>

    <div class="finance-bento">
      <div class="finance-tile accent">
        <div class="finance-tile-label">Solde global</div>
        <div class="finance-tile-value mono-num">${fd.soldeGlobal.toLocaleString("fr-FR")}</div>
        <div class="finance-tile-sub">FCFA disponibles</div>
      </div>
      <div class="finance-tile">
        <div class="finance-tile-label">Recettes du mois</div>
        <div class="finance-tile-value mono-num">${fd.recettesDuMois.toLocaleString("fr-FR")}</div>
        <div class="finance-tile-sub">FCFA</div>
      </div>
      <div class="finance-tile">
        <div class="finance-tile-label">Total dû à l'équipe</div>
        <div class="finance-tile-value mono-num">${fd.ceQuOnDoitAuxMembres.reduce((s, m) => s + m.montant, 0).toLocaleString("fr-FR")}</div>
        <div class="finance-tile-sub">FCFA à verser</div>
      </div>
    </div>

    <div class="finance-section-title">Ce qu'on doit à chaque professionnel</div>
    <div class="finance-table">
      ${fd.ceQuOnDoitAuxMembres
        .map((due) => {
          const member = getTeamMember(scope.team.id, due.memberId);
          if (!member) return "";
          return `
          <div class="finance-due-row">
            <img src="${member.avatar}" alt="${member.name}" class="finance-due-avatar" />
            <span class="finance-due-name">${member.name}</span>
            <span class="finance-due-amount mono-num">${due.montant.toLocaleString("fr-FR")} FCFA</span>
            <button type="button" class="btn btn-primary" style="padding:.4rem .9rem;font-size:.78rem;" data-dash-action="finance-pay" data-member-id="${due.memberId}">Payer</button>
          </div>`;
        })
        .join("")}
    </div>

    <div class="finance-section-title">Dernières transactions</div>
    <div class="finance-table">
      ${fd.historiqueTransactions
        .map(
          (t) => `
        <div class="finance-row">
          <span class="finance-row-label">${t.label}</span>
          <span class="finance-row-date">${t.date}</span>
          <span class="finance-row-amount positive">+${t.montant.toLocaleString("fr-FR")} FCFA</span>
        </div>`,
        )
        .join("")}
    </div>
  `;
}

function renderFinancesEmploye(container, scope) {
  const mf = financeData.membres[scope.member.id];
  const contextSelector = renderContextSelector("employe", scope);

  if (!mf) {
    container.innerHTML = `<div class="dash-panel-header"><div><h2>Mes finances</h2></div></div>
      ${emptyIllustrated("💰", "Aucune donnée financière", "Vos gains apparaîtront ici après vos premières prestations.", null, null)}`;
    return;
  }

  container.innerHTML = `
    <div class="dash-panel-header">
      <div><h2>Mes finances</h2><p>Vos gains consolidés de toutes vos activités.</p></div>
    </div>

    ${contextSelector}

    <div class="finance-bento">
      <div class="finance-tile accent">
        <div class="finance-tile-label">Ce qu'on vous doit</div>
        <div class="finance-tile-value mono-num">${mf.gainsEntreprise.toLocaleString("fr-FR")}</div>
        <div class="finance-tile-sub">FCFA · ${scope.team.name}</div>
      </div>
      ${
        scope.member.hasSoloActivity
          ? `
        <div class="finance-tile">
          <div class="finance-tile-label">Activité solo</div>
          <div class="finance-tile-value mono-num">${mf.gainsSolo.toLocaleString("fr-FR")}</div>
          <div class="finance-tile-sub">FCFA</div>
        </div>`
          : ""
      }
      <div class="finance-tile">
        <div class="finance-tile-label">Total consolidé</div>
        <div class="finance-tile-value mono-num">${(mf.gainsEntreprise + (scope.member.hasSoloActivity ? mf.gainsSolo : 0)).toLocaleString("fr-FR")}</div>
        <div class="finance-tile-sub">FCFA toutes sources</div>
      </div>
    </div>

    <button type="button" class="btn btn-primary" style="margin-bottom:1.5rem;" data-dash-action="finance-withdraw">
      ${icon("download", 16)} Demander un retrait
    </button>

    <div class="finance-section-title">Historique de vos paiements</div>
    <div class="finance-table">
      ${mf.historique
        .map(
          (h) => `
        <div class="finance-row">
          <span class="finance-row-label">${h.label}</span>
          <span class="finance-row-date">${h.date}</span>
          <span class="finance-row-amount positive">${h.montant.toLocaleString("fr-FR")} FCFA</span>
          <span class="finance-row-status ${h.statut}">${h.statut === "verse" ? "Versé" : "En attente"}</span>
        </div>`,
        )
        .join("")}
    </div>
  `;
}

function renderFinancesSolo(container, scope) {
  const appts = scopedAppointments("solo", scope).filter(
    (a) => a.status === "done",
  );
  const total = appts.reduce((s, a) => s + a.price, 0);
  container.innerHTML = `
    <div class="dash-panel-header">
      <div><h2>Mes finances</h2><p>Aperçu de vos recettes.</p></div>
    </div>
    <div class="finance-bento">
      <div class="finance-tile accent">
        <div class="finance-tile-label">Recettes totales</div>
        <div class="finance-tile-value mono-num">${total.toLocaleString("fr-FR")}</div>
        <div class="finance-tile-sub">FCFA (prestations terminées)</div>
      </div>
    </div>
    ${emptyIllustrated("📊", "Connectez un moyen de retrait", "La gestion avancée des recettes arrive avec la connexion à Supabase.", null, null)}
  `;
}

/* ============================================================
   C.3 — GESTION DES CONFLITS DE DISPONIBILITÉS
   ============================================================ */
function assignProfessional(teamId, date, time, preference) {
  const team = teamsData.find((t) => t.id === teamId);
  if (!team) return null;

  const availableMembers = team.members.filter((m) => {
    if (m.status !== "actif" || m.role === "responsable") return false;
    // Vérifie qu'il n'a pas déjà un RDV sur ce créneau (mock simplifié)
    const clash = appointmentsData.some(
      (a) =>
        a.artisanId === team.artisanId &&
        a.professionalId === m.id &&
        a.date === date &&
        a.time === time &&
        a.status === "upcoming",
    );
    return !clash;
  });

  if (!availableMembers.length) return null;

  // Assignation aléatoire parmi les disponibles
  return availableMembers[Math.floor(Math.random() * availableMembers.length)];
}

function renderConflitsPanel(container, personaKey, scope) {
  if (personaKey !== "responsable" || !scope.team) {
    container.innerHTML = emptyIllustrated(
      "🔒",
      "Accès réservé",
      "Section réservée au responsable.",
      null,
      null,
    );
    return;
  }

  // Rendez-vous sans professionnel assigné
  const unassigned = appointmentsData.filter(
    (a) =>
      a.artisanId === scope.artisan.id &&
      a.status === "upcoming" &&
      !a.professionalId,
  );

  container.innerHTML = `
    <div class="dash-panel-header">
      <div>
        <h2>Assignation des créneaux</h2>
        <p>Gérez les rendez-vous sans professionnel assigné et réassignez si nécessaire.</p>
      </div>
    </div>
    ${
      !unassigned.length
        ? `
      <div class="tdb-empty-hint">✅ Tous les rendez-vous ont un professionnel assigné. Beau travail !</div>`
        : `
      <div class="finance-table" id="conflitsTable">
        ${unassigned.map((a) => conflitRowHTML(a, scope)).join("")}
      </div>`
    }

    <div class="finance-section-title" style="margin-top:2rem;">Tous les rendez-vous à venir</div>
    <div class="finance-table" id="allApptsTable">
      ${appointmentsData
        .filter(
          (a) => a.artisanId === scope.artisan.id && a.status === "upcoming",
        )
        .sort(
          (a, b) =>
            new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time),
        )
        .map((a) => {
          const pro = a.professionalId
            ? getTeamMember(scope.team.id, a.professionalId)
            : null;
          return `
            <div class="finance-row">
              <div class="finance-row-label">
                <div style="font-weight:600;">${a.serviceName}</div>
                <div style="font-size:.76rem;color:var(--ink-faint);">${formatDateFrLong(a.date)} à ${a.time}</div>
              </div>
              <span style="font-size:.8rem;color:${pro ? "var(--ink-soft)" : "var(--star)"};">
                ${pro ? pro.name : "⚠️ À assigner"}
              </span>
              <select class="appt-filter-select" style="font-size:.76rem;padding:.3rem .6rem;" data-dash-action="reassign-appt" data-appt-id="${a.id}">
                <option value="">— Assigner —</option>
                ${scope.team.members
                  .filter((m) => m.status === "actif")
                  .map(
                    (m) =>
                      `<option value="${m.id}" ${a.professionalId === m.id ? "selected" : ""}>${m.name}</option>`,
                  )
                  .join("")}
              </select>
            </div>`;
        })
        .join("")}
    </div>
  `;
}

function conflitRowHTML(a, scope) {
  const suggested = assignProfessional(
    scope.team.id,
    a.date,
    a.time,
    a.preference,
  );
  return `
    <div class="finance-row">
      <div class="finance-row-label">
        <div style="font-weight:600;">${a.serviceName}</div>
        <div style="font-size:.76rem;color:var(--ink-faint);">${formatDateFrLong(a.date)} à ${a.time}</div>
      </div>
      <span style="font-size:.78rem;color:var(--star);">
        ${suggested ? "Suggestion : " + suggested.name : "Aucun professionnel disponible"}
      </span>
      <button type="button" class="btn btn-primary" style="padding:.4rem .85rem;font-size:.76rem;" data-dash-action="auto-assign" data-appt-id="${a.id}">
        Confirmer
      </button>
    </div>`;
}

/* ============================================================
   MISE À JOUR DU DISPATCH — ajouter les nouveaux panneaux
   ============================================================ */
// Remplace renderPanel pour inclure equipe, finances, conflits
const _originalRenderPanel = renderPanel;
window.renderPanel = function renderPanel(personaKey, scope) {
  const container = document.getElementById("dashPanels");
  if (!container) return;
  switch (currentPanelKey) {
    case "equipe":
      return renderEquipePanel(container, personaKey, scope);
    case "finances":
      return renderFinancesPanel(container, personaKey, scope);
    case "conflits":
      return renderConflitsPanel(container, personaKey, scope);
    default:
      return _originalRenderPanel(personaKey, scope);
  }
};

// Ajouter les nouveaux items de nav
Object.assign(ALL_NAV_ITEMS, {
  equipe: { label: "Équipe", icon: "user" },
  finances: { label: "Finances", icon: "card" },
  conflits: { label: "Créneaux", icon: "calendar" },
});

// Mise à jour de computeVisibleNav
const _originalComputeVisibleNav = computeVisibleNav;
window.computeVisibleNav = function computeVisibleNav(personaKey, scope) {
  const base = _originalComputeVisibleNav(personaKey, scope);
  const mode = getDashMode(personaKey);

  if (personaKey === "responsable" && mode === "complet") {
    // Ajoute Équipe, Finances, Créneaux après Paiement
    const idx = base.indexOf("paiement");
    if (idx !== -1) {
      base.splice(idx + 1, 0, "equipe", "finances", "conflits");
    }
  }
  if (personaKey === "employe") {
    // Ajoute Finances pour l'employé
    if (!base.includes("finances")) base.push("finances");
  }
  if (personaKey === "solo") {
    // Finances optionnel pour solo
    if (!base.includes("finances")) base.push("finances");
  }
  return base;
};

/* ============================================================
   MISE À JOUR DU GESTIONNAIRE DE CLICS — nouveaux cas
   ============================================================ */
const _originalHandleDashClick = handleDashClick;
window.handleDashClick = function handleDashClick(e, personaKey, scope) {
  const actionEl = e.target.closest("[data-dash-action]");
  if (actionEl) {
    const action = actionEl.dataset.dashAction;
    const id = actionEl.dataset.id ? Number(actionEl.dataset.id) : null;
    const memberId = actionEl.dataset.memberId
      ? Number(actionEl.dataset.memberId)
      : null;
    const apptId = actionEl.dataset.apptId
      ? Number(actionEl.dataset.apptId)
      : null;

    switch (action) {
      case "team-add-toggle":
        showAddMemberForm = !showAddMemberForm;
        renderEquipePanel(
          document.getElementById("dashPanels"),
          personaKey,
          scope,
        );
        return;

      case "team-toggle-pause": {
        const team = scope.team;
        const m = team.members.find((mb) => mb.id === memberId);
        if (m) {
          m.status = m.status === "actif" ? "en_pause" : "actif";
        }
        renderTeamMemberGrid(scope);
        showToast(
          m && m.status === "actif" ? m.name + " réactivé." : "Mis en pause.",
        );
        return;
      }

      case "team-remove": {
        const team = scope.team;
        const m = team.members.find((mb) => mb.id === memberId);
        if (m && confirm(`Retirer ${m.name} de l'équipe ?`)) {
          team.members = team.members.filter((mb) => mb.id !== memberId);
          renderEquipePanel(
            document.getElementById("dashPanels"),
            personaKey,
            scope,
          );
          showToast(m.name + " retiré de l'équipe.");
        }
        return;
      }

      case "pending-approve": {
        const p = pendingChangesData.find((pc) => pc.id === id);
        if (p) {
          p.status = "approuve";
          showToast("Modification approuvée.");
        }
        renderEquipePanel(
          document.getElementById("dashPanels"),
          personaKey,
          scope,
        );
        return;
      }

      case "pending-reject": {
        const p = pendingChangesData.find((pc) => pc.id === id);
        if (p) {
          p.status = "refuse";
          showToast("Modification refusée.");
        }
        renderEquipePanel(
          document.getElementById("dashPanels"),
          personaKey,
          scope,
        );
        return;
      }

      case "finance-pay": {
        const due = financeData.entreprise.ceQuOnDoitAuxMembres.find(
          (d) => d.memberId === memberId,
        );
        const m = scope.team ? getTeamMember(scope.team.id, memberId) : null;
        if (due && m) {
          financeData.entreprise.historiqueTransactions.unshift({
            id: Date.now(),
            label: "Versement à " + m.name,
            montant: due.montant,
            date: TODAY_MOCK,
          });
          due.montant = 0;
          showToast("Versement de " + m.name + " effectué.");
          renderFinancesPanel(
            document.getElementById("dashPanels"),
            personaKey,
            scope,
          );
        }
        return;
      }

      case "finance-withdraw": {
        const mf = financeData.membres[scope.member && scope.member.id];
        if (mf) {
          showToast("Demande de retrait envoyée à votre responsable.");
        }
        return;
      }

      case "auto-assign": {
        const appt = appointmentsData.find((a) => a.id === apptId);
        if (appt && scope.team) {
          const pro = assignProfessional(
            scope.team.id,
            appt.date,
            appt.time,
            appt.preference,
          );
          if (pro) {
            appt.professionalId = pro.id;
            showToast(pro.name + " assigné pour ce créneau.");
            renderConflitsPanel(
              document.getElementById("dashPanels"),
              personaKey,
              scope,
            );
          } else {
            showToast("Aucun professionnel disponible sur ce créneau.");
          }
        }
        return;
      }

      default:
        break;
    }
  }

  // Sélecteur de contexte employé
  const ctxBtn = e.target.closest("[data-context]");
  if (ctxBtn) {
    employeContext = ctxBtn.dataset.context;
    renderPanel(personaKey, scope);
    return;
  }

  // Déléguer au gestionnaire original
  _originalHandleDashClick(e, personaKey, scope);
};

/* ============================================================
   MISE À JOUR DU GESTIONNAIRE CHANGE — permissions équipe + réassignation
   ============================================================ */
const _originalHandleDashChange = handleDashChange;
window.handleDashChange = function handleDashChange(e, personaKey, scope) {
  const actionEl = e.target.closest("[data-dash-action]");
  if (actionEl && actionEl.dataset.dashAction === "perm-toggle") {
    const memberId = Number(actionEl.dataset.memberId);
    const perm = actionEl.dataset.perm;
    const team = scope.team;
    if (!team) return;
    const m = team.members.find((mb) => mb.id === memberId);
    if (m && perm in m.permissions) {
      m.permissions[perm] = actionEl.checked;
      showToast("Permission mise à jour pour " + m.name + ".");
    }
    return;
  }

  if (actionEl && actionEl.dataset.dashAction === "reassign-appt") {
    const apptId = Number(actionEl.dataset.apptId);
    const newMemberId = actionEl.value ? Number(actionEl.value) : null;
    const appt = appointmentsData.find((a) => a.id === apptId);
    if (appt) {
      appt.professionalId = newMemberId;
      const m =
        newMemberId && scope.team
          ? getTeamMember(scope.team.id, newMemberId)
          : null;
      showToast(m ? m.name + " assigné." : "Assignation retirée.");
    }
    return;
  }

  _originalHandleDashChange(e, personaKey, scope);
};

/* ============================================================
   MISE À JOUR DU GESTIONNAIRE SUBMIT — ajout de membre
   ============================================================ */
const _originalHandleDashSubmit = handleDashSubmit;
window.handleDashSubmit = function handleDashSubmit(e, personaKey, scope) {
  const form = e.target.closest("[data-dash-form]");
  if (form && form.dataset.dashForm === "team-add-member") {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value.trim();
    const specialty = form.querySelector('[name="specialty"]').value.trim();
    if (!name || !specialty) return;
    const newMember = {
      id: Date.now(),
      name,
      role: "employe",
      specialty,
      avatar:
        "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150&h=150&fit=crop",
      status: "actif",
      permissions: {
        voitStats: false,
        modifieServicesHoraires: false,
        reponsAvis: false,
      },
      hasSoloActivity: false,
    };
    scope.team.members.push(newMember);
    showAddMemberForm = false;
    showToast(name + " ajouté à l'équipe.");
    renderEquipePanel(document.getElementById("dashPanels"), personaKey, scope);
    return;
  }
  _originalHandleDashSubmit(e, personaKey, scope);
};
