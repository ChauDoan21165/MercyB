// src/pages/cultural-packs/VNCulturalPackPage.tsx
//
// Step 10 — /culture/vn/:packId individual pack page. Renders all
// phrases (with cultural notes) and the 2-3 dialogues.

import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getVnCulturalPack,
  type CulturalPack,
} from "@/data/cultural-packs/vn/culturalPackSchema";
import { Card, CardContent } from "@/components/ui/card";

export default function VNCulturalPackPage(): React.ReactElement {
  const { packId = "" } = useParams<{ packId: string }>();
  const pack = getVnCulturalPack(packId);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const previous = document.title;
    document.title = pack
      ? `${pack.title_vn} — Văn hoá Việt — MercyBlade`
      : "Không tìm thấy — MercyBlade";
    return () => {
      document.title = previous;
    };
  }, [pack]);

  if (!pack) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <h1 className="text-xl font-semibold text-slate-900">
          Không tìm thấy gói văn hoá
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Cultural pack not found. /{packId}
        </p>
        <Link to="/culture/vn" className="mt-4 text-amber-600 underline">
          ← Trở lại danh sách / Back to all packs
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <PackHeader pack={pack} />
      <PhrasesSection pack={pack} />
      <DialoguesSection pack={pack} />
      <footer className="mt-8 border-t border-slate-200 pt-4 text-center">
        <Link to="/culture/vn" className="text-sm text-amber-600 underline">
          ← Tất cả gói văn hoá / All cultural packs
        </Link>
      </footer>
    </main>
  );
}

function PackHeader({ pack }: { pack: CulturalPack }): React.ReactElement {
  return (
    <header className="mb-6">
      <p className="text-xs uppercase tracking-wide text-amber-700">
        Văn hoá Việt
      </p>
      <h1 className="mt-1 text-2xl font-semibold text-slate-900">
        {pack.title_vn}
      </h1>
      <p className="text-sm text-slate-600">{pack.title_en}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-700">
        {pack.summary_vn}
      </p>
      <p className="text-xs leading-relaxed text-slate-600">
        {pack.summary_en}
      </p>
      {pack.regional_note ? (
        <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          <p className="mb-1 font-semibold uppercase tracking-wide text-slate-600">
            Vùng miền / Regional note
          </p>
          <p className="leading-relaxed">{pack.regional_note}</p>
        </div>
      ) : null}
    </header>
  );
}

function PhrasesSection({ pack }: { pack: CulturalPack }): React.ReactElement {
  return (
    <section aria-labelledby="phrases-heading" className="space-y-3">
      <h2
        id="phrases-heading"
        className="text-sm font-semibold uppercase tracking-wide text-slate-700"
      >
        Cụm từ / Phrases ({pack.phrases.length})
      </h2>
      <ol className="space-y-3">
        {pack.phrases.map((phrase, i) => (
          <li key={phrase.id}>
            <Card>
              <CardContent className="space-y-2 p-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-amber-700">
                    {i + 1}.
                  </span>
                  <p className="text-sm font-semibold text-slate-900">
                    {phrase.vn_moment}
                  </p>
                </div>
                <p className="text-xs italic text-slate-600">
                  {phrase.context}
                </p>
                <blockquote className="border-l-2 border-amber-300 pl-3 text-sm leading-relaxed text-slate-800">
                  {phrase.english}
                </blockquote>
                <div className="rounded-md bg-slate-50 p-2 text-xs leading-relaxed text-slate-600">
                  <span className="font-semibold uppercase text-slate-600">
                    Cultural note:{" "}
                  </span>
                  {phrase.cultural_note}
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>
    </section>
  );
}

function DialoguesSection({ pack }: { pack: CulturalPack }): React.ReactElement {
  return (
    <section aria-labelledby="dialogues-heading" className="mt-8 space-y-3">
      <h2
        id="dialogues-heading"
        className="text-sm font-semibold uppercase tracking-wide text-slate-700"
      >
        Hội thoại mẫu / Sample dialogues
      </h2>
      <ul className="space-y-3">
        {pack.dialogues.map((dialogue, i) => (
          <li key={`d-${i}`}>
            <Card>
              <CardContent className="space-y-2 p-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  {dialogue.title}
                </h3>
                <p className="text-xs italic text-slate-600">
                  {dialogue.setting}
                </p>
                <ol className="mt-2 space-y-2">
                  {dialogue.lines.map((line, li) => (
                    <li key={li} className="text-sm">
                      <span className="font-semibold text-amber-700">
                        {line.speaker}:
                      </span>{" "}
                      <span className="text-slate-800">{line.english}</span>
                      {line.vn ? (
                        <p className="ml-4 text-xs italic text-slate-600">
                          {line.vn}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
