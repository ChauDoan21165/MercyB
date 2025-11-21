import { KidsLevel } from '@/hooks/useKidsLevels';

interface KidsTierSectionProps {
  level: KidsLevel;
}

export const KidsTierSection = ({ level }: KidsTierSectionProps) => {
  const backgroundColor = `bg-gradient-to-br ${level.color_theme}`;
  
  return (
    <section
      id={level.id}
      className={`min-h-screen py-16 px-6 flex items-center justify-center ${backgroundColor}`}
    >
      <div className="max-w-[640px] w-full space-y-8">
        {/* English Section */}
        <div className="space-y-4">
          <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-white mb-2">
            Kids English - Ages {level.age_range}
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
            {level.name_en}
          </h2>

          {/* Price Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-gray-900">
                {level.price_monthly.toLocaleString()} VND
                <span className="text-lg font-normal text-gray-600">/month</span>
              </div>
              <div className="text-sm text-gray-600">
                Interactive English learning for kids
              </div>
            </div>
          </div>

          {level.description_en && (
            <div className="prose prose-lg max-w-none">
              <p className="text-white drop-shadow-md leading-relaxed text-[15px]">
                {level.description_en}
              </p>
            </div>
          )}
        </div>

        {/* Vietnamese Section */}
        <div className="space-y-4 pt-6 border-t border-white/30">
          <h3 className="text-2xl md:text-3xl font-semibold text-white drop-shadow-lg">
            {level.name_vi}
          </h3>
          {level.description_vi && (
            <div className="prose prose-lg max-w-none">
              <p className="text-white/90 drop-shadow-md leading-relaxed text-[15px]">
                {level.description_vi}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
