import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import { Mail, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { submitDiagnosticLead } from "@/lib/diagnosticLeads";

type DiagnosticContactGateProps = {
  children: ReactNode;
  profileRef: string;
};

const CAPTURED_KEY_PREFIX = "mb.diagnosticContactGate.captured.";

export default function DiagnosticContactGate({
  children,
  profileRef,
}: DiagnosticContactGateProps) {
  const capturedKey = useMemo(
    () => `${CAPTURED_KEY_PREFIX}${profileRef}`,
    [profileRef],
  );
  const [captured, setCaptured] = useState(() => {
    try {
      return window.sessionStorage.getItem(capturedKey) === "1";
    } catch {
      return false;
    }
  });
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [message, setMessage] = useState("");

  if (captured) return <>{children}</>;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");
    try {
      await submitDiagnosticLead({ contact, profileRef });
      try {
        window.sessionStorage.setItem(capturedKey, "1");
      } catch {
        // Non-critical: successful capture still unlocks the profile for this render.
      }
      setCaptured(true);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not save contact.");
    }
  }

  return (
    <section
      data-testid="diagnostic-contact-gate"
      className="mx-auto w-full max-w-[420px] rounded-[20px] border border-sky-200 bg-white p-4 shadow-[0_12px_32px_rgba(14,165,233,0.08)]"
    >
      <div className="rounded-2xl border border-sky-100 bg-sky-50/70 px-3 py-3">
        <p className="text-sm font-bold leading-snug text-slate-950">
          Hồ sơ của bạn đã sẵn sàng
        </p>
        <p className="mt-1 text-xs leading-snug text-slate-600">
          Your Interference Profile is ready.
        </p>
        <div className="mt-3 grid gap-2 text-xs leading-snug text-slate-700">
          <p>Ngữ pháp hay bị ảnh hưởng bởi tiếng Việt.</p>
          <p>Pronunciation patterns that deserve focused practice.</p>
          <p>Bài luyện phù hợp để bắt đầu ngay.</p>
        </div>
      </div>

      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <label htmlFor="diagnostic-contact" className="block text-sm font-semibold text-slate-900">
          Email hoặc Zalo
        </label>
        <input
          id="diagnostic-contact"
          data-testid="diagnostic-contact-input"
          type="text"
          value={contact}
          onChange={(event) => setContact(event.target.value)}
          placeholder="you@example.com hoặc +84..."
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          autoComplete="email"
        />
        {status === "error" && (
          <p data-testid="diagnostic-contact-error" className="text-xs font-medium text-rose-700">
            {message}
          </p>
        )}
        <Button
          type="submit"
          disabled={status === "saving"}
          className="h-11 w-full rounded-full"
        >
          <Mail className="mr-2 h-4 w-4" aria-hidden />
          {status === "saving" ? "Đang lưu..." : "Mở hồ sơ đầy đủ"}
        </Button>
        <p className="flex items-start gap-2 text-xs leading-snug text-slate-600">
          <MessageCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          Dùng email hoặc số Zalo để nhận lại hồ sơ này sau.
        </p>
      </form>
    </section>
  );
}
