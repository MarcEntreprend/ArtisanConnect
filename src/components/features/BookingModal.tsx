// src/components/features/BookingModal.tsx

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
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
const DAY_NAMES = ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"];
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
        setProfessionals(
          team.team_members
            .filter((m: any) => m.status === "actif")
            .map((m: any) => ({
              id: m.id,
              name: m.name,
              avatar_url: m.avatar_url,
            })),
        );
      }
    }
    setOpen(true);
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
      className="fixed inset-0 z-9999 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div className="w-full max-w-160 max-h-[calc(100vh-2rem)] bg-bg-elevated rounded-card shadow-lg flex flex-col overflow-hidden mx-2 mb-2 sm:mb-0">
        {/* Close */}
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-bg-sunken flex items-center justify-center hover:bg-danger hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="bg-bg-sunken px-4 py-3 border-b border-border">
          <h2 className="text-center font-bold">{monthYear}</h2>
          <p className="text-xs text-center text-ink-faint mt-0.5">
            {context.serviceName
              ? `${context.serviceName} · ${context.artisanName}`
              : "Choisissez une date"}
          </p>
          <div className="flex items-center gap-1 mt-3">
            <button
              disabled={week[0].toDateString() === today.toDateString()}
              onClick={() => {
                const d = new Date(currentDate);
                d.setDate(d.getDate() - 7);
                setCurrentDate(d);
              }}
              className="w-9 h-9 rounded-full border flex items-center justify-center"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="grid grid-cols-7 gap-1 flex-1">
              {week.map((d) => {
                const iso = d.toISOString().split("T")[0];
                const past = d < today;
                return (
                  <button
                    key={iso}
                    disabled={past}
                    onClick={() => {
                      setSelectedDate(iso);
                      setSelectedSlot(null);
                    }}
                    className={`flex flex-col items-center py-2 rounded-xl border text-xs font-semibold transition-colors ${selectedDate === iso ? "bg-accent text-white border-accent" : past ? "opacity-30 cursor-not-allowed" : "hover:border-border-strong border-border"}`}
                  >
                    <span>{DAY_NAMES[d.getDay()]}</span>
                    <span className="font-mono mt-1">
                      {String(d.getDate()).padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => {
                const d = new Date(currentDate);
                d.setDate(d.getDate() + 7);
                setCurrentDate(d);
              }}
              className="w-9 h-9 rounded-full border flex items-center justify-center"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Professionals */}
          <div>
            <h3 className="font-bold text-sm mb-2">Choisir un professionnel</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {professionals.length === 0 && (
                <p className="text-sm text-ink-faint">Sans préférence</p>
              )}
              {professionals.map((pro) => (
                <button
                  key={pro.id ?? "any"}
                  onClick={() => {
                    setSelectedPro(pro);
                    setSelectedSlot(null);
                  }}
                  className="flex flex-col items-center gap-1 min-w-20"
                >
                  <div
                    className={`p-0.5 rounded-full ${selectedPro?.id === pro.id ? "ring-2 ring-accent" : ""}`}
                  >
                    <img
                      src={pro.avatar_url || pro.image || ""}
                      alt={pro.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-border"
                    />
                  </div>
                  <span className="text-xs font-medium text-center">
                    {pro.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-border" />

          {/* Slots */}
          <div>
            {!selectedDate || !selectedPro ? (
              <p className="text-sm text-ink-soft flex items-center gap-2">
                🕐 Choisissez une date et un professionnel pour voir les
                créneaux.
              </p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {SLOTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSlot(s)}
                    className={`py-2.5 rounded-xl border text-sm font-mono font-semibold transition-colors ${selectedSlot === s ? "bg-accent text-white border-accent" : "border-border hover:border-border-strong"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 px-4 py-3 border-t border-border bg-bg-elevated">
          <div className="text-xs text-ink-soft">
            {selectedDate && selectedPro && selectedSlot ? (
              <>
                <strong className="text-sm text-ink block">
                  {formatDate(selectedDate)} à {selectedSlot}
                </strong>
                Avec {selectedPro.name}
                {context.depositPercent > 0 && (
                  <span className="block text-[10px]">
                    Acompte : {context.depositPercent}%
                  </span>
                )}
              </>
            ) : (
              <span>Aucun créneau sélectionné</span>
            )}
          </div>
          <button
            disabled={
              !selectedDate || !selectedPro || !selectedSlot || submitting
            }
            onClick={handleConfirm}
            className="px-5 py-2.5 rounded-full bg-accent text-white font-bold text-sm disabled:opacity-40 hover:bg-accent-strong transition-colors"
          >
            {submitting ? "Réservation…" : "Confirmer"}
          </button>
        </div>
      </div>
    </div>
  );
}
