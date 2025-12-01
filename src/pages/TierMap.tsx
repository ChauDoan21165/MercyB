import { useNavigate } from 'react-router-dom';
import { Home, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserAccess } from '@/hooks/useUserAccess';

type TierRow = {
  id: 'free' | 'vip1' | 'vip2' | 'vip3' | 'vip3ii' | 'vip4' | 'vip5' | 'vip6' | 'vip9';
  label: string;
  core: {
    title: string;
    titleVi: string;
    subtitle?: string;
    href: string;
  };
  english?: {
    title: string;
    titleVi: string;
    subtitle?: string;
    href: string;
  };
  other?: {
    title: string;
    titleVi: string;
    subtitle?: string;
    href: string;
  };
};

const TierMap = () => {
  const navigate = useNavigate();
  const { access } = useUserAccess();
  const isAdmin = access?.isAdmin || false;

  const tierRows: TierRow[] = [
    {
      id: 'vip9',
      label: 'VIP9',
      core: {
        title: 'Strategy Mindset',
        titleVi: 'Tư Duy Chiến Lược',
        subtitle: '55 rooms across 4 strategic domains',
        href: '/vip/vip9',
      },
    },
    {
      id: 'vip6',
      label: 'VIP6',
      core: {
        title: 'Psychology',
        titleVi: 'Tâm Lý Học',
        subtitle: 'Shadow Psychology & Mental Health',
        href: '/vip/vip6',
      },
      other: {
        title: 'Critical Thinking',
        titleVi: 'Tư Duy Phản Biện',
        href: '/vip/vip6',
      },
    },
    {
      id: 'vip5',
      label: 'VIP5',
      core: {
        title: 'Writing',
        titleVi: 'Viết Lách',
        subtitle: 'Advanced Writing Skills',
        href: '/vip/vip5',
      },
      other: {
        title: 'Interpersonal Intelligence Mastery',
        titleVi: 'Thành Thạo Trí Tuệ Giao Tiếp',
        href: '/vip/vip5',
      },
    },
    {
      id: 'vip4',
      label: 'VIP4',
      core: {
        title: 'CareerZ',
        titleVi: 'Nghề Nghiệp',
        subtitle: 'Career Development & Strategy',
        href: '/vip/vip4',
      },
      other: {
        title: 'Life Competence',
        titleVi: 'Năng Lực Sống',
        href: '/vip/vip4',
      },
    },
    {
      id: 'vip3ii',
      label: 'VIP3 II',
      core: {
        title: 'English Specialization Mastery',
        titleVi: 'Thành Thạo Chuyên Môn Tiếng Anh',
        subtitle: 'Advanced English Skills',
        href: '/vip/vip3ii',
      },
      english: {
        title: 'VIP3 II – English Specialization',
        titleVi: 'VIP3 II – Chuyên Môn Tiếng Anh',
        href: '/vip/vip3ii',
      },
    },
    {
      id: 'vip3',
      label: 'VIP3',
      core: {
        title: 'Life Strategy, Finance, Sexuality',
        titleVi: 'Chiến Lược Sống, Tài Chính, Tình Dục',
        href: '/vip/vip3',
      },
      english: {
        title: 'B2 + C1 + C2',
        titleVi: 'B2 + C1 + C2',
        subtitle: 'Advanced English',
        href: '/vip/vip3',
      },
      other: {
        title: 'Martial Arts & Public Speaking',
        titleVi: 'Võ Thuật & Nói Trước Đám Đông',
        href: '/vip/vip3',
      },
    },
    {
      id: 'vip2',
      label: 'VIP2',
      core: {
        title: 'Productivity and Systems',
        titleVi: 'Năng Suất và Hệ Thống',
        href: '/vip/vip2',
      },
      english: {
        title: 'A2 + B1',
        titleVi: 'A2 + B1',
        subtitle: 'Pre-Intermediate English',
        href: '/vip/vip2',
      },
      other: {
        title: 'Debate',
        titleVi: 'Tranh Biện',
        href: '/vip/vip2',
      },
    },
    {
      id: 'vip1',
      label: 'VIP1',
      core: {
        title: 'Basic Habits',
        titleVi: 'Thói Quen Cơ Bản',
        subtitle: 'Foundation habits & survival skills',
        href: '/vip/vip1',
      },
      english: {
        title: 'A1',
        titleVi: 'A1',
        subtitle: 'Beginner English',
        href: '/vip/vip1',
      },
    },
    {
      id: 'free',
      label: 'Free',
      core: {
        title: 'Foundations of Life Skills',
        titleVi: 'Nền Tảng Kỹ Năng Sống',
        href: '/rooms',
      },
      english: {
        title: 'English Foundation',
        titleVi: 'Nền Tảng Tiếng Anh',
        subtitle: '14 rooms for absolute beginners',
        href: '/rooms',
      },
      other: {
        title: 'Survival Skills',
        titleVi: 'Kỹ Năng Sinh Tồn',
        subtitle: '15 essential safety & preparedness rooms',
        href: '/rooms',
      },
    },
  ];

  const handleCellClick = (href: string) => {
    if (href && href !== '#') {
      navigate(href);
    }
  };

  const renderCell = (
    content?: { title: string; titleVi: string; subtitle?: string; href: string },
    type: 'english' | 'core' | 'other' = 'core',
    tierId?: string
  ) => {
    if (!content) {
      return (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 flex items-center justify-center min-h-[100px]">
          <span className="text-xs text-gray-400 text-center">
            Coming soon / Sắp ra mắt
          </span>
        </div>
      );
    }

    let bgClass = 'bg-white';
    let borderClass = 'border-gray-200';
    let textClass = 'text-gray-900';
    let hoverClass = 'hover:shadow-lg hover:scale-[1.02]';

    if (type === 'core') {
      // Core column: dark, serious look
      if (tierId === 'vip9' || tierId === 'vip6') {
        bgClass = 'bg-[#052B4A]';
        borderClass = 'border-[#0A3F5C]';
        textClass = 'text-white';
      } else {
        bgClass = 'bg-gray-900';
        borderClass = 'border-gray-800';
        textClass = 'text-white';
      }
    } else if (type === 'english') {
      // English column: soft yellow/warm
      bgClass = 'bg-[#FFF9E6]';
      borderClass = 'border-[#FFE4A3]';
      textClass = 'text-gray-900';
    } else if (type === 'other') {
      // Other Skills column: light neutral
      bgClass = 'bg-gray-50';
      borderClass = 'border-gray-200';
      textClass = 'text-gray-900';
    }

    return (
      <button
        onClick={() => handleCellClick(content.href)}
        className={`rounded-xl border-2 ${borderClass} ${bgClass} p-4 text-left transition-all ${hoverClass} min-h-[100px] w-full`}
      >
        <div className={`font-bold text-sm mb-1 ${textClass}`}>
          {content.title}
        </div>
        <div className={`text-xs ${type === 'core' ? 'opacity-80' : 'opacity-70'} ${textClass}`}>
          {content.titleVi}
        </div>
        {content.subtitle && (
          <div className={`text-xs mt-2 italic ${type === 'core' ? 'opacity-60' : 'opacity-50'} ${textClass}`}>
            {content.subtitle}
          </div>
        )}
        {isAdmin && (
          <div className="text-[10px] mt-2 opacity-40 font-mono">
            {content.href}
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-black text-white py-5 px-6 border-b-4 border-gray-800">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              size="sm"
              className="border-white text-white hover:bg-white hover:text-black transition-all"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Tier Map — Tree Structure</h1>
              <p className="text-sm opacity-80">Bản Đồ Cấp Độ — Cây</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto p-6 md:p-8 space-y-6">
        {/* Column Headers - Desktop Only */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 mb-4">
          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-yellow-400 pb-2 inline-block">
              English Pathway
            </h2>
            <p className="text-sm text-gray-600 mt-1">Lộ Trình Tiếng Anh</p>
          </div>
          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-800 pb-2 inline-block">
              Core Tier / Cấp Cốt Lõi
            </h2>
            <p className="text-xs text-gray-500 mt-1 italic">Main curriculum for each tier</p>
          </div>
          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-400 pb-2 inline-block">
              Other Skills
            </h2>
            <p className="text-sm text-gray-600 mt-1">Kỹ Năng Khác</p>
          </div>
        </div>

        {/* Tier Rows */}
        {tierRows.map((row) => (
          <section
            key={row.id}
            className="rounded-3xl border border-gray-200 bg-white shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center rounded-full bg-gray-900 text-white px-3 py-1 text-xs font-semibold">
                {row.label}
              </span>
              <span className="text-xs text-gray-500 hidden md:inline">
                Core Tier / Cấp cốt lõi
              </span>
            </div>

            {/* Desktop: 3-column grid */}
            <div className="hidden md:grid md:grid-cols-3 gap-6">
              {renderCell(row.english, 'english', row.id)}
              {renderCell(row.core, 'core', row.id)}
              {renderCell(row.other, 'other', row.id)}
            </div>

            {/* Mobile: Stacked with labels */}
            <div className="md:hidden space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  Core / Cốt lõi
                </h3>
                {renderCell(row.core, 'core', row.id)}
              </div>
              
              {row.english && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    English / Tiếng Anh
                  </h3>
                  {renderCell(row.english, 'english', row.id)}
                </div>
              )}
              
              {row.other && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    Other Skills / Kỹ Năng Khác
                  </h3>
                  {renderCell(row.other, 'other', row.id)}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      {/* Footer Note */}
      <div className="max-w-[1400px] mx-auto px-6 pb-12 text-center">
        <p className="text-xs text-gray-500 italic">
          Click any cell to explore that tier's content / Nhấp vào ô để khám phá nội dung cấp độ đó
        </p>
      </div>
    </div>
  );
};

export default TierMap;
