import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TierItem {
  tier: string;
  nameEn: string;
  nameVi: string;
  path: string;
  description?: string;
}

const TierMap = () => {
  const navigate = useNavigate();

  // Column 1: English Learning Pathway
  const englishPathway: TierItem[] = [
    {
      tier: 'VIP3',
      nameEn: 'VIP3 II – English Specialization Mastery',
      nameVi: 'VIP3 II – Thành Thạo Chuyên Môn Tiếng Anh',
      path: '/rooms-vip3',
    },
    {
      tier: 'VIP3',
      nameEn: 'Kids L3 (ages 10–13)',
      nameVi: 'Trẻ Em Cấp 3 (10–13 tuổi)',
      path: '/kids-level3',
    },
    {
      tier: 'VIP3',
      nameEn: 'Kids L2 (ages 7–10)',
      nameVi: 'Trẻ Em Cấp 2 (7–10 tuổi)',
      path: '/kids-level2',
    },
    {
      tier: 'VIP3',
      nameEn: 'Kids L1 (ages 4–7)',
      nameVi: 'Trẻ Em Cấp 1 (4–7 tuổi)',
      path: '/kids-level1',
    },
    {
      tier: 'VIP3',
      nameEn: 'B2 + C1 + C2',
      nameVi: 'B2 + C1 + C2',
      path: '/rooms-vip3',
    },
    {
      tier: 'VIP2',
      nameEn: 'A2 + B1',
      nameVi: 'A2 + B1',
      path: '/rooms-vip2',
    },
    {
      tier: 'VIP1',
      nameEn: 'A1',
      nameVi: 'A1',
      path: '/rooms-vip1',
    },
    {
      tier: 'Free',
      nameEn: 'English Foundation',
      nameVi: 'Nền Tảng Tiếng Anh',
      path: '/rooms',
    },
  ];

  // Column 2: Core Tier Levels
  const coreTiers: TierItem[] = [
    {
      tier: 'Universe',
      nameEn: 'Universe',
      nameVi: 'Chúa, Vũ Trụ',
      path: '#',
      description: 'Above VIP9',
    },
    {
      tier: 'VIP9',
      nameEn: 'Strategy Mindset',
      nameVi: 'Tư Duy Chiến Lược',
      path: '/rooms-vip9',
    },
    {
      tier: 'VIP8',
      nameEn: 'Coming Soon',
      nameVi: 'Sắp Ra Mắt',
      path: '#',
    },
    {
      tier: 'VIP7',
      nameEn: 'Coming Soon',
      nameVi: 'Sắp Ra Mắt',
      path: '#',
    },
    {
      tier: 'VIP6',
      nameEn: 'Psychology',
      nameVi: 'Tâm Lý Học',
      path: '/vip6',
    },
    {
      tier: 'VIP5',
      nameEn: 'Writing',
      nameVi: 'Viết Lách',
      path: '/rooms-vip5',
    },
    {
      tier: 'VIP4',
      nameEn: 'CareerZ',
      nameVi: 'Nghề Nghiệp',
      path: '/rooms-vip4',
    },
    {
      tier: 'VIP3',
      nameEn: 'Life Strategy, Finance, Sexuality',
      nameVi: 'Chiến Lược Sống, Tài Chính, Tình Dục',
      path: '/rooms-vip3',
    },
    {
      tier: 'VIP2',
      nameEn: 'Productivity and Systems',
      nameVi: 'Năng Suất và Hệ Thống',
      path: '/rooms-vip2',
    },
    {
      tier: 'VIP1',
      nameEn: 'Basic Habits',
      nameVi: 'Thói Quen Cơ Bản',
      path: '/rooms-vip1',
    },
    {
      tier: 'Free',
      nameEn: 'Foundations of Life Skills',
      nameVi: 'Nền Tảng Kỹ Năng Sống',
      path: '/rooms',
    },
  ];

  // Column 3: Life Skills & Survival
  const lifeSkills: TierItem[] = [
    {
      tier: 'VIP6',
      nameEn: 'Critical Thinking',
      nameVi: 'Tư Duy Phản Biện',
      path: '/vip6',
    },
    {
      tier: 'VIP5',
      nameEn: 'Interpersonal Intelligence Mastery',
      nameVi: 'Thành Thạo Trí Tuệ Giao Tiếp',
      path: '/rooms-vip5',
    },
    {
      tier: 'VIP3',
      nameEn: 'Martial Arts',
      nameVi: 'Võ Thuật',
      path: '/rooms-vip3',
    },
    {
      tier: 'VIP3',
      nameEn: 'Public Speaking',
      nameVi: 'Nghệ Thuật Nói Trước Đám Đông',
      path: '/rooms-vip3',
    },
    {
      tier: 'VIP2',
      nameEn: 'Debate',
      nameVi: 'Tranh Biện',
      path: '/rooms-vip2',
    },
    {
      tier: 'Free',
      nameEn: 'Survival Skills',
      nameVi: 'Kỹ Năng Sinh Tồn',
      path: '/rooms',
    },
  ];

  const getTierColor = (tier: string): string => {
    const colors: Record<string, string> = {
      'Free': 'bg-gray-100 border-gray-400',
      'VIP1': 'bg-blue-50 border-blue-400',
      'VIP2': 'bg-green-50 border-green-400',
      'VIP3': 'bg-yellow-50 border-yellow-400',
      'VIP4': 'bg-orange-50 border-orange-400',
      'VIP5': 'bg-red-50 border-red-400',
      'VIP6': 'bg-purple-50 border-purple-400',
      'VIP7': 'bg-pink-50 border-pink-400',
      'VIP8': 'bg-indigo-50 border-indigo-400',
      'VIP9': 'bg-slate-800 border-slate-900 text-white',
      'Universe': 'bg-gradient-to-r from-purple-100 to-blue-100 border-purple-300',
    };
    return colors[tier] || 'bg-white border-gray-300';
  };

  const handleItemClick = (path: string) => {
    if (path !== '#') {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black text-white py-4 px-6 flex items-center justify-between">
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
          <h1 className="text-2xl font-bold">Tier Map — Tree Structure</h1>
        </div>
      </header>

      {/* Desktop: 3 Columns */}
      <div className="hidden lg:block max-w-[1400px] mx-auto p-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Column 1: English Learning Pathway */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-black border-b-2 border-black pb-2">
              <div>English Learning Pathway</div>
              <div className="text-base opacity-80">Lộ Trình Học Tiếng Anh</div>
            </h2>
            <div className="space-y-3">
              {englishPathway.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleItemClick(item.path)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all hover:shadow-lg hover:scale-105 ${getTierColor(item.tier)}`}
                  disabled={item.path === '#'}
                >
                  <div className="text-xs font-bold mb-1">{item.tier}</div>
                  <div className="font-bold text-sm">{item.nameEn}</div>
                  <div className="text-sm opacity-80">{item.nameVi}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Core Tier Levels */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-black border-b-2 border-black pb-2">
              <div>Core Tier Levels</div>
              <div className="text-base opacity-80">Các Cấp Độ Cốt Lõi</div>
            </h2>
            <div className="space-y-3">
              {coreTiers.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleItemClick(item.path)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all hover:shadow-lg hover:scale-105 ${getTierColor(item.tier)}`}
                  disabled={item.path === '#'}
                >
                  <div className="text-xs font-bold mb-1">{item.tier}</div>
                  <div className="font-bold text-sm">{item.nameEn}</div>
                  <div className="text-sm opacity-80">{item.nameVi}</div>
                  {item.description && (
                    <div className="text-xs italic mt-1 opacity-60">{item.description}</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: Life Skills & Survival */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-black border-b-2 border-black pb-2">
              <div>Life Skills & Survival</div>
              <div className="text-base opacity-80">Kỹ Năng Sống & Sinh Tồn</div>
            </h2>
            <div className="space-y-3">
              {lifeSkills.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleItemClick(item.path)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all hover:shadow-lg hover:scale-105 ${getTierColor(item.tier)}`}
                  disabled={item.path === '#'}
                >
                  <div className="text-xs font-bold mb-1">{item.tier}</div>
                  <div className="font-bold text-sm">{item.nameEn}</div>
                  <div className="text-sm opacity-80">{item.nameVi}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Stacked Columns */}
      <div className="lg:hidden p-6 space-y-8">
        {/* Column 1: English Learning Pathway */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-black border-b-2 border-black pb-2">
            <div>English Learning Pathway</div>
            <div className="text-base opacity-80">Lộ Trình Học Tiếng Anh</div>
          </h2>
          <div className="space-y-3">
            {englishPathway.map((item, index) => (
              <button
                key={index}
                onClick={() => handleItemClick(item.path)}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all hover:shadow-lg ${getTierColor(item.tier)}`}
                disabled={item.path === '#'}
              >
                <div className="text-xs font-bold mb-1">{item.tier}</div>
                <div className="font-bold text-sm">{item.nameEn}</div>
                <div className="text-sm opacity-80">{item.nameVi}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Column 2: Core Tier Levels */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-black border-b-2 border-black pb-2">
            <div>Core Tier Levels</div>
            <div className="text-base opacity-80">Các Cấp Độ Cốt Lõi</div>
          </h2>
          <div className="space-y-3">
            {coreTiers.map((item, index) => (
              <button
                key={index}
                onClick={() => handleItemClick(item.path)}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all hover:shadow-lg ${getTierColor(item.tier)}`}
                disabled={item.path === '#'}
              >
                <div className="text-xs font-bold mb-1">{item.tier}</div>
                <div className="font-bold text-sm">{item.nameEn}</div>
                <div className="text-sm opacity-80">{item.nameVi}</div>
                {item.description && (
                  <div className="text-xs italic mt-1 opacity-60">{item.description}</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Column 3: Life Skills & Survival */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-black border-b-2 border-black pb-2">
            <div>Life Skills & Survival</div>
            <div className="text-base opacity-80">Kỹ Năng Sống & Sinh Tồn</div>
          </h2>
          <div className="space-y-3">
            {lifeSkills.map((item, index) => (
              <button
                key={index}
                onClick={() => handleItemClick(item.path)}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all hover:shadow-lg ${getTierColor(item.tier)}`}
                disabled={item.path === '#'}
              >
                <div className="text-xs font-bold mb-1">{item.tier}</div>
                <div className="font-bold text-sm">{item.nameEn}</div>
                <div className="text-sm opacity-80">{item.nameVi}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TierMap;
