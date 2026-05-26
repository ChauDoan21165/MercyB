/**
 * Hook for fetching and managing 90-day English plans and roadmaps
 */

import { useState, useCallback } from 'react';
import { 
  generateNinetyDayPlan, 
  getPlanSummary 
} from '@/lib/english/generateNinetyDayPlan';
import {
  generateEnglishRoadmap,
  getRoadmapSummary,
  type EnglishRoadmap,
  type RoadmapInput,
} from '@/lib/english/generateRoadmap';
import type { 
  NinetyDayPlan, 
  PlanGenerationInput,
  CEFRLevel,
  FocusArea 
} from '@/lib/english/planTypes';

interface UseNinetyDayPlanReturn {
  plan: NinetyDayPlan | null;
  roadmap: EnglishRoadmap | null;
  isLoading: boolean;
  error: string | null;
  generatePlan: (input: PlanGenerationInput) => void;
  generateRoadmap: (input: RoadmapInput) => void;
  clearPlan: () => void;
  clearRoadmap: () => void;
  getSummary: (level: CEFRLevel, focus: FocusArea) => ReturnType<typeof getPlanSummary>;
  getRoadmapSummaryFn: (current: CEFRLevel, target: CEFRLevel) => ReturnType<typeof getRoadmapSummary>;
}

/**
 * Hook to generate and manage 90-day English learning plans and roadmaps.
 * 
 * @example
 * const { plan, roadmap, generatePlan, generateRoadmap } = useNinetyDayPlan();
 * 
 * generatePlan({ cefrLevel: 'A1', focus: 'mixed' });
 * generateRoadmap({ currentCEFR: 'A2', targetCEFR: 'B2' });
 */
export function useNinetyDayPlan(): UseNinetyDayPlanReturn {
  const [plan, setPlan] = useState<NinetyDayPlan | null>(null);
  const [roadmap, setRoadmap] = useState<EnglishRoadmap | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePlanFn = useCallback((input: PlanGenerationInput) => {
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

  const generateRoadmapFn = useCallback((input: RoadmapInput) => {
    setIsLoading(true);
    setError(null);

    try {
      setTimeout(() => {
        const generatedRoadmap = generateEnglishRoadmap(input);
        setRoadmap(generatedRoadmap);
        setIsLoading(false);
      }, 200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate roadmap');
      setIsLoading(false);
    }
  }, []);

  const clearPlan = useCallback(() => {
    setPlan(null);
    setError(null);
  }, []);

  const clearRoadmap = useCallback(() => {
    setRoadmap(null);
    setError(null);
  }, []);

  const getSummary = useCallback((level: CEFRLevel, focus: FocusArea) => {
    return getPlanSummary(level, focus);
  }, []);

  const getRoadmapSummaryFn = useCallback((current: CEFRLevel, target: CEFRLevel) => {
    return getRoadmapSummary(current, target);
  }, []);

  return {
    plan,
    roadmap,
    isLoading,
    error,
    generatePlan: generatePlanFn,
    generateRoadmap: generateRoadmapFn,
    clearPlan,
    clearRoadmap,
    getSummary,
    getRoadmapSummaryFn,
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

/**
 * Fetch roadmap from edge function (for future use)
 */
export async function fetchEnglishRoadmap(
  input: RoadmapInput
): Promise<EnglishRoadmap> {
  // For now, generate locally
  // TODO: Replace with edge function call when needed
  return generateEnglishRoadmap(input);
}
