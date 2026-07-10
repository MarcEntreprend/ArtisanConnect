// js/main.js — ArtisanConnect
"use strict";

/* ============================================================
   0. ICÔNES (jeu unique, stroke-width 2, cohérent avec le reste du site)
   ============================================================ */
const ICONS = {
  hammer:
    '<path d="M14.5 3.5 21 10l-2.5 2.5-6.5-6.5zM4 20l7-7"/><path d="m8 13-4.5 4.5a1.5 1.5 0 0 0 2 2L10 15"/>',
  bolt: '<path d="M13 2 3 14h7l-1 8 11-14h-7z"/>',
  wrench:
    '<path d="M14.7 6.3a4 4 0 1 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4z"/><path d="M4 17v3h3"/>',
  brick:
    '<rect x="3" y="6" width="8" height="5"/><rect x="13" y="6" width="8" height="5"/><rect x="7" y="13" width="8" height="5"/>',
  roller:
    '<rect x="3" y="4" width="12" height="6" rx="1"/><path d="M9 10v5M9 15h5v4H9z"/>',
  scissors:
    '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.5 15.5M8.5 8.5 20 20"/>',
  "scissors-hair":
    '<circle cx="6" cy="7" r="2.5"/><circle cx="6" cy="17" r="2.5"/><path d="M8.5 8.5 20 20M8.5 15.5 20 4"/>',
  car: '<path d="M5 17h14M5 17a2 2 0 1 0 4 0M15 17a2 2 0 1 0 4 0M5 17l1.5-6h11L19 17M6.5 11h11"/>',
  star: '<path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>',
  location:
    '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  heart:
    '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.6z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  phone:
    '<path d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1m-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5m4.5-4H7V4h9z"/>',
  wifi: '<path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9m8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0m-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13"/>',
  parking:
    '<path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16m11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5M5 11l1.5-4.5h11L19 11z"/>',
  wheelchair:
    '<circle cx="12" cy="4" r="2"/><path d="M19 13v-2c-1.54.02-3.09-.75-4.07-1.83l-1.29-1.43c-.17-.19-.38-.34-.61-.45-.01 0-.01-.01-.02-.01H13c-.35-.2-.75-.3-1.19-.26C10.76 7.11 10 8.04 10 9.09V15c0 1.1.9 2 2 2h5v5h2v-5.5c0-1.1-.9-2-2-2h-3v-3.45c1.29 1.07 3.25 1.94 5 1.95m-6.17 5c-.41 1.16-1.52 2-2.83 2-1.66 0-3-1.34-3-3 0-1.31.84-2.41 2-2.83V12.1c-2.28.46-4 2.48-4 4.9 0 2.76 2.24 5 5 5 2.42 0 4.44-1.72 4.9-4z"/>',
  baby: '<circle cx="14.5" cy="10.5" r="1.25"/><circle cx="9.5" cy="10.5" r="1.25"/><path d="M22.94 12.66c.04-.21.06-.43.06-.66s-.02-.45-.06-.66c-.25-1.51-1.36-2.74-2.81-3.17-.53-1.12-1.28-2.1-2.19-2.91C16.36 3.85 14.28 3 12 3s-4.36.85-5.94 2.26c-.92.81-1.67 1.8-2.19 2.91-1.45.43-2.56 1.65-2.81 3.17-.04.21-.06.43-.06.66s.02.45.06.66c.25 1.51 1.36 2.74 2.81 3.17.52 1.11 1.27 2.09 2.17 2.89C7.62 20.14 9.71 21 12 21s4.38-.86 5.97-2.28c.9-.8 1.65-1.79 2.17-2.89 1.44-.43 2.55-1.65 2.8-3.17Z"/>',
  mail: '<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16H8V7h11z"/>',
  chat: '<path d="M16.75 13.96c.25.13.41.2.46.3.06.11.04.61-.21 1.18-.2.56-1.24 1.1-1.7 1.12-.46.02-.47.36-2.96-.73-2.49-1.09-3.99-3.75-4.11-3.92-.12-.17-.96-1.38-.92-2.61.05-1.22.69-1.8.95-2.04.24-.26.51-.29.68-.26h.47c.15 0 .36-.06.55.45l.69 1.87c.06.13.1.28.01.44l-.27.41-.39.42c-.12.12-.26.25-.12.5.12.26.62 1.09 1.32 1.78.91.88 1.71 1.17 1.95 1.3.24.14.39.12.54-.04l.81-.94c.19-.25.35-.19.58-.11l1.67.88M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10c-1.97 0-3.8-.57-5.35-1.55L2 22l1.55-4.65A9.969 9.969 0 0 1 2 12 10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8c0 1.72.54 3.31 1.46 4.61L4.5 19.5l2.89-.96A7.95 7.95 0 0 0 12 20a8 8 0 0 0 8-8 8 8 0 0 0-8-8z"/>',
  navigate: '<path d="M21 3 3 10.53v.98l6.84 2.65L12.48 21h.98z"/>',
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  send: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/>',
  trendUp: '<path d="M3 17 9 11 13 15 21 6"/><path d="M15 6h6v6"/>',
  filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash:
    '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
};

function icon(name, size) {
  size = size || 18;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ""}</svg>`;
}

function iconFilled(name, size) {
  size = size || 18;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor">${ICONS[name] || ""}</svg>`;
}

/* ============================================================
   1. CHARGEMENT DES INCLUDES (header / bottom-nav / modales)
   ============================================================ */
