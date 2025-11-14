import { AudioPlayer } from '@/components/AudioPlayer';
import { useState } from 'react';

interface TierSectionProps {
  id: string;
  backgroundColor: string;
  titleEn: string;
  titleVi: string;
  contentEn: string;
  contentVi: string;
  audio?: string;
  price?: {
    monthly: number;
    rooms_per_month: number;
    personalized_room?: boolean;
    career_coaching_mode?: boolean;
  };
}

export const TierSection = ({
  id,
  backgroundColor,
  titleEn,
  titleVi,
  contentEn,
  contentVi,
  audio,
  price,
}: TierSectionProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section
      id={id}
      className="min-h-screen py-16 px-6 flex items-center justify-center"
      style={{ backgroundColor }}
    >
      <div className="max-w-[640px] w-full space-y-8">
        {/* English Section */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {titleEn}
          </h2>

          {/* Price Card (if applicable) */}
          {price && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-gray-900">
                  ${price.monthly}
                  <span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <div className="text-sm text-gray-600">
                  {price.rooms_per_month} rooms per month
                </div>
                {price.personalized_room && (
                  <div className="text-sm font-semibold text-blue-600">
                    + Personalized Room
                  </div>
                )}
                {price.career_coaching_mode && (
                  <div className="text-sm font-semibold text-purple-600">
                    + Career Coaching Mode
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-800 leading-relaxed whitespace-pre-line text-[15px]">
              {contentEn}
            </p>
          </div>

          {/* Audio Player */}
          {audio && (
            <AudioPlayer
              audioPath={`/audio/${audio}`}
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onEnded={() => setIsPlaying(false)}
            />
          )}
        </div>

        {/* Vietnamese Section */}
        <div className="space-y-4 pt-6 border-t border-gray-300/50">
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-800">
            {titleVi}
          </h3>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-[15px]">
              {contentVi}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
