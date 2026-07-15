// src/pages/Appointments.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import type { Appointment } from "../lib/types";

type Tab = "upcoming" | "done" | "cancelled";

const STATUS_LABELS: Record<Tab, { label: string; className: string }> = {
  upcoming: {
    label: "À venir",
    className:
      "bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]",
  },
  done: {
    label: "Terminé",
    className: "bg-bg-sunken text-ink-faint",
  },
  cancelled: {
    label: "Annulé",
    className: "bg-[var(--color-danger-soft)] text-[var(--color-danger)]",
  },
};

const EMPTY_COPY: Record<Tab, { title: string; text: string }> = {
  upcoming: {
    title: "Aucun rendez-vous à venir",
    text: "Réservez votre prochain artisan dès maintenant.",
  },
  done: {
    title: "Aucun rendez-vous passé",
    text: "Votre historique apparaîtra ici.",
  },
  cancelled: {
    title: "Aucun rendez-vous annulé",
    text: "Rien à signaler de ce côté.",
  },
};

export default function Appointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [tab, setTab] = useState<Tab>("upcoming");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    supabase
      .from("appointments")
      .select("*")
      .eq("client_id", user.id)
      .order("appointment_date", { ascending: tab === "upcoming" })
      .then(({ data, error }) => {
        if (!error && data) setAppointments(data as Appointment[]);
        setLoading(false);
      });
  }, [user, tab]);

  if (!user)
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-xl font-bold mb-2">
          Connectez-vous pour voir vos rendez-vous
        </h2>
        <p className="text-sm text-ink-faint mb-6">
          Créez un compte ou connectez-vous pour réserver et suivre vos
          rendez-vous.
        </p>
        <Link to="/auth" className="btn btn-primary">
          Se connecter
        </Link>
      </div>
    );

  const filtered = appointments
    .filter((a) => a.status === tab)
    .sort((a, b) =>
      tab === "upcoming"
        ? new Date(a.appointment_date).getTime() -
          new Date(b.appointment_date).getTime()
        : new Date(b.appointment_date).getTime() -
          new Date(a.appointment_date).getTime(),
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold">Mes rendez-vous</h1>
      <p className="text-sm text-ink-faint mt-1">
        Suivez vos réservations passées et à venir.
      </p>

      <div className="flex gap-4 mt-6 border-b border-border">
        {(["upcoming", "done", "cancelled"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${tab === t ? "text-[var(--color-ink)] border-accent" : "text-ink-faint border-transparent hover:text-[var(--color-ink)]"}`}
          >
            {t === "upcoming" ? "À venir" : t === "done" ? "Passés" : "Annulés"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-24 text-center text-ink-faint">Chargement…</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center text-center py-24 border border-dashed border-[var(--color-border-strong)] rounded-2xl mt-6">
          <h3 className="font-bold text-lg">{EMPTY_COPY[tab].title}</h3>
          <p className="text-sm text-ink-soft mt-1">{EMPTY_COPY[tab].text}</p>
          {tab === "upcoming" && (
            <Link to="/search" className="btn btn-primary mt-6">
              Réserver un artisan
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4 mt-6">
          {filtered.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-4 bg-bg-elevated border border-border rounded-2xl p-4 hover:shadow-sm transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-bg-sunken flex items-center justify-center text-lg font-bold text-ink-faint">
                {a.service_name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold">{a.service_name}</h3>
                <p className="text-sm text-ink-faint">
                  {new Date(a.appointment_date).toLocaleDateString("fr-FR", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}{" "}
                  à {a.appointment_time?.slice(0, 5)} ·{" "}
                  {a.price.toLocaleString("fr-FR")} Gourdes
                </p>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_LABELS[tab].className}`}
              >
                {STATUS_LABELS[tab].label}
              </span>
              {tab === "upcoming" && (
                <button
                  className="text-sm font-semibold text-[var(--color-danger)] hover:underline"
                  onClick={async () => {
                    await supabase
                      .from("appointments")
                      .update({ status: "cancelled" })
                      .eq("id", a.id);
                    setAppointments((prev) =>
                      prev.map((apt) =>
                        apt.id === a.id
                          ? { ...apt, status: "cancelled" as const }
                          : apt,
                      ),
                    );
                  }}
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
}
