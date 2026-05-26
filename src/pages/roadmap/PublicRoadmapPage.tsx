import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import {
  listPublicRoadmap,
  getMyVotes,
  upvote,
  removeVote,
  type RoadmapItem,
} from "@/lib/roadmap/roadmapClient";
import { RoadmapColumn } from "@/components/roadmap/RoadmapColumn";
import { RoadmapItemCard } from "@/components/roadmap/RoadmapItemCard";

export default function PublicRoadmapPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [myVotes, setMyVotes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const [list, votes] = await Promise.all([
      listPublicRoadmap(),
      user?.id ? getMyVotes(user.id) : Promise.resolve(new Set<string>()),
    ]);
    setItems(list);
    setMyVotes(votes);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const onUpvote = async (id: string) => {
    if (!user?.id) return;
    const result = await upvote(user.id, id);
    if (result.ok) {
      setMyVotes((prev) => new Set(prev).add(id));
      await reload();
    }
  };

  const onRemoveVote = async (id: string) => {
    if (!user?.id) return;
    const result = await removeVote(user.id, id);
    if (result.ok) {
      setMyVotes((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      await reload();
    }
  };

  const planned     = items.filter((i) => i.status === "planned");
  const inProgress  = items.filter((i) => i.status === "in_progress");
  const shipped     = items.filter((i) => i.status === "shipped").slice(0, 10);

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Lộ trình MercyBlade</h1>
        <p className="text-sm text-black/65 mt-1">
          Mercy đang xây gì, đang làm gì, đã ship gì.
          {user
            ? " Nhấn ▲ để vote cho điều bạn muốn nhất."
            : " "}
          {!user ? (
            <Link to="/signin" className="text-emerald-700 underline ml-1">
              Đăng nhập để vote.
            </Link>
          ) : null}
        </p>
      </header>

      {loading ? (
        <p className="text-sm text-black/50">Đang tải…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RoadmapColumn
            title="Sắp làm"
            subtitle="Đã lên kế hoạch"
            badgeColor="blue"
            empty="Chưa có gì trong hàng đợi."
            isEmpty={planned.length === 0}
          >
            {planned.map((item) => (
              <RoadmapItemCard
                key={item.id}
                item={item}
                hasVoted={myVotes.has(item.id)}
                canVote={Boolean(user)}
                onUpvote={onUpvote}
                onRemoveVote={onRemoveVote}
              />
            ))}
          </RoadmapColumn>

          <RoadmapColumn
            title="Đang làm"
            subtitle="Trong tuần / tháng này"
            badgeColor="amber"
            empty="Không có gì đang chạy lúc này."
            isEmpty={inProgress.length === 0}
          >
            {inProgress.map((item) => (
              <RoadmapItemCard
                key={item.id}
                item={item}
                hasVoted={myVotes.has(item.id)}
                canVote={Boolean(user)}
                onUpvote={onUpvote}
                onRemoveVote={onRemoveVote}
              />
            ))}
          </RoadmapColumn>

          <RoadmapColumn
            title="Đã ship"
            subtitle="Mười lần ship gần nhất"
            badgeColor="emerald"
            empty="Chưa có gì."
            isEmpty={shipped.length === 0}
          >
            {shipped.map((item) => (
              <RoadmapItemCard
                key={item.id}
                item={item}
                hasVoted={myVotes.has(item.id)}
                canVote={Boolean(user)}
                onUpvote={onUpvote}
                onRemoveVote={onRemoveVote}
              />
            ))}
          </RoadmapColumn>
        </div>
      )}

      <footer className="mt-10 text-xs text-black/50">
        Phản hồi từ bạn dẫn dắt thứ tự ưu tiên. Vote ở đây hoặc gửi tin
        qua nút phản hồi (góc phải) — Mercy đọc hết.
      </footer>
    </div>
  );
}