function loadIncludes(opts) {
  opts = opts || {};
  const activePage = opts.activePage || "index.html";

  Promise.all([
    fetch("components/header.html").then((r) => (r.ok ? r.text() : "")),
    fetch("components/bottom-nav.html").then((r) => (r.ok ? r.text() : "")),
  ]).then(([headerHtml, navHtml]) => {
    const headerEl = document.getElementById("header-container");
    if (headerEl && headerHtml) headerEl.innerHTML = headerHtml;

    const navEl = document.getElementById("bottom-nav-container");
    if (navEl && navHtml) navEl.innerHTML = navHtml;

    highlightActiveNav(activePage);
    initHeaderInteractions();
    initBottomNav();
    initThemeToggle();
    initCookieConsent();
    initBackToTop();
    initMobileBanner();
    initSearch();
    initFavoriteButtons();
  });

  // Modales (indépendantes du header)
  fetch("components/modal-reservation.html")
    .then((r) => (r.ok ? r.text() : ""))
    .then((html) => {
      const el = document.getElementById("booking-modal-container");
      if (el && html) el.innerHTML = html;
    });

  fetch("components/modal-login.html")
    .then((r) => (r.ok ? r.text() : ""))
    .then((html) => {
      const el = document.getElementById("login-modal-container");
      if (el && html) el.innerHTML = html;
    });

  loadTheme();
  displayCurrentDate();
}

function highlightActiveNav(activePage) {
  document.querySelectorAll(".header-nav a, .nav-item").forEach((item) => {
    const page = item.dataset.page;
    if (page === activePage) item.classList.add("active");
  });
}

/* ============================================================
   2. THÈME (clair / sombre)
   ============================================================ */
function loadTheme() {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = saved === "dark" || (!saved && prefersDark);
  document.body.classList.toggle("dark", isDark);
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

function initThemeToggle() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;
  btn.addEventListener("click", toggleTheme);
}

/* ============================================================
   3. DATE
   ============================================================ */
function displayCurrentDate() {
  const el = document.getElementById("currentDate");
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* ============================================================
   4. INTERACTIONS HEADER (langue, profil)
   ============================================================ */
function initHeaderInteractions() {
  const langTrigger = document.getElementById("langTrigger");
  const langDropdown = document.getElementById("langDropdown");

  if (langTrigger && langDropdown) {
    langTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      langDropdown.classList.toggle("open");
      langTrigger.classList.toggle("open");
    });

    langDropdown.querySelectorAll("li[data-lang]").forEach((opt) => {
      opt.addEventListener("click", () => {
        const flagSrc = opt.querySelector(".lang-flag-img")?.src || "";
        const code = opt.dataset.lang.split("-")[0].toUpperCase();
        const triggerFlag = langTrigger.querySelector(".lang-flag-img");
        const triggerText = langTrigger.querySelector(".lang-text");
        if (triggerFlag) triggerFlag.src = flagSrc;
        if (triggerText) triggerText.textContent = code;

        langDropdown.querySelectorAll("li").forEach((li) => {
          li.classList.remove("active");
          li.querySelector(".lang-check")?.classList.remove("active");
        });
        opt.classList.add("active");
        opt.querySelector(".lang-check")?.classList.add("active");
        langDropdown.classList.remove("open");
        langTrigger.classList.remove("open");
      });
    });
  }

  const profileTrigger = document.getElementById("profileTrigger");
  const profileDropdown = document.getElementById("profileDropdown");
  if (profileTrigger && profileDropdown) {
    profileTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle("open");
    });
  }

  // Mise à jour de l'interface selon l'état de connexion
  async function updateAuthUI() {
    const loginBtn = document.getElementById("loginBtn");
    const profileInitials = document.getElementById("profileInitials");

    if (!loginBtn || !profileTrigger) return;

    try {
      const { data } = await SupabaseAPI.auth.getSession();
      const session = data?.session || null;

      if (session?.user) {
        loginBtn.style.display = "none";
        profileTrigger.style.display = "";
        const name =
          session.user.user_metadata?.full_name || session.user.email || "??";
        profileInitials.textContent = name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
      } else {
        loginBtn.style.display = "";
        profileTrigger.style.display = "none";
      }
    } catch (e) {
      // SupabaseAPI non chargé ou réseau indisponible, on laisse le bouton "Se connecter" visible
      console.warn("updateAuthUI :", e.message);
      if (loginBtn) loginBtn.style.display = "";
      if (profileTrigger) profileTrigger.style.display = "none";
    }
  }

  setTimeout(updateAuthUI, 100);

  // Déconnexion
  document.getElementById("logoutBtn")?.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await SupabaseAPI.auth.signOut();
    } catch (e) {
      // ignore
    }
    window.location.reload();
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".language-wrapper")) {
      langDropdown?.classList.remove("open");
      langTrigger?.classList.remove("open");
    }
    if (!e.target.closest(".profile-wrapper")) {
      profileDropdown?.classList.remove("open");
    }
  });
}

/* ============================================================
   5. NAVIGATION MOBILE
   ============================================================ */
function initBottomNav() {
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      const page = item.dataset.page;
      if (page && page !== "#") window.location.href = page;
    });
  });
}

/* ============================================================
   6. COOKIES
   ============================================================ */
function initCookieConsent() {
  const consentEl = document.getElementById("cookieConsent");
  if (!consentEl) return;

  function setConsent(accepted) {
    localStorage.setItem("cookieConsent", accepted ? "all" : "essential");
    consentEl.classList.remove("visible");
  }

  const stored = localStorage.getItem("cookieConsent");
  if (!stored) {
    setTimeout(() => consentEl.classList.add("visible"), 600);
  }

  document
    .getElementById("acceptAllCookies")
    ?.addEventListener("click", () => setConsent(true));
  document
    .getElementById("acceptEssentialCookies")
    ?.addEventListener("click", () => setConsent(false));
  document
    .querySelectorAll(".cookie-btn")
    .forEach((btn) =>
      btn.addEventListener("click", () => consentEl.classList.add("visible")),
    );
}

/* ============================================================
   7. RETOUR EN HAUT / BANNIÈRE MOBILE
   ============================================================ */
function initBackToTop() {
  document.querySelectorAll(".back-to-top").forEach((btn) => {
    btn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  });
}

function initMobileBanner() {
  const banner = document.getElementById("mobileBanner");
  const closeBtn = document.getElementById("closeBanner");
  if (!banner || !closeBtn) return;
  if (sessionStorage.getItem("bannerDismissed")) {
    banner.style.display = "none";
    return;
  }
  closeBtn.addEventListener("click", () => {
    banner.style.display = "none";
    sessionStorage.setItem("bannerDismissed", "1");
  });
}

/* ============================================================
   8. FAVORIS (localStorage)
   ============================================================ */
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem("favorites") || "[]");
  } catch {
    return [];
  }
}

