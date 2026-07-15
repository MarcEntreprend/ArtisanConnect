// src/pages/Auth.tsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

type FormMode = "login" | "signup" | "recover";

const ROLES = [
  { value: "client", label: "Client" },
  { value: "artisan_solo", label: "Artisan indépendant" },
  { value: "responsable", label: "Responsable d'entreprise" },
  { value: "employe", label: "Employé" },
];

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<FormMode>("login");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState("client");

  // Recover
  const [recoverEmail, setRecoverEmail] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(loginEmail, loginPassword);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!signupName.trim()) {
      setError("Veuillez indiquer votre nom.");
      return;
    }
    setLoading(true);
    try {
      await signUp(signupEmail, signupPassword, signupName, signupRole);
      const isArtisan =
        signupRole === "artisan_solo" ||
        signupRole === "responsable" ||
        signupRole === "employe";
      navigate(isArtisan ? "/onboarding" : "/");
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  }

  async function handleRecover(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(recoverEmail);
      if (error) throw error;
      setMessage(
        "Un lien de réinitialisation a été envoyé à votre adresse email.",
      );
    } catch (err: any) {
      setError(err.message || "Erreur");
    } finally {
      setLoading(false);
    }
  }

  const backHref =
    document.referrer && document.referrer.includes(window.location.host)
      ? undefined // sera géré par onClick
      : "/";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in-up">
      <div className="w-full max-w-110 bg-bg-elevated rounded-3xl p-10 shadow-lg border border-border relative">
        {/* Flèche retour */}
        <Link
          to={backHref || "#"}
          onClick={(e) => {
            if (!backHref) {
              e.preventDefault();
              window.history.back();
            }
          }}
          className="absolute top-5 left-5 w-9 h-9 rounded-full flex items-center justify-center text-ink-soft hover:bg-bg-sunken hover:text-ink transition-all active:scale-95"
        >
          <ArrowLeft size={20} />
        </Link>

        {/* Login */}
        {mode === "login" && (
          <form onSubmit={handleLogin}>
            <h2 className="text-2xl font-bold text-center mb-1">
              Se connecter
            </h2>
            <p className="text-sm text-center text-ink-faint mb-8">
              Accédez à votre espace ArtisanConnect.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 rounded-xl bg-accent text-white font-bold text-sm hover:bg-accent-strong disabled:opacity-50 transition-all active:scale-[0.98] shadow-sm"
            >
              {loading ? "Connexion…" : "Connexion"}
            </button>

            <p className="text-center text-sm mt-4">
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-accent font-medium hover:underline"
              >
                Créer un compte
              </button>
              <span className="text-ink-faint mx-1.5">·</span>
              <button
                type="button"
                onClick={() => setMode("recover")}
                className="text-accent font-medium hover:underline"
              >
                Mot de passe oublié
              </button>
            </p>

            {error && (
              <p className="text-center text-sm text-danger mt-3 font-medium">{error}</p>
            )}
          </form>
        )}

        {/* Signup */}
        {mode === "signup" && (
          <form onSubmit={handleSignup}>
            <h2 className="text-2xl font-bold text-center mb-1">
              Créer un compte
            </h2>
            <p className="text-sm text-center text-ink-faint mb-8">
              Rejoignez ArtisanConnect en quelques secondes.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Nom complet
                </label>
                <input
                  type="text"
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Mot de passe
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Vous êtes ?
                </label>
                <select
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 rounded-xl bg-accent text-white font-bold text-sm hover:bg-accent-strong disabled:opacity-50 transition-all active:scale-[0.98] shadow-sm"
            >
              {loading ? "Création…" : "S'inscrire"}
            </button>

            <p className="text-center text-sm mt-4">
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-accent font-medium hover:underline"
              >
                Déjà un compte ? Connectez-vous
              </button>
            </p>

            {error && (
              <p className="text-center text-sm text-danger mt-3 font-medium">{error}</p>
            )}
          </form>
        )}

        {/* Recover */}
        {mode === "recover" && (
          <form onSubmit={handleRecover}>
            <h2 className="text-2xl font-bold text-center mb-1">
              Mot de passe oublié
            </h2>
            <p className="text-sm text-center text-ink-faint mb-8">
              Recevez un lien de réinitialisation par email.
            </p>

            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                type="email"
                required
                value={recoverEmail}
                onChange={(e) => setRecoverEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 rounded-xl bg-accent text-white font-bold text-sm hover:bg-accent-strong disabled:opacity-50 transition-all active:scale-[0.98] shadow-sm"
            >
              {loading ? "Envoi…" : "Envoyer le lien"}
            </button>

            <p className="text-center text-sm mt-4">
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-accent font-medium hover:underline"
              >
                Retour à la connexion
              </button>
            </p>

            {message && (
              <p className="text-center text-sm text-forest mt-3 font-medium">
                {message}
              </p>
            )}
            {error && (
              <p className="text-center text-sm text-danger mt-3 font-medium">{error}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
