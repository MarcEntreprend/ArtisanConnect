import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, User as UserIcon, Clock } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";

interface Professional {
  id: number | null;
  name: string;
  image?: string;
  avatar_url?: string;
  rating?: number | null;
}

interface BookingContext {
  artisanId: number | null;
  serviceId: number | null;
  artisanName: string;
  serviceName: string;
  depositPercent: number;
}

const SLOTS = [
  "08:00",
  "09:00",
  "10:30",
  "11:30",
  "14:00",
  "15:00",
  "16:30",
  "17:30",
];
const DAY_NAMES = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

function getWeekDates(start: Date): Date[] {
  const d = new Date(start);
  d.setDate(d.getDate() - d.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(d);
    date.setDate(date.getDate() + i);
    return date;
  });
}

export default function BookingModal() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState<BookingContext>({
    artisanId: null,
    serviceId: null,
    artisanName: "",
    serviceName: "",
    depositPercent: 0,
  });
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedPro, setSelectedPro] = useState<Professional | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const week = getWeekDates(currentDate);
  const monthYear = (() => {
    const fm = MONTHS[week[0].getMonth()];
    const lm = MONTHS[week[6].getMonth()];
    return fm === lm
      ? `${fm} ${week[0].getFullYear()}`
      : `${fm} / ${lm} ${week[0].getFullYear()}`;
  })();

  const openModal = useCallback(async (ctx: BookingContext) => {
    setContext(ctx);
    setSelectedDate(null);
    setSelectedPro(null);
    setSelectedSlot(null);
    setCurrentDate(new Date(today));
    setProfessionals([]);

    if (ctx.artisanId) {
      const { data: team } = await supabase
        .from("teams")
        .select("*, team_members(*)")
        .eq("artisan_id", ctx.artisanId)
        .maybeSingle();

      if (team?.team_members?.length) {
        const list = team.team_members
          .filter((m: any) => m.status === "actif")
          .map((m: any) => ({
            id: m.id,
            name: m.name,
            avatar_url: m.avatar_url,
          }));
        setProfessionals(list);
      } else {
        // Solo artisan - add default pro and select it
        const mainPro = { id: null, name: ctx.artisanName || "Artisan principal" };
        setProfessionals([mainPro]);
        setSelectedPro(mainPro);
      }
    }
    setOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = () => {
    setOpen(false);
    document.body.style.overflow = "";
  };

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const d = e.detail || {};
      openModal({
        artisanId: d.artisanId || null,
        serviceId: d.serviceId || null,
        artisanName: d.artisanName || "",
        serviceName: d.serviceName || "",
        depositPercent: d.depositPercent || 0,
      });
    };
    window.addEventListener("openBookingModal", handler as EventListener);
    return () =>
      window.removeEventListener("openBookingModal", handler as EventListener);
  }, [openModal]);

  function formatDate(iso: string) {
    return new Date(iso + "T00:00:00").toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }

  async function handleConfirm() {
    if (
      !selectedDate ||
      !selectedPro ||
      !selectedSlot ||
      !context.artisanId ||
      !user
    )
      return;
    setSubmitting(true);
    await supabase.from("appointments").insert({
      artisan_id: context.artisanId,
      client_id: user.id,
      service_id: context.serviceId,
      professional_id: selectedPro.id,
      service_name: context.serviceName || "Rendez-vous",
      price: 0,
      appointment_date: selectedDate,
      appointment_time: selectedSlot + ":00",
      status: "upcoming",
      deposit_paid: 0,
    });
    closeModal();
    setSubmitting(false);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-9999 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div className="relative w-full max-w-lg max-h-[calc(100vh-4rem)] bg-bg-elevated rounded-3xl shadow-lg flex flex-col overflow-hidden animate-fade-in-up">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-bg-sunken flex items-center justify-center text-ink-soft hover:bg-danger hover:text-white transition-colors"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="bg-bg-sunken/40 px-6 py-5 border-b border-border/80">
          <h2 className="text-lg font-bold text-ink flex items-center gap-2">
            <CalendarIcon size={18} className="text-accent" />
            <span>Réserver un créneau</span>
          </h2>
          <p className="text-xs text-ink-soft mt-1">
            {context.serviceName
              ? `${context.serviceName} · ${context.artisanName}`
              : "Choisissez vos préférences"}
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Calendar Select */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-xs text-ink uppercase tracking-wider">{monthYear}</h3>
              <div className="flex gap-1">
                <button
                  disabled={week[0].toDateString() === today.toDateString()}
                  onClick={() => {
                    const d = new Date(currentDate);
                    d.setDate(d.getDate() - 7);
                    setCurrentDate(d);
                  }}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-ink-soft hover:bg-bg-sunken disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => {
                    const d = new Date(currentDate);
                    d.setDate(d.getDate() + 7);
                    setCurrentDate(d);
                  }}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-ink-soft hover:bg-bg-sunken transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {week.map((d) => {
                const iso = d.toISOString().split("T")[0];
                const past = d < today;
                const isSelected = selectedDate === iso;
                return (
                  <button
                    key={iso}
                    disabled={past}
                    onClick={() => {
                      setSelectedDate(iso);
                      setSelectedSlot(null);
                    }}
                    className={`flex flex-col items-center py-2.5 rounded-2xl border text-[11px] font-bold transition-all ${isSelected
                        ? "bg-accent text-white border-accent shadow-sm"
                        : past
                          ? "opacity-30 cursor-not-allowed border-transparent bg-transparent"
                          : "hover:border-border-strong border-border bg-bg-elevated text-ink-soft"
                      }`}
                  >
                    <span>{DAY_NAMES[d.getDay()]}</span>
                    <span className="font-mono mt-1 text-xs">
                      {String(d.getDate()).padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Professionals List */}
          <div>
            <h3 className="font-bold text-xs text-ink uppercase tracking-wider mb-3">Choisir un professionnel</h3>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {professionals.map((pro) => {
                const isSelected = selectedPro?.id === pro.id;
                return (
                  <button
                    key={pro.id ?? "any"}
                    onClick={() => {
                      setSelectedPro(pro);
                      setSelectedSlot(null);
                    }}
                    className="flex flex-col items-center gap-1.5 min-w-[76px] group focus:outline-none"
                  >
                    <div
                      className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all ${isSelected
                          ? "ring-2 ring-accent ring-offset-2"
                          : "group-hover:scale-105"
                        }`}
                    >
                      {pro.avatar_url ? (
                        <img
                          src={pro.avatar_url}
                          alt={pro.name}
                          className="w-full h-full rounded-full object-cover border border-border"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-bg-sunken border border-border flex items-center justify-center text-ink-faint">
                          <UserIcon size={18} />
                        </div>
                      )}
                    </div>
                    <span className={`text-[10px] font-bold text-center leading-tight truncate w-16 ${isSelected ? "text-accent" : "text-ink-soft"}`}>
                      {pro.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots Grid */}
          <div className="border-t border-border/60 pt-5">
            <h3 className="font-bold text-xs text-ink uppercase tracking-wider mb-3">Horaire de passage</h3>
            {!selectedDate || !selectedPro ? (
              <p className="text-xs text-ink-faint italic py-2">
                Veuillez sélectionner une date et un professionnel pour voir les créneaux libres.
              </p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {SLOTS.map((s) => {
                  const isSelected = selectedSlot === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSelectedSlot(s)}
                      className={`py-3 rounded-2xl border text-xs font-mono font-bold transition-all ${isSelected
                          ? "bg-accent text-white border-accent shadow-sm"
                          : "border-border bg-bg-elevated hover:border-border-strong text-ink-soft"
                        }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Summary & Action */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-border/80 bg-bg-sunken/20">
          <div className="text-xs text-ink-soft flex-1">
            {selectedDate && selectedPro && selectedSlot ? (
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-accent tracking-wider block">Récapitulatif</span>
                <span className="font-bold text-ink text-sm flex items-center gap-1">
                  <Clock size={13} className="text-ink-faint" /> {formatDate(selectedDate)} à {selectedSlot}
                </span>
                <span className="block text-[11px]">Avec {selectedPro.name}</span>
              </div>
            ) : (
              <span className="italic text-ink-faint">Sélectionner un créneau libre</span>
            )}
          </div>
          <button
            disabled={
              !selectedDate || !selectedPro || !selectedSlot || submitting || !user
            }
            onClick={handleConfirm}
            className="btn btn-primary px-6 py-3 text-xs uppercase tracking-wider font-bold shadow-md"
          >
            {!user ? "Se connecter pour réserver" : submitting ? "Réservation…" : "Confirmer"}
          </button>
        </div>
      </div>
    </div>
  );
}
