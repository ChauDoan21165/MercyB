// PATH: src/hooks/useMercyReplies.ts

import { useCallback, useMemo } from 'react';
import { EMPTY_MERCY_REPLY_LIBRARY, type MercyReplyLibrary } from '@/mercy/replies';

/**
 * API-only teacher mode:
 * the legacy Mercy reply hook is intentionally inert.
 * Keep this stub only so older imports do not crash while the codebase is simplified.
 */

export type UseMercyRepliesReturn = {
  replies: MercyReplyLibrary;
  isLoading: boolean;
  error: null;
  reload: () => Promise<MercyReplyLibrary>;
};

export function useMercyReplies(): UseMercyRepliesReturn {
  const reload = useCallback(async () => EMPTY_MERCY_REPLY_LIBRARY, []);

  return useMemo(
    () => ({
      replies: EMPTY_MERCY_REPLY_LIBRARY,
      isLoading: false,
      error: null,
      reload,
    }),
    [reload]
  );
}

export default useMercyReplies;
