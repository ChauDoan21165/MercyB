import type { GuideTaskIntent } from './guideRoutingSpec';

export type GuideTutorApiRequest = {
  mode: 'guide_tutor';
  language: 'vi' | 'en';
  taskIntent: GuideTaskIntent;
  input: string;
  payload: string;
  roomContext?: {
    roomName?: string;
    roomLineEn?: string;
    roomLineVi?: string;
    topicLineEn?: string;
    topicLineVi?: string;
    goalLineEn?: string;
    goalLineVi?: string;
    levelLineEn?: string;
    levelLineVi?: string;
  };
  roomId?: string;
  roomTitle?: string;
  tier?: string;
  pathSlug?: string;
  tags?: string[];
  englishLevel?: string | null;
  learningGoal?: string | null;
};

export type GuideTutorApiResponse = {
  reply: string;
  suggestSpeak?: boolean;
  confidence?: number;
  taskIntent?: GuideTaskIntent;
};