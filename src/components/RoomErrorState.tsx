import { AlertCircle, Lock, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { normalizeRoomError, type RoomErrorPayload } from "@/lib/errors";
import { useMercyBladeTheme } from "@/hooks/useMercyBladeTheme";
import { getErrorMessage, BUTTON_LABELS } from "@/lib/constants/uiText";
import { logger } from "@/lib/logger";
import { fadeInScale, shakeError, getVariants } from "@/lib/motion";

type RoomErrorStateProps = RoomErrorPayload & {
  onBack?: () => void;
};

/**
 * Consistent error UI for room loading failures
 * Shows user-friendly bilingual messages based on error code or kind
 * Theme-aware and logs all errors for analytics
 */
export function RoomErrorState(props: RoomErrorStateProps) {
  const navigate = useNavigate();
  const { mode } = useMercyBladeTheme();
  
  const { code, roomId, kind, message, onBack } = normalizeRoomError(props);
  const errorKind = kind!;
  
  // Log all room errors for analytics
  logger.error('Room load error', {
    scope: 'RoomErrorState',
    kind: errorKind,
    code,
    roomId,
    message,
  });
  
  // Default back behavior
  const handleBack = onBack || (() => navigate("/"));

  if (errorKind === "auth") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-6 transition-colors duration-200">
        <LogIn className="w-16 h-16 text-muted-foreground transition-colors duration-200" />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold transition-colors duration-200">
            {getErrorMessage('auth_required', 'en')}
          </h2>
          <p className="text-muted-foreground transition-colors duration-200">
            {getErrorMessage('auth_required', 'vi')}
          </p>
        </div>
        <a
          href="/auth"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200"
        >
          {BUTTON_LABELS.en.continue} / {BUTTON_LABELS.vi.continue}
        </a>
      </div>
    );
  }

  if (errorKind === "access") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-6 transition-colors duration-200">
        <Lock className="w-16 h-16 text-muted-foreground transition-colors duration-200" />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold transition-colors duration-200">
            {getErrorMessage('access_denied', 'en')}
          </h2>
          <p className="text-muted-foreground transition-colors duration-200">
            {getErrorMessage('access_denied', 'vi')}
          </p>
        </div>
        <button
          onClick={handleBack}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200"
        >
          {BUTTON_LABELS.en.back} / {BUTTON_LABELS.vi.back}
        </button>
      </div>
    );
  }

  if (errorKind === "not_found") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-6 transition-colors duration-200">
        <AlertCircle className="w-16 h-16 text-muted-foreground transition-colors duration-200" />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold transition-colors duration-200">
            {getErrorMessage('room_not_found', 'en')}
          </h2>
          <p className="text-muted-foreground transition-colors duration-200">
            {getErrorMessage('room_not_found', 'vi')}
          </p>
        </div>
        <button
          onClick={handleBack}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200"
        >
          {BUTTON_LABELS.en.back} / {BUTTON_LABELS.vi.back}
        </button>
      </div>
    );
  }

  // Generic error (unknown)
  return (
    <motion.div
      variants={getVariants(fadeInScale)}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-6 transition-colors duration-200"
    >
      <motion.div
        animate="shake"
        variants={shakeError}
      >
        <AlertCircle className="w-16 h-16 text-destructive transition-colors duration-200" />
      </motion.div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold transition-colors duration-200">
          {getErrorMessage('generic', 'en')}
        </h2>
        <p className="text-muted-foreground transition-colors duration-200">
          {message || getErrorMessage('generic', 'vi')}
        </p>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBack}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200"
      >
        {BUTTON_LABELS.en.back} / {BUTTON_LABELS.vi.back}
      </motion.button>
    </motion.div>
  );
}
