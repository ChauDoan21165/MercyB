import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { messageEnter, getVariants } from '@/lib/motion';
import { typography } from '@/styles/typography';
import { spacing } from '@/styles/spacing';
import { formatDistanceToNow } from 'date-fns';

interface ChatMessageProps {
  content: ReactNode;
  timestamp: Date;
  isUser: boolean;
  showTimestamp?: boolean;
}

/**
 * Improved ChatHub message component
 * Premium styling with animations and better readability
 */
export function ChatMessage({ 
  content, 
  timestamp, 
  isUser,
  showTimestamp = true 
}: ChatMessageProps) {
  return (
    <motion.div 
      variants={getVariants(messageEnter)}
      initial="hidden"
      animate="visible"
      className={`
        flex flex-col
        ${isUser ? 'items-end' : 'items-start'}
      `}
    >
      {/* Message bubble */}
      <div
        className={`
          ${spacing.card.padding}
          rounded-2xl
          max-w-[85%] md:max-w-[70%]
          ${typography.chatMessage}
          ${isUser 
            ? 'bg-primary text-primary-foreground ml-auto' 
            : 'bg-muted text-foreground mr-auto'
          }
          shadow-sm
          transition-all duration-200
        `}
      >
        {content}
      </div>

      {/* Timestamp */}
      {showTimestamp && (
        <span 
          className={`
            ${typography.chatTimestamp}
            mt-1
            ${isUser ? 'mr-2' : 'ml-2'}
          `}
        >
          {formatDistanceToNow(timestamp, { addSuffix: true })}
        </span>
      )}
    </motion.div>
  );
}
