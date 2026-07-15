// src/pages/Dashboard.tsx

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
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
    if (!user) return;
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
    const [svc, hrs, appts, revs, tm, pays, paySet] = await Promise.all([
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
        .from("payouts")
        .select("*")
        .eq("artisan_id", art.id)
        .order("created_at", { ascending: false })
        .then(({ data, error }) => (error ? { data: [] } : { data })),
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
    setPayouts((pays.data || []) as Payout[]);
    if (paySet.data) {
      setOnlinePayment(paySet.data.online_payment);
      setDepositPercent(paySet.data.deposit_percent);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

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
        <h2 className="text-2xl font-bold mb-2 text-ink">Aucun profil artisan trouvé</h2>
        <p className="text-sm text-ink-soft mb-6 max-w-sm mx-auto leading-relaxed">
          Complétez votre inscription pour créer votre espace professionnel et commencer à recevoir des clients.
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                {
                  label: "Aujourd'hui",
                  value: String(todayCount),
                  sub: "rendez-vous",
                },
                {
                  label: "Cette semaine",
                  value: String(
                    appointments.filter((a) => a.status === "upcoming").length,
                  ),
                  sub: "à venir",
                },
                {
                  label: "Prochain créneau",
                  value: nextAppt
                    ? `${nextAppt.appointment_time?.slice(0, 5)}`
                    : "Aucun",
                  sub: nextAppt?.service_name || "",
                },
                { label: "Recettes du mois", value: "0 G", sub: "" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-bg-elevated border border-border rounded-2xl p-5 hover:border-border-strong hover:shadow-sm transition-all"
                >
                  <p className="text-[10px] text-ink-faint font-extrabold uppercase tracking-wider">
                    {s.label}
                  </p>
                  <p className="text-2xl font-bold font-mono mt-2 text-ink">{s.value}</p>
                  {s.sub && (
                    <p className="text-xs text-ink-soft mt-1">{s.sub}</p>
                  )}
                </div>
              ))}
            </div>
            {upcomingAppts.length > 0 && (
              <div className="bg-bg-elevated border border-border rounded-2xl p-5">
                <h3 className="font-bold text-ink mb-4">Prochains rendez-vous</h3>
                <div className="divide-y divide-border/60">
                  {upcomingAppts.slice(0, 5).map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between py-3 text-sm"
                    >
                      <span className="font-semibold text-ink">{a.service_name}</span>
                      <span className="font-mono text-xs text-ink-faint bg-bg-sunken px-2.5 py-1 rounded-lg">
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
            <h2 className="font-bold text-lg mb-4">Rendez-vous</h2>
            {appointments.length === 0 ? (
              <div className="text-center py-16 border border-dashed rounded-2xl">
                <p className="text-ink-faint">
                  Aucun rendez-vous pour le moment.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-4 p-4 border rounded-xl"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{a.service_name}</h3>
                      <p className="text-xs text-ink-faint">
                        {a.appointment_date} · {a.appointment_time?.slice(0, 5)}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${a.status === "upcoming" ? "bg-forest-soft text-forest border border-forest/10" : a.status === "done" ? "bg-bg-sunken text-ink-faint" : "bg-danger-soft text-danger border border-danger/10"}`}
                    >
                      {a.status === "upcoming"
                        ? "À venir"
                        : a.status === "done"
                          ? "Terminé"
                          : "Annulé"}
                    </span>
                    {a.status === "upcoming" && (
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
                        className="text-xs font-bold text-danger hover:bg-danger-soft px-3 py-1 rounded-full transition-colors"
                      >
                        Annuler
                      </button>
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Services</h2>
              <button onClick={addService} className="btn btn-primary text-sm">
                <Plus size={16} /> Ajouter
              </button>
            </div>
            {services.length === 0 ? (
              <div className="text-center py-16 border border-dashed rounded-2xl">
                <p className="text-ink-faint mb-4">
                  Aucun service pour le moment
                </p>
                <button onClick={addService} className="btn btn-primary">
                  Ajouter un service
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {services.map((s) => (
                  <div key={s.id} className="border rounded-xl p-4">
                    {editServiceId === s.id ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="p-2 rounded-lg border text-sm"
                        />
                        <input
                          type="number"
                          value={editForm.price}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              price: Number(e.target.value),
                            })
                          }
                          className="p-2 rounded-lg border text-sm"
                        />
                        <input
                          type="number"
                          value={editForm.duration}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              duration: Number(e.target.value),
                            })
                          }
                          className="p-2 rounded-lg border text-sm"
                        />
                        <div className="sm:col-span-3 flex gap-2 justify-end">
                          <button
                            onClick={() => setEditServiceId(null)}
                            className="btn btn-ghost text-sm"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={() =>
                              updateService({
                                ...s,
                                name: editForm.name,
                                price: editForm.price,
                                duration_min: editForm.duration,
                              })
                            }
                            className="btn btn-primary text-sm"
                          >
                            Enregistrer
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{s.name}</h3>
                          <p className="text-sm text-ink-faint">
                            {s.price?.toLocaleString("fr-FR")} Gourdes ·{" "}
                            {s.duration_min} min
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="switch">
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
                            onClick={() => {
                              setEditServiceId(s.id);
                              setEditForm({
                                name: s.name,
                                price: s.price,
                                duration: s.duration_min,
                              });
                            }}
                            className="p-2 rounded-full hover:bg-bg-sunken"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => deleteService(s.id)}
                            className="p-2 rounded-full hover:bg-red-50 text-red-500"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "vitrine":
        return (
          <div>
            <h2 className="font-bold text-lg mb-4">Votre vitrine</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {["Vérifié", "Réactif"].map((b) => (
                <span
                  key={b}
                  className="px-3 py-1 rounded-full bg-accent-soft text-accent-strong text-xs font-semibold flex items-center gap-1"
                >
                  <Check size={14} />
                  {b}
                </span>
              ))}
            </div>
            <div className="flex items-start gap-6 mb-6 p-4 border rounded-2xl flex-wrap">
              <div
                className="w-28 h-28 rounded-2xl border-2 border-dashed border-border-strong flex items-center justify-center overflow-hidden bg-bg-sunken"
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files[0];
                  if (f) uploadPhoto(f);
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera size={24} className="text-ink-faint" />
                )}
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer text-sm font-semibold hover:border-accent transition-colors">
                  <Camera size={19} /> Prendre une photo
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
                <label className="flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer text-sm font-semibold hover:border-accent transition-colors">
                  <Image size={19} /> Choisir dans la galerie
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
                <p className="text-xs text-ink-faint">
                  Glissez-déposez une image dans le cadre.
                </p>
              </div>
            </div>
            <form
              onSubmit={saveVitrine}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {["name", "city", "phone", "address"].map((f) => (
                <div key={f}>
                  <label className="block text-sm font-semibold mb-1 capitalize">
                    {f === "name"
                      ? "Nom de l'activité"
                      : f === "city"
                        ? "Ville"
                        : f === "phone"
                          ? "Téléphone"
                          : "Adresse"}
                  </label>
                  <input
                    name={f}
                    defaultValue={(artisan as any)?.[f] || ""}
                    className="w-full p-2.5 rounded-xl border text-sm"
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={artisan?.description || ""}
                  rows={3}
                  className="w-full p-2.5 rounded-xl border text-sm"
                />
              </div>
              <div className="sm:col-span-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => loadAll()}
                  className="btn btn-ghost"
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        );

      case "dispo":
        return (
          <div>
            <h2 className="font-bold text-lg mb-4">Disponibilités</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {DAYS.map((day) => {
                const h = hours.find((h) => h.day_label === day) || {
                  is_open: false,
                  opens_at: "08:00",
                  closes_at: "18:00",
                };
                return (
                  <div key={day} className="border rounded-xl p-3">
                    <p className="font-bold text-sm mb-2">{day}</p>
                    <label className="flex items-center gap-2 text-xs mb-2">
                      <input
                        type="checkbox"
                        checked={h.is_open}
                        onChange={(e) => {
                          const updated = hours.map((hh) =>
                            hh.day_label === day
                              ? { ...hh, is_open: e.target.checked }
                              : hh,
                          );
                          setHours(updated);
                        }}
                        className="accent-[var(--accent)]"
                      />{" "}
                      Ouvert
                    </label>
                    {h.is_open && (
                      <div className="grid grid-cols-2 gap-1">
                        <input
                          type="time"
                          value={h.opens_at?.slice(0, 5) || "08:00"}
                          onChange={(e) => {
                            const updated = hours.map((hh) =>
                              hh.day_label === day
                                ? { ...hh, opens_at: e.target.value + ":00" }
                                : hh,
                            );
                            setHours(updated);
                          }}
                          className="p-1 rounded border text-xs"
                        />
                        <input
                          type="time"
                          value={h.closes_at?.slice(0, 5) || "18:00"}
                          onChange={(e) => {
                            const updated = hours.map((hh) =>
                              hh.day_label === day
                                ? { ...hh, closes_at: e.target.value + ":00" }
                                : hh,
                            );
                            setHours(updated);
                          }}
                          className="p-1 rounded border text-xs"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => saveHours(hours)}
              className="btn btn-primary mt-6"
            >
              Enregistrer les disponibilités
            </button>
          </div>
        );

      case "stats":
        return (
          <div>
            <h2 className="font-bold text-lg mb-4">Statistiques</h2>
            <div className="text-center py-16 border border-dashed rounded-2xl text-ink-faint">
              Les statistiques détaillées seront disponibles prochainement.
            </div>
          </div>
        );

      case "avis":
        return (
          <div>
            <h2 className="font-bold text-lg mb-4">Avis</h2>
            {reviews.length === 0 ? (
              <div className="text-center py-16 border border-dashed rounded-2xl text-ink-faint">
                Aucun avis pour le moment.
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="border rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < r.rating ? "var(--color-star)" : "none"}
                            color="var(--color-star)"
                          />
                        ))}
                      </div>
                      <span className="text-sm text-ink-faint">
                        {new Date(r.created_at).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    <p className="text-sm">{r.comment || "—"}</p>
                    {!r.reply_text && (
                      <div className="mt-3 flex gap-2">
                        <input
                          id={`reply-${r.id}`}
                          placeholder="Répondre…"
                          className="flex-1 p-2 rounded-full border text-xs"
                        />
                        <button
                          onClick={async () => {
                            const el = document.getElementById(
                              `reply-${r.id}`,
                            ) as HTMLInputElement;
                            const text = el.value.trim();
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
                          className="px-3 py-1 rounded-full bg-accent text-white text-xs font-semibold"
                        >
                          Répondre
                        </button>
                      </div>
                    )}
                    {r.reply_text && (
                      <div className="mt-3 p-3 bg-bg-sunken rounded-xl text-sm">
                        <strong className="text-xs">Votre réponse</strong>
                        <p className="mt-1">{r.reply_text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "paiement":
        return (
          <div>
            <h2 className="font-bold text-lg mb-4">Paiement</h2>
            <div className="flex items-center justify-between p-4 border rounded-2xl mb-4">
              <div>
                <p className="font-semibold">Accepter les paiements en ligne</p>
                <p className="text-sm text-ink-faint">
                  {onlinePayment ? "Activé" : "Désactivé"}
                </p>
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
              <div className="p-4 border rounded-2xl space-y-3">
                <div>
                  <label className="text-sm font-semibold">
                    Pourcentage d'acompte
                  </label>
                  <input
                    type="number"
                    value={depositPercent}
                    onChange={(e) => setDepositPercent(Number(e.target.value))}
                    min={0}
                    max={100}
                    className="w-full p-2 rounded-xl border text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">
                    Méthodes de retrait
                  </label>
                  <div className="flex gap-2 mt-1">
                    {[
                      { label: "Mobile Money", checked: true },
                      { label: "Virement", checked: false },
                    ].map((m) => (
                      <label
                        key={m.label}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          defaultChecked={m.checked}
                          className="accent-accent"
                        />
                        {m.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "equipe":
        return isTeam && team ? (
          <div>
            <h2 className="font-bold text-lg mb-4">Équipe</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {team.team_members?.map((m: any) => (
                <div key={m.id} className="border rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={m.avatar_url || ""}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{m.name}</p>
                      <p className="text-xs text-ink-faint">
                        {m.specialty || m.role}
                      </p>
                    </div>
                    <span
                      className={`ml-auto text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${m.status === "actif" ? "bg-forest-soft text-forest border border-forest/10" : "bg-bg-sunken text-ink-faint"}`}
                    >
                      {m.status === "actif" ? "Actif" : "En pause"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed rounded-2xl text-ink-faint">
            Section réservée au responsable d'équipe.
          </div>
        );

      case "finances":
        return (
          <div>
            <h2 className="font-bold text-lg mb-4">Finances</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: "Solde global", value: "0 G" },
                { label: "Recettes du mois", value: "0 G" },
                { label: "Dû à l'équipe", value: "0 G" },
              ].map((s, i) => (
                <div key={i} className="border rounded-xl p-4">
                  <p className="text-xs text-ink-faint font-semibold">
                    {s.label}
                  </p>
                  <p className="text-xl font-bold font-mono mt-1">{s.value}</p>
                </div>
              ))}
            </div>
            {payouts.length > 0 && (
              <div className="space-y-2">
                {payouts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 border rounded-xl text-sm"
                  >
                    <span>{p.label}</span>
                    <span className="font-mono font-semibold">
                      {p.amount.toLocaleString("fr-FR")} {p.currency}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${p.status === "verse" ? "bg-forest-soft text-forest border border-forest/10" : "bg-ochre-soft text-ochre"}`}
                    >
                      {p.status === "verse" ? "Versé" : "En attente"}
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
    <div className="py-8 animate-fade-in-up">
      <div className="border-b border-border/40 pb-6 mt-2">
        <h1 className="text-3xl font-extrabold text-ink">Espace artisan</h1>
        <p className="text-sm text-ink-faint mt-1">
          Gérez votre vitrine, vos services et vos disponibilités.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 mt-8">
        <aside className="bg-bg-elevated border border-border rounded-3xl p-5 sticky top-24 self-start shadow-sm">
          <div className="flex items-center gap-3 pb-5 mb-5 border-b border-border/60">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt=""
                className="w-11 h-11 rounded-2xl object-cover border border-border"
              />
            ) : (
              <div className="w-11 h-11 rounded-2xl bg-[var(--bg-sunken)] border border-[var(--border)] flex items-center justify-center">
                <User size={18} className="text-[var(--ink-faint)]" />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-bold text-sm text-ink truncate">{artisan?.name}</p>
              <p className="text-xs text-ink-faint">{artisan?.city}</p>
            </div>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActivePanel(item.key)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${activePanel === item.key ? "bg-accent-soft text-accent-strong shadow-sm" : "text-ink-soft hover:bg-bg-sunken hover:text-ink"}`}
              >
                <item.icon size={18} /> {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="bg-bg-elevated border border-border rounded-3xl p-8 min-h-[500px] shadow-sm">
          {renderPanel()}
        </div>
      </div>
    </div>
  );
}
