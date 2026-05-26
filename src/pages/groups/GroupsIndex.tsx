import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import {
  getMyGroups,
  listPublicGroups,
  type StudyGroup,
} from "@/lib/groups/studyGroupClient";
import { GroupCard } from "@/components/groups/GroupCard";

type Tab = "mine" | "public";

export default function GroupsIndex() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("mine");
  const [mine, setMine] = useState<StudyGroup[]>([]);
  const [pub, setPub] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      user?.id ? getMyGroups(user.id) : Promise.resolve([]),
      listPublicGroups({ limit: 50 }),
    ]).then(([mineRes, pubRes]) => {
      if (cancelled) return;
      setMine(mineRes);
      setPub(pubRes);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const list = tab === "mine" ? mine : pub;

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Nhóm học tập</h1>
        <Link
          to="/groups/new"
          className="px-3 py-2 rounded bg-emerald-600 text-white text-sm font-semibold no-underline"
        >
          + Tạo nhóm
        </Link>
      </div>

      <div className="flex gap-2 mb-4 border-b border-black/10">
        <TabButton active={tab === "mine"} onClick={() => setTab("mine")}>
          Nhóm của tôi {mine.length > 0 ? `(${mine.length})` : ""}
        </TabButton>
        <TabButton active={tab === "public"} onClick={() => setTab("public")}>
          Khám phá {pub.length > 0 ? `(${pub.length})` : ""}
        </TabButton>
      </div>

      {loading ? (
        <p className="text-sm text-black/50">Đang tải…</p>
      ) : list.length === 0 ? (
        <EmptyState tab={tab} signedIn={Boolean(user?.id)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {list.map((g) => (
            <GroupCard key={g.id} group={g} />
          ))}
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 text-sm font-semibold border-b-2 -mb-px ${
        active
          ? "border-emerald-600 text-emerald-700"
          : "border-transparent text-black/55 hover:text-black/80"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ tab, signedIn }: { tab: Tab; signedIn: boolean }) {
  if (tab === "mine" && !signedIn) {
    return (
      <div className="text-sm text-black/60 py-8 text-center">
        <p>Đăng nhập để xem nhóm của bạn.</p>
        <Link to="/signin" className="text-emerald-700 underline mt-2 inline-block">
          Đăng nhập
        </Link>
      </div>
    );
  }
  if (tab === "mine") {
    return (
      <div className="text-sm text-black/60 py-8 text-center">
        <p>Bạn chưa tham gia nhóm nào.</p>
        <p className="mt-2">Khám phá các nhóm công khai hoặc tạo nhóm mới.</p>
      </div>
    );
  }
  return (
    <div className="text-sm text-black/60 py-8 text-center">
      <p>Chưa có nhóm công khai nào. Hãy là người đầu tiên tạo nhóm!</p>
    </div>
  );
}
