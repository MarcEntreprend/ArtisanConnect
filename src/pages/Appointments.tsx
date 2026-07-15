import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar as CalendarIcon, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import type { Appointment } from "../lib/types";

type Tab = "upcoming" | "done" | "cancelled";

const STATUS_CONFIG: Record<Tab, { label: string; className: string; icon: React.FC<{ size?: number; className?: string }> }> = {
  upcoming: {
    label: "À venir",
    className: "bg-accent-soft text-accent-strong border border-accent/10",
    icon: CalendarIcon,
  },
  done: {
    label: "Terminé",
    className: "bg-forest-soft text-forest border border-forest/10",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Annulé",
    className: "bg-danger-soft text-danger border border-danger/10",
    icon: XCircle,
  },
};

const EMPTY_COPY: Record<Tab, { title: string; text: string }> = {
  upcoming: {
    title: "Aucun rendez-vous à venir",
    text: "Planifiez votre prochain projet avec nos artisans d'exception.",
  },
  done: {
    title: "Aucun rendez-vous passé",
    text: "Votre historique de réalisations et de rendez-vous apparaîtra ici.",
  },
  cancelled: {
    title: "Aucun rendez-vous annulé",
    text: "Rien à signaler. Vos rendez-vous annulés s'afficheront ici.",
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
      <div className="max-w-4xl mx-auto py-24 text-center animate-fade-in-up">
        <div className="w-16 h-16 rounded-full bg-accent-soft text-accent flex items-center justify-center mx-auto mb-6">
          <CalendarIcon size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-ink">
          Connectez-vous pour voir vos rendez-vous
        </h2>
        <p className="text-sm text-ink-soft mb-6 max-w-sm mx-auto leading-relaxed">
          Accédez à vos réservations passées et à venir en vous connectant à votre espace client.
        </p>
        <Link to="/auth" className="btn btn-primary px-8">
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
    <div className="max-w-4xl mx-auto py-8 animate-fade-in-up">
      <div className="border-b border-border/40 pb-6 mt-6">
        <h1 className="text-3xl font-extrabold text-ink">Mes rendez-vous</h1>
        <p className="text-sm text-ink-faint mt-1">
          Suivez et organisez vos réservations de services artisanaux.
        </p>
      </div>

      {/* Tabs Selector */}
      <div className="flex gap-6 border-b border-border mt-6 overflow-x-auto scrollbar-hide">
        {(["upcoming", "done", "cancelled"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3.5 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              tab === t 
                ? "text-ink border-accent" 
                : "text-ink-faint border-transparent hover:text-ink"
            }`}
          >
            {t === "upcoming" ? "À venir" : t === "done" ? "Passés" : "Annulés"}
          </button>
        ))}
      </div>

      {/* List Container */}
      {loading ? (
        <div className="py-24 text-center text-ink-faint animate-pulse">
          Chargement de vos rendez-vous…
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center text-center py-20 border border-dashed border-border-strong rounded-3xl mt-8 bg-bg-elevated/40">
          <CalendarIcon size={44} className="text-ink-faint mb-4 stroke-[1.5px]" />
          <h3 className="font-bold text-lg text-ink">{EMPTY_COPY[tab].title}</h3>
          <p className="text-sm text-ink-soft mt-1 max-w-sm leading-relaxed">{EMPTY_COPY[tab].text}</p>
          {tab === "upcoming" && (
            <Link to="/search" className="btn btn-primary mt-6">
              Réserver un artisan
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4 mt-8">
          {filtered.map((a) => {
            const Config = STATUS_CONFIG[tab];
            const StatusIcon = Config.icon;
            return (
              <div
                key={a.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-bg-elevated border border-border rounded-2xl p-5 hover:border-border-strong hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-soft text-accent flex items-center justify-center flex-shrink-0">
                    <CalendarIcon size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-ink text-base">{a.service_name}</h3>
                    <p className="text-xs text-ink-soft mt-1 flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-ink">
                        {new Date(a.appointment_date).toLocaleDateString("fr-FR", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      <span>à {a.appointment_time?.slice(0, 5)}</span>
                      <span className="text-ink-faint">·</span>
                      <span className="font-mono text-accent font-semibold">{a.price.toLocaleString("fr-FR")} Gourdes</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-end">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${Config.className}`}
                  >
                    <StatusIcon size={12} />
                    <span>{Config.label}</span>
                  </span>
                  
                  {tab === "upcoming" && (
                    <button
                      className="text-xs font-bold text-danger hover:bg-danger-soft px-3 py-1.5 rounded-full transition-colors"
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
