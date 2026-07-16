// src/pages/Onboarding.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import { CATEGORIES } from "../lib/constants";

type OnboardingType = "solo" | "entreprise" | null;

interface ServiceDraft {
  name: string;
  price: string;
  duration: string;
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [step, setStep] = useState(1);
  const [type, setType] = useState<OnboardingType>(null);
  const [category, setCategory] = useState("");
  const [service, setService] = useState<ServiceDraft>({
    name: "",
    price: "",
    duration: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth");
      return;
    }

    supabase
      .from("artisans")
      .select("id")
      .eq("owner_id", user.id)
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        supabase
          .from("services")
          .select("id")
          .eq("artisan_id", data[0].id)
          .then(({ data: svc }) => {
            if (svc && svc.length > 0) navigate("/dashboard?persona=solo");
          });
      });
  }, [user, authLoading, navigate]);

  if (authLoading)
    return (
      <div className="flex items-center justify-center min-h-screen text-ink-faint">
        Chargement…
      </div>
    );

  const dots = [1, 2, 3].map((n) => (
    <div
      key={n}
      className={`onboarding-step-dot ${n === step ? "active" : n < step ? "done" : ""}`}
    />
  ));

  async function handleFinish() {
    if (!service.name.trim()) {
      setError("Veuillez nommer votre service.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      let artisanId: number | null = null;
      if (!user) return;
      const { data: existing } = await supabase
        .from("artisans")
        .select("id")
        .eq("owner_id", user.id)
        .maybeSingle();
      if (existing) {
        artisanId = existing.id;
      } else {
        const { data: created } = await supabase
          .from("artisans")
          .insert({
            owner_id: user!.id,
            name: user?.full_name || "Mon activité",
            city: "",
            currency: "Gourdes",
            is_team: type === "entreprise",
            status: "actif",
          })
          .select();
        if (created) artisanId = created[0].id;
      }
      if (artisanId) {
        await supabase.from("services").insert({
          artisan_id: artisanId,
          name: service.name,
          price: Number(service.price) || 0,
          duration_min: Number(service.duration) || 30,
          is_active: true,
        });
      }
      navigate(
        `/dashboard?persona=${type === "entreprise" ? "responsable" : "solo"}`,
      );
    } catch (err: any) {
      setError(err.message || "Erreur");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-(--bg)/95 backdrop-blur flex items-center justify-center p-4">
      <div className="w-full max-w-125 bg-bg-elevated border border-border rounded-3xl shadow-lg p-10">
        <div className="flex items-center gap-1 mb-8">{dots}</div>

        {step === 1 && (
          <>
            <h2 className="text-2xl font-extrabold mb-2">Bienvenue 👋</h2>
            <p className="text-sm text-ink-faint mb-6">
              Pour personnaliser votre espace, dites-nous qui vous êtes.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {(["solo", "entreprise"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex flex-col items-center gap-2 p-6 rounded-2xl border-2 transition-colors text-center ${
                    type === t
                      ? "border-accent bg-accent-soft"
                      : "border-border hover:border-border-strong"
                  }`}
                >
                  <span className="text-3xl">{t === "solo" ? "🧑‍🔧" : "🏪"}</span>
                  <span className="font-bold text-sm">
                    {t === "solo"
                      ? "Artisan indépendant"
                      : "Entreprise ou salon"}
                  </span>
                  <span className="text-xs text-ink-faint">
                    {t === "solo" ? "Je travaille seul" : "J'ai une équipe"}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-ink-faint">Étape 1 sur 3</span>
              <button
                disabled={!type}
                onClick={() => setStep(2)}
                className="btn btn-primary"
              >
                Continuer →
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-extrabold mb-2">Votre métier</h2>
            <p className="text-sm text-ink-faint mb-6">
              Quel est votre métier principal ?
            </p>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-1.5">
                Choisissez votre métier
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl border border-border bg-bg text-sm"
              >
                <option value="">— Sélectionner —</option>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between">
              <button onClick={() => setStep(1)} className="btn btn-ghost">
                ← Retour
              </button>
              <button
                disabled={!category}
                onClick={() => setStep(3)}
                className="btn btn-primary"
              >
                Continuer →
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl font-extrabold mb-2">
              Votre premier service
            </h2>
            <p className="text-sm text-ink-faint mb-6">
              Ajoutez au moins un service pour que les clients puissent vous
              réserver.
            </p>
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Nom du service
                </label>
                <input
                  type="text"
                  value={service.name}
                  onChange={(e) =>
                    setService({ ...service, name: e.target.value })
                  }
                  placeholder="Ex. Coupe de cheveux"
                  className="w-full p-3 rounded-xl border border-border bg-bg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Prix (Gourdes)
                </label>
                <input
                  type="number"
                  value={service.price}
                  onChange={(e) =>
                    setService({ ...service, price: e.target.value })
                  }
                  placeholder="Ex. 2500"
                  min="0"
                  step="500"
                  className="w-full p-3 rounded-xl border border-border bg-bg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Durée (minutes)
                </label>
                <input
                  type="number"
                  value={service.duration}
                  onChange={(e) =>
                    setService({ ...service, duration: e.target.value })
                  }
                  placeholder="Ex. 30"
                  min="5"
                  step="5"
                  className="w-full p-3 rounded-xl border border-border bg-bg text-sm"
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <div className="flex items-center justify-between">
              <button onClick={() => setStep(2)} className="btn btn-ghost">
                ← Retour
              </button>
              <button
                onClick={handleFinish}
                disabled={submitting}
                className="btn btn-primary"
              >
                {submitting ? "Création…" : "Commencer 🎉"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
