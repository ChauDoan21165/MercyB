import { useMemo, useState } from "react";
import { Copy, Download, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePlacementT, type PlacementNativeSlots } from "@/components/placement/nativeCopy";
import { PRODUCT_CONFIG } from "@/config/product";
import { useToast } from "@/hooks/use-toast";
import {
  buildInterferenceProfileFindings,
  formatInterferenceProfileShareText,
  generateInterferenceProfileCardBlob,
  INTERFERENCE_PROFILE_SITE_URL,
  type InterferenceProfileFinding,
} from "@/lib/share/interferenceProfile";
import type { PlacementV3Results } from "@/lib/placement/v3/types";

type Props = {
  results: PlacementV3Results;
};

const HEADING: PlacementNativeSlots = {
  vi: "Chia sẻ hồ sơ Interference",
  en: "Share Interference Profile",
};

const SUBHEAD: PlacementNativeSlots = {
  vi: "Một thẻ riêng tư, tạo ngay trên máy của bạn: chỉ 3 pattern và ví dụ, không có email hay ID tài khoản.",
  en: "A private client-side card: only 3 patterns and examples, no email or account ID.",
};

const CARD_TITLE: PlacementNativeSlots = {
  vi: "Dấu vết tiếng mẹ đẻ",
  en: "Interference Profile",
};

const CARD_SUBTITLE: PlacementNativeSlots = {
  vi: "Top 3 ảnh hưởng từ tiếng Việt",
  en: "Top 3 Vietnamese-L1 patterns",
};

const EXAMPLE_LABEL: PlacementNativeSlots = {
  vi: "Ví dụ",
  en: "Example",
};

const SHARE_LABEL: PlacementNativeSlots = {
  vi: "Chia sẻ",
  en: "Share",
};

const DOWNLOAD_LABEL: PlacementNativeSlots = {
  vi: "Tải ảnh",
  en: "Download image",
};

const COPY_LABEL: PlacementNativeSlots = {
  vi: "Copy link",
  en: "Copy link",
};

export function InterferenceProfileShare({ results }: Props) {
  const t = usePlacementT();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const findings = useMemo(() => buildInterferenceProfileFindings(results), [results]);
  // Share cards are generated entirely in the client and carry only pattern labels/examples.
  // Keep the visible URL canonical so dev and preview builds never produce localhost cards.
  const siteUrl = INTERFERENCE_PROFILE_SITE_URL;

  if (!findings.length) return null;

  async function buildBlob(): Promise<Blob> {
    return await generateInterferenceProfileCardBlob({ findings, siteUrl });
  }

  async function handleShare(): Promise<void> {
    setBusy(true);
    try {
      const blob = await buildBlob();
      const file = new File([blob], "mercyblade-interference-profile.png", { type: "image/png" });
      const text = formatInterferenceProfileShareText(findings, siteUrl);

      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        try {
          const canShareFiles =
            typeof navigator.canShare === "function" ? navigator.canShare({ files: [file] }) : false;
          if (canShareFiles) {
            await navigator.share({ files: [file], title: "MercyBlade Interference Profile", text, url: siteUrl });
            return;
          }
          await navigator.share({ title: "MercyBlade Interference Profile", text, url: siteUrl });
          return;
        } catch (error) {
          if ((error as { name?: string })?.name === "AbortError") return;
        }
      }

      downloadBlob(blob);
      await copySiteLink(siteUrl);
    } finally {
      setBusy(false);
    }
  }

  async function handleDownload(): Promise<void> {
    setBusy(true);
    try {
      downloadBlob(await buildBlob());
    } finally {
      setBusy(false);
    }
  }

  async function handleCopy(): Promise<void> {
    const copied = await copySiteLink(siteUrl);
    if (copied) toast({ title: "Đã copy link / Link copied" });
  }

  return (
    <section
      data-testid="interference-profile-share"
      className="mt-6 rounded-[14px] border border-emerald-200 bg-emerald-50/60 p-4"
    >
      <header>
        <h3 className="text-sm font-black text-slate-900">{t(HEADING)}</h3>
        <p className="mt-1 text-xs font-medium leading-5 text-slate-600">{t(SUBHEAD)}</p>
      </header>

      <InterferenceProfileCard findings={findings} siteUrl={siteUrl} />

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={() => void handleShare()} disabled={busy}>
          <Share2 className="h-4 w-4" aria-hidden />
          {t(SHARE_LABEL)}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => void handleDownload()} disabled={busy}>
          <Download className="h-4 w-4" aria-hidden />
          {t(DOWNLOAD_LABEL)}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => void handleCopy()}>
          <Copy className="h-4 w-4" aria-hidden />
          {t(COPY_LABEL)}
        </Button>
      </div>
    </section>
  );
}

function InterferenceProfileCard({
  findings,
  siteUrl,
}: {
  findings: InterferenceProfileFinding[];
  siteUrl: string;
}) {
  return (
    <article
      data-testid="interference-profile-card"
      className="mt-4 overflow-hidden rounded-[8px] border border-emerald-200 bg-white shadow-sm"
    >
      <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-orange-50 p-4">
        <div className="text-xs font-black uppercase text-emerald-700">{PRODUCT_CONFIG.name}</div>
        <h4 className="mt-2 text-xl font-black leading-tight text-slate-950">{CARD_TITLE.vi}</h4>
        <p className="mt-1 text-sm font-bold text-slate-700">{CARD_TITLE.en}</p>
        <p className="mt-1 text-xs font-bold text-slate-600">
          {CARD_SUBTITLE.vi} · {CARD_SUBTITLE.en}
        </p>
      </div>
      <ol className="grid gap-3 p-4">
        {findings.map((finding, index) => (
          <li key={finding.id} className="grid grid-cols-[32px_1fr] gap-3">
            <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-black text-white ${badgeTone(finding.severity)}`}>
              {index + 1}
            </span>
            <div>
              <div className="text-sm font-black leading-5 text-slate-900">{finding.label.vi || finding.label.en}</div>
              {finding.label.en && finding.label.en !== finding.label.vi ? (
                <div className="text-xs font-bold leading-5 text-slate-600">{finding.label.en}</div>
              ) : null}
              {finding.example ? (
                <div className="mt-1 text-xs font-medium leading-5 text-slate-600">
                  <span className="font-bold text-slate-700">
                    {EXAMPLE_LABEL.vi} / {EXAMPLE_LABEL.en}:{" "}
                  </span>
                  {finding.example.en || finding.example.vi}
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-3 text-xs font-bold text-emerald-700">
        <span>{siteUrl}</span>
      </footer>
    </article>
  );
}

function badgeTone(severity: InterferenceProfileFinding["severity"]): string {
  if (severity === "high") return "bg-rose-600";
  if (severity === "medium") return "bg-amber-600";
  return "bg-emerald-700";
}

function downloadBlob(blob: Blob): void {
  if (typeof document === "undefined") return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mercyblade-interference-profile.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function copySiteLink(siteUrl: string): Promise<boolean> {
  if (typeof navigator === "undefined" || typeof navigator.clipboard?.writeText !== "function") return false;
  try {
    await navigator.clipboard.writeText(siteUrl);
    return true;
  } catch {
    return false;
  }
}

export default InterferenceProfileShare;
