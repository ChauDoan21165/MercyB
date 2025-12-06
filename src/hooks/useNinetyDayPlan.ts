/**
 * Hook for fetching and managing 90-day English plans
 */

import { useState, useCallback } from 'react';
import { 
  generateNinetyDayPlan, 
  getPlanSummary 
} from '@/lib/english/generateNinetyDayPlan';
import type { 
  NinetyDayPlan, 
  PlanGenerationInput,
  CEFRLevel,
  FocusArea 
} from '@/lib/english/planTypes';

interface UseNinetyDayPlanReturn {
  plan: NinetyDayPlan | null;
  isLoading: boolean;
  error: string | null;
  generatePlan: (input: PlanGenerationInput) => void;
  clearPlan: () => void;
  getSummary: (level: CEFRLevel, focus: FocusArea) => ReturnType<typeof getPlanSummary>;
}

/**
 * Hook to generate and manage 90-day English learning plans.
 * 
 * @example
 * const { plan, isLoading, generatePlan } = useNinetyDayPlan();
 * 
 * generatePlan({ cefrLevel: 'A1', focus: 'mixed' });
 */
export function useNinetyDayPlan(): UseNinetyDayPlanReturn {
  const [plan, setPlan] = useState<NinetyDayPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePlan = useCallback((input: PlanGenerationInput) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate async for future API integration
      setTimeout(() => {
        const generatedPlan = generateNinetyDayPlan(input);
        setPlan(generatedPlan);
        setIsLoading(false);
      }, 300);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate plan');
      setIsLoading(false);
    }
  }, []);

  const clearPlan = useCallback(() => {
    setPlan(null);
    setError(null);
  }, []);

  const getSummary = useCallback((level: CEFRLevel, focus: FocusArea) => {
    return getPlanSummary(level, focus);
  }, []);

  return {
    plan,
    isLoading,
    error,
    generatePlan,
    clearPlan,
    getSummary,
  };
}

/**
 * Fetch plan from edge function (for future use)
 */
export async function fetchNinetyDayPlan(
  input: PlanGenerationInput
): Promise<NinetyDayPlan> {
  // For now, generate locally
  // TODO: Replace with edge function call when needed
  return generateNinetyDayPlan(input);
}
