declare module "@/types/placement-v3" {
  export type PlacementSkill =
    | "overall"
    | "grammar"
    | "vocabulary"
    | "pronunciation"
    | "listening"
    | "speaking"
    | "reading"
    | "writing";

  export type PlacementCefrLevel = "pre_a1" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

  export type L1InterferenceFlag =
    | string
    | {
        id?: string;
        patternId?: string;
        tag?: string;
        severity?: "low" | "medium" | "high" | "severe" | number;
      };

  export type CEFRAssessment = {
    overallCefr?: PlacementCefrLevel;
    overallCEFR?: PlacementCefrLevel;
    cefrLevel?: PlacementCefrLevel;
    level?: PlacementCefrLevel;
    skillCefr?: Partial<Record<PlacementSkill, PlacementCefrLevel>>;
    skillCEFR?: Partial<Record<PlacementSkill, PlacementCefrLevel>>;
    skillLevels?: Partial<Record<PlacementSkill, PlacementCefrLevel>>;
    gaps?: string[];
    l1InterferenceFlags?: L1InterferenceFlag[];
  };
}

