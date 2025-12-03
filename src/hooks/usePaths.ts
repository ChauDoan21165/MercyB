import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import * as pathsService from '@/services/paths';
import type { Path, PathDay, UserPathProgress, PathWithProgress } from '@/types/paths';

// Hook to get all paths
export function usePaths() {
  return useQuery({
    queryKey: ['paths'],
    queryFn: pathsService.getAllPaths,
  });
}

// Hook to get a single path by slug
export function usePath(slug: string | undefined) {
  return useQuery({
    queryKey: ['paths', slug],
    queryFn: () => (slug ? pathsService.getPathBySlug(slug) : null),
    enabled: !!slug,
  });
}

// Hook to get path days
export function usePathDays(pathId: string | undefined) {
  return useQuery({
    queryKey: ['path-days', pathId],
    queryFn: () => (pathId ? pathsService.getPathDays(pathId) : []),
    enabled: !!pathId,
  });
}

// Hook to get a single day
export function usePathDay(pathId: string | undefined, dayIndex: number | undefined) {
  return useQuery({
    queryKey: ['path-day', pathId, dayIndex],
    queryFn: () => (pathId && dayIndex ? pathsService.getPathDay(pathId, dayIndex) : null),
    enabled: !!pathId && !!dayIndex,
  });
}

// Hook to get user progress
export function useUserPathProgress(pathId: string | undefined) {
  return useQuery({
    queryKey: ['user-path-progress', pathId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !pathId) return null;
      return pathsService.getUserProgress(user.id, pathId);
    },
    enabled: !!pathId,
  });
}

// Hook to get all user progress
export function useAllUserPathProgress() {
  return useQuery({
    queryKey: ['user-path-progress-all'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      return pathsService.getAllUserProgress(user.id);
    },
  });
}

// Hook to get paths with progress
export function usePathsWithProgress() {
  return useQuery({
    queryKey: ['paths-with-progress'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return pathsService.getPathsWithProgress(user?.id || null);
    },
  });
}

// Hook to start a path
export function useStartPath() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pathId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      return pathsService.startPath(user.id, pathId);
    },
    onSuccess: (_, pathId) => {
      queryClient.invalidateQueries({ queryKey: ['user-path-progress', pathId] });
      queryClient.invalidateQueries({ queryKey: ['user-path-progress-all'] });
      queryClient.invalidateQueries({ queryKey: ['paths-with-progress'] });
    },
  });
}

// Hook to complete a day
export function useCompleteDay() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ pathId, dayIndex, totalDays }: { pathId: string; dayIndex: number; totalDays: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      return pathsService.completeDay(user.id, pathId, dayIndex, totalDays);
    },
    onSuccess: (_, { pathId }) => {
      queryClient.invalidateQueries({ queryKey: ['user-path-progress', pathId] });
      queryClient.invalidateQueries({ queryKey: ['user-path-progress-all'] });
      queryClient.invalidateQueries({ queryKey: ['paths-with-progress'] });
    },
  });
}

// Hook to reset a path
export function useResetPath() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pathId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      return pathsService.resetPath(user.id, pathId);
    },
    onSuccess: (_, pathId) => {
      queryClient.invalidateQueries({ queryKey: ['user-path-progress', pathId] });
      queryClient.invalidateQueries({ queryKey: ['user-path-progress-all'] });
      queryClient.invalidateQueries({ queryKey: ['paths-with-progress'] });
    },
  });
}
