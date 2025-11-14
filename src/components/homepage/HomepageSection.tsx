import { AudioPlayer } from './AudioPlayer';

interface HomepageSectionProps {
  id: string;
  backgroundColor: string;
  headingColor: string;
  accentColor: string;
  title: {
    en: string;
    vi: string;
  };
  body: {
    en: string;
    vi: string;
  };
  audio?: {
    en: string;
    vi: string;
  };
}

export const HomepageSection = ({
  id,
  backgroundColor,
  headingColor,
  accentColor,
  title,
  body,
  audio,
}: HomepageSectionProps) => {
  return (
    <section
      id={id}
      className="w-full py-16 px-6 transition-colors duration-500"
      style={{ backgroundColor }}
    >
      <div className="max-w-[640px] mx-auto space-y-6">
        {/* Title */}
        <h2
          className="text-2xl font-semibold leading-relaxed"
          style={{ color: headingColor }}
        >
          {title.en}
        </h2>

        {/* English body */}
        <div className="space-y-4">
          <p className="text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
            {body.en}
          </p>
          
          {audio && (
            <AudioPlayer
              audioFile={audio.en}
              language="EN"
              accentColor={accentColor}
            />
          )}
        </div>

        {/* Vietnamese body */}
        <div className="space-y-4 pt-6 border-t border-gray-300/30 dark:border-gray-600/30">
          <p className="text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
            {body.vi}
          </p>
          
          {audio && (
            <AudioPlayer
              audioFile={audio.vi}
              language="VI"
              accentColor={accentColor}
            />
          )}
        </div>
      </div>
    </section>
  );
};
