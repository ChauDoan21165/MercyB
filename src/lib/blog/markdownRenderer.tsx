// Tiny markdown → React renderer.
//
// Why hand-rolled instead of react-markdown:
//   - No new runtime dep.
//   - We only need the subset Chau will actually write (h1-h3, paragraphs,
//     bullet/ordered lists, bold, italic, inline code, links,
//     blockquotes, fenced code, hr).
//   - Vietnamese typography needs explicit line-height + font tweaks;
//     wrapping every node in a custom component renderer fights with
//     a generic library.
//
// Out of scope: tables, footnotes, images-in-markdown (use frontmatter
// cover_image), HTML pass-through. If a future post needs those, add
// them here rather than swapping libs.

import React from "react";

type Block =
  | { kind: "h1" | "h2" | "h3"; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul" | "ol"; items: string[] }
  | { kind: "blockquote"; text: string }
  | { kind: "code"; text: string; lang: string }
  | { kind: "hr" };

export function renderMarkdown(src: string, locale: "vi" | "en" = "vi"): React.ReactNode {
  const blocks = parseBlocks(src);
  const isVN = locale === "vi";

  // Vietnamese diacritics need a touch more line-height than EN.
  const proseClass = isVN
    ? "leading-[1.8] text-[16px] text-slate-800"
    : "leading-[1.7] text-[16px] text-slate-800";

  return (
    <article className={`prose-mb ${proseClass}`} lang={locale}>
      {blocks.map((block, i) => renderBlock(block, i))}
    </article>
  );
}

function renderBlock(block: Block, i: number): React.ReactNode {
  switch (block.kind) {
    case "h1":
      return (
        <h1
          key={i}
          className="mt-8 mb-3 text-[28px] font-black tracking-tight text-slate-900"
        >
          {renderInline(block.text)}
        </h1>
      );
    case "h2":
      return (
        <h2
          key={i}
          className="mt-7 mb-3 text-[22px] font-black tracking-tight text-slate-900"
        >
          {renderInline(block.text)}
        </h2>
      );
    case "h3":
      return (
        <h3
          key={i}
          className="mt-5 mb-2 text-[18px] font-black tracking-tight text-slate-800"
        >
          {renderInline(block.text)}
        </h3>
      );
    case "p":
      return (
        <p key={i} className="my-3">
          {renderInline(block.text)}
        </p>
      );
    case "ul":
      return (
        <ul key={i} className="my-3 ml-6 list-disc space-y-1">
          {block.items.map((item, j) => (
            <li key={j}>{renderInline(item)}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={i} className="my-3 ml-6 list-decimal space-y-1">
          {block.items.map((item, j) => (
            <li key={j}>{renderInline(item)}</li>
          ))}
        </ol>
      );
    case "blockquote":
      return (
        <blockquote
          key={i}
          className="my-4 border-l-4 border-indigo-300 bg-indigo-50/60 px-4 py-2 italic text-slate-700"
        >
          {renderInline(block.text)}
        </blockquote>
      );
    case "code":
      return (
        <pre
          key={i}
          className="my-4 overflow-x-auto rounded-lg bg-slate-900 px-4 py-3 text-[13px] text-slate-100"
        >
          <code>{block.text}</code>
        </pre>
      );
    case "hr":
      return <hr key={i} className="my-6 border-slate-200" />;
  }
}

// ── Block parser ─────────────────────────────────────────────────────────

function parseBlocks(src: string): Block[] {
  const lines = src.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block.
    if (/^```/.test(line)) {
      const lang = line.replace(/^```/, "").trim();
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      blocks.push({ kind: "code", text: buf.join("\n"), lang });
      continue;
    }

    // Horizontal rule.
    if (/^---+\s*$/.test(line)) {
      blocks.push({ kind: "hr" });
      i++;
      continue;
    }

    // Heading.
    const h = /^(#{1,3})\s+(.+)$/.exec(line);
    if (h) {
      const level = h[1].length;
      blocks.push({
        kind: (`h${level}`) as "h1" | "h2" | "h3",
        text: h[2].trim(),
      });
      i++;
      continue;
    }

    // Blockquote.
    if (/^>\s+/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s+/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s+/, ""));
        i++;
      }
      blocks.push({ kind: "blockquote", text: buf.join(" ") });
      continue;
    }

    // Unordered list.
    if (/^[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*+]\s+/, ""));
        i++;
      }
      blocks.push({ kind: "ul", items });
      continue;
    }

    // Ordered list.
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ kind: "ol", items });
      continue;
    }

    // Blank line.
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph — accumulate non-blank lines.
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{1,3}\s|>\s|[-*+]\s|\d+\.\s|---+\s*$|```)/.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    blocks.push({ kind: "p", text: para.join(" ") });
  }

  return blocks;
}

// ── Inline parser ─────────────────────────────────────────────────────────
//
// Order of tokens matters: code first (prevents `**` inside `` ` ``),
// then links, then bold/italic.

const TOKEN_RE =
  /(`[^`]+`|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_)/g;

function renderInline(src: string): React.ReactNode {
  if (!src) return null;
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;

  for (const m of src.matchAll(TOKEN_RE)) {
    const start = m.index ?? 0;
    if (start > last) out.push(src.slice(last, start));
    const tok = m[0];

    if (tok.startsWith("`")) {
      out.push(
        <code
          key={`c${key++}`}
          className="rounded bg-slate-100 px-1.5 py-0.5 text-[13px] text-slate-800"
        >
          {tok.slice(1, -1)}
        </code>,
      );
    } else if (tok.startsWith("[")) {
      const linkM = /\[([^\]]+)\]\(([^)]+)\)/.exec(tok);
      if (linkM) {
        const isExternal = /^https?:\/\//.test(linkM[2]);
        out.push(
          <a
            key={`a${key++}`}
            href={linkM[2]}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer noopener" : undefined}
            className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700"
          >
            {linkM[1]}
          </a>,
        );
      } else {
        out.push(tok);
      }
    } else if (tok.startsWith("**") || tok.startsWith("__")) {
      out.push(
        <strong key={`b${key++}`} className="font-bold">
          {tok.slice(2, -2)}
        </strong>,
      );
    } else if (tok.startsWith("*") || tok.startsWith("_")) {
      out.push(
        <em key={`i${key++}`} className="italic">
          {tok.slice(1, -1)}
        </em>,
      );
    }
    last = start + tok.length;
  }

  if (last < src.length) out.push(src.slice(last));
  return out;
}
