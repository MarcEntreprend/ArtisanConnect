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
      <div className="onboarding-overlay">
        <div
          className="onboarding-modal"
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "var(--ink-faint)",
            fontSize: "0.9rem",
          }}
        >
          Chargement…
        </div>
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
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        <div className="onboarding-steps">{dots}</div>

        {step === 1 && (
          <>
            <div className="onboarding-title">Bienvenue 👋</div>
            <div className="onboarding-subtitle">
              Pour personnaliser votre espace, dites-nous qui vous êtes.
            </div>
            <div className="onboarding-choice-grid">
              <div
                className={`onboarding-choice ${type === "solo" ? "selected" : ""}`}
                onClick={() => setType("solo")}
              >
                <div className="onboarding-choice-icon">🧑‍🔧</div>
                <div className="onboarding-choice-label">
                  Artisan indépendant
                </div>
                <div className="onboarding-choice-sub">Je travaille seul</div>
              </div>
              <div
                className={`onboarding-choice ${type === "entreprise" ? "selected" : ""}`}
                onClick={() => setType("entreprise")}
              >
                <div className="onboarding-choice-icon">🏪</div>
                <div className="onboarding-choice-label">
                  Entreprise ou salon
                </div>
                <div className="onboarding-choice-sub">J'ai une équipe</div>
              </div>
            </div>
            <div className="onboarding-actions">
              <span style={{ fontSize: ".8rem", color: "var(--ink-faint)" }}>
                Étape 1 sur 3
              </span>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!type}
                onClick={() => setStep(2)}
              >
                Continuer →
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="onboarding-title">Votre métier</div>
            <div className="onboarding-subtitle">
              Quel est votre métier principal ? Vous pourrez en ajouter d'autres
              plus tard.
            </div>
            <div className="onboarding-field">
              <label>Choisissez votre domaine (ou métier)</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">— Sélectionner —</option>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="onboarding-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setStep(1)}
              >
                ← Retour
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!category}
                onClick={() => setStep(3)}
              >
                Continuer →
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="onboarding-title">Votre premier service</div>
            <div className="onboarding-subtitle">
              Ajoutez au moins un service pour que les clients puissent vous
              réserver.
            </div>
            <div className="onboarding-field">
              <label>Nom du service</label>
              <input
                type="text"
                placeholder="Ex. Coupe de cheveux"
                value={service.name}
                onChange={(e) =>
                  setService({ ...service, name: e.target.value })
                }
              />
            </div>
            <div className="onboarding-field">
              <label>Prix (Gourdes)</label>
              <input
                type="number"
                placeholder="Ex. 2500"
                min="0"
                step="500"
                value={service.price}
                onChange={(e) =>
                  setService({ ...service, price: e.target.value })
                }
              />
            </div>
            <div className="onboarding-field">
              <label>Durée (minutes)</label>
              <input
                type="number"
                placeholder="Ex. 30"
                min="5"
                step="5"
                value={service.duration}
                onChange={(e) =>
                  setService({ ...service, duration: e.target.value })
                }
              />
            </div>
            {error && (
              <p
                style={{
                  color: "var(--danger)",
                  fontSize: ".8rem",
                  minHeight: "1.2rem",
                  marginTop: "0.5rem",
                }}
              >
                {error}
              </p>
            )}
            <div className="onboarding-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setStep(2)}
              >
                ← Retour
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={submitting}
                onClick={handleFinish}
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
