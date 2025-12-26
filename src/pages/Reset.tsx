import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export default function Reset() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const recovery = useMemo(() => {
    const rawHash = window.location.hash || "";
    const hash = rawHash.replace(/^#/, "");
    const params = new URLSearchParams(hash);

    return {
      type: params.get("type"),
      access_token: params.get("access_token"),
      refresh_token: params.get("refresh_token"),
    };
  }, []);

  useEffect(() => {
    const boot = async () => {
      setErr(null);
      try {
        const isRecovery =
          recovery.type === "recovery" &&
          recovery.access_token &&
          recovery.refresh_token;

        if (!isRecovery) {
          setErr("Missing recovery tokens. Please request a new reset email.");
          setReady(false);
          return;
        }

        // Establish auth session from hash tokens
        const { error } = await supabase.auth.setSession({
          access_token: recovery.access_token!,
          refresh_token: recovery.refresh_token!,
        });

        if (error) throw error;

        setReady(true);

        // Optional: clean hash for nicer URL (keep user on /reset)
        try {
          const url = new URL(window.location.href);
          url.hash = "";
          window.history.replaceState({}, "", url.toString());
        } catch {}
      } catch (e: any) {
        setErr(e?.message || "Failed to start reset session.");
        setReady(false);
      } finally {
        setLoading(false);
      }
    };

    boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async () => {
    setErr(null);
    if (pw.length < 6) return setErr("Password must be at least 6 characters.");
    if (pw !== pw2) return setErr("Passwords do not match.");

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pw });
      if (error) throw error;

      // Done — go to auth or home
      navigate("/auth?reset=1", { replace: true });
    } catch (e: any) {
      setErr(e?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading reset…</div>;

  if (!ready) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Reset Password</h1>
        <p style={{ color: "crimson" }}>{err}</p>
        <p>Please request a new reset email.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 420 }}>
      <h1>Reset Password</h1>
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <label>New password</label>
      <input
        type="password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        style={{ width: "100%", marginBottom: 12 }}
      />

      <label>Confirm password</label>
      <input
        type="password"
        value={pw2}
        onChange={(e) => setPw2(e.target.value)}
        style={{ width: "100%", marginBottom: 12 }}
      />

      <button onClick={submit} disabled={loading} style={{ width: "100%" }}>
        {loading ? "Saving…" : "Save new password"}
      </button>
    </div>
  );
}
