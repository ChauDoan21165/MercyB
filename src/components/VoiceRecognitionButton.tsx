import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { toast } from 'sonner';

interface VoiceRecognitionButtonProps {
  onTranscript?: (text: string) => void;
  className?: string;
  language?: string;
}

export const VoiceRecognitionButton = ({ 
  onTranscript, 
  className,
  language = 'en-US' 
}: VoiceRecognitionButtonProps) => {
  const { 
    isListening, 
    transcript, 
    interimTranscript,
    startListening, 
    stopListening,
    isSupported 
  } = useVoiceRecognition({
    continuous: true,
    interimResults: true,
    language,
    onResult: (text) => {
      onTranscript?.(text);
    },
    onEnd: () => {
      if (transcript) {
        toast.success('Voice recognition completed');
      }
    }
  });

  if (!isSupported) {
    return null;
  }

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={handleClick}
        variant={isListening ? "destructive" : "default"}
        size="icon"
        className={className}
        aria-label={isListening ? "Stop listening" : "Start voice recognition"}
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>
      {(isListening && interimTranscript) && (
        <p className="text-sm text-muted-foreground italic">
          {interimTranscript}
        </p>
      )}
    </div>
  );
};
