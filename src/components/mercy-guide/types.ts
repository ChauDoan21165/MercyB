// src/components/mercy-guide/types.ts

import type { CompanionProfile } from '@/services/companion';

export * from './tabs/grammar-writing/types';

export interface MercyGuideProps {
  roomId?: string;
  roomTitle?: string;
  tier?: string;
  pathSlug?: string;
  tags?: string[];
  contentEn?: string;
}

export type ExtendedCompanionProfile = CompanionProfile & {
  display_name?: string | null;
  first_name?: string | null;
  name?: string | null;
};

export type CheckInMessage = {
  en: string;
  vi: string;
};

export type PathHint = {
  en: string;
  vi: string;
};