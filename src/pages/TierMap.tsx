import { useNavigate } from 'react-router-dom';
import { Home, ExternalLink } from 'lucide-react';
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
        subtitle: '55 rooms: Individual, Corporate, National, Historical',
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
        title: 'Interpersonal Intelligence',
        titleVi: 'Trí Tuệ Giao Tiếp',
        href: '/vip/vip5',
      },
    },
    {
      id: 'vip4',
      label: 'VIP4',
      core: {
        title: 'CareerZ',
        titleVi: 'Nghề Nghiệp',
        subtitle: 'Career Development',
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
        title: 'English Specialization',
        titleVi: 'Chuyên Môn Tiếng Anh',
        href: '/vip/vip3ii',
      },
      english: {
        title: 'VIP3 II – Advanced English',
        titleVi: 'VIP3 II – Tiếng Anh Nâng Cao',
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
        title: 'Productivity & Systems',
        titleVi: 'Năng Suất và Hệ Thống',
        href: '/vip/vip2',
      },
      english: {
        title: 'A2 + B1',
        titleVi: 'A2 + B1',
        subtitle: 'Pre-Intermediate',
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
        subtitle: 'Foundation habits & survival',
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
        subtitle: '14 rooms for beginners',
        href: '/rooms',
      },
      other: {
        title: 'Survival Skills',
        titleVi: 'Kỹ Năng Sinh Tồn',
        subtitle: '15 safety rooms',
        href: '/rooms',
      },
    },
  ];

  const handleCellClick = (href: string) => {
    if (href && href !== '#') {
      navigate(href);
    }
  };

  const renderTableCell = (
    content?: { title: string; titleVi: string; subtitle?: string; href: string },
    type: 'english' | 'core' | 'other' = 'core',
    tierId?: string
  ) => {
    if (!content) {
      return (
        <td className="border-2 border-gray-300 p-4 bg-gray-50 text-center align-middle">
          <span className="text-xs text-gray-400 italic">
            Coming soon<br/>Sắp ra mắt
          </span>
        </td>
      );
    }

    let bgClass = 'bg-white';
    let textClass = 'text-gray-900';

    if (type === 'core') {
      if (tierId === 'vip9' || tierId === 'vip6') {
        bgClass = 'bg-[#052B4A]';
        textClass = 'text-white';
      } else {
        bgClass = 'bg-gray-900';
        textClass = 'text-white';
      }
    } else if (type === 'english') {
      bgClass = 'bg-[#FFF9E6]';
    } else if (type === 'other') {
      bgClass = 'bg-gray-50';
    }

    return (
      <td className={`border-2 border-gray-300 p-4 ${bgClass} align-middle`}>
        <button
          onClick={() => handleCellClick(content.href)}
          className={`text-left w-full hover:opacity-80 transition-opacity group`}
        >
          <div className={`font-bold text-sm mb-1 ${textClass} group-hover:underline flex items-center gap-1`}>
            {content.title}
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className={`text-xs ${type === 'core' ? 'opacity-80' : 'opacity-70'} ${textClass}`}>
            {content.titleVi}
          </div>
          {content.subtitle && (
            <div className={`text-xs mt-1 italic ${type === 'core' ? 'opacity-60' : 'opacity-50'} ${textClass}`}>
              {content.subtitle}
            </div>
          )}
          {isAdmin && (
            <div className="text-[9px] mt-1 opacity-40 font-mono">
              {content.href}
            </div>
          )}
        </button>
      </td>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black text-white py-5 px-6 border-b-4 border-gray-800">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              size="sm"
              className="border-white text-white hover:bg-white hover:text-black"
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

      {/* Table Container */}
      <div className="max-w-[1600px] mx-auto p-6 overflow-x-auto">
        <table className="w-full border-collapse border-2 border-gray-400">
          {/* Table Header */}
          <thead>
            <tr className="bg-gray-100">
              <th className="border-2 border-gray-400 p-4 text-left w-24 bg-gray-200">
                <div className="font-bold text-sm">Tier</div>
                <div className="text-xs opacity-70">Cấp</div>
              </th>
              <th className="border-2 border-gray-400 p-4 text-center bg-[#FFF9E6]">
                <div className="font-bold text-base">English Pathway</div>
                <div className="text-xs opacity-70">Lộ Trình Tiếng Anh</div>
              </th>
              <th className="border-2 border-gray-400 p-4 text-center bg-gray-900 text-white">
                <div className="font-bold text-base">Core Tier / Cấp Cốt Lõi</div>
                <div className="text-xs opacity-70">Main curriculum</div>
              </th>
              <th className="border-2 border-gray-400 p-4 text-center bg-gray-50">
                <div className="font-bold text-base">Other Skills</div>
                <div className="text-xs opacity-70">Kỹ Năng Khác</div>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {tierRows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/50">
                {/* Tier Label Column */}
                <td className="border-2 border-gray-400 p-4 text-center font-bold bg-gray-100 align-middle">
                  <div className="inline-flex items-center justify-center rounded-full bg-gray-900 text-white px-3 py-1 text-xs font-semibold whitespace-nowrap">
                    {row.label}
                  </div>
                </td>

                {/* English Column */}
                {renderTableCell(row.english, 'english', row.id)}

                {/* Core Column */}
                {renderTableCell(row.core, 'core', row.id)}

                {/* Other Skills Column */}
                {renderTableCell(row.other, 'other', row.id)}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 italic">
            Click any cell to explore that tier's content / Nhấp vào ô để khám phá nội dung
          </p>
        </div>
      </div>
    </div>
  );
};

export default TierMap;
