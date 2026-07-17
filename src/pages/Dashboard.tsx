// src/pages/Dashboard.tsx

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import { CATEGORIES } from "../lib/constants";
import type {
  Artisan,
  Service,
  ArtisanHours,
  Appointment,
  Review,
  Team,
  Payout,
} from "../lib/types";
import {
  Camera,
  Image,
  Star,
  Clock,
  Calendar,
  Home,
  Wrench,
  User,
  ChartLine,
  MessageCircle,
  CreditCard,
  Users,
  Wallet,
  Plus,
  Trash2,
  Edit3,
  Check,
} from "lucide-react";

type PanelKey =
  | "tableau"
  | "rendezvous"
  | "services"
  | "vitrine"
  | "dispo"
  | "stats"
  | "avis"
  | "messages"
  | "paiement"
  | "equipe"
  | "finances";

const NAV_ITEMS: {
  key: PanelKey;
  label: string;
  icon: React.FC<{ size?: number }>;
}[] = [
  { key: "tableau", label: "Tableau de bord", icon: Home },
  { key: "rendezvous", label: "Rendez-vous", icon: Calendar },
  { key: "services", label: "Services", icon: Wrench },
  { key: "vitrine", label: "Votre vitrine", icon: User },
  { key: "dispo", label: "Disponibilités", icon: Clock },
  { key: "stats", label: "Statistiques", icon: ChartLine },
  { key: "avis", label: "Avis", icon: Star },
  { key: "messages", label: "Messages", icon: MessageCircle },
  { key: "paiement", label: "Paiement", icon: CreditCard },
];

const COMPLETE_NAV: typeof NAV_ITEMS = [
  ...NAV_ITEMS,
  { key: "equipe", label: "Équipe", icon: Users },
  { key: "finances", label: "Finances", icon: Wallet },
];