function toggleFavorite(id) {
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if (idx === -1) {
    favs.push(id);
    showToast("Ajouté à vos favoris.");
  } else {
    favs.splice(idx, 1);
    showToast("Retiré de vos favoris.");
  }
  localStorage.setItem("favorites", JSON.stringify(favs));
  return favs.includes(id);
}

function initFavoriteButtons() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".artisan-fav");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const id = Number(btn.dataset.id);
    const isFav = toggleFavorite(id);
    btn.classList.toggle("active", isFav);

    // Si on est sur la page favoris, on retire immédiatement la carte
    if (!isFav && document.getElementById("favoritesGrid")) {
      renderFavoritesPage();
    }
  });
}

/* ============================================================
   9. TOASTS
   ============================================================ */
function showToast(message) {
  const stack = document.getElementById("toastStack");
  if (!stack) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `${icon("check", 18)}<span>${message}</span>`;
  stack.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
window.showToast = showToast;

/* ============================================================
   10. CATÉGORIES
   ============================================================ */
function renderCategoryFilters(containerId) {
  const el = document.getElementById(containerId);
  if (!el || typeof CATEGORIES === "undefined") return;

  const allBtn = `<button class="category-btn active" data-slug="all">${icon("star", 16)} Tous les métiers</button>`;
  const buttons = CATEGORIES.map(
    (cat) =>
      `<button class="category-btn" data-slug="${cat.slug}">${icon(cat.icon, 16)} ${cat.label}</button>`,
  ).join("");

  el.innerHTML = allBtn + buttons;

  el.querySelectorAll(".category-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      el.querySelectorAll(".category-btn").forEach((b) =>
        b.classList.remove("active"),
      );
      btn.classList.add("active");
      filterArtisansByCategory(btn.dataset.slug);
    });
  });
}

function filterArtisansByCategory(slug) {
  const cards = document.querySelectorAll(".artisan-card");
  let visible = 0;
  cards.forEach((card) => {
    const match = slug === "all" || card.dataset.category === slug;
    card.style.display = match ? "" : "none";
    if (match) visible++;
  });
  updateResultsCount(visible);
}

/* ============================================================
   11. RECHERCHE
   ============================================================ */
function initSearch() {
  const input = document.getElementById("searchInput");
  if (!input) return;
  input.addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();
    const cards = document.querySelectorAll(".artisan-card");
    let visible = 0;
    cards.forEach((card) => {
      const name = (card.dataset.name || "").toLowerCase();
      const category = (card.dataset.categoryLabel || "").toLowerCase();
      const city = (card.dataset.city || "").toLowerCase();
      const match =
        !query ||
        name.includes(query) ||
        category.includes(query) ||
        city.includes(query);
      card.style.display = match ? "" : "none";
      if (match) visible++;
    });
    updateResultsCount(visible);
  });
}

function updateResultsCount(count) {
  const el = document.getElementById("resultsCount");
  if (!el) return;
  el.textContent = `${count} artisan${count > 1 ? "s" : ""} disponible${count > 1 ? "s" : ""}`;
}

/* ============================================================
   12. CARTE ARTISAN + GRILLE
   ============================================================ */
function formatPrice(amount, currency) {
  if (!amount) return "Devis gratuit";
  return `dès ${amount.toLocaleString("fr-FR")} ${currency}`;
}

