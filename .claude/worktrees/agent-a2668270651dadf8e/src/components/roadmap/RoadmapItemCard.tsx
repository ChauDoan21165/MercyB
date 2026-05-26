import { useState } from "react";
import type { RoadmapItem } from "@/lib/roadmap/roadmapClient";

type Props = {
  item: RoadmapItem;
  hasVoted: boolean;
  canVote: boolean;
  onUpvote: (id: string) => Promise<void>;
  onRemoveVote: (id: string) => Promise<void>;
};

export function RoadmapItemCard({ item, hasVoted, canVote, onUpvote, onRemoveVote }: Props) {
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    if (!canVote || busy) return;
    setBusy(true);
    try {
      if (hasVoted) await onRemoveVote(item.id);
      else await onUpvote(item.id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-lg border border-black/10 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-base flex-1 min-w-0">{item.title}</h3>
        <button
          type="button"
          onClick={handleClick}
          disabled={!canVote || busy}
          aria-pressed={hasVoted}
          aria-label={hasVoted ? "Remove your vote" : "Upvote this item"}
          className={`shrink-0 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold border ${
            hasVoted
              ? "bg-emerald-100 text-emerald-900 border-emerald-300"
              : "bg-white text-black/70 border-black/15 hover:border-black/30"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span aria-hidden>▲</span>
          <span>{item.voteCount}</span>
        </button>
      </div>

      {item.descriptionVi ? (
        <p className="text-sm text-black/75 mt-2 whitespace-pre-wrap">
          {item.descriptionVi}
        </p>
      ) : null}
      {item.descriptionEn ? (
        <p className="text-xs text-black/55 mt-2 whitespace-pre-wrap italic">
          {item.descriptionEn}
        </p>
      ) : null}

      {item.status === "shipped" && item.shippedAt ? (
        <p className="text-xs text-emerald-700 mt-3">
          Đã ship · {new Date(item.shippedAt).toLocaleDateString("vi-VN")}
        </p>
      ) : null}
    </div>
  );
}
