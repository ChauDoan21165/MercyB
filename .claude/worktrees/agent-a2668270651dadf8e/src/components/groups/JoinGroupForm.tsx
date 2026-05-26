import { useState } from "react";

type Props = {
  isPrivate: boolean;
  onJoin: (inviteCode: string | null) => Promise<void>;
  busy?: boolean;
  errorMessage?: string | null;
};

export function JoinGroupForm({ isPrivate, onJoin, busy, errorMessage }: Props) {
  const [code, setCode] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (isPrivate) {
      if (code.trim().length === 0) return;
      await onJoin(code.trim());
    } else {
      await onJoin(null);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      {isPrivate ? (
        <input
          type="text"
          inputMode="text"
          autoCapitalize="characters"
          placeholder="Mã mời (8 ký tự)"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={16}
          className="px-3 py-2 rounded border border-black/15 text-sm font-mono"
          aria-label="Invite code"
        />
      ) : null}
      <button
        type="submit"
        disabled={busy || (isPrivate && code.trim().length === 0)}
        className="px-4 py-2 rounded bg-emerald-600 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {busy ? "Đang tham gia…" : "Tham gia nhóm"}
      </button>
      {errorMessage ? (
        <p className="text-xs text-red-600" role="alert">{errorMessage}</p>
      ) : null}
    </form>
  );
}
