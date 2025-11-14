import { AudioPlayer } from '@/components/AudioPlayer';
import { useState } from 'react';

interface TierSectionProps {
  id: string;
  backgroundColor: string;
  title: string;
  content: string;
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
  title,
  content,
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
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
          {title}
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

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-800 leading-relaxed whitespace-pre-line">
            {content}
          </p>
        </div>

        {/* Audio Player */}
        {audio && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Listen in English
            </h3>
            <AudioPlayer
              audioPath={`/audio/${audio}`}
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onEnded={() => setIsPlaying(false)}
            />
          </div>
        )}
      </div>
    </section>
  );
};
