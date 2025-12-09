import { useNavigate } from 'react-router-dom';
import { Home, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserAccess } from '@/hooks/useUserAccess';
import { 
  TIER_CONTENT_MAP, 
  TIER_MAP_ORDER, 
  COLUMN_LABELS,
  getTierPath,
  getTierLabel,
  VIP3II_DESCRIPTION 
} from '@/lib/constants/tierMapConfig';
import type { TierId } from '@/lib/constants/tiers';

const TierMap = () => {
  const navigate = useNavigate();
  const { access } = useUserAccess();
  const isAdmin = access?.isAdmin || false;

  const handleCellClick = (href: string) => {
    if (href && href !== '#') {
      navigate(href);
    }
  };

  const renderTableCell = (
    content: { title: string; titleVi: string; subtitle?: string },
    type: 'english' | 'core' | 'skills',
    tierId: TierId
  ) => {
    const href = getTierPath(tierId);
    const isEmpty = content.title === '—';

    if (isEmpty) {
      return (
        <td className="border-2 border-gray-300 p-4 bg-gray-50 text-center align-middle">
          <span className="text-xs text-gray-400 italic">
            —
          </span>
        </td>
      );
    }

    let bgClass = 'bg-white';
    let textClass = 'text-gray-900';

    if (type === 'core') {
      // Core column - dark background
      if (tierId === 'vip9' || tierId === 'vip6') {
        bgClass = 'bg-[#052B4A]';
        textClass = 'text-white';
      } else if (tierId === 'vip3ii') {
        // VIP3II specialization - slightly different shade
        bgClass = 'bg-[#1a1a2e]';
        textClass = 'text-white';
      } else {
        bgClass = 'bg-gray-900';
        textClass = 'text-white';
      }
    } else if (type === 'english') {
      // English column - warm yellow
      bgClass = 'bg-[#FFF9E6]';
    } else if (type === 'skills') {
      // Skills column - light gray
      bgClass = 'bg-gray-50';
    }

    return (
      <td className={`border-2 border-gray-300 p-4 ${bgClass} align-middle`}>
        <button
          onClick={() => handleCellClick(href)}
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
              {href}
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
              <p className="text-sm opacity-80">Bản Đồ Cấp Độ — Cấu Trúc 3 Cột</p>
            </div>
          </div>
        </div>
      </header>

      {/* Legend */}
      <div className="max-w-[1600px] mx-auto px-6 pt-4">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#FFF9E6] border border-gray-300"></div>
            <span>{COLUMN_LABELS.english.en} / {COLUMN_LABELS.english.vi}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-900 border border-gray-300"></div>
            <span>{COLUMN_LABELS.core.en} / {COLUMN_LABELS.core.vi}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-50 border border-gray-300"></div>
            <span>{COLUMN_LABELS.skills.en} / {COLUMN_LABELS.skills.vi}</span>
          </div>
        </div>
      </div>

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
                <div className="font-bold text-base">{COLUMN_LABELS.english.en}</div>
                <div className="text-xs opacity-70">{COLUMN_LABELS.english.vi}</div>
              </th>
              <th className="border-2 border-gray-400 p-4 text-center bg-gray-900 text-white">
                <div className="font-bold text-base">{COLUMN_LABELS.core.en}</div>
                <div className="text-xs opacity-70">{COLUMN_LABELS.core.vi}</div>
              </th>
              <th className="border-2 border-gray-400 p-4 text-center bg-gray-50">
                <div className="font-bold text-base">{COLUMN_LABELS.skills.en}</div>
                <div className="text-xs opacity-70">{COLUMN_LABELS.skills.vi}</div>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {TIER_MAP_ORDER.map((tierId) => {
              const content = TIER_CONTENT_MAP[tierId];
              if (!content) return null;

              const isVip3II = tierId === 'vip3ii';

              return (
                <tr key={tierId} className="hover:bg-gray-50/50">
                  {/* Tier Label Column */}
                  <td className="border-2 border-gray-400 p-4 text-center font-bold bg-gray-100 align-middle">
                    <div className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${
                      isVip3II 
                        ? 'bg-[#1a1a2e] text-white' 
                        : 'bg-gray-900 text-white'
                    }`}>
                      {getTierLabel(tierId)}
                    </div>
                    {isVip3II && (
                      <div className="text-[9px] mt-1 text-gray-500 italic">
                        Core Specialization
                      </div>
                    )}
                  </td>

                  {/* English Column (LEFT) */}
                  {renderTableCell(content.english, 'english', tierId)}

                  {/* Core Column (CENTER) */}
                  {renderTableCell(content.core, 'core', tierId)}

                  {/* Skills Column (RIGHT) */}
                  {renderTableCell(content.skills, 'skills', tierId)}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* VIP3II Note */}
        <div className="mt-4 p-4 bg-gray-100 rounded-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-700">
            📌 VIP3 II = {VIP3II_DESCRIPTION.en}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {VIP3II_DESCRIPTION.vi} — VIP3 users have full access to VIP3 II content.
          </p>
        </div>

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
