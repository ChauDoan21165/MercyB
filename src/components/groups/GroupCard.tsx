import { Link } from "react-router-dom";
import type { StudyGroup } from "@/lib/groups/studyGroupClient";

type Props = {
  group: StudyGroup;
};

export function GroupCard({ group }: Props) {
  return (
    <Link
      to={`/groups/${group.id}`}
      className="block rounded-lg border border-black/10 bg-white p-4 hover:border-black/20 transition-colors no-underline text-inherit"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-base truncate">{group.name}</h3>
          {group.description ? (
            <p className="text-sm text-black/60 mt-1 line-clamp-2">
              {group.description}
            </p>
          ) : null}
        </div>
        <span
          className={`shrink-0 text-xs px-2 py-1 rounded-full ${
            group.isPrivate
              ? "bg-amber-100 text-amber-900"
              : "bg-emerald-100 text-emerald-900"
          }`}
        >
          {group.isPrivate ? "Riêng tư" : "Công khai"}
        </span>
      </div>
      <div className="mt-3 text-xs text-black/50">
        {group.memberCount} {group.memberCount === 1 ? "thành viên" : "thành viên"}
      </div>
    </Link>
  );
}