function artisanCardHTML(a) {
  const favs = getFavorites();
  const isFav = favs.includes(a.id);
  return `
    <a href="artisan-detail.html?id=${a.id}" class="artisan-card" data-name="${a.name}" data-category="${a.categorySlug}" data-category-label="${a.category}" data-city="${a.city}">
      <div class="artisan-card-media">
        <img src="${a.avatar}" alt="${a.name}, ${a.category} à ${a.city}" loading="lazy" />
        <button class="artisan-fav ${isFav ? "active" : ""}" data-id="${a.id}" aria-label="Ajouter aux favoris">
          ${isFav ? iconFilled("heart", 18) : icon("heart", 18)}
        </button>
        ${
          a.availableToday
            ? `<span class="artisan-availability"><span class="availability-dot"></span> Disponible aujourd'hui</span>`
            : ""
        }
      </div>
      <div class="artisan-card-body">
        <div class="artisan-card-top">
          <div>
            <div class="artisan-name">${a.name}</div>
            <div class="artisan-category">${a.category} · ${a.city}</div>
          </div>
          <div class="artisan-rating">
            ${icon("star", 15)} ${a.rating.toFixed(1)} <span class="count">(${a.reviews})</span>
          </div>
        </div>
        <div class="artisan-card-meta">
          <span class="artisan-location">${icon("location", 14)} ${a.distance}</span>
          <span class="artisan-price mono-num">${formatPrice(a.priceFrom, a.currency)}</span>
        </div>
      </div>
    </a>
  `;
}

function skeletonCardHTML() {
  return `
    <div class="skeleton-card">
      <div class="skeleton-block skeleton-media"></div>
      <div class="skeleton-block skeleton-line" style="width:70%"></div>
      <div class="skeleton-block skeleton-line" style="width:45%"></div>
    </div>
  `;
}

function renderArtisansGrid(containerId, data, opts) {
  opts = opts || {};
  const el = document.getElementById(containerId);
  const locationPrompt = document.getElementById("locationPrompt");
  if (!el) return;

  // Skeletons pendant un court instant pour simuler le chargement
  el.innerHTML = Array.from({ length: 6 }).map(skeletonCardHTML).join("");

  setTimeout(() => {
    if (!data || data.length === 0) {
      el.innerHTML = "";
      locationPrompt?.classList.add("visible");
      if (opts.count) updateResultsCount(0);
      return;
    }
    locationPrompt?.classList.remove("visible");
    el.innerHTML = data.map(artisanCardHTML).join("");
    if (opts.count) updateResultsCount(data.length);
    if (opts.countTarget) updateResultsCount(data.length);
  }, 420);
}

/* ============================================================
   13. TÉMOIGNAGES
   ============================================================ */
function testimonialCardHTML(t) {
  const stars = Array.from({ length: 5 })
    .map(
      (_, i) =>
        `<span style="opacity:${i < t.rating ? 1 : 0.25}">${icon("star", 15)}</span>`,
    )
    .join("");
  return `
    <div class="testimonial-card">
      <div class="testimonial-stars">${stars}</div>
      <p class="testimonial-quote">« ${t.quote} »</p>
      <div class="testimonial-author">
        <img src="${t.avatar}" alt="${t.name}" class="testimonial-avatar" loading="lazy" />
        <div>
          <div class="testimonial-name">${t.name}</div>
          <div class="testimonial-role">${t.role}</div>
        </div>
      </div>
    </div>
  `;
}

function renderTestimonials(containerId) {
  const el = document.getElementById(containerId);
  if (!el || typeof testimonialsData === "undefined") return;
  el.innerHTML = testimonialsData.map(testimonialCardHTML).join("");
}

/* ============================================================
   14. PAGE DÉTAIL ARTISAN
   ============================================================ */
const AMENITY_META = [
  { key: "wifi", label: "Wi-Fi", icon: "wifi" },
  { key: "parking", label: "Parking", icon: "parking" },
  { key: "accessibility", label: "Accessibilité", icon: "wheelchair" },
  { key: "kids", label: "Enfants bienvenus", icon: "baby" },
];

function amenityHTML(a) {
  return AMENITY_META.map((meta) => {
    const available = a.amenities[meta.key];
    return `
      <div class="amenity ${available ? "" : "unavailable"}">
        ${icon(meta.icon, 22)}
        <span>${meta.label}</span>
      </div>`;
  }).join("");
}

function hoursHTML(a) {
  return a.hours
    .map(
      (h) => `
      <div class="hours-row">
        <span class="hours-day ${h.today ? "today" : ""}">${h.day}${h.today ? '<span class="hours-badge">Aujourd\'hui</span>' : ""}</span>
        <span class="hours-time mono-num">${h.time}</span>
      </div>`,
    )
    .join("");
}

function serviceRowHTML(s, artisan) {
  return `
    <div class="service-row">
      <img src="${s.image}" alt="${s.name}" class="service-thumb" loading="lazy" />
      <div class="service-info">
        <div class="service-name">${s.name}</div>
        <div class="service-desc">${s.desc}</div>
        <div class="service-meta">
          <span class="service-price mono-num">${s.price ? s.price.toLocaleString("fr-FR") + " " + artisan.currency : "Gratuit"}</span>
          <span class="service-duration">${icon("clock", 14)} ${s.duration} min</span>
        </div>
      </div>
      <button class="service-book booking-trigger" data-artisan-name="${artisan.name}" data-service-name="${s.name}">
        Réserver
      </button>
    </div>
  `;
}

function renderArtisanDetail(container, a) {
  const favs = getFavorites();
  const isFav = favs.includes(a.id);

  container.innerHTML = `
    <div class="detail-layout">
      <div class="fade-in">
        <div class="detail-hero">
          <img src="${a.avatar}" alt="${a.name}" class="detail-avatar" />
          <div class="detail-title-row">
            <div>
              <h1>${a.name}</h1>
              ${a.verified ? `<div class="detail-verified">${icon("check", 15)} Profil vérifié</div>` : ""}
              <div class="detail-meta-row">
                <span>${icon("star", 15)} ${a.rating.toFixed(1)} (${a.reviews} avis)</span>
                <span class="sep">·</span>
                <span>${a.category}</span>
                <span class="sep">·</span>
                <span>${icon("location", 14)} ${a.city}</span>
              </div>
            </div>
            <div class="detail-actions">
              <button class="icon-btn artisan-fav ${isFav ? "active" : ""}" data-id="${a.id}" aria-label="Ajouter aux favoris" style="border:1px solid var(--border);">
                ${isFav ? iconFilled("heart", 19) : icon("heart", 19)}
              </button>
              <button class="btn btn-primary booking-trigger" data-artisan-name="${a.name}" data-service-name="Rendez-vous général">
                Réserver
              </button>
            </div>
          </div>
        </div>

        <div class="detail-cover">
          <img src="${a.cover}" alt="Atelier de ${a.name}" />
        </div>

        <div class="tab-section" role="tablist">
          <button class="tab-button active" data-tab="services">Services</button>
          <button class="tab-button" data-tab="about">À propos</button>
          <button class="tab-button" data-tab="reviews">Avis (${a.reviews})</button>
        </div>

        <div class="tab-panel" data-panel="services">
          <p class="detail-desc">${a.description}</p>

          <h2 style="font-size:1.05rem;font-weight:700;margin-bottom:.9rem;">Commodités</h2>
          <div class="amenities-grid">${amenityHTML(a)}</div>

          <h2 style="font-size:1.05rem;font-weight:700;margin-bottom:.4rem;">Services proposés</h2>
          <div>${a.services.map((s) => serviceRowHTML(s, a)).join("")}</div>
        </div>

        <div class="tab-panel" data-panel="about" style="display:none;">
          <p class="detail-desc">${a.description}</p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-top:1rem;">
            ${a.gallery.map((src) => `<img src="${src}" alt="Réalisation de ${a.name}" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:var(--r-sm);" loading="lazy" />`).join("")}
          </div>
        </div>

        <div class="tab-panel" data-panel="reviews" style="display:none;">
          <p style="color:var(--ink-faint);font-size:.9rem;">Les avis détaillés arrivent avec la connexion à la base de données. En attendant, ${a.name} affiche une note moyenne de ${a.rating.toFixed(1)}/5 sur ${a.reviews} prestations.</p>
        </div>
      </div>

      <aside class="side-panel fade-in">
        <div class="side-block">
          <h2>Localisation</h2>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;">
            <p style="font-size:.85rem;color:var(--ink-soft);">${a.address}</p>
            <a href="#" class="icon-btn" style="border:1px solid var(--border);flex-shrink:0;" aria-label="Voir l'itinéraire">${icon("navigate", 18)}</a>
          </div>
        </div>

        <div class="side-block">
          <h2>Horaires d'ouverture</h2>
          ${hoursHTML(a)}
        </div>

        <div class="side-block">
          <h2>Moyens de paiement</h2>
          <div class="payment-chips">
            ${a.paymentMethods.map((p) => `<span class="payment-chip">${p}</span>`).join("")}
          </div>
        </div>

        <div class="side-block">
          <h2>Contact</h2>
          <div class="contact-row">
            <div class="contact-left">
              <span class="contact-icon">${icon("phone", 17)}</span>
              <p>${a.phone}</p>
            </div>
            ${icon("chat", 18)}
          </div>
        </div>
      </aside>
    </div>
  `;

  container.querySelectorAll(".tab-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      container
        .querySelectorAll(".tab-button")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      container.querySelectorAll(".tab-panel").forEach((p) => {
        p.style.display = p.dataset.panel === btn.dataset.tab ? "" : "none";
      });
    });
  });
}

console.log("🛠️ ArtisanConnect chargé");

/* ============================================================
   15. HELPERS PARTAGÉS
   ============================================================ */
function getArtisanById(id) {
  return artisansData.find((a) => a.id === Number(id));
}

function formatDateFrLong(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/* ============================================================
   16. RECHERCHE AVANCÉE (search.html)
   ============================================================ */
function initAdvancedSearch() {
  const grid = document.getElementById("searchResultsGrid");
  if (!grid) return;

  const catsEl = document.getElementById("filterCategories");
  const citiesEl = document.getElementById("filterCities");
  const ratingEl = document.getElementById("filterRating");
  const priceInput = document.getElementById("filterPrice");
  const priceValue = document.getElementById("filterPriceValue");
  const availToday = document.getElementById("filterAvailableToday");
  const searchInput = document.getElementById("advancedSearchInput");
  const sortSelect = document.getElementById("sortSelect");
  const resultCount = document.getElementById("searchResultCount");
  const emptyState = document.getElementById("searchEmptyState");
  const filterPanel = document.getElementById("filterPanel");

  const state = {
    categories: new Set(),
    cities: new Set(),
    minRating: 0,
    maxPrice: 65000,
    availableToday: false,
    query: "",
    sort: "pertinence",
  };

  const params = new URLSearchParams(window.location.search);
  if (params.get("q")) {
    state.query = params.get("q");
    if (searchInput) searchInput.value = state.query;
  }

  // --- Catégories ---
  catsEl.innerHTML = CATEGORIES.map(
    (c) => `
      <label class="filter-check">
        <input type="checkbox" value="${c.slug}" data-filter="category" />
        ${c.label}
      </label>`,
  ).join("");

  // --- Villes ---
  const cities = [...new Set(artisansData.map((a) => a.city))].sort();
  citiesEl.innerHTML = cities
    .map(
      (city) => `
      <label class="filter-check">
        <input type="checkbox" value="${city}" data-filter="city" />
        ${city}
      </label>`,
    )
    .join("");

  // --- Note minimale ---
  const ratingOptions = [
    { label: "Toutes les notes", value: 0 },
    { label: "4.0 et plus", value: 4 },
    { label: "4.5 et plus", value: 4.5 },
  ];
  ratingEl.innerHTML = ratingOptions
    .map(
      (opt, i) => `
      <label class="filter-check">
        <input type="radio" name="ratingFilter" value="${opt.value}" data-filter="rating" ${i === 0 ? "checked" : ""} />
        ${opt.label}
      </label>`,
    )
    .join("");

  function applyFilters() {
    let results = artisansData.filter((a) => {
      if (state.categories.size && !state.categories.has(a.categorySlug))
        return false;
      if (state.cities.size && !state.cities.has(a.city)) return false;
      if (a.rating < state.minRating) return false;
      if (a.priceFrom > state.maxPrice) return false;
      if (state.availableToday && !a.availableToday) return false;
      if (state.query) {
        const q = state.query.toLowerCase();
        const haystack =
          `${a.name} ${a.category} ${a.city} ${a.ownerName}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    if (state.sort === "rating") results.sort((a, b) => b.rating - a.rating);
    else if (state.sort === "price-asc")
      results.sort((a, b) => a.priceFrom - b.priceFrom);
    else if (state.sort === "distance")
      results.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    renderResults(results);
  }

  function renderResults(results) {
    resultCount.textContent = results.length;
    if (!results.length) {
      grid.innerHTML = "";
      grid.style.display = "none";
      emptyState.style.display = "flex";
      return;
    }
    grid.style.display = "";
    emptyState.style.display = "none";
    grid.innerHTML = results.map(artisanCardHTML).join("");
  }

  catsEl.addEventListener("change", (e) => {
    if (e.target.dataset.filter !== "category") return;
    e.target.checked
      ? state.categories.add(e.target.value)
      : state.categories.delete(e.target.value);
    applyFilters();
  });

  citiesEl.addEventListener("change", (e) => {
    if (e.target.dataset.filter !== "city") return;
    e.target.checked
      ? state.cities.add(e.target.value)
      : state.cities.delete(e.target.value);
    applyFilters();
  });

  ratingEl.addEventListener("change", (e) => {
    if (e.target.dataset.filter !== "rating") return;
    state.minRating = Number(e.target.value);
    applyFilters();
  });

  priceInput.addEventListener("input", (e) => {
    state.maxPrice = Number(e.target.value);
    priceValue.textContent = `${state.maxPrice.toLocaleString("fr-FR")} FCFA`;
    applyFilters();
  });

  availToday.addEventListener("change", (e) => {
    state.availableToday = e.target.checked;
    applyFilters();
  });

  searchInput?.addEventListener("input", (e) => {
    state.query = e.target.value.trim();
    applyFilters();
  });

  sortSelect.addEventListener("change", (e) => {
    state.sort = e.target.value;
    applyFilters();
  });

  function resetFilters() {
    state.categories.clear();
    state.cities.clear();
    state.minRating = 0;
    state.maxPrice = 65000;
    state.availableToday = false;
    state.query = "";
    state.sort = "pertinence";

    catsEl.querySelectorAll("input").forEach((i) => (i.checked = false));
    citiesEl.querySelectorAll("input").forEach((i) => (i.checked = false));
    ratingEl.querySelectorAll("input")[0].checked = true;
    priceInput.value = 65000;
    priceValue.textContent = "65 000 FCFA";
    availToday.checked = false;
    if (searchInput) searchInput.value = "";
    sortSelect.value = "pertinence";

    applyFilters();
  }

  document
    .getElementById("filterReset")
    .addEventListener("click", resetFilters);
  document
    .getElementById("searchEmptyReset")
    ?.addEventListener("click", resetFilters);

  document
    .getElementById("mobileFilterToggle")
    ?.addEventListener("click", () => {
      filterPanel.classList.toggle("mobile-open");
    });

  applyFilters();
}

