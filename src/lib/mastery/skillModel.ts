import type {
  MasteryCatalog,
  MasteryItem,
  MasterySkill,
  MasterySkillDimension,
  MasteryTheme,
} from "./types";

export const DEFAULT_MASTERY_THEME_IDS = [
  "food",
  "family",
  "work",
  "travel",
  "shopping",
  "health",
  "phone",
  "introductions",
  "routine",
  "time",
  "home",
  "banking",
  "mail",
  "school",
  "social",
  "weather",
  "hobbies",
  "service",
  "childcare",
  "documents",
  "government",
  "emergencies",
] as const;

const SKILL_DIMENSIONS: readonly MasterySkillDimension[] = [
  "vocabulary",
  "grammar",
  "listening",
  "speaking",
];

const THEME_LABELS: Record<string, string> = {
  food: "Food ordering",
  family: "Family",
  work: "Work",
  travel: "Travel",
  shopping: "Shopping",
  health: "Health",
  phone: "Phone calls",
  introductions: "Introductions",
  routine: "Daily routine",
  time: "Time and appointments",
  home: "Home and repairs",
  banking: "Banking and bills",
  mail: "Mail and packages",
  school: "School",
  social: "Social plans",
  weather: "Weather and clothes",
  hobbies: "Exercise and hobbies",
  service: "Customer service",
  childcare: "Childcare",
  documents: "Documents and forms",
  government: "Government services",
  emergencies: "Emergencies",
};

export function buildDefaultMasteryCatalog(): MasteryCatalog {
  const themes = DEFAULT_MASTERY_THEME_IDS.map<MasteryTheme>((themeId, index) => ({
    id: themeId,
    label: THEME_LABELS[themeId] ?? themeId,
    defaultOrder: index + 1,
  }));

  const skills = themes.flatMap((theme) =>
    SKILL_DIMENSIONS.map<MasterySkill>((dimension, index) => ({
      id: skillIdFor(theme.id, dimension),
      themeId: theme.id,
      dimension,
      label: `${theme.label}: ${dimension}`,
      defaultOrder: theme.defaultOrder * 10 + index,
      difficultyBand: index < 2 ? "starter" : "core",
      prerequisites: index === 0 ? [] : [skillIdFor(theme.id, SKILL_DIMENSIONS[index - 1])],
    })),
  );

  const items = themes.flatMap((theme) =>
    SKILL_DIMENSIONS.map<MasteryItem>((dimension, index) => ({
      id: `${theme.id}-${dimension}-practice-1`,
      themeId: theme.id,
      skillIds: [skillIdFor(theme.id, dimension)],
      label: `${theme.label} ${dimension} practice`,
      defaultOrder: theme.defaultOrder * 10 + index,
      difficulty: index + 1,
      reviewable: true,
    })),
  );

  return { themes, skills, items };
}

export function normalizeMasteryCatalog(catalog: MasteryCatalog): MasteryCatalog {
  const themes = [...catalog.themes].sort((a, b) => a.defaultOrder - b.defaultOrder || a.id.localeCompare(b.id));
  const skills = [...catalog.skills].sort((a, b) => a.defaultOrder - b.defaultOrder || a.id.localeCompare(b.id));
  const items = [...catalog.items].sort((a, b) => a.defaultOrder - b.defaultOrder || a.id.localeCompare(b.id));
  return { themes, skills, items };
}

export function skillIdFor(themeId: string, dimension: MasterySkillDimension): string {
  return `${themeId}:${dimension}`;
}
