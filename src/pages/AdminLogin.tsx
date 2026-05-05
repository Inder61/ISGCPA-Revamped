import { FormEvent, useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { getSupabase } from "../lib/supabase";
import "../admin/admin.css";

export function AdminLogin() {
  const sb = getSupabase();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    if (!sb) {
      setSessionChecked(true);
      return;
    }
    sb.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session);
      setSessionChecked(true);
    });
  }, [sb]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!sb) {
      setError("Supabase is not configured (missing .env).");
      return;
    }
    setBusy(true);
    const { error: signErr } = await sb.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (signErr) setError(signErr.message);
    else navigate(from, { replace: true });
  }

  if (!sessionChecked) {
    return (
      <div className="admin-shell admin-shell--center">
        <p className="admin-muted">Loading…</p>
      </div>
    );
  }

  if (hasSession) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="admin-shell admin-shell--center">
      <div className="admin-card admin-card--narrow">
        <h1 className="admin-h1">Site editor</h1>
        <p className="admin-muted" style={{ marginBottom: "1.25rem" }}>
          Sign in with your Supabase user (email allowlisted in <code>allowed_editors</code>). There is no
          public sign-up on this site — users are created only in the Supabase dashboard.
        </p>
        <form className="admin-grid" onSubmit={onSubmit}>
          <div className="admin-field">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="admin-field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error ? (
            <div className="admin-banner admin-banner--error" role="alert">
              {error}
            </div>
          ) : null}
          <button type="submit" className="btn btn--primary-solid" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="admin-login-note">
          <Link to="/">← Back to site</Link>
        </p>
      </div>
    </div>
  );
}
