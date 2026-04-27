// src/pages/account/PushPreferences.tsx
//
// A9 — Push notification preferences page.
//
// Auth-required. Renders one toggle per notification type, a time
// picker for daily_practice, quiet-hours editor, and a "Send test
// notification" button that calls the send-push edge function with
// `{ action: "test", user_id }`.
//
// The page is intentionally low-stakes: when @capacitor/push-notifications
// isn't installed (web build), the toggles still save to the DB and
// the test button reports a friendly "device not enrolled" message.

import { useEffect, useState } from "react";

import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import {
  DEFAULT_PREFERENCES,
  NOTIFICATION_LABELS,
  NOTIFICATION_TYPES,
  type NotificationType,
  type PushPreferences,
} from "@/lib/push/types";
import { registerPushNotifications } from "@/lib/push/pushTokenRegistration";

const TYPE_TO_PREF_FIELD: Record<NotificationType, keyof PushPreferences> = {
  daily_practice: "daily_practice_enabled",
  streak_grace: "streak_grace_enabled",
  leaderboard_position_change: "leaderboard_change_enabled",
  mercy_message: "mercy_message_enabled",
  trial_expiring: "trial_expiring_enabled",
};

export default function PushPreferencesPage() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<PushPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [testMsg, setTestMsg] = useState<string | null>(null);
  const [enrollMsg, setEnrollMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!user?.id) return;

    (async () => {
      const { data } = await supabase
        .from("push_preferences")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;
      if (data) {
        setPrefs({
          daily_practice_enabled: !!data.daily_practice_enabled,
          daily_practice_local_time: String(
            data.daily_practice_local_time ?? "19:00",
          ).slice(0, 5),
          streak_grace_enabled: !!data.streak_grace_enabled,
          leaderboard_change_enabled: !!data.leaderboard_change_enabled,
          mercy_message_enabled: !!data.mercy_message_enabled,
          trial_expiring_enabled: !!data.trial_expiring_enabled,
          quiet_hours_start: String(data.quiet_hours_start ?? "22:00").slice(0, 5),
          quiet_hours_end: String(data.quiet_hours_end ?? "07:00").slice(0, 5),
          timezone: String(data.timezone ?? "Asia/Ho_Chi_Minh"),
        });
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  if (!user?.id) {
    return (
      <div className="px-4 py-6 max-w-2xl mx-auto text-sm text-black/60">
        Đăng nhập để chỉnh thông báo đẩy.
      </div>
    );
  }

  const save = async (next: PushPreferences) => {
    if (!user?.id) return;
    setSaving(true);
    setStatusMsg(null);
    const { error } = await supabase
      .from("push_preferences")
      .upsert({
        user_id: user.id,
        ...next,
        updated_at: new Date().toISOString(),
      });
    setSaving(false);
    if (error) {
      setStatusMsg("Không lưu được — thử lại nhé.");
    } else {
      setStatusMsg("Đã lưu.");
      setTimeout(() => setStatusMsg(null), 1500);
    }
  };

  const updatePref = (patch: Partial<PushPreferences>) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    void save(next);
  };

  const enrollDevice = async () => {
    setEnrollMsg("Đang yêu cầu quyền…");
    const result = await registerPushNotifications(supabase);
    switch (result.kind) {
      case "registered":
        setEnrollMsg(
          result.reused
            ? "Thiết bị đã đăng ký từ trước — sẵn sàng nhận push."
            : "Đăng ký thành công — thiết bị sẽ nhận thông báo.",
        );
        break;
      case "permission_denied":
        setEnrollMsg("Bạn đã từ chối quyền. Vào Cài đặt hệ thống để bật lại.");
        break;
      case "skipped_not_native":
        setEnrollMsg(
          "Đang dùng trình duyệt web — push chỉ hoạt động trên app iOS/Android.",
        );
        break;
      case "skipped_denied_recently":
        setEnrollMsg("Bạn vừa từ chối — thử lại trong session mới.");
        break;
      case "plugin_unavailable":
        setEnrollMsg("Plugin push chưa được cài. Cập nhật app lên bản mới nhất.");
        break;
      case "error":
        setEnrollMsg(`Lỗi: ${result.message}`);
        break;
    }
  };

  const sendTest = async () => {
    if (!user?.id) return;
    setTestMsg("Đang gửi…");
    try {
      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;
      if (!accessToken) {
        setTestMsg("Không có session — đăng nhập lại nhé.");
        return;
      }
      const res = await fetch("/functions/v1/send-push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ action: "test", user_id: user.id }),
      });
      const json = await res.json();
      if (!res.ok) {
        setTestMsg(`Lỗi: ${json.error ?? res.status}`);
        return;
      }
      if (json.dispatched > 0) {
        setTestMsg("Đã gửi — kiểm tra thiết bị.");
      } else if (json.decision === "skipped_no_token") {
        setTestMsg("Chưa có thiết bị nào đăng ký push. Bấm 'Đăng ký thiết bị' bên trên.");
      } else {
        setTestMsg(`Bị bỏ qua: ${json.decision}`);
      }
    } catch (e) {
      setTestMsg(e instanceof Error ? e.message : "Lỗi không xác định");
    }
  };

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Thông báo đẩy</h1>
        <p className="text-sm text-black/60 mt-1">
          Chọn loại thông báo bạn muốn nhận. Mặc định: lời nhắc luyện hằng ngày
          tắt — chỉ bật khi bạn chủ động chọn.
        </p>
      </header>

      {loading && (
        <p className="text-sm text-black/55 italic">Đang tải cài đặt…</p>
      )}

      {!loading && (
        <>
          <section className="rounded-xl border border-black/10 bg-white p-5 mb-4">
            <h2 className="text-sm font-semibold text-black/90 mb-3">
              Đăng ký thiết bị này
            </h2>
            <p className="text-xs text-black/60 mb-3">
              Để nhận push trên iPhone hoặc điện thoại Android, app cần xin
              quyền một lần. Nhấn nút bên dưới — Hệ thống sẽ hiện hộp thoại.
            </p>
            <button
              type="button"
              onClick={enrollDevice}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold"
            >
              Đăng ký thiết bị
            </button>
            {enrollMsg && (
              <p className="text-xs text-black/65 mt-2">{enrollMsg}</p>
            )}
          </section>

          <section className="rounded-xl border border-black/10 bg-white p-5 mb-4 space-y-3">
            <h2 className="text-sm font-semibold text-black/90 mb-1">
              Loại thông báo
            </h2>
            {NOTIFICATION_TYPES.map((type) => (
              <ToggleRow
                key={type}
                type={type}
                enabled={!!prefs[TYPE_TO_PREF_FIELD[type]]}
                onChange={(enabled) =>
                  updatePref({ [TYPE_TO_PREF_FIELD[type]]: enabled } as Partial<PushPreferences>)
                }
              />
            ))}
          </section>

          {prefs.daily_practice_enabled && (
            <section className="rounded-xl border border-black/10 bg-white p-5 mb-4">
              <h2 className="text-sm font-semibold text-black/90 mb-2">
                Giờ nhắc hằng ngày
              </h2>
              <input
                type="time"
                value={prefs.daily_practice_local_time}
                onChange={(e) =>
                  updatePref({ daily_practice_local_time: e.target.value })
                }
                className="border border-black/15 rounded-lg px-3 py-2 text-sm"
              />
              <p className="text-xs text-black/55 mt-2">
                Giờ địa phương theo múi giờ {prefs.timezone}.
              </p>
            </section>
          )}

          <section className="rounded-xl border border-black/10 bg-white p-5 mb-4">
            <h2 className="text-sm font-semibold text-black/90 mb-2">
              Giờ yên tĩnh
            </h2>
            <p className="text-xs text-black/60 mb-3">
              Trong khung giờ này, Mercy không gửi push (trừ thông báo bạn ấn
              nút Test). Mặc định 22:00–07:00.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <input
                type="time"
                value={prefs.quiet_hours_start}
                onChange={(e) =>
                  updatePref({ quiet_hours_start: e.target.value })
                }
                className="border border-black/15 rounded-lg px-3 py-2"
              />
              <span className="text-black/55">đến</span>
              <input
                type="time"
                value={prefs.quiet_hours_end}
                onChange={(e) =>
                  updatePref({ quiet_hours_end: e.target.value })
                }
                className="border border-black/15 rounded-lg px-3 py-2"
              />
            </div>
          </section>

          <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 mb-4">
            <h2 className="text-sm font-semibold text-emerald-900 mb-2">
              Thử gửi một thông báo
            </h2>
            <p className="text-xs text-emerald-900/80 mb-3">
              Gửi một push thử về thiết bị bạn đã đăng ký. Bỏ qua giờ yên tĩnh.
            </p>
            <button
              type="button"
              onClick={sendTest}
              className="px-3.5 py-2 rounded-lg bg-emerald-700 text-white text-sm font-semibold"
            >
              Gửi thử
            </button>
            {testMsg && (
              <p className="text-xs text-emerald-900 mt-2">{testMsg}</p>
            )}
          </section>

          <div className="text-xs text-black/55 italic h-4">
            {saving ? "Đang lưu…" : statusMsg}
          </div>
        </>
      )}
    </div>
  );
}

function ToggleRow({
  type,
  enabled,
  onChange,
}: {
  type: NotificationType;
  enabled: boolean;
  onChange: (next: boolean) => void;
}) {
  const label = NOTIFICATION_LABELS[type];
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 accent-emerald-600"
      />
      <span className="flex-1">
        <span className="block text-sm font-medium text-black/90">
          {label.vi}
        </span>
        <span className="block text-xs text-black/55 italic">
          {label.en}
        </span>
        <span className="block text-xs text-black/65 mt-1">
          {label.description_vi}
        </span>
      </span>
    </label>
  );
}
