// src/components/leaderboard/WeeklyLeaderboardOptInPanel.tsx
//
// Account-page section that lets the user opt in to the public weekly
// leaderboard and pick a display name. Two-state UI:
//   - Off: toggle defaults off; no input field. Tap "Show me on the
//          leaderboard" → input appears + Save button.
//   - On:  input + "Save" + "Hide me" CTA. Save updates display_name;
//          Hide clears it (row stays, but disappears from public list).

import React, { useEffect, useState } from "react";
import { Trophy, Loader2, Check, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/AuthProvider";
import {
  getMyRank,
  setDisplayName,
  validateDisplayName,
} from "@/lib/leaderboard/weeklyLeaderboardClient";
import { WEEKLY_LB_COPY } from "./weeklyLeaderboardCopy";

interface PanelProps {
  /** Optional initial value pulled from elsewhere (e.g. profile name). */
  defaultName?: string;
}

type State =
  | { kind: "loading" }
  | { kind: "idle"; current: string | null }
  | { kind: "submitting" }
  | { kind: "saved"; current: string | null }
  | { kind: "error"; message: string; current: string | null };

export function WeeklyLeaderboardOptInPanel({ defaultName }: PanelProps) {
  const { user } = useAuth();
  const [state, setState] = useState<State>({ kind: "loading" });
  const [name, setName] = useState(defaultName ?? "");

  useEffect(() => {
    if (!user?.id) {
      setState({ kind: "idle", current: null });
      return;
    }
    let cancelled = false;
    void (async () => {
      const r = await getMyRank();
      if (cancelled) return;
      const current =
        r.onBoard && r.display_name && r.opted_in ? r.display_name : null;
      setState({ kind: "idle", current });
      if (current) setName(current);
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const errorMessageFor = (reason: string): string => {
    if (reason === "empty") return WEEKLY_LB_COPY.errorEmpty.vi;
    if (reason === "too_long") return WEEKLY_LB_COPY.errorTooLong.vi;
    if (reason === "disallowed_chars") return WEEKLY_LB_COPY.errorBadChars.vi;
    return WEEKLY_LB_COPY.errorGeneric.vi;
  };

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!user?.id) return;

    const validated = validateDisplayName(name);
    if (!validated.ok) {
      setState({
        kind: "error",
        message: errorMessageFor(validated.reason),
        current:
          state.kind === "idle" || state.kind === "saved" || state.kind === "error"
            ? state.current
            : null,
      });
      return;
    }

    setState({ kind: "submitting" });
    const result = await setDisplayName(user.id, validated.value);
    if (result.ok) {
      setState({ kind: "saved", current: validated.value });
    } else {
      setState({
        kind: "error",
        message: errorMessageFor(result.error),
        current:
          state.kind === "idle" || state.kind === "saved" || state.kind === "error"
            ? state.current
            : null,
      });
    }
  };

  const handleOptOut = async () => {
    if (!user?.id) return;
    setState({ kind: "submitting" });
    const result = await setDisplayName(user.id, null);
    if (result.ok) {
      setName("");
      setState({ kind: "idle", current: null });
    } else {
      setState({
        kind: "error",
        message: WEEKLY_LB_COPY.errorGeneric.vi,
        current: null,
      });
    }
  };

  if (!user) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        {WEEKLY_LB_COPY.signInToOptIn.vi}
      </div>
    );
  }

  const current =
    state.kind === "idle" || state.kind === "saved" || state.kind === "error"
      ? state.current
      : null;
  const isOptedIn = Boolean(current);

  return (
    <div className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50 p-4">
      <div className="flex items-center gap-2">
        <Trophy className="h-5 w-5 text-sky-600" />
        <p className="text-sm font-semibold text-slate-900">
          {WEEKLY_LB_COPY.optInTitle.vi}
        </p>
      </div>
      <p className="mt-1 text-xs text-slate-600">
        {WEEKLY_LB_COPY.optInBody.vi}
      </p>

      <form onSubmit={handleSave} className="mt-3 space-y-2">
        <label className="text-xs font-medium text-slate-700">
          {WEEKLY_LB_COPY.displayNameLabel.vi}
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={WEEKLY_LB_COPY.displayNamePlaceholder.vi}
          maxLength={30}
          disabled={state.kind === "loading" || state.kind === "submitting"}
        />
        <p className="text-[11px] text-slate-500">
          {WEEKLY_LB_COPY.emojiHint.vi}
        </p>

        {state.kind === "error" && (
          <p className="text-xs text-rose-700">{state.message}</p>
        )}
        {state.kind === "saved" && (
          <p className="inline-flex items-center gap-1 text-xs text-emerald-700">
            <Check className="h-3.5 w-3.5" />
            {WEEKLY_LB_COPY.savedFeedback.vi}
          </p>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            type="submit"
            size="sm"
            disabled={state.kind === "loading" || state.kind === "submitting"}
          >
            {state.kind === "submitting" && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {WEEKLY_LB_COPY.saveCta.vi}
          </Button>

          {isOptedIn && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleOptOut}
              disabled={state.kind === "submitting"}
            >
              <EyeOff className="mr-2 h-4 w-4" />
              {WEEKLY_LB_COPY.optOutCta.vi}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