/* ============================================================
   17. PAGE FAVORIS
   ============================================================ */
function renderFavoritesPage() {
  const grid = document.getElementById("favoritesGrid");
  const empty = document.getElementById("favoritesEmptyState");
  const subtitle = document.getElementById("favoritesSubtitle");
  if (!grid) return;

  const ids = getFavorites();
  const favArtisans = artisansData.filter((a) => ids.includes(a.id));

  if (!favArtisans.length) {
    grid.style.display = "none";
    grid.innerHTML = "";
    empty.style.display = "flex";
    if (subtitle) subtitle.textContent = "Vous n'avez pas encore de favoris.";
    return;
  }

  grid.style.display = "";
  empty.style.display = "none";
  if (subtitle) {
    subtitle.textContent = `${favArtisans.length} artisan${favArtisans.length > 1 ? "s" : ""} enregistré${favArtisans.length > 1 ? "s" : ""}`;
  }
  grid.innerHTML = favArtisans.map(artisanCardHTML).join("");
}

/* ============================================================
   18. PAGE RENDEZ-VOUS
   ============================================================ */
function apptCardHTML(appt) {
  const a = getArtisanById(appt.artisanId);
  if (!a) return "";
  const statusMeta = {
    upcoming: ["À venir", "upcoming"],
    done: ["Terminé", "done"],
    cancelled: ["Annulé", "cancelled"],
  };
  const [label, cls] = statusMeta[appt.status];
  const dateLabel = formatDateFrLong(appt.date);

  let actions = "";
  if (appt.status === "upcoming") {
    actions = `
      <button type="button" class="btn btn-outline" style="padding:.5rem 1rem;font-size:.8rem;" data-appt-modify="${appt.id}">Modifier</button>
      <button type="button" class="btn btn-ghost" style="padding:.5rem 1rem;font-size:.8rem;" data-appt-cancel="${appt.id}">Annuler</button>`;
  } else if (appt.status === "done") {
    actions = `<a href="artisan-detail.html?id=${a.id}" class="btn btn-outline" style="padding:.5rem 1rem;font-size:.8rem;">Laisser un avis</a>`;
  } else {
    actions = `<a href="artisan-detail.html?id=${a.id}" class="btn btn-primary" style="padding:.5rem 1rem;font-size:.8rem;">Réserver à nouveau</a>`;
  }

  return `
    <div class="appt-card">
      <img src="${a.avatar}" alt="${a.name}" class="appt-avatar" />
      <div class="appt-info">
        <div class="appt-service">${appt.serviceName}</div>
        <div class="appt-artisan">${a.name} · ${a.city}</div>
        <div class="appt-datetime">${icon("clock", 14)} ${dateLabel} à ${appt.time} · <span class="mono-num">${appt.price.toLocaleString("fr-FR")} ${a.currency}</span></div>
      </div>
      <span class="appt-status ${cls}">${label}</span>
      <div class="appt-actions">${actions}</div>
    </div>
  `;
}

