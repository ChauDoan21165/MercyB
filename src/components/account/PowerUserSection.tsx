// src/components/account/PowerUserSection.tsx
//
// Step 11 — power-user surface that lives on /account: progress
// export (CSV/JSON) and a streak share button (links to the existing
// /share/progress page or pops the in-place ShareableStreakCard).
//
// Self-contained — picks up streak/display name from profiles so the
// AccountPage host doesn't need to wire any extra props.

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { exportToCsv, exportToJson } from "@/lib/export/progressExport";
import { supabase } from "@/lib/supabaseClient";
import ShareableStreakCard from "@/components/share/ShareableStreakCard";
import { useToast } from "@/hooks/use-toast";

interface PowerUserSectionProps {
  userId: string;
  displayName: string;
}

const sectionStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid rgba(154,52,18,0.15)",
  borderRadius: 14,
  padding: 20,
  marginTop: 20,
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  background: "#fff7ed",
  color: "#9a3412",
  fontWeight: 600,
  cursor: "pointer",
};

const buttonRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginTop: 12,
};

export default function PowerUserSection({
  userId,
  displayName,
}: PowerUserSectionProps): React.ReactElement {
  const [busy, setBusy] = useState<"csv" | "json" | null>(null);
  const [showStreak, setShowStreak] = useState(false);
  const [streak, setStreak] = useState<number>(0);
  const [longestStreak, setLongestStreak] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    void supabase
      .from("profiles")
      .select("streak_current, streak_longest")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data) return;
        const row = data as { streak_current?: number; streak_longest?: number };
        setStreak(row.streak_current ?? 0);
        setLongestStreak(row.streak_longest ?? 0);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function handleExport(format: "csv" | "json"): Promise<void> {
    if (!userId) return;
    setBusy(format);
    try {
      const result =
        format === "csv" ? await exportToCsv(userId) : await exportToJson(userId);
      triggerDownload(result.blob, result.filename);
      toast({
        title: "Đã tải / Downloaded",
        description: result.filename,
      });
    } catch (err) {
      toast({
        title: "Không tải được / Export failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setBusy(null);
    }
  }

  return (
    <section style={sectionStyle} aria-labelledby="power-user-heading">
      <h2
        id="power-user-heading"
        style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a" }}
      >
        Power-user / Người dùng nâng cao
      </h2>
      <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
        Phím tắt, xuất dữ liệu tiến độ, và chia sẻ chuỗi ngày học. Miễn phí
        cho mọi người dùng.
      </p>

      <div style={{ marginTop: 16 }}>
        <h3 style={subHeaderStyle}>
          Phím tắt / Keyboard shortcuts
        </h3>
        <p style={smallStyle}>
          Bấm <kbd style={kbdStyle}>?</kbd> bất cứ lúc nào để mở danh sách phím tắt.
        </p>
      </div>

      <div style={{ marginTop: 16 }}>
        <h3 style={subHeaderStyle}>
          Xuất dữ liệu / Export progress
        </h3>
        <p style={smallStyle}>
          Tải dữ liệu học tập của bạn dưới dạng CSV (Excel) hoặc JSON.
        </p>
        <div style={buttonRowStyle}>
          <button
            type="button"
            style={buttonStyle}
            disabled={busy !== null}
            onClick={() => void handleExport("csv")}
          >
            {busy === "csv" ? "Đang tải…" : "Tải CSV / Download CSV"}
          </button>
          <button
            type="button"
            style={buttonStyle}
            disabled={busy !== null}
            onClick={() => void handleExport("json")}
          >
            {busy === "json" ? "Đang tải…" : "Tải JSON / Download JSON"}
          </button>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <h3 style={subHeaderStyle}>
          Chia sẻ chuỗi ngày học / Share streak
        </h3>
        <p style={smallStyle}>
          Tạo ảnh PNG đẹp để đăng Facebook hoặc Zalo.
        </p>
        <div style={buttonRowStyle}>
          <button
            type="button"
            style={buttonStyle}
            onClick={() => setShowStreak((v) => !v)}
          >
            {showStreak ? "Ẩn / Hide" : "Tạo ảnh / Generate"}
          </button>
          <Link
            to="/share/progress"
            style={{ ...buttonStyle, textDecoration: "none", display: "inline-block" }}
          >
            Trang chia sẻ đầy đủ / Full share page
          </Link>
        </div>
        {showStreak ? (
          <div style={{ marginTop: 12 }}>
            <ShareableStreakCard
              streak={streak}
              displayName={displayName}
              longestStreak={longestStreak}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const subHeaderStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 13,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: "#92400e",
};

const smallStyle: React.CSSProperties = {
  margin: "4px 0 0",
  fontSize: 13,
  color: "#475569",
};

const kbdStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "1px 6px",
  borderRadius: 4,
  border: "1px solid #cbd5e1",
  background: "#f1f5f9",
  fontFamily:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  fontSize: 12,
  fontWeight: 600,
};
