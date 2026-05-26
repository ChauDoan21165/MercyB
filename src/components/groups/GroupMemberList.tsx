import type { StudyGroupMember } from "@/lib/groups/studyGroupClient";

type Props = {
  members: StudyGroupMember[];
  ownerUserId: string;
  currentUserId: string | null;
  onKick?: (userId: string) => void;
};

export function GroupMemberList({ members, ownerUserId, currentUserId, onKick }: Props) {
  if (members.length === 0) {
    return (
      <p className="text-sm text-black/50 italic">
        Chưa có thành viên nào.
      </p>
    );
  }

  const isOwner = currentUserId === ownerUserId;

  return (
    <ul className="divide-y divide-black/5">
      {members.map((m) => {
        const isMember = currentUserId === m.userId;
        const isMemberOwner = m.userId === ownerUserId;
        const canKick = Boolean(onKick) && isOwner && !isMemberOwner;
        return (
          <li key={m.userId} className="py-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-mono text-xs text-black/50 truncate">
                {m.userId.slice(0, 8)}
              </span>
              {isMember ? (
                <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-900">
                  Bạn
                </span>
              ) : null}
              {isMemberOwner ? (
                <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                  Chủ phòng
                </span>
              ) : (
                <span className="text-xs text-black/40">{m.role}</span>
              )}
            </div>
            {canKick ? (
              <button
                type="button"
                onClick={() => onKick?.(m.userId)}
                className="text-xs px-2 py-1 rounded border border-red-200 text-red-700 hover:bg-red-50"
              >
                Xoá
              </button>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