const DAYS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [hours, setHours] = useState<ArtisanHours[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [team, setTeam] = useState<Team | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [activePanel, setActivePanel] = useState<PanelKey>("tableau");
  const [loading, setLoading] = useState(true);
  const [isTeam, setIsTeam] = useState(false);
  const [onlinePayment, setOnlinePayment] = useState(false);
  const [depositPercent, setDepositPercent] = useState(10);
  const [editServiceId, setEditServiceId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: 0,
    duration: 30,
  });
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // ---- Load all data ----
  const loadAll = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    const { data: art } = await supabase
      .from("artisans")
      .select("*")
      .eq("owner_id", user.id)
      .maybeSingle();
    if (!art) {
      setLoading(false);
      return;
    }
    setArtisan(art as Artisan);
    setIsTeam(art.is_team);
    setPhotoUrl(art.avatar_url || null);

    const [svc, hrs, appts, revs, tm, paySet] = await Promise.all([
      supabase
        .from("services")
        .select("*")
        .eq("artisan_id", art.id)
        .order("id"),
      supabase
        .from("artisan_hours")
        .select("*")
        .eq("artisan_id", art.id)
        .order("day_index"),
      supabase
        .from("appointments")
        .select("*")
        .eq("artisan_id", art.id)
        .order("appointment_date", { ascending: true }),
      supabase
        .from("reviews")
        .select("*")
        .eq("artisan_id", art.id)
        .order("created_at", { ascending: false }),
      art.is_team
        ? supabase
            .from("teams")
            .select("*, team_members(*)")
            .eq("artisan_id", art.id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
      supabase
        .from("payment_settings")
        .select("*")
        .eq("artisan_id", art.id)
        .maybeSingle(),
    ]);

    setServices((svc.data || []) as Service[]);
    setHours((hrs.data || []) as ArtisanHours[]);
    setAppointments((appts.data || []) as Appointment[]);
    setReviews((revs.data || []) as Review[]);
    if (tm.data) setTeam(tm.data as unknown as Team);
    if (paySet.data) {
      setOnlinePayment(paySet.data.online_payment);
      setDepositPercent(paySet.data.deposit_percent);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    if (activePanel === "finances" && artisan) {
      supabase
        .from("payouts")
        .select("*")
        .eq("artisan_id", artisan.id)
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) setPayouts(data as Payout[]);
        });
    }
  }, [activePanel, artisan]);

  // ---- Services CRUD ----
  async function addService() {
    if (!artisan) return;
    const { data } = await supabase
      .from("services")
      .insert({
        artisan_id: artisan.id,
        name: "Nouveau service",
        price: 0,
        duration_min: 30,
        is_active: true,
      })
      .select();
    if (data) setServices((prev) => [...prev, data[0] as Service]);
  }
  async function updateService(s: Service) {
    await supabase
      .from("services")
      .update({
        name: s.name,
        price: s.price,
        duration_min: s.duration_min,
        is_active: s.is_active,
      })
      .eq("id", s.id);
    setServices((prev) => prev.map((sv) => (sv.id === s.id ? { ...s } : sv)));
    setEditServiceId(null);
  }
  async function deleteService(id: number) {
    await supabase.from("services").delete().eq("id", id);
    setServices((prev) => prev.filter((s) => s.id !== id));
  }

  // ---- Hours ----
  async function saveHours(newHours: ArtisanHours[]) {
    if (!artisan) return;
    const rows = newHours.map((h) => ({ ...h, artisan_id: artisan.id }));
    await supabase
      .from("artisan_hours")
      .upsert(rows, { onConflict: "artisan_id,day_index" });
    setHours(newHours);
  }

  // ---- Vitrine ----
  async function saveVitrine(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!artisan) return;
    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name") as string,
      city: form.get("city") as string,
      phone: form.get("phone") as string,
      address: form.get("address") as string,
      description: form.get("description") as string,
    };
    await supabase.from("artisans").update(data).eq("id", artisan.id);
    setArtisan((prev) => (prev ? { ...prev, ...data } : null));
  }
  async function uploadPhoto(file: File) {
    if (!artisan) return;
    const path = `${artisan.id}/avatar.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage
      .from("artisan-avatars")
      .upload(path, file, { upsert: true });
    if (!error) {
      const { data: urlData } = supabase.storage
        .from("artisan-avatars")
        .getPublicUrl(path);
      const url = urlData.publicUrl;
      await supabase
        .from("artisans")
        .update({ avatar_url: url })
        .eq("id", artisan.id);
      setPhotoUrl(url);
      setArtisan((prev) => (prev ? { ...prev, avatar_url: url } : null));
    }
  }

  // ---- Payment ----
  async function togglePayment(v: boolean) {
    if (!artisan) return;
    setOnlinePayment(v);
    await supabase.from("payment_settings").upsert(
      {
        artisan_id: artisan.id,
        online_payment: v,
        deposit_percent: depositPercent,
      },
      { onConflict: "artisan_id" },
    );
  }

  // ---- Render helpers ----
  const todayCount = appointments.filter(
    (a) =>
      a.appointment_date === new Date().toISOString().split("T")[0] &&
      a.status === "upcoming",
  ).length;
  const upcomingAppts = appointments
    .filter((a) => a.status === "upcoming")
    .sort(
      (a, b) =>
        new Date(a.appointment_date).getTime() -
        new Date(b.appointment_date).getTime(),
    );
  const nextAppt = upcomingAppts[0];

  if (loading)
    return (
      <div className="py-24 text-center text-ink-faint animate-pulse">
        Chargement de votre espace artisan…
      </div>
    );
  if (!artisan)
    return (
      <div className="max-w-4xl mx-auto py-24 text-center animate-fade-in-up">
        <div className="w-16 h-16 rounded-full bg-accent-soft text-accent flex items-center justify-center mx-auto mb-6">
          <Wrench size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-ink">
          Aucun profil artisan trouvé
        </h2>
        <p className="text-sm text-ink-soft mb-6 max-w-sm mx-auto leading-relaxed">
          Complétez votre inscription pour créer votre espace professionnel et
          commencer à recevoir des clients.
        </p>
        <button
          onClick={() => navigate("/onboarding")}
          className="btn btn-primary px-8"
        >
          Créer mon espace
        </button>
      </div>
    );

  const navItems = isTeam ? COMPLETE_NAV : NAV_ITEMS;

  // ---- PANELS ----

  function renderPanel() {
    switch (activePanel) {
      case "tableau":
        return (
          <div>
            {/* Salutation */}
            <div className="mb-6">
              <p className="text-[1.15rem] font-bold text-(--ink)">
                Bonjour {artisan?.name?.split(" ")[0] || "Artisan"} 👋
              </p>
              <span className="text-sm text-(--ink-faint) block mt-1">
                Voici un résumé de votre activité.
              </span>
            </div>

            {/* Cartes statistiques */}
            <div className="tdb-grid">
              <div className="tdb-card">
                <div className="tdb-card-icon">{<Calendar size={18} />}</div>
                <div className="tdb-card-label">Aujourd'hui</div>
                <div className="tdb-card-value mono-num">{todayCount}</div>
                <div className="tdb-card-sub">rendez-vous prévus</div>
              </div>
              <div className="tdb-card">
                <div className="tdb-card-icon">{<ChartLine size={18} />}</div>
                <div className="tdb-card-label">Cette semaine</div>
                <div className="tdb-card-value mono-num">
                  {appointments.filter((a) => a.status === "upcoming").length}
                </div>
                <div className="tdb-card-sub">rendez-vous à venir</div>
              </div>
              <div className="tdb-card">
                <div className="tdb-card-icon">{<Clock size={18} />}</div>
                <div className="tdb-card-label">Prochain créneau</div>
                <div className="tdb-card-value" style={{ fontSize: "1.05rem" }}>
                  {nextAppt
                    ? `${nextAppt.appointment_time?.slice(0, 5)}`
                    : "Aucun"}
                </div>
                <div className="tdb-card-sub">
                  {nextAppt?.service_name || "Rien de prévu pour l'instant"}
                </div>
              </div>
              <div className="tdb-card">
                <div className="tdb-card-icon">{<CreditCard size={18} />}</div>
                <div className="tdb-card-label">Recettes du mois</div>
                <div className="tdb-card-value mono-num">0</div>
                <div className="tdb-card-sub">Gourdes</div>
              </div>
            </div>

            {/* Alertes ou message calme */}
            {upcomingAppts.length === 0 ? (
              <div className="tdb-empty-hint">
                Tout est calme pour le moment — aucune alerte à traiter.
                Continuez comme ça ! ✨
              </div>
            ) : (
              <div className="bg-(--bg-elevated) border border-(--border) rounded-(--r-card) p-5 mt-6">
                <p className="tdb-section-title">Prochains rendez-vous</p>
                <div className="divide-y divide-(--border)/60">
                  {upcomingAppts.slice(0, 5).map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between py-3 text-sm"
                    >
                      <span className="font-semibold text-(--ink)">
                        {a.service_name}
                      </span>
                      <span className="mono-num text-xs text-(--ink-faint) bg-(--bg-sunken) px-2.5 py-1 rounded-lg">
                        {a.appointment_date} · {a.appointment_time?.slice(0, 5)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "rendezvous":
        return (
          <div>
            <div className="dash-panel-header">
              <div>
                <h2>Rendez-vous</h2>
                <p>Suivez et gérez vos réservations.</p>
              </div>
            </div>
            <div className="appt-tabs mb-6">
              {(["upcoming", "done", "cancelled"] as const).map((status) => (
                <button
                  key={status}
                  className={`appt-tab ${activePanel === "rendezvous" ? "active" : ""}`}
                  onClick={() => {
                    // Filtrage visuel si nécessaire
                  }}
                >
                  {status === "upcoming"
                    ? "À venir"
                    : status === "done"
                      ? "Passés"
                      : "Annulés"}
                </button>
              ))}
            </div>
            {appointments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">{<Calendar size={26} />}</div>
                <h3>Aucun rendez-vous</h3>
                <p>Vos prochaines réservations apparaîtront ici.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((a) => (
                  <div key={a.id} className="appt-card">
                    <div
                      className="appt-avatar"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "var(--accent-soft)",
                        color: "var(--accent-strong)",
                        width: 44,
                        height: 44,
                        borderRadius: 8,
                      }}
                    >
                      {<Calendar size={20} />}
                    </div>
                    <div className="appt-info">
                      <div className="appt-service">{a.service_name}</div>
                      <div className="appt-artisan">
                        {new Date(a.appointment_date).toLocaleDateString(
                          "fr-FR",
                          { weekday: "short", day: "numeric", month: "short" },
                        )}{" "}
                        à {a.appointment_time?.slice(0, 5)} ·{" "}
                        <span className="mono-num">
                          {a.price.toLocaleString("fr-FR")} Gourdes
                        </span>
                      </div>
                    </div>
                    <span
                      className={`appt-status ${a.status === "upcoming" ? "upcoming" : a.status === "done" ? "done" : "cancelled"}`}
                    >
                      {a.status === "upcoming"
                        ? "À venir"
                        : a.status === "done"
                          ? "Terminé"
                          : "Annulé"}
                    </span>
                    {a.status === "upcoming" && (
                      <div className="appt-actions">
                        <button
                          onClick={async () => {
                            await supabase
                              .from("appointments")
                              .update({ status: "cancelled" })
                              .eq("id", a.id);
                            setAppointments((prev) =>
                              prev.map((apt) =>
                                apt.id === a.id
                                  ? { ...apt, status: "cancelled" }
                                  : apt,
                              ),
                            );
                          }}
                          className="btn btn-ghost"
                          style={{ padding: ".5rem 1rem", fontSize: ".8rem" }}
                        >
                          Annuler
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "services":
        return (
          <div>
            <div className="dash-panel-header">
              <div>
                <h2>Services</h2>
                <p>Ajoutez, modifiez ou activez vos prestations.</p>
              </div>
            </div>
            {services.length === 0 ? (
              <div className="empty-illustrated">
                <div className="empty-illustrated-emoji">🛠️</div>
                <h3>Aucun service pour le moment</h3>
                <p>
                  Ajoutez votre première prestation pour que les clients
                  puissent vous réserver en ligne.
                </p>
                <button onClick={addService} className="btn btn-primary mt-4">
                  Ajouter un service
                </button>
              </div>
            ) : (
              <>
                <div id="dashServicesList" className="space-y-2 mb-4">
                  {services.map((s) => (
                    <div
                      key={s.id}
                      className={`dash-service-row ${s.is_active ? "" : "inactive"}`}
                    >
                      <img
                        src={s.image_url ?? ""}
                        alt=""
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 8,
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                      <div className="dash-service-info">
                        <div className="dash-service-name">
                          {s.name}
                          {!s.is_active && (
                            <span
                              style={{
                                color: "var(--ink-faint)",
                                fontWeight: 500,
                                fontSize: ".76rem",
                              }}
                            >
                              {" "}
                              (désactivé)
                            </span>
                          )}
                        </div>
                        <div className="dash-service-price mono-num">
                          {s.price
                            ? s.price.toLocaleString("fr-FR") + " Gourdes"
                            : "Gratuit"}{" "}
                          · {s.duration_min} min
                        </div>
                      </div>
                      <div className="dash-service-actions">
                        <label className="switch" title="Activer/Désactiver">
                          <input
                            type="checkbox"
                            checked={s.is_active}
                            onChange={async () => {
                              const updated = {
                                ...s,
                                is_active: !s.is_active,
                              };
                              await supabase
                                .from("services")
                                .update({ is_active: updated.is_active })
                                .eq("id", s.id);
                              setServices((prev) =>
                                prev.map((sv) =>
                                  sv.id === s.id ? updated : sv,
                                ),
                              );
                            }}
                          />
                          <span className="switch-track" />
                        </label>
                        <button
                          type="button"
                          className="icon-btn-sm"
                          onClick={() => {
                            setEditServiceId(s.id);
                            setEditForm({
                              name: s.name,
                              price: s.price,
                              duration: s.duration_min,
                            });
                          }}
                        >
                          {<Edit3 size={15} />}
                        </button>
                        <button
                          type="button"
                          className="icon-btn-sm danger"
                          onClick={() => deleteService(s.id)}
                        >
                          {<Trash2 size={15} />}
                        </button>
                      </div>
                      {editServiceId === s.id && (
                        <form
                          className="dash-service-edit-form"
                          onSubmit={(e) => {
                            e.preventDefault();
                            updateService({
                              ...s,
                              name: editForm.name,
                              price: editForm.price,
                              duration_min: editForm.duration,
                            });
                          }}
                        >
                          <input
                            type="text"
                            name="name"
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                name: e.target.value,
                              })
                            }
                            placeholder="Nom du service"
                            required
                          />
                          <input
                            type="number"
                            name="price"
                            value={editForm.price}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                price: Number(e.target.value),
                              })
                            }
                            placeholder="Prix (Gourdes)"
                            min={0}
                            step={500}
                            required
                          />
                          <input
                            type="number"
                            name="duration"
                            value={editForm.duration}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                duration: Number(e.target.value),
                              })
                            }
                            placeholder="Durée (min)"
                            min={5}
                            step={5}
                            required
                          />
                          <div className="dash-service-edit-actions">
                            <button
                              type="button"
                              className="btn btn-ghost"
                              style={{
                                padding: ".5rem 1rem",
                                fontSize: ".8rem",
                              }}
                              onClick={() => setEditServiceId(null)}
                            >
                              Annuler
                            </button>
                            <button
                              type="submit"
                              className="btn btn-primary"
                              style={{
                                padding: ".5rem 1rem",
                                fontSize: ".8rem",
                              }}
                            >
                              Enregistrer
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="dash-add-service"
                  onClick={addService}
                >
                  {<Plus size={16} />} Ajouter un service
                </button>
              </>
            )}
          </div>
        );

      case "vitrine":
        return (
          <div>
            <div className="dash-panel-header">
              <div>
                <h2>Votre vitrine</h2>
                <p>
                  C'est ce que les clients voient en premier sur ArtisanConnect.
                </p>
              </div>
            </div>
            <div className="vitrine-badges">
              <span className="badge-pill">{<Check size={14} />} Vérifié</span>
              <span className="badge-pill">{<Check size={14} />} Réactif</span>
            </div>
            <div className="vitrine-photo-block">
              <div className="vitrine-photo-row">
                <div
                  className="vitrine-photo-zone"
                  onDrop={(e) => {
                    e.preventDefault();
                    const f = e.dataTransfer.files[0];
                    if (f) uploadPhoto(f);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {photoUrl ? (
                    <img src={photoUrl} alt="" />
                  ) : (
                    <Camera size={24} className="text-(--ink-faint)" />
                  )}
                </div>
                <div className="vitrine-photo-actions">
                  <label className="vitrine-photo-btn">
                    {<Camera size={19} />} Prendre une photo
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) uploadPhoto(f);
                      }}
                    />
                  </label>
                  <label className="vitrine-photo-btn">
                    {<Image size={19} />} Choisir dans la galerie
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) uploadPhoto(f);
                      }}
                    />
                  </label>
                  <p className="vitrine-photo-hint">
                    Vous pouvez aussi glisser une image ou la coller directement
                    dans le cadre.
                  </p>
                </div>
              </div>
            </div>
            <form className="dash-form-grid" onSubmit={saveVitrine}>
              <div className="dash-field">
                <label htmlFor="vName">Nom de l'activité</label>
                <input
                  type="text"
                  id="vName"
                  name="name"
                  defaultValue={artisan?.name}
                  placeholder="Ex. Koffi Atelier Bois"
                />
              </div>
              <div className="dash-field">
                <label htmlFor="vCategory">Métier</label>
                <select
                  id="vCategory"
                  name="category"
                  defaultValue={
                    CATEGORIES.find((c) => c.id === artisan?.category_id)
                      ?.slug || ""
                  }
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="dash-field">
                <label htmlFor="vCity">Ville</label>
                <input
                  type="text"
                  id="vCity"
                  name="city"
                  defaultValue={artisan?.city}
                  placeholder="Ville où vous travaillez"
                />
              </div>
              <div className="dash-field">
                <label htmlFor="vPhone">Téléphone</label>
                <input
                  type="tel"
                  id="vPhone"
                  name="phone"
                  defaultValue={artisan?.phone ?? ""}
                  placeholder="+225 07 00 00 00 00"
                />
              </div>
              <div className="dash-field span-2">
                <label htmlFor="vAddress">Adresse</label>
                <input
                  type="text"
                  id="vAddress"
                  name="address"
                  defaultValue={artisan?.address ?? ""}
                  placeholder="Quartier, rue, ville…"
                />
              </div>
              <div className="dash-field span-2">
                <label htmlFor="vDesc">Description</label>
                <textarea
                  id="vDesc"
                  name="description"
                  defaultValue={artisan?.description ?? ""}
                  placeholder="Décrivez votre activité, votre expérience, ce qui vous distingue…"
                />
              </div>
              <div className="dash-form-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => loadAll()}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        );

      case "dispo":
        return (
          <div>
            <div className="dash-panel-header">
              <div>
                <h2>Disponibilités</h2>
                <p>Définissez vos créneaux habituels.</p>
              </div>
            </div>
            {isTeam && (
              <div className="avail-note">
                {<User size={17} />} Ces créneaux s'appliquent à toute l'équipe.
                La gestion par professionnel arrive dans une prochaine mise à
                jour.
              </div>
            )}
            <div className="avail-grid" id="dashAvailGrid">
              {DAYS.map((day, i) => {
                const h = hours.find((h) => h.day_label === day) || {
                  is_open: false,
                  opens_at: "08:00",
                  closes_at: "18:00",
                };
                const closed = !h.is_open;
                const parts = closed
                  ? ["09:00", "18:00"]
                  : [
                      h.opens_at?.slice(0, 5) ?? "08:00",
                      h.closes_at?.slice(0, 5) ?? "18:00",
                    ];
                return (
                  <div key={day} className="avail-day">
                    <div className="avail-day-name">{day}</div>
                    <div className="avail-toggle-row">
                      <span
                        style={{
                          fontSize: ".75rem",
                          color: "var(--ink-faint)",
                        }}
                      >
                        {closed ? "Fermé" : "Ouvert"}
                      </span>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={!closed}
                          onChange={(e) => {
                            const updated = hours.map((hh) =>
                              hh.day_label === day
                                ? {
                                    ...hh,
                                    is_open: e.target.checked,
                                    opens_at: e.target.checked ? "08:00" : null,
                                    closes_at: e.target.checked
                                      ? "18:00"
                                      : null,
                                  }
                                : hh,
                            );
                            setHours(updated);
                          }}
                        />
                        <span className="switch-track" />
                      </label>
                    </div>
                    <div className="avail-times">
                      <input
                        type="time"
                        value={parts[0]}
                        disabled={closed}
                        onChange={(e) => {
                          const updated = hours.map((hh) =>
                            hh.day_label === day
                              ? {
                                  ...hh,
                                  opens_at: e.target.value + ":00",
                                }
                              : hh,
                          );
                          setHours(updated);
                        }}
                      />
                      <input
                        type="time"
                        value={parts[1]}
                        disabled={closed}
                        onChange={(e) => {
                          const updated = hours.map((hh) =>
                            hh.day_label === day
                              ? {
                                  ...hh,
                                  closes_at: e.target.value + ":00",
                                }
                              : hh,
                          );
                          setHours(updated);
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="dash-form-actions" style={{ paddingTop: "1.5rem" }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => saveHours(hours)}
              >
                Enregistrer les disponibilités
              </button>
            </div>
          </div>
        );

      case "stats":
        return (
          <div>
            <div className="dash-panel-header">
              <div>
                <h2>Statistiques</h2>
                <p>
                  Vue d'ensemble de votre activité sur les 30 derniers jours.
                </p>
              </div>
            </div>
            <div className="stat-bento" id="dashStatBento">
              <div className="stat-tile">
                <div className="stat-tile-label">Rendez-vous</div>
                <div className="stat-tile-value mono-num">
                  {appointments.filter((a) => a.status !== "cancelled").length}
                </div>
              </div>
              <div className="stat-tile">
                <div className="stat-tile-label">Taux de réponse</div>
                <div className="stat-tile-value mono-num">96%</div>
                <div className="stat-tile-trend">
                  {<ChartLine size={13} />} +4 pts
                </div>
              </div>
              <div className="stat-tile">
                <div className="stat-tile-label">Note moyenne</div>
                <div className="stat-tile-value mono-num">
                  {reviews.length
                    ? (
                        reviews.reduce((s, r) => s + r.rating, 0) /
                        reviews.length
                      ).toFixed(1)
                    : "—"}
                </div>
              </div>
              <div className="stat-tile">
                <div className="stat-tile-label">Recettes</div>
                <div className="stat-tile-value mono-num">0</div>
                <div className="stat-tile-sub">Gourdes</div>
              </div>
            </div>
          </div>
        );

      case "avis":
        return (
          <div>
            <div className="dash-panel-header">
              <div>
                <h2>Avis</h2>
                <p>Répondez à vos clients pour montrer votre sérieux.</p>
              </div>
            </div>
            {reviews.length === 0 ? (
              <div className="empty-illustrated">
                <div className="empty-illustrated-emoji">⭐</div>
                <h3>Aucun avis pour le moment</h3>
                <p>
                  Vos premiers avis clients apparaîtront ici après vos
                  prestations. Partagez votre vitrine pour en recevoir plus vite
                  !
                </p>
                <button
                  type="button"
                  className="btn btn-primary mt-4"
                  onClick={() => setActivePanel("vitrine")}
                >
                  Partager ma vitrine
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="dash-review-card">
                    <div className="dash-review-top">
                      <div className="dash-review-author">
                        <img
                          src={
                            "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop"
                          }
                          alt=""
                        />
                        <div>
                          <div className="dash-review-name">Client</div>
                          <div className="dash-review-date">
                            {new Date(r.created_at).toLocaleDateString(
                              "fr-FR",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="dash-review-stars">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            style={{
                              opacity: i < r.rating ? 1 : 0.25,
                            }}
                          >
                            {<Star size={14} />}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="dash-review-text">{r.comment || "—"}</p>
                    <div className="dash-reply-box">
                      {r.reply_text ? (
                        <div className="dash-reply-existing">
                          <strong>Votre réponse</strong>
                          {r.reply_text}
                        </div>
                      ) : (
                        <form
                          className="dash-reply-form"
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const input = (
                              e.target as HTMLFormElement
                            ).querySelector("input");
                            const text = input?.value.trim();
                            if (!text) return;
                            await supabase
                              .from("reviews")
                              .update({
                                reply_text: text,
                                reply_at: new Date().toISOString(),
                              })
                              .eq("id", r.id);
                            setReviews((prev) =>
                              prev.map((rv) =>
                                rv.id === r.id
                                  ? { ...rv, reply_text: text }
                                  : rv,
                              ),
                            );
                          }}
                        >
                          <input
                            type="text"
                            placeholder="Répondre à cet avis…"
                            required
                          />
                          <button type="submit" className="dash-reply-submit">
                            Répondre
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "messages":
        return (
          <div>
            <div className="dash-panel-header">
              <div>
                <h2>Messages</h2>
                <p>
                  Échangez avec vos clients avant et après leurs rendez-vous.
                </p>
              </div>
            </div>
            <div className="empty-illustrated">
              <div className="empty-illustrated-emoji">💬</div>
              <h3>Messagerie intégrée</h3>
              <p>
                La messagerie en temps réel sera disponible dans une prochaine
                mise à jour. Vous serez notifié dès qu'un client vous écrira.
              </p>
            </div>
          </div>
        );

      case "paiement":
        return (
          <div>
            <div className="dash-panel-header">
              <div>
                <h2>Paiement</h2>
                <p>
                  Choisissez si vos clients peuvent payer en ligne au moment de
                  la réservation.
                </p>
              </div>
            </div>
            <div className="pay-toggle-card">
              <div>
                <div className="pay-toggle-label">
                  Accepter les paiements en ligne
                </div>
                <div className="pay-toggle-sub">
                  {onlinePayment
                    ? "Activé — vos clients peuvent régler un acompte en ligne."
                    : "Désactivé — le paiement se fait uniquement sur place."}
                </div>
              </div>
              <label className="switch-lg">
                <input
                  type="checkbox"
                  checked={onlinePayment}
                  onChange={(e) => togglePayment(e.target.checked)}
                />
                <span className="switch-track" />
              </label>
            </div>
            {onlinePayment && (
              <div className="pay-options">
                <div className="pay-field">
                  <label htmlFor="payDeposit">
                    Pourcentage d'acompte demandé
                  </label>
                  <input
                    type="number"
                    id="payDeposit"
                    min={0}
                    max={100}
                    step={5}
                    value={depositPercent}
                    onChange={(e) => setDepositPercent(Number(e.target.value))}
                  />
                </div>
                <div className="pay-field">
                  <label>Méthodes de retrait</label>
                  <div className="pay-checkbox-list">
                    <label className="filter-check">
                      <input type="checkbox" defaultChecked /> Mobile Money
                    </label>
                    <label className="filter-check">
                      <input type="checkbox" /> Virement bancaire
                    </label>
                  </div>
                </div>
              </div>
            )}
            <div className="pay-future-teaser">
              {<Check size={26} />}
              <div>
                <h3>Formules d'abonnement</h3>
                <p>
                  Proposez bientôt des forfaits à vos clients fidèles (ex. 5
                  coupes par mois à tarif réduit).
                </p>
              </div>
              <span className="badge-pill muted">Bientôt disponible</span>
            </div>
          </div>
        );

      case "equipe":
        return isTeam && team ? (
          <div>
            <div className="dash-panel-header">
              <div>
                <h2>Équipe</h2>
                <p>
                  {team.name} · {team.team_members?.length} professionnel
                  {(team.team_members?.length ?? 0) > 1 ? "s" : ""}
                </p>
              </div>
              <button type="button" className="btn btn-primary">
                {<Plus size={16} />} Ajouter un professionnel
              </button>
            </div>
            <div className="team-grid">
              {team.team_members?.map((m: any) => (
                <div
                  key={m.id}
                  className={`team-member-card ${m.status === "en_pause" ? "en-pause" : ""}`}
                >
                  <div className="team-member-top">
                    <img
                      src={m.avatar_url || ""}
                      alt={m.name}
                      className="team-member-avatar"
                    />
                    <div>
                      <div className="team-member-name">{m.name}</div>
                      <div className="team-member-role">
                        {m.specialty || m.role}
                      </div>
                    </div>
                    <span className={`team-status-badge ${m.status}`}>
                      {m.status === "actif" ? "Actif" : "En pause"}
                    </span>
                  </div>
                  <div className="team-permissions">
                    <div className="team-perm-row">
                      <span className="team-perm-label">
                        Voir les statistiques
                      </span>
                      <label className="switch">
                        <input
                          type="checkbox"
                          defaultChecked={m.perm_view_stats}
                        />
                        <span className="switch-track" />
                      </label>
                    </div>
                    <div className="team-perm-row">
                      <span className="team-perm-label">
                        Modifier services et créneaux (avec validation)
                      </span>
                      <label className="switch">
                        <input
                          type="checkbox"
                          defaultChecked={m.perm_modify_services}
                        />
                        <span className="switch-track" />
                      </label>
                    </div>
                    <div className="team-perm-row">
                      <span className="team-perm-label">Répondre aux avis</span>
                      <label className="switch">
                        <input
                          type="checkbox"
                          defaultChecked={m.perm_reply_reviews}
                        />
                        <span className="switch-track" />
                      </label>
                    </div>
                  </div>
                  {m.role !== "responsable" && (
                    <div className="team-member-actions">
                      <button
                        type="button"
                        className="btn btn-ghost"
                        style={{
                          flex: 1,
                          fontSize: ".8rem",
                          padding: ".5rem",
                        }}
                      >
                        {m.status === "actif" ? "Mettre en pause" : "Réactiver"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        style={{
                          fontSize: ".8rem",
                          padding: ".5rem",
                          color: "var(--danger)",
                        }}
                      >
                        Retirer de l'équipe
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-illustrated">
            <div className="empty-illustrated-emoji">🔒</div>
            <h3>Accès réservé</h3>
            <p>Cette section est réservée au responsable de l'équipe.</p>
          </div>
        );

      case "finances":
        return (
          <div>
            <div className="dash-panel-header">
              <div>
                <h2>Finances</h2>
                <p>Gérez vos recettes et vos versements.</p>
              </div>
            </div>
            <div className="finance-bento">
              <div className="finance-tile accent">
                <div className="finance-tile-label">Solde global</div>
                <div className="finance-tile-value mono-num">0</div>
                <div className="finance-tile-sub">Gourdes disponibles</div>
              </div>
              <div className="finance-tile">
                <div className="finance-tile-label">Recettes du mois</div>
                <div className="finance-tile-value mono-num">0</div>
                <div className="finance-tile-sub">Gourdes</div>
              </div>
              <div className="finance-tile">
                <div className="finance-tile-label">Total dû à l'équipe</div>
                <div className="finance-tile-value mono-num">0</div>
                <div className="finance-tile-sub">Gourdes à verser</div>
              </div>
            </div>
            {payouts.length > 0 && (
              <div className="finance-table mt-6">
                {payouts.map((p) => (
                  <div key={p.id} className="finance-row">
                    <span className="finance-row-label">{p.label}</span>
                    <span className="finance-row-date">
                      {p.created_at
                        ? new Date(p.created_at).toLocaleDateString("fr-FR")
                        : "—"}
                    </span>
                    <span className="finance-row-amount positive">
                      +{p.amount.toLocaleString("fr-FR")} {p.currency}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="py-4 animate-fade-in-up">
      <div className="page-header">
        <h1 id="dashTitle">Espace artisan</h1>
        <p id="dashSubtitle">
          Gérez votre vitrine, vos services et vos disponibilités.
        </p>
      </div>

      <div className="dash-shell">
        <aside className="dash-sidebar">
          <div className="dash-profile-mini">
            {photoUrl ? (
              <img src={photoUrl} alt="" />
            ) : (
              <div className="w-10.5 h-10.5 rounded-(--r-sm) bg-(--bg-sunken) flex items-center justify-center">
                <User size={18} className="text-(--ink-faint)" />
              </div>
            )}
            <div>
              <strong>{artisan?.name}</strong>
              <span>
                {artisan?.city
                  ? `${CATEGORIES.find((c) => c.id === artisan.category_id)?.label || "Artisan"} · ${artisan.city}`
                  : "Complétez votre vitrine"}
              </span>
            </div>
          </div>
          <nav className="dash-nav">
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`dash-nav-item ${activePanel === item.key ? "active" : ""}`}
                onClick={() => setActivePanel(item.key)}
              >
                <item.icon size={18} /> {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div id="dashPanels">{renderPanel()}</div>
      </div>
    </div>
  );
}
