import React, { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ensureSessionOrThrow, humanizeAuthError } from "@/lib/authHelpers";
import { UI, AUTH_FOCUS_RING } from "@/components/auth/authUI";
import { useChromeT } from "@/lib/i18n/chromeLanguage";

export default function PhoneOtp({
  busyParent,
  onAuthed,
  onAnnounce,
}: {
  busyParent: boolean;
  onAuthed: () => Promise<void>;
  onAnnounce?: (message: string) => void;
}) {
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const t = useChromeT();

  const disabled = busyParent || busy;

  // A30 — PhoneOtp's status (line ~148) has no live semantics; route it
  // through the auth shell's single polite live region (audit A3).
  useEffect(() => {
    if (msg && onAnnounce) onAnnounce(msg);
  }, [msg, onAnnounce]);

  const sendCode = useCallback(async () => {
    if (disabled) return;
    setBusy(true);
    setMsg(null);

    try {
      const p = phone.trim();
      if (!p || p.length < 8) {
        setMsg("Enter phone with country code (example: +84...).");
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({ phone: p });
      if (error) throw error;

      setSent(true);
      setMsg("✅ Code sent. Enter the SMS code to sign in.");
    } catch (e) {
      setMsg(humanizeAuthError(e, "password_signin"));
    } finally {
      setBusy(false);
    }
  }, [disabled, phone]);

  const verifyCode = useCallback(async () => {
    if (disabled) return;
    setBusy(true);
    setMsg(null);

    try {
      const p = phone.trim();
      const t = token.trim();

      if (!p || p.length < 8) {
        setMsg("Enter phone with country code.");
        return;
      }
      if (!t || t.length < 4) {
        setMsg("Enter the code you received.");
        return;
      }

      const { error } = await supabase.auth.verifyOtp({
        phone: p,
        token: t,
        type: "sms",
      });
      if (error) throw error;

      await ensureSessionOrThrow();
      setMsg("✅ Signed in. Redirecting...");
      await onAuthed();
    } catch (e) {
      setMsg(humanizeAuthError(e, "password_signin"));
    } finally {
      setBusy(false);
    }
  }, [disabled, onAuthed, phone, token]);

  return (
    <div style={UI.block}>
      <div style={UI.small}>We’ll send you a one-time code (OTP).</div>

      <div style={{ marginTop: 12 }}>
        <label style={UI.label}>Phone</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+84 901234567"
          autoComplete="tel"
          className={AUTH_FOCUS_RING}
          style={UI.input(disabled)}
          disabled={disabled}
        />
      </div>

      {!sent ? (
        <div style={{ marginTop: 12 }}>
          <button onClick={sendCode} disabled={disabled} style={UI.primaryBtn(disabled)}>
            {disabled
              ? t({ vi: "Vui lòng đợi…", en: "Please wait..." })
              : t({ vi: "Gửi mã SMS", en: "Send SMS code" })}
          </button>
          <div style={{ marginTop: 8, ...UI.small }}>
            Tip: always include country code (+66 / +84 / +1 …).
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 12 }}>
          <label style={UI.label}>SMS code</label>
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="123456"
            autoComplete="one-time-code"
            className={AUTH_FOCUS_RING}
            style={UI.input(disabled)}
            disabled={disabled}
          />
          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={verifyCode}
              disabled={disabled}
              style={{ ...UI.primaryBtn(disabled), flex: "1 1 auto" }}
            >
              {disabled
                ? t({ vi: "Vui lòng đợi…", en: "Please wait..." })
                : t({ vi: "Xác minh & đăng nhập", en: "Verify & sign in" })}
            </button>
            <button
              type="button"
              onClick={() => {
                setSent(false);
                setToken("");
                setMsg(null);
              }}
              disabled={disabled}
              style={UI.ghostBtn(disabled)}
            >
              Change phone
            </button>
          </div>
        </div>
      )}

      {msg && <div style={UI.status}>{msg}</div>}
    </div>
  );
}