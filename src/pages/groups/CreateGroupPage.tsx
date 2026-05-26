import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { createGroup } from "@/lib/groups/studyGroupClient";

export default function CreateGroupPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <p className="text-sm text-black/70">
          <Link to="/signin" className="text-emerald-700 underline">
            Đăng nhập
          </Link>{" "}
          để tạo nhóm học tập.
        </p>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 80) {
      setError("Tên nhóm phải từ 2 đến 80 ký tự.");
      return;
    }
    setBusy(true);
    const created = await createGroup({
      userId: user.id,
      name: trimmed,
      description: description.trim() || null,
      isPrivate,
    });
    setBusy(false);
    if (!created) {
      setError("Tạo nhóm thất bại. Vui lòng thử lại.");
      return;
    }
    navigate(`/groups/${created.id}`);
  };

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <Link to="/groups" className="text-sm text-emerald-700 hover:underline">
        ← Tất cả nhóm
      </Link>

      <h1 className="text-2xl font-bold mt-3 mb-6">Tạo nhóm học tập</h1>

      <form onSubmit={submit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold">Tên nhóm *</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="VD: Luyện IELTS Speaking buổi tối"
            maxLength={80}
            className="px-3 py-2 rounded border border-black/15"
            required
            autoFocus
          />
          <span className="text-xs text-black/50">2 – 80 ký tự</span>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold">Mô tả</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mục tiêu, lịch học, nguyên tắc của nhóm…"
            rows={4}
            className="px-3 py-2 rounded border border-black/15 resize-y"
          />
        </label>

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="mt-1"
          />
          <div>
            <div className="text-sm font-semibold">Nhóm riêng tư</div>
            <div className="text-xs text-black/55">
              Chỉ người có mã mời mới tham gia được. Mã mời sẽ được tạo tự động.
            </div>
          </div>
        </label>

        {error ? (
          <p className="text-sm text-red-600" role="alert">{error}</p>
        ) : null}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={busy || name.trim().length < 2}
            className="px-4 py-2 rounded bg-emerald-600 text-white text-sm font-semibold disabled:opacity-50"
          >
            {busy ? "Đang tạo…" : "Tạo nhóm"}
          </button>
          <Link
            to="/groups"
            className="px-4 py-2 rounded border border-black/15 text-sm font-semibold no-underline text-inherit"
          >
            Huỷ
          </Link>
        </div>
      </form>
    </div>
  );
}
