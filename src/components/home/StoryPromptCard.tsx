// Home-page card that asks an eligible user to share their MercyBlade
// story. Self-gates via storyPromptGate so it only renders when:
//   - user is eligible (paid, 21+ days, 50+ attempts, sustained progress)
//   - we have not shown this card in the last 30 days
//
// "Có, tôi muốn chia sẻ"   → /stories/share
// "Để sau"                  → record dismiss + hide for 30 days
//
// The card is dismissable inline; we never re-render it within the same
// session after dismiss.

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "@/providers/AuthProvider";
import {
  recordPromptDismissed,
  recordPromptShown,
  shouldShowStoryPrompt,
} from "@/lib/stories/storyPromptGate";

export default function StoryPromptCard(): React.ReactElement | null {
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!user?.id) return;
    (async () => {
      const ok = await shouldShowStoryPrompt(user.id);
      if (cancelled) return;
      if (ok) {
        setShow(true);
        await recordPromptShown(user.id);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  async function dismiss() {
    if (user?.id) await recordPromptDismissed(user.id);
    setDismissed(true);
  }

  if (!show || dismissed) return null;

  return (
    <section
      aria-label="Lời mời chia sẻ câu chuyện"
      className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm"
    >
      <h3 className="text-base font-bold text-amber-900">
        Bạn đã có một câu chuyện đáng kể.
      </h3>
      <p className="mt-1 text-sm text-amber-800">
        Câu chuyện của bạn có thể giúp người Việt khác tin rằng họ cũng làm được.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          to="/stories/share"
          className="rounded-full bg-amber-500 px-4 py-1.5 text-xs font-bold text-white"
        >
          Có, tôi muốn chia sẻ
        </Link>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-full border border-amber-300 bg-white px-4 py-1.5 text-xs font-semibold text-amber-800"
        >
          Để sau
        </button>
      </div>
    </section>
  );
}
