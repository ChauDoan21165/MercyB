import { useAdminCheck } from '@/hooks/useAdminCheck';
import { toast } from '@/hooks/use-toast';

interface KeywordAudioCopyDotProps {
  audioFilename?: string;
}

/**
 * Red dot next to keywords for copying audio filename
 * Only visible to admin users
 */
export const KeywordAudioCopyDot = ({ audioFilename }: KeywordAudioCopyDotProps) => {
  const { isAdmin } = useAdminCheck();

  if (!isAdmin || !audioFilename) return null;

  const handleCopyAudio = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(audioFilename);
      toast({
        title: "Audio filename copied",
        description: audioFilename,
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <button
      onClick={handleCopyAudio}
      className="inline-flex w-[1em] h-[1em] rounded-full bg-red-500 hover:bg-red-600 ml-1 align-middle cursor-pointer flex-shrink-0 transition-colors"
      title={`Copy audio filename: ${audioFilename}`}
      aria-label="Copy audio filename"
    />
  );
};
