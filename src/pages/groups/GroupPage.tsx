import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import {
  getGroupById,
  getGroupMembers,
  joinGroup,
  leaveGroup,
  kickMember,
  type StudyGroup,
  type StudyGroupMember,
  type JoinGroupError,
} from "@/lib/groups/studyGroupClient";
import { GroupMemberList } from "@/components/groups/GroupMemberList";
import { JoinGroupForm } from "@/components/groups/JoinGroupForm";

const JOIN_ERROR_LABELS: Record<JoinGroupError, string> = {
  not_signed_in: "Bạn cần đăng nhập để tham gia.",
  group_not_found: "Không tìm thấy nhóm này.",
  invalid_invite_code: "Mã mời không đúng.",
  rpc_failed: "Lỗi kết nối, vui lòng thử lại.",
};

export default function GroupPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [group, setGroup] = useState<StudyGroup | null>(null);
  const [members, setMembers] = useState<StudyGroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const [g, m] = await Promise.all([
      getGroupById(id),
      getGroupMembers(id),
    ]);
    setGroup(g);
    setMembers(m);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    void reload();
  }, [reload]);

  if (loading) {
    return <div className="px-4 py-6 text-sm text-black/50">Đang tải…</div>;
  }
  if (!group) {
    return (
      <div className="px-4 py-6 max-w-3xl mx-auto">
        <p className="text-sm text-black/60">Không tìm thấy nhóm.</p>
        <Link to="/groups" className="text-emerald-700 underline">← Về danh sách nhóm</Link>
      </div>
    );
  }

  const isMember = members.some((m) => m.userId === user?.id);
  const isOwner = user?.id === group.ownerUserId;

  const onJoin = async (code: string | null) => {
    setBusy(true);
    setJoinError(null);
    const result = await joinGroup(group.id, code);
    setBusy(false);
    if (result.ok) {
      await reload();
    } else {
      setJoinError(JOIN_ERROR_LABELS[result.error] ?? "Có lỗi xảy ra.");
    }
  };

  const onLeave = async () => {
    if (!user?.id) return;
    if (isOwner) {
      // Owner can't leave — would orphan the group. Direct them to delete instead.
      alert("Chủ nhóm không thể rời nhóm. Vui lòng xoá nhóm nếu muốn.");
      return;
    }
    setBusy(true);
    await leaveGroup(user.id, group.id);
    setBusy(false);
    await reload();
  };

  const onKick = async (userId: string) => {
    setBusy(true);
    const result = await kickMember(group.id, userId);
    setBusy(false);
    if (!result.ok) {
      alert(`Không thể xoá thành viên: ${result.error}`);
    }
    await reload();
  };

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <Link to="/groups" className="text-sm text-emerald-700 hover:underline">
        ← Tất cả nhóm
      </Link>

      <header className="mt-3 mb-6">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold">{group.name}</h1>
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
        {group.description ? (
          <p className="text-sm text-black/70 mt-2 whitespace-pre-wrap">
            {group.description}
          </p>
        ) : null}
        <p className="text-xs text-black/50 mt-3">
          {group.memberCount} thành viên · Tạo lúc{" "}
          {new Date(group.createdAt).toLocaleDateString("vi-VN")}
        </p>
        {isOwner && group.isPrivate && group.inviteCode ? (
          <p className="text-xs text-black/60 mt-2">
            Mã mời: <code className="font-mono bg-black/5 px-1.5 py-0.5 rounded">{group.inviteCode}</code>
          </p>
        ) : null}
      </header>

      <section className="mb-6">
        {!user ? (
          <p className="text-sm text-black/60">
            <Link to="/signin" className="text-emerald-700 underline">
              Đăng nhập
            </Link>{" "}
            để tham gia nhóm.
          </p>
        ) : isMember ? (
          <button
            type="button"
            onClick={onLeave}
            disabled={busy || isOwner}
            className="px-4 py-2 rounded border border-black/15 text-sm font-semibold disabled:opacity-50"
          >
            {isOwner ? "Bạn là chủ nhóm" : busy ? "Đang rời…" : "Rời nhóm"}
          </button>
        ) : (
          <JoinGroupForm
            isPrivate={group.isPrivate}
            onJoin={onJoin}
            busy={busy}
            errorMessage={joinError}
          />
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Thành viên</h2>
        <GroupMemberList
          members={members}
          ownerUserId={group.ownerUserId}
          currentUserId={user?.id ?? null}
          onKick={isOwner ? onKick : undefined}
        />
      </section>
    </div>
  );
}
