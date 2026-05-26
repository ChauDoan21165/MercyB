// Path: src/hooks/useNotebook.ts
// React hook wrapping notebookService with reactive state + premium-aware limit.

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  countItems,
  deleteItem,
  findItem,
  FREE_TIER_LIMIT,
  getDueItems,
  listItems,
  NotebookAuthError,
  NotebookLimitError,
  reviewItem,
  saveItem,
  updateItem,
  type NotebookItem,
  type NotebookItemType,
  type NotebookRating,
  type SaveNotebookInput,
  type SaveResult,
} from '@/services/notebookService';
import { useUserAccess } from '@/hooks/useUserAccess';

export interface UseNotebookResult {
  items: NotebookItem[];
  dueItems: NotebookItem[];
  total: number;
  limit: number;
  isLoading: boolean;
  isAtLimit: boolean;
  isAuthenticated: boolean;

  refresh: () => Promise<void>;
  save: (input: SaveNotebookInput) => Promise<SaveResult>;
  remove: (id: string) => Promise<void>;
  review: (id: string, rating: NotebookRating) => Promise<NotebookItem>;
  editNotes: (
    id: string,
    patch: Partial<Pick<NotebookItem, 'content_vi' | 'notes' | 'audio_url'>>,
  ) => Promise<NotebookItem>;
  checkSaved: (
    type: NotebookItemType,
    contentEn: string,
  ) => Promise<NotebookItem | null>;
}

export function useNotebook(): UseNotebookResult {
  const access = useUserAccess();
  const [items, setItems] = useState<NotebookItem[]>([]);
  const [dueItems, setDueItems] = useState<NotebookItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const limit = access.hasPremium || access.isHighAdmin ? Infinity : FREE_TIER_LIMIT;
  const isAuthenticated = access.isAuthenticated;

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      setDueItems([]);
      setTotal(0);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const [all, due, count] = await Promise.all([
        listItems(),
        getDueItems(),
        countItems(),
      ]);
      setItems(all);
      setDueItems(due);
      setTotal(count);
    } catch (err) {
      if (!(err instanceof NotebookAuthError)) {
        console.error('[useNotebook] refresh failed', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const save = useCallback(
    async (input: SaveNotebookInput): Promise<SaveResult> => {
      const result = await saveItem(input, {
        limit: Number.isFinite(limit) ? limit : undefined,
      });
      await refresh();
      return result;
    },
    [limit, refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteItem(id);
      await refresh();
    },
    [refresh],
  );

  const review = useCallback(
    async (id: string, rating: NotebookRating) => {
      const updated = await reviewItem(id, rating);
      await refresh();
      return updated;
    },
    [refresh],
  );

  const editNotes = useCallback(
    async (
      id: string,
      patch: Partial<Pick<NotebookItem, 'content_vi' | 'notes' | 'audio_url'>>,
    ) => {
      const updated = await updateItem(id, patch);
      await refresh();
      return updated;
    },
    [refresh],
  );

  const checkSaved = useCallback(
    async (type: NotebookItemType, contentEn: string) => {
      try {
        return await findItem(type, contentEn);
      } catch {
        return null;
      }
    },
    [],
  );

  const isAtLimit = Number.isFinite(limit) && total >= limit;

  return useMemo(
    () => ({
      items,
      dueItems,
      total,
      limit,
      isLoading,
      isAtLimit,
      isAuthenticated,
      refresh,
      save,
      remove,
      review,
      editNotes,
      checkSaved,
    }),
    [
      items,
      dueItems,
      total,
      limit,
      isLoading,
      isAtLimit,
      isAuthenticated,
      refresh,
      save,
      remove,
      review,
      editNotes,
      checkSaved,
    ],
  );
}

export { NotebookLimitError };