function initAppointmentsPage() {
  const list = document.getElementById("appointmentsList");
  if (!list) return;

  const tabs = document.querySelectorAll(".appt-tab");
  const empty = document.getElementById("appointmentsEmptyState");
  const emptyTitle = document.getElementById("appointmentsEmptyTitle");
  const emptyText = document.getElementById("appointmentsEmptyText");
  let currentStatus = "upcoming";

  const copy = {
    upcoming: [
      "Aucun rendez-vous à venir",
      "Réservez votre prochain artisan dès maintenant.",
    ],
    done: [
      "Aucun rendez-vous passé",
      "Votre historique de prestations apparaîtra ici.",
    ],
    cancelled: [
      "Aucun rendez-vous annulé",
      "Bonne nouvelle, vous n'avez rien annulé récemment.",
    ],
  };

  function render() {
    const items = appointmentsData
      .filter((a) => a.status === currentStatus)
      .sort((a, b) =>
        currentStatus === "upcoming"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date),
      );

    if (!items.length) {
      list.innerHTML = "";
      list.style.display = "none";
      empty.style.display = "flex";
      emptyTitle.textContent = copy[currentStatus][0];
      emptyText.textContent = copy[currentStatus][1];
      return;
    }

    list.style.display = "";
    empty.style.display = "none";
    list.innerHTML = items.map(apptCardHTML).join("");
  }

  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentStatus = tab.dataset.status;
      render();
    }),
  );

  document.addEventListener("click", (e) => {
    const cancelBtn = e.target.closest("[data-appt-cancel]");
    if (cancelBtn) {
      const appt = appointmentsData.find(
        (a) => a.id === Number(cancelBtn.dataset.apptCancel),
      );
      if (appt) {
        appt.status = "cancelled";
        showToast("Rendez-vous annulé.");
        render();
      }
      return;
    }
    const modifyBtn = e.target.closest("[data-appt-modify]");
    if (modifyBtn) {
      showToast("La modification de rendez-vous arrive bientôt.");
    }
  });

  render();
}

/* ============================================================
   19. MESSAGERIE
   ============================================================ */
