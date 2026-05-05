import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getSupabase } from "../lib/supabase";
import "../admin/admin.css";

type Gate = "loading" | "ok" | "no-session" | "no-access";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const [gate, setGate] = useState<Gate>("loading");
  const location = useLocation();

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setGate("no-session");
      return;
    }

    const client = sb;
    let cancelled = false;

    async function verifySession() {
      const {
        data: { session },
      } = await client.auth.getSession();
      if (cancelled) return;
      if (!session) {
        setGate("no-session");
        return;
      }
      const { data, error } = await client.from("allowed_editors").select("email").maybeSingle();
      if (cancelled) return;
      if (error) {
        console.error("[admin] allowlist check:", error.message);
        setGate("no-access");
        return;
      }
      if (!data?.email) {
        setGate("no-access");
        return;
      }
      setGate("ok");
    }

    void verifySession();

    const { data: sub } = client.auth.onAuthStateChange((_event, session) => {
      if (!session) setGate("no-session");
      else void verifySession();
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (gate === "loading") {
    return (
      <div className="admin-shell admin-shell--center">
        <p className="admin-muted">Checking session…</p>
      </div>
    );
  }

  if (gate === "no-session") {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (gate === "no-access") {
    return (
      <div className="admin-shell">
        <div className="admin-card admin-card--narrow">
          <h1 className="admin-h1">Access denied</h1>
          <p className="admin-muted">
            This account is not allowlisted. Add your email to the <code>allowed_editors</code> table in
            Supabase (SQL Editor), then sign in again.
          </p>
          <p style={{ marginTop: "1rem" }}>
            <button
              type="button"
              className="btn btn--primary-solid"
              onClick={() => void getSupabase()?.auth.signOut()}
            >
              Sign out
            </button>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
