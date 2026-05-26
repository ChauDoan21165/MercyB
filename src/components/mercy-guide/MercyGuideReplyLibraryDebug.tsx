/**
 * Path: src/components/mercy-guide/MercyGuideReplyLibraryDebug.tsx
 */

import { useMemo, useState } from "react";
import { Copy, Download, RefreshCw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  clearMercyGuideReplyLibrary,
  getMercyGuideReplyLibrary,
  saveMercyGuideReplyRecord,
  type MercyGuideReplyRecord,
} from "./mercyGuideReplyLibrary";

function cleanText(value?: string | null): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function formatTimestamp(value?: string): string {
  const safe = cleanText(value);
  if (!safe) return "—";

  try {
    return new Date(safe).toLocaleString();
  } catch {
    return safe;
  }
}

function truncate(value?: string | null, max = 180): string {
  const safe = String(value ?? "").trim();
  if (safe.length <= max) return safe;
  return `${safe.slice(0, max)}…`;
}

function downloadJson(filename: string, data: unknown): void {
  if (typeof window === "undefined") return;

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json;charset=utf-8",
  });

  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.URL.revokeObjectURL(url);
}

async function copyText(value: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard) return false;

  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

interface ReplyRowProps {
  item: MercyGuideReplyRecord;
  onRefresh: () => void;
}

function ReplyRow({ item, onRefresh }: ReplyRowProps) {
  const [notes, setNotes] = useState<string>(item.notes ?? "");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleApproveToggle = (): void => {
    saveMercyGuideReplyRecord({
      ...item,
      approved: !item.approved,
      notes,
    });
    onRefresh();
  };

  const handleSaveNotes = (): void => {
    setIsSaving(true);

    saveMercyGuideReplyRecord({
      ...item,
      approved: Boolean(item.approved),
      notes,
    });

    onRefresh();

    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        setIsSaving(false);
      }, 250);
      return;
    }

    setIsSaving(false);
  };

  const handleDelete = (): void => {
    // deletion is not implemented in current library; stub to refresh
    onRefresh();
  };

  const handleCopyReply = async (): Promise<void> => {
    await copyText(item.reply);
  };

  return (
    <div className="rounded-xl border border-border bg-background p-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          {item.intent}
        </span>
        <span className="rounded-full border border-border px-2.5 py-1 text-xs">
          {item.language}
        </span>
        <span className="rounded-full border border-border px-2.5 py-1 text-xs">
          {item.source}
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            item.approved
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {item.approved ? "approved" : "review"}
        </span>
        <span className="ml-auto text-xs text-muted-foreground">
          {formatTimestamp(item.createdAt)}
        </span>
      </div>

      <div className="mt-3 space-y-2 text-sm">
        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            User input
          </div>
          <div className="whitespace-pre-wrap rounded-lg bg-muted/40 px-3 py-2">
            {item.userInput || "—"}
          </div>
        </div>

        {cleanText(item.payload) ? (
          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Payload
            </div>
            <div className="whitespace-pre-wrap rounded-lg bg-muted/40 px-3 py-2">
              {truncate(item.payload, 320)}
            </div>
          </div>
        ) : null}

        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Reply
          </div>
          <div className="whitespace-pre-wrap rounded-lg bg-muted/40 px-3 py-2">
            {item.reply || "—"}
          </div>
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          <div className="rounded-lg border border-border/70 px-3 py-2 text-xs text-muted-foreground">
            <div>roomTitle: {item.roomTitle || "—"}</div>
            <div>tier: {item.tier || "—"}</div>
            <div>pathSlug: {item.pathSlug || "—"}</div>
          </div>
          <div className="rounded-lg border border-border/70 px-3 py-2 text-xs text-muted-foreground">
            <div>englishLevel: {item.englishLevel || "—"}</div>
            <div>learningGoal: {item.learningGoal || "—"}</div>
            <div>tags: {(item.tags ?? []).join(", ") || "—"}</div>
          </div>
        </div>

        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Notes
          </div>
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Why is this reply good or reusable?"
            className="h-10"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleApproveToggle}
        >
          {item.approved ? "Unapprove" : "Approve"}
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleSaveNotes}
          disabled={isSaving}
        >
          Save notes
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            void handleCopyReply();
          }}
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy reply
        </Button>

        <Button type="button" size="sm" variant="outline" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}

export function MercyGuideReplyLibraryDebug() {
  const [query, setQuery] = useState<string>("");
  const [version, setVersion] = useState<number>(0);

  const refresh = (): void => setVersion((prev) => prev + 1);

  const rows = useMemo(() => getMercyGuideReplyLibrary(), [version]);

  const filtered = useMemo(() => {
    const safeQuery = cleanText(query).toLowerCase();
    if (!safeQuery) return rows;

    return rows.filter((item) => {
      return [
        item.intent,
        item.language,
        item.source,
        item.userInput,
        item.payload,
        item.reply,
        item.roomTitle,
        item.tier,
        item.pathSlug,
        item.notes,
        ...(item.tags ?? []),
      ]
        .map((value) => cleanText(value).toLowerCase())
        .some((value) => value.includes(safeQuery));
    });
  }, [rows, query]);

  const approvedCount = rows.filter((item) => item.approved).length;

  const exportRows = useMemo(() => rows, [rows]);

  const handleExportJson = (): void => {
    downloadJson("mercy-guide-reply-library.json", exportRows);
  };

  const handleCopyExport = async (): Promise<void> => {
    await copyText(JSON.stringify(exportRows, null, 2));
  };

  const handleClearAll = (): void => {
    clearMercyGuideReplyLibrary();
    refresh();
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Mercy Guide Reply Library
          </h3>
          <p className="text-sm text-muted-foreground">
            Review strong API replies and promote the good ones later.
          </p>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Button type="button" size="sm" variant="outline" onClick={refresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              void handleCopyExport();
            }}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy export
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleExportJson}
          >
            <Download className="mr-2 h-4 w-4" />
            Export JSON
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleClearAll}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear all
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto]">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by intent, source, room, text, notes..."
          className="h-10"
        />

        <div className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground">
          Total: <span className="font-semibold text-foreground">{rows.length}</span>
        </div>

        <div className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground">
          Approved:{" "}
          <span className="font-semibold text-foreground">{approvedCount}</span>
        </div>
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-3 pr-1">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              No saved replies yet.
            </div>
          ) : (
            filtered.map((item) => (
              <ReplyRow key={item.id} item={item} onRefresh={refresh} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MercyGuideReplyLibraryDebug;