function initMessagingPage() {
  const convListEl = document.getElementById("convList");
  const threadPanel = document.getElementById("threadPanel");
  if (!convListEl || !threadPanel) return;

  let activeConvId = conversationsData[0] ? conversationsData[0].id : null;

  function renderConvList() {
    convListEl.innerHTML = conversationsData
      .map((c) => {
        const a = getArtisanById(c.artisanId);
        const last = c.messages[c.messages.length - 1];
        return `
          <div class="conv-item ${c.id === activeConvId ? "active" : ""}" data-id="${c.id}">
            <img src="${a.avatar}" alt="${a.name}" class="conv-avatar" />
            <div class="conv-info">
              <div class="conv-name"><span>${a.name}</span><span class="conv-time">${last.time}</span></div>
              <div class="conv-preview">${last.from === "me" ? "Vous : " : ""}${last.text}</div>
            </div>
            ${c.unread ? '<span class="conv-unread"></span>' : ""}
          </div>`;
      })
      .join("");

    convListEl.querySelectorAll(".conv-item").forEach((item) => {
      item.addEventListener("click", () => {
        activeConvId = Number(item.dataset.id);
        const conv = conversationsData.find((c) => c.id === activeConvId);
        if (conv) conv.unread = false;
        renderConvList();
        renderThread();
        convListEl.classList.remove("mobile-visible");
        threadPanel.classList.remove("mobile-hidden");
      });
    });
  }

  function renderThread() {
    const conv = conversationsData.find((c) => c.id === activeConvId);
    if (!conv) {
      threadPanel.innerHTML = `<div class="empty-state" style="border:none;height:100%;justify-content:center;">Sélectionnez une conversation</div>`;
      return;
    }
    const a = getArtisanById(conv.artisanId);

    threadPanel.innerHTML = `
      <div class="thread-header">
        <button class="icon-btn thread-back" aria-label="Retour" id="threadBackBtn">${icon("chevronLeft", 18)}</button>
        <img src="${a.avatar}" alt="${a.name}" style="width:38px;height:38px;border-radius:999px;object-fit:cover;" />
        <div>
          <div style="font-weight:700;font-size:.88rem;">${a.name}</div>
          <div style="font-size:.75rem;color:var(--ink-faint);">${a.category} · ${a.city}</div>
        </div>
        <a href="artisan-detail.html?id=${a.id}" class="btn btn-outline" style="margin-left:auto;padding:.4rem .9rem;font-size:.78rem;">Voir le profil</a>
      </div>
      <div class="thread-messages" id="threadMessages">
        ${conv.messages
          .map(
            (m) => `
          <div class="bubble ${m.from === "me" ? "bubble-me" : "bubble-them"}">
            ${m.text}
            <span class="bubble-time">${m.time}</span>
          </div>`,
          )
          .join("")}
      </div>
      <div class="thread-composer">
        <input type="text" placeholder="Écrire un message…" id="threadInput" />
        <button class="thread-send" id="threadSendBtn" aria-label="Envoyer">${icon("send", 17)}</button>
      </div>
    `;

    document.getElementById("threadBackBtn")?.addEventListener("click", () => {
      convListEl.classList.add("mobile-visible");
      threadPanel.classList.add("mobile-hidden");
    });

    const msgsEl = document.getElementById("threadMessages");
    msgsEl.scrollTop = msgsEl.scrollHeight;

    function send() {
      const input = document.getElementById("threadInput");
      const text = input.value.trim();
      if (!text) return;
      conv.messages.push({ from: "me", text, time: "Maintenant" });
      input.value = "";
      renderThread();
      renderConvList();
    }

    document.getElementById("threadSendBtn").addEventListener("click", send);
    document.getElementById("threadInput").addEventListener("keydown", (e) => {
      if (e.key === "Enter") send();
    });
  }

  renderConvList();
  renderThread();
}

/* ============================================================
   20. ESPACE ARTISAN (dashboard.html)
   ============================================================ */
function statTileHTML(label, value, trend) {
  return `
    <div class="stat-tile">
      <div class="stat-tile-label">${label}</div>
      <div class="stat-tile-value mono-num">${value}</div>
      ${trend ? `<div class="stat-tile-trend">${icon("trendUp", 13)} ${trend}</div>` : ""}
    </div>`;
}

function dashReviewCardHTML(r) {
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

  return `
    <div class="dash-review-card">
      <div class="dash-review-top">
        <div class="dash-review-author">
          <img src="${r.avatar}" alt="${r.author}" />
          <div>
            <div class="dash-review-name">${r.author}</div>
            <div class="dash-review-date">${dateLabel}</div>
          </div>
        </div>
        <div class="dash-review-stars">${stars}</div>
      </div>
      <p class="dash-review-text">${r.comment}</p>
      <div class="dash-reply-box">
        ${
          r.reply
            ? `<div class="dash-reply-existing"><strong>Votre réponse</strong>${r.reply.text}</div>`
            : `<form class="dash-reply-form" data-review-id="${r.id}">
                <input type="text" placeholder="Répondre à cet avis…" required />
                <button type="submit" class="dash-reply-submit">Répondre</button>
              </form>`
        }
      </div>
    </div>`;
}

