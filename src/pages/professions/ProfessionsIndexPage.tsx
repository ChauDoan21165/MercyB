// src/pages/professions/ProfessionsIndexPage.tsx — /professions
//
// Vocational-English landing. Today: Nail Technician, Restaurant,
// Customer Service, and Tech Worker — all active. Each card opens a
// focused vertical.

import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Utensils, Headset, Code2, ArrowRight, Lock } from "lucide-react";

const HERO_VI = "Tiếng Anh nghề nghiệp cho người Việt";
const HERO_EN = "Vocational English for Vietnamese workers";
const SUBTITLE_VI =
  "Mỗi gói nghề là tiếng Anh thực tế cho công việc thật — không phải sách giáo khoa.";

type Card = {
  slug: string;
  title_vi: string;
  title_en: string;
  blurb_vi: string;
  href: string | null;
  status: "active" | "soon";
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  accent: string;
};

const CARDS: Card[] = [
  {
    slug: "nail-tech",
    title_vi: "Tiếng Anh cho thợ nail",
    title_en: "Nail Technician",
    blurb_vi:
      "50 bài: chào khách, menu dịch vụ, trò chuyện, xử lý phàn nàn, thanh toán + tip.",
    href: "/professions/nail-tech",
    status: "active",
    Icon: Sparkles,
    accent: "rose",
  },
  {
    slug: "restaurant",
    title_vi: "Tiếng Anh nhà hàng",
    title_en: "Restaurant",
    blurb_vi:
      "50 bài: chào khách, gọi nước, menu, dị ứng, phàn nàn, giới thiệu món Việt, thanh toán + tip.",
    href: "/professions/restaurant",
    status: "active",
    Icon: Utensils,
    accent: "amber",
  },
  {
    slug: "customer-service",
    title_vi: "Tiếng Anh chăm sóc khách",
    title_en: "Customer Service",
    blurb_vi:
      "50 bài: mở cuộc gọi, lắng nghe chủ động, hạ nhiệt khách giận, từ chối khéo, chuyển cuộc gọi, xử lý khiếu nại.",
    href: "/professions/customer-service",
    status: "active",
    Icon: Headset,
    accent: "sky",
  },
  {
    slug: "tech-worker",
    title_vi: "Tiếng Anh dành cho dân tech",
    title_en: "Tech Worker",
    blurb_vi:
      "50 bài: phỏng vấn kỹ thuật, standup, review PR, báo bug, demo, on-call, đàm phán lương, bất đồng nhóm.",
    href: "/professions/tech-worker",
    status: "active",
    Icon: Code2,
    accent: "indigo",
  },
];

const ACCENT_CLASSES: Record<string, { border: string; bg: string; icon: string }> = {
  rose: {
    border: "border-rose-200",
    bg: "bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50",
    icon: "text-rose-600",
  },
  amber: {
    border: "border-amber-200",
    bg: "bg-gradient-to-br from-amber-50 to-orange-50",
    icon: "text-amber-600",
  },
  sky: {
    border: "border-sky-200",
    bg: "bg-gradient-to-br from-sky-50 to-cyan-50",
    icon: "text-sky-600",
  },
  indigo: {
    border: "border-indigo-200",
    bg: "bg-gradient-to-br from-indigo-50 via-violet-50 to-blue-50",
    icon: "text-indigo-600",
  },
};

export default function ProfessionsIndexPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{HERO_VI}</h1>
        <p className="text-sm text-slate-500">{HERO_EN}</p>
        <p className="mt-3 text-sm text-slate-700">{SUBTITLE_VI}</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => (
          <CardTile key={card.slug} card={card} />
        ))}
      </div>
    </div>
  );
}

function CardTile({ card }: { card: Card }) {
  const accent = ACCENT_CLASSES[card.accent] ?? ACCENT_CLASSES.rose;
  const inner = (
    <article
      className={`flex h-full flex-col rounded-2xl border ${accent.border} ${accent.bg} p-4 transition ${
        card.status === "active" ? "hover:shadow-md cursor-pointer" : "opacity-90"
      }`}
    >
      <div className="flex items-center gap-2">
        <card.Icon className={`h-5 w-5 ${accent.icon}`} />
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {card.title_en}
        </p>
        {card.status === "soon" && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-medium text-slate-500">
            <Lock className="h-3 w-3" />
            Sắp ra mắt
          </span>
        )}
      </div>
      <h2 className="mt-2 text-base font-semibold text-slate-900">
        {card.title_vi}
      </h2>
      <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-700">
        {card.blurb_vi}
      </p>
      {card.status === "active" && (
        <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-slate-900">
          Bắt đầu học
          <ArrowRight className="h-3 w-3" />
        </p>
      )}
    </article>
  );

  if (card.status === "active" && card.href) {
    return (
      <Link to={card.href} className="block focus:outline-none focus:ring-2 focus:ring-rose-300">
        {inner}
      </Link>
    );
  }
  return inner;
}
