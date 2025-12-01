/**
 * Memoization Helpers
 * Performance utilities for React components
 */

import { memo, useMemo, useCallback } from 'react';

/**
 * Type-safe memo wrapper with display name
 */
export function createMemoComponent<P extends object>(
  Component: React.ComponentType<P>,
  displayName: string,
  propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
) {
  const MemoizedComponent = memo(Component, propsAreEqual);
  MemoizedComponent.displayName = displayName;
  return MemoizedComponent;
}

/**
 * Stable empty arrays and objects to prevent re-renders
 */
export const EMPTY_ARRAY: readonly never[] = [];
export const EMPTY_OBJECT: Readonly<Record<string, never>> = {};

/**
 * Memoize array-based data
 */
export function useMemoizedArray<T>(array: T[], deps: React.DependencyList = []) {
  return useMemo(() => array, [JSON.stringify(array), ...deps]);
}

/**
 * Memoize object-based data
 */
export function useMemoizedObject<T extends object>(obj: T, deps: React.DependencyList = []) {
  return useMemo(() => obj, [JSON.stringify(obj), ...deps]);
}

/**
 * Create stable callback that doesn't change reference
 */
export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  return useCallback(callback, []);
}

/**
 * Shallow comparison for props (for memo)
 */
export function shallowEqual<T extends object>(objA: T, objB: T): boolean {
  if (Object.is(objA, objB)) {
    return true;
  }

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (
      !Object.prototype.hasOwnProperty.call(objB, key) ||
      !Object.is(objA[key as keyof T], objB[key as keyof T])
    ) {
      return false;
    }
  }

  return true;
}
