import React, { FormEvent, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useLessonUiLang } from "@/components/LessonUiLangToggle";
import { useAuth } from "@/providers/AuthProvider";
import { confirmAdultProfile } from "@/lib/kids/adultConfirmation";
import { queryClient } from "@/lib/queries/client";
import { qk } from "@/lib/queries/keys";
import { useProfileQuery } from "@/lib/queries/useProfileQuery";

type Copy = {
  title: string;
  intro: string;
  signIn: string;
  signedOut: string;
  birthLabel: string;
  checkbox: string;
  submit: string;
  saving: string;
  privacy: string;
  underage: string;
  invalid: string;
  attestation: string;
  failed: string;
};

const COPY: Record<"vi" | "en", Copy> = {
  vi: {
    title: "Xác nhận phụ huynh",
    intro:
      "Nội dung trẻ em chỉ mở khi người giữ tài khoản đã xác nhận là người lớn.",
    signIn: "Đăng nhập để tiếp tục",
    signedOut:
      "Vui lòng đăng nhập bằng tài khoản của phụ huynh hoặc người giám hộ.",
    birthLabel: "Ngày sinh của phụ huynh/người giám hộ",
    checkbox: "Tôi xác nhận tôi là người lớn và là người chịu trách nhiệm cho tài khoản này.",
    submit: "Xác nhận và tiếp tục",
    saving: "Đang lưu...",
    privacy: "Ngày sinh chỉ dùng để kiểm tra tuổi trong trình duyệt và không được lưu.",
    underage: "Tài khoản cần được xác nhận bởi người lớn từ 18 tuổi trở lên.",
    invalid: "Vui lòng nhập ngày sinh hợp lệ.",
    attestation: "Vui lòng đánh dấu xác nhận.",
    failed: "Không lưu được xác nhận. Vui lòng thử lại.",
  },
  en: {
    title: "Parent confirmation",
    intro:
      "Kids content opens only after the account holder confirms they are an adult.",
    signIn: "Sign in to continue",
    signedOut: "Please sign in with a parent or guardian account.",
    birthLabel: "Parent or guardian date of birth",
    checkbox: "I confirm I am an adult and responsible for this account.",
    submit: "Confirm and continue",
    saving: "Saving...",
    privacy: "Date of birth is used only for the browser age check and is not stored.",
    underage: "This account must be confirmed by an adult age 18 or older.",
    invalid: "Enter a valid date of birth.",
    attestation: "Check the confirmation box to continue.",
    failed: "We could not save the confirmation. Please try again.",
  },
};

function safeReturnTo(search: string): string {
  const raw = new URLSearchParams(search).get("returnTo");
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/kids/vi-english";
  }
  return raw;
}

export default function ParentGatePage() {
  const [uiLang] = useLessonUiLang();
  const copy = COPY[uiLang === "en" ? "en" : "vi"];
  const { user, isLoading: authLoading } = useAuth();
  const profile = useProfileQuery(user?.id ?? null);
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = useMemo(() => safeReturnTo(location.search), [location.search]);
  const [birthDateIso, setBirthDateIso] = useState("");
  const [attested, setAttested] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (authLoading) return null;

  if (user && profile.data?.is_adult_confirmed === true) {
    return <Navigate to={returnTo} replace />;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);
    const result = await confirmAdultProfile({
      userId: user.id,
      birthDateIso,
      attested,
    });
    setSaving(false);
    if (result.ok) {
      await queryClient.invalidateQueries({ queryKey: qk.profile(user.id) });
      navigate(returnTo, { replace: true });
      return;
    }
    if (result.reason === "underage") setError(copy.underage);
    else if (result.reason === "not_attested") setError(copy.attestation);
    else if (
      result.reason === "invalid_birth_date" ||
      result.reason === "missing_birth_date"
    ) {
      setError(copy.invalid);
    } else {
      setError(copy.failed);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <section className="mx-auto max-w-xl">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">{copy.title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">{copy.intro}</p>

          {!user ? (
            <div className="mt-6">
              <p className="text-sm text-slate-600">{copy.signedOut}</p>
              <Link
                to={`/signin?returnTo=${encodeURIComponent(
                  `${location.pathname}${location.search}${location.hash}`,
                )}`}
                className="mt-5 inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                {copy.signIn}
              </Link>
            </div>
          ) : (
            <form className="mt-6 space-y-5" onSubmit={onSubmit}>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  {copy.birthLabel}
                </span>
                <input
                  type="date"
                  value={birthDateIso}
                  onChange={(event) => setBirthDateIso(event.target.value)}
                  className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-base shadow-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                  required
                />
              </label>

              <label className="flex gap-3 text-sm leading-6 text-slate-700">
                <input
                  type="checkbox"
                  checked={attested}
                  onChange={(event) => setAttested(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <span>{copy.checkbox}</span>
              </label>

              <p className="text-xs leading-5 text-slate-600">{copy.privacy}</p>

              {error ? (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? copy.saving : copy.submit}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
