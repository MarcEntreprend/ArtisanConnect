// src/pages/Auth.tsx — style Terrain restauré, logique métier inchangée

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
      ? undefined
      : "/";

  return (
    <div
      style={{
        background: "var(--bg)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "var(--bg-elevated)",
          borderRadius: "var(--r-card)",
          padding: "2.5rem 2rem",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--border)",
          position: "relative",
        }}
      >
        {/* Flèche retour */}
        <Link
          to={backHref || "#"}
          onClick={(e) => {
            if (!backHref) {
              e.preventDefault();
              window.history.back();
            }
          }}
          style={{
            position: "absolute",
            top: "1.25rem",
            left: "1.25rem",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            color: "var(--ink-soft)",
            background: "transparent",
            textDecoration: "none",
            transition: "background 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg-sunken)";
            e.currentTarget.style.color = "var(--ink)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--ink-soft)";
          }}
          aria-label="Retour à l'accueil"
        >
          <ArrowLeft size={20} />
        </Link>

        {/* Login */}
        {mode === "login" && (
          <form onSubmit={handleLogin}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: "0.25rem",
                textAlign: "center",
              }}
            >
              Se connecter
            </h2>
            <p
              style={{
                textAlign: "center",
                fontSize: "0.85rem",
                color: "var(--ink-faint)",
                marginBottom: "2rem",
              }}
            >
              Accédez à votre espace ArtisanConnect.
            </p>

            <div className="dash-field" style={{ marginBottom: "1.25rem" }}>
              <label>Email</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>

            <div className="dash-field" style={{ marginBottom: "1.75rem" }}>
              <label>Mot de passe</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%", marginBottom: "1.25rem" }}
            >
              {loading ? "Connexion…" : "Connexion"}
            </button>

            <p
              style={{
                textAlign: "center",
                fontSize: "0.85rem",
                marginBottom: "0.5rem",
              }}
            >
              <button
                type="button"
                onClick={() => setMode("signup")}
                style={{
                  color: "var(--accent)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Créer un compte
              </button>
              <span style={{ color: "var(--ink-faint)", margin: "0 0.4rem" }}>
                ·
              </span>
              <button
                type="button"
                onClick={() => setMode("recover")}
                style={{
                  color: "var(--accent)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Mot de passe oublié
              </button>
            </p>

            {error && (
              <p
                style={{
                  color: "var(--danger)",
                  fontSize: "0.8rem",
                  textAlign: "center",
                  marginTop: "0.5rem",
                  minHeight: "1.2rem",
                }}
              >
                {error}
              </p>
            )}
            {!error && (
              <div style={{ minHeight: "1.2rem", marginTop: "0.5rem" }} />
            )}
          </form>
        )}

        {/* Signup */}
        {mode === "signup" && (
          <form onSubmit={handleSignup}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: "0.25rem",
                textAlign: "center",
              }}
            >
              Créer un compte
            </h2>
            <p
              style={{
                textAlign: "center",
                fontSize: "0.85rem",
                color: "var(--ink-faint)",
                marginBottom: "2rem",
              }}
            >
              Rejoignez ArtisanConnect en quelques secondes.
            </p>

            <div className="dash-field" style={{ marginBottom: "1.25rem" }}>
              <label>Nom complet</label>
              <input
                type="text"
                required
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
              />
            </div>

            <div className="dash-field" style={{ marginBottom: "1.25rem" }}>
              <label>Email</label>
              <input
                type="email"
                required
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
              />
            </div>

            <div className="dash-field" style={{ marginBottom: "1.25rem" }}>
              <label>Mot de passe</label>
              <input
                type="password"
                required
                minLength={6}
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
              />
            </div>

            <div className="dash-field" style={{ marginBottom: "1.75rem" }}>
              <label>Vous êtes ?</label>
              <select
                value={signupRole}
                onChange={(e) => setSignupRole(e.target.value)}
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%", marginBottom: "1.25rem" }}
            >
              {loading ? "Création…" : "S'inscrire"}
            </button>

            <p
              style={{
                textAlign: "center",
                fontSize: "0.85rem",
                marginBottom: "0.5rem",
              }}
            >
              <button
                type="button"
                onClick={() => setMode("login")}
                style={{
                  color: "var(--accent)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Déjà un compte ? Connectez-vous
              </button>
            </p>

            {error && (
              <p
                style={{
                  color: "var(--danger)",
                  fontSize: "0.8rem",
                  textAlign: "center",
                  marginTop: "0.5rem",
                  minHeight: "1.2rem",
                }}
              >
                {error}
              </p>
            )}
            {!error && (
              <div style={{ minHeight: "1.2rem", marginTop: "0.5rem" }} />
            )}
          </form>
        )}

        {/* Recover */}
        {mode === "recover" && (
          <form onSubmit={handleRecover}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: "0.25rem",
                textAlign: "center",
              }}
            >
              Mot de passe oublié
            </h2>
            <p
              style={{
                textAlign: "center",
                fontSize: "0.85rem",
                color: "var(--ink-faint)",
                marginBottom: "2rem",
              }}
            >
              Recevez un lien de réinitialisation par email.
            </p>

            <div className="dash-field" style={{ marginBottom: "1.75rem" }}>
              <label>Email</label>
              <input
                type="email"
                required
                value={recoverEmail}
                onChange={(e) => setRecoverEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%", marginBottom: "1.25rem" }}
            >
              {loading ? "Envoi…" : "Envoyer le lien"}
            </button>

            <p
              style={{
                textAlign: "center",
                fontSize: "0.85rem",
                marginBottom: "0.5rem",
              }}
            >
              <button
                type="button"
                onClick={() => setMode("login")}
                style={{
                  color: "var(--accent)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Retour à la connexion
              </button>
            </p>

            {message && (
              <p
                style={{
                  color: "var(--accent)",
                  fontSize: "0.8rem",
                  textAlign: "center",
                  marginTop: "0.5rem",
                  minHeight: "1.2rem",
                }}
              >
                {message}
              </p>
            )}
            {error && (
              <p
                style={{
                  color: "var(--danger)",
                  fontSize: "0.8rem",
                  textAlign: "center",
                  marginTop: "0.5rem",
                  minHeight: "1.2rem",
                }}
              >
                {error}
              </p>
            )}
            {!message && !error && (
              <div style={{ minHeight: "1.2rem", marginTop: "0.5rem" }} />
            )}
          </form>
        )}
      </div>
    </div>
  );
}