function initDashboard() {
  const artisan = getArtisanById(
    typeof CURRENT_ARTISAN_ID !== "undefined" ? CURRENT_ARTISAN_ID : 1,
  );
  const miniProfile = document.getElementById("dashProfileMini");
  if (!artisan || !miniProfile) return;

  miniProfile.innerHTML = `
    <img src="${artisan.avatar}" alt="${artisan.name}" />
    <div>
      <strong>${artisan.name}</strong>
      <span>${artisan.category} · ${artisan.city}</span>
    </div>`;

  // --- Navigation entre panneaux ---
  const navItems = document.querySelectorAll(".dash-nav-item");
  const panels = document.querySelectorAll(".dash-panel");
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      navItems.forEach((n) => n.classList.remove("active"));
      item.classList.add("active");
      panels.forEach((p) =>
        p.classList.toggle("active", p.dataset.panel === item.dataset.panel),
      );
    });
  });

  // --- Profil ---
  const catSelect = document.getElementById("pfCategory");
  if (catSelect) {
    catSelect.innerHTML = CATEGORIES.map(
      (c) =>
        `<option value="${c.slug}" ${c.slug === artisan.categorySlug ? "selected" : ""}>${c.label}</option>`,
    ).join("");
  }
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  };
  setVal("pfName", artisan.name);
  setVal("pfCity", artisan.city);
  setVal("pfPhone", artisan.phone);
  setVal("pfAddress", artisan.address);
  setVal("pfDesc", artisan.description);

  document
    .getElementById("dashProfileForm")
    ?.addEventListener("submit", (e) => {
      e.preventDefault();
      artisan.name = document.getElementById("pfName").value;
      artisan.city = document.getElementById("pfCity").value;
      artisan.phone = document.getElementById("pfPhone").value;
      artisan.address = document.getElementById("pfAddress").value;
      artisan.description = document.getElementById("pfDesc").value;
      miniProfile.querySelector("strong").textContent = artisan.name;
      showToast("Profil mis à jour.");
    });

  document.getElementById("pfCancel")?.addEventListener("click", () => {
    setVal("pfName", artisan.name);
    setVal("pfCity", artisan.city);
    setVal("pfPhone", artisan.phone);
    setVal("pfAddress", artisan.address);
    setVal("pfDesc", artisan.description);
    showToast("Modifications annulées.");
  });

  // --- Services ---
  const servicesList = document.getElementById("dashServicesList");
  function renderServices() {
    if (!servicesList) return;
    servicesList.innerHTML = artisan.services
      .map(
        (s) => `
        <div class="dash-service-row">
          <img src="${s.image}" alt="" style="width:44px;height:44px;border-radius:8px;object-fit:cover;flex-shrink:0;" />
          <div class="dash-service-info">
            <div class="dash-service-name">${s.name}</div>
            <div class="dash-service-price mono-num">${s.price ? s.price.toLocaleString("fr-FR") + " " + artisan.currency : "Gratuit"} · ${s.duration} min</div>
          </div>
          <div class="dash-service-actions">
            <button type="button" class="icon-btn-sm" aria-label="Modifier" data-edit-service="${s.id}">${icon("edit", 15)}</button>
            <button type="button" class="icon-btn-sm danger" aria-label="Supprimer" data-remove-service="${s.id}">${icon("trash", 15)}</button>
          </div>
        </div>`,
      )
      .join("");
  }
  renderServices();

  servicesList?.addEventListener("click", (e) => {
    const removeBtn = e.target.closest("[data-remove-service]");
    if (removeBtn) {
      const id = Number(removeBtn.dataset.removeService);
      artisan.services = artisan.services.filter((s) => s.id !== id);
      renderServices();
      showToast("Service supprimé.");
      return;
    }
    const editBtn = e.target.closest("[data-edit-service]");
    if (editBtn) {
      showToast(
        "L'édition détaillée arrive avec la connexion à la base de données.",
      );
    }
  });

  document.getElementById("dashAddService")?.addEventListener("click", () => {
    artisan.services.push({
      id: Date.now(),
      name: "Nouveau service",
      desc: "Décrivez votre prestation",
      price: 0,
      duration: 30,
      image: artisan.avatar,
    });
    renderServices();
    showToast("Service ajouté — modifiez-le pour compléter les informations.");
  });

  // --- Disponibilités ---
  const availGrid = document.getElementById("availGrid");
  if (availGrid) {
    availGrid.innerHTML = artisan.hours
      .map((h, i) => {
        const closed = h.time.toLowerCase().includes("ferm");
        const parts = closed ? ["09:00", "18:00"] : h.time.split(" - ");
        return `
          <div class="avail-day">
            <div class="avail-day-name">${h.day}</div>
            <div class="avail-toggle-row">
              <span style="font-size:.75rem;color:var(--ink-faint);" data-avail-label="${i}">${closed ? "Fermé" : "Ouvert"}</span>
              <label class="switch">
                <input type="checkbox" data-day-toggle="${i}" ${closed ? "" : "checked"} />
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

    availGrid.addEventListener("change", (e) => {
      const toggle = e.target.closest("[data-day-toggle]");
      if (!toggle) return;
      const label = availGrid.querySelector(
        `[data-avail-label="${toggle.dataset.dayToggle}"]`,
      );
      if (label) label.textContent = toggle.checked ? "Ouvert" : "Fermé";
    });
  }

  document.getElementById("availSave")?.addEventListener("click", () => {
    showToast("Disponibilités enregistrées.");
  });

  // --- Statistiques ---
  const statBento = document.getElementById("statBento");
  if (statBento) {
    statBento.innerHTML =
      statTileHTML("Réservations (30j)", "18", "+12% vs mois dernier") +
      statTileHTML("Taux de réponse", "96%", "+4 pts") +
      statTileHTML(
        "Note moyenne",
        artisan.rating.toFixed(1),
        `${artisan.reviews} avis au total`,
      ) +
      statTileHTML(
        "Revenu estimé",
        `${(artisan.priceFrom * 18).toLocaleString("fr-FR")} ${artisan.currency}`,
        "Basé sur les réservations du mois",
      );
  }

  const recentEl = document.getElementById("statRecentBookings");
  if (recentEl) {
    recentEl.innerHTML = appointmentsData
      .slice(0, 4)
      .map(
        (bk) => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:.6rem 0;border-bottom:1px solid var(--border);font-size:.85rem;">
          <span>${bk.serviceName}</span>
          <span class="mono-num" style="color:var(--ink-faint);">${new Date(bk.date + "T00:00:00").toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}</span>
        </div>`,
      )
      .join("");
  }

  // --- Avis ---
  const myReviews = reviewsData.filter((r) => r.artisanId === artisan.id);
  const reviewsEl = document.getElementById("dashReviewsList");
  function renderReviews() {
    if (!reviewsEl) return;
    reviewsEl.innerHTML = myReviews.length
      ? myReviews.map(dashReviewCardHTML).join("")
      : `<p style="color:var(--ink-faint);font-size:.88rem;">Aucun avis pour le moment.</p>`;

    reviewsEl.querySelectorAll(".dash-reply-form").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = form.querySelector("input");
        const text = input.value.trim();
        if (!text) return;
        const id = Number(form.dataset.reviewId);
        const review = myReviews.find((r) => r.id === id);
        if (review)
          review.reply = { text, date: new Date().toISOString().split("T")[0] };
        renderReviews();
        showToast("Réponse publiée.");
      });
    });
  }
  renderReviews();
}
