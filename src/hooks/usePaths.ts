import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/providers/AuthProvider';
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
  const { user } = useAuth();
  const userId = user?.id ?? null;
  return useQuery({
    queryKey: ['user-path-progress', pathId, userId],
    queryFn: () => (userId && pathId ? pathsService.getUserProgress(userId, pathId) : null),
    enabled: !!pathId && !!userId,
  });
}

// Hook to get all user progress
export function useAllUserPathProgress() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  return useQuery({
    queryKey: ['user-path-progress-all', userId],
    queryFn: () => (userId ? pathsService.getAllUserProgress(userId) : []),
    enabled: !!userId,
  });
}

// Hook to get paths with progress
export function usePathsWithProgress() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  return useQuery({
    queryKey: ['paths-with-progress', userId],
    queryFn: () => pathsService.getPathsWithProgress(userId),
  });
}

// Hook to start a path
export function useStartPath() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (pathId: string) => {
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
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ pathId, dayIndex, totalDays }: { pathId: string; dayIndex: number; totalDays: number }) => {
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
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (pathId: string) => {
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
